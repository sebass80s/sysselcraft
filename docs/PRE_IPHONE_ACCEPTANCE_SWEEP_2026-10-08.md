# Pre-iPhone Acceptance Sweep — 2026-10-08

## Result

**PASS FOR PHYSICAL IPHONE ACCEPTANCE**

This sweep was performed after the pre-Act-3 engine integrity audit and before updating the physical iPhone.

Final verification:
- final code/test HEAD: `34fdd42591d78440b98c75f7d7dc1f997713aab2`
- GitHub Actions CI **#2430 SUCCESS** on exact HEAD
- Runtime Browser Closeout **#23 SUCCESS** on `cb76a1b297bb9edc1f82a9d75fd56f32f4b30004`
- commits after the browser checkpoint are test-contract-only; runtime source is unchanged

## Acceptance risks reviewed

### Existing save preservation

PASS in automated/browser coverage.

The Runtime 1.1 browser smoke now simulates an already-paired child with:
- existing Act 1 save bytes;
- child-scoped Act 2 runtime state;
- Act 2 completion;
- transition to Act 3;
- reload.

The test proves:
- Act 1 save bytes remain unchanged;
- child-scoped Act 2 completion bytes remain unchanged;
- completed scoped state is not leaked back into the unscoped legacy key;
- Act 3 remains the empty Runtime 1.1 skeleton.

### Act 1 regression surface

PASS in current automated coverage.

Existing alpha/browser coverage includes:
- corrupt save fail-closed behavior;
- save failure + retry without reset;
- pairing without losing the mounted game;
- offline load + manual retry;
- quest presentation/recovery/turn-in;
- recurring quest behavior;
- lifecycle/unmount cleanup.

The paired update-in-place browser fixture additionally proves Act 1 persisted bytes survive Act 2 -> Act 3 navigation/reload.

### Act 2 progression / Story resume

PASS in automated coverage.

Existing Act 2 full-flow/runtime tests cover Story progression, construction/project gates, restart behavior and chapter completion.

The pre-iPhone fixture verifies child-scoped Act 2 state survives reload unchanged.

### Wallet / quest rewards

PASS in automated coverage.

Existing alpha/quest tests cover:
- single quest mutation under double tap;
- stale response protection;
- wallet/reward presentation;
- recurring quest occurrence behavior;
- rebind behavior;
- offline recovery.

No new wallet defect was found in this sweep.

### Story Purchase / Mira handoff

A real bug was found and fixed.

#### Bug

The Story Purchase registry still used separate:
`loadAct2RuntimeState() -> mutate -> saveAct2RuntimeState()`

This retained the same stale read-modify-write race class already removed from backend reconciliation.

The purchase path also discarded the authoritative `childId` returned by the purchase RPC before writing chapter state.

That meant a Story purchase or purchase-story progress could theoretically:
- overwrite newer Story progress;
- write local purchase state under the wrong paired child if pairing changed during the flow.

#### Fix

Story Purchase is now engine-first and identity-bound:
- shared Story Purchase operations accept an identity operation context;
- Act 2 purchase mutation uses shared atomic `updateAct2RuntimeState()`;
- purchase RPC `childId` is forwarded as `expectedChildId`;
- Mira handoff retains the child identity that opened the flow;
- purchase-story progress and ownership refresh remain bound to that identity;
- missing purchase child identity is rejected instead of silently writing ambiguous state.

Focused regression contracts were updated accordingly.

### Backend sync

PASS.

Backend reconciliation already uses shared atomic persistence `update()`, lifecycle guards and authoritative expected child identity.

The pre-iPhone sweep found no additional backend-sync write path bypassing this protection after the Story Purchase fix.

### Lifecycle / background / stale work

PASS at automated ownership boundaries.

Coverage includes:
- stale backend responses after stop;
- polling cleanup after unmount;
- no duplicate quest mutation/reward after background/focus reads;
- child identity protection in shared persistence;
- stale queued and in-flight persistence rollback.

Physical iOS suspension/resume behavior still requires the real device gate.

### Act 2 -> Act 3 boundary

PASS in browser.

Paired-child browser acceptance proves completed Act 2 can enter the empty Act 3 Runtime 1.1 skeleton and survive reload without mutating prior chapter saves.

## Bugs fixed during this sweep

1. Story Purchase stale load -> save race.
2. Story Purchase purchase-result identity was not propagated into chapter persistence.
3. Story Purchase story-progress/ownership refresh was not pinned to the handoff child identity.
4. Browser acceptance did not previously simulate a paired child with child-scoped Act 2 persistence.
5. Several static regression assertions still described the retired unscoped Story Purchase API and were updated to the new identity-safe contract.

## What is deliberately not claimed

Automation cannot prove the following native-device behaviors:
- real Capacitor Preferences upgrade-in-place against the current installed phone;
- actual iOS process suspension/resume;
- physical touch/input behavior;
- real backend data for the currently paired child;
- Xcode/Capacitor packaging preserving the installed app container.

Those belong to the physical iPhone acceptance gate.

## Recommendation

Proceed with physical iPhone update-in-place acceptance.

Rules:
- no uninstall;
- no reset;
- no save clearing;
- update the existing app in place;
- verify existing child/save/backend state first;
- stop immediately if state is missing, rewound or belongs to the wrong child.

Real Act 3 gameplay remains blocked until physical acceptance passes.
