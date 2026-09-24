# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not restart solved work.

## READ FIRST — CURRENT STATE (2026-09-21)

Canonical workspace is `/Users/karoaa/Developer/sysselcraft`; active branch is `nova/local-construction-snapshot`. The previously working `ios/` has been restored and preserved in the canonical repository. Do not regenerate it or run `cap add ios`. Do not resume work in the old OneDrive copies.

Kalle physically verified the full Recycling slice from a clean save on iPhone: onboarding, Bädda sängen, adult approval, Linus/truck/delivery/stage-1 spawn, stages 2–4 through native test controls, and the completion dialogue mentioning Henning. Force-quit/relaunch preserves completed Recycling and does not replay completion. Adult-mode scrolling and reset also pass.

Bakery pacing can now be designed from the four-stage playtest. Henning has NOT spawned and Bakery is NOT activated. Thresholds and exact arrival remain undecided. See `TECHNICAL_HANDOFF.md` and `IOS_CHECKPOINT.md`.

## Historical state (2026-09-15 evening; superseded)

The blocker, branch and recovery instructions in this historical section are not the current state.

Sysselcraft has run as a real native app on the user's physical iPhone via Capacitor/Xcode. Do not restart native migration or run `npx cap add ios` again.

Draft PR **#6** on `nova/vercel-free-batch` is the current batched hardening/design branch. Verify branch head/CI before claims.

### Historical blocker: local OneDrive placeholders (resolved for canonical workspace)

Gate 0 v4 integration was handed to local Codex, but Codex correctly stopped before editing game code because the user's local repository at `/Users/karoaa/Documents/sysselcraft` is heavily affected by OneDrive Files On-Demand placeholders.

Terminal evidence from the user showed these critical files as `compressed,dataless`:
- `docs/ART_DIRECTION.md`
- `docs/TECHNICAL_HANDOFF.md`
- `src/game/createVillageGame.ts`
- the newly fetched v4 WebP assets under `public/assets/village/reboot/`
- many existing art/runtime assets
- at least parts of `ios/`, including `ios/debug.xcconfig`

A `git fsck --full --no-dangling` attempt stalled, plausibly while trying to access unavailable Git objects. Do not treat the local Git object database as verified healthy/readable.

A filesystem inventory of `ios/` excluding `dataless` files found only `.DS_Store` files and Xcode's `UserInterfaceState.xcuserstate`; therefore the valuable iOS project contents are **not currently proven locally materialized**. This does NOT mean they are deleted; the OneDrive placeholders remain and the old project folder must be preserved untouched until its contents can be materialized/recovered.

The user tried work VPN without success and selected the project folder as locally available, but the files still reported `dataless`.

**Do not spend more Codex tokens diagnosing OneDrive.** Roughly 30% of the available Codex allocation was already consumed during the blocked attempt. Codex should be saved for actual implementation once the repository is readable.

Safety rule until recovery:
- do not delete, move, reset, clean, stash, overwrite or otherwise mutate `/Users/karoaa/Documents/sysselcraft` merely to fix this;
- especially preserve `ios/`;
- do not assume directory existence means file contents are local;
- when access to OneDrive is restored, materialize the entire project first and verify `dataless` is gone before migration;
- once recovered, move/copy the working development repository out of OneDrive to a genuinely local location such as `~/Developer/sysselcraft`, preserving local/uncommitted/iOS work safely;
- GitHub can reconstruct tracked repository state, but it cannot replace untracked/local-only native work, so recovery/inventory comes before any clean clone migration.

### Gate 0 status

The 13 v4 assets are verified on GitHub in commit `e10445dba4543a3fda5d92f5bee92227de69cbc6`. Codex attempted to fetch exactly those 13 assets locally, but the resulting local files also became `dataless` placeholders. Do not interpret their filenames/sizes as proof the bytes are available locally.

`docs/CODEX_V4_INTEGRATION_HANDOFF.md` exists on the remote branch and is the focused implementation instruction once local access is restored.

**No game code was changed by the blocked Codex attempt after the 13 asset fetch.** Codex reported: `ios/` untouched; no staging, commit, push, deploy, GitHub Actions or Vercel used.

Next sequence after local recovery:
1. verify critical files and Git are physically readable and no longer `dataless`;
2. safely preserve/migrate local-only work and `ios/` outside OneDrive;
3. give Codex `docs/CODEX_V4_INTEGRATION_HANDOFF.md` and execute Gate 0;
4. review Codex diff/checks;
5. localhost visual/runtime QA;
6. physical iPhone QA and regression of Linus → quest → parent approval → truck → materials loop;
7. only after Gate 0 proof, implement locked post-delivery Linus dialogue → recycling Stage 1 progression.

## 🔒 QUEST SYSTEM V2 (LOCKED 2026-09-21)

Read `docs/QUEST_SYSTEM_V2.md` before changing parent quests, progression or backend quest schema.

Locked direction:
- approved quests contribute to **one shared world-progression resource**;
- the five existing quest categories remain metadata, not separate point balances;
- **SysselBux** remains the in-game currency and **Diamonds** remain IRL rewards;
- parent defines task/rewards; SysselCraft dynamically decides where/when/through whom a quest is presented in the unlocked world;
- quest definition/template is separate from each concrete quest instance;
- recurring quests must support one-time, daily, selected weekdays and weekly without resetting completed instances;
- Parent UI needs edit and archive/delete; history/reward events must never be destructively rewritten;
- recurrence/editing affects future instances while historical instances preserve what actually happened;
- migration is additive and backward-compatible. Existing category metadata and current quests must survive.

The 2026-09-21 audit found that `parent_quests` and `quest_instances` already provide a useful template/instance split, but `unique (quest_id, child_id)` currently blocks recurrence. `review_quest` already has idempotent reward-event protection but currently increments category-specific progression. Do not improvise a destructive migration.

## 🔒 FUNDAMENTAL COLLABORATION RULE — TRUTH BEFORE MOMENTUM

Never invent project state, capability, evidence, success, test results, files, screenshots, runtime behavior or conclusions. If untested, call it unverified. Verify repository/runtime state directly whenever possible. Reality wins over the plan.

## 🔒 AUTONOMOUS EXECUTION LAW

After the user says “kör”, “kör på”, “bara kör”, “bygg på nu”, “fortsätt”, or equivalent, continue autonomously through verify → implement → checks → evidence → fix → continue. Stop only for a genuine external dependency, product decision, credential/permission, physical-device/local result, or risky destructive action requiring the user.

## 🔒 CANONICAL VISUAL DIRECTION

> **En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.**

**PIXEL ART IS NOT THE DESIGN. DO NOT REVIVE IT.** True 2.5D is required: coherent perspective, object base points, Y-depth, foreground occlusion, contact shadows, ground-plane roads and separate render/collision/interaction/occlusion geometry.

Read `docs/ART_DIRECTION.md`, `docs/START_AREA_DESIGN.md` and `docs/TECHNICAL_HANDOFF.md` before visual work.

## Product thesis and locked laws

**Parent creates quest → quest appears in village → child performs it in real life → child marks it done → parent reviews → approval gives feedback + rewards + hidden progression → village changes.**

- Gör saker i verkligheten → världen förändras.
- Quests bygger staden. Valutan gör den till din.
- Byn är gränssnittet.
- Visa progression. Redovisa den inte.
- Parent approval before reward/progression.
- Child gets game; parent gets tool.
- Quests belong to the world, not only the house.

## Interaction model

Real child avatar. Mobile/tablet tap-to-move with pathfinding; desktop also WASD/arrows; no virtual joystick. Contextual NPC/object interaction. Quest/UI markers directly tappable. **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**

## Canonical sources

- Story/world canon: `docs/STORY_DESIGN.md`
- Visual canon: `docs/ART_DIRECTION.md`
- Start-area canon: `docs/START_AREA_DESIGN.md`
- Technical state: `docs/TECHNICAL_HANDOFF.md`
- Gate 0 local implementation: `docs/CODEX_V4_INTEGRATION_HANDOFF.md`
- Persistence authority: `docs/STATE_OWNERSHIP.md` + `docs/RECONCILIATION_PLAN.md`
- Private history: `sebass80s/sysselcraft-diary`, `diary/Sysselcraft_Utvecklingsdagbok.md`

## 🔒 PRIVATE DEVELOPMENT DIARY

Keep the private diary moving on genuine milestones, design decisions, visible transformations, notable failures, architectural turns, character/world insights, physical-device breakthroughs and memorable real project moments. Never fabricate screenshots, quotes, commits or runtime evidence. The diary is the journey, not technical truth.

## Story/progression order

Current agreed order is:

**v4 Gate 0 → browser/runtime proof → physical iPhone proof → locked post-delivery Linus scene → recycling Stage 1 → complete first recycling construction arc → Henning arrives → bakery arc → Sol/clinic → connected-area expansion proof.**

Henning is Linus's old friend and first new resident. Henning's recurring internally logical wild schemes are core personality, but he remains competent and dignified. Sol follows Henning and is young/newly graduated but competent, warm, energetic, organized and ambitious.

Future Village Event Director architecture is documented in `TECHNICAL_HANDOFF.md`: Story events, authored state-aware Village events and small Ambient activities. **NPCs are residents, not buttons.** This is future architecture and must not steal priority from Gate 0 or the first recycling arc.

## State ownership boundary

Pairing does not migrate local save. Local prototype and backend quests remain separate ledgers for now. Reconciliation remains observe-only; no max merge/reward replay/retroactive reward fabrication/silent overwrite. Migrate one state family at a time after physical two-device evidence.

## Systems to preserve

Adaptive Phaser world/camera; A*-style tap-to-move; keyboard movement; separate collision footprints and Y/base-depth sorting; reusable asset architecture; data-driven dialogue; Linus intro + puppy; Linus-to-house onboarding; quest marker/approval event; truck/material delivery and persisted completion; Capacitor Preferences local save; Supabase family/pairing/quest boundary; idempotent server rewards.

## Deployment / cost law

Local/native testing is default. Use Vercel only when genuinely needed. Standard GitHub-hosted Actions may be used autonomously, but do not opt into explicitly billed/larger runners or paid services without approval. During the current OneDrive blocker, neither Actions nor Vercel is useful for proving the local/native state.

## Next Nova checklist

1. Read this first and recognize the OneDrive blocker before asking Codex to do anything.
2. Verify current remote branch/main/PR rather than trusting stale SHAs.
3. Do not restart Capacitor setup.
4. Preserve the old OneDrive working tree and especially `ios/` until local contents are genuinely recovered/materialized.
5. Spend no further Codex quota on OneDrive diagnosis.
6. Once local files are readable, migrate development out of OneDrive safely before resuming Gate 0.
7. Run Gate 0 from `CODEX_V4_INTEGRATION_HANDOFF.md`, then localhost, then physical iPhone.
8. Preserve and physically regression-test the existing quest/approval/truck/delivery loop.
9. Keep reconciliation observe-only until evidence supports migration.
10. Read/update the private diary when a genuine story-worthy milestone occurs.


## 2026-09-22 native workflow + physical reward milestone

The canonical local repo is now `/Users/karoaa/Developer/sysselcraft` on `nova/local-construction-snapshot`. The old OneDrive blocker/checklist above is historical and must not be treated as the current blocker.

A safe one-command native sync helper now lives at `scripts/syssel` and is exposed as `npm run syssel`. It verifies the exact local repo and branch, aborts on unexpected local modifications, explicitly tolerates/preserves the known local `ios/App/App/config.xml` modification, runs `git pull --ff-only`, `npm run build`, and `npx cap sync ios`. It never resets, cleans, stashes, deletes the app, or regenerates `ios/`. After the helper completes, the human normally only needs to press Run in Xcode for physical-device QA. Do not make Kalle copy the old multi-command sequence for routine updates when this helper is available.

The backend MMO reward loop has now been physically verified on iPhone across the offline-approval boundary: child submits quest -> child app is closed -> parent approves on separate parent device -> child app relaunches -> Linus still exposes the reward turn-in -> child claims it -> backend payout appears in the village resource HUD/inventory. The awaiting-approval marker is persisted locally so arbitrary old approved history is not replayed as a turn-in. Preserve this behavior as a regression invariant.


## 2026-09-22 physical reject/resubmit/claim proof

Kalle physically verified the full one-off quest correction loop on the current iPhone build against the live backend using the quest `Testa rejection`: child submit -> parent reject -> the same quest instance returned to the child -> child resubmit -> parent approve -> Linus reward turn-in -> claim -> force-quit/relaunch. Backend inspection at each boundary confirmed no payout on submit, rejection, resubmit or approval; payout happened only on child claim. The tested instance `868deeab-6552-41a1-b04e-f6ed0ed20356` ended with `claimed_at` set and exactly one reward event. After relaunch it did not replay and backend state remained unchanged.

A useful UI observation from the same test: Linus currently exposes one pending reward turn-in at a time. An older approved/unclaimed quest was first in the local turn-in queue; after Kalle claimed it, `Testa rejection` became visible at Linus. This was queue ordering, not a lost reject/resubmit marker. Preserve exactly-once semantics; multi-turn-in presentation can be improved later without changing reward ownership.

After both legitimate claims in this session the authoritative backend state was 💎19 / 🪙176 with `worldProgression = 6`. Treat those numbers as a dated test checkpoint, not a permanent expected wallet.


## 2026-09-22 alpha hardening checkpoint

The earlier OneDrive/Gate-0 next-checklist is historical. Current canonical branch is `nova/local-construction-snapshot`; routine native updates use `npm run syssel` from `/Users/karoaa/Developer/sysselcraft`.

The supervised-alpha readiness pass has now materially closed the following:
- A20 update-in-place physically passed with local Recycling save, pairing and Quest v2 preserved.
- A21 default child build is physically accepted: dangerous native test/reset/reconciliation controls are hidden unless explicitly opened with `?debug=tools`.
- A22 intentionally keeps backend quest/economy authority separate from legacy local world progression. No automatic reconciliation or Bakery unlock is authorized.
- A18 is resolved for supervised alpha by keeping real parent Supabase authentication in the deployed web `/parent` UI on the parent's own device. The child Capacitor app does not implement native parent magic-link return and must not replace its anonymous child session with a parent session.
- A23 core landscape quest-panel interaction, long content and practical live-session smoothness passed on the physical iPhone.
- A24 active completed Recycling WebP rendering passed on-device. Future Bakery/Clinic/Henning/Sol production art remains separate acceptance work.
- A26 now commits npm lockfile v3 and CI installs with `npm ci`; the locked dependency path passed the full verify workflow.

Remaining readiness gaps are mostly stress/time-boundary evidence rather than known core implementation holes: A17 pairing expiry/true transport loss/session-loss/reinstall; A19 real day/week rollover and offline-next-period materialization; A16 harsher real-network/concurrency cases; accessibility/other-device-size checks. Do not destructively test reinstall/session loss against the preserved alpha save without Kalle's explicit authorization.

The next larger gameplay slice remains Henning/Bakery, but exact Bakery thresholds and Henning arrival staging are still product decisions and must not be invented.


## 2026-09-22 Henning arrival locked

Henning's first arrival staging is now a product decision, not open design space. After Recycling is completed and Linus has mentioned his old friend, the child later discovers **Henning together with Linus**. No vehicle or spectacle is required. Their first dialogue beat must clearly establish that they are old friends and genuinely happy to see each other again, using familiarity/teasing/history rather than exposition.

The scene must then imply the causal chain without exposing mechanics: the child's real-world quest work made the village visibly start living again; Linus noticed and contacted Henning; Henning saw/believed that something had truly changed and chose to move there. The child should feel that their actions helped bring a person back to the village, but nobody says chores summon residents or explains hidden progression.

Henning is introduced as a person first. Bakery follows from Henning and must not pre-exist as the thing that summoned him. Exact Bakery quest count/thresholds remain open.


## 2026-09-24 handoff checkpoint — Diamond rewards + parent identity

This section supersedes stale next-step language above.

The supervised playable Alpha core is accepted. Current work is the Mira/Diamond reward slice and its parent-auth acceptance boundary.

Diamond reward backend/UI is implemented on the active branch: parent-defined IRL reward catalog, authoritative atomic Diamond purchase, redemption snapshots, parent fulfillment/delivery, refund/idempotency protections, child Mira shop integration and immediate authoritative wallet refresh. Live rollback-based transactional and authorization tests passed. Physical iPhone acceptance is still pending and must not be claimed until the real parent -> child purchase -> parent fulfillment -> restart journey passes.

Parent web authentication has been changed from Magic-Link-only UI to email + password login for existing users, with an authenticated "set password" path that updates the SAME Supabase Auth user. No account creation or household migration was added.

Critical live-auth finding: there are two distinct Supabase Auth users. The household-bearing parent is the **Yahoo-address account**, user id `64743174-4901-4c7e-ab00-d8aa061b16f5`. The Gmail-address account is a separate user, id `639c5ef7-7f40-4425-a4b0-cc12f9c6579f`, with no household. This fully explains why Gmail login showed "Skapa familj". Do NOT create a family for Gmail, merge users, copy household data or change ownership as a workaround.

Supabase auth logs prove the Yahoo identity successfully logged into the older working preview and accessed the existing household/child; that browser session is still valuable and Kalle should keep it logged in until the new auth path is accepted. Current acceptance is temporarily blocked by Supabase email rate limiting after repeated Magic Link attempts. When the limit clears, test the **Yahoo address** on the newer preview. If the existing household appears, set a password while authenticated as that Yahoo identity, then verify password logout/login preserves the same household.

Known newer preview used for auth acceptance:
`https://sysselcraft-ek6vjkflg-yourmovegame.vercel.app/parent`

Known older working Yahoo-session preview:
`https://sysselcraft-pgia4qp65-yourmovegame.vercel.app/parent`

Do not assume either deployment contains a later commit without verifying Vercel/repo reality first.

Latest verified remote branch HEAD at this handoff is `fd67b7e6c40cf43f861feba5d66971bb1fdb244e` before these documentation updates. The parent password-auth implementation itself was green in GitHub Actions at `f7e90eb4d130d2adc38b6450b4a53d56896c9790`; later branch commits only updated canonical design/handoff documentation.

### Immediate next sequence

1. Verify branch HEAD and CI before doing anything.
2. Keep the old Yahoo-authenticated preview tab alive; do not log it out unnecessarily.
3. After Supabase email rate limit clears, authenticate the newer preview with the Yahoo address, never Gmail.
4. Confirm existing family/child/quests appear. If they do not, stop and inspect identity before any mutation.
5. While authenticated as the correct Yahoo user, set a password using the new parent UI.
6. Verify logout -> email/password login returns to the same household.
7. Create test Diamond rewards (e.g. 1 💎 and 5 💎), then perform the real paired-iPhone purchase/fulfillment acceptance journey.
8. Only after that journey passes may Diamond rewards be marked physically accepted.

Image-generation work remains paused by Kalle. Do not generate new SysselCraft images unless he explicitly reopens it.


## 2026-09-24 parent password auth physically accepted

Parent password authentication is now **PHYSICALLY ACCEPTED** for the existing household-bearing Yahoo Supabase identity. The email-rate-limit blocker was bypassed without creating or migrating any account: the preserved authenticated Yahoo browser session was verified as user `64743174-4901-4c7e-ab00-d8aa061b16f5`, then used through Supabase Auth's supported authenticated-user password update endpoint. The password update returned HTTP 200 for that same user. Kalle then logged into the current password-capable preview with the new password, saw the existing family/child, changed to a private permanent password through the parent UI, logged out, and successfully logged back in with that password with the same family intact.

Normal parent authentication is therefore email + password. Magic Link is no longer required for normal use. The separate Gmail identity remains unrelated and must not receive a replacement family or copied ownership. No direct mutation of `auth.users.encrypted_password` was performed.

Vercel Git previews were paused again immediately after acceptance by setting `vercel.json -> git.deploymentEnabled=false`. Do not re-enable previews for ordinary commits; collect changes and enable only for an explicitly needed acceptance deployment.

The next physical acceptance target is the Diamond reward journey: parent creates reward -> paired child sees it at Mira -> authoritative purchase deducts exactly once -> parent sees pending delivery -> parent fulfills -> restart preserves the result. Diamond physical acceptance remains OPEN until that passes.
