import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createBackendAuthoritySnapshot,
  startBackendSyncLoop,
} from "../src/runtime/backend/backendSync.ts";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const backend = {
  childId: "child-a",
  diamonds: 4,
  sysselBux: 125,
  progression: {
    orderEnvironment: 1,
    knowledgeCreativity: 2,
    wellbeingRoutine: 3,
    movementActivity: 4,
    community: 5,
    worldProgression: 9,
  },
  worldFlags: {
    act2JettyLifebuoyOwned: true,
  },
  updatedAt: "2026-10-07T05:00:00Z",
};

const authority = createBackendAuthoritySnapshot(backend);
assert.deepEqual(authority.wallet, { diamonds: 4, sysselBux: 125 });
assert.equal(authority.progression.worldProgression, 9);
assert.equal(authority.worldFlags.act2JettyLifebuoyOwned, true);
backend.progression.worldProgression = 99;
backend.worldFlags.act2JettyLifebuoyOwned = false;
assert.equal(authority.progression.worldProgression, 9,
  "shared authority snapshot must not alias mutable backend progression");
assert.equal(authority.worldFlags.act2JettyLifebuoyOwned, true,
  "shared authority snapshot must not alias mutable backend world flags");

let intervalCallback = null;
let intervalMs = null;
let clearedHandle = null;
const scheduler = {
  setInterval(callback, ms) {
    intervalCallback = callback;
    intervalMs = ms;
    return "timer-1";
  },
  clearInterval(handle) {
    clearedHandle = handle;
  },
};

const firstLoad = deferred();
let loadCalls = 0;
const snapshots = [];
const errors = [];
const loop = startBackendSyncLoop({
  scheduler,
  loadSnapshot: async () => {
    loadCalls += 1;
    return firstLoad.promise;
  },
  onSnapshot: (snapshot, control) => {
    assert.equal(control.isActive(), true);
    snapshots.push(snapshot);
  },
  onError: error => {
    errors.push(error);
  },
});

assert.equal(intervalMs, 15_000, "shared backend sync defaults to the accepted Act 2 poll cadence");
assert.equal(loadCalls, 1, "shared backend sync performs an immediate first refresh");

intervalCallback();
await Promise.resolve();
assert.equal(loadCalls, 1,
  "interval ticks must not overlap an in-flight backend request");

firstLoad.resolve({ id: "snapshot-1" });
await firstLoad.promise;
await new Promise(resolve => setTimeout(resolve, 0));
assert.deepEqual(snapshots, [{ id: "snapshot-1" }]);

const errorLoad = deferred();
let mode = "error";
const errorLoopScheduler = {
  callback: null,
  setInterval(callback) {
    this.callback = callback;
    return "timer-2";
  },
  clearInterval() {},
};
const errorLoop = startBackendSyncLoop({
  scheduler: errorLoopScheduler,
  loadSnapshot: async () => {
    if (mode === "error") return errorLoad.promise;
    return { id: "recovered" };
  },
  onSnapshot: (snapshot, control) => {
    assert.equal(control.isActive(), true);
    snapshots.push(snapshot);
  },
  onError: (error, control) => {
    assert.equal(control.isActive(), true);
    errors.push(error);
  },
});
errorLoad.reject(new Error("network down"));
await assert.rejects(errorLoad.promise, /network down/);
await new Promise(resolve => setTimeout(resolve, 0));
assert.equal(errors.length, 1, "active backend sync errors are surfaced once");

mode = "ok";
await errorLoop.refresh();
assert.deepEqual(snapshots.at(-1), { id: "recovered" },
  "backend sync can recover on a later refresh after an error");
errorLoop.stop();

const staleLoad = deferred();
const staleSnapshots = [];
let staleCleared = null;
const staleLoop = startBackendSyncLoop({
  scheduler: {
    setInterval() { return "timer-3"; },
    clearInterval(handle) { staleCleared = handle; },
  },
  loadSnapshot: async () => staleLoad.promise,
  onSnapshot: (snapshot, control) => {
    assert.equal(control.isActive(), true);
    staleSnapshots.push(snapshot);
  },
});
staleLoop.stop();
staleLoad.resolve({ id: "too-late" });
await staleLoad.promise;
await new Promise(resolve => setTimeout(resolve, 0));
assert.deepEqual(staleSnapshots, [],
  "responses that resolve after stop must never reach consumers");
assert.equal(staleCleared, "timer-3",
  "stop must clear the shared polling lifecycle");

loop.stop();
assert.equal(clearedHandle, "timer-1");
await loop.refresh();
assert.equal(loadCalls, 1,
  "manual refresh after stop must not restart a stopped sync loop");

const act2RuntimeSource = readFileSync("src/components/Act2Runtime.tsx", "utf8");
const backendSyncHostSource = readFileSync("src/runtime/backend/useBackendSyncHost.ts", "utf8");
assert.match(backendSyncHostSource, /startBackendSyncLoop<T>\(\{/, "shared React host must own the backend sync loop lifecycle");
assert.match(backendSyncHostSource, /return \(\) => loop\.stop\(\)/, "shared React host must stop polling on lifecycle cleanup");
assert.match(act2RuntimeSource, /useBackendSyncHost\(\{/, "Act 2 must consume the shared backend sync React host");
assert.match(act2RuntimeSource, /createBackendAuthoritySnapshot\(backend\)/, "Act 2 must consume the shared backend authority snapshot");
assert.doesNotMatch(act2RuntimeSource, /startBackendSyncLoop|window\.setInterval|window\.clearInterval|let cancelled = false/, "Act 2 must not retain a parallel polling/cancellation lifecycle");

console.log("PASS: shared backend sync owns authority snapshots, polling lifecycle, in-flight serialization, error recovery, stale-response cancellation and the Act 2 polling boundary.");
