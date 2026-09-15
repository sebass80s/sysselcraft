import type { ProgressionState } from "./quests";

export type BuildingStage = 0 | 1 | 2 | 3 | 4;
export type MvpBuildingId = "recycling" | "bakery" | "clinic";
export type MvpBuildingStages = Record<MvpBuildingId, BuildingStage>;

const FIRST_RECYCLING_CENTER_DELIVERY_THRESHOLD = 0.7;

export function createInitialMvpBuildingStages(): MvpBuildingStages {
  return {
    recycling: 0,
    bakery: 0,
    clinic: 0,
  };
}

export function isBuildingStage(value: unknown): value is BuildingStage {
  return Number.isInteger(value) && typeof value === "number" && value >= 0 && value <= 4;
}

export function normalizeBuildingStage(value: unknown): BuildingStage {
  return isBuildingStage(value) ? value : 0;
}

/**
 * Stage 1 is the only recycling stage that currently has a locked automatic derivation.
 * Stages 2-4 are deliberately persisted/explicit until their real-world effort rules are
 * product-approved. This keeps the domain capable of representing the full construction arc
 * without quietly inventing thresholds.
 */
export function deriveRecyclingCenterStage(
  progression: ProgressionState,
): BuildingStage {
  return progression.orderEnvironment + Number.EPSILON >=
    FIRST_RECYCLING_CENTER_DELIVERY_THRESHOLD
    ? 1
    : 0;
}

export function normalizeRecyclingCenterStage(
  value: unknown,
  progression: ProgressionState,
): BuildingStage {
  const derived = deriveRecyclingCenterStage(progression);
  const persisted = normalizeBuildingStage(value);
  return Math.max(derived, persisted) as BuildingStage;
}

/**
 * Restores the three locked opening-area construction arcs without deriving any unapproved
 * bakery/clinic progress. The renderer can consume this state, but must never own it.
 */
export function normalizeMvpBuildingStages(
  value: Partial<Record<MvpBuildingId, unknown>> | null | undefined,
  progression: ProgressionState,
): MvpBuildingStages {
  return {
    recycling: normalizeRecyclingCenterStage(value?.recycling, progression),
    bakery: normalizeBuildingStage(value?.bakery),
    clinic: normalizeBuildingStage(value?.clinic),
  };
}

/**
 * Applies an already-authorized stage change idempotently. Construction never moves backwards,
 * and replaying the same approved event cannot advance a building twice.
 */
export function applyAuthorizedBuildingStage(
  current: MvpBuildingStages,
  building: MvpBuildingId,
  authorizedStage: BuildingStage,
): MvpBuildingStages {
  if (authorizedStage <= current[building]) return current;
  return {
    ...current,
    [building]: authorizedStage,
  };
}

export function getRecyclingCenterStatus(stage: BuildingStage) {
  if (stage >= 4) {
    return {
      title: "Återvinningscentralen",
      status: "Återvinningscentralen är färdigbyggd.",
    } as const;
  }

  if (stage >= 1) {
    return {
      title: "Återvinningscentralen",
      status: "Bygget är igång.",
    } as const;
  }

  return {
    title: "Återvinningscentralen",
    status: "Bygget har inte börjat ännu.",
  } as const;
}
