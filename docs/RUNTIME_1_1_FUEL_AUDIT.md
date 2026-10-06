# Runtime 1.1 Fuel-Principle Audit

**Date:** 2026-10-06  
**Branch:** `nova/runtime-architecture-v1`  
**Audit basis:** Runtime 1.1 fuel principle: future acts should primarily supply content/configuration/world-specific data to a finished engine. Reimplementation of already-solved behavior is a Runtime 1.1 defect.

## Executive conclusion

**Runtime Architecture 1.1 is NOT fuel-principle complete.**

The current branch contains valuable shared primitives and substantially improves on the Act 2 starting point, but a minimal Act 3 would still need to reproduce too much established runtime behavior. Therefore the previous label **code-complete** is too narrow for the actual product goal and must not be used as the readiness gate for Act 3.

Physical iPhone acceptance remains necessary, but it is **not yet the next gate**. First close the engine gaps below, then run regression/browser/physical acceptance on the completed engine.

## Empty-next-chapter test

Question:

> If Act 3 were started now, what would a developer need to implement besides new content, new world data and genuinely new mechanics?

Current answer: too much.

A new chapter would still need substantial custom orchestration for chapter state, persistence, backend synchronization, project selection/consumption, completion reactions, special inputs, history UI, chapter cards/end cards, world setup and debug plumbing.

That fails the fuel principle.

## P0 — blockers before Act 3

### 1. Chapter runtime orchestration is still concentrated in `Act2Runtime.tsx`

Evidence:
- `src/components/Act2Runtime.tsx` remains ~44 KB;
- it owns chapter boot and backend load;
- polling/backend reconciliation;
- world creation/destruction;
- runtime-to-world synchronization;
- chapter intro visibility;
- history/replay UI state;
- project chooser state;
- contribution turn-in state;
- completion reaction sequencing;
- finale sequencing;
- purchase-gate presentation;
- naming presentation;
- end-card presentation;
- debug entry/reset behavior;
- HUD/menu composition.

Shared primitives exist underneath, but there is not yet a sufficiently complete shared chapter host/controller that lets a future chapter mostly provide definitions and callbacks.

**Required direction:** create a shared chapter runtime host/controller contract. Act 2 should consume it. Future chapters should configure it rather than copy Act 2 orchestration.

### 2. Progress Track is configurable in one layer but Act 2 consumption is still hard-coded

Evidence:
- `src/runtime/progression/progressTrack.ts` correctly accepts `targetCount` and configured stage thresholds;
- however `src/game/act2RuntimeState.ts::withPresentedContribution()` still uses:
  - `Math.min(16, ...)`;
  - `complete: contributions >= 16`.

This means the claimed configurable target count is not end-to-end authoritative. A future track with a different target could still require chapter-local consumption logic.

**Required direction:** shared track consumption must own increment, idempotency, target clamping, completion and consumed beat IDs. Act 2 should provide definition/config only.

### 3. Project/track selection and completion reactions remain chapter-engine logic

Evidence in `src/game/act2RuntimeState.ts`:
- `selectedProject`;
- `canSelectProject()`;
- `withSelectedProject()`;
- project completion -> deselection;
- `consumedProjectCompletionIds`;
- `projectCompletionReactionPending()`;
- `consumeProjectCompletionReaction()`.

Project names and prerequisites are valid chapter configuration. The generic mechanics of selecting a track, preventing illegal switching, completing it, consuming a completion reaction exactly once and returning to selection are reusable runtime behavior.

**Required direction:** shared progress/project engine owns mechanics; chapter definitions own project IDs, order/prerequisites and authored reaction content.

### 4. Story presentation can still drift by chapter

Direct evidence in `src/app/globals.css`:

```css
/* Act 2 uses denser cinematic dialogue than the village cards. */
.act2-dialogue-card p {
  font-size: 0.82rem;
  line-height: 1.32;
}
```

Act 2 repeatedly passes `dialogueClassName="act2-dialogue-card"`.

This is precisely the historical failure mode the fuel principle exists to eliminate: chapter-local font/layout behavior.

There are also Act 2-specific fullscreen/title/history/end-card surfaces with their own z-index/layout styling.

**Required direction:** standard story typography, overflow, safe areas, navigation and layering must be owned by shared Story UI. Variation must be explicit semantic presentation variants, not chapter names or one-off CSS.

### 5. Standard naming/input behavior is not shared

Act 1 child/dog naming in `VillagePrototype.tsx` includes:
- `autoFocus`;
- Enter submit;
- validation;
- `autoComplete="off"`;
- `autoCorrect="off"`;
- `autoCapitalize="words"`;
- `spellCheck={false}`;
- `inputMode="text"`;
- `enterKeyHint="done"`.

Act 2 motorboat naming in `Act2Runtime.tsx` is a separate plain input and does not inherit those established semantics.

This is a concrete example of a future regression that the engine currently allows.

**Required direction:** shared Story input/naming beat/component with canonical mobile keyboard, focus, Enter, validation and save/busy semantics.

### 6. Story purchase engine does not yet own shop integration end-to-end

Good shared pieces exist:
- `StoryPurchaseDefinition`;
- shortfall calculation;
- exit semantics;
- shared handoff URL parsing/construction.

But the actual host shop integration remains embedded in the enormous `VillagePrototype.tsx` with Act 2-specific state and imports, including Act 2 purchase-needed/owned flags, Act 2 purchase story state and return project handling.

A future Act 3 purchase would likely require more chapter-specific branches inside the Village shop.

**Required direction:** Story Shop should consume generic story-purchase definitions/requirements and generic handoff context. Adding an Act 3 story item should normally be data/registration, not new Village UI state and branching.

### 7. Chapter persistence host is still Act 2-specific

`src/game/act2RuntimeState.ts` directly owns:
- Capacitor Preferences access;
- child-scoped key construction;
- legacy-key migration;
- parsing;
- normalization;
- load/save/clear.

The shared Save/Migration layer currently provides sequential migration mechanics, but not a generic chapter-state persistence host.

A future Act 3 would otherwise create another `loadAct3RuntimeState/saveAct3RuntimeState` storage implementation.

**Required direction:** generic child-scoped chapter persistence adapter/host with chapter key/version/normalizer/migrations supplied as configuration. Persisted chapter-specific fields remain chapter-owned.

### 8. World/Area Engine is not yet sufficient to prevent another `createAct3...Game.ts`

Current shared world layer contains useful primitives:
- movement intent;
- camera;
- viewport;
- depth.

But `createVillageGame.ts` and `createAct2LakeGame.ts` remain separate Phaser runtimes with duplicated/general concerns:
- scene lifecycle;
- player/dog creation/follow;
- keyboard/touch plumbing;
- camera follow;
- input enable/disable;
- interaction plumbing;
- entity labels/prompts;
- movement loop structure.

The movement models can legitimately differ (Village A* vs Lake direct movement), but the runtime host should not have to be recreated for every act.

**Required direction:** shared area/world runtime shell plus pluggable movement/collision/navigation adapters. Geography, collision data and movement strategy remain area-specific.

## P1 — strong readiness gaps

### 9. Story sequencing remains heavily hand-driven in chapter runtime

Although `StoryRunner`, `StoryMoment` and Story Registry are shared, Act 2 manually owns many line indices and next/previous functions:
- opening line/index;
- Alve intro index;
- contribution line index;
- completion line index;
- finale line/index;
- cabin revisit line index;
- history replay line index.

Some are valid domain state, but the repeated sequencing machinery is established behavior.

**Required direction:** shared sequence/beat controller for ordinary linear story flows with restart-safe position. Chapter content supplies beats and completion callbacks.

### 10. Story History data is shared, presentation is not

`storyHistory.ts` is generic, but `Act2Runtime.tsx` builds its own:
- group mapping;
- overlay;
- panel;
- grid;
- replay navigation;
- Act 2-specific CSS.

**Required direction:** shared Story History panel/replay surface fed by registry + progress adapter.

### 11. Chapter intro and end-card presentation are still custom

Act 2 renders its own `act2-chapter-intro` and its own fullscreen end-card JSX/styles.

A future chapter could easily create different spacing, type, z-index, input behavior or button semantics.

**Required direction:** shared chapter title card and end-card components/configuration.

### 12. Backend chapter synchronization is embedded in Act 2 runtime

Act 2 directly polls `getChildGameState()` every 15 seconds and manually reconciles:
- world progression;
- wallet;
- story ownership flags.

Future chapters using the same backend authority should not create another polling/reconciliation loop.

**Required direction:** shared backend game-state subscription/polling hook/service with chapter selectors/adapters.

### 13. Debug/acceptance plumbing is Act 2-specific

Act 2 owns:
- `/act2-test`;
- hidden hold/tap launcher;
- reset logic;
- synthetic wallet/progress state;
- Act 2-specific debug buttons.

**Required direction:** common chapter debug harness driven by chapter definitions/fixtures. Unique chapter probes can extend it.

## Areas that already satisfy or substantially satisfy the fuel principle

These should be preserved and expanded rather than rewritten:

- StoryMoment / DialogueCard / StoryRunner base presentation;
- Story Registry identity/history primitives;
- GameUiShell base HUD component;
- chapter lifecycle primitives;
- chapter registry and next-chapter destination;
- chapter access/overlay shell primitives;
- progress-gate primitive;
- configurable progress-track normalization/next-step derivation;
- authoritative backend progress delta/backlog composition;
- StoryPurchaseDefinition and post-purchase exit semantics;
- shared purchase handoff URL construction/parsing;
- sequential migration primitive;
- interaction contract/priority/markers;
- camera/viewport/depth/movement primitives.

## What is valid chapter-specific content

The audit does **not** recommend turning everything into generic abstractions.

These remain fuel/content/adapters:
- dialogue, images, beats and authored copy;
- NPC identities and unique character behavior;
- project IDs/names and actual prerequisite graph;
- purchase item IDs/prices/copy;
- world maps/assets/placements/collision data;
- choosing A* vs direct movement as a configured movement strategy;
- unique mechanics that do not already exist elsewhere;
- unique reactions/content, while the once-only reaction mechanism is shared.

## Revised Runtime 1.1 completion gate

Runtime 1.1 may be declared complete only when an empty Act 3 skeleton can be created without copying established Act 1/Act 2 runtime behavior.

A minimal future chapter should need approximately:

1. chapter registration/metadata;
2. chapter state schema containing genuinely chapter-specific state;
3. story/content registry;
4. progression/project definitions;
5. purchase definitions if needed;
6. world/area data + movement/collision adapter;
7. genuinely unique mechanics.

It should **not** need new implementations of:
- chapter boot/runtime orchestration;
- standard story sequencing/UI/CSS;
- HUD or overlay arbitration;
- generic project consumption/completion mechanics;
- standard naming input;
- story-history UI;
- story-shop plumbing;
- child-scoped save/load/migration plumbing;
- backend polling/reconciliation;
- common world scene/input/player/dog lifecycle;
- standard debug harness.

## Recommended implementation order

1. **Shared chapter state/persistence + runtime host**
   - remove generic orchestration pressure from `Act2Runtime.tsx`.
2. **Finish progression/project engine end-to-end**
   - remove hard-coded 16 consumption;
   - shared selection/consumption/completion/reaction mechanics.
3. **Lock Story UI and standard interactive beats**
   - remove chapter-named typography/layout overrides;
   - shared naming/input;
   - shared title/end cards;
   - shared history panel.
4. **Finish generic Story Purchase integration into shop**
   - adding a purchase becomes registration/data.
5. **Shared backend game-state sync**
   - one authority/reconciliation path.
6. **World/Area runtime shell**
   - shared Phaser lifecycle/player/dog/input/camera/entity host;
   - pluggable A*/direct movement and area collision.
7. **Shared chapter debug harness.**
8. **Empty Act 3 skeleton proof**
   - build a non-content smoke chapter using only definitions/adapters;
   - if it requires copied engine logic, continue 1.1.
9. Full automated regression + browser preview.
10. Physical iPhone update-in-place acceptance with preserved save/backend.

## Status correction

Previous documentation called Runtime 1.1 **code-complete** at `c951702512e0794997716c56983ef05893d81120`.

That statement remains historically useful for the narrower extraction plan, but is **superseded as the product-readiness claim** by this audit and the fuel principle.

Current status:

**Runtime 1.1: implementation in progress / fuel-principle incomplete.**


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
