# Start-area v4 visual QA gate

Use this after the v4 production assets have been integrated locally. This checklist is evidence-oriented: source code passing checks is not visual proof.

## Browser / Phaser pass

### First-glance composition
- The scene reads as one soft illustrated storybook world, not a painted background with stickers on top.
- The new `start-area-master-1920x640.webp` is the actual runtime master.
- Family house remains a clear opening anchor without dominating the whole camera.
- Central well/board area stays readable and navigable.
- Roads remain visually continuous and useful as movement corridors.
- No future building location is announced by a sign, empty foundation or suspicious construction plot before progression reveals it.

### Dynamic building calibration
Verify the candidate v4 calibration in the actual camera composition:

| Building | x | baseY | render | footprint |
| --- | ---: | ---: | --- | --- |
| Recycling | -180 | 500 | 330×236 | 190×72 |
| Bakery | 835 | 305 | 330×295 | 205×72 |
| Clinic | 1110 | 500 | 350×279 | 205×72 |

Check each visible stage for:
- fixed ground/base point across stages 1–4;
- no visual jump when stage changes;
- plausible scale relative to child, house and nearby landmarks;
- contact with ground rather than floating/sinking;
- no obvious perspective contradiction with the master;
- collision based on ground footprint, never the full image rectangle.

### True 2.5D
- Child passes behind a building when its base Y is spatially behind it.
- Child passes in front when spatially in front.
- The same rule survives tap/path movement, not only keyboard movement.
- Dog/NPC depth remains coherent.
- Tall art does not create invisible collision walls outside its ground footprint.
- Foreground occlusion, where present, strengthens depth without hiding required interaction targets.

### Navigation regression
From the normal spawn, verify reachable paths to:
- Linus;
- family-house first-quest interaction/approach area;
- the central village corridor;
- all space needed by the verified first-quest flow.

No old-background obstacle should remain merely because it existed before. Any static obstacle must correspond to geometry on the new master or a current dynamic object.

### Gameplay regression
Run the known sequence without changing product semantics:

`Linus -> house -> first quest -> parent mode -> approval -> truck -> delivery -> truck leaves -> materials/wheelbarrow remain -> free movement`

Specifically verify that the Linus dialogue returns the child to the world and clearly directs them to the family house before the first quest opens.

## Physical landscape-iPhone pass

Only after the browser pass is credible:
- safe areas do not cover critical world/UI elements;
- child, Linus, puppy and quest marker remain readable at native size;
- taps feel accurate near house/NPC/world markers;
- camera framing does not expose unintended blank world edges;
- building scale still feels coherent on the smaller physical screen;
- no texture blur, corruption, black boxes or visible asset loading failures;
- movement and Y-depth remain smooth enough during camera follow;
- full first-quest approval/delivery regression still succeeds.

## Decision language

- **Integrated**: code/assets are wired locally and mechanical checks pass.
- **Browser-verified**: the actual local Phaser runtime has been observed against this checklist.
- **iPhone-verified**: the physical-device pass has been observed.
- **Visual PoC GO**: only after the scene reads coherently as the intended storybook + true 2.5D world and the first-quest loop survives.

Never collapse these into one claim.