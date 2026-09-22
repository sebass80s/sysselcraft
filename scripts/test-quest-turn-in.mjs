import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

let storage = new Map();
const modules = new Map();

function load(file) {
  if (modules.has(file)) return modules.get(file).exports;
  const record = { exports: {} };
  modules.set(file, record);
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function("require", "module", "exports")(name => {
    if (name === "@capacitor/preferences") return {
      Preferences: {
        async get({ key }) { return { value: storage.get(key) ?? null }; },
        async set({ key, value }) { storage.set(key, value); },
      },
    };
    if (name === "@/backend/types") return {};
    throw new Error(`Unexpected import: ${name}`);
  }, record, record.exports);
  return record.exports;
}

const state = load("src/game/questTurnInState.ts");

function quest(instanceId, status, claimedAt = null) {
  return {
    instanceId,
    questId: "q",
    householdId: "h",
    childId: "child",
    title: "Gör läxan",
    description: "Test",
    progressionClass: "knowledgeCreativity",
    reward: { diamonds: 1, sysselBux: 10 },
    state: status,
    createdAt: "2026-09-22T00:00:00Z",
    submittedAt: status === "available" ? null : "2026-09-22T01:00:00Z",
    approvedAt: status === "approved" ? "2026-09-22T02:00:00Z" : null,
    claimedAt,
  };
}

await state.rememberAwaitingApproval("child", "offline");
assert.deepEqual(
  await state.recoverAwaitingQuestTurnIns("child", [quest("offline", "pending")]),
  [],
  "pending submission remains awaiting and does not create a turn-in",
);

const recovered = await state.recoverAwaitingQuestTurnIns("child", [quest("offline", "approved")]);
assert.deepEqual(recovered.map(item => item.instanceId), ["offline"], "offline approval is recovered after relaunch");

assert.deepEqual(
  (await state.recoverAwaitingQuestTurnIns("child", [quest("offline", "approved")])).map(item => item.instanceId),
  ["offline"],
  "repeated refresh does not duplicate the recovered turn-in",
);

assert.deepEqual(
  (await state.claimQuestTurnIn("child", "offline")).map(item => item.instanceId),
  [],
  "claim removes the durable pending turn-in",
);
assert.deepEqual(
  await state.recoverAwaitingQuestTurnIns("child", [quest("offline", "approved", "2026-09-22T03:00:00Z")]),
  [],
  "claimed reward does not replay after restart",
);

storage = new Map();
await state.rememberAwaitingApproval("child", "rejected");
assert.deepEqual(
  await state.recoverAwaitingQuestTurnIns("child", [quest("rejected", "available")]),
  [],
  "rejected submission clears awaiting state without creating a turn-in",
);
assert.deepEqual(
  await state.recoverAwaitingQuestTurnIns("child", [quest("rejected", "approved")]),
  [],
  "a later arbitrary approved read cannot resurrect a rejected submission",
);

storage = new Map();
assert.deepEqual(
  await state.recoverAwaitingQuestTurnIns("child", [quest("historical", "approved")]),
  [],
  "arbitrary approved history never creates a turn-in",
);

console.log("Quest turn-in persistence, offline recovery and replay-protection tests passed.");
