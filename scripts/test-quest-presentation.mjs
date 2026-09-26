import assert from "node:assert/strict";
import { chooseQuestPresentation } from "../src/game/questPresentation.ts";
import { readFileSync } from "node:fs";
import ts from "typescript";

const quest = (title, progressionClass) => ({ title, progressionClass });
const starter = { recyclingComplete: false, bakeryUnlocked: false, henningPresent: false, noticeboardAvailable: true };
const recyclingDone = { recyclingComplete: true, bakeryUnlocked: false, henningPresent: false, noticeboardAvailable: true };
const bakery = { recyclingComplete: true, bakeryUnlocked: true, henningPresent: true, noticeboardAvailable: true };

assert.equal(chooseQuestPresentation(quest("Bädda sängen", "wellbeingRoutine"), starter).channel, "home");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), starter).channel, "home");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), bakery).channel, "npc");
assert.equal(chooseQuestPresentation(quest("Ring mormor", "community"), bakery).presenter, "henning");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), bakery).destination, "bakery");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), recyclingDone).destination, "home");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), recyclingDone).channel, "home");
assert.equal(chooseQuestPresentation(quest("Läs en bok", "knowledgeCreativity"), recyclingDone).destination, "home");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), recyclingDone).channel, "noticeboard");

assert.equal(chooseQuestPresentation(
  quest("Gör läxan", "knowledgeCreativity"),
  { recyclingComplete: true, bakeryUnlocked: false, henningPresent: false, noticeboardAvailable: false },
).presenter, "home");
assert.equal(chooseQuestPresentation(
  quest("Hjälp till med middagen", "community"),
  { recyclingComplete: true, bakeryUnlocked: true, henningPresent: false, noticeboardAvailable: true },
).destination, "noticeboard");
assert.equal(chooseQuestPresentation(
  quest("Hjälp till med middagen", "community"),
  { recyclingComplete: true, bakeryUnlocked: false, henningPresent: true, noticeboardAvailable: true },
).destination, "noticeboard");
assert.equal(chooseQuestPresentation(
  quest("Hjälp till med middagen", "community"),
  { recyclingComplete: true, bakeryUnlocked: true, henningPresent: false, noticeboardAvailable: false },
).destination, "linus");

const backendSource = readFileSync(new URL("../src/game/backendQuestPresentation.ts", import.meta.url), "utf8");
const backendJs = ts.transpileModule(backendSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const backendModule = { exports: {} };
new Function("require", "module", "exports", backendJs)(name => {
  if (name === "./questPresentation") return { chooseQuestPresentation };
  throw new Error(`Unexpected test dependency: ${name}`);
}, backendModule, backendModule.exports);
const { presentBackendQuests, primaryPresentedQuest, questSourceCounts } = backendModule.exports;

const backendQuest = (overrides = {}) => ({
  instanceId: "instance", questId: "definition", householdId: "household", childId: "child",
  title: "Gör läxan", description: "Läs klart kapitlet.", progressionClass: "knowledgeCreativity",
  reward: { diamonds: 1, sysselBux: 2 }, state: "available", createdAt: "2026-09-22T10:00:00Z",
  acceptedAt: null, submittedAt: null, approvedAt: null, claimedAt: null, ...overrides,
});

const localRecyclingComplete = presentBackendQuests([backendQuest()], null, { recyclingCenterStage: 4 });
assert.equal(localRecyclingComplete.available[0].presentation.destination, "noticeboard",
  "observe-only local Recycling completion may unlock routing without backend migration");

const mixedStates = presentBackendQuests([
  backendQuest({ instanceId: "home", title: "Städa rummet", progressionClass: "orderEnvironment" }),
  backendQuest({ instanceId: "board", title: "Gör läxan" }),
  backendQuest({ instanceId: "active", title: "Spring en runda", progressionClass: "movementActivity", state: "active", acceptedAt: "2026-09-22T10:05:00Z" }),
  backendQuest({ instanceId: "pending", title: "Läs en bok", progressionClass: "knowledgeCreativity", state: "pending" }),
  backendQuest({ instanceId: "approved", title: "Ring mormor", progressionClass: "community", state: "approved" }),
], null, { recyclingCenterStage: 4 });

assert.deepEqual(questSourceCounts(mixedStates), { noticeboard: 0, home: 2, linus: 0, bakery: 0 },
  "only actionable available quests may light world-source attention");
assert.equal(mixedStates.active.length, 1, "accepted quests live in active without re-lighting a world source");
assert.equal(mixedStates.pending.length, 1, "pending quests stay discoverable in the general quest view");
assert.equal(mixedStates.pending[0].presentation.destination, "home",
  "pending quests keep presentation metadata without re-lighting the source");
assert.equal(primaryPresentedQuest(mixedStates)?.quest.instanceId, "active",
  "accepted work remains primary in the general quest panel without relighting a world source");

const bakeryAvailable = presentBackendQuests([
  backendQuest({ instanceId: "bakery", title: "Hjälp till med middagen", progressionClass: "community" }),
], {
  diamonds: 0, sysselBux: 0, progression: { worldProgression: 0 },
  worldFlags: { recyclingComplete: true, bakeryUnlocked: true, henningPresent: true },
});
assert.deepEqual(questSourceCounts(bakeryAvailable), { noticeboard: 0, home: 0, linus: 0, bakery: 1 },
  "an available Bakery quest must light Henning/Bakery world attention");

const bakeryFromVisibleLocalWorld = presentBackendQuests([
  backendQuest({ instanceId: "local-bakery", title: "Baka bröd" }),
], {
  diamonds: 0, sysselBux: 0, progression: { worldProgression: 0 }, worldFlags: {},
}, { recyclingCenterStage: 4, bakeryStage: 4, henningPresent: true });
assert.equal(bakeryFromVisibleLocalWorld.available[0]?.presentation.destination, "bakery",
  "the visible local Bakery/Henning state must route a matching quest to Henning even before backend world flags catch up");

const villageSource = readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
const runtimeSource = readFileSync(new URL("../src/game/createVillageGame.ts", import.meta.url), "utf8");
assert.match(villageSource, /setQuestSourceAttention\("bakery", questSources\.bakery > 0 \? "\?" : null\)/,
  "initial village boot must publish Bakery attention");
assert.match(villageSource, /setQuestSourceAttention\("bakery", \(detail\?\.counts\.bakery \?\? 0\) > 0 \? "\?" : null\)/,
  "live quest updates must publish Bakery attention");
assert.match(runtimeSource, /backendBakeryAttention/,
  "village runtime must track Bakery attention");
assert.match(runtimeSource, /onQuestSourceInteract\?\.\("bakery"\)/,
  "Henning/Bakery interaction must open the Bakery quest source");
assert.match(runtimeSource, /setHenningVisible\(visible: boolean\)[\s\S]*?setQuestSourceAttention\("bakery", requestedQuestSourceAttention\.bakery\)/,
  "Henning visibility changes must restore Bakery quest attention");
assert.equal(presentBackendQuests([backendQuest({ state: "approved" })], null).available.length, 0,
  "approved history is not presented as actionable world content");

console.log("quest presentation policy and source-attention contract: ok");
