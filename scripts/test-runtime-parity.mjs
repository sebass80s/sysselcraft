import assert from "node:assert/strict";
import fs from "node:fs";
import { deriveGameUiShell } from "../src/game/uiShellState.ts";
import { SYSTEM_ASSETS, SYSTEM_COMPONENT_IDS, CANONICAL_SYSTEMS } from "../src/runtime/systemRegistry.ts";
import { createStoryRegistry } from "../src/runtime/story/storyRegistry.ts";
import { historyEntriesFor, resolveReplayRequest } from "../src/runtime/story/storyHistory.ts";

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

console.log(`Runtime 1.0 parity slice PASS (${shellFixtures.length} shell fixtures + story/history fixtures)`);
