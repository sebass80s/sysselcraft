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

### P0 — Story Engine / Registry / History

**Status: IN PROGRESS.** Shared presentation is established; Registry/History migration is underway.

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

Runtime 1.0 is being built as a clean parallel client runtime on `nova/runtime-architecture-v1`. The frozen live runtime remains the behavioral oracle.

Completed foundation pieces:
- shared Story Engine presentation;
- pure UI-shell visibility authority;
- Canonical System Registry;
- shared `GameUiShell` component skeleton;
- generic Story Registry;
- generic read-only Story History/replay contract;
- generic Interaction contract;
- stable chapter-qualified story identities;
- Act 2 Story Registry adapter;
- initial parity harness and real Act 2 History parity model.

Current execution order:
1. Finish parity proof for Act 2 Registry/History and then switch the **development runtime** History consumer to the shared engine without changing player behavior.
2. Converge Village + Act 2 onto one actual `GameUiShell`, with parity coverage before deleting legacy headers.
3. Implement the canonical marker/Interaction renderer and migrate Act 2/Lake then Village.
4. Build shared World / Area primitives once UI/story/interaction ownership is stable.
5. Introduce explicit versioned Save / Migration adapters before Act 3 state grows materially.
6. Generalize progression/gating behind shared contracts while keeping Quest V2 authoritative.
7. Port remaining necessary Act 1 surfaces to eliminate parallel systems.
8. Run automated parity + browser + physical iPhone acceptance.
9. Remove superseded legacy client runtime.
10. Only then begin substantial Act 3 runtime content.

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


## SysselCraft Runtime Architecture v1 — LOCKED 2026-10-03

The project must now be treated as **one game runtime with chapters as data**, not as a growing collection of Act-specific mini-games.

This rule exists because Act 2 repeatedly exposed the cost of local fixes: UI placement, overlays, story replay, progression, purchases and interaction behavior became correct only after multiple feature-specific patches. Future work must prefer shared contracts first and chapter data second.

### Cross-game ownership

**Game UI Shell**
- is a **single persistent game-wide shell** mounted above every playable area and chapter;
- owns the SysselCraft logo/menu, resources, Vuxenläge, Historik and Uppdrag surfaces;
- Village, Lake, Act 3 and later areas render *inside/under* this shell rather than creating their own HUD;
- Acts must not invent parallel headers, resource bars, menu buttons or layout variants;
- the shell's placement, spacing, typography, z-index, safe areas, input shielding and overlay suppression are constant across the game;
- chapter/area code may only provide shell state/configuration such as whether a global action is enabled, badge counts, or contextual status text;
- hiding global chrome for Story Moments uses one shared overlay contract and restores the exact same shell afterward;
- changing a global UI surface should require one implementation change and propagate everywhere.

**Story Engine + Story Registry**
- owns story presentation across the entire game;
- all normal beats use the same dialogue cards, nameplates, typography, navigation, image shell, safe areas, overlay/input rules and replay behavior;
- Acts register typed story data rather than implement new renderers;
- beat identity, chapter/group membership and replay/history policy must be explicit metadata.

**Story History**
- becomes a shared read-only system over the Story Registry;
- replay must never mutate progression, wallet, rewards, purchases or consumed state;
- a storyline becomes visible according to a generic history-unlock policy, normally only after the complete storyline is finished;
- today's Act 2 implementation is an interim vertical slice and is **not** the final cross-act architecture;
- before substantial Act 3 runtime work, extract Act 2 history collection/replay into the shared Story Registry/History contract so Act 3 beats inherit the feature automatically.

**Quest / Progression bridge**
- Quest V2/backend remains authoritative for real-world work and rewards;
- shared progression maps authoritative evidence to the next eligible authored beat exactly once;
- Acts provide authored tracks/gates as data rather than reimplement claim consumption;
- replay/history never participates in progression.

**Interaction System**
- owns NPC interaction markers, quest markers, hotspots, approach points, interaction radius, pointer priority and world-input locks;
- quest/NPC markers must look and behave consistently across Village, Lake and future areas;
- new Acts must configure interactions rather than clone marker/input logic.

**Chapter Runtime**
- should mostly provide configuration: map/background, entities, positions, storylines, contribution tracks, gates, exits and chapter-specific state;
- generic concepts such as "beat seen", "storyline complete", "replayable", "overlay active" and global HUD visibility must not be reinvented per Act.

**Design system**
- dialogue boxes, buttons, menus, nameplates, story navigation, markers, spacing and z-index conventions are shared components/tokens;
- visual changes should propagate globally unless a chapter has an explicit documented exception.

### Required architecture test

Before creating substantial Act 3 gameplay runtime, the codebase must satisfy this test:

> Adding a normal Act 3 story beat must not require new code for how a story beat is rendered, saved as consumed, suppressed under overlays, replayed or exposed in Historik.

Likewise:

> Adding a new questgiver must not require inventing another quest-marker implementation.

And:

> Changing the standard dialogue-card appearance must require changing one shared implementation.

### Execution order before Act 3

1. Audit remaining Act-specific ownership in Village and Act 2.
2. Define/extract shared Game UI Shell, Story Registry/History and Interaction contracts around the already accepted behavior.
3. Migrate Act 2 to those contracts without changing story or gameplay behavior.
4. Migrate only the Act 1 surfaces necessary to prevent parallel systems from surviving.
5. Keep World / Area Engine and versioned Save / Migration work aligned with the existing roadmap.
6. Only then begin substantial Act 3 runtime implementation.

Do not use this architecture work to reopen accepted Act 2 content. The physically accepted Act 2 production behavior is the reference implementation to preserve while shared systems are extracted.



### Constant-UI invariant

The player should not be able to tell from the HUD implementation whether they are in the Village, Act 2 lake, Act 3 or a later chapter. The **same Game UI Shell instance/component contract** must frame every playable world.

A chapter transition changes:
- world/map content;
- NPCs/interactables;
- available storylines and contextual actions;
- chapter-specific status/configuration.

A chapter transition must **not** change:
- SysselCraft logo/menu structure;
- resource HUD structure;
- Vuxenläge entry;
- Historik entry and behavior;
- Uppdrag entry;
- standard button styling;
- safe-area layout;
- overlay suppression semantics;
- global z-index/input ownership.

If a future Act needs a one-off HUD implementation, treat that as an architecture failure unless there is an explicit documented product exception.


## One canonical implementation per game concept — LOCKED 2026-10-03

SysselCraft must not reimplement the same game concept per chapter, area or feature.

Examples:
- a quest marker is one canonical asset + one canonical component/interaction contract;
- an NPC attention marker is one canonical asset/component;
- a dialogue box is one canonical shared component;
- a story image shell is one canonical shared component;
- a hotspot/interactable uses one shared interaction primitive;
- a purchase gate uses one shared presentation/transaction pattern;
- Historik uses one shared registry/replay system;
- global HUD/menu uses one shared Game UI Shell.

New chapters consume those primitives by configuration. They do not copy, fork or redraw them unless there is an explicit product requirement for a genuinely different concept.

### Asset rule

Reusable gameplay assets are global game assets, not Act assets.

For example, if the game has one approved quest-marker graphic, every quest marker in every chapter references that same asset. A new chapter must not add `act3-quest-marker.png`, `lake-quest-marker.png`, etc.

Chapter-specific assets should mostly be:
- backgrounds/maps;
- NPC/world art unique to that chapter;
- building/project stages;
- Story Moment stills;
- chapter-specific props that are genuinely content, not UI/system chrome.

### Engine/content boundary

The intended long-term authoring model is:

**Engine provides**
- UI shell;
- dialogue/story rendering;
- history/replay;
- quest/NPC markers;
- interaction/hotspot behavior;
- progression consumption;
- save/migration mechanics;
- purchase-gate mechanics;
- world input/collision primitives;
- z-index/safe-area/overlay semantics.

**Chapter/content provides**
- story text;
- images;
- maps/backgrounds;
- NPC definitions and positions;
- project/questline definitions;
- authored beat ordering;
- unlock/gating configuration;
- chapter-specific assets.

If adding Act 5 requires debugging the HUD, dialogue box, quest marker, replay behavior or generic input semantics again, Runtime Architecture 1.0 has failed.

Target authoring experience: adding a new chapter should feel like **fueling a proven engine**, not manufacturing another vehicle.


## Runtime Architecture 1.0 master contract — LOCKED 2026-10-03

This section consolidates the architecture decisions made after Act 2 acceptance. These are mandatory project rules. They are not suggestions, guidelines, recommendations or advice. All forward development must comply with them.

### Product model

SysselCraft is **one game runtime with chapters/content loaded into it**.

Do not think in terms of “Act 1 app”, “Act 2 app”, “Act 3 app”. A chapter changes world/content/state configuration. It does not redefine core UI, story presentation, marker behavior, replay, progression mechanics or generic interaction semantics.

### Constant global UI

The Game UI Shell is constant across the entire game.

The same shell must frame:
- Village;
- Act 2 Lake;
- Act 3;
- all later chapters/areas.

The shell owns:
- SysselCraft logo/menu;
- resources;
- Uppdrag;
- Vuxenläge;
- Historik;
- global navigation affordances;
- safe-area handling;
- button language/style;
- z-index;
- pointer/input shielding;
- overlay suppression and restoration.

Area/chapter code may only provide contextual state/configuration beneath that shell.

A chapter transition may change:
- map/world;
- NPCs/interactables;
- contextual actions;
- chapter status;
- story/content.

A chapter transition must not change:
- HUD structure;
- menu structure;
- quest entry;
- adult-mode entry;
- history entry;
- resource presentation;
- global spacing/typography;
- overlay behavior;
- input ownership.

If Act 5 requires retesting or re-fixing generic HUD behavior, Architecture 1.0 has failed.

### One concept = one implementation

Every reusable game concept has one canonical implementation.

Examples:
- one quest-marker asset + component + interaction contract;
- one NPC attention-marker asset/component;
- one dialogue-card implementation;
- one Story Moment shell;
- one hotspot/interactable primitive;
- one purchase-gate pattern;
- one History/replay system;
- one Game UI Shell;
- one input-priority/overlay contract.

Do not create chapter-specific copies of shared systems.

A new chapter must not add equivalents such as:
- `act3-quest-marker.png`;
- an Act-specific dialogue-card JSX stack;
- a second Historik implementation;
- chapter-specific quest-marker click logic;
- a separate HUD/header;
- duplicate input-lock behavior.

If a concept is genuinely different, document the product reason for the exception before implementing it.

### Asset architecture

Reusable gameplay/system assets are **global assets**.

Canonical examples:
- quest marker;
- NPC attention marker;
- global HUD icons;
- menu icons;
- shared story/UI chrome.

All chapters reference the same source asset for the same concept.

Chapter-specific assets should mostly be content:
- maps/backgrounds;
- unique NPC art;
- building/project stages;
- Story Moment stills;
- genuinely chapter-specific props.

Do not redraw/re-export the same system asset for each chapter.

### Story Engine + Story Registry

Story Engine owns how story is presented.

Story Registry owns what authored story exists and how it is categorized.

Normal story content must be typed data with metadata such as:
- id;
- chapter;
- storyline/group;
- title;
- image;
- body/dialogue;
- history/replay policy;
- unlock/gating metadata where appropriate.

Adding a normal Act 3 beat must not require new code for:
- dialogue box rendering;
- nameplates;
- image shell;
- next/previous behavior;
- overlay suppression;
- replay;
- History presentation.

Story Engine/Registry are game systems. Acts provide story data.

### Story History

Historik is a shared game-wide read-only system over Story Registry + completed story state.

Rules:
- replay never mutates progression;
- replay never grants rewards;
- replay never performs purchases;
- replay never changes consumed state;
- replay never changes authoritative backend state;
- future storylines normally enter Historik only after the full storyline is completed;
- spoiler policy is generic metadata/configuration, not Act-specific JSX.

The current Act 2 history catalog in `Act2Runtime.tsx` is migration debt. It must be extracted into the shared Registry/History system **before substantial Act 3 runtime work**.

After that extraction, Act 3 beats must inherit History automatically from registration/configuration.

### Quest / Progression

Quest V2/backend remains authoritative for real-world work and rewards.

The game progression layer consumes authoritative evidence using one shared contract:

backend evidence
→ next eligible authored beat
→ present exactly once
→ commit consumption
→ evaluate generic gates
→ expose next eligible beat

Chapter code supplies authored tracks/gates as data/configuration.

Do not create a new claim-consumption model for Act 3.

Replay/History is never part of progression.

### Interaction System

All generic world interaction uses one shared Interaction System.

It owns:
- quest markers;
- NPC attention markers;
- hotspots;
- approach points;
- interaction radius;
- pointer priority;
- world-input locks;
- interaction suppression under overlays;
- generic click/tap behavior.

A quest marker must look and behave the same in every area because it is the same primitive using the same asset.

A new questgiver should be configuration, not a new marker implementation.

### World / Area Engine

Areas remain separate worlds/maps but use one shared world engine.

Shared primitives include:
- player movement;
- touch/keyboard input;
- camera;
- collision;
- depth ordering;
- NPC entities;
- interactables;
- markers;
- exits/transitions;
- approach-point logic;
- input-lock semantics.

Do not create `createAct3Game.ts` as a cloned fork of Act 2.

### Save / Migration

Persisted game state must move toward explicit schema/versioned migrations.

Generic state concepts should not be reintroduced per chapter.

Examples:
- beat consumed;
- storyline complete;
- replay eligibility;
- overlay state;
- chapter entry/completion.

Migration code must be:
- deterministic;
- idempotent;
- regression-tested;
- incapable of fabricating backend quests, rewards, wallet values or authoritative progression.

### Engine/content boundary

**Engine owns**
- Game UI Shell;
- story rendering;
- Story Registry;
- History/replay;
- markers;
- generic interactions;
- input/overlay semantics;
- progression consumption;
- save/migration mechanics;
- purchase-gate mechanics;
- world primitives.

**Content owns**
- story text;
- images;
- maps/backgrounds;
- NPC definitions;
- positions;
- questline/project definitions;
- beat ordering;
- chapter-specific unlock/gate configuration;
- unique chapter props/art.

Target authoring experience: new chapter work should feel like **feeding content into a proven engine**.

### Reference implementation and migration strategy

Act 2 production behavior is the accepted reference implementation.

Architecture work must preserve:
- story canon;
- contribution counts;
- economy behavior;
- save ownership;
- interaction outcomes;
- physical iPhone behavior.

Refactor structure, not accepted product behavior.

Migration order:
1. audit remaining Act-specific ownership;
2. converge Village + Act 2 onto one actual Game UI Shell;
3. extract Story Registry + shared History;
4. extract shared Interaction System;
5. extract World / Area primitives;
6. establish explicit Save / Migration engine;
7. generalize progression/gating;
8. migrate only necessary Act 1 surfaces to eliminate parallel systems;
9. begin substantial Act 3 runtime only after the shared contracts are proven.

### Architecture acceptance tests

Runtime Architecture 1.0 is not complete until all of these are true:

1. Adding a normal Act 3 story beat requires content/configuration, not new presentation/replay/history code.
2. Adding a questgiver does not require new marker code or a new marker asset.
3. Changing the standard dialogue-card appearance requires one shared change.
4. Changing the global HUD/menu requires one shared change.
5. Switching areas does not switch HUD implementations.
6. History/replay behavior is inherited by registered storylines.
7. Generic input/overlay bugs fixed once are fixed across all areas.
8. A future Act 5 should not require re-bugtesting stable generic UI/story/marker systems merely because it is Act 5.

Any implementation that violates these principles should be treated as architecture regression and corrected before building further on top of it.


### Improvement escalation rule

If the active developer/assistant identifies an architectural, product, UX, reliability, testing or maintainability improvement that materially strengthens SysselCraft, it must be raised immediately in the current work session.

Do not silently defer useful improvements until a later handoff.

The required behavior is:
- identify the improvement;
- explain why it matters;
- distinguish whether it is required now, safe to defer, or conflicts with the current freeze/release boundary;
- if it is compatible with the current task and architecture rules, propose the concrete change immediately;
- never hide behind “not asked” when a material structural improvement is obvious.

This does not authorize scope creep on frozen live code. Improvements must respect branch, release and architecture rules.


### Canonical System Registry — mandatory

Runtime Architecture 1.0 must include a central registry for canonical reusable game-system assets and components.

Purpose:
- make the approved implementation for a reusable concept discoverable from one place;
- prevent chapter-local asset/component forks;
- make architectural violations mechanically easier to detect in code review and tests.

The registry should map canonical concepts to their shared implementation, for example:
- quest marker asset/component;
- NPC attention marker asset/component;
- Story Moment shell;
- dialogue card;
- nameplate;
- global HUD/menu primitives;
- shared icons;
- hotspot/interactable primitive;
- purchase-gate presentation;
- History/replay entry points.

Rules:
- chapter code must import/reference canonical system assets/components through the shared system layer rather than hardcoding duplicate paths or implementations;
- reusable system asset paths must not be redefined inside Act-specific modules;
- adding a second implementation for an existing canonical concept is an architecture violation unless an explicit product exception is documented first;
- regression/static checks should be added where practical to catch duplicate Act-specific system assets or forbidden direct references.

The System Registry is part of the engine/content boundary: engine concepts are registered centrally; chapters only consume them.


## Runtime 1.0 implementation strategy — LOCKED 2026-10-03

Runtime Architecture 1.0 will be built as a **clean parallel canonical client runtime**, not as a piecemeal extraction/refactor of the current Act 1/Act 2 client implementations.

This is not a full product rewrite.

### Reuse unchanged

Keep and reuse:
- Quest V2/backend authority;
- Supabase integration and data ownership;
- economy/transaction behavior;
- accepted story/dialogue content;
- canonical assets;
- accepted progression values/thresholds;
- accepted product/story gates.

### Rebuild cleanly

Build a new canonical client runtime for:
- Game UI Shell;
- Canonical System Registry;
- Story Registry + History;
- Interaction System;
- Area/World Engine;
- Save Adapter / Migration Engine;
- shared Progression/Gating bridge;
- runtime orchestration between those systems.

### Migration method

1. Define Runtime 1.0 contracts before porting chapter code.
2. Build the clean runtime beside the frozen live/legacy runtime.
3. Port Act 2 first as the primary reference chapter because its complete production journey has physical acceptance.
4. Port Village/Act 1 next using the same shared systems.
5. Read legacy saves through an adapter/normalizer; do not mutate Adam's production data during development.
6. Prove parity through automated comparison plus browser/iPhone acceptance.
7. Remove the superseded legacy client runtime after parity is proven. Do not keep two permanent engines.
8. Begin substantial Act 3 runtime only after Runtime 1.0 is accepted.

### Mandatory parity harness

Runtime 1.0 must include an automated **parity harness** for migration verification.

The harness must be able to feed representative fixtures / saved states into both:
- the frozen legacy runtime logic; and
- Runtime 1.0;

and compare the important externally observable outcomes.

At minimum, parity coverage should compare where applicable:
- chapter/area availability;
- current world/project state;
- NPC presence;
- interactable/quest-marker availability;
- authored story eligibility / next beat;
- completion/gating state;
- wallet/resource presentation inputs;
- persisted story completion semantics;
- chapter transitions;
- legacy-save normalization outcomes.

The harness is not required to compare incidental implementation details or DOM/source shape. It compares product behavior/state contracts.

Use fixtures for important lifecycle states, including:
- fresh/early Act 1;
- late Act 1 / Clinic boundary;
- Act 1 completed / Act 2 unopened;
- active Act 2 at representative project stages;
- pending story/purchase/naming gates;
- completed Act 2;
- relevant legacy migration states.

Parity failure blocks removal of legacy runtime and blocks promotion of Runtime 1.0.

### Success criterion

Runtime 1.0 is accepted only when:
- shared-engine rules are satisfied;
- representative legacy saves normalize correctly;
- parity harness passes;
- browser acceptance passes;
- physical iPhone acceptance passes.

The frozen live runtime remains the behavioral oracle until that point.


### Stable story identity rule — mandatory

Story beat and storyline identity is global engine identity, not local Act naming.

- every `storylineId` must be chapter-qualified, e.g. `act2:cabin` or `act3:intro`;
- beat IDs must remain globally unique;
- History/progression/save adapters must reference these stable IDs rather than display labels;
- titles and labels may change without changing identity.

This prevents later chapters from colliding in History, progression or save migration.


## Runtime 1.0 implementation status — 2026-10-03

### Complete
- live freeze + separate architecture branch;
- mandatory architecture master contract;
- one-concept-one-implementation rule;
- Canonical System Registry contract;
- shared Game UI Shell component skeleton;
- generic Story Registry contract;
- generic Story History/replay contract;
- generic Interaction contract;
- chapter-qualified stable story IDs;
- Act 2 story adapter over accepted canonical source data;
- parity harness foundation;
- legacy-vs-registry Act 2 History projection coverage for fresh, partial, special-purchase and completed states.

### In progress
- execute/close the Act 2 History parity checkpoint;
- **DONE:** Act 2 development History consumer now uses shared Registry/History;
- **DONE for Act 2:** development Act 2 now uses the shared Game UI Shell;
- **DONE:** Village migration to the same Game UI Shell.

### Not started
- canonical marker presentation convergence: **complete across current playable worlds**;
- shared World / Area Engine;
- versioned Runtime 1.0 Save/Migration adapter;
- shared progression/gating bridge;
- Act 1 runtime port;
- physical Runtime 1.0 acceptance;
- legacy client deletion;
- Act 3 content runtime.


### Act 2 History consumer migration — complete on dev branch

`Act2Runtime` on `nova/runtime-architecture-v1` now consumes shared Story Registry/History rather than assembling History inline.

Legacy/live behavior remains the oracle. Promotion remains blocked on broader Runtime 1.0 parity and later browser/iPhone acceptance.


### Game UI Shell migration status

- Act 2 development runtime: **migrated** to shared `GameUiShell`.
- Village/Act 1 runtime: **migrated**.
- frozen live runtime: unchanged.

Game UI Shell cannot be considered fully complete until both playable worlds consume the same component and legacy inline header ownership is removed.


### Global Game UI Shell milestone — complete on dev branch

Both current playable worlds now consume the same actual `GameUiShell` component:
- Village / Act 1;
- Act 2 Lake.

Chapter-specific global header implementations are no longer the dev consumer path.

Remaining UI architecture work is now about centralizing shell visibility/overlay authority and moving any remaining global affordances into shared configuration, not maintaining multiple HUD implementations.


### Canonical quest marker migration status

- shared quest-marker renderer: **complete**;
- Act 2 turn-in marker: **migrated**;
- Village noticeboard/Linus/Henning quest markers: **migrated**;
- quest-marker presentation milestone: **complete across current playable worlds**;
- NPC/story-attention marker convergence: **complete**.

The canonical renderer reuses the established Village quest-marker visual language. There is no separate marker asset file in the current repository; do not invent chapter-specific marker files.


### Quest-marker presentation milestone — complete on dev branch

All current Quest V2/world quest markers use one canonical shared renderer:
- Act 2 Alve turn-in;
- Village noticeboard;
- Village Linus;
- Village Henning/bakery.

No chapter-specific quest-marker renderer should be added from this point forward.

This does **not** close the entire Interaction System milestone. Story-attention markers, generic interaction resolution, approach-point ownership and world-input authority still require convergence.


### Marker presentation convergence — complete on dev branch

Canonical Interaction System presentation now owns:
- quest available marker;
- quest turn-in marker;
- NPC/story-attention marker.

Current Village and Act 2 marker presentation has migrated to the shared renderer. No new chapter-local marker renderers should be created.

Interaction System is **not fully complete** yet. Remaining work:
- shared interaction resolution;
- approach-point ownership;
- world-input authority / overlay suppression integration;
- migration of generic hotspot semantics where useful.


## CURRENT RUNTIME 1.0 STATE — HANDOVER 2026-10-03

Verified development branch:
- branch: `nova/runtime-architecture-v1`
- HEAD: `959b6fd70c3d0c5015706899e9f2d33e960bb384`
- frozen live baseline remains `f9bf552f70f4af3ff7457a86867b323504e39c36`
- live/release branches must remain untouched by architecture work.

### Completed on development branch
- Canonical System Registry exists.
- One shared `GameUiShell` is consumed by both Village/Act 1 and Act 2.
- Act 2 Historik consumes the shared Story Registry + generic read-only History engine.
- Act 2 story content is registered through `ACT2_STORY_REGISTRY`.
- Stable chapter-qualified story IDs are enforced.
- Parity harness foundation exists in `scripts/test-runtime-parity.mjs`.
- Act 2 legacy-vs-registry History projection coverage exists for representative states.
- Shared Interaction contract exists.
- Shared canonical marker renderer exists.
- Current quest markers across Act 1/Act 2 use the canonical renderer.
- Current NPC/story-attention marker presentation is also converged on the shared renderer.
- Old local Village quest badge renderers and Linus intro story-bubble renderer have been removed from the development consumer path.

### Interaction System status
Marker **presentation** is converged.

The Interaction System as a whole is NOT complete. Remaining work:
- shared interaction resolution across current worlds;
- shared ownership of approach points/radii;
- shared world-input authority / overlay suppression;
- generic hotspot semantics where useful;
- parity coverage for interaction outcomes before deleting legacy navigation/input code.

### Next implementation order
1. Finish Interaction System behavior convergence, starting with shared resolution/approach-point ownership.
2. Converge world-input authority/overlay suppression.
3. Build shared World / Area Engine primitives.
4. Build versioned Save / Migration adapter and representative legacy-save fixtures.
5. Generalize progression/gating bridge while Quest V2 remains authoritative.
6. Port/remove only the legacy Act 1/Act 2 runtime pieces superseded by the new engine.
7. Run automated parity, browser acceptance and physical iPhone acceptance.
8. Remove superseded legacy client runtime.
9. Only then begin substantial Act 3 runtime/content.

### Absolute rules
- These are rules, not guidelines.
- One reusable concept = one canonical implementation.
- UI is constant across chapters.
- Reusable system assets/components are global, not Act-specific.
- New content should normally mean story, images, NPC/area config and gates, not new runtime logic.
- Do not create Act-specific HUD, History, marker, dialogue, interaction or progression implementations.
- If a shared concept is missing, add it once to the engine.
- Surface material architecture/product/reliability improvements immediately.
- Do not mutate Adam's backend/save for development testing.
- Do not deploy Runtime 1.0 to production before explicit acceptance.

### Verification policy
Keep work in short batches. Do not trigger Vercel for routine architecture work. Commit/checkpoint at logical slices, keep docs synchronized as work progresses, and update roadmap statuses when milestones close.

The dev branch currently does not auto-run CI on every commit. Use larger verification checkpoints rather than burning build minutes. Before any promotion, full CI + browser + physical iPhone acceptance are mandatory.


## Interaction behavior checkpoint — 2026-10-03

First Runtime 1.0 behavior slice is migrated.

Act 2 Lake's Alve turn-in now delegates the generic decision:
- activate immediately when the player is within the interaction radius;
- otherwise resolve the authored approach point;
- disabled interactions do neither;

to the shared `resolveInteraction()` contract in `src/runtime/interaction/interactionContract.ts`.

Preserved accepted Lake configuration:
- Alve turn-in radius: 135 px;
- approach point: Alve x, Alve y + 58, clamped to the world boundary;
- Phaser movement, facing and the turn-in callback remain area-runtime responsibilities for this slice.

Parity coverage now exercises activate / approach / disabled outcomes in `scripts/test-runtime-parity.mjs`.

**Status:** Interaction System behavior convergence is now **IN PROGRESS** rather than untouched. Do not mark the Interaction System complete yet. Village still owns multiple local pending-interaction/radius/approach paths, and shared world-input authority is still pending.


## Interaction behavior checkpoint 2 — Village noticeboard

The second shared-resolution consumer is now migrated.

Village noticeboard interaction now has one authored interaction definition for:
- interaction id `village:noticeboard`;
- quest-source semantics;
- approach point `{ x: 175, y: 430 }`;
- accepted arrival radius `36`;
- canonical quest-available marker role.

Arrival/enable resolution delegates to shared `resolveInteraction()` rather than a local distance threshold. Existing Village pathfinding and pending-interaction execution remain local for this slice.

Parity locks the accepted boundary:
- 36 px from the authored arrival anchor activates;
- 37 px continues approaching.

Interaction behavior convergence remains **IN PROGRESS**. Do not replace remaining Village interactions wholesale; migrate them in small parity-backed slices.


## Interaction behavior checkpoint 3 — Village Recycling

Village Recycling is now the third shared-resolution consumer and the second Village consumer.

The accepted completed-Recycling interaction now expresses:
- interaction id `village:recycling`;
- hotspot semantics;
- the existing visual-placement approach point as both anchor and approach point;
- accepted arrival radius `40`;
- enabled state only when Recycling is at stage 4.

Shared `resolveInteraction()` now owns disabled / activate / approach resolution. Existing Village click hit-testing, pathfinding, target marker and callback remain local.

Parity locks the arrival boundary:
- 40 px activates;
- 41 px remains approach.

Interaction behavior convergence remains **IN PROGRESS**.


## Interaction behavior checkpoint 4 — bottle message hotspot

Village bottle-message interaction now uses the shared Interaction System.

Canonical authored definition:
- id `village:bottle-message`;
- hotspot semantics;
- anchor + approach point `{ x: 835, y: 500 }`;
- arrival radius `38`;
- enabled only while the bottle-message story interaction is available.

Shared `resolveInteraction()` owns disabled / activate / approach behavior. Existing Village pathfinding, target-marker handling and story callback remain local.

Parity locks:
- 38 px activates;
- 39 px remains approach.

Current shared-resolution consumers: Act 2 Alve turn-in, Village noticeboard, Village Recycling, Village bottle message.


## Interaction behavior checkpoint 5 — construction attention

Village construction-attention interactions now use shared `resolveInteraction()`.

Preserved authored semantics:
- dynamic interaction id scoped by the construction attention id;
- the existing construction attention approach point remains both anchor and approach point;
- accepted arrival radius remains `32`;
- canonical marker role remains `npc-attention`;
- the construction callback still receives the original authored attention id directly.

Shared Runtime 1.0 owns only disabled / activate / approach resolution. Village still owns pathfinding, pending-state cleanup, dialogue-open state and callback execution.

Parity locks:
- 32 px activates;
- 33 px remains approach.

Current shared-resolution consumers: Act 2 Alve turn-in, Village noticeboard, Village Recycling, Village bottle message, Village construction attention.


## World-input authority checkpoint — 2026-10-03

The first cross-world world-input convergence slice is implemented.

Shared authority:
- `worldInputEnabled({ enabled, blockingOverlayVisible })` is now the canonical pure decision;
- Village exposes an explicit `setWorldInputEnabled(enabled)` handle matching the Lake contract;
- Village background pointer movement and keyboard/path movement consume the shared authority;
- Village presentation state now explicitly drives `setWorldInputEnabled(!villageInputLocked)`;
- legacy `setConstructionDialogueOpen()` remains temporarily as overlay-state compatibility and is deliberately separate from the explicit enabled flag;
- Act 2 Lake pointer interaction and movement update loops consume the same shared authority.

Material bug fixed during convergence:
- Act 2 Lake previously cleared pointer movement when world input was disabled but keyboard movement could still execute in `update()`;
- keyboard movement now obeys the same shared world-input authority.

Parity coverage now includes:
- enabled + no overlay => input allowed;
- explicitly disabled => input blocked;
- blocking overlay => input blocked even when otherwise enabled;
- source-contract guards for both Village and Lake consuming the shared authority.

**Status:** world-input authority is now **IN PROGRESS / cross-world contract established**. Do not remove the Village compatibility overlay flag until remaining overlay surfaces are mapped and parity-covered.


## World-input authority checkpoint 2 — Village legacy lock retired

Village presentation now owns one complete blocking-overlay boolean:

`villageBlockingOverlayVisible`

It includes current modal/story surfaces such as:
- Linus dialogue/replay;
- construction/Recycling/Henning/Bakery/Clinic/Mira/Sol story surfaces;
- Act 1 finale;
- bottle-message story;
- shop and abandoned-shop dialogue;
- room and dog-home surfaces;
- main menu and Vuxenläge;
- child pairing;
- Act 2 purchase story opened from Village;
- safe/debug story overlays;
- save-error blocking UI.

That single presentation result drives `setWorldInputEnabled()`.

The superseded Village compatibility system is removed:
- no `constructionDialogueOpen` flag in Phaser;
- no `setConstructionDialogueOpen()` handle;
- no manual open/close input toggles from individual React close paths.

All object-level Village pointer handlers now pass through one scene-level `acceptsWorldInput()`, which delegates to shared `worldInputEnabled()`.

Parity guards the retirement so the legacy lock cannot silently return.

**Status:** Village world-input ownership is now converged onto the explicit shared authority. Remaining Interaction System work should focus on interaction resolution/priority and then World/Area primitives, not another input-lock model.


## Interaction priority checkpoint — Linus base intent

Linus is the first mixed-priority NPC migrated to shared priority resolution.

A generic `resolveInteractionPriority()` now lives under Runtime Interaction and knows only:
- candidate id;
- numeric priority;
- enabled state.

Village maps Linus state into four ordered intents:
1. construction attention — priority 40;
2. intro/onboarding — priority 30;
3. backend quest source — priority 20;
4. ordinary resident interaction — priority 10.

Three Linus base pointer entrypoints now consume one `resolveLinusIntent()`:
- scene-level Linus hit;
- dedicated Linus interaction zone;
- Linus sprite.

Important parity decision:
- this slice centralizes **which intent wins** only;
- it deliberately preserves the existing entrypoint difference where scene-level ordinary-resident tap may invoke dialogue immediately while sprite/zone navigation uses the authored approach path;
- marker-specific entrypoints remain explicit and are not generalized yet.

Parity locks all four priority outcomes and statically guards against reintroducing duplicated construction-attention priority checks.

**Status:** pointer/interaction priority is **IN PROGRESS**, with Linus base priority centralized. Marker-specific priority and generic hit-target arbitration remain pending.
