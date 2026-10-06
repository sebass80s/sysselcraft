import { authoritativeProgressDelta } from "./authoritativeDelta";
import {
  nextProgressTrackStep,
  type ProgressTrackDefinition,
} from "./progressTrack";

export function pendingAuthoritativeProgressCount(
  authoritativeCount: number,
  baselineCount: number,
  consumedCount: number,
) {
  const consumed = Number.isFinite(consumedCount)
    ? Math.max(0, Math.floor(consumedCount))
    : 0;
  return Math.max(
    0,
    authoritativeProgressDelta(authoritativeCount, baselineCount) - consumed,
  );
}

export function nextAuthoritativeProgressTrackStep<TStage extends number>(input: {
  authoritativeCount: number;
  baselineCount: number;
  consumedCount: number;
  trackContributions: number;
  definition: ProgressTrackDefinition<TStage>;
  blocked: boolean;
}) {
  if (input.blocked) return null;

  const backlog = pendingAuthoritativeProgressCount(
    input.authoritativeCount,
    input.baselineCount,
    input.consumedCount,
  );
  if (backlog < 1) return null;

  const next = nextProgressTrackStep(
    input.trackContributions,
    input.definition,
  );
  if (!next) return null;

  return { ...next, backlog };
}
