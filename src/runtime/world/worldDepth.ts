export const WORLD_ENTITY_DEPTH_BASE = 1000;

export function worldEntityDepth(y: number) {
  return WORLD_ENTITY_DEPTH_BASE + Math.round(y);
}
