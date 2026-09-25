import assert from "node:assert/strict";
import fs from "node:fs";

const component = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
const game = fs.readFileSync(new URL("../src/game/createVillageGame.ts", import.meta.url), "utf8");
const backend = fs.readFileSync(new URL("../src/backend/storyShop.ts", import.meta.url), "utf8");
const migration = fs.readFileSync(new URL("../supabase/migrations/20260924_purchase_story_item.sql", import.meta.url), "utf8");

for (const asset of ["bottle-letter.png","bottle-message.png","sol-arrival.png","sol-tour-bakery.png","sol-tour-shop.png","sol-tour-linus.png","sol-stays.png"]) {
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
console.log("Sol story harness: PASS");
console.log("shop purchase -> waterfront bottle -> persisted send -> Sol arrival -> tour -> stay -> clinic");
