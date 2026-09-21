-- Atomic edit + recurrence configuration for Quest System v2.

create or replace function public.update_parent_quest_v2(
  p_quest_id uuid,
  p_title text,
  p_description text,
  p_progression_class text,
  p_reward_diamonds integer default 0,
  p_reward_syssel_bux integer default 0,
  p_recurrence_kind text default 'once',
  p_recurrence_weekdays smallint[] default '{}'::smallint[],
  p_recurrence_timezone text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.update_parent_quest(
    p_quest_id, p_title, p_description, p_progression_class,
    p_reward_diamonds, p_reward_syssel_bux
  );
  perform public.set_parent_quest_recurrence(
    p_quest_id, p_recurrence_kind, p_recurrence_weekdays, p_recurrence_timezone
  );
end;
$$;

revoke execute on function public.update_parent_quest_v2(uuid, text, text, text, integer, integer, text, smallint[], text) from public;
revoke execute on function public.update_parent_quest_v2(uuid, text, text, text, integer, integer, text, smallint[], text) from anon;
grant execute on function public.update_parent_quest_v2(uuid, text, text, text, integer, integer, text, smallint[], text) to authenticated;
