# Runtime Architecture 1.0 — initial audit

Date: 2026-10-03  
Branch: `nova/runtime-architecture-v1`

## Purpose

This audit identifies the first migration boundaries for the clean parallel Runtime 1.0. The frozen live runtime remains the behavioral oracle.

## Findings

### 1. Global UI is visually similar but implemented twice

Village renders its header/menu/resource HUD directly inside `VillagePrototype.tsx`.

Act 2 renders a separate header/menu/resource HUD directly inside `Act2Runtime.tsx`.

They currently share CSS classes, but they do not share one component or one menu contract. This is architecture debt and directly explains recent UI drift.

**Runtime 1.0 action:** create one persistent `GameUiShell` component and migrate both worlds onto it.

### 2. UI visibility logic is already partially centralized

`src/game/uiShellState.ts` already owns the pure rule for when gameplay chrome is visible.

This logic should be retained and become an input to the new shared Game UI Shell rather than reimplemented.

### 3. Story presentation is partly shared, story catalog/history is not

Act 2 already uses the shared Story Engine components, but its Historik catalog is assembled inside `Act2Runtime.tsx` from Act 2-specific modules and state.

**Runtime 1.0 action:** introduce Story Registry + generic History after the shared shell foundation.

### 4. Quest/NPC markers are not yet canonical engine primitives

Village currently creates quest/attention markers locally inside Phaser code. Multiple sources build their own badge/container/text behavior.

Act 2 also owns Alve turn-in marker behavior locally.

There is no central canonical quest-marker asset/component/renderer contract today.

**Runtime 1.0 action:** Interaction System must own marker rendering, interaction semantics and the canonical marker asset/renderer. Do not copy current local marker code into new chapters.

### 5. Input locking is duplicated

Village derives local UI blocking and forwards it into its Phaser runtime.

Act 2 independently derives world blocking and calls `setWorldInputEnabled`.

The behaviors overlap but are not one engine contract.

**Runtime 1.0 action:** one shared overlay/input authority must gate all world interaction.

### 6. Save/state ownership is split by chapter

Act 1 uses `SaveStateV1`; Act 2 uses `Act2RuntimeState` with its own normalization/migration path.

This is acceptable as legacy input, but Runtime 1.0 needs a clean adapter/versioned migration boundary before Act 3 state is introduced.

### 7. Backend authority should be reused

Quest V2, backend progression and economy ownership already have clear authority boundaries. They should not be rewritten.

Runtime 1.0 should consume them through adapters/bridges.

## First implementation slice

Build these new shared foundations without modifying the frozen live branch:

1. Canonical System Registry.
2. Shared Game UI Shell contract/component.
3. Parity fixtures for global shell state.
4. Migrate Act 2 to the shared shell in the new runtime path.
5. Migrate Village to the same shell.
6. Only after shell parity is proven, continue to Story Registry/History.

## Safety

- Do not mutate Adam's backend/save.
- Do not deploy Runtime 1.0 to production.
- Do not delete legacy runtime until parity harness + browser + physical iPhone acceptance pass.
- Do not introduce Act-specific replacements for systems already registered as canonical.


## Checkpoint — shared story/history contracts

Implemented on the Runtime 1.0 branch:
- generic Story Registry;
- generic read-only Story History/replay contract;
- generic Interaction contract;
- chapter-qualified stable `storylineId` rule;
- parity fixtures for spoiler gating, authored ordering and replay clamping.

Storyline IDs are global engine identifiers and must be chapter-qualified, for example:
- `act2:cabin`
- `act2:opening`
- `act3:intro`

Do not use ambiguous local IDs such as `cabin` or `intro`.

Next migration target remains Act 2 story registration. Existing Act 2 story content should be adapted into the registry rather than rewritten.


## Checkpoint — real Act 2 registry adapter

Runtime 1.0 now registers the accepted Act 2 story sources without rewriting story content:
- opening;
- Stugan 1–16;
- Bryggan 1–16;
- Båthuset 1–16;
- Motorbåten 1–16;
- livboj purchase beat;
- steering-wheel purchase beat;
- Bryggan completion reaction;
- finale/epilogue.

Act 2-specific completion flags are translated into generic History progress by `act2HistoryProgress()`. The generic Story History engine remains unaware of Act 2 flags.

The parity harness now checks the registry count against the real source arrays and verifies current opening/project spoiler behavior.

Production `Act2Runtime` still uses the legacy History assembly at this checkpoint. No player behavior has changed.


## Checkpoint — Act 2 History parity model

The parity harness now contains an explicit model of the accepted legacy `Act2Runtime` History projection and compares it with Runtime 1.0 Registry/History output.

Covered states:
- fresh Act 2;
- opening + completed Stugan;
- completed Bryggan with lifebuoy + completion reaction;
- completed Båthuset with steering-wheel story;
- fully completed Act 2 including finale.

Parity compares product-visible History ordering/grouping/beat identity, not legacy implementation shape.

This closes the model-definition part of Act 2 History migration. The next step is to execute the parity checkpoint and then switch the development consumer to shared Registry/History. Production/live remains untouched.


## Checkpoint — Act 2 dev consumer migrated to shared History

The development-branch `Act2Runtime` now builds Historik from:
- `ACT2_STORY_REGISTRY`;
- generic `historyEntriesFor()`;
- `act2HistoryProgress()`.

The legacy inline Act 2 History assembly has been removed from the development consumer.

Parity now compares product-visible grouped History output rather than irrelevant cross-group flat-array ordering.

This is a development-branch migration only. Frozen live remains unchanged.


## Checkpoint — Act 2 migrated to shared Game UI Shell

The development-branch Act 2 runtime now renders its global HUD through `GameUiShell`.

Preserved behavior:
- SysselCraft menu;
- Vuxenläge;
- Historik visibility;
- Till byn;
- resource counters;
- contextual Till kapitel 3 action;
- shared HUD visibility authority.

The Act 2-specific header implementation has been removed from the dev consumer path. Village still uses its legacy inline header and is the next shell migration target.

Frozen live remains unchanged.


## Checkpoint — Village migrated to shared Game UI Shell

The development-branch Village runtime now renders the global HUD through the same `GameUiShell` as Act 2.

Preserved Village-specific actions are supplied through shell configuration:
- Vuxenläge menu action;
- Mitt rum;
- dog-home shortcut;
- backend/local resource fallback values.

The legacy inline Village header has been removed from the dev consumer path.

At this checkpoint both playable worlds use the same actual Game UI Shell component on the architecture branch. Frozen live remains unchanged.


## Checkpoint — canonical quest marker renderer established

Runtime 1.0 now owns a shared Phaser marker renderer in `src/runtime/interaction/markerRenderer.ts`.

Canonical visual language currently matches the established Village quest marker:
- brown badge;
- yellow border/glyph;
- shared typography/glow;
- shared animation;
- marker kind selects only the glyph/semantic role.

Act 2's Alve turn-in marker now uses this shared renderer instead of drawing its own circle/text implementation.

Village still contains local quest-marker implementations and is the next migration target. No new marker asset was invented because the current game has no separate quest-marker file; the canonical implementation is the shared renderer over the accepted visual design.

Frozen live remains unchanged.


## Checkpoint — Village quest markers migrated

Village quest sources now use the same canonical Interaction System renderer as Act 2:
- noticeboard;
- Linus;
- Henning/bakery.

Their existing click/navigation behavior remains local for now; this slice centralizes marker presentation only.

A source sweep confirms the old local 27px quest-badge renderers are gone from `createVillageGame.ts`.

Quest-marker presentation migration is therefore complete across current playable worlds. NPC/story-attention markers remain a separate migration target.


## Checkpoint — NPC/story-attention markers converged

Village's remaining story-attention markers now use the shared Interaction System renderer:
- Linus intro/story attention;
- construction/resident story attention.

The canonical marker renderer now owns two distinct system concepts:
- quest markers: brown/yellow badge with `?` or `!`;
- NPC/story attention: white speech bubble with `•••`.

This preserves semantic and visual distinction while keeping one canonical implementation per concept.

A source sweep confirms the old local speech-bubble drawing code is gone from `createVillageGame.ts`.

Marker-presentation convergence is now complete across current playable worlds. Generic interaction resolution, approach-point ownership and shared world-input authority remain pending.
