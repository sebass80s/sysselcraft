"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createDefaultAct3RuntimeState,
  loadAct3RuntimeState,
  updateAct3RuntimeState,
  ACT3_FREE_OPENING_BEAT_COUNT,
  type Act3RuntimeState,
} from "../game/act3RuntimeState";
import { loadSaveState } from "../game/saveState";
import { ACT3_OPENING_BEATS, renderAct3OpeningText } from "../game/act3OpeningContent";
import {
  act3OpeningMapVisibility,
  nextAct3OpeningState,
  previousAct3OpeningState,
} from "../game/act3OpeningProgress";
import { storyLineAt } from "../runtime/story/storySequence";
import { storySpeakerDisplayName, storyNarrationDisplayText } from "../runtime/story/speakerIdentity";
import { ACT3_SPEAKER_REVEALS } from "../game/act3SpeakerReveals";
import { storySpeakerTone, type StoryBeatPresentation } from "../game/storyEngine";
import { ACT3_DEBUG_FIXTURE, type Act3DebugContext } from "../game/act3DebugFixture";
import { consumeAct3PreviewEntry } from "../game/act3PreviewAccess";
import { chapterRoute } from "../runtime/chapter/chapterRegistry";
import { ChapterRuntimeBoundary } from "../runtime/chapter/ChapterRuntimeBoundary";
import { ChapterIntroCard } from "../runtime/chapter/ChapterCards";
import {
  useChapterRuntimeHost,
  type ChapterRuntimeBootEnvironment,
} from "../runtime/chapter/useChapterRuntimeHost";
import {
  inspectChapterDebugState,
  launchChapterDebug,
  resetChapterDebugState,
  runChapterDebugProbe,
} from "../runtime/debug/chapterDebugHarness";
import { ChapterDebugLauncher } from "../runtime/debug/ChapterDebugLauncher";
import { ChapterDebugPanel } from "../runtime/debug/ChapterDebugPanel";
import { StoryRunner } from "./story/StoryRunner";
import { StoryMoment } from "./story/StoryMoment";
import { Act3CityMap } from "./Act3CityMap";
import type { Act3CityNodeId } from "../game/act3CityMapNodes";
import styles from "./Act3CityMap.module.css";

import { getPairedChildId } from "../backend/childDeviceBinding";
import { loadPairedClaimEvidence } from "../runtime/backend/pairedClaimEvidence";
import { useBackendSyncHost } from "../runtime/backend/useBackendSyncHost";
import { useChapterPersistenceGuard } from "../runtime/save/useChapterPersistenceGuard";
import { updateChapterFromView } from "../runtime/save/updateChapterFromView";
import { createClaimGateBridge } from "../runtime/progression/claimGateBridge";
import { nextClaimGateBeat } from "../runtime/progression/claimGate";
import { ACT3_FIRST_QUEST_GATE, nextAct3GatedState, previousAct3GatedState } from "../game/act3FirstQuestGate";
import { ACT3_GATED_BEATS } from "../game/act3GatedBeats";

type Act3SkeletonProps = { debug?: boolean };
const ACT3_DEBUG_LAB_ENABLED = process.env.NODE_ENV !== "production";

function createInitialAct3Context(): Act3DebugContext {
  return { childName: "", childId: null };
}

export function Act3Skeleton({ debug = false }: Act3SkeletonProps) {
  const router = useRouter();
  const previewEntryRef = useRef<boolean | null>(null);
  const [waitingAtPark, setWaitingAtPark] = useState(false);
  const [introSaveError, setIntroSaveError] = useState("");
  const [backendError, setBackendError] = useState("");

  const bootAct3 = useCallback(async ({ debug: debugMode }: ChapterRuntimeBootEnvironment) => {
    if (debugMode) {
      const session = launchChapterDebug(
        ACT3_DEBUG_FIXTURE,
        new URLSearchParams(window.location.search),
      );
      return {
        accessAllowed: true,
        state: session.state,
        context: session.context,
        chapterIntroVisible: session.chapterIntroVisible,
      };
    }

    if (previewEntryRef.current === null) {
      previewEntryRef.current = consumeAct3PreviewEntry(window.sessionStorage);
    }
    if (!previewEntryRef.current) {
      return {
        accessAllowed: false,
        state: createDefaultAct3RuntimeState(),
        context: createInitialAct3Context(),
        chapterIntroVisible: false,
      };
    }

    // Preview grant is checked BEFORE any child/Act 3 saved data is read.
    // Act 1 is only read for the child's authored introduction of their name.
    const childId = await getPairedChildId();
    const [act3, act1] = await Promise.all([
      loadAct3RuntimeState({ expectedChildId: childId }),
      loadSaveState(),
    ]);
    return {
      accessAllowed: true,
      state: act3,
      context: { childName: act1?.childName ?? "", childId },
      chapterIntroVisible: !act3.entered,
    };
  }, []);

  const {
    state, setState, context, status,
    chapterIntroVisible, setChapterIntroVisible,
  } = useChapterRuntimeHost<Act3RuntimeState, Act3DebugContext>({
    debug,
    productionEnabled: true,
    createInitialState: createDefaultAct3RuntimeState,
    createInitialContext: createInitialAct3Context,
    boot: bootAct3,
  });

  const inspection = inspectChapterDebugState(ACT3_DEBUG_FIXTURE, state, context);
  const chapterEntryProbe = runChapterDebugProbe(
    ACT3_DEBUG_FIXTURE, "chapter-entry", state, context,
  );

  const guard = useChapterPersistenceGuard(context.childId, status === "active" && !debug);
  const bridge = useMemo(() => createClaimGateBridge({
    adapter: ACT3_FIRST_QUEST_GATE,
    persistence: { update: updateAct3RuntimeState },
    guard,
    loadEvidence: loadPairedClaimEvidence,
  }), [guard]);
  useBackendSyncHost({
    active: status === "active" && !debug && ACT3_FIRST_QUEST_GATE.waiting(state),
    loadSnapshot: bridge.refresh,
    onSnapshot: (next, control) => {
      if (control.isActive() && guard().isActive()) { setState(next); setBackendError(""); }
    },
    onError: (_error, control) => {
      if (control.isActive()) setBackendError("Kunde inte kontrollera uppdrag. Kontrollera anslutningen och försök igen.");
    },
  });

  async function commitFromView(cursor: (s: Act3RuntimeState) => string, transition: (s: Act3RuntimeState) => Act3RuntimeState) {
    if (debug) { setState(current => cursor(current) === cursor(state) ? transition(current) : current); return; }
    const lease = guard();
    const next = await updateChapterFromView({ update: updateAct3RuntimeState }, state, cursor, transition, lease);
    if (lease.isActive()) setState(next);
  }

  async function acknowledgeChapterIntro() {
    try {
      await commitFromView(s => String(s.entered), s => ({ ...s, entered: true }));
      setIntroSaveError("");
      setChapterIntroVisible(false);
    } catch {
      setIntroSaveError("Kunde inte spara. Försök igen.");
    }
  }

  async function advanceOpening() {
    const current = ACT3_OPENING_BEATS[state.openingBeatIndex];
    if (!current) return;
    await commitFromView(s => `${s.openingBeatIndex}:${s.openingLineIndex}`,
      s => nextAct3OpeningState(s, current.lines.length));
    if (state.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT - 1 && state.openingLineIndex === current.lines.length - 1) setWaitingAtPark(true);
  }

  async function rewindOpening() {
    const current = ACT3_OPENING_BEATS[state.openingBeatIndex];
    if (!current) return;
    await commitFromView(s => `${s.openingBeatIndex}:${s.openingLineIndex}`,
      s => previousAct3OpeningState(s, current.lines.length));
  }

  async function startNextGatedBeat() {
    if (debug) return;
    try {
      const lease = guard();
      const next = await bridge.start();
      if (!lease.isActive()) return;
      setState(next);
      setBackendError("");
      if (next.gatedPhase === "playing") setWaitingAtPark(false);
    } catch {
      setBackendError("Kunde inte kontrollera eller spara uppdrag. Försök igen.");
    }
  }
  const gatedCursor = (s: Act3RuntimeState) => `${s.gatedBeatIndex}:${s.gatedPhase}:${s.gatedLineIndex}`;

  function confirmCityNode(nodeId: Act3CityNodeId) {
    if (nodeId === "harbor") {
      // Ordinary transport only. Never consume BOAT-001..005 or quest evidence.
      router.push(chapterRoute("act2"));
      return;
    }
    if (nodeId === "folkpark" && state.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT) {
      setWaitingAtPark(true);
    }
    // Remaining locations have no authored discovery triggers in this slice.
  }

  if (status !== "active") {
    return (
      <ChapterRuntimeBoundary
        status={status}
        loadingText="Laddar kapitel 3…"
        lockedTitle="Kapitel 3 är låst"
        lockedBody="Kapitel 3 är under utveckling. En vuxen kan öppna testversionen via Vuxenläge och knappen X."
        returnHref={chapterRoute("act2")}
        returnLabel="← Tillbaka till sjön"
      />
    );
  }

  const playingOpening = !chapterIntroVisible
    && state.entered
    && state.openingBeatIndex < ACT3_FREE_OPENING_BEAT_COUNT;
  const playingGated = !chapterIntroVisible && state.gatedPhase === "playing";
  const lineIndex = playingGated ? state.gatedLineIndex : state.openingLineIndex;
  const currentBeat = playingOpening ? ACT3_OPENING_BEATS[state.openingBeatIndex]
    : playingGated ? ACT3_GATED_BEATS[state.gatedBeatIndex] : null;
  const currentLine = currentBeat
    ? storyLineAt(currentBeat.lines, lineIndex)
    : null;
  const identityCursor = {
    beatIndex: playingGated ? ACT3_FREE_OPENING_BEAT_COUNT + state.gatedBeatIndex : state.openingBeatIndex,
    lineIndex,
  };
  const nameplate = storySpeakerDisplayName(
    currentLine?.speaker ?? null, identityCursor, ACT3_SPEAKER_REVEALS,
  );
  const lineText = currentLine
    ? renderAct3OpeningText(currentLine.text, context.childName) : "";
  const displayText = currentLine?.speaker === null
    ? storyNarrationDisplayText(lineText, identityCursor, ACT3_SPEAKER_REVEALS)
    : lineText;
  const storyPresentation: StoryBeatPresentation | null = currentBeat && currentLine
    ? {
        id: currentBeat.id + ":" + lineIndex,
        image: currentBeat.image,
        // Authored scene title stays available as ariaLabel on StoryRunner,
        // but ordinary beat dialogue uses the shared title-free DialogueCard.
        speaker: nameplate ?? undefined,
        speakerTone: currentLine.speaker === "Du" ? "child"
          : currentLine.speaker ? storySpeakerTone(currentLine.speaker) : "default",
        lines: [displayText],
        nextLabel: (playingGated || state.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT - 1)
          && lineIndex === currentBeat.lines.length - 1
          ? "Till kartan" : "Fortsätt",
      }
    : null;
  const openingDone = state.entered
    && state.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT;

  return (
    <main className={styles.page} data-runtime-proof="act3-chapter-entry">
      {chapterIntroVisible && (
        <ChapterIntroCard
          chapterLabel="KAPITEL 3"
          title="På andra sidan sjön"
          ariaLabel="Kapitel 3 · På andra sidan sjön"
          onContinue={() => void acknowledgeChapterIntro()}
        />
      )}
      {introSaveError && <p role="alert" className={styles.saveError}>{introSaveError}</p>}

      {!chapterIntroVisible && storyPresentation && currentBeat && (
        <StoryRunner
          key={currentBeat.id}
          beat={storyPresentation}
          ariaLabel={currentBeat.title}
          variant="opening"
          onPrevious={lineIndex > 0 ? (playingGated
            ? () => commitFromView(gatedCursor, previousAct3GatedState) : rewindOpening) : undefined}
          onNext={playingGated ? () => commitFromView(gatedCursor, nextAct3GatedState) : advanceOpening}
        />
      )}

      {!chapterIntroVisible && openingDone && !playingGated && (
        <Act3CityMap visibility={act3OpeningMapVisibility(state)} onConfirmNode={confirmCityNode} />
      )}
      {!chapterIntroVisible && openingDone && !playingGated && waitingAtPark && (
        <StoryMoment
          variant="gate"
          heading="Folkparken"
          ariaLabel="Väntar på uppdrag"
          image={ACT3_OPENING_BEATS[ACT3_FREE_OPENING_BEAT_COUNT - 1].image}
          previousLabel="Till kartan"
          onPrevious={() => setWaitingAtPark(false)}
          nextLabel={state.gatedPhase === "complete" || debug ? undefined : "Kontrollera uppdrag"}
          onNext={state.gatedPhase === "complete" || debug ? undefined : startNextGatedBeat}
        >
          {state.gatedPhase === "complete" ? <p>Du har spelat klart den här delen av testversionen.</p>
            : debug ? <p>PARK-002 är låst i det isolerade debugläget.</p>
            : <>
              <p>Nästa del av berättelsen kräver ett nytt uppdrag som en vuxen har godkänt och som du har hämtat belöningen för.</p>
              <p>{state.claimGate.baseline === null ? "Anslut till din kopplade barnenhet för att börja räkna nya uppdrag."
                : nextClaimGateBeat(state.claimGate, ACT3_FIRST_QUEST_GATE.beatIds, false)
                  ? "Ett nytt uppdrag finns. Kontrollera uppdrag för att fortsätta."
                  : "Väntar på ett nytt uppdrag."}</p>
            </>}
          {backendError && <p role="alert">{backendError}</p>}
        </StoryMoment>
      )}

      <ChapterDebugPanel
        visible={debug}
        chapterLabel="Act 3"
        inspection={inspection}
        onReset={() => {
          setState(resetChapterDebugState(ACT3_DEBUG_FIXTURE));
          setWaitingAtPark(false);
        }}
        probes={[{ id: "chapter-entry", label: "Chapter entry", result: chapterEntryProbe }]}
      />
      <ChapterDebugLauncher
        enabled={!debug && ACT3_DEBUG_LAB_ENABLED}
        label="Akt 3 · På andra sidan sjön"
        onOpen={() => router.push(ACT3_DEBUG_FIXTURE.debugRoute)}
      />
    </main>
  );
}
