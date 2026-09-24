export const VISUAL_PRODUCTION_ASSETS = {
  recycling: [
    "/assets/village/buildings/recycling/recycling-stage-1.webp",
    "/assets/village/buildings/recycling/recycling-stage-2.webp",
    "/assets/village/buildings/recycling/recycling-stage-3.webp",
    "/assets/village/buildings/recycling/recycling-stage-4.webp",
  ],
  bakery: [
    "/assets/village/buildings/bakery/bakery-stage-1.webp",
    "/assets/village/buildings/bakery/bakery-stage-2.webp",
    "/assets/village/buildings/bakery/bakery-stage-3.webp",
    "/assets/village/buildings/bakery/bakery-stage-4.webp",
  ],
  clinic: [
    "/assets/village/reboot/clinic-stage-1.webp",
    "/assets/village/reboot/clinic-stage-2.webp",
    "/assets/village/reboot/clinic-stage-3.webp",
    "/assets/village/reboot/clinic-stage-4.webp",
  ],
} as const;

export type VisualProductionBuilding = keyof typeof VISUAL_PRODUCTION_ASSETS;
export type VisualProductionStage = 1 | 2 | 3 | 4;

/** Stage 0 is visually absent and contributes no collision. */
export const OPENING_BUILDING_STAGES: Partial<Record<VisualProductionBuilding, VisualProductionStage>> = {};

export const VISUAL_PRODUCTION_PLACEMENTS = [
  {
    building: "recycling",
    x: -180,
    baseY: 500,
    width: 330,
    height: 236,
    footprint: { width: 190, height: 72 },
    approach: { x: -180, y: 558 },
    guidePosition: { x: -132, y: 570 },
  },
  {
    building: "bakery",
    x: 835,
    baseY: 305,
    width: 330,
    height: 295,
    footprint: { width: 205, height: 72 },
    approach: { x: 835, y: 363 },
    guidePosition: { x: 883, y: 375 },
  },
  {
    building: "clinic",
    x: 1190,
    baseY: 515,
    width: 350,
    height: 279,
    footprint: { width: 205, height: 72 },
    approach: { x: 1050, y: 515 },
    guidePosition: { x: 1098, y: 527 },
  },
] as const;

// Normalized production canvases retain the production ground anchor across all stages.
export const VISUAL_PRODUCTION_ORIGIN = { x: 0.5, y: 0.92 } as const;

export function getVisualProductionObstacles(stages = OPENING_BUILDING_STAGES) {
  return VISUAL_PRODUCTION_PLACEMENTS.filter(p => stages[p.building]).map(p => ({
    type: "rect" as const, x: p.x, y: p.baseY,
    width: p.footprint.width, height: p.footprint.height,
  }));
}

export function getVisualProductionAsset(
  building: VisualProductionBuilding,
  stage: VisualProductionStage,
) {
  return VISUAL_PRODUCTION_ASSETS[building][stage - 1];
}

export function getVisualProductionTextureKey(
  building: VisualProductionBuilding,
  stage: VisualProductionStage,
) {
  return `visual-production-${building}-${stage}`;
}
