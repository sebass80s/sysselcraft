# Sysselcraft Art Direction

Status: **LOCKED · ISOMETRIC PIXEL-ART 2.5D OVERHAUL NEXT · 2026-09-14**

## Visual north star

Sysselcraft is a **rich isometric pixel-art 2.5D game world**. The target is a real spatial village with volume, readable building sides, layered vegetation, grounded characters, contact shadows, occlusion and strong depth sorting. It must feel like a place the child inhabits, not flat illustrations placed on a green surface.

The latest approved Sysselcraft target images from the 2026-09-14 design session are the immediate production target for rendering quality, depth, palette, material richness and classic cozy-RPG readability. The original concept art in the private development diary remains an important Sysselcraft identity reference for characters, cottage language, village mood and progression.

The next playable version should get as close to the approved target-image look as the existing React + Phaser + Capacitor architecture reasonably permits.

## Superseded direction

The interim illustrated-storybook/vector direction is superseded as the production target. Its gameplay integration work remains useful, but further visual polish must move toward the locked pixel-art 2.5D target rather than refining a flat storybook presentation.

The earlier mistake was not simply asset quality: the world read too flat. Pixel art alone is insufficient. **Spatial 2.5D depth is mandatory.**

The pathfinding grid remains a gameplay implementation detail and must not become a visible tile grid.

## Locked visual principles

- Detailed, warm isometric pixel art with classic cozy-RPG readability.
- True 2.5D presentation: visible object/building sides, height, overlap, foreground/background layering and believable spatial volume.
- Buildings, trees, characters and props must feel planted in the terrain through bases, contact shadows and correct occlusion.
- Y/base-depth sorting is a core visual system, not optional polish.
- Grass must not expose obvious tile seams or repeated wallpaper patterns. Use variation, transitions, overlays and irregular detail distribution to break repetition.
- Dirt roads and paths blend naturally into grass with irregular edges, worn transitions and local material variation.
- Vegetation uses multiple depth planes and varied silhouettes rather than repeated stamps.
- The family house retains the warm red Swedish-cottage identity established by concept art.
- Start village remains sparse, mildly neglected and incomplete. Do not copy the amount of content from a fully developed target image into the opening state.
- Progression should allow the same world to become denser, healthier, more colorful and more inhabited over time.
- Small landscape-iPhone readability wins over decorative noise.
- UI should increasingly belong to the same pixel-game language rather than look like generic web UI.
- Rendered bounds and collision footprints remain independent. A large tree crown does not imply a large collision block.
- Concept/target art wins over allegiance to an asset format.

## Quest visual language

Use familiar RPG world markers where they improve immediate comprehension:

- A classic **yellow question mark (`?`) above a character** may indicate that the NPC has something relevant to say or an interaction that advances discovery/onboarding.
- An **exclamation mark (`!`)** may identify an available quest or actionable quest source.
- Markers live spatially with their giver/source and must remain legible at native iPhone scale.
- Markers are UI-like world elements and may be directly tapped/clicked; the player should not be forced to walk across the map merely to activate the marker.

Linus is the first important use case for this language.

## Quest-source design law

**Quests belong to the world, not to the house.**

The family house is an early quest source, not a permanent universal quest terminal. Future quests may originate from:

- NPCs/residents;
- buildings;
- places/areas;
- world objects;
- system/world events.

New residents should therefore create new gameplay possibilities, not only decorate the village. Examples include Linus providing practical village quests and Sol later providing quests connected to the doctor/medical building.

Quest presentation must not teach the player that `quest = house`. Source identity should remain explicit in data/domain design so future questgivers do not require special-case rewrites.

## First-quest onboarding law

Physical iPhone QA on 2026-09-14 found one onboarding problem in the otherwise working first progression loop: immediately after the introductory Linus dialogue, the first quest currently opens automatically.

Required flow:

**Linus dialogue → Linus guides the child to the family house → return to world → house quest marker becomes the clear next destination → child taps/approaches the house/marker → first quest opens.**

The player must perform that world interaction themselves. This teaches movement, world navigation and quest-source language before the first task.

## Format policy

The destination look is pixel art, but implementation format remains pragmatic:

- Pixel-art PNG/WebP spritesheets/atlases are preferred for production characters, animated assets, terrain and repeated world art where they best preserve the target look.
- SVG may remain useful as source/construction material or for tooling, but production rendering must visually match the locked pixel-art target.
- High-resolution/generated source art may be reduced, cleaned and assembled into game-ready pixel assets.
- Keep reusable masters and derived runtime assets separate where practical.

Rule: **ship the format that best preserves the approved 2.5D pixel-art look and performs reliably on physical devices.**

## 2.5D overhaul scope

The next major visual batch is a coordinated overhaul, not a grass-only polish pass. It may touch:

1. terrain and anti-repetition strategy;
2. road/path geometry and transitions;
3. family house and future building language;
4. trees, bushes, flowers, rocks and ambient props;
5. child, Linus, puppy and movement frames;
6. delivery truck, materials and wheelbarrow;
7. contact shadows and grounding;
8. depth sorting/occlusion rules;
9. quest markers;
10. HUD/dialog/quest presentation where needed to harmonize with the game world.

Preserve backend, quest-state, approval and reward architecture while this visual work happens.

## Physical-device baseline before overhaul

The current first progression loop was tested successfully on a physical iPhone on 2026-09-14:

**Linus → first quest → parent mode → approval → truck arrival → material delivery → truck departure → materials + wheelbarrow remain → free movement/content boundary.**

This working loop is the regression baseline for the 2.5D overhaul. The known onboarding issue above must be fixed without breaking the rest of the sequence.

The same physical QA also confirmed visual shortcomings that the overhaul must address: obvious grass tiling/repetition, insufficient terrain transitions, flat world grounding and presentation that does not yet reach the approved 2.5D target.

## Validation law

Do not call the overhaul complete merely because source assets changed. Validate the running game, especially on physical iPhone:

1. world reads as genuine isometric 2.5D rather than flat layered art;
2. grass has no distracting tile grid/seams;
3. roads merge naturally into terrain;
4. house, Linus, child and puppy remain legible at native landscape size;
5. foreground vegetation and tall objects occlude correctly without creating misleading collision/tap behavior;
6. child can visibly move in front of and behind appropriate objects;
7. first-delivery before/after state remains unmistakable;
8. quest `?`/`!` markers are clear and spatially attached to their source;
9. UI/safe areas do not cover critical world detail;
10. animation and pixel rendering remain stable without shimmer or stutter;
11. the complete previously verified quest/approval/delivery loop still works.
