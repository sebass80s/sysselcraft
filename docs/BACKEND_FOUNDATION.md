# Backend Foundation v1

Status: CODE READY, SUPABASE PROJECT CONNECTION REQUIRED

Sysselcraft now has a backend boundary designed for separate parent and child devices without moving game-domain logic into Phaser.

## Chosen platform

Supabase provides Postgres, Auth, Row Level Security and Realtime. The browser/mobile app uses only the public project URL and publishable key. Never place a service-role key in the app.

## Data model

- `households`: one family space.
- `household_members`: authenticated adults with `owner` or `parent` role.
- `children`: child profiles owned by a household.
- `child_device_bindings`: binds an authenticated anonymous child-device session to one child profile.
- `parent_quests`: reusable quest definition data created by adults.
- `quest_instances`: per-child lifecycle state (`available -> pending -> approved`, with `pending -> available`).
- `child_game_state`: server-authoritative currencies, progression and world flags.
- `reward_events`: one immutable reward record per approved quest instance. The unique quest-instance constraint makes approval idempotent.
- `child_pairing_codes`: short-lived, one-time hashes used to pair a child device without requiring child email/password.

## Security model

- Parents authenticate through Supabase Auth (first client helper uses email magic-link/OTP).
- Child devices create an anonymous Supabase Auth session and redeem a one-time pairing code.
- RLS allows parents to read only households they belong to and child devices to read only their bound child data.
- Direct table mutations are revoked for app roles. Domain mutations go through security-definer RPC functions that validate membership, child binding and legal quest transitions.
- `review_quest()` owns reward issuance. The child can only submit an available quest; it cannot mint currency or approve itself.

## Client boundary

`src/backend/` contains the public config reader, Supabase client, auth helpers, backend data types and family repository. Parent-mode React UI should call this repository rather than Supabase directly.

The existing Capacitor Preferences save remains available while backend rollout is staged. Do not delete local persistence until migration/reconciliation for an existing child's save has been designed and tested on a physical iPhone.

## Provisioning

Apply `supabase/migrations/20260913_backend_foundation.sql` to the Supabase project, enable Anonymous Sign-Ins for child-device pairing, and configure:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Use `.env.example` as the template. Add the same variables to Vercel for Preview and Production when the project is connected.

## First vertical slice after provisioning

1. Parent signs in and creates a household.
2. Parent creates a child profile.
3. Parent generates a pairing code.
4. Child iPhone creates an anonymous session and redeems the code.
5. Parent creates a one-off quest.
6. Child sees it and submits it.
7. Parent approves or returns it.
8. Approval updates the server-side reward ledger and child game state exactly once.
9. Local save/backend reconciliation is verified before backend state becomes the only source of truth.

## Deferred deliberately

- recurrence and scheduling
- analytics dashboards
- multiple reward item types
- push notifications
- service-role/admin tooling in the client
- automatic migration of every local world flag
