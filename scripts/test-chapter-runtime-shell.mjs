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

assert.match(
  act2,
  /chapterBootMayLoad\(\{ debug, productionEnabled \}\)/,
  "Act 2 boot side-effect boundary must use the shared chapter shell",
);
assert.match(
  act2,
  /deriveChapterRuntimeShell\(\{ ready, debug, productionEnabled, accessAllowed: act2AccessAllowed \}\)/,
  "Act 2 route rendering must derive its shell status centrally",
);
assert.doesNotMatch(
  act2,
  /if \(!debug && !productionEnabled\)/,
  "Act 2 must not retain the retired local shipping-lock decision",
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
assert.doesNotMatch(
  act2,
  /return <main className="parent-page"><p>Laddar sjön/,
  "Act 2 must not retain a local loading boundary",
);
assert.match(
  act2,
  /deriveChapterRuntimeOverlay\(chapterCardVisible, storyUiVisible\)/,
  "Act 2 must derive blocking overlay and world-input authority through the shared chapter shell",
);
assert.match(
  act2,
  /setWorldInputEnabled\(runtimeOverlay\.worldInputEnabled\)/,
  "Phaser world input must consume the same shared overlay result as runtime UI",
);
assert.match(
  act2,
  /blockingOverlayVisible: runtimeOverlay\.blockingOverlayVisible/,
  "GameUiShell must consume the same shared overlay result as Phaser world input",
);
assert.doesNotMatch(
  act2,
  /const worldBlocked =/,
  "Act 2 must not retain a second local world-block calculation",
);

console.log("PASS: shared chapter runtime shell owns boot/access status for Act 2");
