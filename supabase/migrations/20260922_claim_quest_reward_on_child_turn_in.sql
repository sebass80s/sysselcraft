alter table public.quest_instances
  add column if not exists claimed_at timestamptz;

-- Existing approvals were paid under the old contract. Mark them claimed so they can never be paid again.
update public.quest_instances qi
set claimed_at = coalesce(qi.claimed_at, qi.approved_at)
where qi.state = 'approved'
  and qi.approved_at is not null
  and exists (
    select 1 from public.reward_events re where re.quest_instance_id = qi.id
  );

create or replace function public.review_quest(p_instance_id uuid, p_approve boolean)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
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
    set state = 'approved', approved_at = now(), approved_by = auth.uid(), claimed_at = null
    where id = p_instance_id;
  else
    if v_instance.state <> 'pending' then raise exception 'quest is not pending'; end if;
    update public.quest_instances set state = 'available', submitted_at = null where id = p_instance_id;
  end if;
end;
$function$;

create or replace function public.claim_quest_reward(p_instance_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_instance public.quest_instances%rowtype;
  v_inserted integer := 0;
begin
  select * into v_instance from public.quest_instances where id = p_instance_id for update;
  if not found then raise exception 'quest not found'; end if;
  if not public.is_bound_child(v_instance.child_id) then raise exception 'not authorized'; end if;
  if v_instance.state <> 'approved' then raise exception 'quest is not approved'; end if;
  if v_instance.claimed_at is not null then return; end if;

  insert into public.reward_events(quest_instance_id, child_id, diamonds, syssel_bux, progression_class)
  values (p_instance_id, v_instance.child_id, v_instance.reward_diamonds_snapshot,
    v_instance.reward_syssel_bux_snapshot, v_instance.progression_class_snapshot)
  on conflict (quest_instance_id) do nothing;
  get diagnostics v_inserted = row_count;

  if v_inserted = 1 then
    update public.child_game_state
    set diamonds = diamonds + v_instance.reward_diamonds_snapshot,
        syssel_bux = syssel_bux + v_instance.reward_syssel_bux_snapshot,
        progression = jsonb_set(progression, array['worldProgression'],
          to_jsonb(coalesce((progression ->> 'worldProgression')::integer, 0) + 1), true),
        updated_at = now()
    where child_id = v_instance.child_id;
  end if;

  update public.quest_instances set claimed_at = now() where id = p_instance_id;
end;
$function$;

revoke all on function public.claim_quest_reward(uuid) from public, anon;
grant execute on function public.claim_quest_reward(uuid) to authenticated;

drop function if exists public.list_child_quests(uuid);
create function public.list_child_quests(p_child_id uuid)
returns table(
  instance_id uuid, quest_id uuid, household_id uuid, child_id uuid,
  title text, description text, progression_class text,
  reward_diamonds integer, reward_syssel_bux integer, state text,
  created_at timestamptz, submitted_at timestamptz, approved_at timestamptz, claimed_at timestamptz
)
language plpgsql security definer set search_path to 'public'
as $function$
begin
  perform public.materialize_due_quest_instances(p_child_id);
  return query
  select qi.id, pq.id, qi.household_id, qi.child_id,
    qi.title_snapshot, qi.description_snapshot, qi.progression_class_snapshot,
    qi.reward_diamonds_snapshot, qi.reward_syssel_bux_snapshot, qi.state,
    qi.created_at, qi.submitted_at, qi.approved_at, qi.claimed_at
  from public.quest_instances qi join public.parent_quests pq on pq.id = qi.quest_id
  where qi.child_id = p_child_id
    and (public.is_bound_child(p_child_id) or public.is_household_parent(qi.household_id))
  order by qi.created_at desc;
end;
$function$;

revoke all on function public.list_child_quests(uuid) from public, anon;
grant execute on function public.list_child_quests(uuid) to authenticated;
