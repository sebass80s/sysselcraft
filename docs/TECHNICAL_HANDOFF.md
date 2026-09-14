# Sysselcraft Technical Handoff

> Current-state sections and `docs/NOVA_HANDOFF_MANIFEST.md` supersede stale historical assumptions.

## 2026-09-14 visual/rendering architecture

Canonical visual direction is `docs/ART_DIRECTION.md`:

> **En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.**

The approved questgiver-discussion renders define the intended visual family: **soft, warm, organic, detailed, painterly isometric storybook art**.

### Critical anti-regression note

There is **no pixel-art target**. Historical pixel-heavy builds are obsolete visual experiments/intermediates. Never optimize toward 8/16-bit aesthetics, crisp pixels, nearest-neighbour rendering, low-resolution sprite appearance, blocky tiles or pixel-RPG chrome merely because older assets use them.

There is also no mandatory bitmap/vector format. Use the representation that best achieves the approved look and performs reliably on physical devices.

## True 2.5D rendering contract

**2.5D is a hard product/art requirement, not shorthand for Y-sorting and not a pixel-art genre.** The world must read as a spatial illustrated place rather than a flat field carrying sprites.

### Projection and asset geometry

- Use one coherent isometric/three-quarter projection language throughout the village.
- Buildings and substantial props expose believable height and visible faces. A cottage should have readable wall planes, roof planes, foundation/porch thickness and a clear ground contact.
- Fences, stone walls, wells, porches, stairs, bridges, carts and similar objects need thickness/side faces when visible from the camera.
- Neighboring assets must not imply incompatible camera elevations or projection angles.
- Decorative stylization is welcome, but perspective contradictions are not.

### Base points, depth and occlusion

Treat these as separate data/concepts:

1. **render bounds**: full visible artwork;
2. **ground/base point**: where the object stands on the ground plane;
3. **occlusion/depth base**: point used to compare spatial front/back order;
4. **collision footprint**: physical blocked ground area;
5. **interaction footprint/target**: where an interaction can be activated.

They must not be conflated merely because a sprite has a rectangular image box.

- Player, dog, NPCs and relevant movable/delivered objects use Y/base depth.
- Tall static world objects participate in the same spatial ordering through their base points.
- The child must visibly pass behind a tree/building/prop when spatially behind it and in front when spatially in front.
- Foreground foliage can intentionally occlude characters to reinforce depth, while interaction/collision remain reliable.
- Y-sorting alone does **not** satisfy true 2.5D if the art itself still reads as flat stickers.

### Ground plane and terrain

- Terrain is visually continuous. The pathfinding grid is strictly invisible.
- Grass must not expose large repeated rectangles, tile seams or wallpaper repetition.
- Roads/paths are ground-plane material, not sprites/cards floating above grass.
- Dirt/grass edges should be organic, irregular and locally varied.
- Road segments that are technically separate must visually fuse into a continuous route.
- Avoid broad baked shadows/background fills inside road/prop assets that reveal their rectangular bounds.

### Shadows and grounding

- Contact shadows are soft and anchored around an object's base/footprint.
- Shadow direction/softness should be coherent enough that the scene feels illuminated as one place.
- Shadows communicate weight and height without becoming dark outlines around every sprite.
- Character/NPC/dog grounding should remain readable during movement.

### Scene composition

The target is a **cohesive camera composition**, not a bag of nice assets.

- Compose vegetation as masses and layers rather than evenly distributed stamps.
- Use foreground, midground and background vegetation to establish depth.
- Keep useful negative space for movement and readability.
- The opening village is intentionally sparse/mildly neglected, but should still feel deliberately illustrated rather than unfinished.
- The family cottage and yard are the first hero environment and should establish the perspective grammar for later buildings.
- Do not add arbitrary props merely to hide empty ground. Environmental detail should support place, story, depth or progression.

### Rendering implementation laws

- Phaser remains renderer/gameplay engine; no engine rewrite is implied.
- Renderer should use antialiasing appropriate to the soft illustrated art. Do not globally force pixel/nearest-neighbor rendering.
- Logical navigation/collision stays independent from artwork size.
- Do not change collision solely because artwork becomes taller/wider unless the ground footprint genuinely changes.
- SVG/vector, bitmap PNG/WebP, spritesheets/atlases or hybrids are all allowed.
- Runtime optimization may rasterize art but must not visually pixelate the result.
- UI should harmonize with the illustrated world and avoid generic retro-RPG chrome.

## Visual acceptance gate

Do not declare the visual redesign finished from source inspection alone. Validate the running scene locally and then on a physical landscape iPhone.

A pass fails if:

- first glance still reads as a flat top-down game with stickers;
- pixel/retro/tile aesthetics dominate;
- major objects lack convincing visible volume;
- child cannot clearly move in front of and behind tall world objects;
- neighboring objects imply conflicting perspectives;
- road/terrain reveals rectangular asset bounds or visible grid seams;
- shadows, collision and depth imply different ground contacts;
- UI overwhelms or stylistically contradicts the storybook world.

A pass succeeds only when the scene reads together as **soft illustrated isometric storybook + genuine 2.5D spatial depth** while preserving gameplay clarity.

## Quest-source architecture

Product law: **quests belong to the world, not to the house.**

The family house is one quest source. The domain/rendering model must permit quest sources to be NPCs, buildings, places, world objects or system/world events without house-specific special cases.

World quest markers use familiar language. A yellow `?` may mark an NPC with relevant dialogue/discovery; `!` may identify an available quest/actionable source. These markers are UI-like world elements and can be directly tapped/clicked under the established interaction law.

The marker semantics can be familiar RPG language while their visual treatment remains soft storybook illustration.

Do not encode future quest selection or presentation around an assumption that every quest originates at the family house.

## First-quest onboarding correction

Required sequence:

`Linus dialogue -> Linus tells child to go to family house -> return to world -> house quest marker is next destination -> player interacts with house/marker -> first quest opens`.

This correction must not alter the verified backend/approval/delivery semantics.

## Native architecture

Keep React + Phaser in Capacitor for iOS/Android. Supabase provides accounts, household/child, parent-created quests, pairing and server-authoritative rewards. Web/Vercel remains preview/fallback.

Capacitor/iOS already exists locally and has run on a physical iPhone. Do not run `npx cap add ios` again. Native loop: `git pull` -> `npm run ios:sync` -> Xcode App > iPhone > Run.

Wireless Xcode device debugging may work after initial pairing; cable remains useful for pairing/recovery.

## Physical iPhone baseline (2026-09-14)

The first currently playable progression loop has been physically verified end-to-end on iPhone:

`Linus -> first quest -> parent mode -> approval -> truck arrives -> delivery completes -> truck departs -> building materials + wheelbarrow remain -> free movement/current content boundary`.

Observed:

- quest can be opened from the house;
- parent mode triggers;
- parent approval succeeds;
- truck sequence triggers after approval;
- truck leaves correctly;
- delivered materials and wheelbarrow remain;
- player can continue walking after the current content boundary.

Known visual QA issues from the intermediate build included repetitive terrain, weak terrain/path transitions, sticker-like object placement and insufficient spatial grounding. Those screenshots are useful as **before/reference evidence**, not as visual targets.

Treat the physical-device loop as a regression baseline during visual work. Backend/quest/approval/reward code should be kept in bubble wrap unless a concrete change is required.

## Core invariants

- Tap-to-move/pathfinding + desktop WASD/arrows.
- Quest lifecycle `available -> pending -> approved`, or pending back to available.
- No rewards/progression before adult approval.
- Interaction law: **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**
- UI-like world elements such as visible quest markers may be directly tapped/clicked without requiring avatar traversal first.
- Do not bury product/domain logic in Phaser.
- Public repo: never commit secrets/private family data/service keys/private env.

## Current technical priority

1. Complete the playable visuals toward the **soft illustrated isometric storybook + true 2.5D canon** in `docs/ART_DIRECTION.md`.
2. Treat perspective, volume, base points, occlusion and ground-plane integration as architecture, not cosmetic polish.
3. Use the approved questgiver/storybook renders as the visual comparison family.
4. Preserve the Linus-to-house first-quest onboarding transition.
5. Preserve and regression-test the physically verified parent approval/delivery loop.
6. Re-test scale, depth, taps, safe areas, occlusion, animation and rendering performance on physical iPhone.
7. Continue backend reconciliation/state-authority work only with captured evidence and without destabilizing the verified loop.

## Deployment/resource policy

**Local/native testing is the default.** Use local browser for fast visual iteration and `npm run ios:sync` + Xcode/physical iPhone for native visual, UI and gameplay QA.

Use Vercel only when a test genuinely needs the network/web deployment, a shareable remote URL, or web-specific behavior. Do not spend Vercel deployments on routine local/native iterations.

Standard GitHub-hosted Actions for this public repository are approved autonomously. Avoid explicitly billed/larger runners or paid third-party compute without approval.
