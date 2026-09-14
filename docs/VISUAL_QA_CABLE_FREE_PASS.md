# Cable-free visual QA pass · 2026-09-14

This pass records the visual work that can be validated safely without a physical iPhone or a new product decision.

## Source audit findings

The first full storybook redesign successfully removed the old pixel-rendering rules, but a second source-level audit found several residual implementation patterns that could still make the village *feel* more synthetic than the original concept art:

- the base meadow used a small 128 × 128 repeating texture, increasing the risk of visible wallpaper repetition across the 1920 × 640 world;
- dirt road and footpath art had organic centre lines but still read as assets laid on top of the meadow because their edges did not visually dissolve into grass;
- repeated bushes, wild-grass banks and tree assets relied on fairly uniform dark outlines and relatively flat internal colour masses, which could make repeated placements read as stamps;
- physical-device evidence is still required before changing placement density, collision footprints, world composition or gameplay geometry.

## Implemented refinement

The cable-free refinement batch keeps all gameplay and state architecture intact while improving the reusable visual language:

- enlarged the meadow master from 128 × 128 to 512 × 512 and replaced dense micro-pattern repetition with broad painted colour variation and sparse organic details;
- softened the grass/dirt transition on the road segment, road bend and footpath so paths visually sit *inside* the landscape;
- repainted the reusable bush and wild-grass bank with layered internal tones, less uniform silhouette treatment and richer small-scale vegetation;
- repainted oak, birch, pine and tree-cluster assets with gentler outlines, stronger internal light/dark grouping and more organic crown silhouettes;
- preserved approximate asset footprints and anchors so render-bounds changes do not silently become collision or pathfinding changes.

## Visual-direction regression guard

`scripts/audit-visual-assets.mjs` is now part of `npm run verify` and fails CI if the project reintroduces any of the following retired pixel-art defaults:

- `shape-rendering="crispEdges"`;
- CSS `image-rendering: pixelated` or `crisp-edges`;
- Phaser `pixelArt: true`;
- Phaser `antialias: false`;
- Phaser `roundPixels: true`.

The audit also validates that shipped SVG assets have an `<svg>` root and a `viewBox`, and guards the meadow master against shrinking back to a tiny high-frequency repeating tile.

## Deliberately unchanged

This refinement does **not** alter:

- quest logic or progression;
- backend/state ownership;
- pathfinding or the hidden 32 px navigation grid;
- collision footprints;
- quest interaction points;
- construction reveal timing;
- future buildings or NPCs.

## Physical iPhone evidence still required

When a cable is available, validate these in a real landscape run before making composition-sensitive changes:

1. no obvious meadow repeat or seam is visible while walking/camera-following;
2. road and footpath joins read as continuous terrain rather than stacked cards;
3. repeated vegetation no longer reads as obvious stamps at gameplay scale;
4. house, Linus, child and puppy remain immediately legible at native size;
5. tree crowns and foreground vegetation do not create misleading tap/collision expectations;
6. depth sorting remains convincing around tall vegetation and the family house;
7. the first-delivery before/after state is visually unmistakable;
8. HUD, dialogue and safe areas remain clear without covering important world detail;
9. SVG rendering remains smooth on the physical device.

Until that evidence exists, avoid speculative world-layout or collision changes merely to chase screenshots that have not been observed.
