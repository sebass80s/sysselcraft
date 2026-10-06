import assert from "node:assert/strict";
import fs from "node:fs";

import {
  purchaseShortfall,
  resolveStoryPurchaseExit,
} from "../src/runtime/purchase/storyPurchaseFlow.ts";

assert.equal(purchaseShortfall(50, 200), 150);
assert.equal(purchaseShortfall(200, 200), 0);
assert.equal(purchaseShortfall(350, 200), 0);
assert.equal(purchaseShortfall(-10, 200), 200, "negative balances must normalize to zero");
assert.equal(purchaseShortfall(Number.NaN, 200), 200, "invalid balances must normalize to zero");
assert.equal(purchaseShortfall(50, Number.NaN), 0, "invalid prices must normalize to zero");

assert.deepEqual(
  resolveStoryPurchaseExit("dock", false),
  { action: "stay" },
  "failed or unaffordable required purchase must never resume the blocked story",
);
assert.deepEqual(
  resolveStoryPurchaseExit("dock", true),
  { action: "resume", target: "dock" },
  "owned required purchase may resume the blocked story target",
);

const village = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
assert.match(village, /purchaseShortfall\(current, price\)/, "Act 2 insufficient-funds copy must use shared shortfall calculation");
assert.match(village, /resolveStoryPurchaseExit\(project, purchaseOwned\)/, "Act 2 shop close must use shared purchase exit semantics");
assert.match(village, /exit\.action === "resume"[\s\S]*act2ResumeHref\(exit\.target\)/, "only shared resume decisions may navigate back to the blocked Act 2 story");

console.log("PASS: shared story purchase flow prevents forced insufficient-funds loops");
