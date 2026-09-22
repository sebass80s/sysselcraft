import assert from "node:assert/strict";
import { newlyApprovedQuests } from "../src/game/questTurnInState.ts";

function quest(instanceId, state) {
  return {
    instanceId,
    questId: "q",
    householdId: "h",
    childId: "c",
    title: "Bädda sängen",
    description: "Test",
    progressionClass: "orderEnvironment",
    reward: { diamonds: 1, sysselBux: 5 },
    state,
    createdAt: "2026-09-22T00:00:00Z",
    submittedAt: state === "available" ? null : "2026-09-22T01:00:00Z",
    approvedAt: state === "approved" ? "2026-09-22T02:00:00Z" : null,
  };
}

assert.deepEqual(
  newlyApprovedQuests(new Map([["i1", "pending"]]), [quest("i1", "approved")]).map((q) => q.instanceId),
  ["i1"],
  "pending -> approved creates a turn-in",
);

assert.deepEqual(
  newlyApprovedQuests(new Map(), [quest("old", "approved")]),
  [],
  "already-approved history must not create retroactive turn-ins",
);

assert.deepEqual(
  newlyApprovedQuests(new Map([["i1", "approved"]]), [quest("i1", "approved")]),
  [],
  "repeated refresh must not replay a turn-in",
);

assert.deepEqual(
  newlyApprovedQuests(new Map([["i1", "pending"], ["i2", "available"]]), [quest("i1", "approved"), quest("i2", "pending")]).map((q) => q.instanceId),
  ["i1"],
  "only the newly approved occurrence is celebrated",
);

console.log("Quest turn-in transition tests passed.");
