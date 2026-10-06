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

