# ACT 2 IMPLEMENTATION PLAN

Status: **LOCKED IMPLEMENTATION ORDER — 2026-09-30**

This document turns the accepted Act 2 story/art design into an implementation sequence. It is not a new story-design source. Narrative canon remains in `STORY_DESIGN.md`; Story Moment asset/delivery canon remains in `ACT2_STORY_MOMENT_MANIFEST.md`; persistence boundaries remain in `STATE_OWNERSHIP.md`.

## Goal

Ship Act 2 as a real playable continuation of Act 1 without destabilizing the accepted Act 1 child/parent loop.

Target player journey:

**Act 1 village → Valpen runs into forest → OPEN-001…005 → bicycle → Alve → choose one of three lake projects → restore Stugan/Bryggan/Båthuset in any order → unlock Motorbåten → family return → epilogue departure → SLUT PÅ ANDRA KAPITLET**

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
7. departure sequence;
8. black / **SLUT PÅ ANDRA KAPITLET**.

Locked gratitude beat in the departure scene:
- Alve says the outcome would never have happened without Barnet.
- He admits that on the day Barnet found him he was “helt lost”.
- He explains he thought fixing enough things would make everything solve itself.
- He explicitly thanks Barnet and says he is glad Barnet is his friend.

Epilogue Story Moment target set:
- EPI-001: leaving the restored lake / gratitude scene.
- EPI-002: across the lake.
- EPI-003: the other side visible only as undefined distant wilderness.
- EPI-004: into the unknown / final chapter image.

Epilogue image production is **not complete as of 2026-09-30**. Do not invent repository filenames or claim integration until assets are actually uploaded.

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
- revised canonical first Alve meeting dialogue;
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
- Canonical story sources are shared with /act2-test instead of maintaining condensed duplicate dialogue tracks.
- Story-bound economy gates are authoritative and contribution-neutral: Bryggan livboj 200 SysselBux, Båthuset ratt 200 SysselBux, Motorbåten reservdelspaket 200 SysselBux.
- Motorboat naming after 12/16 is persisted locally and does not consume a contribution.
- The family-return + first-crossing finale is a separate six-beat restart-safe sequence after Motorbåten 16/16; completion sets familyFinaleConsumed, epilogueConsumed and act2Complete without inventing contribution 65.
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
4. **Epilogue image production/integration** — EPI-001…004 remain incomplete. Do not fake repository assets. Final crossing may continue over the live lake until canonical images exist.


### Hardening checkpoint — 2026-10-01
- Direct /act2 access is blocked unless Act 1 worldFlags.clinicCompletionSeen is true; direct URL access can no longer enter Act 2 early.
- Backend story-ownership polling persists outside React state-updater callbacks.
- Completion reactions are explicit: Stugan uses CABIN_WAITING_REACTION, Bryggan uses JETTY_COMPLETION_REACTION, Båthuset creates no phantom pending reaction and Motorbåten proceeds to the finale.
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
