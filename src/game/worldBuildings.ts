export type WorldPoint = { x: number; y: number };

export type WorldRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BuildingStage = 1 | 2 | 3 | 4;

/**
 * Rendering geometry is deliberately independent from collision and interaction.
 * Painted 2.5D assets contain roofs, shadows and transparent pixels that must never
 * be treated as the physical footprint of the building.
 */
export type PaintedBuildingDefinition = {
  id: "recycling-center" | "bakery" | "clinic";
  textureKey: (stage: BuildingStage) => string;
  assetPath: (stage: BuildingStage) => string;
  render: {
    x: number;
    y: number;
    originX: number;
    originY: number;
    scale: number;
    baseY: number;
  };
  collision: WorldRect;
  approachPoints: readonly WorldPoint[];
};

export const RECYCLING_CENTER: PaintedBuildingDefinition = {
  id: "recycling-center",
  textureKey: (stage) => `recycling-stage-${stage}`,
  assetPath: (stage) => `/assets/village/buildings/recycling/recycling-stage-${stage}.webp`,
  render: {
    // Reuses the existing construction site's ground anchor for the first v4 proof.
    x: 675,
    y: 455,
    originX: 0.5,
    originY: 1,
    scale: 0.62,
    baseY: 455,
  },
  collision: {
    x: 675,
    y: 405,
    width: 180,
    height: 105,
  },
  approachPoints: [
    { x: 570, y: 455 },
    { x: 785, y: 455 },
    { x: 675, y: 520 },
  ],
};

export const PAINTED_BUILDINGS = [RECYCLING_CENTER] as const;
