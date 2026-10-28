import type { ClaimGateAdapter } from "../runtime/progression/claimGateBridge";
import { advanceStoryLine, previousStoryLineIndex } from "../runtime/story/storySequence";
import { ACT3_FREE_OPENING_BEAT_COUNT, type Act3RuntimeState } from "./act3RuntimeState";
import { ACT3_GATED_BEATS } from "./act3GatedBeats";

/** Chapter-only adapter. Shared claimGateBridge owns fresh evidence and atomic writes. */
export const ACT3_FIRST_QUEST_GATE: ClaimGateAdapter<Act3RuntimeState, string> = {
  beatIds: ACT3_GATED_BEATS.map(beat => beat.id),
  waiting: state => state.entered
    && state.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT
    && state.gatedPhase === "waiting"
    && state.gatedBeatIndex < ACT3_GATED_BEATS.length,
  ledger: state => state.claimGate,
  withLedger: (state, claimGate) => ({ ...state, claimGate }),
  startBeat: (state, beatId) => {
    if (ACT3_GATED_BEATS[state.gatedBeatIndex]?.id !== beatId) {
      throw new Error("Act 3 claim / story cursor mismatch");
    }
    return { ...state, gatedPhase: "playing", gatedLineIndex: 0 };
  },
};

export function nextAct3GatedState(state: Act3RuntimeState): Act3RuntimeState {
  if (state.gatedPhase !== "playing") return state;
  const beat = ACT3_GATED_BEATS[state.gatedBeatIndex];
  if (!beat) return state;
  const step = advanceStoryLine(beat.lines.length, state.gatedLineIndex);
  if (step.type === "line") return { ...state, gatedLineIndex: step.index };
  // A minigame is INSIDE the already claimed beat. It cannot be bypassed by
  // finishing the authored dialogue and does not require a second IRL chore.
  if (beat.activity === "minigolf") return { ...state, gatedPhase: "activity", gatedLineIndex: 0 };
  const nextIndex = state.gatedBeatIndex + 1;
  return { ...state, gatedBeatIndex: nextIndex, gatedLineIndex: 0, gatedPhase: "waiting" };
}

/** Only a successful in-game hole can finish the currently active minigame.
 * Chapter persistence serializes this with stale taps, route changes and saves.
 */
export function completeAct3GatedActivity(state: Act3RuntimeState): Act3RuntimeState {
  if (state.gatedPhase !== "activity" || ACT3_GATED_BEATS[state.gatedBeatIndex]?.activity !== "minigolf") return state;
  return { ...state, gatedBeatIndex: state.gatedBeatIndex + 1, gatedPhase: "waiting", gatedLineIndex: 0 };
}

export function previousAct3GatedState(state: Act3RuntimeState): Act3RuntimeState {
  if (state.gatedPhase !== "playing" || state.gatedLineIndex === 0) return state;
  return { ...state, gatedLineIndex: previousStoryLineIndex(
    ACT3_GATED_BEATS[state.gatedBeatIndex].lines.length, state.gatedLineIndex,
  ) };
}
