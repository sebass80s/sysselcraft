import type { ChapterPersistenceHost, ChapterPersistenceOperationGuard } from "../save/chapterPersistence";
import { nextClaimGateBeat, observeClaimEvidence, type ClaimEvidence, type ClaimGateLedger } from "./claimGate";

export type ClaimGateAdapter<T, TId extends string> = {
  beatIds: readonly TId[];
  waiting: (state: T) => boolean;
  ledger: (state: T) => ClaimGateLedger;
  withLedger: (state: T, ledger: ClaimGateLedger) => T;
  startBeat: (state: T, beatId: TId) => T;
};

/**
 * One transaction for fresh evidence, one-time baseline and optional beat start.
 * The shared persistence queue serializes polls, story cursors and duplicate taps.
 * No cached evidence can unlock while offline. Resolve only AFTER durable write.
 */
type IdentityGuard = ChapterPersistenceOperationGuard & { expectedChildId: string | null };

export function createClaimGateBridge<T, TId extends string>(options: {
  adapter: ClaimGateAdapter<T, TId>;
  persistence: Pick<ChapterPersistenceHost<T>, "update">;
  guard: IdentityGuard | (() => IdentityGuard);
  loadEvidence: () => Promise<ClaimEvidence | null>;
}) {
  const { adapter, persistence, loadEvidence } = options;
  async function transact(start: boolean): Promise<T> {
    const guard = typeof options.guard === "function" ? options.guard() : options.guard;
    return persistence.update(async current => {
      if (!adapter.waiting(current)) return null;
      const previous = adapter.ledger(current);
      const ledger = observeClaimEvidence(previous, await loadEvidence(), guard.expectedChildId);
      let next = adapter.withLedger(current, ledger);
      // A first snapshot establishes history, never unlocks it retroactively.
      const beat = start ? nextClaimGateBeat(ledger, adapter.beatIds, false) : null;
      if (beat !== null) {
        next = adapter.startBeat(adapter.withLedger(next, { ...ledger, consumed: ledger.consumed + 1 }), beat);
      }
      if (!beat && JSON.stringify(previous) === JSON.stringify(ledger)) return null;
      return next;
    }, guard);
  }
  return { refresh: () => transact(false), start: () => transact(true) };
}
