import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

import { ACT2_OPENING_BEATS } from "../src/game/act2OpeningStory.ts";
import { ACT2_ALVE_DIALOGUE } from "../src/game/act2AlveStory.ts";
import { ACT2_FINALE_BEATS } from "../src/game/act2FinaleStory.ts";
function loadTsModule(file, dependencies) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const requireDependency = (name) => {
    assert.ok(name in dependencies, `Unexpected Act 2 full-flow dependency: ${name}`);
    return dependencies[name];
  };
  new Function("exports", "require", code)(exports, requireDependency);
  return exports;
}

const saveMigrations = loadTsModule("../src/runtime/save/migrations.ts", {});
const progressionDelta = loadTsModule("../src/runtime/progression/authoritativeDelta.ts", {});
const progressGate = loadTsModule("../src/runtime/progression/progressGate.ts", {});
const progressTrack = loadTsModule("../src/runtime/progression/progressTrack.ts", {});
const {
  act2FinalePending,
  advanceAct2Finale,
  boathousePurchaseRequired,
  consumeProjectCompletionReaction,
  createDefaultAct2RuntimeState,
  isMotorboatUnlocked,
  jettyPurchaseRequired,
  motorboatNamingRequired,
  motorboatPartsPurchaseRequired,
  nextAct2Contribution,
  normalizeAct2RuntimeState,
  prerequisiteCompletionCount,
  prepareAct2ProductionEntry,
  projectCompletionReactionPending,
  totalAct2Contributions,
  withBackendClaimBaseline,
  withBackendStoryFlags,
  withMotorboatName,
  withPresentedContribution,
  withSelectedProject,
} = loadTsModule("../src/game/act2RuntimeState.ts", {
  "@capacitor/preferences": { Preferences: {} },
  "../runtime/save/migrations": saveMigrations,
  "../runtime/progression/authoritativeDelta": progressionDelta,
  "../runtime/progression/progressGate": progressGate,
  "../runtime/progression/progressTrack": progressTrack,
});

const restart = (state) => normalizeAct2RuntimeState(JSON.parse(JSON.stringify(state)));

let state = prepareAct2ProductionEntry(createDefaultAct2RuntimeState());
assert.equal(state.entered, true);
assert.equal(state.productionEntryCommitted, true);
state = withBackendClaimBaseline(state, 100);
assert.equal(state.backendClaimBaseline, 100, "Act 2 entry must freeze the current backend progression baseline");

let recoveredEntry = prepareAct2ProductionEntry(createDefaultAct2RuntimeState());
assert.equal(recoveredEntry.backendClaimBaseline, null);
recoveredEntry = withBackendClaimBaseline(recoveredEntry, 140);
assert.equal(recoveredEntry.backendClaimBaseline, 140, "a later successful backend sync must establish a missing entry baseline");
assert.equal(nextAct2Contribution(withSelectedProject(recoveredEntry, "cabin"), 140), null, "recovery baseline must not create latent backlog");
assert.equal(nextAct2Contribution(withSelectedProject(recoveredEntry, "cabin"), 141)?.beatId, "cabin:01", "first quest after recovered baseline must advance normally");

// Opening: every authored line is reachable, then bicycle, then every Alve intro line.
for (let beatIndex = 0; beatIndex < ACT2_OPENING_BEATS.length; beatIndex += 1) {
  const beat = ACT2_OPENING_BEATS[beatIndex];
  for (let lineIndex = 0; lineIndex < beat.body.length; lineIndex += 1) {
    assert.ok(beat.body[lineIndex]?.trim(), `opening ${beatIndex + 1} line ${lineIndex + 1} must exist`);
    state = { ...state, openingIndex: beatIndex, openingLineIndex: lineIndex };
  }
  state = restart(state);
}
state = { ...state, openingIndex: ACT2_OPENING_BEATS.length - 1, openingLineIndex: 0, openingComplete: true };
state = restart(state);
assert.equal(state.openingComplete, true);
state = { ...state, bicycleSeen: true };
for (let index = 0; index < ACT2_ALVE_DIALOGUE.length; index += 1) {
  assert.ok(ACT2_ALVE_DIALOGUE[index]?.text.trim(), `Alve intro line ${index + 1} must exist`);
  state = { ...state, alveIntroIndex: index };
}
state = restart({ ...state, alveIntroComplete: true });
assert.equal(state.alveIntroComplete, true);

let worldProgression = 100;

function resolveGate(project, current) {
  if (project === "dock" && jettyPurchaseRequired(current)) {
    const before = totalAct2Contributions(current);
    current = restart(current);
    assert.equal(jettyPurchaseRequired(current), true, "Bryggan purchase gate must survive village round-trip/restart");
    current = withBackendStoryFlags(current, { act2JettyLifebuoyOwned: true });
    assert.equal(totalAct2Contributions(current), before, "livboj purchase must not consume a contribution");
  }
  if (project === "boathouse" && boathousePurchaseRequired(current)) {
    const before = totalAct2Contributions(current);
    current = restart(current);
    assert.equal(boathousePurchaseRequired(current), true, "Båthuset purchase gate must survive village round-trip/restart");
    current = withBackendStoryFlags(current, { act2BoathouseSteeringWheelOwned: true });
    assert.equal(totalAct2Contributions(current), before, "steering-wheel purchase must not consume a contribution");
  }
  if (project === "motorboat" && motorboatPartsPurchaseRequired(current)) {
    const before = totalAct2Contributions(current);
    current = restart(current);
    assert.equal(motorboatPartsPurchaseRequired(current), true, "Motorbåten parts gate must survive village round-trip/restart");
    current = withBackendStoryFlags(current, { act2MotorboatPartsOwned: true });
    assert.equal(totalAct2Contributions(current), before, "parts purchase must not consume a contribution");
  }
  if (project === "motorboat" && motorboatNamingRequired(current)) {
    const before = totalAct2Contributions(current);
    current = restart(current);
    assert.equal(motorboatNamingRequired(current), true, "Motorbåt naming gate must survive restart");
    current = withMotorboatName(current, "Sjöbusen");
    assert.equal(current.motorboatName, "Sjöbusen");
    assert.equal(totalAct2Contributions(current), before, "boat naming must not consume a contribution");
  }
  return current;
}

function runProject(current, project) {
  current = withSelectedProject(current, project);
  assert.equal(current.selectedProject, project, `${project} must become the active project`);

  for (let number = 1; number <= 16; number += 1) {
    worldProgression += 1;
    current = resolveGate(project, current);
    const candidate = nextAct2Contribution(current, worldProgression);
    assert.ok(candidate, `${project} ${number}/16 must become available after one real quest contribution`);
    assert.equal(candidate.number, number, `${project} must not skip contribution ${number}`);
    assert.equal(candidate.beatId, `${project}:${String(number).padStart(2, "0")}`);
    current = withPresentedContribution(current, project, candidate.beatId, candidate.visibleStage);
    assert.equal(current.projects[project].contributions, number);
    if (number % 4 === 0 && number < 16) current = restart(current);
  }

  assert.equal(current.projects[project].complete, true);
  assert.equal(current.selectedProject, null);
  if (projectCompletionReactionPending(current, project)) {
    const before = totalAct2Contributions(current);
    current = consumeProjectCompletionReaction(restart(current), project);
    assert.equal(totalAct2Contributions(current), before, "completion reaction must remain contribution-neutral");
  }
  return restart(current);
}

// One complete player journey. The other five prerequisite orders remain covered by test-act2-runtime-state.
state = runProject(state, "cabin");
assert.equal(prerequisiteCompletionCount(state), 1);
state = runProject(state, "dock");
assert.equal(prerequisiteCompletionCount(state), 2);
assert.equal(isMotorboatUnlocked(state), false);
state = runProject(state, "boathouse");
assert.equal(prerequisiteCompletionCount(state), 3);
assert.equal(isMotorboatUnlocked(state), true);
state = runProject(state, "motorboat");

assert.equal(totalAct2Contributions(state), 64);
assert.equal(act2FinalePending(state), true, "Motorbåten 16/16 must immediately unlock the family finale");

assert.deepEqual(ACT2_FINALE_BEATS.map((beat) => beat.id), [
  "finale:after-motorboat", "finale:someone-there", "finale:family-return",
  "finale:family-embrace", "finale:veranda", "finale:across-the-lake",
]);
for (let beatIndex = 0; beatIndex < ACT2_FINALE_BEATS.length; beatIndex += 1) {
  const beat = ACT2_FINALE_BEATS[beatIndex];
  assert.equal(state.finaleIndex, beatIndex, "natural transitions must not skip any beat");
  assert.equal(state.act2Complete, false);
  assert.equal(state.epilogueConsumed, false);
  for (let lineIndex = 0; lineIndex < beat.body.length; lineIndex += 1) {
    state = restart({ ...state, finaleLineIndex: lineIndex });
    assert.equal(state.finaleIndex, beatIndex);
    assert.equal(state.finaleLineIndex, lineIndex, "every finale line must survive restart");
    if (lineIndex > 0) {
      state = restart({ ...state, finaleLineIndex: state.finaleLineIndex - 1 });
      state = restart({ ...state, finaleLineIndex: state.finaleLineIndex + 1 });
      assert.equal(state.finaleLineIndex, lineIndex, "previous/forward is contribution-neutral");
    }
  }
  state = advanceAct2Finale(state);
  state = restart(state);
  if (beat.id === "finale:veranda") {
    assert.equal(state.familyFinaleConsumed, true);
    assert.equal(state.epilogueConsumed, false);
    assert.equal(state.act2Complete, false, "veranda must not skip the epilogue");
    assert.equal(state.finaleIndex, 5);
  }
}
assert.equal(state.act2Complete, true);
assert.equal(state.familyFinaleConsumed, true);
assert.equal(state.epilogueConsumed, true);
assert.equal(state.endCardSeen, false, "chapter-end card must still be pending immediately after the epilogue");
assert.equal(act2FinalePending(state), false);
assert.equal(totalAct2Contributions(state), 64, "finale must never fabricate contribution 65");

state = restart(state);
assert.equal(state.act2Complete, true, "Act 2 completion must survive restart");
assert.equal(state.endCardSeen, false, "unseen chapter-end card must survive restart");
state = restart({ ...state, endCardSeen: true });
assert.equal(state.endCardSeen, true, "dismissed chapter-end card must not replay after restart");

const village = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
const runtime = fs.readFileSync(new URL("../src/components/Act2Runtime.tsx", import.meta.url), "utf8");
const prodRoute = fs.readFileSync(new URL("../src/app/act2/page.tsx", import.meta.url), "utf8");
const debugRoute = fs.readFileSync(new URL("../src/app/act2-test/page.tsx", import.meta.url), "utf8");

assert.match(village, /const act1NextChapter = nextChapterDestination\("act1"[\s\S]*act1NextChapter && <button[^>]*[\s\S]*Stigen till sjön/, "the lake path must render only after the shared next-chapter transition is available");
assert.match(village, /router\.push\(act1NextChapter\.route\)/, "Act 1 lake path must enter the registered next chapter through the shared transition");
assert.match(
  village,
  /const purchaseOwned =[\s\S]*act2JettyLifebuoyOwned[\s\S]*act2BoathouseSteeringWheelOwned[\s\S]*act2MotorboatPartsOwned[\s\S]*resolveStoryPurchaseExit\(project, purchaseOwned\)[\s\S]*exit\.action === "resume"[\s\S]*router\.push\(act2ResumeHref\(exit\.target\)\)/,
  "closing Mira's Act 2 shop must delegate resume-vs-stay behavior to the shared purchase flow",
);
assert.match(runtime, /if \(!act1ChapterComplete\)/, "Act 2 must independently require the acknowledged Act 1 chapter ending");
assert.match(runtime, /prepareAct2ProductionEntry\(act2\)/, "production entry must reconcile pre-release locked-route residue before setting the baseline");
assert.match(runtime, /withBackendClaimBaseline\(current, backend\.progression\.worldProgression\)/, "backend polling must recover a missing baseline after transient entry sync failure");
assert.ok(
  runtime.indexOf("if (!debug && !productionEnabled)") < runtime.indexOf("loadAct2RuntimeState(),"),
  "shipping lock must short-circuit before Act 2 state/baseline can be loaded and mutated",
);
assert.ok(runtime.includes("act2PurchaseShopHref(") && runtime.includes("Till Mira i byn"), "story purchase gates must provide a contextual return path to Mira through the canonical handoff");
assert.match(runtime, /SLUT PÅ ANDRA KAPITLET/, "Act 2 must render the canonical black chapter-end card");
assert.match(runtime, /endCardSeen: true/, "chapter-end card must be dismissible without replay");
assert.match(debugRoute, /<Act2Runtime debug \/>/, "debug flow must use the production runtime");
assert.match(prodRoute, /ACT2_PRODUCTION_ENABLED = true/, "production Act 2 must remain open behind the persisted Act 1 end-card or committed-reentry gate");

console.log("PASS: complete Act 1→Act 2→64 contributions→family/veranda→epilogue→chapter-end flow");
console.log("NOTE: production /act2 is open behind the Act 1 end-card gate; /act2-test exercises the same runtime.");
