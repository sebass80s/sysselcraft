# Visual rebuild status

> **HISTORICAL INTERMEDIATE STATUS — SUPERSEDED 2026-09-15.**
>
> This document records the earlier clean-slate SVG/painted bridge and is useful project history, but it is **not the current visual implementation plan or evidence of current runtime state**. Current authority is `docs/ART_DIRECTION.md`, `docs/START_AREA_DESIGN.md`, `docs/TECHNICAL_HANDOFF.md` and `docs/V4_VISUAL_QA.md`. The current production direction uses the new 1920×640 painted start-area master plus normalized dynamic building assets and must still pass runtime/browser/iPhone verification.

## Historical state at the time of this pass

The village presentation had been rebuilt away from the old pixel/retro direction and toward the locked illustrated isometric storybook target.

Visual target:

> En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.

## Completed in that clean-slate pass

- Phaser renderer: `pixelArt: false`, `antialias: true`, `roundPixels: false`.
- Retro monospace world labels removed from the active village renderer.
- Stepped/pixel-style quest marker replaced by a soft animated storybook marker while preserving `?` / `!` semantics.
- Active HUD restyled toward parchment/wood storybook presentation.
- Meadow base expanded to a large painted 1024×1024 texture to reduce obvious repetition.
- Roads and footpaths repainted with organic edges and painted terrain blending.
- Family cottage repainted as the main hero building and reframed so the roof remains inside the opening world view.
- Linus and his idle frame repainted.
- Child avatar and all active movement frames repainted; the side-idle frame kept the side-facing silhouette instead of snapping visually back to a front pose.
- Puppy companion repainted.
- Oak, birch, pine and tree-cluster assets repainted.
- Bushes, foreground shrubs, meadow banks, flowers, grass tufts and dirt patches repainted.
- Fence, well, quest board, bench, crates, rocks, signpost, lamp, woodpile, mailbox and stone wall repainted.
- Delivery truck, material stack, construction stakes and wheelbarrow repainted.
- Ambient barrel, stump, puddle, birdhouse and laundry line repainted.
- Visual regression audit protected the active village asset set from crisp pixel rendering.
- `createVillageGame.ts` was restored to readable source formatting after the large visual pass.

## Functional systems intended to remain preserved

The pass intentionally left gameplay architecture intact:

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

These remain regression requirements, but this historical file must not be used as proof that a later local working tree still preserves them.

## Historical fallback

See `docs/VISUAL_FALLBACK.md`. The pre-clean-slate mixed/pixel-heavy state is retained in Git history at:

`a477e0adf22c30eb1830edbf27afe60372d90a24`

## Superseding validation gate

Use `docs/V4_VISUAL_QA.md` for the current browser/physical-iPhone evidence gate. The current production pass must be judged as one complete composition and as a true 2.5D runtime, not by inspecting individual source assets.