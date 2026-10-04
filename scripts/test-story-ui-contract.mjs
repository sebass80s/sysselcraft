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
const act2Runtime = read("src/components/Act2Runtime.tsx");
const villageRuntime = read("src/components/VillagePrototype.tsx");
const storyOverlayBridge = read("src/game/storyOverlayBridge.ts");
const questInboxSource = read("src/components/ChildBackendQuestInbox.tsx");

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

assert.match(
  css,
  /\.dialogue-card\.story-moment-dialogue\.act2-dialogue-card \{[^}]*left:\s*max\(1rem, env\(safe-area-inset-left\)\)[^}]*right:\s*max\(1rem, env\(safe-area-inset-right\)\)[^}]*max-height:[^}]*overflow-y:\s*auto/s,
  "Act 2 story cards must honor side safe areas and retain a scroll recovery path",
);
assert.match(css, /\.act2-project-status \{[^}]*pointer-events:\s*none/s,
  "Act 2 project status must not steal gameplay taps");
assert.match(css, /\.act2-sync-status \{[^}]*safe-area-inset-right[^}]*pointer-events:\s*none/s,
  "Act 2 sync status must sit in the safe HUD area without stealing taps");

assert.ok(
  dialogueCard.indexOf("dialogue-speaker") < dialogueCard.indexOf("shared-story-body"),
  "DialogueCard must render its nameplate before dialogue body content",
);

assert.match(
  runner,
  /revealImageBeforeNext/,
  "StoryRunner must expose the clean-image pause for final panels",
);
const storyMomentSource = read("src/components/story/StoryMoment.tsx");
assert.match(storyMomentSource, /setImageOnlyPresentationId\(presentationId\)/, "StoryMoment must hide the dialogue before advancing");
assert.match(storyMomentSource, /shared-story-image-continue/, "clean image mode must advance from the unobstructed image");
assert.match(storyMomentSource, /presentationId/, "clean image mode must reset between authored panels");
assert.match(storyMomentSource, /className="primary-button shared-story-image-continue"[\s\S]*Fortsätt/, "clean image mode must keep a visible Continue button");
assert.match(css, /\.shared-story-image-navigation \{[^}]*right:\s*max\(1rem, env\(safe-area-inset-right\)\)[^}]*bottom:\s*max\(1rem, env\(safe-area-inset-bottom\)\)/s,
  "clean image Continue button must stay in the safe bottom-right corner");

assert.match(dialogueCard, /ariaLabel\?: string/, "DialogueCard must support an accessible dialog label");
assert.match(dialogueCard, /aria-label=\{ariaLabel\}/, "DialogueCard must publish its accessible dialog label");
assert.match(runner, /ariaLabel\?: string/, "StoryRunner must pass accessible labels through Story Engine");
assert.match(transcript, /showSpeakers\?: boolean/, "StoryTranscript must support explicit nameplate ownership");
assert.match(transcript, /showSpeakers && parsed\.speaker/, "StoryTranscript must honor nameplate ownership");
assert.match(runner, /showSpeakers=\{!beat\.speaker\}/, "StoryRunner must prevent duplicate explicit + parsed nameplates");

assert.match(storyMomentSource, /beginStoryOverlay\(\)/, "Every Story Moment must publish active story-overlay state");
assert.match(storyOverlayBridge, /document\.body\.dataset\.storyOverlayActive = active \? "true" : "false"/,
  "Story Engine must expose active overlay state for external HUD suppression");
assert.match(questInboxSource, /data-story-ui="quest-dock"/, "quest dock must expose a stable Story Engine suppression hook");
assert.match(css, /body\[data-story-overlay-active="true"\] \[data-story-ui="quest-dock"\][\s\S]*display:\s*none !important/,
  "quest dock must be hidden automatically during Story Engine beats");

assert.match(debugPage, /<Act2Runtime debug \/>/, "Story Debug must render the shared production runtime");
assert.match(act2Page, /<Act2Runtime productionEnabled=\{ACT2_PRODUCTION_ENABLED\} \/>/, "Production must render the same shared Act 2 runtime");
assert.doesNotMatch(debugPage, /StoryMoment|StoryTranscript|project-choice|jumpToProject/, "Debug route must not carry a parallel story renderer");
assert.match(act2Runtime, /if \(debug\) \{[\s\S]*loadSaveState\(\)/, "Shared runtime debug mode must load the saved child identity");
assert.match(act2Runtime, /if \(!debug\) await saveAct2RuntimeState\(next\)/, "Debug mode must not persist Act 2 runtime state");
assert.match(act2Runtime, /parseStoryLine\(activeContributionLine, childName\)/, "Act 2 contribution cards must parse speaker and child name centrally");
assert.doesNotMatch(act2Runtime, /storyCardChunk|activeContributionLines|<StoryTranscript lines=\{activeContributionLines\}/,
  "Act 2 contribution UI must never batch several authored dialogue turns into one card");
assert.match(act2Runtime, /<p>\{activeContributionPresentation\?\.text\}<\/p>/,
  "Act 2 contribution cards must render exactly one parsed reply at a time");
assert.match(act2Runtime, /parseStoryLine\(activeFinaleLine, childName\)/, "Act 2 finale cards must parse speaker and child name centrally");
assert.match(act2Runtime, /parseStoryLine\(activeCompletionLine, childName\)/, "Act 2 completion cards must parse speaker and child name centrally");
assert.match(act2Runtime, /meeting-alve\/pick\.png/, "Canonical production project chooser must live in the shared runtime");
assert.match(act2Runtime, /availablePrerequisites\.map/, "Shared runtime must own the first-project chooser");

assert.ok(
  villageRuntime.includes('id: "act1:bottle-letter"')
    && villageRuntime.includes('image: "/assets/village/story-moments/bottle-letter.png"'),
  "Act 1 bottle letter must preserve the accepted image through StoryRunner",
);
assert.ok(
  villageRuntime.includes('speaker: childName || "Barnet"')
    && villageRuntime.includes('speakerTone: "child"')
    && villageRuntime.includes('lines: ["Brevet är klart."]'),
  "Act 1 bottle letter must preserve the child nameplate and text through StoryRunner",
);
assert.ok(
  villageRuntime.includes('nextLabel: "Gå till vattnet"')
    && villageRuntime.includes("onNext={advanceBottleLetter}"),
  "Act 1 bottle letter must preserve the accepted CTA and callback through StoryRunner",
);
assert.equal(
  villageRuntime.includes('{bottleLetterOpen && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 bottle letter must not retain its parallel legacy story shell",
);

assert.ok(
  villageRuntime.includes('{bottleStoryIndex !== null && <StoryMoment')
    && villageRuntime.includes('image="/assets/village/story-moments/bottle-message.png"')
    && villageRuntime.includes('ariaLabel="Skicka flaskpost"'),
  "Act 1 bottle message must preserve its image and accessible label through Story Engine",
);
assert.ok(
  villageRuntime.includes('speakerTone={bottleMessageDialogue[bottleStoryIndex].speaker === "Barnet" ? "child" : "dog"}')
    && villageRuntime.includes('bottleMessageDialogue[bottleStoryIndex].text.replace("{dogName}", dogName || "kompis")'),
  "Act 1 bottle message must preserve speaker tone and dog-name interpolation through Story Engine",
);
assert.ok(
  villageRuntime.includes('nextDisabled={constructionBusy}')
    && villageRuntime.includes('onNext={() => void advanceBottleStory()}')
    && villageRuntime.includes('nextLabel={constructionBusy ? "Sparar…" : bottleStoryIndex === bottleMessageDialogue.length - 1 ? "Kasta iväg!" : "Fortsätt"}'),
  "Act 1 bottle message must preserve busy state, callback and CTA labels through Story Engine",
);
assert.equal(
  villageRuntime.includes('{bottleStoryIndex !== null && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 bottle message must not retain its parallel legacy story shell",
);
assert.ok(
  villageRuntime.includes('ariaLabel="Brevet i flaskposten"'),
  "Act 1 bottle letter must preserve its accessible dialog label after migration",
);

assert.ok(
  villageRuntime.includes('{solStoryIndex !== null && <StoryMoment')
    && villageRuntime.includes('image="/assets/village/story-moments/sol-arrival.png"')
    && villageRuntime.includes('ariaLabel="Sol kommer till byn"'),
  "Act 1 Sol arrival must preserve its image and accessible label through Story Engine",
);
assert.ok(
  villageRuntime.includes('speaker={solArrivalDialogue[solStoryIndex].speaker === "Barnet" ? childName || "Barnet" : "Sol"}')
    && villageRuntime.includes('speakerTone={solArrivalDialogue[solStoryIndex].speaker === "Barnet" ? "child" : "sol"}')
    && villageRuntime.includes('solArrivalDialogue[solStoryIndex].text'),
  "Act 1 Sol arrival must preserve speaker identity and line text through Story Engine",
);
assert.ok(
  villageRuntime.includes('nextDisabled={constructionBusy}')
    && villageRuntime.includes('onNext={() => void advanceSolStory()}')
    && villageRuntime.includes('nextLabel={constructionBusy ? "Sparar…" : solStoryIndex === solArrivalDialogue.length - 1 ? "Se dig omkring" : "Fortsätt"}'),
  "Act 1 Sol arrival must preserve busy state, callback and CTA labels through Story Engine",
);
assert.equal(
  villageRuntime.includes('{solStoryIndex !== null && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 Sol arrival must not retain its parallel legacy story shell",
);

assert.ok(
  villageRuntime.includes('solTourStoryStop && solTourStoryLine && <><div className="story-moment" role="presentation">')
    && villageRuntime.includes('<Image src={solTourImage} alt="" fill priority sizes="100vw" />'),
  "Act 1 Sol tour must preserve its authored per-stop image through the current presentation path",
);
assert.ok(
  villageRuntime.includes('solTourStoryLine.speaker === "Barnet" ? "child" : solTourStoryLine.speaker.toLowerCase()')
    && villageRuntime.includes('{solTourSpeakerName}</span><p>{solTourStoryLine.text}</p>'),
  "Act 1 Sol tour must preserve speaker identity, tone and line text",
);
assert.ok(
  villageRuntime.includes('disabled={constructionBusy} onClick={() => void advanceSolTourStory()}')
    && villageRuntime.includes('solTourStoryStop === "decision" ? "Vi bygger kliniken!" : "Fortsätt rundturen"'),
  "Act 1 Sol tour must preserve busy state, callback and stop-specific final CTA",
);
assert.ok(
  villageRuntime.includes('aria-label="Sol ser sig omkring i byn"'),
  "Act 1 Sol tour must preserve its accessible dialog label",
);

assert.ok(
  villageRuntime.includes('{miraStoryIndex !== null && miraStoryLine && <StoryMoment')
    && villageRuntime.includes('image={miraStoryIndex >= MIRA_ARRIVAL_SCENE_2_START ? "/assets/village/story-moments/mira-discovers-lanthandel.png" : "/assets/village/story-moments/mira-arrival.png"}')
    && villageRuntime.includes('ariaLabel="Mira kommer till byn"'),
  "Act 1 Mira arrival must preserve the accepted two-scene image boundary and accessible label through Story Engine",
);
assert.ok(
  villageRuntime.includes('speaker={miraSpeakerName}')
    && villageRuntime.includes('miraStoryLine?.speaker === "Barnet" ? childName || "Barnet" : miraStoryLine?.speaker ?? ""')
    && villageRuntime.includes('miraStoryLine?.text.replace("[barnets namn]", childName || "Barnet") ?? ""'),
  "Act 1 Mira arrival must preserve speaker resolution and child-name interpolation through Story Engine",
);
assert.ok(
  villageRuntime.includes('speakerTone={miraStoryLine.speaker === "Barnet" ? "child" : miraStoryLine.speaker === "Henning" ? "henning" : miraStoryLine.speaker === "Linus" ? "linus" : "mira"}'),
  "Act 1 Mira arrival must preserve Mira, Henning, Linus and child nameplate tones",
);
assert.ok(
  villageRuntime.includes('nextDisabled={constructionBusy}')
    && villageRuntime.includes('onNext={() => void advanceMiraStory()}')
    && villageRuntime.includes('nextLabel={constructionBusy ? "Sparar…" : miraStoryIndex === miraArrivalDialogue.length - 1 ? "Klart" : "Fortsätt"}'),
  "Act 1 Mira arrival must preserve busy state, callback and CTA labels through Story Engine",
);
assert.ok(
  villageRuntime.includes('{miraStoryReplayIndex !== null && miraStoryReplayLine && <StoryMoment')
    && villageRuntime.includes('ariaLabel="Testvisning av Mira kommer till byn"')
    && villageRuntime.includes('onNext={advanceMiraStoryReplay}')
    && villageRuntime.includes('nextLabel={miraStoryReplayIndex === miraArrivalDialogue.length - 1 ? "Klart" : "Fortsätt"}'),
  "Act 1 Mira replay must preserve its image flow, accessible label, callback and CTA labels through Story Engine",
);
assert.equal(
  villageRuntime.includes('{miraStoryIndex !== null && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 Mira arrival must not retain its parallel legacy story shell",
);
assert.equal(
  villageRuntime.includes('{miraStoryReplayIndex !== null && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 Mira replay must not retain its parallel legacy story shell",
);

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
  { text: "Hej Testbarn.", speaker: "Alve", speakerTone: "alve" },
  "Alve dialogue must use his dedicated nameplate tone while interpolating the child name",
);
for (const [line, tone] of [
  ["Henning: Hej.", "henning"],
  ["Mira: Hej.", "mira"],
  ["Linus: Hej.", "linus"],
  ["Sol: Hej.", "sol"],
]) {
  assert.equal(parseStoryLine(line).speakerTone, tone, `${line.split(":")[0]} must have a dedicated Story Engine nameplate tone`);
}
assert.equal(parseStoryLine("Pappan: Hej.").speakerTone, "default", "Alves pappa is a one-off NPC and must keep the neutral tone");
assert.equal(parseStoryLine("Storasystern: Hej.").speakerTone, "default", "Alves syster is a one-off NPC and must keep the neutral tone");
assert.deepEqual(
  parseStoryLine("Berättarrad med {childName}.", "Testbarn"),
  { text: "Berättarrad med Testbarn." },
  "narration must interpolate child name without inventing a nameplate",
);

console.log("Story UI contract: PASS");

assert.match(css, /\.shared-story-navigation \{[^}]*display:\s*flex/s);
assert.match(css, /\.shared-story-navigation \.dialogue-next \{[^}]*float:\s*none/s);
assert.match(css, /\.shared-story-image-previous,\s*\.shared-story-image-continue \{[^}]*position:\s*static[^}]*min-height:\s*44px/s);
assert.match(act2Runtime, /if \(chapterCardVisible\) return beginStoryOverlay\(\)/,
  "Act 2 chapter cards must suppress external quest UI until acknowledged");
