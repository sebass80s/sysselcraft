import assert from "node:assert/strict";
import fs from "node:fs";
import { deriveGameUiShell } from "../src/game/uiShellState.ts";
import { SYSTEM_ASSETS, SYSTEM_COMPONENT_IDS, CANONICAL_SYSTEMS } from "../src/runtime/systemRegistry.ts";

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

console.log(`Runtime 1.0 parity slice PASS (${shellFixtures.length} shell fixtures)`);
