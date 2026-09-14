# Visual rebuild status

## Current state

The active village presentation has been rebuilt away from the old pixel/retro direction and toward the locked illustrated isometric storybook target.

Visual target:

> En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.

## Completed in the clean-slate pass

- Phaser renderer: `pixelArt: false`, `antialias: true`, `roundPixels: false`.
- Retro monospace world labels removed from the active village renderer.
- Stepped/pixel-style quest marker replaced by a soft animated storybook marker while preserving `?` / `!` semantics.
- Active HUD restyled toward parchment/wood storybook presentation.
- Meadow base expanded to a large painted 1024×1024 texture to reduce obvious repetition.
- Roads and footpaths repainted with organic edges and painted terrain blending.
- Family cottage repainted as the main hero building and reframed so the roof remains inside the opening world view.
- Linus and his idle frame repainted.
- Child avatar and all active movement frames repainted; the side-idle frame now keeps the side-facing silhouette instead of snapping visually back to a front pose.
- Puppy companion repainted.
- Oak, birch, pine and tree-cluster assets repainted.
- Bushes, foreground shrubs, meadow banks, flowers, grass tufts and dirt patches repainted.
- Fence, well, quest board, bench, crates, rocks, signpost, lamp, woodpile, mailbox and stone wall repainted.
- Delivery truck, material stack, construction stakes and wheelbarrow repainted.
- Ambient barrel, stump, puddle, birdhouse and laundry line repainted.
- Visual regression audit now protects the entire active village asset set from crisp pixel rendering.
- `createVillageGame.ts` has been restored to readable source formatting after the large visual pass so future gameplay changes are reviewable instead of hidden inside a minified diff.

## Preserved functional systems

The clean-slate pass intentionally leaves gameplay architecture intact:

- tap-to-move and pathfinding
- keyboard movement
- hidden collision/pathfinding grid
- Y/base depth sorting
- camera follow
- Linus onboarding interaction
- `?` on Linus before intro completion
- `!` at the family house after intro completion
- quest open flow
- dog visibility/following
- first approved quest delivery truck event
- delivered material persistence

## Fallback

See `docs/VISUAL_FALLBACK.md`. The pre-clean-slate mixed/pixel-heavy state is retained in Git history at:

`a477e0adf22c30eb1830edbf27afe60372d90a24`

## Next validation gate

Run the branch locally in the desktop browser and judge the first camera view as one composition. The next iteration should be based on the rendered scene, not on individual SVGs in isolation. After desktop composition is strong, perform the physical iPhone pass for scale, touch targets and performance.
