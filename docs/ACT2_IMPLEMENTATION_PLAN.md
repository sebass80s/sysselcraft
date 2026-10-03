# ACT 2 IMPLEMENTATION PLAN

Status: **LOCKED IMPLEMENTATION ORDER — 2026-09-30**

This document turns the accepted Act 2 story/art design into an implementation sequence. It is not a new story-design source. Narrative canon remains in `STORY_DESIGN.md`; Story Moment asset/delivery canon remains in `ACT2_STORY_MOMENT_MANIFEST.md`; persistence boundaries remain in `STATE_OWNERSHIP.md`.

## Goal

Ship Act 2 as a real playable continuation of Act 1 without destabilizing the accepted Act 1 child/parent loop.

Target player journey:

**Act 1 village → Valpen runs into forest → OPEN-001…005 → bicycle → Alve → choose one of three lake projects → restore Stugan/Bryggan/Båthuset in any order → unlock Motorbåten → family return → veranda payoff → SLUT PÅ ANDRA KAPITLET**

The isolated `/act2-test` route remains the story/acceptance laboratory. It is **not** production save progression.

## Non-negotiable design constraints

- Stugan, Bryggan and Båthuset are order-independent.
- Dialogue inside those three tracks must not assume another track is already complete.
- Motorbåten is locked until all three prerequisite projects are complete.
- Each project has 16 authoritative real-world contribution beats, grouped 4+4+4+4 across four visible build stages.
- Total Act 2 contribution count is 64.
- Intermediate SysselBux purchases are story/economy beats and do not consume a real-world contribution.
- Backend-approved/claimed quest progression remains authoritative for real-world contribution count.
- Presentation/story consumption must remain idempotent and survive restart.
- No story beat may be skipped merely because a player has accumulated more backend progression while a reveal was pending.
- No story beat may replay after it has been committed.
- Barnet remains rear/rear-three-quarter in Story Moment art.
- Act 3 destination remains undefined. Act 2 may depart toward the other side, but must not depict or name the Act 3 destination.

## Phase 1 — Runtime foundation and opening

Build the real Act 2 outdoor area as a discrete area using the accepted lake master background and existing Act 2 runtime building assets.

Required deliverables:
- Act 1 exit/trigger that starts Act 2 only when the story gate is satisfied.
- OPEN-001…OPEN-005 cinematic sequence before the existing close bicycle beat.
- Act 2 spawn, walkable/navigation geometry, collision, camera and return-safe state.
- Barnet, Valpen and Alve runtime presence.
- Existing bicycle → Alve meeting → project-choice intro in canonical order.
- No production contribution progression yet beyond a deterministic developer/test seed.

Acceptance gate:
- A real Act 1 save can enter Act 2 without losing Act 1 state.
- Opening plays once.
- Restart during/after opening resumes safely without duplicate story consumption.
- First Alve meeting and project chooser appear in correct order.

## Phase 2 — Canonical Act 2 state model

Create one explicit persisted Act 2 state family. Do not scatter progression across UI booleans.

Minimum conceptual state:
- Act 2 unlocked/entered.
- opening completion.
- Alve intro completion.
- selected/current project.
- per-project contribution count: 0–16.
- per-project visible stage: 0–4.
- per-project consumed beat IDs.
- completion state for Stugan/Bryggan/Båthuset.
- 0/3 prerequisite completion count derived from project state, not manually duplicated.
- Motorbåten locked/unlocked/completed.
- story-bound purchase ownership where backend authority exists.
- family finale consumed.
- epilogue consumed.
- Act 2 complete / Act 3 bridge available.

State transitions must be deterministic and idempotent.

## Phase 3 — Quest → Act 2 contribution bridge

Wire authoritative backend progress into the active Act 2 project.

Rules:
- Only a legitimate real-world quest contribution advances an Act 2 contribution beat.
- Parent approval/reward ownership rules from Quest System V2 remain unchanged.
- One backend contribution may advance at most one Act 2 contribution.
- If a Story Moment/reveal is pending, additional backend progress may accumulate but must not cause skipped narrative beats.
- After the pending beat is consumed, progression may catch up one authored beat at a time.
- Purchase beats are separate from contribution accounting.
- Project switching cannot duplicate, lose or reassign already-consumed contributions.

Required regression cases:
- restart before contribution presentation;
- restart after backend contribution but before Story Moment;
- multiple backend contributions accumulated while one beat is pending;
- project switch after partial progress;
- duplicate refresh/network retry;
- already-complete project receives no further contributions.

## Phase 4 — Implement project tracks one at a time

Implementation order is a development order only. Player order remains free.

### 4A Bryggan
Why first: strongest completed production mapping and clean social/safety/economy arc.

Implement:
- 16 beats and four runtime stages.
- nine accepted Story Moment assets.
- Sol safety beat.
- Mira life-buoy purchase: 200 SysselBux.
- permanent life buoy after the authored installation transition.
- Henning first social visit.
- first water break.
- completion/ambient eligibility.

Acceptance: full 1→16 run, restart boundaries, economy once-only, no cross-project assumptions.

### 4B Stugan
Implement:
- 16 beats and four runtime stages.
- accepted Stugan Story Moment set.
- persistent memory objects/continuity: height marks, family photo, old game, VÅR STUGA drawing, home keyring.
- mother-loss subtext exactly as locked in STORY_DESIGN.
- completion waiting state without premature family return.

Acceptance: emotional/dialogue sequence stays intact regardless of whether Bryggan or Båthuset is complete.

### 4C Båthuset
Implement:
- 16 beats and four runtime stages.
- chest → Henning BOOM aftermath → photograph mystery.
- workshop state.
- soapbox-car arc.
- slip/trolley restoration.
- story-bound Mira steering-wheel/workshop purchase: 200 SysselBux.
- completion line leading toward the locked motorboat, without unlocking it early.

Acceptance: no actionable explosive instructions; motorboat remains locked unless all three prerequisite projects are complete.

### 4D Motorbåten
Only available after all three prerequisite tracks are complete.

Implement:
- 16 beats and four runtime stages.
- restored slip integration.
- family-photo/boat-history continuity.
- Mira parts package: 200 SysselBux.
- water tests.
- persistent player-chosen boat name, rendered at runtime rather than baked into generated art.
- “Inte idag” character payoff.
- successful homecoming.

Acceptance: no Act 3 destination reveal; contribution 16 ends the motorboat project and then unlocks the separate finale.

## Phase 5 — Family finale and epilogue

Family finale is not contribution 17.

Implement in this order:
1. cottage anomaly after motorboat homecoming;
2. family reveal: father + early-teen older sister only;
3. family embrace;
4. “Det är min kompis” payoff;
5. veranda scene, including “Jag kunde inte laga det som hände. Men jag kunde laga stugan.”;
6. Alve’s explicit gratitude to Barnet;
7. quiet veranda payoff;
8. black / **SLUT PÅ ANDRA KAPITLET**.

The first true lake crossing is the Act 3 opening, not an Act 2 epilogue.

Locked gratitude beat in the departure scene:
- Alve says the outcome would never have happened without Barnet.
- He admits that on the day Barnet found him he was “helt lost”.
- He explains he thought fixing enough things would make everything solve itself.
- He explicitly thanks Barnet and says he is glad Barnet is his friend.

The previously planned EPI-001…004 departure image set is superseded. Do not produce or integrate an Act 2 crossing epilogue. Any first-crossing visuals now belong to Act 3.
## Phase 6 — Production acceptance

Before connecting Act 2 as release progression, execute:

### Fresh-save path
- new child reaches Act 1 normally;
- Act 2 unlock trigger occurs once;
- opening/Alve intro/project chooser are correct;
- all four projects progress correctly;
- finale/epilogue complete exactly once.

### Existing Act 1 save
Use a real progressed save without rewriting wallet, Quest v2 history or accepted Act 1 world state.

### Order matrix
Test all six orders of Stugan/Bryggan/Båthuset:
1. S→B→BH
2. S→BH→B
3. B→S→BH
4. B→BH→S
5. BH→S→B
6. BH→B→S

Motorbåten must unlock only after the third prerequisite completion in every order.

### Restart matrix
At minimum restart:
- immediately before a contribution;
- after backend contribution but before Story Moment;
- during/after Story Moment;
- after stage transition;
- after purchase;
- after project completion;
- after 3/3 unlock;
- during family finale;
- after Act 2 completion.

### Economy
Verify every story-bound purchase:
- deducts once;
- survives restart;
- cannot be duplicated;
- cannot consume a real-world contribution;
- unlocks the intended story state only.

## Implementation discipline

- **Deployment rule:** GitHub Actions verifies every relevant code push. Vercel is used only for a meaningful acceptance checkpoint or release. Batch intermediate commits; docs-only/trivial commits must not consume Vercel deployment storage.
- Repo truth beats this plan if code/docs have changed.
- Verify branch/HEAD before writes.
- Keep Act 1 regression coverage green during every phase.
- Prefer pure derivation functions for progression and separate presentation commits.
- Never “catch up” by jumping visible/story stages.
- `/act2-test` remains a useful visual/dialogue oracle and can be expanded, but production state must not depend on the test route.
- Do not wire Act 3 destination content while implementing Act 2.

## Immediate next implementation milestone

The first shippable vertical slice is:

**Act 1 → Act 2 trigger → OPEN-001…005 → bicycle → Alve → project chooser → choose one of Stugan/Bryggan/Båthuset → chosen project begins and survives restart.**

Do not start by implementing all 64 contribution beats at once. Establish the state/runtime spine first, then add one complete project track at a time.


## Phase 1 implementation checkpoint — 2026-09-30

First production vertical-slice code has landed on `nova/local-construction-snapshot`.

Implemented:
- production `/act2/` route, separate from `/act2-test`;
- post-Clinic Act 1 entry control into Act 2;
- persisted dedicated `sysselcraft.act2.runtime.v1` state family, separate from Act 1 `SaveStateV1` and Quest v2 authority;
- restart-safe OPEN-001…OPEN-005 progress;
- close bicycle beat;
- revised canonical first Alve meeting dialogue and shared visual progression from `src/game/act2AlveStory.ts`;
- in-Story-Moment Stugan/Bryggan/Båthuset chooser with preview before commit;
- selected project persists across restart and begins at 0/16 without consuming backend progression;
- production lake runtime reused from the accepted lake harness;
- touch-to-move, keyboard movement, simple authored building-footprint collision and Valpen follow presence in the lake runtime;
- deterministic source/state regression added as `test:act2-runtime` and included in `npm run verify`.

Still open inside Phase 1:
- canonical runtime Alve sprite/cutout presence at the active project. Existing accepted Alve assets are Story Moments/reference material, not a verified standalone runtime cutout, so no filename was invented.
- physical iPhone navigation/camera acceptance.
- GitHub Actions green evidence for this checkpoint. The connector-visible commit status currently only reports Vercel's external build-rate-limit failure, which is not a source/build failure and does not constitute CI acceptance.

Do not start Quest→Act 2 contribution consumption until this runtime/state spine has passed build/CI and physical restart acceptance.


## Runtime implementation checkpoint — 2026-10-01

Production integration has moved beyond the initial Phase 1 skeleton.

### Phase 1/2 spine now implemented
- production `/act2/` route remains separate from `/act2-test`;
- post-Clinic Act 1 transition enters the Act 2 opening;
- OPEN-001…005, close bicycle, revised Alve intro and first project chooser are persisted;
- explicit Act 2 state family owns per-project 0–16 contributions, 0–4 visible stage, consumed beat IDs, selected project and separate completion-reaction consumption;
- Stugan/Bryggan/Båthuset completion count is derived from project state; Motorbåten cannot normalize or advance before 3/3;
- all six prerequisite completion orders are regression-covered;
- lake runtime supports independent visual stages for each restoration project rather than one shared test stage.

### Phase 3 bridge now implemented for the Bryggan vertical track
- backend `worldProgression` is read only as authoritative claimed-quest evidence;
- a local establish-once Act 2 claim baseline prevents historical Act 1 claims from replaying;
- accumulated backend claims produce only the next authored contribution candidate;
- refresh/retry does not itself consume a beat;
- presentation commit happens only after the authored beat is completed;
- backlog drains one authored beat at a time;
- contribution is assigned only to the currently active project.

### Bryggan 1–16 runtime track
- the 16 canonical Bryggan contribution beats now live in `src/game/act2JettyStory.ts`;
- `/act2-test` imports the same Bryggan source instead of maintaining a second dialogue copy;
- visual transitions are locked at contributions 4, 8 and 12;
- the Sol → Mira livboj gate sits between contributions 6 and 7 and is contribution-neutral;
- the existing atomic backend `purchase_story_item` RPC now supports `act2_jetty_lifebuoy` for 200 SysselBux with backend flag `act2JettyLifebuoyOwned`;
- Mira exposes the item only when the Bryggan gate is relevant; backend ownership releases the gate after restart;
- Bryggan 16/16 unlocks a separate persisted completion reaction. That reaction never increments contribution count and cannot replay after it is consumed.

### Verification status
- deterministic Act 2 contract coverage is included in `npm run verify`;
- Supabase migration `add_act2_jetty_lifebuoy_story_item` applied successfully; the existing bound-child authorization, row lock, idempotent ownership check and wallet debit semantics were preserved;
- Vercel was green through the shared-canon checkpoint `0a0b3ece`;
- the first Quest→Act 2 wiring introduced a TypeScript nullable-candidate rendering error. The explicit JSX narrowing fix landed later in `a23329f8`; subsequent commits also hardened completion/reaction state. A fresh build of the final batched HEAD still needs positive evidence before this checkpoint is called build-green.
- physical iPhone navigation, restart and purchase acceptance remain OPEN.
- no standalone canonical Alve runtime cutout has been verified in repo; do not invent one.

Do not call Phase 4A accepted until the final batched HEAD has a green build and the real-device Bryggan journey has been exercised across the documented restart boundaries.


### Full Act 2 restoration runtime batch — 2026-10-01
- Stugan, Bryggan, Båthuset and Motorbåten now each have 16 canonical contribution beats wired to the production Act 2 route.
- Canonical story sources are shared with `/act2-test` instead of maintaining condensed duplicate dialogue tracks. This includes the first-Alve image progression; do not re-hardcode `first-hello.png` across the entire meeting.
- Story-bound economy gates are authoritative and contribution-neutral: Bryggan livboj 200 SysselBux, Båthuset ratt 200 SysselBux, Motorbåten reservdelspaket 200 SysselBux.
- Motorboat naming after 12/16 is persisted locally and does not consume a contribution.
- The family-return finale is a separate restart-safe sequence after Motorbåten 16/16; completion sets familyFinaleConsumed, epilogueConsumed and act2Complete without inventing contribution 65. The first real crossing of the lake belongs to the Act 3 opening, not the Act 2 finale.
- Finale assets 01–04 are used where present. The final departure intentionally runs over the live lake because no canonical departure still exists in repo.
- Physical-device acceptance and a green build of the batched final HEAD remain required before calling the Act 2 implementation accepted.


### Alve world placeholder — 2026-10-01
- Production lake runtime now owns one temporary interactive Alve world entity built from Phaser primitives, not a fabricated character asset.
- Alve is positioned beside the currently selected restoration project using ACT2_ALVE_WORK_POSITIONS.
- When there is no selected active project, the placeholder is hidden.
- The placeholder container is already interactive so the later quest hand-in flow can attach to this same entity instead of introducing a parallel NPC implementation.
- Final Alve character art remains a separate asset replacement task; runtime positioning and interaction ownership should survive that swap.


### Alve quest hand-in loop — 2026-10-01
- Backend worldProgression remains the authoritative evidence that a claimed real-world quest exists.
- Polling may discover pending contribution backlog but no longer auto-opens an Act 2 Story Moment.
- A pending, unblocked contribution shows a ! marker on the same world Alve entity that follows selectedProject.
- Tapping Alve from farther away walks the child toward him; tapping within 135 world pixels opens exactly the next pending canonical contribution beat.
- Completing that Story Moment consumes exactly one local Act 2 contribution and closes the turn-in interaction. Additional backend backlog requires another world interaction with Alve.
- Story-economy gates and motorboat naming continue to block contribution hand-in until resolved.


### Alve interaction polish — 2026-10-01
- Alve pointer events stop propagation so tapping the NPC cannot be overwritten by the lake's generic touch-to-move handler.
- A pending turn-in still uses the world ! marker from a distance.
- Inside the 135px interaction radius the world entity also shows `Tryck på Alve`.
- When the child reaches the Alve approach point, movement settles and Barnet turns toward Alve before the hand-in Story Moment opens.
- This remains presentation-only polish; backend quest authority and contribution accounting are unchanged.


## Remaining work after hardening — KEEP ACROSS HANDOVERS

Do not lose this list when the implementation thread changes.

1. **Physical iPhone acceptance** — deferred until Kalle has the Mac. Exercise the real loop: claimed quest → lake → Alve marker → approach/turn-in → Story Moment → visual stage update, plus restart boundaries and purchases. Never reset or manually mutate Adam's real save/backend for this test.
2. **Replace Alve placeholder with final runtime art** — keep the existing single world entity, active-project positioning and interaction ownership. Search repo for a verified standalone Alve cutout first; do not invent an asset filename.
3. **Act 2 dialogue polish** — first runtime pass completed 2026-10-01. Keep further line-level polish available after physical playthrough; do not change locked emotional canon.
4. **Act 3 crossing handoff** — do not create Act 2 departure/EPI assets. The first true crossing and its visuals belong to Act 3.


### Hardening checkpoint — 2026-10-01
- Direct /act2 access is blocked unless Act 1 worldFlags.clinicCompletionSeen is true; direct URL access can no longer enter Act 2 early.
- Backend story-ownership polling persists outside React state-updater callbacks.
- Completion reactions are explicit: Bryggan uses JETTY_COMPLETION_REACTION; Båthuset creates no phantom pending reaction; Motorbåten proceeds to the finale. CABIN_WAITING_REACTION is not an automatic completion reaction: it is a repeatable revisit scene on the finished Stugan while Motorbåten is still incomplete.
- Motorbåt 5 runtime syntax was repaired. The required 200 SysselBux purchase still gates after 5/16; 6/16 is now a post-purchase Mira scene and no longer narrates a second payment.
- Deterministic runtime-source checks reject known developer/internal language in child-facing Story sources.


### Act 2 story-item price lock — 2026-10-01
The term **story-items** refers here only to the three required Act 2 restoration purchases:
- Bryggan: livboj — 200 SysselBux.
- Båthuset: ratt till lådbilen — 200 SysselBux.
- Motorbåten: reservdelspaket — 200 SysselBux.

Act 1 bottle-message, room-decoration and dog-home prices are explicitly outside this price lock and remain unchanged.


### Act 2 dialogue polish checkpoint — 2026-10-01
- Runtime narration is normalized to second person ("du") while "Barnet:" remains the dialogue-speaker prefix that the production route replaces with the configured child name.
- Third-person leaks such as "Alve tittar på Barnet" were removed from runtime Story sources.
- Authoring/UI labels such as "KÖP:" were removed from child-facing story arrays. Required purchase prices remain spoken naturally by Mira where the scene includes the transaction.
- Alve's deliberate recurring voice patterns (short nej/japp, plans, teasing and repeated character callbacks) were preserved rather than mechanically deduplicated.
- Locked emotional lines, mother-loss subtext, family payoff and finale friendship lines were not rewritten.


### Act 2 insufficient-funds UX — 2026-10-01
- All three required Act 2 story-item purchases keep backend authority: insufficient funds never debit the wallet and never set ownership.
- Mira's shop now reports the child's current SysselBux balance and the exact amount still missing.
- The message explicitly tells the child to complete more real-world quests and return after saving enough.
- This is presentation-only; purchase price, wallet authority and story gating remain unchanged.


### Act 2 progression edge-case hardening — 2026-10-01
- Project hotspots may be preview-switched before confirmation, as locked in STORY_DESIGN. After confirmation, the active project cannot switch until that project is complete.
- Pending authoritative quest backlog therefore remains attached to the confirmed active project instead of being reassigned by a later state call.
- Story purchase gates and the motorboat naming gate are enforced inside the pure Act 2 state layer, not only by page rendering.
- A blocked contribution cannot be forced through with a direct withPresentedContribution call.
- Pending backend backlog remains queued across purchase gates and state normalization/restart; buying the required item releases the same queued work without consuming a contribution.
- Duplicate presentation from the same state snapshot is explicitly regression-covered as idempotent.


### Act 2 restart and village-navigation hardening — 2026-10-01
- Act 2 already exposes both a normal return-to-village link and purchase-gate navigation to Mira; these routes do not clear Act 2 state.
- Contribution Story Moments, project completion reactions and finale beats now persist their current line index in the Act 2 state family.
- Restart or a village round-trip therefore resumes the exact active dialogue line rather than replaying the current scene from line 1.
- Completing a contribution/reaction/finale beat resets only that presentation line index; contribution counts and consumed IDs remain the authoritative replay guards.
- The establish-once backend claim baseline is regression-covered across village round-trips and cannot move on re-entry.
- Selected project, project contributions, pending purchase gates and Alve active-project ownership remain derived from the persisted Act 2 state after return.


### Act 2 economy sanity check — 2026-10-01
- The three mandatory Act 2 story-items remain locked at 200 SysselBux each, total 600.
- Current parent-quest reward data is heavily concentrated at 10 SysselBux: p25=10, median=10, p75=10, p90=25.
- 59 of 67 positive-reward parent quests are in the 1–20 SysselBux range; only one is 200+ and the raw average is distorted by a 10,000-SysselBux test/outlier reward.
- At the current median reward, one mandatory story-item equals about 20 typical quests and all three equal about 60 typical quests.
- No automatic rebalance is applied here because 200/story-item is a deliberate product decision. Flag this for physical pacing acceptance: if the intended child cadence is much shorter, quest rewards or story-item pricing will need a later balance decision rather than a hidden code-side adjustment.


### Act 2 stale-reference cleanup — 2026-10-01
- Removed stale Act 2 price canon from STORY_DESIGN: Bryggan, Båthuset and Motorbåten now all document the locked 200 SysselBux price.
- The exported Motorbåt story-source price constant is aligned to 200 and regression-covered.
- Act 1 Flaskpost at 100 SysselBux is intentionally unchanged.
- Historical OneDrive notes, parked resident-idle TODOs and deliberate Alve placeholder references were retained because they are not stale runtime canon.


### Act 2 old-save / corrupted-state hardening — 2026-10-01
- Project contribution count is the canonical local progress signal. Visible stage is now derived from that count during normalization instead of trusting stale saved stage values.
- Per-project consumed beat IDs are reconstructed deterministically from project + contribution count, removing duplicates, malformed IDs and old incompatible identifiers.
- Project complete remains derived only from 16 contributions.
- Illegal Motorbåt progress before 3/3 prerequisite completion is reset together with stale local motorboat name/parts state.
- Completion-reaction IDs are retained only for authored reactions (Stugan/Bryggan) whose project is actually complete.
- Orphan contribution/completion/finale line indices are cleared when their owning story context no longer exists.
- Finale progress cannot survive without a completed Motorbåt. Contradictory finaleIndex/familyFinaleConsumed combinations conservatively rewind rather than skip story.
- Story-item ownership is not inferred from project progress. Backend ownership remains authoritative, so normalization never fabricates a purchase.


### Full Act 2 state-machine run coverage — 2026-10-01
- Automated runtime-state coverage now executes the complete Act 2 loop for all six valid Stugan/Bryggan/Båthuset project orders.
- Each scenario completes all three prerequisite projects, consumes only authored completion reactions, unlocks Motorbåten at 3/3, completes Motorbåten, then advances the separate family finale/epilogue to act2Complete.
- Every full run asserts exactly 48 prerequisite contributions + 16 Motorbåt contributions = 64 total. Finale/epilogue are contribution-neutral, so no contribution 65 can be fabricated.
- Completed Act 2 state is normalized through a restart round-trip and must remain act2Complete with all 64 contributions preserved.


### Canonical Alve runtime art — 2026-10-01
- The temporary Phaser primitive Alve placeholder has been replaced by the standalone runtime asset at `/assets/village/reboot/alve-runtime.png`.
- Runtime display size is locked at 78×117 world pixels, keeping Alve clearly child-scale relative to adult Linus while matching the existing child-world scale.
- Existing ACT2_ALVE_WORK_POSITIONS, active-project ownership, turn-in marker, 135px hand-in radius and nearby `Tryck på Alve` interaction are unchanged.
- The outer Alve container remains the interaction owner so later art revisions do not require rewriting gameplay logic.


### Båthuset dialogue polish TODO — 2026-10-01
- Båthuset 1–16 requires a later dialogue rewrite/polish pass.
- Current issue is prose rhythm, not runtime logic: too many short alternating lines, too much ping-pong/popcorn dialogue, and too little sustained scene flow between character exchanges.
- Preserve locked plot beats, discoveries, jokes, project order-independence, images/stages and gameplay gates.
- Goal for rewrite: fewer line-by-line volleys, more natural paragraph-length beats, clearer action→reaction→payoff structure, and stronger distinction between narration and spoken dialogue.
- Do not perform this rewrite during the current Story Engine refactor unless a line is technically malformed or leaks authoring text into runtime.

### Runtime/debug parity, lake collision and Cabin revisit hardening — 2026-10-01
- Production `/act2` and debug `/act2-test` now render the same shared `Act2Runtime`. The route files are thin wrappers; debug may synthesize isolated state and expose test controls, but it must not own duplicate chooser/story/gate renderers.
- Debug Act 2 state is intentionally non-persistent. It uses the saved child name but does not write Act 2 runtime progress.
- The production shipping gate remains closed with `ACT2_PRODUCTION_ENABLED = false` until physical acceptance is complete.
- Lake water collision no longer uses a guessed straight shoreline. `createAct2LakeGame.ts` samples the accepted `lake-master` texture beneath the player foot area and blocks blue/cyan water pixels while retaining building/world collision.
- The initial lake spawn was moved back onto accepted land after browser evidence showed the previous spawn inside the lake. The pixel classifier still requires visual/physical acceptance around the full shoreline and is not considered pixel-perfect merely from automated tests.
- Stugan `16/16` ends normally. `CABIN_WAITING_REACTION` (“En stund till”) is a separate repeatable world revisit: it becomes available by clicking the completed Stugan and remains available until Motorbåten is complete. It does not consume a contribution or auto-open after Stugan completion.
- Story UI contract is now explicit: one dialogue card always owns one speaker/nameplate and one reply/narration unit. Click reduction belongs in manuscript editing, never multi-speaker card batching.
- Latest local `npm run verify` result after the final story/runtime hardening has not yet been positively reported. Do not call the current HEAD verify-green until that evidence exists.

### Autonomous Act 2 bug raid — 2026-10-01

A repo/CI/live-backend audit was run without Vercel. Important findings and fixes:

- CI had been red behind stale Act 2 assertions even though lint/build and earlier test groups were passing. Stage-boundary tests were corrected to the canonical 4/8/12 transition model used by runtime and authored story data.
- Finale tests were still based on the superseded six-beat crossing ending. They now match the five-beat family/veranda finale. The first true crossing remains Act 3.
- The Motorbåten 6/16 story had regressed to replaying the Mira purchase and even exposed implementation prose about the authoritative story-item function. The earlier post-purchase version was recovered from Git history and restored; regression guards now reject purchase implementation prose.
- Pure editorial runtime cards such as `Paus.` and `Låt återföreningen landa visuellt...` were removed from Act 2 story arrays. The story contract now rejects these as player-facing cards.
- Repository migration history had drifted behind the live Supabase `purchase_story_item` function. A checked-in additive migration now reproduces the live 200-SysselBux Act 2 lifebuoy, steering-wheel and motorboat-parts support. No live database mutation was needed.
- Valpen's Act 2 follow movement now respects the same walkability/water/building collision as Barnet instead of interpolating through blocked terrain.
- `vercel.json` still had routine Git deployment enabled for `nova/local-construction-snapshot`; this was disabled to enforce the GitHub-first/Vercel-sparse policy.
- Runtime tests were cleaned of stale hardcoded asset assumptions and now follow canonical opening/Alve story sources.

Verification checkpoint: GitHub Actions CI **#1461 SUCCESS** on commit `404be3fc40276257ff4d3b46fcb0386e55d9a2fb`, including lint, Next production build, quest regressions, Act 2 visual/story/UI contracts and the full Act 2 runtime-state suite.

Still requires human/physical evidence: full shoreline feel, touch/camera behavior, restart on device, story-item round trips, and complete Motorbåten → family/veranda playthrough.

### Full Act 2 flow verification — 2026-10-02

A complete automated chapter-flow contract now runs in `npm run verify` as `test:act2-full-flow`.

Verified chain:
**Clinic-complete Act 1 gate → clean production entry/baseline → OPEN-001…005 → bicycle → full Alve intro → project selection → Stugan/Bryggan/Båthuset → all story purchases → Motorbåten unlock → motorboat parts gate → boat naming gate → 64/64 contributions → five-beat family/veranda finale → persisted black “SLUT PÅ ANDRA KAPITLET” card.**

The test also exercises restart/normalization boundaries, village purchase round-trips and recovery after an initial backend sync failure. Pre-release visits to the locked production route can no longer establish a latent Act 2 baseline, and old pre-release baseline residue is discarded on the first legitimate production entry.

Verification checkpoint: GitHub Actions **#1475 SUCCESS** on `c6e9a20f0a5cb8b2c7ade56090ab24c449c69445`.

Important release boundary: `ACT2_PRODUCTION_ENABLED` remains `false`. The real Act 1 → `/act2` route is intentionally shipping-locked until physical acceptance. `/act2-test` renders the same shared runtime for acceptance testing.

### Act 1 chapter boundary dependency — 2026-10-02

The production Act 2 entry contract now includes the explicit Act 1 chapter ending.

Required order:
**Clinic completion → Act 1 ensemble finale → SLUT PÅ FÖRSTA KAPITLET → acknowledgement → Stigen till sjön → production Act 2 entry/baseline → OPEN-001 Valpen sticker.**

`act1EndCardSeen=true` is therefore part of the production Act 2 access contract. Merely having Clinic stage 4 or `clinicCompletionSeen` is no longer sufficient for newly authored progression. Legacy Clinic-complete saves are migration-compatible and normalize as already acknowledged so old players are not forced through newly inserted story retroactively.

Do not move Act 2 baseline establishment earlier than deliberate path activation. Do not auto-route directly from the Act 1 chapter card into Act 2.

Current Act 1 finale visual is a temporary placeholder only. Final ensemble art remains pending canonical references.


## Act 2 closeout — 2026-10-03

This checkpoint supersedes older veranda-only and shipping-lock notes above. Act 2 now includes all six finale beats, the supplied 05/06 images, exact canonical “Över sjön” dialogue, restart-safe epilogue progress and shared Previous/Continue layout. No assets, Act 1 story/gameplay or native settings changed.

Local full verify, TypeScript and isolated browser navigation at 667×375 and 568×320 passed. Completed legacy saves remain completed; ongoing final sequences include the epilogue. Production `/act2` uses its existing entry gate; `/act2-test` is not found in production.

GitHub [CI 37106033030](https://github.com/sebass80s/sysselcraft/actions/runs/37106033030) **SUCCESS** on implementation HEAD `19c0778b7a915f6e45c3c4f81c72188d914a4719`.

Physical iPhone acceptance is still OPEN. Run the final motorboat contribution through all six finale beats and the end card; verify both landscape directions, actual safe areas, navigation, full-image, HUD/quest suppression and force-quit/relaunch on the intended test child's save. Never mutate Adam. No native sync or Vercel deployment was performed.

Act 3 runtime is absent; persisted `act2Complete && endCardSeen` is its safe future entry boundary. See [technical checkpoint](TECHNICAL_HANDOFF.md#act-2-closeout--2026-10-03) for exact implementation and acceptance details.

## 2026-10-03 closeout migration addendum

The six-beat finale and epilogue are implemented. The current final chain is:

**Motorbåten 16/16 → Efter motorbåten → Någon är där → De kom → Min kompis → Det är bättre → Över sjön → SLUT PÅ ANDRA KAPITLET**.

Two acceptance-discovered edge cases are now explicit regression requirements:

1. **No-active-project NPC presence**
   - `selectedProject=null` is valid before project choice and after project completion.
   - Alve must remain visible at `ACT2_ALVE_IDLE_POSITION`.
   - Null state must survive reload without hiding Alve.
   - Project choice must still move Alve to its canonical work position.

2. **Five-beat legacy finale migration**
   - a save that already consumed the old family/veranda ending but predates the new epilogue must resume once at `finaleIndex=5`;
   - it must have `epilogueConsumed=false`, `act2Complete=false`, `endCardSeen=false` until the epilogue is actually consumed;
   - after epilogue completion, normal Act 2 completion/end-card semantics apply;
   - do not reset the child save or fabricate backend progress to test this.

Automated gates include `test:act2-alve`, `test:act2-closeout`, full Act 2 flow and `npm run verify`. Latest CI evidence before documentation updates: **#1639 SUCCESS** at `dc3c9267abb49b749e2f90f5ce98948a61fde3c4`.

Immediate remaining gate is physical iPhone acceptance of the migrated save through epilogue and chapter-end card, including force-quit/relaunch boundaries.

