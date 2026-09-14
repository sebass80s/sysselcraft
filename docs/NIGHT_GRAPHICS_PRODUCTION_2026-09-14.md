# Sysselcraft Night Graphics Production Contract — 2026-09-14

Status: **PRODUCTION CONTRACT READY · ART GENERATION BLOCKED IN THIS AUTOMATION RUNTIME**

This document exists to make the next graphics batch deterministic and immediately integratable without touching the verified quest/approval/delivery loop.

## Truth boundary

The automation runtime used for this night pass does **not** expose the image-generation capability required by `docs/ART_DIRECTION.md`. Therefore no new recycling-centre, bakery, doctor-house, Henning, Sol, child-animation or Linus-animation image is marked complete here. Substituting hand-built SVGs, procedural placeholders, unrelated web images or deformed copies would violate the locked art-production method and the truth-before-momentum rule.

What *is* completed in this pass is the production contract, stable runtime filenames, four-stage visual briefs, character briefs, animation frame contract and automatic file/signature audit. This is intended to remove integration/design ambiguity once real painted assets are generated.

## Canonical visual target

Every asset below must belong to the same family as the verified hero master:

> En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.

Hard requirements:

- warm hand-painted children's-book rendering;
- coherent isometric/three-quarter camera with the current hero scene;
- genuine volume and visible faces, not front-facing stickers;
- soft coherent contact shadows;
- no pixel art, flat vector art, icon art, hard outlines or tile language;
- transparent background for separate buildings/characters;
- enough transparent padding that stage swaps and animation frames do not jump;
- one common base point per construction sequence / character sequence;
- preserve masters before runtime optimization.

## Runtime path contract

Runtime derivatives live under:

`public/assets/village/reboot/production/`

### Buildings

- `buildings/recycling-centre/stage-1.webp`
- `buildings/recycling-centre/stage-2.webp`
- `buildings/recycling-centre/stage-3.webp`
- `buildings/recycling-centre/stage-4.webp`
- `buildings/bakery/stage-1.webp`
- `buildings/bakery/stage-2.webp`
- `buildings/bakery/stage-3.webp`
- `buildings/bakery/stage-4.webp`
- `buildings/doctor-house/stage-1.webp`
- `buildings/doctor-house/stage-2.webp`
- `buildings/doctor-house/stage-3.webp`
- `buildings/doctor-house/stage-4.webp`

All four stages of one building must use the same transparent canvas dimensions, camera, footprint/base point and approximate bounding box. The construction grows *inside* the fixed canvas.

### Characters

Character master/reference files:

- Henning: `characters/henning/reference.webp`
- Sol: `characters/sol/reference.webp`
- child visual identity authority remains `/assets/village/reboot/child.webp`
- Linus visual identity authority remains `/assets/village/reboot/linus-painted.png`

For child, Linus, Henning and Sol, reserve two frames for every combination of:

- `idle-{north|south|east|west}-01.webp`
- `idle-{north|south|east|west}-02.webp`
- `walk-{north|south|east|west}-01.webp`
- `walk-{north|south|east|west}-02.webp`

This creates 16 runtime frames per character. Two frames is the minimum integration-safe first pass, not the final animation ceiling.

## Building progression briefs

### Recycling centre

Function: first-tier village service building focused on order/environment. It should feel useful, friendly and Scandinavian rather than industrial or municipal-grey.

**Stage 1 — site established**
- marked footprint / low foundation / compact earthwork;
- a small delivered timber/material pile integrated naturally;
- construction stakes and first structural pieces;
- unmistakably the start of a real building, not an empty dirt patch;
- no finished facade, signage or functional bins yet.

**Stage 2 — structure rising**
- timber frame and partial wall sections;
- roof structure only partly present;
- first sheltered sorting bay geometry readable;
- still clearly under construction;
- enough height to become a real occluder.

**Stage 3 — nearly usable**
- roof substantially complete;
- most walls/cladding installed;
- sorting bays/containers begin to read as intended function;
- small unfinished details remain: missing trim, open work area, construction material;
- should create anticipation rather than look abandoned.

**Stage 4 — finished**
- welcoming small Swedish village recycling centre;
- timber construction, painted/clad details compatible with hero-scene materials;
- clearly separated sorting points without turning into modern icon signage overload;
- modest vegetation / tidy ground integration appropriate to a completed civic place;
- visually satisfying but not grander than the bakery or doctor house.

### Bakery

Function: Henning's home/workplace anchor and first strong sign that village life is returning.

**Stage 1 — foundation and masonry start**
- footprint/foundation clearly placed;
- first low walls or timber framing;
- oven/chimney base may begin to establish the bakery identity without revealing a finished building;
- construction materials visible but composed.

**Stage 2 — recognizable building shell**
- walls rise substantially;
- window/door openings established;
- chimney structure clearer;
- roof framing partially built;
- same footprint/base as all later stages.

**Stage 3 — nearly a bakery**
- roof mostly complete;
- warm facade material and window frames installed;
- chimney finished or nearly finished;
- subtle bakery-specific exterior cue begins to appear, but storefront/signage is not fully dressed;
- a small amount of scaffolding/material remains.

**Stage 4 — finished bakery**
- cozy small village bakery with strong warm silhouette;
- practical rather than fantasy-candy-shop architecture;
- warm windows, chimney, restrained bread/bakery identity cue;
- storybook detail around entrance without clutter;
- should look like a place Henning genuinely works and lives around, not a UI icon for 'food'.

### Doctor house / clinic

Function: Sol's medical building and a second resident anchor. It should feel reassuring, competent and village-scaled, not a hospital.

**Stage 1 — site/foundation**
- compact clinic footprint established;
- low foundation and early timber/masonry pieces;
- construction material present;
- no giant medical cross or finished signage.

**Stage 2 — walls and frame**
- recognizable small house/clinic shell;
- wall planes and entrance location clear;
- partial roof frame;
- window openings established;
- proportions communicate welcoming human scale.

**Stage 3 — nearly finished clinic**
- roof substantially installed;
- most facade/cladding complete;
- entrance canopy/steps beginning to read;
- restrained medical identity starts to appear through architecture/detail, not cartoon-symbol overload;
- a few unfinished construction cues remain.

**Stage 4 — finished clinic**
- warm small Swedish village doctor's house/clinic;
- clean but not sterile;
- welcoming entrance, readable windows, subtle professional cue;
- visual personality compatible with Sol: organized, bright, competent, optimistic;
- can later support Linus visiting for his knee without needing a hospital-scale environment.

## Character briefs

### Henning

Story status: first new resident, baker. Treat with warmth and dignity.

Visual target:
- friendly adult/middle-aged-to-older male baker;
- broad warm presence and immediately readable silhouette;
- work clothes/apron with believable flour/bakery details, not costume parody;
- expression genuinely cheerful rather than clownish;
- storybook-painted treatment matching Linus and the hero scene;
- footwear and stance designed around a clear ground/base point;
- avoid chef caricature, huge toque or generic mascot design unless a restrained version genuinely fits the world.

Reference pose: relaxed 3/4 standing pose, full body, feet visible, transparent background, soft contact shadow either excluded or delivered as a separate optional layer.

### Sol

Story status: second new resident, young newly graduated doctor in her mid-to-late twenties; competent, warm, enthusiastic, organized, somewhat ambitious.

Visual target:
- young woman with friendly, confident posture;
- cute/charming in the sense of warm character appeal, never infantilized or sexualized;
- practical modern village-doctor clothing, potentially a light coat/cardigan/medical layer over everyday clothes;
- subtle medical cues such as stethoscope or small work bag, not oversized iconography;
- bright attentive expression;
- immediately distinct silhouette from child and other villagers;
- same painterly edge softness and isometric body perspective as Linus/Henning.

Reference pose: relaxed 3/4 standing pose, full body, feet visible, transparent background.

## Animation production contract

### General

Do not synthesize animation by stretching, rotating or warping one still image. Each frame must be a coherent repaint/generation of the same character identity.

Across a frame family preserve:

- head/face identity;
- clothing colors and garment construction;
- hair/facial hair;
- body proportions;
- camera elevation/perspective;
- light direction and painterly edge treatment;
- identical canvas size;
- stable foot/base placement.

### Child

Identity authority: current verified painted child.

First pass:
- idle north/south/east/west: 2 frames each with very small breathing/weight shift;
- walk north/south/east/west: 2 frames each with clear alternating leg/arm phase;
- west may eventually be derived by runtime flip from east only if visual asymmetry proves negligible, but the production contract reserves dedicated west frames so asymmetrical details are not accidentally lost.

### Linus

Identity authority: current verified painted Linus.

Important physical trait: Linus walks with a cane and has a troublesome knee. Animation must respect that rather than turning him into a generic bouncy NPC.

First pass:
- idle directions: subtle stance shift/cane-hand settling;
- walk directions: restrained cane-assisted walking cycle with consistent cane side and believable timing;
- no exaggerated limp comedy.

### Henning and Sol

The same 4-direction idle/walk frame contract is reserved now even if gameplay initially uses only idle. Producing the reference first is mandatory; animation frames are accepted only if they clearly remain the same person.

## Master-generation prompts

Use these as intent blocks together with the canonical Sysselcraft production prompt from `ART_DIRECTION.md`.

### Building-series suffix

"Create a four-stage construction progression sheet for the same exact building. One coherent isometric/three-quarter camera, identical footprint, identical transparent canvas and ground/base point in all four stages. Stage 1 is a genuine build start, stage 2 structure rising, stage 3 nearly complete, stage 4 finished. Each stage must be clearly different while preserving building identity and placement. Warm hand-painted Scandinavian children's-storybook world, genuine 2.5D volume, visible sides/roof geometry, soft natural contact, no pixel art, no flat vector/icon style, no UI labels, no characters, transparent background."

Use the building-specific brief above for recycling centre, bakery or doctor house.

### Character-reference suffix

"Full-body isolated character asset on true transparent background, same isometric/three-quarter camera and warm hand-painted storybook rendering as the approved Sysselcraft hero scene. Feet fully visible and aligned to a stable ground/base point. Clear silhouette at landscape-iPhone scale. No frame, no scenery, no UI, no text, no flat vector look, no pixel art."

### Animation-sheet suffix

"Create a tightly consistent animation/reference sheet of the exact same character identity. Preserve face, hair, clothes, body proportions, camera, palette and light across every frame. Separate full-body frames for north/south/east/west; idle and walking poses; stable foot/base registration; transparent background. These are production game frames, not concept variations."

## Acceptance gate before integration

For every delivered file:

1. right subject and stage/pose;
2. same art family as verified hero master;
3. coherent isometric perspective;
4. true transparency where required;
5. no clipped roofs, feet or shadows;
6. stable canvas and base point within each sequence;
7. WebP/PNG magic signature valid;
8. runtime derivative is large enough to avoid visible blur but not absurdly oversized;
9. construction stages swap without apparent translation/scale jump;
10. character frames read as the same person;
11. only after source/file QA: load in Phaser;
12. only after Phaser: call runtime status verified.

Run:

`node scripts/audit-reboot-production-assets.mjs`

This checks expected files and WebP signatures. It intentionally does **not** claim visual quality or runtime success.

## Integration boundary

`src/game/productionAssets.ts` owns stable filenames and reserved base points. It is not yet imported into `createVillageGame.ts`. That is deliberate: the current verified quest/approval/truck/material path remains untouched until actual assets exist and pass file QA.

Do not wire missing assets into preload. Do not add fallback old SVGs under the new production keys. Missing new art should be reported as missing.
