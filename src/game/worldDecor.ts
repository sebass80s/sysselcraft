import type Phaser from "phaser";

export type AmbientWorldObject = {
  x: number;
  y: number;
  texture: AmbientTextureKey | "construction-stakes" | "tree-oak";
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

export type Stage4PlaytestBuilding = {
  key: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Temporary visual-only Stage 4 integration contract. These are intentionally not quest-owned
 * yet. Their rendered bounds are not collision bounds and must not be added to pathfinding until
 * the visual placement has passed the real-device playtest.
 */
export const STAGE4_PLAYTEST_BUILDINGS: Stage4PlaytestBuilding[] = [
  {
    key: "recycling-stage4-playtest",
    src: "/assets/village/reboot/recycling-stage-4.webp",
    x: -105,
    y: 365,
    width: 275,
    height: 220,
  },
  {
    key: "bakery-stage4-playtest",
    src: "/assets/village/reboot/bakery-stage-4.webp",
    x: 1085,
    y: 315,
    width: 310,
    height: 245,
  },
  {
    key: "clinic-stage4-playtest",
    src: "/assets/village/reboot/clinic-stage-4.webp",
    x: 1195,
    y: 540,
    width: 300,
    height: 235,
  },
];

export function preloadStage4PlaytestBuildings(scene: Phaser.Scene) {
  for (const building of STAGE4_PLAYTEST_BUILDINGS) {
    scene.load.image(building.key, building.src);
  }
}

export function createStage4PlaytestBuildings(scene: Phaser.Scene) {
  return STAGE4_PLAYTEST_BUILDINGS.map((building) =>
    scene.add.image(building.x, building.y, building.key)
      .setOrigin(0.5, 0.92)
      .setDisplaySize(building.width, building.height)
      .setDepth(1000 + Math.round(building.y)),
  );
}

/**
 * First conservative layout pass for the opening village.
 *
 * These placements deliberately avoid the family-house approach, Linus interaction point,
 * primary road/path corridor and construction footprint. They are visual-only until a real
 * browser/native playtest says otherwise. Collision must not be inferred from rendered bounds.
 */
export const OPENING_AMBIENT_OBJECTS: AmbientWorldObject[] = [
  { x: 8, y: 238, texture: "laundry-line", scale: 0.82, baseY: 248 },
  { x: 278, y: 198, texture: "birdhouse", scale: 0.72, baseY: 205 },
  { x: 12, y: 365, texture: "old-barrel", scale: 0.72, baseY: 373 },
  { x: 520, y: 430, texture: "tree-oak", scale: 0.95, baseY: 430 },
  { x: -278, y: 468, texture: "tree-stump", scale: 0.82, baseY: 475 },
  { x: 1238, y: 252, texture: "tree-stump", scale: 0.74, baseY: 260 },
  { x: 1045, y: 430, texture: "puddle", scale: 0.86, originY: 0.5, baseY: 28 },
];

/**
 * Props that should materialize together with the first delivery rather than telegraphing
 * construction before the child has earned the first visible world consequence.
 */
export const FIRST_DELIVERY_AMBIENT_OBJECTS: AmbientWorldObject[] = [];
