export const VISUAL_PRODUCTION_ASSETS = {
  recycling: [
    "/assets/village/reboot/recycling-stage-1.webp",
    "/assets/village/reboot/recycling-stage-2.webp",
    "/assets/village/reboot/recycling-stage-3.webp",
    "/assets/village/reboot/recycling-stage-4.webp",
  ],
  bakery: [
    "/assets/village/reboot/bakery-stage-1.webp",
    "/assets/village/reboot/bakery-stage-2.webp",
    "/assets/village/reboot/bakery-stage-3.webp",
    "/assets/village/reboot/bakery-stage-4.webp",
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

export const VISUAL_PRODUCTION_STAGE: VisualProductionStage = 4;

export const VISUAL_PRODUCTION_PLACEMENTS = [
  { building: "recycling", x: -110, y: 360, width: 260, height: 210 },
  { building: "bakery", x: 1080, y: 310, width: 285, height: 225 },
  { building: "clinic", x: 1190, y: 535, width: 260, height: 210 },
] as const satisfies readonly {
  building: VisualProductionBuilding;
  x: number;
  y: number;
  width: number;
  height: number;
}[];

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
