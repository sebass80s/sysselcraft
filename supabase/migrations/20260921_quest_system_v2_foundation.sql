-- Quest System v2 foundation: unified world progression, immutable instance snapshots,
-- editable/archivable quest definitions, and recurrence-ready schema.
-- Recurrence scheduling itself is intentionally NOT activated by this migration.

alter table public.parent_quests
  add column if not exists archived_at timestamptz,
  add column if not exists recurrence_kind text not null default 'once',
  add column if not exists recurrence_weekdays smallint[] not null default '{}'::smallint[],
  add column if not exists recurrence_timezone text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'parent_quests_recurrence_kind_check'
      and conrelid = 'public.parent_quests'::regclass
  ) then
    alter table public.parent_quests
      add constraint parent_quests_recurrence_kind_check
      check (recurrence_kind in ('once', 'daily', 'weekdays', 'weekly'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'parent_quests_recurrence_weekdays_check'
      and conrelid = 'public.parent_quests'::regclass
  ) then
    alter table public.parent_quests
      add constraint parent_quests_recurrence_weekdays_check
      check (
        recurrence_weekdays <@ array[1,2,3,4,5,6,7]::smallint[]
        and cardinality(recurrence_weekdays) <= 7
      );
  end if;
end $$;

alter table public.quest_instances
  add column if not exists title_snapshot text,
  add column if not exists description_snapshot text,
  add column if not exists progression_class_snapshot text,
  add column if not exists reward_diamonds_snapshot integer,
  add column if not exists reward_syssel_bux_snapshot integer,
  add column if not exists occurrence_key text;

update public.quest_instances qi
set title_snapshot = coalesce(qi.title_snapshot, pq.title),
    description_snapshot = coalesce(qi.description_snapshot, pq.description),
    progression_class_snapshot = coalesce(qi.progression_class_snapshot, pq.progression_class),
    reward_diamonds_snapshot = coalesce(qi.reward_diamonds_snapshot, pq.reward_diamonds),
    reward_syssel_bux_snapshot = coalesce(qi.reward_syssel_bux_snapshot, pq.reward_syssel_bux),
    occurrence_key = coalesce(qi.occurrence_key, 'legacy:' || qi.id::text)
from public.parent_quests pq
where pq.id = qi.quest_id;

alter table public.quest_instances
  alter column title_snapshot set not null,
  alter column description_snapshot set not null,
  alter column progression_class_snapshot set not null,
  alter column reward_diamonds_snapshot set not null,
  alter column reward_syssel_bux_snapshot set not null,
  alter column occurrence_key set not null;

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'quest_instances_quest_id_child_id_key'
      and conrelid = 'public.quest_instances'::regclass
  ) then
    alter table public.quest_instances
      drop constraint quest_instances_quest_id_child_id_key;
  end if;
end $$;

create unique index if not exists quest_instances_occurrence_unique
  on public.quest_instances(quest_id, child_id, occurrence_key);

alter table public.child_game_state
  alter column progression set default
    '{"orderEnvironment":0,"knowledgeCreativity":0,"wellbeingRoutine":0,"movementActivity":0,"community":0,"worldProgression":0}'::jsonb;

update public.child_game_state
set progression = progression || jsonb_build_object(
  'worldProgression',
  coalesce((progression ->> 'worldProgression')::integer, 0)
)
where not (progression ? 'worldProgression');

create or replace function public.create_parent_quest(
  p_household_id uuid,
  p_child_id uuid,
  p_title text,
  p_description text,
  p_progression_class text,
  p_reward_diamonds integer default 0,
  p_reward_syssel_bux integer default 0
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_quest_id uuid;
  v_instance_id uuid;
  v_title text;
  v_description text;
  v_diamonds integer;
  v_syssel_bux integer;
begin
  if not public.is_household_parent(p_household_id) then raise exception 'not authorized'; end if;
  if not exists (select 1 from public.children where id = p_child_id and household_id = p_household_id) then
    raise exception 'child does not belong to household';
  end if;
  if trim(p_title) = '' or trim(p_description) = '' then raise exception 'title and description required'; end if;
  if p_progression_class not in ('orderEnvironment','knowledgeCreativity','wellbeingRoutine','movementActivity','community') then
    raise exception 'invalid progression class';
  end if;

  v_title := left(trim(p_title), 60);
  v_description := left(trim(p_description), 240);
  v_diamonds := greatest(0, p_reward_diamonds);
  v_syssel_bux := greatest(0, p_reward_syssel_bux);

  insert into public.parent_quests(
    household_id, created_by, title, description, progression_class,
    reward_diamonds, reward_syssel_bux, recurrence_kind
  ) values (
    p_household_id, auth.uid(), v_title, v_description, p_progression_class,
    v_diamonds, v_syssel_bux, 'once'
  ) returning id into v_quest_id;

  insert into public.quest_instances(
    household_id, child_id, quest_id,
    title_snapshot, description_snapshot, progression_class_snapshot,
    reward_diamonds_snapshot, reward_syssel_bux_snapshot, occurrence_key
  ) values (
    p_household_id, p_child_id, v_quest_id,
    v_title, v_description, p_progression_class,
    v_diamonds, v_syssel_bux, 'once'
  )
  returning id into v_instance_id;

  return v_instance_id;
end;
$$;

create or replace function public.list_child_quests(p_child_id uuid)
returns table (
  instance_id uuid,
  quest_id uuid,
  household_id uuid,
  child_id uuid,
  title text,
  description text,
  progression_class text,
  reward_diamonds integer,
  reward_syssel_bux integer,
  state text,
  created_at timestamptz,
  submitted_at timestamptz,
  approved_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select qi.id, pq.id, qi.household_id, qi.child_id,
    qi.title_snapshot, qi.description_snapshot, qi.progression_class_snapshot,
    qi.reward_diamonds_snapshot, qi.reward_syssel_bux_snapshot, qi.state,
    qi.created_at, qi.submitted_at, qi.approved_at
  from public.quest_instances qi
  join public.parent_quests pq on pq.id = qi.quest_id
  where qi.child_id = p_child_id
    and (public.is_bound_child(p_child_id) or public.is_household_parent(qi.household_id))
  order by qi.created_at desc;
$$;

create or replace function public.update_parent_quest(
  p_quest_id uuid,
  p_title text,
  p_description text,
  p_progression_class text,
  p_reward_diamonds integer default 0,
  p_reward_syssel_bux integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_quest public.parent_quests%rowtype;
  v_title text;
  v_description text;
  v_diamonds integer;
  v_syssel_bux integer;
begin
  select * into v_quest from public.parent_quests where id = p_quest_id for update;
  if not found then raise exception 'quest not found'; end if;
  if not public.is_household_parent(v_quest.household_id) then raise exception 'not authorized'; end if;
  if v_quest.archived_at is not null then raise exception 'quest is archived'; end if;
  if trim(p_title) = '' or trim(p_description) = '' then raise exception 'title and description required'; end if;
  if p_progression_class not in ('orderEnvironment','knowledgeCreativity','wellbeingRoutine','movementActivity','community') then
    raise exception 'invalid progression class';
  end if;

  v_title := left(trim(p_title), 60);
  v_description := left(trim(p_description), 240);
  v_diamonds := greatest(0, p_reward_diamonds);
  v_syssel_bux := greatest(0, p_reward_syssel_bux);

  update public.parent_quests
  set title = v_title,
      description = v_description,
      progression_class = p_progression_class,
      reward_diamonds = v_diamonds,
      reward_syssel_bux = v_syssel_bux
  where id = p_quest_id;

  -- Available occurrences have not been acted on yet and may follow the edited
  -- definition. Pending/approved snapshots remain immutable history.
  update public.quest_instances
  set title_snapshot = v_title,
      description_snapshot = v_description,
      progression_class_snapshot = p_progression_class,
      reward_diamonds_snapshot = v_diamonds,
      reward_syssel_bux_snapshot = v_syssel_bux
  where quest_id = p_quest_id and state = 'available';
end;
$$;

create or replace function public.archive_parent_quest(p_quest_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_household_id uuid;
begin
  select household_id into v_household_id
  from public.parent_quests
  where id = p_quest_id
  for update;

  if v_household_id is null then raise exception 'quest not found'; end if;
  if not public.is_household_parent(v_household_id) then raise exception 'not authorized'; end if;

  update public.parent_quests
  set archived_at = coalesce(archived_at, now())
  where id = p_quest_id;

  -- Unstarted occurrences may disappear safely. Pending/approved instances are
  -- retained so review/history and reward idempotency remain intact.
  delete from public.quest_instances
  where quest_id = p_quest_id and state = 'available';
end;
$$;

create or replace function public.review_quest(p_instance_id uuid, p_approve boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_instance public.quest_instances%rowtype;
begin
  select * into v_instance from public.quest_instances where id = p_instance_id for update;
  if not found then raise exception 'quest not found'; end if;
  if not public.is_household_parent(v_instance.household_id) then raise exception 'not authorized'; end if;

  if p_approve then
    if v_instance.state = 'approved' then return; end if;
    if v_instance.state <> 'pending' then raise exception 'quest is not pending'; end if;

    update public.quest_instances
    set state = 'approved', approved_at = now(), approved_by = auth.uid()
    where id = p_instance_id;

    insert into public.reward_events(quest_instance_id, child_id, diamonds, syssel_bux, progression_class)
    values (
      p_instance_id,
      v_instance.child_id,
      v_instance.reward_diamonds_snapshot,
      v_instance.reward_syssel_bux_snapshot,
      v_instance.progression_class_snapshot
    )
    on conflict (quest_instance_id) do nothing;

    if found then
      update public.child_game_state
      set diamonds = diamonds + v_instance.reward_diamonds_snapshot,
          syssel_bux = syssel_bux + v_instance.reward_syssel_bux_snapshot,
          progression = jsonb_set(
            progression,
            array['worldProgression'],
            to_jsonb(coalesce((progression ->> 'worldProgression')::integer, 0) + 1),
            true
          ),
          updated_at = now()
      where child_id = v_instance.child_id;
    end if;
  else
    if v_instance.state <> 'pending' then raise exception 'quest is not pending'; end if;
    update public.quest_instances
    set state = 'available', submitted_at = null
    where id = p_instance_id;
  end if;
end;
$$;

revoke execute on function public.update_parent_quest(uuid, text, text, text, integer, integer) from public;
revoke execute on function public.archive_parent_quest(uuid) from public;

grant execute on function public.update_parent_quest(uuid, text, text, text, integer, integer) to authenticated;
grant execute on function public.archive_parent_quest(uuid) to authenticated;
