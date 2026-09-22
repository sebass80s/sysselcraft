import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';

// Execute actual domain/repository code, substituting only external storage/transport.
const modules = new Map();
let rpcResult = { data: null, error: null };
const calls = [];
let binding = null;
let storageFails = false;
const preferences = {
  async get() { return { value: binding }; },
  async set({ value }) { if (storageFails) throw Error('storage unavailable'); binding = value; },
};
function load(file) {
  file = resolve(file);
  if (modules.has(file)) return modules.get(file).exports;
  const record = { exports: {} };
  modules.set(file, record);
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'module', 'exports', code)(name => {
    if (name === '@capacitor/preferences') return { Preferences: preferences };
    if (name === './supabaseClient') return { getSupabaseBrowserClient: () => ({
      async rpc(operation, args) { calls.push({ operation, args }); return rpcResult; },
    }) };
    return load((name.startsWith('@/') ? resolve('src', name.slice(2)) : resolve(dirname(file), name)) + '.ts');
  }, record, record.exports);
  return record.exports;
}

const { createQuestRequestGuard } = load('src/game/questRequestGuard.ts');
const guard = createQuestRequestGuard();
assert.equal(guard.startAction(), false, 'unmounted actions cannot start');
guard.activate();
const old = guard.begin();
const fresh = guard.begin();
assert(!old() && fresh(), 'newer refresh invalidates an out-of-order old response');
assert(guard.startAction());
assert(!fresh(), 'submit invalidates a poll that started before submission');
assert(!guard.startAction(), 'same-tick double submit is blocked before React renders disabled');
guard.finishAction();
const pending = guard.begin();
guard.deactivate();
assert(!pending(), 'unmounted requests cannot publish');
guard.activate();
assert(!pending(), 'StrictMode reactivation cannot revive a previous mount response');
const authenticated = guard.begin();
guard.invalidate();
assert(!authenticated(), 'auth loss invalidates pending reads');
assert(guard.startAction(), 'failed actions can be retried after release');
guard.finishAction();
console.log('PASS request ordering, submit lock, auth invalidation, unmount and remount');

const { presentBackendQuests } = load('src/game/backendQuestPresentation.ts');
const instance = { instanceId: 'day-1', questId: 'recurring', title: 'Bädda sängen', progressionClass: 'wellbeingRoutine', state: 'available', reward: { diamonds: 2, sysselBux: 3 } };
assert.equal(presentBackendQuests([instance], null).available.length, 1);
const submitted = { ...instance, state: 'pending' };
assert.equal(presentBackendQuests([submitted], null).pending.length, 1);
const approved = { ...instance, state: 'approved' };
const tomorrow = { ...instance, instanceId: 'day-2' };
const history = [approved, tomorrow];
const before = JSON.stringify(history);
for (let poll = 0; poll < 20; poll++) {
  const presentation = presentBackendQuests(history, null);
  assert.deepEqual(presentation.available.map(({ quest }) => quest.instanceId), ['day-2']);
  assert.equal(presentation.pending.length, 0);
}
assert.equal(JSON.stringify(history), before, 'presentation never resets history or mutates rewards');
console.log('PASS available/pending/approved presentation and recurring instance isolation across refreshes');

const repository = load('src/backend/familyRepository.ts');
await repository.submitQuest('day-2');
assert.deepEqual(calls.pop(), { operation: 'submit_quest', args: { p_instance_id: 'day-2' } });
const failure = Error('network unavailable');
rpcResult = { error: failure };
await assert.rejects(repository.submitQuest('day-2'), error => error === failure);
assert.equal(calls.length, 1, 'failed mutation is not automatically retried');
calls.length = 0;
rpcResult = { data: [{ instance_id: 'day-1', quest_id: 'recurring', title: 'Bädda sängen', state: 'approved', progression_class: 'wellbeingRoutine', reward_diamonds: 2, reward_syssel_bux: 3, claimed_at: '2026-09-22T02:00:00Z' }], error: null };
for (let i = 0; i < 5; i++) {
  const result = await repository.listChildQuests('child');
  assert.equal(result[0].state, 'approved');
  assert.equal(result[0].claimedAt, '2026-09-22T02:00:00Z');
}
assert(calls.every(call => call.operation === 'list_child_quests'), 'refresh never submits or reviews/rewards quests');
rpcResult = { data: null, error: null };
await repository.claimQuestReward('day-2');
assert.deepEqual(calls.pop(), { operation: 'claim_quest_reward', args: { p_instance_id: 'day-2' } });
console.log('PASS real repository transport: errors propagate, recovery reads preserve approved/claimed state, claim uses dedicated RPC');

globalThis.window = new EventTarget();
window.localStorage = { getItem: () => null };
const bindingApi = load('src/backend/childDeviceBinding.ts');
const observed = [];
window.addEventListener(bindingApi.CHILD_BINDING_CHANGED, () => observed.push(binding));
await bindingApi.setPairedChildId(' first ');
await bindingApi.setPairedChildId('second');
assert.deepEqual(observed, ['first', 'second'], 'binding change is published only after durable storage');
assert.equal(await bindingApi.getPairedChildId(), 'second');
storageFails = true;
await assert.rejects(bindingApi.setPairedChildId('third'));
assert.equal(await bindingApi.getPairedChildId(), 'second');
assert.deepEqual(observed, ['first', 'second'], 'failed pairing storage must not rebind UI');
console.log('PASS binding event ordering and storage failure retention');
console.log('LIMIT: reward exactly-once and recurrence materialization are SQL contracts, not proved by mocked transport.');
