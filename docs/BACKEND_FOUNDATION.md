# Backend Foundation v1

Status: **LIVE FOUNDATION CONNECTED · CORE RPC LOGIC TRANSACTION-TESTED**

Sysselcraft now has a live Supabase backend boundary for separate parent and child devices without moving game-domain logic into Phaser.

## Current verified state

- Supabase is connected with public URL + publishable key only.
- Parent email magic-link authentication works through `/parent`.
- Anonymous child auth is enabled for device pairing.
- The first real household, child profile and parent-created quest exist in the live database.
- `/pair` creates/uses an anonymous child session and stores the paired child id through Capacitor Preferences.
- The child game surface has a backend quest inbox that can list parent-created quests, submit them and read server-authoritative rewards.
- The parent surface can create quests, review pending quests, switch child context and generate one-time pairing codes.
- Core database transitions have been verified inside rollback-only transactions: submit, approve, repeat approval, pairing creation/redemption and one-time-code reuse rejection.

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
- Pairing codes are single-use and expire after 15 minutes.
- `review_quest()` owns reward issuance. A child can submit but cannot approve or mint currency.
- `reward_events.quest_instance_id` is unique and `review_quest()` only updates wallet/progression when the reward row was newly inserted, making approval idempotent.
- Never expose the service-role key to any client.

## Client boundary

`src/backend/` owns public config, Supabase client construction, auth helpers, device pairing persistence, backend types and repository calls.

React parent/child UI should use this boundary rather than importing Supabase directly. Phaser remains a renderer/gameplay surface and should not gain account/auth/database responsibilities.

The existing Capacitor Preferences local save remains intact during backend rollout. Do not delete or silently replace local progression until reconciliation has been designed and tested on a physical iPhone.

## Live security hardening

Additive live migrations applied on 2026-09-13 and mirrored in the repository:

- `20260913171231_harden_backend_table_grants.sql`: removes excess client table privileges such as TRUNCATE/TRIGGER/REFERENCES and restores SELECT only on readable tables.
- `20260913171421_reconcile_backend_rpc_hardening.sql`: records anonymous-only child pairing and explicit idempotent reward issuance.
- `20260913172551_fix_pairing_pgcrypto_schema.sql`: fixes pairing-code generation/redemption by explicitly addressing Supabase's `extensions` schema for `pgcrypto` while the RPC search path remains pinned to `public`.

The third migration came from an actual rollback test: `create_child_pairing_code()` initially failed because unqualified `gen_random_bytes()` was not visible through its restricted search path. After qualifying `extensions.gen_random_bytes()` and `extensions.digest()`, the full pairing transaction passed.

Supabase advisors are **not completely clean**. Expected notices remain around intentional `SECURITY DEFINER` authenticated RPCs and anonymous-auth-aware RLS policies. `child_pairing_codes` intentionally has RLS with no direct policy because pairing is RPC-only. New indexes can appear as unused on the nearly empty database.

## Rollback-only backend verification

Tests were executed against the real live schema inside explicit transactions followed by `ROLLBACK`, then persistent state was re-read to verify no user data changed.

### Quest/reward path

1. Bind a temporary simulated child identity.
2. Submit the existing available quest.
3. Assert `available -> pending`.
4. Switch to parent identity and approve.
5. Approve the same instance again.
6. Assert state is `approved` in-transaction.
7. Assert exactly one `reward_events` row exists.
8. Assert wallet increases by exactly the configured reward, once.
9. Roll back.
10. Re-read persistent state: original quest still `available`, wallet still `0/0`, reward count still `0`.

### Pairing path

1. Parent creates an 8-character one-time code.
2. Assert parent session cannot redeem it as a child.
3. Assert anonymous child session cannot create pairing codes.
4. Anonymous child redeems the code and receives the expected child id.
5. Assert the same code cannot be redeemed twice.
6. Roll back.

## Migration-history caveat

The live project was provisioned in several small migrations, including one harmless no-op placeholder, while the repository originally recorded the foundation as one consolidated migration plus an index migration. The additive hardening/fix migrations now match live history by version/name, but do not introduce a CLI-driven production migration workflow until the earlier history drift has been reconciled deliberately.

## Current vertical slice

1. Parent signs in. ✅
2. Household + child profile exist. ✅
3. Parent creates a one-off quest. ✅
4. Parent generates a pairing code. Backend logic verified; real-device UX remains to test.
5. Child device opens `/pair`, creates an anonymous session and redeems the code. Backend logic verified; real-device UX remains to test.
6. Parent-created quest appears in the child quest inbox.
7. Child submits the quest (`available -> pending`). Backend transition verified.
8. Parent approves or returns it. Approval transition verified.
9. Approval creates exactly one reward event and updates server wallet/progression exactly once. ✅ transaction-tested.
10. Local save/backend reconciliation is verified before backend becomes authoritative for the rest of the village.

The next manual test should therefore test the **browser/native surfaces and session handoff**, not the database reward algorithm again.

## Deferred deliberately

- recurrence/scheduling
- analytics dashboards
- complex achievement/settings surfaces
- push notifications
- service-role/admin tooling in the client
- automatic migration of local world flags
- replacing the local built-in first-quest save before reconciliation is proven
