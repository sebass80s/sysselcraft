import type { ProgressionState } from "./quests";
import { createInitialMvpBuildingStages, deriveRecyclingCenterStage, normalizeBuildingStage, type BuildingStage, type MvpBuildingId, type MvpBuildingStages } from "./worldProgression";

export type ConstructionReveal = {
  id: string;
  building: MvpBuildingId;
  stage: Exclude<BuildingStage, 0>;
  resident: string;
  residentName: string;
  dialogue: string;
  presentation: "delivery" | "construction";
};

// Authored reveal content, not progression thresholds. More residents/buildings can use this queue.
export const CONSTRUCTION_REVEALS: readonly ConstructionReveal[] = [{
  id: "recycling:1", building: "recycling", stage: 1, resident: "linus", residentName: "Linus",
  dialogue: "Kom och titta! Nu kan vi ta emot den första leveransen till återvinningscentralen.",
  presentation: "delivery",
}, {
  id: "recycling:2", building: "recycling", stage: 2, resident: "linus", residentName: "Linus",
  dialogue: "Kom och titta! Nu är det dags för nästa steg på återvinningscentralen.",
  presentation: "construction",
}];
export type ConstructionState = {
  earned: MvpBuildingStages;
  revealed: MvpBuildingStages;
  pending: string[];
};
export function initialConstruction(): ConstructionState {
  return { earned: createInitialMvpBuildingStages(), revealed: createInitialMvpBuildingStages(), pending: [] };
}

/** Legacy stages were already visible. Never infer stage 2 from quest totals. */
export function normalizeConstruction(value: unknown, legacyVisible: BuildingStage = 0): ConstructionState {
  const result = initialConstruction();
  if (!value || typeof value !== "object") {
    result.earned.recycling = result.revealed.recycling = legacyVisible;
    return result;
  }
  const candidate = value as Partial<ConstructionState>;
  for (const building of Object.keys(result.earned) as MvpBuildingId[]) {
    result.revealed[building] = normalizeBuildingStage(candidate.revealed?.[building]);
    result.earned[building] = Math.max(result.revealed[building], normalizeBuildingStage(candidate.earned?.[building])) as BuildingStage;
  }
  // Canonical deterministic IDs repair missing/duplicate pending entries after reload.
  result.pending = CONSTRUCTION_REVEALS.filter(r => result.earned[r.building] >= r.stage && result.revealed[r.building] < r.stage).map(r => r.id);
  return result;
}

/** Reuse the existing approved progression rule; earning never reveals a building. */
export function syncConstructionProgression(state: ConstructionState, progression: ProgressionState): ConstructionState {
  return deriveRecyclingCenterStage(progression) >= 1 ? earnConstruction(state, "recycling:1") : state;
}
export function earnConstruction(state: ConstructionState, revealId: string): ConstructionState {
  const reveal = CONSTRUCTION_REVEALS.find(r => r.id === revealId);
  if (!reveal || state.revealed[reveal.building] !== reveal.stage - 1 || state.earned[reveal.building] >= reveal.stage) return state;
  return normalizeConstruction({ ...state, earned: { ...state.earned, [reveal.building]: reveal.stage } });
}
export function residentAttention(state: ConstructionState): ConstructionReveal | null {
  return CONSTRUCTION_REVEALS.find(r => r.id === state.pending[0] && state.revealed[r.building] === r.stage - 1) ?? null;
}
export function commitConstructionReveal(state: ConstructionState, id: string): ConstructionState {
  const reveal = residentAttention(state);
  if (!reveal || reveal.id !== id || state.earned[reveal.building] < reveal.stage) return state;
  return normalizeConstruction({ ...state, revealed: { ...state.revealed, [reveal.building]: reveal.stage } });
}
