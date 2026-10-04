/**
 * Returns whether a progression gate is active inside an authored progress window.
 *
 * The gate is active from threshold (inclusive) until completion (exclusive)
 * while the external requirement remains unresolved. This primitive owns only
 * the generic window rule. Chapters still own thresholds, completion counts,
 * requirement authority and the action that resolves a gate.
 */
export function progressGateRequired(
  progress: number,
  threshold: number,
  completion: number,
  resolved: boolean,
): boolean {
  return progress >= threshold
    && progress < completion
    && !resolved;
}
