# Sysselcraft Visual Asset Prep

Status: **AMBIENT PROP PACK INTEGRATED · FIRST PLACEMENT PASS READY FOR REAL PLAYTEST**

This file records the current visual bridge work and the rules for continuing it without breaking gameplay.

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

## Current integration

The ambient pack is now data-driven through `src/game/worldDecor.ts` rather than being hard-coded ad hoc into the Phaser scene.

`OPENING_AMBIENT_OBJECTS` currently adds:

1. `laundry-line` beside the family-house area, outside the main approach;
2. `birdhouse` near the house/tree line;
3. `old-barrel` near existing practical storage clutter;
4. two `tree-stump` placements toward the outer village edges;
5. `puddle` as a low-depth ground detail away from the primary route.

`FIRST_DELIVERY_AMBIENT_OBJECTS` currently adds:

- `wheelbarrow` at the material/construction area only after the first delivery is complete.

This is deliberate. The wheelbarrow should not telegraph construction before the child earns the first visible consequence from an approved real-world quest.

No collision has been added for these props. Collision must remain separate from rendered bounds and should only be introduced if an actual playtest shows that a prop needs a physical footprint.

## Next visual iteration

The next visual step is not “add more stuff”. It is to validate the current composition on a real running build.

When native/browser verification capacity is available:

1. Verify pathfinding around all current ambient placements.
2. Verify click/tap targets and Y/base-depth sorting.
3. Confirm the first-delivery wheelbarrow appears/restores from persisted state without replaying the delivery event.
4. Capture a real screenshot from the running game.
5. Use that screenshot to identify empty/noisy regions before drawing more assets.
6. Only after composition is stable, begin replacing SVG bridge assets with coherent raster PNG/WebP sprite atlases.

Until then, additional visual work should focus on reusable assets, state-driven placement rules and production-pipeline preparation rather than speculative clutter.

## Production art migration

Long-term art direction remains:

- fixed native pixel grid;
- nearest-neighbour scaling;
- consistent palette and light direction;
- sprite atlases rather than many independent production SVGs;
- collision footprints defined separately from rendered bounds.

The ambient pack is therefore useful both immediately and as reference material for the later raster redraw.
