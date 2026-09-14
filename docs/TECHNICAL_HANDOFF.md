# Sysselcraft Technical Handoff

> Current-state sections and `docs/NOVA_HANDOFF_MANIFEST.md` supersede stale historical assumptions.

## 2026-09-14 visual/rendering architecture decision

Sysselcraft's previous fixed-pixel-art production target is superseded. Canonical art direction is in `docs/ART_DIRECTION.md`.

Target appearance: **illustrated isometric storybook world** with soft organic forms, detailed vegetation/buildings, strong silhouettes, subtle shadows and a painted rather than visibly grid-bound expression.

### Rendering consequences

- Phaser remains the renderer/gameplay engine. No engine rewrite is implied by this art change.
- The logical movement/pathfinding grid remains valid but should be visually softened/hidden by terrain and organic silhouettes.
- Rendered bounds and collision footprints remain separate. Richer art must not silently rewrite navigation geometry.
- Nearest-neighbour scaling, fixed native pixel grid and no-antialiasing are no longer invariants.
- Source/runtime format is hybrid by design: SVG/vector, high-resolution painted raster and PNG/WebP atlases can coexist.
- SVG is not automatically the final runtime format. Repeated/animated/complex assets may be rasterized into atlases for predictable GPU batching and memory behavior.
- Conversely, static/simple assets and UI may remain SVG if physical-device profiling supports it.
- Keep source masters scalable/high-resolution enough for iPhone, iPad and web.
- Benchmark representative style-proof assets on physical iPhone before bulk conversion.

Immediate technical art task: produce a representative style proof (house + vegetation + terrain/road + small props + shadows) against the first concept-art north star. Do not bulk-redraw the existing library before that proof is validated.

## 2026-09-13 architecture decision: native app direction

**Keep React + Phaser and package Sysselcraft as a native iOS/Android app using Capacitor.** Do not rewrite in Godot/Unity at this stage.

Target architecture:

- React = app shell and non-world UI
- Phaser = village rendering, movement and world interaction
- Capacitor = native container/bridge
- Supabase = accounts, households, child profiles, parent quests, pairing and server-authoritative rewards
- Web/Vercel = development preview/fallback

Mobile/tablet is landscape-first. Native packaging provides the intended app-like fullscreen experience.

### Architectural guardrail

Do not bury product/domain logic inside Phaser. Quest lifecycle, dialogue data, family data, progression, economy, scheduling and persistence contracts belong outside rendering wherever practical.

### Development/build implications

- Capacitor/iOS already exists locally and has run on physical iPhone. Do not run `npx cap add ios` again.
- Normal native loop: `git pull` → `npm run ios:sync` → Xcode App > iPhone > ▶ Run.
- Vercel deploy quota is scarce. Accumulate coherent batches before browser verification.
- Non-main pushes also trigger Vercel previews, so remote work branches are not deploy-free.
- Normal standard GitHub-hosted Actions for this public repository are approved autonomously.
- Do not use explicitly billed/larger runners or paid third-party compute without approval.

## Core invariants

- Next.js/React + Phaser client.
- Tap-to-move/pathfinding and desktop WASD/arrow movement.
- Quest lifecycle `available -> pending -> approved`, or pending back to available.
- No rewards/progression before adult approval.
- Public repository: never commit secrets/private family data/service keys/private env files.
- Interaction law: **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**

## Rendering/world architecture

- First concept art is the visual north star, not a giant background image.
- Reusable world assets over one-off baked scenes.
- Y/base-depth sorting communicates space.
- Rendered sprite/image bounds and collision footprints are separate.
- Existing collision footprints should not be casually changed while visual assets evolve.
- Current SVGs are bridge assets and useful structural/source material. There is no mandatory raster-only destination.
- Read `docs/ART_DIRECTION.md` and `docs/VISUAL_ASSET_PREP.md` before art-pipeline changes.

## Gameplay/story direction

The family arrives in a nearly abandoned village. Linus is glad somebody has moved into the old house and believes the village can live again. The puppy becomes the child's companion, not an XP machine. Intro leads to the first real-world quest, **Bädda sängen**.

The first-loop proof remains priority: real task → submit → adult approval → reward → visible world change. Do not rush Henning, Sol or the full roster before this loop feels magical.

## Current technical priority

Complete and validate parent → paired child → backend quest → child submit → parent approval → exactly-once server reward while preserving local save until reconciliation is physically tested.
