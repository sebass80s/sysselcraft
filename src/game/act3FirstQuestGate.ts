import type { ClaimGateAdapter } from "../runtime/progression/claimGateBridge";
import { advanceStoryLine, previousStoryLineIndex } from "../runtime/story/storySequence";
import { ACT3_FREE_OPENING_BEAT_COUNT, type Act3RuntimeState } from "./act3RuntimeState";
import { ACT3_PARK_002 } from "./act3Park002Content";

/** Chapter configuration only: one authored beat, no later story in this slice. */
export const ACT3_FIRST_QUEST_GATE: ClaimGateAdapter<Act3RuntimeState, string> = {
  beatIds: [ACT3_PARK_002.id],
  waiting: state => state.entered && state.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT && state.park002Phase === "waiting",
  ledger: state => state.claimGate,
  withLedger: (state, claimGate) => ({ ...state, claimGate }),
  startBeat: state => ({ ...state, park002Phase: "playing", park002LineIndex: 0 }),
};
export function nextAct3Park002State(state: Act3RuntimeState): Act3RuntimeState {
  if (state.park002Phase !== "playing") return state;
  const step = advanceStoryLine(ACT3_PARK_002.lines.length, state.park002LineIndex);
  return step.type === "line" ? { ...state, park002LineIndex: step.index }
    : { ...state, park002Phase: "complete", park002LineIndex: 0 };
}
export function previousAct3Park002State(state: Act3RuntimeState): Act3RuntimeState {
  return state.park002Phase === "playing" ? { ...state, park002LineIndex: previousStoryLineIndex(ACT3_PARK_002.lines.length, state.park002LineIndex) } : state;
}
