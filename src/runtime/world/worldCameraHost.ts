import { WORLD_CAMERA, worldCameraDeadzone } from "./worldCamera";

export const WORLD_CAMERA_BACKGROUND_COLOR = WORLD_CAMERA.backgroundColor;

export type WorldCameraBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WorldCameraTarget = {
  x: number;
  y: number;
};

export type WorldCameraAdapter = {
  setBackgroundColor: (color: number | string) => unknown;
  setBounds: (x: number, y: number, width: number, height: number) => unknown;
  centerOn: (x: number, y: number) => unknown;
  startFollow: (target: WorldCameraTarget, roundPixels: boolean, lerpX: number, lerpY: number) => unknown;
  setDeadzone: (width: number, height: number) => unknown;
};

export function configureWorldCamera(
  camera: WorldCameraAdapter,
  bounds: WorldCameraBounds,
  target: WorldCameraTarget,
  viewWidth: number,
) {
  camera.setBackgroundColor(WORLD_CAMERA.backgroundColor);
  camera.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
  camera.centerOn(target.x, target.y);
  camera.startFollow(target, true, WORLD_CAMERA.followLerpX, WORLD_CAMERA.followLerpY);
  const deadzone = worldCameraDeadzone(viewWidth);
  camera.setDeadzone(deadzone.width, deadzone.height);
}
