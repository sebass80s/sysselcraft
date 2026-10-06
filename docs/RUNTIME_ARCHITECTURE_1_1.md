# Runtime Architecture 1.1

## Purpose

Runtime Architecture 1.1 finishes the architectural goal that Runtime 1.0 only partially reached:

> Future SysselCraft acts should be authored primarily as chapter/content/world data on top of shared runtime engines, not as copied `ActXRuntime` implementations.

Runtime 1.0 established the shared lower-level primitives. Runtime 1.1 moves chapter-level orchestration onto those primitives.

This is **not** permission for a broad rewrite. Every extraction must preserve current Act 1 / Act 2 behavior, land in small verified slices and remain compatible with existing saves.

## Starting point

Already canonical/shared from Runtime 1.0:

- Story Engine / StoryRunner / Story Registry / Story History;
- Game UI Shell;
- Interaction contract, priority, markers and world-input authority;
- camera, viewport and dynamic-depth primitives;
- sequential Save/Migration Engine;
- authoritative progression delta;
- shared progress-gate primitive;
- compact dialogue presentation;
- backend authority for wallet, quest progression and owned story-item flags.

Still substantially chapter-specific:

- chapter unlock / entry / resume / completion orchestration;
- chapter runtime shell responsibilities concentrated in `Act2Runtime.tsx`;
- project/contribution state machine in `act2RuntimeState.ts`;
- story-purchase handoff/catalog behavior;
- chapter navigation and next-chapter routing.

## Architectural target

A future Act 3 should not begin by copying `Act2Runtime.tsx` or creating parallel chapter-specific engine files.

The target layering is:

```
SysselCraft Runtime
  Chapter Engine
    chapter lifecycle
    chapter registry/navigation
    runtime shell / overlay arbitration
  Progression Engine
    authoritative quest delta
    configurable project/progress tracks
    gates / completion reactions
  Purchase Flow
    generic story purchase metadata
    shop handoff / failed-purchase escape / successful resume
  Story Engine
  Interaction Engine
  Save/Migration Engine
  World primitives

Chapter content
  Act 1 definitions/content
  Act 2 definitions/content
  future Act 3 definitions/content

Area/world adapters
  Village
  Act 2 Lake
  future Act 3 world
```


## Runtime 1.1 product law: the fuel principle

Runtime 1.1 is not complete merely because generic helpers exist or because Act 2 can be expressed through shared primitives.

The product goal is that Act 3, Act 4, Act 5, Act 6 and later chapters are primarily **new content on top of a finished engine**.

A new chapter should bring the equivalent of fuel:
- authored story, dialogue, beats and assets;
- chapter-specific characters, locations and world data;
- chapter-specific project names, prerequisites and content configuration;
- genuinely new mechanics that do not already exist in the game.

A new chapter should **not** rebuild the car. It should not need its own implementations of established cross-chapter behavior such as:
- Story UI, typography, dialogue cards, buttons or fullscreen overlays;
- HUD visibility, z-index, input blocking or pointer/touch arbitration;
- chapter lifecycle, entry, completion, end-card or next-chapter routing;
- progression consumption, backlog, gates, save/restart continuity or completion semantics;
- story purchases, shop handoff, insufficient-funds escape or successful resume;
- standard naming/input behavior when the interaction pattern already exists;
- common save/migration behavior;
- common debug/acceptance hooks for established runtime behavior.

Historical Act 2 regressions define the failure mode this architecture must prevent: a future chapter must not accidentally acquire different fonts, different Story UI behavior, unclickable Continue buttons, incompatible shop items, incorrect HUD layering, divergent resume logic or other chapter-local versions of systems that already exist.

### Readiness test

Before Runtime 1.1 may be declared complete for future chapter development, perform an **empty-next-chapter test**:

> What code must be written to create a minimal new chapter using only new content and chapter/world configuration?

Any required new code that reproduces an already-established game behavior is evidence of missing engine ownership and remains Runtime 1.1 work.

The desired Act 3 shape is therefore:
- thin chapter definition/configuration;
- content/story data;
- world/area adapter or data for genuinely chapter-specific geography/behavior;
- optional adapters for genuinely unique mechanics;
- shared runtime engines for everything already solved.

This principle overrides a narrower interpretation of "code-complete". CI green and successful extraction of helpers are necessary, but not sufficient.

## Runtime 1.1 slices

### 1. Chapter Lifecycle

Extract proven shared lifecycle semantics:

- chapter unlocked by prior chapter completion;
- chapter-at-start detection;
- chapter-complete / end-card-pending presentation;
- lifecycle-derived overlay visibility.

Migrate current Act 1 -> Act 2 and Act 2 card logic to the shared primitive with parity tests.

### 2. Chapter Registry and Navigation

Create canonical chapter definitions for route, predecessor, unlock/completion adapters and next chapter.

Remove scattered chapter route literals where safe.

Do not invent Act 3 content. The registry must be useful with the chapters that exist now.

### 3. Chapter Runtime Shell

Separate generic runtime orchestration from Act 2 content:

- boot/access state;
- chapter intro/end card shell;
- story/history blocking;
- world-input arbitration;
- common route/resume boundaries.

Act 2-specific project logic, story beats and Lake world remain adapters/data.

### 4. Progression / Project Engine

Extract only proven generic mechanics from Act 2:

- selected progress track/project;
- authoritative contribution delta;
- configurable target count and stage thresholds;
- consumed contribution IDs;
- gate checks;
- completion reactions.

Act 2's 16 contributions, 4 stages, project names and ordering remain configuration, not global rules.

### 5. Shared Story Purchase Flow

Promote the proven Act 2 pattern into a shared runtime flow before future chapter-specific copies exist.

Required invariant:

- successful required purchase -> resume blocked story/project;
- failed or insufficient-funds purchase -> remain free in the playable world/shop context;
- never force a story -> shop -> story -> shop loop;
- backend Story Shop / Supabase remains transaction, wallet and ownership authority.

### 6. Engine-level Regression Harness

Add pure/runtime contract tests that prove:

- locked chapters cannot enter or mutate entry state;
- unlocked chapters enter/resume correctly;
- progress uses authoritative quest delta exactly once;
- gates block without consuming progression;
- failed purchases never force resume;
- successful purchases resume the right chapter context;
- completion/finale/end-card semantics survive restart;
- chapter completion can unlock the next registered chapter.

## Intentionally chapter/area-specific

Do **not** generalize merely for symmetry:

- authored story/dialogue/beats/images;
- NPC cast and chapter-specific character behavior;
- world maps and placements;
- collision geometry;
- Village A* versus Lake direct movement;
- shoreline/water detection;
- movement feel;
- dog-follow tuning;
- touch/WebView fallback adapters;
- chapter-specific rules that have no second real use.

These remain acceptance-sensitive and may only be converged with concrete evidence and appropriate browser/physical-device acceptance.

## Save and backend safety

- existing saved shapes remain compatible throughout Runtime 1.1;
- do not rename/remove persisted fields merely to make abstractions prettier;
- adapters may map legacy/current chapter state into shared engine contracts;
- migrations convert historical shapes only;
- normalizers enforce current invariants;
- backend owns wallet, quest claims, progression evidence and story-item ownership.

## Definition of done before Act 3

Runtime 1.1 is ready for Act 3 when:

1. Act 2 no longer owns generic chapter lifecycle/navigation behavior;
2. a chapter runtime shell can host current Act 2 without behavioral drift;
3. project progression mechanics are configurable rather than hard-wired to Act 2 implementation;
4. story purchases use shared flow semantics;
5. engine-level regression tests are green;
6. existing Act 1 / Act 2 save, backend and physical iPhone behavior remain accepted;
7. starting Act 3 does not require copying `Act2Runtime.tsx` or `act2Purchase...` engine logic.

## Working rule

Small slice -> parity/contract test -> implementation -> full `npm run verify` -> document verified checkpoint.

Repo reality always wins over this roadmap.

## Verified checkpoint: Chapter Lifecycle slice

Verified code HEAD: `e5198656c212e23c166b51a116538e52c0ed215e`

GitHub Actions: **#1973 SUCCESS** on that exact SHA.

Implemented:

- new shared primitive: `src/runtime/chapter/chapterLifecycle.ts`;
- `chapterUnlocked()` now owns predecessor-end-card unlock semantics;
- `chapterAtStart()` owns fresh chapter-entry detection;
- `chapterEndCardPending()` owns complete-but-unacknowledged end-card semantics;
- `chapterCardVisible()` owns chapter intro/end-card presentation visibility;
- Village consumes shared unlock semantics for the path to Act 2;
- Act 2 consumes shared unlock, fresh-entry and chapter-card semantics;
- `scripts/test-chapter-lifecycle.mjs` locks the engine contract and current consumers;
- stale source-shape assertions in Act 1/Act 2 regression tests were updated to assert the shared engine contract rather than the retired inline boolean expression.

No persisted save shape changed.
No backend authority changed.
No collision, movement, dog-follow, pointer/touch or WebView behavior changed.

## Verified checkpoint: Chapter Registry + Navigation slice

Verified code HEAD: `1c65a04440de5631f53e1a58767060ece9b7b8a0`

GitHub Actions: **#1984 SUCCESS** on that exact SHA.

Implemented:

- new canonical registry: `src/runtime/chapter/chapterRegistry.ts`;
- current registered chapters are `act1` and `act2`;
- the registry owns current route, predecessor and next-chapter relationships;
- Village -> Act 2 navigation consumes `chapterRoute("act2")`;
- Act 2 resume cleanup consumes the registered Act 2 route;
- Act 2 shop handoff/resume derives Village/Act 2 base routes from the registry;
- `scripts/test-chapter-registry.mjs` verifies registry topology and current consumers;
- runtime parity harness now injects the registry dependency when testing purchase handoff.

The registry contains no speculative Act 3 entry. Act 3 must only be registered when a real route/chapter exists.

## Verified checkpoint: Shared Story Purchase Flow slice

Verified code HEAD: `6a162a7e51c10d317517b32b3b8b864071a4d94e`

GitHub Actions: **#1993 SUCCESS** on that exact SHA.

Implemented:

- new shared runtime primitive: `src/runtime/purchase/storyPurchaseFlow.ts`;
- `purchaseShortfall()` owns normalized price-vs-balance shortfall calculation;
- `resolveStoryPurchaseExit()` owns the global required-purchase exit invariant;
- an unowned/failed required purchase resolves to `stay`, never forced story resume;
- an owned required purchase resolves to `resume` with its caller-owned target;
- Village/Act 2 now consumes these semantics when closing Mira's contextual story shop;
- `scripts/test-story-purchase-flow.mjs` locks the insufficient-funds loop invariant;
- existing Act 2 regression contracts now assert shared purchase-flow usage rather than the retired local `if (purchaseOwned)` implementation.

Backend Story Shop / Supabase remains authoritative for purchase execution, wallet debit and ownership flags. The runtime flow only decides presentation/navigation after authoritative ownership state is known.

## Verified checkpoint: Configurable Progress Track slice

Verified code HEAD: `337be0a5eb3239fda114fbd26efe5bf7d92a65b4`

GitHub Actions: **#2007 SUCCESS** on that exact SHA.

Implemented and verified:

- new shared progression primitive: `src/runtime/progression/progressTrack.ts`;
- target contribution count is configuration, not an Act 2 engine constant;
- visual-stage thresholds are configuration, not globally hard-coded;
- canonical contribution beat IDs are derived through the shared track definition;
- `normalizeProgressTrack()` owns generic contribution-count / stage / completion normalization;
- `nextProgressTrackStep()` owns generic next-step derivation;
- Act 2 now consumes the shared progress-track primitive from `act2RuntimeState.ts`;
- Act 2 retains its authored configuration: 16 contributions, four visible stages, project names and project ordering;
- `scripts/test-progress-track.mjs` proves parity for all 0..16 Act 2 contribution counts;
- all manual Act 2 state test harnesses now load the real shared progress-track dependency.

The extraction did not change persisted Act 2 save shape, backend progression authority, story gates, collision, movement, dog-follow, pointer/touch or WebView behavior.

This closes the generic contribution-count / stage-normalization part of Runtime 1.1 Progression / Project Engine. Selection policy, chapter-specific project prerequisites and authored completion reactions remain chapter configuration/domain behavior unless a further proven common primitive is identified.

## Verified checkpoint: Chapter Runtime Shell access slice

Verified code HEAD: `387a79021ab46bfc3fab5b50dc718edd17a0168e`

GitHub Actions: **#2014 SUCCESS** on that exact SHA.

Implemented:

- new shared chapter shell primitive: `src/runtime/chapter/chapterRuntimeShell.ts`;
- `chapterBootMayLoad()` owns the pre-load shipping boundary so a disabled chapter route cannot accidentally establish state/baselines;
- `deriveChapterRuntimeShell()` owns the generic runtime status: `loading`, `shipping-locked`, `progression-locked` or `active`;
- Act 2 boot now consumes the shared pre-load boundary;
- Act 2 early route/render state now consumes the shared shell status rather than duplicate local lock branches;
- locked-route return navigation uses the canonical chapter registry;
- `scripts/test-chapter-runtime-shell.mjs` verifies debug bypass, shipping lock, progression lock, loading precedence and the current Act 2 consumer.

This slice does not move Act 2 story/project content into the shell. It establishes the generic chapter boot/access boundary only.

No persisted save shape, backend state, collision, movement, dog-follow, pointer/touch or WebView behavior changed.

## Verified checkpoint: Chapter Runtime Shell overlay arbitration slice

Verified code HEAD: `3ef18f05d4c2d79ca0efcb03febc5f7a89c27eb4`

GitHub Actions: **#2027 SUCCESS** on that exact SHA.

Implemented:

- `deriveChapterRuntimeOverlay()` in `src/runtime/chapter/chapterRuntimeShell.ts` now owns generic overlay consequences:
  - `blockingOverlayVisible`;
  - `worldInputEnabled`;
- new Act 2 chapter adapter `src/game/act2RuntimeAdapter.ts` owns Act 2-specific blocker/domain decisions:
  - opening/bicycle/Alve intro;
  - project chooser;
  - authored completion reaction;
  - purchase gates;
  - motorboat naming;
  - finale;
  - contribution turn-in;
  - Cabin revisit;
  - history/replay;
- `Act2Runtime.tsx` no longer keeps a second independent `worldBlocked` calculation;
- Phaser lake input consumes `runtimeOverlay.worldInputEnabled`;
- `GameUiShell` consumes `runtimeOverlay.blockingOverlayVisible`;
- Act 2 HUD routes back to Act 1 through `chapterRoute("act1")`, including the adult-mode handoff;
- existing source-shape tests were updated to assert the new ownership boundaries instead of retired inline blocker expressions.

Architecture boundary:
- chapter adapters decide **what** chapter-specific situations are blocking;
- Chapter Runtime Shell decides **what blocking means** for shared world/UI behavior.

No persisted save shape, backend authority, collision, movement, dog-follow, pointer/touch or WebView behavior changed.

## Verified checkpoint: Chapter Runtime Boundary presentation slice

Verified code HEAD: `cd0e72e21e09fef52dbf2fced4b6debffd1b5c8e`

GitHub Actions: **#2033 SUCCESS** on that exact SHA.

Implemented:

- new shared React boundary: `src/runtime/chapter/ChapterRuntimeBoundary.tsx`;
- loading, shipping-locked and progression-locked chapter presentation now renders through one shared boundary;
- Act 2 no longer owns duplicate loading/locked page markup;
- return navigation from a locked chapter uses the canonical chapter registry;
- `scripts/test-chapter-runtime-shell.mjs` now verifies that Act 2 consumes the shared boundary.

The boundary is presentation-only. Access decisions remain owned by the pure `chapterRuntimeShell.ts` engine; chapter-specific progression rules remain adapters.

No save shape, backend authority, movement, collision, dog-follow, touch or WebView behavior changed.

## Verified checkpoint: Registered chapter transition + authoritative progress track

Verified code HEAD: `e9d075a2fc9c533411c021ce090b2477c1a83ae1`

GitHub Actions: **#2063 SUCCESS** on that exact SHA.

### Registered chapter transition

- the existing `/act3` boundary/placeholder route is now registered as the next chapter after Act 2 without introducing any Act 3 runtime;
- `nextChapterDestination()` owns the shared rule that a next chapter is available only after the current chapter is complete and its end card is acknowledged;
- Village -> Act 2 and Act 2 -> Act 3-boundary transitions consume this shared rule;
- chapter routes are resolved through the canonical registry rather than hard-coded navigation strings;
- Act 3 remains a boundary page only. No Act 3 gameplay/runtime has been implemented.

### Authoritative progress track composition

New shared primitive:
- `src/runtime/progression/authoritativeTrack.ts`.

It composes the already-canonical authoritative counter delta with configurable progress tracks:

- `pendingAuthoritativeProgressCount()` calculates unconsumed authoritative backlog from current backend count, captured baseline and already consumed local progress;
- `nextAuthoritativeProgressTrackStep()` returns exactly the next authored beat when backlog exists;
- a chapter/story gate blocks presentation without consuming backlog;
- resolving the gate resumes at the same next unconsumed beat;
- large backend backlog never skips authored contribution beats.

Act 2 now consumes this shared primitive for backend quest progression -> restoration contribution presentation.

The extraction preserved:
- existing Act 2 persisted save shape;
- 16-contribution / 4-stage Act 2 configuration;
- backend ownership of progression evidence;
- authored story-gate thresholds;
- all movement/collision/touch behavior.

The full existing Act 2 runtime, full-flow, closeout, Alve and runtime-parity harnesses were updated to load the real shared engine dependency rather than mock or duplicate it.

## Verified checkpoint: Shared Story Purchase Definition slice

Verified code HEAD: `49b395f5f4150bf72981869164ee4d4594c4abb1`

GitHub Actions: **#2076 SUCCESS** on that exact SHA.

Implemented:

- `src/runtime/purchase/storyPurchaseFlow.ts` now also owns the generic `StoryPurchaseDefinition` contract;
- shared purchase metadata covers stable purchase id, target/context, currency, price and presentation copy;
- Act 2's three story purchases are now chapter data typed through the shared contract;
- Act 2 retains its authored ids, targets, prices and presentation copy;
- Village and Act 2 consume the shared presentation shape;
- backend Story Shop / Supabase remains authoritative for actual transaction execution, wallet debit and owned flags;
- `scripts/test-story-purchase-flow.mjs` verifies both generic purchase metadata and the three current Act 2 definitions;
- Runtime parity remains green against accepted Act 2 prices/copy.

The Act 2 purchase catalog remains intentionally chapter-owned content. What is no longer Act 2-owned is the purchase-definition schema and post-purchase navigation semantics.

No persisted save shape changed.
No backend transaction behavior changed.
No movement, collision, dog-follow, pointer/touch or WebView behavior changed.

## Runtime Architecture 1.1 code-complete checkpoint

Verified code HEAD before documentation closeout: `c951702512e0794997716c56983ef05893d81120`

GitHub Actions: **#2084 SUCCESS** on that exact SHA.

### Final shared purchase-handoff slice

New canonical primitive:
- `src/runtime/purchase/storyPurchaseHandoff.ts`.

It owns:
- whitelist parsing of story-purchase targets;
- chapter-registry based shop-route construction;
- chapter-registry based resume-route construction;
- URL encoding of handoff query keys/targets.

`src/game/act2PurchaseHandoff.ts` is now a thin Act 2 adapter only:
- allowed Act 2 targets;
- Act 1 as shop host;
- `act2-purchase` as current query key;
- Act 2 as resume chapter.

Future chapters must reuse the shared handoff primitive rather than introduce copied `actXPurchaseHandoff` mechanics.

### Runtime 1.1 code status

The planned engine layers are now present and consumed by current gameplay:

- Chapter Lifecycle;
- Chapter Registry / next-chapter navigation;
- Chapter Runtime Shell;
- shared Chapter Runtime Boundary presentation;
- configurable Progress Track;
- Authoritative Progress Track composition;
- shared progress gates;
- shared Story Purchase Flow semantics;
- shared Story Purchase Definition metadata;
- shared Story Purchase Handoff;
- Story Engine / History / UI Shell / Interaction / Save-Migration foundations from Runtime 1.0;
- Act 2 adapters/data sitting above the shared engine.

The final source audit found no remaining clear generic chapter-engine responsibility that should be extracted from Act 2 before acceptance. Remaining Act 2 code is currently chapter/domain/world-specific, including:
- authored story and dialogue;
- project names/order/prerequisites;
- exact purchase gate thresholds;
- Alve behavior;
- completion reactions;
- Lake world/render/collision/movement details;
- debug-lab route;
- Act 2-specific save compatibility fields.

Do not continue extracting merely to reduce filenames containing `Act2`.

### Acceptance status

**Runtime 1.1 is code-complete, not yet acceptance-complete.**

Before beginning real Act 3 runtime work:
1. browser/preview interaction smoke on the exact 1.1 checkpoint;
2. physical iPhone update-in-place using the preserved save;
3. verify Village movement/touch/pathfinding, Lake movement/collision, dog follow, overlays/input blocking, Linus naming/input, chapter transition, purchase insufficient-funds escape, successful purchase resume, restart/save continuity and Act 2 -> Act 3 boundary;
4. do not reset Adam's save/backend for convenience.

No persisted save schema was changed by the final purchase-definition/handoff slices.
Backend/Supabase remains authoritative for transactions, wallet and owned story-item flags.
No collision, movement, dog-follow, pointer/touch or WebView implementation was generalized during Runtime 1.1.

## Runtime 1.1 browser / preview precheck

Runtime 1.1 browser precheck was performed against Vercel preview deployment:

- deployment: `dpl_AuSxbCsnocZ8w2KXKqJMmGpfJUrk`;
- URL: `sysselcraft-n70l21j43-yourmovegame.vercel.app`;
- Vercel commit SHA: `9a4e168b68b08f1eb0a45c4969d2acaf7f0081af`;
- that documentation commit sits directly above verified Runtime 1.1 code checkpoint `c951702512e0794997716c56983ef05893d81120`.

Verified non-destructive route responses:
- `/`: HTTP 200, Village/HUD shell renders;
- `/act2`: HTTP 200, Act 2 loading shell renders;
- `/act3`: HTTP 200, chapter-boundary placeholder renders;
- `/pair`: HTTP 200, child pairing surface renders.

Deployment-specific Vercel runtime-log check for error/warning level over the available recent 30-minute window returned no matching logs.

The aggregated runtime-error endpoint timed out, so no stronger claim is made from that endpoint. The deployment-specific log query succeeded.

This is a server/browser precheck only. It does **not** prove touch, WebView, movement, collision, dog-follow, naming/input or update-in-place save behavior.

Remaining Runtime 1.1 acceptance gate:
- physical iPhone update-in-place using the preserved child save/backend state.

## Handover checkpoint — Runtime Architecture 1.1 / 2026-10-06

### Verified repository reality before handover

Active branch:
- `nova/runtime-architecture-v1`

Latest verified branch HEAD before this handover documentation:
- `6c402869784e1e96409210cec4239223038e54ea`
- GitHub Actions **#2091 SUCCESS**

Verified Runtime 1.1 code-complete checkpoint:
- `c951702512e0794997716c56983ef05893d81120`
- GitHub Actions **#2084 SUCCESS**

Commits after that code checkpoint are documentation / browser-precheck closeout. Do not infer a new code delta from the later docs HEAD.

### Runtime 1.1 status

Runtime Architecture 1.1 is **code-complete**.

Shared engine layers now consumed by current gameplay:
- Chapter Lifecycle;
- Chapter Registry and next-chapter navigation;
- Chapter Runtime Shell;
- shared Chapter Runtime Boundary presentation;
- configurable Progress Track;
- Authoritative Progress Track composition;
- shared progress gates;
- shared Story Purchase Flow semantics;
- shared Story Purchase Definition contract;
- shared Story Purchase Handoff;
- Runtime 1.0 Story / History / UI Shell / Interaction / Save-Migration foundations.

Act 2 now sits above these layers primarily as chapter/domain/world-specific data and adapters.

The final audit found no remaining clear generic chapter-engine responsibility that should be extracted before acceptance. Do **not** continue refactoring merely because a file/type still contains `Act2`.

### What intentionally remains chapter-specific

Keep local unless a real future consumer proves otherwise:
- authored Act 2 story/dialogue/beats/assets;
- Act 2 project names/order/prerequisites;
- exact purchase-gate thresholds;
- Alve-specific behavior;
- authored completion reactions;
- Lake world placement/rendering;
- collision, shoreline/water detection and direct movement;
- debug lab;
- Act 2 save-compatibility fields.

Physical-input-sensitive systems remain intentionally unconverged:
- Village A* vs Lake direct movement;
- collision/pathfinding;
- dog follow;
- pointer/touch/WebView fallbacks;
- Linus naming/input DOM path.

### Browser / preview status

A non-destructive preview precheck has already been performed against:
- deployment `dpl_AuSxbCsnocZ8w2KXKqJMmGpfJUrk`
- `sysselcraft-n70l21j43-yourmovegame.vercel.app`

Verified HTTP 200 / expected shell:
- `/`
- `/act2`
- `/act3`
- `/pair`

No matching deployment-specific error/warning logs were found in the checked window.

This is **not** physical interaction acceptance.

### Remaining acceptance gate before real Act 3 runtime

Next meaningful step is a physical iPhone update-in-place acceptance pass using the preserved child save/backend state.

Minimum acceptance:
1. existing save/world/pairing loads without reset;
2. Village movement, A*, collision and touch still feel correct;
3. Lake movement, shoreline/collision and touch still work;
4. dog-follow remains stable;
5. Story/dialogue overlays block and release world input correctly;
6. Linus naming/input still handles autofocus, keyboard, Enter, validation and reveal;
7. Village <-> Act 2 transitions work;
8. Act 2 purchase insufficient-funds case exits safely to the Village instead of looping;
9. successful Act 2 purchase resumes the correct project;
10. force-quit/relaunch preserves progression, wallet, world and chapter state;
11. Act 2 completion exposes the registered `/act3` boundary without any Act 3 gameplay being implied.

Do **not** reset/reinstall or mutate Adam's backend/save merely to simplify acceptance.

### Adam branch / live bug fix status

Separate branch:
- `nova/local-construction-snapshot`

Latest verified HEAD:
- `9af8821a1adc177b33c969b5e9a45fa7ff2d3bcd`
- GitHub Actions **#1959 SUCCESS**

That branch contains the fix for the Act 2 required-purchase infinite loop:
- failed/insufficient-funds purchase does not force return to the blocked Act 2 project;
- successful owned purchase may resume the project.

Do not assume Adam's physical phone has been updated merely because the branch is green.

### Act 3 status

`/act3` is only a registered boundary/placeholder.
There is **no Act 3 gameplay/runtime** yet.

Do not start Act 3 by copying:
- `Act2Runtime.tsx`;
- `act2Purchase...` mechanics;
- Act 2 project-state machinery wholesale.

Future Act 3 should consume the shared Runtime 1.1 engine and add chapter-specific data/adapters only where the new design actually needs them.

### Act 3 image-production warning

Character-sheet assets exist under:
- `public/assets/village/character-sheets/`

However, no reliable workflow has been verified that automatically takes repo-hosted sheets and injects them as actual reference images into ChatGPT image generation without manual attachment/session handling.

The attempted external API/image-batch route is not the desired production workflow and should not be represented as solved.

Current honest status:
- recurring-character image consistency is still an Act 3 production blocker;
- do not claim a repo-to-chat reference bridge exists;
- do not promise that a generated batch used canonical sheets unless those sheets were actually supplied to the image-generation call.

### Working rule for the next instance

Repo reality wins over this handover.

Before any change:
1. verify branch + HEAD;
2. verify latest CI on the exact HEAD;
3. read `docs/RUNTIME_ARCHITECTURE_1_1.md`, `docs/TECHNICAL_HANDOFF.md`, `docs/NOVA_HANDOFF_MANIFEST.md` and `docs/RUNTIME_ARCHITECTURE_ROADMAP.md`;
4. do not invent more Runtime 1.1 extraction work before physical acceptance;
5. keep changes small, testable and checkpointed.



## Fuel-principle audit correction

The earlier Runtime 1.1 **code-complete** checkpoint described completion of the narrower extraction plan. It is not the final product-readiness claim.

The canonical fuel-principle audit is:
- `docs/RUNTIME_1_1_FUEL_AUDIT.md`

That audit found multiple remaining engine responsibilities that a future Act 3 would otherwise have to reimplement, including chapter runtime orchestration, end-to-end progression consumption, project/completion mechanics, chapter-local Story UI/CSS drift, standard naming/input, story-shop integration, chapter persistence hosting, backend sync, world/area runtime hosting and debug plumbing.

Current canonical status:

**Runtime 1.1 is fuel-principle incomplete.**

Do not begin substantive Act 3 runtime implementation until the P0 blockers in the audit are closed and an empty-next-chapter proof demonstrates that a new chapter can be built primarily from content/configuration/adapters.


## Runtime 1.1 hard Definition of Done

Runtime 1.1 is **NOT DONE** until all of the following are true:

1. A minimal empty Act 3 can be created primarily from chapter registration, content/story data, progression/project definitions, optional purchase definitions, and world/area data/adapters.
2. The empty Act 3 does **not** need to copy or reimplement established runtime behavior from Act 1 or Act 2.
3. Generic chapter boot, access, lifecycle, completion, end-card and next-chapter orchestration are shared engine responsibilities.
4. Standard Story UI, typography, buttons, overflow, safe areas, z-index and input-blocking behavior are shared and cannot drift by chapter through chapter-named CSS.
5. Standard linear story sequencing and replay/history presentation are shared engine behavior unless a beat is genuinely unique.
6. Generic progression mechanics are fully configurable end-to-end, including selection, authoritative backlog consumption, idempotent beat consumption, target clamping, completion, gates and once-only completion reactions. No hidden Act 2 constants may remain in generic progression behavior.
7. Standard naming/text-input behavior is shared, including autofocus, mobile keyboard semantics, Enter submit, validation and save/busy behavior.
8. Story purchases are integrated end-to-end through shared definitions and shop/runtime plumbing so a new chapter item is normally registration/data, not new Village UI branching.
9. Child-scoped chapter persistence, load/save/clear, normalization and migration hosting are shared infrastructure. Chapter-specific persisted fields remain chapter data.
10. Backend wallet/progression/ownership synchronization uses shared authority/reconciliation infrastructure rather than chapter-local polling loops.
11. World/Area runtime hosting is shared enough that a new chapter does not need a fresh `createActX...Game.ts` implementation for common scene/player/dog/input/camera/interaction lifecycle. Movement/collision/navigation strategy may remain pluggable area-specific adapters.
12. Common debug/acceptance tooling is shared and chapter definitions/fixtures extend it instead of recreating hidden launchers and reset harnesses.
13. The empty-next-chapter proof is committed and regression-covered. If building that proof requires copied engine logic, Runtime 1.1 remains open.
14. Full automated verification is green after all of the above.

### Physical acceptance sequencing rule

Physical iPhone acceptance is **not** the implementation-completion gate and must not be proposed as the next step while items 1–14 above remain open.

The required sequence is:

`finish Runtime 1.1 engine -> empty Act 3 proof -> full automated/browser verification -> physical iPhone update-in-place acceptance`.

The iPhone pass is the **final regression/acceptance gate after implementation is complete**, not a substitute for missing engine work.

Do not reset or reinstall the preserved child save/backend merely to simplify the final physical acceptance.


## Verified checkpoint: Shared Chapter Runtime Host

Verified code HEAD: `c926c7a518e6b40b07acd3f7cf8285af1150962e`

GitHub Actions: **#2121 SUCCESS** on that exact SHA.

Runtime 1.1 backlog item 1 is closed at its intended engine boundary.

Implemented:
- new generic `useChapterRuntimeHost` owns chapter boot cancellation, shipping-lock side-effect boundary, ready/access state, canonical shell status, initial runtime state/context hydration, chapter-intro visibility and optional canonical route replacement;
- Act 2 consumes the shared host through an Act 2 boot adapter instead of owning its own ready/access/shell lifecycle;
- new generic `useChapterWorldHost` owns chapter-world mount, latest-snapshot sync, cancellation and destroy lifecycle;
- Act 2 Lake now supplies only its area-specific mount/sync/destroy adapter and no longer owns a parallel world-instance lifecycle;
- the same shared overlay result drives both GameUiShell blocking and Lake world-input authority through the world-host snapshot;
- stale source-shape tests were migrated to assert the shared host contracts rather than retired Act 2-local effects.

Deliberately **not** claimed by this checkpoint:
- backend polling/reconciliation remains Runtime 1.1 backlog item 10;
- chapter persistence hosting remains backlog item 9;
- progression/project engine completion remains item 2;
- Story sequencing/UI/history/title/end-card/input remain later Story-engine items;
- purchase/shop integration remains item 8;
- full World/Area Engine remains item 11. The shared world lifecycle host here only removes common mount/sync/destroy ownership from the chapter component;
- debug harness remains item 12.

Fuel-principle result: a future chapter no longer needs to recreate generic boot/access/status or React-to-world instance lifecycle. It still must not be started until the remaining hard DoD items are closed.


## Verified checkpoint: Generic Progression / Project Engine

Verified code HEAD: `4bfec68e695b15c3925c077b62a66db27787702b`

GitHub Actions: **#2149 SUCCESS** on that exact SHA.

Runtime 1.1 backlog item 2 is closed, including the generic selection/completion-reaction mechanics that the fuel audit had previously listed separately.

Implemented:
- `consumeProgressTrackStep()` now owns sequential beat consumption, idempotency, configured target clamping, stage derivation, canonical consumed beat IDs and completion;
- new `projectProgressEngine.ts` owns generic project selection, prerequisite enforcement, active-project locking, auto-deselect on completion, total consumed project progress and exactly-once completion reactions;
- the project engine also composes authoritative backend backlog with the selected configured track through `pendingAuthoritativeProjectProgressCount()` and `nextAuthoritativeProjectProgressStep()`;
- Act 2 now supplies project IDs, target/stage definitions, Motorboat prerequisites, story-gate blocking and the authored Dock completion-reaction ID as chapter configuration/adapters;
- Act 2 no longer performs local contribution increment/clamp/completion arithmetic, no longer accepts a caller-provided visible stage, and no longer hard-codes completion-reaction selection in its UI adapter;
- regression coverage includes tracks with targets **3 and 2**, prerequisites, out-of-order rejection, duplicate/idempotent consumption, story-gate blocking, authoritative backlog resume and exactly-once completion reactions;
- a fuel-principle source guard prevents `Math.min(16)` / `contributions >= 16` from returning to Act 2 consumption or the generic engine.

Fuel-principle audit result:
- shared progression engine files contain **zero Act 2-specific `16` rules**;
- the only project target value `16` remains in Act 2 as `ACT2_PROJECT_TARGET = 16`, where it is authored configuration;
- a future chapter can choose different project targets, stage thresholds, prerequisites and completion reactions without implementing new project-engine mechanics.

Still deliberately outside this checkpoint:
- chapter persistence hosting remains Runtime 1.1 backlog item 9;
- Story UI/sequencing/history/title/end-card/naming remain later Story-engine work;
- Story Purchase shop integration remains item 8;
- backend polling/reconciliation host remains item 10;
- full World/Area Engine remains item 11;
- common debug harness remains item 12;
- empty Act 3 proof remains the final architectural proof before acceptance.

Current Runtime 1.1 status remains: **fuel-principle incomplete**, with backlog items 1 and 2 now closed.


## Verified checkpoint: Shared Story UI and sequencing

Verified code HEAD: `4d6fef7f89e64223a986ab164feddf48a3d388d9`

GitHub Actions: **#2200 SUCCESS** on that exact SHA.

Runtime 1.1 backlog item 3 is closed.

Implemented:
- canonical Story dialogue typography, safe-area layout, scrolling, buttons and overlay presentation are shared;
- chapter-named dialogue overrides such as `.act2-dialogue-card` are removed, including the cross-chapter Village shop handoff;
- Story presentation uses semantic variants instead of raw chapter-provided `zIndex` / `background` values;
- standard naming/text input is shared, including autofocus, mobile keyboard hints, Enter submit, trimming/validation and canonical styling;
- chapter intro and end-card presentation are shared;
- Story History panel, grouping UI and replay shell are shared and replay through the canonical Story runner;
- ordinary linear Story sequencing is shared through safe current-line, previous and advance/complete primitives;
- Act 2 opening, Alve intro, contribution dialogue, completion reactions, Cabin revisit and finale all consume the shared sequencing primitives;
- standard choice layout is shared through `StoryChoiceGroup`; Act 2 project selection supplies options, selected value, labels and domain callbacks only;
- regression guards reject chapter-local Story typography/history/choice layout and raw Story presentation controls.

Fuel-principle audit result:
- no Act 2-specific dialogue typography or history presentation remains;
- no raw Story `zIndex`, background or chapter-specific dialogue class remains in Act 2 Story surfaces;
- no standard project-choice inline layout remains in Act 2;
- remaining line-index `+1` checks in Act 2 are presentation-only lookahead for labels/image reveal/final-line display, not state navigation or sequencing mechanics;
- chapter-specific authored copy, image choices, beat boundaries, reveal semantics and domain completion callbacks remain valid content/adapters.

Current Runtime 1.1 status remains: **fuel-principle incomplete**, with backlog items 1, 2 and 3 closed.


## Verified checkpoint: Generic Story Purchase integration

Verified code HEAD: `13d6f99a29f948b64dc74b2f3b214456cb5e7d74`

GitHub Actions: **#2248 SUCCESS** on that exact SHA.

Runtime 1.1 backlog item 4 is closed.

Implemented:
- Story Shop transport is generic through `purchaseStoryItem(itemKey)`; future chapter item ids do not require new client wrappers;
- Story Purchase definitions are content/config through the shared purchase definition contract;
- Story Purchase registry owns registered chapter purchase catalogs, handoff query keys, target parsing, stock/snapshot loading, post-purchase application, optional purchase-story progression and resume routing;
- Act 2 is registered through `ACT2_STORY_PURCHASE_REGISTRATION`; its item ids, copy, gates, world-flag mapping, success reactions and purchase-story beats remain chapter data/adapters;
- Mira loads all registered Story Purchase sources through one registered loader;
- Mira renders registered Story Purchase items generically from each registration's catalog + snapshot;
- Mira purchases through one generic Story Purchase path and delegates chapter mutation to the selected registration;
- contextual shop handoff and close/resume routing are resolved through the registry, not through Act 2 query parsing in Village;
- optional post-purchase Story Moments are resolved and advanced through the registration, including restart-safe line progress;
- insufficient-funds feedback uses the selected registered item's canonical price;
- regression tests prove a future example registration can be resolved without Mira-specific branching.

Fuel-principle audit result:
- adding a future Act 3 Story Purchase requires registering chapter data/adapter behavior, not adding `if (act3...)`, a new Mira purchase function, a new shop card, a new backend client wrapper, or a new handoff branch;
- `VillagePrototype` contains no Act 2-specific Story Purchase catalog, purchase-project parser, purchase-story beat, purchase outcome mutation or resume URL dependency;
- Act 2-specific Story Purchase logic is confined to chapter registration/catalog/adapter modules;
- ordinary non-story shop inventory (room decor, dog-home items, Act 1 bottle flow, diamond rewards) remains outside this Runtime 1.1 Story Purchase checkpoint by design.

Current Runtime 1.1 status: backlog items 1, 2, 3 and 4 are closed; fuel-principle work continues with item 5.


## Runtime 1.1 closeout handover checkpoint — 2026-10-06

Canonical handover: `docs/RUNTIME_1_1_HANDOVER_2026-10-06.md`.

Verified baseline before this documentation closeout:
- branch: `nova/runtime-architecture-v1`;
- docs baseline HEAD: `eb7df728adea783c676fe697738be62200430fc9`;
- GitHub Actions #2252: SUCCESS;
- latest verified code checkpoint for completed item 4: `13d6f99a29f948b64dc74b2f3b214456cb5e7d74`, CI #2248 SUCCESS.

Runtime 1.1 completed:
1. Shared Chapter Runtime Host ✅
2. Generic Progression / Project Engine ✅
3. Shared Story UI / sequencing / inputs / history / cards / choices ✅
4. Generic Story Purchase integration ✅

Runtime 1.1 remains OPEN. Continue in this exact order:
5. generic child-scoped chapter persistence host;
6. shared backend synchronization/reconciliation;
7. full World/Area Runtime Host beyond mount/sync/destroy;
8. common chapter debug/acceptance harness;
9. empty Act 3 skeleton proof;
10. full automated + browser verification;
11. physical iPhone update-in-place acceptance last.

Do not start Act 3 gameplay before the empty-Act3 fuel proof. Do not propose physical iPhone acceptance before engine + empty Act 3 + automated/browser closeout are complete.

Point 5 is next. The first persistence slice should audit/define the generic storage contract and ownership boundary before moving code out of `act2RuntimeState.ts`. Preserve the rules in `STATE_OWNERSHIP.md` and `SAVE_COMPATIBILITY_AUDIT.md`.
