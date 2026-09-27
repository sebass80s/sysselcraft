import fs from "node:fs";

const source = fs.readFileSync("src/game/act2VisualAssets.ts", "utf8");

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

if (/stage.*threshold|threshold.*stage/i.test(source)) {
  throw new Error("Act 2 visual contract must not invent progression thresholds");
}

console.log("Act 2 visual contract: PASS");
