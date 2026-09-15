# Sysselcraft MVP engineering status

Status: **working technical checklist, 2026-09-15**

This file tracks what can safely be advanced without inventing product rules. Canonical product/story documents still win on conflicts.

## Proven baseline

- The existing Linus → built-in quest → parent approval → truck/material delivery loop has been physically verified on iPhone.
- The v4 visual/runtime PoC has subsequently been exercised locally by the user; visual placement/hitbox calibration remains local QA work rather than a GitHub-only task.
- Reconciliation remains observe-only. Pairing does not migrate the local save.

## Domain work now available on `nova/mvp-night-20260915`

`src/game/worldProgression.ts` now represents stage 0–4 for the three locked opening-area construction arcs (`recycling`, `bakery`, `clinic`). Only recycling stage 1 is automatically derivable from the already-locked first quest contribution. Later recycling stages and all bakery/clinic stages remain explicit until their authority/pacing is approved.

`src/game/constructionProgression.ts` adds an idempotent reducer for an **already-authorized** real-world contribution. It requires a stable contribution/event id, advances at most one stage, caps at stage 4 and ignores replay of the same id. It intentionally does not decide quest eligibility or issue rewards.

This gives the future approval integration a clean boundary:

`authoritative approval/reward event -> approved construction contribution -> durable construction state -> Phaser presentation`

Phaser must not become the authority for construction progress.

## Next safe integration slices

### A. First recycling arc

1. Persist durable construction stage and applied contribution ids without replaying truck/reward effects.
2. After the locked post-delivery Linus interaction, reveal recycling stage 1 at the real reserved site.
3. Route subsequent **approved** eligible contributions through the idempotent construction reducer.
4. Render the durable stage through the generic building runtime.
5. Keep bakery/clinic at stage 0 and visually absent.
6. On stage 4, expose completed-building interaction and the already-locked Linus/Henning completion scene.

Quest 2–4 copy and custom-parent-quest substitution remain product/content decisions and must not be invented by infrastructure code.

### B. Backend boundary

The backend already owns parent-created quest lifecycle/rewards. Do not couple construction advancement to child-side completion. Construction can consume an approval-derived event only after the product rule for which backend quests count toward the onboarding arc is locked.

Reconciliation remains diagnostic/read-only until the physical two-device evidence required by `STATE_OWNERSHIP.md` and `RECONCILIATION_PLAN.md` exists.

### C. Residents

Do not spawn Henning merely because a numeric stage reaches 4. Recycling completion unlocks the **story possibility** described in `STORY_DESIGN.md`; the locked Linus completion scene names Henning first. Exact arrival timing/staging is still open. Sol remains later than Henning.

## Verification still requiring the user's local environment

- Merge/reconcile this branch with the user's newer local v4 working tree, which contains changes not present on the remote batch base.
- `npm run lint` and `npm run build` after that reconciliation.
- Browser runtime proof of real reserved recycling placement, depth, collision and approach behavior.
- Physical iPhone regression and restart persistence.
- Physical two-device reconciliation evidence before any migration writes.

## Safety invariants

- No reward/progression before parent approval.
- Approval/reward/construction transitions must be idempotent.
- Stage state restores without replaying one-time effects.
- Future sites are absent until earned.
- No hidden numeric construction meter is exposed to the child.
- No automatic reconciliation writes yet.
- No bakery/clinic pacing is inferred from recycling calibration.
