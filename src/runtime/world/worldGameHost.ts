import type { Types } from "phaser";
import { WORLD_CAMERA_BACKGROUND_COLOR } from "./worldCameraHost";

export type WorldGamePhaserModule = typeof import("phaser");

export type WorldGameViewport = {
  width: number;
  height: number;
};

export function createWorldGame(
  Phaser: WorldGamePhaserModule,
  parent: HTMLElement,
  viewport: WorldGameViewport,
  scene: Types.Core.GameConfig["scene"],
) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: viewport.width,
    height: viewport.height,
    backgroundColor: WORLD_CAMERA_BACKGROUND_COLOR,
    pixelArt: false,
    antialias: true,
    roundPixels: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: viewport.width,
      height: viewport.height,
    },
    scene,
  });
}
