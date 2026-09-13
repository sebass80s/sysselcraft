export type HouseholdRole = "owner" | "parent";
export type QuestLifecycleState = "available" | "pending" | "approved";
export type ProgressionClass =
  | "orderEnvironment"
  | "knowledgeCreativity"
  | "wellbeingRoutine"
  | "movementActivity"
  | "community";

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
  submittedAt: string | null;
  approvedAt: string | null;
};

export type BackendChildGameState = {
  childId: string;
  diamonds: number;
  sysselBux: number;
  progression: Record<ProgressionClass, number>;
  worldFlags: Record<string, unknown>;
  updatedAt: string;
};
