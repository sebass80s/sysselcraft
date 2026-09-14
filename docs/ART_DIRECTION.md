# Sysselcraft Art Direction

Status: **LOCKED · SOFT ILLUSTRATED ISOMETRIC STORYBOOK WORLD · TRUE 2.5D · 2026-09-14**

## 🚨 Visual canon — read before making or approving any art

Sysselcraft is:

> **En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.**

This sentence is the canonical visual brief.

The approved visual references are the **soft illustrated isometric storybook images created during the questgiver discussion**, including the scene language around Linus/questgivers. Those images express the intended finish: warm, gentle, handcrafted, richly vegetated, spatial and painterly. Future art should aim at that family of images, not at retro-game nostalgia.

### Hard anti-regression rule

**Forget pixel art as a design target. Do not turn Sysselcraft into a pixel-art, 8-bit, 16-bit, retro-RPG, tile-art or Space-Invaders-like world.**

Historical pixel-heavy assets and commits are implementation history only. They are not visual references. A future Nova must never infer the desired art style from those checked-in intermediate assets.

Do not use crisp pixels, nearest-neighbour scaling, chunky pixel outlines, blocky tile geometry, pixel-RPG UI or deliberately low-resolution sprites as an aesthetic direction.

## Visual north star

The world should feel like an illustrated children's adventure book that has become explorable:

- soft organic shapes;
- warm, natural color relationships;
- generous environmental detail without visual noise;
- vegetation with varied silhouettes, layers and small natural irregularities;
- buildings with character, material detail and readable shape language;
- clear friendly character silhouettes;
- subtle soft shadows and grounding;
- painted transitions between grass, dirt, roads and paths;
- convincing isometric spatial depth without exposing a construction grid;
- a cohesive handcrafted scene rather than a collection of game tiles.

The original concept art in the private development diary remains an important identity reference for characters, cottage language, village mood and progression. The later approved questgiver/storybook renders are the clearest reference for the desired softness and finished rendering language.

## TRUE 2.5D IS A HARD REQUIREMENT

Sysselcraft is not a flat top-down game decorated with isometric-looking sprites. **The playable village must read as genuine 2.5D space.**

Required spatial rules:

- Buildings and substantial props have visible fronts/sides, roofs/tops and believable height.
- The scene uses one coherent isometric/three-quarter projection language. Assets may be stylized, but their ground planes and visible faces must agree.
- Every tall world object has a defined ground/base point independent of the artwork's full bounds.
- Player, dog, NPCs and movable/delivered objects participate in Y/base-depth sorting.
- The child can visibly pass **behind** trees, buildings, signs and other tall objects when their base is farther forward, and **in front of** them when appropriate.
- Foreground foliage may deliberately occlude characters to sell depth, while collision remains defined independently.
- Contact shadows are anchored to ground/base points and help communicate height. Shadows must not behave like flat stickers baked around arbitrary sprite bounds.
- Roads and paths live on the ground plane. They must not look like rectangular cards laid on top of grass.
- Fences, walls, wells, stairs, porches, bridges and similar structures expose thickness/height where visible rather than reading as flat icons.
- Buildings should create readable spatial zones around entrances, sides and foreground edges. The family cottage is the first hero case.
- Collision/pathfinding remains a hidden gameplay layer. Visual perspective is not allowed to expose the grid.
- Rendered bounds, occlusion base, collision footprint and interaction footprint are separate concepts.

**2.5D describes the spatial construction of the world, not a pixel aesthetic and not merely Y-sorting.** A scene with flat front-facing stickers and Y-sorting alone does not satisfy this requirement.

### Perspective validation gate

A visual pass fails if any of these are true:

1. the world can be mistaken for a flat top-down field with stickers;
2. large objects do not show convincing volume or consistent visible faces;
3. the player cannot clearly move both in front of and behind tall world objects;
4. roads/terrain reveal rectangular asset bounds or contradictory ground planes;
5. shadows, bases and occlusion disagree about where an object touches the ground;
6. neighboring objects imply incompatible camera angles.

## Locked visual principles

- Illustrated isometric storybook character with a soft painted, organic expression.
- **True 2.5D spatial construction is mandatory.**
- Soft organic shapes rather than obvious tile/grid geometry.
- Rich but readable detail in vegetation, buildings and important props.
- Strong, clear silhouettes that survive native landscape-iPhone scale.
- Subtle shadows and grounding rather than harsh block shadows.
- Genuine spatial depth through overlap, visible sides/height, foreground/background layering and believable volume.
- Y/base-depth sorting is a core spatial system, but is only one component of true 2.5D.
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

- A yellow question mark (`?`) above a character may indicate relevant dialogue or an interaction that advances discovery/onboarding.
- An exclamation mark (`!`) may identify an available quest or actionable quest source.
- Markers live spatially with their giver/source and remain legible at native iPhone scale.
- Markers are UI-like world elements and may be directly tapped/clicked.

Linus is the first important use case. Marker styling must belong to the soft illustrated storybook world. **The semantics may borrow from RPGs; the rendering must not default to pixel-RPG presentation.**

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
- Antialiasing, filtering and scaling policy should preserve the soft illustrated painted target on physical devices.
- Rasterization for performance is a technical optimization, never permission to pixelate the visual language.

Rule: **ship the representation that best preserves the approved soft illustrated isometric storybook look and performs reliably.**

## Coordinated visual overhaul scope

The current mixed intermediate build is a technical stepping stone, not the visual destination. The coordinated visual pass must replace its flat/sticker-like scene construction across terrain, roads, buildings, vegetation, props, characters, delivery assets, shadows, depth/occlusion, quest markers and child-facing UI.

Preserve backend, quest-state, approval and reward architecture while visual work happens.

## Physical-device baseline

The first progression loop has been tested successfully on a physical iPhone:

**Linus → first quest → parent mode → approval → truck arrival → material delivery → truck departure → materials + wheelbarrow remain → free movement/content boundary.**

This is the functional regression baseline. Physical QA has also exposed visual problems including repetitive terrain, weak transitions and insufficient spatial grounding.

## Validation law

Do not call a visual overhaul complete merely because source assets changed. Validate the running game, especially on physical iPhone:

1. at first glance, the world reads as a **soft illustrated isometric storybook in true 2.5D**, not pixel art, a tiled retro game or a flat sticker field;
2. the running scene belongs visually with the approved questgiver/storybook reference renders;
3. terrain does not reveal distracting tile/grid repetition;
4. roads merge naturally into terrain and obey the common ground perspective;
5. house, Linus, child and puppy remain legible at native landscape size;
6. foreground vegetation and tall objects occlude correctly without misleading collision/tap behavior;
7. child can visibly move in front of and behind appropriate objects;
8. substantial objects show believable volume, visible faces and coherent contact with the ground;
9. first-delivery before/after state remains unmistakable;
10. quest `?`/`!` markers are clear, spatially attached and stylistically integrated;
11. UI/safe areas do not cover critical world detail and UI does not look like generic retro-game chrome;
12. rendering and animation remain stable without shimmer, blur or stutter;
13. the complete previously verified quest/approval/delivery loop still works.
