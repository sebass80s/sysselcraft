export const WORLD_VIEW_HEIGHT = 640;
export const WORLD_MIN_VIEW_WIDTH = 960;

type WorldViewportSize = {
  width: number;
  height: number;
};

/**
 * Canonical playable-world viewport sizing.
 *
 * The authored world still owns its maximum width. Runtime owns the common
 * aspect-ratio projection and minimum render width used by current worlds.
 */
export function worldViewportSize(
  parentWidth: number,
  parentHeight: number,
  worldWidth: number,
): WorldViewportSize {
  const safeParentWidth = Math.max(parentWidth, 1);
  const safeParentHeight = Math.max(parentHeight, 1);
  return {
    width: Math.min(
      worldWidth,
      Math.max(
        WORLD_MIN_VIEW_WIDTH,
        Math.round(WORLD_VIEW_HEIGHT * (safeParentWidth / safeParentHeight)),
      ),
    ),
    height: WORLD_VIEW_HEIGHT,
  };
}
