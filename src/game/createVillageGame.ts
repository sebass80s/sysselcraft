import type { ConstructionPresentation } from "./constructionPresentation";
import type { GameObjects, Input, Types } from "phaser";
import {
  AMBIENT_TEXTURE_KEYS,
} from "./worldDecor";

import { VIEW_HEIGHT, WORLD_MIN_X, WORLD_MAX_X, WORLD_WIDTH, WORLD_HEIGHT,
  REQUIRED_APPROACHES, STATIC_OBSTACLES, findPath, isWalkable, nearestWalkablePoint, type Point, type Obstacle } from "./villageNavigation";
import { preloadVisualProductionBuildings, createVisualProductionBuildings } from "./visualProductionRuntime";
import { getVisualProductionObstacles, type VisualProductionBuilding, type VisualProductionStage } from "./visualProductionAssets";

export type SolTourStop = "bakery" | "shop" | "linus" | "decision" | null;
export type VillageGameHandle = {
  destroy: () => void;
  setConstruction: (presentation: ConstructionPresentation) => void;
  setConstructionDialogueOpen: (open: boolean) => void;
  setIntroComplete: (complete: boolean) => void;
  setDogVisible: (visible: boolean) => void;
  setHenningVisible: (visible: boolean) => void;
  setSolVisible: (visible: boolean) => void;
  setSolTourStop: (stop: SolTourStop) => void;
  setShopOpen: (open: boolean) => void;
  setBottleMessageReady: (ready: boolean) => void;
  setQuestSourceAttention: (source: "noticeboard" | "home" | "linus" | "bakery", marker: "?" | "!" | null) => void;
  presentConstructionReveal: (id: string, commit: () => Promise<void>) => Promise<void>;
};
type Callbacks = {
  onQuestSourceInteract?: (source: "noticeboard" | "home" | "linus" | "bakery") => void;
  onLinusInteract: () => void;
  onHenningInteract: () => void;
  onShopInteract: () => void;
  onAbandonedShopInteract: () => void;
  onBottleMessageInteract: () => void;
  onSolInteract: () => void;
  onConstructionInteract: (id: string) => void;
};
type Facing = "north" | "south" | "east" | "west";
type WorldObjectDefinition = {
  x: number;
  y: number;
  texture: string;
  scale?: number;
  originY?: number;
  baseY?: number;
};

// Painted master-scene board footprint is centered at world x=175, y=366.
// Keep the marker over the board and approach from the path below it.
const NOTICEBOARD_MARKER: Point = { x: 175, y: 270 };
const NOTICEBOARD_APPROACH: Point = { x: 175, y: 430 };
// Family house is rendered at x=150 with a 360x300 footprint. The front door sits
// on the lower-right face of the painted house, so the quest marker belongs here.
const HOME_QUEST_MARKER: Point = { x: 245, y: 338 };

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
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

export async function createVillageGame(
  parent: HTMLElement,
  callbacks: Callbacks,
): Promise<VillageGameHandle> {
  const Phaser = await import("phaser");
  let requestedConstruction: ConstructionPresentation = { stages: {}, attention: null };
  let constructionDialogueOpen = false;
  let requestedIntroComplete = false;
  let requestedDogVisible = false;
  let requestedHenningVisible = false;
  let requestedSolVisible = false;
  let requestedSolTourStop: SolTourStop = null;
  let requestedShopOpen = false;
  let requestedBottleMessageReady = false;
  const requestedQuestSourceAttention: Record<"noticeboard" | "home" | "linus" | "bakery", "?" | "!" | null> = { noticeboard: null, home: null, linus: null, bakery: null };

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
    private homeQuestMarker?: GameObjects.Container;
    private noticeboardMarker?: GameObjects.Container;
    private backendHomeAttention = false;
    private backendLinusAttention = false;
    private backendBakeryAttention = false;
    private henningQuestMarker?: GameObjects.Container;
    private linusQuestMarker?: GameObjects.Container;
    private linusStoryMarker?: GameObjects.Container;
    private noticeboardInteractionPending = false;
    private linus?: GameObjects.Image;
    private henning?: GameObjects.Image;
    private sol?: GameObjects.Image;
    private solTourMarker?: GameObjects.Text;
    private solInteractionPending = false;
    private henningInteractionPending = false;
    private shop?: GameObjects.Image;
    private mira?: GameObjects.Image;
    private shopInteractionPending = false;
    private bottleMessageMarker?: GameObjects.Text;
    private bottleMessageInteractionPending = false;
    private attentionMarker?: GameObjects.Container;
    private attentionInteractionPending = false;
    private residents: Record<string, GameObjects.Image> = {};
    private renderedBuildingStages = "";
    private productionBuildings: GameObjects.Image[] = [];
    private navigationObstacles: Obstacle[] = [...STATIC_OBSTACLES, { type: "rect", x: 1130, y: 355, width: 205, height: 72 }];
    private activeRevealId: string | null = null;
    private playerFacing: Facing = "south";
    private introComplete = false;
    private linusInteractionPending = false;

    constructor() {
      super("VillageScene");
    }

    preload() {
      preloadVisualProductionBuildings(this);
      this.load.image("family-house", "/assets/village/reboot/family-house.webp");
      this.load.image("child-painted", "/assets/village/reboot/child.webp");
      this.load.image("master-scene", "/assets/village/reboot/start-area-master-1920x640.webp");
      this.load.image("linus-painted", "/assets/village/reboot/linus-painted.png");
      this.load.image("puppy-painted", "/assets/village/reboot/puppy-painted.png");
      this.load.image("henning-painted", "/assets/village/reboot/henning-npc.png");
      this.load.image("mira-painted", "/assets/village/reboot/mira-runtime.png");
      this.load.image("sol-painted", "/assets/village/reboot/sol-runtime.png");
      this.load.image("shop-abandoned", "/assets/village/buildings/shop/lanthandel-abandoned.webp");
      this.load.image("shop-open", "/assets/village/buildings/shop/lanthandel-open.webp");
      this.load.image("truck-painted", "/assets/village/reboot/truck-runtime.png");
      this.load.image("materials-painted", "/assets/village/reboot/materials-runtime.png");
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
      this.player = this.add.image(REQUIRED_APPROACHES.spawn.x, REQUIRED_APPROACHES.spawn.y, "child-painted")
        .setOrigin(0.5, 0.94)
        .setDisplaySize(74, 118)
        .setDepth(1000 + REQUIRED_APPROACHES.spawn.y);
      this.dog = this.add.image(48, 427, "puppy-painted")
        .setOrigin(0.5, 0.88)
        .setDisplaySize(66, 55)
        .setDepth(1427)
        .setVisible(requestedDogVisible);
      this.targetMarker = this.add.circle(REQUIRED_APPROACHES.spawn.x, REQUIRED_APPROACHES.spawn.y, 7, 0xf4d780, 0.32)
        .setStrokeStyle(2, 0x6a754e, 0.55)
        .setVisible(false)
        .setDepth(900);
      camera.centerOn(this.player.x, this.player.y);
      camera.startFollow(this.player, true, 0.08, 0.08);
      camera.setDeadzone(Math.min(340, viewWidth * 0.32), 180);
      this.createQuestMarker();
      this.createNoticeboardMarker();
      this.setQuestSourceAttention("noticeboard", requestedQuestSourceAttention.noticeboard);
      this.setQuestSourceAttention("home", requestedQuestSourceAttention.home);
      this.setQuestSourceAttention("linus", requestedQuestSourceAttention.linus);
      this.setQuestSourceAttention("bakery", requestedQuestSourceAttention.bakery);
      this.setIntroComplete(requestedIntroComplete);
      this.setConstruction(requestedConstruction);
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
        // Resolve NPC taps at scene level too. This avoids depending on Phaser's
        // object-level pointer event ordering in the native iOS WebView.
        if (this.linus && this.linus.getBounds().contains(pointer.worldX, pointer.worldY)) {
          if (requestedConstruction.attention?.resident === "linus") {
            this.approachAttentionResident();
            return;
          }
          if (this.introComplete && !this.backendLinusAttention) {
            callbacks.onLinusInteract();
            return;
          }
          this.linusInteractionPending = true;
          this.path = findPath({ x: this.player.x, y: this.player.y }, REQUIRED_APPROACHES.linus, this.navigationObstacles);
          const target = this.path.at(-1);
          if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
          else this.maybeCompleteWorldInteraction();
          return;
        }
        if (this.shop?.visible && this.shop.getBounds().contains(pointer.worldX, pointer.worldY)) {
          this.shopInteractionPending = true;
          this.linusInteractionPending = false;
          this.henningInteractionPending = false;
          this.attentionInteractionPending = false;
          this.noticeboardInteractionPending = false;
          this.path = findPath({ x: this.player.x, y: this.player.y }, { x: 1130, y: 425 }, this.navigationObstacles);
          const target = this.path.at(-1);
          if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
          else this.maybeCompleteWorldInteraction();
          return;
        }
        if (this.henning?.visible && this.henning.getBounds().contains(pointer.worldX, pointer.worldY)) {
          if (requestedConstruction.attention?.resident === "henning") {
            this.approachAttentionResident();
            return;
          }
          if (this.backendBakeryAttention) {
            callbacks.onQuestSourceInteract?.("bakery");
            return;
          }
          this.henningInteractionPending = true;
          this.path = findPath({ x: this.player.x, y: this.player.y }, { x: 370, y: 468 }, this.navigationObstacles);
          const target = this.path.at(-1);
          if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
          else this.maybeCompleteWorldInteraction();
          return;
        }
        this.linusInteractionPending = false;
        this.henningInteractionPending = false;
        this.shopInteractionPending = false;
        this.attentionInteractionPending = false;
        this.noticeboardInteractionPending = false;
        this.path = findPath({ x: this.player.x, y: this.player.y }, { x: pointer.worldX, y: pointer.worldY }, this.navigationObstacles);
        const finalPoint = this.path.at(-1);
        if (finalPoint) this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
      });
    }

    setIntroComplete(complete: boolean) {
      requestedIntroComplete = complete;
      this.introComplete = complete;
      this.syncLinusStoryMarker();
    }

    private syncLinusStoryMarker() {
      this.linusStoryMarker?.destroy();
      this.linusStoryMarker = undefined;
      if (this.introComplete || !this.linus) return;

      const bubble = this.add.graphics();
      bubble.fillStyle(0xfffbef, 0.98);
      bubble.lineStyle(3, 0x5b3a1f, 1);
      bubble.fillRoundedRect(-29, -21, 58, 42, 14);
      bubble.strokeRoundedRect(-29, -21, 58, 42, 14);
      bubble.fillTriangle(-10, 18, -2, 18, -10, 29);
      const dots = this.add.text(0, -5, "•••", {
        color: "#5b3a1f", fontSize: "22px", fontStyle: "bold",
      }).setOrigin(0.5);

      this.linusStoryMarker = this.add.container(this.linus.x, this.linus.y - 155, [bubble, dots])
        .setDepth(3000).setSize(76, 72).setInteractive({ useHandCursor: true });
      this.linusStoryMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.player || constructionDialogueOpen) return;
        this.linusInteractionPending = true;
        this.path = findPath(this.player, REQUIRED_APPROACHES.linus, this.navigationObstacles);
        const target = this.path.at(-1);
        if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });
      this.tweens.add({
        targets: this.linusStoryMarker, y: "-=3", duration: 1000,
        yoyo: true, repeat: -1, ease: "Sine.InOut",
      });
    }

    setDogVisible(visible: boolean) {
      requestedDogVisible = visible;
      this.dog?.setVisible(visible);
    }

    setHenningVisible(visible: boolean) {
      requestedHenningVisible = visible;
      this.henning?.setVisible(visible);
    }

    setSolVisible(visible: boolean) {
      requestedSolVisible = visible;
      this.sol?.setVisible(visible);
    }

    update(_: number, delta: number) {
      if (!this.player || constructionDialogueOpen) return;
      this.updateDog();
      if (isTextControlFocused()) {
        this.attentionInteractionPending = false;
        this.linusInteractionPending = false;
        this.noticeboardInteractionPending = false;
        this.path = [];
        this.targetMarker?.setVisible(false);
        return;
      }
      const v = this.getKeyboardVector();
      if (v.lengthSq() > 0) {
        this.attentionInteractionPending = false;
        this.linusInteractionPending = false;
        this.noticeboardInteractionPending = false;
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
        this.maybeCompleteWorldInteraction();
        return;
      }
      const current = { x: this.player.x, y: this.player.y };
      const remaining = distance(current, next);
      if (remaining < 4) {
        this.path.shift();
        if (!this.path.length) this.targetMarker?.setVisible(false);
        this.maybeCompleteWorldInteraction();
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

    private maybeCompleteWorldInteraction() {
      if (this.noticeboardInteractionPending && this.player) {
        if (!requestedQuestSourceAttention.noticeboard) {
          this.noticeboardInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
          return;
        }
        const approach = NOTICEBOARD_APPROACH;
        if (distance(this.player, approach) <= 36) {
          this.noticeboardInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
          callbacks.onQuestSourceInteract?.("noticeboard");
          return;
        }
      }

      const attention = requestedConstruction.attention;
      if (this.attentionInteractionPending && attention && this.player) {
        if (distance(this.player, attention.approach) > 32) return;
        this.attentionInteractionPending = false;
        this.path = [];
        this.targetMarker?.setVisible(false);
        constructionDialogueOpen = true;
        callbacks.onConstructionInteract(attention.id);
        return;
      }

      if (this.bottleMessageInteractionPending && this.player && requestedBottleMessageReady) {
        if (distance(this.player, { x: 835, y: 500 }) > 38) return;
        this.bottleMessageInteractionPending = false;
        this.path = [];
        this.targetMarker?.setVisible(false);
        callbacks.onBottleMessageInteract();
        return;
      }

      if (this.solInteractionPending && this.player && this.sol?.visible) {
        if (distance(this.player, this.sol) > 95) return;
        this.solInteractionPending = false;
        this.path = [];
        this.targetMarker?.setVisible(false);
        callbacks.onSolInteract();
        return;
      }

      if (this.shopInteractionPending && this.player && this.shop?.visible) {
        const shopApproach = { x: 1130, y: 425 };
        const miraApproach = { x: 1050, y: 445 };
        const interactionDistance = requestedShopOpen
          ? Math.min(distance(this.player, shopApproach), distance(this.player, miraApproach))
          : distance(this.player, shopApproach);
        if (interactionDistance > 42) return;
        this.shopInteractionPending = false;
        this.path = [];
        this.targetMarker?.setVisible(false);
        if (requestedShopOpen) callbacks.onShopInteract();
        else callbacks.onAbandonedShopInteract();
        return;
      }

      if (this.henningInteractionPending && this.player && this.henning?.visible) {
        if (distance(this.player, this.henning) > 95) return;
        this.henningInteractionPending = false;
        this.playerFacing = this.player.x < this.henning.x ? "east" : "west";
        this.setFacing(this.playerFacing === "east" ? 1 : -1, 0);
        callbacks.onHenningInteract();
        return;
      }

      if (!this.linusInteractionPending || !this.player || !this.linus) return;
      // Quest-source navigation can stop at the authored approach point, which is
      // intentionally a little farther from Linus than the generic NPC radius.
      // Treat reaching that point as arrival instead of leaving the interaction stuck.
      const linusApproachReached = distance(this.player, REQUIRED_APPROACHES.linus) <= 18;
      if (distance(this.player, this.linus) > 95 && !linusApproachReached) return;
      this.linusInteractionPending = false;
      this.playerFacing = this.player.x < this.linus.x ? "east" : "west";
      this.setFacing(this.playerFacing === "east" ? 1 : -1, 0);
      if (this.introComplete && this.backendLinusAttention) callbacks.onQuestSourceInteract?.("linus");
      else callbacks.onLinusInteract();
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

    private drawShop() {
      // The same physical landmark exists from day one. Mira's completed arrival
      // beat swaps only its presentation from ruined to restored/open.
      this.shop = this.add.image(1130, 355, requestedShopOpen ? "shop-open" : "shop-abandoned")
        .setOrigin(0.5, 0.92)
        .setDisplaySize(330, 272)
        .setDepth(1355)
        .setInteractive({ useHandCursor: true, pixelPerfect: false });
      this.shop.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.player || constructionDialogueOpen) return;
        this.shopInteractionPending = true;
        this.linusInteractionPending = false;
        this.henningInteractionPending = false;
        this.attentionInteractionPending = false;
        this.noticeboardInteractionPending = false;
        this.path = findPath(this.player, { x: 1130, y: 425 }, this.navigationObstacles);
        const target = this.path.at(-1);
        if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });
    }

    setShopOpen(open: boolean) {
      requestedShopOpen = open;
      if (!this.shop) return;
      this.shop.setTexture(open ? "shop-open" : "shop-abandoned");
      this.mira?.setVisible(open);
      if (!open) this.shopInteractionPending = false;
    }

    setSolTourStop(stop: SolTourStop) {
      requestedSolTourStop = stop;
      this.solTourMarker?.destroy();
      this.solTourMarker = undefined;
      if (!stop) return;
      const target = stop === "bakery" ? this.henning : stop === "shop" ? this.mira : stop === "decision" ? this.sol : this.linus;
      if (!target || !target.visible) return;
      this.solTourMarker = this.add.text(target.x, target.y - 145, "☀️", {
        fontSize: "28px", backgroundColor: "#fff2cf", padding: { x: 8, y: 5 },
      }).setOrigin(0.5).setDepth(3100).setInteractive({ useHandCursor: true });
      this.solTourMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.player || constructionDialogueOpen || requestedSolTourStop !== stop) return;
        if (stop === "shop") {
          this.shopInteractionPending = true;
          this.path = findPath(this.player, { x: 1130, y: 425 }, this.navigationObstacles);
        } else if (stop === "bakery") {
          this.henningInteractionPending = true;
          if (!this.henning) return;
          this.path = findPath(this.player, { x: this.henning.x, y: this.henning.y + 55 }, this.navigationObstacles);
        } else if (stop === "linus") {
          this.linusInteractionPending = true;
          this.path = findPath(this.player, REQUIRED_APPROACHES.linus, this.navigationObstacles);
        } else {
          this.solInteractionPending = true;
          if (!this.sol) return;
          this.path = findPath(this.player, { x: this.sol.x, y: this.sol.y + 55 }, this.navigationObstacles);
        }
        const targetPoint = this.path.at(-1);
        if (targetPoint) this.targetMarker?.setPosition(targetPoint.x, targetPoint.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });
      this.tweens.add({ targets: this.solTourMarker, y: "-=5", duration: 900, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    }

    setBottleMessageReady(ready: boolean) {
      requestedBottleMessageReady = ready;
      this.bottleMessageMarker?.setVisible(ready);
      if (!ready) this.bottleMessageInteractionPending = false;
    }

    private drawBottleMessageMarker() {
      this.bottleMessageMarker = this.add.text(835, 500, "🍾", {
        fontSize: "34px",
        backgroundColor: "#fff2cf",
        padding: { x: 9, y: 5 },
      }).setOrigin(0.5).setDepth(3000).setVisible(requestedBottleMessageReady).setInteractive({ useHandCursor: true });
      this.bottleMessageMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.player || constructionDialogueOpen || !requestedBottleMessageReady) return;
        this.bottleMessageInteractionPending = true;
        this.shopInteractionPending = false;
        this.path = findPath(this.player, { x: 835, y: 500 }, this.navigationObstacles);
        const target = this.path.at(-1);
        if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });
      this.tweens.add({ targets: this.bottleMessageMarker, y: "-=5", duration: 900, yoyo: true, repeat: -1, ease: "Sine.InOut" });
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

    setQuestSourceAttention(source: "noticeboard" | "home" | "linus" | "bakery", marker: "?" | "!" | null) {
      requestedQuestSourceAttention[source] = marker;
      const active = marker !== null;
      if (source === "noticeboard") {
        this.noticeboardMarker?.setVisible(active);
        if (!active) {
          this.noticeboardInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
        }
      }
      if (source === "home") {
        this.backendHomeAttention = active;
        this.homeQuestMarker?.setVisible(active);
      }
      if (source === "bakery") {
        this.backendBakeryAttention = active;
        this.henningQuestMarker?.destroy();
        this.henningQuestMarker = undefined;
        if (active && this.henning?.visible) {
          const badge = this.add.graphics();
          badge.fillStyle(0x5b3a1f, 0.94);
          badge.lineStyle(3, 0xffd83d, 1);
          badge.fillCircle(0, 0, 27);
          badge.strokeCircle(0, 0, 27);
          const label = this.add.text(0, -1, marker ?? "?", {
            color: "#fff1a8", fontSize: "36px", fontStyle: "bold",
            stroke: "#8a5a00", strokeThickness: 3,
            shadow: { color: "#ffcf33", blur: 8, fill: true, stroke: true },
          }).setOrigin(0.5);
          this.henningQuestMarker = this.add.container(this.henning.x, this.henning.y - 178, [badge, label])
            .setDepth(3000).setSize(76, 76).setInteractive({ useHandCursor: true });
          this.henningQuestMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
            event.stopPropagation();
            callbacks.onQuestSourceInteract?.("bakery");
          });
          this.tweens.add({ targets: this.henningQuestMarker, y: "-=4", duration: 950, yoyo: true, repeat: -1, ease: "Sine.InOut" });
        }
      }
      if (source === "linus") {
        this.backendLinusAttention = active;
        this.linusQuestMarker?.destroy();
        this.linusQuestMarker = undefined;
        if (active && this.linus) {
          const linusBadge = this.add.graphics();
          linusBadge.fillStyle(0x5b3a1f, 0.94);
          linusBadge.lineStyle(3, 0xffd83d, 1);
          linusBadge.fillCircle(0, 0, 27);
          linusBadge.strokeCircle(0, 0, 27);
          const linusLabel = this.add.text(0, -1, marker ?? "?", {
            color: "#fff1a8",
            fontSize: "36px",
            fontStyle: "bold",
            stroke: "#8a5a00",
            strokeThickness: 3,
            shadow: { color: "#ffcf33", blur: 8, fill: true, stroke: true },
          }).setOrigin(0.5);
          this.linusQuestMarker = this.add.container(this.linus.x, this.linus.y - 178, [linusBadge, linusLabel])
            .setDepth(3000).setSize(76, 76).setInteractive({ useHandCursor: true });
          this.linusQuestMarker?.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
            event.stopPropagation();
            if (!this.player || constructionDialogueOpen) return;
            this.linusInteractionPending = true;
            this.path = findPath(this.player, REQUIRED_APPROACHES.linus, this.navigationObstacles);
            const target = this.path.at(-1);
            if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
            else this.maybeCompleteWorldInteraction();
          });
          this.tweens.add({
            targets: this.linusQuestMarker,
            y: "-=4",
            duration: 950,
            yoyo: true,
            repeat: -1,
            ease: "Sine.InOut",
          });
        }
        if (!active && this.introComplete && this.linusInteractionPending) {
          this.linusInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
        }
      }
    }

    private createNoticeboardMarker() {
      const bubble = this.add.graphics();
      bubble.fillStyle(0x5b3a1f, 0.94);
      bubble.lineStyle(3, 0xffd83d, 1);
      bubble.fillCircle(0, 0, 27);
      bubble.strokeCircle(0, 0, 27);
      const label = this.add.text(0, -2, "?", {
        color: "#ffd83d", fontSize: "30px", fontStyle: "bold", fontFamily: "Trebuchet MS",
        stroke: "#8a5a00", strokeThickness: 4,
        shadow: { color: "#ffcf33", blur: 12, fill: true, stroke: true },
      }).setOrigin(0.5);
      this.noticeboardMarker = this.add.container(NOTICEBOARD_MARKER.x, NOTICEBOARD_MARKER.y, [bubble, label])
        .setDepth(3000)
        .setSize(48, 48)
        .setInteractive({ useHandCursor: true })
        .setVisible(false);
      this.noticeboardMarker.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.player || constructionDialogueOpen || !requestedQuestSourceAttention.noticeboard) return;
        this.linusInteractionPending = false;
        this.attentionInteractionPending = false;
        this.noticeboardInteractionPending = true;
        const approach = NOTICEBOARD_APPROACH;
        this.path = findPath({ x: this.player.x, y: this.player.y }, approach, this.navigationObstacles);
        const finalPoint = this.path.at(-1);
        if (finalPoint) this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });
      this.tweens.add({
        targets: [bubble, label], y: "-=3", duration: 1000,
        yoyo: true, repeat: -1, ease: "Sine.InOut",
      });
    }

    private createQuestMarker() {
      // Quest language: glowing yellow ? means an available quest; glowing yellow !
      // means a completed quest / interaction prompt.
      const badge = this.add.graphics();
      badge.fillStyle(0x5b3a1f, 0.94);
      badge.lineStyle(3, 0xffd83d, 1);
      badge.fillCircle(0, 0, 30);
      badge.strokeCircle(0, 0, 30);
      const glow = this.add.text(0, -1, "?", {
        color: "#ffd83d",
        fontSize: "38px",
        fontStyle: "bold",
        fontFamily: "Trebuchet MS",
        stroke: "#8a5a00",
        strokeThickness: 4,
        shadow: { color: "#ffcf33", blur: 14, fill: true, stroke: true },
      }).setOrigin(0.5).setName("label");
      this.homeQuestMarker = this.add.container(HOME_QUEST_MARKER.x, HOME_QUEST_MARKER.y, [badge, glow])
        .setDepth(3000).setSize(96, 96).setInteractive(new Phaser.Geom.Rectangle(-48, -48, 96, 96), Phaser.Geom.Rectangle.Contains).setVisible(false);
      this.homeQuestMarker.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (this.introComplete && this.backendHomeAttention) callbacks.onQuestSourceInteract?.("home");
      });
      this.tweens.add({ targets: [badge, glow], alpha: { from: 0.82, to: 1 }, scale: { from: 0.96, to: 1.05 }, duration: 850, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    }

    private applyBuildingPresentation(stages: Partial<Record<VisualProductionBuilding, VisualProductionStage>>) {
      const signature = JSON.stringify(stages);
      if (signature === this.renderedBuildingStages) return;
      this.renderedBuildingStages = signature;
      this.productionBuildings.forEach(image => image.destroy());
      this.productionBuildings = createVisualProductionBuildings(this, stages);
      this.navigationObstacles = [...STATIC_OBSTACLES, { type: "rect", x: 1130, y: 355, width: 205, height: 72 }, ...getVisualProductionObstacles(stages)];
      // A route planned before the reveal may now cross the new footprint.
      this.path = [];
      this.targetMarker?.setVisible(false);
      if (this.player && !isWalkable(this.player, this.navigationObstacles)) {
        const safePoint = nearestWalkablePoint(this.player, this.navigationObstacles);
        this.player.setPosition(safePoint.x, safePoint.y)
          .setDepth(1000 + Math.round(safePoint.y));
      }
    }

    setConstruction(presentation: ConstructionPresentation) {
      requestedConstruction = presentation;
      this.applyBuildingPresentation(presentation.stages);
      this.attentionMarker?.destroy();
      this.attentionMarker = undefined;
      const attention = presentation.attention;
      if (!attention) return;
      const resident = this.residents[attention.resident];
      if (!resident) return;
      resident.setPosition(attention.position.x, attention.position.y).setDepth(1000 + attention.position.y);
      // Construction/story attention is dialogue, not a quest state.
      // Keep MMO semantics reserved: ? = available quest, ! = completed quest turn-in.
      const speechBubble = this.add.graphics();
      speechBubble.fillStyle(0xfffbef, 0.98);
      speechBubble.lineStyle(3, 0x5b3a1f, 1);
      speechBubble.fillRoundedRect(-29, -21, 58, 42, 14);
      speechBubble.strokeRoundedRect(-29, -21, 58, 42, 14);
      speechBubble.fillTriangle(-10, 18, -2, 18, -10, 29);
      const speechDots = this.add.text(0, -5, "•••", {
        color: "#5b3a1f", fontSize: "22px", fontStyle: "bold",
      }).setOrigin(0.5);
      // The construction guide position is already authored beside the resident.
      // Anchor the marker above the resident's actual sprite instead, otherwise Recycling
      // can place the bubble outside the visible camera near the negative-x build site.
      const markerX = resident.x;
      const markerY = resident.y - 155;
      this.attentionMarker = this.add.container(markerX, markerY, [speechBubble, speechDots])
        .setDepth(3000).setSize(76, 72).setInteractive({ useHandCursor: true });
      this.attentionMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        this.approachAttentionResident();
      });
    }

    private approachAttentionResident() {
      const attention = requestedConstruction.attention;
      if (!attention || !this.player || constructionDialogueOpen || this.activeRevealId) return;
      this.linusInteractionPending = false;
      this.attentionInteractionPending = true;
      this.path = findPath(this.player, attention.approach, this.navigationObstacles);
      const target = this.path.at(-1);
      if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
      else this.maybeCompleteWorldInteraction();
    }

    async presentConstructionReveal(id: string, commit: () => Promise<void>) {
      const attention = requestedConstruction.attention;
      if (!attention || attention.id !== id || this.activeRevealId) {
        throw new Error("Construction reveal is not available");
      }
      this.activeRevealId = id;
      this.attentionMarker?.setVisible(false);
      try {
        if (attention.presentation === "delivery") await this.playDelivery(commit);
        else await commit();
      } finally {
        this.activeRevealId = null;
        this.attentionMarker?.setVisible(true);
      }
    }

    /** Presentation only: domain authorizes the reveal and persists the arrival commit. */
    private playDelivery(commit: () => Promise<void>): Promise<void> {
      return new Promise((resolve, reject) => {
        const truck = this.add.image(900, 490, "truck-painted")
          .setOrigin(0.5, 0.92)
          .setDisplaySize(245, 160)
          .setDepth(1490);
        let stopped = false;
        const finish = (error?: Error) => {
          if (stopped) return;
          stopped = true;
          this.events.off("shutdown", onShutdown);
          this.tweens.killTweensOf(truck);
          truck.destroy();
          if (error) reject(error);
          else resolve();
        };
        const onShutdown = () => finish(new Error("Construction presentation interrupted"));
        this.events.once("shutdown", onShutdown);
        this.tweens.add({
          targets: truck, x: 340, y: 485, duration: 1700, ease: "Sine.Out",
          onUpdate: () => truck.setDepth(1000 + Math.round(truck.y)),
          onComplete: async () => {
            try {
              await commit();
              if (stopped) return;
              this.tweens.add({ targets: this.linus, y: "-=10", duration: 180, yoyo: true, repeat: 3 });
              this.time.delayedCall(900, () => this.tweens.add({
                targets: truck, x: 900, y: 490, duration: 1500, ease: "Sine.In",
                onUpdate: () => truck.setDepth(1000 + Math.round(truck.y)),
                onComplete: () => finish(),
              }));
            } catch (error) {
              finish(error instanceof Error ? error : new Error("Construction commit failed"));
            }
          },
        });
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
      if (isWalkable(nx, this.navigationObstacles)) this.player.x = nx.x;
      const ny = { x: this.player.x, y: this.player.y + dy };
      if (isWalkable(ny, this.navigationObstacles)) this.player.y = ny.y;
      // Both keyboard and A* steps share this post-movement depth update.
      this.player.setDepth(1000 + Math.round(this.player.y));
    }

    private drawVillage() {
      // Painted master scene is the visual authority for static scenery in this experiment.
      this.add.image(
        (WORLD_MIN_X + WORLD_MAX_X) / 2,
        WORLD_HEIGHT / 2,
        "master-scene",
      ).setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT).setDepth(0);

      // Masks are authored in v4 image pixels, independently of ground collisions.
      // Each landmark gets its own base depth; no old-master masks are reused.
      const occluders = [
        { baseY: 300, polygon: [[94,70],[168,6],[285,37],[326,24],[390,105],[377,258],[292,293],[158,300],[96,263]] },
        { baseY: 390, polygon: [[584,265],[658,234],[730,249],[724,350],[720,381],[598,391],[590,354]] },
        { baseY: 386, polygon: [[542,312],[563,300],[590,312],[590,353],[573,356],[571,385],[555,385],[553,355],[542,351]] },
        { baseY: 388, polygon: [[792,218],[813,198],[833,220],[827,254],[816,263],[819,365],[830,378],[823,388],[798,388],[791,378],[803,366],[807,263],[797,253]] },
        { baseY: 435, polygon: [[866,307],[903,275],[960,254],[1007,291],[993,310],[988,353],[1007,375],[1001,417],[960,436],[900,426],[879,407],[879,369],[893,351],[894,318]] },
        { baseY: 625, polygon: [[1177,550],[1200,511],[1229,459],[1250,509],[1268,533],[1258,545],[1290,584],[1274,598],[1297,627],[1170,639],[1150,611],[1171,583],[1157,577]] },
      ];
      for (const { baseY, polygon } of occluders) {
        const foreground = this.add.image((WORLD_MIN_X + WORLD_MAX_X) / 2,
          WORLD_HEIGHT / 2, "master-scene")
          .setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT).setDepth(1000 + baseY);
        const mask = this.make.graphics({ x: 0, y: 0 }, false);
        mask.fillStyle(0xffffff).beginPath();
        mask.moveTo(polygon[0][0] + WORLD_MIN_X, polygon[0][1]);
        polygon.slice(1).forEach(([x, y]) => mask.lineTo(x + WORLD_MIN_X, y));
        mask.closePath().fillPath();
        foreground.setMask(mask.createGeometryMask());
        this.events.once("shutdown", () => mask.destroy());
      }

      this.drawShop();
      this.drawBottleMessageMarker();

      // Mira becomes a physical resident when her arrival beat opens the lanthandel.
      // Tapping her uses the same shop interaction as tapping the building.
      this.mira = this.add.image(1000, 430, "mira-painted")
        .setOrigin(0.5, 0.96)
        .setScale(0.13)
        .setDepth(1430)
        .setVisible(requestedShopOpen)
        .setInteractive({ useHandCursor: true, pixelPerfect: false });
      this.mira.input?.hitArea.setTo(-30, -10, 150, 175);
      this.mira.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.player || constructionDialogueOpen || !requestedShopOpen || !this.mira?.visible) return;
        this.shopInteractionPending = true;
        this.linusInteractionPending = false;
        this.henningInteractionPending = false;
        this.attentionInteractionPending = false;
        this.noticeboardInteractionPending = false;
        this.path = findPath({ x: this.player.x, y: this.player.y }, { x: 1050, y: 445 }, this.navigationObstacles);
        const target = this.path.at(-1);
        if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });

      // Sol appears as a physical resident only after her harbor arrival beat has
      // completed. Keep the source artwork's proportions intact: uniform scale only.
      // This first placement is deliberately static so physical iPhone acceptance can
      // validate size and grounding before the village-tour/follow mechanic is added.
      this.sol = this.add.image(875, 480, "sol-painted")
        .setOrigin(0.5, 0.96)
        .setScale(0.10)
        .setDepth(1480)
        .setVisible(requestedSolVisible)
        .setInteractive({ useHandCursor: true, pixelPerfect: false });
      this.sol.input?.hitArea.setTo(-30, -10, 150, 180);
      this.sol.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.player || constructionDialogueOpen || requestedSolTourStop !== "decision" || !this.sol?.visible) return;
        this.solInteractionPending = true;
        this.path = findPath(this.player, { x: 835, y: 485 }, this.navigationObstacles);
        const target = this.path.at(-1);
        if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });
      this.residents.sol = this.sol;

      // Painted Linus stays dynamic so onboarding remains testable.
      this.linus = this.add.image(290, 445, "linus-painted")
        .setOrigin(0.5, 0.96)
        .setDisplaySize(128, 125)
        .setDepth(1445)
        .setInteractive({ useHandCursor: true });
      this.residents.linus = this.linus;
      this.linus.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (requestedConstruction.attention?.resident === "linus") {
          this.approachAttentionResident();
          return;
        }
        if (!this.player) return;
        // A backend quest marker changes what happens once the player reaches Linus,
        // but must never make Linus himself non-interactive. This keeps ordinary
        // resident dialogue available after onboarding and between quest batches.
        this.linusInteractionPending = true;
        this.path = findPath({ x: this.player.x, y: this.player.y }, REQUIRED_APPROACHES.linus, this.navigationObstacles);
        const finalPoint = this.path.at(-1);
        if (finalPoint) this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });

      this.henning = this.add.image(430, 452, "henning-painted")
        .setOrigin(0.5, 0.96)
        .setDisplaySize(104, 132)
        .setDepth(1452)
        .setVisible(requestedHenningVisible)
        .setInteractive({ useHandCursor: true, pixelPerfect: false });
      this.henning.input?.hitArea.setTo(-28, -12, 160, 170);
      this.residents.henning = this.henning;
      this.henning.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.player || constructionDialogueOpen || !this.henning?.visible) return;
        this.linusInteractionPending = false;
        this.attentionInteractionPending = false;
        this.noticeboardInteractionPending = false;
        this.henningInteractionPending = true;
        this.path = findPath({ x: this.player.x, y: this.player.y }, { x: 370, y: 468 }, this.navigationObstacles);
        const finalPoint = this.path.at(-1);
        if (finalPoint) this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });


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
    setConstructionDialogueOpen: (open) => { constructionDialogueOpen = open; },
    setConstruction: (presentation) => {
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setConstruction(presentation);
      } else requestedConstruction = presentation;
    },
    setIntroComplete: (complete: boolean) => {
      requestedIntroComplete = complete;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setIntroComplete(complete);
      }
    },
    setQuestSourceAttention: (source, marker) => {
      requestedQuestSourceAttention[source] = marker;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setQuestSourceAttention(source, marker);
      }
    },
    setShopOpen: (open: boolean) => {
      requestedShopOpen = open;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setShopOpen(open);
      }
    },
    setSolTourStop: (stop: SolTourStop) => {
      requestedSolTourStop = stop;
      if (game.scene.isActive("VillageScene")) (game.scene.getScene("VillageScene") as VillageScene).setSolTourStop(stop);
    },
    setBottleMessageReady: (ready: boolean) => {
      requestedBottleMessageReady = ready;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setBottleMessageReady(ready);
      }
    },
    setSolVisible: (visible: boolean) => {
      requestedSolVisible = visible;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setSolVisible(visible);
      }
    },
    setHenningVisible: (visible: boolean) => {
      requestedHenningVisible = visible;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setHenningVisible(visible);
      }
    },
    setDogVisible: (visible: boolean) => {
      requestedDogVisible = visible;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setDogVisible(visible);
      }
    },
    presentConstructionReveal: (id, commit) => {
      if (!game.scene.isActive("VillageScene")) return Promise.reject(new Error("Village is not ready"));
      return (game.scene.getScene("VillageScene") as VillageScene).presentConstructionReveal(id, commit);
    },
  };
}
