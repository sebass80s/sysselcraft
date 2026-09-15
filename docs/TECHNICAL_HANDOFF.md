# Sysselcraft Technical Handoff

> Current-state sections and `docs/NOVA_HANDOFF_MANIFEST.md` supersede stale historical assumptions.

## Autonomous execution law (LOCKED 2026-09-15)

**When the user says `kör`, `kör på`, `bara kör`, `bygg på nu`, `fortsätt` or equivalent after a direction has been established, Nova must continue advancing the actual project autonomously until there is a genuine blocker that requires the user.**

Default sequence: verify current state -> implement -> run safest checks -> inspect evidence -> fix autonomous issues -> continue. Truth remains above momentum. Never invent runtime evidence or endanger valuable local/iOS/uncommitted work.

Short user shorthand: **`Kör hela vägen` means carry the current agreed direction through implementation and verification as far as safely possible before returning.**

## Visual/rendering architecture

Canonical visual direction is `docs/ART_DIRECTION.md`: soft, warm, organic, detailed, painterly isometric storybook art. There is no pixel-art target.

### True 2.5D rendering contract

Treat render bounds, ground/base point, occlusion/depth base, collision footprint and interaction footprint as separate concepts. Player, dog, NPCs and substantial objects use spatial Y/base depth. Tall objects must allow believable front/behind traversal. Navigation/collision stays independent from artwork size.

Terrain is visually continuous, pathfinding grid invisible, shadows soft and grounded, and the scene must read as one coherent illustrated place rather than a bag of sprites.

Phaser remains the renderer/gameplay engine. React + Phaser remains inside Capacitor for iOS/Android.

## Multi-area village world architecture (LOCKED 2026-09-15)

Sysselcraft grows through multiple connected world areas, not an indefinitely expanding mega-map or level-select menu. The current 1920x640 village is the opening area. Areas connect through physical world exits such as roads, paths, bridges or forest openings. Cross-area progression belongs to persistent domain state, not a Phaser scene.

## Village life / event architecture (DESIGN DIRECTION 2026-09-15)

Future resident life should be driven by a small **Village Event Director**, not a pure random-event engine and not hard-coded ad-hoc timers inside Phaser scenes.

Core principle:

> **NPCs are residents, not buttons.**

Residents should sometimes be visibly occupied even when they have no quest or required dialogue for the player.

### Three event layers

1. **Story events** — deterministic/progression-owned events such as Henning's arrival. These fire because narrative/world conditions are satisfied, not because of random chance.
2. **Village events** — authored, state-aware scenes such as one of Henning's recurring schemes. Randomness may choose among currently valid candidates, but randomness never decides what is narratively valid.
3. **Ambient activities** — deliberately small pieces of everyday life. Examples: Henning sweeps outside the bakery, carries a tray, feeds birds or chats with Linus; Sol walks with coffee, reads outside the clinic or greets the puppy; Linus sits near the well or walks a familiar route. Most require no dialogue modal and should reuse ordinary movement/idle capabilities where possible.

Shorthand:
- Ambient = **the village is alive.**
- Village event = **what are they doing now?**
- Story event = **something important changed.**

### Director inputs and memory

The Director should evaluate persistent world state rather than roll blindly. Candidate inputs include:
- current residents and unlocked buildings/areas;
- narrative/progression prerequisites;
- event history and seen counts;
- cooldowns;
- recent event tags/categories;
- novelty/repetition suppression;
- optional authored weights/chance among otherwise valid candidates.

Illustrative event data shape only:

```ts
{
  id: "henning_giant_cinnamon_bun",
  cast: ["henning"],
  requires: { residents: ["henning"], bakeryStage: 4 },
  cooldownDays: 14,
  weight: 1,
  once: false,
  tags: ["henning_scheme", "comedy"],
  scene: "giant_cinnamon_bun"
}
```

Persistent history should make rules such as these possible:
- avoid two large Henning schemes back-to-back;
- prefer unseen or less-recent activities;
- do not use Sol/Henning joint scenes before Sol exists and their relationship has had time to form;
- allow quiet periods after major story events;
- never replay a one-shot narrative event;
- avoid making one resident dominate village life merely because they have many authored scenes.

### Ambient implementation philosophy

Ambient activities should be cheap content. They do not need to become quests, reward systems or elaborate bespoke animations.

A useful future pattern is reusable **activity points + behaviors**: e.g. `Henning + bakeryDoor + idle`, `Linus + well + sit`, `Sol + clinicDoor + idle`, or `Henning + Linus + well + conversation`. Residents can move between valid activity points, remain there for an authored/randomized duration and use existing idle/movement presentation.

The important effect is that a resident is not permanently nailed to one questgiver coordinate.

### Architectural boundary

The Director belongs above Phaser in domain/game state. Phaser presents the selected activity/event but should not own the narrative decision that it occurs. Event history/cooldowns should persist through the same durable state boundary used for village progression.

This is a **future architecture direction, not current MVP implementation priority**. Do not build the full Director before the visual PoC and first recycling progression arc are proven. When implemented, start with a minimal state-aware selector and a handful of ambient activities rather than a generalized simulation framework.

## Visual acceptance gate

Do not declare the visual redesign finished from source inspection alone. Validate locally and then on a physical landscape iPhone. The scene must read as soft illustrated isometric storybook + genuine 2.5D while preserving gameplay clarity.

## Quest-source architecture

Product law: **quests belong to the world, not to the house.** The family house is one quest source. Sources may later be NPCs, buildings, places, world objects or system/world events. UI-like markers remain directly tappable/clickable.

## First-quest onboarding correction

Required sequence:

`Linus dialogue -> Linus tells child to go to family house -> return to world -> house quest marker is next destination -> player interacts with house/marker -> first quest opens`.

Do not alter verified backend/approval/delivery semantics while implementing it.

## Native architecture

Keep React + Phaser in Capacitor for iOS/Android. Supabase provides accounts, household/child, parent-created quests, pairing and server-authoritative rewards. Web/Vercel remains preview/fallback.

Capacitor/iOS already exists locally and has run on a physical iPhone. Do not run `npx cap add ios` again.

## Physical iPhone baseline (2026-09-14)

Physically verified end-to-end:

`Linus -> first quest -> parent mode -> approval -> truck arrives -> delivery completes -> truck departs -> building materials + wheelbarrow remain -> free movement/current content boundary`.

Treat this as regression baseline during visual work.

## Core invariants

- Tap-to-move/pathfinding + desktop WASD/arrows.
- Quest lifecycle `available -> pending -> approved`, or pending back to available.
- No rewards/progression before adult approval.
- Interaction law: **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**
- UI-like world elements may be directly tapped/clicked.
- Do not bury product/domain logic in Phaser.
- Public repo: never commit secrets/private family data/service keys/private env.

## Current technical priority

1. Complete playable v4 visuals toward storybook + true 2.5D canon.
2. Preserve first-quest onboarding and physical parent approval/delivery loop.
3. Re-test scale, depth, taps, safe areas, occlusion, animation and performance on physical iPhone.
4. Then remove the post-delivery dead end with the locked Linus -> recycling stage 1 progression.
5. Village Event Director remains intentionally later; do not let it steal MVP focus.

## Deployment/resource policy

Local/native testing is default. Use Vercel only when a test genuinely needs network/web deployment or shareable remote behavior. Standard GitHub-hosted Actions for this public repo are approved autonomously; avoid paid/larger runners without approval.

## Nova + local Codex workflow

Nova owns continuity/product/design/architecture/review/task decomposition. Codex acts as local implementation hands. Protect local uncommitted work and `ios/`; do not reset, clean, stash, stage, overwrite, commit, push or deploy unrelated work. Prefer narrow tasks and local checks. Codex success statements are not runtime proof; Nova reviews evidence and browser/native behavior must still be tested where relevant.
