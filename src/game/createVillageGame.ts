import type { ConstructionPresentation } from "./constructionPresentation";
import type { GameObjects, Input, Types } from "phaser";
import { createInteractionMarker } from "../runtime/interaction/markerRenderer";
import { resolveInteraction, worldInputEnabled, type InteractionDefinition } from "../runtime/interaction/interactionContract";
import { resolveInteractionPriority } from "../runtime/interaction/interactionPriority";
import {
  AMBIENT_TEXTURE_KEYS,
} from "./worldDecor";

import { VIEW_HEIGHT, WORLD_MIN_X, WORLD_MAX_X, WORLD_WIDTH, WORLD_HEIGHT,
  REQUIRED_APPROACHES, STATIC_OBSTACLES, findPath, isWalkable, nearestWalkablePoint, type Point, type Obstacle } from "./villageNavigation";
import { preloadVisualProductionBuildings, createVisualProductionBuildings } from "./visualProductionRuntime";
import { VISUAL_PRODUCTION_PLACEMENTS, getVisualProductionObstacles, type VisualProductionBuilding, type VisualProductionStage } from "./visualProductionAssets";

export type SolTourStop = "bakery" | "shop" | "linus" | "decision" | null;
export type VillageGameHandle = {
  destroy: () => void;
  setConstruction: (presentation: ConstructionPresentation) => void;
  setWorldInputEnabled: (enabled: boolean) => void;
  setIntroComplete: (complete: boolean) => void;
  setDogVisible: (visible: boolean) => void;
  setHenningVisible: (visible: boolean) => void;
  setSolVisible: (visible: boolean) => void;
  setSolTourStop: (stop: SolTourStop) => void;
  setShopOpen: (open: boolean) => void;
  setBottleMessageReady: (ready: boolean) => void;
  setQuestSourceAttention: (source: "noticeboard" | "linus" | "bakery", marker: "?" | "!" | null) => void;
  presentConstructionReveal: (id: string, commit: () => Promise<void>) => Promise<void>;
};
type Callbacks = {
  onQuestSourceInteract?: (source: "noticeboard" | "linus" | "bakery") => void;
  onLinusInteract: () => void;
  onRecyclingInteract: () => void;
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
const NOTICEBOARD_MARKER: Point = { x: 150, y: 305 };
const NOTICEBOARD_APPROACH: Point = { x: 175, y: 430 };
const NOTICEBOARD_INTERACTION: InteractionDefinition = {
  id: "village:noticeboard",
  kind: "quest-source",
  anchor: NOTICEBOARD_APPROACH,
  approachPoint: NOTICEBOARD_APPROACH,
  interactionRadius: 36,
  marker: "quest-available",
  enabled: true,
};
const BOTTLE_MESSAGE_POINT: Point = { x: 835, y: 500 };
const BOTTLE_MESSAGE_INTERACTION: InteractionDefinition = {
  id: "village:bottle-message",
  kind: "hotspot",
  anchor: BOTTLE_MESSAGE_POINT,
  approachPoint: BOTTLE_MESSAGE_POINT,
  interactionRadius: 38,
  enabled: true,
};
// Family house is rendered at x=150 with a 360x300 footprint. The front door sits
// on the lower-right face of the painted house, so the quest marker belongs here.

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
  let requestedWorldInputEnabled = true;
  let requestedIntroComplete = false;
  let requestedDogVisible = false;
  let requestedHenningVisible = false;
  let requestedSolVisible = false;
  let requestedSolTourStop: SolTourStop = null;
  let requestedShopOpen = false;
  let requestedBottleMessageReady = false;
  const requestedQuestSourceAttention: Record<"noticeboard" | "linus" | "bakery", "?" | "!" | null> = { noticeboard: null, linus: null, bakery: null };

  const parentWidth = Math.max(parent.clientWidth, 1);
  const parentHeight = Math.max(parent.clientHeight, 1);
  const viewWidth = Math.min(WORLD_WIDTH, Math.max(960, Math.round(VIEW_HEIGHT * (parentWidth / parentHeight))));

  class VillageScene extends Phaser.Scene {
    private player?: GameObjects.Image;
    private dog?: GameObjects.Image;
    private path: Point[] = [];
    private movementStallFrames = 0;
    private cursors?: Types.Input.Keyboard.CursorKeys;
    private wasd?: Record<"up" | "down" | "left" | "right", Input.Keyboard.Key>;
    private targetMarker?: GameObjects.Arc;
    private noticeboardMarker?: GameObjects.Container;
    private backendLinusAttention = false;
    private backendBakeryAttention = false;
    private henningQuestMarker?: GameObjects.Container;
    private linusQuestMarker?: GameObjects.Container;
    private linusStoryMarker?: GameObjects.Container;
    private noticeboardInteractionPending = false;
    private linus?: GameObjects.Image;
    private linusInteractionZone?: GameObjects.Zone;
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
    private recyclingInteractionPending = false;

    constructor() {
      super("VillageScene");
    }

    preload() {
      preloadVisualProductionBuildings(this);
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
      this.createNoticeboardMarker();
      this.setQuestSourceAttention("noticeboard", requestedQuestSourceAttention.noticeboard);
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
        if (!this.player || !this.acceptsWorldInput()) return;
        const recyclingPlacement = VISUAL_PRODUCTION_PLACEMENTS.find((placement) => placement.building === "recycling");
        if (requestedConstruction.stages.recycling === 4 && recyclingPlacement &&
            Phaser.Geom.Rectangle.Contains(
              new Phaser.Geom.Rectangle(recyclingPlacement.x - recyclingPlacement.width / 2, recyclingPlacement.baseY - recyclingPlacement.height * 0.92, recyclingPlacement.width, recyclingPlacement.height),
              pointer.worldX, pointer.worldY)) {
          this.recyclingInteractionPending = true;
          this.linusInteractionPending = false;
          this.path = findPath(this.player, recyclingPlacement.approach, this.navigationObstacles);
          const target = this.path.at(-1);
          if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
          else this.maybeCompleteWorldInteraction();
          return;
        }
        // Resolve NPC taps at scene level too. This avoids depending on Phaser's
        // object-level pointer event ordering in the native iOS WebView.
        if (this.linus && Phaser.Geom.Rectangle.Contains(new Phaser.Geom.Rectangle(this.linus.x - 82, this.linus.y - 155, 164, 180), pointer.worldX, pointer.worldY)) {
          const linusIntent = this.resolveLinusIntent();
          if (linusIntent === "construction-attention") {
            this.approachAttentionResident();
            return;
          }
          if (linusIntent === "intro") {
            callbacks.onLinusInteract();
            return;
          }
          if (linusIntent === "resident") {
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
          const henningIntent = this.resolveHenningIntent();
          if (henningIntent === "construction-attention") {
            this.approachAttentionResident();
            return;
          }
          if (henningIntent === "quest-source") {
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
        const requestedTarget = { x: pointer.worldX, y: pointer.worldY };
        this.path = findPath({ x: this.player.x, y: this.player.y }, requestedTarget, this.navigationObstacles);
        const finalPoint = this.path.at(-1);
        if (finalPoint) {
          this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
        } else if (isWalkable(requestedTarget, this.navigationObstacles)) {
          // The coarse A* grid can report no route from an off-grid player position
          // even when the tapped ground is directly reachable. Preserve touch movement
          // by falling back to the exact walkable target; tryMove still enforces every
          // authored obstacle on the way there.
          this.path = [requestedTarget];
          this.targetMarker?.setPosition(requestedTarget.x, requestedTarget.y).setVisible(true);
        }
      });
    }

    setIntroComplete(complete: boolean) {
      requestedIntroComplete = complete;
      this.introComplete = complete;
      this.syncLinusPriorityMarkers();
      if (requestedSolTourStop === "linus") this.syncSolTourMarker();
    }

    private syncLinusPriorityMarkers() {
      this.linusStoryMarker?.destroy();
      this.linusStoryMarker = undefined;
      this.linusQuestMarker?.destroy();
      this.linusQuestMarker = undefined;
      if (!this.linus) return;

      const intent = this.resolveLinusIntent();
      if (intent === "intro") {
        this.linusStoryMarker = createInteractionMarker(this, {
          kind: "npc-attention",
          x: this.linus.x,
          y: this.linus.y - 155,
        });
        this.linusStoryMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
          event.stopPropagation();
          if (!this.acceptsWorldInput() || !this.player) return;
          if (this.resolveLinusIntent() === "intro") callbacks.onLinusInteract();
        });
        return;
      }

      if (intent === "quest-source") {
        const marker = requestedQuestSourceAttention.linus;
        if (!marker) return;
        this.linusQuestMarker = createInteractionMarker(this, {
          kind: marker === "!" ? "quest-turn-in" : "quest-available",
          x: this.linus.x,
          y: this.linus.y - 178,
        });
        this.linusQuestMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
          event.stopPropagation();
          if (!this.acceptsWorldInput() || !this.player || this.resolveLinusIntent() !== "quest-source") return;
          this.linusInteractionPending = true;
          this.path = findPath(this.player, REQUIRED_APPROACHES.linus, this.navigationObstacles);
          const target = this.path.at(-1);
          if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
          else this.maybeCompleteWorldInteraction();
        });
      }
    }

    private acceptsWorldInput() {
      return worldInputEnabled({
        enabled: requestedWorldInputEnabled,
        blockingOverlayVisible: false,
      });
    }

    private resolveLinusIntent() {
      return resolveInteractionPriority([
        { id: "resident", priority: 10, enabled: true },
        { id: "quest-source", priority: 20, enabled: this.introComplete && this.backendLinusAttention },
        { id: "story-cta", priority: 30, enabled: this.introComplete && requestedSolTourStop === "linus" },
        { id: "intro", priority: 40, enabled: !this.introComplete },
        { id: "construction-attention", priority: 50, enabled: requestedConstruction.attention?.resident === "linus" },
      ])?.id ?? "resident";
    }

    private resolveHenningIntent() {
      return resolveInteractionPriority([
        { id: "resident", priority: 10, enabled: true },
        { id: "quest-source", priority: 20, enabled: this.backendBakeryAttention },
        { id: "story-cta", priority: 30, enabled: requestedSolTourStop === "bakery" },
        { id: "construction-attention", priority: 40, enabled: requestedConstruction.attention?.resident === "henning" },
      ])?.id ?? "resident";
    }

    private syncHenningPriorityMarker() {
      this.henningQuestMarker?.destroy();
      this.henningQuestMarker = undefined;
      if (!this.henning?.visible || this.resolveHenningIntent() !== "quest-source") return;
      const marker = requestedQuestSourceAttention.bakery;
      if (!marker) return;

      this.henningQuestMarker = createInteractionMarker(this, {
        kind: marker === "!" ? "quest-turn-in" : "quest-available",
        x: this.henning.x,
        y: this.henning.y - 178,
      });
      this.henningQuestMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.acceptsWorldInput() || this.resolveHenningIntent() !== "quest-source") return;
        callbacks.onQuestSourceInteract?.("bakery");
      });
    }

    setDogVisible(visible: boolean) {
      requestedDogVisible = visible;
      this.dog?.setVisible(visible);
    }

    setHenningVisible(visible: boolean) {
      requestedHenningVisible = visible;
      this.henning?.setVisible(visible);
      this.syncHenningPriorityMarker();
      if (requestedSolTourStop === "bakery") this.syncSolTourMarker();
    }

    setSolVisible(visible: boolean) {
      requestedSolVisible = visible;
      this.sol?.setVisible(visible);
      if (requestedSolTourStop === "decision") this.syncSolTourMarker();
    }

    setWorldInputEnabled(enabled: boolean) {
      requestedWorldInputEnabled = enabled;
      if (!enabled) {
        this.path = [];
        this.targetMarker?.setVisible(false);
      }
    }

    update(_: number, delta: number) {
      if (!this.player) return;
      this.updateDog();
      if (!this.acceptsWorldInput()) {
        this.path = [];
        this.targetMarker?.setVisible(false);
        return;
      }
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
      const before = { x: this.player.x, y: this.player.y };
      const finalTarget = this.path.at(-1) ?? next;
      this.tryMove(dx * speed, dy * speed);
      const moved = distance(before, this.player);
      if (moved > 0.25) {
        this.movementStallFrames = 0;
        return;
      }

      this.movementStallFrames += 1;
      if (this.movementStallFrames < 3) return;

      // Dynamic construction/quest state can invalidate a path after it was planned.
      // Replan once from the player's actual position instead of repeatedly pushing
      // into the same blocked waypoint and producing the visible "stuck/jitter" loop.
      this.movementStallFrames = 0;
      const replanned = findPath(
        { x: this.player.x, y: this.player.y },
        finalTarget,
        this.navigationObstacles,
      );
      this.path = replanned;
      const replannedTarget = replanned.at(-1);
      if (replannedTarget) this.targetMarker?.setPosition(replannedTarget.x, replannedTarget.y).setVisible(true);
      else this.targetMarker?.setVisible(false);
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
      if (this.recyclingInteractionPending && this.player) {
        const recycling = VISUAL_PRODUCTION_PLACEMENTS.find((placement) => placement.building === "recycling");
        const interaction: InteractionDefinition | null = recycling ? {
          id: "village:recycling",
          kind: "hotspot",
          anchor: recycling.approach,
          approachPoint: recycling.approach,
          interactionRadius: 40,
          enabled: requestedConstruction.stages.recycling === 4,
        } : null;
        const resolution = interaction
          ? resolveInteraction(
              [interaction],
              { interactionId: interaction.id, requestedAt: recycling?.approach ?? { x: 0, y: 0 } },
              { x: this.player.x, y: this.player.y },
            )
          : { status: "disabled" as const };
        if (resolution.status === "disabled") {
          this.recyclingInteractionPending = false;
          return;
        }
        if (resolution.status === "activate") {
          this.recyclingInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
          callbacks.onRecyclingInteract();
          return;
        }
      }

      if (this.noticeboardInteractionPending && this.player) {
        const resolution = resolveInteraction(
          [{ ...NOTICEBOARD_INTERACTION, enabled: Boolean(requestedQuestSourceAttention.noticeboard) }],
          { interactionId: NOTICEBOARD_INTERACTION.id, requestedAt: NOTICEBOARD_MARKER },
          { x: this.player.x, y: this.player.y },
        );
        if (resolution.status === "disabled") {
          this.noticeboardInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
          return;
        }
        if (resolution.status === "activate") {
          this.noticeboardInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
          callbacks.onQuestSourceInteract?.("noticeboard");
          return;
        }
      }

      const attention = requestedConstruction.attention;
      if (this.attentionInteractionPending && this.player) {
        if (!attention) {
          this.attentionInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
          return;
        }
        const interaction: InteractionDefinition = {
          id: `village:construction-attention:${attention.id}`,
          kind: "npc",
          anchor: attention.approach,
          approachPoint: attention.approach,
          interactionRadius: 32,
          marker: "npc-attention",
          enabled: true,
        };
        const resolution = resolveInteraction(
          [interaction],
          { interactionId: interaction.id, requestedAt: interaction.anchor },
          { x: this.player.x, y: this.player.y },
        );
        if (resolution.status === "activate") {
          this.attentionInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
                    callbacks.onConstructionInteract(attention.id);
          return;
        }
      }

      if (this.bottleMessageInteractionPending && this.player) {
        const resolution = resolveInteraction(
          [{ ...BOTTLE_MESSAGE_INTERACTION, enabled: requestedBottleMessageReady }],
          { interactionId: BOTTLE_MESSAGE_INTERACTION.id, requestedAt: BOTTLE_MESSAGE_POINT },
          { x: this.player.x, y: this.player.y },
        );
        if (resolution.status === "disabled") {
          this.bottleMessageInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
          return;
        }
        if (resolution.status === "activate") {
          this.bottleMessageInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
          callbacks.onBottleMessageInteract();
          return;
        }
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
        if (this.resolveHenningIntent() === "quest-source") callbacks.onQuestSourceInteract?.("bakery");
        else callbacks.onHenningInteract();
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
      if (this.resolveLinusIntent() === "quest-source") callbacks.onQuestSourceInteract?.("linus");
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
        if (!this.acceptsWorldInput()) return;
        if (!this.player) return;
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
      if (requestedSolTourStop === "shop") this.syncSolTourMarker();
      if (!open) this.shopInteractionPending = false;
    }

    setSolTourStop(stop: SolTourStop) {
      requestedSolTourStop = stop;
      this.syncLinusPriorityMarkers();
      this.syncHenningPriorityMarker();
      this.syncSolTourMarker();
    }

    private syncSolTourMarker() {
      this.solTourMarker?.destroy();
      this.solTourMarker = undefined;
      const stop = requestedSolTourStop;
      if (!stop) return;
      const target = stop === "bakery" ? this.henning : stop === "shop" ? this.mira : stop === "decision" ? this.sol : this.linus;
      if (!target || !target.visible) return;
      if (stop === "bakery" && this.resolveHenningIntent() !== "story-cta") return;
      if (stop === "linus" && this.resolveLinusIntent() !== "story-cta") return;
      const nextStopLabel = stop === "bakery" ? "Bageriet" : stop === "shop" ? "Mira" : stop === "linus" ? "Linus" : "Sol";
      this.solTourMarker = this.add.text(target.x, target.y - 145, `☀️ ${nextStopLabel}`, {
        fontSize: "22px", fontStyle: "bold", color: "#5b3a1f",
        backgroundColor: "#fff2cf", padding: { x: 10, y: 6 },
        stroke: "#fff2cf", strokeThickness: 2,
      }).setOrigin(0.5).setDepth(3100).setInteractive({ useHandCursor: true });
      this.solTourMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.acceptsWorldInput()) return;
        if (!this.player || requestedSolTourStop !== stop) return;
        if (stop === "bakery" && this.resolveHenningIntent() !== "story-cta") return;
        if (stop === "linus" && this.resolveLinusIntent() !== "story-cta") return;
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
      this.bottleMessageMarker = this.add.text(BOTTLE_MESSAGE_POINT.x, BOTTLE_MESSAGE_POINT.y, "🍾", {
        fontSize: "34px",
        backgroundColor: "#fff2cf",
        padding: { x: 9, y: 5 },
      }).setOrigin(0.5).setDepth(3000).setVisible(requestedBottleMessageReady).setInteractive({ useHandCursor: true });
      this.bottleMessageMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.acceptsWorldInput()) return;
        if (!this.player || !requestedBottleMessageReady) return;
        this.bottleMessageInteractionPending = true;
        this.shopInteractionPending = false;
        this.path = findPath(this.player, BOTTLE_MESSAGE_INTERACTION.approachPoint ?? BOTTLE_MESSAGE_INTERACTION.anchor, this.navigationObstacles);
        const target = this.path.at(-1);
        if (target) this.targetMarker?.setPosition(target.x, target.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });
      this.tweens.add({ targets: this.bottleMessageMarker, y: "-=5", duration: 900, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    }


    private drawFence(x: number, y: number, count: number) {
      this.add.image(x + count * 10, y, "fence-segment")
        .setDisplaySize(count * 20, 48)
        .setDepth(1000 + y);
    }

    setQuestSourceAttention(source: "noticeboard" | "linus" | "bakery", marker: "?" | "!" | null) {
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
      if (source === "bakery") {
        this.backendBakeryAttention = active;
        this.syncHenningPriorityMarker();
      }
      if (source === "linus") {
        this.backendLinusAttention = active;
        this.syncLinusPriorityMarkers();
        if (!active && this.introComplete && this.linusInteractionPending) {
          this.linusInteractionPending = false;
          this.path = [];
          this.targetMarker?.setVisible(false);
        }
      }
    }

    private createNoticeboardMarker() {
      this.noticeboardMarker = createInteractionMarker(this, {
        kind: "quest-available",
        x: NOTICEBOARD_MARKER.x,
        y: NOTICEBOARD_MARKER.y,
        visible: false,
      });
      this.noticeboardMarker.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.acceptsWorldInput()) return;
        if (!this.player || !requestedQuestSourceAttention.noticeboard) return;
        this.linusInteractionPending = false;
        this.attentionInteractionPending = false;
        this.noticeboardInteractionPending = true;
        const approach = NOTICEBOARD_INTERACTION.approachPoint ?? NOTICEBOARD_INTERACTION.anchor;
        this.path = findPath({ x: this.player.x, y: this.player.y }, approach, this.navigationObstacles);
        const finalPoint = this.path.at(-1);
        if (finalPoint) this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
        else this.maybeCompleteWorldInteraction();
      });
    }


    private applyBuildingPresentation(stages: Partial<Record<VisualProductionBuilding, VisualProductionStage>>) {
      const signature = JSON.stringify(stages);
      if (signature === this.renderedBuildingStages) return;
      this.renderedBuildingStages = signature;
      this.productionBuildings.forEach(image => image.destroy());
      this.productionBuildings = createVisualProductionBuildings(this, stages);
      // Bakery artwork sits north of the village path. Its authored 72px footprint
      // reaches into the only east-west corridor once Bakery is rushed to stage 4,
      // trapping the child around Linus and making quest sources to the east unreachable.
      // Keep the visible Bakery intact, but do not treat its decorative footprint as a
      // navigation wall. Recycling/Clinic still contribute their authored collision.
      const activePlacements = VISUAL_PRODUCTION_PLACEMENTS.filter((placement) => stages[placement.building]);
      const productionObstacles = getVisualProductionObstacles(stages).filter(
        (_, index) => activePlacements[index]?.building !== "bakery",
      );
      this.navigationObstacles = [...STATIC_OBSTACLES, { type: "rect", x: 1130, y: 355, width: 205, height: 72 }, ...productionObstacles];
      // A route planned before the reveal may now cross the new footprint.
      this.path = [];
      this.movementStallFrames = 0;
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
      if (!attention) {
        this.syncLinusPriorityMarkers();
        this.syncHenningPriorityMarker();
        this.syncSolTourMarker();
        return;
      }
      const resident = this.residents[attention.resident];
      if (!resident) {
        this.syncLinusPriorityMarkers();
        this.syncHenningPriorityMarker();
        this.syncSolTourMarker();
        return;
      }
      resident.setPosition(attention.position.x, attention.position.y).setDepth(1000 + attention.position.y);
      this.syncLinusPriorityMarkers();
      this.syncHenningPriorityMarker();
      this.syncSolTourMarker();
      // Construction/story attention is dialogue, not a quest state.
      // Keep MMO semantics reserved: ? = available quest, ! = completed quest turn-in.
      // Anchor the canonical story-attention marker above the resident's actual sprite.
      const markerX = resident.x;
      const markerY = resident.y - 155;
      this.attentionMarker = createInteractionMarker(this, {
        kind: "npc-attention",
        x: markerX,
        y: markerY,
      });
      this.attentionMarker.on("pointerdown", (_p: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.acceptsWorldInput()) return;
        this.approachAttentionResident();
      });
    }

    private approachAttentionResident() {
      const attention = requestedConstruction.attention;
      if (!attention || !this.player || this.activeRevealId) return;
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
        if (!this.acceptsWorldInput()) return;
        if (!this.player || !requestedShopOpen || !this.mira?.visible) return;
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
        if (!this.acceptsWorldInput()) return;
        if (!this.player || requestedSolTourStop !== "decision" || !this.sol?.visible) return;
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
      this.syncLinusPriorityMarkers();
      // Dedicated interaction zone: the painted PNG may contain transparent padding,
      // so onboarding must not depend on the texture's implicit interactive bounds.
      this.linusInteractionZone = this.add.zone(this.linus.x, this.linus.y - 72, 190, 190)
        .setDepth(2990)
        .setInteractive({ useHandCursor: true });
      this.linusInteractionZone.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.acceptsWorldInput()) return;
        if (!this.player) return;
        const linusIntent = this.resolveLinusIntent();
        if (linusIntent === "construction-attention") {
          this.approachAttentionResident();
          return;
        }
        if (linusIntent === "intro") {
          callbacks.onLinusInteract();
          return;
        }
        this.linusInteractionPending = true;
        this.path = findPath({ x: this.player.x, y: this.player.y }, REQUIRED_APPROACHES.linus, this.navigationObstacles);
        const finalPoint = this.path.at(-1);
        if (finalPoint) {
          this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
        } else if (isWalkable(REQUIRED_APPROACHES.linus, this.navigationObstacles)) {
          this.path = [REQUIRED_APPROACHES.linus];
          this.targetMarker?.setPosition(REQUIRED_APPROACHES.linus.x, REQUIRED_APPROACHES.linus.y).setVisible(true);
        } else {
          this.maybeCompleteWorldInteraction();
        }
      });
      this.linus.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (!this.acceptsWorldInput()) return;
        if (!this.player) return;
        const linusIntent = this.resolveLinusIntent();
        if (linusIntent === "construction-attention") {
          this.approachAttentionResident();
          return;
        }
        if (linusIntent === "intro") {
          callbacks.onLinusInteract();
          return;
        }
        // Quest and ordinary resident intents share the same authored approach path.
        // The callback remains resolved on arrival so backend attention changes during
        // navigation keep the established live behavior.
        this.linusInteractionPending = true;
        this.path = findPath({ x: this.player.x, y: this.player.y }, REQUIRED_APPROACHES.linus, this.navigationObstacles);
        const finalPoint = this.path.at(-1);
        if (finalPoint) {
          this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
        } else if (isWalkable(REQUIRED_APPROACHES.linus, this.navigationObstacles)) {
          // A fresh game must never leave the first Linus tap as a silent no-op just
          // because the coarse path grid failed to produce a route.
          this.path = [REQUIRED_APPROACHES.linus];
          this.targetMarker?.setPosition(REQUIRED_APPROACHES.linus.x, REQUIRED_APPROACHES.linus.y).setVisible(true);
        } else {
          this.maybeCompleteWorldInteraction();
        }
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
        if (!this.acceptsWorldInput()) return;
        if (!this.player || !this.henning?.visible) return;
        const henningIntent = this.resolveHenningIntent();
        if (henningIntent === "construction-attention") {
          this.approachAttentionResident();
          return;
        }
        if (henningIntent === "quest-source") {
          callbacks.onQuestSourceInteract?.("bakery");
          return;
        }
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
    setWorldInputEnabled: (enabled) => {
      requestedWorldInputEnabled = enabled;
      if (game.scene.isActive("VillageScene")) {
        (game.scene.getScene("VillageScene") as VillageScene).setWorldInputEnabled(enabled);
      }
    },
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
