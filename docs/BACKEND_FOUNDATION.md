# Backend Foundation v1

Status: **LIVE FOUNDATION CONNECTED · FIRST REAL FAMILY + QUEST VERIFIED**

Sysselcraft now has a live Supabase backend boundary for separate parent and child devices without moving game-domain logic into Phaser.

## Current verified state

- Supabase project is connected in production with public URL + publishable key only.
- Parent email magic-link authentication works through `/parent`.
- Anonymous child auth is enabled for device pairing.
- First real household and child profile have been created successfully.
- First real parent-created quest has been written to the backend and is currently available to the child.
- `/pair` creates/uses an anonymous child session and stores the paired child id through Capacitor Preferences.
- The child game surface has a backend quest inbox that can list parent-created quests, submit them and read server-authoritative rewards.
- The parent surface can create quests, review pending quests and generate one-time pairing codes.

## Chosen platform

Supabase provides Postgres, Auth and Row Level Security. The browser/native app uses only the public project URL and publishable key. Never place a service-role key in the app.

## Data model

- `households`: one family space.
- `household_members`: authenticated adults with `owner` or `parent` role.
- `children`: child profiles owned by a household.
- `child_device_bindings`: binds an authenticated anonymous child-device session to one child profile.
- `parent_quests`: quest definition data created by adults.
- `quest_instances`: per-child lifecycle state (`available -> pending -> approved`, with `pending -> available`).
- `child_game_state`: server-authoritative currencies, progression and world flags.
- `reward_events`: one immutable reward record per approved quest instance.
- `child_pairing_codes`: short-lived, one-time hashes used to pair a child device without child email/password.

## Security model

- Parents authenticate through Supabase Auth.
- Child devices use anonymous Supabase Auth and redeem a one-time pairing code.
- RLS restricts parent reads to household membership and child reads to the bound child.
- App roles have SELECT-only direct table access where reads are required. Authoritative mutations go through RPC functions.
- Pairing codes have no direct client table access.
- Child pairing explicitly requires an anonymous session; a parent session cannot be reused as a child identity.
- `review_quest()` owns reward issuance. A child can submit but cannot approve or mint currency.
- `reward_events.quest_instance_id` is unique and `review_quest()` only updates wallet/progression when the reward row was newly inserted, making approval idempotent.
- Never expose the service-role key to any client.

## Client boundary

`src/backend/` owns public config, Supabase client construction, auth helpers, device pairing persistence, backend types and repository calls.

React parent/child UI should use this boundary rather than importing Supabase directly. Phaser remains a renderer/gameplay surface and should not gain account/auth/database responsibilities.

The existing Capacitor Preferences local save remains intact during backend rollout. Do not delete or silently replace local progression until reconciliation has been designed and tested on a physical iPhone.

## Live security hardening

Two additive live migrations were applied on 2026-09-13 and mirrored in the repository:

- `20260913171231_harden_backend_table_grants.sql`: removes excess client table privileges such as TRUNCATE/TRIGGER/REFERENCES and restores SELECT only on readable tables.
- `20260913171421_reconcile_backend_rpc_hardening.sql`: records anonymous-only child pairing and explicit idempotent reward issuance.

Supabase advisors are **not completely clean**. Expected notices remain around intentional `SECURITY DEFINER` authenticated RPCs and anonymous-auth-aware RLS policies. `child_pairing_codes` intentionally has RLS with no direct policy because pairing is RPC-only. New indexes can appear as unused on the nearly empty database.

## Migration-history caveat

The live project was provisioned in several small migrations, including one harmless no-op placeholder, while the repository originally recorded the foundation as one consolidated migration plus an index migration. The additive hardening migrations now match live history by version/name, but do not introduce a CLI-driven migration workflow until the earlier history drift has been reconciled deliberately.

## Current vertical slice

1. Parent signs in. ✅
2. Household + child profile exist. ✅
3. Parent creates a one-off quest. ✅
4. Parent generates a pairing code.
5. Child device opens `/pair`, creates an anonymous session and redeems the code.
6. Parent-created quest appears in the child quest inbox.
7. Child submits the quest (`available -> pending`).
8. Parent approves or returns it.
9. Approval creates exactly one reward event and updates server wallet/progression exactly once.
10. Local save/backend reconciliation is verified before backend becomes authoritative for the rest of the village.

The database currently contains a real available test quest, so the next manual end-to-end session should begin at step 4 rather than create another family from scratch.

## Deferred deliberately

- recurrence/scheduling
- analytics dashboards
- complex achievement/settings surfaces
- push notifications
- service-role/admin tooling in the client
- automatic migration of local world flags
- replacing the local built-in first-quest save before reconciliation is proven
