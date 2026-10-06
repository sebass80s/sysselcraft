import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

function loadTsModule(file, dependencies) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const requireDependency = (name) => {
    assert.ok(name in dependencies, `Unexpected authoritative-track dependency: ${name}`);
    return dependencies[name];
  };
  new Function("exports", "require", code)(exports, requireDependency);
  return exports;
}

const authoritativeDelta = loadTsModule("../src/runtime/progression/authoritativeDelta.ts", {});
const progressTrack = loadTsModule("../src/runtime/progression/progressTrack.ts", {});
const {
  nextAuthoritativeProgressTrackStep,
  pendingAuthoritativeProgressCount,
} = loadTsModule("../src/runtime/progression/authoritativeTrack.ts", {
  "./authoritativeDelta": authoritativeDelta,
  "./progressTrack": progressTrack,
});

const definition = {
  targetCount: 4,
  stages: [
    { minContributions: 1, stage: 1 },
    { minContributions: 3, stage: 2 },
  ],
  beatId: (number) => `demo:${number}`,
};

assert.equal(
  pendingAuthoritativeProgressCount(14, 10, 0),
  4,
  "authoritative progress since baseline must become local backlog",
);
assert.equal(
  pendingAuthoritativeProgressCount(14, 10, 2),
  2,
  "already consumed local progress must be subtracted exactly once",
);
assert.equal(
  pendingAuthoritativeProgressCount(9, 10, 0),
  0,
  "authoritative counters below baseline must never create negative backlog",
);

assert.deepEqual(
  nextAuthoritativeProgressTrackStep({
    authoritativeCount: 14,
    baselineCount: 10,
    consumedCount: 0,
    trackContributions: 0,
    definition,
    blocked: false,
  }),
  { number: 1, beatId: "demo:1", visibleStage: 1, backlog: 4 },
  "large backend backlog must still present exactly the next authored beat",
);

assert.equal(
  nextAuthoritativeProgressTrackStep({
    authoritativeCount: 14,
    baselineCount: 10,
    consumedCount: 1,
    trackContributions: 1,
    definition,
    blocked: true,
  }),
  null,
  "story gates must block presentation without consuming authoritative backlog",
);

assert.deepEqual(
  nextAuthoritativeProgressTrackStep({
    authoritativeCount: 14,
    baselineCount: 10,
    consumedCount: 1,
    trackContributions: 1,
    definition,
    blocked: false,
  }),
  { number: 2, beatId: "demo:2", visibleStage: 1, backlog: 3 },
  "resolving a story gate must resume at the same unconsumed next beat",
);

assert.equal(
  nextAuthoritativeProgressTrackStep({
    authoritativeCount: 14,
    baselineCount: 10,
    consumedCount: 4,
    trackContributions: 4,
    definition,
    blocked: false,
  }),
  null,
  "fully consumed authoritative progress must not manufacture another step",
);

const act2 = fs.readFileSync(new URL("../src/game/act2RuntimeState.ts", import.meta.url), "utf8");
const projectEngine = fs.readFileSync(new URL("../src/runtime/progression/projectProgressEngine.ts", import.meta.url), "utf8");
assert.match(
  projectEngine,
  /pendingAuthoritativeProgressCount\(/,
  "project engine must compose authoritative backlog through the shared authoritative-track primitive",
);
assert.match(
  projectEngine,
  /nextAuthoritativeProgressTrackStep\(\{/,
  "project engine must compose the next authored track step through the shared authoritative-track primitive",
);
assert.match(
  act2,
  /pendingAuthoritativeProjectProgressCount\(\{/,
  "Act 2 backlog calculation must delegate to the generic project engine",
);
assert.match(
  act2,
  /nextAuthoritativeProjectProgressStep\(\{/,
  "Act 2 contribution presentation must delegate to the generic project engine",
);
assert.doesNotMatch(
  act2,
  /nextAuthoritativeProgressTrackStep\(\{|pendingAuthoritativeProgressCount\(/,
  "Act 2 must not retain track-level authoritative composition after project-engine extraction",
);

console.log("PASS: authoritative progress track preserves backlog, gates and authored beat order");
