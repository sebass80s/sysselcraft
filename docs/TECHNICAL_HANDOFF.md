# Sysselcraft Technical Handoff

> Current-state sections and `docs/NOVA_HANDOFF_MANIFEST.md` supersede stale historical assumptions.

## Current technical checkpoint — 2026-10-03

Canonical workspace remains `/Users/karoaa/Developer/sysselcraft` on `nova/local-construction-snapshot`. Never regenerate the existing native iOS project.

Act 2 has reached its physical chapter ending on the preserved iPhone test save. The current persisted close boundary is `act2Complete && endCardSeen`.

Foundation rules now locked:
- `src/game/uiShellState.ts` owns global gameplay chrome visibility. Domain state may say whether the world is ready or a blocking overlay is active, but project/quest selection must not become an accidental HUD kill-switch.
- `selectedProject=null` is normal during active Act 2. Alve stays visible at his idle anchor then.
- Once `act2Complete && endCardSeen` is true, Alve is deliberately absent and Act 2 no longer asks for work.
- Completed Act 2 exposes `← Till byn` plus `Till kapitel 3 →`.
- `/act3` is currently a read-only boundary only. It must remain free of Act 3 persistence until the Act 3 runtime owns that state.
- Story Engine remains the canonical story presentation layer. Do not create another act-specific fullscreen story stack.
- The next architectural extraction before substantial Act 3 runtime work is the World/Area Engine and versioned Save/Migration Engine.

The preserved physical save must not be reset. It is a real migration fixture.


## Continuous cleanup discipline — LOCKED 2026-10-03

Cleanup is part of implementation.

Whenever a new runtime, UI contract, state model, test harness, route, asset rule or architecture primitive replaces an older one, the same workstream must also remove the superseded residue. Do not defer obvious cleanup to a future “big cleanup”.

Required closeout for replacement work:
1. remove dead/superseded code, helpers, routes, CSS and debug surfaces;
2. rename prototype/placeholder identifiers that no longer describe the real runtime;
3. update tests so they assert behavior/contracts rather than obsolete source-code shape;
4. remove stale constants, flags, comments, prices, copy and status text;
5. update canonical MDs and handoff material immediately;
6. search for the old symbols/phrases/values across the repo;
7. run the normal verification/CI against that cleaned state.

Exceptions require a concrete reason, such as backward compatibility, persisted migration support or an intentionally retained test fixture. In those cases the old path must be explicitly labeled and covered, not silently left behind.

## Historical checkpoint — physical iPhone verified 2026-09-21

Canonical workspace: `/Users/karoaa/Developer/sysselcraft`, branch `nova/local-construction-snapshot`.
The existing `ios/` project has been restored into this workspace and is now preserved in version control. **Never regenerate it or run `cap add ios`.**

Kalle verified the following on a real iPhone from a clean save on 2026-09-21:

- onboarding; Bädda sängen; adult approval;
- stage 1: Linus interaction, truck, delivery and Recycling spawn;
- Recycling stages 2, 3 and 4, earned sequentially using the native test controls;
- completion dialogue with Linus and the Henning hook;
- force-quit/relaunch: completed Recycling persists and completion dialogue does not replay;
- adult-mode vertical scrolling and reset on the physical device.

This is user-reported physical-device evidence, in addition to automated checks. It does not establish production quests/thresholds for stages 2–4 or backend/two-device reconciliation.
All four Recycling stages are now playtested, so Bakery pacing may begin to be designed from this evidence. **Henning has NOT spawned; Bakery is NOT activated.** Do not implement Bakery thresholds or exact Henning arrival until those product decisions are made. This checkpoint supersedes the older current-priority and first-loop-only status below; historical design gates are not blanket claims of completion.

See `docs/IOS_CHECKPOINT.md` for the native inventory and checkout/build workflow.

### Pairing direction and physical reconciliation gate — 2026-09-21

The backend pairing contract is **parent creates code -> child device redeems code**. The parent page calls `createChildPairingCode`; the child route `/pair` calls `redeemChildPairingCode`. A stale/other UI observed during physical testing described the reverse direction, so native navigation/copy has been made explicit. Do not redesign the RPC direction unless the product decision itself changes.

The real Supabase project currently contains one child profile and no device binding. The physical iPhone still has the valuable local Recycling-complete save. Preserve it. The next physical checkpoint is to pair that existing installation, capture `?debug=reconciliation`, and verify that pairing/diagnostics do not mutate either ledger before any migration write policy is designed.

Native routing finding (physical iPhone, 2026-09-21): Safari Web Inspector proved that tapping child pairing changed the URL to `capacitor://localhost/pair` while the document body still contained the root village UI. The static export previously emitted file-style sibling routes without directory-route compatibility. The native export now uses Next `trailingSlash: true` and links to `/pair/` and `/parent/`, so Capacitor can resolve the route to the corresponding directory `index.html`. This must be physically re-verified before being treated as closed. The directory-route attempt was then physically disproved: Capacitor 8.5.2's native router maps extensionless paths to the root `index.html`, even when `pair/index.html` exists in both `out` and `ios/App/App/public`. Native child pairing therefore no longer navigates to `/pair`; it opens the shared `ChildPairingPanel` inside the root app. `/pair` remains a web entry point using the same component. Physical verification is still required.

## Local workspace safety law (LOCKED 2026-09-16)

The canonical local working tree on Kalle's Mac is:

`/Users/karoaa/Developer/sysselcraft`

This path is intentionally outside OneDrive and other cloud-synced folders. OneDrive previously interfered with the working tree while synchronizing a very large number of files, so local agents must treat cloud-synced copies as unsafe/non-canonical.

**Before any local Codex or other local-agent edit, build, Git operation or inspection:**

1. Run `cd /Users/karoaa/Developer/sysselcraft && pwd -P`.
2. Continue only if the resolved physical path is exactly `/Users/karoaa/Developer/sysselcraft`.
3. Run `git status` before editing and preserve all existing uncommitted work.

Hard rules:
- Do not access, copy, move, edit, build from or use a Sysselcraft repository under OneDrive, `CloudStorage`, cloud-synced Desktop/Documents or any other synced location.
- Do not relocate the canonical repository into a synced folder.
- If the resolved physical path differs from the canonical path, **STOP and report the mismatch** rather than attempting to repair or migrate it autonomously.
- Never use `git reset`, `git clean`, `git stash`, `git restore`, checkout-overwrite or similar destructive/working-tree-changing operations on existing work unless Kalle explicitly approves that exact action.
- Existing local v4/PoC/native changes may be ahead of GitHub. GitHub state must not be assumed to supersede the local working tree.

This rule applies to **Codex, current Nova and every future Nova/handoff**. Any local-work prompt should repeat the canonical path and safety check explicitly.

## Autonomous execution law (LOCKED 2026-09-15)

**When the user says `kör`, `kör på`, `bara kör`, `bygg på nu`, `fortsätt` or equivalent after a direction has been established, Nova must continue advancing the actual project autonomously until there is a genuine blocker that requires the user.**

This is an implementation instruction, not an invitation to stop after another planning cycle.

- Default sequence: verify current state -> implement -> run the safest available checks -> inspect evidence/results -> fix issues that can be fixed autonomously -> continue to the next natural implementation step.
- Do not return merely to announce what the next step will be when Nova can perform that step safely.
- Once a visual/product direction has been approved, **implementation has priority over additional concept exploration**.
- A concept image, design sketch or source-code inspection is never evidence that something is "in the game". That claim requires integration into the actual runtime; runtime success claims require runtime evidence.
- For visual work, move approved art toward playable Phaser assets/runtime as soon as the direction is sufficiently decided.
- Use Nova's available tools autonomously where safe. When the necessary repository state exists only on the user's Mac, use the established Nova + local Codex workflow rather than pretending a GitHub-only edit represents the local game.
- Do not overwrite, reset, clean or otherwise endanger valuable local/iOS/uncommitted work merely to maintain momentum.
- Stop and ask the user only for a genuine external dependency, product decision, credential/permission, physical-device action, local result that Nova cannot observe, or a risky/destructive action that requires explicit approval.
- When blocked on one subtask, continue other safe useful work when possible instead of stopping the entire project.
- Truth remains above momentum: autonomous execution never permits invented state, fake verification, fake runtime evidence or claims that a mockup is implemented.

Short user shorthand: **`Kör hela vägen` means carry the current agreed direction through implementation and verification as far as safely possible before returning.**

## 2026-09-14 visual/rendering architecture

Canonical visual direction is `docs/ART_DIRECTION.md`:

> **En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.**

The approved questgiver-discussion renders define the intended visual family: **soft, warm, organic, detailed, painterly isometric storybook art**.

### Critical anti-regression note

There is **no pixel-art target**. Historical pixel-heavy builds are obsolete visual experiments/intermediates. Never optimize toward 8/16-bit aesthetics, crisp pixels, nearest-neighbour rendering, low-resolution sprite appearance, blocky tiles or pixel-RPG chrome merely because older assets use them.

There is also no mandatory bitmap/vector format. Use the representation that best achieves the approved look and performs reliably on physical devices.

## True 2.5D rendering contract

**2.5D is a hard product/art requirement, not shorthand for Y-sorting and not a pixel-art genre.** The world must read as a spatial illustrated place rather than a flat field carrying sprites.

### Projection and asset geometry

- Use one coherent isometric/three-quarter projection language throughout the village.
- Buildings and substantial props expose believable height and visible faces.
- Fences, stone walls, wells, porches, stairs, bridges, carts and similar objects need thickness/side faces when visible from the camera.
- Neighboring assets must not imply incompatible camera elevations or projection angles.
- Decorative stylization is welcome, but perspective contradictions are not.

### Base points, depth and occlusion

Treat these as separate data/concepts:
1. **render bounds**;
2. **ground/base point**;
3. **occlusion/depth base**;
4. **collision footprint**;
5. **interaction footprint/target**.

They must not be conflated merely because a sprite has a rectangular image box.

- Player, dog, NPCs and relevant movable/delivered objects use Y/base depth.
- Tall static world objects participate in the same spatial ordering through their base points.
- The child must visibly pass behind a tree/building/prop when spatially behind it and in front when spatially in front.
- Foreground foliage can intentionally occlude characters while interaction/collision remain reliable.
- Y-sorting alone does **not** satisfy true 2.5D if the art still reads as flat stickers.

### Ground plane and terrain

- Terrain is visually continuous. The pathfinding grid is strictly invisible.
- Grass must not expose large repeated rectangles, tile seams or wallpaper repetition.
- Roads/paths are ground-plane material, not sprites/cards floating above grass.
- Dirt/grass edges should be organic, irregular and locally varied.
- Road segments that are technically separate must visually fuse into a continuous route.
- Avoid broad baked shadows/background fills inside road/prop assets that reveal rectangular bounds.

### Shadows and grounding

- Contact shadows are soft and anchored around an object's base/footprint.
- Shadow direction/softness should be coherent enough that the scene feels illuminated as one place.
- Shadows communicate weight and height without becoming dark outlines around every sprite.
- Character/NPC/dog grounding should remain readable during movement.

### Scene composition

The target is a **cohesive camera composition**, not a bag of nice assets.

- Compose vegetation as masses and layers rather than evenly distributed stamps.
- Use foreground, midground and background vegetation to establish depth.
- Keep useful negative space for movement and readability.
- The opening village is intentionally sparse/mildly neglected, but should still feel deliberately illustrated rather than unfinished.
- The family cottage and yard are the first hero environment and should establish the perspective grammar for later buildings.
- Environmental detail should support place, story, depth or progression.

### Rendering implementation laws

- Phaser remains renderer/gameplay engine; no engine rewrite is implied.
- Renderer should use antialiasing appropriate to the soft illustrated art. Do not globally force pixel/nearest-neighbor rendering.
- Logical navigation/collision stays independent from artwork size.
- Do not change collision solely because artwork becomes taller/wider unless the ground footprint genuinely changes.
- SVG/vector, bitmap PNG/WebP, spritesheets/atlases or hybrids are all allowed.
- Runtime optimization may rasterize art but must not visually pixelate the result.
- UI should harmonize with the illustrated world and avoid generic retro-RPG chrome.

## Construction reveal choreography (LOCKED 2026-09-16)

A progression threshold and its visible construction reveal are deliberately separate states. This prevents earned progress from being lost while ensuring the player is physically near the building when a visual construction change occurs.

**Domain sequence for later building stages:**

`approved real-world effort -> progression earned -> pending construction event -> resident attention -> player visits resident at building site -> conversation/interact -> construction reveal -> visible stage committed`

Rules:
- `progression earned` means the approved real-world action has permanently earned the next construction step. It must survive reload/app close and must not depend on the player seeing an animation immediately.
- `construction revealed` means the child has reached the relevant world location and witnessed the change. Presentation must not be used as the source of truth for whether progress was earned.
- A pending reveal moves/places the relevant guide resident at an authored activity/approach point beside the future/current building site. For Recycling stages 2-4, the guide is **Linus**.
- While a reveal is pending, HUD may show **"Linus vill prata med dig"** and Linus receives the appropriate world attention marker. The HUD prompt is discovery guidance, not a teleport or automatic construction trigger.
- The child travels through the world to Linus. Interacting/talking with him at the site triggers the reveal only when the camera/player is naturally at the construction location.
- The HUD mechanism must be generic under the hood (`resident wants to talk` / resident attention), so Henning, Sol and later residents can use the same system.
- The resident-attention/reveal mechanism belongs to domain/game state above Phaser. Phaser renders the pending event, resident placement, HUD/world marker and reveal presentation.
- A pending construction reveal remains pending across reloads until consumed idempotently. Reopening the app must not silently skip or duplicate the reveal.
- The visible building stage and its collision/navigation footprint activate together when the reveal is committed.
- Do not expose hidden numeric construction progress merely to explain this sequence. **Visa progression. Redovisa den inte.**

**Recycling exception:** Recycling stage 1 keeps the already verified truck/delivery reveal. The truck delivery is its construction reveal. The Linus-at-building-site choreography begins with Recycling stage 2 and is reusable for stages 3-4 and later buildings/residents.

This solves a camera/composition problem intentionally: construction changes must not play unseen on the far side of the map while the child is still standing at the family house after a quest/approval flow.

## Multi-area village world architecture (LOCKED 2026-09-15)

**Sysselcraft grows through multiple connected world areas, not by continuously enlarging one mega-map.** The current 1920 × 640 Phaser village remains the opening/start area.

- Areas have their own illustrated environment, world objects, buildings, NPC placements, collision/navigation data and quest sources as needed.
- Areas connect through **physical exits in the world**: roads, paths, bridges, forest openings or similar transitions.
- Reaching an exit by moving the avatar transitions to the connected area, entering from the corresponding side.
- Do **not** default to a menu, level-select screen or abstract teleport UI between adjacent village areas.
- A short soft visual transition/loading handoff is acceptable; the fiction is that the child walked there.
- Connections are bidirectional unless story/world design explicitly requires otherwise.
- Existing movement law remains: avatar movement explores the world; tap/click operates game/UI interactions.
- Each area may evolve independently through progression.
- Do not overcrowd the opening village merely because a future building exists.
- Keep mobile/native performance in mind: only the active area and genuinely necessary shared resources should need active rendering/gameplay.
- Cross-area progression/state belongs to game/domain state, not to a single Phaser scene.
- Exact future exits/topology remain design decisions. The **multi-area architecture itself is locked**.

## Village Event Director (FUTURE DESIGN DIRECTION 2026-09-15)

Do not implement this before the current visual PoC and first recycling progression arc are proven.

Future resident life should be driven by a small **Village Event Director**, not a blind random-event engine and not ad-hoc Phaser timers. Randomness may choose among valid authored candidates; it never decides what is narratively valid.

Three layers:
1. **Story events** — deterministic/progression-owned, e.g. Henning's arrival.
2. **Village events** — state-aware authored scenes, including Henning's recurring schemes.
3. **Ambient activities** — tiny everyday behaviors, often without dialogue modal: sweeping, carrying a tray, feeding birds, sitting by the well, walking with coffee, greeting the puppy, short resident-to-resident exchanges.

Shorthand: Ambient = **the village is alive**. Village event = **what are they doing now?** Story event = **something important changed**.

The Director should evaluate residents, unlocked buildings/areas, progression prerequisites, event history, seen counts, cooldowns, recent tags, novelty/repetition and authored weights. Persistent history should prevent back-to-back major Henning schemes, suppress repetition, respect resident arrival order, allow quiet periods after major story beats and prevent one-shot narrative replay.

Ambient content should be cheap. Favor reusable **activity points + behaviors**, e.g. `Henning + bakeryDoor + idle`, `Linus + well + sit`, `Sol + clinicDoor + idle`, `Henning + Linus + well + conversation`. The key effect is that residents are not nailed permanently to questgiver coordinates.

> **NPCs are residents, not buttons.**

Architectural boundary: the Director belongs above Phaser in domain/game state. Phaser presents the selected activity/event but does not own the narrative decision. Event history/cooldowns should persist with durable village state.

## Visual acceptance gate

Do not declare the visual redesign finished from source inspection alone. Validate the running scene locally and then on a physical landscape iPhone.

A pass fails if first glance reads as flat top-down/stickers, pixel/retro aesthetics dominate, major objects lack volume, front/behind traversal fails, perspectives conflict, terrain reveals asset rectangles/grid seams, shadows/collision/depth disagree, or UI overwhelms the storybook world.

A pass succeeds only when the scene reads together as **soft illustrated isometric storybook + genuine 2.5D spatial depth** while preserving gameplay clarity.

## Quest-source architecture

Product law: **quests belong to the world, not to the house.**

The family house is one quest source. The domain/rendering model must permit quest sources to be NPCs, buildings, places, world objects or system/world events without house-specific special cases.

World quest markers use familiar language. A yellow `?` may mark an NPC with relevant dialogue/discovery; `!` may identify an available quest/actionable source. These markers are UI-like world elements and can be directly tapped/clicked under the established interaction law.

Do not encode future quest selection/presentation around an assumption that every quest originates at the family house.

## First-quest onboarding correction

Required sequence:

`Linus dialogue -> Linus tells child to go to family house -> return to world -> house quest marker is next destination -> player interacts with house/marker -> first quest opens`.

This correction must not alter the verified backend/approval/delivery semantics.

## Native architecture

Keep React + Phaser in Capacitor for iOS/Android. Supabase provides accounts, household/child, parent-created quests, pairing and server-authoritative rewards. Web/Vercel remains preview/fallback.

Capacitor/iOS already exists locally and has run on a physical iPhone. Do not run `npx cap add ios` again. Native loop: `git pull` -> `npm run ios:sync` -> Xcode App > iPhone > Run.

Wireless Xcode device debugging may work after initial pairing; cable remains useful for pairing/recovery.

## Physical iPhone baseline (2026-09-14)

The first currently playable progression loop has been physically verified end-to-end on iPhone:

`Linus -> first quest -> parent mode -> approval -> truck arrives -> delivery completes -> truck departs -> building materials + wheelbarrow remain -> free movement/current content boundary`.

Observed:
- quest can be opened from the house;
- parent mode triggers;
- parent approval succeeds;
- truck sequence triggers after approval;
- truck leaves correctly;
- delivered materials and wheelbarrow remain;
- player can continue walking after the current content boundary.

Known visual QA issues from the intermediate build included repetitive terrain, weak terrain/path transitions, sticker-like object placement and insufficient spatial grounding. Those screenshots are **before/reference evidence**, not visual targets.

Treat the physical-device loop as a regression baseline. Backend/quest/approval/reward code should be kept in bubble wrap unless a concrete change is required.

## Core invariants

- Tap-to-move/pathfinding + desktop WASD/arrows.
- Quest lifecycle `available -> active -> pending -> approved`; rejection returns pending to active. `available` means offered but not yet accepted by the child.
- No rewards/progression before adult approval.
- Interaction law: **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**
- UI-like world elements may be directly tapped/clicked without requiring avatar traversal first.
- Do not bury product/domain logic in Phaser.
- Public repo: never commit secrets/private family data/service keys/private env.

## Current technical priority

1. Preserve the physically verified Recycling four-stage loop and completion scene as the gameplay regression baseline.
2. Finish Quest System v2 daily-use plumbing: recurring definitions/instances, parent definition management, unified world progression, and world-aware child presentation.
3. World presentation currently supports home, Linus and selective noticeboard sources. Source attention uses the locked visual language: `?` for `available` quests to accept, `!` for approved quests ready to turn in at Linus, and speech bubbles for authored story/dialogue attention. `active` and `pending` instances remain in the quest UI without masquerading as new world quests.
4. Reuse existing world affordances instead of stacking duplicate markers: the home quest marker for home-routed backend quests, Linus himself for Linus-routed quests, and the noticeboard marker for noticeboard quests.
5. Keep the built-in local `Bädda sängen` onboarding ledger separate from backend quest ownership until an explicit reconciliation/migration strategy is implemented.
6. Bakery routing is dormant until both Bakery is unlocked and Henning exists in persisted world state. Production Bakery art alone must never activate that source.
7. Next larger gameplay slice is Henning/Bakery progression and arrival, but exact Bakery thresholds and Henning arrival staging remain product decisions and must not be invented.
8. Re-test Quest System v2 source interactions, recurrence and parent management on physical iPhone before declaring the daily-use foundation child-ready.
9. Village Event Director remains intentionally later and must not steal MVP focus.

## Deployment/resource policy — LOCKED 2026-10-01

**Local/native testing is the default. GitHub Actions is the routine remote verifier. Vercel is for acceptance checkpoints and releases.**

Canonical workflow:
1. push relevant code changes to GitHub;
2. let GitHub Actions verify every relevant code push;
3. batch multiple small code/copy/test/refactor changes on the feature branch;
4. create a Vercel preview only when Kalle actually needs a meaningful browser/remote acceptance checkpoint;
5. create a production deployment only for an actual release.

Storage discipline:
- docs-only, Markdown-only, handover-only and similarly trivial commits must not generate Vercel deployments; use an Ignored Build Step or equivalent Vercel configuration;
- do not deploy after every copy fix, UI tweak, test fix or tiny refactor;
- keep feature branches short-lived and close/merge them when the workstream is done;
- normally keep one useful current preview per active workstream rather than many near-identical snapshots;
- after merge, do not preserve old preview history without a concrete reason;
- local browser + native Xcode/iPhone testing should answer questions whenever remote deployment is unnecessary.

Reason: the project has hit the Vercel Hobby deployment-storage ceiling in practice. Treat Vercel storage as scarce.

Standard GitHub-hosted Actions are approved autonomously. Avoid explicitly billed/larger runners or paid third-party compute without approval.

## Nova + local Codex workflow (2026-09-15)

The user has Codex desktop locally and can open the canonical local `sysselcraft` working tree at `/Users/karoaa/Developer/sysselcraft`. This is the approved implementation path when work requires the local tree.

- **Nova owns continuity, product/design decisions, architecture, review and task decomposition.**
- **Codex acts as local implementation hands** for focused repository edits, local inspection and local verification.
- Every Codex prompt that touches the local repo must repeat the **Local workspace safety law** above: verify `pwd -P` equals `/Users/karoaa/Developer/sysselcraft`, never use OneDrive/CloudStorage/synced copies, and inspect `git status` before editing.
- Prefer narrow, explicit Codex tasks with named files, invariants and a clear stop condition.
- Before Codex work inspect `git status`. The local tree may contain valuable native/iPhone work and unrelated modifications; Codex must not reset, clean, stash, restore, stage, overwrite or commit those unless explicitly required.
- For risky edits, make the smallest diff and show exact diff, local checks and `git status` before commit.
- Local TypeScript/build/runtime checks are preferred before spending remote resources.
- Vercel deployments and GitHub Actions remain separate controlled resources.
- Codex does not replace evidence requirements: source inspection is not runtime proof.
- If Codex reports a result, Nova reviews the diff/evidence rather than treating the success statement as sufficient proof.


## Native one-command sync + offline turn-in proof (2026-09-22)

Routine physical-iPhone update plumbing is now intentionally reduced to `npm run syssel` from the canonical local repo. The command is implemented by `scripts/syssel` and:

- requires `/Users/karoaa/Developer/sysselcraft`;
- requires branch `nova/local-construction-snapshot`;
- aborts rather than touching unexpected local modifications;
- preserves the known local `ios/App/App/config.xml` modification;
- performs only fast-forward pull, web build and `npx cap sync ios`;
- never resets/cleans/stashes, deletes the installed app or regenerates `ios/`.

Afterward, physical deployment still requires the human to press Run in Xcode. Prefer this helper over asking Kalle to copy a repeated terminal recipe. Codex/Work is not required for routine sync; Nova continues normal implementation through GitHub and uses the Mac only for native/physical boundaries.

Physical-device evidence now also covers the full offline approval/reward path: a child-submitted quest survived full child-app closure while the parent approved it elsewhere; on relaunch Linus retained the reward turn-in; claiming paid the reward and the authoritative backend wallet was visible in the village HUD/inventory. The implementation persists submitted instance IDs awaiting approval and recovers only those instances when they later become approved and unclaimed. Do not infer turn-ins from arbitrary historical approved quests.


## Physical quest correction loop proof (2026-09-22)

The live two-device correction path is now physically proven for a one-off quest: submit -> reject -> same instance becomes available again -> resubmit -> approve -> Linus turn-in -> claim -> force-quit/relaunch. During the `Testa rejection` run, backend checks confirmed `reward_events = 0` and no wallet/progression change through approval. Claim created exactly one reward event, set `claimed_at`, and paid the snapshotted 💎1 / 🪙1 reward. Relaunch produced no duplicate reward or replay.

Linus currently renders `pendingTurnIns[0]`, so multiple approved/unclaimed rewards are intentionally surfaced sequentially rather than simultaneously. During physical QA an older pending turn-in hid the newly approved test quest until the older reward was claimed; the new quest then appeared normally. Do not misdiagnose this as approval recovery failure. A future UX pass may summarize or list multiple rewards, but must preserve server-authoritative claim/idempotency semantics.


## Alpha delivery hardening checkpoint — 2026-09-22

Delivery/runtime policy now has three explicit boundaries:

1. **Dependency reproducibility:** `package-lock.json` v3 is committed. GitHub CI uses Node 22 + `npm ci --no-audit --no-fund` and npm cache, then the canonical `npm run verify`. Do not return CI to range-resolving `npm install` unless deliberately regenerating the lockfile.
2. **Parent authentication:** real Supabase parent auth is web-parent-only for supervised alpha. The Capacitor child app has no native auth deep-link callback and should retain its anonymous paired-child session. Native parent auth requires a future separate authenticated-context design rather than bolting magic-link handling into the child session.
3. **Child debug surface:** ordinary native use hides stage-earning test controls, reconciliation diagnostics and destructive local reset. Those tools remain opt-in behind native `?debug=tools`. Pairing remains a legitimate device-management action. The legacy built-in `Bädda sängen` approval remains temporarily available in Vuxenläge so the local onboarding loop is not stranded.

Physical evidence on the current iPhone additionally covers update-in-place persistence, weekly current-period recurrence idempotency, safe same-child re-pairing/reuse rejection, landscape quest-panel interaction/long content, active Recycling WebP rendering and practical session smoothness. See `PLAYABLE_ALPHA_READINESS.md` for exact scope and remaining stress gaps.


## Mira general store runtime checkpoint — 2026-09-23

- The lanthandel remains a permanent navigation landmark at world x=1130, y=355 with the existing 205×72 footprint.
- Runtime preloads both `lanthandel-abandoned.webp` and `lanthandel-open.webp`.
- `worldFlags.miraArrivalSeen` is the persisted authority for the visual state: false/absent = abandoned, true = restored/open.
- Completing Mira's two-image arrival Story Moment persists the flag first and then swaps the live Phaser texture to the restored shop.
- On restore, `VillagePrototype` passes the persisted flag into `VillageGameHandle.setShopOpen`.
- The restored shop is directly tappable. The avatar pathfinds to the shop approach before `onShopInteract` opens the shop panel. The abandoned shop is not interactable as a store.
- The first shop panel currently exposes the authoritative backend wallet when available but intentionally performs no spending yet.
- Do not implement spending by mutating local `diamonds`/`sysselBux`. Parent-created quest rewards are backend-authoritative; real purchases require a backend-authoritative atomic purchase path plus a locked inventory/pricing decision.

## Supabase Data API grants (2026-09-24)

Migration rule for every new table in an exposed schema such as `public`: declare Data API grants explicitly in the same migration that creates the table. Do not rely on Supabase's historical automatic table grants. SysselCraft uses least privilege: do not grant `anon` unless a feature genuinely requires that database role; child-device anonymous Auth sessions use the `authenticated` Postgres role. Grant only the direct table operations the client needs, keep authoritative writes behind RPCs, enable RLS on exposed tables, and verify grants plus Supabase security advisors after schema changes.

Current audit: all existing core tables already use authenticated SELECT-only direct access where required, with authoritative writes behind RPCs. The Diamond reward tables were corrected to the same model both live and in their creating migration: no `anon` table access, `authenticated` SELECT only. Future migrations must follow this rule so fresh projects, preview branches and database resets remain Data-API compatible after Supabase's 2026-10-30 default change.


## Diamond reward economy + parent password-auth checkpoint — 2026-09-24

Diamond rewards are now a backend-authoritative parent-defined IRL reward catalog surfaced through Mira's shop. The live schema uses `diamond_reward_definitions` and `diamond_reward_redemptions`, with authoritative RPCs for purchase, delivery, refund and parent catalog management. Direct Data API access remains authenticated SELECT-only; writes stay behind RPC authorization. Generated TypeScript types are current and `src/backend/diamondRewards.ts` uses them without temporary casts.

Transactional live-database tests have passed under rollback for exact-price deduction, redemption snapshots, insufficient-balance rejection, idempotent refund and delivery, no refund after delivery, no purchase after archive, and rejection of child attempts to create/update/archive parent rewards. These tests left no reward definitions or redemptions behind. They are backend acceptance evidence, not a substitute for the remaining physical iPhone purchase/fulfillment journey.

The parent web UI now has separate quest/reward tabs, parent catalog management and pending-delivery handling. The child Mira shop loads active Diamond rewards for the paired child's household, purchases through the atomic backend RPC and refreshes the authoritative wallet in the HUD. The remaining physical acceptance path is: parent creates rewards -> paired iPhone sees them -> child purchases -> wallet decreases exactly once and refreshes -> parent sees pending delivery -> parent marks delivered -> history persists -> restart preserves state.

Parent authentication on the active branch has moved from Magic-Link-only login to email + password for existing parent users. An authenticated parent can set a password on the same Supabase user via `auth.updateUser({ password })`; signed-out login uses `auth.signInWithPassword`. No account-creation or household-migration path was added. Existing identity must be preserved because household membership is attached to the existing Supabase user.

During preview acceptance, two distinct existing Supabase Auth identities were identified. The household-bearing parent identity is the Yahoo-address account; a Gmail-address login is a separate user with no household and therefore correctly renders the create-family state. Do **not** create a replacement family, merge users, copy household state, or overwrite ownership to work around this. The correct acceptance path is to authenticate the existing Yahoo parent identity and set/use a password on that same user. A still-valid older preview session has independently demonstrated that the Yahoo identity can read the existing household/child and execute parent quest RPCs.

Physical Diamond acceptance remains blocked only by completing the parent login/password transition and then running the real parent -> iPhone -> fulfillment journey above. Do not mark Diamond rewards physically accepted until that journey passes.


## Parent-auth identity acceptance boundary — 2026-09-24

Live Supabase auth/edge logs resolved the preview-login anomaly without database mutation. Two separate Auth identities exist:

- household-bearing parent: Yahoo-address identity, `64743174-4901-4c7e-ab00-d8aa061b16f5`;
- separate Gmail identity: `639c5ef7-7f40-4425-a4b0-cc12f9c6579f`, no household.

The Yahoo identity has independently proven access to the existing household/child and successful parent quest RPCs from the older working preview. The Gmail identity correctly receives an empty household result and therefore renders the create-family state. This is an identity-selection issue, not evidence of lost household data.

Hard safety rule: never create a replacement family for the Gmail identity, merge/copy users, rewrite household ownership, or otherwise repair data merely to bypass this login mismatch. Preserve the existing Yahoo identity.

The branch implements password auth by calling `signInWithPassword` for signed-out parents and `updateUser({ password })` for an already authenticated parent. Therefore the safe migration is: authenticate the existing Yahoo user once, set a password on that same user, then prove logout/password-login returns to the same household.

At handoff, repeated email attempts have triggered Supabase's email rate limit, so this acceptance step is temporarily externally blocked. Kalle still has an older working Yahoo-authenticated preview session and should keep it alive. Once the rate limit clears, test Yahoo on the newer preview, verify the existing family before setting the password, and then continue the Diamond physical journey.

Do not infer deployment contents from URL age. Verify the Vercel deployment/commit before claiming a preview contains the password-auth code.


## Parent password-auth physical acceptance — 2026-09-24

The password transition is complete and physically accepted for the existing household-bearing Yahoo identity. The preserved authenticated browser session was verified as Supabase user `64743174-4901-4c7e-ab00-d8aa061b16f5` and used with Supabase Auth's supported authenticated-user password update endpoint. The update returned HTTP 200 for the same user; no direct `auth.users` password-field mutation, new Auth user, household migration, ownership rewrite or Gmail workaround was used.

Kalle then successfully logged into the password-capable preview with that identity, verified the existing family/child, replaced the temporary password with a private permanent password through the shipped `setParentPassword -> auth.updateUser({ password })` UI, logged out, and logged back in successfully with the new password. The same household remained visible after reauthentication. Normal parent auth can therefore use email + password without Magic Link.

The earlier email-rate-limit blocker is closed for normal login. The one-time Magic-Link bootstrap remains recovery/bootstrap code, not the normal authentication path. The separate Gmail identity remains intentionally untouched.

After acceptance, Vercel Git previews were paused again via `vercel.json` with `git.deploymentEnabled=false` to preserve the project's limited preview/deploy budget. Re-enable only when a deployment is actually required.

Next acceptance target: the real Diamond parent -> paired iPhone purchase -> parent fulfillment -> restart path. Backend transactional evidence is already green; physical Diamond acceptance remains open until that device journey passes.


### Native first-Run stale bundle guard (2026-09-24)

Physical iPhone QA exposed a repeatable native-development issue: after a normal `npm run syssel`, the first Xcode Run could launch the previous web bundle while a second Run launched the current one. The canonical helper now makes this boundary deterministic:

- removes only the generated `out/` export before `npm run build`;
- writes `out/syssel-build.txt` containing the exact Git SHA after the build;
- runs `npx cap sync ios` and verifies the exact marker was copied to `ios/App/App/public`;
- touches the copied public folder so Xcode sees the resource change;
- runs an Xcode project `clean` to remove build products before the user's next Run.

The clean step does **not** uninstall/reset the app and must not touch the preserved device save. If the marker does not match, `npm run syssel` fails instead of telling the user that iOS is ready.


### 2026-09-24 — native first-run regression still open

Physical iPhone acceptance of the Flaskpost/Sol flow disproved the intended first-run guarantee from the current `npm run syssel` cleanup. Even after the deterministic export marker, Capacitor sync verification and Xcode clean, the first Xcode Run still presented the previous native web bundle and a second Run/compile was required before the new build appeared. Treat this as an open native packaging/cache defect, not an accepted workaround. The next investigation should identify the exact bundle/marker packaged by Xcode on Run 1 versus Run 2 rather than adding more blind clean steps.


## Child-device patch model — locked 2026-09-24

For the first real child release, SysselCraft does **not** need TestFlight, App Store delivery, OTA updates or a separate full production infrastructure. The accepted near-term release model is deliberately simple:

- Keep the stable SysselCraft app installed on the child's iPhone.
- Continue development and physical QA separately before promoting new content.
- When a patch/content update is accepted, connect the child's iPhone to Kalle's Mac and install the newer Xcode build **over the existing app**.
- Preserve bundle id `se.sysselcraft.app`.
- Do not uninstall the app, reset app data, regenerate `ios/`, or otherwise destroy the existing application container as part of a normal patch.
- Local save evolution must remain backward-compatible. New save fields need safe defaults/migrations; an older valid save must never be treated as a new game merely because content was added.
- Backend family/pairing/quest/economy state remains authoritative according to the existing ownership rules and must not be recreated from local guesses.
- The update-in-place path has already passed physical iPhone acceptance with preserved local progression and backend pairing/session. Continue to regression-test persistence for changes that touch save/native packaging/restoration.
- Mark child-facing stable builds with an explicit Git release tag/checkpoint so the exact version installed on the child's phone is always known.
- Future vision may add TestFlight/App Store/other distribution, but that is explicitly **not required for the current release model**.

Practical release flow:

`development -> CI -> physical iPhone QA -> accepted release checkpoint/tag -> Xcode install over existing child app`

The child's real save must never be used as a disposable development/reset environment after release.


## 2026-09-25 quest rewrite checkpoint

Quest lifecycle now targets available -> active -> pending -> approved -> claimed. The live schema includes accepted_at and the acceptance RPC; submit requires active and rejection returns the same occurrence to active. Frontend types/repository/UI were updated for explicit acceptance. World presentation is being converted from boolean attention to marker-aware question-mark/exclamation-mark/null state. This is not yet end-to-end verified. Complete VillagePrototype/Phaser wiring and source filtering, then build/CI and acceptance-test the whole flow before release.

Recycling also gained a local progression baseline so historical backend progression cannot replay as fresh construction on a fresh local save. This was prompted by a real QA cascade and needs regression coverage after the quest rewrite.


## 2026-09-25 verified Quest v2 / Recycling checkpoint

Quest v2 core is now physically accepted on iPhone with the live parent/backend path: available -> accept -> active -> submit -> pending -> reject -> same active instance -> resubmit -> approve -> explicit turn-in -> exactly-once reward -> restart with no replay. Marker semantics remain locked: `?` available, `!` approved turn-in, `💬` authored story/dialogue.

Recycling historical-progression protection has a deterministic regression at `8c44aa5cf939e43ff843b85c5cd80b931cf4ebe8`: baseline 12 historical claims, unchanged sync/reload yields zero stages, claim 13 yields only stage 1 pending, explicit reveal commits stage 1, and repeated sync/reload cannot cascade. The test uses the real construction/save/progression modules; production code did not need modification.

A temporary Vercel preview was created only to complete parent-side acceptance. Native remains the release target. Preserve the existing iPhone app/save and do not uninstall/reset it for future testing.


## Physical acceptance update 2026-09-25
- Sol safe-story acceptance harness physically verified PASS on a real iPhone in landscape at commit `0a3d9b21ba1b1a08ca1ba58a27f9944c4c2b1455`.
- Full isolated chain passed: purchase → water → letter → bottle → arrival → bakery → shop/Mira → Linus → decision → done.
- Story Moment presentation is fullscreen and usable with native safe-area controls. Harness remains non-destructive and does not write player save or backend state.


## Sol runtime pacing physical acceptance — 2026-09-25

- PASS on a real iPhone in landscape at instrumented commit `6f6660ed80bec8fa0eed5ac0cfefbfdfa0944101`.
- Runtime pacing was physically verified as: Sol arrival -> explicit return-to-village wait -> simulated Henning interaction / Bakery tour -> explicit wait -> Mira/shop interaction -> explicit wait -> Linus interaction -> explicit wait -> Sol decision -> done. No later tour scene auto-chained across an interaction gate.
- The earlier safe-story acceptance at `0a3d9b21ba1b1a08ca1ba58a27f9944c4c2b1455` remains presentation coverage only; this acceptance separately covers runtime trigger/pacing behavior.
- Physical instrumentation confirmed the Bakery scene is entered only after `ARRIVAL_COMPLETE: await-bakery` followed by `SIMULATE_HENNING_INTERACTION: bakery`. During that scene the live Henning story indices remained null, proving it was the intended Sol Bakery-tour scene rather than the real Henning-arrival overlay.
- The runtime acceptance harness is non-destructive: live story state is guarded while active and the real save/backend is not written by the harness. A pending real story may resume after the harness closes.


## Diamond deterministic regression checkpoint — 2026-09-25

- Static/contract regression coverage is now part of canonical `npm run verify` via `scripts/test-diamond-rewards.mjs`.
- Coverage locks the authoritative purchase RPC, atomic sufficient-balance debit + pending redemption creation, reward title/price snapshots, idempotent delivery, idempotent refund with exact snapshotted repayment, authenticated-only RPC execution, Mira shop purchase/wallet-refresh wiring, and parent pending-delivery/delivery/refund wiring.
- GitHub Actions CI #830 passed on commit `d15a0945d2074071d80591ce1e4d49ff5d57b9fa`.
- No production Diamond code or live data was changed by this regression closeout.
- Physical Diamond acceptance remains OPEN because the test iPhone was not available. Do not mark the feature physically accepted until the real journey passes: parent creates reward -> paired child sees it at Mira -> purchase deducts exactly once -> parent sees pending delivery -> parent marks delivered -> restart preserves wallet/redemption state.


## Supabase advisor audit — 2026-09-25

A fresh live Supabase advisor pass was run after the Diamond/Quest work.

- `child_pairing_codes` is reported as RLS-enabled with no policies. This is intentional for the current RPC-only design: live ACL inspection confirms the table grants access only to `postgres` and `service_role`, not `authenticated` or `anon`. Do not add a broad table policy merely to silence the advisor.
- SECURITY DEFINER warnings cover the public RPC surface. These functions are intentionally callable by authenticated parent/bound-child sessions and must keep their internal identity/household/binding checks plus explicit role grants. Treat each warning as an audit prompt, not evidence that execute should automatically be revoked.
- Anonymous-access warnings are expected where the paired child device uses Supabase anonymous authentication; authorization must continue to be constrained by child-device binding checks.
- Leaked-password protection is currently disabled in Supabase Auth. This is legitimate security hardening debt and may be enabled in a later auth-settings pass after checking plan/support and password UX impact.
- Performance advisor reports four unindexed Diamond foreign keys and two multiple-permissive SELECT-policy warnings. Current data volume is tiny; these are non-blocking optimization debt, not a release blocker. Do not remove currently-unused indexes merely because the advisor has not observed traffic yet.


## Diamond physical/runtime checkpoint — 2026-09-26

Diamond reward purchase/delivery is physically accepted on iPhone against live Supabase. Observed wallet: 55 -> 54 for a single 1-Diamond purchase, matching live `child_game_state`. One redemption entered `pending_delivery`, parent delivery transitioned it to `delivered`, and a full child-app restart retained wallet 54. No replay/double debit was observed.

Duplicate pending purchases are now blocked at two layers. The child shop reads its own pending redemption reward IDs and disables matching Mira buttons with `⏳ Väntar på förälder`; successful purchase also updates this local set immediately. Live migration `prevent_duplicate_pending_diamond_reward` updates `purchase_diamond_reward` to reject the same child/reward pair while a `pending_delivery` row exists. The physical immediate-disable behavior passed. Final code commit `be690488461a8dc5a937c3dcb523a5511f4172ef` has green CI #847.


## Vercel deployment policy — SUPERSEDED 2026-10-01

The older 2026-09-26 rule is no longer current.

**Current hard rule: GitHub Actions on every relevant code push. Vercel only at a physical/explicit acceptance checkpoint or release.**

Do not trigger Vercel for documentation-only commits, Markdown/handover updates, isolated copy fixes, isolated lint/test repairs, or every intermediate commit in a feature branch. Batch those changes, verify them with GitHub Actions, and create one preview when there is actually something meaningful for Kalle to click-test.

Production deployments are reserved for actual release.


## Parent quest admin physical acceptance — 2026-09-26

PASS on the live parent web UI. Completed quests can be reactivated into a fresh available child instance; recurring quest scheduling persists an explicit Swedish local time (Europe/Stockholm) and due instances materialize correctly; the parent dashboard now refreshes quest state while open; and **Rensa historik** for completed quest history remains cleared after a full browser reload without deleting authoritative backend history. Final implementation checkpoint: `cbed8a27c2f1455f6f4c314b059db4443f612800`, GitHub Actions CI #895 SUCCESS, matching Vercel preview READY. Selectable quest givers and balance editing remain intentionally parked and are not release blockers.


## Fresh child-device onboarding checkpoint — 2026-09-26

The release now handles the previously silent unpaired-device state after the narrative introduction. At the terminal Linus intro step, `VillagePrototype.advanceDialogue()` marks the intro complete in both current-session and persisted state, then calls `getPairedChildId()`. If no binding exists, it opens the existing `ChildPairingPanel`. Pairing is deliberately deferred until after the Linus/puppy scene so technical setup cannot interrupt the first story beat. Backend quests still remain backend-owned and cannot appear before a valid child binding/session exists.

Normal Vuxenläge has also been cleaned of the visible Sol test launchers. Do not delete the underlying Sol runtime harness: `scripts/test-sol-story.mjs` regression-tests its guard behavior. It may remain compiled without being exposed in release UI. A cleanup attempt that removed the launcher function broke this contract; final repaired checkpoint `7c001107cff16e8cae65650eb175af1134187bc7` passed CI #949.


## World expansion architecture — LOCKED 2026-09-26

SysselCraft expands through **discrete outdoor areas**, not one ever-growing Phaser mega-map. The current village is the first area. A world exit such as a road, bridge, forest path or harbour transition loads another area/map while preserving the same child identity, save/backend state, wallet, quest state, inventory/ownership and global story progression.

Each outdoor area owns its own production background image plus its own navigation/walkable geometry, spawn points, exits, interactive hotspots, NPC placements and quest/story markers. Decorative complexity should remain baked into the painted background whenever it does not need runtime interaction. Interactive or state-changing elements may continue to use overlays/sprites as in the current village construction system.

Area transitions are reciprocal and spawn-point based: leaving the village through a forest path can load the forest at a named `fromVillage` spawn; returning loads the village at the matching entrance. A separate abstract world-map UI is not required for the initial implementation.

**Interior architecture is intentionally different.** House rooms, shops and comparable interiors use the existing fullscreen Story Moment / Mira-shop presentation model rather than becoming navigable Phaser maps. The first child-house interior should therefore be a fullscreen illustrated room with tappable hotspots and layered owned decorations. This keeps interiors visually rich and technically cheap while outdoor areas remain true avatar-controlled game maps.

Locked rule: **interiors add depth; area/map swaps add breadth.** New acts can normally introduce a new painted outdoor background/map package without requiring a larger base-world canvas or a rewrite of the existing village.


## ACT 1 CLOSEOUT / ACT 2 HANDOFF — 2026-09-27

**Act 1 is feature-complete. Sol and the Clinic are part of Act 1 and are complete.** Do not reopen Recycling, Henning/Bakery, Mira/lanthandel, Flaskpost/Sol/Clinic, dog-home or child-room scope except for a concrete regression reported or reproduced.

Current branch checkpoint entering this documentation closeout was `b48837730877148e5854ab1945440aa7beefb45a` on `nova/local-construction-snapshot`. The canonical local workspace remains `/Users/karoaa/Developer/sysselcraft`; routine native sync is `npm run syssel` followed by Run in Xcode over the existing installation. Never regenerate iOS and never uninstall/reset Adam's save for testing.

Late Act 1 architecture that supersedes older sections in this document:
- Quest V2/backend remains authoritative for real quest lifecycle, claimed rewards and the shared wallet/progression inputs used by production progression.
- Supabase is authoritative for Mira story purchases. Story ownership is reconciled backend → local save for the implemented bottle/room purchases; purchases must be idempotent and survive restart.
- The child room no longer uses runtime furniture overlays as its production model. It uses **full-scene sequential states**: `room-base.png` followed by `room-1.png` … `room-6.png`. Mira sells the next sequential upgrade; owned upgrades remain visible as `✓ Köpt`.
- Room ownership flags are explicitly included in normalization/autosave. Backend story ownership repairs the local save rather than trusting a stale local purchase snapshot.
- Dog home and room use the established post-dialogue showcase pause so the completed scene can be viewed unobstructed before exit.
- Important raster production assets are generated individually at intended final resolution. **Spritesheets/contact sheets are forbidden unless Kalle explicitly requests one.**

**Act 2 begins at the lake, not with Sol.** The next authored area is the lake summer place defined in `STORY_DESIGN.md`: persistent second outdoor area, one new peer boy, then summer cottage → jetty → boathouse → motorboat. The repaired boat bridges toward Act 3. Exact thresholds/stage counts, boy name/design and lake layout remain product decisions.

Efficiency rule for Act 2: design story state, backend authority, persistence and visuals together; reuse Quest V2/unified progression; establish baselines before visible progression; test restart/reconciliation within each slice; use isolated/test-child acceptance paths rather than mutating Adam; and build coherent content arcs rather than one tiny scene at a time.

### Act 2 restoration-state contract — LOCKED 2026-09-28

Act 2 uses three independently completable lake restoration tracks: **summer cottage, jetty and boathouse**. The player may complete these in any order. Their quest/story/dialogue implementations must remain order-independent: no combinatorial dialogue tree and no cross-track prerequisite based on which project came first.

The **motorboat is a separate final track**. It may be visible in the lake scene from the start, but restoration interaction remains locked until cottage + jetty + boathouse are all complete. The unlock condition is the conjunction of those three authoritative completion states, not a hidden preferred order.

Each project completion should expose a simple durable world-state fact that other systems can consume independently. Intended consumers include Mira shop inventory, optional activities/quest templates, ambient lake dressing and resident lake placements. Consumers should subscribe to completion state rather than duplicating restoration-order logic.

Established Act 1 residents must support authored lake presence as restoration advances. This is not a requirement for a clock/simulation system. Deterministic/state-eligible placements are sufficient. Example: jetty complete may make swimming/jetty ambient placements eligible; cottage complete may make cottage social placements eligible; boathouse complete may make boathouse/work-area placements eligible. At 3/3 the lake should support a visibly livelier village gathering state.

Do not implement these flags by casually mutating SaveStateV1 or inventing backend ownership. Persistence/authority must be designed against STATE_OWNERSHIP.md and existing Quest V2 progression before implementation. This section locks product behavior, not a premature storage schema.

`/act2-test` remains a non-authoritative visual/dialogue acceptance harness. Production Act 2 is now connected through `/act2`; visiting the test route must never advance or own production save/progression state.


### Act 2 cross-area progression consumers — LOCKED PRODUCT CONTRACT 2026-09-28

Act 2 progression is intentionally consumed by both the lake area and the existing Act 1 village. A restoration beat may expose an authored need that activates a village interaction, and completion/progress may unlock lake ambience, resident presence, village dialogue or shop inventory. Implement these as consumers of authoritative progression/story state rather than by duplicating project-order logic in each location.

Story-bound SysselBux purchases remain part of the existing authoritative backend wallet/economy. Do **not** create an Act 2 local wallet, client-side deduction shortcut or parallel construction currency. Exact required items/prices are product-balancing decisions and are not locked by this technical contract.

The Bakery, Clinic, Recycling and Mira shop may all receive Act 2 interactions. Preserve their completed Act 1 implementation and add state-eligible Act 2 behavior rather than reopening/replacing their Act 1 arcs. Cross-area interactions must remain compatible with discrete-area architecture and save/restart reconciliation.

Pacing requirement: four project art stages must not be interpreted as four quest contributions. Major visual stages are sparse milestones; intermediate authored beats may occur without a construction sprite change. Exact contribution thresholds remain deliberately undefined until the progression/economy model is balanced.


### Act 2 isolated content-lab checkpoint — 2026-09-28

The existing `/act2-test` route is now doing double duty as the accepted visual lake-map harness and an isolated Story Moment sequencing lab. It currently includes the Alve intro, Båthuset and Stugan content. Stugan integration landed in `3155894ebc62edb74b117c479b0676133b638c4a`; Kalle reported CI green and completed browser visual acceptance.

This paragraph is historical context from the isolated-lab phase. Production integration has since been implemented in `/act2`. The invariant that remains current is narrower: `/act2-test` must stay detached from authoritative production save and Quest V2 consumption, and may freely sequence authored content/stage swaps only for acceptance.

Canonical Stugan test assets live under `public/assets/village/story-moments/act2/cabin/`. The accepted runtime mapping uses nine images across sixteen contributions, so implementation must preserve the rule that **contribution count, Story Moment count and four visual construction stages are three different layers**. Do not collapse them into one-to-one progression.

## Act 2 production implementation architecture — LOCKED 2026-09-30

The implementation sequence is canonical in `docs/ACT2_IMPLEMENTATION_PLAN.md`.

### Runtime boundary
Act 2 is a discrete outdoor area, consistent with the locked world-expansion architecture. Do not turn the village Phaser scene into one mega-map. Act 1 and Act 2 share child identity, backend quest/economy authority and global story state, while each area owns its own background, navigation geometry, collision, spawn/exits and local presentation.

### State boundary
Production Act 2 now uses the explicit persisted `Act2RuntimeState` family rather than scattered React booleans. It represents opening/Alve intro completion, current project, per-project 0–16 contribution state, per-project 0–4 visible stage, consumed Story Beat IDs, prerequisite completion derived from project state, motorboat lock/completion, finale/epilogue consumption and Act 2 completion.

Derive 3/3 from canonical project completion state rather than storing a second independently mutable counter.

### Quest contribution bridge
Quest v2/backend progression remains authoritative for real-world contribution evidence. Presentation consumption remains local/world-story state. The bridge must be idempotent:
- one authoritative contribution advances at most one authored Act 2 beat;
- pending Story Moment/reveal blocks presentation from skipping ahead;
- extra authoritative progress may accumulate behind a pending presentation;
- after commit, catch-up proceeds one authored beat at a time;
- network refresh/retry must not duplicate consumption;
- story-bound SysselBux purchases are separate economy beats and never substitute for a contribution.

### Development order
Implement complete vertical tracks rather than all 64 beats horizontally:
**Bryggan → Stugan → Båthuset → Motorbåten**.
This order is for engineering only. Player order among the first three remains free and all six completion orders must be accepted before release.

### Production gate
The original first production milestone was:
**Act 1 transition → OPEN-001…005 → bicycle → Alve → project chooser → selected project begins and survives restart.**
That runtime/state spine is now implemented. Current work may extend/refine the connected 16-beat project tracks without reintroducing a parallel state path.

### Test route
`/act2-test` is a visual/dialogue oracle and acceptance harness. Production state must never depend on visiting the test route.



## Cross-act runtime architecture priority — LOCKED 2026-10-01

Future acts must not continue the current pattern of Act-specific Story Moment, Phaser-area, save-compatibility and progression implementations. The canonical migration roadmap is now `docs/RUNTIME_ARCHITECTURE_ROADMAP.md`.

Priority order:
1. Story Engine.
2. World / Area Engine.
3. Save / Migration Engine.
4. Progression / Gating Engine.

Quest V2 and backend economy are explicitly not scheduled for wholesale rewrites. Refactor incrementally, preserve accepted behavior, and require regression plus physical acceptance before deleting old paths.


### Story Engine v1 — 2026-10-01

Act 2 now uses the shared Story Engine end-to-end for fullscreen story presentation, including special beats. Canonical contract is documented in `docs/RUNTIME_ARCHITECTURE_ROADMAP.md`. First-Alve dialogue and visual progression are both centralized in `src/game/act2AlveStory.ts`; production `/act2` and debug `/act2-test` must consume that same source rather than hardcoding parallel image/dialogue tracks.

Important invariants:
- headings are not speakers;
- speaker prefixes are centrally parsed into nameplates;
- production Act 2 no longer owns a parallel `.story-moment` JSX shell;
- `/act2-test` uses the same StoryMoment/StoryTranscript presentation path;
- future Acts must reuse this engine rather than clone presentation logic.

Act 1 migration is intentionally deferred until Act 2 v1 receives browser/iPhone acceptance.

## Act 2 runtime hardening checkpoint — 2026-10-01 evening

The current Act 2 implementation uses one production renderer, `src/components/Act2Runtime.tsx`, for both `/act2` and `/act2-test`. Debug is now a state-control mode over the real renderer, not a second implementation. It loads the persisted child name, creates isolated Act 2 state, bypasses shipping/access gates for testing, does not poll/persist authoritative Act 2 state, and may expose explicit state mutators such as reset/test purchases. Production Act 2 is enabled behind the persisted Act 1 chapter boundary. The full production journey has now been physically played through on iPhone; keep `/act2-test` debug-only and do not reintroduce a separate shipping lock.

Lake navigation now treats the accepted `lake-master` artwork as the water-collision authority. Phaser samples pixels around the player-foot area to reject blue/cyan water rather than maintaining a guessed shoreline function. Building footprints and world bounds remain separate collision layers. This fixed the obvious browser case where Barnet/Valpen could stand in the lake, but full shoreline tuning still depends on visual/physical testing.

Stugan's “En stund till” scene is a world revisit, not project completion. After Stugan reaches 16/16, clicking the completed cabin may replay `CABIN_WAITING_REACTION` while Motorbåten is incomplete. It does not auto-open, does not consume a contribution and disappears once Motorbåten completes.

Story-card presentation is locked: **one nameplate + one reply/narration unit + one click**. Do not batch multiple speakers into one card to reduce clicks. Anti-popcorn work belongs in the authored dialogue. First rhythm passes have been made across Båthuset, Stugan, Bryggan and Motorbåten without changing story order, gates, images or progression.

Automated contracts now explicitly protect shared production/debug rendering, non-persistent debug Act 2 state, single-speaker contribution cards and Cabin revisit semantics. A fresh positive `npm run verify` result is still required after the latest hardening batch.

## Act 1 chapter-final transition checkpoint — 2026-10-02

Act 1 now has a persisted chapter-ending flow layered after the existing Clinic finale without changing Clinic construction/progression semantics.

Canonical runtime order:
1. Clinic completion dialogue finishes and persists `clinicCompletionSeen=true`.
2. `act1ChapterFinaleDialogue` plays once.
3. Finale line progress is restart-safe through persisted Act 1 finale state.
4. Completing the ensemble scene exposes a black **SLUT PÅ FÖRSTA KAPITLET** card.
5. Acknowledging that card persists `act1EndCardSeen=true`.
6. Only then is **Stigen till sjön** exposed as the deliberate Act 1→Act 2 transition.
7. Production `/act2` independently requires the chapter-one acknowledgement before establishing its Act 2 entry/baseline state.
8. `OPEN-001 · Valpen sticker` remains the first fiction beat of Act 2.

Legacy-save rule: saves that had already completed Clinic before this feature existed normalize as having already acknowledged the new Act 1 finale/end card. They must not suddenly replay newly authored Act 1 story on boot.

The current Act 1 ensemble Story Moment image is intentionally a placeholder: `/assets/village/story-moments/sol-clinic-complete.png`. Do not generate or replace the final ensemble image until Kalle provides the canonical character references.

Verification: GitHub Actions **#1497 SUCCESS** on `32bd71a3fdc776941614c8f4b037b60ce140eedc`.


## Act 2 final technical boundary — 2026-10-03

Act 2's canonical closeout is six beats:
**Efter motorbåten → Någon är där → De kom → Min kompis → Det är bättre → Över sjön**,
followed by the persisted black **SLUT PÅ ANDRA KAPITLET** card.

### Persistence
- Act 2 local presentation state is child-scoped.
- `finaleSchemaVersion: 2` separates current six-beat completion from pre-marker legacy completion.
- A pre-marker save that had completed the old five-beat ending is normalized to epilogue pending once.
- Once the epilogue is consumed and the end card acknowledged, `act2Complete && endCardSeen` is stable and does not replay.
- No migration may fabricate backend quests, rewards, wallet values or authoritative progression.

### Lake world after completion
- Alve has an explicit runtime-presence control. Active chapter + no project means idle Alve; completed chapter means no Alve.
- Cabin revisit and turn-in affordances cannot survive the chapter-close boundary.
- The global HUD remains because its visibility is presentation infrastructure, not project state.
- Chapter 3 navigation is exposed from the completed HUD.

### Chapter 3 ownership
`/act3` is intentionally a non-persisting boundary page. Act 3 must create and version its own runtime state when implementation begins. Act 2 must never write an Act 3 “entered” flag on the player's behalf.

### Regression ownership
Behavioral contracts are split intentionally:
- UI shell: `scripts/test-ui-shell-state.mjs`
- Alve world presence/interactions: `scripts/test-act2-alve-presence.mjs`
- finale migration/restart: `scripts/test-act2-closeout.mjs`
- full authored journey: `scripts/test-act2-full-flow.mjs`
- story/UI semantics: `scripts/test-story-ui-contract.mjs`

Do not duplicate these by matching old internal variable names or obsolete inline visibility expressions in unrelated tests.


## Runtime Architecture v1 decision — 2026-10-03

Before substantial Act 3 runtime work, follow the locked cross-act architecture in `docs/RUNTIME_ARCHITECTURE_ROADMAP.md`.

Key rule: SysselCraft is one runtime with chapters as data. Global HUD/menu ownership, story presentation, story registry/history, interaction markers/input semantics and progression consumption must be shared systems rather than Act-specific implementations.

The current Act 2 Historik feature is intentionally treated as an interim vertical slice: it is safe/read-only and spoiler-gated, but its catalog assembly still lives in `Act2Runtime.tsx`. Extract that into the shared Story Registry/History contract before Act 3 beats are implemented so new chapters inherit replay/history automatically.

Act 2's accepted production behavior is the migration oracle. Refactor structure without changing story canon, contribution counts, economy, save ownership or physical player flow.


## LIVE FREEZE / DEVELOPMENT BRANCH POLICY — LOCKED 2026-10-03

The physically accepted Act 2 production baseline is frozen at:

- source branch: `nova/local-construction-snapshot`
- immutable release snapshot: `release/act2-live-2026-10-03`
- frozen SHA: `f9bf552f70f4af3ff7457a86867b323504e39c36`
- verification: GitHub Actions CI #1720 SUCCESS on that exact SHA.

Do not develop new features, architecture refactors or Act 3 runtime on the frozen live branch.

All forward development now happens on:

`nova/runtime-architecture-v1`

Rules:
- production/live remains on the frozen baseline until a later candidate is explicitly promoted;
- architecture work and new gameplay are tested separately on the development branch;
- do not merge or deploy development work to production merely because CI is green;
- require explicit browser/iPhone acceptance before promoting a future release candidate;
- hotfixes to live, if genuinely required during Adam's play, must be deliberate isolated fixes based from the frozen release snapshot and then reconciled back into the development branch;
- Adam's real save/backend remains protected and must not be reset for development testing.



## Runtime Architecture 1.0 mandatory rules

The complete contract lives in `docs/RUNTIME_ARCHITECTURE_ROADMAP.md`.

Operational summary:
- one persistent Game UI Shell across every world;
- one canonical implementation/asset per reusable game concept;
- chapters provide content/configuration, not duplicate runtime machinery;
- Story Registry + shared History must replace Act 2-specific history assembly before Act 3;
- Interaction System owns all generic markers/hotspots/input semantics;
- Quest V2 stays authoritative; progression consumption is shared;
- new Acts must not fork HUD, Story Engine, markers, replay/history or generic input logic.

Treat any new Act-specific duplicate of an existing game concept as architecture regression.


Improvement rule: when a material architecture/product/UX/reliability improvement is identified, raise it immediately and classify it as required now, safe to defer, or incompatible with the current freeze boundary. Do not sit on useful structural improvements until a later handoff.


### Canonical System Registry

Arch 1.0 must expose one central registry/layer for reusable engine concepts and their canonical assets/components. Chapter code should consume quest markers, attention markers, Story UI, HUD/menu primitives and similar shared systems through that layer rather than embedding new asset paths or local component variants.

Where practical, add static/regression checks that flag Act-specific duplicate system assets or direct forks of registered concepts.


## Runtime 1.0 migration strategy

The canonical implementation strategy is now **clean parallel runtime + controlled migration**, not piecemeal extraction of the legacy client.

Reuse backend/economy/story/assets/progression decisions. Rebuild the client runtime systems cleanly under the mandatory Architecture 1.0 rules.

A parity harness is required. It must run representative save/state fixtures through legacy behavior and Runtime 1.0 and compare product-level outcomes such as world state, NPC/interactable availability, next eligible story, gates, completion and chapter transitions.

Do not remove legacy runtime or promote Runtime 1.0 until parity harness + browser acceptance + physical iPhone acceptance pass.


### Runtime 1.0 checkpoint: Act 2 History consumer

On `nova/runtime-architecture-v1`, Act 2 Historik now consumes the shared Story Registry/History contract. The old inline History assembly is no longer the dev consumer path.

This does not affect frozen live. Keep parity coverage around grouped History output before removing further legacy/runtime compatibility code.


### Runtime 1.0 checkpoint: Act 2 Game UI Shell

On the architecture branch, Act 2 now consumes the shared `GameUiShell` rather than owning a separate header implementation. Village still uses its legacy header and must migrate next before the global shell milestone is complete.


### Runtime 1.0 checkpoint: global Game UI Shell

On `nova/runtime-architecture-v1`, both Village and Act 2 now consume the same `GameUiShell` component. This closes the duplicate-HUD implementation milestone on the development branch.

Village-specific room/dog actions and Act 2-specific chapter navigation are passed as shell configuration rather than separate HUD implementations.


### Runtime 1.0 checkpoint: canonical quest marker

A shared Interaction System marker renderer now exists and Act 2 consumes it for Alve turn-in. Village marker code is still legacy/local and must migrate before the marker milestone is complete.


### Runtime 1.0 checkpoint: quest-marker presentation complete

Current Act 1/Act 2 quest markers now consume `createInteractionMarker()`. The previous Village noticeboard/Linus/Henning local badge renderers are removed.

Do not confuse this with full Interaction System completion: NPC/story attention, generic hotspot resolution and shared input authority remain pending.


### Runtime 1.0 checkpoint: marker presentation converged

Quest and story/NPC attention marker presentation is now centralized in `src/runtime/interaction/markerRenderer.ts`.

The renderer preserves separate semantics/visuals for quest markers versus dialogue/story attention. Current Village/Act 2 marker presentation consumes the shared implementation.

Full Interaction System completion still requires shared resolution, approach-point ownership and input authority.


## CURRENT RUNTIME 1.0 STATE — HANDOVER 2026-10-03

Verified development branch:
- branch: `nova/runtime-architecture-v1`
- HEAD: `959b6fd70c3d0c5015706899e9f2d33e960bb384`
- frozen live baseline remains `f9bf552f70f4af3ff7457a86867b323504e39c36`
- live/release branches must remain untouched by architecture work.

### Completed on development branch
- Canonical System Registry exists.
- One shared `GameUiShell` is consumed by both Village/Act 1 and Act 2.
- Act 2 Historik consumes the shared Story Registry + generic read-only History engine.
- Act 2 story content is registered through `ACT2_STORY_REGISTRY`.
- Stable chapter-qualified story IDs are enforced.
- Parity harness foundation exists in `scripts/test-runtime-parity.mjs`.
- Act 2 legacy-vs-registry History projection coverage exists for representative states.
- Shared Interaction contract exists.
- Shared canonical marker renderer exists.
- Current quest markers across Act 1/Act 2 use the canonical renderer.
- Current NPC/story-attention marker presentation is also converged on the shared renderer.
- Old local Village quest badge renderers and Linus intro story-bubble renderer have been removed from the development consumer path.

### Interaction System status
Marker **presentation** is converged.

The Interaction System as a whole is NOT complete. Remaining work:
- shared interaction resolution across current worlds;
- shared ownership of approach points/radii;
- shared world-input authority / overlay suppression;
- generic hotspot semantics where useful;
- parity coverage for interaction outcomes before deleting legacy navigation/input code.

### Next implementation order
1. Finish Interaction System behavior convergence, starting with shared resolution/approach-point ownership.
2. Converge world-input authority/overlay suppression.
3. Build shared World / Area Engine primitives.
4. Build versioned Save / Migration adapter and representative legacy-save fixtures.
5. Generalize progression/gating bridge while Quest V2 remains authoritative.
6. Port/remove only the legacy Act 1/Act 2 runtime pieces superseded by the new engine.
7. Run automated parity, browser acceptance and physical iPhone acceptance.
8. Remove superseded legacy client runtime.
9. Only then begin substantial Act 3 runtime/content.

### Absolute rules
- These are rules, not guidelines.
- One reusable concept = one canonical implementation.
- UI is constant across chapters.
- Reusable system assets/components are global, not Act-specific.
- New content should normally mean story, images, NPC/area config and gates, not new runtime logic.
- Do not create Act-specific HUD, History, marker, dialogue, interaction or progression implementations.
- If a shared concept is missing, add it once to the engine.
- Surface material architecture/product/reliability improvements immediately.
- Do not mutate Adam's backend/save for development testing.
- Do not deploy Runtime 1.0 to production before explicit acceptance.

### Verification policy
Keep work in short batches. Do not trigger Vercel for routine architecture work. Commit/checkpoint at logical slices, keep docs synchronized as work progresses, and update roadmap statuses when milestones close.

The dev branch currently does not auto-run CI on every commit. Use larger verification checkpoints rather than burning build minutes. Before any promotion, full CI + browser + physical iPhone acceptance are mandatory.


## Runtime 1.0 interaction checkpoint — 2026-10-03

Development branch `nova/runtime-architecture-v1` has started Interaction System **behavior** convergence.

First migrated consumer:
- Act 2 Lake Alve turn-in now calls shared `resolveInteraction()`;
- accepted 135 px activation radius is preserved;
- accepted approach point (Alve x, Alve y + 58, world-clamped) is preserved;
- Lake still owns actual Phaser movement/facing/callback execution in this deliberately small slice.

Parity harness now covers:
- activate inside radius;
- resolve authored approach point outside radius;
- disabled interaction does not activate or approach.

This is a checkpoint only. Village still has local pending-interaction flags, radii and approach handling. Shared world-input / overlay authority remains the next cross-world concern after further resolution slices.


## Runtime 1.0 interaction checkpoint 2 — Village noticeboard

The shared Interaction System now has behavior consumers in both current playable worlds:
- Act 2 Lake: Alve turn-in;
- Village: noticeboard quest source.

Village noticeboard now supplies one interaction definition containing its accepted approach point and 36 px arrival radius. Shared `resolveInteraction()` owns enabled/activate/approach resolution, while existing Village pathfinding/callback mechanics remain local.

Parity locks 36 px as activate and 37 px as approach.

Continue with another simple duplicated interaction before tackling world-input authority. Avoid folding Linus' mixed quest/story priority into a generic rewrite until its behavior has explicit parity coverage.


## Runtime 1.0 interaction checkpoint 3 — Recycling

Village Recycling now uses shared `resolveInteraction()` for arrival/enable behavior.

Preserved product behavior:
- only stage-4 Recycling is interactable through this path;
- approach point remains the canonical visual-production placement approach;
- arrival radius remains 40 px;
- existing Village click hit-test, pathfinding, target marker and callback remain untouched.

Parity locks 40 px = activate and 41 px = approach.

No Vercel verification is expected during the current build-rate-limit period. GitHub remains the source of truth for code/checkpoints; do not report a build as run unless an actual Actions run exists.


## Runtime 1.0 interaction checkpoint 4 — bottle message

Village bottle message now delegates interaction outcome to shared `resolveInteraction()`.

Preserved:
- world point x 835 / y 500;
- 38 px arrival radius;
- availability gate;
- existing pathfinding and `onBottleMessageInteract` callback.

Parity locks 38/39 px behavior.

The Interaction System now has four concrete behavior consumers across Lake and Village. Continue with small low-risk consumers before world-input convergence.


## Runtime 1.0 interaction checkpoint 5 — construction attention

Village construction attention now delegates arrival resolution to shared `resolveInteraction()`.

Preserved:
- existing authored approach point;
- 32 px arrival radius;
- canonical NPC-attention marker role;
- original `attention.id` passed directly to `onConstructionInteract`;
- Village pathfinding and dialogue-open state remain local.

Parity locks 32 px = activate and 33 px = approach.

This is the fifth concrete shared-resolution consumer. The simple hotspot/attention slices are now mature enough that the next audit should focus on world-input authority before attempting to generalize mixed-priority NPC interactions such as Linus.


## Runtime 1.0 world-input checkpoint — shared authority active

Shared world-input authority is now consumed by both playable worlds.

Contract:
`worldInputEnabled({ enabled, blockingOverlayVisible })`

Village:
- `VillageGameHandle` exposes `setWorldInputEnabled`;
- presentation state drives it from the existing village input-lock derivation;
- pointer movement + keyboard/path movement obey it;
- `setConstructionDialogueOpen` remains a compatibility overlay signal for now and must not be treated as the final authority.

Act 2 Lake:
- pointer interactions and movement update obey the same shared authority;
- keyboard movement no longer bypasses world-input disabling.

Parity includes three truth-table fixtures plus source-contract guards.

Do not delete Village's legacy overlay flag yet. First map the remaining modal/story surfaces so the explicit authority can become the only owner without regressions.


## Runtime 1.0 world-input checkpoint 2 — Village legacy lock retired

Village no longer has two input-lock systems.

Canonical flow is now:

React presentation state
→ `villageBlockingOverlayVisible`
→ `setWorldInputEnabled(!blocked)`
→ Phaser `acceptsWorldInput()`
→ shared `worldInputEnabled()`

The old `constructionDialogueOpen` flag and `setConstructionDialogueOpen()` API have been deleted, along with manual open/close toggles scattered through story/shop callbacks.

All current object-level pointer handlers use the same world-input guard.

Important maintenance rule: when a new Village modal/story overlay is added, add it to the presentation blocking authority. Do not create another Phaser-local lock.

Parity includes source guards preventing the retired symbols from returning.


## Runtime 1.0 interaction-priority checkpoint — Linus

Added `src/runtime/interaction/interactionPriority.ts` with generic `resolveInteractionPriority()`.

Linus base intent priority is now centralized:
- construction attention: 40;
- intro: 30;
- backend quest source: 20;
- resident: 10.

Consumed by:
- scene-level Linus hit;
- Linus interaction zone;
- Linus sprite.

Do not collapse marker-specific interactions or immediate-vs-approach behavior yet. Those differences are preserved intentionally and need their own parity before convergence.

Parity includes four Linus priority fixtures plus source guards ensuring the base construction-attention check exists only in `resolveLinusIntent()`.


## Runtime 1.0 Linus marker checkpoint

Linus visual marker arbitration is now tied to the shared priority decision.

Canonical lower-marker sync:
`syncLinusPriorityMarkers()`

Rules:
- construction attention: suppress lower markers;
- intro: show NPC-attention marker;
- quest source: show ? / ! quest marker;
- resident: no marker.

This fixes two legacy hazards:
1. intro + quest markers could coexist;
2. a construction-driven Linus reposition could leave an old marker behind at stale coordinates.

The sync now runs after sprite creation and whenever intro, backend quest attention or construction presentation changes.

Do not reintroduce independent Linus story/quest marker creation paths.


## Runtime 1.0 interaction-priority checkpoint — Henning

Shared interaction priority is no longer Linus-specific.

Henning priorities:
- construction attention: 30;
- backend bakery quest: 20;
- resident: 10.

Scene hit and sprite hit both consume `resolveHenningIntent()`.

`syncHenningPriorityMarker()` owns the backend quest marker and shows it only when quest-source is the winning intent. Construction updates resync it so marker position cannot stale after resident movement.

Do not fold the Sol-tour marker into this rule yet. It is an explicit story CTA and needs separate parity/ownership decisions.


## Runtime 1.0 story-CTA priority checkpoint

Sol-tour CTAs now use the shared interaction-priority concept for Linus and Henning.

Priority:
- Linus: construction 50 > intro 40 > story-cta 30 > quest 20 > resident 10.
- Henning: construction 40 > story-cta 30 > quest 20 > resident 10.

`syncSolTourMarker()` is the canonical Sol-tour marker sync. It is refreshed by:
- `setSolTourStop`;
- relevant target visibility changes;
- Linus intro completion;
- construction presentation changes.

Quest marker syncs remain separate but consume the same winning intent, so lower quest markers disappear while CTA wins.

Arrival completion no longer uses raw backend-attention booleans to choose callback. It resolves current intent and sends quest callback only when `quest-source` wins.

Do not fold shop/decision CTA into NPC arbitration until there is an actual competing interaction contract.


## Runtime 1.0 pointer-target checkpoint

Village scene-level pointer arbitration now uses `resolveInteractionPriority()`.

Canonical fallback target priorities:
- Recycling 50
- Linus 40
- Shop 30
- Henning 20
- Ground 10

The old behavior order is preserved exactly.

Do not remove the object-level Phaser pointer handlers yet. They exist partly because native iOS WebView event ordering has historically been unreliable. A future de-duplication must be acceptance-tested on physical iPhone before retirement.


## Runtime 1.0 Interaction checkpoint — Henning arrival + audit

Henning ordinary arrival now uses `resolveInteraction()` with:
- dynamic current Henning anchor;
- `HENNING_APPROACH = { x: 370, y: 468 }`;
- `HENNING_INTERACTION_RADIUS = 95`.

Parity locks 95/96 px behavior.

CI is now configured to run on pushes to `nova/runtime-architecture-v1`, so future runtime commits receive a real `npm run verify` result without relying on Vercel.

Current Interaction System status is **late convergence**, not incomplete-from-scratch. Remaining risky special cases are Linus dual geometry, Shop/Mira multi-approach and Sol resident behavior. Preserve native object-level pointer fallbacks until browser/iPhone acceptance.


## Runtime 1.0 verified checkpoint — 2026-10-03

The Runtime Architecture branch now runs the canonical GitHub CI workflow on every push.

Verified GitHub Actions run:
- run: **#1746**
- result: **SUCCESS**
- workflow command: `npm run verify`
- verified branch: `nova/runtime-architecture-v1`

The successful verify includes production build plus all chained regression/contract suites, including:
- construction and save/reload checks;
- quest presentation/recovery/turn-in/request-guard;
- Sol story;
- Act 2 visual/story/runtime/full-flow/doc-sync/closeout/Alve tests;
- Game UI Shell and Story UI contracts;
- final Runtime 1.0 parity harness.

Interaction checkpoint included in this green baseline:
- Henning ordinary arrival uses shared `resolveInteraction()`, authored approach `{370,468}`, radius 95;
- Sol ordinary arrival uses shared `resolveInteraction()`, authored approach `{835,485}`, radius 95;
- parity locks both 95px activation / 96px approach boundaries;
- canonical marker owners are asserted explicitly rather than through a brittle marker-count test.

The CI repair pass also synchronized stale harness assertions with already-accepted Runtime 1.0 ownership: shared marker renderer, GameUiShell, world-input authority, Story Registry history ownership and shared Interaction dependencies. No production behavior was intentionally reverted to satisfy legacy tests.

Remaining risky Interaction special cases are still:
- Linus ordinary arrival dual geometry;
- Shop/Mira multi-approach behavior;
- deeper object-handler / scene-handler de-duplication, which remains gated on browser + physical iPhone acceptance.


## Interaction System late-convergence checkpoint — Linus + Shop/Mira

Verified behavior now locked/migrated:

### Linus dual arrival
Linus keeps both accepted legacy arrival zones for one canonical interaction:
- ordinary resident radius: 95 px around the current Linus sprite;
- authored approach arrival: 18 px around `REQUIRED_APPROACHES.linus = { x: 230, y: 460 }`.

The shared `InteractionDefinition.activationZones` contract expresses the secondary authored zone. Parity locks:
- 95 px NPC radius => activate;
- 18 px authored approach radius => activate;
- outside both zones => continue approach.

### Shop / Mira multi-approach
Shop interaction now uses shared `resolveInteraction()`.

Canonical authored values:
- `SHOP_APPROACH = { x: 1130, y: 425 }`;
- `MIRA_APPROACH = { x: 1050, y: 445 }`;
- interaction radius: 42 px.

Behavior preserved:
- closed shop accepts only the Shop approach zone;
- open shop accepts both Shop and Mira approach zones;
- direct Mira taps still path to Mira's authored approach;
- building/Sol-tour taps still path to the Shop approach;
- callback remains `onShopInteract()` when open and `onAbandonedShopInteract()` when closed.

Parity locks 42/43 px boundaries for closed shop and the open Mira activation zone.

### Resulting Village interaction ownership
After this migration there are no remaining local `distance(this.player, ...)` arrival checks in `createVillageGame.ts`.

All current Village world-interaction arrival radii now resolve through the shared Interaction System. Entry-point-specific hit testing/path selection remains local where behavior differs, but activation geometry is canonical.

GitHub Actions verification:
- Linus parity run #1754: SUCCESS.
- Shop/Mira verify job in run #1757: SUCCESS, including `npm run verify` and `test:runtime-parity`.
