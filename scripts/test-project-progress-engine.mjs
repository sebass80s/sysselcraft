import assert from "node:assert/strict";

import {
  canSelectProjectProgress,
  consumeProjectCompletionReaction,
  consumeSelectedProjectProgress,
  nextPendingProjectCompletionReaction,
  normalizeProjectProgressState,
  projectCompletionReactionPending,
  projectPrerequisitesComplete,
  selectProjectProgress,
  totalProjectProgress,
} from "../src/runtime/progression/projectProgressEngine.ts";

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

console.log("PASS: generic project-progress engine handles non-16 targets, prerequisites, idempotent consumption and exactly-once reactions");
