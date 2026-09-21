import assert from "node:assert/strict";
import { chooseQuestPresentation } from "../src/game/questPresentation.ts";
import { questSourceCounts } from "../src/game/backendQuestPresentation.ts";

const quest = (title, progressionClass) => ({ title, progressionClass });

const starter = { recyclingComplete: false, bakeryUnlocked: false, henningPresent: false, noticeboardAvailable: true };
const recyclingDone = { recyclingComplete: true, bakeryUnlocked: false, henningPresent: false, noticeboardAvailable: true };
const bakery = { recyclingComplete: true, bakeryUnlocked: true, henningPresent: true, noticeboardAvailable: true };

assert.equal(chooseQuestPresentation(quest("Bädda sängen", "wellbeingRoutine"), starter).channel, "home");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), starter).channel, "npc");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), bakery).channel, "npc");
assert.equal(chooseQuestPresentation(quest("Ring mormor", "community"), bakery).presenter, "henning");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), bakery).destination, "bakery");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), recyclingDone).destination, "noticeboard");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), recyclingDone).channel, "noticeboard");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), recyclingDone).channel, "noticeboard");

assert.equal(chooseQuestPresentation(
  quest("Gör läxan", "knowledgeCreativity"),
  { recyclingComplete: true, bakeryUnlocked: false, henningPresent: false, noticeboardAvailable: false },
).presenter, "linus");


assert.equal(chooseQuestPresentation(
  quest("Hjälp till med middagen", "community"),
  { recyclingComplete: true, bakeryUnlocked: true, henningPresent: false, noticeboardAvailable: true },
).destination, "noticeboard");

assert.equal(chooseQuestPresentation(
  quest("Hjälp till med middagen", "community"),
  { recyclingComplete: true, bakeryUnlocked: false, henningPresent: true, noticeboardAvailable: true },
).destination, "noticeboard");

assert.equal(chooseQuestPresentation(
  quest("Hjälp till med middagen", "community"),
  { recyclingComplete: true, bakeryUnlocked: true, henningPresent: false, noticeboardAvailable: false },
).destination, "linus");

assert.deepEqual(questSourceCounts({
  available: [
    { quest: quest("Bädda sängen", "wellbeingRoutine"), presentation: { channel: "home", presenter: "home", destination: "home", reason: "test" } },
    { quest: quest("Gör läxan", "knowledgeCreativity"), presentation: { channel: "noticeboard", presenter: "noticeboard", destination: "noticeboard", reason: "test" } },
  ],
  pending: [
    { quest: quest("Väntar", "community"), presentation: { channel: "npc", presenter: "linus", destination: "linus", reason: "test" } },
  ],
}), { noticeboard: 1, home: 1, linus: 0, bakery: 0 });

console.log("quest presentation policy: ok");

