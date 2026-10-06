import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

function loadTsModule(file, dependencies) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const requireDependency = (name) => {
    assert.ok(name in dependencies, `Unexpected project-progress dependency: ${name}`);
    return dependencies[name];
  };
  new Function("exports", "require", code)(exports, requireDependency);
  return exports;
}

const progressTrack = loadTsModule("../src/runtime/progression/progressTrack.ts", {});
const authoritativeDelta = loadTsModule("../src/runtime/progression/authoritativeDelta.ts", {});
const authoritativeTrack = loadTsModule("../src/runtime/progression/authoritativeTrack.ts", {
  "./authoritativeDelta": authoritativeDelta,
  "./progressTrack": progressTrack,
});
const {
  canSelectProjectProgress,
  consumeProjectCompletionReaction,
  consumeSelectedProjectProgress,
  nextAuthoritativeProjectProgressStep,
  nextPendingProjectCompletionReaction,
  normalizeProjectProgressState,
  pendingAuthoritativeProjectProgressCount,
  projectCompletionReactionPending,
  projectPrerequisitesComplete,
  selectProjectProgress,
  totalProjectProgress,
} = loadTsModule("../src/runtime/progression/projectProgressEngine.ts", {
  "./progressTrack": progressTrack,
  "./authoritativeTrack": authoritativeTrack,
});

const definition = {
  projects: ["alpha", "beta"],
  track: (project) => ({
    targetCount: project === "alpha" ? 3 : 2,
    stages: project === "alpha"
      ? [
          { minContributions: 1, stage: 1 },
          { minContributions: 3, stage: 2 },
        ]
      : [
          { minContributions: 1, stage: 1 },
          { minContributions: 2, stage: 2 },
        ],
    beatId: (number) => `${project}:${number}`,
  }),
  prerequisites: {
    beta: ["alpha"],
  },
  completionReactionId: (project) =>
    project === "alpha" ? "alpha:reaction" : null,
};

const emptyTrack = () => ({
  contributions: 0,
  visibleStage: 0,
  consumedBeatIds: [],
  complete: false,
});

let state = normalizeProjectProgressState({
  selectedProject: null,
  projects: {
    alpha: emptyTrack(),
    beta: emptyTrack(),
  },
  consumedCompletionReactionIds: [],
}, definition);

assert.equal(canSelectProjectProgress(state, definition, "alpha"), true);
assert.equal(canSelectProjectProgress(state, definition, "beta"), false);
assert.equal(projectPrerequisitesComplete(state, definition, "beta"), false);

state = selectProjectProgress(state, definition, "alpha");
assert.equal(state.selectedProject, "alpha");

const blocked = consumeSelectedProjectProgress(state, definition, {
  project: "alpha",
  beatId: "alpha:1",
  blocked: true,
});
assert.deepEqual(blocked, state, "blocked progress must not consume a beat");

state = consumeSelectedProjectProgress(state, definition, {
  project: "alpha",
  beatId: "alpha:1",
});
assert.equal(state.projects.alpha.contributions, 1);
assert.equal(state.projects.alpha.visibleStage, 1);
assert.equal(state.projects.alpha.complete, false);

const duplicate = consumeSelectedProjectProgress(state, definition, {
  project: "alpha",
  beatId: "alpha:1",
});
assert.deepEqual(duplicate, state, "duplicate beat consumption must be idempotent");

const outOfOrder = consumeSelectedProjectProgress(state, definition, {
  project: "alpha",
  beatId: "alpha:3",
});
assert.deepEqual(outOfOrder, state, "out-of-order authored beats must not consume progress");

state = consumeSelectedProjectProgress(state, definition, {
  project: "alpha",
  beatId: "alpha:2",
});
state = consumeSelectedProjectProgress(state, definition, {
  project: "alpha",
  beatId: "alpha:3",
});
assert.equal(state.projects.alpha.contributions, 3);
assert.equal(state.projects.alpha.visibleStage, 2);
assert.equal(state.projects.alpha.complete, true);
assert.equal(state.selectedProject, null, "completed project must auto-deselect");
assert.equal(projectPrerequisitesComplete(state, definition, "beta"), true);
assert.equal(canSelectProjectProgress(state, definition, "beta"), true);
assert.equal(totalProjectProgress(state, definition), 3);

assert.equal(projectCompletionReactionPending(state, definition, "alpha"), true);
assert.equal(nextPendingProjectCompletionReaction(state, definition), "alpha");
state = consumeProjectCompletionReaction(state, definition, "alpha");
assert.equal(projectCompletionReactionPending(state, definition, "alpha"), false);
assert.deepEqual(state.consumedCompletionReactionIds, ["alpha:reaction"]);
assert.deepEqual(
  consumeProjectCompletionReaction(state, definition, "alpha"),
  state,
  "completion reaction consumption must be exactly-once",
);

state = selectProjectProgress(state, definition, "beta");
state = consumeSelectedProjectProgress(state, definition, {
  project: "beta",
  beatId: "beta:1",
});
state = consumeSelectedProjectProgress(state, definition, {
  project: "beta",
  beatId: "beta:2",
});
assert.equal(state.projects.beta.contributions, 2);
assert.equal(state.projects.beta.complete, true);
assert.equal(state.selectedProject, null);
assert.equal(totalProjectProgress(state, definition), 5);
assert.equal(nextPendingProjectCompletionReaction(state, definition), null);

let authoritativeState = normalizeProjectProgressState({
  selectedProject: "alpha",
  projects: {
    alpha: emptyTrack(),
    beta: emptyTrack(),
  },
  consumedCompletionReactionIds: [],
}, definition);

assert.equal(
  pendingAuthoritativeProjectProgressCount({
    state: authoritativeState,
    definition,
    authoritativeCount: 14,
    baselineCount: 10,
  }),
  4,
  "project engine must compose authoritative backlog from total consumed project progress",
);
assert.deepEqual(
  nextAuthoritativeProjectProgressStep({
    state: authoritativeState,
    definition,
    authoritativeCount: 14,
    baselineCount: 10,
  }),
  { project: "alpha", number: 1, beatId: "alpha:1", visibleStage: 1, backlog: 4 },
  "project engine must select exactly the next authored beat for the active non-16 track",
);
assert.equal(
  nextAuthoritativeProjectProgressStep({
    state: authoritativeState,
    definition,
    authoritativeCount: 14,
    baselineCount: 10,
    blocked: () => true,
  }),
  null,
  "project-level story gates must block presentation without consuming backlog",
);
authoritativeState = consumeSelectedProjectProgress(authoritativeState, definition, {
  project: "alpha",
  beatId: "alpha:1",
});
assert.deepEqual(
  nextAuthoritativeProjectProgressStep({
    state: authoritativeState,
    definition,
    authoritativeCount: 14,
    baselineCount: 10,
  }),
  { project: "alpha", number: 2, beatId: "alpha:2", visibleStage: 1, backlog: 3 },
  "authoritative backlog must resume at the same unconsumed sequence after one beat is consumed",
);

console.log("PASS: generic project-progress engine handles non-16 targets, prerequisites, authoritative backlog, idempotent consumption and exactly-once reactions");
