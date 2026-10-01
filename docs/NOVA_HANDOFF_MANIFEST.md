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

## 🔒 ACT 2 LAKE RESTORATION DESIGN — 2026-09-28

Act 2 lake restoration uses three player-chosen, order-independent tracks: summer cottage, jetty and boathouse. Keep their stories/dialogue self-contained; do not branch copy or prerequisites based on completion order. The motorboat is visible but locked until all three are complete, then becomes the Act 2 final restoration and Act 3 bridge.

Each completed project may independently unlock world reactions such as new Mira shop goods, optional activities and ambient changes. Established Act 1 residents should increasingly spend time at the lake as it comes alive; notably, a completed jetty can make swimming/jetty hangout activity eligible. At 3/3 the lake should feel like the village's summer gathering place.

`/act2-test` is a non-authoritative story/visual acceptance lab. Production Act 2 is connected through `/act2`; test-route visits must never mutate authoritative production progression.

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

## Deployment / cost law — LOCKED 2026-10-01

**GitHub first, Vercel rarely.**

Canonical rule: **GitHub Actions on every relevant code push. Vercel only at a real acceptance checkpoint or release.**

Reason: the project has reached Vercel Hobby's deployment-storage ceiling in practice. Treat Vercel deployment storage as scarce. Do not use Vercel as the default verification loop.

Operational rules:
- Batch code work on the feature branch. Ten coherent commits verified by GitHub Actions are preferable to ten Vercel previews.
- Do not deploy after every copy fix, UI tweak, test repair or small refactor. Accumulate changes and create a preview only when Kalle actually needs to click-test a meaningful checkpoint.
- Docs-only, Markdown-only, handoff-only and similarly trivial commits must not trigger Vercel builds. Keep an Ignored Build Step / equivalent Vercel configuration that skips such changes.
- Keep feature branches short-lived. Merge/close them when done so stale branch previews do not remain unnecessarily protected from retention cleanup.
- Normally keep **one useful current preview per active workstream**, not a trail of near-identical snapshots.
- After merge, do not preserve feature-preview history without a concrete reason.
- Production deploys are for actual release, not for incremental tuning that could have been verified locally, in GitHub Actions or in one acceptance preview.
- Local/browser/native testing remains preferred whenever it answers the question.
- Standard GitHub-hosted Actions may be used autonomously. Do not opt into explicitly billed/larger runners or paid services without approval.

Older guidance saying to “use Vercel without hesitation” is superseded by this policy.

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


## 2026-09-25 current checkpoint

Act 1 browser QA is active and the quest lifecycle is being rebuilt. The dedicated Linus onboarding speech bubble is verified working. The locked quest flow is documented in QUEST_SYSTEM_V2 section 13. The implementation is mid-flight: backend acceptance state and frontend acceptance UI exist, while distinct question-mark versus exclamation-mark world presentation still needs end-to-end completion and verification. Recycling historical-progress baseline protection was also added after a QA run incorrectly cascaded construction from old progression history. Do not treat current HEAD as release-ready. Finish the refactor, build/CI, fresh browser Act 1 acceptance, safe-device update-in-place acceptance, then create the release checkpoint before updating the preserved release phone. Parent UI also has a parked TODO to show active occurrences distinctly from other lifecycle states.


## 2026-09-25 Quest v2 + Recycling verified checkpoint

The previously mid-flight Act 1 quest refactor is now core-accepted. Kalle physically verified on iPhone against the live backend: available quest -> `Ta uppdraget` -> active -> `Jag är klar` -> pending -> parent reject -> same quest active again -> resubmit -> parent approve -> `!` turn-in -> exactly-once reward -> full app restart with no replay. Other available noticeboard quests retained the `?` marker. This is real device evidence, not browser-only evidence.

The Recycling historical-progression cascade has deterministic regression coverage in commit `8c44aa5cf939e43ff843b85c5cd80b931cf4ebe8`. Baseline 12 historical claims cannot advance construction; progression 13 earns only stage 1 pending; explicit reveal is idempotent; sync/save/load/restart cannot cascade to stage 2. Full local `npm run verify` passed and no production code change was required.

Immediate gameplay work may now move on from the core quest-state-machine repair. Preserve marker semantics (`?` available, `!` approved turn-in, `💬` story/dialogue) and the Recycling baseline invariant. The next authored story slice remains Sol's arrival via the locked message-in-a-bottle concept after the shop/Mira progression. Parent lifecycle grouping remains a UI follow-up, not a blocker for this accepted core.


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


## 2026-09-26 Diamond physical closeout

Physical iPhone + live backend acceptance is complete for the Diamond/Mira reward loop. Parent-created `Diamond-test` (1 💎) appeared at Mira; purchase changed both device and backend wallet 55 -> 54 exactly once; parent saw the pending redemption, marked it delivered, and the live row transitioned to `delivered`; after full app restart the wallet remained 54. The previous handoff statement that Diamond physical acceptance is open is obsolete.

The same session added and physically accepted the duplicate-purchase guard. While a reward has a `pending_delivery` redemption, Mira disables that reward and shows `⏳ Väntar på förälder`; a new purchase changes to this state immediately. The live `purchase_diamond_reward` RPC independently rejects another pending purchase of the same reward for the same child. Final implementation commit: `be690488461a8dc5a937c3dcb523a5511f4172ef`; CI #847 passed on that exact SHA.


## 2026-09-26 release onboarding / handover checkpoint

- The polished first Linus meeting is live. During the first conversation the unknown NPC nameplate starts as `Gubbe`, Linus introduces himself, the child names themself and the puppy, and the longer opening preserves the core mystery instead of explaining the real-world-task -> village-growth mechanic.
- Intro completion regression fixed: finishing the conversation now updates the current-session intro ref as well as React/save state, so tapping Linus again cannot restart the opening in the same session.
- Fresh-device onboarding now checks child pairing only **after** the Linus introduction finishes. If no paired child ID exists, the existing `ChildPairingPanel` opens automatically. This is intentional: story first, adult/device setup second, then backend quests can appear.
- Release Vuxenläge no longer exposes the Sol cutscene/runtime test launchers. The Sol runtime harness remains compiled for regression coverage and safety tests but is not reachable from normal release UI.
- Final code checkpoint: `7c001107cff16e8cae65650eb175af1134187bc7`, GitHub Actions CI #949 SUCCESS.
- Physical acceptance of the new automatic post-Linus pairing prompt is still OPEN. Next Nova should have Kalle sync with `npm run syssel`, Run from Xcode, finish the Linus intro on the fresh/unpaired device, verify the pairing panel appears, pair Adam, then verify the existing real quests appear at their routed world sources (e.g. Bädda sängen / Läxa at Home). Do not reset/uninstall an existing valuable save merely to retest onboarding.


## 2026-09-26 locked expansion architecture

Two expansion primitives are now canonical and must not be conflated. **Outdoor world growth uses discrete map/area swaps:** each new act may load a new painted background plus area-specific navigation, exits, spawn points, hotspots, NPCs and markers while global player/backend state persists. Do not grow the current village into one giant map by default. **Interiors use fullscreen illustrated scene UI:** the child's house and comparable interiors should follow the Story Moment / Mira-shop model rather than become navigable Phaser maps.

The child's house is planned as the first persistent personal interior and a SysselBux spending surface. Initial scope should favor a reusable illustrated base room with fixed decoration hotspots and owned overlay variants, not freeform Sims-style placement. SysselBux purchases may personalize the room; ordinary story/build progression must not require spending that currency.


## 2026-09-26 LOCKED Act 2 story foundation

Act 2 opens the lake area, already foreshadowed by the bottle-message/Sol sequence. The act should primarily deepen Linus, Henning, Mira and Sol. Its intended major new character is one child peer for the player.

The new child's family formerly spent summers at a cottage by the lake. The property includes a cottage, jetty, boathouse and old motorboat, but fell out of use as the area emptied and deteriorated. The child wants to restore the summer place so the family will want and be able to return for summers, and meets the player at the old property.

Canonical restoration spine: **cottage -> jetty -> boathouse -> motorboat**. Exact quest counts and stage thresholds remain open. The final payoff is the family returning to the restored summer place, potentially via Story Moment. The repaired motorboat becomes the route into Act 3, seeded by the child's memories of family trips across the lake. Act 3's destination remains deliberately open.


## 2026-09-27 — ACT 1 LOCKED / ACT 2 START CHECKPOINT

Kalle has declared **Act 1 feature-complete** after the current room/shop/persistence pass. Treat new Act 1 work as bugfix/regression work unless Kalle explicitly reopens scope. The next production focus is **Act 2: the lake summer place** as locked in `docs/STORY_DESIGN.md`.

Latest verified gameplay-code checkpoint before the documentation closeout:
- gameplay HEAD: `2d59a6b21452ca0b0f72f965a1460aeb6cc28d0f`
- GitHub Actions run **#1071**: completed / success on that exact gameplay SHA
- canonical documentation was then closed out through commit `7641340721add513675b640d23b1324e97c97dc4`; verify the latest branch HEAD/CI rather than expecting the gameplay SHA to remain HEAD
- canonical local workspace remains `/Users/karoaa/Developer/sysselcraft`
- native update flow remains `npm run syssel`, then Run in Xcode over the existing app; never uninstall/reset Adam's app or regenerate iOS.

### Final Act 1 room/economy lessons to preserve
- Room upgrades use **full-scene sequential images**, not composited runtime furniture: `room-base.png` then `room-1.png` … `room-6.png`.
- **SPRITESHEETS ARE FORBIDDEN** unless Kalle explicitly asks for one. Produce each raster asset individually at intended final landscape resolution. Never use a contact sheet as a production source.
- Backend is authoritative for story purchases and wallet. Current story ownership is reconciled backend → local save so purchases survive restart.
- Autosave must explicitly carry every owned room flag. Do not rely on stale spread snapshots for ownership.
- Purchased Mira room items remain visible as disabled `✓ Köpt`; only the next sequential unowned upgrade is offered.
- Adam's live bottle-message purchase is legitimate. At the last backend inspection his authoritative balance was **110 SysselBux** and `bottleMessagePurchased=true`; do not manually adjust this balance merely because older UI appeared stale.
- Dog home and child room both use a post-dialogue **showcase pause**: final `Visa mig!` hides dialogue and exposes the full scene before the next scene tap exits. Room showcase was added in HEAD `2d59a6b...`.
- Never reset/uninstall Adam's save for testing. Use isolated harnesses or Test-Ture where appropriate.

### Act 1 boundary correction — Sol/Clinic is DONE
**Sol and the Clinic belong to Act 1 and are complete.** Do not treat Sol/Clinic as an Act 2 bridge, acceptance prerequisite, or remaining production task. Do not reopen or rebuild that arc unless Kalle reports a concrete regression/bug. The existing Sol/Clinic code, assets, save flags and tests are completed Act 1 implementation and should simply be preserved.

### Act 2 canonical foundation
Act 2 is **the lake summer place**, a persistent second outdoor area reached through the canonical physical area-transition grammar. It is not an enlarged village map.
The major new character is one **boy/peer**, whose family formerly used a summer cottage at the lake. He wants to restore the place so his family can spend summers there again. He is a child with a personal motivation, not a child mechanic.
Locked high-level restoration spine:
1. summer cottage
2. jetty
3. boathouse
4. motorboat
The family returns at the emotional payoff; the repaired motorboat is the bridge to Act 3. Exact project thresholds, stage counts, individual quests, boy name/design, lake layout and Act 3 destination remain open and must not be invented as canon without a product decision.

### Efficient Act 2 production law
Apply the lessons from Act 1 from the first commit:
1. verify repo/docs/HEAD before edits;
2. design story state + backend authority + persistence + visuals together;
3. use existing Quest V2/unified progression rather than parallel currencies/progression systems;
4. define explicit baselines/ownership flags before wiring visible stages;
5. build each important raster scene as its own production-ready landscape asset;
6. test save/restart/reconciliation as part of each slice, not after content is complete;
7. batch coherent story/content arcs so Adam cannot immediately outrun one-scene increments;
8. keep isolated acceptance harnesses for destructive/story-state testing and preserve Adam's live save;
9. only claim green/fixed/verified with exact evidence.

### Immediate next-Nova order
1. Re-verify branch HEAD and CI against this checkpoint.
2. Read this manifest, `TECHNICAL_HANDOFF.md`, `ART_DIRECTION.md`, and the Act 2 section of `STORY_DESIGN.md`.
3. Treat Sol/Clinic as completed Act 1 and leave it alone unless a concrete regression is reported.
4. Design Act 2 production architecture around lake area transition + boy introduction + the four restoration projects, explicitly locking open product decisions with Kalle before they become canon.
5. Prefer a sizeable first playable Act 2 slice over isolated tiny patches.


### HARD VISUAL METHOD — mandatory before Act 2 art
Before drawing any Act 2 world/building art, read the final **HARD VISUAL PRODUCTION METHOD — ACT 1 PROVEN PIPELINE** section of `docs/ART_DIRECTION.md`. It is the authoritative production procedure and exists to prevent the redraw churn that consumed substantial Act 1 time.

Core sequence: **define whole area → paint one coherent master → Kalle accepts → freeze geometry → record project anchors/envelopes/footprints → author each project state against that same reference → deterministic normalization/composite validation → runtime 2.5D integration → iPhone acceptance.**

Do not independently generate pieces and try to assemble them later. Do not regenerate an accepted master/building to solve placement. Do not ask image generation to solve crop/alpha/alignment/envelope problems. Do not produce stage variants with drifting perspective/footprints. Never use spritesheets/contact sheets unless Kalle explicitly requests one.


## Act 2 design-history lock — Alve/opening/project UX (2026-09-28)

- Late Act 1 foreshadows the lake with an overgrown **SJÖN →** sign and a brief Linus memory; no immediate quest.
- Act 2 starts when the dog runs down that remembered path. Forest travel is cinematic only, not a playable map, ending in the lake reveal.
- First clue at the apparently abandoned lake is a bicycle against a tree. Adam finds **Alve** attempting to repair his family's old summer cottage alone.
- Nameplate starts as **Barnet** and changes to **Alve** only when the children introduce themselves.
- Alve is wild/impulsive but kind. His family has had a difficult period whose exact cause stays unspecified. He wants to revive the summer place because of good family memories.
- Adam offers to help. Alve asks what to begin with.
- Project selection happens inside the Story Moment through three hotspots: **Stugan / Bryggan / Båthuset**. A hotspot previews/marks a choice and triggers a short Alve motivation; it does not commit yet.
- Confirmation is explicit via **Laga [objekt]**. After confirmation Alve says **“Bra val! Vi fixar [objektet] först!”**. The word “först” does not create a canonical project order.
- Locked selection lines: Bryggan = future boat mooring + swimming; Båthuset = needed to repair the boat; Stugan = Alve hopes his family will return when it is restored.
- Motorboat is the visible final goal and remains unavailable until all three independent projects are complete; its lock should make fictional sense, not read as an arbitrary 3/3 gate.
- Once a project is active, **Alve appears/works at that site**, providing the visual active-project marker while the object itself advances through construction stages.
- Clicking Alve at the active project opens short project-specific friend cutscenes. Mix project talk, banter and gradually revealed family/lake memories. Do not use him as a quest-vending machine.
- Alve's story is deliberately revealed over time: **stranger → building companion → friend** in parallel with **neglected lake → restored lake → living lake**.
- When a project is complete, lake residents/activities can replace the “worksite” feeling. Guiding principle: **Alve works where restoration is active; village life appears where restoration is complete.**
- Historical status note: this slice was still paper design on 2026-09-28. Production integration has since moved to `/act2`; `/act2-test` remains acceptance-only.


### Act 2 pacing/economy/village integration — LOCKED 2026-09-28
- Act 2 is intentionally slow-burn. Four visual stages do **not** mean four quests. Exact contribution thresholds remain open, but major restorations must take long enough that Adam cannot burn through authored content immediately.
- Something should happen between major visual stage changes, both **at the lake and back in the village**: Alve/friend scenes, props/environment, visitors/activities, resident dialogue, inventory changes and authored village interactions.
- SysselBux is more deeply integrated into Act 2 story as an economy sink. Restoration can reveal natural needs for tools/supplies that require story-bound purchases from Mira. Required purchases must be affordable from normal earnings and use the authoritative backend wallet. Exact prices remain unlocked pending real economy balancing.
- The restored Act 1 village is Act 2's support network, not obsolete scenery:
  - Återvinningen/Linus = salvage and reuse;
  - Bageriet/Henning = food, community and occasional useful Henning events;
  - Sjukhuset/Sol = practical care/safety and minor age-appropriate incidents, never manufactured emergencies;
  - Lanthandeln/Mira = equipment/supplies and SysselBux story purchases.
- These roles are not mandatory checklists. Use short authored trips/interactions where they naturally fit.
- Core pacing loop: **lake restoration ↔ village support ↔ lake restoration**, powered underneath by ordinary real-world quest completion.
- Product principle: **the world Adam restored in Act 1 becomes the toolkit and community that makes Act 2 possible.**


### Act 2 lake project/finale paper lock — 2026-09-28
- Completed lake projects unlock controlled-random ambient resident scenes selected from authored pools and held stable for the current lake visit/session. Pools include a real empty-state chance. Ambient click dialogue is optional/non-gating.
- Bryggan identity = swimming/summer/social life. Båthuset = workshop/tools/finds/small projects and future motorboat-repair credibility. Stugan = Alve's emotional/family-memory location.
- Stugan reveals Alve gradually through concrete objects/memories; family hardship cause remains unspecified. Cottage completion does not summon the family.
- Family return is Act 2's end payoff after the motorboat: boat complete → quiet aftermath → signs somebody is in the supposedly empty/locked cottage → Alve suspects burglars → Adam/Alve investigate → reveal Alve's family.
- After Act 2, Alve becomes permanent motorboat transport across the lake. Use a reusable Adam+Alve boat Story Moment whose dialogue can vary later.
- Act 2 may hint subtly at something on the other side, but Act 3 destination is deliberately undefined. Hints must be destination-neutral. **Mystery is canon; answer is not.**
- Baseline for Stugan/Bryggan/Båthuset is locked at **4+4+4+4 = 16 authoritative real-world contributions per project**. Motorboat count remains open.
- Bryggan 1–4: Adam/Alve discover deeper rot; after contribution 2 they need reusable timber; Linus/Recycling supplies suitable salvage; Linus comes to the lake and briefly reacts to the old place; contribution 4 advances jetty 1/4→2/4.
- Bryggan middle: as swimming becomes plausible, Sol performs a practical bathing-place safety check, prompting cleanup and a **life buoy** requirement. Only then does the life buoy appear as a story item at Mira. Adam buys it with authoritative SysselBux; exact price remains open; it returns to the lake and becomes permanently visible at the jetty. Purchase is a story beat, not one of the 16 contributions.
- Bryggan 9–12 increasingly foreshadows swimming/summer use and resident return. 13–16 is final push; contribution 16 completes the project and enables the permanent controlled-random jetty ambient pool (e.g. empty, Linus+Henning, Sol+Mira). Exact dialogue/content pool remains production work.


### Act 2 character visual-reference lock — 2026-09-28
- Established characters may not be generated from prose/memory alone. Production image sessions begin by uploading the canonical reference batch into the active conversation: child, puppy, Linus, Henning, Mira, Sol; Alve joins after approval.
- ChatGPT Library is useful for visual inspection but was experimentally confirmed not to provide a reliable direct image-reference bridge to image generation. A raw-byte materialization attempt failed. Never pretend a Library/repo image was supplied to the generator when it was not.
- Child Story Moment rule is absolute: **always seen from behind**, with canonical cap/backpack/clothes/proportions/silhouette; never invent/show the face.
- **Canonical Sol was re-locked 2026-09-28** using the accepted more photorealistic/cinematic arrival render. It preserves her adult blonde-doctor identity, teal scrubs, white coat and stethoscope while matching Mira/Linus/Henning rendering better. Older cartoonier Sol is superseded as a style reference.
- Ensemble target: warm cinematic semi-realistic/photographic SysselCraft storybook rendering, coherent across the whole cast; no anime or generic glossy-animation drift.
- The accepted swimming group image proves the ensemble look, but its front-facing child is a known violation and must not be copied. Character identity/style acceptance does not override the back-view child law.


## Act 2 Båthuset paper lock — 2026-09-28

Canonical detail lives in `docs/STORY_DESIGN.md`. Current boathouse status:
- **1–4 LOCKED:** clearing reveals a stubborn locked old chest; reasonable opening attempts fail; Henning solves it as a non-interactive cinematic dynamite gag (cut → BOOM → soot). Chest contains old tools/boat parts plus a family-linked lake photograph showing the same motorboat travelling across the lake. Back text: **“Sista turen över sjön innan hösten.”** This seeds the motorboat/other-side mystery without defining Act 3's destination. Locked Alve/Adam village exchange: **“Är alla i din by så här?” / “Typ.” / “…jag gillar den här byn.”**
- **5–8 LOCKED:** Adam and Alve turn the boathouse into a functioning workshop. Mira supplies the practical organization/workshop solution through a story-bound SysselBux purchase; exact package/price open. The photograph becomes a permanent workshop prop. Locked ending: **“Vad ska vi bygga?” / “Allt. Men först ska vi fixa den gamla båten.”** Motorboat remains progression-locked until all three main lake projects are complete.
- **9–12 LOCKED:** they find an old soapbox-car/lådbil plan and build one. Village/recycled parts can feed the build. Alve's first harmless test fails (including locked **“Hjulet lossnade.” / “Då vet vi vad vi ska fixa.”** beat); they improve it and succeed. The car remains as a persistent boathouse prop. Emotional purpose is Adam/Alve friendship. Locked ending: **“Okej. Den där var övning.” / “För vad?” / “Båten.”**
- **13–16 LOCKED:** final push prepares the boathouse physically for the later motorboat project. Adam and Alve clear the boat bay, restore the old trolley/slip mechanism, and reuse parts recovered from the chest; Linus can provide a small practical support beat. They test the mechanism without starting motorboat restoration. Locked exchange: **“Då kan vi få in båten.” / “När vi får laga den.” / “När vi får laga den.”** Contribution 16 completes Båthuset with workbench/tools, photograph, soapbox car and functioning boat bay preserved as visible history. Locked completion: **“Klart.” / “Nästan.” / “Vad är det som är kvar?” / “Den.”** Motorboat remains locked until all three main projects are complete. Completed boathouse ambient scenes keep the workshop identity: tinkering, repairs, odd projects or empty/half-finished work rather than jetty-style generic hanging out.


## Act 2 Stugan paper lock — 2026-09-28

Canonical detail lives in `docs/STORY_DESIGN.md`. **Stugan 1–16 is fully LOCKED on paper** with the standard 4+4+4+4 authoritative contribution structure. It is the emotional Alve track and must not become another generic material-fetch construction arc.

- **1–4 LOCKED:** clearing reveals Alve's old height marks and a warm family photo. Marks survive restoration. Alve reveals his real motive: **“Jag tänkte att om det såg ut som förr… så kanske de skulle vilja komma hit igen.”**
- **5–8 LOCKED:** old family board/card game, floor-is-lava memory/play, rain traps Adam+Alve inside and they play together. Key quiet beat: **“Det låter likadant.” / “Vadå?” / “Regnet.”** They create a new good cottage memory. Closing: **“Ser det ut som förr nu?” / “Nej. Det ser bättre ut.”**
- **9–12 LOCKED:** childhood drawing headed **“VÅR STUGA”** motivates veranda restoration. Alve admits family does not really know about his restoration surprise. Later a small object from home proves somebody has visited unseen. Identity/reason/object remain deliberately open. Alve's hope surges: **“De har varit här… Då måste vi hinna klart.” / “Bara… innan.”**
- **13–16 LOCKED:** no new mystery; finish damage and prepare the cottage for actual people. Alve imagines family using it again. Contribution 16 completes a warm cottage preserving height marks, family photo, childhood drawing, old game and new Adam/Alve memories. Family does NOT arrive yet. Locked close: **“Tror du de kommer?” / “Inte idag. Men den är klar.” / “Vi kommer ju tillbaka imorgon.” / “Ja. Vi har ju en båt att laga.”**
- Core thematic safeguard: completing chores does not magically solve adult/family problems. Adam's meaningful contribution is friendship and ensuring Alve does not have to work/wait alone.
- Previously locked Act 2 finale remains unchanged: family return occurs only after wider lake restoration + motorboat, through the unexpected-person-inside-cottage reveal.

Emotional progression: **restore the past → create something new → renewed hope → finish and keep living while waiting.**


## Act 2 Motorbåten + finale paper lock — 2026-09-28

Canonical detail lives in `docs/STORY_DESIGN.md`. **Motorbåten 1–16 is fully LOCKED on paper**, completing the Act 2 baseline at **64 authoritative real-world contributions total**: 16 Stugan + 16 Bryggan + 16 Båthuset + 16 Motorbåten.

- Motorbåten unlocks only after all three main lake restorations. It gathers Alve's family history, restored boathouse, village support network and Adam/Alve friendship into the vehicle that eventually opens Act 3. Destination across the lake remains undefined.
- **1–4 LOCKED:** use restored slip; confirm the wreck is the same boat from the boathouse photograph; damage is worse than expected; Linus recognizes it and provides practical salvage support without revealing destination. Contribution 4 advances 1/4→2/4. Theme: **“Inte idag”** initially frustrates Alve, while Adam reframes it as continuing tomorrow.
- **5–8 LOCKED:** one deliberately non-technical missing need sends them to Mira for the motorboat's major story-bound SysselBux purchase, exact item/price open. Alve learns not to skip preparation. Contribution 8 produces the first sign of life and advances 2/4→3/4. Locked gag: **“DEN LEVER.” / “Lugn.” / “DEN LEVER LUGNT.”**
- **9–12 LOCKED:** restored boathouse slip puts the boat into the lake; first short powered water test succeeds briefly then stops. Whole restored village helps prepare it for real use without becoming a rigid fetch checklist. Contribution 12 visually reaches 4/4; Adam and Alve give the boat a persistent name. It is now their adventure boat, but still needs a proper endurance test.
- **13–16 LOCKED:** longer test stays on their own side of lake. Linus remains ashore so Adam/Alve prove they can handle it. A harmless practical issue in 15 pays off Alve's growth; Adam says **“Inte idag”** about continuing across the lake and Alve calmly repeats it. Contribution 16 is successful homecoming and completes the motorboat story.
- **Family return payoff LOCKED:** after the homecoming Alve sees signs somebody is inside the supposedly empty cottage, assumes burglars and runs there with Adam. Familiar laughter changes the tone before entry. Family is unpacking/using the cottage, not merely visiting. They intend to stay/use it again. Alve runs into a family embrace. When asked who Adam is, locked answer: **“Det är Adam. …Han är min kompis.”**
- Family sees preserved height marks, old game and childhood drawing, then the restored living lake from the veranda. Locked final family-arc payoff: **“Det är inte riktigt som förr.” / “Nej. …Det är bättre.”** This pays off Stugan 8 and the core theme: Alve did not recreate the old summer; together they made a new one.
- Do not immediately reveal Act 3 after the family scene. Let the payoff land. Later Adam+Alve return to the named boat and destination-neutral mystery; the first true crossing is Act 3's opening.
- Family reveal is **not contribution 17**. It is the Act 2 emotional payoff unlocked by Motorbåten 16.


## Act 2 Stugan visual-production checkpoint — 2026-09-28

Stugan 1–16 remains the locked narrative arc in STORY_DESIGN. Visual pre-production/creative production has now completed a **9-still Story Moment set**: six narrative/memory/payoff stills plus three restoration-work stills added after review showed the original six-image plan underrepresented the actual rebuilding.

Canonical visual rules remain absolute: Barnet only from behind with canonical cap/backpack/clothes; canonical Alve; Valpen present/passive whenever Barnet appears; accepted Stugan stages are visual ground truth; isolated lake wilderness only with **no visible civilization**. Attempts violating Barnet orientation or showing village/church/harbor/civilization were rejected and are not canon.

COTTAGE-12's previously open home clue is now locked as **Alve's familiar keyring from home**. It proves somebody from home visited without revealing who.

Historical checkpoint: at this point creative production was ahead of runtime integration. The accepted Stugan assets and 1–16 mapping were subsequently integrated; current production status is governed by the later Act 2 implementation sections below.


## Act 2 Stugan browser acceptance — 2026-09-28

**Stugan is now integrated and human-accepted in the isolated `/act2-test` browser lab. Leave this slice alone unless a concrete regression is found.**

- Runtime/test integration commit: `3155894ebc62edb74b117c479b0676133b638c4a` (`Add Stugan story flow to Act 2 test`). Kalle reported its CI as green and then visually played the flow in the browser and accepted it: **“Det ser bra ut tycker jag.”**
- Canonical assets are present under `public/assets/village/story-moments/act2/cabin/`: `1.png` … `6.png` plus `renovating-cabin1.png`, `renovating-cabin2.png`, `renovating-cabin3.png`.
- Current test mapping: early work at 1/16; memory discoveries at 2–3; Alve motive at 4; mid work at 5–6; rain/game at 7–8; VÅR STUGA at 9; veranda work at 10–11; home keyring at 12; completed-cottage still across the final preparation/completion beats 13–16.
- `/act2-test` now contains the Alve intro, Båthuset sequence and Stugan sequence. This is an acceptance harness, not production progression.
- Historical acceptance boundary: browser acceptance did not itself authorize production integration. Production integration was implemented later through the explicit `/act2` runtime/state work.
- Next Nova must begin by verifying branch/HEAD and canonical docs against repo reality. The next content track should start from the existing locked Act 2 design rather than reopening accepted Stugan visuals.

## Act 2 implementation handoff — 2026-09-30 (historical plan, runtime now implemented)

Act 2 moved from story/art pre-production into implementation on 2026-09-30. The execution plan remains in `docs/ACT2_IMPLEMENTATION_PLAN.md`; production runtime/state work has since been implemented on `/act2`.

Current locked implementation order:
1. real Act 2 runtime foundation + OPEN-001…005 + Alve/project chooser;
2. one explicit persisted Act 2 state family;
3. authoritative Quest v2 → active-project contribution bridge;
4. implement project tracks development-order Bryggan → Stugan → Båthuset → Motorbåten while preserving free player order among the first three;
5. family finale + epilogue;
6. fresh-save/existing-save/order-matrix/restart/economy acceptance before release progression is considered complete.

Current boundary:
- `/act2-test` remains the story/visual acceptance lab, not production save authority.
- `/act2` owns production Act 2 runtime/state presentation.
- The original vertical slice **Act 1 → Act 2 trigger → OPEN-001…005 → bicycle → Alve → project chooser → chosen project begins and survives restart** is implemented; do not recreate it through a parallel path.
- Stugan/Bryggan/Båthuset remain order-independent. Motorbåten unlocks only at 3/3.
- Family finale is outside the 64 contribution count.
- Act 3 destination remains undefined.

The Act 2 opening five-image sequence is present and consumed by the shared production story path as well as `/act2-test`. The first Alve meeting now uses the canonical existing meeting-alve image progression (`bike` → `first-hello` → `a-lot-of-work` → `new-friend` → `alve-shows` → `new-friend` → `pick`) from `src/game/act2AlveStory.ts`. Family-finale production art is substantially complete. Epilogue image production is still unfinished; do not invent repository assets or claim that final visual bridge is integrated.

Alve's departure-scene gratitude beat is now locked in `STORY_DESIGN.md`: he explicitly says the outcome would never have happened without Barnet, admits he was **“helt lost”** on the day Barnet found him, explains that he thought fixing enough things would make everything solve itself, thanks Barnet and says he is glad Barnet is his friend.

### Clinic bug fix checkpoint — 2026-09-30

A stale-local-save Clinic recovery bug was patched without mutating Adam's live backend data. `ChildBackendQuestInbox` now repairs local Sol/Clinic state from authoritative backend story flags and baseline before deriving Clinic contribution progress. Commits:
- `84ba5018dd3b2c608956dde41aaea1cad1f16314` — backend-authoritative Clinic recovery.
- `e02d77aa3334c946dc1da62bf2cdc0ce975ca4f9` — regression coverage.

Desired behavior: the next legitimate quest-claim refresh can wake the Clinic progression on a stale device save; later Clinic beats still reveal in authored order rather than jumping directly to completion.

## 2026-10-01 evening — CURRENT ACT 2 HARDENING HANDOFF

Repo/branch remains `sebass80s/sysselcraft` → `nova/local-construction-snapshot`. Canonical local workspace remains `/Users/karoaa/Developer/sysselcraft`.

Recent runtime changes that must survive handover:
- `/act2` and `/act2-test` share `src/components/Act2Runtime.tsx`. Never recreate parallel debug story UI.
- Debug uses isolated, non-persisted Act 2 state while retaining the real saved child identity. The debug toolbar is a state-control surface only.
- Production Act 2 remains deliberately shipping-locked until physical acceptance.
- Lake water collision is map-derived from `lake-master` pixel sampling around the player's feet; the earlier guessed shoreline model was removed. Browser testing showed clear improvement, but full shoreline/obstacle acceptance remains open.
- Stugan “En stund till” is a repeatable completed-cabin revisit until Motorbåten completion. It must not auto-play after 16/16.
- Story UI invariant: **one card = one nameplate + one reply/narration unit + one click**. Never reduce click count by stacking speakers on a card.
- First anti-popcorn manuscript pass has been applied across Båthuset, Stugan, Bryggan and Motorbåten. Continue polishing through fewer, more concrete authored replies, not UI batching.
- The first-crossing scene belongs to Act 3. Act 2 finale ends before a true crossing.
- Latest full `npm run verify` after the final hardening batch has not yet been reported as passing. Treat verification as OPEN and fix the first real error if one appears.

Immediate browser QA should exercise Stugan/Bryggan/Båthuset/Motorbåten story rhythm, Cabin revisit behavior, water collision around the full beach/bay, purchase/naming gates and the Motorbåten→family finale transition. Physical iPhone acceptance remains the release gate.

## 2026-10-01 — Act 2 autonomous bug-raid checkpoint

The latest completed code verification checkpoint is GitHub Actions **#1461 SUCCESS** at `404be3fc40276257ff4d3b46fcb0386e55d9a2fb`.

The audit closed several forms of drift that a future Nova must not reintroduce:
- canonical visual-stage transitions happen at contributions 4/8/12;
- Act 2 finale is five beats and ends on the veranda; first crossing is Act 3;
- Motorbåten 6/16 is post-purchase copy and must not replay wallet/payment implementation text;
- editorial markers such as `Paus.` are not runtime story cards;
- Act 2 story-purchase behavior must be reproducible from checked-in Supabase migration SQL;
- Valpen follows Act 2 walkability/collision;
- working-branch Vercel Git deploy is paused; GitHub Actions is the routine verification surface.

Do not infer physical acceptance from CI. Browser/iPhone acceptance remains required for shoreline feel, navigation/camera, purchase return journeys, restart boundaries and the final Motorbåten/family sequence.
