import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadTsModule(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(name) {
      assert.ok(name in dependencies, `Unexpected world actor host dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
}

const {
  createWorldPlayer,
  createWorldDog,
  WORLD_PLAYER_VISUAL,
  WORLD_DOG_VISUAL,
} = loadTsModule("../src/runtime/world/worldActorHost.ts");

function imageObject(x, y, texture) {
  return {
    x, y, texture,
    origin: null,
    size: null,
    depth: null,
    visible: true,
    setOrigin(originX, originY) { this.origin = [originX, originY]; return this; },
    setDisplaySize(width, height) { this.size = [width, height]; return this; },
    setDepth(depth) { this.depth = depth; return this; },
    setVisible(visible) { this.visible = visible; return this; },
  };
}
const created = [];
const scene = {
  add: {
    image(x, y, texture) {
      const image = imageObject(x, y, texture);
      created.push(image);
      return image;
    },
  },
};

const player = createWorldPlayer(scene, {
  x: 10, y: 20, texture: "child", depth: 1020,
});
assert.equal(player.texture, "child");
assert.deepEqual(player.origin, [WORLD_PLAYER_VISUAL.originX, WORLD_PLAYER_VISUAL.originY]);
assert.deepEqual(player.size, [WORLD_PLAYER_VISUAL.width, WORLD_PLAYER_VISUAL.height]);
assert.equal(player.depth, 1020);
assert.equal(player.visible, true);

const dog = createWorldDog(scene, {
  x: 30, y: 40, texture: "dog", depth: 1040, visible: false,
});
assert.equal(dog.texture, "dog");
assert.deepEqual(dog.origin, [WORLD_DOG_VISUAL.originX, WORLD_DOG_VISUAL.originY]);
assert.deepEqual(dog.size, [WORLD_DOG_VISUAL.width, WORLD_DOG_VISUAL.height]);
assert.equal(dog.depth, 1040);
assert.equal(dog.visible, false);

const villageSource = fs.readFileSync(new URL("../src/game/createVillageGame.ts", import.meta.url), "utf8");
const lakeSource = fs.readFileSync(new URL("../src/game/createAct2LakeGame.ts", import.meta.url), "utf8");
for (const [name, source] of [["Village", villageSource], ["Act 2 Lake", lakeSource]]) {
  assert.ok(source.includes("createWorldPlayer(this, {"), `${name} must use shared player creation`);
  assert.ok(source.includes("createWorldDog(this, {"), `${name} must use shared dog creation`);
  assert.equal(source.includes(".setDisplaySize(74, 118)"), false, `${name} must not duplicate canonical player visual size`);
  assert.equal(source.includes(".setDisplaySize(66, 55)"), false, `${name} must not duplicate canonical dog visual size`);
}

console.log("PASS: shared world actor host owns canonical player/dog visual creation while worlds keep spawn/depth/visibility data.");
