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
};

const PROJECTS: Act2RestorationProject[] = ["cabin", "boathouse", "dock", "motorboat"];
const VIEW_HEIGHT = 640;

export async function createAct2LakeGame(
  parent: HTMLElement,
  initialStage: Act2VisualStage = 1,
): Promise<Act2LakeGameHandle> {
  const Phaser = await import("phaser");
  let requestedStage = initialStage;

  const parentWidth = Math.max(parent.clientWidth, 1);
  const parentHeight = Math.max(parent.clientHeight, 1);
  const viewWidth = Math.min(
    ACT2_WORLD.width,
    Math.max(960, Math.round(VIEW_HEIGHT * (parentWidth / parentHeight))),
  );

  class Act2LakeScene extends Phaser.Scene {
    private projectImages = new Map<Act2RestorationProject, GameObjects.Image>();
    private player?: GameObjects.Image;
    private cursors?: Types.Input.Keyboard.CursorKeys;
    private wasd?: Record<"up" | "down" | "left" | "right", Input.Keyboard.Key>;

    constructor() {
      super("Act2LakeScene");
    }

    preload() {
      this.load.image("act2-lake-master", ACT2_WORLD.master);
      this.load.image("act2-child", "/assets/village/reboot/child.webp");
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
        const image = this.add.image(
          placement.x,
          placement.baseY,
          this.textureKey(project, requestedStage),
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

      camera.centerOn(this.player.x, this.player.y);
      camera.startFollow(this.player, true, 0.08, 0.08);
      camera.setDeadzone(Math.min(340, viewWidth * 0.32), 180);

      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
          up: "W", down: "S", left: "A", right: "D",
        }) as Record<"up" | "down" | "left" | "right", Input.Keyboard.Key>;
      }
    }

    update(_time: number, delta: number) {
      if (!this.player || !this.cursors || !this.wasd) return;
      const left = this.cursors.left.isDown || this.wasd.left.isDown;
      const right = this.cursors.right.isDown || this.wasd.right.isDown;
      const up = this.cursors.up.isDown || this.wasd.up.isDown;
      const down = this.cursors.down.isDown || this.wasd.down.isDown;
      let dx = Number(right) - Number(left);
      let dy = Number(down) - Number(up);
      if (!dx && !dy) return;
      const length = Math.hypot(dx, dy);
      dx /= length;
      dy /= length;
      const speed = 180 * delta / 1000;
      const nextX = Phaser.Math.Clamp(this.player.x + dx * speed, 37, ACT2_WORLD.width - 37);
      const nextY = Phaser.Math.Clamp(this.player.y + dy * speed, 59, ACT2_WORLD.height - 8);
      this.player.setPosition(nextX, nextY);
      this.player.setFlipX(dx < 0);
      this.player.setDepth(1000 + Math.round(nextY));
    }

    setStage(stage: Act2VisualStage) {
      requestedStage = stage;
      for (const project of PROJECTS) {
        this.projectImages.get(project)?.setTexture(this.textureKey(project, stage));
      }
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
      if (gameInstance.scene.isActive("Act2LakeScene")) {
        (gameInstance.scene.getScene("Act2LakeScene") as Act2LakeScene).setStage(stage);
      }
    },
  };
}
