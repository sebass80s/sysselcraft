import assert from "node:assert/strict";
import fs from "node:fs";

const backend = fs.readFileSync(new URL("../src/backend/diamondRewards.ts", import.meta.url), "utf8");
const village = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
const parent = fs.readFileSync(new URL("../src/app/parent/page.tsx", import.meta.url), "utf8");
const catalog = fs.readFileSync(new URL("../supabase/migrations/20260923_diamond_reward_catalog_and_redemptions.sql", import.meta.url), "utf8");
const parentRpcs = fs.readFileSync(new URL("../supabase/migrations/20260923_diamond_reward_parent_rpcs.sql", import.meta.url), "utf8");

for (const rpc of ["purchase_diamond_reward","mark_diamond_reward_delivered","refund_diamond_reward"]) {
  assert.ok(backend.includes(rpc), `Diamond client missing ${rpc}`);
  assert.ok(catalog.includes(rpc), `Diamond migration missing ${rpc}`);
}
for (const rpc of ["create_diamond_reward","update_diamond_reward","archive_diamond_reward"]) {
  assert.ok(backend.includes(rpc), `Parent client missing ${rpc}`);
  assert.ok(parentRpcs.includes(rpc), `Parent migration missing ${rpc}`);
}

assert.match(catalog, /update public\.child_game_state set diamonds=diamonds-v_reward\.diamond_price[\s\S]*where child_id=v_child_id and diamonds>=v_reward\.diamond_price;[\s\S]*if not found then raise exception 'insufficient diamonds';[\s\S]*insert into public\.diamond_reward_redemptions/, "Purchase must debit and create redemption in one RPC transaction");
assert.match(catalog, /if v\.status='delivered' then return;[\s\S]*if v\.status<>'pending_delivery' then raise exception 'redemption is not pending delivery'/, "Delivery must be idempotent and only transition pending rewards");
assert.match(catalog, /if v\.status='refunded' then return;[\s\S]*if v\.status<>'pending_delivery' then raise exception 'only pending rewards can be refunded';[\s\S]*diamonds=diamonds\+v\.diamond_price_snapshot/, "Refund must be idempotent and return exactly the snapshotted price");
assert.match(catalog, /status text not null default 'pending_delivery' check \(status in \('pending_delivery','delivered','refunded'\)\)/);
assert.match(catalog, /reward_title_snapshot text not null/);
assert.match(catalog, /diamond_price_snapshot integer not null/);

for (const rpc of ["purchase_diamond_reward(uuid)","mark_diamond_reward_delivered(uuid)","refund_diamond_reward(uuid)"]) {
  assert.ok(catalog.includes(`revoke all on function public.${rpc} from public`), `Missing PUBLIC revoke for ${rpc}`);
  assert.ok(catalog.includes(`grant execute on function public.${rpc} to authenticated`), `Missing authenticated grant for ${rpc}`);
}
for (const rpc of ["create_diamond_reward(uuid,text,text,integer)","update_diamond_reward(uuid,text,text,integer,boolean)","archive_diamond_reward(uuid)"]) {
  assert.ok(parentRpcs.includes(`revoke all on function public.${rpc} from public`), `Missing PUBLIC revoke for ${rpc}`);
  assert.ok(parentRpcs.includes(`grant execute on function public.${rpc} to authenticated`), `Missing authenticated grant for ${rpc}`);
}

assert.match(village, /await purchaseDiamondReward\(reward\.id\)/);
assert.match(village, /diamonds: Math\.max\(0, wallet\.diamonds - reward\.diamondPrice\)/);
assert.match(village, /sysselcraft:backend-wallet-refresh/);
assert.match(village, /listDiamondRewards\(child\.household_id\)/);
assert.match(parent, /listDiamondRedemptions\\(id\\)/);
assert.match(parent, /markDiamondRewardDelivered\(redemptionId\)/);
assert.match(parent, /refundDiamondReward\(redemptionId\)/);
assert.match(parent, /status==="pending_delivery"/);
assert.match(parent, /status==="delivered"/);

console.log("Diamond reward regression checks passed.");
