# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not arrive as a fresh assistant and restart solved work.

## 🚨 READ FIRST — approved native architecture direction (2026-09-13)

The user and Nova have agreed that **mobile Safari should not be treated as Sysselcraft's intended final gameplay container**. Device testing in landscape confirmed that browser chrome/overlays and web viewport/aspect behaviour make the experience feel unnecessarily browser-like.

### Decision

**Keep the existing React + Phaser game and move toward Capacitor as the native iOS/Android shell. Do not rewrite Sysselcraft in Godot/Unity now.**

Target architecture:

- React = app shell / non-world UI
- Phaser = village rendering and moment-to-moment gameplay
- Capacitor = native iOS/Android container and native capability bridge
- Supabase = future backend/persistence, still intentionally deferred until UX is proven
- Vercel/web = development preview and fallback, not necessarily the final primary mobile play surface

Mobile/tablet is **landscape-first**. Do not spend major engineering effort perfecting iPhone Safari fullscreen if the same effort is better spent on the native shell. Keep the web build functional for preview/fallback.

Capacitor is expected to cover the foreseeable roadmap: app-style fullscreen, native launch/icon experience, offline/local storage, haptics, local/push notifications, camera/photo flows, filesystem/network access and custom native Swift/Java/Kotlin bridges if needed. Native device testing can later move through Xcode/TestFlight and Android tooling, reducing dependence on a Vercel deployment for every gameplay iteration.

### Critical architecture rule

**Do not bury Sysselcraft domain logic inside Phaser.** Keep quest definitions/state transitions, dialogue data, progression, economy, household/child data, scheduling and persistence contracts outside the rendering scene wherever practical. Phaser should consume state and operate/render the world. This keeps React/Phaser/Capacitor boundaries sane, prepares for Supabase, and preserves the option to migrate the renderer someday if the game genuinely outgrows Phaser.

Only reconsider Godot/Unity if real future requirements demand substantially heavier physics, huge/complex worlds, advanced 3D, extreme GPU work or simulation loads that Phaser cannot reasonably handle. Do not rewrite for hypothetical scale.

**Status:** this direction is approved but Capacitor has NOT yet been implemented. Verify the repo before claiming a native build exists. The next architectural implementation package should introduce Capacitor deliberately while preserving the existing web build.

See `docs/TECHNICAL_HANDOFF.md` for the fuller rationale and migration implications.

## 1. Identity and working relationship

- Project AI name: **Nova**.
- Project: **Sysselcraft**.
- Continue autonomously once the goal is clear. Do not ask permission for every safe technical substep.
- Verify actual repository/deployment state before editing or claiming success.
- Never call a change live until Vercel reports READY.
- Give the user the current game link after deployed updates.
- Warn early if context length threatens continuity and prepare a handoff before it becomes a problem.
- Keep humor light and situational.
- Work in grouped changes and avoid unnecessary Vercel builds.

## 2. Product thesis and locked gameplay laws

Sysselcraft is a real-world chore/reward system for a child, presented primarily as a living game world rather than a checklist app.

Core loop:

**Parent creates quest → quest appears in village → child performs it in real life → child marks it done → parent reviews → if approved: immediate feedback + rewards + hidden progression → village changes.**

Locked principles:

- Gör saker i verkligheten → världen förändras.
- Quests bygger staden. Valutan gör den till din.
- Byn är gränssnittet.
- Visa progression. Redovisa den inte.
- Parent approval is mandatory before reward/progression.
- Child gets game; parent gets tool.
- Start village remains sparse and mildly neglected, enriched through nature/materiality rather than premature future buildings.

## 3. Interaction model

- Child has a real avatar in the village.
- Mobile/tablet: tap-to-move with pathfinding.
- Desktop: WASD/arrow keys additionally.
- No virtual joystick.
- Contextual NPC/world interaction may make avatar approach the target and interact in range.
- Quest/UI markers remain directly tappable.
- Rule: **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**

## 4. Intro/story currently locked

- Family arrives in an almost abandoned village.
- Linus has lived there his whole life, wears blue work clothes, uses a cane, and is a warm/dry/stubborn optimist.
- Linus is genuinely delighted the family has moved into the old house.
- He remembers when the village was lively, says he misses that time and hopes people return.
- He does NOT explicitly explain that chores make residents move in; gameplay demonstrates causality later.
- Linus has been caring for a puppy because so few people remain.
- Puppy needs more walking than Linus's knee appreciates, so he offers it to the child.
- Child names puppy; puppy becomes a companion, not an XP/progression machine.
- Puppy follows the avatar and should never mechanically block movement/pathfinding.
- Intro naturally transitions to first quest: **Bädda sängen**.

First-loop proof remains:

**real task → child submits → pending adult review → approval → 5 diamonds + 10 SysselBux prototype reward → truck/material event → visible world change.**

Do not rush Henning, Sol or the full building roster before this first-loop magic works.

## 5. Quest/progression invariants

Current prototype state:

`available → pending → approved`

or pending → available via `Behöver kompletteras`.

Before approval: no currency, achievement/progression or world/building progression.

Intro hidden progression mapping remains:

**Bädda sängen = Ordning & miljö 70% + Välmående & rutiner 30%.**

Five progression classes:

1. Ordning & miljö
2. Kunskap & skapande
3. Välmående & rutiner
4. Rörelse & aktivitet
5. Gemenskap

## 6. Future resident order

- Linus is original resident.
- **Henning** is first new resident, baker, respectful homage to user's late grandfather who ran a bakery in the 1970s.
- **Sol** arrives after Henning, young newly graduated female doctor, warm/competent/organized/enthusiastic, later helps Linus with knee/cane.
- Village naming is earned after all five first-tier buildings.

## 7. Repository / cost / security

Repository: `sebass80s/sysselcraft`, default branch `main`, public repo.

Current web stack before Capacitor migration: Next.js 16.3.3 + React 19.2 + TypeScript + Phaser 3.90. Supabase is planned but intentionally not connected.

- Never commit secrets, private family/child data, service keys or private env files.
- `.env*` ignored except `.env.example`.
- Standard GitHub-hosted Actions acceptable; avoid billed larger runners.
- Each push to `main` currently triggers a Vercel production build, so group changes.
- Target normal family-use operating cost ≈ 0 SEK/month.
- No `package-lock.json` should be introduced casually; dependency freeze should be deliberate.
- Public web game URL: `https://sysselcraft.vercel.app`.

## 8. Current technical systems to preserve through native migration

- Browser-only dynamic Phaser import under current Next.js setup.
- Grid A*-style tap-to-move pathfinding.
- Desktop WASD/arrow movement.
- Existing collision footprints for family house, construction zone and five original trees unless deliberately migrated/tested.
- Y/base-depth sorting.
- Reusable village asset pipeline.
- Data-driven dialogue direction.
- Linus interaction/intro and puppy companion.
- Quest marker and approval event.
- Truck/material delivery event.
- Current local prototype state until persistence architecture is deliberately introduced.

Current SVG assets are a bridge. Long-term visual direction is coherent raster PNG/WebP sprite atlases with nearest-neighbour scaling, fixed native pixel grid and consistent palette/light direction.

## 9. Working rules for the next Nova

1. Read this file and `docs/TECHNICAL_HANDOFF.md` before meaningful repo work.
2. Verify current `main` rather than trusting stale SHAs in conversation summaries.
3. Verify Vercel before saying web changes are READY/live.
4. Always give the user the game link after deployed game changes.
5. Prefer fewer, larger coherent passes and fewer Vercel builds.
6. Preserve pathfinding, quest semantics and locked story/design decisions unless deliberately changing them.
7. Do not add Supabase prematurely.
8. Do not restart solved architecture or graphics work merely because the chat instance changed.
9. Do not turn dialogue into a heavy RPG tree or make the child silent.
10. Do not turn puppy into a progression machine.
11. Do not claim native/Capacitor support until it is actually implemented and tested.
12. Next major architecture work should plan the Capacitor migration, not continue endlessly tuning Safari.
