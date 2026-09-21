import assert from "node:assert/strict";
import { chooseQuestPresentation } from "../src/game/questPresentation.ts";
import { presentBackendQuests, primaryPresentedQuest, questPresentationContextFromGameState } from "../src/game/backendQuestPresentation.ts";

const quest = (title, progressionClass) => ({ title, progressionClass });

const starter = { recyclingComplete: false, bakeryUnlocked: false, henningPresent: false };
const recyclingDone = { recyclingComplete: true, bakeryUnlocked: false, henningPresent: false };
const bakery = { recyclingComplete: true, bakeryUnlocked: true, henningPresent: true };

assert.equal(chooseQuestPresentation(quest("Bädda sängen", "wellbeingRoutine"), starter).channel, "home");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), starter).channel, "npc");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), bakery).channel, "npc");
assert.equal(chooseQuestPresentation(quest("Ring mormor", "community"), bakery).presenter, "henning");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), bakery).destination, "bakery");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), recyclingDone).destination, "noticeboard");
assert.equal(chooseQuestPresentation(quest("Gör läxan", "knowledgeCreativity"), recyclingDone).channel, "noticeboard");
assert.equal(chooseQuestPresentation(quest("Hjälp till med middagen", "community"), recyclingDone).channel, "noticeboard");

console.log("quest presentation policy: ok");

const backendQuest = (instanceId, title, progressionClass, state = "available") => ({
  instanceId, questId: "q-" + instanceId, householdId: "h", childId: "c",
  title, description: "", progressionClass,
  reward: { diamonds: 1, sysselBux: 2 }, state,
  createdAt: "", submittedAt: null, approvedAt: null,
});
const gameState = (worldFlags) => ({
  childId: "c", diamonds: 0, sysselBux: 0,
  progression: {
    orderEnvironment: 0, knowledgeCreativity: 0, wellbeingRoutine: 0,
    movementActivity: 0, community: 0, worldProgression: 0,
  },
  worldFlags, updatedAt: "",
});

assert.deepEqual(questPresentationContextFromGameState(gameState({ recyclingCenterStage: 4 })), {
  recyclingComplete: true, bakeryUnlocked: false, henningPresent: false,
});
const snapshot = presentBackendQuests([
  backendQuest("1", "Bädda sängen", "wellbeingRoutine"),
  backendQuest("2", "Gör läxan", "knowledgeCreativity", "pending"),
  backendQuest("3", "Gammalt", "community", "approved"),
], gameState({ recyclingCenterStage: 4 }));
assert.equal(snapshot.available[0].presentation.channel, "home");
assert.equal(snapshot.pending[0].presentation.channel, "noticeboard");
assert.equal(snapshot.available.length + snapshot.pending.length, 2);

assert.equal(primaryPresentedQuest(snapshot)?.quest.instanceId, "1");
assert.equal(primaryPresentedQuest({ available: [], pending: snapshot.pending })?.quest.instanceId, "2");
assert.equal(primaryPresentedQuest({ available: [], pending: [] }), null);
