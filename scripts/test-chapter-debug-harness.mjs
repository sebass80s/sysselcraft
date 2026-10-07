import assert from "node:assert/strict";
import fs from "node:fs";

import {
  inspectChapterDebugState,
  launchChapterDebug,
  resetChapterDebugState,
  runChapterDebugProbe,
} from "../src/runtime/debug/chapterDebugHarness.ts";
const neutralFixture = {
  chapterId: "future",
  route: "/future",
  debugRoute: "/future-test",
  createSession(params) {
    const boosted = params.get("boost") === "1";
    return {
      state: { value: boosted ? 9 : 1 },
      context: { wallet: boosted ? 100 : 0 },
      chapterIntroVisible: !boosted,
    };
  },
  createResetState() {
    return { value: 0 };
  },
  inspect(state, context) {
    return { value: state.value, wallet: context.wallet };
  },
  probes: {
    positive(state) {
      return { ok: state.value > 0, details: { value: state.value } };
    },
  },
};

const neutral = launchChapterDebug(neutralFixture, new URLSearchParams("boost=1"));
assert.deepEqual(neutral, {
  state: { value: 9 },
  context: { wallet: 100 },
  chapterIntroVisible: false,
});
assert.deepEqual(resetChapterDebugState(neutralFixture), { value: 0 });
assert.deepEqual(
  inspectChapterDebugState(neutralFixture, neutral.state, neutral.context),
  {
    chapterId: "future",
    route: "/future",
    debugRoute: "/future-test",
    value: 9,
    wallet: 100,
  },
);
assert.deepEqual(runChapterDebugProbe(neutralFixture, "positive", neutral.state, neutral.context), {
  ok: true,
  details: { value: 9 },
});
assert.deepEqual(runChapterDebugProbe(neutralFixture, "missing", neutral.state, neutral.context), {
  ok: false,
  details: { reason: "unknown-probe", probeId: "missing" },
});

const debugLauncherSource = fs.readFileSync(new URL("../src/runtime/debug/ChapterDebugLauncher.tsx", import.meta.url), "utf8");
const debugPanelSource = fs.readFileSync(new URL("../src/runtime/debug/ChapterDebugPanel.tsx", import.meta.url), "utf8");
assert.match(debugLauncherSource, /setTimeout\(open, 650\)/, "shared debug launcher must preserve the accepted hold gesture");
assert.match(debugLauncherSource, /tapCountRef\.current >= 5/, "shared debug launcher must preserve the accepted five-tap gesture");
assert.match(debugLauncherSource, /}, 1800\)/, "shared debug launcher must own the tap reset window");
assert.match(debugPanelSource, /State inspection/, "shared debug panel must expose standard state inspection");
assert.match(debugPanelSource, /actions\.map/, "shared debug panel must support chapter-specific actions as extensions");
assert.match(debugPanelSource, /probes\.map/, "shared debug panel must render standard/extended probe results");

const act2FixtureSource = fs.readFileSync(new URL("../src/game/act2DebugFixture.ts", import.meta.url), "utf8");
assert.match(act2FixtureSource, /chapterId: "act2"/, "Act 2 must register a chapter debug fixture");
assert.match(act2FixtureSource, /debugRoute: "\/act2-test"/, "Act 2 fixture must own its debug route metadata");
assert.match(act2FixtureSource, /params\.get\("finale"\) === "1"/, "Act 2 finale preview must remain fixture data");
assert.match(act2FixtureSource, /backendWorldProgression: 999/, "safe synthetic Act 2 progression must remain fixture-owned");

console.log("PASS: common chapter debug harness owns launch/reset/inspection/probes with chapter-specific fixture data.");
