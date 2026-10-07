# Explicit save compatibility audit

Base: `21a3ad907f697a57f4c8860b484f8d4f774a8d3c` on
`nova/runtime-architecture-v1`. GitHub Actions run #1811
(https://github.com/sebass80s/sysselcraft/actions/runs/37185007492) was
verified completed/success on that exact SHA before edits.

## Construction slice

`saveState.ts` now adapts legacy construction through an independent 0 -> 1
shape migration using `runSequentialMigrations`. The saved envelope stays v1.
The historical boundary is preserved: absent, null and primitive construction
values use the legacy visible stage; objects, including arrays and empty objects,
remain authoritative. This deliberately does not tighten validation.

The adapter calls the existing `worldProgression.normalizeRecyclingCenterStage`
rule with normalized progression. It copies the resulting stage to both earned
and revealed, with no pending reveal or completion acknowledgement. Missing or
invalid legacy stages still allow the historical stage-1 derivation. Later stages
are never inferred from quest totals. `normalizeConstruction` no longer accepts
`legacyVisible`; deterministic pending reconstruction stays there.

Construction and Act 1 finale shape revisions are independent, since saves can
contain either newer field family. The already explicit Act 1 finale migration
was extracted into a named pre-normalization function; this is an ownership
cleanup, not a newly discovered implicit migration. Its accepted marker types
and Clinic-complete condition are unchanged.

## Sweep and classification

The sweep covered source compatibility/recovery annotations and persistence,
normalizer, fallback and missing-field paths in game, component, backend, app
and runtime code. Each candidate was classified before changing it.

| Candidate | Classification | Decision and reason |
| --- | --- | --- |
| Construction legacy visible stage in `saveState.ts` / `construction.ts` | Pure explicit legacy compatibility | Migrated as described above. Save-only input and accepted behavior are locked. |
| Act 1 Clinic-complete -> chapter finale acknowledgement | Migration, already explicit | Named pre-normalization step; same engine and behavior. |
| Act 2 finale schema 1 -> 2 -> 3 | Migration, already explicit | Retained. Already owned by `migrateAct2RuntimeCandidate` and covered by runtime parity. |
| Construction pending IDs, earned >= revealed, completed story beat filtering | Invariant repair / validation | Retained in normalizer; applies to current state and repeated runtime transitions. |
| `worldProgression` stage derivation and construction contribution thresholds | Progression/domain logic | Retained; these are ongoing rules, not historical schema conversion. |
| Save dialogue index/name guard, dog visibility and intro/dialogue consistency | Validation / invariant repair | Retained; no historical shape discriminator, required for current malformed/inconsistent saves too. |
| Save flags, balances, names and progression numeric bounds | Validation | Retained; no old-schema mapping. |
| Act 2 canonical consumed beat IDs, visible stage, completion and unlock gates | Invariant repair / domain derivation | Retained; reconstructed on every normalize, including current saves. |
| Act 2 epilogue/finale index consistency and end-card gate | Invariant repair | Retained; schema-specific compatibility is already upstream. |
| `questTurnInState.normalize`, awaiting approval ID parsing | Validation | Retained; filters shape and child identity, not a schema revision. |
| `recoverAwaitingQuestTurnIns` | Backend-owned recovery | Retained; approved/unclaimed backend quests are the authority. |
| Inbox wallet, purchased flags, dog-home and Sol/Clinic restoration | Backend-owned recovery | Retained; cannot reproduce from a local save alone. |
| Recycling/Bakery missing claim baselines and baseline stages | Backend-owned recovery / progression initialization | Retained together. Moving the local-looking stage fallback earlier changes ordering relative to authoritative baseline replacement. |
| Clinic continuity baseline lock | Backend-owned recovery with historical compatibility | Retained; depends on current authoritative claims and Sol state, not pure local migration. |
| Act 2 backend baseline and production-entry reset | Backend-owned progression initialization / domain transition | Retained; explicit runtime entry, not inferred save version. |
| `childDeviceBinding` localStorage -> Preferences | Storage migration | Untouched; separate storage owner and I/O. |
| Act 2 unscoped -> child-scoped Preferences key | Storage migration | Untouched; key ownership and successful-write-before-removal semantics. |
| Parent hidden-history JSON lists and repository response normalization | Validation | Retained; current input parsing, not old-save repair. |
| Pairing session restoration and reconciliation diagnostics | Backend-owned recovery / observe-only policy | Untouched; no permission or evidence for local/backend merging. |
| Backend quest presentation flag aliases (`henningPresent`/`henningArrived`, completion flags) | Domain projection over backend-owned state | Retained; read-only observe-only compatibility, with no locked historical schema or write ownership. |
| Quest presentation category fallback, navigation collision recovery | Domain fallback / invariant repair | Retained; no persisted legacy format. |

No further **implicit, pure, ownership-locked legacy compatibility** candidate
was found. The audit intentionally does not turn backend recovery or invariant
repair into migrations to increase the number of slices.

## Parity

The construction regression was expanded and run against the original
implementation before the production refactor. It covers 330 combinations of
construction shapes, stage values and progression totals, plus independent
Act 1 finale markers. Assertions lock earned/revealed/pending behavior, input
immutability and normalized-save idempotence. Existing storage/reload, failure,
completion, presentation and late-stage tests remain in place.

Validation: full `npm run verify` passed (exit 0), including visual audit,
construction suites, ESLint, production build and all story/quest/runtime suites.
The initial build attempt rejected an external node_modules symlink; replacing
it with a local dependency copy resolved the environment issue without changing
project configuration. `git diff --check` passed.


## Runtime branch integration

The Codex work was verified against repository reality before integration.

- base: `21a3ad907f697a57f4c8860b484f8d4f774a8d3c`;
- parity first: `d532dbfc7bcca70c6869240757578fb62e0d8dfd`;
- implementation: `99df1984a2bc088f5715d8f6ef5b112bff8316c7`;
- branch relation before integration: two commits ahead, zero behind;
- `nova/runtime-architecture-v1` was fast-forwarded to `99df1984...` without a merge commit;
- GitHub Actions #1812 completed SUCCESS on that exact code HEAD.

This audit therefore closes the current broad Save/Migration compatibility sweep. Its retained classifications are intentional ownership decisions, not a backlog of migrations waiting to be extracted.


## Runtime 1.1 persistence-host closeout — 2026-10-07

Verified checkpoint: `6f0acedd335e4b97913cc096b9d6ebd8c1300059`, GitHub Actions #2275 SUCCESS.

The generic persistence host required by this audit is now implemented and regression-covered.

Verified capabilities:
- child-scoped chapter keying;
- chapter id/version/default/normalizer/migration definition;
- strict parse/normalize behavior;
- ordered save/load/clear;
- safe legacy-key migration;
- canonical write before legacy deletion;
- failed-write preservation of durable legacy state;
- Act 2 migration to shared storage ownership;
- neutral new-chapter fuel proof without chapter-owned Preferences code.

The classification rules in this audit remain unchanged: historical local-shape conversion is migration, current invariant repair is normalization, storage-key movement is storage migration, and backend reconciliation remains backend-owned recovery.

The persistence host and backend synchronization host are both closed. This audit remains the compatibility contract: persistence infrastructure must not merge backend authority into local state.
