# Painted production assets

This directory is the runtime destination for Sysselcraft's **concept-art-first** village graphics.

Do not fill these slots with hand-built SVG approximations. Production images must come from the approved painted/image-generation workflow in `docs/ART_DIRECTION.md` and preserve the master scene's perspective, lighting, palette and edge softness.

## Opening master decomposition

Ground / non-occluding:
- `opening-ground.webp` — continuous painted meadow + dirt roads/paths. No baked tall objects, UI, characters or quest markers.
- `opening-background.webp` — distant/non-interactive background vegetation and environmental depth that never needs to sort in front of the child.

Depth-sorted environment:
- `family-house.webp`
- `house-garden.webp`
- `linus-place.webp`
- `north-grove.webp`
- `west-grove.webp`
- `east-grove.webp`
- `foreground-west.webp`
- `foreground-east.webp`

Dynamic actors/state:
- `child-south-a.webp`, `child-south-b.webp`
- `child-north-a.webp`, `child-north-b.webp`
- `child-side-a.webp`, `child-side-b.webp`
- `linus-a.webp`, `linus-b.webp`
- `dog-puppy.webp`
- `truck.webp`
- `material-stack.webp`
- `delivery-site.webp`

All transparent assets must be exported tightly enough for memory efficiency but their runtime **base/depth/collision/interaction values come from game data, not from the image rectangle**.

## Master-scene rules

1. The painted master contains no baked UI.
2. The camera/perspective is locked before deriving assets.
3. Ground/road material is continuous and cannot reveal rectangular asset boundaries.
4. Anything the child must walk behind and in front of is separated from the ground layer.
5. Foreground foliage is intentionally separated for occlusion.
6. Character and NPC assets use the same lighting/perspective/material language as the environment.
7. Runtime screenshots are compared against the master. If the playable reconstruction loses the concept-art feel, the reconstruction is wrong.
8. Keep high-resolution source masters outside optimized runtime derivatives when practical.
