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


## Checkpoint — Henning arrival uses shared resolution

Henning is now another real consumer of the canonical interaction definition/resolver.

Accepted legacy behavior is preserved:
- fixed approach point `370,468`;
- activation radius 95 px around Henning's current sprite position;
- 95 activates, 96 continues approach;
- facing and callback remain local.

### Consolidated Interaction audit

Completed/converged:
- shared marker rendering;
- shared world-input authority;
- overlay suppression;
- mixed NPC intent priority for Linus/Henning;
- Sol-tour CTA arbitration;
- explicit Village scene target priority;
- six shared interaction-resolution consumers.

Remaining special-case work is concentrated in:
- Linus ordinary arrival dual geometry;
- Shop/Mira two-approach behavior;
- Sol resident interaction;
- deeper generic hit-test/entrypoint de-duplication.

Those remaining cases should not be generalized until automated parity and physical acceptance protect their existing behavior.


## Runtime 1.0 verified checkpoint — 2026-10-03

The Runtime Architecture branch now runs the canonical GitHub CI workflow on every push.

Verified GitHub Actions run:
- run: **#1746**
- result: **SUCCESS**
- workflow command: `npm run verify`
- verified branch: `nova/runtime-architecture-v1`

The successful verify includes production build plus all chained regression/contract suites, including:
- construction and save/reload checks;
- quest presentation/recovery/turn-in/request-guard;
- Sol story;
- Act 2 visual/story/runtime/full-flow/doc-sync/closeout/Alve tests;
- Game UI Shell and Story UI contracts;
- final Runtime 1.0 parity harness.

Interaction checkpoint included in this green baseline:
- Henning ordinary arrival uses shared `resolveInteraction()`, authored approach `{370,468}`, radius 95;
- Sol ordinary arrival uses shared `resolveInteraction()`, authored approach `{835,485}`, radius 95;
- parity locks both 95px activation / 96px approach boundaries;
- canonical marker owners are asserted explicitly rather than through a brittle marker-count test.

The CI repair pass also synchronized stale harness assertions with already-accepted Runtime 1.0 ownership: shared marker renderer, GameUiShell, world-input authority, Story Registry history ownership and shared Interaction dependencies. No production behavior was intentionally reverted to satisfy legacy tests.

Remaining risky Interaction special cases are still:
- Linus ordinary arrival dual geometry;
- Shop/Mira multi-approach behavior;
- deeper object-handler / scene-handler de-duplication, which remains gated on browser + physical iPhone acceptance.


## Interaction System late-convergence checkpoint — Linus + Shop/Mira

Verified behavior now locked/migrated:

### Linus dual arrival
Linus keeps both accepted legacy arrival zones for one canonical interaction:
- ordinary resident radius: 95 px around the current Linus sprite;
- authored approach arrival: 18 px around `REQUIRED_APPROACHES.linus = { x: 230, y: 460 }`.

The shared `InteractionDefinition.activationZones` contract expresses the secondary authored zone. Parity locks:
- 95 px NPC radius => activate;
- 18 px authored approach radius => activate;
- outside both zones => continue approach.

### Shop / Mira multi-approach
Shop interaction now uses shared `resolveInteraction()`.

Canonical authored values:
- `SHOP_APPROACH = { x: 1130, y: 425 }`;
- `MIRA_APPROACH = { x: 1050, y: 445 }`;
- interaction radius: 42 px.

Behavior preserved:
- closed shop accepts only the Shop approach zone;
- open shop accepts both Shop and Mira approach zones;
- direct Mira taps still path to Mira's authored approach;
- building/Sol-tour taps still path to the Shop approach;
- callback remains `onShopInteract()` when open and `onAbandonedShopInteract()` when closed.

Parity locks 42/43 px boundaries for closed shop and the open Mira activation zone.

### Resulting Village interaction ownership
After this migration there are no remaining local `distance(this.player, ...)` arrival checks in `createVillageGame.ts`.

All current Village world-interaction arrival radii now resolve through the shared Interaction System. Entry-point-specific hit testing/path selection remains local where behavior differs, but activation geometry is canonical.

GitHub Actions verification:
- Linus parity run #1754: SUCCESS.
- Shop/Mira verify job in run #1757: SUCCESS, including `npm run verify` and `test:runtime-parity`.


## World / Area Engine checkpoint 1 — movement intent + camera

The first shared World / Area Engine primitives are now active.

### Shared movement intent
New canonical primitive:
- `src/runtime/world/movement.ts`
- `resolveDirectMovementIntent()`
- `directionalInputVector()`

Act 2 Lake now delegates generic input-to-direction behavior to this primitive while retaining area-owned collision, world bounds, animation/facing and dog follow.

Accepted Lake behavior preserved and parity-locked:
- keyboard input overrides/clears an existing tap target;
- diagonal keyboard input normalizes;
- idle keyboard follows the current tap target;
- tap target clears only when distance is strictly less than 8 px;
- exactly 8 px still produces movement.

### Shared camera contract
Canonical camera values now live in:
- `src/runtime/world/worldCamera.ts`

The contract owns:
- background color;
- follow lerp X/Y;
- deadzone width ratio;
- deadzone maximum width;
- deadzone height.

Both Lake and Village consume the shared camera contract. Parity locks:
- 667px view width => 32% deadzone width;
- wide view => 340px deadzone cap;
- accepted follow lerp remains 0.08 / 0.08;
- deadzone height remains 180.

### Verification
GitHub Actions #1773: `npm run verify` SUCCESS.

This is intentionally a primitive extraction, not a mega-world rewrite. Area-specific collision, authored world bounds, entity placement and navigation remain local until separately migrated with parity.


## Runtime 1.0 World / Area checkpoint — shared dynamic depth ordering

Dynamic Y-based entity depth is now a canonical World / Area primitive:

- implementation: `src/runtime/world/worldDepth.ts`;
- canonical base depth: `1000`;
- canonical behavior: `1000 + Math.round(y)`.

Current consumers:
- Act 2 Lake player;
- Act 2 Lake dog;
- Act 2 Lake Alve placement;
- Village player;
- Village dog;
- Village world-image base depth;
- Village construction truck movement;
- Village nearest-walkable player repair.

Authored static/special depths were intentionally left local. This migration only replaced existing `1000 + Math.round(...)` behavior and does not reinterpret authored z-order.

Regression coverage:
- parity locks integer and half-pixel rounding behavior;
- visual audit now verifies the canonical shared depth contract instead of requiring inline depth arithmetic;
- Act 2 Alve harness explicitly loads the shared depth primitive.

GitHub Actions #1783: `npm run verify` SUCCESS.

### World / Area Engine status

Runtime 1.0 now has three real, consumed World / Area primitives:
1. direct movement intent, currently consumed by Lake;
2. shared camera contract, consumed by Lake + Village;
3. dynamic depth ordering, consumed by Lake + Village.

Next high-risk work is collision/pathfinding and deeper movement-runtime convergence. Do not migrate that blindly: navigation/input changes still require browser and physical iPhone acceptance. Keep authored world bounds, collision geometry and pathfinding local until that acceptance gate is available.


## Shared world depth audit closeout — 2026-10-03

The requested baseline `fb5f2f76af722d193efa5dbc88d25e711189e044` was already superseded by `cfdc3a53a0bf6631a2d19b47ba5ea413ca942a3a` (ten commits ahead, CI run 37147229335 successful). The existing slice migrated Lake before Village and extracted `worldEntityDepth(y) = 1000 + Math.round(y)`. Its parity commit followed the migrations; this historical ordering does not satisfy parity-first and must not be repeated.

Audit of both area runtimes confirms depth is the smallest identical contract. Bounds/collision remain different (Lake shoreline pixel sampling and foot radii versus Village obstacle geometry and A*). Dog-follow also differs (Lake delta-based interpolation with collision versus Village fixed interpolation and facing offsets). No movement, navigation or input behavior was changed.

A source sweep found two remaining copies of the depth formula in `worldDecor.ts` and `visualProductionRuntime.ts`. Both now consume the canonical primitive. Behavioral parity was added and passed against the old renderers before these two migrations, then passed again afterwards. It executes the real renderers across fractional, exact half-pixel, zero and negative Y values and all four production building stages. The standalone Gate 0 harness now resolves the shared dependency in its temporary module tree.

Authored special/static depth overrides remain unchanged. No Act 3, production deployment, Adam data, native project or iPhone/WebView fallback was touched. This closes the depth slice; it does not authorize collision/pathfinding convergence.

Validation: `npm run verify` passed on the completed slice, including Runtime 1.0 parity. `node scripts/audit-v4-gate0.mjs` passed (12 building stages, 240 directed paths across eight visibility combinations). Its stale image mock was extended to preserve and assert the existing Clinic crop. A source sweep found no remaining inline `1000 + Math.round(...)` implementation under `src`. Physical iPhone acceptance was not rerun for this pure arithmetic extraction.


## Save / Migration Engine checkpoint 1 — sequential migrations

Runtime 1.0 now has a canonical pure migration primitive in `src/runtime/save/migrations.ts`.

`runSequentialMigrations()`:
- applies only explicit N -> N+1 steps;
- is idempotent when already at the target version;
- fails closed when a required migration step is missing;
- contains no storage/backend behavior.

Act 2 is the first real consumer. The existing finale compatibility migration from pre-schema saves to `finaleSchemaVersion: 2` now runs through the shared migration engine before normal invariant repair. Persisted format and accepted legacy behavior are unchanged.

The old inline `preEpilogueSchemaComplete` migration branch has been retired. Existing Act 2 runtime, full-flow, closeout and Alve harnesses now load the shared migration dependency explicitly.

Verification: GitHub Actions #1799, full `npm run verify`, SUCCESS on commit `be24bcebdd434ced23ea35ce06774bcb64e47b46`.

Next safe Save/Migration work should move additional compatibility repairs behind explicit versioned steps. Backend-owned quests, rewards, wallet values and authoritative progression must never be fabricated by migrations.


## Save / Migration Engine checkpoint 2 — Act 1 Clinic/finale compatibility

Act 1 now consumes the shared Save / Migration Engine for its legacy chapter-finale compatibility repair.

Historical behavior preserved:
- old saves may have `worldFlags.clinicCompletionSeen === true`;
- those saves can predate `act1ChapterFinaleSeen`, `act1ChapterFinaleIndex` and `act1EndCardSeen`;
- those players must regain Act 2/lake access without replaying the newly introduced Act 1 chapter ending.

The repair now runs explicitly through `runSequentialMigrations()` in `src/game/saveState.ts`. Saves with existing Act 1 chapter-finale state are already current for this compatibility step. Legacy Clinic-complete saves without chapter-finale state migrate to `act1ChapterFinaleSeen: true` and `act1EndCardSeen: true`. Incomplete Clinic/finale states are not fabricated or skipped.

The previous implicit legacy acknowledgement branch was retired. `scripts/test-sol-story.mjs` now guards the migration-engine behavior rather than the removed implementation shape.

Verification:
- CI #1801 exposed the stale source-shape harness;
- the harness was updated to canonical migration ownership;
- CI #1802: full `npm run verify` SUCCESS on `6f6a60a25476d3b3b7e5ed0e2e89d5c235460a5c`.

No backend-owned state, rewards, wallet values, quest progression or authoritative story flags are fabricated by this migration.


## Save / Migration Engine checkpoint 3 — Act 2 finale schema 3

Act 2 finale compatibility now has an explicit sequential schema chain:

`1 -> 2 -> 3`

Schema 3 moves the remaining `legacyFamilyComplete` compatibility repair out of `normalizeAct2RuntimeState()` and into the shared Save / Migration Engine.

Behavior is parity-locked for both schema-2 cases:
- family finale consumed, epilogue not consumed => resume once at epilogue index 5;
- epilogue and chapter genuinely complete => remain complete, preserve `endCardSeen`, and never resurrect the finale.

Pre-schema saves still pass through the existing 1 -> 2 recovery before 2 -> 3. The canonical normalizer now handles invariants after versioned compatibility work rather than owning this legacy migration branch.

Verification:
- parity committed before migration;
- GitHub Actions #1806: full `npm run verify` SUCCESS on `0884fb5359f5b48a46cb9af57f2615908bb8849f`.

No production/live, backend-owned progression, Adam data, Act 3, navigation, collision, iPhone/WebView behavior, story content or economy was changed.


## Current Runtime 1.0 verified checkpoint — 2026-10-04

Branch: `nova/runtime-architecture-v1`.

Verified documented HEAD before this documentation sync: `2de79498f9537d356a444656df9d408cfb135cac`.

GitHub Actions #1807 ran full `npm run verify` successfully on that HEAD.

Save / Migration Engine status:
- canonical sequential migration runner exists;
- Act 1 Clinic/finale compatibility is explicit;
- Act 2 finale compatibility is explicit through `1 -> 2 -> 3`;
- `preEpilogueSchemaComplete` and `legacyFamilyComplete` are no longer normalizer-owned compatibility branches;
- normalizers now handle canonical invariants after versioned compatibility migration.

Safety boundaries remain unchanged: no production/live promotion, no Adam-data mutation, no backend-owned progression fabrication, no Act 3 feature work, and no iPhone/WebView-sensitive navigation/collision/movement convergence without physical acceptance.


## Save / Migration Engine checkpoint 4 — explicit construction compatibility + sweep closeout

The remaining pure local construction compatibility adapter is now an explicit pre-normalization migration.

Implementation:
- parity commit: `d532dbfc7bcca70c6869240757578fb62e0d8dfd` (`test: lock legacy construction save parity`);
- implementation commit: `99df1984a2bc088f5715d8f6ef5b112bff8316c7` (`refactor: migrate legacy construction before normalization`);
- `saveState.ts` now migrates legacy construction shape through `runSequentialMigrations()`;
- `normalizeConstruction()` no longer accepts or owns `legacyVisible`;
- the saved envelope remains `version: 1`;
- deterministic current-state reconstruction such as `construction.pending` remains normalizer-owned.

Parity was locked before implementation across 330 combinations of construction shapes, stage values and progression totals, plus independent Act 1 finale markers. Input immutability and normalized-save idempotence are covered.

The broad compatibility sweep is documented in `docs/SAVE_COMPATIBILITY_AUDIT.md`. It found no additional implicit, pure, ownership-locked legacy compatibility repair that should be moved into Save/Migration Engine now.

Important classification boundaries:
- invariant repair stays in normalizers;
- current-domain progression rules stay in domain/progression owners;
- malformed/current input filtering stays validation;
- localStorage/Preferences and unscoped/scoped key moves stay storage migration;
- wallet, quest, purchased flags and claim-baseline recovery stay backend-owned;
- no migration may fabricate backend-owned state.

Verification:
- Runtime branch was fast-forwarded cleanly to Codex work, no merge commit;
- GitHub Actions #1812: full `npm run verify` SUCCESS on exact code HEAD `99df1984a2bc088f5715d8f6ef5b112bff8316c7`.

### Consequence for next Runtime 1.0 work

Do not spend another broad pass trying to manufacture more Save/Migration slices. The safe pure candidates identified by the repo-wide sweep are now exhausted.

Return to the Runtime Architecture roadmap. The next meaningful work is remaining runtime convergence / legacy cleanup, with collision, pathfinding, movement feel, dog-follow and WebView/touch behavior still gated by browser + physical iPhone acceptance. Prefer a small parity-first slice over a broad rewrite.
