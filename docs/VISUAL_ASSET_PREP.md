# Sysselcraft Visual Asset Prep

Status: **STORYBOOK ART DIRECTION LOCKED · STYLE PROOF NEXT**

Canonical visual direction is now documented in `docs/ART_DIRECTION.md`. Read that file before producing or converting visual assets.

## Visual rule

Sysselcraft is an **illustrated isometric storybook world** with soft organic forms, rich vegetation/building detail, strong silhouettes, subtle shadows and a painted rather than grid-bound expression. The first established concept-art image is the visual north star.

The village should become richer through nature, traces of daily life and repair materials, not by revealing future buildings too early.

Story/design guardrails:

- start village remains sparse and mildly neglected;
- family house should feel inhabited;
- the village should contain evidence that people once lived here;
- future resident/building reveals stay hidden until earned;
- gameplay/collision always wins over decorative placement;
- small-screen readability wins over decorative density.

## Existing ambient prop pack

Prepared under `public/assets/village/`:

- `tree-stump.svg`
- `wheelbarrow.svg`
- `old-barrel.svg`
- `puddle.svg`
- `birdhouse.svg`
- `laundry-line.svg`

These SVGs were created during the earlier pixel-art bridge phase and may still contain `shape-rendering="crispEdges"`. Treat that as legacy implementation, **not current art direction**. The files remain useful for placement, composition and gameplay integration until their visual treatment is replaced or refined.

## Current integration

Ambient placement remains data-driven through `src/game/worldDecor.ts`.

`OPENING_AMBIENT_OBJECTS` adds lived-in/neglected-world details around the family house and village edges. `FIRST_DELIVERY_AMBIENT_OBJECTS` adds construction stakes and wheelbarrow alongside the scene-created material stack after the first earned delivery.

Before the first approved quest, the construction area remains an empty, neglected patch rather than advertising a future building.

No collision is implied by rendered bounds. Collision footprints remain separate and should change only when gameplay evidence requires it.

## What remains valuable from the first visual refinement batch

The existing family house, terrain, trees, walls, fences, vegetation, props, first-delivery objects and puppy are valuable **bridge assets**. Their composition, dimensions, placement hooks and state integration should be reused where practical.

They are no longer a target style to polish indefinitely. The previous goal of converging on 16-bit pixel art is superseded.

## Next visual iteration: style proof

Do not begin a full-library redraw yet. Build one representative slice against the concept-art north star:

1. family house;
2. two or three trees / vegetation forms;
3. grass/terrain plus a road/path edge;
4. fence, bush and one everyday prop;
5. representative light and shadow treatment.

There is **no pixel-art constraint** for this proof. Curves and diagonals may be antialiased. Organic edges are desirable. The underlying pathfinding grid should become visually unobtrusive.

Validate the style proof in a running build, preferably on the physical iPhone, before committing to a bulk asset conversion.

## Production format policy

The old assumption that production must become raster PNG/WebP sprite atlases with a fixed native pixel grid and nearest-neighbour scaling is retired.

Use a hybrid pipeline:

- vector/SVG masters where scalable organic construction and fast iteration help;
- high-resolution painted raster where texture/brushwork is stronger;
- vector + raster texture hybrids when useful;
- runtime PNG/WebP/atlases for repeated/animated assets when Phaser performance or animation benefits;
- SVG may remain a runtime format for suitable static/UI assets if device testing supports it.

Format is an implementation choice, not the art direction. Preserve reusable assets, consistent light/material logic and separate collision footprints regardless of format.
