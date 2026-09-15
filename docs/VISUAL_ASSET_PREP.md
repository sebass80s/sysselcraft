# Sysselcraft Visual Asset Prep

Status: **V4 PAINTED WORLD MIGRATION IN PROGRESS**

This file records the current production-facing visual direction. Older SVG/pixel assets remain useful as prototype scaffolding while the real painted world is integrated, but they are no longer the visual target.

## Locked visual direction

Sysselcraft is an **illustrated isometric storybook world** with soft organic forms, substantial detail in vegetation and buildings, clear silhouettes, subtle shadows, and a painted rather than grid-bound expression.

The previous pixel-grid / nearest-neighbour direction is superseded.

Story/design guardrails:

- start village remains sparse and mildly neglected;
- family house should feel inhabited;
- nature and traces of previous village life may enrich the scene;
- future resident/building locations remain genuinely hidden until earned;
- do not use signs, foundations, glowing plots or other spoilers for future buildings;
- gameplay readability and collision always win over decorative placement;
- surprise is part of the reward.

## Prototype bridge assets

The SVG files under `public/assets/village/` are bridge assets from the earlier prototype. They may remain temporarily while individual systems move to v4 art. Do not redraw new production assets to match their pixel/crisp-edge style.

Existing ambient props such as the wheelbarrow, birdhouse, barrel, puddle and laundry line can continue to support the prototype where useful, but should eventually be replaced or repainted to match the locked storybook direction.

## Painted 2.5D building contract

A building image is not its body. Every production building must define these independently:

1. **render bounds / sprite** — the transparent WebP/PNG artwork;
2. **ground/base point** — where the building meets the world and from which depth is derived;
3. **collision footprint** — the physical ground area the avatar cannot cross;
4. **approach/interact points** — valid places the avatar can walk to when interacting with the building.

Roofs, signs, awnings, transparent margins and painted shadows must never accidentally enlarge collision.

The code-side contract lives in `src/game/worldBuildings.ts`.

## Current v4 building package

The prepared v4 package contains four normalized painted stages each for:

- recycling center;
- bakery;
- clinic.

The immediate PoC target is deliberately smaller than the whole construction arc: integrate **recycling stage 1** into the real Phaser runtime after the first approved quest / delivery, verify base point, depth and collision in browser, then verify the same build on the physical iPhone.

Stages 2–4 are production assets for the subsequent MVP construction loop, not a reason to enlarge the PoC patch.

## Phaser migration rules

- New painted assets use normal filtered/antialiased rendering. Do not configure the game around nearest-neighbour pixel art.
- Old SVG bridge assets may coexist during migration.
- Depth must follow the object's ground/base point, not its image height or top-left bounds.
- Collision and interaction geometry must be data, not guessed from texture dimensions.
- Preserve the proven tap-to-move/pathfinding behavior while swapping visual representation.
- Prefer WebP/PNG production sprites with transparency. Sprite atlases can be introduced when they materially improve loading/management; they are not a visual-style requirement.

## PoC completion gate

The v4 visual PoC is complete when a real painted building stage is running inside the existing Phaser village with correct depth/collision and the same result has been exercised on the physical iPhone through the existing Capacitor/Xcode project.

Do not restart the native migration and do not run `npx cap add ios` again.
