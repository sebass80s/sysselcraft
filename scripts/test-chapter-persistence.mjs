import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const values = new Map();
const writes = [];
let failScopedWrite = false;
let holdNextWrite = null;
let notifyHeldWriteStarted = null;

const preferences = {
  async get({ key }) {
    return { value: values.has(key) ? values.get(key) : null };
  },
  async set({ key, value }) {
    if (holdNextWrite) {
      const wait = holdNextWrite;
      holdNextWrite = null;
      notifyHeldWriteStarted?.();
      notifyHeldWriteStarted = null;
      await wait;
    }
    if (failScopedWrite && key.includes(".child-a")) throw new Error("storage full");
    writes.push({ type: "set", key, value });
    values.set(key, value);
  },
  async remove({ key }) {
    writes.push({ type: "remove", key });
    values.delete(key);
  },
};

const source = ts.transpileModule(
  readFileSync("src/runtime/save/chapterPersistence.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;

const moduleRecord = { exports: {} };
new Function("require", "module", "exports", source)(
  path => path === "@capacitor/preferences"
    ? { Preferences: preferences }
    : (() => { throw new Error(`Unexpected dependency: ${path}`); })(),
  moduleRecord,
  moduleRecord.exports,
);

const { createChapterPersistenceHost } = moduleRecord.exports;

const fuelProofSourceText = readFileSync("scripts/fixtures/chapter-persistence-fuel-proof.ts", "utf8");
assert.doesNotMatch(
  fuelProofSourceText,
  /@capacitor\/preferences|\bPreferences\b/,
  "a new chapter persistence definition must not own storage I/O",
);
const fuelProofSource = ts.transpileModule(
  fuelProofSourceText,
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
const fuelProofRecord = { exports: {} };
new Function("require", "module", "exports", fuelProofSource)(
  path => {
    throw new Error(`Fuel-proof definition must not require runtime storage dependency: ${path}`);
  },
  fuelProofRecord,
  fuelProofRecord.exports,
);
const { FUEL_PROOF_CHAPTER_PERSISTENCE } = fuelProofRecord.exports;

function normalize(value) {
  if (!value || typeof value !== "object") return null;
  if (value.version !== 1) return null;
  return {
    version: 1,
    seen: value.seen === true,
    counter: Number.isInteger(value.counter) ? Math.max(0, value.counter) : 0,
  };
}

function host() {
  return createChapterPersistenceHost({
    chapterId: "act-test",
    version: 1,
    storageKey: "sysselcraft.chapter.test.v1",
    legacyStorageKey: "sysselcraft.chapter.test.legacy",
    createDefaultState: () => ({ version: 1, seen: false, counter: 0 }),
    normalize,
  });
}

values.clear();
values.set("sysselcraft.backend.childId", "child-a");
assert.deepEqual(await host().load(), { version: 1, seen: false, counter: 0 },
  "absent child-scoped state starts from chapter defaults");

const legacyState = JSON.stringify({ version: 1, seen: true, counter: 3 });
values.set("sysselcraft.chapter.test.legacy", legacyState);
writes.length = 0;
assert.deepEqual(await host().load(), { version: 1, seen: true, counter: 3 });
assert.equal(values.has("sysselcraft.chapter.test.legacy"), false,
  "legacy storage is removed only after migration");
assert.equal(values.get("sysselcraft.chapter.test.v1.child-a"), legacyState,
  "legacy state is copied into the paired-child scope");
assert.deepEqual(writes.map(entry => [entry.type, entry.key]), [
  ["set", "sysselcraft.chapter.test.v1.child-a"],
  ["remove", "sysselcraft.chapter.test.legacy"],
], "canonical write must happen before destructive legacy cleanup");

values.delete("sysselcraft.chapter.test.v1.child-a");
values.set("sysselcraft.chapter.test.legacy", legacyState);
writes.length = 0;
failScopedWrite = true;
await assert.rejects(host().load(), /storage full/);
failScopedWrite = false;
assert.equal(values.get("sysselcraft.chapter.test.legacy"), legacyState,
  "failed canonical migration write preserves durable legacy bytes");
assert.equal(writes.some(entry => entry.type === "remove"), false,
  "failed migration must not clean up the legacy key");

values.set("sysselcraft.chapter.test.v1.child-a", "{broken");
await assert.rejects(host().load(), /Unreadable persisted chapter state/);
assert.equal(values.get("sysselcraft.chapter.test.v1.child-a"), "{broken",
  "unreadable scoped bytes are preserved rather than replaced by defaults");

values.set("sysselcraft.chapter.test.v1.child-a", JSON.stringify({ version: 1, counter: 1 }));
let releaseWrite;
holdNextWrite = new Promise(resolve => { releaseWrite = resolve; });
const orderedHost = host();
const first = orderedHost.save({ version: 1, seen: false, counter: 2 });
const second = orderedHost.save({ version: 1, seen: true, counter: 4 });
releaseWrite();
await Promise.all([first, second]);
assert.deepEqual(
  JSON.parse(values.get("sysselcraft.chapter.test.v1.child-a")),
  { version: 1, seen: true, counter: 4 },
  "queued saves preserve invocation order",
);

await orderedHost.clear();
assert.equal(values.has("sysselcraft.chapter.test.v1.child-a"), false,
  "clear removes only the current paired child's scoped chapter state");

values.set("sysselcraft.backend.childId", "   ");
values.set("sysselcraft.chapter.test.legacy", JSON.stringify({ version: 1, seen: true, counter: 7 }));
assert.deepEqual(await host().load(), { version: 1, seen: true, counter: 7 },
  "unpaired compatibility reads the declared legacy key");

// Unknown/future schema bytes must be preserved exactly.
values.clear();
writes.length = 0;
values.set("sysselcraft.backend.childId", "child-a");
const unsupportedRaw = JSON.stringify({ version: 99, seen: true, counter: 42 });
values.set("sysselcraft.chapter.test.v1.child-a", unsupportedRaw);
await assert.rejects(host().load(), /Unsupported persisted chapter state/);
assert.equal(
  values.get("sysselcraft.chapter.test.v1.child-a"),
  unsupportedRaw,
  "unsupported persisted bytes must remain untouched",
);
assert.equal(
  writes.length,
  0,
  "unsupported state must never be normalized and written back",
);

// A queued operation is bound to the child identity from invocation time.
values.clear();
writes.length = 0;
values.set("sysselcraft.backend.childId", "child-a");
const identityHost = host();
let releaseIdentityWrite;
let markIdentityWriteStarted;
const identityWriteStarted = new Promise(resolve => { markIdentityWriteStarted = resolve; });
holdNextWrite = new Promise(resolve => { releaseIdentityWrite = resolve; });
notifyHeldWriteStarted = markIdentityWriteStarted;
const inFlightForA = identityHost.save({ version: 1, seen: false, counter: 1 });
await identityWriteStarted;
const queuedForA = identityHost.save({ version: 1, seen: true, counter: 2 });
values.set("sysselcraft.backend.childId", "child-b");
releaseIdentityWrite();
await assert.rejects(
  inFlightForA,
  /Stale chapter persistence identity/,
  "an in-flight write must roll back if the paired child changes before completion",
);
await assert.rejects(
  queuedForA,
  /Stale chapter persistence identity/,
  "a save queued for child A must not retarget itself to child B",
);
assert.equal(
  values.has("sysselcraft.chapter.test.v1.child-b"),
  false,
  "identity changes must never receive a queued save from the previous child",
);

// Lifecycle guards cancel queued async persistence before it mutates storage.
values.set("sysselcraft.backend.childId", "child-a");
let releaseGuardWrite;
let markGuardWriteStarted;
const guardWriteStarted = new Promise(resolve => { markGuardWriteStarted = resolve; });
holdNextWrite = new Promise(resolve => { releaseGuardWrite = resolve; });
notifyHeldWriteStarted = markGuardWriteStarted;
const guardBlocker = identityHost.save({ version: 1, seen: false, counter: 3 });
await guardWriteStarted;
let active = true;
const guarded = identityHost.save(
  { version: 1, seen: true, counter: 4 },
  { isActive: () => active },
);
active = false;
releaseGuardWrite();
await guardBlocker;
await assert.rejects(
  guarded,
  /Stale chapter persistence operation/,
  "stopped runtime work must not land a queued persistence write",
);

// A lifecycle guard also rolls back a write that becomes stale while Preferences.set is in flight.
values.clear();
writes.length = 0;
values.set("sysselcraft.backend.childId", "child-a");
const guardedHost = host();
const guardedBaseline = JSON.stringify({ version: 1, seen: false, counter: 8 });
values.set("sysselcraft.chapter.test.v1.child-a", guardedBaseline);
let releaseInFlightGuardWrite;
let markInFlightGuardWriteStarted;
const inFlightGuardWriteStarted = new Promise(resolve => { markInFlightGuardWriteStarted = resolve; });
holdNextWrite = new Promise(resolve => { releaseInFlightGuardWrite = resolve; });
notifyHeldWriteStarted = markInFlightGuardWriteStarted;
let inFlightActive = true;
const inFlightGuardedSave = guardedHost.save(
  { version: 1, seen: true, counter: 9 },
  { isActive: () => inFlightActive, expectedChildId: "child-a" },
);
await inFlightGuardWriteStarted;
inFlightActive = false;
releaseInFlightGuardWrite();
await assert.rejects(
  inFlightGuardedSave,
  /Stale chapter persistence operation/,
  "a write that becomes stale during native persistence must reject",
);
assert.equal(
  values.get("sysselcraft.chapter.test.v1.child-a"),
  guardedBaseline,
  "a stale in-flight write must restore the exact previous durable bytes",
);

await assert.rejects(
  guardedHost.save(
    { version: 1, seen: true, counter: 10 },
    { expectedChildId: "child-b" },
  ),
  /Stale chapter persistence identity/,
  "authoritative work for child B must never write while child A is paired",
);
assert.equal(
  values.get("sysselcraft.chapter.test.v1.child-a"),
  guardedBaseline,
  "expected-child rejection must not mutate the currently paired child's bytes",
);

// update() owns read -> transform -> write as one ordered operation.
values.clear();
writes.length = 0;
values.set("sysselcraft.backend.childId", "child-a");
values.set(
  "sysselcraft.chapter.test.v1.child-a",
  JSON.stringify({ version: 1, seen: false, counter: 1 }),
);
const atomicHost = host();
let releaseUpdate;
let markUpdateStarted;
const updateStarted = new Promise(resolve => { markUpdateStarted = resolve; });
const updateGate = new Promise(resolve => { releaseUpdate = resolve; });
const olderReconciliation = atomicHost.update(async current => {
  assert.equal(current.counter, 1);
  markUpdateStarted();
  await updateGate;
  return { ...current, counter: 2 };
});
await updateStarted;
const newerStorySave = atomicHost.save({ version: 1, seen: true, counter: 4 });
releaseUpdate();
await Promise.all([olderReconciliation, newerStorySave]);
assert.deepEqual(
  JSON.parse(values.get("sysselcraft.chapter.test.v1.child-a")),
  { version: 1, seen: true, counter: 4 },
  "atomic update ordering must prevent an older reconciliation from overwriting a newer Story save",
);

// Fuel proof: a brand-new chapter supplies only data/domain rules.
// Shared persistence must provide migration, child scoping, save/load and clear.
values.clear();
writes.length = 0;
values.set("sysselcraft.backend.childId", "future-child");
values.set(
  "sysselcraft.chapter.fuel-proof.legacy",
  JSON.stringify({ version: 0, opened: true, storyIndex: 5 }),
);
const fuelProofHost = createChapterPersistenceHost(FUEL_PROOF_CHAPTER_PERSISTENCE);
assert.deepEqual(
  await fuelProofHost.load(),
  { version: 1, introSeen: true, localStoryIndex: 5 },
  "new chapter definitions can migrate legacy state through the shared host",
);
assert.equal(values.has("sysselcraft.chapter.fuel-proof.legacy"), false,
  "fuel-proof legacy bytes are removed only after canonical scoped write");
assert.deepEqual(
  JSON.parse(values.get("sysselcraft.chapter.fuel-proof.v1.future-child")),
  { version: 1, introSeen: true, localStoryIndex: 5 },
  "fuel-proof migration writes canonical child-scoped state without chapter storage code",
);
await fuelProofHost.save({ version: 1, introSeen: true, localStoryIndex: 8 });
assert.deepEqual(
  await fuelProofHost.load(),
  { version: 1, introSeen: true, localStoryIndex: 8 },
  "new chapter definitions reuse shared save/load without a storage implementation",
);
await fuelProofHost.clear();
assert.equal(values.has("sysselcraft.chapter.fuel-proof.v1.future-child"), false,
  "new chapter definitions reuse shared clear without a storage implementation");

console.log("PASS: shared chapter persistence owns child scoping, ordered I/O, strict decoding, safe legacy-key migration and new-chapter fuel proof.");
