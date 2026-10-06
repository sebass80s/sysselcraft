export type ChapterLifecycleSnapshot = {
  openingComplete: boolean;
  openingIndex: number;
  openingLineIndex: number;
  chapterComplete: boolean;
  endCardSeen: boolean;
};

export function chapterUnlocked(previousChapterEndCardSeen: boolean) {
  return previousChapterEndCardSeen;
}

export function chapterAtStart(snapshot: Pick<
  ChapterLifecycleSnapshot,
  "openingComplete" | "openingIndex" | "openingLineIndex"
>) {
  return !snapshot.openingComplete
    && snapshot.openingIndex === 0
    && snapshot.openingLineIndex === 0;
}

export function chapterEndCardPending(snapshot: Pick<
  ChapterLifecycleSnapshot,
  "chapterComplete" | "endCardSeen"
>) {
  return snapshot.chapterComplete && !snapshot.endCardSeen;
}

export function chapterCardVisible(
  ready: boolean,
  introVisible: boolean,
  snapshot: Pick<ChapterLifecycleSnapshot, "chapterComplete" | "endCardSeen">,
) {
  return ready && (introVisible || chapterEndCardPending(snapshot));
}
