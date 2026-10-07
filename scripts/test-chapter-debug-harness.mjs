import assert from "node:assert/strict";

import {
  inspectChapterDebugState,
  launchChapterDebug,
  resetChapterDebugState,
  runChapterDebugProbe,
} from "../src/runtime/debug/chapterDebugHarness.ts";
import { ACT2_DEBUG_FIXTURE } from "../src/game/act2DebugFixture.ts";
import { totalAct2Contributions } from "../src/game/act2RuntimeState.ts";

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

const act2Default = launchChapterDebug(ACT2_DEBUG_FIXTURE, new URLSearchParams());
assert.equal(act2Default.state.entered, true);
assert.equal(act2Default.state.backendClaimBaseline, 0);
assert.equal(act2Default.context.backendWorldProgression, 999);
assert.equal(act2Default.chapterIntroVisible, true);
assert.equal(totalAct2Contributions(act2Default.state), 0);

const act2Finale = launchChapterDebug(ACT2_DEBUG_FIXTURE, new URLSearchParams("finale=1"));
assert.equal(act2Finale.chapterIntroVisible, false);
assert.equal(totalAct2Contributions(act2Finale.state), 64);
assert.equal(act2Finale.state.finaleIndex, 0);
assert.equal(act2Finale.state.act2Complete, false);

const act2Reset = resetChapterDebugState(ACT2_DEBUG_FIXTURE);
assert.equal(act2Reset.entered, true);
assert.equal(totalAct2Contributions(act2Reset), 0);
assert.equal(act2Reset.backendClaimBaseline, 0);

const act2Inspection = inspectChapterDebugState(
  ACT2_DEBUG_FIXTURE,
  act2Finale.state,
  act2Finale.context,
);
assert.equal(act2Inspection.chapterId, "act2");
assert.equal(act2Inspection.totalContributions, 64);
assert.equal(act2Inspection.backendWorldProgression, 999);
assert.equal(
  runChapterDebugProbe(
    ACT2_DEBUG_FIXTURE,
    "contribution-bounds",
    act2Finale.state,
    act2Finale.context,
  ).ok,
  true,
);

console.log("PASS: common chapter debug harness owns launch/reset/inspection/probes and Act 2 consumes it as fixture data.");
