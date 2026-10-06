import assert from "node:assert/strict";
import fs from "node:fs";

import {
  chapterBootMayLoad,
  deriveChapterRuntimeOverlay,
  deriveChapterRuntimeShell,
} from "../src/runtime/chapter/chapterRuntimeShell.ts";

assert.equal(chapterBootMayLoad({ debug: false, productionEnabled: false }), false);
assert.equal(chapterBootMayLoad({ debug: false, productionEnabled: true }), true);
assert.equal(chapterBootMayLoad({ debug: true, productionEnabled: false }), true);
assert.equal(chapterBootMayLoad({ debug: true, productionEnabled: true }), true);

assert.equal(
  deriveChapterRuntimeShell({ ready: false, debug: false, productionEnabled: false, accessAllowed: false }),
  "loading",
  "loading must dominate lock presentation until boot resolves",
);
assert.equal(
  deriveChapterRuntimeShell({ ready: true, debug: false, productionEnabled: false, accessAllowed: true }),
  "shipping-locked",
  "disabled shipping route must stay locked even if progression would otherwise allow access",
);
assert.equal(
  deriveChapterRuntimeShell({ ready: true, debug: false, productionEnabled: true, accessAllowed: false }),
  "progression-locked",
  "production chapter must remain locked until predecessor/progression access allows it",
);
assert.equal(
  deriveChapterRuntimeShell({ ready: true, debug: false, productionEnabled: true, accessAllowed: true }),
  "active",
);
assert.equal(
  deriveChapterRuntimeShell({ ready: true, debug: true, productionEnabled: false, accessAllowed: false }),
  "active",
  "debug runtime intentionally bypasses shipping and progression access locks",
);

assert.deepEqual(
  deriveChapterRuntimeOverlay(false, false),
  { storyUiVisible: false, blockingOverlayVisible: false, worldInputEnabled: true },
);
assert.deepEqual(
  deriveChapterRuntimeOverlay(true, false),
  { storyUiVisible: false, blockingOverlayVisible: true, worldInputEnabled: false },
  "chapter intro/end card must block world input even when chapter story UI is otherwise idle",
);
assert.deepEqual(
  deriveChapterRuntimeOverlay(false, true),
  { storyUiVisible: true, blockingOverlayVisible: true, worldInputEnabled: false },
  "chapter-specific story UI must block world input through the shared shell",
);

const act2 = fs.readFileSync(new URL("../src/components/Act2Runtime.tsx", import.meta.url), "utf8");
const runtimeHost = fs.readFileSync(new URL("../src/runtime/chapter/useChapterRuntimeHost.ts", import.meta.url), "utf8");
const worldHost = fs.readFileSync(new URL("../src/runtime/chapter/useChapterWorldHost.ts", import.meta.url), "utf8");

assert.match(
  runtimeHost,
  /chapterBootMayLoad\(\{ debug, productionEnabled \}\)/,
  "shared chapter host must own the shipping-lock side-effect boundary",
);
assert.match(
  runtimeHost,
  /deriveChapterRuntimeShell\(\{[\s\S]*ready,[\s\S]*debug,[\s\S]*productionEnabled,[\s\S]*accessAllowed/,
  "shared chapter host must derive canonical loading/shipping/progression/active status",
);
assert.match(
  act2,
  /useChapterRuntimeHost<Act2RuntimeState, Act2RuntimeHostContext>/,
  "Act 2 must consume the shared chapter runtime host instead of owning boot status state",
);
assert.doesNotMatch(
  act2,
  /const \[ready, setReady\]/,
  "Act 2 must not retain local ready-state ownership",
);
assert.doesNotMatch(
  act2,
  /act2AccessAllowed/,
  "Act 2 must not retain local access-state ownership",
);
assert.doesNotMatch(
  act2,
  /chapterBootMayLoad\(/,
  "Act 2 must not duplicate the host shipping-lock boundary",
);
assert.doesNotMatch(
  act2,
  /deriveChapterRuntimeShell\(/,
  "Act 2 must not derive shell status outside the shared host",
);
assert.match(
  act2,
  /runtimeShellStatus !== "active"[\s\S]*<ChapterRuntimeBoundary/,
  "Act 2 loading/lock presentation must render through the shared chapter access boundary",
);
assert.match(
  act2,
  /returnHref=\{chapterRoute\("act1"\)\}/,
  "Act 2 access boundary must return through the canonical chapter registry",
);
assert.match(
  act2,
  /deriveChapterRuntimeOverlay\(chapterCardVisible, storyUiVisible\)/,
  "Act 2 must derive blocking overlay and world-input authority through the shared chapter shell",
);
assert.match(
  act2,
  /useChapterWorldHost\(\{/,
  "Act 2 must delegate world mount/sync/destroy lifecycle to the shared world host",
);
assert.match(
  worldHost,
  /destroy\(world\)/,
  "shared world host must own world cleanup",
);
assert.match(
  act2,
  /world\.setWorldInputEnabled\(snapshot\.worldInputEnabled\)/,
  "Act 2 world adapter must consume shared overlay authority through the world host snapshot",
);
assert.match(
  act2,
  /blockingOverlayVisible: runtimeOverlay\.blockingOverlayVisible/,
  "GameUiShell must consume the same shared overlay result as the world adapter",
);
assert.doesNotMatch(
  act2,
  /const worldBlocked =/,
  "Act 2 must not retain a second local world-block calculation",
);

console.log("PASS: shared chapter runtime hosts own boot/access and world lifecycle for Act 2");
