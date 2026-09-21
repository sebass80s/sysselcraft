-- Weekly recurrence should be due throughout its ISO week, not only on one
-- weekday. The occurrence key keeps it to one instance per local calendar week.

create or replace function public.materialize_due_quest_instances(p_child_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_created integer := 0;
begin
  if not (
    public.is_bound_child(p_child_id)
    or exists (
      select 1 from public.children c
      where c.id = p_child_id and public.is_household_parent(c.household_id)
    )
  ) then
    raise exception 'not authorized';
  end if;

  with eligible as (
    select
      pq.id as quest_id, pq.household_id, pq.title, pq.description,
      pq.progression_class, pq.reward_diamonds, pq.reward_syssel_bux,
      pq.recurrence_kind, pq.recurrence_weekdays,
      (now() at time zone coalesce(nullif(pq.recurrence_timezone, ''), 'UTC'))::date as local_date,
      extract(isodow from now() at time zone coalesce(nullif(pq.recurrence_timezone, ''), 'UTC'))::int as local_isodow,
      (pq.created_at at time zone coalesce(nullif(pq.recurrence_timezone, ''), 'UTC'))::date as created_local_date
    from public.parent_quests pq
    where pq.archived_at is null
      and pq.recurrence_kind <> 'once'
      and exists (
        select 1 from public.quest_instances existing
        where existing.quest_id = pq.id and existing.child_id = p_child_id
      )
  ), due as (
    select *,
      case
        when recurrence_kind = 'daily' then 'day:' || local_date::text
        when recurrence_kind = 'weekdays' and local_isodow = any(recurrence_weekdays)
          then 'day:' || local_date::text
        when recurrence_kind = 'weekly'
          then 'week:' || to_char(local_date, 'IYYY-IW')
        else null
      end as occurrence_key
    from eligible
  ), inserted as (
    insert into public.quest_instances(
      household_id, child_id, quest_id,
      title_snapshot, description_snapshot, progression_class_snapshot,
      reward_diamonds_snapshot, reward_syssel_bux_snapshot, occurrence_key
    )
    select
      household_id, p_child_id, quest_id,
      title, description, progression_class,
      reward_diamonds, reward_syssel_bux, occurrence_key
    from due
    where occurrence_key is not null
      and local_date >= created_local_date
    on conflict (quest_id, child_id, occurrence_key) do nothing
    returning 1
  )
  select count(*) into v_created from inserted;

  return v_created;
end;
$$;
