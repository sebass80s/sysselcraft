import type { ChapterPersistenceDefinition } from "../../src/runtime/save/chapterPersistence";

export type FuelProofChapterState = {
  version: 1;
  introSeen: boolean;
  localStoryIndex: number;
};

export const FUEL_PROOF_CHAPTER_PERSISTENCE: ChapterPersistenceDefinition<FuelProofChapterState> = {
  chapterId: "fuel-proof",
  version: 1,
  storageKey: "sysselcraft.chapter.fuel-proof.v1",
  legacyStorageKey: "sysselcraft.chapter.fuel-proof.legacy",
  createDefaultState: () => ({
    version: 1,
    introSeen: false,
    localStoryIndex: 0,
  }),
  migrate(value) {
    if (!value || typeof value !== "object") return value;
    const candidate = value as Record<string, unknown>;
    if (candidate.version === 0) {
      return {
        version: 1,
        introSeen: candidate.opened === true,
        localStoryIndex: Number.isInteger(candidate.storyIndex)
          ? Math.max(0, Number(candidate.storyIndex))
          : 0,
      };
    }
    return value;
  },
  normalize(value) {
    if (!value || typeof value !== "object") return null;
    const candidate = value as Record<string, unknown>;
    if (candidate.version !== 1) return null;
    return {
      version: 1,
      introSeen: candidate.introSeen === true,
      localStoryIndex: Number.isInteger(candidate.localStoryIndex)
        ? Math.max(0, Number(candidate.localStoryIndex))
        : 0,
    };
  },
};
