-- Allow child refresh to materialize its own due recurring quests before listing.

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
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.materialize_due_quest_instances(p_child_id);

  return query
  select qi.id, pq.id, qi.household_id, qi.child_id,
    qi.title_snapshot, qi.description_snapshot, qi.progression_class_snapshot,
    qi.reward_diamonds_snapshot, qi.reward_syssel_bux_snapshot, qi.state,
    qi.created_at, qi.submitted_at, qi.approved_at
  from public.quest_instances qi
  join public.parent_quests pq on pq.id = qi.quest_id
  where qi.child_id = p_child_id
    and (public.is_bound_child(p_child_id) or public.is_household_parent(qi.household_id))
  order by qi.created_at desc;
end;
$$;
