import type Phaser from "phaser";

import {
  VISUAL_PRODUCTION_PLACEMENTS,
  VISUAL_PRODUCTION_STAGE,
  getVisualProductionAsset,
  getVisualProductionTextureKey,
} from "./visualProductionAssets";

/**
 * Isolated Stage 4 runtime integration for the current visual playtest.
 * Progression/quest ownership deliberately remains outside this module.
 */
export function preloadVisualProductionBuildings(scene: Phaser.Scene) {
  for (const placement of VISUAL_PRODUCTION_PLACEMENTS) {
    const key = getVisualProductionTextureKey(placement.building, VISUAL_PRODUCTION_STAGE);
    scene.load.image(key, getVisualProductionAsset(placement.building, VISUAL_PRODUCTION_STAGE));
  }
}

export function createVisualProductionBuildings(scene: Phaser.Scene) {
  return VISUAL_PRODUCTION_PLACEMENTS.map((placement) => {
    const key = getVisualProductionTextureKey(placement.building, VISUAL_PRODUCTION_STAGE);
    return scene.add
      .image(placement.x, placement.y, key)
      .setOrigin(0.5, 0.92)
      .setDisplaySize(placement.width, placement.height)
      .setDepth(1000 + Math.round(placement.y));
  });
}
