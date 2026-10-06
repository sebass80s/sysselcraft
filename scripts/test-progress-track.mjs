import assert from "node:assert/strict";

import {
  canonicalProgressBeatIds,
  nextProgressTrackStep,
  normalizeProgressTrack,
  progressTrackVisibleStage,
} from "../src/runtime/progression/progressTrack.ts";

const act2DockDefinition = {
  targetCount: 16,
  stages: [
    { minContributions: 1, stage: 1 },
    { minContributions: 4, stage: 2 },
    { minContributions: 8, stage: 3 },
    { minContributions: 12, stage: 4 },
  ],
  beatId: (number) => `dock:${String(number).padStart(2, "0")}`,
};

const expectedStage = (contributions) => {
  if (contributions <= 0) return 0;
  return Math.min(4, 1 + Math.floor(contributions / 4));
};

for (let contributions = 0; contributions <= 16; contributions += 1) {
  const normalized = normalizeProgressTrack({ contributions }, act2DockDefinition);
  assert.equal(normalized.contributions, contributions);
  assert.equal(
    normalized.visibleStage,
    expectedStage(contributions),
    `Act 2 stage parity must hold at ${contributions}/16`,
  );
  assert.equal(normalized.complete, contributions >= 16);
  assert.deepEqual(
    normalized.consumedBeatIds,
    Array.from({ length: contributions }, (_, index) => `dock:${String(index + 1).padStart(2, "0")}`),
  );

  const next = nextProgressTrackStep(contributions, act2DockDefinition);
  if (contributions >= 16) {
    assert.equal(next, null);
  } else {
    assert.equal(next?.number, contributions + 1);
    assert.equal(next?.beatId, `dock:${String(contributions + 1).padStart(2, "0")}`);
    assert.equal(next?.visibleStage, expectedStage(contributions + 1));
  }
}

assert.equal(progressTrackVisibleStage(Number.NaN, act2DockDefinition.stages), 0);
assert.equal(normalizeProgressTrack({ contributions: -5 }, act2DockDefinition).contributions, 0);
assert.equal(normalizeProgressTrack({ contributions: 999 }, act2DockDefinition).contributions, 16);
assert.deepEqual(canonicalProgressBeatIds(3, act2DockDefinition), ["dock:01", "dock:02", "dock:03"]);

console.log("PASS: configurable progress-track engine preserves Act 2 contribution/stage parity");
