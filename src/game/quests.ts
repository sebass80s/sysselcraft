export type ProgressionClass =
  | "Ordning & miljö"
  | "Kunskap & skapande"
  | "Välmående & rutiner"
  | "Rörelse & aktivitet"
  | "Gemenskap";

export type QuestDefinition = {
  id: "makeBed";
  title: string;
  icon: string;
  description: string;
  reward: {
    diamonds: number;
    sysselBux: number;
  };
  hiddenProgression: ReadonlyArray<{
    className: ProgressionClass;
    weight: number;
  }>;
};

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
    { className: "Ordning & miljö", weight: 0.7 },
    { className: "Välmående & rutiner", weight: 0.3 },
  ],
};
