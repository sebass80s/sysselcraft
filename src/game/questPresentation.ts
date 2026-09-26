import type { BackendQuest, ProgressionClass } from "@/backend/types";

export type QuestPresentationChannel = "home" | "noticeboard" | "npc" | "building";

export type QuestPresentation = {
  channel: QuestPresentationChannel;
  presenter: "home" | "noticeboard" | "linus" | "henning";
  destination: "home" | "noticeboard" | "linus" | "recycling" | "bakery";
  reason: string;
};

export type QuestPresentationContext = {
  recyclingComplete: boolean;
  bakeryUnlocked: boolean;
  henningPresent: boolean;
  noticeboardAvailable: boolean;
};

const HOME_TITLE_HINTS = /\b(bädda|säng|rum|kläder|tänder|tand|pyjamas|leksak|städa|läxa|läxan|läxor|läxor|plugga|läs|läsa|bok|skolarbete)\b/i;
const BAKERY_TITLE_HINTS = /\b(mat|baka|bröd|frukost|lunch|middag|disk|köket|kök)\b/i;\nconst RECYCLING_TITLE_HINTS = /\b(återvinn|återvinning|sortera|sopor|skräp|pant|flaskor|burkar|kartong|papper|plast|glas)\b/i;

function categoryFallback(
  progressionClass: ProgressionClass,
  context: QuestPresentationContext,
): QuestPresentation {
  if (progressionClass === "community" && context.henningPresent && context.bakeryUnlocked) {
    return {
      channel: "npc",
      presenter: "henning",
      destination: "bakery",
      reason: "community-with-henning",
    };
  }
  if (context.recyclingComplete && context.noticeboardAvailable) {
    return {
      channel: "noticeboard",
      presenter: "noticeboard",
      destination: "noticeboard",
      reason: "general-village-quest",
    };
  }
  return { channel: "npc", presenter: "linus", destination: "linus", reason: "starter-guide" };
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
    return { channel: "home", presenter: "home", destination: "home", reason: "obvious-home-task" };
  }
  if (RECYCLING_TITLE_HINTS.test(quest.title) && context.recyclingComplete) {
    return {
      channel: "building",
      presenter: "linus",
      destination: "recycling",
      reason: "obvious-recycling-task",
    };
  }
  if (BAKERY_TITLE_HINTS.test(quest.title) && context.bakeryUnlocked && context.henningPresent) {
    return {
      channel: "npc",
      presenter: "henning",
      destination: "bakery",
      reason: "food-task-with-henning",
    };
  }
  return categoryFallback(quest.progressionClass, context);
}
