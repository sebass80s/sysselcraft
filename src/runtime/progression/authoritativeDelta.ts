/**
 * Returns the non-negative whole-count delta between an authoritative monotonic
 * counter and the baseline captured when a local progression arc began.
 *
 * This helper deliberately owns only count arithmetic. It does not establish
 * baselines, infer backend authority, consume story beats or apply gates.
 */
export function authoritativeProgressDelta(
  authoritativeCount: number,
  baselineCount: number,
): number {
  return Math.max(0, Math.floor(authoritativeCount) - Math.floor(baselineCount));
}
