# Sysselcraft Technical Handoff

> Current-state sections and `docs/NOVA_HANDOFF_MANIFEST.md` supersede stale historical assumptions.

## 2026-09-14 visual/rendering architecture

Canonical direction is `docs/ART_DIRECTION.md`: **detailed isometric pixel-art 2.5D game world**. The interim illustrated-storybook/vector target is superseded.

### 2.5D rendering target

The next major visual batch must move the actual playable world toward the approved 2026-09-14 target images: visible spatial volume, building/object sides, contact shadows, layered vegetation, strong Y/base depth, foreground/background occlusion, rich pixel-art terrain and classic cozy-RPG readability.

This is not a cosmetic asset swap. Terrain, paths, world props, characters, depth presentation and UI may all require coordinated changes. Phaser and the existing gameplay/domain architecture remain in place unless a concrete blocker proves otherwise.

### Rendering laws

- Phaser remains renderer/gameplay engine; no engine rewrite implied.
- Rendered bounds and collision footprints remain separate.
- Y/base-depth sorting is authoritative for spatial overlap and is central to the 2.5D illusion.
- Do not change obstacles solely because artwork becomes wider/taller.
- The logical pathfinding grid remains visually hidden.
- Terrain must break obvious repetition/seams; do not expose a wallpaper grid.
- Pixel-art PNG/WebP spritesheets/atlases are preferred where they preserve the target look and perform well. SVG may remain source/tooling material where useful.
- Characters/props need grounding/contact shadows where appropriate.
- Physical iPhone screenshot comparison and interaction testing are required before declaring production art settled.

## Quest-source architecture

Product law: **quests belong to the world, not to the house.**

The family house is one quest source. The domain/rendering model must permit quest sources to be NPCs, buildings, places, world objects or system/world events without forcing house-specific special cases.

World quest markers use a familiar RPG language. A yellow `?` may mark an NPC with relevant dialogue/discovery; `!` may identify an available quest/actionable source. These markers are UI-like world elements and can be directly tapped/clicked under the established interaction law.

Do not encode future quest selection or presentation around an assumption that every quest originates at the family house.

## First-quest onboarding correction

Physical iPhone QA found that the first quest currently opens immediately after Linus' introductory dialogue. Change the sequence to:

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

Known functional QA issue: automatic first-quest popup after Linus, addressed by the onboarding correction above.

Known visual QA issues: grass reads as tiled/repetitive, terrain/path transitions need improvement, world reads too flat, and current presentation is materially short of the locked 2.5D target.

Treat this physical-device loop as a regression baseline during the visual overhaul. Backend/quest/approval/reward code should be kept in bubble wrap unless a concrete change is required.

## Core invariants

- Tap-to-move/pathfinding + desktop WASD/arrows.
- Quest lifecycle `available -> pending -> approved`, or pending back to available.
- No rewards/progression before adult approval.
- Interaction law: **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**
- UI-like world elements such as visible quest markers may be directly tapped/clicked without requiring the avatar to traverse the map first.
- Do not bury product/domain logic in Phaser.
- Public repo: never commit secrets/private family data/service keys/private env.

## Current technical priority

1. Execute the coordinated isometric pixel-art 2.5D visual overhaul described in `docs/ART_DIRECTION.md`.
2. Fix the Linus-to-house first-quest onboarding transition.
3. Preserve and regression-test the physically verified parent approval/delivery loop.
4. Re-test scale, depth, taps, safe areas, occlusion, animation and rendering performance on physical iPhone after the overhaul.
5. Continue backend reconciliation/state-authority work only with captured evidence and without destabilizing the verified loop.

## Deployment/resource policy

Vercel deployment quota is scarce. Non-main pushes may trigger previews, so batch coherent remote pushes and avoid burning deployments on small visual iterations. The 2.5D overhaul should be accumulated into a substantial coherent batch before Vercel verification.

Standard GitHub-hosted Actions for this public repository are approved autonomously. Avoid explicitly billed/larger runners or paid third-party compute without approval.
