import type { GameObjects, Input, Types } from "phaser";
import {
  ACT2_VISUAL_ASSETS,
  ACT2_VISUAL_PLACEMENTS,
  ACT2_WORLD,
  getAct2DisplaySize,
  type Act2RestorationProject,
  type Act2VisualStage,
} from "./act2VisualAssets";

export type Act2LakeGameHandle = {
  destroy: () => void;
  setStage: (stage: Act2VisualStage) => void;
  setProjectStages: (stages: Partial<Record<Act2RestorationProject, 0 | Act2VisualStage>>) => void;
};

const PROJECTS: Act2RestorationProject[] = ["cabin", "boathouse", "dock", "motorboat"];
const VIEW_HEIGHT = 640;

export async function createAct2LakeGame(
  parent: HTMLElement,
  initialStage: Act2VisualStage = 1,
): Promise<Act2LakeGameHandle> {
  const Phaser = await import("phaser");
  let requestedStage = initialStage;
  let requestedProjectStages: Partial<Record<Act2RestorationProject, 0 | Act2VisualStage>> = {};

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
      }

      // Acceptance spawn only. Story entry/exit points remain deliberately undefined
      // until the authored Act 2 transition is wired.
      this.player = this.add.image(930, 585, "act2-child")
        .setOrigin(0.5, 0.94)
        .setDisplaySize(74, 118)
        .setDepth(1585);
      this.dog = this.add.image(865, 600, "act2-dog")
        .setOrigin(0.5, 0.88)
        .setDisplaySize(66, 55)
        .setDepth(1600);

      camera.centerOn(this.player.x, this.player.y);
      camera.startFollow(this.player, true, 0.08, 0.08);
      camera.setDeadzone(Math.min(340, viewWidth * 0.32), 180);

      this.input.on("pointerdown", (pointer: Input.Pointer) => {
        if (!this.player) return;
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
        this.player.setFlipX(dx < 0);
        this.player.setDepth(1000 + Math.round(this.player.y));
      }

      if (this.dog) {
        const desiredX = this.player.x - (this.player.flipX ? -54 : 54);
        const desiredY = this.player.y + 18;
        this.dog.x += (desiredX - this.dog.x) * Math.min(1, delta / 220);
        this.dog.y += (desiredY - this.dog.y) * Math.min(1, delta / 220);
        this.dog.setDepth(1000 + Math.round(this.dog.y));
      }
    }

    private isWalkable(x: number, y: number) {
      if (x < 37 || x > ACT2_WORLD.width - 37 || y < 300 || y > ACT2_WORLD.height - 8) return false;
      return !PROJECTS.some((project) => {
        const p = ACT2_VISUAL_PLACEMENTS[project];
        const halfW = p.footprint.width / 2 + 24;
        const halfH = p.footprint.height / 2 + 18;
        return x >= p.x - halfW && x <= p.x + halfW &&
          y >= p.baseY - halfH && y <= p.baseY + halfH;
      });
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
  };
}
