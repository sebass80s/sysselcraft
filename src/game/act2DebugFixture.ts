import {
  createDefaultAct2RuntimeState,
  totalAct2Contributions,
  type Act2RuntimeState,
} from "./act2RuntimeState";
import type {
  ChapterDebugFixture,
  ChapterDebugProbeResult,
} from "../runtime/debug/chapterDebugHarness";

export type Act2DebugContext = {
  childName: string;
  backendWorldProgression: number | null;
  backendWallet: { diamonds: number; sysselBux: number } | null;
  backendSyncError: string;
};

function completedProject(project: "cabin" | "dock" | "boathouse" | "motorboat") {
  return {
    contributions: 16,
    visibleStage: 4 as const,
    consumedBeatIds: Array.from(
      { length: 16 },
      (_, index) => `${project}:${String(index + 1).padStart(2, "0")}`,
    ),
    complete: true,
  };
}

function createBaseDebugState(): Act2RuntimeState {
  return {
    ...createDefaultAct2RuntimeState(),
    entered: true,
    backendClaimBaseline: 0,
  };
}

function createFinaleDebugState(): Act2RuntimeState {
  return {
    ...createBaseDebugState(),
    openingComplete: true,
    bicycleSeen: true,
    alveIntroComplete: true,
    projects: {
      cabin: completedProject("cabin"),
      dock: completedProject("dock"),
      boathouse: completedProject("boathouse"),
      motorboat: completedProject("motorboat"),
    },
    consumedProjectCompletionIds: ["dock:completion-reaction"],
    finaleIndex: 0,
    finaleLineIndex: 0,
    familyFinaleConsumed: false,
    epilogueConsumed: false,
    act2Complete: false,
    endCardSeen: false,
  };
}

function createDebugContext(): Act2DebugContext {
  return {
    childName: "Barnet",
    backendWorldProgression: 999,
    backendWallet: null,
    backendSyncError: "",
  };
}

function inspectAct2DebugState(
  state: Act2RuntimeState,
  context: Act2DebugContext,
) {
  return {
    selectedProject: state.selectedProject,
    totalContributions: totalAct2Contributions(state),
    act2Complete: state.act2Complete,
    endCardSeen: state.endCardSeen,
    finaleIndex: state.finaleIndex,
    backendWorldProgression: context.backendWorldProgression,
    wallet: context.backendWallet,
  };
}

function contributionProbe(
  state: Act2RuntimeState,
  context: Act2DebugContext,
): ChapterDebugProbeResult {
  const total = totalAct2Contributions(state);
  return {
    ok: total >= 0 && total <= 64,
    details: {
      totalContributions: total,
      backendWorldProgression: context.backendWorldProgression,
    },
  };
}

export const ACT2_DEBUG_FIXTURE: ChapterDebugFixture<Act2RuntimeState, Act2DebugContext> = {
  chapterId: "act2",
  route: "/act2",
  debugRoute: "/act2-test",
  createSession(params) {
    const finalePreview = params.get("finale") === "1";
    return {
      state: finalePreview ? createFinaleDebugState() : createBaseDebugState(),
      context: createDebugContext(),
      chapterIntroVisible: !finalePreview,
    };
  },
  createResetState: createBaseDebugState,
  inspect: inspectAct2DebugState,
  probes: {
    "contribution-bounds": contributionProbe,
  },
};
