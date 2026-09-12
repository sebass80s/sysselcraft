# Sysselcraft Technical Handoff

## Current implementation status

Sysselcraft 0.1 is underway and the first playable vertical slice now exists in code. The current prototype proves the beginning of the core loop: the child can move around the village, open the intro quest, submit it for adult review, receive rewards only after approval, and trigger the first visible rebuilding event.

## Stack

- Next.js App Router + TypeScript
- Next.js 16.3.3
- React 19.2
- Phaser 3.90 for the village scene
- Supabase planned, not connected yet
- Vercel planned, not connected yet
- GitHub repository: sebass80s/sysselcraft

## Repository / security constraints

- Repository is public.
- Standard GitHub Actions on the public repository are approved for CI.
- Never commit secrets, family data, Supabase service keys, or private environment files.
- `.env*` is ignored except `.env.example`.
- Supabase remains intentionally disconnected until the local gameplay loop is proven.
- Next.js was upgraded from 16.0.0 to 16.3.3 after CI surfaced a security warning for the old release.

## Implemented vertical slice

1. Start village with family house, diagonal road, trees, Linus with cane, and an empty construction area.
2. Child avatar with tap/click-to-move.
3. Grid-based pathfinding routes around house, construction site and trees.
4. Desktop WASD / arrow-key movement is also available with collision checks.
5. Intro quest marker above the family house.
6. Intro quest: `Bädda sängen`.
7. Child submits quest and it becomes `pending`.
8. Prototype adult-review panel exposes `Godkänn` and `Behöver kompletteras`.
9. Rewards are granted only after approval: current prototype values are 5 diamonds + 10 SysselBux.
10. Approval hides the quest marker and triggers a simple truck animation toward the construction site.
11. Building materials remain visible at the site after the truck arrives.
12. Linus performs a small reaction animation when the materials arrive.

## Quest-state invariant

Current prototype state machine:

`available -> pending -> approved`

or

`available -> pending -> available` via `Behöver kompletteras`.

No currency or rebuilding event is granted while a quest is pending.

## Interaction invariant

Avatar = experience the world. Tap/click = use the interface.

The child may move freely through the village while quest markers remain directly tappable so routine UI never requires unnecessary walking.

## Current technical structure

- `src/components/VillagePrototype.tsx`
  - React shell and temporary local prototype state
  - resource HUD
  - quest card
  - prototype adult-review UI
- `src/game/createVillageGame.ts`
  - Phaser game bootstrap
  - village rendering
  - movement
  - grid pathfinding
  - collision
  - quest marker presentation
  - first approval / truck world event
- `.github/workflows/ci.yml`
  - Node 22
  - dependency install
  - ESLint
  - production Next.js build

Phaser is loaded dynamically in the browser so it is not imported into the Next.js SSR bundle.

## Verified commits

- `5ce79ed2df38a0a8295b6995e9fa4fbcdee5d9c8` — Initialize Sysselcraft 0.1 prototype
- `24557a886525f08c34990042c346e741e300586e` — Add CI build and lint workflow
- `b7ef1207ef07cfc9409de10fbe100dac221b731c` — Fix CI bootstrap without lockfile — CI green
- `eb72baef347b40aeff19b5edbdd7288ecdf2a951` — Add pathfinding and collision to village prototype — build exposed Phaser ESM issue
- `2de5267f4cd20f65706cc2aea845e799796a7883` — Fix Phaser browser-only ESM loading — CI green
- `c9db491e3eda2fd9a76c9f011cddeacb6883b9fb` — Add first quest approval loop — lint exposed two quality issues
- `5e4b6a64cc7b97f8fd9f5921568f775697106597` — Fix quest loop lint and patch Next.js — CI green (lint + production build)

## CI history note

Early red runs were useful bootstrap failures, not hidden unresolved defects. The current implementation at `5e4b6a6` passed both ESLint and `next build` in GitHub Actions.

## Next technical steps

1. Visually test the current prototype in a browser, especially mobile sizing and tap targets.
2. Connect Vercel and deploy the prototype for device testing.
3. Replace placeholder geometry with a deliberately designed first village map / visual language while preserving the proven gameplay hooks.
4. Improve the approval payoff: reward animation, clearer Linus reaction, truck route and construction-site staging.
5. Add the hidden progression model for `Bädda sängen`: Ordning & miljö 70%, Välmående & rutiner 30%.
6. Keep quest/reward state local until the flow feels right, then introduce Supabase persistence and household/child entities.
7. Generate and commit a package lock once the dependency baseline is deliberately frozen.
