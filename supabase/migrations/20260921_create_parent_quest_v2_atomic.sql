-- Atomic create + recurrence configuration for Quest System v2.
-- Keeps parent UI from leaving a partially configured quest if a second RPC fails.

create or replace function public.create_parent_quest_v2(
  p_household_id uuid,
  p_child_id uuid,
  p_title text,
  p_description text,
  p_progression_class text,
  p_reward_diamonds integer default 0,
  p_reward_syssel_bux integer default 0,
  p_recurrence_kind text default 'once',
  p_recurrence_weekdays smallint[] default '{}'::smallint[],
  p_recurrence_timezone text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_instance_id uuid;
  v_quest_id uuid;
begin
  v_instance_id := public.create_parent_quest(
    p_household_id, p_child_id, p_title, p_description, p_progression_class,
    p_reward_diamonds, p_reward_syssel_bux
  );

  select quest_id into v_quest_id
  from public.quest_instances
  where id = v_instance_id;

  perform public.set_parent_quest_recurrence(
    v_quest_id, p_recurrence_kind, p_recurrence_weekdays, p_recurrence_timezone
  );

  return v_instance_id;
end;
$$;

revoke execute on function public.create_parent_quest_v2(uuid, uuid, text, text, text, integer, integer, text, smallint[], text) from public;
revoke execute on function public.create_parent_quest_v2(uuid, uuid, text, text, text, integer, integer, text, smallint[], text) from anon;
grant execute on function public.create_parent_quest_v2(uuid, uuid, text, text, text, integer, integer, text, smallint[], text) to authenticated;
