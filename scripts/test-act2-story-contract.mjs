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
      Math.ceil(number / 4),
      `${name} beat ${number} must be in visual stage ${Math.ceil(number / 4)}`,
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
