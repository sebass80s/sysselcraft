import assert from "node:assert/strict";
import fs from "node:fs";

import {
  CHAPTER_IDS,
  chapterDefinition,
  chapterPredecessor,
  chapterRoute,
  nextChapterDestination,
  nextChapterId,
} from "../src/runtime/chapter/chapterRegistry.ts";

assert.deepEqual(CHAPTER_IDS, ["act1", "act2", "act3"]);
assert.equal(chapterRoute("act1"), "/");
assert.equal(chapterRoute("act2"), "/act2");
assert.equal(chapterRoute("act3"), "/act3");
assert.equal(chapterPredecessor("act1"), null);
assert.equal(chapterPredecessor("act2"), "act1");
assert.equal(chapterPredecessor("act3"), "act2");
assert.equal(nextChapterId("act1"), "act2");
assert.equal(nextChapterId("act2"), "act3");
assert.equal(nextChapterId("act3"), null);
assert.deepEqual(
  nextChapterDestination("act1", { chapterComplete: true, endCardSeen: true }),
  { id: "act2", route: "/act2" },
);
assert.equal(
  nextChapterDestination("act1", { chapterComplete: true, endCardSeen: false }),
  null,
  "next chapter must stay hidden until the end card is acknowledged",
);
assert.deepEqual(
  nextChapterDestination("act2", { chapterComplete: true, endCardSeen: true }),
  { id: "act3", route: "/act3" },
);
assert.equal(
  nextChapterDestination("act3", { chapterComplete: true, endCardSeen: true }),
  null,
  "final registered chapter has no next destination",
);

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
const sharedPurchaseHandoff = fs.readFileSync(new URL("../src/runtime/purchase/storyPurchaseHandoff.ts", import.meta.url), "utf8");

assert.match(village, /const act1NextChapter = nextChapterDestination\("act1"[\s\S]*router\.push\(act1NextChapter\.route\)/, "Village -> Act 2 transition must use the shared next-chapter destination");
assert.match(act2, /replaceHref: resumeProject \? chapterRoute\("act2"\) : null/, "Act 2 resume cleanup must resolve its canonical route through the chapter registry before handing navigation to the shared host");
assert.match(handoff, /storyPurchaseShopHref\(\{[\s\S]*shopChapterId: "act1"[\s\S]*queryKey: "act2-purchase"/, "Act 2 shop handoff must delegate its registered Act 1 target to the shared purchase handoff");
assert.match(handoff, /storyPurchaseResumeHref\(\{[\s\S]*chapterId: "act2"/, "Act 2 purchase resume must delegate its registered Act 2 target to the shared purchase handoff");
assert.match(sharedPurchaseHandoff, /chapterRoute\(input\.shopChapterId\)/, "shared purchase handoff must resolve shop routes through the chapter registry");
assert.match(sharedPurchaseHandoff, /chapterRoute\(input\.chapterId\)/, "shared purchase resume must resolve chapter routes through the chapter registry");
assert.match(act2, /const nextChapter = nextChapterDestination\("act2"/, "Act 2 must derive its next chapter from the shared transition");
assert.match(act2, /router\.push\(nextChapter\.route\)/, "Act 2 next-chapter navigation must use the resolved registered route");
assert.doesNotMatch(act2, /router\.push\("\/act3"\)/, "Act 2 must not hard-code the Act 3 route");


console.log("PASS: canonical chapter registry and current navigation consumers");
