# Sysselcraft Art Direction

Status: **LOCKED · FIRST FULL STORYBOOK REDESIGN IMPLEMENTED · PHYSICAL VISUAL QA NEXT · 2026-09-14**

## Visual north star

Sysselcraft is an **illustrated isometric storybook world**: soft organic forms, rich detail in vegetation and buildings, strong readable silhouettes, subtle shadows and a painted rather than grid-bound expression.

The first established Sysselcraft concept-art image in the private development diary is the visual north star. It is a quality, mood, composition and materiality target, not a literal map or a background image to paste behind gameplay.

## Superseded direction

The earlier 16-bit/pixel-art production target, fixed native pixel grid, nearest-neighbour scaling, `shape-rendering="crispEdges"`, Phaser `pixelArt: true`, forced no-antialiasing and raster-only destination are superseded. They must not be reintroduced as defaults.

The pathfinding grid remains a gameplay implementation detail. The player should not visually feel that grid.

## Locked visual principles

- Warm illustrated isometric storybook world, inviting without becoming sugary or toy-like.
- Organic silhouettes: crooked trees, varied crowns, irregular grass edges, individual buildings and everyday imperfections.
- Red Swedish-cottage material language, warm roof, pale trim and lived-in details for the family house.
- Vegetation carries much of the mood before future buildings arrive.
- Subtle grounding shadows and layered light create volume without dramatic realism.
- Dirt roads and paths have irregular, softened edges and material variation.
- Start village remains sparse and mildly neglected. Richness comes from nature, age, repair traces and daily life rather than premature progression reveals.
- Small landscape-iPhone readability wins over ornamental density.
- UI belongs to the same world: parchment, timber, forest-green and muted gold rather than generic white app cards.
- Y/base-depth sorting and collision footprints remain independent of rendered silhouette.
- Concept art wins over allegiance to a file format.

## Format policy: hybrid by design

Use the source/runtime format that best serves appearance and performance:

- SVG/vector for editable organic construction, buildings, vegetation, props and UI where suitable.
- High-resolution painted raster where brushwork or texture benefits.
- Vector + raster texture hybrids where useful.
- PNG/WebP atlases for repeated, animated or complex art when Phaser/device performance benefits.
- Source masters remain scalable or high resolution.

Rule: **design in the medium that makes the art best; ship in the format that makes the game best.**

## Implemented first full redesign batch

The playable bridge library has now received a coordinated storybook pass rather than a one-asset style proof only. The batch covers the family house, terrain/grass, roads and path, oak/birch/pine/tree clusters, bushes and wild grass, fences and stone wall, quest board, child movement frames, Linus, puppy, delivery truck/materials, construction state and the current reusable ambient/everyday prop set. The main React game UI also receives a parchment/timber/forest-green storybook skin.

The redesign deliberately preserves existing dimensions/placement hooks closely enough to avoid rewriting pathfinding and state logic. Visual bounds may be richer; collision does not automatically follow them.

## Remaining validation law

Do not call the art direction finished merely because source files changed. The next required evidence is a running screenshot and physical iPhone pass. Validate:

1. family house reads as the concept-art cottage at gameplay scale;
2. vegetation looks organic rather than like repeated stamps;
3. paths visually soften the grid without confusing walkability;
4. characters remain legible at native landscape size;
5. depth sorting and tap targets still read correctly;
6. first-delivery before/after state remains unmistakable;
7. UI does not cover critical play space or lose readability;
8. SVG complexity performs acceptably on physical iPhone.

Use those observations for the second art pass. Do not drift back toward pixel art while correcting practical issues.
