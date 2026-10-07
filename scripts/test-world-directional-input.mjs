import assert from "node:assert/strict";
import {
  createWorldDirectionalInput,
  readWorldDirection,
} from "../src/runtime/world/worldDirectionalInput.ts";

const key = (isDown = false) => ({ isDown });
const cursors = {
  up: key(),
  down: key(),
  left: key(),
  right: key(),
};
const wasd = {
  up: key(),
  down: key(),
  left: key(),
  right: key(),
};
const calls = [];
const keyboard = {
  createCursorKeys() {
    calls.push(["cursors"]);
    return cursors;
  },
  addKeys(mapping) {
    calls.push(["wasd", mapping]);
    return wasd;
  },
};

const input = createWorldDirectionalInput(keyboard);
assert.ok(input, "keyboard adapter must create a shared directional input binding");
assert.deepEqual(calls, [
  ["cursors"],
  ["wasd", { up: "W", down: "S", left: "A", right: "D" }],
]);
assert.deepEqual(readWorldDirection(input), {
  up: false,
  down: false,
  left: false,
  right: false,
});

cursors.up.isDown = true;
wasd.left.isDown = true;
assert.deepEqual(readWorldDirection(input), {
  up: true,
  down: false,
  left: true,
  right: false,
}, "cursor and WASD bindings must merge into one direction snapshot");

cursors.up.isDown = false;
wasd.left.isDown = false;
wasd.down.isDown = true;
cursors.right.isDown = true;
assert.deepEqual(readWorldDirection(input), {
  up: false,
  down: true,
  left: false,
  right: true,
});

assert.equal(createWorldDirectionalInput(null), null);
assert.deepEqual(readWorldDirection(null), {
  up: false,
  down: false,
  left: false,
  right: false,
}, "worlds without a keyboard plugin must remain safe");

console.log("PASS: shared directional input host owns cursor/WASD binding and direction snapshots.");
