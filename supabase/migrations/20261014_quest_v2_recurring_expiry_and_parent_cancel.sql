-- Quest V2 lifecycle: missed recurring chores expire instead of accumulating.
-- Parent may cancel one unsubmitted occurrence without deleting its template.
-- Do not mutate pending/approved work or any reward/claim history.

alter table public.quest_instances
  add column if not exists closed_at timestamptz;

alter table public.quest_instances
  drop constraint if exists quest_instances_state_check;
alter table public.quest_instances
  add constraint quest_instances_state_check
  check (state in ('available', 'active', 'pending', 'approved', 'expired', 'cancelled'));

create or replace function public.cancel_parent_quest_instance(p_instance_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare v_instance public.quest_instances%rowtype;
begin
  select * into v_instance
  from public.quest_instances where id = p_instance_id for update;
  if not found then raise exception 'quest instance not found'; end if;
  if not public.is_household_parent(v_instance.household_id) then
    raise exception 'not authorized';
  end if;
  if v_instance.state = 'cancelled' then return; end if;
  if v_instance.state not in ('available', 'active') then
    raise exception 'only unsubmitted quests can be removed';
  end if;

  update public.quest_instances
  set state = 'cancelled', closed_at = now()
  where id = p_instance_id;
end;
$function$;

revoke all on function public.cancel_parent_quest_instance(uuid) from public, anon;
grant execute on function public.cancel_parent_quest_instance(uuid) to authenticated;

-- List RPCs already return only open states and unclaimed approvals, so
-- expired/cancelled tombstones remain invisible without client-side hiding.
-- Keep the occurrence row: ON CONFLICT must not recreate a cancelled task today.
create or replace function public.materialize_due_quest_instances(p_child_id uuid)
returns integer
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_quest public.parent_quests%rowtype;
  v_tz text;
  v_local_now timestamp;
  v_local_date date;
  v_weekday integer;
  v_occurrence_key text;
  v_inserted integer;
  v_created integer := 0;
begin
  if not (
    public.is_bound_child(p_child_id)
    or exists (
      select 1 from public.children c
      where c.id = p_child_id
        and public.is_household_parent(c.household_id)
    )
  ) then
    raise exception 'not authorized';
  end if;

  -- Row locking on the definition serializes materialization with edits
  -- and other concurrent materializers; the occurrence unique key is backup.
  for v_quest in
    select pq.*
    from public.parent_quests pq
    where pq.archived_at is null
      and pq.recurrence_kind <> 'once'
      and exists (
        select 1 from public.quest_instances qi
        where qi.quest_id = pq.id and qi.child_id = p_child_id
      )
    order by pq.id
    for update of pq
  loop
    v_tz := coalesce(nullif(v_quest.recurrence_timezone, ''), 'UTC');
    v_local_now := now() at time zone v_tz;
    v_local_date := v_local_now::date;
    v_weekday := extract(isodow from v_local_now)::integer;
    v_occurrence_key := null;

    if v_local_now::time < v_quest.recurrence_time
      or v_local_date < (v_quest.created_at at time zone v_tz)::date then
      continue;
    end if;

    if v_quest.recurrence_kind = 'daily'
      or (v_quest.recurrence_kind = 'weekdays'
        and v_weekday = any(v_quest.recurrence_weekdays)) then
      v_occurrence_key := 'day:' || v_local_date::text;
    elsif v_quest.recurrence_kind = 'weekly' then
      v_occurrence_key := 'week:' || to_char(v_local_date, 'IYYY-IW');
    else
      continue;
    end if;

    -- Supersede ONLY past, unfinished recurring occurrences at the NEXT
    -- scheduled release. Submitted/approved instances remain reviewable.
    -- Also retire an older manual instance of this same recurring template;
    -- do not touch an instance manually created within the current period.
    update public.quest_instances qi
    set state = 'expired', closed_at = now()
    where qi.quest_id = v_quest.id
      and qi.child_id = p_child_id
      and qi.state in ('available', 'active')
      and qi.occurrence_key <> v_occurrence_key
      and (
        (v_quest.recurrence_kind = 'weekly'
          and to_char((qi.created_at at time zone v_tz)::date, 'IYYY-IW')
              < to_char(v_local_date, 'IYYY-IW'))
        or (v_quest.recurrence_kind <> 'weekly'
          and (qi.created_at at time zone v_tz)::date < v_local_date)
      );

    insert into public.quest_instances(
      household_id, child_id, quest_id,
      title_snapshot, description_snapshot, progression_class_snapshot,
      reward_diamonds_snapshot, reward_syssel_bux_snapshot, occurrence_key
    ) values (
      v_quest.household_id, p_child_id, v_quest.id,
      v_quest.title, v_quest.description, v_quest.progression_class,
      v_quest.reward_diamonds, v_quest.reward_syssel_bux,
      v_occurrence_key
    )
    on conflict (quest_id, child_id, occurrence_key) do nothing;

    get diagnostics v_inserted = row_count;
    v_created := v_created + v_inserted;
  end loop;

  return v_created;
end;
$function$;

revoke all on function public.materialize_due_quest_instances(uuid) from public, anon;
grant execute on function public.materialize_due_quest_instances(uuid) to authenticated;
