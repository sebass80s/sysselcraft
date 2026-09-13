-- Follow-up indexes from Supabase performance advisor.
create index if not exists idx_child_device_bindings_child on public.child_device_bindings(child_id);
create index if not exists idx_child_device_bindings_household on public.child_device_bindings(household_id);
create index if not exists idx_child_pairing_codes_child on public.child_pairing_codes(child_id);
create index if not exists idx_child_pairing_codes_created_by on public.child_pairing_codes(created_by);
create index if not exists idx_child_pairing_codes_household on public.child_pairing_codes(household_id);
create index if not exists idx_children_household on public.children(household_id);
create index if not exists idx_household_members_user on public.household_members(user_id);
create index if not exists idx_households_created_by on public.households(created_by);
create index if not exists idx_parent_quests_created_by on public.parent_quests(created_by);
create index if not exists idx_parent_quests_household on public.parent_quests(household_id);
create index if not exists idx_quest_instances_approved_by on public.quest_instances(approved_by);
create index if not exists idx_quest_instances_child on public.quest_instances(child_id);
create index if not exists idx_quest_instances_household on public.quest_instances(household_id);
create index if not exists idx_reward_events_child on public.reward_events(child_id);
