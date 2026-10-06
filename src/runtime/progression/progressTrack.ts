export type ProgressTrackStageThreshold<TStage extends number> = {
  minContributions: number;
  stage: TStage;
};

export type ProgressTrackDefinition<TStage extends number> = {
  targetCount: number;
  stages: readonly ProgressTrackStageThreshold<TStage>[];
  beatId: (number: number) => string;
};

export type ProgressTrackState<TStage extends number> = {
  contributions: number;
  visibleStage: 0 | TStage;
  consumedBeatIds: string[];
  complete: boolean;
};

function safeTargetCount(targetCount: number) {
  return Number.isFinite(targetCount)
    ? Math.max(0, Math.floor(targetCount))
    : 0;
}

export function normalizeProgressContributionCount(value: unknown, targetCount: number) {
  const target = safeTargetCount(targetCount);
  return Number.isInteger(value)
    ? Math.max(0, Math.min(target, value as number))
    : 0;
}

export function progressTrackVisibleStage<TStage extends number>(
  contributions: number,
  stages: readonly ProgressTrackStageThreshold<TStage>[],
): 0 | TStage {
  const count = Number.isFinite(contributions)
    ? Math.max(0, Math.floor(contributions))
    : 0;

  let visibleStage: 0 | TStage = 0;
  for (const threshold of stages) {
    if (count >= threshold.minContributions) {
      visibleStage = threshold.stage;
    }
  }
  return visibleStage;
}

export function canonicalProgressBeatIds<TStage extends number>(
  contributions: number,
  definition: ProgressTrackDefinition<TStage>,
) {
  const count = normalizeProgressContributionCount(
    contributions,
    definition.targetCount,
  );
  return Array.from({ length: count }, (_, index) => definition.beatId(index + 1));
}

export function normalizeProgressTrack<TStage extends number>(
  value: unknown,
  definition: ProgressTrackDefinition<TStage>,
): ProgressTrackState<TStage> {
  const candidate = value && typeof value === "object"
    ? value as { contributions?: unknown }
    : {};
  const contributions = normalizeProgressContributionCount(
    candidate.contributions,
    definition.targetCount,
  );

  return {
    contributions,
    visibleStage: progressTrackVisibleStage(contributions, definition.stages),
    consumedBeatIds: canonicalProgressBeatIds(contributions, definition),
    complete: contributions >= safeTargetCount(definition.targetCount),
  };
}

export function nextProgressTrackStep<TStage extends number>(
  contributions: number,
  definition: ProgressTrackDefinition<TStage>,
) {
  const current = normalizeProgressContributionCount(
    contributions,
    definition.targetCount,
  );
  const number = current + 1;
  if (number > safeTargetCount(definition.targetCount)) return null;

  return {
    number,
    beatId: definition.beatId(number),
    visibleStage: progressTrackVisibleStage(number, definition.stages),
  };
}


export function consumeProgressTrackStep<TStage extends number>(input: {
  state: ProgressTrackState<TStage>;
  definition: ProgressTrackDefinition<TStage>;
  beatId: string;
}): ProgressTrackState<TStage> {
  const current = normalizeProgressTrack(input.state, input.definition);
  if (!input.beatId || current.complete) return current;
  if (current.consumedBeatIds.includes(input.beatId)) return current;

  const next = nextProgressTrackStep(current.contributions, input.definition);
  if (!next || next.beatId !== input.beatId) return current;

  const contributions = normalizeProgressContributionCount(
    current.contributions + 1,
    input.definition.targetCount,
  );

  return {
    contributions,
    visibleStage: progressTrackVisibleStage(contributions, input.definition.stages),
    consumedBeatIds: canonicalProgressBeatIds(contributions, input.definition),
    complete: contributions >= safeTargetCount(input.definition.targetCount),
  };
}
