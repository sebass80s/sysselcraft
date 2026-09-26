# Sysselcraft Technical Handoff

> Current-state sections and `docs/NOVA_HANDOFF_MANIFEST.md` supersede stale historical assumptions.

## Current checkpoint — physical iPhone verified 2026-09-21

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

## Deployment/resource policy

**Local/native testing is the default.** Use local browser for fast visual iteration and `npm run ios:sync` + Xcode/physical iPhone for native visual, UI and gameplay QA.

Use Vercel only when a test genuinely needs network/web deployment, a shareable remote URL or web-specific behavior. Do not spend Vercel deployments on routine local/native iterations.

Standard GitHub-hosted Actions for this public repository are approved autonomously. Avoid explicitly billed/larger runners or paid third-party compute without approval.

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
