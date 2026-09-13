# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not arrive as a fresh assistant and restart solved work.

## 🚨 READ FIRST — CURRENT STATE (2026-09-13)

**Sysselcraft has successfully run as a real native app on the user's physical iPhone via Capacitor/Xcode. Do not restart the native migration.**

The scrolling/adaptive Phaser world, tap-to-move, Linus intro, puppy, quest flow and local save system have all reached physical-device testing. The current work is continuing the first gameplay loop and hardening iOS naming input.

### Current local Mac/Xcode state

- Repo cloned to `~/Documents/sysselcraft`.
- Homebrew + Node/npm/npx installed.
- `npm install`, `npm run build`, Capacitor iOS generation/sync and Xcode device run have succeeded.
- The real generated `ios/` project exists locally on the user's Mac and is not assumed to be committed to GitHub.
- Do NOT run `npx cap add ios` again.
- Normal native test loop is `git pull` then `npm run ios:sync`, followed by Xcode App > iPhone > ▶ Run.
- Review local Git changes before discarding or committing anything, especially Next-generated `tsconfig.json` changes.

## Approved architecture direction

Keep React + Phaser with Capacitor as the native iOS/Android shell. Supabase remains intentionally deferred until the UX loop is proven.

- React = app shell / non-world UI
- Phaser = village rendering and moment-to-moment gameplay
- Capacitor = native container and capability bridge
- Vercel/web = development preview/fallback

Mobile/tablet is landscape-first.

**Do not bury Sysselcraft domain logic inside Phaser.** Quest definitions/state transitions, dialogue, progression, economy, family data and persistence contracts belong outside the renderer wherever practical.

## 1. Identity and working relationship

- Project AI name: **Nova**.
- Project: **Sysselcraft**.
- Continue autonomously once the goal is clear.
- Verify repository/deployment state before editing or claiming success.
- Never call a web change live until Vercel reports READY.
- Warn early if context length threatens continuity.
- Work in grouped changes and avoid unnecessary Vercel deployments.

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

## 4. Story/design source of truth

Read `docs/STORY_DESIGN.md` for canonical story/world design. It contains the opening, Linus, puppy, first quest, Henning-before-Sol resident order, village naming milestone and the boundary between locked canon and open design space.

Do not duplicate or casually override canonical story decisions here.

## 5. Quest/progression invariants

Current prototype state: `available → pending → approved`, or pending → available via `Behöver kompletteras`.

Before approval: no currency, achievement/progression or world/building progression.

Intro hidden progression mapping: **Bädda sängen = Ordning & miljö 70% + Välmående & rutiner 30%.**

Five progression classes: Ordning & miljö; Kunskap & skapande; Välmående & rutiner; Rörelse & aktivitet; Gemenskap.

Quest definitions are being moved into domain data outside the React/Phaser UI so later quests can reuse the same architecture.

## 6. PRIVATE DEVELOPMENT DIARY — REQUIRED CONTINUITY RULE

Sysselcraft has a private internal development diary in the user's ChatGPT File Library, currently named in the `Sysselcraft_Utvecklingsdagbok_v*.docx` family. It is deliberately **NOT stored in this public GitHub repository**.

Every future Nova taking over the project MUST continue this diary.

At the beginning of a new thread/handoff:

1. Search the user's File Library for the newest `Sysselcraft_Utvecklingsdagbok_v*.docx`.
2. Read it before substantial development so the human/project journey is not lost.
3. Treat it as the project's scrapbook/history, not as technical source of truth.
4. Continue from the newest version rather than starting a second diary.

During development, automatically collect diary-worthy material. At meaningful milestones or natural checkpoints, create/update the next private diary version without waiting for the user to remember to ask.

Diary entries should capture:

- date / development session
- what actually happened, told as the project's journey rather than a dry changelog
- important game-design reasoning, including alternatives considered and why choices were made
- genuine screenshots supplied/captured during development when available
- memorable/funny/representative quotes from the user and Nova
- meaningful technical milestones and relevant commit hashes
- useful failures, wrong turns and lessons learned
- moments where Sysselcraft noticeably becomes more like a real game

Do NOT fill it after every tiny CSS tweak or commit. Prefer story-worthy checkpoints. The diary is a photo album, not surveillance footage.

Never invent screenshots, quotes or historical events. If a screenshot is unavailable, omit it or clearly mark a planned placeholder rather than fabricating one.

Keep the diary private in File Library/project context. **Do not commit the diary itself to the public GitHub repository.**

Before a thread becomes too long, proactively make sure the diary is caught up and leave enough handoff context that the next Nova knows to retrieve and continue it.

## 7. Repository / deployment cost / security

Repository: `sebass80s/sysselcraft`, default branch `main`, public repo.

Stack: Next.js 16.3.3 + React 19.2 + TypeScript + Phaser 3.90 + Capacitor 8. Supabase planned but intentionally not connected.

- Never commit secrets, private family/child data, service keys or private env files.
- The resource to minimize is Vercel deployments, not useful Git commits.
- Current Vercel Git integration also creates preview deployments for pushed non-main branches.
- Therefore a remote work branch is NOT deploy-free.
- Make useful local commits freely, but batch remote GitHub pushes whenever practical.
- Minimize unnecessary remote pushes that Vercel watches.
- GitHub Actions minutes must never be used without the user's explicit permission.
- Public web game URL: `https://sysselcraft.vercel.app`.

## 8. Technical systems to preserve

- Scrolling/adaptive Phaser world and camera.
- Grid A*-style tap-to-move pathfinding.
- Desktop WASD/arrow movement.
- Collision footprints and Y/base-depth sorting.
- Reusable village asset pipeline.
- Data-driven dialogue direction.
- Linus interaction/intro and puppy companion.
- Quest marker and approval event.
- Truck/material delivery event, including persisted completed-delivery state without replay after restart.
- Capacitor Preferences local save/restore.
- Parent approval semantics and idempotent rewards.

Current SVG assets are a bridge. Long-term visual direction is coherent raster PNG/WebP sprite atlases with nearest-neighbour scaling, fixed native pixel grid and consistent palette/light direction.

## 9. Working rules for next Nova

1. Read this file, `docs/TECHNICAL_HANDOFF.md`, and `docs/STORY_DESIGN.md` before meaningful repo work.
2. Retrieve and read the newest private `Sysselcraft_Utvecklingsdagbok_v*.docx` from File Library and keep it alive throughout development.
3. Verify current `main` rather than trusting stale SHAs.
4. Do not restart Capacitor setup or run `npx cap add ios` again.
5. Review local diff before asking the user to discard/commit local files.
6. Verify Vercel before saying web changes are READY/live.
7. Prefer coherent batched remote pushes because Vercel watches remote branches.
8. Preserve pathfinding, quest semantics and locked story/design decisions.
9. Do not add Supabase prematurely.
10. Do not turn dialogue into heavy RPG branching, make the child silent, or turn the puppy into a progression machine.
11. Keep the development diary private and update it automatically at meaningful checkpoints.
12. Warn early before context length threatens continuity, and ensure both technical handoff and diary are current before switching threads.
