export const progressionClasses = {
  orderEnvironment: "Ordning & miljö",
  knowledgeCreativity: "Kunskap & skapande",
  wellbeingRoutine: "Välmående & rutiner",
  movementActivity: "Rörelse & aktivitet",
  community: "Gemenskap",
} as const;

export type ProgressionKey = keyof typeof progressionClasses;
export type ProgressionState = Record<ProgressionKey, number>;

export function createEmptyProgression(): ProgressionState {
  return {
    orderEnvironment: 0,
    knowledgeCreativity: 0,
    wellbeingRoutine: 0,
    movementActivity: 0,
    community: 0,
  };
}
