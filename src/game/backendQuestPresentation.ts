import type { BackendChildGameState, BackendQuest } from "@/backend/types";
import { chooseQuestPresentation, type QuestPresentation } from "./questPresentation";

export type PresentedBackendQuest = {
  quest: BackendQuest;
  presentation: QuestPresentation;
};

export type BackendQuestPresentationSnapshot = {
  available: PresentedBackendQuest[];
  active: PresentedBackendQuest[];
  pending: PresentedBackendQuest[];
};

function flag(value: unknown): boolean {
  return value === true;
}

export type LocalQuestWorldContext = {
  recyclingCenterStage?: number;
  bakeryStage?: number;
  henningPresent?: boolean;
};

export function questPresentationContextFromGameState(
  gameState: BackendChildGameState | null,
  localWorld?: LocalQuestWorldContext | null,
) {
  const flags = gameState?.worldFlags ?? {};
  return {
    // During observe-only reconciliation the visible local world remains authoritative
    // for presentation. This is read-only and must not migrate local state into Supabase.
    recyclingComplete:
      Number(localWorld?.recyclingCenterStage) >= 4 ||
      flag(flags.recyclingComplete) ||
      flag(flags.recyclingCompletionSeen) ||
      Number(flags.recyclingCenterStage) >= 4,
    bakeryUnlocked: Number(localWorld?.bakeryStage) > 0 || flag(flags.bakeryUnlocked) || Number(flags.bakeryStage) > 0,
    henningPresent: localWorld?.henningPresent === true || flag(flags.henningPresent) || flag(flags.henningArrived),
    noticeboardAvailable: flags.noticeboardAvailable !== false,
  };
}

export function presentBackendQuests(
  quests: BackendQuest[],
  gameState: BackendChildGameState | null,
  localWorld?: LocalQuestWorldContext | null,
): BackendQuestPresentationSnapshot {
  const context = questPresentationContextFromGameState(gameState, localWorld);
  const presented = quests
    .filter((quest) => quest.state !== "approved")
    .map((quest) => ({ quest, presentation: chooseQuestPresentation(quest, context) }));

  return {
    available: presented.filter(({ quest }) => quest.state === "available"),
    active: presented.filter(({ quest }) => quest.state === "active"),
    pending: presented.filter(({ quest }) => quest.state === "pending"),
  };
}


export type QuestSourceCounts = Record<QuestPresentation["destination"], number>;

export function questSourceCounts(snapshot: BackendQuestPresentationSnapshot): QuestSourceCounts {
  const available = snapshot.available;
  return {
    noticeboard: available.filter(({ presentation }) => presentation.destination === "noticeboard").length,
    home: available.filter(({ presentation }) => presentation.destination === "home").length,
    linus: available.filter(({ presentation }) => presentation.destination === "linus").length,
    bakery: available.filter(({ presentation }) => presentation.destination === "bakery").length,
  };
}

export function primaryPresentedQuest(snapshot: BackendQuestPresentationSnapshot): PresentedBackendQuest | null {
  return snapshot.active[0] ?? snapshot.available[0] ?? snapshot.pending[0] ?? null;
}
