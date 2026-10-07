# Runtime Architecture 1.1 — Canonical Handover

## Repository truth first

Repository: `sebass80s/sysselcraft`  
Branch: `nova/runtime-architecture-v1`

Always verify current branch, HEAD and GitHub Actions before changing code. Repository reality wins over this document, prior chats and memory.

## Current verified state

Runtime Architecture 1.1 architecture and automated/browser verification are complete.

Verified runtime code checkpoint:
- `98e8950c227cbf215ccab91b885fb3b03b9c2ae1`
- GitHub Actions CI **#2388 SUCCESS**
- Runtime Browser Closeout **#12 SUCCESS**

Canonical docs were then cleaned up on later docs-only commits. Verify the current docs HEAD before continuing.

### Runtime 1.1 status

1. Shared Chapter Runtime Host ✅
2. Generic Progression / Project Engine ✅
3. Shared Story UI / sequencing / inputs / history / cards / choices ✅
4. Generic Story Purchase integration ✅
5. Generic chapter persistence host ✅
6. Shared backend synchronization / reconciliation ✅
7. Full World / Area Runtime Host ✅
8. Common debug / acceptance harness ✅
9. Empty Act 3 skeleton proof ✅
10. Full automated + browser closeout ✅
11. Physical iPhone update-in-place acceptance ⬜

Only item 11 remains before Runtime 1.1 is fully accepted on the preserved physical device.

## Fuel principle

Future chapters should primarily add:
- chapter registration/config;
- chapter-owned state and content;
- Story beats, images and dialogue;
- project/progression definitions;
- area data, placements and collision geometry;
- narrow adapters for genuinely chapter-specific behavior.

Future chapters should **not** recreate:
- Preferences persistence plumbing;
- backend polling/subscription lifecycle;
- wallet/progression/ownership snapshot infrastructure;
- Phaser bootstrap/lifecycle;
- chapter runtime shell/boundary;
- Story sequencing engine;
- Story Purchase plumbing;
- generic project/progression engine;
- debug/reset/state-inspection infrastructure.

If Act 3 starts introducing a second copy of those systems, stop and fix the shared engine rather than accepting chapter-local duplication.

## Shared engine ownership

### Chapter/runtime host
Owns shared chapter lifecycle, runtime mounting, boundaries and chapter registration/navigation.

### Persistence
Owns child-scoped load/save/clear, operation ordering, strict unreadable-state handling and migration hosting.

Safety law:
- successful canonical write before destructive legacy cleanup;
- local migrations may repair only local evidence;
- local migration must never fabricate backend-authoritative evidence.

### Backend synchronization
Owns common polling/subscription lifecycle, cancellation, stale-response safety and canonical backend snapshots.

Backend remains authoritative for:
- quest lifecycle;
- earned rewards;
- wallet;
- earned-work/progression evidence owned by backend.

Chapter adapters own selectors/reconciliation, not transport lifecycle.

### Progression/project engine
Owns generic project/progress mechanics and reusable completion/gating machinery.

Chapter data owns actual projects, thresholds, copy and chapter-specific completion reactions.

### Story engine
Owns shared Story presentation, sequencing, history, cards, choices, inputs and standard navigation behavior.

Chapter content owns dialogue, images, choices and unique beats.

### Story Purchase
Owns registered purchase catalogs, handoff resolution, generic shop integration, purchase routing and resume behavior.

Chapter registrations own item definitions, gates, prices, world mapping and chapter-specific post-purchase reactions.

### World / Area Runtime Host
Owns proven-common:
- scene/game lifecycle;
- player/dog shared creation;
- input binding and input authority;
- camera base behavior;
- interaction resolution/markers;
- viewport/depth/runtime mount-sync-destroy.

Areas intentionally retain:
- maps and assets;
- placements;
- collision geometry;
- world bounds;
- movement strategy and tuning;
- unique interactions.

Village and Lake are allowed to differ where gameplay genuinely differs.

### Debug / acceptance
Owns shared fixture-driven launch/reset/state inspection/probes and standard debug shell.

Chapter-specific debug extensions should remain narrow data/actions.

## Empty Act 3 proof

`/act3` is intentionally an empty architecture proof.

It demonstrates that a new chapter can join the shared engine without introducing its own:
- Preferences implementation;
- Supabase polling lifecycle;
- Phaser bootstrap;
- project/progression engine;
- Story Purchase engine;
- debug harness.

Do not add Act 3 gameplay until physical Runtime 1.1 acceptance is complete.

## Automated/browser acceptance

Browser Closeout #12 verifies:
- legacy alpha runtime regression suite;
- Story overlay blocks gameplay HUD during Act 2 opening;
- Act 2 world/HUD mounts and keyboard input remains safe after blockers clear;
- Story Purchase handoff opens Mira and has a safe no-purchase exit;
- completed Act 2 transitions to Act 3;
- Act 2 state survives the transition/reload;
- empty Act 3 production/debug skeleton uses the shared runtime/debug architecture.

The browser workflow must cover runtime source changes under `src/**`.

## Physical iPhone acceptance — only remaining gate

Use update-in-place on the existing physical iPhone.

Do not:
- reset the preserved save;
- reinstall merely to make testing easier;
- regenerate the native iOS project;
- run `npx cap add ios`;
- use Vercel as a substitute for native acceptance.

Acceptance must preserve the existing save/backend relationship and prove that current Act 1/Act 2 behavior survives the Runtime 1.1 engine.

## Act 2 invariants

Preserve:
- 16 contributions per project, 64 total;
- Brygga, Båthus and Stuga before Motorbåt;
- backend work/reward evidence authoritative;
- local Act 2 state owns consumed/presented Story/world state;
- legacy finale migration preserves already-consumed history;
- completed Act 2 + acknowledged end card exposes the Act 3 boundary;
- Alve is absent after completed + endCardSeen.

Do not alter story/content merely to simplify architecture.

## Vercel and native policy

Routine Runtime work:
- GitHub CI = automated verification;
- browser closeout = browser acceptance;
- Xcode/Capacitor = native build/physical acceptance;
- Vercel = only manual preview when explicitly requested.

Git-triggered Vercel deployment remains disabled.

## Next exact work order

1. Verify current branch/HEAD/CI.
2. Confirm canonical docs match repository reality.
3. Perform physical iPhone **update-in-place** acceptance with preserved save/backend.
4. If native acceptance reveals a shared-engine defect, fix it in the shared owner and add the smallest regression test that owns the contract.
5. Re-run full CI/browser gate as appropriate.
6. Only after physical acceptance is closed may Act 3 gameplay begin.
