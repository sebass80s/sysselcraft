import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("src/game/act2VisualAssets.ts", "utf8");
const runtime = fs.readFileSync("src/game/createAct2LakeGame.ts", "utf8");

const required = [
  'width: 1983',
  'height: 793',
  'x: 575, baseY: 375, width: 350',
  'x: 1435, baseY: 505, width: 340',
  'x: 1660, baseY: 515, width: 315',
  'x: 1635, baseY: 430, width: 180',
  'cabin: { width: 1766, height: 879 }',
  'dock: { width: 1774, height: 887 }',
  'boathouse: { width: 1628, height: 991 }',
  'motorboat: { width: 725, height: 423 }',
  'ACT2_RUNTIME_ROOT = "/assets/village/buildings/act 2/runtime"',
];

for (const token of required) {
  if (!source.includes(token)) throw new Error(`Act 2 visual contract drifted: missing ${token}`);
}

for (const project of ["cabin", "dock", "boat-house", "motorboat"]) {
  for (let stage = 1; stage <= 4; stage++) {
    const filename = project === "boat-house"
      ? `boat-house-${stage}.png`
      : `${project}-stage-${stage}.png`;
    const path = `public/assets/village/buildings/act 2/runtime/${filename}`;
    if (!fs.existsSync(path)) throw new Error(`Missing Act 2 runtime asset: ${path}`);
  }
}

for (const token of [
  "ACT2_WORLD.master",
  "getAct2DisplaySize(project)",
  ".setOrigin(placement.origin.x, placement.origin.y)",
  ".setDepth(1000 + placement.baseY)",
  ".setDisplaySize(74, 118)",
]) {
  if (!runtime.includes(token)) throw new Error(`Act 2 runtime contract drifted: missing ${token}`);
}

if (/stage.*threshold|threshold.*stage/i.test(source)) {
  throw new Error("Act 2 visual contract must not invent progression thresholds");
}

assert.match(runtime, /this\.player\.setFlipX\(dx > 0\)/, "Act 2 child facing must use the corrected mirrored orientation");
assert.match(runtime, /this\.player\.setFlipX\(this\.alvePlaceholder\.x > this\.player\.x\)/, "Act 2 Alve interaction must preserve the corrected child facing orientation");

console.log("Act 2 visual/runtime contract: PASS");
