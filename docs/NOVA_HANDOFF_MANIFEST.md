# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not arrive as a fresh assistant and restart solved work.

## 🚨 READ FIRST — CURRENT STATE (2026-09-14)

**Sysselcraft has successfully run as a real native app on the user's physical iPhone via Capacitor/Xcode. Do not restart the native migration.**

The scrolling/adaptive Phaser world, tap-to-move, Linus intro, puppy, quest flow and local save system have reached physical-device testing. Supabase-backed parent/child quest work and reconciliation testing are active.

Draft PR **#6** on `nova/vercel-free-batch` is the current batched hardening/design branch. Do not merge/deploy merely because it exists; verify current head/CI and use Vercel deliberately.

### MAJOR VISUAL DIRECTION CHANGE · 2026-09-14

The old 16-bit/pixel-art production target is **superseded**.

Sysselcraft is now canonically an **illustrated isometric storybook world**: soft organic forms, rich detail in vegetation and buildings, strong silhouettes, subtle shadows and a painted rather than grid-bound expression. The first established concept-art image is the visual north star.

Pixel art, crisp/no-antialiasing rendering, fixed native pixel grids and nearest-neighbour scaling are no longer goals in themselves. Art format is deliberately hybrid: vector/SVG, painted raster and rasterized runtime atlases may coexist. Choose the medium that best preserves the target look and runtime performance.

**Read `docs/ART_DIRECTION.md` before visual work.** The next art step is a representative style proof against the concept art, not more polishing of the pixel-art bridge.

### Current local Mac/Xcode state

- Repo cloned to `~/Documents/sysselcraft`.
- Homebrew + Node/npm/npx installed.
- `npm install`, `npm run build`, Capacitor iOS generation/sync and Xcode device run have succeeded.
- Generated `ios/` exists locally and is not assumed committed.
- Do NOT run `npx cap add ios` again.
- Native loop: `git pull` → `npm run ios:sync` → Xcode App > iPhone > ▶ Run.

## Approved architecture direction

Keep React + Phaser with Capacitor as native shell and Supabase as shared family/quest backend while local Capacitor Preferences remain during reconciliation.

- React = app shell / non-world UI
- Phaser = village rendering and gameplay
- Capacitor = native container/capability bridge
- Supabase = household, child, pairing, parent quests and server-authoritative rewards
- Vercel/web = development preview/fallback

Landscape-first. Do not bury domain logic inside Phaser.

## Product thesis and locked gameplay laws

Core loop:

**Parent creates quest → quest appears in village → child performs it in real life → child marks it done → parent reviews → if approved: immediate feedback + rewards + hidden progression → village changes.**

Locked principles:

- Gör saker i verkligheten → världen förändras.
- Quests bygger staden. Valutan gör den till din.
- Byn är gränssnittet.
- Visa progression. Redovisa den inte.
- Parent approval mandatory before reward/progression.
- Child gets game; parent gets tool.
- Start village sparse and mildly neglected, enriched through nature/materiality rather than premature future buildings.

## Interaction model

- Real child avatar in village.
- Mobile/tablet tap-to-move with pathfinding.
- Desktop additionally WASD/arrow keys.
- No virtual joystick.
- Contextual NPC/object interaction may approach/interact in range.
- Quest/UI markers directly tappable.
- **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**

## Story/design source of truth

Read `docs/STORY_DESIGN.md` for canonical story/world design and `docs/ART_DIRECTION.md` for canonical visual design. Do not casually override either.

## Quest/progression invariants

Quest state: `available → pending → approved`, or `pending → available` via return flow.

Before approval: no currency, achievement/progression or world/building progression.

Intro mapping: **Bädda sängen = Ordning & miljö 70% + Välmående & rutiner 30%.**

Five progression classes: Ordning & miljö; Kunskap & skapande; Välmående & rutiner; Rörelse & aktivitet; Gemenskap.

## PRIVATE DEVELOPMENT DIARY — REQUIRED CONTINUITY RULE

The private diary lives in the user's File Library as `Sysselcraft_Utvecklingsdagbok_v*.docx` and is deliberately not public GitHub content.

Every future Nova must retrieve the newest version at thread start and continue it at meaningful milestones. It is the project's scrapbook, not technical source of truth. Never invent screenshots, quotes or events.

The 2026-09-14 storybook art-direction change is diary-worthy and must remain part of that history.

## Repository / deployment cost / security

Repository: `sebass80s/sysselcraft`, public. Stack: Next.js 16.3.3 + React 19.2 + TypeScript + Phaser 3.90 + Capacitor 8 + Supabase.

- Never commit secrets/private family data/service keys/private env files.
- Vercel deploy quota is scarce. Batch coherent remote pushes/deployments.
- GitHub Actions on standard hosted runners for this public repo may be used autonomously.
- Do not use explicitly billed/larger runners or paid services without approval.
- Public web URL: `https://sysselcraft.vercel.app`.

## State ownership / migration boundary

Read `docs/STATE_OWNERSHIP.md` and `docs/RECONCILIATION_PLAN.md` before persistence-authority changes.

- pairing does not migrate local save;
- local prototype and backend quests remain separate ledgers for now;
- reconciliation observe-only;
- no max merge/reward replay/retroactive reward fabrication/silent overwrite;
- migrate one state family at a time after physical two-device evidence.

## Technical systems to preserve

- adaptive Phaser world/camera;
- A*-style tap-to-move pathfinding;
- desktop keyboard movement;
- separate collision footprints and Y/base-depth sorting;
- reusable village asset architecture;
- data-driven dialogue;
- Linus intro + puppy;
- quest marker/approval event;
- persisted truck/material delivery state;
- Capacitor Preferences local save;
- Supabase family/pairing/quest boundary;
- idempotent server rewards.

Existing SVGs are bridge assets. They may be reused/redrawn and SVG itself remains a valid source/runtime format where appropriate. There is no longer a mandatory raster-only end state.

## Working rules for next Nova

1. Read this file, `docs/TECHNICAL_HANDOFF.md`, `docs/STORY_DESIGN.md`, `docs/ART_DIRECTION.md`, `docs/STATE_OWNERSHIP.md`, `docs/RECONCILIATION_PLAN.md`.
2. Retrieve newest private development diary.
3. Verify current main, active PR, CI and deployment before claims.
4. Do not restart Capacitor setup.
5. Verify Vercel before saying web changes are READY/live.
6. Preserve pathfinding, quest semantics, story canon and storybook art direction.
7. Keep reconciliation observe-only until physical evidence supports migration.
8. Keep diary private and current.
9. Warn early before context length threatens continuity.
