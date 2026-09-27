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
 * Recycling and Bakery are each calibrated to four authoritative claims, one per stage.
 * Clinic starts at stage 1 when Sol stays, then stages 2-4 unlock after 3/5/9 authoritative
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
