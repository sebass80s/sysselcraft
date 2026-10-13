import {
  createDefaultAct3RuntimeState,
  type Act3RuntimeState,
} from "./act3RuntimeState";
import type { ChapterDebugFixture } from "../runtime/debug/chapterDebugHarness";

export type Act3DebugContext = { childName: string };

export const ACT3_DEBUG_FIXTURE: ChapterDebugFixture<Act3RuntimeState, Act3DebugContext> = {
  chapterId: "act3",
  route: "/act3",
  debugRoute: "/act3-test",
  createSession() {
    return {
      state: createDefaultAct3RuntimeState(),
      context: { childName: "" },
      chapterIntroVisible: false,
    };
  },
  createResetState: createDefaultAct3RuntimeState,
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
        ok: state.version === 2 && state.entered === false,
        details: {
          version: state.version,
          entered: state.entered,
        },
      };
    },
  },
};
