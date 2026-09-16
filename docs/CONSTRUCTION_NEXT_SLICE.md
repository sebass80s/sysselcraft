# Construction next slice

> Nova implementation/audit note, 2026-09-16. This is a handoff-safe description of the next construction work after Kalle's successful local browser test of the unified Recycling stage-1/stage-2 pending reveal flow.

## Runtime evidence already obtained locally

The current local working tree at `/Users/karoaa/Developer/sysselcraft` is ahead of this remote branch and is the authority for the next implementation pass.

Kalle has personally browser-tested the first real loop after the stage-1 resident-attention refactor. The tested flow is:

`Linus onboarding -> first quest -> parent approval -> return to child -> Linus attention -> travel to Recycling -> Linus interaction -> truck delivery -> Recycling stage 1`

No functional/runtime fault was found in that pass. Previously observed AudioContext errors were not reproduced. One narrative QA issue was found: Linus's pre-reveal dialogue spoils what is about to be built. `CONSTRUCTION_REVEAL_POLICY.md` now locks the correction: resident-attention dialogue must create curiosity without naming/describing the visual payoff before it is witnessed.

Do not reinterpret GitHub's older implementation files as proof that the local stage-1/stage-2 runtime is absent. Local uncommitted work contains the newer implementation and must be inspected before any edit.

## Architecture audit

The remote domain baseline already has the correct low-level shape for a four-stage arc:

- `BuildingStage` is `0 | 1 | 2 | 3 | 4`.
- Recycling, Bakery and Clinic are represented independently.
- `applyApprovedConstructionContribution()` advances at most one stage and rejects replay through stable contribution IDs.
- Construction progression is separate from quest approval/rewards.
- Stage state is monotonic and capped at 4.
- Only Recycling stage 1 has a locked automatic derivation. Do not invent production thresholds for stages 2-4 or for Bakery/Clinic.

The local pending/reveal implementation adds the other required distinction: **earned stage, pending reveal and visible stage are separate durable concepts**. The next implementation must extend that generic mechanism, not create new stage-specific state machines.

## Next implementation target: complete the Recycling presentation arc

The next code pass should make Recycling stages 3 and 4 exercise the same generic pipeline already used by stages 1 and 2:

`authorized contribution/dev trigger -> earned stage -> durable pending reveal -> Linus attention at Recycling -> non-spoiling interaction -> stage reveal -> visible stage + collision commit`

Requirements:

1. Reuse the existing local construction/presentation/save-state machinery. No parallel stage-3/stage-4 implementation.
2. Keep production progression authority unchanged. Until product pacing is locked, stages 3 and 4 may only be exercised through clearly isolated development/test triggers or explicit authorized state.
3. Each reveal must be idempotent across reload and duplicate events.
4. `Senare` keeps the pending reveal.
5. A persistence failure must not visually advance into an unsaved state.
6. Building artwork and navigation collision switch to the same visible stage together.
7. Pre-reveal Linus copy must not reveal what stage/building change is coming.
8. Stage 4 completion must not automatically invent Henning's arrival timing. Completion may expose the already-approved story possibility, but resident arrival choreography remains a separate authored slice.
9. Do not change Bakery/Clinic progression merely to prove Recycling.
10. Preserve the successfully tested stage-1 truck reveal and stage-2 behavior.

## Why Bakery comes after Recycling 1-4

Recycling stages 3-4 are the cheapest proof that the local generic reveal machinery handles repeated progression cleanly. Bakery is the stronger architectural proof: a second building must use the same construction domain/presentation contract without Recycling-specific assumptions.

Once Recycling 1-4 is stable, the next audit should therefore look for hard-coded assumptions in:

- pending event identity;
- guide resident identity/placement;
- HUD resident-attention copy;
- building placement/approach lookup;
- texture/stage lookup;
- collision activation;
- reveal presentation selection;
- persistence keys/normalization;
- DEV tooling.

Any of those that encode `recycling` or `Linus` where a generic building/resident field belongs should be generalized before Bakery is wired. Do not generalize genuinely authored behavior such as the stage-1 truck presentation merely for abstraction purity.

## Verification gate for the next local pass

Before editing locally, obey `TECHNICAL_HANDOFF.md` workspace safety law and inspect the current uncommitted tree. Do not pull this remote documentation into the local tree merely to obtain this note.

After implementation, require:

- targeted construction tests for stages 1-4, duplicate events, pending reload and committed reload;
- stage-1 and stage-2 regression coverage;
- lint;
- `npm run build`;
- `git diff --check`;
- browser runtime on the current local port;
- Kalle visual QA before claiming the complete Recycling arc proven.

No Vercel deployment is required for this slice.
