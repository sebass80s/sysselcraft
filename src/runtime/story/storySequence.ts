export type LinearStoryStep =
  | { type: "line"; index: number }
  | { type: "complete" };

export function clampStoryLineIndex(lineCount: number, index: number) {
  const safeCount = Math.max(0, Math.floor(lineCount));
  if (safeCount === 0) return 0;
  return Math.min(Math.max(0, Math.floor(index)), safeCount - 1);
}

export function previousStoryLineIndex(lineCount: number, index: number) {
  const current = clampStoryLineIndex(lineCount, index);
  return Math.max(0, current - 1);
}

export function advanceStoryLine(lineCount: number, index: number): LinearStoryStep {
  const safeCount = Math.max(0, Math.floor(lineCount));
  if (safeCount === 0) return { type: "complete" };

  const current = clampStoryLineIndex(safeCount, index);
  if (current + 1 < safeCount) {
    return { type: "line", index: current + 1 };
  }
  return { type: "complete" };
}

export function storyLineAt<T>(
  lines: readonly T[],
  index: number,
): T | null {
  if (lines.length === 0) return null;
  return lines[clampStoryLineIndex(lines.length, index)] ?? null;
}
