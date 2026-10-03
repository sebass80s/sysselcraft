export const WORLD_CAMERA = {
  backgroundColor: "#789a68",
  followLerpX: 0.08,
  followLerpY: 0.08,
  deadzoneMaxWidth: 340,
  deadzoneWidthRatio: 0.32,
  deadzoneHeight: 180,
} as const;

export function worldCameraDeadzone(viewWidth: number) {
  return {
    width: Math.min(WORLD_CAMERA.deadzoneMaxWidth, viewWidth * WORLD_CAMERA.deadzoneWidthRatio),
    height: WORLD_CAMERA.deadzoneHeight,
  };
}
