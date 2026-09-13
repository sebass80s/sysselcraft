# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not arrive as a fresh assistant and restart solved work.

## 🚨 READ FIRST — CURRENT STATE (2026-09-13)

**Sysselcraft has successfully run as a real native app on the user's physical iPhone via Capacitor/Xcode. Do not restart the native migration.**

The scrolling/adaptive Phaser world, tap-to-move, Linus intro, puppy, quest flow and local save system have all reached physical-device testing. The current work includes the Supabase-backed parent/child quest loop and continued visual development.

A batched migration-hardening package is currently being prepared in draft PR **#6** from branch `nova/vercel-free-batch`. The purpose is to accumulate useful non-Vercel work before spending another deployment. The batch includes safer child re-pairing, stronger background quest refresh, reconciliation diagnostics/policy, warning-free CI enforcement, clearer separation between the local prototype parent control and real `/parent`, updated visual/reconciliation docs, and a state-ownership document.

**Do not merge or deploy this batch merely because it exists.** First verify current PR head/CI and decide whether the batch is ready for the next deliberate Vercel verification deployment.

### Current local Mac/Xcode state

- Repo cloned to `~/Documents/sysselcraft`.
- Homebrew + Node/npm/npx installed.
- `npm install`, `npm run build`, Capacitor iOS generation/sync and Xcode device run have succeeded.
- The real generated `ios/` project exists locally on the user's Mac and is not assumed to be committed to GitHub.
- Do NOT run `npx cap add ios` again.
- Normal native test loop is `git pull` then `npm run ios:sync`, followed by Xcode App > iPhone > ▶ Run.
- Review local Git changes before discarding or committing anything, especially Next-generated `tsconfig.json` changes.

## Approved architecture direction

Keep React + Phaser with Capacitor as the native iOS/Android shell. Supabase is now connected as the shared family/quest backend while local Capacitor Preferences remain in place during reconciliation/testing.

- React = app shell / non-world UI
- Phaser = village rendering and moment-to-moment gameplay
- Capacitor = native container and capability bridge
- Supabase = household, child, pairing, parent-created quest and server-authoritative reward backend
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

Quest state: `available → pending → approved`, or pending → available via return/completion-needed flow.

Before approval: no currency, achievement/progression or world/building progression.

Intro hidden progression mapping: **Bädda sängen = Ordning & miljö 70% + Välmående & rutiner 30%.**

Five progression classes: Ordning & miljö; Kunskap & skapande; Välmående & rutiner; Rörelse & aktivitet; Gemenskap.

Quest definitions and lifecycle logic live outside the React/Phaser renderer. Backend-created family quests use the same lifecycle semantics with server-authoritative approval/rewards.

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

Repository: `sebass80s/sysselcraft`, default branch `main`, **public repo**.

Stack: Next.js 16.3.3 + React 19.2 + TypeScript + Phaser 3.90 + Capacitor 8 + Supabase.

- Never commit secrets, private family/child data, service keys or private env files.
- **Vercel has a limited deployment quota and deploys are the scarce resource.** Accumulate related work into larger coherent batches before using Vercel for browser verification.
- The resource to minimize is Vercel deployments, not useful Git commits.
- Current Vercel Git integration also creates preview deployments for pushed non-main branches.
- Therefore a remote work branch is NOT deploy-free.
- Make useful commits freely, but batch remote GitHub pushes whenever practical to conserve Vercel deployment quota.
- **GitHub Actions policy (updated 2026-09-13): this repository is public, so normal GitHub-hosted Actions for public repositories may be used autonomously. They are no longer treated as a scarce paid-minute budget and do NOT require per-run permission.**
- Prefer standard GitHub-hosted runners and ordinary CI/build/test workflows. Do not opt into larger/billed runners, paid third-party CI, or other explicitly chargeable compute without user approval.
- `[skip ci]` is therefore no longer required merely to conserve Actions minutes. Use it only when intentionally skipping CI makes technical sense.
- Public web game URL: `https://sysselcraft.vercel.app`.

## 8. State ownership / migration boundary

Read `docs/STATE_OWNERSHIP.md` and `docs/RECONCILIATION_PLAN.md` before changing persistence authority.

Current migration law:

- pairing identifies a backend child but does **not** migrate the existing local save;
- local built-in prototype state and backend parent-created quest state remain separate ledgers for now;
- reconciliation is **observe-only**;
- recommendations such as `backend-ahead` or `local-ahead` are diagnostics, not write permission;
- no max-value merge, reward replay, retroactive reward-event fabrication or silent overwrite is allowed;
- migrate one state family at a time only after the physical two-device reconciliation test produces real before/after evidence.

## 9. Technical systems to preserve

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
- Supabase family/child/pairing/parent-quest backend boundary.
- Parent approval semantics and idempotent server rewards.

Current SVG assets are a bridge. Long-term visual direction is coherent raster PNG/WebP sprite atlases with nearest-neighbour scaling, fixed native pixel grid and consistent palette/light direction.

## 10. Working rules for next Nova

1. Read this file, `docs/TECHNICAL_HANDOFF.md`, `docs/STORY_DESIGN.md`, `docs/STATE_OWNERSHIP.md` and `docs/RECONCILIATION_PLAN.md` before meaningful repo work.
2. Retrieve and read the newest private `Sysselcraft_Utvecklingsdagbok_v*.docx` from File Library and keep it alive throughout development.
3. Verify current `main` and any active migration PR rather than trusting stale SHAs.
4. Do not restart Capacitor setup or run `npx cap add ios` again.
5. Review local diff before asking the user to discard/commit local files.
6. Verify Vercel before saying web changes are READY/live.
7. Prefer coherent batched remote pushes because Vercel watches remote branches.
8. Preserve pathfinding, quest semantics and locked story/design decisions.
9. Supabase is already connected; do not restart or replace the backend foundation. Preserve local persistence until reconciliation is physically tested.
10. Normal GitHub Actions CI is allowed without asking because the repo is public; avoid explicitly billed/larger runners without approval.
11. Do not turn dialogue into heavy RPG branching, make the child silent, or turn the puppy into a progression machine.
12. Keep the development diary private and update it automatically at meaningful checkpoints.
13. Warn early before context length threatens continuity, and ensure both technical handoff and diary are current before switching threads.
