import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { CABIN_CONTRIBUTION_BEATS, CABIN_WAITING_REACTION } from "../src/game/act2CabinStory.ts";
import { JETTY_COMPLETION_REACTION, JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT } from "../src/game/act2JettyStory.ts";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../src/game/act2BoathouseStory.ts";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../src/game/act2MotorboatStory.ts";
import { ACT2_OPENING_BEATS } from "../src/game/act2OpeningStory.ts";
import { ACT2_ALVE_DIALOGUE, act2AlveImageForIndex } from "../src/game/act2AlveStory.ts";
import { ACT2_FINALE_BEATS } from "../src/game/act2FinaleStory.ts";
import { parseStoryLine, STORY_SPEAKER_PREFIXES } from "../src/game/storyEngine.ts";

function assertAsset(image, label) {
  assert.ok(image, `${label} must have an image`);
  assert.ok(
    image.startsWith("/assets/village/story-moments/act2/"),
    `${label} must use an Act 2 Story Moment asset, got ${image}`,
  );
  const diskPath = resolve(process.cwd(), "public", image.replace(/^\//, ""));
  assert.ok(existsSync(diskPath), `${label} references missing asset: ${image}`);
}

function assertProject(name, beats) {
  assert.equal(beats.length, 16, `${name} must contain exactly 16 contribution beats`);
  beats.forEach((beat, index) => {
    const number = index + 1;
    assert.ok(beat.id, `${name} beat ${number} must have an id`);
    assert.ok(
      beat.title.startsWith(`${number}/16`),
      `${name} beat ${number} must keep canonical n/16 title ordering, got "${beat.title}"`,
    );
    assert.ok(Array.isArray(beat.body) && beat.body.length > 0, `${name} beat ${number} must contain dialogue/body lines`);
    assert.ok(beat.body.every((line) => typeof line === "string" && line.trim().length > 0), `${name} beat ${number} contains an empty/non-string line`);
    assert.equal(
      beat.stage,
      Math.min(4, 1 + Math.floor(number / 4)),
      `${name} beat ${number} must be in visual stage ${Math.min(4, 1 + Math.floor(number / 4))}`,
    );
    assertAsset(beat.image, `${name} ${beat.title}`);
  });
}

assertProject("Stugan", CABIN_CONTRIBUTION_BEATS);
assertProject("Bryggan", JETTY_CONTRIBUTION_BEATS);
assertProject("Båthuset", BOATHOUSE_CONTRIBUTION_BEATS);
assertProject("Motorbåten", MOTORBOAT_CONTRIBUTION_BEATS);

for (const beat of [CABIN_WAITING_REACTION, JETTY_LIFEBUOY_BEAT, JETTY_COMPLETION_REACTION, BOATHOUSE_STEERING_WHEEL_BEAT]) {
  assert.ok(beat.body.length > 0, `${beat.id} must contain dialogue/body lines`);
  assertAsset(beat.image, beat.id);
}

assert.equal(ACT2_OPENING_BEATS.length, 5, "Act 2 opening must contain exactly five canonical beats");
ACT2_OPENING_BEATS.forEach((beat, index) => {
  assert.ok(beat.body.length > 0, `opening beat ${index + 1} must contain dialogue/body lines`);
  assertAsset(beat.image, `opening beat ${index + 1}`);
});

assert.ok(ACT2_ALVE_DIALOGUE.length > 0, "Alve intro must not be empty");
ACT2_ALVE_DIALOGUE.forEach((beat, index) => {
  assert.ok(beat.text.trim().length > 0, `Alve intro line ${index + 1} must not be empty`);
  assertAsset(act2AlveImageForIndex(index), `Alve intro line ${index + 1}`);
});

assert.equal(ACT2_FINALE_BEATS.length, 5, "Act 2 finale must end at the veranda; first crossing belongs to Act 3");
assert.equal(ACT2_FINALE_BEATS.some((beat) => beat.id === "finale:first-crossing"), false, "Act 2 must not contain the Act 3 crossing");
const friendshipBeat = ACT2_FINALE_BEATS.find((beat) => beat.id === "finale:family-embrace");
assert.ok(friendshipBeat?.body.includes("Alve: Det är {childName}."), "family embrace must name the child before the friend payoff");
assert.ok(friendshipBeat?.body.includes("Alve: Han är min kompis."), "family embrace must preserve the friend payoff");

const authoredStoryBodies = [
  ...ACT2_OPENING_BEATS.flatMap((beat) => beat.body),
  ...CABIN_CONTRIBUTION_BEATS.flatMap((beat) => beat.body),
  ...JETTY_CONTRIBUTION_BEATS.flatMap((beat) => beat.body),
  ...BOATHOUSE_CONTRIBUTION_BEATS.flatMap((beat) => beat.body),
  ...MOTORBOAT_CONTRIBUTION_BEATS.flatMap((beat) => beat.body),
  ...ACT2_FINALE_BEATS.flatMap((beat) => beat.body),
  ...CABIN_WAITING_REACTION.body,
  ...JETTY_LIFEBUOY_BEAT.body,
  ...JETTY_COMPLETION_REACTION.body,
  ...BOATHOUSE_STEERING_WHEEL_BEAT.body,
];

for (const line of authoredStoryBodies) {
  assert.notEqual(line.trim(), "Paus.", "editorial pause markers must never render as clickable story cards");
  assert.equal(/^Låt .*visuellt/i.test(line.trim()), false, "editorial stage directions must never render as player-facing story cards");
  const parsed = parseStoryLine(line, "Testbarn");
  assert.equal(parsed.text.includes("{childName}"), false, `child-name token must never leak into rendered dialogue: ${line}`);
  for (const prefix of STORY_SPEAKER_PREFIXES) {
    assert.equal(parsed.text.startsWith(`${prefix}:`), false, `speaker prefix must never remain in body text: ${line}`);
  }
}

assert.deepEqual(
  parseStoryLine("Barnet: Hej.", "Testbarn"),
  { text: "Hej.", speaker: "Testbarn", speakerTone: "child" },
  "player prefix must render as the child's real name",
);
assert.deepEqual(
  parseStoryLine("Okänd: Ja.", "Testbarn"),
  { text: "Ja.", speaker: "Barnet", speakerTone: "default" },
  "unknown Alve must remain Barnet until the name reveal",
);
assert.deepEqual(
  parseStoryLine("Alve: Det är {childName}.", "Testbarn"),
  { text: "Det är Testbarn.", speaker: "Alve", speakerTone: "default" },
  "child-name templates must render inside NPC dialogue",
);

ACT2_FINALE_BEATS.forEach((beat) => {
  assert.ok(beat.id && beat.title, "finale beats must have id and title");
  assert.ok(beat.body.length > 0, `${beat.id} must contain dialogue/body lines`);
  if (beat.image) assertAsset(beat.image, beat.id);
});

const ids = [
  ...CABIN_CONTRIBUTION_BEATS,
  ...JETTY_CONTRIBUTION_BEATS,
  ...BOATHOUSE_CONTRIBUTION_BEATS,
  ...MOTORBOAT_CONTRIBUTION_BEATS,
  CABIN_WAITING_REACTION,
  JETTY_LIFEBUOY_BEAT,
  JETTY_COMPLETION_REACTION,
  BOATHOUSE_STEERING_WHEEL_BEAT,
  ...ACT2_FINALE_BEATS,
].map((beat) => beat.id);

assert.equal(new Set(ids).size, ids.length, "Act 2 story beat IDs must be globally unique");

console.log(
  `Act 2 story contract PASS: ${CABIN_CONTRIBUTION_BEATS.length + JETTY_CONTRIBUTION_BEATS.length + BOATHOUSE_CONTRIBUTION_BEATS.length + MOTORBOAT_CONTRIBUTION_BEATS.length} contribution beats + opening/Alve/special/finale assets verified`,
);
