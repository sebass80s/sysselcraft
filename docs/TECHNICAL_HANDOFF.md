# Sysselcraft Technical Handoff

## Current implementation status

Sysselcraft 0.1 has begun. The first implementation target is a narrow vertical slice proving the core feeling: a child avatar can inhabit the village and move by tapping/clicking the world.

## Stack

- Next.js App Router + TypeScript
- Phaser for the village scene
- Supabase planned, not connected yet
- Vercel planned, not connected yet
- GitHub repository: sebass80s/sysselcraft

## Important constraints

- No GitHub Actions should be introduced or run without explicit approval because Actions minutes are scarce.
- The repository is public. Never commit secrets, family data, Supabase service keys, or private environment files.
- `.env*` is ignored except `.env.example`.
- Normal GitHub commits/pushes are acceptable.

## First vertical slice

1. Start village with family house, road, trees, Linus and an empty construction area.
2. Child avatar with tap/click-to-move.
3. Intro quest: Bädda sängen.
4. Child submits quest, status becomes pending review.
5. Parent approves.
6. Rewards are granted only after approval.
7. First hidden progression contribution: Ordning & miljö 70%, Välmående & rutiner 30%.
8. First visible world payoff: construction-material truck arrives for Återvinningscentralen.
9. Linus reacts to the rebuilding.

## Current interaction invariant

Avatar = experience the world. Tap/click = use the interface. A child may move freely through the village, while quest markers remain directly tappable so routine UI never requires unnecessary walking.

## Next technical steps

- Verify the Next.js/Phaser shell builds cleanly.
- Add proper village scene modules rather than keeping prototype logic in one component.
- Add avatar pathfinding/collision boundaries.
- Model quest state machine without persistence first.
- Add the intro quest and parent approval prototype.
- Do not connect Supabase until the local gameplay loop is proven.
