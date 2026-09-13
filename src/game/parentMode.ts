import { getPendingQuestIds, getQuestDefinition, type QuestId } from "./quests";
import type { SaveStateV1 } from "./saveState";
import { getRecyclingCenterStatus } from "./worldProgression";

export type ParentQuestSummary = {
  id: QuestId;
  title: string;
  icon: string;
  description: string;
};

export type ParentModeSnapshot = {
  child: {
    name: string;
    dogName: string;
  };
  pendingQuests: ParentQuestSummary[];
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

export function createParentModeSnapshot(save: SaveStateV1): ParentModeSnapshot {
  const pendingQuests = getPendingQuestIds(save.questStates).map((id) => {
    const quest = getQuestDefinition(id);
    return {
      id,
      title: quest.title,
      icon: quest.icon,
      description: quest.description,
    };
  });

  const recyclingCenter = getRecyclingCenterStatus(save.worldFlags.recyclingCenterStage);

  return {
    child: {
      name: save.childName,
      dogName: save.dogName,
    },
    pendingQuests,
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
