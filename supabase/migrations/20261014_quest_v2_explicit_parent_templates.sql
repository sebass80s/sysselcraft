-- An internal quest definition does not automatically become a saved parent template.
-- Keep legacy items visible until deliberately removed. New quest instances and
-- recurring schedules continue to use parent_quests regardless of template status.
alter table public.parent_quests
  add column if not exists saved_as_template boolean not null default false,
  add column if not exists template_child_id uuid references public.children(id);

-- Legacy /parent previously displayed every parent_quest as a template.
-- Preserve that existing library, without modifying any quest instance or reward.
update public.parent_quests pq
set template_child_id = first_child.child_id
from (
  select distinct on (qi.quest_id) qi.quest_id, qi.child_id
  from public.quest_instances qi
  order by qi.quest_id, qi.created_at, qi.id
) first_child
where pq.id = first_child.quest_id and pq.template_child_id is null;

update public.parent_quests
set saved_as_template = true
where template_child_id is not null and saved_as_template = false;

-- A template is a stored parent_quest definition with NO quest instance.
-- It cannot materialise/award anything until the parent explicitly sends an
-- independent real quest through the existing create_parent_quest_v2 RPC.
create or replace function public.create_parent_quest_template_v1(
  p_household_id uuid,
  p_child_id uuid,
  p_title text,
  p_description text,
  p_progression_class text,
  p_reward_diamonds integer,
  p_reward_syssel_bux integer,
  p_recurrence_kind text,
  p_recurrence_weekdays smallint[],
  p_recurrence_timezone text,
  p_recurrence_time time without time zone
) returns uuid
language plpgsql security definer set search_path to 'public'
as $function$
declare
  v_id uuid;
begin
  if not public.is_household_parent(p_household_id) then
    raise exception 'not authorized';
  end if;
  if not exists (
    select 1 from public.children
    where id = p_child_id and household_id = p_household_id
  ) then raise exception 'child does not belong to household'; end if;
  if nullif(btrim(p_title),'') is null or nullif(btrim(p_description),'') is null then
    raise exception 'title and description required';
  end if;
  if p_progression_class not in (
    'orderEnvironment','knowledgeCreativity','wellbeingRoutine','movementActivity','community'
  ) then raise exception 'invalid progression class'; end if;
  if p_reward_diamonds is null or p_reward_diamonds < 0
    or p_reward_syssel_bux is null or p_reward_syssel_bux < 0 then
    raise exception 'invalid reward';
  end if;

  insert into public.parent_quests (
    household_id, created_by, template_child_id, saved_as_template,
    title, description, progression_class, reward_diamonds, reward_syssel_bux,
    recurrence_kind, recurrence_time
  ) values (
    p_household_id, auth.uid(), p_child_id, true,
    left(btrim(p_title),60), left(btrim(p_description),240),
    p_progression_class, p_reward_diamonds, p_reward_syssel_bux,
    'once', coalesce(p_recurrence_time,'08:00'::time)
  ) returning id into v_id;

  perform public.set_parent_quest_recurrence(
    v_id, coalesce(p_recurrence_kind,'once'),
    coalesce(p_recurrence_weekdays, '{}'::smallint[]), p_recurrence_timezone
  );
  return v_id;
end;
$function$;

revoke all on function public.create_parent_quest_template_v1(uuid,uuid,text,text,text,integer,integer,text,smallint[],text,time) from public,anon;
grant execute on function public.create_parent_quest_template_v1(uuid,uuid,text,text,text,integer,integer,text,smallint[],text,time) to authenticated;

-- The saved library includes old parent-approved templates and new standalone
-- templates, but excludes every new unsaved quest.
create or replace function public.list_parent_quest_templates_v1(p_child_id uuid)
returns table(
  quest_id uuid, household_id uuid, child_id uuid, title text, description text,
  progression_class text, reward_diamonds integer, reward_syssel_bux integer,
  recurrence_kind text, recurrence_weekdays smallint[],
  recurrence_timezone text, recurrence_time time without time zone,
  created_at timestamptz
)
language sql stable security definer set search_path to 'public'
as $function$
  select pq.id,pq.household_id,pq.template_child_id,pq.title,pq.description,
    pq.progression_class,pq.reward_diamonds,pq.reward_syssel_bux,
    pq.recurrence_kind,pq.recurrence_weekdays,pq.recurrence_timezone,
    pq.recurrence_time,pq.created_at
  from public.parent_quests pq
  where pq.template_child_id=p_child_id
    and pq.saved_as_template=true and pq.archived_at is null
    and public.is_household_parent(pq.household_id)
  order by pq.created_at desc, pq.id;
$function$;
revoke all on function public.list_parent_quest_templates_v1(uuid) from public,anon;
grant execute on function public.list_parent_quest_templates_v1(uuid) to authenticated;

-- Removing a saved template must NEVER stop an existing recurring schedule
-- or remove active instances. The parent can manage active schedules separately.
create or replace function public.remove_parent_quest_template_v1(p_quest_id uuid)
returns void
language plpgsql security definer set search_path to 'public'
as $function$
declare v_household uuid;
begin
  select household_id into v_household
  from public.parent_quests where id=p_quest_id for update;
  if v_household is null then raise exception 'quest not found'; end if;
  if not public.is_household_parent(v_household) then
    raise exception 'not authorized';
  end if;
  update public.parent_quests
  set saved_as_template=false
  where id=p_quest_id;
end;
$function$;
revoke all on function public.remove_parent_quest_template_v1(uuid) from public,anon;
grant execute on function public.remove_parent_quest_template_v1(uuid) to authenticated;

-- The legacy list_parent_quest_definitions_v2 intentionally continues to
-- manage active recurring schedules, independently from saved templates.
