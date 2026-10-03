import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Execute actual TS/TSX using isolated in-memory storage and a minimal hook host.
// No browser profile, child account, network or device save is accessed.
function load(file, dependencies = {}) {
  const source = fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: (name) => {
    assert.ok(name in dependencies, `unexpected dependency ${name}`);
    return dependencies[name];
  } });
  return exports;
}
const storage = new Map();
const writes = [];
const preferences = {
  get: async ({ key }) => ({ value: storage.get(key) ?? null }),
  set: async ({ key, value }) => { writes.push(key); storage.set(key, value); },
  remove: async ({ key }) => { storage.delete(key); },
};
const stateModule = () => load("src/game/act2RuntimeState.ts", { "@capacitor/preferences": { Preferences: preferences } });
const s = stateModule();
const story = load("src/game/act2FinaleStory.ts").ACT2_FINALE_BEATS;
const completeProjects = Object.fromEntries(["cabin", "dock", "boathouse", "motorboat"].map((name) => [name, { contributions: 16 }]));
let state = s.normalizeAct2RuntimeState({ ...s.createDefaultAct2RuntimeState(), projects: completeProjects,
  productionEntryCommitted: true, entered: true, finaleIndex: 4, finaleLineIndex: story[4].body.length - 1 });
storage.set("sysselcraft.backend.childId", "isolated-test-child");
await s.saveAct2RuntimeState(state);
state = await stateModule().loadAct2RuntimeState();
assert.equal(state.finaleIndex, 4);
state = s.advanceAct2Finale(state);
assert.equal(state.finaleIndex, 5);
assert.equal(state.epilogueConsumed, false);
assert.equal(state.act2Complete, false);
for (let line = 0; line < story[5].body.length; line++) {
  await s.saveAct2RuntimeState({ ...state, finaleLineIndex: line });
  state = await stateModule().loadAct2RuntimeState();
  assert.equal(state.finaleIndex, 5);
  assert.equal(state.finaleLineIndex, line);
  assert.equal(state.act2Complete, false);
}
state = s.advanceAct2Finale(state);
await s.saveAct2RuntimeState(state);
state = await stateModule().loadAct2RuntimeState();
assert.equal(state.act2Complete, true);
assert.equal(state.endCardSeen, false);
await s.saveAct2RuntimeState({ ...state, endCardSeen: true });
state = await stateModule().loadAct2RuntimeState();
assert.equal(state.endCardSeen, true);
assert.equal(s.act2FinalePending(state), false);
assert.equal(JSON.stringify(s.advanceAct2Finale(state)), JSON.stringify(state));
assert.ok(writes.every((key) => key === "sysselcraft.act2.runtime.v1.isolated-test-child"));
// Existing completed releases must not be reset or replay the newly added epilogue.
for (const endCardSeen of [false, true]) {
  const legacy = s.normalizeAct2RuntimeState({ ...state, finaleIndex: 4, endCardSeen });
  assert.equal(legacy.act2Complete, true);
  assert.equal(legacy.endCardSeen, endCardSeen);
  assert.equal(s.act2FinalePending(legacy), false);
}
// Adoption behavior remains one-time and existing scoped saves always win.
storage.set("sysselcraft.act2.runtime.v1", JSON.stringify({ ...state, finaleIndex: 0 }));
assert.equal((await s.loadAct2RuntimeState()).finaleIndex, 5);
storage.delete("sysselcraft.act2.runtime.v1.isolated-test-child");
await s.loadAct2RuntimeState();
assert.equal(storage.has("sysselcraft.act2.runtime.v1"), false);
assert.equal(storage.has("sysselcraft.act2.runtime.v1.isolated-test-child"), true);

let hooks = [], cursor = 0;
const react = {
  useState(initial) {
    const index = cursor++;
    if (!(index in hooks)) hooks[index] = initial;
    return [hooks[index], (value) => { hooks[index] = value; }];
  },
  useRef(initial) {
    const index = cursor++;
    return hooks[index] ??= { current: initial };
  },
  useEffect() {},
};
const jsx = (type, props) => ({ type, props });
const DialogueCard = Symbol("DialogueCard");
const { StoryMoment } = load("src/components/story/StoryMoment.tsx", {
  react, "react/jsx-runtime": { jsx, jsxs: jsx }, "next/image": {},
  "../../game/storyOverlayBridge": { beginStoryOverlay() {} }, "./DialogueCard": { DialogueCard },
});
function flatten(node) {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap(flatten);
  return [node, ...flatten(node.props?.children)];
}
let props = { image: "epilogue.png", presentationId: "epilogue:last", revealImageBeforeNext: true,
  nextLabel: "Fortsätt", children: "Ni styr ut över sjön tillsammans." };
const render = () => { cursor = 0; return flatten(StoryMoment(props)); };
const card = () => render().find((node) => node.type === DialogueCard);
const button = (name) => render().find((node) => node.props?.className?.includes(name));
const flush = () => new Promise((resolve) => setImmediate(resolve));
let transitions = 0, release;
props.onNext = () => { transitions++; return new Promise((resolve) => { release = resolve; }); };
card().props.onNext(); // final dialogue -> image, no persistence yet
assert.equal(transitions, 0);
assert.equal(card(), undefined);
button("shared-story-image-previous").props.onClick();
assert.ok(card(), "image Previous must restore the final dialogue without changing state");
card().props.onNext();
const advance = button("shared-story-image-continue").props.onClick;
advance(); advance();
assert.equal(transitions, 1, "duplicate events while persistence is pending must not advance twice");
assert.equal(button("shared-story-image-previous").props.disabled, true);
release(); await flush();
props = { ...props, presentationId: "new:panel" };
assert.ok(card(), "new panel must not inherit the full-image mode");
// A rejected save leaves the current image available for retry.
props.onNext = async () => { throw new Error("storage full"); };
card().props.onNext();
button("shared-story-image-continue").props.onClick(); await flush();
assert.ok(button("shared-story-image-continue"));
assert.ok(render().some((node) => node.props?.role === "alert"));
assert.equal(button("shared-story-image-continue").props.disabled, false);
props.onNext = () => { transitions++; };
button("shared-story-image-continue").props.onClick(); await flush();
assert.equal(transitions, 2);
assert.ok(card());
// Returning to an already visited panel must not resurrect its old image-only state.
props.presentationId = "epilogue:last";
assert.ok(card());
console.log("PASS: actual save/load restart boundaries, child scoping, legacy completion/adoption, full-image previous, duplicate transition lock and save-failure retry");
