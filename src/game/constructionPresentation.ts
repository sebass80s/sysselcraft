import { residentAttention, type ConstructionState } from "./construction";
import { VISUAL_PRODUCTION_PLACEMENTS, type VisualProductionBuilding, type VisualProductionStage } from "./visualProductionAssets";

export function constructionPresentation(state: ConstructionState) {
  const stages: Partial<Record<VisualProductionBuilding, VisualProductionStage>> = {};
  for (const placement of VISUAL_PRODUCTION_PLACEMENTS) {
    const stage = state.revealed[placement.building];
    if (stage > 0) stages[placement.building] = stage as VisualProductionStage;
  }
  const reveal = residentAttention(state);
  const placement = VISUAL_PRODUCTION_PLACEMENTS.find(p => p.building === reveal?.building);
  return {
    stages,
    attention: reveal && placement ? {
      id: reveal.id, resident: reveal.resident, presentation: reveal.presentation,
      approach: placement.approach,
      position: { x: placement.approach.x + 48, y: placement.approach.y + 12 },
    } : null,
  };
}
export type ConstructionPresentation = ReturnType<typeof constructionPresentation>;
