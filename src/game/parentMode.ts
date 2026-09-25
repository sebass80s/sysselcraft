import type { SaveStateV1 } from "./saveState";
import { getRecyclingCenterStatus } from "./worldProgression";

export type ParentModeSnapshot = {
  child: {
    name: string;
    dogName: string;
  };
  resources: {
    diamonds: number;
    sysselBux: number;
  };
  village: {
    recyclingCenter: {
      stage: number;
      title: string;
      status: string;
    };
  };
};

/**
 * Local save snapshot only. Quest lifecycle is backend-owned and deliberately
 * excluded from this legacy-free local projection.
 */
export function createParentModeSnapshot(save: SaveStateV1): ParentModeSnapshot {
  const recyclingCenter = getRecyclingCenterStatus(save.worldFlags.recyclingCenterStage);

  return {
    child: {
      name: save.childName,
      dogName: save.dogName,
    },
    resources: {
      diamonds: save.diamonds,
      sysselBux: save.sysselBux,
    },
    village: {
      recyclingCenter: {
        stage: save.worldFlags.recyclingCenterStage,
        title: recyclingCenter.title,
        status: recyclingCenter.status,
      },
    },
  };
}

export type ParentQuestDraft = {
  title: string;
  description: string;
  progressionClass: "orderEnvironment" | "knowledgeCreativity" | "wellbeingRoutine" | "movementActivity" | "community";
  reward: {
    diamonds: number;
    sysselBux: number;
  };
};

function normalizeRewardAmount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

export function normalizeParentQuestDraft(draft: ParentQuestDraft): ParentQuestDraft {
  return {
    title: draft.title.trim().slice(0, 60),
    description: draft.description.trim().slice(0, 240),
    progressionClass: draft.progressionClass,
    reward: {
      diamonds: normalizeRewardAmount(draft.reward.diamonds),
      sysselBux: normalizeRewardAmount(draft.reward.sysselBux),
    },
  };
}

export function isParentQuestDraftReady(draft: ParentQuestDraft): boolean {
  const normalized = normalizeParentQuestDraft(draft);
  return normalized.title.length > 0 && normalized.description.length > 0;
}
