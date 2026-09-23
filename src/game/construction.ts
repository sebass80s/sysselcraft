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
  dialogue: "Du, kom hit ett slag. Det har hänt något här som jag tror att du vill se.",
  presentation: "delivery",
}, {
  id: "recycling:2", building: "recycling", stage: 2, resident: "linus", residentName: "Linus",
  dialogue: "Du, kom hit igen. Det har hänt något här sedan sist.",
  presentation: "construction",
}, {
  id: "recycling:3", building: "recycling", stage: 3, resident: "linus", residentName: "Linus",
  dialogue: "Jag tror du vill komma och se vad som har hänt här.",
  presentation: "construction",
}, {
  id: "recycling:4", building: "recycling", stage: 4, resident: "linus", residentName: "Linus",
  dialogue: "Kom hit när du har en stund. Det finns något här som du borde få se själv.",
  presentation: "construction",
}, {
  id: "bakery:1", building: "bakery", stage: 1, resident: "henning", residentName: "Henning",
  dialogue: "Nu vet jag vad som saknas. Kom, jag vill visa dig en plats.",
  presentation: "construction",
}, {
  id: "bakery:2", building: "bakery", stage: 2, resident: "henning", residentName: "Henning",
  dialogue: "Kom och titta! Det börjar faktiskt likna något nu.",
  presentation: "construction",
}, {
  id: "bakery:3", building: "bakery", stage: 3, resident: "henning", residentName: "Henning",
  dialogue: "Vi är nära nu. Det är bara det sista som ska falla på plats.",
  presentation: "construction",
}, {
  id: "bakery:4", building: "bakery", stage: 4, resident: "henning", residentName: "Henning",
  dialogue: "Kom hit. Det här vill jag att du ska få se först.",
  presentation: "construction",
}];

export const RECYCLING_COMPLETION_BEAT = "recycling:completion" as const;
export type ConstructionStoryBeat = typeof RECYCLING_COMPLETION_BEAT;

export type ConstructionState = {
  earned: MvpBuildingStages;
  revealed: MvpBuildingStages;
  pending: string[];
  completedStoryBeats: ConstructionStoryBeat[];
};
export function initialConstruction(): ConstructionState {
  return {
    earned: createInitialMvpBuildingStages(),
    revealed: createInitialMvpBuildingStages(),
    pending: [],
    completedStoryBeats: [],
  };
}

/** Legacy stages were already visible. Never infer later stages from quest totals. */
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
  result.completedStoryBeats = Array.isArray(candidate.completedStoryBeats) && candidate.completedStoryBeats.includes(RECYCLING_COMPLETION_BEAT)
    ? [RECYCLING_COMPLETION_BEAT]
    : [];
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

export function recyclingCompletionPending(state: ConstructionState): boolean {
  return state.revealed.recycling >= 4 && !state.completedStoryBeats.includes(RECYCLING_COMPLETION_BEAT);
}

export function commitRecyclingCompletion(state: ConstructionState): ConstructionState {
  if (!recyclingCompletionPending(state)) return state;
  return normalizeConstruction({ ...state, completedStoryBeats: [...state.completedStoryBeats, RECYCLING_COMPLETION_BEAT] });
}
