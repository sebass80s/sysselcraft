import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function read(path) {
  return fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
}

function loadTsModule(path, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(name) {
      assert.ok(name in dependencies, `Unexpected Act 3 chapter-entry dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
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

const act3State = loadTsModule("src/game/act3RuntimeState.ts", {
  "../runtime/save/chapterPersistence": persistenceStub,
});

const initial = act3State.createDefaultAct3RuntimeState();
assert.deepEqual(JSON.parse(JSON.stringify(initial)), { version: 1, entered: false });
assert.deepEqual(
  JSON.parse(JSON.stringify(act3State.normalizeAct3RuntimeState({ version: 1, entered: true }))),
  { version: 1, entered: true },
);
assert.equal(act3State.normalizeAct3RuntimeState({ version: 2, entered: true }), null);

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
assert.match(skeletonSource, /saveAct3RuntimeState\(next\)/, "Act 3 chapter entry must persist through shared chapter persistence");
assert.match(skeletonSource, /chapterUnlocked\(predecessorComplete\)/, "Act 3 access must derive from predecessor completion");
assert.match(
  skeletonSource,
  /onClick=\{\(\) => router\.push\(chapterRoute\("act2"\)\)\}/,
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

console.log("PASS: Act 3 chapter entry uses shared Runtime 1.1 engines without chapter-local engine copies");
