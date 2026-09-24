import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

let stored = null;
let failRead = false;
let failWrite = false;
let holdWrite = null;
const preferences = {
  async get() { if (failRead) throw new Error("storage unavailable"); return { value: stored }; },
  async set({ value }) { if (holdWrite) await holdWrite; if (failWrite) throw new Error("storage full"); stored = value; },
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

const clinicFinaleSave = {
  ...restoredAfterStory,
  worldFlags: { ...restoredAfterStory.worldFlags, clinicCompletionSeen: true },
};
await save.saveSaveState(clinicFinaleSave, true);
const restoredClinicFinale = await save.loadSaveState(true);
assert.equal(restoredClinicFinale.worldFlags.clinicCompletionSeen, true,
  "Clinic finale completion must survive normalization/reload and never become eligible to replay");
console.log("PASS: Clinic finale completion flag survives reload.");

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

// A new JS process/module lifetime must retain the entire valid save, not just stage.
const valid = save.normalizeSaveState({ ...afterStory, childName: "Alex", dogName: "Bosse",
  questStates: { makeBed: "approved" }, diamonds: 17, sysselBux: 29,
});
await save.saveSaveState(valid, true);
const validBytes = stored;
modules.clear();
const restartedSave = load("saveState");
assert.deepEqual(await restartedSave.loadSaveState(true), valid);
assert.equal(stored, validBytes, "reload reads without rewriting storage");
await restartedSave.saveSaveState(await restartedSave.loadSaveState(true), true);
assert.equal(stored, validBytes, "first autosave after update/reload preserves all normalized fields");

// Failure leaves last durable state intact; a rejected queue must not poison retry.
failWrite = true;
const next = { ...valid, diamonds: 18 };
await assert.rejects(restartedSave.saveSaveState(next, true), /storage full/);
assert.equal(stored, validBytes);
failWrite = false;
await restartedSave.saveSaveState(next, true);
assert.deepEqual(await restartedSave.loadSaveState(true), next);

// Slow storage must preserve call ordering and snapshot values, not object mutations.
let releaseWrite;
holdWrite = new Promise(resolve => { releaseWrite = resolve; });
const firstSnapshot = { ...next, sysselBux: 30 };
const firstWrite = restartedSave.saveSaveState(firstSnapshot, true);
const lastSnapshot = { ...next, sysselBux: 31 };
const lastWrite = restartedSave.saveSaveState(lastSnapshot, true);
lastSnapshot.sysselBux = 999; // Caller changes after enqueue cannot corrupt persisted snapshot.
releaseWrite();
await Promise.all([firstWrite, lastWrite]);
holdWrite = null;
assert.equal((await restartedSave.loadSaveState(true)).sysselBux, 31);
assert.equal((await restartedSave.loadSaveState(true)).diamonds, 18);
console.log("PASS: full save survives fresh module/reload, failed write preserves durable state, retry and queued snapshots remain ordered");
