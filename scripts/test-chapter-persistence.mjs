import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const values = new Map();
const writes = [];
let failScopedWrite = false;
let holdNextWrite = null;

const preferences = {
  async get({ key }) {
    return { value: values.has(key) ? values.get(key) : null };
  },
  async set({ key, value }) {
    if (holdNextWrite) {
      const wait = holdNextWrite;
      holdNextWrite = null;
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

console.log("PASS: shared chapter persistence owns child scoping, ordered I/O, strict decoding and safe legacy-key migration.");
