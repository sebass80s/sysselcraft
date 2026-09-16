# Codex local handoff — construction continuation

Status: **prepared implementation handoff; not evidence of local integration or runtime success.**

Use this when the user's canonical local `sysselcraft` working tree is open in Codex. This supersedes the older Gate-0-only wording in this file.

## Current evidence

Kalle has already browser-tested the real Recycling stage-1 loop after the resident-attention refactor:

`Linus onboarding -> first quest -> parent approval -> return to child -> Linus attention -> travel to Recycling -> Linus interaction -> truck delivery -> Recycling stage 1`

The latest local Codex pass also reported stage-2 pending/reveal regression coverage, green build/lint/tests and reload/idempotency checks. Kalle's latest playtest found no functional/runtime fault. The earlier AudioContext errors were not reproduced.

One known product issue remains: **Linus's pre-reveal dialogue spoils the payoff.** Fix it in this pass using the non-spoiler rule below.

The local working tree is ahead of GitHub and is authoritative. GitHub source files are context only. Do not overwrite newer local implementation merely to match this branch.

## Canonical workspace safety law

Before any inspection/edit/build/Git operation:

```sh
cd /Users/karoaa/Developer/sysselcraft && pwd -P
```

Continue **only** if the resolved path is exactly:

`/Users/karoaa/Developer/sysselcraft`

Then run:

```sh
git status --short
git branch --show-current
git rev-parse --short HEAD
```

Expected branch is `nova/vercel-free-batch`; known local HEAD before the uncommitted construction work was `a2ef652`.

Hard safety rules:

- never work in OneDrive, `CloudStorage`, synced Desktop/Documents or another synced clone;
- preserve every existing local modification and untracked asset;
- do not pull/reset/clean/stash/restore/checkout-overwrite;
- do not stage, commit, push or deploy;
- do not use GitHub Actions or Vercel;
- do not regenerate `ios/` or disturb native/Xcode work.

If path/branch/state differs materially, stop and report rather than repairing it destructively.

## Mission order

### 1. Fix the stage-1 reveal spoiler

Pre-reveal resident attention must create curiosity without naming/describing the payoff.

Safe intended tone:

> Linus: Du, kom hit ett slag. Det har hänt något här som jag tror att du vill se.

Equivalent authored copy is fine, but before the reveal Linus must not name the Recycling building, construction stage, new feature, truck or material delivery. Post-reveal dialogue may explain what the child has just seen.

Do not rewrite unrelated dialogue.

### 2. Complete Recycling stages 3 and 4 through the existing generic pipeline

Inspect the local implementation first. Reuse its existing construction/domain/presentation/save-state machinery.

Required pipeline:

`authorized DEV/test contribution -> earned stage -> durable pending reveal -> Linus attention at Recycling -> child travels there -> non-spoiling interaction -> reveal presentation -> visible stage + collision committed together`

Requirements:

- no parallel stage-3/stage-4 state machine;
- no invented production progression thresholds;
- use clearly isolated development/test triggers to exercise stages 3 and 4;
- duplicate contributions/reloads must not double-advance or replay committed reveals;
- `Senare` keeps pending;
- persistence failure must keep pending and must not visually advance;
- pending alone must not activate the next sprite/collision;
- visible stage and collision switch together after successful commit;
- stage 4 caps construction at 4;
- stage 4 completion does **not** automatically spawn Henning or invent arrival choreography;
- preserve the proven stage-1 truck presentation and stage-2 behavior.

Presentation may differ by stage. Stage 1 keeps the truck/material delivery identity. Stages 2-4 may use the existing generic construction reveal if that is what the local implementation already provides. Do not add meters, stage numbers or hidden percentages.

### 3. Audit the generic construction contract before Bakery

Do not wire Bakery by adding Recycling-shaped copy/paste branches. Audit the local implementation for hard-coded assumptions in:

- pending event identity;
- building identity;
- earned/visible stage persistence;
- guide resident identity;
- guide position / child approach point;
- HUD resident-attention label;
- texture/stage lookup;
- collision footprint lookup;
- presentation selection;
- DEV tooling.

The system should be able to determine these from data/state where behavior is genuinely generic. Keep authored behavior authored, especially Recycling stage-1 truck choreography.

### 4. Bakery architecture proof, only after Recycling 1-4 is green

Kalle has placed actual Bakery production assets in the canonical local tree under:

`public/assets/village/buildings/bakery/`

Expected runtime files:

- `bakery-stage-1.webp`
- `bakery-stage-2.webp`
- `bakery-stage-3.webp`
- `bakery-stage-4.webp`

First verify those files exist locally. **Do not replace or redraw them.** They are newer local production assets and the local copies are authoritative.

Bakery stage 0 has no sprite and no Bakery collision. Do not advertise the future site with a placeholder.

Use the existing authored placement contract unless the current local implementation already contains a newer validated calibration:

- world x: `835`
- baseY: `305`
- render envelope: `330 × 295`
- ground footprint: `205 × 72`
- approach: `x=835`, `y=363`

All Bakery stages must share the same world/base anchor and runtime render envelope even if source image pixel dimensions differ. Gameplay collision comes from the authored ground footprint, never the transparent bitmap bounds.

Bakery integration in this pass is an **architecture proof only**. Do not invent which normal quests earn Bakery progression, do not invent pacing thresholds, and do not introduce Henning earlier than the story/product layer authorizes him. If a resident guide is required to exercise Bakery in DEV and the correct production resident/choreography is not already authored in local state, keep the DEV proof isolated and report the missing product decision rather than inventing canon.

## Existing v4 calibration context

The start area is 1920×640 and supports exactly four major start-area anchors:

| Building | world x | baseY | render envelope | ground footprint |
| --- | ---: | ---: | --- | --- |
| recycling | -180 | 500 | 330×236 | 190×72 |
| bakery | 835 | 305 | 330×295 | 205×72 |
| clinic | 1110 | 500 | 350×279 | 205×72 |

Family house remains permanent. Recycling/Bakery/Clinic remain progression-dependent runtime objects and are absent before their visible stage is committed.

Do not assume the remote `public/assets/village/reboot/` binary set is newer than local `public/assets/village/buildings/`. Verify local provenance/state before touching any asset.

## Preserve these invariants

Do not regress:

- painted start-area presentation;
- painted child, Linus and puppy;
- tap-to-move/A*;
- desktop movement;
- camera follow;
- contextual interactions;
- Linus onboarding;
- Linus -> family-house first-quest onboarding;
- first quest and parent approval;
- resident-attention pending flow;
- Recycling stage-1 truck arrival/delivery/departure;
- stage-1 visible building/collision commit;
- save/reload semantics;
- Capacitor/native boundaries;
- Supabase/local state authority boundaries.

Do not refactor backend/reward/reconciliation code without a concrete dependency.

## Verification gate

Run safe local checks only. At minimum:

1. targeted construction tests covering stages 1-4;
2. duplicate contribution/event idempotency;
3. pending reload;
4. committed reload without replay;
5. `Senare` persistence;
6. stage 0 = no building sprite/collision;
7. pending next stage = old visible stage/collision remains until commit;
8. stage-1 and stage-2 regression;
9. Bakery asset existence check before Bakery wiring;
10. Bakery stage0 absence and, if DEV-wired, stable base alignment/collision activation;
11. lint;
12. `npm run build`;
13. `git diff --check`;
14. browser runtime on the actual local dev port if safe to start.

Compilation is not visual proof. Stop for Kalle visual QA before claiming Recycling 1-4 or Bakery runtime presentation proven.

## Stop/report condition

Continue autonomously through locally discoverable implementation/test issues. Stop only when the next blocker genuinely needs Kalle/Nova product input, visual judgment or physical-device testing.

Report:

1. exact files changed in this pass;
2. spoiler-copy correction;
3. how stages 3-4 reuse the generic pending/reveal machinery;
4. any hard-coded Recycling assumptions removed and why;
5. Bakery asset verification and whether Bakery was safely wired or intentionally stopped at a product boundary;
6. final building geometry/collision behavior;
7. exact tests/build/lint/diff-check results;
8. browser evidence and remaining visual uncertainty;
9. final `git status --short`;
10. explicit confirmation that no pull/reset/clean/stash/restore/commit/push/Actions/Vercel/native regeneration occurred.

Do not commit. Nova reviews the local diff/evidence first.
