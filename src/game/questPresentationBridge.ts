export const QUEST_PRESENTATION_EVENT = "sysselcraft:quest-presentation";
export const QUEST_SOURCE_OPEN_EVENT = "sysselcraft:quest-source-open";

export type QuestPresentationEventDetail = {
  noticeboardCount: number;
};

export type QuestSourceOpenEventDetail = {
  source: "noticeboard";
};

export function publishQuestPresentation(detail: QuestPresentationEventDetail) {
  window.dispatchEvent(new CustomEvent<QuestPresentationEventDetail>(QUEST_PRESENTATION_EVENT, { detail }));
}

export function requestQuestSourceOpen(source: QuestSourceOpenEventDetail["source"]) {
  window.dispatchEvent(new CustomEvent<QuestSourceOpenEventDetail>(QUEST_SOURCE_OPEN_EVENT, {
    detail: { source },
  }));
}
