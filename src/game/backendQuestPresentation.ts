import type { BackendChildGameState, BackendQuest } from "@/backend/types";
import { chooseQuestPresentation, type QuestPresentation } from "./questPresentation";
import type { QuestPresentationEventDetail } from "./questPresentationBridge";

export type PresentedBackendQuest = {
  quest: BackendQuest;
  presentation: QuestPresentation;
};

export type BackendQuestPresentationSnapshot = {
  available: PresentedBackendQuest[];
  pending: PresentedBackendQuest[];
};

function flag(value: unknown): boolean {
  return value === true;
}

export function questPresentationContextFromGameState(gameState: BackendChildGameState | null) {
  const flags = gameState?.worldFlags ?? {};
  return {
    recyclingComplete:
      flag(flags.recyclingComplete) ||
      flag(flags.recyclingCompletionSeen) ||
      Number(flags.recyclingCenterStage) >= 4,
    bakeryUnlocked: flag(flags.bakeryUnlocked) || Number(flags.bakeryStage) > 0,
    henningPresent: flag(flags.henningPresent) || flag(flags.henningArrived),
    noticeboardAvailable: flags.noticeboardAvailable !== false,
  };
}

export function presentBackendQuests(
  quests: BackendQuest[],
  gameState: BackendChildGameState | null,
): BackendQuestPresentationSnapshot {
  const context = questPresentationContextFromGameState(gameState);
  const presented = quests
    .filter((quest) => quest.state !== "approved")
    .map((quest) => ({ quest, presentation: chooseQuestPresentation(quest, context) }));

  return {
    available: presented.filter(({ quest }) => quest.state === "available"),
    pending: presented.filter(({ quest }) => quest.state === "pending"),
  };
}


export function questSourceCounts(snapshot: BackendQuestPresentationSnapshot): QuestPresentationEventDetail["counts"] {
  const available = snapshot.available;
  return {
    noticeboard: available.filter(({ presentation }) => presentation.destination === "noticeboard").length,
    home: available.filter(({ presentation }) => presentation.destination === "home").length,
    linus: available.filter(({ presentation }) => presentation.destination === "linus").length,
    bakery: available.filter(({ presentation }) => presentation.destination === "bakery").length,
  };
}

export function primaryPresentedQuest(snapshot: BackendQuestPresentationSnapshot): PresentedBackendQuest | null {
  return snapshot.available[0] ?? snapshot.pending[0] ?? null;
}
