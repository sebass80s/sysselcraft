import type { GameObjects, Input, Types } from "phaser";
import {
  AMBIENT_TEXTURE_KEYS,
  FIRST_DELIVERY_AMBIENT_OBJECTS,
  OPENING_AMBIENT_OBJECTS,
} from "./worldDecor";

const VIEW_HEIGHT = 640;
const WORLD_MIN_X = -480;
const WORLD_MAX_X = 1440;
const WORLD_WIDTH = WORLD_MAX_X - WORLD_MIN_X;
const WORLD_HEIGHT = 640;
const GRID = 32;
const GRID_COLS = Math.ceil(WORLD_WIDTH / GRID);
const GRID_ROWS = Math.ceil(WORLD_HEIGHT / GRID);
const PLAYER_RADIUS = 14;

export type QuestState = "available" | "pending" | "approved";
export type VillageGameHandle = {
  destroy: () => void;
  setQuestState: (state: QuestState) => void;
  setIntroComplete: (complete: boolean) => void;
  setDogVisible: (visible: boolean) => void;
  setFirstDeliveryComplete: (complete: boolean) => void;
};

type Callbacks = { onQuestOpen: () => void; onLinusInteract: () => void };
type Point = { x: number; y: number };
type Facing = "north" | "south" | "east" | "west";
type Obstacle =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; x: number; y: number; radius: number };
type WorldObjectDefinition = {
  x: number;
  y: number;
  texture: string;
  scale?: number;
  originY?: number;
  baseY?: number;
};

const obstacles: Obstacle[] = [
  // Hero-slice collision map for the painted master scene. Gameplay footprints are
  // deliberately independent from the rendered image bounds.
  { type: "rect", x: 300, y: 242, width: 420, height: 150 }, // cottage
  { type: "rect", x: 650, y: 342, width: 250, height: 145 }, // board / bench / mailbox
  { type: "circle", x: 945, y: 365, radius: 82 }, // well
  { type: "circle", x: 815, y: 430, radius: 34 }, // lamp base
  { type: "circle", x: -205, y: 548, radius: 42 }, // village sign
  { type: "rect", x: 15, y: 430, width: 390, height: 72 }, // left stone wall
  { type: "rect", x: 1215, y: 320, width: 330, height: 80 }, // right stone wall
  { type: "circle", x: -270, y: 335, radius: 78 }, // left birches
  { type: "circle", x: 1230, y: 505, radius: 92 }, // foreground vegetation
];

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function isTextControlFocused() {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return false;
  return (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement ||
    active instanceof HTMLSelectElement ||
    active.isContentEditable
  );
}

function isWalkable(p: Point) {
  if (
    p.x < WORLD_MIN_X + PLAYER_RADIUS ||
    p.y < PLAYER_RADIUS ||
    p.x > WORLD_MAX_X - PLAYER_RADIUS ||
    p.y > WORLD_HEIGHT - PLAYER_RADIUS
  ) {
    return false;
  }
  return !obstacles.some((o) =>
    o.type === "rect"
      ? Math.abs(p.x - o.x) <= o.width / 2 + PLAYER_RADIUS &&
        Math.abs(p.y - o.y) <= o.height / 2 + PLAYER_RADIUS
      : distance(p, o) <= o.radius + PLAYER_RADIUS,
  );
}

function cellToPoint(cx: number, cy: number): Point {
  return { x: WORLD_MIN_X + cx * GRID + GRID / 2, y: cy * GRID + GRID / 2 };
}

function pointToCell(p: Point) {
  return {
    x: clamp(Math.floor((p.x - WORLD_MIN_X) / GRID), 0, GRID_COLS - 1),
    y: clamp(Math.floor(p.y / GRID), 0, GRID_ROWS - 1),
  };
}

function findNearestWalkableCell(point: Point) {
  const origin = pointToCell(point);
  for (let r = 0; r <= 8; r++) {
    for (let y = origin.y - r; y <= origin.y + r; y++) {
      for (let x = origin.x - r; x <= origin.x + r; x++) {
        if (
          x >= 0 && y >= 0 && x < GRID_COLS && y < GRID_ROWS &&
          isWalkable(cellToPoint(x, y))
        ) return { x, y };
      }
    }
  }
  return origin;
}

function findPath(startPoint: Point, endPoint: Point): Point[] {
  const start = findNearestWalkableCell(startPoint);
  const goal = findNearestWalkableCell(endPoint);
  const key = (x: number, y: number) => `${x},${y}`;
  const open = new Map<string, { x: number; y: number; g: number; f: number }>();
  const came = new Map<string, string>();
  const closed = new Set<string>();
  const h = (x: number, y: number) => Math.hypot(goal.x - x, goal.y - y);
  open.set(key(start.x, start.y), { ...start, g: 0, f: h(start.x, start.y) });
  const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  while (open.size) {
    const c = [...open.values()].reduce((best, next) => next.f < best.f ? next : best);
    const ck = key(c.x, c.y);
    open.delete(ck);
    if (c.x === goal.x && c.y === goal.y) {
      const cells = [{ x: c.x, y: c.y }];
      let cursor = ck;
      while (came.has(cursor)) {
        cursor = came.get(cursor)!;
        const [x, y] = cursor.split(",").map(Number);
        cells.push({ x, y });
      }
      return cells.reverse().slice(1).map((q) => cellToPoint(q.x, q.y));
    }
    closed.add(ck);
    for (const [dx, dy] of dirs) {
      const x = c.x + dx;
      const y = c.y + dy;
      const nk = key(x, y);
      if (
        closed.has(nk) || x < 0 || y < 0 || x >= GRID_COLS || y >= GRID_ROWS ||
        !isWalkable(cellToPoint(x, y))
      ) continue;
      if (dx && dy && (!isWalkable(cellToPoint(c.x + dx, c.y)) || !isWalkable(cellToPoint(c.x, c.y + dy)))) continue;
      const g = c.g + (dx && dy ? Math.SQRT2 : 1);
      const existing = open.get(nk);
      if (existing && g >= existing.g) continue;
      came.set(nk, ck);
      open.set(nk, { x, y, g, f: g + h(x, y) });
    }
  }
  return [];
}

export async function createVillageGame(
  parent: HTMLElement,
  callbacks: Callbacks,
): Promise<VillageGameHandle> {
  const Phaser = await import("phaser");
  let requestedQuestState: QuestState = "available";
  let requestedIntroComplete = false;
  let requestedDogVisible = false;
  let requestedFirstDeliveryComplete = false;

  const parentWidth = Math.max(parent.clientWidth, 1);
  const parentHeight = Math.max(parent.clientHeight, 1);
  const viewWidth = Math.min(WORLD_WIDTH, Math.max(960, Math.round(VIEW_HEIGHT * (parentWidth / parentHeight))));

  class VillageScene extends Phaser.Scene {
    private player?: GameObjects.Image;
    private dog?: GameObjects.Image;
    private path: Point[] = [];
    private cursors?: Types.Input.Keyboard.CursorKeys;
    private wasd?: Record<"up" | "down" | "left" | "right", Input.Keyboard.Key>;
    private targetMarker?: GameObjects.Arc;
    private questMarker?: GameObjects.Container;
    private linus?: GameObjects.Image;
    private materialStack?: GameObjects.Image;
    private approvedTriggered = false;
    private firstDeliveryComplete = false;
    private playerFacing: Facing = "south";
    private introComplete = false;
    private linusInteractionPending = false;

    constructor() {
      super("VillageScene");
    }

    preload() {
      this.load.image("family-house", "/assets/village/reboot/family-house.webp");
      this.load.image("child-painted", "/assets/village/reboot/child.webp");
      this.load.image("master-scene", "/assets/village/reboot/sysselcraft-hero-master.webp");
      this.load.image("linus-painted", "/assets/village/reboot/linus-painted.png");
      for (const key of [
        "tree-oak", "tree-birch", "tree-pine", "linus", "linus-idle-b",
        "dog-puppy", "truck", "material-stack", "road-segment", "road-bend",
        "footpath", "grass-tile", "grass-tuft", "dirt-patch", "bush",
        "fence-segment", "quest-board", "bench", "crate", "flower-patch",
        "rock-cluster", "signpost", "lamp-post", "woodpile", "mailbox", "well",
        "stone-wall", "foreground-shrub", "tree-cluster", "wild-grass-bank",
        "construction-stakes", ...AMBIENT_TEXTURE_KEYS,
      ]) {
        this.load.svg(key, `/assets/village/${key}.svg`);
      }
    }

    create() {
      const camera = this.cameras.main;
      camera.setBackgroundColor("#789a68");
      camera.setBounds(WORLD_MIN_X, 0, WORLD_WIDTH, WORLD_HEIGHT);
      this.drawVillage();
      this.player = this.add.image(430, 405, "child-painted")
        .setOrigin(0.5, 0.94)
        .setDisplaySize(74, 118)
        .setDepth(1405);
      this.dog = this.add.image(548, 303, "dog-puppy")
        .setOrigin(0.5, 0.88)
        .setDepth(1303)
        .setVisible(requestedDogVisible);
      this.targetMarker = this.add.circle(430, 405, 7, 0xf4d780, 0.32)
        .setStrokeStyle(2, 0x6a754e, 0.55)
        .setVisible(false)
        .setDepth(900);
      camera.centerOn(this.player.x, this.player.y);
      camera.startFollow(this.player, true, 0.08, 0.08);
      camera.setDeadzone(Math.min(340, viewWidth * 0.32), 180);
      this.createQuestMarker();
      this.setFirstDeliveryComplete(requestedFirstDeliveryComplete);
      this.setIntroComplete(requestedIntroComplete);
      this.applyQuestState(requestedQuestState);
      this.time.addEvent({
        delay: 1800,
        loop: true,
        callback: () => {
          if (!this.linus) return;
        },
      });
      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({ up: "W", down: "S", left: "A", right: "D" }) as Record<"up" | "down" | "left" | "right", Input.Keyboard.Key>;
      }
      this.input.on("pointerdown", (pointer: Input.Pointer) => {
        if (!this.player) return;
        this.linusInteractionPending = false;
        this.path = findPath({ x: this.player.x, y: this.player.y }, { x: pointer.worldX, y: pointer.worldY });
        const finalPoint = this.path.at(-1);
        if (finalPoint) this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
      });
    }

    setIntroComplete(complete: boolean) {
      requestedIntroComplete = complete;
      this.introComplete = complete;
      if (!this.questMarker) return;
      const label = this.questMarker.getByName("label") as GameObjects.Text;
      if (!complete) {
        this.questMarker.setPosition(720, 335).setVisible(true).setAlpha(1);
        label.setText("?");
        return;
      }
      this.questMarker.setPosition(300, 82);
      this.applyQuestState(requestedQuestState);
    }

    setDogVisible(visible: boolean) {
      requestedDogVisible = visible;
      this.dog?.setVisible(visible);
    }

    setFirstDeliveryComplete(complete: boolean) {
      requestedFirstDeliveryComplete = complete;
      this.firstDeliveryComplete = complete;
      if (complete) {
        this.approvedTriggered = true;
        this.ensureMaterialStack();
      }
    }

    applyQuestState(state: QuestState) {
      requestedQuestState = state;
      if (!this.questMarker) return;
      const label = this.questMarker.getByName("label") as GameObjects.Text;
      if (!this.introComplete) {
        this.questMarker.setPosition(720, 335).setVisible(true).setAlpha(1);
        label.setText("?");
        return;
      }
      this.questMarker.setPosition(300, 82);
      if (state === "available") {
        this.questMarker.setVisible(true).setAlpha(1);
        label.setText("!");
      } else if (state === "pending") {
        this.questMarker.setVisible(true).setAlpha(0.72);
        label.setText("…");
      } else {
        this.questMarker.setVisible(false);
        if (this.firstDeliveryComplete) this.ensureMaterialStack();
        else this.triggerApprovalEvent();
      }
    }

    update(_: number, delta: number) {
      if (!this.player) return;
      this.player.setDepth(1000 + Math.round(this.player.y));
      this.updateDog();
      if (isTextControlFocused()) {
        this.linusInteractionPending = false;
        this.path = [];
        this.targetMarker?.setVisible(false);
        return;
      }
      const v = this.getKeyboardVector();
      if (v.lengthSq() > 0) {
        this.linusInteractionPending = false;
        this.path = [];
        this.targetMarker?.setVisible(false);
        v.normalize();
        this.setFacing(v.x, v.y);
        v.scale(190 * (delta / 1000));
        this.tryMove(v.x, v.y);
        return;
      }
      const next = this.path[0];
      if (!next) {
        this.maybeCompleteLinusInteraction();
        return;
      }
      const current = { x: this.player.x, y: this.player.y };
      const remaining = distance(current, next);
      if (remaining < 4) {
        this.path.shift();
        if (!this.path.length) this.targetMarker?.setVisible(false);
        this.maybeCompleteLinusInteraction();
        return;
      }
      const speed = Math.min(180 * (delta / 1000), remaining);
      const angle = Math.atan2(next.y - current.y, next.x - current.x);
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      this.setFacing(dx, dy);
      this.tryMove(dx * speed, dy * speed);
    }

    private setFacing(dx: number, dy: number) {
      if (!this.player) return;
      if (Math.abs(dx) > 0.18 || Math.abs(dy) > 0.18) {
        this.playerFacing = Math.abs(dx) > Math.abs(dy)
          ? dx < 0 ? "west" : "east"
          : dy < 0 ? "north" : "south";
      }
      this.player.setFlipX(this.playerFacing === "west");
    }

    private updateDog() {
      if (!this.player || !this.dog || !this.dog.visible) return;
      const offsets: Record<Facing, Point> = {
        north: { x: 28, y: 36 }, south: { x: -28, y: -28 },
        east: { x: -38, y: 10 }, west: { x: 38, y: 10 },
      };
      const offset = offsets[this.playerFacing];
      this.dog.x = Phaser.Math.Linear(this.dog.x, this.player.x + offset.x, 0.055);
      this.dog.y = Phaser.Math.Linear(this.dog.y, this.player.y + offset.y, 0.055);
      this.dog.setFlipX(this.dog.x > this.player.x);
      this.dog.setDepth(1000 + Math.round(this.dog.y));
    }

    private maybeCompleteLinusInteraction() {
      if (!this.linusInteractionPending || !this.player || !this.linus) return;
      if (distance(this.player, this.linus) > 95) return;
      this.linusInteractionPending = false;
      this.playerFacing = this.player.x < this.linus.x ? "east" : "west";
      this.setFacing(this.playerFacing === "east" ? 1 : -1, 0);
      callbacks.onLinusInteract();
    }

    private worldImage(
      x: number,
      y: number,
      key: string,
      scale = 1,
      originY = 1,
      baseY = y,
    ) {
      return this.add.image(x, y, key)
        .setOrigin(0.5, originY)
        .setScale(scale)
        .setDepth(1000 + Math.round(baseY));
    }

    private placeWorldObjects(objects: WorldObjectDefinition[]) {
      objects.forEach(({ x, y, texture, scale = 1, originY = 1, baseY = y }) =>
        this.worldImage(x, y, texture, scale, originY, baseY),
      );
    }

    private drawTree(x: number, y: number, key = "tree-oak", scale = 1) {
      this.worldImage(x, y + 32, key, scale);
    }

    private drawHouse() {
      this.add.image(150, 250, "family-house")
        .setOrigin(0.5, 1)
        .setDisplaySize(360, 300)
        .setDepth(1250);
    }

    private drawFence(x: number, y: number, count: number) {
      this.add.image(x + count * 10, y, "fence-segment")
        .setDisplaySize(count * 20, 48)
        .setDepth(1000 + y);
    }

    private drawQuestBoard() {
      this.worldImage(315, 267, "quest-board");
    }

    private createQuestMarker() {
      const shadow = this.add.ellipse(3, 7, 43, 18, 0x3c4d34, 0.2);
      const bubble = this.add.circle(0, 0, 21, 0xf2c95d, 1).setStrokeStyle(2, 0xffe9a0, 0.95);
      const inner = this.add.circle(-5, -6, 12, 0xffdf79, 0.65);
      const label = this.add.text(0, -1, "?", {
        color: "#5b4425", fontSize: "27px", fontStyle: "bold", fontFamily: "Trebuchet MS",
      }).setOrigin(0.5).setName("label");
      this.questMarker = this.add.container(720, 335, [shadow, bubble, inner, label])
        .setDepth(3000).setSize(52, 52).setInteractive({ useHandCursor: true });
      this.questMarker.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (this.introComplete) callbacks.onQuestOpen();
        else callbacks.onLinusInteract();
      });
      this.tweens.add({ targets: this.questMarker, y: "-=5", duration: 850, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    }

    private ensureMaterialStack() {
      if (this.materialStack?.active) return;
      this.materialStack = this.worldImage(760, 458, "material-stack", 1);
      this.placeWorldObjects(FIRST_DELIVERY_AMBIENT_OBJECTS);
    }

    private triggerApprovalEvent() {
      if (this.approvedTriggered) return;
      this.approvedTriggered = true;
      const truck = this.add.image(1030, 350, "truck").setOrigin(0.5, 1).setDepth(1350);
      this.tweens.add({
        targets: truck, x: 785, y: 365, duration: 1700, ease: "Sine.Out",
        onUpdate: () => truck.setDepth(1000 + Math.round(truck.y)),
        onComplete: () => {
          this.firstDeliveryComplete = true;
          requestedFirstDeliveryComplete = true;
          this.ensureMaterialStack();
          this.tweens.add({ targets: this.linus, y: "-=10", duration: 180, yoyo: true, repeat: 3 });
          this.time.delayedCall(900, () => this.tweens.add({
            targets: truck, x: 1030, y: 350, duration: 1500, ease: "Sine.In",
            onUpdate: () => truck.setDepth(1000 + Math.round(truck.y)),
            onComplete: () => truck.destroy(),
          }));
        },
      });
    }

    private getKeyboardVector() {
      const v = new Phaser.Math.Vector2();
      if (this.cursors?.up.isDown || this.wasd?.up.isDown) v.y--;
      if (this.cursors?.down.isDown || this.wasd?.down.isDown) v.y++;
      if (this.cursors?.left.isDown || this.wasd?.left.isDown) v.x--;
      if (this.cursors?.right.isDown || this.wasd?.right.isDown) v.x++;
      return v;
    }

    private tryMove(dx: number, dy: number) {
      if (!this.player) return;
      const nx = { x: this.player.x + dx, y: this.player.y };
      if (isWalkable(nx)) this.player.x = nx.x;
      const ny = { x: this.player.x, y: this.player.y + dy };
      if (isWalkable(ny)) this.player.y = ny.y;
    }

    private drawVillage() {
      // Painted master scene is the visual authority for static scenery in this experiment.
      this.add.image(
        (WORLD_MIN_X + WORLD_MAX_X) / 2,
        WORLD_HEIGHT / 2,
        "master-scene",
      ).setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT).setDepth(0);

      // Reuse the painted master itself as a masked foreground layer. The duplicated
      // pixels remain visually seamless; only these masks participate in occlusion.
      // Depth 1400 makes actors above y=400 pass behind the board cluster, while actors
      // lower on the path naturally render in front via the existing Y-depth rule.
      const foreground = this.add.image(
        (WORLD_MIN_X + WORLD_MAX_X) / 2,
        WORLD_HEIGHT / 2,
        "master-scene",
      ).setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT).setDepth(1400);
      const foregroundMask = this.make.graphics({ x: 0, y: 0, add: false });
      foregroundMask.fillStyle(0xffffff);
      const maskPolygons: Point[][] = [
        // Notice board.
        [{x:550,y:210},{x:605,y:185},{x:710,y:190},{x:755,y:220},{x:748,y:335},{x:725,y:345},{x:725,y:365},{x:698,y:365},{x:698,y:345},{x:582,y:345},{x:582,y:365},{x:558,y:365},{x:558,y:338},{x:546,y:330}],
        // Mailbox and post.
        [{x:505,y:292},{x:520,y:278},{x:556,y:280},{x:573,y:294},{x:571,y:352},{x:563,y:360},{x:563,y:398},{x:545,y:398},{x:545,y:361},{x:510,y:358}],
        // Bench.
        [{x:538,y:340},{x:718,y:340},{x:730,y:355},{x:724,y:375},{x:706,y:379},{x:712,y:419},{x:688,y:423},{x:682,y:386},{x:572,y:389},{x:565,y:423},{x:541,y:420},{x:548,y:383},{x:535,y:373}],
        // Flower tub beside the board.
        [{x:702,y:322},{x:745,y:318},{x:780,y:335},{x:788,y:374},{x:775,y:406},{x:743,y:411},{x:715,y:398},{x:703,y:367}],
      ];
      for (const polygon of maskPolygons) {
        foregroundMask.beginPath();
        foregroundMask.moveTo(polygon[0].x, polygon[0].y);
        polygon.slice(1).forEach((point) => foregroundMask.lineTo(point.x, point.y));
        foregroundMask.closePath();
        foregroundMask.fillPath();
      }
      foreground.setMask(foregroundMask.createGeometryMask());

      // Linus stays dynamic so onboarding remains testable.
      this.linus = this.add.image(720, 450, "linus-painted")
        .setOrigin(0.5, 0.96)
        .setDisplaySize(128, 125)
        .setDepth(1450)
        .setInteractive({ useHandCursor: true });
      this.linus.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (this.introComplete || !this.player) return;
        this.linusInteractionPending = true;
        this.path = findPath({ x: this.player.x, y: this.player.y }, { x: 650, y: 485 });
        const finalPoint = this.path.at(-1);
        if (finalPoint) this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
        else this.maybeCompleteLinusInteraction();
      });

      this.add.text(18, 18, "Sysselcraft · master-scene experiment", {
        color: "#4b3a29", fontSize: "14px", fontStyle: "bold", fontFamily: "Trebuchet MS",
        backgroundColor: "#f5e5cbd9", padding: { x: 10, y: 7 },
      }).setDepth(3000).setScrollFactor(0);
    }
  }

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: viewWidth,
    height: VIEW_HEIGHT,
    backgroundColor: "#789a68",
    pixelArt: false,
    antialias: true,
    roundPixels: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: viewWidth,
      height: VIEW_HEIGHT,
    },
    scene: VillageScene,
  });

  return {
    destroy: () => game.destroy(true),
    setQuestState: (state: QuestState) => {
      requestedQuestState = state;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).applyQuestState(state);
      }
    },
    setIntroComplete: (complete: boolean) => {
      requestedIntroComplete = complete;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setIntroComplete(complete);
      }
    },
    setDogVisible: (visible: boolean) => {
      requestedDogVisible = visible;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setDogVisible(visible);
      }
    },
    setFirstDeliveryComplete: (complete: boolean) => {
      requestedFirstDeliveryComplete = complete;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setFirstDeliveryComplete(complete);
      }
    },
  };
}
