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
  { type: "rect", x: 150, y: 165, width: 190, height: 125 },
  { type: "rect", x: 675, y: 405, width: 180, height: 105 },
  { type: "circle", x: 105, y: 115, radius: 28 },
  { type: "circle", x: 155, y: 485, radius: 28 },
  { type: "circle", x: 410, y: 105, radius: 28 },
  { type: "circle", x: 790, y: 120, radius: 28 },
  { type: "circle", x: 875, y: 475, radius: 28 },
  { type: "circle", x: -330, y: 165, radius: 30 },
  { type: "circle", x: -170, y: 505, radius: 30 },
  { type: "circle", x: 1125, y: 120, radius: 30 },
  { type: "circle", x: 1290, y: 485, radius: 30 },
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
          this.linus.setTexture("linus-idle-b");
          this.time.delayedCall(260, () => this.linus?.setTexture("linus"));
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
        this.questMarker.setPosition(575, 184).setVisible(true).setAlpha(1);
        label.setText("?");
        return;
      }
      this.questMarker.setPosition(150, 72);
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
        this.questMarker.setPosition(575, 184).setVisible(true).setAlpha(1);
        label.setText("?");
        return;
      }
      this.questMarker.setPosition(150, 72);
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
      this.questMarker = this.add.container(575, 184, [shadow, bubble, inner, label])
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
      this.add.tileSprite((WORLD_MIN_X + WORLD_MAX_X) / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, "grass-tile").setDepth(0);
      this.placeWorldObjects([
        { x: -430, y: 170, texture: "wild-grass-bank", scale: 1.15, baseY: 205 },
        { x: -330, y: 197, texture: "tree-cluster", scale: 0.95, baseY: 205 },
        { x: -170, y: 537, texture: "tree-oak", scale: 1.05, baseY: 537 },
        { x: -72, y: 425, texture: "bush", scale: 0.82 },
        { x: -255, y: 350, texture: "flower-patch", scale: 0.78 },
        { x: -395, y: 520, texture: "grass-tuft", scale: 0.9 },
        { x: 1050, y: 540, texture: "wild-grass-bank", scale: 1.08, baseY: 600 },
        { x: 1125, y: 152, texture: "tree-cluster", scale: 0.92, baseY: 175 },
        { x: 1290, y: 517, texture: "tree-pine", scale: 1.08, baseY: 517 },
        { x: 1370, y: 230, texture: "bush", scale: 0.9 },
        { x: 1215, y: 335, texture: "flower-patch", scale: 0.78 },
        { x: 1350, y: 560, texture: "grass-tuft", scale: 0.86 },
      ]);
      this.placeWorldObjects([
        { x: 62, y: 164, texture: "tree-cluster", scale: 0.9, baseY: 192 },
        { x: 906, y: 164, texture: "tree-cluster", scale: 0.92, baseY: 194 },
        { x: 482, y: 128, texture: "tree-cluster", scale: 0.78, baseY: 154 },
        { x: 58, y: 540, texture: "wild-grass-bank", scale: 1.08, baseY: 600 },
        { x: 896, y: 542, texture: "wild-grass-bank", scale: 1.12, baseY: 606 },
      ]);
      this.add.image(155, 455, "road-segment").setAngle(-12).setDepth(20);
      this.add.image(390, 402, "road-segment").setAngle(-12).setDepth(20);
      this.add.image(625, 349, "road-segment").setAngle(-12).setDepth(20);
      this.add.image(842, 300, "road-bend").setAngle(-4).setDepth(20);
      this.add.image(244, 323, "footpath").setAngle(41).setDepth(19);
      this.drawHouse();
      this.drawFence(50, 270, 7);
      this.drawFence(820, 238, 6);
      this.drawQuestBoard();
      this.placeWorldObjects([
        { x: 282, y: 298, texture: "bench" },
        { x: 34, y: 400, texture: "crate", scale: 0.8 },
        { x: 925, y: 205, texture: "crate", scale: 0.65 },
        { x: 257, y: 266, texture: "mailbox", scale: 0.82 },
        { x: 78, y: 261, texture: "woodpile", scale: 0.72 },
        { x: 660, y: 300, texture: "signpost", scale: 0.78 },
        { x: 365, y: 337, texture: "lamp-post", scale: 0.72 },
        { x: 325, y: 190, texture: "bush", scale: 0.74 },
        { x: 720, y: 208, texture: "bush", scale: 0.82 },
        { x: 895, y: 392, texture: "bush", scale: 0.9 },
        { x: 118, y: 555, texture: "bush", scale: 0.86 },
        { x: 448, y: 269, texture: "well", scale: 0.82 },
        { x: 765, y: 234, texture: "stone-wall", scale: 0.9 },
        { x: 216, y: 214, texture: "stone-wall", scale: 0.56 },
        { x: 525, y: 214, texture: "bush", scale: 0.72 },
      ]);
      this.placeWorldObjects(OPENING_AMBIENT_OBJECTS);
      this.linus = this.add.image(575, 285, "linus").setOrigin(0.5, 0.9).setDepth(1285).setInteractive({ useHandCursor: true });
      this.linus.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (this.introComplete || !this.player) return;
        this.linusInteractionPending = true;
        this.path = findPath({ x: this.player.x, y: this.player.y }, { x: 525, y: 318 });
        const finalPoint = this.path.at(-1);
        if (finalPoint) this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
        else this.maybeCompleteLinusInteraction();
      });
      this.add.text(549, 236, "Linus", {
        color: "#4b3b2b", fontSize: "14px", fontStyle: "bold", fontFamily: "Trebuchet MS",
        backgroundColor: "#f7e9cce8", padding: { x: 8, y: 4 },
      }).setDepth(2900);
      this.add.ellipse(675, 415, 190, 75, 0x5e7e50, 0.09).setDepth(8);
      this.drawTree(105, 115, "tree-birch", 0.95);
      this.drawTree(155, 485, "tree-oak", 1.05);
      this.drawTree(410, 105, "tree-pine", 0.9);
      this.drawTree(790, 120, "tree-birch", 1);
      this.drawTree(875, 475, "tree-pine", 1.05);
      this.placeWorldObjects([
        { x: 310, y: 527, texture: "flower-patch", scale: 0.8 },
        { x: 347, y: 514, texture: "flower-patch", scale: 0.65 },
        { x: 623, y: 112, texture: "flower-patch", scale: 0.75 },
        { x: 718, y: 532, texture: "flower-patch", scale: 0.8 },
        { x: 529, y: 504, texture: "flower-patch", scale: 0.7 },
        { x: 255, y: 91, texture: "flower-patch", scale: 0.65 },
        { x: 445, y: 559, texture: "flower-patch", scale: 0.8 },
        { x: 744, y: 181, texture: "flower-patch", scale: 0.7 },
        { x: 903, y: 320, texture: "flower-patch", scale: 0.75 },
        { x: 208, y: 294, texture: "flower-patch", scale: 0.65 },
        { x: 805, y: 287, texture: "flower-patch", scale: 0.72 },
        { x: 365, y: 300, texture: "rock-cluster", scale: 0.72 },
        { x: 610, y: 475, texture: "rock-cluster", scale: 0.78 },
        { x: 695, y: 260, texture: "rock-cluster", scale: 0.65 },
        { x: 245, y: 455, texture: "rock-cluster", scale: 0.7 },
        { x: 840, y: 365, texture: "rock-cluster", scale: 0.75 },
        { x: 520, y: 126, texture: "rock-cluster", scale: 0.62 },
        { x: 90, y: 350, texture: "rock-cluster", scale: 0.65 },
        { x: 132, y: 340, texture: "grass-tuft", scale: 0.75 },
        { x: 192, y: 385, texture: "grass-tuft", scale: 0.65 },
        { x: 470, y: 182, texture: "grass-tuft", scale: 0.7 },
        { x: 575, y: 565, texture: "grass-tuft", scale: 0.8 },
        { x: 689, y: 190, texture: "grass-tuft", scale: 0.68 },
        { x: 854, y: 257, texture: "grass-tuft", scale: 0.72 },
        { x: 934, y: 520, texture: "grass-tuft", scale: 0.82 },
        { x: 220, y: 150, texture: "dirt-patch", scale: 0.62 },
        { x: 517, y: 438, texture: "dirt-patch", scale: 0.7 },
        { x: 736, y: 346, texture: "dirt-patch", scale: 0.58 },
        { x: 380, y: 590, texture: "dirt-patch", scale: 0.65 },
        { x: 90, y: 636, texture: "foreground-shrub", scale: 1.05, baseY: 635 },
        { x: 855, y: 638, texture: "foreground-shrub", scale: 1.15, baseY: 637 },
        { x: 510, y: 646, texture: "wild-grass-bank", scale: 1.18, baseY: 646 },
      ]);
      this.add.text(18, 18, "Sysselcraft · byn vaknar", {
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
