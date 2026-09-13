# Parent Mode Foundation

Status: READY TO START PARENT MODE

This document defines the boundary that must stay intact while Sysselcraft's first real parent mode is built.

## What is now ready

- Quest definitions live outside Phaser.
- Quest lifecycle has explicit domain states and transitions: `available -> pending -> approved`, with `pending -> available` for `needsCompletion`.
- Save data owns quest state, completed quest ids, hidden progression, currencies and persistent world flags.
- Save writes are serialized so rapid updates cannot finish out of order.
- Hidden progression is separate from child-facing UI.
- The recycling center is a persisted world progression target, with the first material delivery as stage 1.
- Parent-facing data can be projected through `createParentModeSnapshot()` instead of reading Phaser scene state.
- A normalized `ParentQuestDraft` contract exists for the first create-quest form.

## Parent mode v1 scope

The first parent mode should focus on four jobs:

1. Create a quest for the child.
2. See quests waiting for review.
3. Approve or return a quest for completion.
4. See basic child/household and village status.

A simple history view may follow once the create/review loop is stable.

Do not begin with analytics, complex settings, achievement dashboards or detailed progression percentages.

## Architecture boundary

React owns parent mode UI.

Domain modules own quest definitions, quest lifecycle, rewards, progression and parent-facing read models.

Phaser consumes state and renders the village. Parent mode must never reach into a Phaser scene to read or mutate domain state.

Persistence remains local through Capacitor Preferences during this UX phase. Supabase is intentionally deferred until the single-device parent/child flow is proven. Moving persistence later must not require rewriting the quest or progression domain models.

## Quest creation contract

Parent-created quests are conceptually separate from built-in story quests. The create form may collect:

- title
- description
- one progression class
- diamond reward
- SysselBux reward

The UI must not ask the parent to configure hidden percentages. The game/domain layer will own progression weighting rules as the system matures.

Scheduling/recurrence is deliberately not part of the first create form. Add it only after one-off parent-created quests complete the full child -> pending -> approval loop reliably.

## Security boundary

The current `Vuxenläge` control is a prototype boundary, not real access control.

Do not pretend a front-end-only PIN is secure. Real family accounts, parent authentication and multi-device authorization belong with the future backend phase. For local prototype testing, a lightweight parent-entry friction mechanism may be added for UX only, clearly treated as such.

## First implementation slice

The next implementation slice may now begin directly in parent mode:

1. Extract/replace the current prototype parent modal with a dedicated React parent-mode surface.
2. Build the one-off quest creation form using `ParentQuestDraft`.
3. Persist parent-created quest instances in save state.
4. Render created available quests on the child side using the same lifecycle contract.
5. Reuse the existing approval path for pending quests.
6. Verify save/restart and physical-iPhone behavior before adding scheduling.

## Non-negotiable invariants

- No reward before parent approval.
- No hidden progression before parent approval.
- Approval must be idempotent.
- World effects must restore from persisted state without replaying completed events.
- Child-facing gameplay stays game-like; parent mode may be functional and information-dense.
- Domain logic does not move into Phaser.
- Do not expose hidden progression percentages to the child.

## Deployment discipline

Git commits are cheap; Vercel deployments are scarce.

Batch coherent remote pushes. A remote branch push may also trigger a preview deployment, so creating a work branch does not automatically save Vercel resources. Prefer local/internal reasoning and checks, then one remote push for a coherent tested package.

GitHub Actions minutes must not be used without explicit user approval.
