import assert from "node:assert/strict";
import fs from "node:fs";

import {
  CHAPTER_IDS,
  chapterDefinition,
  chapterPredecessor,
  chapterRoute,
  nextChapterId,
} from "../src/runtime/chapter/chapterRegistry.ts";

assert.deepEqual(CHAPTER_IDS, ["act1", "act2"]);
assert.equal(chapterRoute("act1"), "/");
assert.equal(chapterRoute("act2"), "/act2");
assert.equal(chapterPredecessor("act1"), null);
assert.equal(chapterPredecessor("act2"), "act1");
assert.equal(nextChapterId("act1"), "act2");
assert.equal(nextChapterId("act2"), null);

for (const id of CHAPTER_IDS) {
  const definition = chapterDefinition(id);
  assert.equal(definition.id, id);
  if (definition.nextId) {
    assert.equal(
      chapterPredecessor(definition.nextId),
      id,
      `${id} next chapter must point back to its predecessor`,
    );
  }
}

const village = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
const act2 = fs.readFileSync(new URL("../src/components/Act2Runtime.tsx", import.meta.url), "utf8");
const handoff = fs.readFileSync(new URL("../src/game/act2PurchaseHandoff.ts", import.meta.url), "utf8");

assert.match(village, /router\.push\(chapterRoute\("act2"\)\)/, "Village -> Act 2 navigation must use the chapter registry");
assert.match(act2, /router\.replace\(chapterRoute\("act2"\)\)/, "Act 2 resume cleanup must use the chapter registry");
assert.match(handoff, /chapterRoute\("act1"\).*act2-purchase/s, "shop handoff must use the registered Act 1 route");
assert.match(handoff, /chapterRoute\("act2"\).*resume/s, "purchase resume must use the registered Act 2 route");

console.log("PASS: canonical chapter registry and current navigation consumers");
