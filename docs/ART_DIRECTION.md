# Sysselcraft Art Direction

Status: **LOCKED · ILLUSTRATED ISOMETRIC STORYBOOK WORLD · 2026-09-14**

## Visual north star

Sysselcraft is:

> **En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.**

This sentence is the canonical visual brief. Future visual work must preserve its meaning rather than substituting a genre label or asset technique for it.

The world should feel spatial, warm, handcrafted and inhabitable. It may use 2.5D techniques such as visible sides, height, overlap, foreground/background layering, contact shadows and Y/base depth sorting, but it must not look mechanically tiled or constrained to a visible isometric grid.

The original concept art in the private development diary remains an important Sysselcraft identity reference for characters, cottage language, village mood and progression.

## Superseded directions

A mandatory 16-bit/pixel-art look is **not** part of the current design. Pixel art is neither required nor forbidden as a technique, but the game must not be pushed toward crisp pixels, nearest-neighbour rendering or blocky geometry merely to satisfy a style label.

Likewise, the earlier flat storybook prototype is not sufficient simply because it is illustrated. The locked target combines the storybook expression with convincing spatial depth, organic terrain and rich environmental detail.

The pathfinding grid is an implementation detail and must remain visually hidden.

## Locked visual principles

- Illustrated isometric storybook character with a painted, organic expression.
- Soft organic shapes rather than obvious tile/grid geometry.
- Rich but readable detail in vegetation, buildings and important props.
- Strong, clear silhouettes that survive native landscape-iPhone scale.
- Subtle shadows and grounding rather than harsh block shadows.
- Genuine spatial depth through overlap, visible sides/height, foreground/background layering and believable volume.
- Y/base-depth sorting is a core spatial system.
- Grass and terrain must not expose obvious tile seams or repeated wallpaper patterns.
- Dirt roads and paths blend naturally into grass with irregular edges, worn transitions and local material variation.
- Vegetation uses varied silhouettes, scale and depth planes rather than repeated stamps.
- The family house retains the warm red Swedish-cottage identity established by concept art.
- The opening village remains sparse, mildly neglected and incomplete. Do not reveal later progression simply to make the first scene denser.
- Progression may make the same world denser, healthier, more colorful and more inhabited over time.
- Rendered bounds and collision footprints remain independent.
- The approved visual result wins over allegiance to any particular asset format or rendering technique.

## Quest visual language

Use familiar world markers where they improve immediate comprehension:

- A classic yellow question mark (`?`) above a character may indicate relevant dialogue or an interaction that advances discovery/onboarding.
- An exclamation mark (`!`) may identify an available quest or actionable quest source.
- Markers live spatially with their giver/source and remain legible at native iPhone scale.
- Markers are UI-like world elements and may be directly tapped/clicked.

Linus is the first important use case for this language. Marker styling should belong to the illustrated storybook world rather than defaulting to pixel-RPG presentation.

## Quest-source design law

**Quests belong to the world, not to the house.**

The family house is an early quest source, not a permanent universal quest terminal. Future quests may originate from NPCs/residents, buildings, places/areas, world objects or system/world events.

New residents should create new gameplay possibilities, not only decorate the village. Linus may provide practical village quests and Sol may later provide quests connected to the doctor/medical building.

Quest presentation must not teach the player that `quest = house`. Source identity should remain explicit in data/domain design.

## First-quest onboarding law

Required flow:

**Linus dialogue → Linus guides the child to the family house → return to world → house quest marker becomes the clear next destination → child taps/approaches the house/marker → first quest opens.**

The player performs that world interaction themselves. This teaches movement, navigation and quest-source language before the first task.

## Format and rendering policy

**There is no required bitmap-versus-vector format. Use what works best.**

- SVG/vector, PNG/WebP bitmap art, spritesheets, atlases or a hybrid are all valid.
- Choose per asset and system based on visual fidelity, animation needs, performance, memory use, scaling and reliability on physical devices.
- Preserve useful high-quality source masters separately from optimized runtime derivatives where practical.
- Do not introduce format rules that accidentally force the visual style toward pixel art or toward sterile vector art.
- Antialiasing, filtering and scaling policy should be chosen to preserve the illustrated painted target on physical devices.

Rule: **ship the representation that best preserves the approved illustrated isometric storybook look and performs reliably.**

## Coordinated visual overhaul scope

The current pixel-heavy intermediate build is a technical stepping stone, not the visual destination. The next coordinated visual pass may touch terrain, roads, buildings, vegetation, props, characters, delivery assets, shadows, depth/occlusion, quest markers and child-facing UI.

Preserve backend, quest-state, approval and reward architecture while visual work happens.

## Physical-device baseline

The first progression loop has been tested successfully on a physical iPhone:

**Linus → first quest → parent mode → approval → truck arrival → material delivery → truck departure → materials + wheelbarrow remain → free movement/content boundary.**

This is the functional regression baseline. Physical QA has also exposed visual problems including repetitive terrain, weak transitions and insufficient spatial grounding.

## Validation law

Do not call a visual overhaul complete merely because source assets changed. Validate the running game, especially on physical iPhone:

1. the world reads as an illustrated isometric storybook place with convincing depth;
2. terrain does not reveal distracting tile/grid repetition;
3. roads merge naturally into terrain;
4. house, Linus, child and puppy remain legible at native landscape size;
5. foreground vegetation and tall objects occlude correctly without misleading collision/tap behavior;
6. child can visibly move in front of and behind appropriate objects;
7. first-delivery before/after state remains unmistakable;
8. quest `?`/`!` markers are clear and spatially attached to their source;
9. UI/safe areas do not cover critical world detail;
10. rendering and animation remain stable without shimmer, blur or stutter;
11. the complete previously verified quest/approval/delivery loop still works.
