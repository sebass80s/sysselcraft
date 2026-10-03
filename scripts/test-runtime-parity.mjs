import assert from "node:assert/strict";
import fs from "node:fs";
import { deriveGameUiShell } from "../src/game/uiShellState.ts";
import { SYSTEM_ASSETS, SYSTEM_COMPONENT_IDS, CANONICAL_SYSTEMS } from "../src/runtime/systemRegistry.ts";
import { createStoryRegistry } from "../src/runtime/story/storyRegistry.ts";
import { historyEntriesFor, resolveReplayRequest } from "../src/runtime/story/storyHistory.ts";
import { ACT2_STORY_REGISTRY, ACT2_STORYLINE_IDS, act2HistoryProgress } from "../src/runtime/story/act2StoryRegistry.ts";
import { createDefaultAct2RuntimeState } from "../src/game/act2RuntimeState.ts";
import { resolveInteraction, worldInputEnabled } from "../src/runtime/interaction/interactionContract.ts";
import { resolveInteractionPriority } from "../src/runtime/interaction/interactionPriority.ts";
import { ACT2_OPENING_BEATS } from "../src/game/act2OpeningStory.ts";
import { CABIN_CONTRIBUTION_BEATS } from "../src/game/act2CabinStory.ts";
import { JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT, JETTY_COMPLETION_REACTION } from "../src/game/act2JettyStory.ts";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../src/game/act2BoathouseStory.ts";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../src/game/act2MotorboatStory.ts";
import { ACT2_FINALE_BEATS } from "../src/game/act2FinaleStory.ts";

const villagePointerTargetFixtures = [
  {
    name: "scene pointer keeps Recycling ahead of overlapping Linus target",
    candidates: [
      { id: "ground", priority: 10, enabled: true },
      { id: "henning", priority: 20, enabled: false },
      { id: "shop", priority: 30, enabled: false },
      { id: "linus", priority: 40, enabled: true },
      { id: "recycling", priority: 50, enabled: true },
    ],
    expected: "recycling",
  },
  {
    name: "scene pointer keeps Shop ahead of overlapping Henning target",
    candidates: [
      { id: "ground", priority: 10, enabled: true },
      { id: "henning", priority: 20, enabled: true },
      { id: "shop", priority: 30, enabled: true },
      { id: "linus", priority: 40, enabled: false },
      { id: "recycling", priority: 50, enabled: false },
    ],
    expected: "shop",
  },
  {
    name: "scene pointer falls back to ground when no world target is hit",
    candidates: [
      { id: "ground", priority: 10, enabled: true },
      { id: "henning", priority: 20, enabled: false },
      { id: "shop", priority: 30, enabled: false },
      { id: "linus", priority: 40, enabled: false },
      { id: "recycling", priority: 50, enabled: false },
    ],
    expected: "ground",
  },
];

for (const fixture of villagePointerTargetFixtures) {
  assert.equal(resolveInteractionPriority(fixture.candidates)?.id, fixture.expected, fixture.name);
}

const henningPriorityFixtures = [
  {
    name: "Henning construction attention outranks story CTA and backend quest",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: true },
      { id: "construction-attention", priority: 40, enabled: true },
    ],
    expected: "construction-attention",
  },
  {
    name: "Henning Sol-tour CTA outranks backend quest",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: true },
      { id: "construction-attention", priority: 40, enabled: false },
    ],
    expected: "story-cta",
  },
  {
    name: "Henning backend quest outranks ordinary resident interaction",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: false },
      { id: "construction-attention", priority: 40, enabled: false },
    ],
    expected: "quest-source",
  },
  {
    name: "Henning falls back to ordinary resident interaction",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: false },
      { id: "story-cta", priority: 30, enabled: false },
      { id: "construction-attention", priority: 40, enabled: false },
    ],
    expected: "resident",
  },
];

for (const fixture of henningPriorityFixtures) {
  assert.equal(resolveInteractionPriority(fixture.candidates)?.id, fixture.expected, fixture.name);
}

const linusPriorityFixtures = [
  {
    name: "Linus construction attention outranks intro and quest",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: true },
      { id: "intro", priority: 40, enabled: true },
      { id: "construction-attention", priority: 50, enabled: true },
    ],
    expected: "construction-attention",
  },
  {
    name: "Linus intro outranks backend quest before onboarding completes",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: false },
      { id: "intro", priority: 40, enabled: true },
      { id: "construction-attention", priority: 50, enabled: false },
    ],
    expected: "intro",
  },
  {
    name: "Linus Sol-tour CTA outranks backend quest after onboarding",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: true },
      { id: "intro", priority: 40, enabled: false },
      { id: "construction-attention", priority: 50, enabled: false },
    ],
    expected: "story-cta",
  },
  {
    name: "Linus backend quest outranks ordinary resident interaction after intro",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: false },
      { id: "intro", priority: 40, enabled: false },
      { id: "construction-attention", priority: 50, enabled: false },
    ],
    expected: "quest-source",
  },
  {
    name: "Linus falls back to ordinary resident interaction",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: false },
      { id: "story-cta", priority: 30, enabled: false },
      { id: "intro", priority: 40, enabled: false },
      { id: "construction-attention", priority: 50, enabled: false },
    ],
    expected: "resident",
  },
];

for (const fixture of linusPriorityFixtures) {
  assert.equal(resolveInteractionPriority(fixture.candidates)?.id, fixture.expected, fixture.name);
}

const worldInputFixtures = [
  {
    name: "explicitly enabled world without blocking overlay accepts input",
    state: { enabled: true, blockingOverlayVisible: false },
    expected: true,
  },
  {
    name: "explicitly disabled world rejects input",
    state: { enabled: false, blockingOverlayVisible: false },
    expected: false,
  },
  {
    name: "blocking overlay rejects input even when world is otherwise enabled",
    state: { enabled: true, blockingOverlayVisible: true },
    expected: false,
  },
];

for (const fixture of worldInputFixtures) {
  assert.equal(worldInputEnabled(fixture.state), fixture.expected, fixture.name);
}

const interactionFixtures = [
  {
    name: "Alve turn-in activates inside accepted legacy radius",
    playerPosition: { x: 100, y: 100 },
    interaction: {
      id: "act2:alve-turn-in",
      kind: "npc",
      anchor: { x: 200, y: 100 },
      approachPoint: { x: 200, y: 158 },
      interactionRadius: 135,
      marker: "quest-turn-in",
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Alve turn-in resolves to authored approach point outside radius",
    playerPosition: { x: 20, y: 20 },
    interaction: {
      id: "act2:alve-turn-in",
      kind: "npc",
      anchor: { x: 200, y: 200 },
      approachPoint: { x: 200, y: 258 },
      interactionRadius: 135,
      marker: "quest-turn-in",
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 200, y: 258 },
  },
  {
    name: "disabled interaction cannot activate or approach",
    playerPosition: { x: 200, y: 200 },
    interaction: {
      id: "act2:alve-turn-in",
      kind: "npc",
      anchor: { x: 200, y: 200 },
      approachPoint: { x: 200, y: 258 },
      interactionRadius: 135,
      marker: "quest-turn-in",
      enabled: false,
    },
    expectedStatus: "disabled",
  },
  {
    name: "Village noticeboard activates within accepted 36px arrival radius",
    playerPosition: { x: 175, y: 394 },
    interaction: {
      id: "village:noticeboard",
      kind: "quest-source",
      anchor: { x: 175, y: 430 },
      approachPoint: { x: 175, y: 430 },
      interactionRadius: 36,
      marker: "quest-available",
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village noticeboard keeps approaching outside accepted arrival radius",
    playerPosition: { x: 175, y: 393 },
    interaction: {
      id: "village:noticeboard",
      kind: "quest-source",
      anchor: { x: 175, y: 430 },
      approachPoint: { x: 175, y: 430 },
      interactionRadius: 36,
      marker: "quest-available",
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 175, y: 430 },
  },
  {
    name: "Village Recycling activates within accepted 40px arrival radius",
    playerPosition: { x: 100, y: 140 },
    interaction: {
      id: "village:recycling",
      kind: "hotspot",
      anchor: { x: 100, y: 100 },
      approachPoint: { x: 100, y: 100 },
      interactionRadius: 40,
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village Recycling keeps approaching outside accepted arrival radius",
    playerPosition: { x: 100, y: 141 },
    interaction: {
      id: "village:recycling",
      kind: "hotspot",
      anchor: { x: 100, y: 100 },
      approachPoint: { x: 100, y: 100 },
      interactionRadius: 40,
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 100, y: 100 },
  },
  {
    name: "Village bottle message activates within accepted 38px arrival radius",
    playerPosition: { x: 835, y: 538 },
    interaction: {
      id: "village:bottle-message",
      kind: "hotspot",
      anchor: { x: 835, y: 500 },
      approachPoint: { x: 835, y: 500 },
      interactionRadius: 38,
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village bottle message keeps approaching outside accepted arrival radius",
    playerPosition: { x: 835, y: 539 },
    interaction: {
      id: "village:bottle-message",
      kind: "hotspot",
      anchor: { x: 835, y: 500 },
      approachPoint: { x: 835, y: 500 },
      interactionRadius: 38,
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 835, y: 500 },
  },
  {
    name: "Village Sol activates at accepted 95px resident radius",
    playerPosition: { x: 95, y: 0 },
    interaction: {
      id: "village:sol",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 835, y: 485 },
      interactionRadius: 95,
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village Sol keeps approaching outside accepted 95px resident radius",
    playerPosition: { x: 96, y: 0 },
    interaction: {
      id: "village:sol",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 835, y: 485 },
      interactionRadius: 95,
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 835, y: 485 },
  },
  {
    name: "Village Henning activates at accepted 95px resident radius",
    playerPosition: { x: 95, y: 0 },
    interaction: {
      id: "village:henning",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 370, y: 468 },
      interactionRadius: 95,
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village Henning keeps approaching outside accepted 95px resident radius",
    playerPosition: { x: 96, y: 0 },
    interaction: {
      id: "village:henning",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 370, y: 468 },
      interactionRadius: 95,
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 370, y: 468 },
  },
  {
    name: "Village construction attention activates within accepted 32px arrival radius",
    playerPosition: { x: 500, y: 532 },
    interaction: {
      id: "village:construction-attention:test",
      kind: "npc",
      anchor: { x: 500, y: 500 },
      approachPoint: { x: 500, y: 500 },
      interactionRadius: 32,
      marker: "npc-attention",
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village construction attention keeps approaching outside accepted arrival radius",
    playerPosition: { x: 500, y: 533 },
    interaction: {
      id: "village:construction-attention:test",
      kind: "npc",
      anchor: { x: 500, y: 500 },
      approachPoint: { x: 500, y: 500 },
      interactionRadius: 32,
      marker: "npc-attention",
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 500, y: 500 },
  },
];

for (const fixture of interactionFixtures) {
  const resolution = resolveInteraction(
    [fixture.interaction],
    { interactionId: fixture.interaction.id, requestedAt: fixture.interaction.anchor },
    fixture.playerPosition,
  );
  assert.equal(resolution.status, fixture.expectedStatus, fixture.name);
  if (fixture.expectedTarget) {
    assert.deepEqual(resolution.target, fixture.expectedTarget, fixture.name);
  }
}

const shellFixtures = [
  {
    name: "loading world hides global chrome",
    input: { worldReady: false, blockingOverlayVisible: false },
    expected: { mode: "loading", showHud: false, showProjectStatus: false },
  },
  {
    name: "blocking story overlay hides global chrome",
    input: { worldReady: true, blockingOverlayVisible: true },
    expected: { mode: "overlay", showHud: false, showProjectStatus: false },
  },
  {
    name: "playable world shows the same global chrome",
    input: { worldReady: true, blockingOverlayVisible: false },
    expected: { mode: "world", showHud: true, showProjectStatus: false },
  },
  {
    name: "contextual status never owns HUD visibility",
    input: { worldReady: true, blockingOverlayVisible: false, projectStatusAvailable: true },
    expected: { mode: "world", showHud: true, showProjectStatus: true },
  },
  {
    name: "debug harness does not render production chrome",
    input: { debug: true, worldReady: true, blockingOverlayVisible: false },
    expected: { mode: "debug", showHud: false, showProjectStatus: false },
  },
];

for (const fixture of shellFixtures) {
  assert.deepEqual(deriveGameUiShell(fixture.input), fixture.expected, fixture.name);
}

assert.equal(
  SYSTEM_ASSETS.brandLogo,
  "/assets/village/sysselcraft-logo.png",
  "Runtime 1.0 must reuse the accepted canonical SysselCraft logo",
);

const ids = new Set(CANONICAL_SYSTEMS.map((entry) => entry.id));
for (const id of Object.values(SYSTEM_COMPONENT_IDS)) {
  assert.ok(ids.has(id), `canonical system registry must register ${id}`);
}

const shellSource = fs.readFileSync(new URL("../src/runtime/ui/GameUiShell.tsx", import.meta.url), "utf8");
assert.ok(
  shellSource.includes("SYSTEM_ASSETS.brandLogo"),
  "GameUiShell must resolve the brand logo through the Canonical System Registry",
);
assert.ok(
  !shellSource.includes('src="/assets/village/sysselcraft-logo.png"'),
  "GameUiShell must not hardcode the canonical logo path",
);
assert.ok(
  shellSource.includes('aria-label="Öppna SysselCraft-menyn"'),
  "Runtime 1.0 must preserve the accepted menu affordance",
);
assert.ok(
  shellSource.includes('aria-label="Resurser"'),
  "Runtime 1.0 must preserve the accepted resource HUD semantics",
);



const storyRegistry = createStoryRegistry([
  {
    id: "act2:cabin:01",
    chapterId: "act2",
    storylineId: "act2:cabin",
    title: "Stugan 1",
    body: ["Alve: Första raden.", "Barnet: Andra raden."],
    history: { mode: "after-storyline-complete" },
  },
  {
    id: "act2:cabin:02",
    chapterId: "act2",
    storylineId: "act2:cabin",
    title: "Stugan 2",
    body: ["Alve: Tredje raden."],
    history: { mode: "after-storyline-complete" },
  },
  {
    id: "act2:opening:01",
    chapterId: "act2",
    storylineId: "act2:opening",
    title: "Inledning",
    body: ["Barnet: Valpen?"],
    history: { mode: "after-beat-complete" },
  },
  {
    id: "act3:intro:01",
    chapterId: "act3",
    storylineId: "act3:intro",
    title: "På andra sidan",
    body: ["Barnet: Här är det nytt."],
    history: { mode: "after-storyline-complete" },
  },
]);

const hiddenHistory = historyEntriesFor(storyRegistry, {
  completedBeatIds: new Set(["act2:cabin:01"]),
  completedStorylineIds: new Set(),
});
assert.deepEqual(
  hiddenHistory.map(({ beat }) => beat.id),
  [],
  "storyline-gated beats must stay hidden until the whole storyline is complete",
);

const openingOnlyHistory = historyEntriesFor(storyRegistry, {
  completedBeatIds: new Set(["act2:opening:01"]),
  completedStorylineIds: new Set(),
});
assert.deepEqual(
  openingOnlyHistory.map(({ beat }) => beat.id),
  ["act2:opening:01"],
  "beat-level history policy must expose only the completed beat",
);

const completedCabinHistory = historyEntriesFor(storyRegistry, {
  completedBeatIds: new Set(["act2:cabin:01", "act2:cabin:02"]),
  completedStorylineIds: new Set(["act2:cabin"]),
});
assert.deepEqual(
  completedCabinHistory.map(({ beat }) => beat.id),
  ["act2:cabin:01", "act2:cabin:02"],
  "completed storyline must expose its registered beats in authored order",
);

const replay = resolveReplayRequest(
  storyRegistry,
  {
    completedBeatIds: new Set(["act2:cabin:01", "act2:cabin:02"]),
    completedStorylineIds: new Set(["act2:cabin"]),
  },
  { beatId: "act2:cabin:01", startLineIndex: 999 },
);
assert.equal(replay?.lineIndex, 1, "history replay must clamp line index without mutating progress");

assert.throws(
  () => createStoryRegistry([
    {
      id: "bad:01",
      chapterId: "act3",
      storylineId: "cabin",
      title: "Bad",
      body: ["Nope"],
      history: { mode: "never" },
    },
  ]),
  /must be chapter-qualified/,
  "storyline ids must be globally stable and chapter-qualified",
);


const expectedAct2BeatCount =
  ACT2_OPENING_BEATS.length + CABIN_CONTRIBUTION_BEATS.length
  + JETTY_CONTRIBUTION_BEATS.length + BOATHOUSE_CONTRIBUTION_BEATS.length
  + MOTORBOAT_CONTRIBUTION_BEATS.length + ACT2_FINALE_BEATS.length + 3;

assert.equal(ACT2_STORY_REGISTRY.beats.length, expectedAct2BeatCount, "Act 2 registry must contain every replayable legacy beat exactly once");

const emptyAct2 = createDefaultAct2RuntimeState();
assert.equal(historyEntriesFor(ACT2_STORY_REGISTRY, act2HistoryProgress(emptyAct2)).length, 0, "fresh Act 2 exposes no History");

const cabinDone = {
  ...emptyAct2,
  openingComplete: true,
  projects: {
    ...emptyAct2.projects,
    cabin: { contributions:16, visibleStage:4, consumedBeatIds:CABIN_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
  },
};
const cabinDoneHistory = historyEntriesFor(ACT2_STORY_REGISTRY, act2HistoryProgress(cabinDone));
assert.equal(cabinDoneHistory.filter((entry)=>entry.storylineId===ACT2_STORYLINE_IDS.opening).length, ACT2_OPENING_BEATS.length);
assert.equal(cabinDoneHistory.filter((entry)=>entry.storylineId===ACT2_STORYLINE_IDS.cabin).length, CABIN_CONTRIBUTION_BEATS.length);
assert.equal(cabinDoneHistory.some((entry)=>entry.storylineId===ACT2_STORYLINE_IDS.dock), false, "unfinished Act 2 projects stay hidden");



function legacyAct2HistoryProjection(state) {
  const projected = [];
  if (state.openingComplete) {
    ACT2_OPENING_BEATS.forEach((beat,index)=>projected.push({
      group:"Inledning",
      id:`act2:opening:${String(index+1).padStart(2,"0")}`,
      title:beat.title,
    }));
  }
  const sources = {
    cabin:["Stugan",CABIN_CONTRIBUTION_BEATS],
    dock:["Bryggan",JETTY_CONTRIBUTION_BEATS],
    boathouse:["Båthuset",BOATHOUSE_CONTRIBUTION_BEATS],
    motorboat:["Motorbåten",MOTORBOAT_CONTRIBUTION_BEATS],
  };
  for (const project of ["cabin","dock","boathouse","motorboat"]) {
    if (!state.projects[project].complete) continue;
    const [group,beats]=sources[project];
    beats.forEach((beat,index)=>projected.push({
      group,
      id:`act2:${project}:${String(index+1).padStart(2,"0")}`,
      title:beat.title,
    }));
  }
  if (state.projects.dock.complete && state.jettyLifebuoyOwned) projected.push({
    group:"Bryggan", id:"act2:dock:lifebuoy", title:JETTY_LIFEBUOY_BEAT.title,
  });
  if (state.projects.boathouse.complete && state.boathouseSteeringWheelOwned) projected.push({
    group:"Båthuset", id:"act2:boathouse:steering-wheel", title:BOATHOUSE_STEERING_WHEEL_BEAT.title,
  });
  if (state.projects.dock.complete && state.consumedProjectCompletionIds.includes("dock:completion-reaction")) projected.push({
    group:"Bryggan", id:"act2:dock:completion-reaction", title:JETTY_COMPLETION_REACTION.title,
  });
  if (state.epilogueConsumed) {
    ACT2_FINALE_BEATS.forEach((beat,index)=>projected.push({
      group:"Finalen",
      id:`act2:finale:${String(index+1).padStart(2,"0")}`,
      title:beat.title,
    }));
  }
  return projected;
}

const historyGroupByStoryline = {
  [ACT2_STORYLINE_IDS.opening]:"Inledning",
  [ACT2_STORYLINE_IDS.cabin]:"Stugan",
  [ACT2_STORYLINE_IDS.dock]:"Bryggan",
  [ACT2_STORYLINE_IDS.boathouse]:"Båthuset",
  [ACT2_STORYLINE_IDS.motorboat]:"Motorbåten",
  [ACT2_STORYLINE_IDS.finale]:"Finalen",
};

function registryAct2HistoryProjection(state) {
  return historyEntriesFor(ACT2_STORY_REGISTRY,act2HistoryProgress(state)).map((entry)=>({
    group:historyGroupByStoryline[entry.storylineId],
    id:entry.beat.id,
    title:entry.beat.title,
  }));
}

function groupHistoryProjection(entries) {
  return entries.reduce((groups,entry)=>{
    let group=groups.find((candidate)=>candidate.label===entry.group);
    if(!group) {
      group={ label:entry.group, entries:[] };
      groups.push(group);
    }
    group.entries.push({ id:entry.id, title:entry.title });
    return groups;
  },[]);
}

function assertAct2HistoryParity(name,state) {
  assert.deepEqual(
    groupHistoryProjection(registryAct2HistoryProjection(state)),
    groupHistoryProjection(legacyAct2HistoryProjection(state)),
    `Act 2 History parity failed: ${name}`,
  );
}

assertAct2HistoryParity("fresh", emptyAct2);
assertAct2HistoryParity("opening + cabin complete", cabinDone);

const dockDone = {
  ...emptyAct2,
  projects:{
    ...emptyAct2.projects,
    dock:{ contributions:16, visibleStage:4, consumedBeatIds:JETTY_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
  },
  jettyLifebuoyOwned:true,
  consumedProjectCompletionIds:["dock:completion-reaction"],
};
assertAct2HistoryParity("dock special beats",dockDone);

const boathouseDone = {
  ...emptyAct2,
  projects:{
    ...emptyAct2.projects,
    boathouse:{ contributions:16, visibleStage:4, consumedBeatIds:BOATHOUSE_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
  },
  boathouseSteeringWheelOwned:true,
};
assertAct2HistoryParity("boathouse steering wheel",boathouseDone);

const fullyCompletedAct2 = {
  ...emptyAct2,
  openingComplete:true,
  projects:{
    cabin:{ contributions:16, visibleStage:4, consumedBeatIds:CABIN_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
    dock:{ contributions:16, visibleStage:4, consumedBeatIds:JETTY_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
    boathouse:{ contributions:16, visibleStage:4, consumedBeatIds:BOATHOUSE_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
    motorboat:{ contributions:16, visibleStage:4, consumedBeatIds:MOTORBOAT_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
  },
  jettyLifebuoyOwned:true,
  boathouseSteeringWheelOwned:true,
  consumedProjectCompletionIds:["dock:completion-reaction"],
  epilogueConsumed:true,
};
assertAct2HistoryParity("fully completed Act 2",fullyCompletedAct2);



const act2RuntimeSource = fs.readFileSync(new URL("../src/components/Act2Runtime.tsx", import.meta.url), "utf8");
assert.ok(
  act2RuntimeSource.includes("<GameUiShell"),
  "Act 2 development runtime must consume the shared GameUiShell",
);
assert.ok(
  !act2RuntimeSource.includes('src="/assets/village/sysselcraft-logo.png"'),
  "Act 2 runtime must not hardcode the global brand asset once migrated to GameUiShell",
);
assert.ok(
  !act2RuntimeSource.includes('<header className="prototype-header act2-hud-input-shield"'),
  "Act 2 runtime must not keep a parallel legacy HUD implementation",
);



const villageRuntimeSource = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
assert.ok(
  villageRuntimeSource.includes("<GameUiShell"),
  "Village development runtime must consume the shared GameUiShell",
);
assert.ok(
  !villageRuntimeSource.includes('src="/assets/village/sysselcraft-logo.png"'),
  "Village runtime must not hardcode the global brand asset once migrated to GameUiShell",
);
assert.ok(
  !villageRuntimeSource.includes('<header className="prototype-header">'),
  "Village runtime must not keep a parallel legacy HUD implementation",
);
assert.ok(
  villageRuntimeSource.includes("const villageBlockingOverlayVisible ="),
  "Village presentation must derive one blocking-overlay authority",
);
for (const stateName of ["dialogueOpen", "mainMenuOpen", "parentMenuOpen", "childPairingOpen", "roomOpen", "dogHomeOpen", "saveError"]) {
  assert.ok(
    villageRuntimeSource.includes(stateName),
    `Village blocking-overlay authority must account for ${stateName}`,
  );
}
assert.ok(
  !villageRuntimeSource.includes("setConstructionDialogueOpen"),
  "Village presentation must not manually toggle the retired construction-dialogue input lock",
);



const markerRendererSource = fs.readFileSync(new URL("../src/runtime/interaction/markerRenderer.ts", import.meta.url), "utf8");
const act2LakeSource = fs.readFileSync(new URL("../src/game/createAct2LakeGame.ts", import.meta.url), "utf8");
assert.ok(
  act2LakeSource.includes("worldInputEnabled({ enabled: requestedWorldInputEnabled"),
  "Act 2 Lake must consume the shared world-input authority",
);
assert.ok(
  act2LakeSource.includes("update(_time: number, delta: number)"),
  "Act 2 Lake update loop must remain present for world-input parity coverage",
);
assert.ok(
  markerRendererSource.includes('GLYPH_BY_KIND'),
  "Interaction System must own the canonical marker glyph mapping",
);
assert.ok(
  act2LakeSource.includes('createInteractionMarker(this, {'),
  "Act 2 must consume the canonical interaction marker renderer",
);
assert.ok(
  !act2LakeSource.includes('const turnInBubble = this.add.circle'),
  "Act 2 must not keep a local turn-in marker implementation",
);



const villageGameSource = fs.readFileSync(new URL("../src/game/createVillageGame.ts", import.meta.url), "utf8");
assert.ok(
  villageGameSource.includes("setWorldInputEnabled: (enabled: boolean) => void"),
  "Village handle must expose the canonical world-input contract",
);
assert.ok(
  villageGameSource.includes("worldInputEnabled({"),
  "Village movement/input must consume the shared world-input authority",
);
assert.ok(
  villageGameSource.includes("private acceptsWorldInput()"),
  "Village object interactions must share one world-input guard",
);
assert.ok(
  !villageGameSource.includes("constructionDialogueOpen"),
  "Village Phaser runtime must not retain the retired local dialogue-lock flag",
);
assert.ok(
  !villageGameSource.includes("setConstructionDialogueOpen"),
  "Village Phaser handle must not expose the retired dialogue-lock setter",
);
assert.ok(
  villageGameSource.includes("private resolveLinusIntent()"),
  "Village must centralize Linus base interaction priority",
);
assert.equal(
  (villageGameSource.match(/const linusIntent = this\.resolveLinusIntent\(\);/g) ?? []).length,
  3,
  "All three Linus base pointer entrypoints must consume the shared priority decision",
);
assert.equal(
  (villageGameSource.match(/requestedConstruction\.attention\?\.resident === \"linus\"/g) ?? []).length,
  1,
  "Linus base priority must not duplicate construction-attention checks outside resolveLinusIntent",
);
assert.ok(
  villageGameSource.includes("private syncLinusPriorityMarkers()"),
  "Linus marker presentation must consume the same centralized priority",
);
assert.ok(
  !villageGameSource.includes("syncLinusStoryMarker"),
  "Legacy Linus story-only marker sync must remain retired",
);
assert.equal(
  (villageGameSource.match(/this\.linusStoryMarker = createInteractionMarker/g) ?? []).length,
  1,
  "Linus story marker must have one canonical creation path",
);
assert.equal(
  (villageGameSource.match(/this\.linusQuestMarker = createInteractionMarker/g) ?? []).length,
  1,
  "Linus quest marker must have one canonical creation path",
);
assert.ok(
  villageGameSource.includes('if (intent === "intro")'),
  "Linus priority marker sync must render onboarding attention only when intro wins",
);
assert.ok(
  villageGameSource.includes('if (intent === "quest-source")'),
  "Linus priority marker sync must render quest marker only when quest intent wins",
);
assert.ok(
  villageGameSource.includes("private resolveHenningIntent()"),
  "Village must centralize Henning base interaction priority",
);
assert.ok(
  villageGameSource.includes('id: "village:henning"') &&
    villageGameSource.includes("interactionRadius: HENNING_INTERACTION_RADIUS"),
  "Village Henning arrival must use shared interaction resolution",
);
assert.ok(
  villageGameSource.includes("const HENNING_INTERACTION_RADIUS = 95"),
  "Village Henning must preserve the accepted 95px interaction radius",
);
assert.ok(
  villageGameSource.includes('id: "village:sol"') &&
    villageGameSource.includes("interactionRadius: SOL_INTERACTION_RADIUS"),
  "Village Sol arrival must use shared interaction resolution",
);
assert.ok(
  villageGameSource.includes("const SOL_INTERACTION_RADIUS = 95"),
  "Village Sol must preserve the accepted 95px interaction radius",
);
assert.ok(
  villageGameSource.includes('const scenePointerTarget = resolveInteractionPriority(['),
  "Village scene-level pointer hits must use explicit shared arbitration",
);
for (const [id, priority] of [["ground", 10], ["henning", 20], ["shop", 30], ["linus", 40], ["recycling", 50]]) {
  assert.ok(
    villageGameSource.includes(`{ id: "${id}", priority: ${priority},`),
    `Village scene pointer target ${id} must retain priority ${priority}`,
  );
}
assert.equal(
  (villageGameSource.match(/const henningIntent = this\.resolveHenningIntent\(\);/g) ?? []).length,
  2,
  "Henning scene and sprite entrypoints must consume the same priority decision",
);
assert.equal(
  (villageGameSource.match(/requestedConstruction\.attention\?\.resident === \"henning\"/g) ?? []).length,
  1,
  "Henning base priority must not duplicate construction-attention checks outside resolveHenningIntent",
);
assert.ok(
  villageGameSource.includes("private syncHenningPriorityMarker()"),
  "Henning quest marker must consume the centralized priority decision",
);
assert.equal(
  (villageGameSource.match(/this\.henningQuestMarker = createInteractionMarker/g) ?? []).length,
  1,
  "Henning quest marker must have one canonical creation path",
);
assert.ok(
  villageGameSource.includes('{ id: "story-cta", priority: 30, enabled: this.introComplete && requestedSolTourStop === "linus" }'),
  "Linus priority must include Sol-tour story CTA after onboarding",
);
assert.ok(
  villageGameSource.includes('{ id: "story-cta", priority: 30, enabled: requestedSolTourStop === "bakery" }'),
  "Henning priority must include Sol-tour story CTA",
);
assert.ok(
  villageGameSource.includes("private syncSolTourMarker()"),
  "Sol-tour marker presentation must have one explicit synchronization path",
);
assert.ok(
  villageGameSource.includes('if (stop === "bakery" && this.resolveHenningIntent() !== "story-cta") return;'),
  "Bakery Sol-tour marker must render only when story CTA wins",
);
assert.ok(
  villageGameSource.includes('if (stop === "linus" && this.resolveLinusIntent() !== "story-cta") return;'),
  "Linus Sol-tour marker must render only when story CTA wins",
);
assert.ok(
  villageGameSource.includes('if (this.resolveHenningIntent() === "quest-source") callbacks.onQuestSourceInteract?.("bakery");'),
  "Henning arrival must route to quest callback only when quest intent still wins",
);
assert.ok(
  villageGameSource.includes('if (this.resolveLinusIntent() === "quest-source") callbacks.onQuestSourceInteract?.("linus");'),
  "Linus arrival must route to quest callback only when quest intent still wins",
);
assert.ok(
  villageGameSource.includes("this.residents.linus = this.linus;\n      this.syncLinusPriorityMarkers();"),
  "Linus marker arbitration must initialize immediately after the sprite exists",
);
assert.ok(
  villageGameSource.includes("resident.setPosition(attention.position.x, attention.position.y)") &&
    villageGameSource.includes("this.syncLinusPriorityMarkers();"),
  "Linus priority markers must resync when construction presentation moves a resident",
);
assert.equal(
  (villageGameSource.match(/createInteractionMarker\(this, \{/g) ?? []).length,
  3,
  "Village quest sources must all use the canonical interaction marker renderer",
);
assert.ok(
  !villageGameSource.includes("fillCircle(0, 0, 27)"),
  "Village must not retain local quest badge drawing after marker migration",
);



assert.equal(
  (villageGameSource.match(/kind: "npc-attention"/g) ?? []).length,
  2,
  "Village story/NPC attention markers must use the canonical npc-attention renderer",
);
assert.ok(
  !villageGameSource.includes("fillRoundedRect(-29, -21, 58, 42, 14)"),
  "Village must not retain local story-attention bubble drawing",
);

console.log(`Runtime 1.0 parity slice PASS (${shellFixtures.length} shell fixtures + ${villagePointerTargetFixtures.length} pointer-target fixtures + ${linusPriorityFixtures.length} Linus-priority fixtures + ${henningPriorityFixtures.length} Henning-priority fixtures + ${worldInputFixtures.length} world-input fixtures + ${interactionFixtures.length} interaction fixtures + story/history fixtures)`);
