import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

import {
  defineStoryPurchase,
  purchaseShortfall,
  resolveStoryPurchaseExit,
} from "../src/runtime/purchase/storyPurchaseFlow.ts";
import { ACT2_PURCHASE_CATALOG } from "../src/game/act2PurchaseCatalog.ts";


function loadTsModule(file, dependencies) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function("exports", "require", code)(exports, (name) => {
    assert.ok(name in dependencies, `Unexpected purchase transport dependency: ${name}`);
    return dependencies[name];
  });
  return exports;
}

let rpcArgs = null;
const storyShop = loadTsModule("../src/backend/storyShop.ts", {
  "./supabaseClient": {
    getSupabaseBrowserClient: () => ({
      rpc: async (name, args) => {
        rpcArgs = { name, args };
        return {
          data: {
            child_id: "child-1",
            syssel_bux: 125,
            already_owned: false,
            world_flags: { demo_owned: true },
          },
          error: null,
        };
      },
    }),
  },
});

await storyShop.purchaseStoryItem("act3_demo_item");
assert.deepEqual(
  rpcArgs,
  { name: "purchase_story_item", args: { p_item_key: "act3_demo_item" } },
  "generic Story Shop transport must accept future catalog item ids without chapter-specific client wrappers",
);
await assert.rejects(
  () => storyShop.purchaseStoryItem("   "),
  /Story item key saknas/,
  "generic Story Shop transport must reject empty item ids before RPC",
);

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
assert.match(village, /resolveStoryPurchaseExit\(target, purchaseOwned\)/, "Mira shop close must use shared purchase exit semantics");
assert.match(village, /exit\.action === "resume"[\s\S]*registration\.resumeHref\(exit\.target\)/, "only the resolved Story Purchase registration may navigate back to the blocked story");

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

const storyShopSource = fs.readFileSync(new URL("../src/backend/storyShop.ts", import.meta.url), "utf8");
assert.doesNotMatch(
  storyShopSource,
  /purchaseAct2JettyLifebuoy|purchaseAct2BoathouseSteeringWheel|purchaseAct2MotorboatParts/,
  "Story Shop transport must not require chapter-specific Act 2 purchase wrappers",
);

const villageSource = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
assert.doesNotMatch(
  villageSource,
  /buyAct2MotorboatParts|buyAct2BoathouseSteeringWheel|buyAct2JettyLifebuoy/,
  "Mira Story Shop must not keep one purchase function per Act 2 catalog item",
);
assert.match(
  villageSource,
  /async function buyStoryPurchaseItem\([\s\S]*registration: StoryPurchaseRegistration<string>,[\s\S]*target: string/,
  "Mira Story Shop must dispatch registered chapter items through one generic purchase path",
);
assert.match(
  villageSource,
  /const item = registration\.catalog\[target\]/,
  "Mira Story Shop purchase execution must derive item data from the resolved registration catalog",
);
assert.match(
  villageSource,
  /storyPurchaseSources\.flatMap\(\(\{ registration, snapshot \}\) =>/,
  "Mira Story Shop must render Story Purchase items from all registered chapter sources",
);
assert.match(
  villageSource,
  /onClick=\{\(\) => void buyStoryPurchaseItem\(registration, target\)\}/,
  "registry-rendered Story Purchase items must share the generic purchase dispatcher",
);

const act2PurchaseAdapterSource = fs.readFileSync(new URL("../src/game/act2StoryPurchaseAdapter.ts", import.meta.url), "utf8");
assert.match(
  act2PurchaseAdapterSource,
  /export function applyAct2StoryPurchaseResult/,
  "Act 2 must own post-purchase state and reaction behavior behind a chapter adapter",
);
assert.match(
  act2PurchaseAdapterSource,
  /export function deriveAct2StoryPurchaseStatus/,
  "Act 2 must expose catalog purchase owned/needed status through its adapter",
);
assert.match(
  villageSource,
  /registration\.applyPurchaseResult\(\s*target,\s*purchase\.worldFlags/,
  "Mira must delegate post-purchase mutation to the resolved chapter registration",
);
assert.doesNotMatch(
  villageSource,
  /applyAct2StoryPurchaseResult|deriveAct2StoryPurchaseSnapshot|ACT2_PURCHASE_CATALOG/,
  "Mira must not import Act 2 purchase implementation details after registry migration",
);
assert.doesNotMatch(
  villageSource,
  /pendingPurchaseStory:\s*project/,
  "Mira must not own Act 2 purchase-story persistence details",
);
assert.doesNotMatch(
  villageSource,
  /Livbojen är er!|Ratten är er!|Reservdelspaketet är beställt!/,
  "Mira must not own Act 2 purchase success copy",
);

assert.match(
  villageSource,
  /useState<LoadedStoryPurchaseRegistration\[]>\(\[]\)/,
  "Village must keep registered Story Purchase sources instead of chapter-specific purchase state",
);
for (const retiredState of [
  "act2JettyLifebuoyNeeded",
  "act2JettyLifebuoyOwned",
  "act2BoathouseSteeringWheelNeeded",
  "act2BoathouseSteeringWheelOwned",
  "act2MotorboatPartsNeeded",
  "act2MotorboatPartsOwned",
]) {
  assert.equal(
    villageSource.includes(`const [${retiredState},`),
    false,
    `Village must not retain separate React state for ${retiredState}`,
  );
}
assert.match(
  villageSource,
  /const expectedChildId = await getPairedChildId\(\);[\s\S]*const snapshot = await handoff\.registration\.loadSnapshot\(\{ expectedChildId \}\);[\s\S]*setStoryPurchaseReturnContext\(\{ \.\.\.handoff, expectedChildId \}\)/,
  "direct Story Purchase handoff must load through the resolved registry entry",
);
assert.match(
  villageSource,
  /const storyPurchases = await loadRegisteredStoryPurchases\(\);[\s\S]*setStoryPurchaseSources\(storyPurchases\)/,
  "normal Mira shop open must load all registered Story Purchase sources",
);
assert.match(
  villageSource,
  /const localStatus = source\?\.snapshot\.status\[target\]/,
  "purchase dispatch must read owned/needed state from the resolved registration snapshot",
);
assert.match(
  villageSource,
  /const snapshot = await registration\.loadSnapshot\(\{ expectedChildId \}\);[\s\S]*const purchaseOwned = snapshot\.status\[target\]\?\.owned === true/,
  "contextual shop exit must refresh ownership through the resolved registry entry",
);

const storyPurchaseRegistry = loadTsModule("../src/runtime/purchase/storyPurchaseRegistry.ts", {});
const demoRegistration = storyPurchaseRegistry.defineStoryPurchaseRegistration({
  id: "act3-demo",
  queryKey: "act3-purchase",
  targets: ["bridge"],
  catalog: {
    bridge: {
      id: "act3_bridge_parts",
      target: "bridge",
      currency: "sysselbux",
      price: 125,
      presentation: {
        gate: { title: "Bridge", text: "Need parts", detail: "Go to shop" },
        shop: { icon: "🧰", title: "Bridge parts", description: "Parts", requirement: "Needed" },
      },
    },
  },
  parseTarget: (value) => value === "bridge" ? "bridge" : null,
  loadSnapshot: async () => ({ status: { bridge: { owned: false, needed: true } }, purchaseStory: null, purchaseStoryLineIndex: 0 }),
  applyPurchaseResult: async () => ({ snapshot: { status: { bridge: { owned: true, needed: false } }, purchaseStory: null, purchaseStoryLineIndex: 0 }, message: "Bought" }),
  savePurchaseStoryProgress: async () => ({ status: { bridge: { owned: true, needed: false } }, purchaseStory: null, purchaseStoryLineIndex: 0 }),
  purchaseStoryBeat: () => null,
  resumeHref: (target) => `/act3/?resume=${target}`,
});
assert.equal(
  storyPurchaseRegistry.resolveStoryPurchaseRegistration(
    new URLSearchParams("act3-purchase=bridge"),
    [demoRegistration],
  )?.target,
  "bridge",
  "generic Story Purchase registry must resolve future chapter handoffs without Mira-specific branching",
);

assert.match(
  villageSource,
  /purchase\.childId[\s\S]*registration\.applyPurchaseResult\([\s\S]*expectedChildId: purchase\.childId/,
  "backend Story Purchase results must bind local chapter persistence to the authoritative purchased child",
);
assert.match(
  villageSource,
  /savePurchaseStoryProgress\([\s\S]*expectedChildId: storyPurchaseStorySource\.expectedChildId/,
  "purchase-story progress must remain bound to the child scope that opened the handoff",
);

const act2StoryPurchaseRegistrySource = fs.readFileSync(new URL("../src/game/storyPurchaseRegistry.ts", import.meta.url), "utf8");
assert.match(
  act2StoryPurchaseRegistrySource,
  /updateAct2RuntimeState/,
  "Act 2 Story Purchase persistence must use the shared atomic update path",
);
assert.doesNotMatch(
  act2StoryPurchaseRegistrySource,
  /saveAct2RuntimeState/,
  "Act 2 Story Purchase must not retain separate load -> save persistence races",
);
assert.match(
  act2StoryPurchaseRegistrySource,
  /persistenceGuard\(context\)/,
  "Act 2 Story Purchase operations must forward identity scope into shared persistence",
);

for (const required of [
  "ACT2_PURCHASE_CATALOG",
  "loadSnapshot",
  "applyPurchaseResult",
  "savePurchaseStoryProgress",
  "purchaseStoryBeat",
  "resumeHref: act2ResumeHref",
]) {
  assert.ok(
    act2StoryPurchaseRegistrySource.includes(required),
    `Act 2 Story Purchase registration must own ${required}`,
  );
}
assert.match(
  act2StoryPurchaseRegistrySource,
  /export const STORY_PURCHASE_REGISTRATIONS = \[[\s\S]*ACT2_STORY_PURCHASE_REGISTRATION/,
  "shared shop registry composition must expose registered chapter purchase adapters",
);

assert.match(
  villageSource,
  /resolveRegisteredStoryPurchase\(\s*new URLSearchParams\(window\.location\.search\)/,
  "Mira must resolve contextual Story Purchase handoffs through the registry",
);
assert.doesNotMatch(
  villageSource,
  /get\("act2-purchase"\)|parseAct2PurchaseProject\(/,
  "Mira must not know Act 2 Story Purchase query parsing",
);
assert.match(
  villageSource,
  /router\.push\(registration\.resumeHref\(exit\.target\)\)/,
  "Mira contextual close must resume through the resolved registration",
);

const gameRegistrySource = fs.readFileSync(new URL("../src/game/storyPurchaseRegistry.ts", import.meta.url), "utf8");
assert.match(
  gameRegistrySource,
  /export async function loadRegisteredStoryPurchases\(\): Promise<LoadedStoryPurchaseRegistration\[\]>/,
  "shop composition must expose one loader for all registered Story Purchase chapters",
);
assert.match(
  gameRegistrySource,
  /snapshot: await registration\.loadSnapshot\(\{ expectedChildId \}\)/,
  "registered Story Purchase loader must delegate chapter state loading to each registration",
);
