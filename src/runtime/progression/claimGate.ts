import { pendingAuthoritativeProgressCount } from "./authoritativeTrack";

/** Presentation ledger only. It never creates, approves or claims backend work. */
export type ClaimGateLedger = {
  baseline: number | null;
  consumed: number;
  observedCount: number | null;
  observedAt: number | null;
};
export type ClaimEvidence = { childId: string; count: number; updatedAt: string };
export const emptyClaimGate = (): ClaimGateLedger => ({ baseline: null, consumed: 0, observedCount: null, observedAt: null });
const count = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;

export function isClaimGateLedger(value: unknown): value is ClaimGateLedger {
  if (!value || typeof value !== "object") return false;
  const v = value as ClaimGateLedger;
  if (!count(v.consumed)) return false;
  if (v.baseline === null) return v.consumed === 0 && v.observedCount === null && v.observedAt === null;
  return count(v.baseline) && count(v.observedCount) && count(v.observedAt)
    && v.observedCount >= v.baseline && v.consumed <= v.observedCount - v.baseline;
}

/** Reject unknown/coerced counts, wrong identity, and regressing snapshots. */
export function observeClaimEvidence(ledger: ClaimGateLedger, evidence: ClaimEvidence | null, childId: string | null): ClaimGateLedger {
  if (!isClaimGateLedger(ledger) || !childId || !evidence || evidence.childId !== childId
    || !count(evidence.count) || typeof evidence.updatedAt !== "string") throw new Error("Unverified claim evidence");
  const at = Date.parse(evidence.updatedAt);
  if (!count(at) || (ledger.observedAt !== null && at < ledger.observedAt)
    || (ledger.observedCount !== null && evidence.count < ledger.observedCount)) throw new Error("Stale claim evidence");
  return { baseline: ledger.baseline ?? evidence.count, consumed: ledger.consumed, observedCount: evidence.count, observedAt: at };
}

export function nextClaimGateBeat<TId extends string>(ledger: ClaimGateLedger, beatIds: readonly TId[], blocked: boolean): TId | null {
  if (blocked || !isClaimGateLedger(ledger) || ledger.baseline === null || ledger.observedCount === null) return null;
  if (pendingAuthoritativeProgressCount(ledger.observedCount, ledger.baseline, ledger.consumed) < 1) return null;
  return beatIds[ledger.consumed] ?? null;
}
