export const progressionClasses = {
  orderEnvironment: "Ordning & miljö",
  knowledgeCreativity: "Kunskap & skapande",
  wellbeingRoutine: "Välmående & rutiner",
  movementActivity: "Rörelse & aktivitet",
  community: "Gemenskap",
} as const;

export type ProgressionKey = keyof typeof progressionClasses;
export type ProgressionState = Record<ProgressionKey, number>;
export type QuestId = "makeBed";
export type QuestState = "available" | "pending" | "approved";
export type QuestEvent = "submit" | "approve" | "needsCompletion";
export type QuestStateMap = Record<QuestId, QuestState>;

export type QuestDefinition = {
  id: QuestId;
  title: string;
  icon: string;
  description: string;
  reward: {
    diamonds: number;
    sysselBux: number;
  };
  hiddenProgression: ReadonlyArray<{
    classKey: ProgressionKey;
    weight: number;
  }>;
};

export function createEmptyProgression(): ProgressionState {
  return {
    orderEnvironment: 0,
    knowledgeCreativity: 0,
    wellbeingRoutine: 0,
    movementActivity: 0,
    community: 0,
  };
}

export function createDefaultQuestStates(): QuestStateMap {
  return { makeBed: "available" };
}

export function isQuestState(value: unknown): value is QuestState {
  return value === "available" || value === "pending" || value === "approved";
}

export function transitionQuestState(current: QuestState, event: QuestEvent): QuestState {
  if (current === "available" && event === "submit") return "pending";
  if (current === "pending" && event === "approve") return "approved";
  if (current === "pending" && event === "needsCompletion") return "available";
  return current;
}

export function getPendingQuestIds(states: QuestStateMap): QuestId[] {
  return (Object.keys(states) as QuestId[]).filter((id) => states[id] === "pending");
}

export function applyQuestProgression(
  current: ProgressionState,
  quest: QuestDefinition,
): ProgressionState {
  const next = { ...current };
  for (const contribution of quest.hiddenProgression) {
    next[contribution.classKey] += contribution.weight;
  }
  return next;
}

export const makeBedQuest: QuestDefinition = {
  id: "makeBed",
  title: "Bädda sängen",
  icon: "🛏️",
  description: "Gå och bädda din säng. Kom tillbaka när du är klar.",
  reward: {
    diamonds: 5,
    sysselBux: 10,
  },
  hiddenProgression: [
    { classKey: "orderEnvironment", weight: 0.7 },
    { classKey: "wellbeingRoutine", weight: 0.3 },
  ],
};

export const questCatalog: Record<QuestId, QuestDefinition> = {
  makeBed: makeBedQuest,
};

export function getQuestDefinition(id: QuestId): QuestDefinition {
  return questCatalog[id];
}
