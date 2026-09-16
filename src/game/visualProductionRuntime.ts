import type Phaser from "phaser";
import {
  VISUAL_PRODUCTION_PLACEMENTS, VISUAL_PRODUCTION_ORIGIN,
  OPENING_BUILDING_STAGES, getVisualProductionAsset, getVisualProductionTextureKey,
  type VisualProductionStage,
} from "./visualProductionAssets";

/** Assets are available to the real scene; domain progression still owns visibility. */
export function preloadVisualProductionBuildings(scene: Phaser.Scene) {
  for (const placement of VISUAL_PRODUCTION_PLACEMENTS) {
    for (const stage of [1, 2, 3, 4] as const) {
      scene.load.image(getVisualProductionTextureKey(placement.building, stage),
        getVisualProductionAsset(placement.building, stage));
    }
  }
}

export function createVisualProductionBuildings(scene: Phaser.Scene, stages = OPENING_BUILDING_STAGES) {
  return VISUAL_PRODUCTION_PLACEMENTS.flatMap((placement) => {
    const stage: VisualProductionStage | undefined = stages[placement.building];
    if (!stage) return [];
    return [scene.add.image(placement.x, placement.baseY,
      getVisualProductionTextureKey(placement.building, stage))
      .setOrigin(VISUAL_PRODUCTION_ORIGIN.x, VISUAL_PRODUCTION_ORIGIN.y)
      .setDisplaySize(placement.width, placement.height)
      .setDepth(1000 + Math.round(placement.baseY))];
  });
}
