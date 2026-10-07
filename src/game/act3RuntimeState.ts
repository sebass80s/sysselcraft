import { createChapterPersistenceHost } from "../runtime/save/chapterPersistence";

export type Act3RuntimeState = {
  version: 1;
  entered: boolean;
};

const ACT3_STORAGE_KEY = "sysselcraft.act3.runtime.v1";

export function createDefaultAct3RuntimeState(): Act3RuntimeState {
  return {
    version: 1,
    entered: false,
  };
}

export function normalizeAct3RuntimeState(value: unknown): Act3RuntimeState | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<Act3RuntimeState>;
  if (candidate.version !== 1) return null;
  return {
    version: 1,
    entered: candidate.entered === true,
  };
}

const act3Persistence = createChapterPersistenceHost<Act3RuntimeState>({
  chapterId: "act3",
  version: 1,
  storageKey: ACT3_STORAGE_KEY,
  createDefaultState: createDefaultAct3RuntimeState,
  normalize: normalizeAct3RuntimeState,
});

export const loadAct3RuntimeState = () => act3Persistence.load();
export const saveAct3RuntimeState = (state: Act3RuntimeState) => act3Persistence.save(state);
export const clearAct3RuntimeStateForPairedChild = () => act3Persistence.clear();
