# Sysselcraft Local ↔ Backend Reconciliation

Status: **DIAGNOSTIC LAYER READY; NO AUTOMATIC MERGE YET**

Sysselcraft currently has two legitimate persistence domains:

1. the existing Capacitor Preferences save, which owns the proven local/native prototype state; and
2. Supabase, which owns shared family identity, paired child devices, parent-created quests and server-authoritative rewards.

The project must not silently overwrite one with the other until the real two-device flow has been tested on physical hardware.

## Current rule

**Observe first. Merge later.**

`src/backend/reconciliation.ts` provides a pure diagnostic comparison between a local `SaveStateV1` and a backend `BackendChildGameState`. It does not write to either source.

The report compares:

- diamonds;
- SysselBux;
- all five hidden progression classes;
- first-delivery world flag when the backend exposes that flag.

It returns one of four recommendations:

- `no-op` — known fields agree;
- `backend-ahead` — backend values are consistently equal or ahead;
- `local-ahead` — local values are consistently equal or ahead;
- `inspect-before-merge` — mixed/conflicting state, so automatic reconciliation would be unsafe.

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

After the backend pairing package is deployed:

1. Start from a known local save on the child iPhone.
2. Record local diamonds, SysselBux, first-delivery state and progression snapshot.
3. Pair that device to the real child profile.
4. Read the backend child state without mutating the local save.
5. Generate a reconciliation report.
6. Complete one parent-created backend quest end-to-end.
7. Confirm the backend reward is exactly once.
8. Generate a second report and inspect the delta.
9. Only then decide migration policy for economy/progression/world flags.

## Likely migration direction

The intended long-term ownership is:

- Supabase authoritative for shared economy, parent-created quest lifecycle and family-visible progression;
- Capacitor Preferences used for offline/cache/device presentation state;
- world events derived from persisted authoritative state and restored without replaying completed animations.

That direction is not permission to delete the current local save. Migration must be explicit, versioned and recoverable.
