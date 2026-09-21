-- Parent-facing quest definitions for Quest System v2.
-- Returns active definitions separately from occurrence history.

create or replace function public.list_parent_quest_definitions(p_child_id uuid)
returns table (
  quest_id uuid,
  household_id uuid,
  child_id uuid,
  title text,
  description text,
  progression_class text,
  reward_diamonds integer,
  reward_syssel_bux integer,
  recurrence_kind text,
  recurrence_weekdays smallint[],
  recurrence_timezone text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (pq.id)
    pq.id,
    pq.household_id,
    qi.child_id,
    pq.title,
    pq.description,
    pq.progression_class,
    pq.reward_diamonds,
    pq.reward_syssel_bux,
    pq.recurrence_kind,
    pq.recurrence_weekdays,
    pq.recurrence_timezone,
    pq.created_at
  from public.parent_quests pq
  join public.quest_instances qi on qi.quest_id = pq.id
  where qi.child_id = p_child_id
    and pq.archived_at is null
    and public.is_household_parent(pq.household_id)
  order by pq.id, pq.created_at desc;
$$;

revoke execute on function public.list_parent_quest_definitions(uuid) from public;
revoke execute on function public.list_parent_quest_definitions(uuid) from anon;
grant execute on function public.list_parent_quest_definitions(uuid) to authenticated;
