import assert from "node:assert/strict";
import fs from "node:fs";
import {runtimeTestLoader} from "./lib/runtime-test-loader.mjs";

function read(path) {
  return fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
}

const persistenceStub = {
  createChapterPersistenceHost(definition) {
    return {
      load: async () => definition.createDefaultState(),
      save: async (state) => {
        assert.ok(definition.normalize(state), "Act 3 persistence must accept its own canonical state");
      },
      clear: async () => undefined,
    };
  },
};

const act3State = runtimeTestLoader({
  "../runtime/save/chapterPersistence": persistenceStub,
})("src/game/act3RuntimeState.ts");

const initial = act3State.createDefaultAct3RuntimeState();
assert.deepEqual(JSON.parse(JSON.stringify(initial)), { version: 4, entered: false, openingBeatIndex: 0, openingLineIndex: 0, claimGate: {baseline:null,consumed:0,observedCount:null,observedAt:null}, gatedBeatIndex:0, gatedPhase:"waiting", gatedLineIndex:0 });
assert.deepEqual(
  JSON.parse(JSON.stringify(act3State.normalizeAct3RuntimeState(act3State.migrateAct3RuntimeState({ version: 1, entered: true })))),
  { ...JSON.parse(JSON.stringify(initial)), entered: true },
);
assert.equal(act3State.normalizeAct3RuntimeState({ version: 3, entered: true }), null);

const stateSource = read("src/game/act3RuntimeState.ts");
const skeletonSource = read("src/components/Act3Skeleton.tsx");
const prodRouteSource = read("src/app/act3/page.tsx");
const debugRouteSource = read("src/app/act3-test/page.tsx");
const registrySource = read("src/runtime/chapter/chapterRegistry.ts");

assert.match(stateSource, /createChapterPersistenceHost<Act3RuntimeState>/, "Act 3 must use shared chapter persistence");
assert.doesNotMatch(stateSource, /@capacitor\/preferences/, "Act 3 must not own Preferences plumbing");
assert.match(stateSource, /chapterId: "act3"/, "Act 3 persistence must register its chapter id");

assert.match(skeletonSource, /useChapterRuntimeHost<Act3RuntimeState, Act3DebugContext>/, "Act 3 must use the shared chapter runtime host");
assert.match(skeletonSource, /ACT3_DEBUG_FIXTURE/, "Act 3 must use the shared debug fixture contract");
assert.match(skeletonSource, /ChapterRuntimeBoundary/, "Act 3 must use the shared runtime boundary");
assert.match(skeletonSource, /ChapterIntroCard/, "Act 3 must use the shared chapter intro card");
assert.match(skeletonSource, /title="På andra sidan sjön"/, "Act 3 must use the locked chapter title");
assert.match(skeletonSource, /updateChapterFromView/, "Act 3 chapter entry must persist through shared chapter persistence");
assert.match(
  skeletonSource,
  /consumeAct3PreviewEntry\(window\.sessionStorage\)/,
  "Unfinished Act 3 may only boot after an explicit, single-use adult preview grant",
);
assert.doesNotMatch(
  skeletonSource,
  /loadAct2RuntimeState/,
  "Adult preview must work even before the Act 2 predecessor is complete",
);
assert.match(
  skeletonSource,
  /nodeId === "harbor"[\s\S]*router\.push\(chapterRoute\("act2"\)\)/,
  "Act 3 return control must use the shared chapter router instead of a raw native-webview anchor",
);


for (const forbidden of [
  "@capacitor/preferences",
  "@supabase/supabase-js",
  "createWorldGame",
  "new Phaser.Game",
  "projectProgressEngine",
  "purchaseStoryItem",
  "setInterval(",
]) {
  assert.equal(
    skeletonSource.includes(forbidden),
    false,
    `Act 3 chapter entry must not rebuild existing engine plumbing: ${forbidden}`,
  );
}

assert.match(prodRouteSource, /<Act3Skeleton \/>/, "production Act 3 route must remain a thin skeleton mount");
assert.match(debugRouteSource, /<Act3Skeleton debug \/>/, "debug Act 3 route must reuse the same skeleton");
assert.match(debugRouteSource, /NODE_ENV !== "production"/, "Act 3 debug lab must remain dev-only");
assert.match(registrySource, /act3:\s*{[\s\S]*route: "\/act3"[\s\S]*predecessorId: "act2"/, "Act 3 must be registered as the next chapter");

// An isolated real-iPhone touch test opens minigolf directly on /act3-test.
// Neither a claimed live quest nor a child/account lookup is needed for it.
const fixture = runtimeTestLoader({
  "../runtime/save/chapterPersistence": persistenceStub,
})("src/game/act3DebugFixture.ts").ACT3_DEBUG_FIXTURE;
const gamePreview = fixture.createSession(new URLSearchParams("scene=park009&play=1"));
const storyPreview = fixture.createSession(new URLSearchParams("scene=park009"));
assert.equal(gamePreview.chapterIntroVisible, false);
assert.equal(gamePreview.state.gatedPhase, "activity");
assert.equal(gamePreview.state.claimGate.consumed, gamePreview.state.gatedBeatIndex + 1);
assert.equal(storyPreview.state.gatedPhase, "playing");
assert.equal(storyPreview.state.gatedBeatIndex, gamePreview.state.gatedBeatIndex);
assert.ok(act3State.normalizeAct3RuntimeState(gamePreview.state),
  "Direct minigolf preview must be a valid, isolated Act 3 runtime state");
assert.equal(gamePreview.context.childId, null,
  "Debug preview must not use a paired live child");
assert.match(debugRouteSource, /NODE_ENV !== "production"/,
  "Phone debug route must remain unavailable in production builds");

console.log("PASS: Act 3 chapter entry uses shared Runtime 1.1 engines without chapter-local engine copies");
