import assert from "node:assert/strict";
import { deriveGameUiShell } from "../src/game/uiShellState.ts";

const worldNoProject = deriveGameUiShell({
  worldReady: true,
  blockingOverlayVisible: false,
  projectStatusAvailable: false,
});
assert.deepEqual(worldNoProject, {
  mode: "world",
  showHud: true,
  showProjectStatus: false,
}, "global HUD must survive a valid world state with no selected project");

const worldWithProject = deriveGameUiShell({
  worldReady: true,
  blockingOverlayVisible: false,
  projectStatusAvailable: true,
});
assert.equal(worldWithProject.showHud, true);
assert.equal(worldWithProject.showProjectStatus, true);

const overlay = deriveGameUiShell({
  worldReady: true,
  blockingOverlayVisible: true,
  projectStatusAvailable: true,
});
assert.equal(overlay.mode, "overlay");
assert.equal(overlay.showHud, false);
assert.equal(overlay.showProjectStatus, false);

const notReady = deriveGameUiShell({
  worldReady: false,
  blockingOverlayVisible: false,
  projectStatusAvailable: true,
});
assert.equal(notReady.mode, "loading");
assert.equal(notReady.showHud, false);

const debug = deriveGameUiShell({
  debug: true,
  worldReady: true,
  blockingOverlayVisible: false,
  projectStatusAvailable: true,
});
assert.equal(debug.mode, "debug");
assert.equal(debug.showHud, false);

console.log("Game UI shell contract: PASS");
