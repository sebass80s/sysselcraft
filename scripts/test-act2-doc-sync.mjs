import assert from "node:assert/strict";
import fs from "node:fs";

import { ACT2_OPENING_BEATS } from "../src/game/act2OpeningStory.ts";
import { ACT2_ALVE_DIALOGUE } from "../src/game/act2AlveStory.ts";
import { CABIN_CONTRIBUTION_BEATS, CABIN_WAITING_REACTION } from "../src/game/act2CabinStory.ts";
import { JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT, JETTY_COMPLETION_REACTION } from "../src/game/act2JettyStory.ts";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../src/game/act2BoathouseStory.ts";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../src/game/act2MotorboatStory.ts";
import { ACT2_FINALE_BEATS } from "../src/game/act2FinaleStory.ts";

const storyDesign = fs.readFileSync(new URL("../docs/STORY_DESIGN.md", import.meta.url), "utf8");
const village = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
const runtime = fs.readFileSync(new URL("../src/components/Act2Runtime.tsx", import.meta.url), "utf8");

function assertProject(project, beats) {
  assert.equal(beats.length, 16, `${project} must contain exactly 16 contribution beats`);
  beats.forEach((beat, index) => {
    const number = index + 1;
    assert.match(beat.title, new RegExp(`^${number}/16 · `), `${project} beat ${number} must keep its numbered title`);
    const title = beat.title.replace(/^\d+\/16 · /, "");
    assert.ok(
      storyDesign.includes(`**${number}/16 — ${title}**`) || storyDesign.includes(`**${number}/16 - ${title}**`),
      `${project} ${beat.title} must exist in STORY_DESIGN`,
    );
  });
}

assert.equal(ACT2_OPENING_BEATS.length, 5, "Act 2 opening must keep OPEN-001…005");
for (const beat of ACT2_OPENING_BEATS) {
  assert.ok(storyDesign.includes(beat.title), `opening beat "${beat.title}" must exist in the canonical index`);
}

assertProject("Stugan", CABIN_CONTRIBUTION_BEATS);
assertProject("Bryggan", JETTY_CONTRIBUTION_BEATS);
assertProject("Båthuset", BOATHOUSE_CONTRIBUTION_BEATS);
assertProject("Motorbåten", MOTORBOAT_CONTRIBUTION_BEATS);

assert.ok(ACT2_ALVE_DIALOGUE.some((beat) => beat.nameReveal && beat.text === "Alve."), "Alve reveal beat must exist");
assert.ok(ACT2_ALVE_DIALOGUE.some((beat) => beat.text.includes("Jag heter {childName}.")), "Alve intro must use saved child identity");
assert.ok(storyDesign.includes("Jag heter {childName}."), "canonical Alve doc must use saved child identity");

assert.ok(CABIN_WAITING_REACTION.body.length > 0);
assert.ok(runtime.includes("storyLineAt(CABIN_WAITING_REACTION.body, cabinRevisitLineIndex)"), "Cabin revisit beat must be playable through shared Story sequencing");
assert.ok(JETTY_COMPLETION_REACTION.body.length > 0);
assert.ok(runtime.includes("JETTY_COMPLETION_REACTION"), "Jetty completion payoff must be playable");

assert.ok(JETTY_LIFEBUOY_BEAT.body.length > 0);
assert.ok(BOATHOUSE_STEERING_WHEEL_BEAT.body.length > 0);
assert.ok(village.includes("JETTY_LIFEBUOY_BEAT"), "Mira must play the authored lifebuoy beat");
assert.ok(village.includes("BOATHOUSE_STEERING_WHEEL_BEAT"), "Mira must play the authored steering-wheel beat");
assert.match(
  village,
  /project === "dock" \|\| project === "boathouse"[\s\S]*pendingPurchaseStory: project,[\s\S]*purchaseStoryLineIndex: 0/,
  "dock and boathouse purchase stories must become restart-safe through the catalog-driven purchase dispatcher",
);

assert.ok(storyDesign.includes("between 5/16 and 6/16"), "Motorboat parts purchase must remain separate from contribution 6");
assert.equal(
  storyDesign.includes("Du betalar 200 SysselBux genom den auktoritativa story-item-köpsfunktionen."),
  false,
  "canonical child-facing docs must not leak implementation prose",
);

assert.equal(ACT2_FINALE_BEATS.length, 6, "Act 2 finale must keep family/veranda plus epilogue");
for (const beat of ACT2_FINALE_BEATS) {
  assert.ok(storyDesign.includes(beat.title), `finale beat "${beat.title}" must exist in STORY_DESIGN`);
}
assert.equal(ACT2_FINALE_BEATS.at(-1)?.id, "finale:across-the-lake");
assert.ok(runtime.includes("SLUT PÅ ANDRA KAPITLET"), "runtime must close Act 2 with the canonical chapter-end card");

console.log("PASS: Act 2 runtime beats and canonical STORY_DESIGN are synchronized");

const epilogueManuscript = storyDesign.split("#### Act 2 epilogue / Act 3 bridge")[1]
  .split("**Canonical dialogue:**")[1].split("Then show the black")[0];
const canonicalLines = epilogueManuscript.split("\n").map((line) => line.trim()).filter(Boolean)
  .map((line) => line.replace(/^> \*\*(.+?):\*\* “(.*)”$/, "$1: $2"));
assert.deepEqual(ACT2_FINALE_BEATS.at(-1).body, canonicalLines, "Epilogue must preserve every canonical line exactly");
