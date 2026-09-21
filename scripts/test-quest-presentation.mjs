import assert from "node:assert/strict";
import { chooseQuestPresentation } from "../src/game/questPresentation.ts";

const quest = (title, progressionClass) => ({ title, progressionClass });

const starter = { recyclingComplete: false, bakeryUnlocked: false, henningPresent: false };
const recyclingDone = { recyclingComplete: true, bakeryUnlocked: false, henningPresent: false };
const bakery = { recyclingComplete: true, bakeryUnlocked: true, henningPresent: true };

assert.equal(chooseQuestPresentation(quest("Bädda sängen", "wellbeingRoutine"), starter).channel, "home");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), starter).channel, "linus");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), bakery).channel, "bakery");
assert.equal(chooseQuestPresentation(quest("Ring mormor", "community"), bakery).presenter, "henning");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), recyclingDone).channel, "village");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), recyclingDone).channel, "village");

console.log("quest presentation policy: ok");
