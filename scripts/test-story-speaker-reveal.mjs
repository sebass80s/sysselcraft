#!/usr/bin/env node
import assert from "node:assert/strict";
import { runtimeTestLoader } from "./lib/runtime-test-loader.mjs";

const load = runtimeTestLoader();
const {
  storySpeakerIntroduced, storySpeakerDisplayName, storyNarrationDisplayText,
} = load("src/runtime/story/speakerIdentity.ts");
const { ACT3_SPEAKER_REVEALS } = load("src/game/act3SpeakerReveals.ts");
const { ACT3_OPENING_BEATS } = load("src/game/act3OpeningContent.ts");

const nova = ACT3_SPEAKER_REVEALS[0];
assert.equal(nova.speakerId, "Nova");
assert.equal(nova.concealedLabel, "Tjejen");
const scene = ACT3_OPENING_BEATS[1];
assert.equal(scene.id, "A3-OPEN-002");
assert.equal(scene.lines[13].text, "Nova.", "Introduction index must track canonical dialogue");
assert.equal(scene.lines[13].speaker, "Nova");
assert.equal(scene.lines[12].text, "Nova granskar dig.");
for (const lineIndex of [4, 6, 8, 10, 13]) {
  assert.equal(storySpeakerDisplayName("Nova", {beatIndex:1,lineIndex}, ACT3_SPEAKER_REVEALS), "Tjejen");
}
assert.equal(storyNarrationDisplayText(scene.lines[12].text,{beatIndex:1,lineIndex:12},ACT3_SPEAKER_REVEALS), "Tjejen granskar dig.");
assert.equal(storySpeakerDisplayName("Nova", {beatIndex:1,lineIndex:14},ACT3_SPEAKER_REVEALS), "Nova");
assert.equal(storySpeakerDisplayName("Nova", {beatIndex:1,lineIndex:15},ACT3_SPEAKER_REVEALS), "Nova");
assert.equal(storySpeakerDisplayName("Nova", {beatIndex:2,lineIndex:0},ACT3_SPEAKER_REVEALS), "Nova");
assert.equal(storySpeakerDisplayName("Nova", {beatIndex:6,lineIndex:0},ACT3_SPEAKER_REVEALS), "Nova");
assert.equal(storySpeakerDisplayName("Du", {beatIndex:1,lineIndex:3},ACT3_SPEAKER_REVEALS), "Du");
assert.equal(storySpeakerDisplayName(null,{beatIndex:1,lineIndex:3},ACT3_SPEAKER_REVEALS), null);
assert.equal(storySpeakerIntroduced({beatIndex:1,lineIndex:13},nova),false);
assert.equal(storySpeakerIntroduced({beatIndex:1,lineIndex:14},nova),true);
assert.equal(storyNarrationDisplayText("Nova granskar dig.",{beatIndex:2,lineIndex:0},ACT3_SPEAKER_REVEALS),"Nova granskar dig.","Later stage directions unchanged");
// Revisiting the same saved cursor must give the SAME nameplate, without a parallel identity save.
assert.equal(storySpeakerDisplayName("Nova",{beatIndex:1,lineIndex:6},ACT3_SPEAKER_REVEALS),"Tjejen","Rewind before reveal re-masks identity");

// Shared runtime must not know chapter identities: independent chapter data configures the same rule.
const forest=[{speakerId:"Linus",concealedLabel:"Gubben",revealedAfter:{beatIndex:3,lineIndex:7}}];
const space=[{speakerId:"Kapten",concealedLabel:"Främlingen",revealedAfter:{beatIndex:0,lineIndex:1}}];
for (const [rules,who,unknown,before,after] of [
  [forest,"Linus","Gubben",{beatIndex:3,lineIndex:7},{beatIndex:3,lineIndex:8}],
  [space,"Kapten","Främlingen",{beatIndex:0,lineIndex:1},{beatIndex:0,lineIndex:2}],
]) {
  assert.equal(storySpeakerDisplayName(who,before,rules),unknown);
  assert.equal(storySpeakerDisplayName(who,after,rules),who);
  assert.equal(storyNarrationDisplayText(`${who} vinkar.`,before,rules),`${unknown} vinkar.`);
  assert.equal(storyNarrationDisplayText(`${who} vinkar.`,after,rules),`${who} vinkar.`);
}
assert.equal(storyNarrationDisplayText("Nova och Novaliten", {beatIndex:1,lineIndex:0},ACT3_SPEAKER_REVEALS),"Tjejen och Novaliten","Mask whole names only");

console.log("PASS: reusable Runtime 1.1 name reveal in Act 3 + two other chapter configurations; no pre-intro Nova spoiler, no extra save state");
