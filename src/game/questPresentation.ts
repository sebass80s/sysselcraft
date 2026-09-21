import type { BackendQuest, ProgressionClass } from "@/backend/types";

export type QuestPresentationChannel = "home" | "linus" | "bakery" | "village";

export type QuestPresentation = {
  channel: QuestPresentationChannel;
  presenter: "home" | "linus" | "henning" | "village";
  reason: string;
};

export type QuestPresentationContext = {
  recyclingComplete: boolean;
  bakeryUnlocked: boolean;
  henningPresent: boolean;
};

const HOME_TITLE_HINTS = /\b(bädda|säng|rum|kläder|tänder|tand|pyjamas|leksak|städa)\b/i;
const BAKERY_TITLE_HINTS = /\b(mat|baka|bröd|frukost|lunch|middag|disk|köket|kök)\b/i;

function categoryFallback(
  progressionClass: ProgressionClass,
  context: QuestPresentationContext,
): QuestPresentation {
  if (progressionClass === "community" && context.henningPresent && context.bakeryUnlocked) {
    return { channel: "bakery", presenter: "henning", reason: "community-with-henning" };
  }
  if (context.recyclingComplete) {
    return { channel: "village", presenter: "village", reason: "unlocked-village" };
  }
  return { channel: "linus", presenter: "linus", reason: "starter-guide" };
}

/**
 * Pure dramaturgical routing. Parent authors the real-world task; the game chooses
 * where it belongs in the currently unlocked village.
 *
 * Title hints are deliberately conservative. They only route obvious household or
 * food tasks; category + unlocked-world fallback handles everything else.
 */
export function chooseQuestPresentation(
  quest: Pick<BackendQuest, "title" | "progressionClass">,
  context: QuestPresentationContext,
): QuestPresentation {
  if (HOME_TITLE_HINTS.test(quest.title)) {
    return { channel: "home", presenter: "home", reason: "obvious-home-task" };
  }
  if (BAKERY_TITLE_HINTS.test(quest.title) && context.bakeryUnlocked && context.henningPresent) {
    return { channel: "bakery", presenter: "henning", reason: "food-task-with-henning" };
  }
  return categoryFallback(quest.progressionClass, context);
}
