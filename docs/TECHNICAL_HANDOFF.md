# Sysselcraft Technical Handoff

> This handoff contains older implementation history below. **The mobile/native architecture decision in this section supersedes browser-only assumptions elsewhere in the document.**

## 2026-09-13 architecture decision: native app direction

Sysselcraft should no longer treat mobile Safari as the intended final gameplay container. Device testing showed that even with landscape CSS and full dynamic viewport height, browser chrome/overlays and Phaser's fixed world aspect make the experience feel like a webpage rather than a game.

### Chosen direction

**Keep React + Phaser and package Sysselcraft as a native iOS/Android app using Capacitor.**

Do **not** rewrite the game in Godot/Unity at this stage. The current 2D isometric village, interaction model and foreseeable family/quest features do not justify throwing away the existing TypeScript/Phaser client.

Target architecture:

- **React** = app shell and non-world UI
- **Phaser** = village/game rendering, movement and moment-to-moment world interaction
- **Capacitor** = thin native iOS/Android container and bridge to native device capabilities
- **Supabase** = planned future persistence/backend for accounts, households, child profiles, quests and progression; still intentionally not connected until the UX loop is proven
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
2. makes Supabase integration safer later;
3. lets web and native builds share the same domain logic;
4. leaves open a future renderer/client migration if Sysselcraft eventually outgrows Phaser.

A future move to Godot/Unity should only be reconsidered if the game grows into requirements such as substantially heavier physics, very large/complex worlds, advanced 3D, extreme GPU load, or simulation demands that Phaser genuinely cannot meet. Do not pre-emptively rewrite for hypothetical scale.

### Development/build implications

- Continue normal GitHub-based development.
- Once Capacitor is introduced, native device testing can use Xcode/iOS tooling and later TestFlight; Android can use the corresponding native tooling.
- Vercel remains useful for browser previews but **should not be required for every gameplay iteration** once a practical native development loop exists.
- **The resource to minimize is Vercel deployments, not Git commits.** Small/frequent commits are welcome when they improve traceability, rollback safety or development flow.
- The current Git integration deploys every push to `main`, so related work should be accumulated away from `main` where practical and pushed/merged to `main` in deliberate batches. The goal is fewer Vercel deploys, not an artificially sparse Git history.
- Do not apologize for or avoid useful commits merely to reduce commit count. Instead, control how often deploy-triggering changes reach `main`.
- Introducing Capacitor will add native project/dependency files. Do this deliberately as a dedicated migration step, not piecemeal during unrelated gameplay work.

### Current status of this decision

This is an **approved architectural direction**, not yet an implemented Capacitor migration. The current repository is still Next.js + React + Phaser deployed through Vercel. Do not tell the user that a native build exists until the Capacitor project has actually been added and tested on-device.

---

## Historical implementation handoff

The repository already contains the playable village prototype, pathfinding, quest approval loop, reusable visual assets, data-driven Linus intro and puppy companion work developed during the web prototype phase. Preserve those systems when introducing Capacitor. Before making implementation claims, verify current `main`, CI and Vercel because older commit/deployment identifiers in historical handoff material may be stale.

### Core invariants to preserve

- Next.js/React + Phaser current client.
- Phaser remains browser-only dynamically imported where required by Next.js SSR.
- Tap-to-move/pathfinding and desktop WASD/arrow movement.
- Quest flow: `available -> pending -> approved`, or pending back to available via `Behöver kompletteras`.
- No rewards/progression before adult approval.
- Current prototype approval reward: 5 diamonds + 10 SysselBux.
- Supabase remains intentionally disconnected for now.
- Repository is public: never commit secrets, private family/child data, service keys or private environment files.
- No `package-lock.json` should be introduced casually; freeze dependencies deliberately.
- Standard GitHub-hosted Actions are acceptable; avoid billed larger runners.
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

### Next technical step after this documentation checkpoint

Do not spend another substantial pass perfecting iPhone Safari fullscreen/canvas behavior before deciding the migration sequence. The next architectural implementation package should plan and introduce Capacitor cleanly while preserving the existing web build as a preview/fallback. Landscape should be the primary mobile/tablet presentation target.
