export const QUEST_LIFECYCLE_STATES = ["available", "active", "pending", "approved"] as const;
export type QuestLifecycleState = (typeof QUEST_LIFECYCLE_STATES)[number];

export const PROGRESSION_CLASSES = [
  "orderEnvironment",
  "knowledgeCreativity",
  "wellbeingRoutine",
  "movementActivity",
  "community",
] as const;
export type ProgressionClass = (typeof PROGRESSION_CLASSES)[number];

export type HouseholdRole = "owner" | "parent";

export function isQuestLifecycleState(value: unknown): value is QuestLifecycleState {
  return typeof value === "string" && QUEST_LIFECYCLE_STATES.includes(value as QuestLifecycleState);
}

export function isProgressionClass(value: unknown): value is ProgressionClass {
  return typeof value === "string" && PROGRESSION_CLASSES.includes(value as ProgressionClass);
}

export function createEmptyBackendProgression(): BackendProgression {
  return {
    orderEnvironment: 0,
    knowledgeCreativity: 0,
    wellbeingRoutine: 0,
    movementActivity: 0,
    community: 0,
    worldProgression: 0,
  };
}

export type BackendHousehold = {
  id: string;
  name: string;
};

export type BackendChild = {
  id: string;
  householdId: string;
  displayName: string;
  dogName: string;
};

export type BackendQuest = {
  instanceId: string;
  questId: string;
  householdId: string;
  childId: string;
  title: string;
  description: string;
  progressionClass: ProgressionClass;
  reward: {
    diamonds: number;
    sysselBux: number;
  };
  state: QuestLifecycleState;
  createdAt: string;
  acceptedAt: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  claimedAt: string | null;
};

export type BackendProgression = Record<ProgressionClass, number> & {
  worldProgression: number;
};

export type BackendChildGameState = {
  childId: string;
  diamonds: number;
  sysselBux: number;
  progression: BackendProgression;
  worldFlags: Record<string, unknown>;
  updatedAt: string;
};
