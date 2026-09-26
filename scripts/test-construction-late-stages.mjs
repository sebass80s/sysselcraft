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
const story = load("recyclingStory");
const bakeryStory = load("bakeryStory");

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
assert(!domain.residentAttention(state).dialogue.some((line) => line.text.toLowerCase().includes("återvinnings")), "pre-reveal copy must not name the payoff");
assert.equal(constructionPresentation(state).stages.recycling, 2, "pending stage must keep old visible stage");
const stage2Obstacle = assets.getVisualProductionObstacles(constructionPresentation(state).stages);

const stage3 = domain.commitConstructionReveal(state, "recycling:3");
assert.equal(stage3.revealed.recycling, 3);
assert.deepEqual(stage3.pending, []);
assert.equal(domain.recyclingCompletionPending(stage3), false, "completion story must not unlock at stage 3");
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
assert.equal(domain.recyclingCompletionPending(stage4), true, "committed stage 4 unlocks completion story");

const completed = domain.commitRecyclingCompletion(stage4);
assert.equal(domain.recyclingCompletionPending(completed), false);
assert.deepEqual(completed.completedStoryBeats, [domain.RECYCLING_COMPLETION_BEAT]);
assert.equal(domain.commitRecyclingCompletion(completed), completed, "completion story commit is idempotent");
const reloaded = domain.normalizeConstruction({ ...completed, completedStoryBeats: [domain.RECYCLING_COMPLETION_BEAT, domain.RECYCLING_COMPLETION_BEAT, "unknown"] });
assert.deepEqual(reloaded.completedStoryBeats, [domain.RECYCLING_COMPLETION_BEAT], "reload preserves only canonical completed story beats");
assert.equal(domain.recyclingCompletionPending(reloaded), false, "completion story does not replay after reload");

const dialogue = story.recyclingCompletionDialogue;
assert.equal(dialogue[0].text, "Linus! Kom och titta!");
assert.equal(dialogue.at(-1).text, "Men jag kanske råkar ringa honom.");
assert(dialogue.some(line => line.text === "Henning."), "locked scene must name Henning");
assert(!dialogue.some(line => /bager|bakery/i.test(line.text)), "completion scene must not reveal Bakery");
assert.equal(dialogue.find(line => line.text === "Nej.")?.pauseAfter, true, "locked emotional pause after Nej must remain authored");

assert.equal(constructionPresentation(domain.initialConstruction()).stages.bakery, undefined, "Bakery stage 0 is absent");
assert(!assets.getVisualProductionObstacles({}).some(() => true), "stage 0 has no building collision");

let bakery = domain.normalizeConstruction({
  earned: { recycling: 4, bakery: 0, clinic: 0 },
  revealed: { recycling: 4, bakery: 0, clinic: 0 },
  pending: [],
  completedStoryBeats: [domain.RECYCLING_COMPLETION_BEAT],
});
for (let stage = 1; stage <= 4; stage++) {
  bakery = domain.earnConstruction(bakery, `bakery:${stage}`);
  const attention = domain.residentAttention(bakery);
  assert.equal(attention?.resident, "henning", `Bakery stage ${stage} must be guided by Henning`);
  assert.equal(attention?.presentation, "construction");
  assert(attention.dialogue.some(line => line.speaker === "Barnet"), `Bakery stage ${stage} must involve the child in the story`);
  assert.equal(constructionPresentation(bakery).stages.bakery, stage === 1 ? undefined : stage - 1, "pending Bakery reveal must keep previous visible stage");
  bakery = domain.commitConstructionReveal(bakery, `bakery:${stage}`);
  assert.equal(bakery.revealed.bakery, stage);
}
assert.equal(domain.residentAttention(bakery), null);
assert.equal(constructionPresentation(bakery).stages.bakery, 4);
assert.equal(domain.bakeryCompletionPending(bakery), true, "Bakery stage 4 unlocks its completion Story Moment");
const bakeryCompleted = domain.commitBakeryCompletion(bakery);
assert.equal(domain.bakeryCompletionPending(bakeryCompleted), false);
assert(bakeryCompleted.completedStoryBeats.includes(domain.BAKERY_COMPLETION_BEAT));
assert.equal(domain.commitBakeryCompletion(bakeryCompleted), bakeryCompleted, "Bakery completion is idempotent");
const bakeryReloaded = domain.normalizeConstruction({ ...bakeryCompleted, completedStoryBeats: [...bakeryCompleted.completedStoryBeats, domain.BAKERY_COMPLETION_BEAT, "unknown"] });
assert.deepEqual(bakeryReloaded.completedStoryBeats, [domain.RECYCLING_COMPLETION_BEAT, domain.BAKERY_COMPLETION_BEAT], "reload preserves canonical completion beats exactly once");
assert.equal(domain.bakeryCompletionPending(bakeryReloaded), false, "Bakery completion cannot replay after reload");

assert.equal(bakeryStory.bakeryCompletionDialogue[0].text, "Nå? Vad tycker du?");
assert(bakeryStory.bakeryCompletionDialogue.some(line => line.speaker === "Barnet" && line.text === "Vi gjorde det!"));
assert(bakeryStory.bakeryCompletionDialogue.some(line => line.text.includes("tack vare dig")), "payoff must explicitly credit the child");
assert(bakeryStory.bakeryCompletionDialogue.some(line => line.speaker === "Linus"), "completion payoff keeps Linus/Henning chemistry");

for (let stage = 1; stage <= 4; stage++) {
  assert.equal(assets.getVisualProductionAsset("bakery", stage), `/assets/village/buildings/bakery/bakery-stage-${stage}.webp`);
}

assert.deepEqual(domain.BAKERY_CONTRIBUTION_THRESHOLDS, [1, 3, 7, 10], "Bakery cumulative contribution thresholds must remain 1-3-7-10");
assert.deepEqual([0,1,2,3,6,7,9,10,99].map(domain.deriveBakeryStageFromContributions), [0,1,1,2,2,3,3,4,4], "Bakery stage pacing must remain 1-2-4-3");
let pacedBakery = domain.normalizeConstruction({ earned: { recycling: 4, bakery: 0, clinic: 0 }, revealed: { recycling: 4, bakery: 0, clinic: 0 }, pending: [] });
pacedBakery = domain.syncBakeryContributionProgress(pacedBakery, 11, 10);
assert.deepEqual(pacedBakery.pending, ["bakery:1"], "first post-baseline claim earns Bakery stage 1");
assert.equal(domain.syncBakeryContributionProgress(pacedBakery, 13, 10), pacedBakery, "pending reveal blocks earning later Bakery stages");
pacedBakery = domain.commitConstructionReveal(pacedBakery, "bakery:1");
assert.equal(domain.syncBakeryContributionProgress(pacedBakery, 12, 10), pacedBakery, "two total claims do not reach stage 2");
pacedBakery = domain.syncBakeryContributionProgress(pacedBakery, 13, 10);
assert.deepEqual(pacedBakery.pending, ["bakery:2"], "third total claim earns Bakery stage 2");
let migratedBakery = domain.normalizeConstruction({ earned: { recycling: 4, bakery: 2, clinic: 0 }, revealed: { recycling: 4, bakery: 2, clinic: 0 }, pending: [] });
assert.equal(domain.syncBakeryContributionProgress(migratedBakery, 20, 20, 2), migratedBakery, "existing stage 2 save does not immediately advance at migration baseline");
assert.equal(domain.syncBakeryContributionProgress(migratedBakery, 23, 20, 2), migratedBakery, "three new claims after stage 2 are still below stage 3 threshold");
migratedBakery = domain.syncBakeryContributionProgress(migratedBakery, 24, 20, 2);
assert.deepEqual(migratedBakery.pending, ["bakery:3"], "four new claims after existing stage 2 earn stage 3");

let clinic = domain.normalizeConstruction({ earned: { recycling: 4, bakery: 4, clinic: 0 }, revealed: { recycling: 4, bakery: 4, clinic: 0 }, pending: [] });
clinic = domain.startClinicConstruction(clinic);
assert.equal(clinic.revealed.clinic, 1, "Sol's decision reveals Clinic stage 1 immediately");
assert.equal(clinic.earned.clinic, 1);
assert.deepEqual(domain.CLINIC_CONTRIBUTION_THRESHOLDS, [0, 2, 4, 8], "Clinic pacing must remain 0-2-4-8 from its authoritative baseline");
assert.equal(domain.syncClinicContributionProgress(clinic, 41, 40), clinic, "one post-baseline claim does not advance Clinic");
clinic = domain.syncClinicContributionProgress(clinic, 42, 40);
assert.deepEqual(clinic.pending, ["clinic:2"], "two post-baseline claims earn Clinic stage 2");
assert.equal(domain.residentAttention(clinic)?.resident, "sol");
clinic = domain.commitConstructionReveal(clinic, "clinic:2");
clinic = domain.syncClinicContributionProgress(clinic, 44, 40);
assert.deepEqual(clinic.pending, ["clinic:3"], "four post-baseline claims earn Clinic stage 3");
clinic = domain.commitConstructionReveal(clinic, "clinic:3");
clinic = domain.syncClinicContributionProgress(clinic, 48, 40);
assert.deepEqual(clinic.pending, ["clinic:4"], "eight post-baseline claims earn Clinic stage 4");
clinic = domain.commitConstructionReveal(clinic, "clinic:4");
assert.equal(clinic.revealed.clinic, 4);
assert.equal(domain.syncClinicContributionProgress(clinic, 99, 40), clinic, "completed Clinic remains capped and idempotent");
const clinicPendingReload = domain.normalizeConstruction({
  ...domain.syncClinicContributionProgress(
    domain.commitConstructionReveal(
      domain.syncClinicContributionProgress(domain.startClinicConstruction(domain.normalizeConstruction({
        earned: { recycling: 4, bakery: 4, clinic: 0 },
        revealed: { recycling: 4, bakery: 4, clinic: 0 },
        pending: [],
      })), 42, 40),
      "clinic:2",
    ),
    44,
    40,
  ),
  pending: [],
});
assert.deepEqual(clinicPendingReload.pending, ["clinic:3"], "reload reconstructs a missing earned Clinic reveal so progress cannot dead-end");
assert.equal(domain.residentAttention(clinicPendingReload)?.resident, "sol", "recovered Clinic reveal remains routed to Sol");
for (let stage = 1; stage <= 4; stage++) {
  assert.equal(assets.getVisualProductionAsset("clinic", stage), `/assets/village/reboot/clinic-stage-${stage}.webp`);
}

console.log("PASS: Recycling, Bakery and Clinic progression is gated, child-driven and idempotent; canonical story beats survive reload without replay.");
