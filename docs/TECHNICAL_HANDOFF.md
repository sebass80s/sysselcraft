# Sysselcraft Technical Handoff

## Current implementation status

Sysselcraft now has a playable first vertical slice and an active reusable visual-asset pipeline. The prototype proves the core real-life-to-world loop while the village presentation is being migrated from procedural Phaser primitives toward a cohesive pixel-art world guided by the established concept art.

The current gameplay build is commit `ba1cebca5ec134e88b0bbf5f14b01b45b7e005ba` (`Build richer layered village scene`). GitHub Actions run #18 (`34726820231`) completed successfully. The matching Vercel production deployment `dpl_H6Sd7kzwajSayomgkxBEZ6gWruvX` is READY and `https://sysselcraft-jagxr80t2-yourmovegame.vercel.app` returns HTTP 200.

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
10. Approval hides the quest marker and triggers a truck animation toward the construction site.
11. Building materials remain visible after truck arrival.
12. Linus performs a reaction animation when materials arrive.

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
  - quest marker presentation
  - approval/truck world event
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
- `crate.svg`
- `family-house.svg`
- `fence-segment.svg`
- `linus.svg`
- `quest-board.svg`
- `road-dirt.svg`
- `tree-oak.svg`
- `grass-tile.svg`
- `tree-birch.svg`
- `tree-pine.svg`
- `flower-patch.svg`
- `rock-cluster.svg`
- `signpost.svg`
- `lamp-post.svg`
- `woodpile.svg`
- `mailbox.svg`

SVG is currently used as a text-based bridge because the available GitHub workflow can write text assets directly. Long-term production direction is raster PNG/WebP sprite sheets/atlases with nearest-neighbour scaling, fixed native pixel grids and consistent palette/light direction.

## Current rendering architecture

- Grass is now a reusable tiled texture rather than a grid of procedural rectangles.
- The original dirt-road asset remains a reusable sprite.
- `worldImage(...)` positions reusable world objects and sets depth from their base Y coordinate.
- The player updates depth every frame from its current Y coordinate, enabling foreground/background overlap during movement.
- Rendered sprite bounds are intentionally separate from pathfinding/collision footprints.
- The five original tree collision circles are unchanged even though their visual tree species now vary.
- Small decorative props are visual-only for now and do not all have collision footprints.

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
- `85a5c6ec10b4a1f1ae6359f958a86c599956cc0c` — Render village environment from reusable pixel assets — CI run #16 green
- `ee0b93d6214dd4ea2a2856357c2b7755a1d01a78` — Add richer reusable village environment assets
- `ba1cebca5ec134e88b0bbf5f14b01b45b7e005ba` — Build richer layered village scene — CI run #18 (`34726820231`) green

## Production verification

Latest verified gameplay deployment:

- Commit: `ba1cebca5ec134e88b0bbf5f14b01b45b7e005ba`
- Vercel deployment: `dpl_H6Sd7kzwajSayomgkxBEZ6gWruvX`
- URL: `https://sysselcraft-jagxr80t2-yourmovegame.vercel.app`
- State: READY
- HTTP verification: 200 OK

This verifies build/deployment availability, not graphical correctness of the Phaser canvas. Current tools do not provide full interactive visual browser QA. The newest visual pass still needs human/device visual confirmation.

## Known issues / limitations

- Characters are static assets; directional idle/walk animation frames do not exist yet.
- Truck and delivered construction materials are still procedural Phaser primitives.
- Small decorative props do not all participate in collision/pathfinding.
- The scene uses Y-based overlap but is not yet a full production isometric tile/sprite architecture.
- SVG is an asset-pipeline bridge, not the intended final raster sprite-sheet format.
- Quest/reward state remains local React state; no Supabase persistence.
- Parent review UI is explicitly temporary/prototype.
- No `package-lock.json`; CI intentionally uses `npm install`, not `npm ci`.
- No assistant-side full graphical browser validation is available; do not claim visual correctness without device/browser feedback.

## Next technical steps

1. Visually inspect the `ba1cebca...` build on a real device/browser and fix any obvious composition/scale/overlap problems first.
2. Create a deliberate directional character animation strategy for child and Linus (idle/walk frames) while preserving the movement API.
3. Convert truck and construction materials into reusable visual assets.
4. Improve road/path edges with reusable edge/corner/detail assets so the road feels embedded in the terrain rather than placed on top of it.
5. Introduce a small `WorldObjectDefinition` layer separating texture, position, base Y and collision footprint so rendering and navigation can evolve independently.
6. When binary asset tooling is available, migrate from SVG bridge assets toward consistent PNG/WebP sprite atlases.
7. Improve approval payoff: reward flight/particles, stronger Linus response and staged construction delivery.
8. Add hidden intro progression contribution: Ordning & miljö 70%, Välmående & rutiner 30%.
9. Keep state local until the UX is proven, then introduce Supabase persistence and household/child entities.
10. Generate/commit a package lock only when the dependency baseline is deliberately frozen, then switch CI to `npm ci`.

See `docs/NOVA_HANDOFF_MANIFEST.md` for the full continuity manifest intended for the next Nova instance.
