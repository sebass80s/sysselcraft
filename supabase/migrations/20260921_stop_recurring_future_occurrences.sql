-- When a quest changes from recurring back to one-time, retire untouched
-- generated occurrences so the definition really stops recurring. Historical
-- pending/approved occurrences are never deleted.

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
  v_tz text;
  v_local_date date;
  v_local_isodow integer;
  v_occurrence_key text;
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

  v_tz := coalesce(nullif(trim(p_recurrence_timezone), ''), 'UTC');
  v_local_date := (now() at time zone v_tz)::date;
  v_local_isodow := extract(isodow from now() at time zone v_tz)::integer;

  v_occurrence_key := case
    when p_recurrence_kind = 'daily' then 'day:' || v_local_date::text
    when p_recurrence_kind = 'weekdays' and v_local_isodow = any(v_weekdays)
      then 'day:' || v_local_date::text
    when p_recurrence_kind = 'weekly'
      then 'week:' || to_char(v_local_date, 'IYYY-IW')
    else null
  end;

  update public.parent_quests
  set recurrence_kind = p_recurrence_kind,
      recurrence_weekdays = v_weekdays,
      recurrence_timezone = nullif(trim(p_recurrence_timezone), '')
  where id = p_quest_id;

  if p_recurrence_kind = 'once' then
    delete from public.quest_instances
    where quest_id = p_quest_id
      and state = 'available'
      and occurrence_key <> 'once';
  elsif v_occurrence_key is not null then
    update public.quest_instances
    set occurrence_key = v_occurrence_key
    where quest_id = p_quest_id
      and state = 'available'
      and occurrence_key = 'once';
  end if;
end;
$$;
