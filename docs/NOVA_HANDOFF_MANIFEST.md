# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not restart solved work.

## READ FIRST — CURRENT STATE (2026-10-03)

Canonical repo: `sebass80s/sysselcraft`. Runtime Architecture 1.0 development branch: `nova/runtime-architecture-v1`. Frozen live source remains `nova/local-construction-snapshot`. Canonical local workspace: `/Users/karoaa/Developer/sysselcraft`. Repo reality wins: verify branch HEAD and CI before changing anything.

### Current product boundary
- Act 1 is feature-complete except concrete bug/regression work.
- Act 2 is authored through the six-beat closeout and the physical iPhone test save has reached and acknowledged **SLUT PÅ ANDRA KAPITLET**.
- Final chain: **Motorbåten 16/16 → Efter motorbåten → Någon är där → De kom → Min kompis → Det är bättre → Över sjön → SLUT PÅ ANDRA KAPITLET**.
- The canonical completed boundary is `act2Complete === true && endCardSeen === true`.
- Before that boundary, `selectedProject=null` is a valid lake state and Alve remains at `ACT2_ALVE_IDLE_POSITION`.
- After that boundary, Act 2 is closed: Alve is absent from the interactive lake world and cannot request more quests.
- The global gameplay HUD is owned by `src/game/uiShellState.ts`. Project selection, quest state and chapter completion must never implicitly remove global chrome.
- Completed Act 2 keeps `← Till byn` and exposes `Till kapitel 3 →`.
- `/act3` currently exists only as a read-only chapter boundary. It owns no Act 3 persistence or progression yet.

### Continuous cleanup rule — LOCKED

When new implementation replaces old implementation, cleanup is part of the same task, not a later maintenance pass.

Every Nova must, before declaring the change complete:
- delete superseded code paths, dead helpers, obsolete debug/test surfaces and unused CSS;
- update or remove tests that freeze the old implementation shape, while preserving behavioral regression coverage;
- remove stale flags, names, constants, values and comments that no longer describe repo reality;
- update canonical docs/handoffs so only one current truth is presented;
- search the repo for the superseded symbols/phrases/values after the change;
- run CI/verification on the **cleaned final state**, not on an intermediate version that still contains obsolete scaffolding.

Do not keep old code “just in case” once the replacement is proven and covered. Historical context belongs in Git history unless a specific compatibility/migration reason requires it in the current tree.

### Save safety
Preserve the existing physical iPhone save. It has already exercised real legacy-finale migration and is valuable regression evidence. Never reset/reinstall it merely to simplify testing. Adam's backend/save remains read-only for tests.

### Architecture direction
Do not create an Act 3 clone of Act 2. Story Engine and the shared UI-shell contract are established. The next foundation work is the shared World/Area Engine plus explicit versioned save migrations, following `docs/RUNTIME_ARCHITECTURE_ROADMAP.md`.

### Canonical current docs
Read these before implementation:
- `docs/NOVA_HANDOFF_MANIFEST.md`
- `docs/TECHNICAL_HANDOFF.md`
- `docs/PLAYABLE_ALPHA_READINESS.md`
- `docs/RUNTIME_ARCHITECTURE_ROADMAP.md`
- `docs/STATE_OWNERSHIP.md`
- `docs/STORY_DESIGN.md`
- `docs/STORY_UI_CONTRACT.md`

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
- Do not reveal the Act 3 destination after the family scene. Let the payoff land. Act 2 then owns the locked **Över sjön** epilogue: Barnet and Alve depart in the restored motorboat toward an undefined opposite shore, followed by **SLUT PÅ ANDRA KAPITLET**. Act 3 owns the destination and arrival, not the crossing itself.
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

The Act 2 opening five-image sequence is present and consumed by the shared production story path as well as `/act2-test`. The first Alve meeting uses the canonical meeting-alve progression (`bike` → `first-hello` → `a-lot-of-work` → `new-friend` → `alve-shows` → `new-friend` → `pick`) from `src/game/act2AlveStory.ts`. The family finale and locked **Över sjön** epilogue are integrated in production; current finale assets live under `public/assets/village/story-moments/act2/finale/`, including `05-after-motorboat.png` and `06-across-the-lake.png`.

Alve's departure-scene gratitude beat is now locked in `STORY_DESIGN.md`: he explicitly says the outcome would never have happened without Barnet, admits he was **“helt lost”** on the day Barnet found him, explains that he thought fixing enough things would make everything solve itself, thanks Barnet and says he is glad Barnet is his friend.

### Clinic bug fix checkpoint — 2026-09-30

A stale-local-save Clinic recovery bug was patched without mutating Adam's live backend data. `ChildBackendQuestInbox` now repairs local Sol/Clinic state from authoritative backend story flags and baseline before deriving Clinic contribution progress. Commits:
- `84ba5018dd3b2c608956dde41aaea1cad1f16314` — backend-authoritative Clinic recovery.
- `e02d77aa3334c946dc1da62bf2cdc0ce975ca4f9` — regression coverage.

Desired behavior: the next legitimate quest-claim refresh can wake the Clinic progression on a stale device save; later Clinic beats still reveal in authored order rather than jumping directly to completion.

## ACT 2 FINAL HANDOFF — 2026-10-03

Act 2 is now a closed chapter rather than an open construction sandbox after its end card is acknowledged.

### Runtime/state contract
- Production route: `/act2`, gated by the persisted Act 1 end-card acknowledgement.
- Shared renderer: `src/components/Act2Runtime.tsx`.
- Lake runtime: `src/game/createAct2LakeGame.ts`.
- Story/presentation state is child-scoped and local; backend quests, rewards, wallet and authoritative work evidence remain backend-owned.
- Legacy five-beat completed saves that predate **Över sjön** resume the new epilogue exactly once via the finale schema migration, without replaying the earlier family/veranda beats.
- Current-schema completion does not replay.
- Persisted completion boundary: `act2Complete && endCardSeen`.

### Presentation contract
- Global HUD visibility comes only from `deriveGameUiShell`.
- Story/chapter overlays explicitly suppress global chrome.
- Project status is optional detail and never the owner of HUD visibility.
- Alve presence is explicit: visible during active Act 2 including valid no-project idle state, absent after the persisted chapter-close boundary.
- Completed lake state keeps navigation to the village and exposes the Chapter 3 transition.

### Chapter 3 boundary
`/act3` currently renders only **KAPITEL 3 · På andra sidan sjön** as a read-only boundary. Future Act 3 code must own its own entry/intro persistence and must not clear, mutate or replay Act 2.

Act 3's locked story direction and Nova's emotional arc live in `docs/STORY_DESIGN.md`. Do not improvise a replacement from old handoff prose.

### Test policy
- `test:ui-shell` owns the pure global UI-shell lifecycle matrix.
- `test:act2-alve` owns real lake Alve presence/interaction behavior.
- `test:act2-closeout` owns finale migration, save/restart and chapter-close behavior.
- `test:act2-full-flow` owns the complete 64-contribution authored journey.
- Act-specific tests should prefer behavior/state contracts over regexes that freeze incidental source-code shape.

Do not resurrect superseded five-beat-final, shipping-lock or “physical acceptance still open” instructions from Git history.


## PRE-ACT-3 ARCHITECTURE GATE — LOCKED 2026-10-03

Do **not** start substantial Act 3 runtime implementation by cloning `Act2Runtime`, story history, HUD, markers or interaction logic.

First implement the shared-runtime rules in `docs/RUNTIME_ARCHITECTURE_ROADMAP.md`:
- one Game UI Shell across the game;
- one Story Engine + Story Registry;
- one read-only Story History system driven by registry metadata and completion policy;
- one Interaction System for NPC/quest markers, approach points and input priority;
- shared progression/gating over authoritative Quest V2 evidence;
- chapter runtime primarily as data/configuration.

Important current debt: Act 2 Historik works and is regression-protected, but its catalog is assembled directly from `ACT2_*` modules inside `Act2Runtime.tsx`. This must be generalized before Act 3 so new beats automatically inherit rendering/replay/history semantics rather than requiring another Act-specific implementation.

Architecture success criterion: adding a normal Act 3 beat should require authored data/state configuration, not new code for dialogue UI, history replay, overlay suppression or beat-consumption semantics.


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



## FUTURE NOVA: THESE ARE RULES, NOT GUIDELINES

Before writing new gameplay code, read `docs/RUNTIME_ARCHITECTURE_ROADMAP.md`, especially **Runtime Architecture 1.0 master contract**.

Do not:
- create an Act-specific HUD;
- create another quest-marker asset/component;
- create another dialogue/story shell;
- create Act-specific History/replay;
- clone interaction/input logic;
- invent another progression-consumption model;
- solve a shared-system problem locally inside one Act.

First ask: **does this concept already exist in the engine?**
If yes, configure/reuse it.
If no, add it once to the shared engine so all chapters inherit it.

Act 3 is the first consumer of Runtime Architecture 1.0, not an excuse to create Runtime Architecture 2.0 accidentally.


## IMPROVEMENT DUTY

If you spot a material improvement to architecture, UX, reliability, maintainability or testing, surface it immediately. Do not wait for Kalle to ask and do not bury it in a later handoff.

Respect the live freeze: propose or implement improvements on the development branch unless an explicit live hotfix is requested.


## CANONICAL SYSTEM REGISTRY RULE

Before adding any reusable UI/marker/interaction asset or component, check the central System Registry/shared engine layer.

If the concept already exists, reuse it.
Do not hardcode a new Act-specific asset path or local implementation for the same concept.

Quest marker means the canonical quest marker. Dialogue card means the canonical dialogue card. Global HUD means the canonical Game UI Shell.

Arch 1.0 should add automated/static guards where practical so duplicate system concepts are caught early.


## RUNTIME 1.0 BUILD METHOD — RULE

Do not refactor the legacy client piecemeal into the new architecture.

Build a clean canonical Runtime 1.0 in parallel on `nova/runtime-architecture-v1`, reusing the proven backend, economy, story content, assets and accepted progression rules.

Port Act 2 first, then Village/Act 1.

A **parity harness is mandatory** and must compare representative legacy save/state fixtures against Runtime 1.0 product behavior. Legacy client runtime is removed only after automated parity, browser acceptance and physical iPhone acceptance are all proven.

The frozen live runtime is the behavioral oracle until migration acceptance.


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


## Runtime 1.0 checkpoint — shared interaction resolution begins (2026-10-03)

On `nova/runtime-architecture-v1`, Act 2 Lake's Alve turn-in is the first migrated Interaction System behavior consumer.

Shared engine now decides `disabled | activate | approach` through `resolveInteraction()`. The Lake supplies the accepted Alve anchor/radius/approach configuration and retains movement/facing/callback execution for this slice.

Parity coverage exists for activate, approach and disabled outcomes.

Do not interpret this as Interaction System completion. Continue in short vertical slices, then converge shared world-input authority. Do not start Act 3.


## Runtime 1.0 checkpoint — Village joins shared interaction resolution

Second short interaction slice completed on `nova/runtime-architecture-v1`.

Village noticeboard now consumes shared `resolveInteraction()` and has one authored definition for its approach point/radius. Accepted 36 px arrival behavior is parity-covered, including the 37 px outside-boundary case.

Shared resolution is therefore proven in both Lake and Village, but the Interaction System is still incomplete. Remaining local interactions and world-input authority must continue in short parity-backed slices. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — Recycling joins shared resolution

Third short Interaction System behavior slice completed.

Village Recycling now delegates disabled / activate / approach resolution to shared `resolveInteraction()`, preserving its stage-4 gate, authored approach point and 40 px arrival radius. Parity covers the 40/41 px boundary.

Current shared-resolution consumers: Act 2 Alve turn-in, Village noticeboard, Village Recycling.

Continue in short slices. Vercel is currently rate-limited and should not be treated as verification evidence. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — bottle message migrated

Village bottle-message interaction now uses shared `resolveInteraction()`, preserving its x835/y500 approach point, 38 px radius and availability gate. Parity covers the 38/39 px boundary.

Shared-resolution consumers now total four: Act 2 Alve turn-in, Village noticeboard, Village Recycling and Village bottle message.

No Vercel evidence is required during the current rate-limit period. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — construction attention migrated

Village construction attention now consumes shared `resolveInteraction()`, preserving its authored approach point, 32 px arrival radius and original attention id callback. Parity covers the 32/33 px boundary.

Five concrete interaction consumers now use shared resolution across Lake and Village.

Next recommended architectural slice: audit and converge world-input authority/overlay suppression before touching mixed-priority NPC interactions. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — shared world-input authority established

The Interaction System now owns a real cross-world world-input decision through `worldInputEnabled()`.

Village exposes `setWorldInputEnabled`, its presentation lock drives the explicit flag, and both pointer + movement update obey shared authority. Legacy construction-dialogue overlay state is still retained temporarily as compatibility.

Act 2 Lake now uses the same shared authority for pointer interactions and movement. A real bug was fixed: keyboard movement previously could continue while world input was disabled.

Parity covers enabled/disabled/overlay truth-table behavior and source consumption.

Next recommended slice: map remaining Village overlays/modals into explicit world-input ownership, then remove the legacy compatibility lock only after parity. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — Village input-lock compatibility layer removed

Village world-input convergence has moved from dual-system compatibility to one explicit authority.

Current flow:
presentation overlays → `villageBlockingOverlayVisible` → `setWorldInputEnabled` → shared `worldInputEnabled`.

Removed from Village:
- `constructionDialogueOpen`;
- `setConstructionDialogueOpen`;
- all manual per-dialogue toggle calls.

All object pointer handlers are gated by one `acceptsWorldInput()`.

Parity prevents the retired lock from returning.

Next Interaction work can return to shared resolution/pointer priority, with Linus still the most complex mixed quest/story case. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — Linus base priority centralized

The first mixed-priority NPC slice is complete.

Shared generic helper:
`src/runtime/interaction/interactionPriority.ts`

Village now resolves Linus base intent through one ordered rule:
construction attention > intro > backend quest > ordinary resident.

Three base pointer entrypoints use that rule. Marker-specific clicks and existing immediate-vs-approach differences remain intentionally untouched until separately parity-covered.

Next recommended Interaction slice: inspect marker-specific Linus priority / pointer arbitration, or move to another mixed NPC only if it provides a cleaner proof. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — Linus marker arbitration centralized

Linus marker UI now follows the same winning intent as interaction priority.

One `syncLinusPriorityMarkers()` owns story/quest markers and suppresses them when construction attention wins. It also resyncs after construction-driven resident movement and immediately after Linus sprite creation.

This removes duplicate/conflicting Linus markers and stale marker positioning.

Parity guards the single creation paths and initialization/resync behavior.

Next recommended Interaction slice: inspect generic pointer hit-target arbitration across overlapping world objects, or apply the priority pattern to Henning if that offers a safer incremental proof. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — Henning priority reuse complete

The generic priority resolver is now used by both Linus and Henning.

Henning base priority:
construction attention > backend bakery quest > resident.

Scene and sprite entrypoints share one decision. Backend quest marker creation is centralized and suppressed when construction attention wins.

Sol-tour marker remains intentionally outside this arbitration until a dedicated story-CTA slice.

Next recommended work: audit explicit story CTA markers (starting with Sol tour) against NPC/quest priority, or begin generic pointer hit-target arbitration if the CTA rules are first documented. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — Sol-tour CTA arbitration complete for mixed NPCs

Sol-tour is now an explicit `story-cta` priority candidate for Linus and Henning.

Linus:
construction > intro > story CTA > quest > resident.

Henning:
construction > story CTA > quest > resident.

One `syncSolTourMarker()` owns CTA marker presentation. CTA suppresses lower quest markers; construction suppresses CTA. Arrival routing re-checks the current winner so backend quest state cannot steal a Sol-tour interaction.

Parity guards priority matrices, CTA marker visibility rules and arrival callback routing.

Next recommended Interaction slice: generic pointer hit-target arbitration across overlapping scene/object handlers. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — Village scene pointer arbitration explicit

The scene fallback pointer handler now selects overlapping targets with shared `resolveInteractionPriority()` instead of implicit branch order.

Priority is locked as:
Recycling > Linus > Shop > Henning > Ground.

Parity covers overlap and fallback cases and source guards preserve the numeric priorities.

Object-level pointer handlers remain intentionally for native reliability. Do not consolidate them away without browser + physical iPhone parity.

Next recommended Interaction step: assess whether the current shared Interaction System is sufficient for a checkpoint build/parity run before attempting deeper cross-entrypoint de-duplication. No Act 3 and no production promotion.


## Runtime 1.0 checkpoint — Henning shared arrival + CI enabled

Henning ordinary resident arrival now uses the shared Interaction resolver:
- approach `370,468`;
- radius 95 px;
- parity: 95 activates / 96 approaches.

The Runtime Architecture branch has been added to `.github/workflows/ci.yml` push triggers. Each future commit should therefore run GitHub CI (`npm run verify`) automatically.

Interaction System is now in late convergence. Main remaining special cases:
- Linus dual arrival geometry;
- Shop/Mira multi-approach behavior;
- Sol resident interaction;
- later cross-entrypoint de-duplication after physical acceptance.

No Act 3 and no production promotion.


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


## World / Area Engine checkpoint 1 — movement intent + camera

The first shared World / Area Engine primitives are now active.

### Shared movement intent
New canonical primitive:
- `src/runtime/world/movement.ts`
- `resolveDirectMovementIntent()`
- `directionalInputVector()`

Act 2 Lake now delegates generic input-to-direction behavior to this primitive while retaining area-owned collision, world bounds, animation/facing and dog follow.

Accepted Lake behavior preserved and parity-locked:
- keyboard input overrides/clears an existing tap target;
- diagonal keyboard input normalizes;
- idle keyboard follows the current tap target;
- tap target clears only when distance is strictly less than 8 px;
- exactly 8 px still produces movement.

### Shared camera contract
Canonical camera values now live in:
- `src/runtime/world/worldCamera.ts`

The contract owns:
- background color;
- follow lerp X/Y;
- deadzone width ratio;
- deadzone maximum width;
- deadzone height.

Both Lake and Village consume the shared camera contract. Parity locks:
- 667px view width => 32% deadzone width;
- wide view => 340px deadzone cap;
- accepted follow lerp remains 0.08 / 0.08;
- deadzone height remains 180.

### Verification
GitHub Actions #1773: `npm run verify` SUCCESS.

This is intentionally a primitive extraction, not a mega-world rewrite. Area-specific collision, authored world bounds, entity placement and navigation remain local until separately migrated with parity.


## Runtime 1.0 World / Area checkpoint — shared dynamic depth ordering

Dynamic Y-based entity depth is now a canonical World / Area primitive:

- implementation: `src/runtime/world/worldDepth.ts`;
- canonical base depth: `1000`;
- canonical behavior: `1000 + Math.round(y)`.

Current consumers:
- Act 2 Lake player;
- Act 2 Lake dog;
- Act 2 Lake Alve placement;
- Village player;
- Village dog;
- Village world-image base depth;
- Village construction truck movement;
- Village nearest-walkable player repair.

Authored static/special depths were intentionally left local. This migration only replaced existing `1000 + Math.round(...)` behavior and does not reinterpret authored z-order.

Regression coverage:
- parity locks integer and half-pixel rounding behavior;
- visual audit now verifies the canonical shared depth contract instead of requiring inline depth arithmetic;
- Act 2 Alve harness explicitly loads the shared depth primitive.

GitHub Actions #1783: `npm run verify` SUCCESS.

### World / Area Engine status

Runtime 1.0 now has three real, consumed World / Area primitives:
1. direct movement intent, currently consumed by Lake;
2. shared camera contract, consumed by Lake + Village;
3. dynamic depth ordering, consumed by Lake + Village.

Next high-risk work is collision/pathfinding and deeper movement-runtime convergence. Do not migrate that blindly: navigation/input changes still require browser and physical iPhone acceptance. Keep authored world bounds, collision geometry and pathfinding local until that acceptance gate is available.


## Shared world depth audit closeout — 2026-10-03

The requested baseline `fb5f2f76af722d193efa5dbc88d25e711189e044` was already superseded by `cfdc3a53a0bf6631a2d19b47ba5ea413ca942a3a` (ten commits ahead, CI run 37147229335 successful). The existing slice migrated Lake before Village and extracted `worldEntityDepth(y) = 1000 + Math.round(y)`. Its parity commit followed the migrations; this historical ordering does not satisfy parity-first and must not be repeated.

Audit of both area runtimes confirms depth is the smallest identical contract. Bounds/collision remain different (Lake shoreline pixel sampling and foot radii versus Village obstacle geometry and A*). Dog-follow also differs (Lake delta-based interpolation with collision versus Village fixed interpolation and facing offsets). No movement, navigation or input behavior was changed.

A source sweep found two remaining copies of the depth formula in `worldDecor.ts` and `visualProductionRuntime.ts`. Both now consume the canonical primitive. Behavioral parity was added and passed against the old renderers before these two migrations, then passed again afterwards. It executes the real renderers across fractional, exact half-pixel, zero and negative Y values and all four production building stages. The standalone Gate 0 harness now resolves the shared dependency in its temporary module tree.

Authored special/static depth overrides remain unchanged. No Act 3, production deployment, Adam data, native project or iPhone/WebView fallback was touched. This closes the depth slice; it does not authorize collision/pathfinding convergence.

Validation: `npm run verify` passed on the completed slice, including Runtime 1.0 parity. `node scripts/audit-v4-gate0.mjs` passed (12 building stages, 240 directed paths across eight visibility combinations). Its stale image mock was extended to preserve and assert the existing Clinic crop. A source sweep found no remaining inline `1000 + Math.round(...)` implementation under `src`. Physical iPhone acceptance was not rerun for this pure arithmetic extraction.


## Save / Migration Engine checkpoint 1 — sequential migrations

Runtime 1.0 now has a canonical pure migration primitive in `src/runtime/save/migrations.ts`.

`runSequentialMigrations()`:
- applies only explicit N -> N+1 steps;
- is idempotent when already at the target version;
- fails closed when a required migration step is missing;
- contains no storage/backend behavior.

Act 2 is the first real consumer. The existing finale compatibility migration from pre-schema saves to `finaleSchemaVersion: 2` now runs through the shared migration engine before normal invariant repair. Persisted format and accepted legacy behavior are unchanged.

The old inline `preEpilogueSchemaComplete` migration branch has been retired. Existing Act 2 runtime, full-flow, closeout and Alve harnesses now load the shared migration dependency explicitly.

Verification: GitHub Actions #1799, full `npm run verify`, SUCCESS on commit `be24bcebdd434ced23ea35ce06774bcb64e47b46`.

Next safe Save/Migration work should move additional compatibility repairs behind explicit versioned steps. Backend-owned quests, rewards, wallet values and authoritative progression must never be fabricated by migrations.


## Save / Migration Engine checkpoint 2 — Act 1 Clinic/finale compatibility

Act 1 now consumes the shared Save / Migration Engine for its legacy chapter-finale compatibility repair.

Historical behavior preserved:
- old saves may have `worldFlags.clinicCompletionSeen === true`;
- those saves can predate `act1ChapterFinaleSeen`, `act1ChapterFinaleIndex` and `act1EndCardSeen`;
- those players must regain Act 2/lake access without replaying the newly introduced Act 1 chapter ending.

The repair now runs explicitly through `runSequentialMigrations()` in `src/game/saveState.ts`. Saves with existing Act 1 chapter-finale state are already current for this compatibility step. Legacy Clinic-complete saves without chapter-finale state migrate to `act1ChapterFinaleSeen: true` and `act1EndCardSeen: true`. Incomplete Clinic/finale states are not fabricated or skipped.

The previous implicit legacy acknowledgement branch was retired. `scripts/test-sol-story.mjs` now guards the migration-engine behavior rather than the removed implementation shape.

Verification:
- CI #1801 exposed the stale source-shape harness;
- the harness was updated to canonical migration ownership;
- CI #1802: full `npm run verify` SUCCESS on `6f6a60a25476d3b3b7e5ed0e2e89d5c235460a5c`.

No backend-owned state, rewards, wallet values, quest progression or authoritative story flags are fabricated by this migration.


## Save / Migration Engine checkpoint 3 — Act 2 finale schema 3

Act 2 finale compatibility now has an explicit sequential schema chain:

`1 -> 2 -> 3`

Schema 3 moves the remaining `legacyFamilyComplete` compatibility repair out of `normalizeAct2RuntimeState()` and into the shared Save / Migration Engine.

Behavior is parity-locked for both schema-2 cases:
- family finale consumed, epilogue not consumed => resume once at epilogue index 5;
- epilogue and chapter genuinely complete => remain complete, preserve `endCardSeen`, and never resurrect the finale.

Pre-schema saves still pass through the existing 1 -> 2 recovery before 2 -> 3. The canonical normalizer now handles invariants after versioned compatibility work rather than owning this legacy migration branch.

Verification:
- parity committed before migration;
- GitHub Actions #1806: full `npm run verify` SUCCESS on `0884fb5359f5b48a46cb9af57f2615908bb8849f`.

No production/live, backend-owned progression, Adam data, Act 3, navigation, collision, iPhone/WebView behavior, story content or economy was changed.


## Current Runtime 1.0 verified checkpoint — 2026-10-04

Branch: `nova/runtime-architecture-v1`.

Verified documented HEAD before this documentation sync: `2de79498f9537d356a444656df9d408cfb135cac`.

GitHub Actions #1807 ran full `npm run verify` successfully on that HEAD.

Save / Migration Engine status:
- canonical sequential migration runner exists;
- Act 1 Clinic/finale compatibility is explicit;
- Act 2 finale compatibility is explicit through `1 -> 2 -> 3`;
- `preEpilogueSchemaComplete` and `legacyFamilyComplete` are no longer normalizer-owned compatibility branches;
- normalizers now handle canonical invariants after versioned compatibility migration.

Safety boundaries remain unchanged: no production/live promotion, no Adam-data mutation, no backend-owned progression fabrication, no Act 3 feature work, and no iPhone/WebView-sensitive navigation/collision/movement convergence without physical acceptance.


## Save / Migration Engine checkpoint 4 — explicit construction compatibility + sweep closeout

The remaining pure local construction compatibility adapter is now an explicit pre-normalization migration.

Implementation:
- parity commit: `d532dbfc7bcca70c6869240757578fb62e0d8dfd` (`test: lock legacy construction save parity`);
- implementation commit: `99df1984a2bc088f5715d8f6ef5b112bff8316c7` (`refactor: migrate legacy construction before normalization`);
- `saveState.ts` now migrates legacy construction shape through `runSequentialMigrations()`;
- `normalizeConstruction()` no longer accepts or owns `legacyVisible`;
- the saved envelope remains `version: 1`;
- deterministic current-state reconstruction such as `construction.pending` remains normalizer-owned.

Parity was locked before implementation across 330 combinations of construction shapes, stage values and progression totals, plus independent Act 1 finale markers. Input immutability and normalized-save idempotence are covered.

The broad compatibility sweep is documented in `docs/SAVE_COMPATIBILITY_AUDIT.md`. It found no additional implicit, pure, ownership-locked legacy compatibility repair that should be moved into Save/Migration Engine now.

Important classification boundaries:
- invariant repair stays in normalizers;
- current-domain progression rules stay in domain/progression owners;
- malformed/current input filtering stays validation;
- localStorage/Preferences and unscoped/scoped key moves stay storage migration;
- wallet, quest, purchased flags and claim-baseline recovery stay backend-owned;
- no migration may fabricate backend-owned state.

Verification:
- Runtime branch was fast-forwarded cleanly to Codex work, no merge commit;
- GitHub Actions #1812: full `npm run verify` SUCCESS on exact code HEAD `99df1984a2bc088f5715d8f6ef5b112bff8316c7`.

### Consequence for next Runtime 1.0 work

Do not spend another broad pass trying to manufacture more Save/Migration slices. The safe pure candidates identified by the repo-wide sweep are now exhausted.

Return to the Runtime Architecture roadmap. The next meaningful work is remaining runtime convergence / legacy cleanup, with collision, pathfinding, movement feel, dog-follow and WebView/touch behavior still gated by browser + physical iPhone acceptance. Prefer a small parity-first slice over a broad rewrite.


## Runtime 1.0 progression/gating update — 2026-10-04

Current development branch remains `nova/runtime-architecture-v1`.

Verified code checkpoint before this documentation sync:
- `d4c4cb8c9ee515d1398910527eaa854c9def3ac3`;
- GitHub Actions #1828: full `npm run verify` SUCCESS.

New canonical pure primitives:
- `authoritativeProgressDelta()` for backend-monotonic-count minus local baseline arithmetic;
- `progressGateRequired()` for threshold-to-completion unresolved gate windows.

Act 2 now uses one state-layer story-gate arbitration for contribution blocking and Alve turn-in visibility. The React UI no longer separately decides purchase-vs-naming blockers.

Do not mark the full purchase-gate system complete yet. Lake presentation and Mira-shop presentation are still separate consumers, while purchase execution/wallet authority correctly remain backend-owned.

Recommended next slice: audit the Lake → Village shop purchase-gate handoff and extract only a parity-proven presentation contract if one exists. Collision/pathfinding/movement feel/dog follow remain physically acceptance-gated and should not be touched during this progression pass.


## Runtime 1.0 purchase handoff update — 2026-10-04

Verified code checkpoint before this documentation sync:
- `a6747b0df95edd7f9782086063b0341fd30abf9e`;
- GitHub Actions #1833: full `npm run verify` SUCCESS.

Act 2 Lake and Village no longer independently encode the purchase navigation protocol. `src/game/act2PurchaseHandoff.ts` owns:
- valid purchase projects;
- shop-context URL generation;
- resume URL generation;
- parsing/rejection of invalid project values.

This is chapter configuration, not a new generic engine abstraction.

Two intermediate CI failures (#1831/#1832) were stale tests that asserted literal inline URL implementation. Build and earlier regressions passed; the source-shape tests were updated after a full sweep. Final #1833 is green.

Next safe Progression/Gating candidate: audit duplicated Act 2 purchase presentation/config (item label, detail copy, displayed price) between Lake and Mira shop. Keep Supabase purchase execution, wallet authority and authoritative world flags in backend Story Shop. Do not touch collision/pathfinding or physical-input-sensitive World work during this pass.


## Runtime 1.0 purchase presentation closeout — 2026-10-04

Verified code checkpoint before this documentation sync:
- `0ab28298141e7e9c3b37074b8fab7e0a074e78b6`;
- GitHub Actions #1839: full `npm run verify` SUCCESS.

Act 2 purchase gating is now canonical across four layers:
1. shared threshold-window arithmetic;
2. canonical state-layer story-gate arbitration;
3. canonical Lake ↔ Mira route handoff;
4. canonical pure purchase presentation catalog.

`src/game/act2PurchaseCatalog.ts` owns client-facing price/copy/card metadata. Lake and Mira consume it directly. The three old Story Shop price exports remain only as compatibility aliases and derive from the catalog.

Do not move Supabase purchase execution, wallet mutation or authoritative owned flags into Runtime 1.0. That separation is intentional and complete.

The Runtime System Registry now marks `purchaseGate` canonical. Do not reopen this slice merely to generalize it for hypothetical chapters. A new generic abstraction needs a second real consumer.

Intermediate CI #1836-#1838 failures were stale source-shape tests following ownership movement; build and type checking were green. #1839 is the verified code checkpoint.

Collision/pathfinding, movement feel, dog follow and WebView/touch fallback remain physical-acceptance-gated and untouched.


## Runtime 1.0 Interaction closeout — 2026-10-04

Verified parity checkpoint before registry closeout:
- `37fb093e745d1df26fa377a79fa9963ad646f079`;
- GitHub Actions #1841: full `npm run verify` SUCCESS.

The shared Interaction contract is now considered canonical:
- Village + Act 2 Lake both consume `resolveInteraction()`;
- both consume `worldInputEnabled()`;
- both consume the shared marker renderer;
- Village mixed interaction arbitration consumes `resolveInteractionPriority()`;
- approach points, activation radius and optional multi-zone activation are shared semantics.

`interactable` is therefore no longer `migration-pending` in the Canonical System Registry.

Important safety boundary: local Phaser pointer/touch handlers remain intentionally area-specific adapters. They are not permission to rewrite/deduplicate iPhone/WebView fallbacks. Pointer propagation, hit areas, scene/sprite fallback entrypoints, Village A*, Lake direct movement and interaction movement feel remain physical-acceptance-gated.

No product gameplay behavior, navigation, collision, backend state, Adam data or live branch was changed by this closeout.

Recommended next Runtime slice: audit remaining World / Area ownership and legacy-runtime duplication for a pure/shared candidate. Prefer camera/depth/config/state contracts over collision/pathfinding/touch changes.


## Runtime 1.0 World viewport checkpoint — 2026-10-04

Verified code checkpoint before this documentation sync:
- `a831d13568d8a8be7dda15ddffddb897a2d4554f`;
- GitHub Actions #1846: full `npm run verify` SUCCESS.

New canonical pure World primitive:
- `src/runtime/world/worldViewport.ts`;
- fixed accepted viewport height 640;
- accepted minimum width 960;
- shared parent-aspect sizing with area-owned maximum world width.

Village and Act 2 Lake both consume it. Their Phaser config background now also uses `WORLD_CAMERA.backgroundColor` rather than duplicating the same literal.

Parity was green before implementation in #1844. #1843 was an incorrect test fixture, not product drift. Implementation #1845 reached a stale custom Lake loader; the loader was updated and final #1846 is green.

No collision, pathfinding, player movement, dog follow, pointer/touch behavior, WebView fallback, backend state, live branch or parent UI was changed.

World / Area safe-pure cleanup is now close to its natural boundary. Do not force Village and Lake movement/collision into one implementation. The remaining behavioral convergence requires browser + physical iPhone acceptance.


## Handover checkpoint — Runtime 1.0 / 2026-10-04 evening

**Active branch:** `nova/runtime-architecture-v1`

**Verified code HEAD before documentation closeout:**
- `737602ec1c86f550feeefbf6e99c8a2501f6d8d7`
- `test: retire Act 2 price alias contract`
- GitHub Actions **#1906**: SUCCESS, full `npm run verify`.

After that verified code checkpoint, documentation-only handover commits may advance branch HEAD. Always re-check repo reality before editing.

### What was completed in this work session

#### Act 1 Story Engine convergence
Standard fullscreen Act 1 story presentation now uses the shared Story Engine for:
- Henning arrival + replay;
- Mira arrival + replay;
- Sol tour;
- Bakery completion + replay;
- Clinic completion + replay;
- Act 1 chapter-finale dialogue;
- Linus first meeting + replay presentation shell;
- bottle-message presentation;
- earlier bottle-letter / Sol-arrival Story Engine consumers remain canonical.

Linus naming/reveal logic was **not** moved into a generic state machine. Child-name input, dog-name input, reveal state, save/progression callbacks and replay state remain locally owned while Story Engine owns the visual shell.

#### Canonical story speaker tones
`storySpeakerTone()` is the shared mapping for standard Story Engine consumers.

Migrated consumers include Henning, Mira, Bakery, Clinic, Act 1 finale, Sol tour, Sol arrival and bottle-message presentation.

**Do not automatically convert Linus intro line steps.** Their accepted legacy presentation uses `default` for Linus; canonical `storySpeakerTone("Linus")` would produce `linus` and therefore change visuals.

#### Inline dialogue convergence
New shared primitive:
- `src/components/story/InlineDialogueCard.tsx`

Migrated consumers:
- recycling conversation;
- Henning ordinary conversation;
- abandoned-shop conversation;
- construction-site conversation;
- Recycling completion conversation.

The only raw compact `dialogue-card` intentionally remaining in Village is the non-fullscreen Linus naming/input path. It is an acceptance-sensitive interactive special surface because of autofocus, Enter handling, mobile keyboard, validation and dog-name reveal behavior.

Do not mechanically migrate it during ordinary cleanup.

#### Act 2 purchase cleanup
Canonical client purchase ownership remains:
- `src/game/act2PurchaseCatalog.ts`;
- `src/game/act2PurchaseHandoff.ts`;
- `progressGateRequired()`;
- canonical Act 2 blocker arbitration.

The obsolete `storyShop.ts` Act 2 display-price compatibility aliases were removed after verifying they no longer had real consumers.

Alias cleanup:
- `ee8973f7574d5a6a49ceb517b7c9cfa42a3c9f11`: remove retired aliases;
- `737602ec1c86f550feeefbf6e99c8a2501f6d8d7`: retire stale alias test/contract;
- CI #1906 SUCCESS.

Backend Story Shop / Supabase remain authoritative for purchase execution, wallet debit and ownership flags.

### Act 3 art note
A parked Act 3 art-production decision was documented during this session: use a separate parallel art agent/workflow driven by a prepared beat manifest + canonical reference package so image production can run while runtime coding continues.

Likely evaluation path:
- Runway workflow/API as primary candidate;
- OpenArt as alternate;
- prove the pipeline first on ~3 accepted Act 2 scenes.

This is **not authorization to begin Act 3 runtime work**.

### Next recommended Runtime 1.0 step
Continue low-risk legacy cleanup, one parity-first slice at a time.

Start by:
1. verifying latest branch HEAD and CI;
2. searching for remaining superseded compatibility aliases, duplicate safe presentation/config ownership or stale source-shape tests;
3. choosing one real duplicate with at least two consumers or one clearly retired compatibility shim;
4. locking parity first;
5. migrating/removing;
6. stopping at green CI.

Avoid:
- collision/pathfinding convergence;
- dog-follow convergence;
- pointer/touch/WebView handler deduplication;
- Linus naming DOM changes;
- generic purchase-engine invention;
- new Save/Migration work without a real legacy repair;
- production deploy;
- Adam data mutation.

These high-risk/input-sensitive areas require browser + physical iPhone acceptance.

### Session safety
- no production deployment;
- no live/release branch changes;
- no Adam backend/save mutation;
- no Act 3 feature implementation.

### Purchase architecture rule for future Act 3

The Act 2 purchase flow is consolidated but still Act 2-specific. That is intentional for now.

**Hard rule for future Act 3 work:** the first real Act 3 story purchase must trigger extraction of the proven Act 2 purchase pattern into a generic SysselCraft purchase-flow system. Do not copy the current files into new `act3Purchase...` variants.

The generic system must preserve these semantics:
- backend Story Shop / Supabase owns debit + ownership flags;
- successful purchase may resume the blocked story/project;
- insufficient funds or failed purchase must leave the player free to remain in the world and earn currency;
- a required purchase must never trap the child in a forced shop/story navigation loop.

The recent livboj bug is the concrete reason this invariant is now explicit: the shop previously returned to Act 2 even when the required item was not owned, which re-opened the same purchase gate indefinitely.

## Verified checkpoint: Chapter Lifecycle slice

Verified code HEAD: `e5198656c212e23c166b51a116538e52c0ed215e`

GitHub Actions: **#1973 SUCCESS** on that exact SHA.

Implemented:

- new shared primitive: `src/runtime/chapter/chapterLifecycle.ts`;
- `chapterUnlocked()` now owns predecessor-end-card unlock semantics;
- `chapterAtStart()` owns fresh chapter-entry detection;
- `chapterEndCardPending()` owns complete-but-unacknowledged end-card semantics;
- `chapterCardVisible()` owns chapter intro/end-card presentation visibility;
- Village consumes shared unlock semantics for the path to Act 2;
- Act 2 consumes shared unlock, fresh-entry and chapter-card semantics;
- `scripts/test-chapter-lifecycle.mjs` locks the engine contract and current consumers;
- stale source-shape assertions in Act 1/Act 2 regression tests were updated to assert the shared engine contract rather than the retired inline boolean expression.

No persisted save shape changed.
No backend authority changed.
No collision, movement, dog-follow, pointer/touch or WebView behavior changed.

## Verified checkpoint: Chapter Registry + Navigation slice

Verified code HEAD: `1c65a04440de5631f53e1a58767060ece9b7b8a0`

GitHub Actions: **#1984 SUCCESS** on that exact SHA.

Implemented:

- new canonical registry: `src/runtime/chapter/chapterRegistry.ts`;
- current registered chapters are `act1` and `act2`;
- the registry owns current route, predecessor and next-chapter relationships;
- Village -> Act 2 navigation consumes `chapterRoute("act2")`;
- Act 2 resume cleanup consumes the registered Act 2 route;
- Act 2 shop handoff/resume derives Village/Act 2 base routes from the registry;
- `scripts/test-chapter-registry.mjs` verifies registry topology and current consumers;
- runtime parity harness now injects the registry dependency when testing purchase handoff.

The registry contains no speculative Act 3 entry. Act 3 must only be registered when a real route/chapter exists.

## Verified checkpoint: Shared Story Purchase Flow slice

Verified code HEAD: `6a162a7e51c10d317517b32b3b8b864071a4d94e`

GitHub Actions: **#1993 SUCCESS** on that exact SHA.

Implemented:

- new shared runtime primitive: `src/runtime/purchase/storyPurchaseFlow.ts`;
- `purchaseShortfall()` owns normalized price-vs-balance shortfall calculation;
- `resolveStoryPurchaseExit()` owns the global required-purchase exit invariant;
- an unowned/failed required purchase resolves to `stay`, never forced story resume;
- an owned required purchase resolves to `resume` with its caller-owned target;
- Village/Act 2 now consumes these semantics when closing Mira's contextual story shop;
- `scripts/test-story-purchase-flow.mjs` locks the insufficient-funds loop invariant;
- existing Act 2 regression contracts now assert shared purchase-flow usage rather than the retired local `if (purchaseOwned)` implementation.

Backend Story Shop / Supabase remains authoritative for purchase execution, wallet debit and ownership flags. The runtime flow only decides presentation/navigation after authoritative ownership state is known.

## Verified checkpoint: Configurable Progress Track slice

Verified code HEAD: `337be0a5eb3239fda114fbd26efe5bf7d92a65b4`

GitHub Actions: **#2007 SUCCESS** on that exact SHA.

Implemented and verified:

- new shared progression primitive: `src/runtime/progression/progressTrack.ts`;
- target contribution count is configuration, not an Act 2 engine constant;
- visual-stage thresholds are configuration, not globally hard-coded;
- canonical contribution beat IDs are derived through the shared track definition;
- `normalizeProgressTrack()` owns generic contribution-count / stage / completion normalization;
- `nextProgressTrackStep()` owns generic next-step derivation;
- Act 2 now consumes the shared progress-track primitive from `act2RuntimeState.ts`;
- Act 2 retains its authored configuration: 16 contributions, four visible stages, project names and project ordering;
- `scripts/test-progress-track.mjs` proves parity for all 0..16 Act 2 contribution counts;
- all manual Act 2 state test harnesses now load the real shared progress-track dependency.

The extraction did not change persisted Act 2 save shape, backend progression authority, story gates, collision, movement, dog-follow, pointer/touch or WebView behavior.

This closes the generic contribution-count / stage-normalization part of Runtime 1.1 Progression / Project Engine. Selection policy, chapter-specific project prerequisites and authored completion reactions remain chapter configuration/domain behavior unless a further proven common primitive is identified.

