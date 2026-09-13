# Sysselcraft Technical Handoff

## Current implementation status

Sysselcraft has a playable first vertical slice and an active reusable visual-asset pipeline. The current visual milestone is commit `deaa350dde37f7fd367719de9df81bafcc23271f` (`Blend dirt road into richer terrain`). It follows `ad7b2605ad7e82c1d59813508625d859b8cc85a5` (`Animate village characters and assetize delivery event`).

GitHub Actions run #21 (`34743701915`) completed successfully for `deaa350...`. Vercel production deployment `dpl_D56UsfdME5jweTXsyGDh7keTJjKm` is READY. The public production alias `https://sysselcraft.vercel.app` returns HTTP 200. The user intends to replace the public alias with `https://syssel.vercel.app` later; do not claim that shorter alias is active until verified.

## Stack

- Next.js App Router + TypeScript
- Next.js 16.3.3
- React 19.2
- Phaser 3.90 for the village scene
- Vercel production connected to `main`
- Supabase planned, intentionally not connected yet
- GitHub repository: `sebass80s/sysselcraft`

## Repository / security / cost constraints

- Repository is public.
- Standard GitHub-hosted Actions runners are approved; avoid billed larger runners.
- Each push to `main` triggers a Vercel production build, so bundle related edits when practical.
- Target operating cost for normal family use is approximately 0 SEK/month.
- Never commit secrets, family data, Supabase service keys, private environment files, or child-identifying information.
- `.env*` is ignored except `.env.example`.
- Supabase remains intentionally disconnected until the gameplay/UX loop feels right.
- Next.js was upgraded from 16.0.0 to 16.3.3 after CI surfaced a security warning for the older release.

## Implemented vertical slice

1. Start village with family house, diagonal road, varied trees, Linus with cane, noticeboard, environmental props and an empty construction area.
2. Child avatar with tap/click-to-move.
3. Grid-based A*-style pathfinding routes around house, construction site and the original five tree obstacles.
4. Desktop WASD / arrow-key movement with collision checks.
5. Intro quest marker above the family house.
6. Intro quest: `Bädda sängen`.
7. Child submits quest and it becomes `pending`.
8. Temporary prototype adult-review panel exposes `Godkänn` and `Behöver kompletteras`.
9. Rewards are granted only after approval: current prototype values are 5 diamonds + 10 SysselBux.
10. Approval hides the quest marker and triggers a reusable pixel-truck asset toward the construction site.
11. Delivered construction materials use a reusable world asset and remain visible after arrival.
12. Linus reacts to the delivery and now also has a subtle idle frame change.
13. The child now has a simple two-frame walking animation and horizontal facing without changing the movement/pathfinding API.
14. Dirt road presentation is softened by a reusable grass-edge overlay plus small reusable grass tufts and dirt patches.

## Quest-state invariant

Current prototype state machine:

`available -> pending -> approved`

or

`available -> pending -> available` via `Behöver kompletteras`.

No currency or rebuilding event is granted while a quest is pending.

## Interaction invariant

Avatar = experience the world. Tap/click = use the interface.

The child may move freely while quest markers remain directly tappable, so routine UI never requires unnecessary walking.

## Current technical structure

- `src/components/VillagePrototype.tsx`
  - React shell
  - temporary local prototype quest state
  - resource HUD
  - quest card
  - prototype adult-review UI
- `src/game/createVillageGame.ts`
  - Phaser bootstrap
  - browser-only dynamic Phaser import
  - movement and collision
  - grid pathfinding
  - visual world composition
  - Y-based depth sorting for the player and world objects
  - lightweight character frame animation
  - reusable delivery assets
  - quest marker presentation
  - approval/truck world event
  - `WorldObjectDefinition` + `placeWorldObjects(...)` for declarative visual placement
- `public/assets/village/`
  - reusable visual assets loaded by Phaser
- `.github/workflows/ci.yml`
  - Node 22
  - `npm install`
  - ESLint
  - production Next.js build

Phaser is loaded dynamically in the browser so it is not imported into the Next.js SSR bundle.

## Visual asset pipeline

The concept art is the visual north star. It must not be used as a single giant background image. The target is recreated through reusable assets and world objects so village growth remains dynamic.

Current reusable asset inventory:

- `bench.svg`
- `child.svg`
- `child-walk-a.svg`
- `child-walk-b.svg`
- `crate.svg`
- `family-house.svg`
- `fence-segment.svg`
- `linus.svg`
- `linus-idle-b.svg`
- `quest-board.svg`
- `road-dirt.svg`
- `road-edge-grass.svg`
- `tree-oak.svg`
- `grass-tile.svg`
- `grass-tuft.svg`
- `dirt-patch.svg`
- `tree-birch.svg`
- `tree-pine.svg`
- `flower-patch.svg`
- `rock-cluster.svg`
- `signpost.svg`
- `lamp-post.svg`
- `woodpile.svg`
- `mailbox.svg`
- `truck.svg`
- `material-stack.svg`

SVG is currently used as a text-based bridge because the available GitHub workflow can write text assets directly. Long-term production direction is raster PNG/WebP sprite sheets/atlases with nearest-neighbour scaling, fixed native pixel grids and consistent palette/light direction.

## Current rendering architecture

- Grass is a reusable tiled texture rather than a grid of procedural rectangles.
- Dirt road remains a reusable rotated base sprite, now paired with `road-edge-grass.svg` to visually blend its edges into the terrain.
- `worldImage(...)` positions reusable world objects and sets depth from their base Y coordinate.
- `WorldObjectDefinition` currently centralizes `texture`, `x`, `y`, `scale` and `originY`; `placeWorldObjects(...)` renders groups declaratively.
- The next architectural extension should add explicit `baseY` and optional collision/interaction metadata rather than conflating visual anchor and footprint.
- The player updates depth every frame from its current Y coordinate, enabling foreground/background overlap during movement.
- Rendered sprite bounds are intentionally separate from pathfinding/collision footprints.
- The five original tree collision circles are unchanged even though their visual tree species vary.
- Small decorative props are visual-only for now and do not all have collision footprints.
- Truck and delivered materials no longer use procedural Phaser rectangles.

## Visual direction locked

- Warm, detailed, Swedish countryside pixel-art tone.
- Rich terrain/nature details without filling the start village with future buildings prematurely.
- Reusable assets over procedural rectangles for production-facing physical world objects.
- Depth and overlap should communicate space instead of relying on flat fixed draw order.
- The start village remains sparse and mildly neglected; its richness comes from materiality, vegetation and small lived-in details.
- Concept art is a target for mood, density, palette and craftsmanship, not an exact MVP map.

## Verified commit timeline

- `c0b83d14ff1e487ddda90373a475db666bfcd467` — Initial commit
- `5ce79ed2df38a0a8295b6995e9fa4fbcdee5d9c8` — Initialize Sysselcraft 0.1 prototype
- `24557a886525f08c34990042c346e741e300586e` — Add CI build and lint workflow
- `b7ef1207ef07cfc9409de10fbe100dac221b731c` — Fix CI bootstrap without lockfile
- `eb72baef347b40aeff19b5edbdd7288ecdf2a951` — Add pathfinding and collision to village prototype
- `2de5267f4cd20f65706cc2aea845e799796a7883` — Fix Phaser browser-only ESM loading
- `c9db491e3eda2fd9a76c9f011cddeacb6883b9fb` — Add first quest approval loop
- `5e4b6a64cc7b97f8fd9f5921568f775697106597` — Fix quest loop lint and patch Next.js
- `852247498c45a5d0056476d11814f3f6af5b24e3` — Update technical handoff after first playable loop
- `9984dd5fb33ce957a238aae8edb48ee9691c60fd` — Give village prototype its first pixel-art pass
- `986c6efde8ba132358434d30a9dec103134e830c` — Add detailed pixel-art environment pass
- `71d348cf2e4457b1b512bc0dd16a1ff94f1b689e` — Clean up family house pixel detailing
- `ea701cd3c7079bc74f1b433fe51abff98b2b36ff` — Add first reusable village pixel assets
- `ce50f7fcbdc3d9cde73f95f59344fa5e18447887` — Render family house from reusable pixel asset
- `44d16a246365577b345d5b7b251e4add15665053` — Add reusable character and tree pixel assets
- `70a969bbbea740522c505228ec27e7e79e55a283` — Render village characters and trees from pixel assets
- `0e07afa33650e594a75925175646ca1d2210cda8` — Add reusable village environment pixel assets
- `85a5c6ec10b4a1f1ae6359f958a86c599956cc0c` — Render village environment from reusable pixel assets
- `ee0b93d6214dd4ea2a2856357c2b7755a1d01a78` — Add richer reusable village environment assets
- `ba1cebca5ec134e88b0bbf5f14b01b45b7e005ba` — Build richer layered village scene — CI run #18 (`34726820231`) green
- `a29a78ce68d92c7c574872084ea08c2027c6ea6f` — Update handoff for layered village milestone
- `ad7b2605ad7e82c1d59813508625d859b8cc85a5` — Animate village characters and assetize delivery event — CI run #20 (`34743612329`) green; Vercel `dpl_HonfVeg813zQDUNRK8uCcyxvSkt6` READY
- `deaa350dde37f7fd367719de9df81bafcc23271f` — Blend dirt road into richer terrain — CI run #21 (`34743701915`) green; Vercel `dpl_D56UsfdME5jweTXsyGDh7keTJjKm` READY

## Production verification

Latest verified gameplay deployment before this documentation-only update:

- Commit: `deaa350dde37f7fd367719de9df81bafcc23271f`
- GitHub Actions: run #21 (`34743701915`) success
- Vercel deployment: `dpl_D56UsfdME5jweTXsyGDh7keTJjKm`
- Deployment URL: `https://sysselcraft-cqa2g0qdv-yourmovegame.vercel.app`
- Public alias: `https://sysselcraft.vercel.app`
- Vercel state: READY
- Public alias HTTP verification: 200 OK
- New deployed asset verification: `/assets/village/truck.svg` returned 200 with expected SVG content

The direct immutable deployment URL may be protected by Vercel authentication even while the public production alias is accessible. Use the public alias for normal human testing.

This verifies build/deployment availability, not graphical correctness of the Phaser canvas. Current tools do not provide full interactive visual browser QA. The newest visual pass still needs human/device visual confirmation.

## Known issues / limitations

- Character animation is intentionally primitive: two reusable walk-frame SVGs with horizontal flip, plus one alternate Linus idle frame. This is not yet a directional production sprite sheet/atlas.
- Movement is still 2D movement with Y-depth overlap, not a canonical isometric tile movement system.
- Road is still one rotated base sprite with a matching grass-edge overlay; there is not yet a terrain-aware path tile/edge/corner system.
- `WorldObjectDefinition` does not yet carry explicit `baseY`, collision or interaction metadata.
- Small decorative props do not all participate in collision/pathfinding.
- SVG is an asset-pipeline bridge, not the intended final raster sprite-sheet format.
- Quest/reward state remains local React state; no Supabase persistence.
- Parent review UI is explicitly temporary/prototype.
- No `package-lock.json`; CI intentionally uses `npm install`, not `npm ci`.
- No assistant-side full graphical browser validation is available; do not claim visual correctness without device/browser feedback.

## Next technical steps

1. Visually inspect the `deaa350...` build on a real device/browser and fix any obvious scale, overlap, animation or terrain-cohesion problems first.
2. Evolve character animation toward proper directional idle/walk frame sets and then a raster sprite-sheet/atlas pipeline, without changing pathfinding/movement semantics.
3. Extend `WorldObjectDefinition` with explicit visual `baseY`, optional collision footprint and optional interaction point while keeping existing obstacle behaviour unchanged until deliberately migrated.
4. Replace the single road-strip + overlay approach with reusable path/edge/corner pieces so road geometry can grow naturally with the village.
5. Improve the approval payoff using reusable effects/assets, stronger but tasteful Linus reaction and staged construction delivery.
6. Add the hidden intro progression contribution: Ordning & miljö 70%, Välmående & rutiner 30%, while preserving mandatory parent approval.
7. Keep state local until the UX is proven, then introduce Supabase persistence and household/child entities.
8. Generate/commit a package lock only when the dependency baseline is deliberately frozen, then switch CI to `npm ci`.

See `docs/NOVA_HANDOFF_MANIFEST.md` for the full continuity manifest intended for the next Nova instance.
