import {
  createDefaultAct3RuntimeState,
  type Act3RuntimeState,
} from "./act3RuntimeState";
import type { ChapterDebugFixture } from "../runtime/debug/chapterDebugHarness";
import { ACT3_GATED_BEATS } from "./act3GatedBeats";

export type Act3DebugContext = { childName: string; childId: string | null };

export const ACT3_DEBUG_FIXTURE: ChapterDebugFixture<Act3RuntimeState, Act3DebugContext> = {
  chapterId: "act3",
  route: "/act3",
  debugRoute: "/act3-test",
  createSession(params) {
    const playMinigolf = params.get("scene") === "park009";
    const gameIndex = ACT3_GATED_BEATS.findIndex(beat => beat.id === "A3-PARK-009");
    const state = { ...createDefaultAct3RuntimeState(), entered: true };
    if (playMinigolf && gameIndex >= 0) {
      // This fixture is only mounted at /act3-test in a development build.
      // Simulate completed claims locally; never make network/backend calls.
      state.openingBeatIndex = 6;
      state.gatedBeatIndex = gameIndex;
      state.gatedPhase = "playing";
      state.gatedLineIndex = 0;
      state.claimGate = { baseline: 0, consumed: gameIndex + 1,
        observedCount: gameIndex + 1, observedAt: 1800000000000 };
    }
    return {
      state,
      context: { childName: "Testspelaren", childId: null },
      chapterIntroVisible: false,
    };
  },
  createResetState: () => ({ ...createDefaultAct3RuntimeState(), entered: true }),
  inspect(state) {
    return {
      version: state.version,
      entered: state.entered,
      chapterEntryReady: true,
      openingBeatIndex: state.openingBeatIndex,
      openingLineIndex: state.openingLineIndex,
    };
  },
  probes: {
    "chapter-entry"(state) {
      return {
        ok: state.version === 4 && state.entered === true,
        details: {
          version: state.version,
          entered: state.entered,
        },
      };
    },
  },
};
