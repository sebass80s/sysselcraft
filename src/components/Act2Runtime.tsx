"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Act2LakeGameHandle } from "../game/createAct2LakeGame";
import {
  createDefaultAct2RuntimeState,
  act2FinalePending,
  advanceAct2Finale,
  isMotorboatUnlocked,
  loadAct2RuntimeState,
  consumeProjectCompletionReaction,
  boathousePurchaseRequired,
  jettyPurchaseRequired,
  motorboatNamingRequired,
  motorboatPartsPurchaseRequired,
  nextAct2Contribution,
  prerequisiteCompletionCount,
  prepareAct2ProductionEntry,
  projectCompletionReactionPending,
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
import { StoryMoment } from "./story/StoryMoment";
import { parseStoryLine } from "../game/storyEngine";
import { StoryRunner } from "./story/StoryRunner";
import { ACT2_OPENING_BEATS } from "../game/act2OpeningStory";
import { ACT2_ALVE_DIALOGUE, act2AlveImageForIndex } from "../game/act2AlveStory";



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

const ACT2_DEBUG_LAB_ENABLED = process.env.NODE_ENV !== "production";

export function Act2Runtime({ debug = false, productionEnabled = true }: Act2RuntimeProps) {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const debugHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debugTapCountRef = useRef(0);
  const debugTapResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameRef = useRef<Act2LakeGameHandle | null>(null);
  const [state, setState] = useState<Act2RuntimeState>(createDefaultAct2RuntimeState);
  const stateRef = useRef(state);
  const [ready, setReady] = useState(false);
  const [childName, setChildName] = useState("Barnet");
  const [previewProject, setPreviewProject] = useState<Act2Project | null>(null);
  const [backendWorldProgression, setBackendWorldProgression] = useState<number | null>(null);
  const [backendWallet, setBackendWallet] = useState<{ diamonds: number; sysselBux: number } | null>(null);
  const backendWorldProgressionRef = useRef<number | null>(null);
  const [backendSyncError, setBackendSyncError] = useState("");
  const [motorboatNameDraft, setMotorboatNameDraft] = useState("");
  const [contributionTurnInOpen, setContributionTurnInOpen] = useState(false);
  const [cabinRevisitOpen, setCabinRevisitOpen] = useState(false);
  const [cabinRevisitLineIndex, setCabinRevisitLineIndex] = useState(0);
  const [act2AccessAllowed, setAct2AccessAllowed] = useState(false);
  const [chapterIntroVisible, setChapterIntroVisible] = useState(true);
  const [chapterIntroNameVisible, setChapterIntroNameVisible] = useState(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  function hasPendingAlveTurnIn(candidateState: Act2RuntimeState, worldProgression: number | null) {
    if (worldProgression === null || !candidateState.selectedProject) return false;
    const blockedByPurchase =
      (candidateState.selectedProject === "dock" && jettyPurchaseRequired(candidateState))
      || (candidateState.selectedProject === "boathouse" && boathousePurchaseRequired(candidateState))
      || (candidateState.selectedProject === "motorboat" && motorboatPartsPurchaseRequired(candidateState));
    const blockedByNaming =
      candidateState.selectedProject === "motorboat" && motorboatNamingRequired(candidateState);
    return !blockedByPurchase
      && !blockedByNaming
      && !act2FinalePending(candidateState)
      && nextAct2Contribution(candidateState, worldProgression) !== null;
  }


  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Shipping lock must be a hard side-effect boundary. Merely visiting the
      // locked production route must never establish Act 2 entry/baseline state,
      // otherwise quests completed before release can become latent Act 2 backlog.
      if (!debug && !productionEnabled) {
        setReady(true);
        return;
      }

      if (debug) {
        const act1 = await loadSaveState();
        if (cancelled) return;
        setChildName(act1?.childName || "Barnet");
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
        backendWorldProgressionRef.current = 999;
        setBackendWorldProgression(999);
        setAct2AccessAllowed(true);
        setChapterIntroVisible(!finalePreview);
        setChapterIntroNameVisible(false);
        setState(debugState);
        setReady(true);
        return;
      }

      const [act2, act1, childId] = await Promise.all([
        loadAct2RuntimeState(),
        loadSaveState(),
        getPairedChildId(),
      ]);
      if (cancelled) return;
      setChildName(act1?.childName || "Barnet");
      const act1ChapterComplete = act1?.worldFlags?.act1EndCardSeen === true;
      if (!act1ChapterComplete) {
        setAct2AccessAllowed(false);
        setReady(true);
        return;
      }
      setAct2AccessAllowed(true);
      let entered: Act2RuntimeState = prepareAct2ProductionEntry(act2);
      if (childId) {
        try {
          const backend = await getChildGameState(childId);
          if (cancelled) return;
          if (backend) {
            backendWorldProgressionRef.current = backend.progression.worldProgression;
            setBackendWorldProgression(backend.progression.worldProgression);
            setBackendWallet({ diamonds: backend.diamonds, sysselBux: backend.sysselBux });
            entered = withBackendClaimBaseline(entered, backend.progression.worldProgression);
            entered = withBackendStoryFlags(entered, backend.worldFlags);
          }
        } catch {
          if (!cancelled) setBackendSyncError("Kunde inte läsa questframsteg just nu.");
        }
      }
      const resumeProject = new URLSearchParams(window.location.search).get("resume");
      if (
        (resumeProject === "boathouse" || resumeProject === "dock")
        && !entered.projects[resumeProject].complete
      ) {
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
      if (cancelled) return;
      const atChapterStart =
        !entered.openingComplete
        && entered.openingIndex === 0
        && entered.openingLineIndex === 0;
      setChapterIntroVisible(atChapterStart);
      setChapterIntroNameVisible(false);
      setState(entered);
      setReady(true);
      if (resumeProject === "boathouse" || resumeProject === "dock") {
        router.replace("/act2");
      }
    })();
    return () => { cancelled = true; };
  }, [debug, productionEnabled, router]);

  useEffect(() => {
    if (!ready || !state.openingComplete || !hostRef.current) return;
    let disposed = false;
    import("../game/createAct2LakeGame").then(async ({ createAct2LakeGame }) => {
      if (disposed || !hostRef.current) return;
      gameRef.current = await createAct2LakeGame(hostRef.current, 1, {
        onAlveTurnIn: () => setContributionTurnInOpen(true),
        onCabinRevisit: () => {
          setCabinRevisitLineIndex(0);
          setCabinRevisitOpen(true);
        },
      });
      const latest = debug ? stateRef.current : await loadAct2RuntimeState();
      gameRef.current.setActiveProject(latest.selectedProject);
      gameRef.current.setProjectStages({
        cabin: latest.projects.cabin.visibleStage,
        dock: latest.projects.dock.visibleStage,
        boathouse: latest.projects.boathouse.visibleStage,
        motorboat: latest.projects.motorboat.visibleStage,
      });
      gameRef.current.setAlveTurnInAvailable(
        hasPendingAlveTurnIn(latest, backendWorldProgressionRef.current),
      );
      gameRef.current.setCabinRevisitAvailable(
        latest.projects.cabin.complete && !latest.projects.motorboat.complete,
      );
    });
    return () => {
      disposed = true;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, [ready, state.openingComplete, debug]);

  useEffect(() => {
    gameRef.current?.setProjectStages({
      cabin: state.projects.cabin.visibleStage,
      dock: state.projects.dock.visibleStage,
      boathouse: state.projects.boathouse.visibleStage,
      motorboat: state.projects.motorboat.visibleStage,
    });
  }, [
    state.projects.cabin.visibleStage,
    state.projects.dock.visibleStage,
    state.projects.boathouse.visibleStage,
    state.projects.motorboat.visibleStage,
  ]);

  useEffect(() => {
    gameRef.current?.setActiveProject(state.selectedProject);
  }, [state.selectedProject]);

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
          setBackendWorldProgression(backend.progression.worldProgression);
          setBackendWallet({ diamonds: backend.diamonds, sysselBux: backend.sysselBux });
          setBackendSyncError("");
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
        if (!cancelled) setBackendSyncError("Kunde inte läsa questframsteg just nu.");
      }
    };
    void sync();
    const timer = window.setInterval(() => void sync(), 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [ready, debug]);

  useEffect(() => {
    const pending = hasPendingAlveTurnIn(state, backendWorldProgression);
    gameRef.current?.setAlveTurnInAvailable(pending);
  }, [state, backendWorldProgression]);

  useEffect(() => {
    gameRef.current?.setCabinRevisitAvailable(
      state.projects.cabin.complete && !state.projects.motorboat.complete,
    );
  }, [state.projects.cabin.complete, state.projects.motorboat.complete]);

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

  async function chooseProject(project: Act2Project) {
    const next = withSelectedProject(state, project);
    if (next.selectedProject !== project) return;
    await commit(next);
    setPreviewProject(null);
  }

  if (!ready) return <main className="parent-page"><p>Laddar sjön…</p></main>;
  if (!debug && !productionEnabled) {
    return <main className="parent-page">
      <h1>Stigen är inte öppen än</h1>
      <p>Det finns mer att göra i byn innan vägen mot sjön öppnas.</p>
      <a className="primary-button" href="/">Tillbaka till byn</a>
    </main>;
  }
  if (!debug && !act2AccessAllowed) {
    return <main className="parent-page">
      <h1>Stigen är inte öppen än</h1>
      <p>Det finns mer att göra i byn innan vägen mot sjön öppnas.</p>
      <a className="primary-button" href="/">Tillbaka till byn</a>
    </main>;
  }

  const opening = ACT2_OPENING_BEATS[state.openingIndex];
  const alveBeat = ACT2_ALVE_DIALOGUE[state.alveIntroIndex];
  const displayText = alveBeat?.text.replaceAll("{childName}", childName);
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
  const jettyPurchaseGate = state.selectedProject === "dock" && jettyPurchaseRequired(state);
  const boathousePurchaseGate = state.selectedProject === "boathouse" && boathousePurchaseRequired(state);
  const motorboatPurchaseGate = state.selectedProject === "motorboat" && motorboatPartsPurchaseRequired(state);
  const namingRequired = state.selectedProject === "motorboat" && motorboatNamingRequired(state);
  const purchaseRequired = jettyPurchaseGate || boathousePurchaseGate || motorboatPurchaseGate;
  const purchaseGateBeat = jettyPurchaseGate ? JETTY_LIFEBUOY_BEAT : boathousePurchaseGate ? BOATHOUSE_STEERING_WHEEL_BEAT : null;
  const purchaseGateCopy = jettyPurchaseGate
    ? { title: "Bryggan · nästa steg", text: "Sol vill att ni skaffar en riktig livboj innan arbetet fortsätter.", detail: "Mira kan ordna den i lanthandeln för 200 SysselBux." }
    : boathousePurchaseGate
      ? { title: "Båthuset · nästa steg", text: "Lådbilen behöver en riktig ratt innan ni kan bygga vidare.", detail: "Mira har en som passar för 200 SysselBux." }
      : { title: "Motorbåten · nästa steg", text: "Linus har konstaterat att några delar inte går att rädda.", detail: "Mira kan beställa reservdelspaketet för 200 SysselBux." };
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
  const finalePending = act2FinalePending(state);
  const activeFinaleBeat = finalePending ? ACT2_FINALE_BEATS[state.finaleIndex] ?? null : null;
  const activeFinaleLine = activeFinaleBeat?.body[state.finaleLineIndex] ?? null;
  const activeFinalePresentation = activeFinaleLine
    ? parseStoryLine(activeFinaleLine, childName)
    : null;
  const completionProject = (["dock"] as const)
    .find((project) => projectCompletionReactionPending(state, project)) ?? null;
  const activeCompletionBeat = completionProject === "dock"
    ? JETTY_COMPLETION_REACTION
    : null;
  const activeCompletionLine = activeCompletionBeat?.body[state.completionLineIndex] ?? null;
  const activeCompletionPresentation = activeCompletionLine
    ? parseStoryLine(activeCompletionLine, childName)
    : null;
  const hudVisible =
    !debug
    && !chapterIntroVisible
    && state.openingComplete
    && state.alveIntroComplete
    && state.selectedProject !== null
    && !finalePending
    && !completionProject
    && !purchaseRequired
    && !namingRequired
    && !contributionTurnInOpen
    && !cabinRevisitOpen;
  const activeCabinRevisitLine = cabinRevisitOpen
    ? CABIN_WAITING_REACTION.body[cabinRevisitLineIndex] ?? null
    : null;
  const activeCabinRevisitPresentation = activeCabinRevisitLine
    ? parseStoryLine(activeCabinRevisitLine, childName)
    : null;

  async function advanceFinaleStory() {
    if (!activeFinaleBeat) return;
    if (state.finaleLineIndex + 1 < activeFinaleBeat.body.length) {
      await commit({ ...state, finaleLineIndex: state.finaleLineIndex + 1 });
      return;
    }
    await commit(advanceAct2Finale(state));
  }

  async function advanceCompletionReaction() {
    if (!completionProject || !activeCompletionBeat) return;
    if (state.completionLineIndex + 1 < activeCompletionBeat.body.length) {
      await commit({ ...state, completionLineIndex: state.completionLineIndex + 1 });
      return;
    }
    await commit(consumeProjectCompletionReaction(state, completionProject));
  }

  function advanceCabinRevisit() {
    if (cabinRevisitLineIndex + 1 < CABIN_WAITING_REACTION.body.length) {
      setCabinRevisitLineIndex((index) => index + 1);
      return;
    }
    setCabinRevisitOpen(false);
    setCabinRevisitLineIndex(0);
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
      contributionCandidate.visibleStage,
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
    {hudVisible && <header className="prototype-header" aria-label="SysselCraft HUD">
      <div className="prototype-brand-row">
        <button
          className="prototype-brand-button"
          type="button"
          onClick={() => router.push("/")}
          aria-label="Till byn"
          title="Till byn"
        >
          <Image className="prototype-brand-logo" src="/assets/village/sysselcraft-logo.png" alt="SysselCraft" width={360} height={124} priority />
        </button>
        <button className="secondary-button compact act2-village-button" type="button" onClick={() => router.push("/")}>
          ← Till byn
        </button>
      </div>
      <div className="resource-hud" aria-label="Resurser">
        <strong>💎 {backendWallet?.diamonds ?? "…"}</strong>
        <strong>🪙 {backendWallet?.sysselBux ?? "…"}</strong>
      </div>
    </header>}
    {chapterIntroVisible && <div className="act2-chapter-intro" role="dialog" aria-modal="true" aria-label="Kapitel 2 · Alve">
      <div className="act2-chapter-intro-title">
        <span>KAPITEL 2</span>
        <strong className={chapterIntroNameVisible ? "is-visible" : ""}>ALVE</strong>
        <button
          className="primary-button act2-chapter-intro-next"
          type="button"
          onClick={() => {
            if (!chapterIntroNameVisible) {
              setChapterIntroNameVisible(true);
              return;
            }
            setChapterIntroVisible(false);
          }}
        >
          {chapterIntroNameVisible ? "Fortsätt" : "Fortsätt"}
        </button>
      </div>
    </div>}
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
        id: `act2:opening:${state.openingIndex}`,
        image: opening.image,
        heading: opening.title,
        lines: [opening.body[state.openingLineIndex] ?? opening.body[0]],
        nextLabel: state.openingIndex === ACT2_OPENING_BEATS.length - 1 && state.openingLineIndex === opening.body.length - 1 ? "Gå närmare" : "Fortsätt",
      }}
      onNext={() => void advanceOpening()}
      childName={childName}
      dialogueClassName="act2-dialogue-card"
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
      onNext={() => void commit({ ...state, bicycleSeen: true })}
      dialogueClassName="act2-dialogue-card"
    />}

    {state.bicycleSeen && !state.alveIntroComplete && <StoryRunner
      beat={{
        id: `act2:alve-intro:${state.alveIntroIndex}`,
        image: act2AlveImageForIndex(state.alveIntroIndex),
        speaker: alveBeat?.speaker ? (alveBeat.speaker === "child" ? childName : alveBeat.speaker === "alve" ? "Alve" : "Barnet") : undefined,
        speakerTone: alveBeat?.speaker === "child" ? "child" : "default",
        lines: displayText ? [displayText] : [],
        nextLabel: state.alveIntroIndex === ACT2_ALVE_DIALOGUE.length - 1 ? "Välj projekt" : "Fortsätt",
      }}
      onNext={() => void advanceAlve()}
      dialogueClassName="act2-dialogue-card"
    />}

    {state.alveIntroComplete && !state.selectedProject && !state.projects.motorboat.complete && !completionProject && <StoryMoment
      image="/assets/village/story-moments/act2/meeting-alve/pick.png"
      speaker="Alve"
      dialogueClassName="act2-dialogue-card"
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
        nextLabel: state.finaleLineIndex + 1 < activeFinaleBeat.body.length ? "Fortsätt" : state.finaleIndex === ACT2_FINALE_BEATS.length - 1 ? "SLUT PÅ ANDRA KAPITLET" : "Nästa",
      }}
      onNext={() => void advanceFinaleStory()}
      dialogueClassName="act2-dialogue-card"
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
      onNext={advanceCabinRevisit}
      dialogueClassName="act2-dialogue-card"
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
      onNext={() => void advanceCompletionReaction()}
      dialogueClassName="act2-dialogue-card"
      zIndex={90}
      background="rgba(9,14,10,.94)"
    />}
    {purchaseRequired && <StoryMoment
      image={purchaseGateBeat?.image}
      imageFit="contain"
      heading={purchaseGateCopy.title}
      zIndex={78}
      background="rgba(9,14,10,.94)"
      dialogueClassName="act2-dialogue-card"
    >
      <p>{purchaseGateCopy.text}</p>
      <p>{purchaseGateCopy.detail}</p>
      <a
        className="primary-button dialogue-next"
        href={boathousePurchaseGate ? "/?act2-purchase=boathouse" : jettyPurchaseGate ? "/?act2-purchase=dock" : "/?act2-purchase=motorboat"}
      >
        Till Mira i byn
      </a>
    </StoryMoment>}
    {namingRequired && <StoryMoment
      speaker="Alve"
      zIndex={85}
      background="rgba(9,14,10,.94)"
      dialogueClassName="act2-dialogue-card"
    >
      <p>Den behöver ett namn.</p>
      <input
        value={motorboatNameDraft}
        onChange={(event) => setMotorboatNameDraft(event.target.value)}
        maxLength={24}
        placeholder="Skriv båtens namn"
        aria-label="Båtens namn"
      />
      <button className="primary-button dialogue-next" disabled={!motorboatNameDraft.trim()} onClick={() => void commit(withMotorboatName(state, motorboatNameDraft))}>
        Spara namnet
      </button>
    </StoryMoment>}
    {contributionTurnInOpen && contributionCandidate && activeContributionBeat && activeContributionLine && <StoryMoment
      image={activeContributionBeat.image}
      imageFit="contain"
      speaker={activeContributionPresentation?.speaker}
      speakerTone={activeContributionPresentation?.speakerTone}
      nextLabel={state.contributionLineIndex + 1 < activeContributionBeat.body.length ? "Fortsätt" : "Klart"}
      onNext={() => void advanceContributionStory()}
      zIndex={80}
      background="rgba(9,14,10,.94)"
      dialogueClassName="act2-dialogue-card"
    >
      <p>{activeContributionPresentation?.text}</p>
    </StoryMoment>}
    {state.act2Complete && !state.endCardSeen && <div
      role="dialog"
      aria-modal="true"
      aria-label="Slut på andra kapitlet"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 140,
        display: "grid",
        placeItems: "center",
        background: "#050706",
        color: "white",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 7vw, 4.5rem)", letterSpacing: ".04em" }}>SLUT PÅ ANDRA KAPITLET</h1>
        <button
          className="primary-button"
          type="button"
          style={{ marginTop: 28 }}
          onClick={() => void commit({ ...state, endCardSeen: true })}
        >
          Fortsätt vid sjön
        </button>
      </div>
    </div>}
    {backendSyncError && <div role="status" className="act2-sync-status">{backendSyncError}</div>}
    {hudVisible && state.selectedProject && <div className="act2-project-status" aria-label="Aktivt projekt">
      <strong>Aktivt projekt: {PROJECT_COPY[state.selectedProject].label} · {state.projects[state.selectedProject].contributions}/16</strong>
    </div>}
  </main>;
}
