import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const modules = new Map();
function load(name) {
  if (modules.has(name)) return modules.get(name).exports;
  const record = { exports: {} };
  modules.set(name, record);
  const source = ts.transpileModule(readFileSync(`src/game/${name}.ts`, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function("require", "module", "exports", source)(
    path => load(path.replace(/^\.\//, "")), record, record.exports,
  );
  return record.exports;
}

const domain = load("construction");
const { constructionPresentation } = load("constructionPresentation");
const assets = load("visualProductionAssets");

function revealedRecycling(stage) {
  return domain.normalizeConstruction({
    earned: { recycling: stage, bakery: 0, clinic: 0 },
    revealed: { recycling: stage, bakery: 0, clinic: 0 },
    pending: [],
  });
}

let state = revealedRecycling(2);
assert.equal(domain.earnConstruction(state, "recycling:4"), state, "stage 4 cannot skip stage 3");
state = domain.earnConstruction(state, "recycling:3");
assert.equal(state.earned.recycling, 3);
assert.equal(state.revealed.recycling, 2);
assert.deepEqual(state.pending, ["recycling:3"]);
assert.equal(domain.residentAttention(state).resident, "linus");
assert.equal(domain.residentAttention(state).presentation, "construction");
assert(!domain.residentAttention(state).dialogue.toLowerCase().includes("återvinnings"), "pre-reveal copy must not name the payoff");
assert.equal(constructionPresentation(state).stages.recycling, 2, "pending stage must keep old visible stage");
const stage2Obstacle = assets.getVisualProductionObstacles(constructionPresentation(state).stages);

const stage3 = domain.commitConstructionReveal(state, "recycling:3");
assert.equal(stage3.revealed.recycling, 3);
assert.deepEqual(stage3.pending, []);
assert.equal(constructionPresentation(stage3).stages.recycling, 3);
assert.deepEqual(assets.getVisualProductionObstacles(constructionPresentation(stage3).stages), stage2Obstacle, "fixed footprint across stages");
assert.equal(domain.commitConstructionReveal(stage3, "recycling:3"), stage3, "stage 3 replay is idempotent");

state = domain.earnConstruction(stage3, "recycling:4");
assert.equal(state.earned.recycling, 4);
assert.equal(state.revealed.recycling, 3);
assert.deepEqual(state.pending, ["recycling:4"]);
assert.equal(constructionPresentation(state).stages.recycling, 3);
const normalizedPending = domain.normalizeConstruction({ ...state, pending: ["unknown", "recycling:4", "recycling:4"] });
assert.deepEqual(normalizedPending.pending, ["recycling:4"], "reload normalization repairs pending queue");

const stage4 = domain.commitConstructionReveal(normalizedPending, "recycling:4");
assert.equal(stage4.revealed.recycling, 4);
assert.equal(stage4.earned.recycling, 4);
assert.deepEqual(stage4.pending, []);
assert.equal(domain.residentAttention(stage4), null);
assert.equal(domain.earnConstruction(stage4, "recycling:4"), stage4, "stage 4 is capped/idempotent");
assert.equal(constructionPresentation(stage4).stages.recycling, 4);

assert.equal(constructionPresentation(domain.initialConstruction()).stages.bakery, undefined, "Bakery stage 0 is absent");
assert(!assets.getVisualProductionObstacles({}).some(() => true), "stage 0 has no building collision");
for (let stage = 1; stage <= 4; stage++) {
  assert.equal(assets.getVisualProductionAsset("bakery", stage), `/assets/village/buildings/bakery/bakery-stage-${stage}.webp`);
}

console.log("PASS: Recycling stages 3-4 reuse earned/pending/reveal/commit semantics; no skip/replay; pending keeps prior render/collision; Bakery stage 0 absent and production assets mapped.");
