export const QUEST_PRESENTATION_EVENT = "sysselcraft:quest-presentation";
export const QUEST_SOURCE_OPEN_EVENT = "sysselcraft:quest-source-open";

export type QuestPresentationSource = "noticeboard" | "home" | "linus" | "bakery";

export type QuestPresentationEventDetail = {
  counts: Record<QuestPresentationSource, number>;
};

let latestQuestPresentation: QuestPresentationEventDetail = {
  counts: { noticeboard: 0, home: 0, linus: 0, bakery: 0 },
};

export type QuestSourceOpenEventDetail = {
  source: QuestPresentationSource;
};

export function publishQuestPresentation(detail: QuestPresentationEventDetail) {
  latestQuestPresentation = detail;
  window.dispatchEvent(new CustomEvent<QuestPresentationEventDetail>(QUEST_PRESENTATION_EVENT, { detail }));
}

export function requestQuestSourceOpen(source: QuestSourceOpenEventDetail["source"]) {
  window.dispatchEvent(new CustomEvent<QuestSourceOpenEventDetail>(QUEST_SOURCE_OPEN_EVENT, {
    detail: { source },
  }));
}

export function getLatestQuestPresentation(): QuestPresentationEventDetail {
  return latestQuestPresentation;
}
