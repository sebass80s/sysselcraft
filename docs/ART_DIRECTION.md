# Sysselcraft Art Direction

Status: **LOCKED DESIGN DIRECTION · 2026-09-14**

## Visual north star

Sysselcraft is an **illustrated isometric storybook world**: soft organic forms, rich detail in vegetation and buildings, strong readable silhouettes, subtle shadows and a painted rather than grid-bound expression.

The first established Sysselcraft concept-art image is the visual north star. It is a quality, mood, composition and materiality target, not a literal map or a background image to paste behind gameplay.

## What changed

The previous production direction treated 16-bit-inspired pixel art, a fixed native pixel grid, nearest-neighbour scaling and eventual raster sprite atlases as goals in themselves. That direction is superseded.

Pixel art is **not** a product requirement. Crisp pixels and no-antialiasing are no longer visual laws. The isometric game logic may remain grid/pathfinding based internally, but the player should not feel trapped inside that grid visually.

## Locked visual principles

- Illustrated isometric storybook world, warm and inviting without becoming sugary or toy-like.
- Organic silhouettes: crooked trees, varied crowns, irregular grass edges, slightly individual buildings and everyday imperfections.
- Vegetation and buildings carry enough detail to make the village feel inhabited and specific.
- Subtle light and shadows create volume and depth without dramatic realism.
- Roads, paths, grass and terrain should visually soften or break the underlying gameplay grid.
- Start village remains sparse and mildly neglected. Richness comes from nature, materials, age and traces of daily life, not from revealing future buildings early.
- Readability on a small landscape iPhone remains mandatory. Detail must not become visual noise.
- Y/base-depth sorting and separate collision footprints remain core world rules.
- Concept art wins over allegiance to a file format.

## Format policy: hybrid by design

Sysselcraft does **not** require all art to be vector or all art to be bitmap.

Choose the source and runtime format that best preserves the target look and performance:

- SVG/vector is encouraged as editable source art for buildings, vegetation, props, icons and other assets that benefit from scalable curves and fast iteration.
- High-resolution painted raster is valid where texture, brushwork or organic detail is better expressed directly in pixels.
- Runtime assets may be rasterized to PNG/WebP textures or atlases when that improves Phaser batching, animation, memory predictability or device performance.
- UI icons/logos may remain SVG where appropriate.
- Animated characters, animals and repeated moving objects may use sprite sheets/atlases even if their source artwork began as vector.
- Hybrid assets are allowed: vector structure plus raster texture, exported to the runtime format that looks best.

The rule is: **design in the medium that makes the art best; ship in the format that makes the game best.**

## Technical implications

- Do not rewrite world state, pathfinding or collision simply because rendered silhouettes become softer or larger.
- Rendered bounds and collision footprints remain separate.
- Avoid assuming nearest-neighbour scaling. Antialiasing is allowed and often desirable for curves/diagonals in the storybook style.
- Preserve reusable asset architecture. The target is still a small amount of data producing a rich world.
- Benchmark complex SVG/runtime vector usage on physical devices before adopting it at scale. Phaser may still benefit from rasterized textures/atlases for frequently repeated or animated assets.
- Export resolution should support iPhone/iPad/web without visible softness; source masters should remain resolution-independent or sufficiently high resolution.

## Immediate art workflow

Do not continue polishing the current pixel-art bridge merely because it exists. The next visual task is a **style proof** using the first concept art as the direct target.

Build one representative slice containing:

1. family house;
2. two or three trees/vegetation forms;
3. grass/terrain and road/path edge;
4. fence/bush/small everyday prop;
5. representative lighting/shadow treatment.

No pixel-art constraint. Compare the running result to the concept-art north star on a real device. Use that proof to lock the practical production pipeline before redrawing the full asset library.

Existing SVG bridge assets remain useful for composition, placement, dimensions and gameplay integration. They are not sunk-cost justification for preserving the old pixel aesthetic.
