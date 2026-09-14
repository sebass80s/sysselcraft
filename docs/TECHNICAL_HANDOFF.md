# Sysselcraft Technical Handoff

> Current-state sections and `docs/NOVA_HANDOFF_MANIFEST.md` supersede stale historical assumptions.

## 2026-09-14 visual/rendering architecture

Canonical direction is `docs/ART_DIRECTION.md`: **illustrated isometric storybook world**, not pixel art.

### Implemented rendering changes

The first full playable asset batch has been redesigned in storybook vector form while keeping Phaser and existing world/state architecture. Production-facing assets no longer rely on `shape-rendering="crispEdges"`. Main child-facing React UI has a dedicated `src/app/storybook.css` layer and the backend child quest dock has matching module styling.

Phaser should run this world with ordinary antialiasing rather than `pixelArt`/nearest-neighbour assumptions. The logical 32px pathfinding grid is unchanged and remains visually hidden by organic terrain/path silhouettes.

### Rendering laws

- Phaser remains renderer/gameplay engine; no engine rewrite implied.
- Rendered bounds and collision footprints remain separate.
- Y/base-depth sorting remains authoritative for spatial overlap.
- Do not change obstacles solely because an illustration becomes wider/taller.
- SVG/vector, painted raster and PNG/WebP atlases may coexist.
- Repeated/animated/complex assets may later be rasterized after physical profiling.
- Static/simple assets/UI may stay SVG where appropriate.
- Source masters remain scalable/high resolution.
- Physical iPhone profiling and screenshot comparison with concept art are required before declaring production art settled.

## Native architecture

Keep React + Phaser in Capacitor for iOS/Android. Supabase provides accounts, household/child, parent-created quests, pairing and server-authoritative rewards. Web/Vercel remains preview/fallback.

Capacitor/iOS already exists locally and has run on a physical iPhone. Do not run `npx cap add ios` again. Native loop: `git pull` → `npm run ios:sync` → Xcode App > iPhone > ▶ Run.

## Core invariants

- Tap-to-move/pathfinding + desktop WASD/arrows.
- Quest lifecycle `available -> pending -> approved`, or pending back to available.
- No rewards/progression before adult approval.
- Interaction law: **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**
- Do not bury product/domain logic in Phaser.
- Public repo: never commit secrets/private family data/service keys/private env.

## Current technical priority

1. Validate the new storybook presentation in a running build and on physical iPhone: scale, depth, taps, safe areas and SVG performance.
2. Complete physical parent → paired child → backend quest → submit → parent approval → exactly-once server reward proof.
3. Capture reconciliation before/after evidence before changing state authority.

## Deployment/resource policy

Vercel deployment quota is scarce. Non-main pushes also trigger previews, so batch coherent remote pushes. Standard GitHub-hosted Actions for this public repository are approved autonomously. Avoid explicitly billed/larger runners or paid third-party compute without approval.
