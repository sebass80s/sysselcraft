import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import {
  ACT2_ALVE_WORK_POSITIONS,
  ACT2_VISUAL_PLACEMENTS,
} from "../src/game/act2VisualAssets.ts";
import { CABIN_CONTRIBUTION_BEATS, CABIN_WAITING_REACTION } from "../src/game/act2CabinStory.ts";
import { JETTY_LIFEBUOY_BEAT } from "../src/game/act2JettyStory.ts";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../src/game/act2BoathouseStory.ts";
import { MOTORBOAT_CONTRIBUTION_BEATS, MOTORBOAT_PARTS_PRICE } from "../src/game/act2MotorboatStory.ts";
import { ACT2_FINALE_BEATS } from "../src/game/act2FinaleStory.ts";
import { parseStoryLine } from "../src/game/storyEngine.ts";
function loadTsModule(file, dependencies) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const requireDependency = (name) => {
    assert.ok(name in dependencies, `Unexpected Act 2 runtime dependency: ${name}`);
    return dependencies[name];
  };
  new Function("exports", "require", code)(exports, requireDependency);
  return exports;
}

const saveMigrations = loadTsModule("../src/runtime/save/migrations.ts", {});
const progressionDelta = loadTsModule("../src/runtime/progression/authoritativeDelta.ts", {});
const progressGate = loadTsModule("../src/runtime/progression/progressGate.ts", {});
const progressTrack = loadTsModule("../src/runtime/progression/progressTrack.ts", {});
const authoritativeTrack = loadTsModule("../src/runtime/progression/authoritativeTrack.ts", {
  "./authoritativeDelta": progressionDelta,
  "./progressTrack": progressTrack,
});
const act2RuntimeModule = loadTsModule("../src/game/act2RuntimeState.ts", {
  "@capacitor/preferences": { Preferences: {} },
  "../runtime/save/migrations": saveMigrations,
  "../runtime/progression/authoritativeDelta": progressionDelta,
  "../runtime/progression/progressGate": progressGate,
  "../runtime/progression/progressTrack": progressTrack,
  "../runtime/progression/authoritativeTrack": authoritativeTrack,
});
const {
  act2FinalePending,
  advanceAct2Finale,
  canSelectProject,
  consumeProjectCompletionReaction,
  createDefaultAct2RuntimeState,
  isMotorboatUnlocked,
  boathousePurchaseRequired,
  jettyPurchaseRequired,
  motorboatNamingRequired,
  motorboatPartsPurchaseRequired,
  normalizeAct2RuntimeState,
  prerequisiteCompletionCount,
  prepareAct2ProductionEntry,
  pendingBackendContributionCount,
  projectCompletionReactionPending,
  nextAct2Contribution,
  totalAct2Contributions,
  withBackendClaimBaseline,
  withBackendStoryFlags,
  withMotorboatName,
  withPresentedContribution,
  withSelectedProject,
} = act2RuntimeModule;

const empty = createDefaultAct2RuntimeState();
assert.equal(empty.openingIndex, 0);
assert.equal(empty.openingLineIndex, 0);
assert.equal(empty.openingComplete, false);
assert.equal(empty.selectedProject, null);
assert.equal(prerequisiteCompletionCount(empty), 0);
assert.equal(isMotorboatUnlocked(empty), false);
assert.equal(empty.contributionLineIndex, 0);
assert.equal(empty.completionLineIndex, 0);
assert.equal(empty.finaleLineIndex, 0);
assert.equal(canSelectProject(empty, "motorboat"), false);

const act2RuntimeSource = fs.readFileSync(new URL("../src/game/act2RuntimeState.ts", import.meta.url), "utf8");
assert.match(act2RuntimeSource, /getAct2PairedChildId\(\)/, "Act 2 runtime persistence must resolve the paired child before loading or saving");
assert.match(act2RuntimeSource, /childRuntimeKey\(childId\)/, "Act 2 runtime persistence must use a child-scoped key when paired");
assert.match(act2RuntimeSource, /Preferences\.remove\(\{ key: LEGACY_KEY \}\)/, "legacy shared Act 2 state must be removed after one-time child migration");
const childBindingSource = fs.readFileSync(new URL("../src/backend/childDeviceBinding.ts", import.meta.url), "utf8");
assert.match(act2RuntimeSource, /CHILD_ID_KEY = "sysselcraft\.backend\.childId"/, "Act 2 must read the canonical paired-child preference key");
assert.match(childBindingSource, /CHILD_ID_KEY = "sysselcraft\.backend\.childId"/, "pairing and Act 2 must stay on the same paired-child preference key");

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
assert.deepEqual(restored.projects.cabin.consumedBeatIds, ["cabin:01", "cabin:02", "cabin:03", "cabin:04"], "old/noncanonical beat IDs must normalize to canonical contribution history");

assert.equal(normalizeAct2RuntimeState({ version: 1, openingIndex: 99 }).openingIndex, 4);
assert.equal(normalizeAct2RuntimeState({ version: 1, openingIndex: -4 }).openingIndex, 0);
assert.equal(normalizeAct2RuntimeState({ version: 1, openingLineIndex: 7 }).openingLineIndex, 7);

const pendingMiraStory = normalizeAct2RuntimeState({
  version: 1,
  jettyLifebuoyOwned: true,
  pendingPurchaseStory: "dock",
  purchaseStoryLineIndex: 5,
});
assert.equal(pendingMiraStory.pendingPurchaseStory, "dock");
assert.equal(pendingMiraStory.purchaseStoryLineIndex, 5, "Mira purchase story must resume on the exact persisted line");
const impossibleMiraStory = normalizeAct2RuntimeState({
  version: 1,
  pendingPurchaseStory: "dock",
  purchaseStoryLineIndex: 5,
});
assert.equal(impossibleMiraStory.pendingPurchaseStory, null, "purchase story cannot exist before the authoritative item is owned");
assert.equal(impossibleMiraStory.purchaseStoryLineIndex, 0);

const preReleaseLockedVisit = normalizeAct2RuntimeState({
  version: 1,
  entered: true,
  backendClaimBaseline: 42,
  selectedProject: "dock",
  projects: {
    dock: { contributions: 7 },
  },
});
const cleanProductionEntry = prepareAct2ProductionEntry(preReleaseLockedVisit);
assert.equal(cleanProductionEntry.entered, true);
assert.equal(cleanProductionEntry.productionEntryCommitted, true);
assert.equal(cleanProductionEntry.backendClaimBaseline, null, "pre-release locked-route baseline must never leak into the real Act 2 journey");
assert.equal(cleanProductionEntry.projects.dock.contributions, 0, "pre-release local Act 2 progress must not survive into first real production entry");

const acceptedProductionEntry = prepareAct2ProductionEntry({
  ...cleanProductionEntry,
  backendClaimBaseline: 100,
  selectedProject: "cabin",
  projects: {
    ...cleanProductionEntry.projects,
    cabin: { contributions: 2, visibleStage: 1, consumedBeatIds: ["cabin:01", "cabin:02"], complete: false },
  },
});
assert.equal(acceptedProductionEntry.backendClaimBaseline, 100, "real production baseline must stay establish-once");
assert.equal(acceptedProductionEntry.projects.cabin.contributions, 2, "real production progress must survive subsequent entries");

let state = withSelectedProject(empty, "dock");
assert.equal(state.selectedProject, "dock");

const wrongProject = withPresentedContribution(state, "cabin", "cabin:01");
assert.equal(wrongProject.projects.cabin.contributions, 0, "inactive project must never consume a contribution");

state = withPresentedContribution(state, "dock", "dock:01");
assert.equal(state.projects.dock.contributions, 1);
assert.equal(state.projects.dock.visibleStage, 1);
assert.deepEqual(state.projects.dock.consumedBeatIds, ["dock:01"]);

const duplicate = withPresentedContribution(state, "dock", "dock:01");
assert.equal(duplicate.projects.dock.contributions, 1, "duplicate beat must not consume a second contribution");
assert.equal(duplicate.projects.dock.visibleStage, 1, "duplicate beat must not mutate stage");
const duplicateFromSameSnapshotA = withPresentedContribution(state, "dock", "dock:02");
const duplicateFromSameSnapshotB = withPresentedContribution(state, "dock", "dock:02");
assert.deepEqual(duplicateFromSameSnapshotA, duplicateFromSameSnapshotB, "two rapid taps from the same snapshot must resolve to the same idempotent next state");

const midContributionStory = normalizeAct2RuntimeState({ ...state, contributionLineIndex: 7 });
assert.equal(midContributionStory.contributionLineIndex, 7, "restart must preserve the exact line inside a pending contribution Story Moment");
const committedAfterResume = withPresentedContribution(midContributionStory, "dock", "dock:02");
assert.equal(committedAfterResume.contributionLineIndex, 0, "finishing the resumed contribution beat must reset its persisted line index");

let lockedBoat = withPresentedContribution(empty, "motorboat", "motorboat:01");
assert.equal(lockedBoat.projects.motorboat.contributions, 0, "motorboat cannot advance before 3/3");

function complete(projectState, project) {
  let current = withSelectedProject(projectState, project);
  for (let i = 1; i <= 16; i++) {
    if (project === "dock" && jettyPurchaseRequired(current)) {
      current = withBackendStoryFlags(current, { act2JettyLifebuoyOwned: true });
    }
    if (project === "boathouse" && boathousePurchaseRequired(current)) {
      current = withBackendStoryFlags(current, { act2BoathouseSteeringWheelOwned: true });
    }
    if (project === "motorboat" && motorboatPartsPurchaseRequired(current)) {
      current = withBackendStoryFlags(current, { act2MotorboatPartsOwned: true });
    }
    if (project === "motorboat" && motorboatNamingRequired(current)) {
      current = withMotorboatName(current, "Testbåten");
    }
    current = withPresentedContribution(current, project, `${project}:${String(i).padStart(2, "0")}`);
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


let jettyComplete = createDefaultAct2RuntimeState();
jettyComplete = complete(jettyComplete, "dock");
assert.equal(jettyComplete.projects.dock.contributions, 16);
assert.equal(projectCompletionReactionPending(jettyComplete, "dock"), true, "16/16 must unlock a separate completion reaction");
const midCompletionReaction = normalizeAct2RuntimeState({ ...jettyComplete, completionLineIndex: 3 });
assert.equal(midCompletionReaction.completionLineIndex, 3, "restart must preserve the exact completion-reaction line");
const consumedMidCompletion = consumeProjectCompletionReaction(midCompletionReaction, "dock");
assert.equal(consumedMidCompletion.completionLineIndex, 0, "consuming the completion reaction must reset its line index");
assert.equal(projectCompletionReactionPending(jettyComplete, "boathouse"), false, "projects without authored completion reactions must not leave pending ghosts");
let cabinComplete = createDefaultAct2RuntimeState();
cabinComplete = complete(cabinComplete, "cabin");
assert.equal(projectCompletionReactionPending(cabinComplete, "cabin"), false, "Cabin 16/16 must not auto-open the revisit scene");
assert.equal(totalAct2Contributions(jettyComplete), 16, "completion reaction must not fabricate contribution 17");
const beforeReactionCount = totalAct2Contributions(jettyComplete);
jettyComplete = consumeProjectCompletionReaction(jettyComplete, "dock");
assert.equal(projectCompletionReactionPending(jettyComplete, "dock"), false);
assert.equal(totalAct2Contributions(jettyComplete), beforeReactionCount, "consuming completion reaction must be contribution-neutral");
const repeatedReaction = consumeProjectCompletionReaction(jettyComplete, "dock");
assert.deepEqual(repeatedReaction.consumedProjectCompletionIds, jettyComplete.consumedProjectCompletionIds, "completion reaction consumption must be idempotent");


const prerequisiteOrders = [
  ["cabin", "dock", "boathouse"],
  ["cabin", "boathouse", "dock"],
  ["dock", "cabin", "boathouse"],
  ["dock", "boathouse", "cabin"],
  ["boathouse", "cabin", "dock"],
  ["boathouse", "dock", "cabin"],
];
for (const order of prerequisiteOrders) {
  let ordered = createDefaultAct2RuntimeState();
  assert.equal(isMotorboatUnlocked(ordered), false);
  ordered = complete(ordered, order[0]);
  assert.equal(isMotorboatUnlocked(ordered), false, `motorboat unlocked after only 1/3 in ${order.join("→")}`);
  ordered = complete(ordered, order[1]);
  assert.equal(isMotorboatUnlocked(ordered), false, `motorboat unlocked after only 2/3 in ${order.join("→")}`);
  ordered = complete(ordered, order[2]);
  assert.equal(isMotorboatUnlocked(ordered), true, `motorboat did not unlock at 3/3 in ${order.join("→")}`);
}

for (const order of prerequisiteOrders) {
  let fullRun = createDefaultAct2RuntimeState();

  for (const project of order) {
    fullRun = complete(fullRun, project);
    if (projectCompletionReactionPending(fullRun, project)) {
      fullRun = consumeProjectCompletionReaction(fullRun, project);
    }
  }

  assert.equal(prerequisiteCompletionCount(fullRun), 3, `full run must reach 3/3 prerequisites in ${order.join("→")}`);
  assert.equal(isMotorboatUnlocked(fullRun), true, `full run must unlock Motorbåten in ${order.join("→")}`);
  assert.equal(totalAct2Contributions(fullRun), 48, `prerequisite projects must total exactly 48 contributions in ${order.join("→")}`);

  fullRun = complete(fullRun, "motorboat");
  assert.equal(fullRun.projects.motorboat.complete, true, `Motorbåten must complete in ${order.join("→")}`);
  assert.equal(totalAct2Contributions(fullRun), 64, `Act 2 must contain exactly 64 authoritative contributions in ${order.join("→")}`);
  assert.equal(fullRun.selectedProject, null, `completed Act 2 projects must leave no active project in ${order.join("→")}`);
  assert.equal(act2FinalePending(fullRun), true, `Motorbåten 16/16 must unlock the separate finale in ${order.join("→")}`);

  const beforeFinaleContributions = totalAct2Contributions(fullRun);
  while (act2FinalePending(fullRun)) {
    fullRun = advanceAct2Finale(fullRun);
  }

  assert.equal(totalAct2Contributions(fullRun), beforeFinaleContributions, `finale must never fabricate contribution 65 in ${order.join("→")}`);
  assert.equal(fullRun.familyFinaleConsumed, true, `family finale must complete exactly once in ${order.join("→")}`);
  assert.equal(fullRun.epilogueConsumed, true, `epilogue must complete exactly once in ${order.join("→")}`);
  assert.equal(fullRun.act2Complete, true, `full Act 2 must reach act2Complete in ${order.join("→")}`);

  const normalizedComplete = normalizeAct2RuntimeState(JSON.parse(JSON.stringify(fullRun)));
  assert.equal(normalizedComplete.act2Complete, true, `completed Act 2 must survive restart in ${order.join("→")}`);
  assert.equal(totalAct2Contributions(normalizedComplete), 64, `completed Act 2 restart must preserve all 64 contributions in ${order.join("→")}`);
}

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
assert.equal(illegalBoatSnapshot.motorboatName, null, "illegal locked-motorboat state must discard a stale boat name");
assert.equal(illegalBoatSnapshot.motorboatPartsOwned, false, "illegal locked-motorboat state must discard stale local parts ownership");

const corruptedProject = normalizeAct2RuntimeState({
  version: 1,
  selectedProject: "dock",
  projects: {
    dock: {
      contributions: 5,
      visibleStage: 4,
      consumedBeatIds: ["garbage", "dock:99", "dock:01", "dock:01"],
      complete: true,
    },
  },
});
assert.equal(corruptedProject.projects.dock.contributions, 5);
assert.equal(corruptedProject.projects.dock.visibleStage, 2, "visual stage must self-heal from contribution count");
assert.deepEqual(
  corruptedProject.projects.dock.consumedBeatIds,
  ["dock:01", "dock:02", "dock:03", "dock:04", "dock:05"],
  "consumed beat IDs must self-heal to the canonical sequence implied by contribution count",
);
assert.equal(corruptedProject.projects.dock.complete, false, "complete must derive from 16 contributions, never a stale boolean");

const corruptedCompletionIds = normalizeAct2RuntimeState({
  version: 1,
  consumedProjectCompletionIds: [
    "garbage",
    "boathouse:completion-reaction",
    "cabin:completion-reaction",
    "dock:completion-reaction",
    "dock:completion-reaction",
  ],
  projects: {
    cabin: { contributions: 16 },
    dock: { contributions: 3 },
  },
});
assert.deepEqual(
  corruptedCompletionIds.consumedProjectCompletionIds,
  [],
  "only authored automatic completion-reaction IDs may survive normalization",
);

const impossibleFinaleIndex = normalizeAct2RuntimeState({
  version: 1,
  finaleIndex: 5,
  finaleLineIndex: 12,
  familyFinaleConsumed: false,
});
assert.equal(impossibleFinaleIndex.finaleIndex, 0, "finale progress must reset when Motorbåten is not complete");
assert.equal(impossibleFinaleIndex.finaleLineIndex, 0);
assert.equal(impossibleFinaleIndex.familyFinaleConsumed, false);

const stalePresentationLines = normalizeAct2RuntimeState({
  version: 1,
  contributionLineIndex: 50,
  completionLineIndex: 50,
  finaleLineIndex: 50,
});
assert.equal(stalePresentationLines.contributionLineIndex, 0, "orphan contribution line state must clear without an active project");
assert.equal(stalePresentationLines.completionLineIndex, 0, "orphan completion line state must clear without a pending reaction");
assert.equal(stalePresentationLines.finaleLineIndex, 0, "orphan finale line state must clear without a completed motorboat");



let bridge = withBackendClaimBaseline(createDefaultAct2RuntimeState(), 12);
bridge = withSelectedProject(bridge, "dock");
assert.equal(bridge.backendClaimBaseline, 12);
assert.equal(pendingBackendContributionCount(bridge, 12), 0);
assert.equal(nextAct2Contribution(bridge, 12), null);

let candidate = nextAct2Contribution(bridge, 15);
assert.equal(candidate?.beatId, "dock:01");
assert.equal(candidate?.visibleStage, 1);
assert.equal(candidate?.backlog, 3);

bridge = withPresentedContribution(bridge, "dock", candidate.beatId);
assert.equal(totalAct2Contributions(bridge), 1);
candidate = nextAct2Contribution(bridge, 15);
assert.equal(candidate?.beatId, "dock:02", "backlog must drain one authored beat at a time");
assert.equal(candidate?.backlog, 2);

const repeatedRefresh = nextAct2Contribution(bridge, 15);
assert.deepEqual(repeatedRefresh, candidate, "refresh/retry must not consume or skip a beat by itself");

const attemptedSwitch = withSelectedProject(bridge, "cabin");
assert.equal(attemptedSwitch.selectedProject, "dock", "confirmed active project must stay locked until completion");
candidate = nextAct2Contribution(attemptedSwitch, 15);
assert.equal(candidate?.beatId, "dock:02", "unconsumed authoritative backlog must stay with the confirmed active project");

const baselineCannotMove = withBackendClaimBaseline(bridge, 999);
assert.equal(baselineCannotMove.backendClaimBaseline, 12, "Act 2 claim baseline is establish-once");

const villageRoundTrip = normalizeAct2RuntimeState(JSON.parse(JSON.stringify({
  ...bridge,
  contributionLineIndex: 2,
})));
assert.equal(villageRoundTrip.selectedProject, "dock", "leaving for the village and returning must preserve the active project");
assert.equal(villageRoundTrip.projects.dock.contributions, bridge.projects.dock.contributions, "village round-trip must preserve project contributions");
assert.equal(villageRoundTrip.backendClaimBaseline, 12, "village round-trip must not move the Act 2 backend baseline");
assert.equal(villageRoundTrip.contributionLineIndex, 2, "village round-trip must preserve the active Story Moment line");

const boundaryState = withBackendClaimBaseline(createDefaultAct2RuntimeState(), 0);
let boundary = withSelectedProject(boundaryState, "dock");
for (let i = 1; i <= 3; i++) {
  const next = nextAct2Contribution(boundary, i);
  assert.equal(next?.visibleStage, 1, `dock beat ${i} must remain visual stage 1`);
  boundary = withPresentedContribution(boundary, "dock", next.beatId);
}
let fourth = nextAct2Contribution(boundary, 4);
assert.equal(fourth?.visibleStage, 2, "dock beat 4 is the authored 1/4→2/4 transition");

let purchaseGate = withBackendClaimBaseline(createDefaultAct2RuntimeState(), 0);
purchaseGate = withSelectedProject(purchaseGate, "dock");
for (let i = 1; i <= 6; i++) {
  const next = nextAct2Contribution(purchaseGate, i);
  purchaseGate = withPresentedContribution(purchaseGate, "dock", next.beatId);
}
assert.equal(purchaseGate.projects.dock.contributions, 6);
assert.equal(jettyPurchaseRequired(purchaseGate), true, "lifebuoy must gate jetty after contribution 6");
assert.equal(pendingBackendContributionCount(purchaseGate, 8), 2, "backend backlog must remain queued while a story purchase gate is active");
assert.equal(nextAct2Contribution(purchaseGate, 8), null, "purchase gate must block contribution candidates in the state layer, not only in UI");
const forcedJettyBeat7 = withPresentedContribution(purchaseGate, "dock", "dock:07");
assert.equal(forcedJettyBeat7.projects.dock.contributions, 6, "direct presentation must not bypass the lifebuoy purchase gate");
const restartedPurchaseGate = normalizeAct2RuntimeState(JSON.parse(JSON.stringify(purchaseGate)));
assert.equal(jettyPurchaseRequired(restartedPurchaseGate), true, "restart must preserve an unresolved story purchase gate");
assert.equal(pendingBackendContributionCount(restartedPurchaseGate, 8), 2, "restart must preserve queued backend contribution backlog");
purchaseGate = withBackendStoryFlags(restartedPurchaseGate, { act2JettyLifebuoyOwned: true });
assert.equal(jettyPurchaseRequired(purchaseGate), false, "authoritative ownership must release jetty gate");
assert.equal(nextAct2Contribution(purchaseGate, 7)?.beatId, "dock:07");

assert.equal(CABIN_CONTRIBUTION_BEATS.length, 16, "Stugan must keep exactly 16 authoritative contribution beats");
assert.deepEqual(
  CABIN_CONTRIBUTION_BEATS.map((beat) => beat.id),
  Array.from({ length: 16 }, (_, index) => `cabin:${String(index + 1).padStart(2, "0")}`),
  "Stugan beat IDs must map one-to-one to contributions",
);
assert.equal(CABIN_CONTRIBUTION_BEATS[3].stage, 2, "Cabin contribution 4 must advance to visual stage 2");
assert.equal(CABIN_CONTRIBUTION_BEATS[7].stage, 3, "Cabin contribution 8 must advance to visual stage 3");
assert.equal(CABIN_CONTRIBUTION_BEATS[11].stage, 4, "Cabin contribution 12 must advance to visual stage 4");
assert.equal(CABIN_CONTRIBUTION_BEATS[12].title, "13/16 · Det sista riktiga jobbet");
assert.equal(CABIN_CONTRIBUTION_BEATS[13].title, "14/16 · Gör plats för människor");
assert.equal(CABIN_CONTRIBUTION_BEATS[14].title, "15/16 · Om de kommer");
assert.equal(CABIN_CONTRIBUTION_BEATS[15].title, "16/16 · Stugan är klar");
assert.ok(CABIN_CONTRIBUTION_BEATS[15].body.includes("Alve: Det är vårt nu också."), "Cabin finale must keep the locked shared-home payoff");
assert.equal(CABIN_CONTRIBUTION_BEATS[15].body.at(-1), "Alve: Då går vi.", "Cabin 16 must stop at the last authored runtime line");
assert.ok(CABIN_WAITING_REACTION.body.includes("Alve: Du är ju här."), "Cabin waiting reaction must keep the locked friendship payoff");
assert.equal(CABIN_WAITING_REACTION.body.at(-1), "Alve: Men kanske lite till.", "Cabin waiting reaction must stop at the last authored runtime line");

assert.equal(BOATHOUSE_CONTRIBUTION_BEATS.length, 16, "Båthuset must keep exactly 16 authoritative contribution beats");
assert.deepEqual(
  BOATHOUSE_CONTRIBUTION_BEATS.map((beat) => beat.id),
  Array.from({ length: 16 }, (_, index) => `boathouse:${String(index + 1).padStart(2, "0")}`),
  "Båthuset beat IDs must map one-to-one to contributions",
);
assert.equal(BOATHOUSE_CONTRIBUTION_BEATS[3].stage, 2);
assert.equal(BOATHOUSE_CONTRIBUTION_BEATS[7].stage, 3);
assert.equal(BOATHOUSE_CONTRIBUTION_BEATS[11].stage, 4);
assert.equal(BOATHOUSE_CONTRIBUTION_BEATS[15].title, "16/16 · Båthuset är klart");
assert.ok(BOATHOUSE_CONTRIBUTION_BEATS[15].body.includes("Alve: När det är dags."));
assert.ok(BOATHOUSE_STEERING_WHEEL_BEAT.body.includes("Mira: Tvåhundra SysselBux."));

let boathouseGate = withBackendClaimBaseline(createDefaultAct2RuntimeState(), 0);
boathouseGate = withSelectedProject(boathouseGate, "boathouse");
for (let i = 1; i <= 9; i++) {
  const next = nextAct2Contribution(boathouseGate, i);
  boathouseGate = withPresentedContribution(boathouseGate, "boathouse", next.beatId);
}
assert.equal(boathouseGate.projects.boathouse.contributions, 9);
assert.equal(boathousePurchaseRequired(boathouseGate), true, "steering wheel must gate Båthuset between 9 and 10");
assert.equal(nextAct2Contribution(boathouseGate, 11), null, "steering-wheel gate must block the next boathouse contribution");
assert.equal(withPresentedContribution(boathouseGate, "boathouse", "boathouse:10").projects.boathouse.contributions, 9, "direct presentation must not bypass the steering-wheel gate");
const countBeforeWheel = totalAct2Contributions(boathouseGate);
boathouseGate = withBackendStoryFlags(boathouseGate, { act2BoathouseSteeringWheelOwned: true });
assert.equal(boathousePurchaseRequired(boathouseGate), false);
assert.equal(totalAct2Contributions(boathouseGate), countBeforeWheel, "steering wheel purchase must be contribution-neutral");
assert.equal(nextAct2Contribution(boathouseGate, 10)?.beatId, "boathouse:10");

assert.equal(MOTORBOAT_PARTS_PRICE, 200, "Motorbåten story-source price must stay aligned with locked Act 2 pricing");
assert.equal(MOTORBOAT_CONTRIBUTION_BEATS.length, 16, "Motorbåten must keep exactly 16 authoritative contribution beats");
assert.deepEqual(
  MOTORBOAT_CONTRIBUTION_BEATS.map((beat) => beat.id),
  Array.from({ length: 16 }, (_, index) => `motorboat:${String(index + 1).padStart(2, "0")}`),
);
assert.equal(MOTORBOAT_CONTRIBUTION_BEATS[3].stage, 2);
assert.equal(MOTORBOAT_CONTRIBUTION_BEATS[7].stage, 3);
assert.equal(MOTORBOAT_CONTRIBUTION_BEATS[11].stage, 4);
assert.ok(MOTORBOAT_CONTRIBUTION_BEATS[14].body.includes("Alve: Inte idag."));
assert.ok(MOTORBOAT_CONTRIBUTION_BEATS[15].body.includes("Alve: Nu är den vår."));

let motorboatGate = withBackendClaimBaseline(createDefaultAct2RuntimeState(), 0);
motorboatGate = complete(motorboatGate, "cabin");
motorboatGate = complete(motorboatGate, "dock");
motorboatGate = complete(motorboatGate, "boathouse");
motorboatGate = withSelectedProject(motorboatGate, "motorboat");
for (let i = 1; i <= 5; i++) {
  const next = nextAct2Contribution(motorboatGate, 48 + i);
  motorboatGate = withPresentedContribution(motorboatGate, "motorboat", next.beatId);
}
assert.equal(motorboatPartsPurchaseRequired(motorboatGate), true);
assert.equal(nextAct2Contribution(motorboatGate, 54), null, "motorboat parts gate must block the next contribution");
assert.equal(withPresentedContribution(motorboatGate, "motorboat", "motorboat:06").projects.motorboat.contributions, 5, "direct presentation must not bypass the motorboat parts gate");
const beforeParts = totalAct2Contributions(motorboatGate);
motorboatGate = withBackendStoryFlags(motorboatGate, { act2MotorboatPartsOwned: true });
assert.equal(motorboatPartsPurchaseRequired(motorboatGate), false);
assert.equal(totalAct2Contributions(motorboatGate), beforeParts, "parts purchase must be contribution-neutral");
for (let i = 6; i <= 12; i++) {
  const next = nextAct2Contribution(motorboatGate, 48 + i);
  motorboatGate = withPresentedContribution(motorboatGate, "motorboat", next.beatId);
}
assert.equal(motorboatNamingRequired(motorboatGate), true);
assert.equal(nextAct2Contribution(motorboatGate, 61), null, "boat naming gate must block contribution 13 until a name is saved");
assert.equal(withPresentedContribution(motorboatGate, "motorboat", "motorboat:13").projects.motorboat.contributions, 12, "direct presentation must not bypass the boat naming gate");
const beforeName = totalAct2Contributions(motorboatGate);
motorboatGate = withMotorboatName(motorboatGate, "  Sjöbusen  ");
assert.equal(motorboatGate.motorboatName, "Sjöbusen");
assert.equal(motorboatNamingRequired(motorboatGate), false);
assert.equal(totalAct2Contributions(motorboatGate), beforeName, "boat naming must be contribution-neutral");

assert.equal(ACT2_FINALE_BEATS.length, 6, "Act 2 finale must include the lake epilogue");
assert.equal(ACT2_FINALE_BEATS[1].title, "Någon är där");
assert.equal(ACT2_FINALE_BEATS[2].title, "De kom");
assert.ok(ACT2_FINALE_BEATS[3].body.includes("Alve: Han är min kompis."));
assert.ok(ACT2_FINALE_BEATS[4].body.includes("Alve: Det är bättre."));
assert.equal(ACT2_FINALE_BEATS.at(-1)?.id, "finale:across-the-lake", "Act 2 must end with the canonical lake epilogue");

let finaleState = createDefaultAct2RuntimeState();
finaleState = complete(finaleState, "cabin");
finaleState = complete(finaleState, "dock");
finaleState = complete(finaleState, "boathouse");
finaleState = complete(finaleState, "motorboat");
assert.equal(act2FinalePending(finaleState), true);
assert.equal(finaleState.finaleIndex, 0);
finaleState = normalizeAct2RuntimeState({ ...finaleState, finaleLineIndex: 4 });
assert.equal(finaleState.finaleLineIndex, 4, "restart must preserve the exact line inside the active finale beat");
finaleState = advanceAct2Finale(finaleState);
assert.equal(finaleState.finaleIndex, 1);
assert.equal(finaleState.finaleLineIndex, 0, "advancing a finale beat must reset the persisted line index");
for (let i = 1; i < ACT2_FINALE_BEATS.length; i++) finaleState = advanceAct2Finale(finaleState);
assert.equal(finaleState.finaleIndex, 5, "six-beat Act 2 finale must finish on the epilogue index");
assert.equal(finaleState.familyFinaleConsumed, true);
assert.equal(finaleState.epilogueConsumed, true);
assert.equal(finaleState.act2Complete, true);
assert.equal(act2FinalePending(finaleState), false);

for (const project of ["cabin", "dock", "boathouse", "motorboat"]) {
  const position = ACT2_ALVE_WORK_POSITIONS[project];
  const placement = ACT2_VISUAL_PLACEMENTS[project];
  const halfW = placement.footprint.width / 2 + 24;
  const halfH = placement.footprint.height / 2 + 18;
  const insideBlockedFootprint =
    position.x >= placement.x - halfW
    && position.x <= placement.x + halfW
    && position.y >= placement.baseY - halfH
    && position.y <= placement.baseY + halfH;
  assert.equal(insideBlockedFootprint, false, `Alve work positions must remain walkable for ${project}`);
}

const lakeGameSource = fs.readFileSync(new URL("../src/game/createAct2LakeGame.ts", import.meta.url), "utf8");
assert.ok(lakeGameSource.includes('setActiveProject: (project: Act2RestorationProject | null) => void'), "lake runtime must expose active-project positioning for Alve");
assert.ok(lakeGameSource.includes('setAlveTurnInAvailable: (available: boolean) => void'), "lake runtime must expose pending turn-in marker state");
assert.ok(lakeGameSource.includes('"/assets/village/reboot/alve-runtime.png"'), "lake runtime must load the canonical standalone Alve asset");
assert.ok(lakeGameSource.includes('.setDisplaySize(78, 117)'), "Alve runtime art must remain child-scale rather than adult-scale");
assert.ok(
  lakeGameSource.includes('id: "act2:alve-turn-in"')
    && lakeGameSource.includes("interactionRadius: 135")
    && lakeGameSource.includes("resolveInteraction("),
  "Alve quest hand-in must require the child to be physically nearby through shared interaction resolution",
);
assert.ok(lakeGameSource.includes("options.onAlveTurnIn?.()"), "nearby Alve interaction must open the Act 2 turn-in");
assert.ok(lakeGameSource.includes("event.stopPropagation()"), "Alve taps must not fall through to the generic touch-to-move handler");
assert.ok(lakeGameSource.includes("Tryck på Alve"), "nearby pending turn-in must give explicit world feedback");

for (const prompt of [
  "Gör några uppdrag så kommer vi vidare med bygget!",
  "Vi behöver några uppdrag till innan vi kan fortsätta.",
  "Kör några uppdrag, så bygger vi vidare sen!",
  "Lite fler uppdrag först. Sen fortsätter vi!",
  "Vi är inte riktigt redo för nästa steg än. Gör några uppdrag!",
  "Fixar du några uppdrag till så tar vi nästa byggsteg sen.",
]) {
  assert.ok(lakeGameSource.includes(prompt), `idle Alve world prompt must include: ${prompt}`);
}
assert.ok(lakeGameSource.includes("showAlveIdleWorldPrompt()"), "inactive Alve taps must surface a world prompt");
assert.ok(lakeGameSource.includes("lastAlveIdlePromptIndex"), "idle Alve prompt rotation should avoid immediate repeats");
assert.ok(lakeGameSource.includes("delayedCall(3200"), "idle Alve world prompt should dismiss itself without story state");
assert.ok(lakeGameSource.includes("facePlayerTowardAlve()"), "child should face Alve when the hand-in interaction begins");
assert.match(
  lakeGameSource,
  /this\.alveTurnInMarker = createInteractionMarker\(this, \{[\s\S]*kind: "quest-turn-in"[\s\S]*setAlveTurnInAvailable\(available: boolean\)[\s\S]*this\.alveTurnInMarker\?\.setVisible\(available && requestedAlvePresent\)/,
  "pending Act 2 turn-in must use the canonical visible quest-turn-in marker on Alve",
);
assert.match(
  lakeGameSource,
  /alveInteractionArea = this\.add\.rectangle\(0, -90, 150, 310,[\s\S]*alveInteractionArea[\s\S]*setInteractive\(\{ useHandCursor: true \}\)[\s\S]*handleAlvePointerDown/,
  "Alve must use one real world-space interaction area covering his sprite and turn-in marker",
);
assert.ok(lakeGameSource.includes('ACT2_ALVE_WORK_POSITIONS[project]'), "Alve must derive his position from the active restoration project");
assert.ok(lakeGameSource.includes('this.textures.getPixel('), "Act 2 water collision must derive from the accepted lake-master texture");
assert.ok(lakeGameSource.includes('"act2-lake-master"'), "Act 2 water collision must sample the canonical lake master");
assert.ok(lakeGameSource.includes("ACT2_PLAYER_FOOT_RADIUS"), "Act 2 water collision must account for the player's feet, not only sprite center");
assert.ok(lakeGameSource.includes("private isWaterAt"), "Act 2 runtime must centralize map-pixel water classification");
assert.ok(lakeGameSource.includes("if (!this.isWalkable(target.x, target.y)) return;"), "touch movement must reject blocked water targets");
assert.ok(lakeGameSource.includes("if (this.isWalkable(nextX, this.player.y))"), "keyboard movement must share the same world collision");
assert.ok(lakeGameSource.includes("if (this.isWalkable(nextDogX, this.dog.y))"), "Valpen must use the same world collision instead of drifting into water or buildings");
assert.ok(lakeGameSource.includes('this.add.image(815, 515, "act2-child")'), "Act 2 debug/runtime spawn must start on accepted land, not in the lake");


const page = fs.readFileSync(new URL("../src/components/Act2Runtime.tsx", import.meta.url), "utf8");
const act2RuntimeAdapterSource = fs.readFileSync(new URL("../src/game/act2RuntimeAdapter.ts", import.meta.url), "utf8");
const act2OpeningStorySource = fs.readFileSync(new URL("../src/game/act2OpeningStory.ts", import.meta.url), "utf8");
const act2AlveStorySource = fs.readFileSync(new URL("../src/game/act2AlveStory.ts", import.meta.url), "utf8");
for (const required of [
  "01-dog-runs-off.png",
  "02-into-the-forest.png",
  "03-through-the-trees.png",
  "04-first-view-of-the-lake.png",
  "05-the-bicycle.png",
]) assert.ok(act2OpeningStorySource.includes(required), `missing canonical Act 2 opening asset: ${required}`);
for (const required of [
  "first-hello.png",
  "a-lot-of-work.png",
  "new-friend.png",
  "alve-shows.png",
]) assert.ok(act2AlveStorySource.includes(required), `missing canonical Alve meeting asset: ${required}`);
assert.ok(page.includes("meeting-alve/bike.png"), "the close bicycle beat must remain in the shared runtime before Alve intro");
for (const required of [
  "ACT2_OPENING_BEATS",
  "ACT2_ALVE_DIALOGUE",
  "Vad börjar vi med?",
  "Laga {PROJECT_COPY[previewProject].object}",
]) assert.ok(page.includes(required), `missing shared Act 2 runtime contract: ${required}`);

assert.ok(act2AlveStorySource.includes('{ speaker: "unknown", text: "Alve.", nameReveal: true }'), "Alve nameplate must still be Barnet on his name reveal line");
assert.ok(act2AlveStorySource.includes('{ speaker: "alve", text: "Okej, {childName}.'), "the line after name reveal must use Alve nameplate");
assert.ok(act2AlveStorySource.includes('{ speaker: "unknown", text: "Varför?" }'), "unknown Alve must own the pre-introduction Varför line");
assert.ok(page.includes('🔒 Motorbåten'), "motorboat must remain visible while locked");
assert.ok(page.includes('prerequisiteCompletionCount(state)'), "project selector must derive 0/3→3/3 from canonical state");
assert.ok(page.includes("deriveAct2RuntimeBlockers(state"), "production route must consume the Act 2 blocker adapter instead of duplicating blocker rules");
assert.ok(
  act2RuntimeAdapterSource.includes("pendingProjectCompletionReaction(state)"),
  "Act 2 blocker adapter must consume the shared project engine's configured completion-reaction selection",
);
assert.ok(page.includes("CABIN_WAITING_REACTION"), "production route must present the canonical Cabin revisit scene");
assert.ok(page.includes("latest.projects.cabin.complete && !latest.projects.motorboat.complete"), "Cabin revisit must remain gated by Cabin completion and Motorboat incompletion through the shared world-host snapshot");
assert.ok(page.includes("onCabinRevisit"), "Cabin revisit must open from a real world Cabin interaction");
assert.ok(page.includes("JETTY_COMPLETION_REACTION"), "production route must present the canonical jetty completion reaction");
assert.ok(page.includes("CABIN_CONTRIBUTION_BEATS[contributionCandidate.number - 1]"), "production route must consume the canonical Cabin contribution track");
assert.ok(page.includes("BOATHOUSE_CONTRIBUTION_BEATS[contributionCandidate.number - 1]"), "production route must consume the canonical Båthuset contribution track");
assert.ok(page.includes("MOTORBOAT_CONTRIBUTION_BEATS[contributionCandidate.number - 1]"), "production route must consume the canonical Motorbåten contribution track");
assert.ok(act2RuntimeAdapterSource.includes("motorboatNamingRequired(state)"), "Act 2 chapter adapter must preserve the persisted contribution-neutral Motorbåten naming gate");
assert.ok(page.includes("ACT2_FINALE_BEATS[state.finaleIndex]"), "production route must resume the persisted Act 2 finale");
assert.ok(page.includes("world.setActiveProject(latest.selectedProject)"), "production route must move Alve when the shared world-host snapshot changes active project");
assert.ok(page.includes("onAlveTurnIn: () => setContributionTurnInOpen(true)"), "Alve interaction must explicitly arm the pending contribution Story Moment");
assert.ok(page.includes("hasPendingAlveTurnIn(latest, snapshot.backendWorldProgression)"), "shared world-host sync must restore Alve turn-in availability from the latest authoritative progression without recreating the game");
assert.ok(page.includes("backendWorldProgressionRef.current = backend.progression.worldProgression"), "authoritative progression refreshes must update the restart-safe game bootstrap ref");
assert.ok(
  page.includes("act2PurchaseShopHref("),
  "story purchase gates must route back to Mira through the canonical purchase handoff",
);
assert.ok(page.includes("state.contributionLineIndex"), "contribution Story Moments must render from persisted line state");

assert.ok(page.includes("previousOpening()"), "Act 2 opening must support Föregående navigation");
assert.ok(page.includes("previousAlve()"), "Alve intro must support Föregående navigation");
assert.ok(page.includes("previousFinaleStory()"), "Act 2 finale must support Föregående navigation");
assert.ok(page.includes("previousCompletionReaction()"), "completion reactions must support Föregående navigation");
assert.ok(page.includes("previousCabinRevisit()"), "cabin revisit must support Föregående navigation");
assert.ok(page.includes("previousContributionStory()"), "project contribution beats must support Föregående navigation");

assert.ok(page.includes("state.completionLineIndex"), "completion reactions must render from persisted line state");
assert.ok(page.includes("state.finaleLineIndex"), "finale beats must render from persisted line state");

assert.ok(page.includes("revealImageBeforeNext={state.openingLineIndex === opening.body.length - 1}"), "opening beats must reveal full art after their last panel");
assert.ok(page.includes("revealImageBeforeNext={alveImageComplete}"), "Alve intro must reveal art after the last panel using each image");
assert.ok(page.includes("revealImageBeforeNext={finaleLineIndex + 1 >= activeFinaleBeat.body.length}"), "finale beats must reveal full art after their last panel");
assert.ok(page.includes("revealImageBeforeNext={state.completionLineIndex + 1 >= activeCompletionBeat.body.length}"), "completion beats must reveal full art after their last panel");
assert.ok(page.includes("revealImageBeforeNext={state.contributionLineIndex + 1 >= activeContributionBeat.body.length}"), "contribution beats must reveal full art after their last panel");
assert.ok(page.includes("contributionTurnInOpen && contributionCandidate"), "backend polling must not auto-open contribution Story Moments");
assert.ok(page.includes("setContributionTurnInOpen(false);"), "finishing one beat must close turn-in so backlog cannot auto-chain");
assert.ok(page.includes('className="act2-project-status"'), "Act 2 must keep a compact active-project status");
assert.ok(page.includes("Aktivt projekt:"), "Act 2 project status must identify the active project");
assert.equal(page.includes("Ett klart uppdrag väntar hos Alve."), false, "compact Act 2 project status must not carry quest guidance copy");
assert.ok(page.includes("← Till byn"), "Act 2 HUD must expose an explicit route back to the village");
assert.ok(
  page.includes("<GameUiShell")
    && page.includes("worldInputEnabled: runtimeOverlay.worldInputEnabled")
    && page.includes("world.setWorldInputEnabled(snapshot.worldInputEnabled)")
    && page.includes("blockingOverlayVisible: runtimeOverlay.blockingOverlayVisible"),
  "Act 2 must reuse one shared Chapter Runtime overlay result for GameUiShell and shared-host lake world-input authority",
);
assert.match(
  page,
  /<GameUiShell[\s\S]*id: "village"[\s\S]*label: "← Till byn"[\s\S]*onSelect: \(\) => router\.push\(chapterRoute\("act1"\)\)/,
  "Act 2 shared GameUiShell must route back through the canonical Act 1 chapter registry entry",
);
assert.ok(
  page.includes('label: "← Till byn"'),
  "Act 2 shared menu configuration must keep an explicit Till byn control",
);

assert.ok(page.includes("<GameUiShell"), "Act 2 must render resources through the shared GameUiShell");
assert.ok(page.includes('diamonds={backendWallet?.diamonds ?? "…"}'), "Act 2 shared HUD must show authoritative backend diamonds");
assert.ok(page.includes('sysselBux={backendWallet?.sysselBux ?? "…"}'), "Act 2 shared HUD must show authoritative backend SysselBux");

const questInbox = fs.readFileSync(new URL("../src/components/ChildBackendQuestInbox.tsx", import.meta.url), "utf8");
assert.equal(questInbox.includes("Koppla om"), false, "Uppdrag must not expose re-pairing; that belongs in Vuxenläge");
assert.ok(questInbox.includes('data-story-ui="quest-dock"'), "shared Uppdrag dock must opt into Story Engine HUD suppression");

const act2Route = fs.readFileSync(new URL("../src/app/act2/page.tsx", import.meta.url), "utf8");
assert.ok(act2Route.includes("ChildBackendQuestInbox"), "Act 2 must reuse the same child quest dock as Act 1");
assert.match(act2Route, /<ChildBackendQuestInbox \/>/, "Act 2 route must mount the shared Uppdrag UI");

const village = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
assert.ok(village.includes("getChildDisplayName(childId)"), "Test-Ture QA controls must derive identity from the paired backend child, not the local story name");
assert.ok(village.includes('pairedBackendChildName === "Test-Ture"'), "Test-Ture reset control must be scoped to the backend Test-Ture profile");
assert.ok(
  page.includes("deriveChapterRuntimeOverlay(chapterCardVisible, storyUiVisible)")
    && page.includes("worldInputEnabled: runtimeOverlay.worldInputEnabled")
    && page.includes("world.setWorldInputEnabled(snapshot.worldInputEnabled)"),
  "Act 2 must disable Phaser world input through shared chapter overlay arbitration and world-host sync",
);
assert.ok(
  page.includes("<GameUiShell")
    && page.includes("blockingOverlayVisible: runtimeOverlay.blockingOverlayVisible"),
  "Act 2 shared GameUiShell must consume the same chapter overlay authority as lake input",
);
assert.ok(
  lakeGameSource.includes("worldInputEnabled({ enabled: requestedWorldInputEnabled")
    && lakeGameSource.includes("!requestedCabinRevisitAvailable"),
  "cabin hotspot must consume shared world-input authority",
);
assert.ok(
  lakeGameSource.includes("worldInputEnabled({ enabled: requestedWorldInputEnabled")
    && lakeGameSource.includes("blockingOverlayVisible: false"),
  "lake movement and pointer input must consume shared world-input authority",
);


assert.ok(village.includes('get("act2-purchase")'), "village must consume Act 2 purchase context instead of dropping the child at an unscoped village");
assert.ok(village.includes('setShopPanelOpen(true)'), "Act 2 purchase context must open Mira's shop directly");
assert.ok(village.includes('setShopCurrency("sysselbux")'), "Act 2 purchase context must open the correct SysselBux shelf");
assert.ok(village.includes("resolveStoryPurchaseExit(project, purchaseOwned)") && village.includes("router.push(act2ResumeHref(exit.target))"), "contextual Mira close must use shared purchase-flow semantics before returning through the Act 2 handoff");
assert.ok(page.includes("parseAct2PurchaseProject("), "Act 2 must parse contextual return through the canonical purchase-project whitelist");
assert.match(village, /const act1NextChapter = nextChapterDestination\("act1"[\s\S]*act1NextChapter && <button[^>]*[\s\S]*Stigen till sjön/, "the lake path must render only after the shared next-chapter transition is available");
assert.ok(page.includes("📖 Historik"), "Act 2 HUD must expose completed story history");
assert.match(
  page,
  /id: "adult-mode"[\s\S]*label: "🔐 Vuxenläge"[\s\S]*id: "history"[\s\S]*label: "📖 Historik"[\s\S]*id: "village"[\s\S]*label: "← Till byn"/,
  "Act 2 GameUiShell menu configuration must order Vuxenläge, Historik, then Till byn",
);
assert.ok(
  page.includes('router.push(`${chapterRoute("act1")}?menu=adult`)'),
  "Act 2 Vuxenläge menu item must route to the canonical village adult-mode panel",
);
assert.ok(
  village.includes('params.get("menu") === "adult"')
    && village.includes("setParentMenuOpen(true)"),
  "village must consume the Act 2 adult-mode menu handoff",
);

const act2StoryRegistrySource = fs.readFileSync(new URL("../src/runtime/story/act2StoryRegistry.ts", import.meta.url), "utf8");
assert.ok(
  act2StoryRegistrySource.includes("if(state.projects[project].complete) completedStorylineIds.add(ACT2_STORYLINE_IDS[project])"),
  "project history must stay hidden until the entire 16/16 storyline is complete",
);
assert.ok(
  act2StoryRegistrySource.includes("if(state.epilogueConsumed) completedStorylineIds.add(ACT2_STORYLINE_IDS.finale)"),
  "finale history must stay hidden until the complete Act 2 epilogue has been consumed",
);
assert.ok(page.includes('[ACT2_STORYLINE_IDS.finale]: "Finalen"'), "completed finale beats must be replayable from history");
assert.ok(page.includes("setHistoryReplay({ beat, lineIndex: 0 })"), "history replay must use isolated local presentation state");
const historyReplayStart = page.indexOf("function openHistoryReplay");
const historyReplayEnd = page.indexOf("async function previousFinaleStory");
assert.ok(historyReplayStart >= 0 && historyReplayEnd > historyReplayStart, "history replay implementation must be discoverable for safety audit");
const historyReplaySource = page.slice(historyReplayStart, historyReplayEnd);
assert.equal(historyReplaySource.includes("saveAct2RuntimeState"), false, "history replay must never persist Act 2 state");
assert.equal(historyReplaySource.includes("withPresentedContribution"), false, "history replay must never consume a contribution");
assert.equal(historyReplaySource.includes("purchase"), false, "history replay must never execute story purchases");
assert.ok(
  page.includes("if (!historyOpen && historyReplay === null) return;")
    && page.includes("return beginStoryOverlay();"),
  "history menu and replay must publish shared story-overlay visibility so quest UI is suppressed",
);


const storyShop = fs.readFileSync(new URL("../src/backend/storyShop.ts", import.meta.url), "utf8");
const act2PurchaseCatalog = fs.readFileSync(new URL("../src/game/act2PurchaseCatalog.ts", import.meta.url), "utf8");
assert.ok(act2PurchaseCatalog.includes("const DOCK_PRICE = 200"), "jetty lifebuoy display price must stay at locked 200 SysselBux");
assert.ok(act2PurchaseCatalog.includes("const BOATHOUSE_PRICE = 200"), "Båthuset steering wheel display price must stay at locked 200 SysselBux");
assert.ok(act2PurchaseCatalog.includes("const MOTORBOAT_PRICE = 200"), "Motorbåten parts display price must stay at locked 200 SysselBux");
assert.equal(storyShop.includes("ACT2_PURCHASE_CATALOG"), false, "Story Shop transport must not own or mirror Act 2 presentation prices");
assert.equal(storyShop.includes("ACT2_JETTY_LIFEBUOY_PRICE"), false, "retired jetty compatibility price alias must stay removed");
assert.equal(storyShop.includes("ACT2_BOATHOUSE_STEERING_WHEEL_PRICE"), false, "retired boathouse compatibility price alias must stay removed");
assert.equal(storyShop.includes("ACT2_MOTORBOAT_PARTS_PRICE"), false, "retired motorboat compatibility price alias must stay removed");
assert.ok(storyShop.includes('purchaseStoryItem("act2_jetty_lifebuoy")'), "jetty lifebuoy must use the atomic story purchase RPC");
assert.ok(storyShop.includes('purchaseStoryItem("act2_boathouse_steering_wheel")'), "Båthuset steering wheel must use the atomic story purchase RPC");
assert.ok(storyShop.includes('purchaseStoryItem("act2_motorboat_parts")'), "Motorbåten parts must use the atomic story purchase RPC");
const act2PurchaseMigration = fs.readFileSync(new URL("../supabase/migrations/20261001_sync_act2_story_item_purchase.sql", import.meta.url), "utf8");
for (const [item, flag] of [
  ["act2_jetty_lifebuoy", "act2JettyLifebuoyOwned"],
  ["act2_boathouse_steering_wheel", "act2BoathouseSteeringWheelOwned"],
  ["act2_motorboat_parts", "act2MotorboatPartsOwned"],
]) {
  assert.ok(act2PurchaseMigration.includes(`when '${item}' then v_price:=200`), `${item} must be reproducible from checked-in migration at 200 SysselBux`);
  assert.ok(act2PurchaseMigration.includes(`v_flag_key:='${flag}'`), `${item} migration must persist ${flag}`);
}
assert.ok(act2PurchaseCatalog.includes('title: "Livboj till bryggan"') && village.includes("ACT2_PURCHASE_CATALOG.dock.presentation.shop.title"), "Mira must expose the canonical Act 2 lifebuoy presentation");
assert.ok(village.includes("jettyPurchaseRequired(act2)"), "Mira stock must derive from Act 2 progress, not a permanent global item");
assert.ok(act2PurchaseCatalog.includes('title: "Ratt till lådbilen"') && village.includes("ACT2_PURCHASE_CATALOG.boathouse.presentation.shop.title"), "Mira must expose the canonical Båthuset steering-wheel presentation");
assert.ok(village.includes("boathousePurchaseRequired(act2)"), "steering wheel stock must derive from Båthuset progress");
assert.ok(act2PurchaseCatalog.includes('title: "Reservdelspaket till motorbåten"') && village.includes("ACT2_PURCHASE_CATALOG.motorboat.presentation.shop.title"), "Mira must expose the canonical Motorbåten parts presentation");
assert.ok(village.includes("motorboatPartsPurchaseRequired(act2)"), "parts stock must derive from Motorbåten progress");
assert.ok(village.includes("JETTY_LIFEBUOY_BEAT"), "Mira shop must render the canonical Bryggan lifebuoy story beat");
assert.ok(village.includes("BOATHOUSE_STEERING_WHEEL_BEAT"), "Mira shop must render the canonical Båthuset steering-wheel story beat");
assert.ok(village.includes("act2PurchaseBeat?.body[act2PurchaseStoryIndex]"), "Mira purchase beats must render their authored body one reply at a time");
assert.ok(village.includes('pendingPurchaseStory: "dock" as const'), "lifebuoy purchase must persist its canonical story beat");
assert.ok(village.includes('pendingPurchaseStory: "boathouse" as const'), "steering-wheel purchase must persist its canonical story beat");
assert.match(village, /pendingPurchaseStory: "dock" as const,\s*purchaseStoryLineIndex: 0/, "lifebuoy purchase must persist the story at the same first line the UI presents");
assert.match(village, /pendingPurchaseStory: "boathouse" as const,\s*purchaseStoryLineIndex: 0/, "steering-wheel purchase must persist the story at the same first line the UI presents");

assert.ok(JETTY_LIFEBUOY_BEAT.body.length > 0, "canonical lifebuoy economy beat must contain dialogue");
assert.ok(BOATHOUSE_STEERING_WHEEL_BEAT.body.length > 0, "canonical steering-wheel economy beat must contain dialogue");

const dialoguePolishSources = [
  fs.readFileSync(new URL("../src/game/act2CabinStory.ts", import.meta.url), "utf8"),
  fs.readFileSync(new URL("../src/game/act2JettyStory.ts", import.meta.url), "utf8"),
  fs.readFileSync(new URL("../src/game/act2BoathouseStory.ts", import.meta.url), "utf8"),
  fs.readFileSync(new URL("../src/game/act2MotorboatStory.ts", import.meta.url), "utf8"),
  fs.readFileSync(new URL("../src/game/act2FinaleStory.ts", import.meta.url), "utf8"),
];
assert.equal(dialoguePolishSources.some((source) => /"Barnet (?!:)/.test(source)), false, "runtime narration should stay in second person; Barnet is reserved for dialogue speaker prefixes");
assert.equal(dialoguePolishSources.some((source) => source.includes("på Barnet.")), false, "runtime narration should address the player as du rather than Barnet");
assert.equal(dialoguePolishSources.some((source) => source.includes("KÖP:")), false, "child-facing story sources must not leak authoring/UI purchase labels");
const childFacingStorySources = [
  "../src/game/act2CabinStory.ts",
  "../src/game/act2JettyStory.ts",
  "../src/game/act2BoathouseStory.ts",
  "../src/game/act2MotorboatStory.ts",
  "../src/game/act2FinaleStory.ts",
].map((path) => fs.readFileSync(new URL(path, import.meta.url), "utf8"));
const childFacingForbidden = [
  "Adam:",
  "wallet-loopen",
  "authoritative",
  "auktoritativa story-item",
  "story-item-köpsfunktionen",
  "Contribution 16 completes",
  "utan tekniska motorinstruktioner",
];
for (const forbidden of childFacingForbidden) {
  assert.equal(childFacingStorySources.some((source) => source.includes(forbidden)), false, `runtime story source leaked internal text: ${forbidden}`);
}
assert.ok(village.includes("function act2StoryItemInsufficientFundsMessage(price: number)"), "Act 2 story purchases must share one insufficient-funds formatter");
assert.ok(village.includes("Du har ${current} SysselBux. Du behöver ${missing} till."), "insufficient-funds feedback must show current balance and exact shortfall");
assert.ok(village.includes("Gör några uppdrag och kom tillbaka"), "insufficient-funds feedback must explain the recovery path");
assert.ok(village.includes("act2StoryItemInsufficientFundsMessage(ACT2_PURCHASE_CATALOG.dock.price)"), "jetty story item must use detailed insufficient-funds feedback from the canonical display price");
assert.ok(village.includes("act2StoryItemInsufficientFundsMessage(ACT2_PURCHASE_CATALOG.boathouse.price)"), "boathouse story item must use detailed insufficient-funds feedback from the canonical display price");
assert.ok(village.includes("act2StoryItemInsufficientFundsMessage(ACT2_PURCHASE_CATALOG.motorboat.price)"), "motorboat story item must use detailed insufficient-funds feedback from the canonical display price");

assert.match(page, /if \(!act1ChapterComplete\)/, "direct /act2 access must require the acknowledged Act 1 chapter ending");
assert.equal(page.includes("void saveAct2RuntimeState(next);"), false, "backend polling must not persist asynchronously inside a React state setter");
assert.equal(MOTORBOAT_CONTRIBUTION_BEATS[5].body[0], "När ni kommer tillbaka till Mira håller hon redan på att göra beställningen klar.", "Motorbåten 6/16 must keep the locked post-purchase return scene");
assert.equal(MOTORBOAT_CONTRIBUTION_BEATS[6].image, "/assets/village/story-moments/act2/motorboat/02-linus-inspects-the-boat.png", "Motorbåten 7/16 must leave Mira and show Linus at the boat for the package-opening scene");
assert.equal(MOTORBOAT_CONTRIBUTION_BEATS[5].body.some((line) => /\b(?:150|200) SysselBux\b/.test(line)), false, "post-purchase Motorbåten beat must not repeat the wallet transaction");

const cabinStorySource = fs.readFileSync(new URL("../src/game/act2CabinStory.ts", import.meta.url), "utf8");
const motorboatStorySource = fs.readFileSync(new URL("../src/game/act2MotorboatStory.ts", import.meta.url), "utf8");
assert.match(
  motorboatStorySource,
  /"Alve: Mamma brukade alltid säga åt mig att sitta ner\."/,
  "motorboat arc must seed Alve's mother before the family payoff",
);
for (const narrationLeak of [
  "Den här gången svarar Barnet inte med ett skämt.",
  "När ni går igenom båten upptäcker Barnet en detalj på sidan.",
  "Alve vänder sig direkt mot Barnet.",
]) {
  assert.equal(motorboatStorySource.includes(narrationLeak), false, `motorboat narration must use second person instead of Barnet: ${narrationLeak}`);
}
assert.ok(!cabinStorySource.includes("## Motorbåten restoration arc"), "runtime story sources must not leak design-document prose");
assert.ok(!cabinStorySource.includes("Locked completion beat:"), "runtime story sources must stop at authored child-facing content");
assert.ok(!motorboatStorySource.includes("wallet-loopen"), "runtime story sources must not expose backend implementation language");
assert.ok(!motorboatStorySource.includes("utan tekniska motorinstruktioner"), "runtime narration must not expose authoring instructions");

console.log("Act 2 vertical-slice state/route contract PASS");


const globalCss = fs.readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
assert.match(globalCss, /\.story-moment \{[^}]*pointer-events:auto/, "Story Moment overlays must remain clickable");
assert.match(globalCss, /\.story-moment img \{[^}]*pointer-events:none/, "Story Moment artwork must not steal dialogue clicks");
assert.match(globalCss, /\.story-moment::after \{[^}]*pointer-events:none/, "Story Moment tint overlay must not steal dialogue clicks");


const storyRunnerSource = fs.readFileSync(new URL("../src/components/story/StoryRunner.tsx", import.meta.url), "utf8");
const storyMomentSource = fs.readFileSync(new URL("../src/components/story/StoryMoment.tsx", import.meta.url), "utf8");
const dialogueCardSource = fs.readFileSync(new URL("../src/components/story/DialogueCard.tsx", import.meta.url), "utf8");
const act2PageSource = fs.readFileSync(new URL("../src/components/Act2Runtime.tsx", import.meta.url), "utf8");
const act2RouteSource = fs.readFileSync(new URL("../src/app/act2/page.tsx", import.meta.url), "utf8");

assert.match(storyMomentSource, /shared-story-moment/, "shared Story Engine must own the fullscreen Story Moment shell");
assert.match(storyMomentSource, /shared-story-tint/, "shared Story Engine must own the non-interactive tint layer");
assert.match(dialogueCardSource, /shared-story-dialogue/, "shared Story Engine must own dialogue presentation");
assert.match(storyRunnerSource, /StoryBeatPresentation/, "StoryRunner must render typed Story Beat presentation data");
assert.match(act2PageSource, /<StoryRunner[\s\S]*act2:opening:/, "Act 2 opening must use the shared Story Engine");
assert.match(act2PageSource, /id: "act2:bicycle"/, "Act 2 bicycle beat must use the shared Story Engine");
assert.match(act2PageSource, /act2:alve-intro:/, "Act 2 Alve intro must use the shared Story Engine");
assert.match(act2PageSource, /act2:finale:/, "Act 2 finale must use the shared Story Engine");
assert.match(act2PageSource, /act2:completion:/, "Act 2 completion reactions must use the shared Story Engine");
assert.match(act2PageSource, /<StoryMoment[\s\S]*advanceContributionStory/, "Act 2 contribution dialogue must use the shared Story Engine shell");
assert.match(act2PageSource, /dialogueClassName="act2-dialogue-card"/, "Act 2 Story Engine migration must preserve the accepted smaller dialogue typography");


const storyEngineSource = fs.readFileSync(new URL("../src/game/storyEngine.ts", import.meta.url), "utf8");
const boathouseStorySource = fs.readFileSync(new URL("../src/game/act2BoathouseStory.ts", import.meta.url), "utf8");
assert.match(storyEngineSource, /parseStoryLine/, "shared Story Engine must parse speaker prefixes into nameplates");
assert.match(storyEngineSource, /prefix === "Barnet"/, "Barnet prefix must map to the configured child nameplate");
assert.match(act2PageSource, /activeContributionPresentation\?\.speaker/, "Act 2 contribution beats must keep one speaker-owned dialogue card at a time");
assert.doesNotMatch(act2PageSource, /storyCardChunk/, "Act 2 contribution UI must not stack multiple authored speakers into one card");
assert.doesNotMatch(act2PageSource, /speaker=\{activeContributionBeat\.title\}/, "beat titles must never be used as contribution speaker nameplates");
assert.doesNotMatch(boathouseStorySource, /Order-independence lock:/, "authoring notes must never leak into Båthuset runtime text");

assert.match(
  boathouseStorySource,
  /"id": "boathouse:14"[\s\S]*"image": "\/assets\/village\/story-moments\/act2\/boathouse\/linus-helping\.png"/,
  "Båthuset slipway explanation must show Linus helping",
);


const storyTranscriptSource = fs.readFileSync(new URL("../src/components/story/StoryTranscript.tsx", import.meta.url), "utf8");
const act2TestPageSource = fs.readFileSync(new URL("../src/app/act2-test/page.tsx", import.meta.url), "utf8");

assert.match(storyEngineSource, /heading\?: string/, "Story Engine v1 must separate headings from speakers");
assert.match(dialogueCardSource, /shared-story-heading/, "DialogueCard must own semantic scene headings");
assert.match(storyRunnerSource, /StoryTranscript/, "StoryRunner must route multi-line copy through shared speaker parsing");
assert.match(storyTranscriptSource, /parseStoryLine/, "StoryTranscript must centralize prefix-to-nameplate rendering");

const parsedChild = parseStoryLine("Barnet: Hej.", "Ture");
assert.deepEqual(parsedChild, { text: "Hej.", speaker: "Ture", speakerTone: "child" });
const parsedAlve = parseStoryLine("Alve: Japp.", "Ture");
assert.deepEqual(parsedAlve, { text: "Japp.", speaker: "Alve", speakerTone: "alve" });
assert.deepEqual(parseStoryLine("Du tittar mot sjön.", "Ture"), { text: "Du tittar mot sjön." });

assert.match(act2PageSource, /<StoryMoment[\s\S]*meeting-alve\/pick\.png/, "project chooser must use the shared Story Engine shell");
assert.match(act2PageSource, /purchaseRequired && purchaseProject && purchaseGateCopy && <StoryMoment/, "purchase gates must use the shared Story Engine shell with canonical catalog presentation");
assert.match(act2PageSource, /namingRequired && <StoryMoment/, "naming gate must use the shared Story Engine shell");
assert.doesNotMatch(act2PageSource, /className="story-moment"/, "Act 2 production must not keep a parallel legacy Story Moment shell");
assert.match(act2TestPageSource, /<Act2Runtime debug \/>/, "Act 2 test lab must render the exact shared production runtime");
assert.match(act2TestPageSource, /process\.env\.NODE_ENV !== "production"/, "Act 2 test lab must be build-time disabled in production");
assert.match(act2TestPageSource, /if \(!ACT2_DEBUG_LAB_ENABLED\) notFound\(\)/, "Production requests to the Act 2 test lab must 404");
assert.match(act2PageSource, /!debug && ACT2_DEBUG_LAB_ENABLED/, "Production runtime must not expose the hidden Act 2 debug gesture");

assert.match(act2RouteSource, /<Act2Runtime productionEnabled=\{ACT2_PRODUCTION_ENABLED\} \/>/, "Act 2 production route must render the same shared runtime");
assert.doesNotMatch(act2TestPageSource, /StoryMoment|StoryTranscript|<Image|project-choice/, "Act 2 test lab route must not keep a parallel story implementation");


assert.match(
  act2PageSource,
  /lines: \[opening\.body\[state\.openingLineIndex\] \?\? opening\.body\[0\]\]/,
  "Act 2 opening must present one authored line at a time",
);
assert.doesNotMatch(
  act2PageSource,
  /lines: opening\.body/,
  "Act 2 opening must not render the full beat body as one scrollable card",
);
assert.match(
  act2PageSource,
  /lines: \[opening\.body\[state\.openingLineIndex\] \?\? opening\.body\[0\]\]/,
  "Shared Act 2 runtime must own line-by-line opening presentation for both production and debug",
);
