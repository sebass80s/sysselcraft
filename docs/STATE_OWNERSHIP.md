# Sysselcraft state ownership during backend migration

Status: **CURRENT MIGRATION BOUNDARY · OBSERVE BEFORE MERGE**

Sysselcraft currently has two legitimate persistence domains. This is intentional during the migration from the proven local prototype to the shared family backend.

The purpose of this document is to stop future code from silently treating every value with the same name as if it already has one canonical owner.

## Current ownership matrix

| State family | Current authority | Other copy | Write rule today |
| --- | --- | --- | --- |
| Household identity | Supabase | none | Parent/backend flow only |
| Parent accounts/auth | Supabase Auth | none | Supabase Auth only |
| Child backend identity | Supabase | paired child id cached locally | Pairing RPC establishes binding; local cache must not invent identity |
| Parent-created quest definitions | Supabase | none | Parent backend flow only |
| Parent-created quest lifecycle | Supabase | rendered by child/parent clients | Server-authoritative RPC transitions |
| Parent-created quest rewards | Supabase | displayed by clients | Award only through idempotent backend approval |
| Backend wallet | Supabase | child UI may display it | Never mutate from local prototype save |
| Built-in `Bädda sängen` quest | Capacitor Preferences/local prototype | no backend migration yet | Keep local until migration semantics are explicitly designed |
| Built-in local currency | Capacitor Preferences | comparable backend wallet exists | Do not merge or overwrite automatically |
| Hidden local progression | Capacitor Preferences | backend progression exists for backend quests | Compare read-only; no automatic merge yet |
| Intro/dialogue completion | Capacitor Preferences | none | Local/native save |
| Child name from intro | Capacitor Preferences | backend child display name is a separate family-profile concept | Do not overwrite either direction implicitly |
| Puppy name/visibility | Capacitor Preferences | backend child record may later gain product semantics | Local/native save for now |
| First material delivery / recycling-center local world state | Capacitor Preferences | backend world flags may eventually mirror authority | Restore from local persisted state; compare read-only during migration |
| Bakery construction pacing bridge | Local construction/save owns visible stage and reveal; Supabase `worldProgression` supplies authoritative post-baseline quest-claim count | Persisted local `bakeryClaimBaseline` + baseline stage | One-way claim-count input only: never copy backend stage/world flags into local construction, never rewrite backend from local construction |
| Phaser scene objects | none | derived from state | Renderer only; Phaser must not become persistence authority |

## Non-negotiable migration rules

1. **Same-looking fields are not automatically the same ledger.** Local diamonds earned by the prototype and backend diamonds awarded by server-approved family quests currently have different histories.
2. **No client-side max-value merge.** Choosing the larger currency/progression value can duplicate legitimate rewards or conceal conflicts.
3. **No event replay from snapshots.** A persisted `firstDeliveryComplete` state may restore world visuals, but must not replay the original reward/truck event after restart or migration.
4. **No retroactive reward-event fabrication.** Existing local completed quests must not be converted into backend reward events merely to make totals line up.
5. **Pairing identifies a child; it does not migrate the save.** Pairing a physical device must leave the existing local save intact.
6. **Reconciliation recommendations are diagnostics only.** `backend-ahead`, `local-ahead`, `no-op` and `inspect-before-merge` do not authorize writes.
7. **Migrate one state family at a time.** Economy, hidden progression, world flags and presentation/profile state should receive separate explicit migration rules and tests.


### Bakery claim-count bridge (LOCKED 2026-09-23)

Bakery is the first deliberately narrow bridge across the two persistence domains. It is **not** a general reconciliation write path and does not change the observe-only migration rule above.

- Supabase remains authoritative for whether a parent-created quest reward was actually claimed by the child. The existing backend `worldProgression` total is read only as a monotonic count source.
- Capacitor Preferences remains authoritative for Bakery's local construction state: earned stage, pending reveal, revealed stage and completion Story Moment.
- When Bakery pacing begins on a device, the local save captures the current backend `worldProgression` as `bakeryClaimBaseline` plus the Bakery stage already physically reached as `bakeryClaimBaselineStage`.
- Only the delta after that baseline can earn later Bakery stages. Existing backend history is therefore never replayed as new construction work.
- Locked Bakery pacing is 1–2–4–3 contributions, cumulative 1/3/7/10. A contribution means authoritative child turn-in/claim, never parent approval or submission.
- A pending local reveal blocks earning another stage until the child visits Henning and consumes the authored reveal. This prevents backend refreshes from visually skipping construction stages.
- Existing development/test saves that already have Bakery progress baseline from their current physical stage, so installing this bridge cannot immediately jump them forward.
- The bridge never writes Bakery construction state, local currency, local hidden progression or fabricated events back to Supabase.

## Current intended end state

Long term, Supabase is expected to become authoritative for shared family-visible/gameplay state that must survive devices, especially parent-created quest lifecycle, server rewards, shared economy and progression.

Capacitor Preferences should remain useful for offline/cache/device presentation state and may retain state that has no reason to be shared.

That target architecture is **not yet active for the old local prototype state**. The first physical two-session/two-device reconciliation test must happen before any authority switch.

## Implementation guardrail

Any code that introduces a write from reconciliation should require all of the following first:

- a written migration rule for the specific state family;
- a captured real-device before/after reconciliation report;
- an idempotency strategy;
- a rollback/recovery plan;
- CI coverage for the pure decision logic;
- explicit confirmation that world events restore state without replaying one-time effects.

Until then the migration phase remains **observe-only**.

### Current reconciliation capture

The read-only `?debug=reconciliation` diagnostic now captures the local/backend economy, category progression, first-delivery flag, Recycling stage and backend `worldProgression`. Unknown backend world flags are treated as uncertainty, never as a clean match or an ahead/behind result. This is deliberate: absence of a flag is not evidence that the two ledgers agree.

The next authority decision still requires the physical baseline described above. Do not turn these diagnostics into a write path merely because the values happen to match on one device.
