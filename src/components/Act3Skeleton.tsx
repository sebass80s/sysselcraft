"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  createDefaultAct3RuntimeState,
  loadAct3RuntimeState,
  saveAct3RuntimeState,
  type Act3RuntimeState,
} from "../game/act3RuntimeState";
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
import { Act3CityMap } from "./Act3CityMap";
import type { Act3CityMapVisibilityContext, Act3CityNodeId } from "../game/act3CityMapNodes";
import styles from "./Act3CityMap.module.css";

type Act3SkeletonProps = {
  debug?: boolean;
};

const ACT3_DEBUG_LAB_ENABLED = process.env.NODE_ENV !== "production";

// TODO(story integration): supply authored discovery/active state from the chapter
// adapter once its triggers and persistence migration are approved. No fake progress.
const INITIAL_MAP_VISIBILITY: Act3CityMapVisibilityContext = {
  discoveredPermanentIds: [], huntActive: false, arcadeRevealed: false, activeNodeId: null,
};

function createInitialAct3Context(): Act3DebugContext {
  return {};
}

export function Act3Skeleton({ debug = false }: Act3SkeletonProps) {
  const router = useRouter();
  // Cache a consumed, single-use X grant for this mounted chapter instance.
  // The shared chapter host can re-run boot in development without denying access.
  const previewEntryRef = useRef<boolean | null>(null);

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
        context: {},
        chapterIntroVisible: false,
      };
    }

    // Only an explicit Vuxenläge → X launch may enter unfinished Act 3,
    // including when the tester has not completed Act 2.
    const act3 = await loadAct3RuntimeState();
    return {
      accessAllowed: true,
      state: act3,
      context: {},
      chapterIntroVisible: !act3.entered,
    };
  }, []);

  const {
    state,
    setState,
    context,
    status,
    chapterIntroVisible,
    setChapterIntroVisible,
  } = useChapterRuntimeHost<Act3RuntimeState, Act3DebugContext>({
    debug,
    productionEnabled: true,
    createInitialState: createDefaultAct3RuntimeState,
    createInitialContext: createInitialAct3Context,
    boot: bootAct3,
  });

  const inspection = inspectChapterDebugState(
    ACT3_DEBUG_FIXTURE,
    state,
    context,
  );
  const chapterEntryProbe = runChapterDebugProbe(
    ACT3_DEBUG_FIXTURE,
    "chapter-entry",
    state,
    context,
  );

  async function acknowledgeChapterIntro() {
    const next = { ...state, entered: true };
    if (!debug) await saveAct3RuntimeState(next);
    setState(next);
    setChapterIntroVisible(false);
  }

  function confirmCityNode(nodeId: Act3CityNodeId) {
    if (nodeId === "harbor") {
      // Ordinary transport only: never consume any BOAT beat or quest evidence.
      router.push(chapterRoute("act2"));
      return;
    }
    // TODO(story integration): dispatch this typed intent to the shared Story host
    // for next/wait/deadbeat routing. These nodes are not discoverable in this slice.
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

      {!chapterIntroVisible && <Act3CityMap visibility={INITIAL_MAP_VISIBILITY} onConfirmNode={confirmCityNode} />}

      <ChapterDebugPanel
        visible={debug}
        chapterLabel="Act 3"
        inspection={inspection}
        onReset={() => setState(resetChapterDebugState(ACT3_DEBUG_FIXTURE))}
        probes={[{
          id: "chapter-entry",
          label: "Chapter entry",
          result: chapterEntryProbe,
        }]}
      />
      <ChapterDebugLauncher
        enabled={!debug && ACT3_DEBUG_LAB_ENABLED}
        label="Akt 3 · På andra sidan sjön"
        onOpen={() => router.push(ACT3_DEBUG_FIXTURE.debugRoute)}
      />
    </main>
  );
}
