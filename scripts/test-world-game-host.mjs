import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadTsModule(file, dependencies) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(name) {
      assert.ok(name in dependencies, `Unexpected world game host dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
}

const worldCamera = loadTsModule("../src/runtime/world/worldCamera.ts", {});
const worldCameraHost = loadTsModule("../src/runtime/world/worldCameraHost.ts", {
  "./worldCamera": worldCamera,
});
const { createWorldGame } = loadTsModule("../src/runtime/world/worldGameHost.ts", {
  "./worldCameraHost": worldCameraHost,
});

let capturedConfig = null;
class FakeGame {
  constructor(config) {
    capturedConfig = config;
  }
}
class FakeScene {}
const Phaser = {
  AUTO: 7,
  Scale: { FIT: 11, CENTER_BOTH: 13 },
  Game: FakeGame,
};
const parent = { clientWidth: 1024, clientHeight: 576 };
const viewport = { width: 1024, height: 576 };

createWorldGame(Phaser, parent, viewport, FakeScene);

assert.equal(capturedConfig.type, 7);
assert.equal(capturedConfig.parent, parent);
assert.equal(capturedConfig.width, 1024);
assert.equal(capturedConfig.height, 576);
assert.equal(capturedConfig.backgroundColor, worldCameraHost.WORLD_CAMERA_BACKGROUND_COLOR);
assert.equal(capturedConfig.pixelArt, false);
assert.equal(capturedConfig.antialias, true);
assert.equal(capturedConfig.roundPixels, false);
assert.equal(capturedConfig.scale.mode, 11);
assert.equal(capturedConfig.scale.autoCenter, 13);
assert.equal(capturedConfig.scale.width, 1024);
assert.equal(capturedConfig.scale.height, 576);
assert.equal(capturedConfig.scene, FakeScene);

const villageSource = fs.readFileSync(new URL("../src/game/createVillageGame.ts", import.meta.url), "utf8");
const lakeSource = fs.readFileSync(new URL("../src/game/createAct2LakeGame.ts", import.meta.url), "utf8");
for (const [name, source] of [["Village", villageSource], ["Act 2 Lake", lakeSource]]) {
  assert.ok(source.includes("createWorldGame("), `${name} must delegate Phaser bootstrap to the shared world game host`);
  assert.equal(source.includes("new Phaser.Game({"), false, `${name} must not retain local Phaser game bootstrap`);
  assert.equal(source.includes("pixelArt: false"), false, `${name} must not duplicate shared renderer configuration`);
  assert.equal(source.includes("autoCenter: Phaser.Scale.CENTER_BOTH"), false, `${name} must not duplicate shared scale configuration`);
}

console.log("PASS: shared world game host owns common Phaser bootstrap and both current worlds consume it.");
