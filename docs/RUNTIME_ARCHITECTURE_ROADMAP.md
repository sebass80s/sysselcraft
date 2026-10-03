# SysselCraft runtime architecture roadmap

**Status: HIGH PRIORITY / canonical architectural direction — updated 2026-10-03**

SysselCraft is no longer a one-act prototype. Act 3, Act 4, Act 5 and later content are expected. New acts must therefore be built on reusable engines rather than by cloning Act-specific page, Phaser, CSS, save and progression logic.

Repo reality still wins over this document. This roadmap defines migration direction and sequencing, not permission for a flag-day rewrite.

## Why this is now priority

Act 1 and Act 2 already duplicate the same runtime concerns in different places:
- dialogue and Story Moment rendering;
- fullscreen overlays, z-index, safe areas and pointer-events;
- area runtime, camera, player, dog, NPCs, hotspots and interaction radii;
- progression catch-up and authored-beat consumption;
- save normalization and legacy recovery.

Recent regressions demonstrate the cost:
- visually identical Story Moment screens used different input behavior;
- a global Story Moment pointer-events rule made an Act 2 dialogue visible but unclickable;
- older completed Clinic saves required ad-hoc compatibility handling before Act 2 entry.

Future acts must not multiply these patterns.

## Priority order

### P0 — Story Engine

Build first.

Goal: one shared runtime for standard Story Moments and dialogue beats across all acts.

Core pieces:
- StoryMoment presentation component;
- DialogueCard component;
- StoryRunner / beat sequencer;
- one CSS ownership surface for fullscreen story UI;
- typed beat definitions.

The shared Story Moment layer owns:
- image/background layer;
- tint/gradient;
- pointer-events;
- z-index;
- safe areas;
- dialogue positioning;
- speaker badge;
- body font sizing;
- buttons;
- busy/disabled behavior;
- overflow/scroll;
- default Next/Continue behavior.

Story content should normally be data, not bespoke JSX.

Special beats such as project selection, purchases, naming and custom interactive moments may supply dedicated content/actions, but should still sit inside the shared Story Moment shell where practical.

Migration sequence:
1. implement Story Engine with regression coverage;
2. migrate Act 2 standard beats first;
3. browser and physical iPhone acceptance;
4. migrate Act 1 standard Story Moments without changing story canon;
5. remove duplicated CSS/interaction rules only after both paths are proven.

Do not rewrite story text during this refactor.

### P1 — World / Area Engine

Build after Story Engine is stable.

Current discrete areas should become configurations over one shared area runtime rather than separate increasingly divergent Phaser games.

Shared engine responsibilities:
- world dimensions/background;
- camera;
- player and dog;
- touch/keyboard movement;
- pathing/collision;
- depth ordering;
- NPC world entities;
- attention markers;
- generic interactables;
- approach points and interaction radius;
- exits and area transitions;
- safe input-lock semantics.

Village, Lake and future Act areas remain discrete maps. This work does not authorize a mega-map.

Migration sequence:
1. extract generic primitives from createAct2LakeGame.ts and createVillageGame.ts;
2. make Lake run on the shared engine first because it is smaller;
3. migrate Village only after parity tests;
4. Act 3 must start on the shared engine, not a new createAct3...Game.ts fork.

### P2 — Save / Migration Engine

Build before Act 3 state expands materially.

Goal: explicit versioned migrations instead of accumulating scattered compatibility checks and booleans.

Required model:
- persisted schema version;
- deterministic normalizer;
- sequential migrations (v1 -> v2 -> v3);
- invariant repair at load;
- no story/reward duplication during migration;
- backend-authoritative ownership never fabricated locally.

Compatibility cases such as “Clinic 4/4 but old completion flag missing” belong in migration/normalization, not UI gating.

Migration functions must be pure and regression-tested.

### P3 — Progression / Gating Engine

Generalize the strongest existing Act 2 law instead of inventing a third progression pattern for Act 3.

Canonical flow:

authoritative backend evidence
→ next eligible authored beat
→ present exactly one beat
→ commit local/world consumption exactly once
→ evaluate gates
→ surface next backlog beat if eligible

The engine must support:
- establish-once progression baseline;
- authored beat IDs;
- backlog/catch-up;
- idempotent refresh;
- project/track selection;
- story gates;
- purchase gates;
- naming/custom gates;
- contribution-neutral completion reactions/finales;
- restart-safe line/beat position.

Backend Quest V2 remains authoritative for real work and rewards. The progression engine only owns presentation consumption and game-world story state.

## Systems not scheduled for wholesale rewrite

### Quest V2
Do not rewrite. It already has clear backend authority and substantial regression coverage. Adapt it to shared progression interfaces only where needed.

### Economy / story purchases
Do not create a new economy engine. Supabase RPC/state remains transaction authority. Consolidate presentation APIs only if duplication becomes material.

### Asset production
Do not block runtime architecture on an asset-manifest rewrite. A manifest can be introduced later if Act 3 asset volume justifies it.

## Continuous replacement cleanup — architectural rule

A migration is not complete while its superseded implementation remains in the active tree without a compatibility reason.

For every extracted/shared system:
- migrate a proven vertical path;
- add/adjust regression coverage for the new contract;
- delete the replaced implementation and dead presentation/debug scaffolding once parity is proven;
- remove source-shape tests tied to the discarded implementation;
- update canonical architecture/handoff docs in the same change set;
- search for obsolete symbols, flags and contradictory values before closeout;
- verify the cleaned tree in CI.

This rule exists to prevent “temporary” parallel systems from becoming permanent architecture. Git history is the archive. The working tree should describe the current product.

## Refactor safety rules

- No flag-day rewrite.
- Preserve currently accepted story canon.
- Preserve Adam's production save/backend.
- Migrate one proven vertical path at a time.
- Every extracted engine gets regression tests before deleting the old path.
- Physical iPhone acceptance remains required for input, safe-area, navigation and persistence changes.
- Do not use architecture work as an excuse to reopen accepted visual/story decisions.
- New Act 3 code must use the new shared systems once they are available.

## Immediate execution order

P0 Story Engine is established and the gameplay UI shell has been extracted. Do not redo them.

1. Keep Story Engine + `uiShellState.ts` stable and migrate remaining legacy Act 1 presentation incrementally only when useful.
2. Build the shared World / Area Engine from the proven Village/Lake primitives.
3. Introduce explicit versioned save migrations before Act 3 state grows materially.
4. Extract/generalize progression/gating only where Act 3 needs it; Quest V2 remains backend authority and is not rewritten.
5. Build the real Act 3 runtime on those shared foundations. The existing `/act3` page is only the non-persisting chapter boundary.

## Definition of success before Act 3

Act 3 should be able to add:
- a new outdoor area mostly through config;
- new story beats mostly through typed data;
- new persisted story state through a versioned schema/migration;
- new contribution tracks through the common progression/gating model;

without cloning Act 1 or Act 2 page/CSS/Phaser machinery.


## Story Engine v1 checkpoint — 2026-10-01

Story Engine v1 is now implemented as the shared presentation contract for Act 2.

V1 components:
- `src/game/storyEngine.ts` — typed presentation model + speaker parsing;
- `src/components/story/DialogueCard.tsx` — shared dialogue card and nameplate surface;
- `src/components/story/StoryMoment.tsx` — shared fullscreen shell, image/tint/input/z-index boundary;
- `src/components/story/StoryRunner.tsx` — typed standard beat runner;
- `src/components/story/StoryTranscript.tsx` — multi-line speaker-prefix parser/renderer;

Locked v1 rules:
- scene `heading` and character `speaker` are separate concepts;
- beat titles must never be used as character nameplates;
- speaker prefixes such as `Barnet:`, `Alve:`, `Henning:` are parsed centrally;
- fullscreen image, tint, pointer-events, safe dialogue shell and z-index are owned by Story Engine;
- standard beats and special beats may differ in inner controls, but share the same StoryMoment shell;
- project selection, purchase gates and naming are custom-content StoryMoments rather than parallel fullscreen implementations;
- the isolated Act 2 test lab renders through the same Story Engine presentation path as production.

Act 2 migration coverage now includes:
- opening;
- bicycle;
- Alve intro;
- project chooser;
- contribution beats;
- completion reactions;
- purchase gates;
- motorboat naming;
- finale/epilogue presentation.

Act 1 has not yet been migrated. Its existing story presentation remains valid until moved incrementally after Act 2 physical acceptance.

Story Engine v1 is the required presentation API for Act 3+; do not introduce a new act-specific Story Moment CSS/JSX stack.


## Foundation checkpoint — 2026-10-03

Completed:
- Story Engine v1 for Act 2;
- shared story-overlay suppression contract;
- pure global gameplay UI-shell authority in `src/game/uiShellState.ts`;
- Act 2 six-beat closeout and legacy-finale migration;
- explicit completed-chapter Alve presence boundary;
- read-only `/act3` transition page.

Removed as dead prototype residue:
- unused prototype debug implementation/type files and their CSS;
- prototype-era placeholder naming for the canonical runtime Alve entity;
- duplicate UI-shell source-shape assertions in unrelated Act 2 tests.

Still required before substantial Act 3 runtime expansion:
- shared World / Area Engine;
- versioned Save / Migration Engine.
