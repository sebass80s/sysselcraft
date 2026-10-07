# Codex pre-Act-3 engine integrity audit

## Goal

Audit Runtime Architecture 1.1 before real Act 3 gameplay begins.

This is **not** a broad refactor task. The purpose is to find engine leaks, duplicated runtime behavior, missing regression ownership and safe legacy cleanup opportunities before new chapter content is added.

Runtime 1.1 architecture and browser verification are already complete. Preserve that baseline.

## Repository / branch

Repository: `sebass80s/sysselcraft`  
Branch: `nova/runtime-architecture-v1`

Verified preparation baseline when this brief was created:
- HEAD before this audit brief: `84103d8b61564da887d66f8c70e18c0788bbf0f0`
- GitHub Actions CI #2407 SUCCESS

Before doing anything:
1. verify current branch and HEAD;
2. verify latest GitHub CI on exact HEAD;
3. read the canonical Runtime 1.1 docs below;
4. repository reality wins over this brief if anything has moved.

## Read first

Required:
- `docs/RUNTIME_1_1_HANDOVER_2026-10-06.md`
- `docs/RUNTIME_ARCHITECTURE_1_1.md`
- `docs/RUNTIME_1_1_FUEL_AUDIT.md`
- `docs/STATE_OWNERSHIP.md`
- `docs/SAVE_COMPATIBILITY_AUDIT.md`
- `docs/TECHNICAL_HANDOFF.md`
- `docs/NOVA_HANDOFF_MANIFEST.md`

Also inspect:
- `package.json`
- `.github/workflows/runtime-browser-closeout.yml`
- `scripts/test-alpha-runtime.mjs`
- `scripts/test-runtime-1-1-browser.mjs`
- `scripts/test-act3-empty-skeleton.mjs`

## Hard architecture rules

### Stop-the-line engine rule

If ordinary chapter work would require chapter-local engine plumbing, flag it as an engine gap.

Do not hide reusable behavior behind Act-specific workarounds.

When behavior is reusable:
1. shared engine owns it;
2. add/extend a reusable contract/config surface;
3. add the smallest focused regression test;
4. chapter consumes it through config/content/adapters.

### New gameplay is engine-first

A gameplay mechanic first appearing in Act 3 does not automatically belong to Act 3.

Treat new gameplay as a generic engine capability first. Keep it chapter-local only if it is genuinely unique narrative/content behavior or truly non-reusable gameplay.

### Preserve authority

Backend remains authoritative for backend-owned quest lifecycle, wallet, rewards and earned-work evidence.

Local migration must never fabricate backend evidence.

### Preserve physical acceptance boundary

Do not touch physical iPhone acceptance in this task.

Do not reset/reinstall native state.

Do not build real Act 3 gameplay.

Do not use Vercel.

## Audit A: engine leak audit

Search the codebase for chapter-local implementations of behavior that Runtime 1.1 says is shared.

At minimum inspect for:

### Persistence leaks
- direct `@capacitor/preferences` imports outside shared persistence ownership;
- direct localStorage/storage-key handling that bypasses shared chapter persistence;
- chapter-local load/save/clear/migration sequencing;
- destructive legacy cleanup before successful canonical write.

### Backend sync leaks
- direct chapter-local polling loops;
- `setInterval` / polling lifecycle outside shared backend synchronization ownership;
- duplicate subscription/cancellation logic;
- stale-response handling implemented independently;
- direct wallet/progression/ownership snapshot plumbing in chapter runtimes.

### Chapter lifecycle leaks
- chapter-local runtime mount/unmount orchestration;
- duplicate chapter transition mechanics;
- duplicate runtime boundary/shell behavior.

### World/runtime leaks
- direct `new Phaser.Game` or duplicate bootstrap outside shared World/Area Runtime Host;
- duplicate input/camera/player/dog/interaction lifecycle code;
- duplicate interaction-marker arbitration;
- chapter-local generic world-input authority.

Do **not** flag legitimate area-specific maps/assets/collision geometry/world bounds/movement strategy/tuning merely because they are local.

### Story leaks
- duplicate Story sequencing/navigation;
- chapter-specific generic dialogue/card/choice/input presentation;
- duplicate history mechanics;
- beat-local engine state that should be generic sequencing/config.

### Progression/project leaks
- duplicate generic project contribution/count/gate/completion engines;
- chapter-local copies of reusable progression calculations;
- hard-coded generic progression behavior that future chapters would need to copy.

### Story Purchase leaks
- chapter-specific purchase handoff/query parsing in consumers;
- duplicate purchase routing/resume behavior;
- shop rendering branches for a chapter that should be registry/config driven.

### Debug/acceptance leaks
- chapter-local copies of launch/reset/state inspection/probes;
- debug-only runtime behavior that bypasses the shared fixture/harness without a unique reason.

## Audit B: regression ownership audit

Map the major shared Runtime 1.1 capabilities to focused regression coverage.

For each engine owner answer:
- what test currently proves it?
- is the test at the correct ownership boundary?
- is there an important shared contract with only incidental coverage?
- would a regression in this subsystem be caught before Act 3 content work?

Priority systems:
- chapter lifecycle/registry/navigation;
- persistence/migrations/write ordering;
- backend sync/cancellation/stale-response safety;
- progression/project engine;
- Story sequencing/UI/history/input;
- Story Purchase;
- World/Area Runtime Host;
- shared debug/acceptance harness;
- Act 2 -> Act 3 chapter boundary.

Do not add duplicate regex guards everywhere. Prefer the smallest test that owns the contract.

## Audit C: safe legacy/dead-code candidates

Identify code that appears superseded by Runtime 1.1.

Classify each candidate as:
- SAFE TO REMOVE NOW;
- KEEP FOR SAVE/COMPATIBILITY;
- KEEP FOR PHYSICAL ACCEPTANCE;
- UNCERTAIN / NEEDS EVIDENCE.

Evidence must include imports/references/runtime use, not just naming.

Do not delete compatibility code merely because it looks old.

Do not remove historical migration paths that still protect existing saves.

## Deliverable

Create:
`docs/PRE_ACT3_ENGINE_INTEGRITY_AUDIT.md`

Use this structure:

### Executive result
One of:
- PASS: no engine blockers;
- PASS WITH CLEANUP: no blockers, only safe cleanup/test improvements;
- BLOCKED: engine gap(s) must be fixed before Act 3.

### P0 engine blockers
Only issues that violate the stop-the-line rule and should block Act 3.

For each:
- subsystem;
- exact files/symbols;
- why it belongs in shared engine;
- risk if left local;
- recommended smallest shared fix;
- regression test owner.

### P1 engine risks
Important but not immediate blockers.

### Regression coverage gaps
Shared contracts that need stronger focused proof.

### Legacy/dead-code candidates
With the four classifications above.

### Confirmed intentional local behavior
List local code reviewed and confirmed as valid chapter/area-specific content.

### Recommendation
Exact next action before Act 3.

## Change policy

Default mode is **audit first**.

You may implement a fix in the same session only when all of these are true:
- ownership is unambiguous;
- change is small and low risk;
- it clearly removes a Runtime 1.1 engine leak or closes a focused regression gap;
- existing save/backend authority is unchanged;
- a focused regression test can be added/updated;
- full `npm run verify` can remain green.

Do not begin a multi-module redesign without first documenting it as a P0 engine gap.

## Verification policy

For every code change:
1. run the narrowest owning test;
2. run full `npm run verify`;
3. verify GitHub CI on exact resulting HEAD;
4. if runtime/browser-facing source changes, ensure Runtime Browser Closeout runs and passes on the relevant code HEAD.

Never call a slice green without exact-HEAD evidence.

## Final handoff

At the end, report:
- final branch/HEAD;
- exact CI status/run;
- browser closeout status if applicable;
- audit classification;
- files changed;
- any P0 engine gaps;
- any safe cleanup completed;
- exact next recommended action.

Do not start Act 3 gameplay.
