import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { parseStoryLine } from "../src/game/storyEngine.ts";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const css = read("src/app/globals.css");
const dialogueCard = read("src/components/story/DialogueCard.tsx");
const transcript = read("src/components/story/StoryTranscript.tsx");
const runner = read("src/components/story/StoryRunner.tsx");
const debugPage = read("src/app/act2-test/page.tsx");
const act2Page = read("src/app/act2/page.tsx");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

const sourceFiles = walk(path.join(root, "src")).filter((file) => /\.(ts|tsx|css)$/.test(file));
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");
  assert.equal(
    source.includes("Adam"),
    false,
    `runtime source must not hardcode the real test player's name: ${path.relative(root, file)}`,
  );
}

const speakerPlacementMatch = css.match(/\.dialogue-card > \.dialogue-speaker,[\s\S]*?\n\}/);
assert.ok(speakerPlacementMatch, "missing canonical dialogue-card nameplate placement rule");
const speakerPlacement = speakerPlacementMatch[0];
assert.match(speakerPlacement, /position:\s*static/, "nameplates must stay in normal card flow");
assert.doesNotMatch(speakerPlacement, /position:\s*absolute/, "nameplates must not escape the dialogue card");
assert.doesNotMatch(speakerPlacement, /top:\s*-/, "nameplates must not depend on negative top offsets");
assert.doesNotMatch(speakerPlacement, /translateY\(/, "nameplates must not depend on transform offsets");

assert.match(css, /\.dialogue-speaker \{[^}]*max-width:\s*100%[^}]*white-space:\s*nowrap[^}]*text-overflow:\s*ellipsis/s,
  "nameplates must remain bounded for long child names");

assert.ok(
  dialogueCard.indexOf("dialogue-speaker") < dialogueCard.indexOf("shared-story-body"),
  "DialogueCard must render its nameplate before dialogue body content",
);

assert.match(transcript, /showSpeakers\?: boolean/, "StoryTranscript must support explicit nameplate ownership");
assert.match(transcript, /showSpeakers && parsed\.speaker/, "StoryTranscript must honor nameplate ownership");
assert.match(runner, /showSpeakers=\{!beat\.speaker\}/, "StoryRunner must prevent duplicate explicit + parsed nameplates");

assert.match(debugPage, /loadSaveState/, "Story Debug must load the saved child identity");
assert.match(debugPage, /<StoryTranscript childName=\{childName\}/, "Story Debug must pass the saved child name into the story parser");
assert.doesNotMatch(debugPage, /replaceAll\("\{childName\}",\s*"[^"]+"\)/, "Story Debug must not bake a personal name into authored lines");

assert.match(act2Page, /parseStoryLine\(activeContributionLine, childName\)/, "Act 2 contribution cards must parse speaker and child name centrally");
assert.match(act2Page, /parseStoryLine\(activeFinaleLine, childName\)/, "Act 2 finale cards must parse speaker and child name centrally");
assert.match(act2Page, /parseStoryLine\(activeCompletionLine, childName\)/, "Act 2 completion cards must parse speaker and child name centrally");

assert.deepEqual(
  parseStoryLine("Barnet: Hej.", "Testbarn"),
  { text: "Hej.", speaker: "Testbarn", speakerTone: "child" },
  "player dialogue must render the saved child name only in the nameplate",
);
assert.deepEqual(
  parseStoryLine("Okänd: Ja.", "Testbarn"),
  { text: "Ja.", speaker: "Barnet", speakerTone: "default" },
  "unknown Alve must not inherit the player's name before reveal",
);
assert.deepEqual(
  parseStoryLine("Alve: Hej {childName}.", "Testbarn"),
  { text: "Hej Testbarn.", speaker: "Alve", speakerTone: "default" },
  "NPC dialogue may interpolate the child name without leaking a speaker prefix",
);
assert.deepEqual(
  parseStoryLine("Berättarrad med {childName}.", "Testbarn"),
  { text: "Berättarrad med Testbarn." },
  "narration must interpolate child name without inventing a nameplate",
);

console.log("Story UI contract: PASS");
