import assert from "node:assert/strict";
import { chooseDogHomeDialogue, dogHomeDialogueIndicesForStage } from "../src/game/dogHome.ts";
import { deriveDogHomeStageFromWorldFlags } from "../src/backend/storyShop.ts";

assert.deepEqual(dogHomeDialogueIndicesForStage(0), [0,1,2,3,4,7,9]);
assert(!dogHomeDialogueIndicesForStage(0).includes(5), "ball dialogue is hidden before toys");
assert(!dogHomeDialogueIndicesForStage(0).includes(6), "bed dialogue is hidden before bed");
assert(!dogHomeDialogueIndicesForStage(0).includes(8), "toy dialogue is hidden before toys");
assert(dogHomeDialogueIndicesForStage(1).includes(6), "bed dialogue unlocks with bed");
assert(!dogHomeDialogueIndicesForStage(2).includes(5), "ball dialogue still hidden before toys");
assert.deepEqual(dogHomeDialogueIndicesForStage(3).sort((a,b)=>a-b), [0,1,2,3,4,5,6,7,8,9]);
assert.deepEqual(dogHomeDialogueIndicesForStage(4).sort((a,b)=>a-b), [0,1,2,3,4,5,6,7,8,9]);
for (const stage of [0,1,2,3,4]) {
  const eligible = dogHomeDialogueIndicesForStage(stage);
  for (const last of eligible) {
    const chosen = chooseDogHomeDialogue(stage, last, () => 0);
    if (eligible.length > 1) assert.notEqual(chosen, last, "ambient dialogue must not immediately repeat");
    assert(eligible.includes(chosen), "chosen dialogue must be valid for current dog-home stage");
  }
}
console.log("PASS: dog-home dialogue only references visible upgrades and avoids immediate repeats.");

assert.equal(deriveDogHomeStageFromWorldFlags({}), 0);
assert.equal(deriveDogHomeStageFromWorldFlags({ dogHomeBedOwned: true }), 1);
assert.equal(deriveDogHomeStageFromWorldFlags({ dogHomeBedOwned: true, dogHomeBowlsOwned: true }), 2);
assert.equal(deriveDogHomeStageFromWorldFlags({ dogHomeToysOwned: true }), 3);
assert.equal(deriveDogHomeStageFromWorldFlags({ dogHomeCozyOwned: true }), 4);
console.log("PASS: backend dog-home ownership deterministically repairs the local stage.");
