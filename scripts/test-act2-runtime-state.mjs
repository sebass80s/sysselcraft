import assert from "node:assert/strict";
import fs from "node:fs";
import { ACT2_ALVE_WORK_POSITIONS, ACT2_VISUAL_PLACEMENTS } from "../src/game/act2VisualAssets.ts";
import { CABIN_CONTRIBUTION_BEATS, CABIN_WAITING_REACTION } from "../src/game/act2CabinStory.ts";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../src/game/act2BoathouseStory.ts";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../src/game/act2MotorboatStory.ts";
import { ACT2_FINALE_BEATS } from "../src/game/act2FinaleStory.ts";
import {
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
  pendingBackendContributionCount,
  projectCompletionReactionPending,
  nextAct2Contribution,
  totalAct2Contributions,
  withBackendClaimBaseline,
  withBackendStoryFlags,
  withMotorboatName,
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

const wrongProject = withPresentedContribution(state, "cabin", "cabin:01", 1);
assert.equal(wrongProject.projects.cabin.contributions, 0, "inactive project must never consume a contribution");

state = withPresentedContribution(state, "dock", "dock:01", 1);
assert.equal(state.projects.dock.contributions, 1);
assert.equal(state.projects.dock.visibleStage, 1);
assert.deepEqual(state.projects.dock.consumedBeatIds, ["dock:01"]);

const duplicate = withPresentedContribution(state, "dock", "dock:01", 2);
assert.equal(duplicate.projects.dock.contributions, 1, "duplicate beat must not consume a second contribution");
assert.equal(duplicate.projects.dock.visibleStage, 1, "duplicate beat must not mutate stage");

let lockedBoat = withPresentedContribution(empty, "motorboat", "motorboat:01", 1);
assert.equal(lockedBoat.projects.motorboat.contributions, 0, "motorboat cannot advance before 3/3");

function complete(projectState, project) {
  let current = withSelectedProject(projectState, project);
  for (let i = 1; i <= 16; i++) {
    const stage = Math.min(4, Math.ceil(i / 4));
    current = withPresentedContribution(current, project, `${project}:${String(i).padStart(2, "0")}`, stage);
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
assert.equal(projectCompletionReactionPending(jettyComplete, "boathouse"), false, "projects without authored completion reactions must not leave pending ghosts");
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


let bridge = withBackendClaimBaseline(createDefaultAct2RuntimeState(), 12);
bridge = withSelectedProject(bridge, "dock");
assert.equal(bridge.backendClaimBaseline, 12);
assert.equal(pendingBackendContributionCount(bridge, 12), 0);
assert.equal(nextAct2Contribution(bridge, 12), null);

let candidate = nextAct2Contribution(bridge, 15);
assert.equal(candidate?.beatId, "dock:01");
assert.equal(candidate?.visibleStage, 1);
assert.equal(candidate?.backlog, 3);

bridge = withPresentedContribution(bridge, "dock", candidate.beatId, candidate.visibleStage);
assert.equal(totalAct2Contributions(bridge), 1);
candidate = nextAct2Contribution(bridge, 15);
assert.equal(candidate?.beatId, "dock:02", "backlog must drain one authored beat at a time");
assert.equal(candidate?.backlog, 2);

const repeatedRefresh = nextAct2Contribution(bridge, 15);
assert.deepEqual(repeatedRefresh, candidate, "refresh/retry must not consume or skip a beat by itself");

bridge = withSelectedProject(bridge, "cabin");
candidate = nextAct2Contribution(bridge, 15);
assert.equal(candidate?.beatId, "cabin:01", "unconsumed authoritative backlog follows the active project only after player switches");

const baselineCannotMove = withBackendClaimBaseline(bridge, 999);
assert.equal(baselineCannotMove.backendClaimBaseline, 12, "Act 2 claim baseline is establish-once");

const boundaryState = withBackendClaimBaseline(createDefaultAct2RuntimeState(), 0);
let boundary = withSelectedProject(boundaryState, "dock");
for (let i = 1; i <= 3; i++) {
  const next = nextAct2Contribution(boundary, i);
  assert.equal(next?.visibleStage, 1, `dock beat ${i} must remain visual stage 1`);
  boundary = withPresentedContribution(boundary, "dock", next.beatId, next.visibleStage);
}
let fourth = nextAct2Contribution(boundary, 4);
assert.equal(fourth?.visibleStage, 2, "dock beat 4 is the authored 1/4→2/4 transition");

let purchaseGate = withBackendClaimBaseline(createDefaultAct2RuntimeState(), 0);
purchaseGate = withSelectedProject(purchaseGate, "dock");
for (let i = 1; i <= 6; i++) {
  const next = nextAct2Contribution(purchaseGate, i);
  purchaseGate = withPresentedContribution(purchaseGate, "dock", next.beatId, next.visibleStage);
}
assert.equal(purchaseGate.projects.dock.contributions, 6);
assert.equal(jettyPurchaseRequired(purchaseGate), true, "lifebuoy must gate jetty after contribution 6");
purchaseGate = withBackendStoryFlags(purchaseGate, { act2JettyLifebuoyOwned: true });
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
assert.ok(BOATHOUSE_STEERING_WHEEL_BEAT.body.includes("Mira: Hundra SysselBux."));

let boathouseGate = withBackendClaimBaseline(createDefaultAct2RuntimeState(), 0);
boathouseGate = withSelectedProject(boathouseGate, "boathouse");
for (let i = 1; i <= 9; i++) {
  const next = nextAct2Contribution(boathouseGate, i);
  boathouseGate = withPresentedContribution(boathouseGate, "boathouse", next.beatId, next.visibleStage);
}
assert.equal(boathouseGate.projects.boathouse.contributions, 9);
assert.equal(boathousePurchaseRequired(boathouseGate), true, "steering wheel must gate Båthuset between 9 and 10");
const countBeforeWheel = totalAct2Contributions(boathouseGate);
boathouseGate = withBackendStoryFlags(boathouseGate, { act2BoathouseSteeringWheelOwned: true });
assert.equal(boathousePurchaseRequired(boathouseGate), false);
assert.equal(totalAct2Contributions(boathouseGate), countBeforeWheel, "steering wheel purchase must be contribution-neutral");
assert.equal(nextAct2Contribution(boathouseGate, 10)?.beatId, "boathouse:10");

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

let motorboatGate = createDefaultAct2RuntimeState();
motorboatGate = complete(motorboatGate, "cabin");
motorboatGate = complete(motorboatGate, "dock");
motorboatGate = complete(motorboatGate, "boathouse");
motorboatGate = withBackendClaimBaseline(motorboatGate, 48);
motorboatGate = withSelectedProject(motorboatGate, "motorboat");
for (let i = 1; i <= 5; i++) {
  const next = nextAct2Contribution(motorboatGate, 48 + i);
  motorboatGate = withPresentedContribution(motorboatGate, "motorboat", next.beatId, next.visibleStage);
}
assert.equal(motorboatPartsPurchaseRequired(motorboatGate), true);
const beforeParts = totalAct2Contributions(motorboatGate);
motorboatGate = withBackendStoryFlags(motorboatGate, { act2MotorboatPartsOwned: true });
assert.equal(motorboatPartsPurchaseRequired(motorboatGate), false);
assert.equal(totalAct2Contributions(motorboatGate), beforeParts, "parts purchase must be contribution-neutral");
for (let i = 6; i <= 12; i++) {
  const next = nextAct2Contribution(motorboatGate, 48 + i);
  motorboatGate = withPresentedContribution(motorboatGate, "motorboat", next.beatId, next.visibleStage);
}
assert.equal(motorboatNamingRequired(motorboatGate), true);
const beforeName = totalAct2Contributions(motorboatGate);
motorboatGate = withMotorboatName(motorboatGate, "  Sjöbusen  ");
assert.equal(motorboatGate.motorboatName, "Sjöbusen");
assert.equal(motorboatNamingRequired(motorboatGate), false);
assert.equal(totalAct2Contributions(motorboatGate), beforeName, "boat naming must be contribution-neutral");

assert.equal(ACT2_FINALE_BEATS.length, 6, "Act 2 finale must keep six restart-safe story beats");
assert.equal(ACT2_FINALE_BEATS[1].title, "Någon är där");
assert.equal(ACT2_FINALE_BEATS[2].title, "De kom");
assert.ok(ACT2_FINALE_BEATS[3].body.includes("Alve: Det är min kompis."));
assert.ok(ACT2_FINALE_BEATS[4].body.includes("Alve: Det är bättre."));
assert.ok(ACT2_FINALE_BEATS[5].body.includes("Alve: Vi får se."));

let finaleState = createDefaultAct2RuntimeState();
finaleState = complete(finaleState, "cabin");
finaleState = complete(finaleState, "dock");
finaleState = complete(finaleState, "boathouse");
finaleState = complete(finaleState, "motorboat");
assert.equal(act2FinalePending(finaleState), true);
assert.equal(finaleState.finaleIndex, 0);
for (let i = 0; i < 5; i++) finaleState = advanceAct2Finale(finaleState);
assert.equal(finaleState.finaleIndex, 5);
assert.equal(finaleState.familyFinaleConsumed, true);
assert.equal(finaleState.epilogueConsumed, false);
finaleState = advanceAct2Finale(finaleState);
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
  assert.equal(insideBlockedFootprint, false, `Alve placeholder work positions must remain walkable for ${project}`);
}

const lakeGameSource = fs.readFileSync(new URL("../src/game/createAct2LakeGame.ts", import.meta.url), "utf8");
assert.ok(lakeGameSource.includes('setActiveProject: (project: Act2RestorationProject | null) => void'), "lake runtime must expose active-project positioning for Alve");
assert.ok(lakeGameSource.includes('setAlveTurnInAvailable: (available: boolean) => void'), "lake runtime must expose pending turn-in marker state");
assert.ok(lakeGameSource.includes("distance <= 135"), "Alve quest hand-in must require the child to be physically nearby");
assert.ok(lakeGameSource.includes("options.onAlveTurnIn?.()"), "nearby Alve interaction must open the Act 2 turn-in");
assert.ok(lakeGameSource.includes("event.stopPropagation()"), "Alve taps must not fall through to the generic touch-to-move handler");
assert.ok(lakeGameSource.includes("Tryck på Alve"), "nearby pending turn-in must give explicit world feedback");
assert.ok(lakeGameSource.includes("facePlayerTowardAlve()"), "child should face Alve when the hand-in interaction begins");
assert.ok(lakeGameSource.includes('this.add.text(0, -133, "!"'), "pending Act 2 turn-in must show a world marker on Alve");
assert.ok(lakeGameSource.includes('setInteractive({ useHandCursor: true })'), "Alve placeholder must already be a future interaction target");
assert.ok(lakeGameSource.includes('ACT2_ALVE_WORK_POSITIONS[project]'), "Alve must derive his position from the active restoration project");

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

assert.ok(page.includes('{ speaker: "unknown", text: "Alve.", nameReveal: true }'), "Alve nameplate must still be Barnet on his name reveal line");
assert.ok(page.includes('{ speaker: "alve", text: "Okej, {childName}.'), "the line after name reveal must use Alve nameplate");
assert.ok(page.includes('{ speaker: "unknown", text: "Varför?" }'), "unknown Alve must own the pre-introduction Varför line");
assert.ok(page.includes('🔒 Motorbåten'), "motorboat must remain visible while locked");
assert.ok(page.includes('prerequisiteCompletionCount(state)'), "project selector must derive 0/3→3/3 from canonical state");
assert.ok(page.includes('(["cabin", "dock"] as const)'), "production route must derive completion reactions from the authored reaction set");
assert.ok(page.includes("CABIN_WAITING_REACTION"), "production route must present the canonical Cabin waiting reaction");
assert.ok(page.includes("JETTY_COMPLETION_REACTION"), "production route must present the canonical jetty completion reaction");
assert.ok(page.includes("CABIN_CONTRIBUTION_BEATS[contributionCandidate.number - 1]"), "production route must consume the canonical Cabin contribution track");
assert.ok(page.includes("BOATHOUSE_CONTRIBUTION_BEATS[contributionCandidate.number - 1]"), "production route must consume the canonical Båthuset contribution track");
assert.ok(page.includes("MOTORBOAT_CONTRIBUTION_BEATS[contributionCandidate.number - 1]"), "production route must consume the canonical Motorbåten contribution track");
assert.ok(page.includes("motorboatNamingRequired(state)"), "Motorbåten naming gate must be persisted and contribution-neutral");
assert.ok(page.includes("ACT2_FINALE_BEATS[state.finaleIndex]"), "production route must resume the persisted Act 2 finale");
assert.ok(page.includes("setActiveProject(state.selectedProject)"), "production route must move Alve when the active project changes");
assert.ok(page.includes("onAlveTurnIn: () => setContributionTurnInOpen(true)"), "Alve interaction must explicitly arm the pending contribution Story Moment");
assert.ok(page.includes("hasPendingAlveTurnIn(latest, backendWorldProgression)"), "restart must restore Alve turn-in marker immediately when a pending contribution already exists");
assert.ok(page.includes("contributionTurnInOpen && contributionCandidate"), "backend polling must not auto-open contribution Story Moments");
assert.ok(page.includes("setContributionTurnInOpen(false);"), "finishing one beat must close turn-in so backlog cannot auto-chain");
assert.ok(page.includes("Ett klart uppdrag väntar hos Alve."), "HUD should point the child toward Alve rather than bypassing world interaction");

const village = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
assert.ok(village.includes('clinicCompletionSeen && <a href="/act2/"'), "Act 2 trigger must remain gated by completed Clinic finale");
const storyShop = fs.readFileSync(new URL("../src/backend/storyShop.ts", import.meta.url), "utf8");
assert.ok(storyShop.includes('ACT2_JETTY_LIFEBUOY_PRICE = 300'), "jetty lifebuoy price must stay aligned with locked provisional balance");
assert.ok(storyShop.includes('ACT2_BOATHOUSE_STEERING_WHEEL_PRICE = 100'), "Båthuset steering wheel price must stay aligned with locked provisional balance");
assert.ok(storyShop.includes('ACT2_MOTORBOAT_PARTS_PRICE = 150'), "Motorbåten parts price must stay at locked 150 SysselBux");
assert.ok(storyShop.includes('purchaseStoryItem("act2_jetty_lifebuoy")'), "jetty lifebuoy must use the atomic story purchase RPC");
assert.ok(village.includes("Livboj till bryggan"), "Mira must expose the Act 2 lifebuoy in her real shop");
assert.ok(village.includes("jettyPurchaseRequired(act2)"), "Mira stock must derive from Act 2 progress, not a permanent global item");
assert.ok(village.includes("Ratt till lådbilen"), "Mira must expose the Båthuset steering wheel in her real shop");
assert.ok(village.includes("boathousePurchaseRequired(act2)"), "steering wheel stock must derive from Båthuset progress");
assert.ok(village.includes("Reservdelspaket till motorbåten"), "Mira must expose the Motorbåten parts package");
assert.ok(village.includes("motorboatPartsPurchaseRequired(act2)"), "parts stock must derive from Motorbåten progress");

const childFacingStorySources = [
  "../src/game/act2CabinStory.ts",
  "../src/game/act2JettyStory.ts",
  "../src/game/act2BoathouseStory.ts",
  "../src/game/act2MotorboatStory.ts",
  "../src/game/act2FinaleStory.ts",
].map((path) => fs.readFileSync(new URL(path, import.meta.url), "utf8"));
const childFacingForbidden = ["Adam:", "wallet-loopen", "authoritative", "Contribution 16 completes", "utan tekniska motorinstruktioner"];
for (const forbidden of childFacingForbidden) {
  assert.equal(childFacingStorySources.some((source) => source.includes(forbidden)), false, `runtime story source leaked internal text: ${forbidden}`);
}
assert.ok(page.includes("clinicCompletionSeen !== true"), "direct /act2 access must be hard-gated by the Act 1 Clinic completion flag");
assert.equal(page.includes("void saveAct2RuntimeState(next);"), false, "backend polling must not persist asynchronously inside a React state setter");
assert.ok(MOTORBOAT_CONTRIBUTION_BEATS[5].body[0].includes("redan betalt"), "Motorbåten 6/16 must be a post-purchase scene and must not charge the wallet twice");
assert.equal(MOTORBOAT_CONTRIBUTION_BEATS[5].body.some((line) => line.includes("150 SysselBux")), false, "post-purchase Motorbåten beat must not repeat the wallet transaction");

const cabinStorySource = fs.readFileSync(new URL("../src/game/act2CabinStory.ts", import.meta.url), "utf8");
const motorboatStorySource = fs.readFileSync(new URL("../src/game/act2MotorboatStory.ts", import.meta.url), "utf8");
assert.ok(!cabinStorySource.includes("## Motorbåten restoration arc"), "runtime story sources must not leak design-document prose");
assert.ok(!cabinStorySource.includes("Locked completion beat:"), "runtime story sources must stop at authored child-facing content");
assert.ok(!motorboatStorySource.includes("wallet-loopen"), "runtime story sources must not expose backend implementation language");
assert.ok(!motorboatStorySource.includes("utan tekniska motorinstruktioner"), "runtime narration must not expose authoring instructions");

console.log("Act 2 vertical-slice state/route contract PASS");
