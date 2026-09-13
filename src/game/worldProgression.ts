import type { ProgressionState } from "./quests";

export type RecyclingCenterStage = 0 | 1;

const FIRST_RECYCLING_CENTER_DELIVERY_THRESHOLD = 0.7;

export function deriveRecyclingCenterStage(
  progression: ProgressionState,
): RecyclingCenterStage {
  return progression.orderEnvironment + Number.EPSILON >=
    FIRST_RECYCLING_CENTER_DELIVERY_THRESHOLD
    ? 1
    : 0;
}

export function normalizeRecyclingCenterStage(
  value: unknown,
  progression: ProgressionState,
): RecyclingCenterStage {
  const derived = deriveRecyclingCenterStage(progression);
  const persisted: RecyclingCenterStage = value === 1 ? 1 : 0;
  return Math.max(derived, persisted) as RecyclingCenterStage;
}

export function getRecyclingCenterStatus(stage: RecyclingCenterStage) {
  if (stage >= 1) {
    return {
      title: "Återvinningscentralen",
      status: "Första materialleveransen är på plats.",
    } as const;
  }

  return {
    title: "Återvinningscentralen",
    status: "Bygget har inte börjat ännu.",
  } as const;
}
