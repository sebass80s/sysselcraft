import assert from "node:assert/strict";
import fs from "node:fs";

import {
  chapterAtStart,
  chapterCardVisible,
  chapterEndCardPending,
  chapterUnlocked,
} from "../src/runtime/chapter/chapterLifecycle.ts";

assert.equal(chapterUnlocked(false), false, "a chapter must stay locked until its predecessor end card is acknowledged");
assert.equal(chapterUnlocked(true), true, "a predecessor end card must unlock the next chapter");

assert.equal(chapterAtStart({
  openingComplete: false,
  openingIndex: 0,
  openingLineIndex: 0,
}), true, "fresh chapter entry must be recognized as chapter start");

assert.equal(chapterAtStart({
  openingComplete: false,
  openingIndex: 0,
  openingLineIndex: 1,
}), false, "advancing one opening line must stop fresh-start presentation");

assert.equal(chapterAtStart({
  openingComplete: true,
  openingIndex: 0,
  openingLineIndex: 0,
}), false, "completed opening must never be treated as fresh chapter start");

assert.equal(chapterEndCardPending({ chapterComplete: false, endCardSeen: false }), false);
assert.equal(chapterEndCardPending({ chapterComplete: true, endCardSeen: false }), true);
assert.equal(chapterEndCardPending({ chapterComplete: true, endCardSeen: true }), false);

assert.equal(chapterCardVisible(false, true, { chapterComplete: false, endCardSeen: false }), false, "chapter card must not render before runtime is ready");
assert.equal(chapterCardVisible(true, true, { chapterComplete: false, endCardSeen: false }), true, "chapter intro must render when ready");
assert.equal(chapterCardVisible(true, false, { chapterComplete: true, endCardSeen: false }), true, "pending end card must render when ready");
assert.equal(chapterCardVisible(true, false, { chapterComplete: true, endCardSeen: true }), false, "acknowledged end card must not replay");

const village = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
const act2 = fs.readFileSync(new URL("../src/components/Act2Runtime.tsx", import.meta.url), "utf8");

assert.match(village, /chapterUnlocked\(act1EndCardSeen\)/, "Village must use shared chapter unlock for the Act 2 path");
assert.match(act2, /chapterUnlocked\(act1\?\.worldFlags\?\.act1EndCardSeen === true\)/, "Act 2 entry must use shared predecessor unlock semantics");
assert.match(act2, /deriveChapterCardVisible\(/, "Act 2 chapter-card presentation must use shared lifecycle");
assert.match(act2, /chapterAtStart\(\{/, "Act 2 fresh-entry detection must use shared lifecycle");

console.log("PASS: shared chapter lifecycle semantics and current consumers");
