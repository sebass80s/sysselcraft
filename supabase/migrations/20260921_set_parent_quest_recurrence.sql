-- Quest recurrence configuration only. Scheduling/materialisation is deliberately separate.

create or replace function public.set_parent_quest_recurrence(
  p_quest_id uuid,
  p_recurrence_kind text,
  p_recurrence_weekdays smallint[] default '{}'::smallint[],
  p_recurrence_timezone text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_household_id uuid;
  v_weekdays smallint[];
begin
  select household_id into v_household_id
  from public.parent_quests
  where id = p_quest_id and archived_at is null
  for update;

  if v_household_id is null then raise exception 'quest not found'; end if;
  if not public.is_household_parent(v_household_id) then raise exception 'not authorized'; end if;
  if p_recurrence_kind not in ('once', 'daily', 'weekdays', 'weekly') then
    raise exception 'invalid recurrence kind';
  end if;

  v_weekdays := case
    when p_recurrence_kind = 'weekdays'
      then coalesce((select array_agg(distinct d order by d)
                     from unnest(coalesce(p_recurrence_weekdays, '{}'::smallint[])) d
                     where d between 1 and 7), '{}'::smallint[])
    else '{}'::smallint[]
  end;

  if p_recurrence_kind = 'weekdays' and cardinality(v_weekdays) = 0 then
    raise exception 'selected weekdays required';
  end if;

  update public.parent_quests
  set recurrence_kind = p_recurrence_kind,
      recurrence_weekdays = v_weekdays,
      recurrence_timezone = nullif(trim(p_recurrence_timezone), '')
  where id = p_quest_id;
end;
$$;

revoke execute on function public.set_parent_quest_recurrence(uuid, text, smallint[], text) from public;
revoke execute on function public.set_parent_quest_recurrence(uuid, text, smallint[], text) from anon;
grant execute on function public.set_parent_quest_recurrence(uuid, text, smallint[], text) to authenticated;
