export const CHAPTER_IDS = ["act1", "act2", "act3"] as const;

export type ChapterId = (typeof CHAPTER_IDS)[number];

export type ChapterDefinition = {
  id: ChapterId;
  route: string;
  predecessorId: ChapterId | null;
  nextId: ChapterId | null;
};

const CHAPTER_REGISTRY: Record<ChapterId, ChapterDefinition> = {
  act1: {
    id: "act1",
    route: "/",
    predecessorId: null,
    nextId: "act2",
  },
  act2: {
    id: "act2",
    route: "/act2",
    predecessorId: "act1",
    nextId: "act3",
  },
  act3: {
    id: "act3",
    route: "/act3",
    predecessorId: "act2",
    nextId: null,
  },
};

export function chapterDefinition(id: ChapterId): ChapterDefinition {
  return CHAPTER_REGISTRY[id];
}

export function chapterRoute(id: ChapterId) {
  return chapterDefinition(id).route;
}

export function chapterPredecessor(id: ChapterId) {
  return chapterDefinition(id).predecessorId;
}

export function nextChapterId(id: ChapterId) {
  return chapterDefinition(id).nextId;
}

export function nextChapterDestination(
  id: ChapterId,
  state: { chapterComplete: boolean; endCardSeen: boolean },
) {
  if (!state.chapterComplete || !state.endCardSeen) return null;
  const nextId = nextChapterId(id);
  return nextId ? { id: nextId, route: chapterRoute(nextId) } : null;
}
