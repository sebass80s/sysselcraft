#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";

const sql = fs.readFileSync("supabase/migrations/20261014_quest_v2_recurring_expiry_and_parent_cancel.sql", "utf8");
const parent = fs.readFileSync("src/app/parent/page.tsx", "utf8");
const repository = fs.readFileSync("src/backend/familyRepository.ts", "utf8");
const client = fs.readFileSync("src/components/ChildBackendQuestInbox.tsx", "utf8");
const types = fs.readFileSync("src/backend/types.ts", "utf8");

assert.match(sql, /check\s*\(state in\s*\('available', 'active', 'pending', 'approved', 'expired', 'cancelled'\)\)/);
const cancel = sql.split("create or replace function public.cancel_parent_quest_instance")[1].split("create or replace function public.materialize_due_quest_instances")[0];
assert.match(cancel, /security definer/);
assert.match(cancel, /public\.is_household_parent\(v_instance\.household_id\)/);
assert.match(cancel, /state not in \('available', 'active'\)/);
assert.match(cancel, /state = 'cancelled', closed_at = now\(\)/);
assert.doesNotMatch(cancel, /delete\s+from|reward_events|child_game_state|claim_quest_reward/i,"Cancel must not delete, reward or affect progression");
assert.match(sql,/on conflict \(quest_id, child_id, occurrence_key\) do nothing/i);
assert.match(sql,/if v_local_now::time < v_quest\.recurrence_time/i,"Do not roll over before scheduled time");
assert.match(sql,/set state = 'expired', closed_at = now\(\)/);
assert.match(sql,/qi\.state in \('available', 'active'\)/);
assert.match(sql,/v_quest\.recurrence_kind = 'weekly'/);
assert.match(sql,/v_quest\.recurrence_kind = 'weekdays'/);
assert.match(sql,/v_occurrence_key := 'day:' \|\| v_local_date::text/);
assert.match(sql,/v_occurrence_key := 'week:' \|\| to_char\(v_local_date, 'IYYY-IW'\)/);
assert.doesNotMatch(sql,/update\s+public\.child_game_state|insert\s+into\s+public\.reward_events/i);
assert.match(repository,/export async function cancelParentQuestInstance\(instanceId: string\)/);
assert.match(repository,/\.rpc\("cancel_parent_quest_instance"/);
assert.match(parent,/async function removeQuestInstance\(quest: BackendQuest\)/);
assert.match(parent,/quest\.state !== "available" && quest\.state !== "active"/);
assert.match(parent,/await cancelParentQuestInstance\(quest\.instanceId\)/);
assert.match(parent,/await loadChildQuests\(childId\)/);
assert.equal((parent.match(/>Ta bort instans<\/button>/g)??[]).length,2,"Available and active occurrences removable from parent UI");
assert.match(parent,/upprepas ligger mallen kvar/i);
assert.match(client,/presented\.available, \.\.\.presented\.active, \.\.\.presented\.pending/);
assert.deepEqual(
  [...types.matchAll(/"available"|"active"|"pending"|"approved"/g)].slice(0,4).map(match=>match[0]),
  ['"available"','"active"','"pending"','"approved"'],
  "Client only accepts the four visible states; cancelled/expired are server-internal terminal states",
);

// A pure policy test with independent recurring definitions. This documents the
// intended server SQL semantics; the actual SQL gets its own native DB acceptance.
function rollOver({kind,localDate,localWeek,due,instances}){
  if(!due) return instances;
  return instances.map(item => ({
    ...item,
    state: (item.state==="available" || item.state==="active")
      && item.key !== (kind==="weekly"?"week:"+localWeek:"day:"+localDate)
      && (kind==="weekly" ? item.week<localWeek : item.date<localDate)
      ? "expired":item.state,
  }));
}
const bedding=[
  {key:"day:2026-10-12",date:"2026-10-12",state:"active"},
  {key:"day:2026-10-13",date:"2026-10-13",state:"active"},
  {key:"day:2026-10-14",date:"2026-10-14",state:"active"},
  {key:"day:2026-10-12",date:"2026-10-12",state:"pending"},
  {key:"day:2026-10-12",date:"2026-10-12",state:"approved"},
];
const result=rollOver({kind:"daily",localDate:"2026-10-14",due:true,instances:bedding});
assert.deepEqual(result.map(x=>x.state),["expired","expired","active","pending","approved"]);
assert.deepEqual(rollOver({kind:"daily",localDate:"2026-10-14",due:false,instances:bedding}),bedding,"Before schedule, old occurrence does not expire");
const weekly=rollOver({kind:"weekly",localWeek:"2026-42",due:true,instances:[
  {key:"week:2026-41",week:"2026-41",state:"available"},
  {key:"week:2026-42",week:"2026-42",state:"active"},
  {key:"week:2026-41",week:"2026-41",state:"pending"},
]});
assert.deepEqual(weekly.map(x=>x.state),["expired","active","pending"]);
console.log("PASS: Quest V2 backend cancellation/recurrence contract, front-end actions and multi-period lifecycle policy");
