-- Parent quest admin controls: local recurrence time + manual reactivation.
alter table public.parent_quests add column if not exists recurrence_time time without time zone not null default '08:00';

create or replace function public.set_parent_quest_recurrence_time(p_quest_id uuid,p_recurrence_time time without time zone) returns void language plpgsql security definer set search_path to 'public' as $$
declare v_household_id uuid;
begin
 select household_id into v_household_id from public.parent_quests where id=p_quest_id and archived_at is null for update;
 if v_household_id is null then raise exception 'quest not found'; end if;
 if not public.is_household_parent(v_household_id) then raise exception 'not authorized'; end if;
 update public.parent_quests set recurrence_time=coalesce(p_recurrence_time,'08:00'::time) where id=p_quest_id;
end;$$;
revoke all on function public.set_parent_quest_recurrence_time(uuid,time) from public,anon;
grant execute on function public.set_parent_quest_recurrence_time(uuid,time) to authenticated;

create or replace function public.list_parent_quest_definitions_v2(p_child_id uuid)
returns table(quest_id uuid,household_id uuid,child_id uuid,title text,description text,progression_class text,reward_diamonds integer,reward_syssel_bux integer,recurrence_kind text,recurrence_weekdays smallint[],recurrence_timezone text,recurrence_time time without time zone,created_at timestamptz)
language sql stable security definer set search_path to 'public' as $$
 select distinct on(pq.id) pq.id,pq.household_id,qi.child_id,pq.title,pq.description,pq.progression_class,pq.reward_diamonds,pq.reward_syssel_bux,pq.recurrence_kind,pq.recurrence_weekdays,pq.recurrence_timezone,pq.recurrence_time,pq.created_at
 from public.parent_quests pq join public.quest_instances qi on qi.quest_id=pq.id
 where qi.child_id=p_child_id and pq.archived_at is null and public.is_household_parent(pq.household_id)
 order by pq.id,pq.created_at desc;$$;
revoke all on function public.list_parent_quest_definitions_v2(uuid) from public,anon;
grant execute on function public.list_parent_quest_definitions_v2(uuid) to authenticated;

create or replace function public.reactivate_parent_quest(p_quest_id uuid) returns uuid language plpgsql security definer set search_path to 'public' as $$
declare v_q public.parent_quests%rowtype;v_child uuid;v_instance uuid;
begin
 select * into v_q from public.parent_quests where id=p_quest_id and archived_at is null for update;
 if v_q.id is null then raise exception 'quest not found'; end if;
 if not public.is_household_parent(v_q.household_id) then raise exception 'not authorized'; end if;
 select child_id into v_child from public.quest_instances where quest_id=p_quest_id order by created_at limit 1;
 if v_child is null then raise exception 'quest child not found'; end if;
 if exists(select 1 from public.quest_instances where quest_id=p_quest_id and child_id=v_child and state in('available','active','pending','approved')) then raise exception 'quest already open'; end if;
 insert into public.quest_instances(household_id,child_id,quest_id,title_snapshot,description_snapshot,progression_class_snapshot,reward_diamonds_snapshot,reward_syssel_bux_snapshot,occurrence_key)
 values(v_q.household_id,v_child,v_q.id,v_q.title,v_q.description,v_q.progression_class,v_q.reward_diamonds,v_q.reward_syssel_bux,'manual:'||gen_random_uuid()::text) returning id into v_instance;
 return v_instance;
end;$$;
revoke all on function public.reactivate_parent_quest(uuid) from public,anon;
grant execute on function public.reactivate_parent_quest(uuid) to authenticated;

create or replace function public.materialize_due_quest_instances(p_child_id uuid) returns integer language plpgsql security definer set search_path to 'public' as $$
declare v_created integer:=0;
begin
 if not(public.is_bound_child(p_child_id) or exists(select 1 from public.children c where c.id=p_child_id and public.is_household_parent(c.household_id))) then raise exception 'not authorized'; end if;
 with eligible as(
  select pq.id quest_id,pq.household_id,pq.title,pq.description,pq.progression_class,pq.reward_diamonds,pq.reward_syssel_bux,pq.recurrence_kind,pq.recurrence_weekdays,
   (now() at time zone coalesce(nullif(pq.recurrence_timezone,''),'UTC')) local_now,(pq.created_at at time zone coalesce(nullif(pq.recurrence_timezone,''),'UTC'))::date created_local_date,pq.recurrence_time
  from public.parent_quests pq where pq.archived_at is null and pq.recurrence_kind<>'once' and exists(select 1 from public.quest_instances e where e.quest_id=pq.id and e.child_id=p_child_id)
 ),due as(
  select *,local_now::date local_date,
   case when local_now::time<recurrence_time then null when recurrence_kind='daily' then 'day:'||local_now::date::text
    when recurrence_kind='weekdays' and extract(isodow from local_now)::int=any(recurrence_weekdays) then 'day:'||local_now::date::text
    when recurrence_kind='weekly' then 'week:'||to_char(local_now::date,'IYYY-IW') else null end occurrence_key from eligible
 ),inserted as(
  insert into public.quest_instances(household_id,child_id,quest_id,title_snapshot,description_snapshot,progression_class_snapshot,reward_diamonds_snapshot,reward_syssel_bux_snapshot,occurrence_key)
  select household_id,p_child_id,quest_id,title,description,progression_class,reward_diamonds,reward_syssel_bux,occurrence_key from due
  where occurrence_key is not null and local_date>=created_local_date on conflict(quest_id,child_id,occurrence_key) do nothing returning 1)
 select count(*) into v_created from inserted;return v_created;
end;$$;
