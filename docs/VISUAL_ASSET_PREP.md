# Sysselcraft Visual Asset Prep

Status: **AMBIENT PROP PACK READY TO INTEGRATE**

This file records visual work that is deliberately safe to prepare without changing gameplay/collision yet.

## Visual rule

The current village should become richer through **nature, traces of daily life and repair materials**, not by revealing future buildings too early.

Story/design guardrails:

- start village remains sparse and mildly neglected;
- family house should feel inhabited;
- the village should contain evidence that people once lived here;
- future resident/building reveals stay hidden until earned;
- gameplay/collision always wins over decorative placement.

## Ambient prop pack

Prepared under `public/assets/village/`:

- `tree-stump.svg` — old maintenance/forestry trace; useful near wild edges.
- `wheelbarrow.svg` — practical village/construction prop; especially useful around the first material site.
- `old-barrel.svg` — neutral storage/yard prop.
- `puddle.svg` — ground detail that can break up large grass areas without becoming an obstacle.
- `birdhouse.svg` — small sign of care/life, best near the family house or tree line.
- `laundry-line.svg` — makes the family house feel lived in after arrival.

These SVGs intentionally use the current prototype palette and `shape-rendering="crispEdges"` so they can coexist with the existing bridge assets. They are not the final raster production pipeline.

## Suggested first placements

Do not add collision for these unless a later playtest proves it is needed.

1. `laundry-line` behind/alongside the family house, away from the main path.
2. `birdhouse` near the family-house tree/fence line.
3. `wheelbarrow` at the construction/material site.
4. `old-barrel` beside existing crates/woodpile.
5. `tree-stump` near the wilder western/eastern edges.
6. `puddle` as a low-depth ground decal off the primary route.

## Next visual iteration

When Vercel/native testing capacity is available:

1. Integrate the ambient pack into `drawVillage()` in one batched visual pass.
2. Verify pathfinding, click targets and depth sorting.
3. Capture a real screenshot from the running game.
4. Use that screenshot to identify empty/noisy regions before drawing more assets.
5. Only after composition is stable, begin replacing SVG bridge assets with coherent raster PNG/WebP sprite atlases.

## Production art migration

Long-term art direction remains:

- fixed native pixel grid;
- nearest-neighbour scaling;
- consistent palette and light direction;
- sprite atlases rather than many independent production SVGs;
- collision footprints defined separately from rendered bounds.

The ambient pack is therefore useful both immediately and as reference material for the later raster redraw.
