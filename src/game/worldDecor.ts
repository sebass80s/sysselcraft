export type AmbientWorldObject = {
  x: number;
  y: number;
  texture: AmbientTextureKey;
  scale?: number;
  originY?: number;
  baseY?: number;
};

export type AmbientTextureKey =
  | "tree-stump"
  | "wheelbarrow"
  | "old-barrel"
  | "puddle"
  | "birdhouse"
  | "laundry-line";

export const AMBIENT_TEXTURE_KEYS: AmbientTextureKey[] = [
  "tree-stump",
  "wheelbarrow",
  "old-barrel",
  "puddle",
  "birdhouse",
  "laundry-line",
];

/**
 * First conservative layout pass for the opening village.
 *
 * These placements deliberately avoid the family-house approach, Linus interaction point,
 * primary road/path corridor and construction footprint. They are visual-only until a real
 * browser/native playtest says otherwise. Collision must not be inferred from rendered bounds.
 */
export const OPENING_AMBIENT_OBJECTS: AmbientWorldObject[] = [
  // Family-house life: present, but not cluttering the front door/quest route.
  { x: 8, y: 238, texture: "laundry-line", scale: 0.82, baseY: 248 },
  { x: 278, y: 198, texture: "birdhouse", scale: 0.72, baseY: 205 },

  // Existing practical clutter near storage rather than introducing a new destination.
  { x: 12, y: 365, texture: "old-barrel", scale: 0.72, baseY: 373 },

  // Construction-site hint, kept outside the known collision rectangle at x=675/y=405.
  { x: 790, y: 382, texture: "wheelbarrow", scale: 0.78, baseY: 392 },

  // Quiet environmental traces at the edges.
  { x: -278, y: 468, texture: "tree-stump", scale: 0.82, baseY: 475 },
  { x: 1238, y: 252, texture: "tree-stump", scale: 0.74, baseY: 260 },

  // Ground decal kept off the main road and interaction corridor.
  { x: 1045, y: 430, texture: "puddle", scale: 0.86, originY: 0.5, baseY: 28 },
];
