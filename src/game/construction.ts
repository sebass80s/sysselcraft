import type { ProgressionState } from "./quests";
import { createInitialMvpBuildingStages, deriveRecyclingCenterStage, normalizeBuildingStage, type BuildingStage, type MvpBuildingId, type MvpBuildingStages } from "./worldProgression";

export type ConstructionReveal = {
  id: string;
  building: MvpBuildingId;
  stage: Exclude<BuildingStage, 0>;
  resident: string;
  residentName: string;
  dialogue: readonly { speaker: string; text: string }[];
  presentation: "delivery" | "construction";
};

// Authored reveal content, not progression thresholds. More residents/buildings can use this queue.
export const CONSTRUCTION_REVEALS: readonly ConstructionReveal[] = [{
  id: "recycling:1", building: "recycling", stage: 1, resident: "linus", residentName: "Linus",
  dialogue: [{ speaker: "Linus", text: "Du, kom hit ett slag. Det har hänt något här som jag tror att du vill se." }],
  presentation: "delivery",
}, {
  id: "recycling:2", building: "recycling", stage: 2, resident: "linus", residentName: "Linus",
  dialogue: [{ speaker: "Linus", text: "Du, kom hit igen. Det har hänt något här sedan sist." }],
  presentation: "construction",
}, {
  id: "recycling:3", building: "recycling", stage: 3, resident: "linus", residentName: "Linus",
  dialogue: [{ speaker: "Linus", text: "Jag tror du vill komma och se vad som har hänt här." }],
  presentation: "construction",
}, {
  id: "recycling:4", building: "recycling", stage: 4, resident: "linus", residentName: "Linus",
  dialogue: [{ speaker: "Linus", text: "Kom hit när du har en stund. Det finns något här som du borde få se själv." }],
  presentation: "construction",
}, {
  id: "bakery:1", building: "bakery", stage: 1, resident: "henning", residentName: "Henning",
  dialogue: [
    { speaker: "Henning", text: "Nu vet jag vad som saknas." },
    { speaker: "Barnet", text: "Vadå?" },
    { speaker: "Henning", text: "Ett bageri. Det fanns ett här en gång. Jag trodde inte att det skulle gå att få liv i det igen." },
    { speaker: "Henning", text: "Men efter att ha sett vad du har gjort med den här byn... börjar jag tro att jag hade fel." },
    { speaker: "Barnet", text: "Kan vi bygga upp det igen?" },
    { speaker: "Henning", text: "Det var precis det jag hoppades att du skulle säga." },
  ],
  presentation: "construction",
}, {
  id: "bakery:2", building: "bakery", stage: 2, resident: "henning", residentName: "Henning",
  dialogue: [
    { speaker: "Henning", text: "Kom och titta!" },
    { speaker: "Barnet", text: "Det börjar ju se ut som ett bageri!" },
    { speaker: "Henning", text: "Ja. Det händer saker när du är i farten." },
    { speaker: "Henning", text: "Fortsätter vi så här kanske jag snart måste leta fram mina gamla recept." },
  ],
  presentation: "construction",
}, {
  id: "bakery:3", building: "bakery", stage: 3, resident: "henning", residentName: "Henning",
  dialogue: [
    { speaker: "Henning", text: "Kom, jag måste visa dig en sak." },
    { speaker: "Barnet", text: "Wow! Det är nästan färdigt!" },
    { speaker: "Henning", text: "Jag vet. När jag kom hit tänkte jag mest att det skulle vara roligt att träffa Linus igen." },
    { speaker: "Henning", text: "Nu står jag här och planerar ett bageri." },
    { speaker: "Barnet", text: "Är det mitt fel?" },
    { speaker: "Henning", text: "Helt och hållet. Och jag är väldigt glad för det." },
  ],
  presentation: "construction",
}, {
  id: "bakery:4", building: "bakery", stage: 4, resident: "henning", residentName: "Henning",
  dialogue: [
    { speaker: "Henning", text: "Kom hit. Det här vill jag att du ska få se först." },
    { speaker: "Barnet", text: "Är vi nästan klara nu?" },
    { speaker: "Henning", text: "Nästan. En sista kraftansträngning, sedan kan vi öppna dörrarna. Det här har vi byggt tillsammans." },
  ],
  presentation: "construction",
}, {
  id: "clinic:2", building: "clinic", stage: 2, resident: "sol", residentName: "Sol",
  dialogue: [{ speaker: "Sol", text: "Nu börjar jag faktiskt kunna se det framför mig." }], presentation: "construction",
}, {
  id: "clinic:3", building: "clinic", stage: 3, resident: "sol", residentName: "Sol",
  dialogue: [{ speaker: "Sol", text: "Titta! Snart kan vi öppna." }], presentation: "construction",
}, {
  id: "clinic:4", building: "clinic", stage: 4, resident: "sol", residentName: "Sol",
  dialogue: [{ speaker: "Sol", text: "Vi gjorde det! Nu har byn en klinik." }], presentation: "construction",
}];

export const CLINIC_CONTRIBUTION_THRESHOLDS = [0, 2, 4, 8] as const;

export function startClinicConstruction(state: ConstructionState): ConstructionState {
  if (state.revealed.clinic > 0 || state.earned.clinic > 0) return state;
  return normalizeConstruction({ ...state, earned: { ...state.earned, clinic: 1 }, revealed: { ...state.revealed, clinic: 1 } });
}

export function syncClinicContributionProgress(state: ConstructionState, authoritativeWorldProgression: number, clinicBaseline: number): ConstructionState {
  if (state.revealed.clinic < 1 || state.revealed.clinic >= 4 || state.pending.some(id => id.startsWith("clinic:"))) return state;
  const contributions = Math.max(0, Math.floor(authoritativeWorldProgression) - Math.floor(clinicBaseline));
  const target: BuildingStage = contributions >= 8 ? 4 : contributions >= 4 ? 3 : contributions >= 2 ? 2 : 1;
  const nextStage = (state.revealed.clinic + 1) as BuildingStage;
  return target >= nextStage ? earnConstruction(state, `clinic:${nextStage}`) : state;
}

export const BAKERY_CONTRIBUTION_THRESHOLDS = [1, 3, 7, 10] as const;

/**
 * Bakery pacing is locked to 1-2-4-3 real quest turn-ins across stages 1-4.
 * The input is the number of authoritative child claims since the Bakery arc began,
 * never approvals or submissions. This pure rule deliberately does not decide how
 * the local save establishes its backend baseline; state ownership remains explicit.
 */
export function deriveBakeryStageFromContributions(contributionsSinceBakeryStart: number): BuildingStage {
  const count = Math.max(0, Math.floor(Number.isFinite(contributionsSinceBakeryStart) ? contributionsSinceBakeryStart : 0));
  if (count >= BAKERY_CONTRIBUTION_THRESHOLDS[3]) return 4;
  if (count >= BAKERY_CONTRIBUTION_THRESHOLDS[2]) return 3;
  if (count >= BAKERY_CONTRIBUTION_THRESHOLDS[1]) return 2;
  if (count >= BAKERY_CONTRIBUTION_THRESHOLDS[0]) return 1;
  return 0;
}

export const RECYCLING_COMPLETION_BEAT = "recycling:completion" as const;
export const BAKERY_COMPLETION_BEAT = "bakery:completion" as const;
export type ConstructionStoryBeat = typeof RECYCLING_COMPLETION_BEAT | typeof BAKERY_COMPLETION_BEAT;

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
  const storyBeats = Array.isArray(candidate.completedStoryBeats) ? candidate.completedStoryBeats : [];
  result.completedStoryBeats = [
    ...(storyBeats.includes(RECYCLING_COMPLETION_BEAT) ? [RECYCLING_COMPLETION_BEAT] : []),
    ...(storyBeats.includes(BAKERY_COMPLETION_BEAT) ? [BAKERY_COMPLETION_BEAT] : []),
  ];
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
export function bakeryContributionOffsetForStage(stage: BuildingStage): number {
  if (stage <= 0) return 0;
  return BAKERY_CONTRIBUTION_THRESHOLDS[stage - 1];
}

export function syncRecyclingContributionProgress(state: ConstructionState, authoritativeWorldProgression: number): ConstructionState {
  if (state.revealed.recycling >= 4 || state.pending.some(id => id.startsWith("recycling:"))) return state;
  const target = Math.min(4, Math.max(0, Math.floor(authoritativeWorldProgression))) as BuildingStage;
  const nextStage = (state.revealed.recycling + 1) as BuildingStage;
  return target >= nextStage ? earnConstruction(state, `recycling:${nextStage}`) : state;
}

export function syncBakeryContributionProgress(
  state: ConstructionState,
  authoritativeWorldProgression: number,
  bakeryClaimBaseline: number,
  bakeryClaimBaselineStage: BuildingStage = 0,
): ConstructionState {
  if (state.revealed.bakery >= 4 || state.pending.some(id => id.startsWith("bakery:"))) return state;
  const claimsSinceBaseline = Math.max(0, Math.floor(authoritativeWorldProgression) - Math.floor(bakeryClaimBaseline));
  const effectiveContributions = bakeryContributionOffsetForStage(bakeryClaimBaselineStage) + claimsSinceBaseline;
  const target = deriveBakeryStageFromContributions(effectiveContributions);
  const nextStage = (state.revealed.bakery + 1) as BuildingStage;
  return target >= nextStage ? earnConstruction(state, `bakery:${nextStage}`) : state;
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


export function bakeryCompletionPending(state: ConstructionState): boolean {
  return state.revealed.bakery >= 4 && !state.completedStoryBeats.includes(BAKERY_COMPLETION_BEAT);
}

export function commitBakeryCompletion(state: ConstructionState): ConstructionState {
  if (!bakeryCompletionPending(state)) return state;
  return normalizeConstruction({ ...state, completedStoryBeats: [...state.completedStoryBeats, BAKERY_COMPLETION_BEAT] });
}
