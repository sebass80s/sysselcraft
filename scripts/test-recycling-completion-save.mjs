import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

let stored = null;
let failRead = false;
const preferences = {
  async get() { if (failRead) throw new Error("storage unavailable"); return { value: stored }; },
  async set({ value }) { stored = value; },
  async remove() { stored = null; },
};

const modules = new Map();
function load(name) {
  if (modules.has(name)) return modules.get(name).exports;
  const record = { exports: {} };
  modules.set(name, record);
  const source = ts.transpileModule(readFileSync(`src/game/${name}.ts`, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function("require", "module", "exports", source)(
    path => path === "@capacitor/preferences"
      ? { Preferences: preferences }
      : load(path.replace(/^\.\//, "")),
    record,
    record.exports,
  );
  return record.exports;
}

const construction = load("construction");
const save = load("saveState");

function revealedRecycling(stage) {
  return construction.normalizeConstruction({
    earned: { recycling: stage, bakery: 0, clinic: 0 },
    revealed: { recycling: stage, bakery: 0, clinic: 0 },
    pending: [],
    completedStoryBeats: [],
  });
}

const stage4 = revealedRecycling(4);
assert.equal(construction.recyclingCompletionPending(stage4), true);

const beforeStory = save.withConstructionState(save.createDefaultSaveState(), stage4);
await save.saveSaveState(beforeStory, true);
const restoredBeforeStory = await save.loadSaveState();
assert.equal(restoredBeforeStory.construction.revealed.recycling, 4);
assert.equal(construction.recyclingCompletionPending(restoredBeforeStory.construction), true,
  "stage 4 must still offer the completion scene after an app restart");

const completed = construction.commitRecyclingCompletion(restoredBeforeStory.construction);
const afterStory = save.withConstructionState(restoredBeforeStory, completed);
await save.saveSaveState(afterStory, true);
const restoredAfterStory = await save.loadSaveState();
assert.deepEqual(restoredAfterStory.construction.completedStoryBeats, [construction.RECYCLING_COMPLETION_BEAT]);
assert.equal(construction.recyclingCompletionPending(restoredAfterStory.construction), false,
  "completed scene must not replay after an app restart");
assert.equal(restoredAfterStory.worldFlags.recyclingCenterStage, 4);
assert.equal(restoredAfterStory.worldFlags.firstDeliveryComplete, true);

const malformed = save.normalizeSaveState({
  ...afterStory,
  construction: {
    ...completed,
    completedStoryBeats: [construction.RECYCLING_COMPLETION_BEAT, construction.RECYCLING_COMPLETION_BEAT, "unknown"],
  },
});
assert.deepEqual(malformed.construction.completedStoryBeats, [construction.RECYCLING_COMPLETION_BEAT],
  "save normalization keeps only the canonical one-shot completion beat");

console.log("PASS: Recycling stage 4 completion survives restart before the scene, persists after completion, and cannot replay after reload.");

// A broken/future save must never be mistaken for a new game by the playable surface.
for (const unreadable of ["{broken", "", JSON.stringify({ version: 2 })]) {
  stored = unreadable;
  await assert.rejects(save.loadSaveState(true), /Sparningen kunde inte läsas/);
  assert.equal(stored, unreadable, "read failures preserve original bytes");
}
stored = JSON.stringify(afterStory);
failRead = true;
await assert.rejects(save.loadSaveState(true), /Sparningen kunde inte läsas/);
failRead = false;
assert.deepEqual((await save.loadSaveState(true)).construction, afterStory.construction);
stored = null;
assert.equal(await save.loadSaveState(true), null, "only an absent key starts a new game");
console.log("PASS: strict playable save loading preserves unreadable/future saves and permits retry");
