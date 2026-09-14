# Sysselcraft Technical Handoff

> Current-state sections and `docs/NOVA_HANDOFF_MANIFEST.md` supersede stale historical assumptions.

## 2026-09-14 visual/rendering architecture

Canonical visual direction is `docs/ART_DIRECTION.md`:

> **En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.**

There is **no mandatory pixel-art style and no mandatory bitmap/vector format**. Use the rendering representation that best achieves the approved look and performs reliably on physical devices.

The pixel-heavy build produced during the 2026-09-14 visual iteration is an intermediate implementation, not the canonical destination.

### Spatial rendering target

The playable world needs convincing spatial volume: visible building/object sides where appropriate, grounding/contact shadows, layered vegetation, Y/base depth, foreground/background occlusion and organic terrain. This spatial depth must support the illustrated storybook expression rather than turn the world into a visible tile/grid system.

This is not merely an asset swap. Terrain, paths, world props, characters, depth presentation and UI may require coordinated changes. Phaser and the existing gameplay/domain architecture remain in place unless a concrete blocker proves otherwise.

### Rendering laws

- Phaser remains renderer/gameplay engine; no engine rewrite is implied.
- Rendered bounds and collision footprints remain separate.
- Y/base-depth sorting is authoritative for spatial overlap.
- Do not change obstacles solely because artwork becomes wider/taller.
- The logical pathfinding grid remains visually hidden.
- Terrain must break obvious repetition/seams and avoid a wallpaper/grid read.
- SVG/vector, bitmap PNG/WebP, spritesheets/atlases or hybrids are all allowed. Choose by result, performance and maintainability.
- Do not force nearest-neighbour/pixel rendering or crisp block geometry unless an individual asset genuinely benefits from it.
- Characters/props need subtle grounding/contact shadows where appropriate.
- Physical iPhone screenshot comparison and interaction testing are required before declaring production art settled.

## Quest-source architecture

Product law: **quests belong to the world, not to the house.**

The family house is one quest source. The domain/rendering model must permit quest sources to be NPCs, buildings, places, world objects or system/world events without house-specific special cases.

World quest markers use familiar language. A yellow `?` may mark an NPC with relevant dialogue/discovery; `!` may identify an available quest/actionable source. These markers are UI-like world elements and can be directly tapped/clicked under the established interaction law.

Do not encode future quest selection or presentation around an assumption that every quest originates at the family house.

## First-quest onboarding correction

Required sequence:

`Linus dialogue -> Linus tells child to go to family house -> return to world -> house quest marker is next destination -> player interacts with house/marker -> first quest opens`.

This correction must not alter the verified backend/approval/delivery semantics.

## Native architecture

Keep React + Phaser in Capacitor for iOS/Android. Supabase provides accounts, household/child, parent-created quests, pairing and server-authoritative rewards. Web/Vercel remains preview/fallback.

Capacitor/iOS already exists locally and has run on a physical iPhone. Do not run `npx cap add ios` again. Native loop: `git pull` -> `npm run ios:sync` -> Xcode App > iPhone > Run.

Wireless Xcode device debugging may work after initial pairing; cable remains useful for pairing/recovery.

## Physical iPhone baseline (2026-09-14)

The first currently playable progression loop has been physically verified end-to-end on iPhone:

`Linus -> first quest -> parent mode -> approval -> truck arrives -> delivery completes -> truck departs -> building materials + wheelbarrow remain -> free movement/current content boundary`.

Observed:

- quest can be opened from the house;
- parent mode triggers;
- parent approval succeeds;
- truck sequence triggers after approval;
- truck leaves correctly;
- delivered materials and wheelbarrow remain;
- player can continue walking after the current content boundary.

Known visual QA issues include repetitive terrain, weak terrain/path transitions and insufficient spatial grounding. The later pixel-heavy intermediate pass is not evidence that the visual target is complete.

Treat the physical-device loop as a regression baseline during visual work. Backend/quest/approval/reward code should be kept in bubble wrap unless a concrete change is required.

## Core invariants

- Tap-to-move/pathfinding + desktop WASD/arrows.
- Quest lifecycle `available -> pending -> approved`, or pending back to available.
- No rewards/progression before adult approval.
- Interaction law: **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**
- UI-like world elements such as visible quest markers may be directly tapped/clicked without requiring avatar traversal first.
- Do not bury product/domain logic in Phaser.
- Public repo: never commit secrets/private family data/service keys/private env.

## Current technical priority

1. Correct the playable visuals toward the illustrated isometric storybook canon in `docs/ART_DIRECTION.md`, replacing the accidental pixel-style lock-in while preserving useful spatial/depth work.
2. Preserve the Linus-to-house first-quest onboarding transition.
3. Preserve and regression-test the physically verified parent approval/delivery loop.
4. Re-test scale, depth, taps, safe areas, occlusion, animation and rendering performance on physical iPhone.
5. Continue backend reconciliation/state-authority work only with captured evidence and without destabilizing the verified loop.

## Deployment/resource policy

**Local/native testing is the default.** Use `npm run ios:sync` + Xcode/physical iPhone for normal visual, UI and gameplay QA.

Use Vercel only when a test genuinely needs the network/web deployment, a shareable remote URL, or web-specific behavior. Do not spend Vercel deployments on routine local/native iterations.

Standard GitHub-hosted Actions for this public repository are approved autonomously. Avoid explicitly billed/larger runners or paid third-party compute without approval.
