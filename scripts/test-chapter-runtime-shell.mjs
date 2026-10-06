import assert from "node:assert/strict";
import fs from "node:fs";

import {
  chapterBootMayLoad,
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
  /runtimeShellStatus === "shipping-locked" \|\| runtimeShellStatus === "progression-locked"/,
  "shared locked shell states must own the Act 2 locked route presentation",
);

console.log("PASS: shared chapter runtime shell owns boot/access status for Act 2");
