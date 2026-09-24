import type { BuildingStage, MvpBuildingId, MvpBuildingStages } from "./worldProgression";
import { applyAuthorizedBuildingStage } from "./worldProgression";

export type ConstructionProgressionState = {
  stages: MvpBuildingStages;
  appliedContributionIds: string[];
};

export type ApprovedConstructionContribution = {
  /** Stable id from the authoritative approval/reward event. */
  contributionId: string;
  building: MvpBuildingId;
};

export type ConstructionProgressionResult = {
  state: ConstructionProgressionState;
  changed: boolean;
  previousStage: BuildingStage;
  nextStage: BuildingStage;
  completedNow: boolean;
};

function clampNextStage(stage: BuildingStage): BuildingStage {
  return Math.min(4, stage + 1) as BuildingStage;
}

/**
 * Applies one already-approved real-world contribution to construction.
 *
 * This reducer does not decide whether a quest is eligible and never approves/rewards a quest.
 * Its input must come from the authoritative approval layer. A stable contribution id makes
 * replay/reload safe: the same approval event can be observed repeatedly without advancing twice.
 *
 * The first recycling arc is calibrated to four contributions. Bakery is product-locked to
 * ten authoritative claims with stage pacing 1-2-4-3 (cumulative thresholds 1/3/7/10).
 * Clinic is product-locked to stage 1 at start, then stages 2-4 after 2/4/8 authoritative
 * claims from its persisted baseline. Those authored thresholds live in construction.ts;
 * this generic reducer must not invent or replace them.
 */
export function applyApprovedConstructionContribution(
  current: ConstructionProgressionState,
  contribution: ApprovedConstructionContribution,
): ConstructionProgressionResult {
  const previousStage = current.stages[contribution.building];

  if (!contribution.contributionId || current.appliedContributionIds.includes(contribution.contributionId)) {
    return {
      state: current,
      changed: false,
      previousStage,
      nextStage: previousStage,
      completedNow: false,
    };
  }

  const nextStage = clampNextStage(previousStage);
  const stages = applyAuthorizedBuildingStage(current.stages, contribution.building, nextStage);

  return {
    state: {
      stages,
      appliedContributionIds: [...current.appliedContributionIds, contribution.contributionId],
    },
    changed: nextStage !== previousStage,
    previousStage,
    nextStage,
    completedNow: previousStage < 4 && nextStage === 4,
  };
}
