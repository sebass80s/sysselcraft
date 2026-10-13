import { createChapterPersistenceHost } from "../runtime/save/chapterPersistence";
import { emptyClaimGate, isClaimGateLedger, type ClaimGateLedger } from "../runtime/progression/claimGate";
import { ACT3_OPENING_BEATS } from "./act3OpeningContent";
import { ACT3_PARK_002 } from "./act3Park002Content";

export const ACT3_FREE_OPENING_BEAT_COUNT = 6;
export type Act3RuntimeState = {
  version: 3;
  entered: boolean;
  openingBeatIndex: number;
  openingLineIndex: number;
  claimGate: ClaimGateLedger;
  park002Phase: "waiting" | "playing" | "complete";
  park002LineIndex: number;
};
// Historical key retained. Only the explicitly versioned payload changes.
const ACT3_STORAGE_KEY = "sysselcraft.act3.runtime.v1";
export function createDefaultAct3RuntimeState(): Act3RuntimeState {
  return { version: 3, entered: false, openingBeatIndex: 0, openingLineIndex: 0,
    claimGate: emptyClaimGate(), park002Phase: "waiting", park002LineIndex: 0 };
}
export function migrateAct3RuntimeState(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const old = value as Record<string, unknown>;
  if (old.version === 1 && typeof old.entered === "boolean") {
    return { ...createDefaultAct3RuntimeState(), entered: old.entered };
  }
  if (old.version === 2) {
    return { ...old, version: 3, claimGate: emptyClaimGate(), park002Phase: "waiting", park002LineIndex: 0 };
  }
  return value;
}
export function normalizeAct3RuntimeState(value: unknown): Act3RuntimeState | null {
  if (!value || typeof value !== "object") return null;
  const s = value as Act3RuntimeState;
  if (s.version !== 3 || typeof s.entered !== "boolean" || !isClaimGateLedger(s.claimGate)) return null;
  if (!Number.isSafeInteger(s.openingBeatIndex) || !Number.isSafeInteger(s.openingLineIndex)) return null;
  if (s.openingBeatIndex < 0 || s.openingBeatIndex > ACT3_FREE_OPENING_BEAT_COUNT || s.openingLineIndex < 0) return null;
  const openingDone = s.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT;
  if (openingDone ? s.openingLineIndex !== 0 : s.openingLineIndex >= ACT3_OPENING_BEATS[s.openingBeatIndex].lines.length) return null;
  if (!s.entered && (s.openingBeatIndex !== 0 || s.openingLineIndex !== 0)) return null;
  if (!["waiting", "playing", "complete"].includes(s.park002Phase)) return null;
  if (!Number.isSafeInteger(s.park002LineIndex) || s.park002LineIndex < 0 || s.park002LineIndex >= ACT3_PARK_002.lines.length) return null;
  if (s.park002Phase !== "playing" && s.park002LineIndex !== 0) return null;
  if (s.claimGate.consumed !== (s.park002Phase === "waiting" ? 0 : 1)) return null;
  if (!openingDone && (s.claimGate.baseline !== null || s.park002Phase !== "waiting")) return null;
  return { version: 3, entered: s.entered, openingBeatIndex: s.openingBeatIndex, openingLineIndex: s.openingLineIndex,
    claimGate: { ...s.claimGate }, park002Phase: s.park002Phase, park002LineIndex: s.park002LineIndex };
}
const act3Persistence = createChapterPersistenceHost<Act3RuntimeState>({
  chapterId: "act3", version: 3, storageKey: ACT3_STORAGE_KEY,
  createDefaultState: createDefaultAct3RuntimeState, migrate: migrateAct3RuntimeState, normalize: normalizeAct3RuntimeState,
});
export const loadAct3RuntimeState = act3Persistence.load;
export const saveAct3RuntimeState = act3Persistence.save;
export const updateAct3RuntimeState = act3Persistence.update;
export const clearAct3RuntimeStateForPairedChild = act3Persistence.clear;
