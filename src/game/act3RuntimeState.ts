import { createChapterPersistenceHost } from "../runtime/save/chapterPersistence";

/** First six illustrated beats, followed by the closed PARK-002 quest gate. */
export const ACT3_FREE_OPENING_BEAT_COUNT = 6;

export type Act3RuntimeState = {
  version: 2;
  entered: boolean;
  openingBeatIndex: number;
  openingLineIndex: number;
};

// Keep the original key to preserve existing child-scoped saves. Its suffix
// is historical; saved payloads are explicitly versioned and migrated below.
const ACT3_STORAGE_KEY = "sysselcraft.act3.runtime.v1";

export function createDefaultAct3RuntimeState(): Act3RuntimeState {
  return { version: 2, entered: false, openingBeatIndex: 0, openingLineIndex: 0 };
}

export function migrateAct3RuntimeState(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const legacy = value as { version?: unknown; entered?: unknown };
  if (legacy.version !== 1) return value;
  // v1 only tracked chapter entry. It never played an Act 3 story beat.
  return { version: 2, entered: legacy.entered === true, openingBeatIndex: 0, openingLineIndex: 0 };
}

export function normalizeAct3RuntimeState(value: unknown): Act3RuntimeState | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<Act3RuntimeState>;
  if (candidate.version !== 2 || typeof candidate.entered !== "boolean") return null;
  if (!Number.isInteger(candidate.openingBeatIndex) || !Number.isInteger(candidate.openingLineIndex)) return null;
  const beatIndex = candidate.openingBeatIndex as number;
  const lineIndex = candidate.openingLineIndex as number;
  if (beatIndex < 0 || beatIndex > ACT3_FREE_OPENING_BEAT_COUNT || lineIndex < 0) return null;
  if (beatIndex === ACT3_FREE_OPENING_BEAT_COUNT && lineIndex !== 0) return null;
  if (!candidate.entered && (beatIndex !== 0 || lineIndex !== 0)) return null;
  return { version: 2, entered: candidate.entered, openingBeatIndex: beatIndex, openingLineIndex: lineIndex };
}

const act3Persistence = createChapterPersistenceHost<Act3RuntimeState>({
  chapterId: "act3",
  version: 2,
  storageKey: ACT3_STORAGE_KEY,
  createDefaultState: createDefaultAct3RuntimeState,
  migrate: migrateAct3RuntimeState,
  normalize: normalizeAct3RuntimeState,
});

export const loadAct3RuntimeState = () => act3Persistence.load();
export const saveAct3RuntimeState = (state: Act3RuntimeState) => act3Persistence.save(state);
export const clearAct3RuntimeStateForPairedChild = () => act3Persistence.clear();
