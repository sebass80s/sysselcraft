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


## Handover checkpoint — marker presentation converged

Verified at dev HEAD `959b6fd70c3d0c5015706899e9f2d33e960bb384`:
- Village and Act 2 both use `GameUiShell`;
- Act 2 uses shared Story Registry/History;
- Village contains five `createInteractionMarker()` consumers;
- the old hand-drawn Linus story bubble is gone;
- Act 2 uses the same shared marker renderer.

Marker presentation is therefore converged. Next work must target interaction behavior/ownership, not invent another marker layer.


## Checkpoint — first shared interaction-resolution consumer

Act 2 Lake's Alve turn-in is now the first real consumer of shared `resolveInteraction()`.

The migration deliberately keeps chapter/world data local while moving generic behavior into Runtime 1.0:
- local/config data: Alve position, 135 px radius, +58 px approach point;
- shared engine behavior: resolve disabled vs activate-now vs approach-first;
- local world behavior retained for now: Phaser movement, facing and callback execution.

Parity fixtures cover all three outcomes. This is the first vertical slice of interaction behavior convergence, not completion of the Interaction System.

Next suitable slices are additional current-world interactions that repeat the same radius/approach decision, followed by shared world-input authority.


## Checkpoint — Village noticeboard uses shared resolution

The Village noticeboard is the second real Interaction System behavior consumer.

Its previously separate approach-point/radius rules are now represented by one `InteractionDefinition`, and arrival/enable decisions use shared `resolveInteraction()`.

Preserved behavior:
- approach point: x 175 / y 430;
- arrival radius: 36 px;
- disabled when the backend-derived noticeboard attention is absent;
- existing Village pathfinding, target marker and callback remain unchanged.

Parity explicitly checks the 36/37 px boundary. This demonstrates the shared contract across both Lake and Village without attempting a flag-day interaction rewrite.


## Checkpoint — Recycling uses shared interaction resolution

Completed Recycling interaction has moved its local 40 px arrival test into the shared Interaction System.

The world still owns the authored building placement and pathfinding. The engine now owns the generic question: disabled, activate now, or continue approaching.

Parity covers the accepted 40/41 px boundary. Shared resolution now has consumers in:
- Act 2 Lake / Alve turn-in;
- Village / noticeboard;
- Village / Recycling hotspot.


## Checkpoint — bottle message hotspot uses shared resolution

The Village bottle-message hotspot has been migrated from a local `distance <= 38` rule to the canonical Interaction System.

Its point/radius/enable semantics are now explicit interaction data. Existing story callback and world navigation behavior are preserved.

Parity checks 38 px activate vs 39 px approach.


## Checkpoint — construction attention uses shared resolution

Construction/resident story attention is now another shared Interaction System behavior consumer.

The migration deliberately keeps authored attention ids and callbacks local. The shared contract receives the authored approach point/radius and decides only whether the interaction should activate or continue approaching.

Accepted 32/33 px boundary is parity-covered.


## Checkpoint — shared world-input authority established across Village + Lake

Runtime 1.0 now has a real cross-world input contract rather than only an unused helper.

Village:
- exposes `setWorldInputEnabled`;
- React presentation state drives that contract;
- background pointer input and movement update obey shared `worldInputEnabled()`;
- existing `constructionDialogueOpen` remains as temporary overlay compatibility, not as the new authority.

Act 2 Lake:
- pointer interactions use shared `worldInputEnabled()`;
- movement update uses the same authority;
- this closes a discovered inconsistency where keyboard movement could continue while world input was disabled.

Parity covers the pure truth table and static consumer guards.

Next work should map remaining Village overlay/modal surfaces into the explicit input authority before deleting the old construction-dialogue compatibility flag.


## Checkpoint — Village legacy dialogue lock removed

The overlay audit found the previous explicit lock list was incomplete. Several real blocking surfaces were not represented, including menus, pairing, room/dog-home surfaces and multiple story/replay paths.

Village now derives one complete `villageBlockingOverlayVisible` from React presentation state and uses it as the only presentation owner of `setWorldInputEnabled`.

Removed:
- `constructionDialogueOpen`;
- `setConstructionDialogueOpen`;
- manual per-dialogue input toggle calls.

All object pointer interactions now share `acceptsWorldInput()` → `worldInputEnabled()`.

This closes the Village compatibility-lock migration. Future overlay additions must extend the presentation blocking authority rather than add local Phaser flags.


## Checkpoint — Linus mixed interaction priority centralized

Linus previously duplicated state priority across several pointer handlers.

Runtime 1.0 now has a generic `resolveInteractionPriority()`. Village's `resolveLinusIntent()` maps current state onto:
construction attention > intro > backend quest > resident.

The three base Linus entrypoints consume that one decision.

This change intentionally does not normalize movement/activation differences between entrypoints. Scene-level ordinary-resident behavior and sprite/zone approach behavior remain as accepted legacy behavior until separately parity-covered.

Marker-specific story/quest clicks are also left explicit for now.


## Checkpoint — Linus marker arbitration aligned with interaction priority

Audit found that Linus intro and backend quest markers could be created independently, allowing contradictory simultaneous affordances. Construction attention could also move Linus while lower-priority markers retained stale coordinates.

Village now has one `syncLinusPriorityMarkers()` driven by `resolveLinusIntent()`.

Visual outcomes:
- construction attention suppresses intro/quest markers;
- intro shows the story attention marker;
- quest shows the backend quest marker;
- ordinary resident interaction shows neither.

The sync runs after Linus creation, intro changes, quest-attention changes and construction presentation updates.


## Checkpoint — Henning proves shared priority reuse

Henning exposed a real pre-convergence mismatch:
- scene hit: construction > backend quest > resident;
- sprite hit: resident path directly.

Both now use `resolveHenningIntent()`, backed by generic `resolveInteractionPriority()`.

Henning quest-marker creation is also centralized and suppressed while construction attention wins.

Sol-tour marker behavior is intentionally unchanged and remains a separate story-entry mechanism pending a dedicated arbitration slice.


## Checkpoint — Sol-tour CTA participates in interaction priority

The audit confirmed a mismatch between story semantics and world routing: React's resident callbacks prioritize Sol-tour story beats, while backend quest routes could bypass those callbacks before this slice.

Sol-tour is now an explicit `story-cta` candidate.

Linus:
construction > intro > story CTA > quest > resident.

Henning:
construction > story CTA > quest > resident.

`syncSolTourMarker()` owns CTA marker presentation. Lower quest markers are suppressed whenever CTA wins, and construction attention suppresses CTA. Arrival routing re-checks the current winner before choosing quest vs resident/story callback.

Shop and Sol-decision stops remain outside mixed-NPC arbitration because no competing interaction type currently exists there.


## Checkpoint — Village scene pointer order made explicit

The scene fallback handler previously encoded target priority only through source-code order.

Current explicit arbitration:
Recycling 50 > Linus 40 > Shop 30 > Henning 20 > Ground 10.

The shared priority resolver now decides the winning hit target. Target-specific behavior remains unchanged after selection.

This preserves the iOS-oriented scene fallback while removing hidden priority semantics from the `if` chain.
