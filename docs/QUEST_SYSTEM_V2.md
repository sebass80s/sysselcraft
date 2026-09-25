# SysselCraft Quest System v2

Status: **LOCKED PRODUCT DIRECTION · IMPLEMENTATION STAGED**

Date: 2026-09-21

This document is canonical for the next quest/backend iteration. It deliberately preserves existing parent-created quests and reward history while simplifying progression and making quests suitable for daily family use.

## Product law

> **Föräldern skapar verkligheten. SysselCraft skapar berättelsen.**

The parent defines the real-world task and its rewards. The game decides how that task is woven into the village.

## 1. One world-progression resource

All approved quests contribute to **one shared world-progression resource**.

The existing categories:

- Ordning & miljö
- Kunskap & skapande
- Välmående & rutiner
- Rörelse & aktivitet
- Gemenskap

remain useful **metadata**, but they are no longer separate progression point balances.

Categories may later influence quest presentation, variety, statistics, achievements, NPC reactions and world placement. They must not be presented as five separate point systems.

Existing category values on existing quests are valid data and must be preserved. Do not destructively migrate them away.

### Currency is separate

This change does **not** merge the two currencies:

- **SysselBux** are the child's in-game currency for game-world purchases/customisation.
- **Diamonds** represent IRL rewards.

World progression, SysselBux and Diamonds are three different concepts.

## 2. World-aware quest presentation

Parent-created quests must not require the parent to manually choose a spawn coordinate or NPC.

A quest definition stores what the task is, its rewards and useful metadata. The game selects **where, when and through whom** the current quest instance is presented, based on:

- quest category/metadata;
- currently unlocked buildings and areas;
- currently available residents/NPCs;
- world/story progression;
- authored fallback rules.

The first implementation may use conservative fallbacks such as the family house or Linus. Future residents/buildings such as Henning/Bakery and Sol/Clinic can become eligible presentation sources after they are unlocked.

This routing belongs above Phaser in domain/game state. Phaser presents the selected source/marker; it does not decide narrative validity.

## 3. Quest definition/template versus quest instance

Recurring quests require a strict distinction:

**Quest definition/template** = the parent's durable instruction and schedule.

**Quest instance** = one concrete occurrence the child can complete and the parent can review.

Never reset an approved instance back to available to simulate recurrence. A new scheduled occurrence creates a **new instance**.

This is required for trustworthy reward idempotency, history and future statistics.

## 4. Recurring quests

The system shall support:

- one-time;
- daily;
- selected weekdays;
- weekly.

A completed occurrence stays completed for its period. Example: if `Bädda sängen` is completed Tuesday morning, it remains completed for Tuesday; the next scheduled occurrence is a new instance on the next eligible morning.

Exact refresh clock/time-zone semantics must be explicit before scheduler activation. Scheduling must use the child's/family's intended local calendar, not an accidental server-UTC day boundary.

Editing a recurring definition affects **future instances only**. Historical instances retain the values/rewards that actually applied when they were created/reviewed.

Stopping/deleting a recurring quest prevents future instances. It does not erase history.

## 5. Parent CRUD

Parent UI requires **Redigera** and **Ta bort** for quest definitions.

Deletion is archival/soft-delete semantics, not destructive history deletion.

Rules:

- Editing changes the definition used for future instances.
- Existing historical instances keep their historical snapshot.
- An available instance that has not been acted on may only be updated/replaced according to an explicit implementation rule; never silently mutate pending/approved history.
- Removing/archiving a definition stops future recurrence.
- Pending/approved history and reward events must remain intact.

## 6. Backward compatibility and migration

Existing production data already contains category-specific progression and parent-created quests. Migration must therefore be additive.

Required migration posture:

1. Preserve existing `progression_class` values as quest metadata.
2. Preserve all existing quest definitions, instances and reward events.
3. Introduce unified world progression without deleting legacy progression keys in the first migration.
4. New approvals increment the unified world-progression counter exactly once through the same idempotent approval/reward transaction.
5. Do not retroactively mint unified progression for old approvals until an explicit backfill policy is chosen. If a backfill is later desired, it must be deterministic and idempotent.
6. Remove the current `unique (quest_id, child_id)` recurrence blocker before recurring instance generation is enabled, replacing it with an occurrence/idempotency strategy.
7. Recurring generation must be safe to run more than once without producing duplicate occurrences.
8. Existing clients must remain readable during rollout.

## 7. Current implementation facts found in audit

At the 2026-09-21 checkpoint:

- `parent_quests` already acts largely as a quest definition.
- `quest_instances` already represents a child-specific occurrence, but currently has `unique (quest_id, child_id)`, which prevents recurrence.
- `review_quest` awards currencies idempotently through unique `reward_events.quest_instance_id`.
- `review_quest` currently increments one category-specific key in `child_game_state.progression`.
- Parent UI currently creates and reviews quests but has no edit/archive actions.
- `progression_class` is required by the current RPC/schema and is therefore retained as metadata during migration.
- Built-in `Bädda sängen` still belongs to the separate local prototype ledger described in `STATE_OWNERSHIP.md`. Unified backend progression does not silently merge that ledger.

## 8. Staged implementation order

1. Lock this design and preserve the clean iPhone checkpoint.
2. Add backward-compatible backend schema/RPC support for unified progression, edit/archive and recurrence metadata.
3. Add tests for migration/idempotency behavior.
4. Update Parent UI for edit/archive and recurrence controls.
5. Add recurrence materialisation with explicit local-calendar semantics and duplicate protection.
6. Add world-aware quest routing/presentation.
7. Physically verify the real parent → child → submit → approve → reward/progression loop on iPhone.
8. Only then change state-ownership/reconciliation authority.

No Bakery/Henning thresholds are implied by this document.


## 9. Implementation checkpoint 2026-09-21

Implemented on `nova/local-construction-snapshot` after the physical iPhone checkpoint:

- unified `worldProgression` is awarded once per newly approved backend quest instance;
- legacy category counters remain readable but are no longer incremented by the new approval path;
- parent quest definitions support archive, edit and recurrence metadata;
- quest instances snapshot title, description, category and both rewards;
- recurrence kinds: one-time, daily, selected weekdays and calendar-week;
- recurrence uses the browser-supplied IANA timezone stored on the quest definition;
- due occurrences are materialized idempotently through `(quest_id, child_id, occurrence_key)`;
- child quest listing materializes due occurrences before returning them, so recurrence does not depend on the parent opening Parent Mode;
- Parent Mode can configure recurrence and edit/archive definitions;
- create and update + recurrence configuration use atomic v2 RPCs;
- switching recurrence off removes only untouched generated occurrences; pending/approved history is retained.

Current calendar semantics deliberately avoid inventing an arbitrary morning reset hour:
- daily and selected weekdays become due on the relevant local calendar date;
- weekly becomes due once per local ISO calendar week.

World-aware presentation/routing is the next separate layer. It must not change recurrence/reward history semantics.


## 10. World presentation policy

The first pure routing layer is now implemented in `src/game/questPresentation.ts`.

Rules:
- obvious home/routine chores may route to the home;
- food/kitchen chores may route to Henning/Bakery only after both are actually available;
- category metadata and unlocked-world state provide the fallback;
- before later village systems are available, Linus is the safe starter presenter;
- after Recycling completion, generic unlocked-village presentation is allowed;
- the policy is pure and contains no parent-authored spawn location.

This keeps the product rule intact: **the parent creates the real-world task; the game creates its story presentation.**

The current layer chooses a presentation channel only. It intentionally does not spawn Henning, unlock the Bakery, or invent those progression thresholds.


## 11. Noticeboard as a selective quest source

Locked product direction:

- the noticeboard is **a quest source, not the universal quest hub**;
- not every quest must appear on the noticeboard;
- obvious home quests may originate at home;
- NPC/building-linked quests may originate through the relevant unlocked resident/location;
- general quests without a stronger diegetic home may use the noticeboard;
- all active quests must remain discoverable even when they are not on the noticeboard.

The presentation model therefore separates the broad channel (`home`, `noticeboard`, `npc`, `building`) from the concrete presenter/destination. This is intended to scale to Sol and future residents without adding a new top-level channel for every NPC.


## 12. Reusing established world affordances

Backend quest presentation must not create duplicate markers where the village already has a natural interaction affordance.

- Home-routed backend quests reuse the existing home quest marker after onboarding.
- Linus-routed backend quests reuse Linus himself rather than adding a second floating marker.
- The locked first-quest onboarding remains authoritative while it is active.
- Noticeboard quests use the noticeboard's own attention marker.
- Future resident/building sources should follow the same rule: prefer the world's existing interaction affordance over parallel UI.

The source bridge may track several active destinations at once. Opening a concrete source filters the child quest view to quests routed to that destination; the general quest control remains the all-discoverable fallback.


## TODO — parent quest reuse/history UX (locked 2026-09-24)

Parked while physical game testing continues.

- Separate **Edit** from **Activate quest**.
- Editing changes the quest definition only and must not silently create a new occurrence/reward opportunity.
- **Activate quest** explicitly creates a new available occurrence, including intentional reuse of a previously completed once-quest.
- Disable/block activation while the same quest already has an active available or pending occurrence, preventing accidental duplicates.
- Parent history needs a **remove/hide from history** action so the visible list does not grow indefinitely.
- Hiding/removing from the parent UI must not physically delete authoritative `quest_instances` or `reward_events`; completed reward/audit history remains preserved in backend.


## 13. Child quest lifecycle — LOCKED 2026-09-25

The previous three-state child flow is superseded by an explicit acceptance lifecycle:

1. Parent creates/materializes an occurrence → `available`.
2. The world presenter shows `?`: a new quest is available.
3. Child interacts with the presenter and explicitly chooses **Ta uppdraget** → `active`.
4. Only `active` quests appear as actionable quests in the normal **Uppdrag** list and can be marked **Jag är klar**.
5. Submission → `pending`, waiting for parent review.
6. Rejection returns the same occurrence to `active`, not `available`.
7. Approval → `approved`; the child gets `!` at Linus for turn-in/reward claim.
8. Claim is idempotent and may trigger world progression. Any resulting authored story/construction attention uses the speech-bubble language, not quest punctuation.

Locked visual language: `?` = new quest to accept; `!` = completed/approved quest ready to turn in; speech bubble = authored story/dialogue attention; no marker = ordinary optional interaction.

Parent/backend lifecycle grouping is implemented: the parent surface now shows available (`Nya uppdrag hos barnet`), active (`Pågår`), pending review (`Väntar på dig`) and approved/claimed history (`Senast klara`) separately. The remaining parked parent UX work is explicit definition reuse/activation and optional hide-from-visible-history without deleting authoritative audit/reward rows.


## 2026-09-25 handoff

Historical handoff note: this refactor is no longer mid-flight. Section 13 remains the locked state-machine contract. Marker wiring/source filtering are implemented and the core lifecycle has passed physical iPhone acceptance through reject/resubmit/approve/explicit turn-in/restart. See the later 2026-09-25 acceptance records in the canonical readiness/handoff documents.
