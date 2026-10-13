"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createDefaultAct3RuntimeState,
  loadAct3RuntimeState,
  saveAct3RuntimeState,
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

type Act3SkeletonProps = { debug?: boolean };
const ACT3_DEBUG_LAB_ENABLED = process.env.NODE_ENV !== "production";

function createInitialAct3Context(): Act3DebugContext {
  return { childName: "" };
}

export function Act3Skeleton({ debug = false }: Act3SkeletonProps) {
  const router = useRouter();
  const previewEntryRef = useRef<boolean | null>(null);
  const [waitingAtPark, setWaitingAtPark] = useState(false);
  const [introSaveError, setIntroSaveError] = useState("");

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
    const [act3, act1] = await Promise.all([
      loadAct3RuntimeState(),
      loadSaveState(),
    ]);
    return {
      accessAllowed: true,
      state: act3,
      context: { childName: act1?.childName ?? "" },
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

  async function acknowledgeChapterIntro() {
    const next = { ...state, entered: true };
    try {
      if (!debug) await saveAct3RuntimeState(next);
      setState(next);
      setIntroSaveError("");
      setChapterIntroVisible(false);
    } catch {
      // Never advance the on-screen chapter if native persistence failed.
      setIntroSaveError("Kunde inte spara. Försök igen.");
    }
  }

  async function advanceOpening() {
    const current = ACT3_OPENING_BEATS[state.openingBeatIndex];
    if (!current) return;
    const next = nextAct3OpeningState(state, current.lines.length);
    if (next === state) return;
    if (!debug) await saveAct3RuntimeState(next);
    setState(next);
    if (next.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT) setWaitingAtPark(true);
  }

  async function rewindOpening() {
    const current = ACT3_OPENING_BEATS[state.openingBeatIndex];
    if (!current) return;
    const next = previousAct3OpeningState(state, current.lines.length);
    if (next === state) return;
    if (!debug) await saveAct3RuntimeState(next);
    setState(next);
  }

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
  const currentBeat = playingOpening ? ACT3_OPENING_BEATS[state.openingBeatIndex] : null;
  const currentLine = currentBeat
    ? storyLineAt(currentBeat.lines, state.openingLineIndex)
    : null;
  const storyPresentation: StoryBeatPresentation | null = currentBeat && currentLine
    ? {
        id: currentBeat.id + ":" + state.openingLineIndex,
        image: currentBeat.image,
        heading: currentBeat.title,
        speaker: currentLine.speaker ?? undefined,
        speakerTone: currentLine.speaker === "Du" ? "child"
          : currentLine.speaker ? storySpeakerTone(currentLine.speaker) : "default",
        lines: [renderAct3OpeningText(currentLine.text, context.childName)],
        nextLabel: state.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT - 1
          && state.openingLineIndex === currentBeat.lines.length - 1
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
          onPrevious={state.openingLineIndex > 0 ? rewindOpening : undefined}
          onNext={advanceOpening}
        />
      )}

      {!chapterIntroVisible && openingDone && (
        <Act3CityMap visibility={act3OpeningMapVisibility(state)} onConfirmNode={confirmCityNode} />
      )}
      {!chapterIntroVisible && openingDone && waitingAtPark && (
        <StoryMoment
          variant="gate"
          heading="Folkparken"
          ariaLabel="Väntar på uppdrag"
          image={ACT3_OPENING_BEATS[ACT3_FREE_OPENING_BEAT_COUNT - 1].image}
          nextLabel="Till kartan"
          onNext={() => setWaitingAtPark(false)}
        >
          <p>Du har hittat Folkparken! Nästa del av berättelsen kräver ett nytt uppdrag i verkligheten.</p>
          <p>I testversionen är kopplingen till godkända uppdrag ännu inte aktiverad. Du kan återvända till kartan, men PARK-002 är låst.</p>
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
