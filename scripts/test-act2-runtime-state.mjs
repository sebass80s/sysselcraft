import assert from "node:assert/strict";
import fs from "node:fs";
import {
  canSelectProject,
  createDefaultAct2RuntimeState,
  isMotorboatUnlocked,
  normalizeAct2RuntimeState,
  prerequisiteCompletionCount,
  withPresentedContribution,
  withSelectedProject,
} from "../src/game/act2RuntimeState.ts";

const empty = createDefaultAct2RuntimeState();
assert.equal(empty.openingIndex, 0);
assert.equal(empty.openingComplete, false);
assert.equal(empty.selectedProject, null);
assert.equal(prerequisiteCompletionCount(empty), 0);
assert.equal(isMotorboatUnlocked(empty), false);
assert.equal(canSelectProject(empty, "motorboat"), false);

const restored = normalizeAct2RuntimeState({
  version: 1,
  entered: true,
  openingIndex: 4,
  openingComplete: true,
  bicycleSeen: true,
  alveIntroIndex: 999,
  alveIntroComplete: true,
  selectedProject: "dock",
  projects: {
    cabin: { contributions: 4, visibleStage: 1, consumedBeatIds: ["c1"], complete: false },
    dock: { contributions: 3, visibleStage: 1, consumedBeatIds: ["d1"], complete: false },
    boathouse: { contributions: 0, visibleStage: 0, consumedBeatIds: [], complete: false },
    motorboat: { contributions: 0, visibleStage: 0, consumedBeatIds: [], complete: false },
  },
});
assert.equal(restored.entered, true);
assert.equal(restored.openingIndex, 4);
assert.equal(restored.openingComplete, true);
assert.equal(restored.bicycleSeen, true);
assert.equal(restored.alveIntroComplete, true);
assert.equal(restored.selectedProject, "dock");
assert.equal(restored.projects.cabin.contributions, 4);

assert.equal(normalizeAct2RuntimeState({ version: 1, openingIndex: 99 }).openingIndex, 4);
assert.equal(normalizeAct2RuntimeState({ version: 1, openingIndex: -4 }).openingIndex, 0);

let state = withSelectedProject(empty, "dock");
assert.equal(state.selectedProject, "dock");

state = withPresentedContribution(state, "dock", "dock:01", 1);
assert.equal(state.projects.dock.contributions, 1);
assert.equal(state.projects.dock.visibleStage, 1);
assert.deepEqual(state.projects.dock.consumedBeatIds, ["dock:01"]);

const duplicate = withPresentedContribution(state, "dock", "dock:01", 2);
assert.equal(duplicate.projects.dock.contributions, 1, "duplicate beat must not consume a second contribution");
assert.equal(duplicate.projects.dock.visibleStage, 1, "duplicate beat must not mutate stage");

let lockedBoat = withPresentedContribution(empty, "motorboat", "motorboat:01", 1);
assert.equal(lockedBoat.projects.motorboat.contributions, 0, "motorboat cannot advance before 3/3");

function complete(projectState, prefix) {
  let current = projectState;
  for (let i = 1; i <= 16; i++) {
    const stage = Math.min(4, Math.ceil(i / 4));
    current = withPresentedContribution(current, prefix, `${prefix}:${String(i).padStart(2, "0")}`, stage);
  }
  return current;
}

state = createDefaultAct2RuntimeState();
state = complete(state, "cabin");
assert.equal(state.projects.cabin.complete, true);
assert.equal(prerequisiteCompletionCount(state), 1);
state = complete(state, "dock");
assert.equal(prerequisiteCompletionCount(state), 2);
assert.equal(isMotorboatUnlocked(state), false);
state = complete(state, "boathouse");
assert.equal(prerequisiteCompletionCount(state), 3);
assert.equal(isMotorboatUnlocked(state), true);
assert.equal(canSelectProject(state, "motorboat"), true);

state = withSelectedProject(state, "motorboat");
assert.equal(state.selectedProject, "motorboat");
state = complete(state, "motorboat");
assert.equal(state.projects.motorboat.complete, true);
assert.equal(state.selectedProject, null);

const invalidFinale = normalizeAct2RuntimeState({
  version: 1,
  familyFinaleConsumed: true,
  epilogueConsumed: true,
  act2Complete: true,
});
assert.equal(invalidFinale.familyFinaleConsumed, false);
assert.equal(invalidFinale.epilogueConsumed, false);
assert.equal(invalidFinale.act2Complete, false);

const illegalBoatSnapshot = normalizeAct2RuntimeState({
  version: 1,
  projects: {
    motorboat: { contributions: 16, visibleStage: 4, consumedBeatIds: ["x"], complete: true },
  },
});
assert.equal(illegalBoatSnapshot.projects.motorboat.complete, false);
assert.equal(illegalBoatSnapshot.projects.motorboat.contributions, 0);

const page = fs.readFileSync(new URL("../src/app/act2/page.tsx", import.meta.url), "utf8");
for (const required of [
  "01-dog-runs-off.png",
  "02-into-the-forest.png",
  "03-through-the-trees.png",
  "04-first-view-of-the-lake.png",
  "05-the-bicycle.png",
  "meeting-alve/bike.png",
  "meeting-alve/first-hello.png",
  "Vad börjar vi med?",
  "Laga {PROJECT_COPY[previewProject].object}",
]) assert.ok(page.includes(required), `missing Act 2 runtime contract: ${required}`);

const village = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
assert.ok(village.includes('clinicCompletionSeen && <a href="/act2/"'), "Act 2 trigger must remain gated by completed Clinic finale");

console.log("Act 2 vertical-slice state/route contract PASS");
