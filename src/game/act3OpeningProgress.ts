import { advanceStoryLine, previousStoryLineIndex } from "../runtime/story/storySequence";
import type { Act3CityMapVisibilityContext } from "./act3CityMapNodes";
import { ACT3_FREE_OPENING_BEAT_COUNT, type Act3RuntimeState } from "./act3RuntimeState";

/** A pure, bounded opening cursor. Completion stops at a CLOSED quest gate. */
export function nextAct3OpeningState(
  state: Act3RuntimeState,
  currentLineCount: number,
): Act3RuntimeState {
  if (!state.entered || state.openingBeatIndex >= ACT3_FREE_OPENING_BEAT_COUNT) return state;
  const step = advanceStoryLine(currentLineCount, state.openingLineIndex);
  if (step.type === "line") return { ...state, openingLineIndex: step.index };
  return { ...state, openingBeatIndex: state.openingBeatIndex + 1, openingLineIndex: 0 };
}

export function previousAct3OpeningState(
  state: Act3RuntimeState,
  currentLineCount: number,
): Act3RuntimeState {
  if (!state.entered || state.openingBeatIndex >= ACT3_FREE_OPENING_BEAT_COUNT || state.openingLineIndex === 0) return state;
  return { ...state, openingLineIndex: previousStoryLineIndex(currentLineCount, state.openingLineIndex) };
}

/** Folkparken is discovered only when the actual PARK-001 beat is completed. */
export function act3OpeningMapVisibility(state: Act3RuntimeState): Act3CityMapVisibilityContext {
  const parkDiscovered = state.entered && state.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT;
  return {
    discoveredPermanentIds: parkDiscovered ? ["folkpark"] : [],
    huntActive: false,
    arcadeRevealed: false,
    activeNodeId: parkDiscovered ? "folkpark" : "harbor",
  };
}
