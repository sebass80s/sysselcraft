# Character visual refinement · 2026-09-14

This cable-free pass brings the currently playable characters closer to the original Sysselcraft concept art without changing movement, interaction logic or collision.

## Visual reference

The original concept art in the private development diary remains the source of truth. The character read at gameplay scale is especially clear there:

- **Linus** is an older village craftsman with a blue cap and work clothes, a broad white beard, sturdy dark footwear and a cane. His silhouette should feel warm and grounded rather than like a generic NPC icon.
- **The child avatar** has warm brown hair, a yellow top and dark blue trousers/shoes. The shape needs enough volume to remain readable against dense green vegetation while still belonging to the painted world.
- **The puppy** should read as a small warm-furred companion, not as a UI mascot sticker.

## Implemented

The pass repaints the existing runtime character family while preserving its technical contract:

- `child.svg`;
- `child-walk-a.svg` and `child-walk-b.svg`;
- `child-north-a.svg` and `child-north-b.svg`;
- `child-south-a.svg` and `child-south-b.svg`;
- `linus.svg` and `linus-idle-b.svg`;
- `dog-puppy.svg`.

The new art uses softer outline weights, internal gradients and highlights, clearer material groups and less flat sticker-like colouring. Linus receives a stronger blue-cap/blue-workwear/white-beard read based directly on the concept art.

## Preserved technical behaviour

- source canvas dimensions remain unchanged for each existing runtime key;
- animation texture keys remain unchanged;
- Phaser origins remain unchanged;
- movement speed, following behaviour and facing logic remain unchanged;
- interaction distance and pathfinding remain unchanged;
- collision remains independent from illustrated bounds.

## Device validation still required

On the next physical iPhone run, specifically check that:

1. Linus reads immediately as the concept-art character at native landscape scale;
2. the child remains legible against trees, bushes and dirt paths in every facing direction;
3. the two-frame walk cycles do not shimmer because of outline/volume changes;
4. the puppy remains distinct beside the child's feet and does not visually merge with road/grass detail;
5. no character feels visually oversized or undersized relative to the family house and props.

Do not change interaction footprints in response to richer silhouettes unless a real playtest demonstrates a usability problem.
