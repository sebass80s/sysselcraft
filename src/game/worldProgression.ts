import type { ProgressionState } from "./quests";

export type RecyclingCenterStage = 0 | 1 | 2 | 3 | 4;

const FIRST_RECYCLING_CENTER_DELIVERY_THRESHOLD = 0.7;

/**
 * Only stage 1 is derived automatically today. Stages 2-4 are deliberately
 * representable now so the painted building pipeline does not need another
 * state-model rewrite when the post-PoC construction arc is connected.
 *
 * Do not infer later stages from currency or arbitrary progression totals.
 * Those stages must be advanced by explicit approved real-world efforts.
 */
export function deriveRecyclingCenterStage(
  progression: ProgressionState,
): RecyclingCenterStage {
  return progression.orderEnvironment + Number.EPSILON >=
    FIRST_RECYCLING_CENTER_DELIVERY_THRESHOLD
    ? 1
    : 0;
}

function isRecyclingCenterStage(value: unknown): value is RecyclingCenterStage {
  return value === 0 || value === 1 || value === 2 || value === 3 || value === 4;
}

export function normalizeRecyclingCenterStage(
  value: unknown,
  progression: ProgressionState,
): RecyclingCenterStage {
  const derived = deriveRecyclingCenterStage(progression);
  const persisted: RecyclingCenterStage = isRecyclingCenterStage(value) ? value : 0;
  return Math.max(derived, persisted) as RecyclingCenterStage;
}

export function getRecyclingCenterStatus(stage: RecyclingCenterStage) {
  switch (stage) {
    case 4:
      return {
        title: "Återvinningscentralen",
        status: "Återvinningscentralen är färdig.",
      } as const;
    case 3:
      return {
        title: "Återvinningscentralen",
        status: "Bygget börjar verkligen ta form.",
      } as const;
    case 2:
      return {
        title: "Återvinningscentralen",
        status: "Arbetet fortsätter på platsen.",
      } as const;
    case 1:
      return {
        title: "Återvinningscentralen",
        status: "Första materialleveransen är på plats.",
      } as const;
    default:
      return {
        title: "Återvinningscentralen",
        status: "Bygget har inte börjat ännu.",
      } as const;
  }
}
