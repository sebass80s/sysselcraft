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
- Quest lifecycle `available -> pending -> approved`, or pending back to available.
- No rewards/progression before adult approval.
- Interaction law: **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**
- UI-like world elements may be directly tapped/clicked without requiring avatar traversal first.
- Do not bury product/domain logic in Phaser.
- Public repo: never commit secrets/private family data/service keys/private env.

## Current technical priority

1. Preserve the physically verified Recycling four-stage loop and completion scene as the gameplay regression baseline.
2. Finish Quest System v2 daily-use plumbing: recurring definitions/instances, parent definition management, unified world progression, and world-aware child presentation.
3. World presentation currently supports home, Linus and selective noticeboard sources. Source attention is shown only for actionable `available` instances; `pending` instances remain visible in the general quest view but stop calling the child back to the world source.
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
