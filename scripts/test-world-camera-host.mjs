import assert from "node:assert/strict";
import { configureWorldCamera, WORLD_CAMERA_BACKGROUND_COLOR } from "../src/runtime/world/worldCameraHost.ts";
import { WORLD_CAMERA, worldCameraDeadzone } from "../src/runtime/world/worldCamera.ts";

const calls = [];
const camera = {
  setBackgroundColor(color) { calls.push(["background", color]); },
  setBounds(x, y, width, height) { calls.push(["bounds", x, y, width, height]); },
  centerOn(x, y) { calls.push(["center", x, y]); },
  startFollow(target, roundPixels, lerpX, lerpY) {
    calls.push(["follow", target, roundPixels, lerpX, lerpY]);
  },
  setDeadzone(width, height) { calls.push(["deadzone", width, height]); },
};
const target = { x: 320, y: 240 };
const bounds = { x: -50, y: 0, width: 1400, height: 700 };
const viewWidth = 1024;

assert.equal(WORLD_CAMERA_BACKGROUND_COLOR, WORLD_CAMERA.backgroundColor, "shared camera host must expose the canonical game background");
configureWorldCamera(camera, bounds, target, viewWidth);

const deadzone = worldCameraDeadzone(viewWidth);
assert.deepEqual(calls, [
  ["background", WORLD_CAMERA.backgroundColor],
  ["bounds", -50, 0, 1400, 700],
  ["center", 320, 240],
  ["follow", target, true, WORLD_CAMERA.followLerpX, WORLD_CAMERA.followLerpY],
  ["deadzone", deadzone.width, deadzone.height],
]);

console.log("PASS: shared world camera host owns common background/bounds/follow/deadzone setup.");
