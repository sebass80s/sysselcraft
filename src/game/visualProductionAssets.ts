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

export function getVisualProductionAsset(
  building: VisualProductionBuilding,
  stage: VisualProductionStage,
) {
  return VISUAL_PRODUCTION_ASSETS[building][stage - 1];
}
