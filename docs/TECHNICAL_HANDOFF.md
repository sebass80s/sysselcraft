# Sysselcraft Technical Handoff

> This handoff contains older implementation history below. **Current-state sections and the Nova handoff manifest supersede stale historical assumptions.**

## 2026-09-13 architecture decision: native app direction

Sysselcraft should no longer treat mobile Safari as the intended final gameplay container. Device testing showed that even with landscape CSS and full dynamic viewport height, browser chrome/overlays and Phaser's fixed world aspect make the experience feel like a webpage rather than a game.

### Chosen direction

**Keep React + Phaser and package Sysselcraft as a native iOS/Android app using Capacitor.**

Do **not** rewrite the game in Godot/Unity at this stage. The current 2D isometric village, interaction model and foreseeable family/quest features do not justify throwing away the existing TypeScript/Phaser client.

Target architecture:

- **React** = app shell and non-world UI
- **Phaser** = village/game rendering, movement and moment-to-moment world interaction
- **Capacitor** = thin native iOS/Android container and bridge to native device capabilities
- **Supabase** = connected backend for accounts, households, child profiles, parent-created quests, pairing and server-authoritative rewards
- **Web/Vercel** = development, preview and fallback surface, not necessarily the primary production play experience

### Mobile presentation

- Mobile/tablet gameplay is **landscape-first**.
- Native packaging should provide the app-like fullscreen experience instead of spending excessive time fighting iPhone Safari limitations.
- Portrait does not need a separately optimized full game layout. A future native build may request/lock landscape where appropriate.
- Keep web landscape usable for previews and fallback, but do not over-invest in Safari-specific fullscreen tricks if the native shell solves the real problem.

### Why Capacitor fits the roadmap

The planned Sysselcraft feature set remains compatible with this architecture: local/offline storage and caching, native app icon/launch experience, haptics, local notifications, push notifications, camera/photo flows, filesystem access, network awareness and future custom native functionality. If a capability is not covered by a standard plugin, a custom Capacitor bridge can expose Swift/Java/Kotlin functionality without replacing the Phaser game.

This preserves one shared game/client codebase for iOS, Android and web while allowing native features where they materially improve the product.

### Architectural guardrail for future Nova instances

**Do not bury product/domain logic inside the Phaser scene.** Quest definitions/state transitions, dialogue data, family/household data, progression, economy, scheduling and persistence contracts should live outside rendering code wherever practical. Phaser should primarily consume state and render/operate the world.

This separation matters because it:

1. keeps React, Phaser and Capacitor responsibilities clear;
2. makes Supabase integration safer;
3. lets web and native builds share the same domain logic;
4. leaves open a future renderer/client migration if Sysselcraft eventually outgrows Phaser.

A future move to Godot/Unity should only be reconsidered if the game grows into requirements such as substantially heavier physics, very large/complex worlds, advanced 3D, extreme GPU load, or simulation demands that Phaser genuinely cannot meet. Do not pre-emptively rewrite for hypothetical scale.

### Development/build implications

- Continue normal GitHub-based development.
- Capacitor/iOS has already been generated locally and successfully run on a physical iPhone. Do not restart the Capacitor migration or run `npx cap add ios` again.
- Native device testing uses Xcode/iOS tooling and can later move toward TestFlight; Android can use the corresponding native tooling.
- Vercel remains useful for browser previews but **should not be required for every gameplay iteration**.
- **Vercel has a limited deployment quota. Treat deploys as a scarce resource.** Do not deploy every small change independently. Accumulate related work into larger, coherent batches/commits and use Vercel when that batch is ready for browser verification. Prefer one meaningful verification deployment over several incremental deployments.
- When Vercel quota is exhausted or a deployment is not necessary, continue all work that can be safely developed and verified without Vercel rather than blocking development.
- **The resource to minimize is Vercel deployments, not Git commits or ordinary GitHub Actions CI.**
- The repository is public. As of 2026-09-13, the user has explicitly approved autonomous use of normal GitHub-hosted Actions for this public repository. Standard CI/build/test runs are not to be treated as a scarce paid-minute budget and do not require per-run approval.
- Do not select larger/billed GitHub-hosted runners, paid third-party runners/services, or other explicitly chargeable compute without approval.
- `[skip ci]` is no longer required for the purpose of saving Actions minutes. Skip CI only when there is a technical reason to do so.
- **Important observed Vercel behavior:** the current Git integration also creates preview deployments for pushes to non-`main` branches. A remote work branch therefore does *not* by itself reduce total Vercel deployments; it merely changes them from production deployments to preview deployments.
- To genuinely minimize Vercel usage, distinguish **committing** from **pushing** where the development environment permits it, and batch coherent deploy-triggering pushes whenever practical.
- Related work should reach `main` in deliberate batches. The real quota pressure is unnecessary Vercel builds, not CI validation.

### Nova / Codex development workflow (2026-09-15)

**Nova is the primary developer. Codex is a local specialist, not the default coding path.**

Nova should directly handle work that can be performed through the repository and available connected tools: architecture, product/design reasoning, repository audits, TypeScript/React/Phaser/backend implementation, normal refactors, tests, documentation, code review and GitHub changes. Do not delegate ordinary coding to Codex merely because Codex can write code.

Use Codex only when the task materially depends on context Nova cannot directly reach, especially:

- the user's local Mac working tree when it contains uncommitted work not present on GitHub;
- generated/local-only `ios/` state;
- Xcode build/run/debug work;
- physical iPhone interaction and device-only failures;
- localhost/runtime inspection that requires the user's machine;
- other local files, tools or state unavailable through Nova's connected environment.

When Codex is necessary, **Nova should do the thinking first**. Inspect the repository and documentation, determine the intended change, identify the smallest relevant file set and define verification criteria before handing work to Codex. Give Codex a narrow, surgical work order rather than asking it to rediscover the project, perform broad product analysis or autonomously explore the repository.

A good Codex task should state:

1. exact goal and expected result;
2. relevant files or local subsystem;
3. constraints and invariants that must not change;
4. exact tests/build/runtime checks to run;
5. what Codex must report back, normally changed files, important diff summary, test results and any blocker;
6. a clear stop condition.

Prefer one bounded operation at a time. Avoid repeatedly feeding Codex the entire project history or asking it to continue development indefinitely. Codex usage is token-constrained and has previously exhausted its available token budget within minutes when given broad autonomous tasks.

Never let Codex perform destructive local Git operations such as blind `reset`, `clean`, `stash`, overwrite or pull-over-local-work when valuable uncommitted Mac/iOS work may exist. Inspect and preserve the working tree first.

Working model:

- **Nova** = lead developer, architecture/design continuity, implementation and review.
- **Codex** = local hands for machine/device-specific work beyond Nova's reachable environment.
- **Kalle** = product owner, acceptance tester and operator of the physical/local environment.

The purpose of this split is not merely token economy. It keeps product and architectural continuity with Nova while using Codex where local execution genuinely adds capability.

### Current status of this decision

This architecture is implemented far enough to have run successfully on a physical iPhone. Supabase backend work is also underway/connected. Verify current repository state and handoff manifest for exact current implementation before changing it.

---

## Historical implementation handoff

The repository contains the playable village prototype, pathfinding, quest approval loop, reusable visual assets, data-driven Linus intro and puppy companion work developed during the web prototype phase. Preserve those systems. Before making implementation claims, verify current `main`, CI and Vercel because older commit/deployment identifiers in historical handoff material may be stale.

### Core invariants to preserve

- Next.js/React + Phaser current client.
- Phaser remains browser-only dynamically imported where required by Next.js SSR.
- Tap-to-move/pathfinding and desktop WASD/arrow movement.
- Quest flow: `available -> pending -> approved`, or pending back to available via return/completion-needed flow.
- No rewards/progression before adult approval.
- Repository is public: never commit secrets, private family/child data, service keys or private environment files.
- No `package-lock.json` should be introduced casually; freeze dependencies deliberately.
- Standard GitHub-hosted Actions are acceptable for this public repository; avoid explicitly billed larger runners.
- Public game URL during the web phase: `https://sysselcraft.vercel.app`.

### Interaction invariant

**Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**

The child moves through the world; contextual NPC/world interactions may approach targets automatically when appropriate. UI-like elements such as quest markers remain directly tappable.

### Rendering/world architecture

- Concept art is the visual north star, not a giant background image.
- Reusable world assets over procedural production-facing geometry.
- Y/base-depth sorting communicates space.
- Rendered sprite bounds and collision footprints are separate concerns.
- Existing house, construction-zone and original tree collision footprints should not be casually changed while visual assets evolve.
- Current SVG assets are a bridge toward a coherent raster PNG/WebP sprite-atlas pipeline with nearest-neighbour scaling.

### Current gameplay/story direction

The family arrives in a nearly abandoned village. Linus is genuinely glad that somebody has moved into the old house, remembers when the village was lively, and hopes people will return without explicitly explaining that chores cause population growth. Linus has been caring for a puppy; because the puppy needs more walking than his knee appreciates, he offers the puppy to the child. The child names the puppy and it becomes a companion rather than an XP/progression machine. The intro then leads naturally into the first real-world quest, **Bädda sängen**.

The first-loop proof remains the priority: child does real task → submits → adult approves → reward → truck/material event → visible world change. Do not rush into Henning, Sol or the full building roster before this loop feels magical.

### Current technical priority

Complete and validate the parent → paired child → backend quest → child submit → parent approval → exactly-once server reward loop, while preserving the existing local save until reconciliation has been tested. Use normal GitHub Actions CI freely for build/test validation on the public repository, but continue conserving Vercel deployments.
