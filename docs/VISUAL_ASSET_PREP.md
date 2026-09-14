# Sysselcraft Visual Asset Prep

Status: **FIRST FULL STORYBOOK REDESIGN BATCH IMPLEMENTED · DEVICE QA NEXT**

Canonical direction is `docs/ART_DIRECTION.md`. The original concept-art image in the private development diary remains visual authority.

## What this batch changed

The previous crisp-edge/pixel bridge has been replaced across the current playable asset family with softer illustrated vectors using organic curves, warm natural materials, irregular terrain edges, tonal highlights and subtle grounding shadows.

Redesigned categories:

- family house;
- grass/terrain, dirt patches, road segments/bends/edges and footpath;
- oak, birch, pine, tree clusters, stump, bushes, foreground shrubs, wild grass and tufts;
- fence, stone wall, rocks and flowers;
- quest board and world-signage family;
- bench, crates, mailbox, lamp, well, woodpile, birdhouse, barrel, puddle and laundry line;
- child idle/walk/north/south frames;
- Linus idle frames and cane silhouette;
- puppy;
- truck, material stack, wheelbarrow and construction stakes.

The world-placement model remains data-driven through `src/game/worldDecor.ts`. Existing placements and collision footprints were intentionally preserved. No visual redraw grants permission to change gameplay geometry.

## Visual production rules

- No new `shape-rendering="crispEdges"` in production-facing storybook assets.
- Do not force nearest-neighbour scaling or disable antialiasing.
- Use a shared warm material language: moss/forest greens, faded Swedish-red timber, warm roof/wood/buff stone, parchment and muted gold accents.
- Keep outlines dark enough for small-screen silhouettes but avoid thick arcade/pixel contours.
- Ground important objects with soft low-opacity shadows rather than hard rectangular shadow blocks.
- Introduce detail through shape variation, layered tones and small material marks; avoid noisy microtexture that vanishes on iPhone.
- Repetition should be disguised through mixed species, scale and placement rather than random clutter.
- The start village stays sparse and a little neglected.

## UI integration

`src/app/storybook.css` now carries the child-facing React shell toward the same world using parchment surfaces, timber borders, forest greens and muted gold. `ChildBackendQuestInbox.module.css` has a matching direct treatment so the real backend quest panel does not retain a generic web-app skin.

The Phaser quest marker and renderer settings are part of this same direction: antialiasing should be enabled and the marker should use a softer illustrated token rather than a square pixel bubble.

## Performance policy

SVG is currently a productive source/runtime format for the prototype, not a dogma. Physical-device profiling decides whether complex/repeated assets should later be rasterized into PNG/WebP atlases. Preserve high-quality scalable masters when doing so.

## Device QA checklist

On the next physical/native pass:

1. compare the running family-house/vegetation slice directly with the concept art;
2. inspect road/path joins and visible repetition;
3. walk behind/in front of trees, house, Linus and props to verify depth;
4. verify clickable Linus/quest interactions after silhouette changes;
5. test the delivery sequence and persisted post-delivery state;
6. inspect child, puppy and Linus at actual iPhone scale;
7. inspect HUD, dialogue, local quest card and backend quest dock against safe areas;
8. note any asset that looks too flat, too clean, too dark or too busy for a second pass.

Do not add future residents/buildings merely to make screenshots denser.
