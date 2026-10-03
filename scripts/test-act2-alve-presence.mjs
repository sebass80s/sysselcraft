import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";

function load(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
  } }).outputText;
  vm.runInNewContext(code, { exports, require: (name) => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  } });
  return exports;
}
const assets = load("src/game/act2VisualAssets.ts");
const saveMigrations = load("src/runtime/save/migrations.ts");
const stateApi = load("src/game/act2RuntimeState.ts", {
  "@capacitor/preferences": { Preferences: {} },
  "../runtime/save/migrations": saveMigrations,
});
const initial = stateApi.createDefaultAct2RuntimeState();
assert.equal(initial.selectedProject, null);
const chosen = stateApi.withSelectedProject(initial, "cabin");
assert.equal(chosen.selectedProject, "cabin", "idle presence must not preselect or block the chooser");
const finished = stateApi.normalizeAct2RuntimeState({ ...chosen,
  projects: { ...chosen.projects, cabin: { contributions: 16 } },
});
assert.equal(finished.selectedProject, null, "completed projects legitimately return to the chooser");
assert.equal(stateApi.withSelectedProject(finished, "dock").selectedProject, "dock");
assert.equal(stateApi.withSelectedProject(initial, "motorboat").selectedProject, null,
  "idle presence must not unlock Motorbåten early");

const objects = [];
function object(kind, x = 0, y = 0, value) {
  const node = { kind, x, y, value, visible: true, handlers: {},
    setPosition(x, y) { this.x = x; this.y = y; return this; },
    setVisible(value) { this.visible = value; return this; },
    setDepth(value) { this.depth = value; return this; },
    setText(value) { this.text = value; return this; },
    setInteractive() { this.interactive = true; return this; },
    on(name, handler) { this.handlers[name] = handler; return this; },
  };
  const proxy = new Proxy(node, { get(target, key) {
    if (key in target) return target[key];
    if (String(key).startsWith("set")) return () => proxy;
  } });
  objects.push(proxy);
  return proxy;
}
let currentGame;
class Scene {
  constructor() {
    this.add = Object.fromEntries(["image", "text", "rectangle", "circle", "container"].map((kind) => [kind, (...args) => object(kind, ...args)]));
    this.cameras = { main: new Proxy({}, { get: () => () => {} }) };
    this.input = { on() {} };
    this.time = { delayedCall: (_delay, callback) => { this.expireIdle = callback; return { remove() {} }; } };
  }
}
class Game {
  constructor(config) {
    this.instance = new config.scene();
    currentGame = { instance: this.instance, boot: () => this.boot() };
    this.active = false;
    this.scene = { isActive: () => this.active, getScene: () => this.instance };
  }
  boot() { this.active = true; this.instance.create(); }
  destroy() { this.active = false; }
}
const phaser = { Scene, Game, AUTO: 0, Scale: { FIT: 0, CENTER_BOTH: 0 }, Math: {
  Distance: { Between: (x,y,a,b) => Math.hypot(x-a,y-b) },
} };
const interactionContract = load("src/runtime/interaction/interactionContract.ts");
const movement = load("src/runtime/world/movement.ts");
const worldCamera = load("src/runtime/world/worldCamera.ts");
const worldDepth = load("src/runtime/world/worldDepth.ts");
const markerRenderer = {
  createInteractionMarker: (_scene, options) => object("interaction-marker", options.x ?? 0, options.y ?? 0),
};
const { createAct2LakeGame } = load("src/game/createAct2LakeGame.ts", {
  phaser,
  "./act2VisualAssets": assets,
  "../runtime/interaction/markerRenderer": markerRenderer,
  "../runtime/interaction/interactionContract": interactionContract,
  "../runtime/world/movement": movement,
  "../runtime/world/worldCamera": worldCamera,
  "../runtime/world/worldDepth": worldDepth,
});
let turnIns = 0;
const start = () => createAct2LakeGame({ clientWidth: 667, clientHeight: 375 }, 1, { onAlveTurnIn: () => { turnIns++; } });
let handle = await start();
handle.setActiveProject(null); // restored save before Phaser finishes loading
currentGame.boot();
let scene = currentGame.instance;
assert.equal(scene.alveEntity.visible, true, "null project must not hide Alve at initial scene creation");
const idle = assets.ACT2_ALVE_IDLE_POSITION;
assert.deepEqual({ x: scene.alveEntity.x, y: scene.alveEntity.y }, { ...idle });
for (const [project, position] of Object.entries(assets.ACT2_ALVE_WORK_POSITIONS)) {
  handle.setActiveProject(project);
  assert.equal(scene.alveEntity.visible, true);
  assert.deepEqual({ x: scene.alveEntity.x, y: scene.alveEntity.y }, { ...position });
}
handle.setActiveProject(null);
assert.equal(scene.alveEntity.depth, 1000 + idle.y);
handle.setAlvePresent(false);
assert.equal(scene.alveEntity.visible, false, "completed Act 2 must remove Alve from the lake world");
handle.setAlveTurnInAvailable(true);
assert.equal(scene.alveTurnInMarker.visible, false, "hidden Alve must never expose a turn-in marker");
handle.setAlvePresent(true);
assert.equal(scene.alveEntity.visible, true, "pre-completion idle state must still restore Alve");
assert.equal(scene.alveTurnInMarker.visible, true);
handle.setAlveTurnInAvailable(false);
const hit = scene.alveEntity.value.find((child) => child.interactive);
assert.ok(hit, "the existing shared click target must remain attached");
let stopped = 0;
const click = () => hit.handlers.pointerdown({}, 0, 0, { stopPropagation: () => { stopped++; } });
handle.setAlveTurnInAvailable(false);
click();
assert.equal(scene.alveIdlePrompt.visible, true);
assert.ok(scene.alveIdlePromptText.text);
assert.equal(turnIns, 0);
assert.equal(scene.alveTurnInMarker.visible, false);
handle.setAlveTurnInAvailable(true);
assert.equal(scene.alveIdlePrompt.visible, false);
assert.equal(scene.alveTurnInMarker.visible, true);
scene.player.setPosition(idle.x, idle.y + 58);
click();
assert.equal(turnIns, 1, "nearby turn-in must use the existing callback");
scene.player.setPosition(100, 300);
click();
assert.equal(turnIns, 1, "far tap must approach, not consume a quest");
assert.equal(scene.moveTarget.x, idle.x);
handle.setAlveTurnInAvailable(false);
assert.equal(scene.alveTurnInMarker.visible, false);
assert.equal(scene.alveEntity.visible, true);
assert.equal(stopped, 3);
handle.destroy();
handle = await start();
currentGame.boot();
handle.setActiveProject(null); // restored save after scene creation
scene = currentGame.instance;
assert.equal(scene.alveEntity.visible, true, "reload with null project must retain Alve");
assert.deepEqual({ x: scene.alveEntity.x, y: scene.alveEntity.y }, { ...idle });

// Test idle + approach against the actual master pixels and runtime collision method.
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const { data, info } = await sharp(`public${assets.ACT2_WORLD.master}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
scene.textures = { getPixel(x, y) {
  const offset = (y * info.width + x) * info.channels;
  return { red: data[offset], green: data[offset+1], blue: data[offset+2] };
} };
phaser.Math.Clamp = (value, min, max) => Math.max(min, Math.min(max, value));
assert.equal(scene.isWalkable(idle.x, idle.y), true, "idle anchor must be on walkable canonical land");
assert.equal(scene.isWalkable(idle.x, idle.y + 58), true, "turn-in approach point must remain reachable land");
handle.destroy();
console.log("PASS: actual lake scene null/reload presence, all project positions, idle click, turn-in marker/callback/approach and canonical land");
