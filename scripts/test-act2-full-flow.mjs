import assert from "node:assert/strict";
import fs from "node:fs";

import { ACT2_OPENING_BEATS } from "../src/game/act2OpeningStory.ts";
import { ACT2_ALVE_DIALOGUE } from "../src/game/act2AlveStory.ts";
import { ACT2_FINALE_BEATS } from "../src/game/act2FinaleStory.ts";
import {
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
  projectCompletionReactionPending,
  totalAct2Contributions,
  withBackendClaimBaseline,
  withBackendStoryFlags,
  withMotorboatName,
  withPresentedContribution,
  withSelectedProject,
} from "../src/game/act2RuntimeState.ts";

const restart = (state) => normalizeAct2RuntimeState(JSON.parse(JSON.stringify(state)));

let state = {
  ...createDefaultAct2RuntimeState(),
  entered: true,
};
state = withBackendClaimBaseline(state, 100);
assert.equal(state.backendClaimBaseline, 100, "Act 2 entry must freeze the current backend progression baseline");

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

for (let beatIndex = 0; beatIndex < ACT2_FINALE_BEATS.length; beatIndex += 1) {
  const beat = ACT2_FINALE_BEATS[beatIndex];
  assert.ok(beat.body.length > 0, `finale beat ${beatIndex + 1} must contain story`);
  state = restart({ ...state, finaleIndex: beatIndex, finaleLineIndex: Math.max(0, beat.body.length - 1) });
  state = advanceAct2Finale(state);
}
assert.equal(state.act2Complete, true);
assert.equal(state.familyFinaleConsumed, true);
assert.equal(state.epilogueConsumed, true);
assert.equal(state.endCardSeen, false, "chapter-end card must still be pending immediately after the veranda");
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

assert.match(village, /clinicCompletionSeen \|\| construction\.revealed\.clinic >= 4/, "Act 1 must expose the lake path only after Clinic completion");
assert.match(village, /router\.push\("\/act2"\)/, "Act 1 lake path must enter the production Act 2 route");
assert.match(runtime, /clinicCompletionSeen === true[\s\S]*construction\.revealed\.clinic[\s\S]*>= 4/, "Act 2 must independently recheck Clinic completion");
assert.match(runtime, /href="\/"[\s\S]*Till Mira i byn/, "story purchase gates must provide a real return path to Mira");
assert.match(runtime, /SLUT PÅ ANDRA KAPITLET/, "Act 2 must render the canonical black chapter-end card");
assert.match(runtime, /endCardSeen: true/, "chapter-end card must be dismissible without replay");
assert.match(debugRoute, /<Act2Runtime debug \/>/, "debug flow must use the production runtime");
assert.match(prodRoute, /ACT2_PRODUCTION_ENABLED = false/, "shipping lock must remain explicit until physical acceptance");

console.log("PASS: complete Act 1→Act 2→64 contributions→family/veranda→chapter-end flow");
console.log("NOTE: production /act2 remains intentionally shipping-locked; /act2-test exercises the same runtime.");
