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
