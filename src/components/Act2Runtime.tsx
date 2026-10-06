"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Act2LakeGameHandle } from "../game/createAct2LakeGame";
import {
  createDefaultAct2RuntimeState,
  act2FinalePending,
  act2ContributionBlockedByStoryGate,
  advanceAct2Finale,
  isMotorboatUnlocked,
  loadAct2RuntimeState,
  consumeProjectCompletionReaction,
  nextAct2Contribution,
  prerequisiteCompletionCount,
  prepareAct2ProductionEntry,
  saveAct2RuntimeState,
  withBackendClaimBaseline,
  withBackendStoryFlags,
  withMotorboatName,
  withPresentedContribution,
  withSelectedProject,
  type Act2Project,
  type Act2RuntimeState,
} from "../game/act2RuntimeState";
import { loadSaveState } from "../game/saveState";
import { getPairedChildId } from "../backend/childDeviceBinding";
import { getChildGameState } from "../backend/familyRepository";
import { JETTY_COMPLETION_REACTION, JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT } from "../game/act2JettyStory";
import { CABIN_CONTRIBUTION_BEATS, CABIN_WAITING_REACTION } from "../game/act2CabinStory";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../game/act2BoathouseStory";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../game/act2MotorboatStory";
import { ACT2_FINALE_BEATS } from "../game/act2FinaleStory";
import { beginStoryOverlay } from "../game/storyOverlayBridge";
import { deriveGameUiShell } from "../game/uiShellState";
import { StoryMoment } from "./story/StoryMoment";
import { parseStoryLine } from "../game/storyEngine";
import { StoryRunner } from "./story/StoryRunner";
import { StoryNameInput } from "./story/StoryNameInput";
import { ACT2_OPENING_BEATS } from "../game/act2OpeningStory";
import { act2PurchaseShopHref, parseAct2PurchaseProject } from "../game/act2PurchaseHandoff";
import { ACT2_PURCHASE_CATALOG } from "../game/act2PurchaseCatalog";
import { ACT2_ALVE_DIALOGUE, act2AlveImageForIndex } from "../game/act2AlveStory";
import { GameUiShell } from "../runtime/ui/GameUiShell";
import { historyEntriesFor } from "../runtime/story/storyHistory";
import { ACT2_STORY_REGISTRY, ACT2_STORYLINE_IDS, act2HistoryProgress } from "../runtime/story/act2StoryRegistry";
import { chapterAtStart, chapterCardVisible as deriveChapterCardVisible, chapterUnlocked } from "../runtime/chapter/chapterLifecycle";
import { chapterRoute, nextChapterDestination } from "../runtime/chapter/chapterRegistry";
import { deriveChapterRuntimeOverlay } from "../runtime/chapter/chapterRuntimeShell";
import { deriveAct2RuntimeBlockers } from "../game/act2RuntimeAdapter";
import { ChapterRuntimeBoundary } from "../runtime/chapter/ChapterRuntimeBoundary";
import { ChapterEndCard, ChapterIntroCard } from "../runtime/chapter/ChapterCards";
import { StoryHistoryPanel } from "../runtime/story/StoryHistoryPanel";
import { advanceStoryLine, previousStoryLineIndex, storyLineAt } from "../runtime/story/storySequence";
import { useChapterRuntimeHost, type ChapterRuntimeBootEnvironment } from "../runtime/chapter/useChapterRuntimeHost";
import { useChapterWorldHost } from "../runtime/chapter/useChapterWorldHost";



const PROJECT_COPY: Record<Act2Project, { label: string; preview: string; object: string }> = {
  cabin: { label: "Stugan", object: "stugan", preview: "Stugan... Jag hoppas min familj vill komma hit igen om vi får ordning på den." },
  dock: { label: "Bryggan", object: "bryggan", preview: "Bryggan är bra. Då kan vi knyta fast båten här sen. Och bada!" },
  boathouse: { label: "Båthuset", object: "båthuset", preview: "Båthuset måste vi fixa om vi ska kunna laga båten." },
  motorboat: { label: "Motorbåten", object: "motorbåten", preview: "Den får vänta tills Stugan, Bryggan och Båthuset är klara." },
};

type Act2RuntimeProps = {
  debug?: boolean;
  productionEnabled?: boolean;
};

type Act2ReplayBeat = {
  id: string;
  title: string;
  image?: string;
  body: readonly string[];
};

type Act2RuntimeHostContext = {
  childName: string;
  backendWorldProgression: number | null;
  backendWallet: { diamonds: number; sysselBux: number } | null;
  backendSyncError: string;
};

function createInitialAct2RuntimeHostContext(): Act2RuntimeHostContext {
  return {
    childName: "Barnet",
    backendWorldProgression: null,
    backendWallet: null,
    backendSyncError: "",
  };
}

function hasPendingAlveTurnIn(candidateState: Act2RuntimeState, worldProgression: number | null) {
  if (worldProgression === null || !candidateState.selectedProject) return false;
  return !act2ContributionBlockedByStoryGate(candidateState, candidateState.selectedProject)
    && !act2FinalePending(candidateState)
    && nextAct2Contribution(candidateState, worldProgression) !== null;
}

const ACT2_DEBUG_LAB_ENABLED = process.env.NODE_ENV !== "production";

export function Act2Runtime({ debug = false, productionEnabled = true }: Act2RuntimeProps) {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const debugHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debugTapCountRef = useRef(0);
  const debugTapResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backendWorldProgressionRef = useRef<number | null>(null);

  const bootAct2 = useCallback(async ({ debug: debugMode }: ChapterRuntimeBootEnvironment) => {
    if (debugMode) {
      const act1 = await loadSaveState();
      const finalePreview = new URLSearchParams(window.location.search).get("finale") === "1";
      const defaults = createDefaultAct2RuntimeState();
      const debugState: Act2RuntimeState = finalePreview
        ? {
            ...defaults,
            entered: true,
            openingComplete: true,
            bicycleSeen: true,
            alveIntroComplete: true,
            backendClaimBaseline: 0,
            projects: {
              cabin: { contributions: 16, visibleStage: 4, consumedBeatIds: Array.from({ length: 16 }, (_, i) => `cabin:${String(i + 1).padStart(2, "0")}`), complete: true },
              dock: { contributions: 16, visibleStage: 4, consumedBeatIds: Array.from({ length: 16 }, (_, i) => `dock:${String(i + 1).padStart(2, "0")}`), complete: true },
              boathouse: { contributions: 16, visibleStage: 4, consumedBeatIds: Array.from({ length: 16 }, (_, i) => `boathouse:${String(i + 1).padStart(2, "0")}`), complete: true },
              motorboat: { contributions: 16, visibleStage: 4, consumedBeatIds: Array.from({ length: 16 }, (_, i) => `motorboat:${String(i + 1).padStart(2, "0")}`), complete: true },
            },
            consumedProjectCompletionIds: ["dock:completion-reaction"],
            finaleIndex: 0,
            finaleLineIndex: 0,
            familyFinaleConsumed: false,
            epilogueConsumed: false,
            act2Complete: false,
            endCardSeen: false,
          }
        : {
            ...defaults,
            entered: true,
            backendClaimBaseline: 0,
          };
      return {
        accessAllowed: true,
        state: debugState,
        context: {
          childName: act1?.childName || "Barnet",
          backendWorldProgression: 999,
          backendWallet: null,
          backendSyncError: "",
        },
        chapterIntroVisible: !finalePreview,
      };
    }

    const [act2, act1, childId] = await Promise.all([
      loadAct2RuntimeState(),
      loadSaveState(),
      getPairedChildId(),
    ]);
    const childName = act1?.childName || "Barnet";
    const act1ChapterComplete = chapterUnlocked(act1?.worldFlags?.act1EndCardSeen === true);
    if (!act1ChapterComplete) {
      return {
        accessAllowed: false,
        state: act2,
        context: {
          childName,
          backendWorldProgression: null,
          backendWallet: null,
          backendSyncError: "",
        },
        chapterIntroVisible: false,
      };
    }

    let entered = prepareAct2ProductionEntry(act2);
    let backendWorldProgression: number | null = null;
    let backendWallet: { diamonds: number; sysselBux: number } | null = null;
    let backendSyncError = "";

    if (childId) {
      try {
        const backend = await getChildGameState(childId);
        if (backend) {
          backendWorldProgression = backend.progression.worldProgression;
          backendWallet = { diamonds: backend.diamonds, sysselBux: backend.sysselBux };
          entered = withBackendClaimBaseline(entered, backend.progression.worldProgression);
          entered = withBackendStoryFlags(entered, backend.worldFlags);
        }
      } catch {
        backendSyncError = "Kunde inte läsa questframsteg just nu.";
      }
    }

    const resumeProject = parseAct2PurchaseProject(
      new URLSearchParams(window.location.search).get("resume"),
    );
    if (resumeProject && !entered.projects[resumeProject].complete) {
      if (
        resumeProject === "boathouse"
        && entered.boathouseSteeringWheelOwned
        && entered.projects.boathouse.contributions < 9
      ) {
        entered = {
          ...entered,
          selectedProject: "boathouse",
          projects: {
            ...entered.projects,
            boathouse: {
              contributions: 9,
              visibleStage: 3,
              consumedBeatIds: [
                "boathouse:01", "boathouse:02", "boathouse:03",
                "boathouse:04", "boathouse:05", "boathouse:06",
                "boathouse:07", "boathouse:08", "boathouse:09",
              ],
              complete: false,
            },
          },
        };
      } else {
        entered = { ...entered, selectedProject: resumeProject };
      }
    }

    await saveAct2RuntimeState(entered);
    const atChapterStart = chapterAtStart({
      openingComplete: entered.openingComplete,
      openingIndex: entered.openingIndex,
      openingLineIndex: entered.openingLineIndex,
    });

    return {
      accessAllowed: true,
      state: entered,
      context: {
        childName,
        backendWorldProgression,
        backendWallet,
        backendSyncError,
      },
      chapterIntroVisible: atChapterStart,
      replaceHref: resumeProject ? chapterRoute("act2") : null,
    };
  }, []);

  const {
    state,
    setState,
    context: runtimeContext,
    setContext: setRuntimeContext,
    ready,
    status: runtimeShellStatus,
    chapterIntroVisible,
    setChapterIntroVisible,
    bootError,
  } = useChapterRuntimeHost<Act2RuntimeState, Act2RuntimeHostContext>({
    debug,
    productionEnabled,
    createInitialState: createDefaultAct2RuntimeState,
    createInitialContext: createInitialAct2RuntimeHostContext,
    boot: bootAct2,
    replaceRoute: router.replace,
  });
  const { childName, backendWorldProgression, backendWallet, backendSyncError } = runtimeContext;
  const stateRef = useRef(state);
  const [previewProject, setPreviewProject] = useState<Act2Project | null>(null);
  const [motorboatNameDraft, setMotorboatNameDraft] = useState("");
  const [contributionTurnInOpen, setContributionTurnInOpen] = useState(false);
  const [cabinRevisitOpen, setCabinRevisitOpen] = useState(false);
  const [cabinRevisitLineIndex, setCabinRevisitLineIndex] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyReplayOpen, setHistoryReplayOpen] = useState(false);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);

  const chapterCardVisible = deriveChapterCardVisible(ready, chapterIntroVisible, { chapterComplete: state.act2Complete, endCardSeen: state.endCardSeen });
  const {
    completionProject,
    projectChooserVisible,
    jettyPurchaseGate,
    boathousePurchaseGate,
    motorboatPurchaseGate,
    namingRequired,
    purchaseRequired,
    finalePending,
    storyUiVisible,
  } = deriveAct2RuntimeBlockers(state, {
    contributionTurnInOpen,
    cabinRevisitOpen,
    historyOpen,
    historyReplayOpen,
  });
  const runtimeOverlay = deriveChapterRuntimeOverlay(chapterCardVisible, storyUiVisible);
  const nextChapter = nextChapterDestination("act2", { chapterComplete: state.act2Complete, endCardSeen: state.endCardSeen });
  useEffect(() => {
    if (chapterCardVisible) return beginStoryOverlay();
  }, [chapterCardVisible]);

  useEffect(() => {
    if (!historyOpen && !historyReplayOpen) return;
    return beginStoryOverlay();
  }, [historyOpen, historyReplayOpen]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    backendWorldProgressionRef.current = backendWorldProgression;
  }, [backendWorldProgression]);

  const mountAct2World = useCallback(async (): Promise<Act2LakeGameHandle | null> => {
    const parent = hostRef.current;
    if (!parent) return null;
    const { createAct2LakeGame } = await import("../game/createAct2LakeGame");
    if (!hostRef.current) return null;
    return createAct2LakeGame(parent, 1, {
      onAlveTurnIn: () => setContributionTurnInOpen(true),
      onCabinRevisit: () => {
        setCabinRevisitLineIndex(0);
        setCabinRevisitOpen(true);
      },
    });
  }, []);

  const syncAct2World = useCallback((
    world: Act2LakeGameHandle,
    snapshot: {
      state: Act2RuntimeState;
      backendWorldProgression: number | null;
      worldInputEnabled: boolean;
    },
  ) => {
    const latest = snapshot.state;
    world.setActiveProject(latest.selectedProject);
    world.setAlvePresent(!(latest.act2Complete && latest.endCardSeen));
    world.setProjectStages({
      cabin: latest.projects.cabin.visibleStage,
      dock: latest.projects.dock.visibleStage,
      boathouse: latest.projects.boathouse.visibleStage,
      motorboat: latest.projects.motorboat.visibleStage,
    });
    world.setAlveTurnInAvailable(
      hasPendingAlveTurnIn(latest, snapshot.backendWorldProgression),
    );
    world.setCabinRevisitAvailable(
      latest.projects.cabin.complete && !latest.projects.motorboat.complete,
    );
    world.setWorldInputEnabled(snapshot.worldInputEnabled);
  }, []);

  const destroyAct2World = useCallback((world: Act2LakeGameHandle) => {
    world.destroy();
  }, []);

  useChapterWorldHost({
    active: ready && state.openingComplete,
    snapshot: {
      state,
      backendWorldProgression,
      worldInputEnabled: runtimeOverlay.worldInputEnabled,
    },
    mount: mountAct2World,
    sync: syncAct2World,
    destroy: destroyAct2World,
  });

  useEffect(() => {
    if (!ready || debug) return;
    let cancelled = false;
    const sync = async () => {
      try {
        const childId = await getPairedChildId();
        if (!childId) return;
        const backend = await getChildGameState(childId);
        if (!cancelled && backend) {
          backendWorldProgressionRef.current = backend.progression.worldProgression;
          setRuntimeContext((current) => ({
            ...current,
            backendWorldProgression: backend.progression.worldProgression,
            backendWallet: { diamonds: backend.diamonds, sysselBux: backend.sysselBux },
            backendSyncError: "",
          }));
          const current = await loadAct2RuntimeState();
          let next = withBackendClaimBaseline(current, backend.progression.worldProgression);
          next = withBackendStoryFlags(next, backend.worldFlags);
          const stateChanged =
            next.backendClaimBaseline !== current.backendClaimBaseline
            || next.jettyLifebuoyOwned !== current.jettyLifebuoyOwned
            || next.boathouseSteeringWheelOwned !== current.boathouseSteeringWheelOwned
            || next.motorboatPartsOwned !== current.motorboatPartsOwned;
          if (stateChanged) {
            await saveAct2RuntimeState(next);
            if (!cancelled) setState(next);
          }
        }
      } catch {
        if (!cancelled) setRuntimeContext((current) => ({
          ...current,
          backendSyncError: "Kunde inte läsa questframsteg just nu.",
        }));
      }
    };
    void sync();
    const timer = window.setInterval(() => void sync(), 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [ready, debug, setRuntimeContext, setState]);

  async function commit(next: Act2RuntimeState) {
    if (!debug) await saveAct2RuntimeState(next);
    setState(next);
  }

  async function advanceOpening() {
    const current = ACT2_OPENING_BEATS[state.openingIndex];
    if (state.openingLineIndex < current.body.length - 1) {
      await commit({ ...state, openingLineIndex: state.openingLineIndex + 1 });
      return;
    }
    if (state.openingIndex < ACT2_OPENING_BEATS.length - 1) {
      await commit({ ...state, openingIndex: state.openingIndex + 1, openingLineIndex: 0 });
    } else {
      await commit({ ...state, openingLineIndex: 0, openingComplete: true, bicycleSeen: false });
    }
  }

  async function previousOpening() {
    if (state.openingLineIndex > 0) {
      await commit({ ...state, openingLineIndex: state.openingLineIndex - 1 });
      return;
    }
    if (state.openingIndex > 0) {
      const previousIndex = state.openingIndex - 1;
      const previousBeat = ACT2_OPENING_BEATS[previousIndex];
      await commit({
        ...state,
        openingIndex: previousIndex,
        openingLineIndex: Math.max(0, previousBeat.body.length - 1),
      });
    }
  }

  async function previousBicycle() {
    const previousIndex = ACT2_OPENING_BEATS.length - 1;
    const previousBeat = ACT2_OPENING_BEATS[previousIndex];
    await commit({
      ...state,
      openingComplete: false,
      bicycleSeen: false,
      openingIndex: previousIndex,
      openingLineIndex: Math.max(0, previousBeat.body.length - 1),
    });
  }

  async function advanceAlve() {
    const beat = ACT2_ALVE_DIALOGUE[state.alveIntroIndex];
    const nextIndex = state.alveIntroIndex + 1;
    if (nextIndex >= ACT2_ALVE_DIALOGUE.length) {
      await commit({ ...state, alveIntroComplete: true, alveIntroIndex: ACT2_ALVE_DIALOGUE.length - 1 });
      return;
    }
    await commit({ ...state, alveIntroIndex: nextIndex });
    if (beat?.nameReveal) {
      // The next rendered Alve line now uses the permanent Alve nameplate.
    }
  }

  async function previousAlve() {
    if (state.alveIntroIndex <= 0) return;
    await commit({ ...state, alveIntroIndex: state.alveIntroIndex - 1 });
  }

  async function chooseProject(project: Act2Project) {
    const next = withSelectedProject(state, project);
    if (next.selectedProject !== project) return;
    await commit(next);
    setPreviewProject(null);
  }

  if (runtimeShellStatus !== "active") {
    return <ChapterRuntimeBoundary
      status={runtimeShellStatus}
      loadingText="Laddar sjön…"
      lockedTitle="Stigen är inte öppen än"
      lockedBody="Det finns mer att göra i byn innan vägen mot sjön öppnas."
      returnHref={chapterRoute("act1")}
      returnLabel="Tillbaka till byn"
    />;
  }

  const opening = ACT2_OPENING_BEATS[state.openingIndex];
  const alveBeat = ACT2_ALVE_DIALOGUE[state.alveIntroIndex];
  const displayText = alveBeat?.text.replaceAll("{childName}", childName);
  const currentAlveImage = act2AlveImageForIndex(state.alveIntroIndex);
  const nextAlveImage = state.alveIntroIndex + 1 < ACT2_ALVE_DIALOGUE.length
    ? act2AlveImageForIndex(state.alveIntroIndex + 1)
    : null;
  const alveImageComplete = nextAlveImage !== currentAlveImage;
  const prerequisiteDone = prerequisiteCompletionCount(state);
  const motorboatUnlocked = isMotorboatUnlocked(state);
  const availablePrerequisites = (["cabin", "dock", "boathouse"] as const)
    .filter((project) => !state.projects[project].complete);
  const motorboatPreview = !state.projects.boathouse.complete
    ? "Jag vill också börja med båten. Men först måste vi laga båthuset. Vi behöver verkstaden och slipen om vi ska kunna göra det ordentligt."
    : prerequisiteDone < 3
      ? "Snart. Men de andra byggena är viktigare först. Om vi ska få hela platsen att fungera igen kan vi inte bara fixa båten och lämna resten."
      : "Nu. Nu fixar vi den.";
  const selectionPrompt = prerequisiteDone === 0
    ? "Vad börjar vi med?"
    : prerequisiteDone === 1
      ? "En klar. Förut var allt trasigt. Nu är det en sak mindre. Så. Vad tar vi nu?"
      : prerequisiteDone === 2
        ? "Två klara. Då är det bara en kvar. Den har väntat länge nog."
        : "Stugan är klar. Bryggan är klar. Båthuset är klart. Det är dags.";
  const purchaseProject = jettyPurchaseGate
    ? "dock"
    : boathousePurchaseGate
      ? "boathouse"
      : motorboatPurchaseGate
        ? "motorboat"
        : null;
  const purchaseGateBeat = jettyPurchaseGate ? JETTY_LIFEBUOY_BEAT : boathousePurchaseGate ? BOATHOUSE_STEERING_WHEEL_BEAT : null;
  const purchaseGateCopy = purchaseProject ? ACT2_PURCHASE_CATALOG[purchaseProject].presentation.gate : null;
  const contributionCandidate = backendWorldProgression === null || purchaseRequired || namingRequired
    ? null
    : nextAct2Contribution(state, backendWorldProgression);
  const activeContributionBeat = contributionCandidate?.project === "dock"
    ? JETTY_CONTRIBUTION_BEATS[contributionCandidate.number - 1] ?? null
    : contributionCandidate?.project === "cabin"
      ? CABIN_CONTRIBUTION_BEATS[contributionCandidate.number - 1] ?? null
      : contributionCandidate?.project === "boathouse"
        ? BOATHOUSE_CONTRIBUTION_BEATS[contributionCandidate.number - 1] ?? null
        : contributionCandidate?.project === "motorboat"
          ? MOTORBOAT_CONTRIBUTION_BEATS[contributionCandidate.number - 1] ?? null
          : null;
  const activeContributionLine = contributionTurnInOpen
    ? activeContributionBeat?.body[state.contributionLineIndex] ?? null
    : null;
  const activeContributionPresentation = activeContributionLine
    ? parseStoryLine(activeContributionLine, childName)
    : null;
  const activeFinaleBeat = finalePending ? ACT2_FINALE_BEATS[state.finaleIndex] ?? null : null;
  const finaleLineIndex = Math.min(state.finaleLineIndex, Math.max(0, (activeFinaleBeat?.body.length ?? 1) - 1));
  const activeFinaleLine = activeFinaleBeat?.body[finaleLineIndex] ?? null;
  const activeFinalePresentation = activeFinaleLine
    ? parseStoryLine(activeFinaleLine, childName)
    : null;
  const activeCompletionBeat = completionProject === "dock"
    ? JETTY_COMPLETION_REACTION
    : null;
  const activeCompletionLine = activeCompletionBeat
    ? storyLineAt(activeCompletionBeat.body, state.completionLineIndex)
    : null;
  const activeCompletionPresentation = activeCompletionLine
    ? parseStoryLine(activeCompletionLine, childName)
    : null;
  const uiShell = deriveGameUiShell({
    debug,
    worldReady: state.openingComplete && state.alveIntroComplete,
    blockingOverlayVisible: runtimeOverlay.blockingOverlayVisible,
    projectStatusAvailable: state.selectedProject !== null,
  });
  const hudVisible = uiShell.showHud;
  const activeCabinRevisitLine = cabinRevisitOpen
    ? storyLineAt(CABIN_WAITING_REACTION.body, cabinRevisitLineIndex)
    : null;
  const activeCabinRevisitPresentation = activeCabinRevisitLine
    ? parseStoryLine(activeCabinRevisitLine, childName)
    : null;

  const historyGroupByStoryline: Record<string, string> = {
    [ACT2_STORYLINE_IDS.opening]: "Inledning",
    [ACT2_STORYLINE_IDS.cabin]: "Stugan",
    [ACT2_STORYLINE_IDS.dock]: "Bryggan",
    [ACT2_STORYLINE_IDS.boathouse]: "Båthuset",
    [ACT2_STORYLINE_IDS.motorboat]: "Motorbåten",
    [ACT2_STORYLINE_IDS.finale]: "Finalen",
  };

  const historyEntries = historyEntriesFor(
    ACT2_STORY_REGISTRY,
    act2HistoryProgress(state),
  ).map(({ storylineId, beat }) => ({
    group: historyGroupByStoryline[storylineId] ?? storylineId,
    beat,
  }));

  const historyGroups = historyEntries.reduce<Array<{ label: string; entries: Act2ReplayBeat[] }>>((groups, entry) => {
    const existing = groups.find((group) => group.label === entry.group);
    if (existing) existing.entries.push(entry.beat);
    else groups.push({ label: entry.group, entries: [entry.beat] });
    return groups;
  }, []);

  async function previousFinaleStory() {
    if (finaleLineIndex <= 0) return;
    await commit({ ...state, finaleLineIndex: finaleLineIndex - 1 });
  }

  async function advanceFinaleStory() {
    if (!activeFinaleBeat) return;
    if (finaleLineIndex + 1 < activeFinaleBeat.body.length) {
      await commit({ ...state, finaleLineIndex: finaleLineIndex + 1 });
      return;
    }
    await commit(advanceAct2Finale(state));
  }

  async function previousCompletionReaction() {
    if (!activeCompletionBeat) return;
    const previous = previousStoryLineIndex(
      activeCompletionBeat.body.length,
      state.completionLineIndex,
    );
    if (previous === state.completionLineIndex) return;
    await commit({ ...state, completionLineIndex: previous });
  }

  async function advanceCompletionReaction() {
    if (!completionProject || !activeCompletionBeat) return;
    const step = advanceStoryLine(
      activeCompletionBeat.body.length,
      state.completionLineIndex,
    );
    if (step.type === "line") {
      await commit({ ...state, completionLineIndex: step.index });
      return;
    }
    await commit(consumeProjectCompletionReaction(state, completionProject));
  }

  function previousCabinRevisit() {
    setCabinRevisitLineIndex((index) =>
      previousStoryLineIndex(CABIN_WAITING_REACTION.body.length, index),
    );
  }

  function advanceCabinRevisit() {
    const step = advanceStoryLine(
      CABIN_WAITING_REACTION.body.length,
      cabinRevisitLineIndex,
    );
    if (step.type === "line") {
      setCabinRevisitLineIndex(step.index);
      return;
    }
    setCabinRevisitOpen(false);
    setCabinRevisitLineIndex(0);
  }

  async function previousContributionStory() {
    if (state.contributionLineIndex <= 0) return;
    await commit({ ...state, contributionLineIndex: state.contributionLineIndex - 1 });
  }

  async function advanceContributionStory() {
    if (!contributionCandidate || !activeContributionBeat) return;
    if (state.contributionLineIndex + 1 < activeContributionBeat.body.length) {
      await commit({ ...state, contributionLineIndex: state.contributionLineIndex + 1 });
      return;
    }
    const next = withPresentedContribution(
      state,
      contributionCandidate.project,
      contributionCandidate.beatId,
    );
    await commit(next);
    if (next.projects.motorboat.complete) {
      setCabinRevisitOpen(false);
      setCabinRevisitLineIndex(0);
    }
    setContributionTurnInOpen(false);
  }

  const openStoryDebugLab = () => {
    if (!ACT2_DEBUG_LAB_ENABLED) return;
    if (debugHoldTimerRef.current) {
      clearTimeout(debugHoldTimerRef.current);
      debugHoldTimerRef.current = null;
    }
    router.push("/act2-test");
  };

  const cancelDebugHold = () => {
    if (debugHoldTimerRef.current) {
      clearTimeout(debugHoldTimerRef.current);
      debugHoldTimerRef.current = null;
    }
  };

  const startDebugHold = () => {
    cancelDebugHold();
    debugHoldTimerRef.current = setTimeout(openStoryDebugLab, 650);
  };

  const registerDebugTap = () => {
    debugTapCountRef.current += 1;
    if (debugTapResetRef.current) clearTimeout(debugTapResetRef.current);
    if (debugTapCountRef.current >= 5) {
      debugTapCountRef.current = 0;
      openStoryDebugLab();
      return;
    }
    debugTapResetRef.current = setTimeout(() => {
      debugTapCountRef.current = 0;
      debugTapResetRef.current = null;
    }, 1800);
  };

  return <main style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#1f3427" }}>
    <GameUiShell
      visible={hudVisible}
      diamonds={backendWallet?.diamonds ?? "…"}
      sysselBux={backendWallet?.sysselBux ?? "…"}
      menuOpen={mainMenuOpen}
      onMenuToggle={() => setMainMenuOpen((open) => !open)}
      menuItems={[
        {
          id: "adult-mode",
          label: "🔐 Vuxenläge",
          onSelect: () => router.push(`${chapterRoute("act1")}?menu=adult`),
        },
        {
          id: "history",
          label: "📖 Historik",
          hidden: historyEntries.length === 0,
          onSelect: () => {
            setMainMenuOpen(false);
            setHistoryOpen(true);
          },
        },
        {
          id: "village",
          label: "← Till byn",
          onSelect: () => router.push(chapterRoute("act1")),
        },
      ]}
      contextualActions={state.act2Complete && state.endCardSeen && nextChapter ? (
        <button
          className="secondary-button compact act2-chapter3-button"
          type="button"
          onClick={() => router.push(nextChapter.route)}
        >
          Till kapitel 3 →
        </button>
      ) : undefined}
    />
    <StoryHistoryPanel
      open={historyOpen}
      eyebrow="Kapitel 2"
      title="Historik"
      description="Spela upp redan genomförda storybeats. Replay ändrar inte framsteg eller belöningar."
      groups={historyGroups}
      childName={childName}
      parseLine={parseStoryLine}
      onClose={() => setHistoryOpen(false)}
      onReplayOpenChange={setHistoryReplayOpen}
    />
    {chapterIntroVisible && <ChapterIntroCard
      chapterLabel="KAPITEL 2"
      title="ALVE"
      ariaLabel="Kapitel 2 · Alve"
      onContinue={() => setChapterIntroVisible(false)}
    />}
    {debug && <div style={{
      position: "fixed", top: "max(8px, env(safe-area-inset-top))", right: 10, zIndex: 150,
      display: "flex", gap: 6, padding: 7, borderRadius: 10, background: "rgba(22,28,22,.88)",
    }}>
      <button className="secondary-button compact" type="button" onClick={() => {
        const reset: Act2RuntimeState = {
          ...createDefaultAct2RuntimeState(),
          entered: true,
          backendClaimBaseline: 0,
        };
        setState(reset);
        setPreviewProject(null);
        setContributionTurnInOpen(false);
        setCabinRevisitOpen(false);
        setCabinRevisitLineIndex(0);
      }}>↺ Act 2</button>
      <button className="secondary-button compact" type="button" onClick={() => setState((current) => ({
        ...current,
        jettyLifebuoyOwned: true,
        boathouseSteeringWheelOwned: true,
        motorboatPartsOwned: true,
      }))}>Ge testköp</button>
      <span style={{ alignSelf: "center", color: "white", fontSize: 12, fontWeight: 800 }}>DEBUG · production UI</span>
    </div>}
    {!debug && ACT2_DEBUG_LAB_ENABLED && (<button
      type="button"
      aria-label="Akt 2 · Sjön"
      title="Akt 2 · Sjön"
      onTouchStart={startDebugHold}
      onTouchEnd={cancelDebugHold}
      onTouchCancel={cancelDebugHold}
      onPointerDown={(event) => { if (event.pointerType !== "touch") startDebugHold(); }}
      onPointerUp={(event) => { if (event.pointerType !== "touch") cancelDebugHold(); }}
      onPointerCancel={(event) => { if (event.pointerType !== "touch") cancelDebugHold(); }}
      onClick={registerDebugTap}
      onContextMenu={(event) => event.preventDefault()}
      style={{
        position: "absolute",
        top: "max(8px, env(safe-area-inset-top))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 35,
        border: 0,
        borderRadius: 999,
        padding: "6px 11px",
        background: "rgba(22,28,22,.72)",
        color: "rgba(255,255,255,.82)",
        fontSize: 12,
        fontWeight: 800,
        touchAction: "none",
      }}
    >
      Akt 2 · Sjön
    </button>)}

    {state.openingComplete && <div ref={hostRef} style={{ position: "absolute", inset: 0 }} aria-label="Sjön i Act 2" />}

    {!state.openingComplete && <StoryRunner
      beat={{
        id: `act2:opening:${state.openingIndex}:${state.openingLineIndex}`,
        image: opening.image,
        heading: opening.title,
        lines: [opening.body[state.openingLineIndex] ?? opening.body[0]],
        nextLabel: state.openingIndex === ACT2_OPENING_BEATS.length - 1 && state.openingLineIndex === opening.body.length - 1 ? "Gå närmare" : "Fortsätt",
      }}
      onPrevious={state.openingIndex > 0 || state.openingLineIndex > 0 ? () => previousOpening() : undefined}
      onNext={() => advanceOpening()}
      revealImageBeforeNext={state.openingLineIndex === opening.body.length - 1}
      childName={childName}
      background="#111"
    />}

    {state.openingComplete && !state.bicycleSeen && <StoryRunner
      beat={{
        id: "act2:bicycle",
        image: "/assets/village/story-moments/act2/meeting-alve/bike.png",
        speaker: childName,
        speakerTone: "child",
        lines: ["Du hör någon som spikar med en hammare längre bort"],
        nextLabel: "Fortsätt",
      }}
      onPrevious={() => previousBicycle()}
      onNext={() => commit({ ...state, bicycleSeen: true })}
      revealImageBeforeNext
    />}

    {state.bicycleSeen && !state.alveIntroComplete && <StoryRunner
      beat={{
        id: `act2:alve-intro:${state.alveIntroIndex}`,
        image: currentAlveImage,
        speaker: alveBeat?.speaker ? (alveBeat.speaker === "child" ? childName : alveBeat.speaker === "alve" ? "Alve" : "Barnet") : undefined,
        speakerTone: alveBeat?.speaker === "child" ? "child" : "default",
        lines: displayText ? [displayText] : [],
        nextLabel: state.alveIntroIndex === ACT2_ALVE_DIALOGUE.length - 1 ? "Välj projekt" : "Fortsätt",
      }}
      onPrevious={state.alveIntroIndex > 0 ? () => previousAlve() : undefined}
      onNext={() => advanceAlve()}
      revealImageBeforeNext={alveImageComplete}
    />}

    {projectChooserVisible && <StoryMoment
      image="/assets/village/story-moments/act2/meeting-alve/pick.png"
      speaker="Alve"
    >
      <p>{previewProject === "motorboat" ? motorboatPreview : previewProject ? PROJECT_COPY[previewProject].preview : selectionPrompt}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {availablePrerequisites.map((project) =>
          <button key={project} className="secondary-button" onClick={() => setPreviewProject(project)}>{PROJECT_COPY[project].label}</button>
        )}
        <button className="secondary-button" onClick={() => setPreviewProject("motorboat")}>
          {motorboatUnlocked ? "Motorbåten" : "🔒 Motorbåten"}
        </button>
      </div>
      {previewProject && (previewProject !== "motorboat" || motorboatUnlocked) && <button className="primary-button dialogue-next" onClick={() => void chooseProject(previewProject)}>
        Laga {PROJECT_COPY[previewProject].object}
      </button>}
    </StoryMoment>}

    {finalePending && activeFinaleBeat && activeFinaleLine && <StoryRunner
      beat={{
        id: `act2:finale:${state.finaleIndex}:${state.finaleLineIndex}`,
        image: activeFinaleBeat.image,
        imageFit: "contain",
        heading: activeFinaleBeat.title,
        speaker: activeFinalePresentation?.speaker,
        speakerTone: activeFinalePresentation?.speakerTone,
        lines: activeFinalePresentation ? [activeFinalePresentation.text] : [],
        nextLabel: finaleLineIndex + 1 < activeFinaleBeat.body.length ? "Fortsätt" : state.finaleIndex === ACT2_FINALE_BEATS.length - 1 ? "SLUT PÅ ANDRA KAPITLET" : "Nästa",
      }}
      onPrevious={finaleLineIndex > 0 ? () => previousFinaleStory() : undefined}
      onNext={() => advanceFinaleStory()}
      revealImageBeforeNext={finaleLineIndex + 1 >= activeFinaleBeat.body.length}
      zIndex={100}
      background="rgba(6,10,8,.96)"
    />}
    {cabinRevisitOpen && activeCabinRevisitLine && !state.projects.motorboat.complete && <StoryRunner
      beat={{
        id: `act2:cabin-revisit:${cabinRevisitLineIndex}`,
        image: CABIN_WAITING_REACTION.image,
        imageFit: "contain",
        heading: CABIN_WAITING_REACTION.title,
        speaker: activeCabinRevisitPresentation?.speaker,
        speakerTone: activeCabinRevisitPresentation?.speakerTone,
        lines: activeCabinRevisitPresentation ? [activeCabinRevisitPresentation.text] : [],
        nextLabel: cabinRevisitLineIndex + 1 < CABIN_WAITING_REACTION.body.length ? "Fortsätt" : "Tillbaka",
      }}
      onPrevious={cabinRevisitLineIndex > 0 ? previousCabinRevisit : undefined}
      onNext={advanceCabinRevisit}
      revealImageBeforeNext={cabinRevisitLineIndex + 1 >= CABIN_WAITING_REACTION.body.length}
      zIndex={92}
      background="rgba(9,14,10,.94)"
    />}
    {completionProject && activeCompletionBeat && activeCompletionLine && <StoryRunner
      beat={{
        id: `act2:completion:${completionProject}:${state.completionLineIndex}`,
        image: activeCompletionBeat.image,
        imageFit: "contain",
        heading: activeCompletionBeat.title,
        speaker: activeCompletionPresentation?.speaker,
        speakerTone: activeCompletionPresentation?.speakerTone,
        lines: activeCompletionPresentation ? [activeCompletionPresentation.text] : [],
        nextLabel: state.completionLineIndex + 1 < activeCompletionBeat.body.length ? "Fortsätt" : "Tillbaka till projekten",
      }}
      onPrevious={state.completionLineIndex > 0 ? () => previousCompletionReaction() : undefined}
      onNext={() => advanceCompletionReaction()}
      revealImageBeforeNext={state.completionLineIndex + 1 >= activeCompletionBeat.body.length}
      zIndex={90}
      background="rgba(9,14,10,.94)"
    />}
    {purchaseRequired && purchaseProject && purchaseGateCopy && <StoryMoment
      image={purchaseGateBeat?.image}
      imageFit="contain"
      heading={purchaseGateCopy.title}
      zIndex={78}
      background="rgba(9,14,10,.94)"
    >
      <p>{purchaseGateCopy.text}</p>
      <p>{purchaseGateCopy.detail}</p>
      <a
        className="primary-button dialogue-next"
        href={act2PurchaseShopHref(purchaseProject)}
      >
        Till Mira i byn
      </a>
    </StoryMoment>}
    {namingRequired && <StoryMoment
      speaker="Alve"
      zIndex={85}
      background="rgba(9,14,10,.94)"
    >
      <p>Den behöver ett namn.</p>
      <StoryNameInput
        value={motorboatNameDraft}
        onValueChange={setMotorboatNameDraft}
        maxLength={24}
        placeholder="Skriv båtens namn"
        ariaLabel="Båtens namn"
        submitLabel="Spara namnet"
        onSubmit={() => commit(withMotorboatName(state, motorboatNameDraft))}
      />
    </StoryMoment>}
    {contributionTurnInOpen && contributionCandidate && activeContributionBeat && activeContributionLine && <StoryMoment
      image={activeContributionBeat.image}
      imageFit="contain"
      speaker={activeContributionPresentation?.speaker}
      speakerTone={activeContributionPresentation?.speakerTone}
      previousLabel="Föregående"
      onPrevious={state.contributionLineIndex > 0 ? () => previousContributionStory() : undefined}
      nextLabel={state.contributionLineIndex + 1 < activeContributionBeat.body.length ? "Fortsätt" : "Klart"}
      onNext={() => advanceContributionStory()}
      revealImageBeforeNext={state.contributionLineIndex + 1 >= activeContributionBeat.body.length}
      presentationId={`${activeContributionBeat.id}:${state.contributionLineIndex}`}
      zIndex={80}
      background="rgba(9,14,10,.94)"
    >
      <p>{activeContributionPresentation?.text}</p>
    </StoryMoment>}
    {state.act2Complete && !state.endCardSeen && <ChapterEndCard
      title="SLUT PÅ ANDRA KAPITLET"
      ariaLabel="Slut på andra kapitlet"
      continueLabel="Fortsätt vid sjön"
      onContinue={() => commit({ ...state, endCardSeen: true })}
    />}
    {(bootError || backendSyncError) && <div role="status" className="act2-sync-status">{bootError || backendSyncError}</div>}
    {uiShell.showProjectStatus && state.selectedProject && <div className="act2-project-status" aria-label="Aktivt projekt">
      <strong>Aktivt projekt: {PROJECT_COPY[state.selectedProject].label} · {state.projects[state.selectedProject].contributions}/16</strong>
    </div>}
  </main>;
}
