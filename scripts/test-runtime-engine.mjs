import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

import {
  chapterAtStart,
  chapterCardVisible,
  chapterEndCardPending,
  chapterUnlocked,
} from "../src/runtime/chapter/chapterLifecycle.ts";
import {
  chapterRoute,
  nextChapterDestination,
} from "../src/runtime/chapter/chapterRegistry.ts";
import {
  chapterBootMayLoad,
  deriveChapterRuntimeOverlay,
  deriveChapterRuntimeShell,
} from "../src/runtime/chapter/chapterRuntimeShell.ts";
import { progressGateRequired } from "../src/runtime/progression/progressGate.ts";
import {
  nextProgressTrackStep,
  normalizeProgressTrack,
} from "../src/runtime/progression/progressTrack.ts";
import {
  purchaseShortfall,
  resolveStoryPurchaseExit,
} from "../src/runtime/purchase/storyPurchaseFlow.ts";

function loadTsModule(file, dependencies) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const requireDependency = (name) => {
    assert.ok(name in dependencies, `Unexpected engine dependency: ${name}`);
    return dependencies[name];
  };
  new Function("exports", "require", code)(exports, requireDependency);
  return exports;
}

const chapterRegistryModule = loadTsModule("../src/runtime/chapter/chapterRegistry.ts", {});
const storyPurchaseHandoffModule = loadTsModule("../src/runtime/purchase/storyPurchaseHandoff.ts", {
  "../chapter/chapterRegistry": chapterRegistryModule,
});
const {
  parseStoryPurchaseTarget,
  storyPurchaseResumeHref,
  storyPurchaseShopHref,
} = storyPurchaseHandoffModule;

const authoritativeDelta = loadTsModule("../src/runtime/progression/authoritativeDelta.ts", {});
const progressTrackModule = loadTsModule("../src/runtime/progression/progressTrack.ts", {});
const {
  nextAuthoritativeProgressTrackStep,
  pendingAuthoritativeProgressCount,
} = loadTsModule("../src/runtime/progression/authoritativeTrack.ts", {
  "./authoritativeDelta": authoritativeDelta,
  "./progressTrack": progressTrackModule,
});

const track = {
  targetCount: 4,
  stages: [
    { minContributions: 1, stage: 1 },
    { minContributions: 3, stage: 2 },
  ],
  beatId: (number) => `engine-demo:${number}`,
};

// 1. A shipping-locked chapter must not even load chapter state.
assert.equal(chapterBootMayLoad({ debug: false, productionEnabled: false }), false);
assert.equal(
  deriveChapterRuntimeShell({
    ready: true,
    debug: false,
    productionEnabled: false,
    accessAllowed: true,
  }),
  "shipping-locked",
);

// 2. Production route stays progression-locked until predecessor completion is acknowledged.
assert.equal(chapterUnlocked(false), false);
assert.equal(
  deriveChapterRuntimeShell({
    ready: true,
    debug: false,
    productionEnabled: true,
    accessAllowed: false,
  }),
  "progression-locked",
);
assert.equal(chapterUnlocked(true), true);
assert.equal(
  deriveChapterRuntimeShell({
    ready: true,
    debug: false,
    productionEnabled: true,
    accessAllowed: true,
  }),
  "active",
);

// 3. Fresh chapter presentation and overlay authority are shared behavior.
assert.equal(chapterAtStart({
  openingComplete: false,
  openingIndex: 0,
  openingLineIndex: 0,
}), true);
assert.equal(
  chapterCardVisible(true, true, { chapterComplete: false, endCardSeen: false }),
  true,
);
assert.deepEqual(
  deriveChapterRuntimeOverlay(true, false),
  { storyUiVisible: false, blockingOverlayVisible: true, worldInputEnabled: false },
);

// 4. Authoritative quest progress becomes backlog but still advances authored beats one at a time.
assert.equal(pendingAuthoritativeProgressCount(13, 10, 0), 3);
let next = nextAuthoritativeProgressTrackStep({
  authoritativeCount: 13,
  baselineCount: 10,
  consumedCount: 0,
  trackContributions: 0,
  definition: track,
  blocked: false,
});
assert.deepEqual(next, {
  number: 1,
  beatId: "engine-demo:1",
  visibleStage: 1,
  backlog: 3,
});

// 5. A story purchase gate blocks progress without consuming authoritative backlog.
assert.equal(progressGateRequired(1, 1, 4, false), true);
assert.equal(
  nextAuthoritativeProgressTrackStep({
    authoritativeCount: 13,
    baselineCount: 10,
    consumedCount: 1,
    trackContributions: 1,
    definition: track,
    blocked: true,
  }),
  null,
);
assert.equal(purchaseShortfall(50, 200), 150);
assert.deepEqual(resolveStoryPurchaseExit("project-a", false), { action: "stay" });

// 6. Failed purchase never resumes the blocked story. Once ownership is authoritative,
//    the same unconsumed next beat becomes available.
assert.deepEqual(
  resolveStoryPurchaseExit("project-a", true),
  { action: "resume", target: "project-a" },
);
assert.equal(progressGateRequired(1, 1, 4, true), false);
next = nextAuthoritativeProgressTrackStep({
  authoritativeCount: 13,
  baselineCount: 10,
  consumedCount: 1,
  trackContributions: 1,
  definition: track,
  blocked: false,
});
assert.deepEqual(next, {
  number: 2,
  beatId: "engine-demo:2",
  visibleStage: 1,
  backlog: 2,
});

// 7. Track normalization/config is independent of Act 2 constants.
assert.deepEqual(
  normalizeProgressTrack({ contributions: 3 }, track),
  {
    contributions: 3,
    visibleStage: 2,
    consumedBeatIds: ["engine-demo:1", "engine-demo:2", "engine-demo:3"],
    complete: false,
  },
);
assert.deepEqual(nextProgressTrackStep(3, track), {
  number: 4,
  beatId: "engine-demo:4",
  visibleStage: 2,
});

// 8. Completion/end-card survives serialization and only then exposes the registered next chapter.
const persistedLifecycle = JSON.parse(JSON.stringify({
  chapterComplete: true,
  endCardSeen: false,
}));
assert.equal(chapterEndCardPending(persistedLifecycle), true);
assert.equal(nextChapterDestination("act2", persistedLifecycle), null);

persistedLifecycle.endCardSeen = true;
const destination = nextChapterDestination("act2", persistedLifecycle);
assert.deepEqual(destination, { id: "act3", route: "/act3" });
assert.equal(chapterRoute(destination.id), destination.route);

// 9. Generic story-purchase handoff is reusable by any registered chapter.
assert.equal(
  parseStoryPurchaseTarget("alpha", ["alpha", "beta"]),
  "alpha",
);
assert.equal(
  parseStoryPurchaseTarget("gamma", ["alpha", "beta"]),
  null,
);
assert.equal(
  storyPurchaseShopHref({
    shopChapterId: "act1",
    queryKey: "demo-purchase",
    target: "alpha",
  }),
  "/?demo-purchase=alpha",
);
assert.equal(
  storyPurchaseResumeHref({
    chapterId: "act2",
    target: "alpha",
  }),
  "/act2?resume=alpha",
);

// 10. Final registered chapter does not invent another act.
assert.equal(
  nextChapterDestination("act3", { chapterComplete: true, endCardSeen: true }),
  null,
);

console.log("PASS: Runtime 1.1 engine composition covers chapter, progression, gates, purchases and transitions");
