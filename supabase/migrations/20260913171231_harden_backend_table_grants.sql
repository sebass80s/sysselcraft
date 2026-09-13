-- Mirror of live migration 20260913171231 harden_backend_table_grants.
-- Client roles only need SELECT on readable tables. Authoritative writes stay behind RPCs.

revoke all on table public.households from anon, authenticated;
revoke all on table public.household_members from anon, authenticated;
revoke all on table public.children from anon, authenticated;
revoke all on table public.child_device_bindings from anon, authenticated;
revoke all on table public.child_pairing_codes from anon, authenticated;
revoke all on table public.parent_quests from anon, authenticated;
revoke all on table public.quest_instances from anon, authenticated;
revoke all on table public.child_game_state from anon, authenticated;
revoke all on table public.reward_events from anon, authenticated;

grant select on table public.households to authenticated;
grant select on table public.household_members to authenticated;
grant select on table public.children to authenticated;
grant select on table public.child_device_bindings to authenticated;
grant select on table public.parent_quests to authenticated;
grant select on table public.quest_instances to authenticated;
grant select on table public.child_game_state to authenticated;
grant select on table public.reward_events to authenticated;
