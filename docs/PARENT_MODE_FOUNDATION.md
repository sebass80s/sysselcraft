# Parent Mode Foundation

Status: READY TO BUILD PARENT MODE ON BACKEND FOUNDATION

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
- A Supabase backend boundary now exists for households, adults, children, parent-created quests, child-device pairing and server-authoritative rewards.

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

The backend boundary lives under `src/backend/`. Supabase owns shared family identity, cross-device quest state and server-authoritative reward issuance. Capacitor Preferences remains as the local/offline save during rollout. Do not delete or silently replace local persistence until a reconciliation/migration strategy has been tested on a physical iPhone.

The parent UI should depend on the backend repository rather than importing Supabase directly. Moving or extending persistence must not require rewriting the quest or progression domain models.

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

The old `Vuxenläge` control is a prototype entry point, not real access control.

Real parent access uses Supabase Auth. Child devices use anonymous Auth sessions paired to a child profile with a short-lived one-time code. RLS restricts reads, and direct client table mutations are revoked for authoritative domain changes.

The child may submit an available quest, but only the parent review RPC can approve it and issue rewards. A unique reward-ledger entry makes approval idempotent.

Never expose a Supabase service-role key to the browser or Capacitor app.

## First implementation slice

After the Supabase project is provisioned and environment variables are configured, parent mode can proceed directly:

1. Replace the prototype parent modal with a dedicated React parent-mode surface.
2. Add parent sign-in and household/child bootstrap.
3. Build the one-off quest creation form using `ParentQuestDraft` and `createParentQuest()`.
4. Pair the physical child iPhone with a one-time code.
5. Render backend-created available quests on the child side using the same lifecycle contract.
6. Submit child completion through `submitQuest()` and review through `reviewQuest()`.
7. Verify the reward is issued exactly once and reflected on both devices.
8. Design and verify local-save/backend reconciliation before backend game state becomes authoritative for the rest of the village.

## Non-negotiable invariants

- No reward before parent approval.
- No hidden progression before parent approval.
- Approval must be idempotent.
- World effects must restore from persisted state without replaying completed events.
- Child-facing gameplay stays game-like; parent mode may be functional and information-dense.
- Domain logic does not move into Phaser.
- Do not expose hidden progression percentages to the child.
- Child devices never receive parent authorization powers.
- No service-role secret is shipped to a client.

## Deployment discipline

Git commits are cheap; Vercel deployments are scarce.

Batch coherent remote pushes. A remote branch push may also trigger a preview deployment, so creating a work branch does not automatically save Vercel resources. Prefer local/internal reasoning and checks, then one remote push for a coherent tested package.

GitHub Actions minutes must not be used without explicit user approval. When intentionally pushing without CI, use a GitHub-supported skip annotation in the commit message and verify that no workflow run started.
