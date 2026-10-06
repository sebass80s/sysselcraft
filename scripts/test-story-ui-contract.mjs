import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { parseStoryLine, storySpeakerTone } from "../src/game/storyEngine.ts";

const speakerToneFixtures = [
  ["Barnet", "child"],
  ["Hunden", "dog"],
  ["Valpen", "dog"],
  ["Alve", "alve"],
  ["Henning", "henning"],
  ["Mira", "mira"],
  ["Linus", "linus"],
  ["Sol", "sol"],
  ["Gubbe", "default"],
  ["Okänd", "default"],
  ["Pappan", "default"],
  ["Storasystern", "default"],
];

function legacyStorySpeakerTone(speaker) {
  if (speaker === "Barnet") return "child";
  if (speaker === "Hunden" || speaker === "Valpen") return "dog";
  if (speaker === "Alve") return "alve";
  if (speaker === "Henning") return "henning";
  if (speaker === "Mira") return "mira";
  if (speaker === "Linus") return "linus";
  if (speaker === "Sol") return "sol";
  return "default";
}

for (const [speaker, expectedTone] of speakerToneFixtures) {
  assert.equal(
    legacyStorySpeakerTone(speaker),
    expectedTone,
    `legacy story speaker tone oracle drifted for ${speaker}`,
  );
  assert.equal(
    storySpeakerTone(speaker),
    legacyStorySpeakerTone(speaker),
    `shared story speaker tone parity failed for ${speaker}`,
  );
}

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const css = read("src/app/globals.css");
const dialogueCard = read("src/components/story/DialogueCard.tsx");
const inlineDialogueCard = read("src/components/story/InlineDialogueCard.tsx");
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
  /\.dialogue-card\.story-moment-dialogue\.shared-story-dialogue \{[^}]*left:\s*max\(1rem, env\(safe-area-inset-left\)\)[^}]*right:\s*max\(1rem, env\(safe-area-inset-right\)\)[^}]*max-height:[^}]*overflow-y:\s*auto/s,
  "All shared Story cards must honor side safe areas and retain a scroll recovery path",
);
assert.match(
  css,
  /\.shared-story-dialogue \.shared-story-body p \{[^}]*font-size:\s*1rem[^}]*line-height:\s*1\.35/s,
  "Shared Story Engine must own canonical dialogue body typography",
);
assert.equal(
  css.includes(".act2-dialogue-card"),
  false,
  "chapter-named Story CSS must not be allowed to override canonical dialogue presentation",
);
assert.equal(
  act2Runtime.includes('dialogueClassName="act2-dialogue-card"'),
  false,
  "Act 2 must consume canonical shared Story presentation without chapter-named dialogue classes",
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
const storyNameInput = read("src/components/story/StoryNameInput.tsx");
const storyChoiceGroup = read("src/components/story/StoryChoiceGroup.tsx");
const chapterCards = read("src/runtime/chapter/ChapterCards.tsx");
const storyHistoryPanel = read("src/runtime/story/StoryHistoryPanel.tsx");
const storySequence = read("src/runtime/story/storySequence.ts");
assert.match(storyMomentSource, /setImageOnlyPresentationId\(presentationId\)/, "StoryMoment must hide the dialogue before advancing");
assert.match(storyMomentSource, /shared-story-image-continue/, "clean image mode must advance from the unobstructed image");
assert.match(storyMomentSource, /presentationId/, "clean image mode must reset between authored panels");
assert.match(storyMomentSource, /className="primary-button shared-story-image-continue"[\s\S]*Fortsätt/, "clean image mode must keep a visible Continue button");
assert.match(storyNameInput, /autoComplete="off"/, "shared naming input must disable autocomplete");
assert.match(storyNameInput, /autoCorrect="off"/, "shared naming input must disable autocorrect");
assert.match(storyNameInput, /autoCapitalize="words"/, "shared naming input must use word capitalization");
assert.match(storyNameInput, /spellCheck=\{false\}/, "shared naming input must disable spellcheck");
assert.match(storyNameInput, /inputMode="text"/, "shared naming input must request text keyboard");
assert.match(storyNameInput, /enterKeyHint="done"/, "shared naming input must expose Done keyboard action");
assert.match(storyNameInput, /event\.key !== "Enter"/, "shared naming input must own Enter-to-submit behavior");
assert.match(storyNameInput, /currentValue\.trim\(\)\.length > 0/, "shared naming input must own non-empty validation");
assert.match(css, /\.shared-story-text-input[^}]*width:\s*100%/s, "shared naming input must use canonical Story input styling");
assert.match(
  act2Runtime,
  /<StoryNameInput[\s\S]*placeholder="Skriv båtens namn"[\s\S]*ariaLabel="Båtens namn"[\s\S]*submitLabel="Spara namnet"/,
  "Act 2 motorboat naming must consume the shared Story naming input",
);
assert.match(chapterCards, /export function ChapterIntroCard/, "shared runtime must own chapter intro presentation");
assert.match(chapterCards, /export function ChapterEndCard/, "shared runtime must own chapter end-card presentation");
assert.match(chapterCards, /revealTitleBeforeContinue = true/, "shared chapter intro must own the canonical two-step title reveal");
assert.match(css, /\.shared-chapter-card \{[^}]*position:\s*fixed[^}]*z-index:\s*160[^}]*safe-area-inset-top/s,
  "shared chapter cards must own fullscreen layering and safe-area presentation");
assert.match(act2Runtime, /<ChapterIntroCard[\s\S]*chapterLabel="KAPITEL 2"[\s\S]*title="ALVE"/,
  "Act 2 intro must be content/configuration over the shared chapter card");
assert.match(act2Runtime, /<ChapterEndCard[\s\S]*title="SLUT PÅ ANDRA KAPITLET"[\s\S]*continueLabel="Fortsätt vid sjön"/,
  "Act 2 end card must be content/configuration over the shared chapter card");
assert.equal(act2Runtime.includes("act2-chapter-intro"), false,
  "Act 2 must not retain chapter-local intro presentation markup");
assert.equal(css.includes(".act2-chapter-intro"), false,
  "chapter-local intro CSS must not coexist with shared chapter-card styling");
assert.match(storyHistoryPanel, /export function StoryHistoryPanel/, "shared Story Engine must own history panel and replay shell");
assert.match(storyHistoryPanel, /<StoryRunner/, "shared Story History must replay beats through the canonical Story runner");
assert.match(storyHistoryPanel, /onReplayOpenChange/, "shared history shell must expose replay-open state for runtime input arbitration");
assert.match(act2Runtime, /<StoryHistoryPanel[\s\S]*groups=\{historyGroups\}[\s\S]*parseLine=\{parseStoryLine\}/,
  "Act 2 must provide only history data and parsing to the shared history UI");
assert.equal(act2Runtime.includes("act2-history-overlay"), false,
  "Act 2 must not retain chapter-local history presentation markup");
assert.equal(css.includes(".act2-history-overlay"), false,
  "chapter-local history CSS must not coexist with shared Story History styling");
assert.match(css, /\.shared-story-history-overlay \{[^}]*safe-area-inset-top[^}]*z-index:\s*105/s,
  "shared Story History must own safe-area placement and layering");
assert.match(storySequence, /export function advanceStoryLine/, "shared Story Engine must own ordinary linear advance semantics");
assert.match(storySequence, /export function previousStoryLineIndex/, "shared Story Engine must own ordinary linear previous semantics");
assert.match(storySequence, /export function storyLineAt/, "shared Story Engine must own safe current-line lookup");
assert.match(
  act2Runtime,
  /advanceStoryLine\(\s*activeCompletionBeat\.body\.length,[\s\S]*state\.completionLineIndex/,
  "Act 2 completion reactions must use shared linear sequencing",
);
assert.match(
  act2Runtime,
  /advanceStoryLine\(\s*CABIN_WAITING_REACTION\.body\.length,[\s\S]*cabinRevisitLineIndex/,
  "Act 2 cabin revisit must use shared linear sequencing",
);
assert.match(
  act2Runtime,
  /storyLineAt\(activeContributionBeat\.body, state\.contributionLineIndex\)/,
  "Act 2 contribution dialogue must use shared safe current-line lookup",
);
assert.match(
  act2Runtime,
  /advanceStoryLine\(\s*activeContributionBeat\.body\.length,[\s\S]*state\.contributionLineIndex/,
  "Act 2 contribution dialogue must use shared linear advance semantics",
);
assert.match(
  act2Runtime,
  /previousStoryLineIndex\(\s*activeContributionBeat\.body\.length,[\s\S]*state\.contributionLineIndex/,
  "Act 2 contribution dialogue must use shared linear previous semantics",
);
assert.match(
  act2Runtime,
  /storyLineAt\(opening\.body, state\.openingLineIndex\)/,
  "Act 2 opening dialogue must use shared safe current-line lookup",
);
assert.match(
  act2Runtime,
  /advanceStoryLine\(current\.body\.length, state\.openingLineIndex\)/,
  "Act 2 opening dialogue must use shared linear advance semantics within each beat",
);
assert.match(
  act2Runtime,
  /previousStoryLineIndex\(current\.body\.length, state\.openingLineIndex\)/,
  "Act 2 opening dialogue must use shared linear previous semantics within each beat",
);
assert.match(
  act2Runtime,
  /storyLineAt\(activeFinaleBeat\.body, finaleLineIndex\)/,
  "Act 2 finale dialogue must use shared safe current-line lookup",
);
assert.match(
  act2Runtime,
  /advanceStoryLine\(activeFinaleBeat\.body\.length, finaleLineIndex\)/,
  "Act 2 finale dialogue must use shared linear advance semantics within each beat",
);
assert.match(
  act2Runtime,
  /previousStoryLineIndex\(\s*activeFinaleBeat\.body\.length,[\s\S]*finaleLineIndex/,
  "Act 2 finale dialogue must use shared linear previous semantics within each beat",
);
assert.match(
  act2Runtime,
  /advanceStoryLine\(ACT2_ALVE_DIALOGUE\.length, state\.alveIntroIndex\)/,
  "Act 2 Alve intro must use shared linear advance semantics",
);
assert.match(
  act2Runtime,
  /previousStoryLineIndex\(\s*ACT2_ALVE_DIALOGUE\.length,[\s\S]*state\.alveIntroIndex/,
  "Act 2 Alve intro must use shared linear previous semantics",
);
assert.equal(
  css.includes(".act2-history-button"),
  false,
  "retired chapter-local history CSS must not remain after shared History migration",
);
assert.match(
  storyMomentSource,
  /export type StoryPresentationVariant =/,
  "shared Story presentation must expose semantic variants",
);
assert.match(
  storyMomentSource,
  /finale: \{ zIndex: 100, background: "rgba\(6,10,8,.96\)" \}/,
  "shared Story presentation must own finale layering and background",
);
assert.doesNotMatch(
  storyMomentSource,
  /zIndex\?: number|background\?: string|dialogueClassName\?: string/,
  "shared Story API must not expose raw visual drift controls",
);
assert.doesNotMatch(
  act2Runtime,
  /\bzIndex=|\bbackground="/,
  "Act 2 Story surfaces must use semantic presentation variants instead of raw layering or backgrounds",
);
assert.doesNotMatch(
  villageRuntime,
  /dialogueClassName="act2-dialogue-card"/,
  "Village shop handoff must not resurrect Act 2-specific dialogue styling",
);
assert.match(
  villageRuntime,
  /variant="handoff"/,
  "cross-chapter shop handoff must use the shared high-priority Story presentation variant",
);
assert.match(storyChoiceGroup, /export function StoryChoiceGroup/, "shared Story UI must own standard choice layout");
assert.match(storyChoiceGroup, /aria-pressed=\{selected === option\.value\}/, "shared Story choices must expose canonical selected state");
assert.match(css, /\.shared-story-choice-options \{[^}]*display:\s*flex[^}]*flex-wrap:\s*wrap[^}]*justify-content:\s*center/s,
  "shared Story choices must own wrapping and spacing");
assert.match(
  act2Runtime,
  /<StoryChoiceGroup[\s\S]*selected=\{previewProject\}[\s\S]*onSelect=\{setPreviewProject\}/,
  "Act 2 project selection must consume the shared choice component",
);
assert.doesNotMatch(
  act2Runtime,
  /display:\s*"flex", gap:\s*8, flexWrap:\s*"wrap", justifyContent:\s*"center"/,
  "Act 2 must not retain inline standard choice layout",
);
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
assert.match(act2Runtime, /if \(debugMode\) \{[\s\S]*loadSaveState\(\)/, "Act 2 boot adapter must load the saved child identity in shared-host debug mode");
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
  villageRuntime.includes('speakerTone={storySpeakerTone(bottleMessageDialogue[bottleStoryIndex].speaker)}')
    && villageRuntime.includes('bottleMessageDialogue[bottleStoryIndex].text.replace("{dogName}", dogName || "kompis")'),
  "Act 1 bottle message must preserve speaker tone and dog-name interpolation through the shared tone mapping",
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
    && villageRuntime.includes('speakerTone={storySpeakerTone(solArrivalDialogue[solStoryIndex].speaker)}')
    && villageRuntime.includes('solArrivalDialogue[solStoryIndex].text'),
  "Act 1 Sol arrival must preserve speaker identity and line text through the shared tone mapping",
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
  villageRuntime.includes('{solTourStoryStop && solTourStoryLine && <StoryMoment')
    && villageRuntime.includes('image={solTourImage}')
    && villageRuntime.includes('ariaLabel="Sol ser sig omkring i byn"'),
  "Act 1 Sol tour must preserve its authored per-stop image and accessible label through Story Engine",
);
assert.ok(
  villageRuntime.includes('speaker={solTourSpeakerName}')
    && villageRuntime.includes('speakerTone={storySpeakerTone(solTourStoryLine.speaker)}')
    && villageRuntime.includes('<p>{solTourStoryLine.text}</p>'),
  "Act 1 Sol tour must preserve child, Henning, Mira, Linus and Sol speaker presentation through the shared tone mapping",
);
assert.ok(
  villageRuntime.includes('nextDisabled={constructionBusy}')
    && villageRuntime.includes('onNext={() => void advanceSolTourStory()}')
    && villageRuntime.includes('solTourStoryStop === "decision" ? "Vi bygger kliniken!" : "Fortsätt rundturen"'),
  "Act 1 Sol tour must preserve busy state, callback and stop-specific final CTA through Story Engine",
);
assert.equal(
  villageRuntime.includes('solTourStoryStop && solTourStoryLine && <><div className="story-moment" role="presentation">'),
  false,
  "Act 1 Sol tour must not retain its parallel legacy story shell",
);

assert.ok(
  villageRuntime.includes('{bakeryStoryIndex !== null && bakeryStoryLine && <StoryMoment')
    && villageRuntime.includes('image="/assets/village/story-moments/bakery-completion.png"')
    && villageRuntime.includes('ariaLabel="Bageriet är färdigt"'),
  "Act 1 Bakery completion must preserve its accepted image and accessible label through Story Engine",
);
assert.ok(
  villageRuntime.includes('speaker={bakerySpeakerName}')
    && villageRuntime.includes('speakerTone={storySpeakerTone(bakeryStoryLine.speaker)}')
    && villageRuntime.includes('<p>{bakeryStoryLine.text}</p>'),
  "Act 1 Bakery completion must preserve child, Linus and Henning speaker presentation through the shared tone mapping",
);
assert.ok(
  villageRuntime.includes('nextDisabled={constructionBusy}')
    && villageRuntime.includes('onNext={() => void advanceBakeryStory()}')
    && villageRuntime.includes('nextLabel={constructionBusy ? "Sparar…" : bakeryStoryIndex === bakeryCompletionDialogue.length - 1 ? "Klart" : "Fortsätt"}'),
  "Act 1 Bakery completion must preserve busy state, callback and CTA labels through Story Engine",
);
assert.ok(
  villageRuntime.includes('{bakeryStoryReplayIndex !== null && bakeryStoryReplayLine && <StoryMoment')
    && villageRuntime.includes('ariaLabel="Testvisning av färdigt bageri"')
    && villageRuntime.includes('onNext={advanceBakeryStoryReplay}'),
  "Act 1 Bakery replay must preserve image, accessible label and callback through Story Engine",
);
assert.equal(
  villageRuntime.includes('{bakeryStoryIndex !== null && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 Bakery completion must not retain its parallel legacy story shell",
);
assert.equal(
  villageRuntime.includes('{bakeryStoryReplayIndex !== null && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 Bakery replay must not retain its parallel legacy story shell",
);

assert.ok(
  villageRuntime.includes('speakerTone={storySpeakerTone(bakeryStoryReplayLine.speaker)}'),
  "Act 1 Bakery replay must consume the shared child/Linus/Henning speaker tone mapping",
);

assert.ok(
  villageRuntime.includes('{clinicStoryIndex !== null && clinicStoryLine && <StoryMoment')
    && villageRuntime.includes('image={clinicStoryLine.scene === "complete" ? "/assets/village/story-moments/sol-clinic-complete.png" : "/assets/village/story-moments/sol-treats-linus.png"}')
    && villageRuntime.includes('ariaLabel="Sols klinik är färdig"'),
  "Act 1 Clinic completion must preserve its two-scene image boundary and accessible label through Story Engine",
);
assert.ok(
  villageRuntime.includes('speaker={clinicSpeakerName}')
    && villageRuntime.includes('speakerTone={storySpeakerTone(clinicStoryLine.speaker)}')
    && villageRuntime.includes('<p>{clinicStoryLine.text}</p>'),
  "Act 1 Clinic completion must preserve child, Linus and Sol speaker presentation through the shared tone mapping",
);
assert.ok(
  villageRuntime.includes('onNext={advanceClinicStory}')
    && villageRuntime.includes('nextLabel={clinicStoryIndex === clinicCompletionDialogue.length - 1 ? "Klart" : "Fortsätt"}'),
  "Act 1 Clinic completion must preserve callback and CTA labels through Story Engine",
);
assert.ok(
  villageRuntime.includes('{clinicStoryReplayIndex !== null && clinicStoryReplayLine && <StoryMoment')
    && villageRuntime.includes('image={clinicStoryReplayLine.scene === "complete" ? "/assets/village/story-moments/sol-clinic-complete.png" : "/assets/village/story-moments/sol-treats-linus.png"}')
    && villageRuntime.includes('ariaLabel="Testvisning av Sols färdiga klinik"')
    && villageRuntime.includes('onNext={advanceClinicStoryReplay}'),
  "Act 1 Clinic replay must preserve scene image, accessible label and callback through Story Engine",
);
assert.equal(
  villageRuntime.includes('{clinicStoryIndex !== null && clinicStoryLine && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 Clinic completion must not retain its parallel legacy story shell",
);
assert.equal(
  villageRuntime.includes('{clinicStoryReplayIndex !== null && clinicStoryReplayLine && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 Clinic replay must not retain its parallel legacy story shell",
);

assert.ok(
  villageRuntime.includes('speakerTone={storySpeakerTone(clinicStoryReplayLine.speaker)}'),
  "Act 1 Clinic replay must consume the shared child/Linus/Sol speaker tone mapping",
);

assert.ok(
  villageRuntime.includes('{act1ChapterFinaleIndex !== null && act1ChapterFinaleLine && <StoryMoment')
    && villageRuntime.includes('image={act1ChapterFinaleImage}')
    && villageRuntime.includes('ariaLabel="Byn lever igen"'),
  "Act 1 chapter finale dialogue must preserve its canonical image and accessible label through Story Engine",
);
assert.ok(
  villageRuntime.includes('speaker={act1ChapterFinaleSpeakerName}')
    && villageRuntime.includes('speakerTone={storySpeakerTone(act1ChapterFinaleLine.speaker)}')
    && villageRuntime.includes('<p>{act1ChapterFinaleLine.text}</p>'),
  "Act 1 chapter finale dialogue must preserve all authored speaker presentation through the shared tone mapping",
);
assert.ok(
  villageRuntime.includes('nextDisabled={constructionBusy}')
    && villageRuntime.includes('onNext={() => void advanceAct1ChapterFinale()}')
    && villageRuntime.includes('nextLabel={constructionBusy ? "Sparar…" : act1ChapterFinaleIndex === act1ChapterFinaleDialogue.length - 1 ? "Avsluta kapitlet" : "Fortsätt"}'),
  "Act 1 chapter finale dialogue must preserve busy state, callback and final CTA through Story Engine",
);
assert.equal(
  villageRuntime.includes('{act1ChapterFinaleIndex !== null && act1ChapterFinaleLine && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 chapter finale dialogue must not retain its parallel legacy story shell",
);

assert.ok(
  villageRuntime.includes('{henningStoryIndex !== null && <StoryMoment')
    && villageRuntime.includes('image="/assets/village/story-moments/henning-arrival.png"')
    && villageRuntime.includes('ariaLabel="Henning kommer till byn"'),
  "Act 1 Henning arrival must preserve its accepted image and accessible label through Story Engine",
);
assert.ok(
  villageRuntime.includes('speaker={henningArrivalDialogue[henningStoryIndex].speaker === "Barnet" ? childName || "Barnet" : henningArrivalDialogue[henningStoryIndex].speaker}')
    && villageRuntime.includes('speakerTone={storySpeakerTone(henningArrivalDialogue[henningStoryIndex].speaker)}'),
  "Act 1 Henning arrival must preserve child-name resolution and Henning/Linus/child speaker tones through Story Engine",
);
assert.ok(
  villageRuntime.includes('nextDisabled={constructionBusy}')
    && villageRuntime.includes('onNext={() => void advanceHenningStory()}')
    && villageRuntime.includes('nextLabel={constructionBusy ? "Sparar…" : henningStoryIndex === henningArrivalDialogue.length - 1 ? "Klart" : "Fortsätt"}'),
  "Act 1 Henning arrival must preserve busy state, callback and CTA labels through Story Engine",
);
assert.ok(
  villageRuntime.includes('{henningStoryReplayIndex !== null && <StoryMoment')
    && villageRuntime.includes('ariaLabel="Testvisning av Henning kommer till byn"')
    && villageRuntime.includes('onNext={advanceHenningStoryReplay}'),
  "Act 1 Henning replay must preserve image, accessible label and callback through Story Engine",
);
assert.equal(
  villageRuntime.includes('{henningStoryIndex !== null && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 Henning arrival must not retain its parallel legacy story shell",
);
assert.equal(
  villageRuntime.includes('{henningStoryReplayIndex !== null && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 Henning replay must not retain its parallel legacy story shell",
);

assert.ok(
  villageRuntime.includes('{linusStoryMomentOpen && dialogueOpen && dialogueStep && !recyclingStoryOpen && <StoryMoment')
    && villageRuntime.includes('image={dialogueIndex >= linusIntroDialogue.findIndex((step) => step.kind === "reveal-dog") ? "/assets/village/story-moments/linus-puppy-handover.png" : "/assets/village/story-moments/linus-first-meeting.png"}')
    && villageRuntime.includes('ariaLabel="Linus första möte"'),
  "Act 1 Linus intro must preserve the puppy-reveal image boundary through Story Engine",
);
assert.ok(
  villageRuntime.includes('speaker={dialogueStep.kind === "line" ? speakerName')
    && villageRuntime.includes('nextLabel={dialogueStep.kind === "line" ? "Fortsätt" : undefined}')
    && villageRuntime.includes('onNext={dialogueStep.kind === "line" ? advanceDialogue : undefined}')
    && villageRuntime.includes('{dialogueStep.kind === "line" && <p>{introDialogueText}</p>}'),
  "Act 1 Linus live line steps must preserve resolved speaker/text and advance callback through Story Engine",
);
assert.ok(
  villageRuntime.includes('<StoryNameInput ref={childNameInputRef}')
    && villageRuntime.includes('onCanSubmitChange={setChildNameCanSubmit}')
    && villageRuntime.includes('onSubmit={finishChildNaming}')
    && villageRuntime.includes('placeholder="Skriv ditt namn"')
    && villageRuntime.includes('ariaLabel="Ditt namn"'),
  "Act 1 Linus child naming must consume the shared Story naming input",
);
assert.ok(
  villageRuntime.includes('<StoryNameInput ref={dogNameInputRef}')
    && villageRuntime.includes('onCanSubmitChange={setDogNameCanSubmit}')
    && villageRuntime.includes('onSubmit={finishDogNaming}')
    && villageRuntime.includes('placeholder="Skriv ett namn"')
    && villageRuntime.includes('setDogVisible(true)'),
  "Act 1 Linus dog naming must consume the shared Story naming input while preserving reveal state",
);
assert.ok(
  villageRuntime.includes('{linusStoryReplayStep && linusStoryReplayIndex !== null && !recyclingStoryOpen && <StoryMoment')
    && villageRuntime.includes('linusStoryReplayStep.kind === "name-child"')
    && villageRuntime.includes('linusStoryReplayStep.kind === "reveal-dog"')
    && villageRuntime.includes('linusStoryReplayStep.kind === "name-dog"')
    && villageRuntime.includes('onNext={advanceLinusStoryReplay}')
    && villageRuntime.includes('nextLabel={linusStoryReplayIndex === linusIntroDialogue.length - 1 ? "Klart" : "Fortsätt"}'),
  "Act 1 Linus replay must preserve naming/reveal summaries and replay navigation through Story Engine",
);
assert.equal(
  villageRuntime.includes('((linusStoryMomentOpen && dialogueOpen) || linusStoryReplayIndex !== null) && !recyclingStoryOpen && <div className="story-moment" role="presentation">'),
  false,
  "Act 1 Linus intro must not retain its parallel legacy fullscreen shell",
);
assert.equal(
  villageRuntime.includes('if (restoredIntroCompleteRef.current) {\n            setLinusStoryReplayIndex(0);'),
  false,
  "completed Linus onboarding must never reopen the first-meeting replay from ordinary resident interaction",
);

assert.ok(
  inlineDialogueCard.includes('<div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label={ariaLabel}>')
    && inlineDialogueCard.includes('<span className={`dialogue-speaker${extraSpeakerClass}${speakerToneClass}`}>{speaker}</span>')
    && inlineDialogueCard.includes('<button className={nextClassName} disabled={nextDisabled} onClick={onNext}>{nextLabel}</button>')
    && inlineDialogueCard.includes('nextClassName = "primary-button dialogue-next"')
    && inlineDialogueCard.includes('{footer}'),
  "shared inline dialogue card must preserve the compact dialogue-card markup contract",
);
assert.ok(
  villageRuntime.includes('return <InlineDialogueCard')
    && villageRuntime.includes('ariaLabel="Prata med Linus om återvinningen"')
    && villageRuntime.includes('speaker={step.speaker}')
    && villageRuntime.includes('nextLabel={last ? "Klart" : "Nästa"}'),
  "Recycling dialogue must consume the shared inline-dialogue card without changing speaker or navigation behavior",
);
assert.ok(
  villageRuntime.includes('{abandonedShopDialogueLine && <InlineDialogueCard')
    && villageRuntime.includes('ariaLabel="Den övergivna lanthandeln"')
    && villageRuntime.includes('speakerTone={abandonedShopDialogueLine.speaker === "Barnet" ? "child" : "default"}')
    && villageRuntime.includes('nextLabel={abandonedShopDialogueIndex !== null && abandonedShopDialogueIndex + 1 < abandonedShopDialogue.length ? "Nästa" : "Klart"}'),
  "Abandoned-shop dialogue must consume the shared inline-dialogue card with its child tone and navigation preserved",
);
assert.ok(
  villageRuntime.includes('return <InlineDialogueCard')
    && villageRuntime.includes('ariaLabel="Prata med Henning"')
    && villageRuntime.includes('speaker={step.speaker}')
    && villageRuntime.includes('speakerClassName="henning-story-speaker"')
    && villageRuntime.includes('speakerTone={step.speaker === "Linus" ? "linus" : "henning"}')
    && villageRuntime.includes('nextLabel={last ? "Klart" : "Nästa"}')
    && villageRuntime.includes('onNext={() => advanceHenningDialogue(last)}'),
  "Henning inline dialogue must consume the shared card while preserving its speaker classes and navigation",
);
assert.ok(
  villageRuntime.includes('{recyclingStoryOpen && recyclingStoryLine && <InlineDialogueCard')
    && villageRuntime.includes('ariaLabel="Återvinningscentralen är färdig"')
    && villageRuntime.includes('speaker={recyclingSpeakerName}')
    && villageRuntime.includes('speakerTone={recyclingStoryLine.speaker === "Barnet" ? "child" : "default"}')
    && villageRuntime.includes('nextDisabled={constructionBusy}')
    && villageRuntime.includes('onNext={() => void advanceRecyclingStory()}')
    && villageRuntime.includes('nextLabel={constructionBusy ? "Sparar…" : recyclingStoryIndex === recyclingCompletionDialogue.length - 1 ? "Klart" : "Fortsätt"}')
    && villageRuntime.includes('footer={constructionError ? <p role="alert">{constructionError}</p> : undefined}'),
  "Recycling completion dialogue must consume the shared inline card while preserving speaker, busy state, CTA and trailing error row",
);
assert.ok(
  villageRuntime.includes('{constructionDialogueId && attention?.id === constructionDialogueId && constructionDialogueLine && <InlineDialogueCard')
    && villageRuntime.includes('ariaLabel="Byggplatsens samtal"')
    && villageRuntime.includes('speaker={constructionSpeakerName}')
    && villageRuntime.includes('speakerClassName={constructionDialogueLine.speaker === "Barnet" ? "child" : constructionDialogueLine.speaker.toLowerCase()}')
    && villageRuntime.includes('nextClassName="primary-button"')
    && villageRuntime.includes('nextDisabled={constructionBusy}')
    && villageRuntime.includes('constructionBusy ? "Sparar…" : constructionDialogueIndex + 1 < attention.dialogue.length ? "Nästa" : "Fortsätt"')
    && villageRuntime.includes('<button className="secondary-button" disabled={constructionBusy}')
    && villageRuntime.includes('setConstructionDialogueId(null); setConstructionDialogueIndex(0);')
    && villageRuntime.includes('{constructionError && <p role="alert">{constructionError}</p>}</>}'),
  "Construction dialogue must consume the shared inline card while preserving speaker class, primary button class, busy state, Later action and trailing error row",
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
  villageRuntime.includes('speakerTone={storySpeakerTone(miraStoryLine.speaker)}')
    && villageRuntime.includes('speakerTone={storySpeakerTone(miraStoryReplayLine.speaker)}'),
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
