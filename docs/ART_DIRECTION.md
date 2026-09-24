# Sysselcraft Art Direction

Status: **LOCKED · SOFT ILLUSTRATED ISOMETRIC STORYBOOK WORLD · TRUE 2.5D · CONCEPT-ART-FIRST PRODUCTION · 2026-09-14**

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

## 🔒 CONCEPT-ART-FIRST PRODUCTION METHOD

This is the default production method for Sysselcraft graphics.

**The actual playable graphics should be produced with the same image-generation / painted illustration approach that creates the approved concept art. Do not attempt to approximate that look primarily by hand-constructing artwork from simple SVG primitives.**

The previous hand-built SVG approach proved useful for prototyping mechanics and spatial systems, but it tends to produce vector/clipart/sticker-like results and is **not the production visual target**.

### Canonical production prompt / intent

When creating actual Sysselcraft game art, use this intent:

> **Create the actual playable graphics for Sysselcraft with the same visual expression as the approved concept art. Use image generation / painted illustration for the artwork rather than hand-built SVG primitives. The target is a warm, hand-painted, illustrated isometric storybook world with soft organic forms, rich but tasteful detail, natural vegetation, clear silhouettes, subtle painted light and soft contact shadows. It must feel like one coherent children's-book illustration that can be explored, not separate game assets placed on a level. Use genuine 2.5D with one consistent isometric/three-quarter perspective, believable volume, visible sides and height, coherent ground contact and natural foreground/background occlusion. Avoid pixel art, retro RPG aesthetics, clipart, flat vector art, icon styling, hard outlines, visible tiles, grids, repeated stamps, front-facing sticker sprites and the superseded hand-built SVG aesthetic. First establish the opening village as a coherent high-resolution master scene in the approved Sysselcraft style, then derive/separate the layers and game assets Phaser needs while preserving the painted look. Adapt the rendering implementation to the art rather than forcing the art to resemble obsolete assets. If the running game looks more like a conventional 2D game than the approved concept art, the result is not accepted.**

Shortcut instruction for future Nova:

> **“Nova, måla Sysselcraft.”**

means: **approved concept-art quality → coherent master scene → production layers/assets → true 2.5D integration in Phaser → runtime visual comparison against the concept-art target.** It does *not* mean “draw more SVG icons.”

### Master-scene workflow

For a major environment or visual milestone:

1. **Paint the scene first.** Generate a coherent high-resolution master view of the environment in the approved visual style and camera perspective.
2. Treat that master as the visual authority for composition, palette, lighting, perspective, scale, material language, vegetation density and environmental storytelling.
3. Identify which parts must be dynamic or independently depth-sorted: player, NPCs, dog, quest markers, foreground occluders, buildings that change, delivery/progression objects and other interactive elements.
4. Produce or derive those elements as separate high-quality transparent assets/layers while preserving the master's rendering language.
5. Define explicit ground/base points, depth/occlusion bases, collision footprints and interaction footprints in game data/code. Do not infer all four from image rectangles.
6. Reconstruct the scene in Phaser with background/ground, midground, dynamic objects and foreground occlusion layers so it visually returns to the master-scene composition.
7. Compare a screenshot of the **running game** against the approved master/concept art. Fix the game until the family resemblance is immediate.
8. Only then optimize asset representation, atlas packing, raster size or rendering performance. Optimization must preserve the approved look.

### Asset-generation rule

Prefer generated/painted production masters for visually important assets and environments. SVG remains valid for UI geometry, invisible/debug geometry, simple technical overlays, masks or cases where it genuinely preserves the approved painted result. SVG is a file format, not forbidden technology. **Simple hand-built SVG primitives are forbidden as the default method for imitating concept-art illustration.**

When an asset must exist independently, generate/paint it in the **same perspective, lighting, palette, edge softness and material language as the master scene**. Do not independently invent a new camera angle for each object.

### “Looks like concept art” acceptance rule

The production target is deliberately demanding:

**A screenshot of the playable village should plausibly be mistaken for a frame of the approved concept art before the viewer notices that it is interactive.**

If we need to explain that the game is “supposed to look like the concept art,” the visual pass has failed.

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
- **Concept-art-first image generation / painted illustration is the default art-production method.**
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

- SVG/vector, PNG/WebP bitmap art, spritesheets, atlases or a hybrid are all valid runtime formats.
- For visually important production art, prefer the concept-art-first workflow above over constructing the illustration from simple SVG geometry.
- Choose runtime format per asset/system based on visual fidelity, animation needs, performance, memory use, scaling and reliability on physical devices.
- Preserve useful high-quality painted/generated source masters separately from optimized runtime derivatives where practical.
- Do not introduce format rules that accidentally force the visual style toward pixel art or sterile vector art.
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
3. **a playable screenshot plausibly reads as a frame from the approved concept art rather than as a conventional 2D game assembled from assets;**
4. terrain does not reveal distracting tile/grid repetition;
5. roads merge naturally into terrain and obey the common ground perspective;
6. house, Linus, child and puppy remain legible at native landscape size;
7. foreground vegetation and tall objects occlude correctly without misleading collision/tap behavior;
8. child can visibly move in front of and behind appropriate objects;
9. substantial objects show believable volume, visible faces and coherent contact with the ground;
10. first-delivery before/after state remains unmistakable;
11. quest `?`/`!` markers are clear, spatially attached and stylistically integrated;
12. UI/safe areas do not cover critical world detail and UI does not look like generic retro-game chrome;
13. rendering and animation remain stable without shimmer, blur or stutter;
14. the complete previously verified quest/approval/delivery loop still works.

## 🧪 2026-09-14 hero-slice proof of concept — PARTIALLY VERIFIED

The current experiment has moved beyond the earlier two-asset feasibility check, but **the full visual POC is not yet accepted**. For this project, POC means that one playable hero slice demonstrates the complete visible visual stack in the new standard, without old SVG/game-asset styling leaking through.

### Verified in the running Phaser game

- the coherent painted **master scene** renders sharply as the static visual authority for terrain, cottage, roads, permanent vegetation and fixed props;
- the painted **child avatar** renders and remains fully controllable with tap-to-move/pathfinding and keyboard movement;
- a separate painted **Linus NPC** renders correctly over the master scene and remains interactive;
- the player participates in Y/base-depth sorting;
- painted scenery from the master can be reused as a **masked foreground layer**, allowing the child to pass visibly behind and in front of master-scene objects without rebuilding those objects as flat SVG assets;
- this masked-master occlusion has been confirmed by the user in local runtime;
- collision/navigation remains independent of the artwork. The current collision shapes are deliberately rough POC geometry and are not accepted as final traversal tuning.

### Still required before the hero-slice POC can be called complete

- replace or remove every remaining visible legacy-style dynamic asset in the hero slice, especially the puppy and progression/delivery objects when they appear;
- finish the quest-marker/UI visual integration so the visible UI belongs to the same storybook language;
- ensure foreground/occlusion coverage is sufficient for the hero slice, not only the notice-board cluster used for the architecture proof;
- confirm the complete visible hero slice in runtime after those elements are integrated;
- preserve the already verified onboarding / quest / parent approval / delivery loop while doing the visual replacement.

### Current decision

**The static painted master-scene architecture is technically validated, including independent dynamic characters and real 2.5D foreground occlusion. The complete Sysselcraft visual POC remains IN PROGRESS until the whole visible hero slice uses the approved standard and is confirmed in runtime.**


## Runtime NPC asset standard — LOCKED 2026-09-24

This section is the production contract for every new resident/runtime character. Do not generate a realistic full-body character first and try to repair proportions in Phaser. The source artwork itself must match the established village cast.

### Proportion law

Runtime NPCs must use the same compact SysselCraft proportions already established by Linus, Henning and the child:

- **large readable head, compact torso, short limbs and broad silhouette**;
- target overall visual proportion is approximately **3.0–3.5 heads tall**, never realistic 6–8-head anatomy;
- head width should read at roughly **35–40% of shoulder/body width** in the final village view;
- hands, shoes/boots, hair silhouette and signature props may be slightly oversized so identity survives at native landscape scale;
- legs must be visibly shorter than realistic anatomy. Avoid narrow elongated hips/legs and fashion-illustration silhouettes;
- pose should be stable and readable at small scale, normally a relaxed 3/4 stance rather than a straight photographic pose.

### Rendering/style law

- Match the **painted storybook / soft CGI-isometric** language of the current master scene and accepted runtime NPCs.
- Warm painterly shading, rounded forms, clear facial features and a readable outer silhouette.
- No pixel art, flat sticker/vector look, anime sprite-sheet look, photorealistic anatomy, or generic mobile-game chibi that conflicts with the existing cast.
- Character identity must remain consistent with canonical story/shop art. Clothing, hair, facial traits and signature accessories are not free to drift between story moment, shop portrait and runtime NPC.
- Runtime art must be authored as a **single isolated full-body character on true transparent background**, with no checkerboard baked into the pixels, no environment, labels, speech bubbles, UI, shadows extending far from the feet, turnaround panels or multiple poses.

### Runtime framing contract

- Include the complete character from hair/accessories to soles, with comfortable transparent padding on all sides.
- Feet establish the world anchor. Phaser runtime characters normally use an origin around **(0.5, 0.96)** so depth sorting follows the feet.
- Do not solve a bad source proportion by setting an extreme non-uniform display size. Runtime sizing is for matching world scale, not anatomical correction.
- As an initial integration baseline, established adult residents are roughly **100–130 px wide and 125–150 px high** in the current 640-high village view. Tune by physical-device screenshot against nearby residents, not by source-image dimensions alone.
- A new resident must be compared visually beside at least one accepted resident before the asset is considered integrated.

### Character-generation checklist

Before accepting any generated runtime NPC, verify all of the following:

1. Same character identity as canonical story/portrait art.
2. Approximately 3.0–3.5 heads tall and compact, not realistically proportioned.
3. Broad readable silhouette with short legs and slightly oversized identifying features.
4. Full body visible with feet intact and useful transparent padding.
5. True transparency and no baked background/glow/UI/text.
6. Painterly SysselCraft rendering compatible with Linus/Henning/master scene.
7. Still recognizable at approximately 125–150 px runtime height.
8. Physical iPhone screenshot confirms scale, proportions, grounding and cast consistency.

### Mira reference lesson

The first Mira runtime attempt on 2026-09-24 was rejected in physical iPhone QA because the artwork used near-realistic adult proportions. At village scale she appeared conspicuously tall, thin and stylistically foreign beside Linus, Henning and the child. This is now a documented failure mode: **never generate a realistic-proportioned runtime resident and rely on Phaser scaling to make it fit.**
