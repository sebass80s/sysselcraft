# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not arrive as a fresh assistant and restart solved work.

## 🚨 READ FIRST — CURRENT STATE (2026-09-13)

**We are in the middle of Sysselcraft's first real iPhone test via Capacitor/Xcode. Do not restart the native migration.**

### Verified repository/native preparation

The React + Phaser project has been prepared for Capacitor on `main`:

- Next.js uses static export (`out/`).
- Capacitor 8 dependencies/scripts are in `package.json`.
- `capacitor.config.ts` uses app id `se.sysselcraft.app`, app name `Sysselcraft`, webDir `out`.
- Web/Vercel remains the development preview/fallback.
- iOS/Android native project folders were deliberately not hand-written into the repo.

### Current local Mac/Xcode state

The user has now set up the real native development environment locally:

- Repo cloned to `~/Documents/sysselcraft`.
- Homebrew + Node/npm/npx installed.
- `npm install` completed successfully (warnings included deprecated packages and 3 moderate audit findings; these did not block the build).
- `npm run build` completed successfully and produced the static build.
- During the first local build Next.js automatically modified the local `tsconfig.json` include list. **Review the local diff before committing anything; do not blindly commit this generated change.**
- `npx cap add ios` completed successfully and generated the real native project at `ios/` locally.
- `npx cap sync ios` completed successfully.
- `npx cap open ios` opens the Capacitor Xcode workspace correctly.
- Xcode and iOS Platform Support are installed.
- Xcode target `App` is configured landscape-first: iPhone/iPad should retain Landscape Left + Landscape Right and not Portrait.
- Signing uses `Kalle Rosqvist (Personal Team)` with Automatically Manage Signing enabled.
- Bundle identifier is `se.sysselcraft.app`.
- The user's physical iPhone has been connected and Xcode signing/provisioning began working after the device was connected.
- **At the exact handoff moment, Xcode says `pairing is in progress`.** The next immediate action is to let pairing finish, select the physical iPhone as run destination, then press ▶ Run.
- First-device-run may require enabling Developer Mode on the iPhone and retrying Run after restart.

### CRITICAL local/repo distinction

The generated `ios/` project currently exists **only on the user's Mac**. It has NOT yet been committed to GitHub. Do not claim otherwise. Before any native-project commit, inspect the local Git diff and decide deliberately what belongs in source control. Avoid slentrian/no-op commits and group changes because each `main` push triggers a Vercel production build.

### After first successful iPhone run

The next renderer issue remains the fixed Phaser 960×640 + `Phaser.Scale.FIT` landscape behaviour. On wide phones this can letterbox/show side areas. Capacitor removes Safari chrome but does **not** magically fix Phaser aspect ratio. Solve this without stretching pixel art and without breaking pathfinding/collision footprints. Preferred direction: separate logical walkable world bounds from render viewport/camera so wide landscape can reveal sensible extra horizontal world/decorative space.

## Approved native architecture direction

**Keep React + Phaser and use Capacitor as the native iOS/Android shell. Do not rewrite Sysselcraft in Godot/Unity now.**

Target architecture:

- React = app shell / non-world UI
- Phaser = village rendering and moment-to-moment gameplay
- Capacitor = native iOS/Android container and native capability bridge
- Supabase = future backend/persistence, still intentionally deferred until UX is proven
- Vercel/web = development preview and fallback, not necessarily final primary mobile play surface

Mobile/tablet is **landscape-first**. Do not spend major engineering effort perfecting iPhone Safari fullscreen.

### Critical architecture rule

**Do not bury Sysselcraft domain logic inside Phaser.** Keep quest definitions/state transitions, dialogue data, progression, economy, household/child data, scheduling and persistence contracts outside the rendering scene wherever practical. Phaser should consume state and render/operate the world.

Only reconsider Godot/Unity if real future requirements demand substantially heavier physics, huge/complex worlds, advanced 3D, extreme GPU work or simulation loads Phaser cannot reasonably handle.

## 1. Identity and working relationship

- Project AI name: **Nova**.
- Project: **Sysselcraft**.
- Continue autonomously once the goal is clear.
- Verify repository/deployment state before editing or claiming success.
- Never call a web change live until Vercel reports READY.
- Give the user the current game link after deployed game changes.
- Warn early if context length threatens continuity.
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
- Contextual NPC/world interaction may make avatar approach target and interact in range.
- Quest/UI markers remain directly tappable.
- Rule: **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**

## 4. Intro/story currently locked

- Family arrives in an almost abandoned village.
- Linus has lived there his whole life, wears blue work clothes, uses a cane, and is a warm/dry/stubborn optimist.
- Linus is genuinely delighted the family moved into the old house.
- He remembers when the village was lively, says he misses that time and hopes people return.
- He does NOT explicitly explain that chores make residents move in.
- Linus has been caring for a puppy because so few people remain.
- Puppy needs more walking than Linus's knee appreciates, so he offers it to the child.
- Child names puppy; puppy becomes a companion, not an XP/progression machine.
- Puppy follows avatar and should never mechanically block movement/pathfinding.
- Intro transitions to first quest: **Bädda sängen**.

First-loop proof:

**real task → child submits → pending adult review → approval → 5 diamonds + 10 SysselBux prototype reward → truck/material event → visible world change.**

Do not rush Henning, Sol or full building roster before this first-loop magic works.

## 5. Quest/progression invariants

Current prototype state: `available → pending → approved`, or pending → available via `Behöver kompletteras`.

Before approval: no currency, achievement/progression or world/building progression.

Intro hidden progression mapping: **Bädda sängen = Ordning & miljö 70% + Välmående & rutiner 30%.**

Five progression classes: Ordning & miljö; Kunskap & skapande; Välmående & rutiner; Rörelse & aktivitet; Gemenskap.

## 6. Future resident order

- Linus is original resident.
- **Henning** is first new resident, baker, respectful homage to user's late grandfather.
- **Sol** arrives after Henning, young newly graduated female doctor, warm/competent/organized/enthusiastic, later helps Linus with knee/cane.
- Village naming is earned after all five first-tier buildings.

## 7. Repository / cost / security

Repository: `sebass80s/sysselcraft`, default branch `main`, public repo.

Stack: Next.js 16.3.3 + React 19.2 + TypeScript + Phaser 3.90 + Capacitor 8 preparation. Supabase planned but intentionally not connected.

- Never commit secrets, private family/child data, service keys or private env files.
- Each push to `main` triggers Vercel production build, so group changes.
- Target normal family-use operating cost ≈ 0 SEK/month.
- No `package-lock.json` should be introduced casually; dependency freeze should be deliberate.
- Public web game URL: `https://sysselcraft.vercel.app`.

## 8. Technical systems to preserve

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

## 9. Working rules for next Nova

1. Read this file and `docs/TECHNICAL_HANDOFF.md` before meaningful repo work.
2. Verify current `main` rather than trusting stale SHAs.
3. First immediate task at this handoff: finish iPhone pairing and first ▶ Run, not restart Capacitor setup.
4. Do not claim the locally generated `ios/` folder is in GitHub until verified/committed.
5. Review local diff before any commit, especially Next's automatic `tsconfig.json` change.
6. Verify Vercel before saying web changes are READY/live.
7. Always give user game link after deployed game changes.
8. Prefer fewer, coherent passes/builds.
9. Preserve pathfinding, quest semantics and locked story/design decisions.
10. Do not add Supabase prematurely.
11. Do not turn dialogue into heavy RPG branching, make child silent, or turn puppy into progression machine.
12. After native smoke test, address Phaser responsive landscape viewport deliberately.
