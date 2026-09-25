import assert from "node:assert/strict";
import fs from "node:fs";

const component = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const game = fs.readFileSync(new URL("../src/game/createVillageGame.ts", import.meta.url), "utf8");
const backend = fs.readFileSync(new URL("../src/backend/storyShop.ts", import.meta.url), "utf8");
const migration = fs.readFileSync(new URL("../supabase/migrations/20260924_purchase_story_item.sql", import.meta.url), "utf8");

for (const asset of ["bottle-letter.png","bottle-message.png","sol-arrival.png","sol-tour-bakery.png","sol-tour-shop.png","sol-tour-linus.png","sol-tour-linus-knee.png","sol-stays.png"]) {
  assert.ok(fs.existsSync(new URL("../public/assets/village/story-moments/" + asset, import.meta.url)), `Missing story asset: ${asset}`);
}
assert.match(backend, /BOTTLE_MESSAGE_PRICE = 25/);
assert.match(backend, /purchase_story_item/);
for (const beat of ["bottle_message_sent","sol_arrival_seen","sol_tour_bakery_seen","sol_tour_shop_seen","sol_tour_linus_seen","sol_chose_to_stay"]) {
  assert.ok(backend.includes(beat), `Backend client missing beat ${beat}`);
  assert.ok(migration.includes(beat), `Migration missing beat ${beat}`);
}
assert.match(migration, /bottleMessagePurchased/);
assert.match(component, /purchaseBottleMessage\(\)/);
assert.match(component, /setBottleMessageReady\(true\)/);
assert.match(component, /commitStoryBeat\("bottle_message_sent"\)/);
assert.match(component, /bottleMessageSent \|\| solArrivalSeen/);
assert.match(component, /commitStoryBeat\("sol_arrival_seen"\)/);
assert.match(component, /startClinicConstruction/);
assert.match(game, /callbacks\.onBottleMessageInteract\(\)/);
assert.match(game, /callbacks\.onAbandonedShopInteract\(\)/);
assert.doesNotMatch(game, /if \(this\.shopInteractionPending && this\.player && requestedShopOpen\)/);

const safeTestStart = component.indexOf("function openSolSafeTest");
const safeTestEnd = component.indexOf("function replayMiraStoryMoment", safeTestStart);
assert.ok(safeTestStart >= 0 && safeTestEnd > safeTestStart, "Missing isolated Sol acceptance handlers");
const safeTestHandlers = component.slice(safeTestStart, safeTestEnd);
assert.doesNotMatch(safeTestHandlers, /purchaseStoryItem|purchaseBottleMessage|commitStoryBeat|saveSaveState|persistConstruction|clearSaveState|fetch\(/, "Sol acceptance handlers must not write save or backend state");
const safeTestRenderStart = component.lastIndexOf("{solSafeTestOpen &&");
const safeTestRenderEnd = component.indexOf("{saveError &&", safeTestRenderStart);
assert.ok(safeTestRenderStart >= 0 && safeTestRenderEnd > safeTestRenderStart, "Missing isolated Sol acceptance overlay");
const safeTestRender = component.slice(safeTestRenderStart, safeTestRenderEnd);
assert.doesNotMatch(safeTestRender, /purchaseStoryItem|purchaseBottleMessage|commitStoryBeat|saveSaveState|persistConstruction|clearSaveState|fetch\(/, "Sol acceptance controls must not write save or backend state");
for (const transition of [
  'setSolSafeTestPhase("arrival")',
  'setSolSafeTestPhase("bakery")',
  'setSolSafeTestPhase("shop")',
  'setSolSafeTestPhase("linus")',
  'setSolSafeTestPhase("decision")',
  'setSolSafeTestPhase("done")',
]) assert.ok(safeTestHandlers.includes(transition), `Missing safe-test transition ${transition}`);
assert.match(component, /phase === "purchase"[\s\S]*setSolSafeTestPhase\("water"\)/, "Purchase must be an explicit, local-only phase");
assert.match(component, /tour === "shop" \? "\/assets\/village\/story-moments\/sol-tour-shop\.png"/, "Shop\/Mira must have its own scene after purchase");
assert.match(component, /tour === "linus" \? \(solSafeTestIndex >= 1 \? "\/assets\/village\/story-moments\/sol-tour-linus-knee\.png"/, "Linus scene must follow the production image change");
assert.match(component, /function openSolRuntimeTest\(\) \{[^}]*setSolStoryIndex\(null\);[^}]*setSolTourStoryStop\(null\);/, "Runtime acceptance harness must clear live Sol overlays when opened");
assert.match(component, /solRuntimeTestPhase === "idle" && solStoryIndex !== null/, "Live Sol arrival overlay must be suppressed during runtime acceptance");
assert.match(component, /solRuntimeTestPhase === "idle" && solTourStoryStop && solTourStoryLine/, "Live Sol tour overlay must be suppressed during runtime acceptance");
assert.match(component, /data-sol-safe-phase=\{phase\}/);
assert.match(component, /data-sol-safe-index=\{solSafeTestIndex\}/);
assert.match(styles, /\.sol-safe-test-overlay \{ position:fixed; inset:0; width:100vw; height:100dvh;/, "Sol acceptance overlay must use the viewport as its containing block");
assert.match(styles, /\.sol-safe-test-image img \{[^}]*width:100%; height:100%; object-fit:cover;/, "Story art must fill the viewport without changing aspect ratio");
assert.match(styles, /\.sol-safe-test-dialogue \{[^}]*left:max\([^}]*env\(safe-area-inset-left\)[^}]*right:max\([^}]*env\(safe-area-inset-right\)[^}]*bottom:max\([^}]*env\(safe-area-inset-bottom\)/, "Dialogue must respect iPhone safe areas");
console.log("Sol story harness: PASS");
console.log("production: shop purchase -> waterfront bottle -> persisted send -> Sol arrival -> tour -> stay -> clinic");
console.log("safe acceptance: purchase -> water -> letter -> bottle -> arrival -> bakery -> shop\/Mira -> Linus -> decision -> done (local React state only)");
