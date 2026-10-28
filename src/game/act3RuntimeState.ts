import { createChapterPersistenceHost } from "../runtime/save/chapterPersistence";
import { emptyClaimGate, isClaimGateLedger, type ClaimGateLedger } from "../runtime/progression/claimGate";
import { ACT3_OPENING_BEATS } from "./act3OpeningContent";
import { ACT3_GATED_BEATS } from "./act3GatedBeats";

export const ACT3_FREE_OPENING_BEAT_COUNT = 6;
export type Act3RuntimeState = {
  version: 4;
  entered: boolean;
  openingBeatIndex: number;
  openingLineIndex: number;
  claimGate: ClaimGateLedger;
  /** First unfinished beat, or ACT3_GATED_BEATS.length after all are complete. */
  gatedBeatIndex: number;
  gatedPhase: "waiting" | "playing" | "activity";
  gatedLineIndex: number;
};
// Historical key retained. All prior chapter states migrate in place, per child.
const ACT3_STORAGE_KEY = "sysselcraft.act3.runtime.v1";
export function createDefaultAct3RuntimeState(): Act3RuntimeState {
  return {
    version: 4, entered: false, openingBeatIndex: 0, openingLineIndex: 0,
    claimGate: emptyClaimGate(), gatedBeatIndex: 0, gatedPhase: "waiting", gatedLineIndex: 0,
  };
}
export function migrateAct3RuntimeState(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const old = value as Record<string, unknown>;
  if (old.version === 1 && typeof old.entered === "boolean") {
    return { ...createDefaultAct3RuntimeState(), entered: old.entered };
  }
  if (old.version === 2) {
    return {
      ...createDefaultAct3RuntimeState(),
      entered: old.entered, openingBeatIndex: old.openingBeatIndex,
      openingLineIndex: old.openingLineIndex,
    };
  }
  if (old.version === 3) {
    // PARK-002 already completed means the next gate is PARK-003.
    // Never reset the ledger: an old claimed quest must never count again.
    const oldPhase = old.park002Phase;
    return {
      version: 4,
      entered: old.entered, openingBeatIndex: old.openingBeatIndex,
      openingLineIndex: old.openingLineIndex, claimGate: old.claimGate,
      gatedBeatIndex: oldPhase === "complete" ? 1 : oldPhase === "playing" || oldPhase === "waiting" ? 0 : -1,
      gatedPhase: oldPhase === "playing" ? "playing" : "waiting",
      gatedLineIndex: old.park002LineIndex,
    };
  }
  return value;
}
export function normalizeAct3RuntimeState(value: unknown): Act3RuntimeState | null {
  if (!value || typeof value !== "object") return null;
  const s = value as Act3RuntimeState;
  if (s.version !== 4 || typeof s.entered !== "boolean" || !isClaimGateLedger(s.claimGate)) return null;
  if (!Number.isSafeInteger(s.openingBeatIndex) || !Number.isSafeInteger(s.openingLineIndex)) return null;
  if (s.openingBeatIndex < 0 || s.openingBeatIndex > ACT3_FREE_OPENING_BEAT_COUNT || s.openingLineIndex < 0) return null;
  const openingDone = s.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT;
  if (openingDone ? s.openingLineIndex !== 0 : s.openingLineIndex >= ACT3_OPENING_BEATS[s.openingBeatIndex].lines.length) return null;
  if (!s.entered && (s.openingBeatIndex !== 0 || s.openingLineIndex !== 0)) return null;
  if (!Number.isSafeInteger(s.gatedBeatIndex) || s.gatedBeatIndex < 0 || s.gatedBeatIndex > ACT3_GATED_BEATS.length) return null;
  if (!Number.isSafeInteger(s.gatedLineIndex) || s.gatedLineIndex < 0) return null;
  if (!["waiting", "playing", "activity"].includes(s.gatedPhase)) return null;
  // The end of the currently authored slice is a waiting cursor, not a stored
  // "complete" flag. Adding PARK-004 later must NOT invalidate this v4 save.
  if (s.gatedPhase !== "waiting" && s.gatedBeatIndex === ACT3_GATED_BEATS.length) return null;
  if (s.gatedPhase === "activity" && ACT3_GATED_BEATS[s.gatedBeatIndex]?.activity !== "minigolf") return null;
  if (s.gatedPhase === "playing") {
    if (s.gatedLineIndex >= ACT3_GATED_BEATS[s.gatedBeatIndex].lines.length) return null;
  } else if (s.gatedLineIndex !== 0) return null;
  // A new claim is consumed atomically when its beat begins. A completed beat
  // advances the index without consuming another claim.
  const expectedConsumed = s.gatedBeatIndex + (s.gatedPhase === "waiting" ? 0 : 1);
  if (s.claimGate.consumed !== expectedConsumed) return null;
  if (!openingDone && (s.claimGate.baseline !== null || s.gatedBeatIndex !== 0 || s.gatedPhase !== "waiting")) return null;
  return {
    version: 4, entered: s.entered, openingBeatIndex: s.openingBeatIndex,
    openingLineIndex: s.openingLineIndex, claimGate: { ...s.claimGate },
    gatedBeatIndex: s.gatedBeatIndex, gatedPhase: s.gatedPhase, gatedLineIndex: s.gatedLineIndex,
  };
}
const act3Persistence = createChapterPersistenceHost<Act3RuntimeState>({
  chapterId: "act3", version: 4, storageKey: ACT3_STORAGE_KEY,
  createDefaultState: createDefaultAct3RuntimeState, migrate: migrateAct3RuntimeState, normalize: normalizeAct3RuntimeState,
});
export const loadAct3RuntimeState = act3Persistence.load;
export const saveAct3RuntimeState = act3Persistence.save;
export const updateAct3RuntimeState = act3Persistence.update;
export const clearAct3RuntimeStateForPairedChild = act3Persistence.clear;
