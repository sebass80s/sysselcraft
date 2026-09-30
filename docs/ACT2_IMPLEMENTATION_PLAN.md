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
- Mira life-buoy purchase, currently 300 SysselBux provisional balance.
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
- story-bound Mira steering-wheel/workshop purchase, currently 100 SysselBux provisional unless later rebalanced.
- completion line leading toward the locked motorboat, without unlocking it early.

Acceptance: no actionable explosive instructions; motorboat remains locked unless all three prerequisite projects are complete.

### 4D Motorbåten
Only available after all three prerequisite tracks are complete.

Implement:
- 16 beats and four runtime stages.
- restored slip integration.
- family-photo/boat-history continuity.
- Mira parts package, currently 150 SysselBux.
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
