import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Run the actual domain/save modules. Only platform storage is replaced with an in-memory adapter.
let stored = null;
let failWrite = false;
const preferences = { async get() { return { value: stored }; }, async set({ value }) {
  if (failWrite) throw new Error("intentional test write failure");
  stored = value;
}, async remove() { stored = null; } };
// Minimal renderer harness: execute the real VillageScene methods and controlled tween callbacks.
let scene;
const images = [];
const tweens = [];
const delays = [];
function imageObject(x, y, key) {
  return { x, y, key, active: true, visible: true, setOrigin() { return this; },
    setDisplaySize(width, height) { this.width = width; this.height = height; return this; },
    setDepth(depth) { this.depth = depth; return this; }, setInteractive() { return this; },
    setVisible(visible) { this.visible = visible; return this; }, setPosition(x, y) { this.x = x; this.y = y; return this; },
    destroy() { this.active = false; }, on() { return this; } };
}
const phaser = {
  AUTO: 0, Scale: { FIT: 0, CENTER_BOTH: 0 },
  Scene: class {
    constructor() {
      this.add = {
        image(x, y, key) { const image = imageObject(x, y, key); images.push(image); return image; },
        text: imageObject,
        sprite(x, y, key) { const image = imageObject(x, y, key); images.push(image); return image; },
        graphics() { return { fillStyle() { return this; }, lineStyle() { return this; }, fillRoundedRect() { return this; }, strokeRoundedRect() { return this; }, fillTriangle() { return this; } }; },
        container(x, y) { return { x, y, active: true, visible: true, setDepth() { return this; }, setSize() { return this; }, setInteractive() { return this; }, setVisible(visible) { this.visible = visible; return this; }, on() { return this; }, destroy() { this.active = false; } }; },
      };
      this.events = { once() {}, off() {} };
      this.tweens = { add(tween) { tweens.push(tween); }, killTweensOf() {} };
      this.time = { delayedCall(ms, callback) { delays.push({ ms, callback }); } };
    }
  },
  Game: class {
    constructor(config) { scene = new config.scene(); this.scene = { isActive: () => true, getScene: () => scene }; }
    destroy() {}
  },
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
    path => path === "phaser" ? phaser : path === "@capacitor/preferences" ? { Preferences: preferences } : load(path.replace(/^\.\//, "")), record, record.exports);
  return record.exports;
}
const domain = load("construction");
const save = load("saveState");
const { constructionPresentation } = load("constructionPresentation");
const assets = load("visualProductionAssets");
const nav = load("villageNavigation");
const initial = domain.initialConstruction();
assert.equal(domain.earnConstruction(initial, "recycling:2"), initial, "no stage 2 before delivery");
const quests = load("quests");
// The legacy make-bed quest model was intentionally removed. Keep this construction
// regression focused on the authoritative progression shape that stage 1 consumes.
const approvedProgression = { ...quests.createEmptyProgression(), orderEnvironment: 0.7 };
assert.equal(domain.syncConstructionProgression(initial, quests.createEmptyProgression()), initial);
const firstPending = domain.syncConstructionProgression(initial, approvedProgression);
assert.equal(firstPending.earned.recycling, 1);
assert.equal(firstPending.revealed.recycling, 0);
assert.deepEqual(firstPending.pending, ["recycling:1"]);
assert.equal(domain.syncConstructionProgression(firstPending, approvedProgression), firstPending);
assert.equal(domain.residentAttention(firstPending).presentation, "delivery");
assert.deepEqual(constructionPresentation(firstPending).stages, {});
assert.deepEqual(assets.getVisualProductionObstacles(constructionPresentation(firstPending).stages), []);
const approvalSnapshot = { ...save.createDefaultSaveState(), questStates: { makeBed: "approved" },
  completedQuestIds: ["makeBed"], progression: approvedProgression, diamonds: 5, sysselBux: 10,
  construction: firstPending };
await save.saveSaveState(approvalSnapshot, true);
const reloadedPending = await save.loadSaveState();
assert.deepEqual(reloadedPending.construction, firstPending);
assert.equal(reloadedPending.worldFlags.firstDeliveryComplete, false);
assert.equal(reloadedPending.worldFlags.recyclingCenterStage, 0);
assert.equal(reloadedPending.diamonds, 5);
assert.equal(reloadedPending.sysselBux, 10);
assert.deepEqual(reloadedPending.progression, approvedProgression);
assert.deepEqual(save.normalizeSaveState({ ...approvalSnapshot, worldFlags: { firstDeliveryComplete: true, recyclingCenterStage: 1 } }).construction, firstPending, "legacy flags cannot override authoritative pending");
const delivered = domain.commitConstructionReveal(firstPending, "recycling:1");
assert.equal(domain.commitConstructionReveal(delivered, "recycling:1"), delivered);
assert.equal(domain.syncConstructionProgression(delivered, approvedProgression), delivered);
await save.saveSaveState(save.withConstructionState(approvalSnapshot, delivered), true);
assert.deepEqual((await save.loadSaveState()).construction, delivered);
assert.equal((await save.loadSaveState()).worldFlags.firstDeliveryComplete, true);
assert.equal(delivered.revealed.recycling, 1);
const pending = domain.earnConstruction(delivered, "recycling:2");
assert.equal(pending.earned.recycling, 2);
assert.equal(pending.revealed.recycling, 1);
assert.deepEqual(pending.pending, ["recycling:2"]);
assert.equal(domain.earnConstruction(pending, "recycling:2"), pending);
assert.equal(domain.commitConstructionReveal(pending, "wrong-id"), pending);
assert.deepEqual(domain.normalizeConstruction({ ...pending, pending: ["recycling:2", "recycling:2", "unknown"] }), pending);
assert.equal(domain.residentAttention(pending).resident, "linus");
const presentation = constructionPresentation(pending);
assert.equal(presentation.stages.recycling, 1);
assert.deepEqual(presentation.attention.approach, { x: -180, y: 558 });
const blocking = [...nav.STATIC_OBSTACLES, ...assets.getVisualProductionObstacles(presentation.stages)];
assert(nav.isWalkable(presentation.attention.position, blocking));
assert(nav.isWalkable(presentation.attention.approach, blocking));
assert(nav.findPath(nav.REQUIRED_APPROACHES.spawn, presentation.attention.approach, blocking).length);

const snapshot = { ...save.createDefaultSaveState(), construction: pending,
  worldFlags: { firstDeliveryComplete: true, recyclingCenterStage: 1 } };
await save.saveSaveState(snapshot, true);
assert.deepEqual((await save.loadSaveState()).construction, pending, "pending survives actual save/load normalization");
const committed = domain.commitConstructionReveal(pending, "recycling:2");
assert.equal(committed.revealed.recycling, 2);
assert.equal(domain.residentAttention(committed), null);
assert.equal(domain.commitConstructionReveal(committed, "recycling:2"), committed, "double click/replay is idempotent");
assert.equal(domain.earnConstruction(committed, "recycling:2"), committed, "no replay after commit");
assert.equal(constructionPresentation(committed).stages.recycling, 2);
assert.deepEqual(assets.getVisualProductionObstacles(constructionPresentation(committed).stages), assets.getVisualProductionObstacles(presentation.stages));
failWrite = true;
const oldWarn = console.warn;
try {
  console.warn = () => {};
  await assert.rejects(save.saveSaveState({ ...snapshot, construction: committed }, true));
} finally { console.warn = oldWarn; }
assert.deepEqual((await save.loadSaveState()).construction, pending, "failed commit retains persisted pending");
failWrite = false;
await save.saveSaveState({ ...snapshot, construction: committed }, true);
assert.deepEqual((await save.loadSaveState()).construction, committed, "retry commits atomically");
const legacy = { ...snapshot }; delete legacy.construction;
assert.equal(save.normalizeSaveState(legacy).construction.revealed.recycling, 1);
assert.deepEqual(save.normalizeSaveState(legacy).construction.pending, []);
assert.deepEqual(domain.normalizeConstruction(null, 2).pending, [], "legacy visible stage 2 is not replayed");
// New schema persists its revealed stage independently of the legacy earned-stage field.
assert.equal(save.normalizeSaveState({ ...snapshot, construction: pending }).construction.revealed.recycling, 1);
console.log("PASS: stage 1 approval pending/reload/reward invariance/commit; delivery prerequisite; earned/revealed separation; pending reload; duplicate/wrong events; commit reload; failed save + retry; legacy saves; resident placement/navigation; stage 2 footprint.");

// Regression: backend progression can contain old claims before this local save establishes
// its baseline. Only claims after that baseline may earn construction, one explicit reveal at
// a time; sync/reload must never replay the historical total as multiple Recycling stages.
const historicalClaims = 12;
const baselineSnapshot = {
  ...save.createDefaultSaveState(),
  worldFlags: {
    ...save.createDefaultSaveState().worldFlags,
    recyclingClaimBaseline: historicalClaims,
    recyclingClaimBaselineStage: 0,
  },
};
await save.saveSaveState(baselineSnapshot, true);
const baselineReload = await save.loadSaveState(true);
assert.equal(baselineReload.worldFlags.recyclingClaimBaseline, historicalClaims);
assert.equal(baselineReload.worldFlags.recyclingClaimBaselineStage, 0);

const syncRecycling = (state, worldProgression, saved = baselineReload) =>
  domain.syncRecyclingContributionProgress(
    state,
    worldProgression,
    saved.worldFlags.recyclingClaimBaseline,
    saved.worldFlags.recyclingClaimBaselineStage,
  );

const historicalSync = syncRecycling(baselineReload.construction, historicalClaims);
assert.equal(historicalSync, baselineReload.construction, "historical claims are absorbed by the fresh local baseline");
assert.deepEqual(historicalSync.earned, { recycling: 0, bakery: 0, clinic: 0 });
assert.deepEqual(historicalSync.revealed, { recycling: 0, bakery: 0, clinic: 0 });
assert.deepEqual(historicalSync.pending, []);
assert.equal(syncRecycling(historicalSync, historicalClaims), historicalSync, "unchanged historical progression is idempotent");

await save.saveSaveState(save.withConstructionState(baselineReload, historicalSync), true);
const historicalRestart = await save.loadSaveState(true);
assert.equal(syncRecycling(historicalRestart.construction, historicalClaims, historicalRestart), historicalRestart.construction,
  "save/load with unchanged historical progression cannot advance Recycling");

const oneNewClaim = syncRecycling(historicalRestart.construction, historicalClaims + 1, historicalRestart);
assert.equal(oneNewClaim.earned.recycling, 1, "one post-baseline claim earns at most the next intended stage");
assert.equal(oneNewClaim.revealed.recycling, 0, "earning never implicitly reveals the stage");
assert.deepEqual(oneNewClaim.pending, ["recycling:1"]);
assert.equal(syncRecycling(oneNewClaim, historicalClaims + 1, historicalRestart), oneNewClaim,
  "the same authoritative progression cannot earn another stage");

await save.saveSaveState(save.withConstructionState(historicalRestart, oneNewClaim), true);
const pendingRestart = await save.loadSaveState(true);
assert.deepEqual(pendingRestart.construction.pending, ["recycling:1"]);
assert.equal(syncRecycling(pendingRestart.construction, historicalClaims + 1, pendingRestart), pendingRestart.construction,
  "reload of the same progression cannot cascade while the explicit reveal is pending");

const revealedOnce = domain.commitConstructionReveal(pendingRestart.construction, "recycling:1");
assert.equal(revealedOnce.revealed.recycling, 1);
assert.deepEqual(revealedOnce.pending, []);
assert.equal(domain.commitConstructionReveal(revealedOnce, "recycling:1"), revealedOnce, "the explicit reveal is idempotent");
assert.equal(syncRecycling(revealedOnce, historicalClaims + 1, pendingRestart), revealedOnce,
  "historical counts plus the already-consumed increment cannot cascade into stage 2");

await save.saveSaveState(save.withConstructionState(pendingRestart, revealedOnce), true);
const revealedRestart = await save.loadSaveState(true);
assert.equal(revealedRestart.construction.revealed.recycling, 1);
assert.equal(syncRecycling(revealedRestart.construction, historicalClaims + 1, revealedRestart), revealedRestart.construction,
  "restart after the reveal cannot replay the claim or advance another stage");
console.log("PASS: historical Recycling claims establish a safe baseline; one new claim earns one explicit, idempotent reveal without cascade across sync/reload.");

const handle = await load("createVillageGame").createVillageGame({ clientWidth: 1280, clientHeight: 800 }, {
  onQuestOpen() {}, onLinusInteract() {}, onConstructionInteract() {},
});
scene.introComplete = true;
scene.questMarker = { getByName: () => ({ setText() {} }), setPosition() { return this; }, setVisible() { return this; } };
scene.residents.linus = imageObject(290, 445, "linus-painted");
handle.setConstruction(constructionPresentation(firstPending));
assert.equal(images.filter(i => i.key === "truck-painted").length, 0, "approval never creates truck");
assert.equal(images.filter(i => i.key === "visual-production-recycling-1").length, 0, "pending has no foundation");
assert.equal(scene.navigationObstacles.length, nav.STATIC_OBSTACLES.length + 1, "opening shop has a permanent navigation footprint");
assert.equal(scene.residents.linus.x, -132);
assert.equal(scene.residents.linus.y, 570);
let commits = 0;
const delivery = handle.presentConstructionReveal("recycling:1", async () => {
  commits++;
  await save.saveSaveState(save.withConstructionState(approvalSnapshot, delivered), true);
  handle.setConstruction(constructionPresentation(delivered));
});
assert.equal(commits, 0, "construction is not committed before truck arrival");
assert.equal(images.filter(i => i.key === "truck-painted" && i.active).length, 1);
await assert.rejects(handle.presentConstructionReveal("recycling:1", async () => {}));
const arrival = tweens.find(t => t.targets.key === "truck-painted");
assert.equal(arrival.duration, 1700);
await arrival.onComplete();
assert.equal(commits, 1);
assert.equal(images.filter(i => i.key === "visual-production-recycling-1" && i.active).length, 1);
assert.equal(scene.navigationObstacles.length, nav.STATIC_OBSTACLES.length + 2, "shop + recycling stage 1 footprints are active");
assert.equal(delays[0].ms, 900);
delays[0].callback();
const departure = tweens.at(-1);
assert.equal(departure.duration, 1500);
departure.onComplete();
await delivery;
assert.equal(images.filter(i => i.key === "truck-painted" && i.active).length, 0);
await assert.rejects(handle.presentConstructionReveal("recycling:1", async () => {}));
assert.equal(images.filter(i => i.key === "truck-painted").length, 1, "no replay after commit");
handle.setConstruction(constructionPresentation(pending));
await handle.presentConstructionReveal("recycling:2", async () => handle.setConstruction(constructionPresentation(committed)));
assert.equal(images.filter(i => i.key === "truck-painted").length, 1, "stage 2 does not run a truck");
assert.equal(images.filter(i => i.key === "visual-production-recycling-2" && i.active).length, 1);
console.log("PASS: real scene methods — approval has no truck, pending relocates Linus without collision, conversation starts one truck, arrival commits render/collision, original timings, no replay, stage 2 regression.");
