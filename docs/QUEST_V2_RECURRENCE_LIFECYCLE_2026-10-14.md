# Quest System V2: recurring expiry and parent instance cancellation (2026-10-14)

## Observed defect

On the live SysselCraft Supabase project, read-only verification found three `active` occurrences of the daily task `Bädda sängen`, with occurrence keys `day:2026-10-12`, `day:2026-10-13` and `day:2026-10-14`. No database rows were changed during diagnosis. Frontend and parent view both consume `list_child_quests`; live RPC uses a bounded unfinished-slot selection, which can make its visible totals differ between refresh timing and separate views. The underlying root cause is missing recurrence expiry in `materialize_due_quest_instances`.

## Required lifecycle policy

- A recurring `daily` / `weekdays` / `weekly` quest produces **one scheduled occurrence key per eligible local period**, honoring the configured IANA timezone and release time. Idempotent `ON CONFLICT` prevents duplicate keys.
- **Only after the next scheduled occurrence becomes due**, any **earlier** occurrence with state `available` or `active` expires (`state=expired`, `closed_at`). A missed task is not automatically completed and creates no payout. A task still waiting for the next scheduled release is not expired early; a weekdays task can remain through a non-scheduled weekend.
- `pending` (submitted for review) and `approved` (with or without reward claim) remain untouched, including their historical evidence and reward idempotency.
- Parents may cancel precisely **one** `available` or `active` instance through `cancel_parent_quest_instance(uuid)`. It is parent-authorized with a locked row; non-parent calls or cancellation of `pending`/`approved` fail. The parent quest definition and recurrence remain intact.
- Cancellation sets `state=cancelled`, `closed_at`, and retains the unique occurrence key as a tombstone. That prevents immediate recreation of a cancelled daily task when the child reloads the quest list. The next scheduled period proceeds normally.
- `expired` and `cancelled` are server-only terminal states, not returned by the deployed `list_child_quests` unfinished/approved filters, and never count toward claims or story. The client-visible lifecycle types remain `available | active | pending | approved`.
- Parent UI exposes **Ta bort instans** on `Nya uppdrag hos barnet` and `Pågår`; the existing **Ta bort** action on `Uppdragsmallar` is a separate archive action.

## Ownership / Runtime 1.1

This is a **shared Quest System V2 backend lifecycle fix**, not Act 3-specific logic. It affects chores of any class and of all acts, without rewriting Runtime 1.1's authoritative progression, child save, Story or claim engine. All true earned progression remains owned by the existing backend `claim_quest_reward` transaction.

## Delivery and caution

Code and SQL migration:
- `supabase/migrations/20261014_quest_v2_recurring_expiry_and_parent_cancel.sql`
- `src/backend/familyRepository.ts`, `src/app/parent/page.tsx`
- `scripts/test-quest-v2-recurring-expiry.mjs` (contract + policy scenarios, included in `npm run verify`)

**Deployment is two distinct steps:** (1) merge/ship the parent UI/client code and (2) apply the SQL migration to the live database, **after review and explicit authorization**. Until step (2), pressing `Ta bort instans` will receive an RPC-not-found error. Do not claim live behavior is fixed simply because CI passes.

**After migration:** parent or child refresh calls the live list RPC, which calls the updated materializer and expires historical open occurrences. The old Oct 12–13 `Bädda sängen` occurrences should become `expired` when Oct 14 is already due, leaving Oct 14 `active`. A live rollback/repro test must check exact local date/time and state before touching real users' quests.

## QA before release

1. In an isolated test child/context: create daily, weekdays and weekly recurrence; miss previous period; ensure only the current due open occurrence survives, with old state `expired`. Before next due, old current occurrence stays. Use explicit timezone and cross-week boundary cases.
2. Submit yesterday's instance (`pending`); today's occurrence materializes; parent can still approve yesterday without affecting the new one. Previously approved+claimed rewards remain unchanged.
3. Cancel one available/active occurrence; confirm list no longer shows it, template persists, same-day refresh doesn't recreate it, next eligible day creates a new occurrence. Concurrent parent/child operations should not double-create keys.
4. Non-parent cannot call cancellation; cancel pending/approved is rejected; parent template archival remains a separate action. No currency or `worldProgression` adjustment from expiry/cancel.
5. Verify on physical iPhone with existing saves and parent UI; use separate browser tests for proof without mutating Adam's production history.

No production data mutation has been run in this PR preparation.
