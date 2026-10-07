# Runtime Architecture 1.1

## Purpose

Runtime 1.1 exists so SysselCraft chapters are content/config/adapters running on one engine, not separate mini-engines that happen to look similar.

The success criterion is not “no chapter-specific code”. The success criterion is that chapter-specific code represents **real chapter differences**, while recurring engine behavior has one owner.

## Fuel principle

A new chapter should mostly require:
- registration/config;
- chapter state;
- content and Story beats;
- project/progression definitions;
- area/map/asset/collision data;
- narrow adapters for unique behavior.

A new chapter should not require copied implementations of persistence, backend polling, chapter lifecycle, Story sequencing, progression engines, Story Purchase, Phaser bootstrap or debug tooling.

The empty Act 3 skeleton is the proof case.

## Final architecture

### Chapter Registry
Canonical source for chapter identity, routes, predecessor relationships and chapter registration.

### Chapter Runtime Host
Owns common chapter lifecycle and runtime hosting.

Responsibilities include:
- mount/unmount lifecycle;
- shared runtime boundary;
- common production/debug shell integration;
- chapter transition plumbing.

### Persistence Host
One shared child-scoped persistence owner.

Responsibilities:
- load/save/clear;
- operation/write ordering;
- strict unreadable-state handling;
- migration hosting;
- canonical write before destructive legacy cleanup.

Migrations may transform local evidence only. They must never manufacture backend evidence.

### Backend Runtime Host
One shared owner for backend synchronization infrastructure.

Responsibilities:
- polling/subscription lifecycle;
- cancellation;
- stale-response safety;
- canonical wallet/progression/world/ownership snapshots.

Chapter adapters own selection/reconciliation. Backend authority remains intact.

### Progression / Project Engine
Generic project/progression mechanics live in the shared engine.

Chapter definitions own:
- project identities;
- thresholds;
- content copy;
- gates;
- unique completion reactions.

### Story Engine
Shared Story machinery owns:
- sequencing;
- cards;
- choices;
- text/name inputs;
- history;
- standard Story navigation and presentation contracts.

Chapter content owns actual dialogue, images, choices and unique beats.

### Story Purchase Registry / Engine
Shared engine owns:
- registered chapter catalogs;
- handoff query resolution;
- shop loading/rendering path;
- purchase routing;
- post-purchase/resume flow.

Chapter registrations own item data, gates, pricing, world mappings and chapter-specific reactions.

### World / Area Runtime Host
Shared host owns only proven-common runtime behavior:
- scene/game mount/sync/destroy;
- Phaser bootstrap contract;
- shared player/dog creation;
- input bindings and world-input authority;
- common camera base behavior;
- viewport/depth plumbing;
- interaction arbitration/markers.

Area-specific by design:
- map and art;
- placements;
- collision geometry;
- bounds;
- movement strategy;
- movement feel/tuning;
- unique interactions.

Do not force Village A* and Lake direct movement into one artificial strategy.

### Debug / Acceptance Harness
Shared fixture-driven tooling owns:
- launch/reset;
- state inspection;
- standard probes;
- safe synthetic state where explicitly permitted;
- shared debug shell.

Chapter-specific debug extensions are data/actions, not a parallel harness.

## Ownership law

Every recurring behavior should have one obvious owner.

When a bug appears:
1. identify whether it belongs to shared engine or chapter content/adapter;
2. fix the owner, not every consumer;
3. add the smallest regression test at that ownership boundary.

Do not patch identical symptoms independently in multiple chapters.

## Save/backend safety

Backend-authoritative:
- quest lifecycle;
- rewards;
- wallet;
- backend-earned progression/work evidence.

Local chapter state:
- presented/consumed Story history;
- chapter-local world/presentation state;
- migration-compatible local runtime state.

Local storage must not fabricate remote truth.

## What remains intentionally local

Local code is valid when it expresses:
- unique chapter story;
- unique project content;
- map/art/collisions;
- area movement strategy;
- chapter-specific gating/reactions;
- unique interactions.

The architecture is not a “zero local code” project.

## Verified completion

Runtime 1.1 items 1–10 are closed.

Verified runtime code checkpoint:
- `98e8950c227cbf215ccab91b885fb3b03b9c2ae1`
- CI #2388 SUCCESS
- Runtime Browser Closeout #12 SUCCESS

Automated/browser proof includes legacy alpha regression plus Runtime 1.1 Story/HUD, world/input, Story Purchase, Act 2 → Act 3 transition, reload persistence and empty Act 3 debug/production skeleton.

## Remaining acceptance

Only physical iPhone update-in-place acceptance remains.

Preserve existing save/backend. Do not reset/reinstall just to simplify testing.

After that gate is closed, Act 3 gameplay can begin using this architecture.

## Act 3 implementation guardrail

When implementing ordinary Act 3 beats, construction projects, quest-count gates, Story moments or registered purchases, the expected work is **content/config plus narrow adapters** on the shared Runtime 1.1 engine.

If a normal beat or normal building/project requires new chapter-local engine plumbing, do **not** simply implement the special case. Stop and determine why the shared engine cannot express it. If the behavior is genuinely reusable, fix or extend the shared owner and add the smallest regression test at that ownership boundary. Only truly unique gameplay belongs in chapter-specific engine code.

This rule exists specifically to prevent Act 3 from recreating the same beat-specific and project-specific bug surface that Runtime 1.1 was built to eliminate.

## Stop-the-line engine rule

During Act 3 and every later chapter, missing shared-engine capability has priority over chapter progress.

If implementation reveals that an ordinary beat, project, quest gate, purchase, transition, persistence flow, backend reconciliation, world interaction, Story flow, UI/runtime behavior or debug need cannot be expressed cleanly through Runtime 1.1:

1. **Say so immediately.** Do not hide the gap behind a chapter-local workaround.
2. **Stop chapter implementation at that boundary.**
3. Decide whether the behavior is genuinely unique gameplay or a missing reusable engine capability.
4. If reusable, fix/extend the shared engine first and add the smallest regression test that owns the contract.
5. Re-run the relevant verification gates.
6. Resume chapter content only after the engine gap is closed and verified.

This rule applies to Act 3 and all later acts. Shipping chapter progress is never more important than preserving one shared engine.

