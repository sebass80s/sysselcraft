# Pre-Act-3 Engine Integrity Audit

## Executive result

**PASS**

The original audit returned **BLOCKED** with three P0 shared-engine integrity gaps. All three are now fixed and regression-locked before Act 3 gameplay begins.

Verified final code/test HEAD:
- `28deb6176e69b0af409e3ee117e24ea7abb0d2c2`
- GitHub Actions CI **#2417 SUCCESS** on exact HEAD

Verified browser runtime checkpoint:
- `060cda1d517183d825f2adb9705a2aa58c75e553`
- Runtime Browser Closeout **#18 SUCCESS**

The final HEAD differs from the browser checkpoint only by the last persistence regression-test commit. Runtime source is unchanged between those two checkpoints.

## Closed P0 engine gaps

### P0-1: unknown save formats could be normalized and original data lost

**CLOSED**

Act 2 now rejects explicit unknown/future runtime and finale schema versions instead of silently treating them as legacy v1.

Regression coverage proves:
- future runtime versions are rejected;
- future finale schema versions are rejected;
- unsupported persisted bytes remain untouched;
- unsupported state is not normalized and written back.

### P0-2: asynchronous writes lacked sufficient protection after stop or child identity change

**CLOSED**

Shared chapter persistence now:
- binds operations to the child identity captured at invocation time;
- supports lifecycle guards;
- supports `expectedChildId` for authority-bound operations;
- rejects stale queued operations;
- detects stale identity/lifecycle after an in-flight native write;
- rolls stale in-flight writes back to the exact previous durable bytes.

Regression coverage proves queued identity changes, lifecycle cancellation and in-flight rollback.

### P0-3: separate load/save queues could let older sync overwrite newer Story progress

**CLOSED**

Shared chapter persistence now exposes atomic `update()`, keeping read -> transform -> write inside one ordered persistence operation.

Act 2 backend reconciliation now uses this shared atomic update path instead of separate `load()` + `save()`.

Regression coverage proves an older reconciliation update cannot overwrite a newer Story save.

## Regression coverage added

Focused ownership:
- `scripts/test-chapter-persistence.mjs`
- `scripts/test-act2-runtime-state.mjs`

Full verification:
- CI #2417 SUCCESS on `28deb6176e69b0af409e3ee117e24ea7abb0d2c2`

Browser verification:
- Runtime Browser Closeout #18 SUCCESS on `060cda1d517183d825f2adb9705a2aa58c75e553`

## Remaining risks

No P0 engine blocker remains from this audit.

Physical iPhone update-in-place acceptance remains the final Runtime 1.1 native gate.

## Confirmed architecture rule

Act 3 remains stopped until shared engine gaps are fixed. That stop-the-line rule worked as intended here.

Future chapters must continue to:
- surface missing reusable capability immediately;
- fix shared engine first;
- add focused regression ownership;
- resume chapter content only after the engine gate is green.

## Recommendation

Proceed to physical iPhone update-in-place acceptance.

Do not start real Act 3 gameplay until that final native acceptance is complete.
