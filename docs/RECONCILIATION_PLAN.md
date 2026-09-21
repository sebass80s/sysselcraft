# Sysselcraft Local ↔ Backend Reconciliation

Status: **DIAGNOSTIC UI READY; NO AUTOMATIC MERGE YET**

Sysselcraft currently has two legitimate persistence domains:

1. the existing Capacitor Preferences save, which owns the proven local/native prototype state; and
2. Supabase, which owns shared family identity, paired child devices, parent-created quests and server-authoritative rewards.

The project must not silently overwrite one with the other until the real two-device flow has been tested on physical hardware.

## Current rule

**Observe first. Merge later.**

`src/backend/reconciliation.ts` provides a pure diagnostic comparison between a local `SaveStateV1` and a backend `BackendChildGameState`. It does not write to either source.

`src/backend/reconciliationPolicy.ts` turns that comparison into an explicit decision. The current phase is hard-coded as `observe-only`, and every decision has `automaticWriteAllowed: false`. This is intentional: even a `no-op` report is only a clean baseline, not permission to copy state automatically.

`src/backend/deviceReconciliation.ts` combines the paired child id, local Preferences save and backend game state into the same report and attaches the explicit read-only decision, still without performing writes.

A read-only diagnostic panel is mounted on the child game surface and can be enabled with:

`/?debug=reconciliation`

On the installed native app, the iPhone-only test controls also contain a **TEST: reconciliation-diagnostik** shortcut so the physical baseline does not require an address bar. The panel has a direct exit back to normal play.

The panel is intentionally hidden during normal play. It exists for development/native migration testing and should never become a child-facing progression dashboard.

The report compares:

- diamonds;
- SysselBux;
- all five hidden progression classes;
- backend unified `worldProgression` as informational state;
- first-delivery world flag;
- Recycling stage.

Missing backend world flags are treated as unknown state and force `inspect-before-merge`; absence is never interpreted as agreement.

It returns one of four recommendations:

- `no-op` — known fields agree;
- `backend-ahead` — backend values are consistently equal or ahead;
- `local-ahead` — local values are consistently equal or ahead;
- `inspect-before-merge` — mixed/conflicting state, so automatic reconciliation would be unsafe.

The policy layer then converts that recommendation into a next diagnostic step while keeping writes disabled.

## Why no automatic reconciliation yet

The local prototype and backend currently represent different slices of product history. For example, a local approved built-in quest may have already triggered the truck/material event while a newly paired backend child can still have a zeroed server economy. Blindly choosing the larger numbers would duplicate rewards; blindly choosing the backend would erase legitimate local progress.

Until migration semantics are deliberately locked, reconciliation must not:

- mint rewards;
- replay approval events;
- replay the truck/material animation;
- overwrite local names/dog state;
- convert built-in local quests into backend reward events retroactively;
- infer completed quests from currency totals.

## First physical reconciliation test

After the backend pairing package is available on the physical child device:

1. Start from a known local save on the child iPhone.
2. Record local diamonds, SysselBux, first-delivery state, Recycling stage and progression snapshot.
3. Pair that device to the real child profile.
4. Open `/?debug=reconciliation` and capture the first read-only report.
5. Confirm no local or backend value changes merely from opening/refreshing the diagnostics.
6. Complete one parent-created backend quest end-to-end.
7. Confirm the backend reward is exactly once.
8. Refresh the reconciliation panel and capture the second report.
9. Compare the before/after delta.
10. Only then decide migration policy for economy/progression/world flags.

The diagnostics must remain observational during this test. A recommendation such as `backend-ahead` is information for the migration decision, not permission for the client to overwrite the local save automatically.

## Likely migration direction

The intended long-term ownership is:

- Supabase authoritative for shared economy, parent-created quest lifecycle and family-visible progression;
- Capacitor Preferences used for offline/cache/device presentation state;
- world events derived from persisted authoritative state and restored without replaying completed animations.

That direction is not permission to delete the current local save. Migration must be explicit, versioned and recoverable.
