import assert from "node:assert/strict";
import fs from "node:fs";

import {
  defineStoryPurchase,
  purchaseShortfall,
  resolveStoryPurchaseExit,
} from "../src/runtime/purchase/storyPurchaseFlow.ts";
import { ACT2_PURCHASE_CATALOG } from "../src/game/act2PurchaseCatalog.ts";

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


const demo = defineStoryPurchase({
  id: "demo_purchase",
  target: "demo-target",
  currency: "sysselbux",
  price: 75,
  presentation: {
    gate: { title: "Gate", text: "Text", detail: "Detail" },
    shop: { icon: "📦", title: "Shop", description: "Description", requirement: "Requirement" },
  },
});
assert.equal(demo.id, "demo_purchase");
assert.equal(demo.target, "demo-target");
assert.equal(demo.currency, "sysselbux");
assert.equal(demo.price, 75);

assert.deepEqual(
  Object.fromEntries(Object.entries(ACT2_PURCHASE_CATALOG).map(([project, item]) => [
    project,
    { id: item.id, target: item.target, currency: item.currency, price: item.price },
  ])),
  {
    dock: { id: "act2_jetty_lifebuoy", target: "dock", currency: "sysselbux", price: 200 },
    boathouse: { id: "act2_boathouse_steering_wheel", target: "boathouse", currency: "sysselbux", price: 200 },
    motorboat: { id: "act2_motorboat_parts", target: "motorboat", currency: "sysselbux", price: 200 },
  },
  "Act 2 purchase metadata must be chapter data using the shared story-purchase definition",
);
