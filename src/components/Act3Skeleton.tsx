"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import {
  createDefaultAct3RuntimeState,
  loadAct3RuntimeState,
  type Act3RuntimeState,
} from "../game/act3RuntimeState";
import { loadAct2RuntimeState } from "../game/act2RuntimeState";
import { ACT3_DEBUG_FIXTURE, type Act3DebugContext } from "../game/act3DebugFixture";
import { chapterUnlocked } from "../runtime/chapter/chapterLifecycle";
import { chapterRoute } from "../runtime/chapter/chapterRegistry";
import { ChapterRuntimeBoundary } from "../runtime/chapter/ChapterRuntimeBoundary";
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

type Act3SkeletonProps = {
  debug?: boolean;
};

const ACT3_DEBUG_LAB_ENABLED = process.env.NODE_ENV !== "production";

function createInitialAct3Context(): Act3DebugContext {
  return {};
}

export function Act3Skeleton({ debug = false }: Act3SkeletonProps) {
  const router = useRouter();

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

    const [act3, act2] = await Promise.all([
      loadAct3RuntimeState(),
      loadAct2RuntimeState(),
    ]);
    const predecessorComplete = act2.act2Complete && act2.endCardSeen;

    return {
      accessAllowed: chapterUnlocked(predecessorComplete),
      state: act3,
      context: {},
      chapterIntroVisible: false,
    };
  }, []);

  const {
    state,
    setState,
    context,
    status,
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
  const emptySkeletonProbe = runChapterDebugProbe(
    ACT3_DEBUG_FIXTURE,
    "empty-skeleton",
    state,
    context,
  );

  if (status !== "active") {
    return (
      <ChapterRuntimeBoundary
        status={status}
        loadingText="Laddar kapitel 3…"
        lockedTitle="Kapitel 3 är låst"
        lockedBody="Avsluta kapitel 2 innan du fortsätter över sjön."
        returnHref={chapterRoute("act2")}
        returnLabel="← Tillbaka till sjön"
      />
    );
  }

  return (
    <main className="parent-page" data-runtime-proof="empty-act3">
      <section style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <p style={{ letterSpacing: ".18em", fontWeight: 800, opacity: .72 }}>KAPITEL 3</p>
        <h1>Tom runtime är redo</h1>
        <p>
          Det här är endast Runtime 1.1:s arkitekturproof. Inget Kapitel 3-innehåll,
          gameplay eller progression är implementerat ännu.
        </p>
        <a className="secondary-button" href={chapterRoute("act2")}>← Tillbaka till sjön</a>
      </section>

      <ChapterDebugPanel
        visible={debug}
        chapterLabel="Act 3"
        inspection={inspection}
        onReset={() => setState(resetChapterDebugState(ACT3_DEBUG_FIXTURE))}
        probes={[{
          id: "empty-skeleton",
          label: "Empty skeleton",
          result: emptySkeletonProbe,
        }]}
      />
      <ChapterDebugLauncher
        enabled={!debug && ACT3_DEBUG_LAB_ENABLED}
        label="Akt 3 · tomt proof"
        onOpen={() => router.push(ACT3_DEBUG_FIXTURE.debugRoute)}
      />
    </main>
  );
}
