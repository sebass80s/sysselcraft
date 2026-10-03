import assert from "node:assert/strict";
import fs from "node:fs";
import { deriveGameUiShell } from "../src/game/uiShellState.ts";
import { SYSTEM_ASSETS, SYSTEM_COMPONENT_IDS, CANONICAL_SYSTEMS } from "../src/runtime/systemRegistry.ts";
import { createStoryRegistry } from "../src/runtime/story/storyRegistry.ts";
import { historyEntriesFor, resolveReplayRequest } from "../src/runtime/story/storyHistory.ts";
import { ACT2_STORY_REGISTRY, ACT2_STORYLINE_IDS, act2HistoryProgress } from "../src/runtime/story/act2StoryRegistry.ts";
import { createDefaultAct2RuntimeState } from "../src/game/act2RuntimeState.ts";
import { ACT2_OPENING_BEATS } from "../src/game/act2OpeningStory.ts";
import { CABIN_CONTRIBUTION_BEATS } from "../src/game/act2CabinStory.ts";
import { JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT, JETTY_COMPLETION_REACTION } from "../src/game/act2JettyStory.ts";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../src/game/act2BoathouseStory.ts";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../src/game/act2MotorboatStory.ts";
import { ACT2_FINALE_BEATS } from "../src/game/act2FinaleStory.ts";

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



const markerRendererSource = fs.readFileSync(new URL("../src/runtime/interaction/markerRenderer.ts", import.meta.url), "utf8");
const act2LakeSource = fs.readFileSync(new URL("../src/game/createAct2LakeGame.ts", import.meta.url), "utf8");
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

console.log(`Runtime 1.0 parity slice PASS (${shellFixtures.length} shell fixtures + story/history fixtures)`);
