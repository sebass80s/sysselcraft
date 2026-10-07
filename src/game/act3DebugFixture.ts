import {
  createDefaultAct3RuntimeState,
  type Act3RuntimeState,
} from "./act3RuntimeState";
import type { ChapterDebugFixture } from "../runtime/debug/chapterDebugHarness";

export type Act3DebugContext = Record<string, never>;

export const ACT3_DEBUG_FIXTURE: ChapterDebugFixture<Act3RuntimeState, Act3DebugContext> = {
  chapterId: "act3",
  route: "/act3",
  debugRoute: "/act3-test",
  createSession() {
    return {
      state: createDefaultAct3RuntimeState(),
      context: {},
      chapterIntroVisible: false,
    };
  },
  createResetState: createDefaultAct3RuntimeState,
  inspect(state) {
    return {
      version: state.version,
      entered: state.entered,
      emptySkeleton: true,
    };
  },
  probes: {
    "empty-skeleton"(state) {
      return {
        ok: state.version === 1 && state.entered === false,
        details: {
          version: state.version,
          entered: state.entered,
        },
      };
    },
  },
};
