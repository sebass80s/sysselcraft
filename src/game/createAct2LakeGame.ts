import type { GameObjects, Input, Types } from "phaser";
import { createInteractionMarker } from "../runtime/interaction/markerRenderer";
import { resolveInteraction } from "../runtime/interaction/interactionContract";
import {
  ACT2_ALVE_WORK_POSITIONS,
  ACT2_ALVE_IDLE_POSITION,
  ACT2_VISUAL_ASSETS,
  ACT2_VISUAL_PLACEMENTS,
  ACT2_WORLD,
  ACT2_PLAYER_FOOT_RADIUS,
  getAct2DisplaySize,
  type Act2RestorationProject,
  type Act2VisualStage,
} from "./act2VisualAssets";

export type Act2LakeGameHandle = {
  destroy: () => void;
  setStage: (stage: Act2VisualStage) => void;
  setProjectStages: (stages: Partial<Record<Act2RestorationProject, 0 | Act2VisualStage>>) => void;
  setActiveProject: (project: Act2RestorationProject | null) => void;
  setAlvePresent: (present: boolean) => void;
  setAlveTurnInAvailable: (available: boolean) => void;
  setCabinRevisitAvailable: (available: boolean) => void;
  setWorldInputEnabled: (enabled: boolean) => void;
};

export type Act2LakeGameOptions = {
  onAlveTurnIn?: () => void;
  onCabinRevisit?: () => void;
};

const PROJECTS: Act2RestorationProject[] = ["cabin", "boathouse", "dock", "motorboat"];
const VIEW_HEIGHT = 640;

const ALVE_IDLE_WORLD_PROMPTS = [
  "Gör några uppdrag så kommer vi vidare med bygget!",
  "Vi behöver några uppdrag till innan vi kan fortsätta.",
  "Kör några uppdrag, så bygger vi vidare sen!",
  "Lite fler uppdrag först. Sen fortsätter vi!",
  "Vi är inte riktigt redo för nästa steg än. Gör några uppdrag!",
  "Fixar du några uppdrag till så tar vi nästa byggsteg sen.",
] as const;

export async function createAct2LakeGame(
  parent: HTMLElement,
  initialStage: Act2VisualStage = 1,
  options: Act2LakeGameOptions = {},
): Promise<Act2LakeGameHandle> {
  const Phaser = await import("phaser");
  let requestedStage = initialStage;
  let requestedProjectStages: Partial<Record<Act2RestorationProject, 0 | Act2VisualStage>> = {};
  let requestedActiveProject: Act2RestorationProject | null = null;
  let requestedAlvePresent = true;
  let requestedAlveTurnInAvailable = false;
  let requestedCabinRevisitAvailable = false;
  let requestedWorldInputEnabled = true;

  const parentWidth = Math.max(parent.clientWidth, 1);
  const parentHeight = Math.max(parent.clientHeight, 1);
  const viewWidth = Math.min(
    ACT2_WORLD.width,
    Math.max(960, Math.round(VIEW_HEIGHT * (parentWidth / parentHeight))),
  );

  class Act2LakeScene extends Phaser.Scene {
    private projectImages = new Map<Act2RestorationProject, GameObjects.Image>();
    private player?: GameObjects.Image;
    private dog?: GameObjects.Image;
    private alveEntity?: GameObjects.Container;
    private alveTurnInMarker?: GameObjects.Container;
    private alveNearbyPrompt?: GameObjects.Container;
    private alveIdlePrompt?: GameObjects.Container;
    private alveIdlePromptText?: GameObjects.Text;
    private alveIdlePromptHide?: Phaser.Time.TimerEvent;
    private lastAlveIdlePromptIndex = -1;
    private moveTarget: { x: number; y: number } | null = null;
    private cursors?: Types.Input.Keyboard.CursorKeys;
    private wasd?: Record<"up" | "down" | "left" | "right", Input.Keyboard.Key>;

    constructor() {
      super("Act2LakeScene");
    }

    preload() {
      this.load.image("act2-lake-master", ACT2_WORLD.master);
      this.load.image("act2-child", "/assets/village/reboot/child.webp");
      this.load.image("act2-dog", "/assets/village/reboot/puppy-painted.png");
      this.load.image("act2-alve", "/assets/village/reboot/alve-runtime.png");
      for (const project of PROJECTS) {
        ACT2_VISUAL_ASSETS[project].forEach((asset, index) => {
          this.load.image(this.textureKey(project, (index + 1) as Act2VisualStage), asset);
        });
      }
    }

    create() {
      const camera = this.cameras.main;
      camera.setBackgroundColor("#789a68");
      camera.setBounds(0, 0, ACT2_WORLD.width, ACT2_WORLD.height);

      this.add.image(0, 0, "act2-lake-master")
        .setOrigin(0, 0)
        .setDisplaySize(ACT2_WORLD.width, ACT2_WORLD.height)
        .setDepth(0);

      for (const project of PROJECTS) {
        const placement = ACT2_VISUAL_PLACEMENTS[project];
        const display = getAct2DisplaySize(project);
        const projectStage = this.renderStage(requestedProjectStages[project] ?? requestedStage);
        const image = this.add.image(
          placement.x,
          placement.baseY,
          this.textureKey(project, projectStage),
        )
          .setOrigin(placement.origin.x, placement.origin.y)
          .setDisplaySize(display.width, display.height)
          .setDepth(1000 + placement.baseY);
        this.projectImages.set(project, image);
        if (project === "cabin") {
          image.setInteractive({ useHandCursor: true });
          image.on("pointerdown", (_pointer: Input.Pointer, _localX: number, _localY: number, event: { stopPropagation: () => void }) => {
            if (!requestedWorldInputEnabled || !requestedCabinRevisitAvailable) return;
            event.stopPropagation();
            this.moveTarget = null;
            options.onCabinRevisit?.();
          });
        }
      }

      // Acceptance spawn only. Story entry/exit points remain deliberately undefined
      // until the authored Act 2 transition is wired.
      this.player = this.add.image(815, 515, "act2-child")
        .setOrigin(0.5, 0.94)
        .setDisplaySize(74, 118)
        .setDepth(1585);
      this.dog = this.add.image(755, 532, "act2-dog")
        .setOrigin(0.5, 0.88)
        .setDisplaySize(66, 55)
        .setDepth(1600);

      // Canonical Alve runtime entity. The container is the single interaction
      // owner for positioning, turn-in markers and nearby interaction behavior.
      const alveSprite = this.add.image(0, 0, "act2-alve")
        .setOrigin(0.5, 0.94)
        .setDisplaySize(78, 117);
      const alveLabelBg = this.add.rectangle(0, -129, 64, 24, 0x355f3a, 0.94)
        .setStrokeStyle(1, 0xf2ead1, 0.8);
      const alveLabel = this.add.text(0, -129, "Alve", {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        fontStyle: "bold",
        color: "#ffffff",
      }).setOrigin(0.5);
      this.alveTurnInMarker = createInteractionMarker(this, {
        kind: "quest-turn-in",
        x: 0,
        y: -164,
        visible: requestedAlveTurnInAvailable,
        interactive: false,
      });
      const nearbyBg = this.add.rectangle(0, -198, 92, 28, 0x1e2f22, 0.94)
        .setStrokeStyle(2, 0xf4d780, 0.9);
      const nearbyText = this.add.text(0, -198, "Tryck på Alve", {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        fontStyle: "bold",
        color: "#ffffff",
      }).setOrigin(0.5);
      this.alveNearbyPrompt = this.add.container(0, 0, [nearbyBg, nearbyText]).setVisible(false);
      const idlePromptBg = this.add.rectangle(0, -198, 310, 58, 0x1e2f22, 0.94)
        .setStrokeStyle(2, 0xf4d780, 0.9);
      this.alveIdlePromptText = this.add.text(0, -198, "", {
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        fontStyle: "bold",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 280 },
      }).setOrigin(0.5);
      this.alveIdlePrompt = this.add.container(0, 0, [idlePromptBg, this.alveIdlePromptText]).setVisible(false);
      const alveInteractionArea = this.add.rectangle(0, -90, 150, 310, 0xffffff, 0.001);
      this.alveEntity = this.add.container(0, 0, [alveSprite, alveLabelBg, alveLabel, this.alveTurnInMarker, this.alveNearbyPrompt, this.alveIdlePrompt, alveInteractionArea])
        .setVisible(false);

      const handleAlvePointerDown = (_pointer: Input.Pointer, _localX: number, _localY: number, event: { stopPropagation: () => void }) => {
        if (!requestedWorldInputEnabled) return;
        event.stopPropagation();
        if (!this.player || !this.alveEntity || !requestedAlvePresent) return;
        if (!requestedAlveTurnInAvailable) {
          this.moveTarget = null;
          this.facePlayerTowardAlve();
          this.showAlveIdleWorldPrompt();
          return;
        }
        const interaction = {
          id: "act2:alve-turn-in",
          kind: "npc" as const,
          anchor: { x: this.alveEntity.x, y: this.alveEntity.y },
          approachPoint: {
            x: this.alveEntity.x,
            y: Math.min(ACT2_WORLD.height - 8, this.alveEntity.y + 58),
          },
          interactionRadius: 135,
          marker: "quest-turn-in" as const,
          enabled: requestedAlveTurnInAvailable,
        };
        const resolution = resolveInteraction(
          [interaction],
          { interactionId: interaction.id, requestedAt: { x: this.alveEntity.x, y: this.alveEntity.y } },
          { x: this.player.x, y: this.player.y },
        );
        if (resolution.status === "activate") {
          this.moveTarget = null;
          this.facePlayerTowardAlve();
          options.onAlveTurnIn?.();
          return;
        }
        if (resolution.status === "approach") {
          this.moveTarget = resolution.target;
        }
      };

      alveInteractionArea
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", handleAlvePointerDown);
      this.positionAlve(requestedActiveProject);

      camera.centerOn(this.player.x, this.player.y);
      camera.startFollow(this.player, true, 0.08, 0.08);
      camera.setDeadzone(Math.min(340, viewWidth * 0.32), 180);

      this.input.on("pointerdown", (pointer: Input.Pointer) => {
        if (!requestedWorldInputEnabled || !this.player) return;
        const target = { x: pointer.worldX, y: pointer.worldY };
        if (!this.isWalkable(target.x, target.y)) return;
        this.moveTarget = target;
      });

      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
          up: "W", down: "S", left: "A", right: "D",
        }) as Record<"up" | "down" | "left" | "right", Input.Keyboard.Key>;
      }
    }

    update(_time: number, delta: number) {
      if (!this.player) return;
      const left = Boolean(this.cursors?.left.isDown || this.wasd?.left.isDown);
      const right = Boolean(this.cursors?.right.isDown || this.wasd?.right.isDown);
      const up = Boolean(this.cursors?.up.isDown || this.wasd?.up.isDown);
      const down = Boolean(this.cursors?.down.isDown || this.wasd?.down.isDown);
      let dx = Number(right) - Number(left);
      let dy = Number(down) - Number(up);

      if (dx || dy) {
        this.moveTarget = null;
      } else if (this.moveTarget) {
        dx = this.moveTarget.x - this.player.x;
        dy = this.moveTarget.y - this.player.y;
        if (Math.hypot(dx, dy) < 8) {
          this.moveTarget = null;
          dx = 0;
          dy = 0;
        }
      }

      if (dx || dy) {
        const length = Math.hypot(dx, dy);
        dx /= length;
        dy /= length;
        const speed = 180 * delta / 1000;
        const nextX = Phaser.Math.Clamp(this.player.x + dx * speed, 37, ACT2_WORLD.width - 37);
        const nextY = Phaser.Math.Clamp(this.player.y + dy * speed, 300, ACT2_WORLD.height - 8);
        if (this.isWalkable(nextX, this.player.y)) this.player.x = nextX;
        if (this.isWalkable(this.player.x, nextY)) this.player.y = nextY;
        this.player.setFlipX(dx > 0);
        this.player.setDepth(1000 + Math.round(this.player.y));
      }

      this.updateAlveInteractionFeedback();

      if (this.dog) {
        const desiredX = this.player.x - (this.player.flipX ? -54 : 54);
        const desiredY = this.player.y + 18;
        const followStep = Math.min(1, delta / 220);
        const nextDogX = this.dog.x + (desiredX - this.dog.x) * followStep;
        const nextDogY = this.dog.y + (desiredY - this.dog.y) * followStep;
        if (this.isWalkable(nextDogX, this.dog.y)) this.dog.x = nextDogX;
        if (this.isWalkable(this.dog.x, nextDogY)) this.dog.y = nextDogY;
        this.dog.setDepth(1000 + Math.round(this.dog.y));
      }
    }

    private showAlveIdleWorldPrompt() {
      if (!this.alveIdlePrompt || !this.alveIdlePromptText) return;
      let index = Math.floor(Math.random() * ALVE_IDLE_WORLD_PROMPTS.length);
      if (ALVE_IDLE_WORLD_PROMPTS.length > 1 && index === this.lastAlveIdlePromptIndex) {
        index = (index + 1) % ALVE_IDLE_WORLD_PROMPTS.length;
      }
      this.lastAlveIdlePromptIndex = index;
      this.alveIdlePromptText.setText(ALVE_IDLE_WORLD_PROMPTS[index]);
      this.alveIdlePrompt.setVisible(true);
      this.alveIdlePromptHide?.remove(false);
      this.alveIdlePromptHide = this.time.delayedCall(3200, () => {
        this.alveIdlePrompt?.setVisible(false);
        this.alveIdlePromptHide = undefined;
      });
    }

    private updateAlveInteractionFeedback() {
      if (!this.player || !this.alveEntity || !this.alveNearbyPrompt) return;
      const nearby = requestedAlveTurnInAvailable
        && this.alveEntity.visible
        && Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.alveEntity.x,
          this.alveEntity.y,
        ) <= 135;
      this.alveNearbyPrompt.setVisible(nearby);
      if (nearby && this.moveTarget) {
        const targetDistance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.moveTarget.x,
          this.moveTarget.y,
        );
        if (targetDistance < 18) {
          this.moveTarget = null;
          this.facePlayerTowardAlve();
        }
      }
    }

    private facePlayerTowardAlve() {
      if (!this.player || !this.alveEntity) return;
      this.player.setFlipX(this.alveEntity.x > this.player.x);
    }

    private isWalkable(x: number, y: number) {
      const radiusX = ACT2_PLAYER_FOOT_RADIUS.x;
      const radiusY = ACT2_PLAYER_FOOT_RADIUS.y;
      if (
        x < 37 + radiusX
        || x > ACT2_WORLD.width - 37 - radiusX
        || y < 300 + radiusY
        || y > ACT2_WORLD.height - 8 - radiusY
      ) return false;

      // The accepted lake master is the collision authority for water.
      // Sample around the player's feet so bays and curved shoreline follow the
      // actual artwork instead of a second hand-maintained geometry map.
      if (this.isWaterAt(x, y + radiusY)) return false;
      if (this.isWaterAt(x - radiusX * 0.6, y + radiusY * 0.75)) return false;
      if (this.isWaterAt(x + radiusX * 0.6, y + radiusY * 0.75)) return false;

      return !PROJECTS.some((project) => {
        const p = ACT2_VISUAL_PLACEMENTS[project];
        const halfW = p.footprint.width / 2 + radiusX;
        const halfH = p.footprint.height / 2 + radiusY;
        return x >= p.x - halfW && x <= p.x + halfW &&
          y >= p.baseY - halfH && y <= p.baseY + halfH;
      });
    }

    private isWaterAt(x: number, y: number) {
      const pixel = this.textures.getPixel(
        Math.round(Phaser.Math.Clamp(x, 0, ACT2_WORLD.width - 1)),
        Math.round(Phaser.Math.Clamp(y, 0, ACT2_WORLD.height - 1)),
        "act2-lake-master",
      );
      if (!pixel) return false;

      const maxRB = Math.max(pixel.red, pixel.blue);
      const blueLead = pixel.blue - pixel.red;
      const blueOverGreen = pixel.blue - pixel.green;

      // Lake pixels in the accepted master are blue/cyan. Requiring both a
      // strong blue channel and a meaningful lead over red avoids treating
      // neutral rocks, paths and dark forest shadows as water.
      return pixel.blue >= 105
        && maxRB >= 120
        && blueLead >= 22
        && blueOverGreen >= -12;
    }

    setStage(stage: Act2VisualStage) {
      requestedStage = stage;
      requestedProjectStages = {};
      for (const project of PROJECTS) {
        this.projectImages.get(project)?.setTexture(this.textureKey(project, stage));
      }
    }

    setProjectStages(stages: Partial<Record<Act2RestorationProject, 0 | Act2VisualStage>>) {
      requestedProjectStages = { ...stages };
      for (const project of PROJECTS) {
        const stage = this.renderStage(stages[project] ?? requestedStage);
        this.projectImages.get(project)?.setTexture(this.textureKey(project, stage));
      }
    }

    setActiveProject(project: Act2RestorationProject | null) {
      requestedActiveProject = project;
      this.positionAlve(project);
    }

    setAlvePresent(present: boolean) {
      requestedAlvePresent = present;
      this.alveEntity?.setVisible(present);
      if (!present) {
        this.alveTurnInMarker?.setVisible(false);
        this.alveNearbyPrompt?.setVisible(false);
        this.alveIdlePrompt?.setVisible(false);
        this.moveTarget = null;
      } else {
        this.positionAlve(requestedActiveProject);
        this.alveTurnInMarker?.setVisible(requestedAlveTurnInAvailable);
      }
    }

    setAlveTurnInAvailable(available: boolean) {
      requestedAlveTurnInAvailable = available;
      this.alveTurnInMarker?.setVisible(available && requestedAlvePresent);
      if (!available) this.alveNearbyPrompt?.setVisible(false);
      if (available) this.alveIdlePrompt?.setVisible(false);
    }

    setCabinRevisitAvailable(available: boolean) {
      requestedCabinRevisitAvailable = available;
    }

    setWorldInputEnabled(enabled: boolean) {
      requestedWorldInputEnabled = enabled;
      if (!enabled) this.moveTarget = null;
    }

    private positionAlve(project: Act2RestorationProject | null) {
      if (!this.alveEntity) return;
      const position = project ? ACT2_ALVE_WORK_POSITIONS[project] : ACT2_ALVE_IDLE_POSITION;
      this.alveEntity
        .setPosition(position.x, position.y)
        .setDepth(1000 + Math.round(position.y))
        .setVisible(requestedAlvePresent);
    }

    private renderStage(stage: 0 | Act2VisualStage): Act2VisualStage {
      // Act 2 stage 1 art is the accepted damaged/initial state.
      // Persisted stage 0 means "not yet advanced", so it intentionally renders as 1/4.
      return stage === 0 ? 1 : stage;
    }

    private textureKey(project: Act2RestorationProject, stage: Act2VisualStage) {
      return `act2-${project}-${stage}`;
    }
  }

  const gameInstance = new Phaser.Game({
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
    scene: Act2LakeScene,
  });

  return {
    destroy: () => gameInstance.destroy(true),
    setStage: (stage) => {
      requestedStage = stage;
      requestedProjectStages = {};
      if (gameInstance.scene.isActive("Act2LakeScene")) {
        (gameInstance.scene.getScene("Act2LakeScene") as Act2LakeScene).setStage(stage);
      }
    },
    setProjectStages: (stages) => {
      requestedProjectStages = { ...stages };
      if (gameInstance.scene.isActive("Act2LakeScene")) {
        (gameInstance.scene.getScene("Act2LakeScene") as Act2LakeScene).setProjectStages(stages);
      }
    },
    setActiveProject: (project) => {
      requestedActiveProject = project;
      if (gameInstance.scene.isActive("Act2LakeScene")) {
        (gameInstance.scene.getScene("Act2LakeScene") as Act2LakeScene).setActiveProject(project);
      }
    },
    setAlvePresent: (present) => {
      requestedAlvePresent = present;
      if (gameInstance.scene.isActive("Act2LakeScene")) {
        (gameInstance.scene.getScene("Act2LakeScene") as Act2LakeScene).setAlvePresent(present);
      }
    },
    setAlveTurnInAvailable: (available) => {
      requestedAlveTurnInAvailable = available;
      if (gameInstance.scene.isActive("Act2LakeScene")) {
        (gameInstance.scene.getScene("Act2LakeScene") as Act2LakeScene).setAlveTurnInAvailable(available);
      }
    },
    setCabinRevisitAvailable: (available) => {
      requestedCabinRevisitAvailable = available;
      if (gameInstance.scene.isActive("Act2LakeScene")) {
        (gameInstance.scene.getScene("Act2LakeScene") as Act2LakeScene).setCabinRevisitAvailable(available);
      }
    },
    setWorldInputEnabled: (enabled) => {
      requestedWorldInputEnabled = enabled;
      if (gameInstance.scene.isActive("Act2LakeScene")) {
        (gameInstance.scene.getScene("Act2LakeScene") as Act2LakeScene).setWorldInputEnabled(enabled);
      }
    },
  };
}
