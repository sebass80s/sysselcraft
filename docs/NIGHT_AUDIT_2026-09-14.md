# Sysselcraft night audit — 2026-09-14

Status: **SAFE HARDENING PASS COMPLETED · REAL DEVICE RECONCILIATION STILL REQUIRED**

This audit was performed against draft PR #6 on `nova/vercel-free-batch`. It intentionally avoided Vercel and made no writes to real Supabase family data.

## Verified baseline

- Active draft PR: #6, `nova/vercel-free-batch` → `main`.
- Starting head: `00a600894f608ab6977cbd9e93c8c99946cbc8cf`.
- Starting CI run #138 completed successfully; dependency install and `npm run verify` both passed.
- The physical iPhone/Capacitor migration is already working. Do not regenerate iOS with `npx cap add ios`.
- Reconciliation remains observe-only. No automatic local ↔ backend state merge is authorized.

## Areas audited

### Child backend quest surface

The paired child ID was being activated before the client had confirmed that the current Supabase session was a valid anonymous child session. If the auth session had become a parent/non-child session, focus/visibility and open-panel refresh effects could continue attempting backend reads even after the UI already knew the child session needed renewal.

Hardening in this pass:

- track child-session readiness explicitly;
- keep the paired ID visible so the user still receives a useful re-pair message;
- stop focus, visibility and interval refreshes when the auth session is not a valid anonymous child session;
- clear stale backend quest/wallet presentation when child auth becomes invalid;
- subscribe to auth-state changes so a later session replacement also disables child syncing;
- disable submit/manual refresh while the child session is invalid.

This does not modify pairing state, local game save or backend data.

### iPhone/native viewport

The gameplay shell already used dynamic viewport units and several safe-area insets, but three edge cases remained in landscape:

- the parent/pair surfaces protected the bottom safe area but not all four sides;
- centered quest/dialogue cards could extend farther into horizontal unsafe areas on notched devices;
- the backend quest dock width did not subtract both horizontal safe areas.

This pass adds edge-only CSS hardening. It does not change Phaser's internal world size, camera, pathfinding, collision, quest semantics or art placement.

### Local save and Phaser lifecycle

Reviewed `saveState.ts`, `VillagePrototype.tsx` and `createVillageGame.ts` with the physical-device path in mind.

Confirmed:

- local Preferences writes are serialized through a write queue;
- approved built-in quest rewards are protected against duplicate local approval;
- completed first-delivery visuals restore without replaying the truck animation;
- text controls suppress WASD/arrow movement while typing;
- Phaser is destroyed on React cleanup;
- tap-to-move and direct quest-marker interaction remain separate as intended.

Known follow-up: local save write failures are currently logged rather than surfaced in the UI. That is not changed in this pass because changing persistence failure semantics deserves a dedicated device test rather than a silent night-time behavior change.

### Backend/security/reconciliation

Reviewed the repository client boundary plus backend migration SQL.

Confirmed:

- direct client table writes are revoked; authoritative mutations go through RPCs;
- child pairing requires an anonymous authenticated session after hardening;
- pairing crypto calls are correctly schema-qualified through `extensions`;
- quest submit requires an available quest bound to the current child;
- parent review locks the quest row and requires a pending quest;
- reward issuance is idempotent through unique `reward_events.quest_instance_id` plus an explicit successful-insert check;
- reconciliation code is read-only and the policy hard-locks `automaticWriteAllowed: false` for every recommendation.

No live Supabase rows were changed or used as test fixtures during this audit.

## Known risks deliberately not auto-changed

1. **Pairing success + verification network failure.** A one-time pairing code can be consumed server-side before the client finishes its post-redeem verification/read and persists the new local child ID. Recovery is to generate a fresh code. A more seamless recovery mechanism would change pairing semantics and should be designed deliberately rather than guessed.
2. **Local save write observability.** Preferences write errors are logged, but the child is not shown a save-health warning. This is worth hardening after deciding the desired offline/retry UX.
3. **Parent manual action error wrappers.** Most parent actions already catch errors, but the lightweight manual refresh/logout controls should eventually use the same explicit busy/error wrapper pattern. This is a robustness cleanup, not a backend-authority blocker.
4. **Reward upper bounds.** Rewards are normalized to non-negative integers and PostgreSQL integer constraints prevent invalid storage, but there is no product-level maximum reward. A cap is an economy/product decision and was not invented during the audit.
5. **No automatic reconciliation tests against real device snapshots yet.** This is intentional. The next authority decision must use captured before/after evidence from the physical test plan.

## MVP readiness snapshot

### Proven or substantially implemented

- native iPhone launch through Capacitor/Xcode;
- village movement, collision and tap-to-move;
- Linus intro, child name and puppy naming;
- built-in first quest local lifecycle;
- parent-created backend quests;
- anonymous child pairing;
- child submission → parent approval → exactly-once server reward foundation;
- local/backend reconciliation diagnostics;
- first-delivery visual state restore;
- separate React parent surface;
- broad first visual refinement batch.

### Still required before calling the core vertical slice proven

1. Run the documented physical two-session/two-device reconciliation test.
2. Capture before/after reconciliation snapshots without writing either ledger.
3. Verify the real parent-created quest is visible on the physical child device, goes pending, is approved, and produces exactly one shared backend reward.
4. Verify the same backend wallet/lifecycle on both child and parent surfaces after app background/resume.
5. Decide the first explicit migration rule only after those captures exist.
6. Run the current visual batch in-game on the physical device and adjust composition from evidence rather than further blind asset polishing.

## Recommended next step

The project is now at the point where more speculative migration code would reduce safety rather than increase it. The next high-value proof is the real physical reconciliation run in `docs/DEVICE_RECONCILIATION_TEST_PLAN.md`. Until that succeeds, preserve the two ledgers and keep reconciliation observational.
