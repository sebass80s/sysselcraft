-- Sysselcraft backend foundation v1
-- Parent accounts use Supabase Auth. Child devices use anonymous Auth sessions
-- and are bound to one child profile through a short-lived pairing code.

create extension if not exists pgcrypto;

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'parent')),
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  dog_name text not null default '' check (char_length(dog_name) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.child_device_bindings (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  household_id uuid not null references public.households(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.child_pairing_codes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  code_hash bytea not null unique,
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.parent_quests (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null check (char_length(title) between 1 and 60),
  description text not null check (char_length(description) between 1 and 240),
  progression_class text not null check (progression_class in (
    'orderEnvironment', 'knowledgeCreativity', 'wellbeingRoutine', 'movementActivity', 'community'
  )),
  reward_diamonds integer not null default 0 check (reward_diamonds >= 0),
  reward_syssel_bux integer not null default 0 check (reward_syssel_bux >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.quest_instances (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  quest_id uuid not null references public.parent_quests(id) on delete cascade,
  state text not null default 'available' check (state in ('available', 'pending', 'approved')),
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  unique (quest_id, child_id)
);

create table if not exists public.child_game_state (
  child_id uuid primary key references public.children(id) on delete cascade,
  diamonds integer not null default 0 check (diamonds >= 0),
  syssel_bux integer not null default 0 check (syssel_bux >= 0),
  progression jsonb not null default '{"orderEnvironment":0,"knowledgeCreativity":0,"wellbeingRoutine":0,"movementActivity":0,"community":0}'::jsonb,
  world_flags jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.reward_events (
  id uuid primary key default gen_random_uuid(),
  quest_instance_id uuid not null unique references public.quest_instances(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  diamonds integer not null check (diamonds >= 0),
  syssel_bux integer not null check (syssel_bux >= 0),
  progression_class text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_household_parent(p_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.household_members hm
    where hm.household_id = p_household_id and hm.user_id = auth.uid()
  );
$$;

create or replace function public.is_bound_child(p_child_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.child_device_bindings b
    where b.child_id = p_child_id and b.auth_user_id = auth.uid()
  );
$$;

alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.children enable row level security;
alter table public.child_device_bindings enable row level security;
alter table public.child_pairing_codes enable row level security;
alter table public.parent_quests enable row level security;
alter table public.quest_instances enable row level security;
alter table public.child_game_state enable row level security;
alter table public.reward_events enable row level security;

create policy "parents read households" on public.households
for select using (public.is_household_parent(id));

create policy "parents read members" on public.household_members
for select using (public.is_household_parent(household_id));

create policy "parents or bound child read children" on public.children
for select using (public.is_household_parent(household_id) or public.is_bound_child(id));

create policy "parents read bindings" on public.child_device_bindings
for select using (public.is_household_parent(household_id));

create policy "parents read parent quests" on public.parent_quests
for select using (public.is_household_parent(household_id));

create policy "parents or bound child read instances" on public.quest_instances
for select using (public.is_household_parent(household_id) or public.is_bound_child(child_id));

create policy "parents or bound child read game state" on public.child_game_state
for select using (
  public.is_bound_child(child_id)
  or exists (
    select 1 from public.children c
    where c.id = child_game_state.child_id and public.is_household_parent(c.household_id)
  )
);

create policy "parents read rewards" on public.reward_events
for select using (
  exists (
    select 1 from public.children c
    where c.id = reward_events.child_id and public.is_household_parent(c.household_id)
  )
);

revoke insert, update, delete on public.households from anon, authenticated;
revoke insert, update, delete on public.household_members from anon, authenticated;
revoke insert, update, delete on public.children from anon, authenticated;
revoke insert, update, delete on public.child_device_bindings from anon, authenticated;
revoke all on public.child_pairing_codes from anon, authenticated;
revoke insert, update, delete on public.parent_quests from anon, authenticated;
revoke insert, update, delete on public.quest_instances from anon, authenticated;
revoke insert, update, delete on public.child_game_state from anon, authenticated;
revoke insert, update, delete on public.reward_events from anon, authenticated;

grant select on public.households, public.household_members, public.children,
  public.child_device_bindings, public.parent_quests, public.quest_instances,
  public.child_game_state, public.reward_events to authenticated;

create or replace function public.create_household(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then raise exception 'parent account required'; end if;
  if trim(p_name) = '' then raise exception 'household name required'; end if;

  insert into public.households(name, created_by)
  values (left(trim(p_name), 60), auth.uid())
  returning id into v_id;

  insert into public.household_members(household_id, user_id, role)
  values (v_id, auth.uid(), 'owner');

  return v_id;
end;
$$;

create or replace function public.create_child(p_household_id uuid, p_display_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.is_household_parent(p_household_id) then raise exception 'not authorized'; end if;
  if trim(p_display_name) = '' then raise exception 'child name required'; end if;

  insert into public.children(household_id, display_name)
  values (p_household_id, left(trim(p_display_name), 40))
  returning id into v_id;

  insert into public.child_game_state(child_id) values (v_id);
  return v_id;
end;
$$;

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
begin
  if not public.is_household_parent(p_household_id) then raise exception 'not authorized'; end if;
  if not exists (select 1 from public.children where id = p_child_id and household_id = p_household_id) then
    raise exception 'child does not belong to household';
  end if;
  if trim(p_title) = '' or trim(p_description) = '' then raise exception 'title and description required'; end if;
  if p_progression_class not in ('orderEnvironment','knowledgeCreativity','wellbeingRoutine','movementActivity','community') then
    raise exception 'invalid progression class';
  end if;

  insert into public.parent_quests(
    household_id, created_by, title, description, progression_class, reward_diamonds, reward_syssel_bux
  ) values (
    p_household_id, auth.uid(), left(trim(p_title), 60), left(trim(p_description), 240), p_progression_class,
    greatest(0, p_reward_diamonds), greatest(0, p_reward_syssel_bux)
  ) returning id into v_quest_id;

  insert into public.quest_instances(household_id, child_id, quest_id)
  values (p_household_id, p_child_id, v_quest_id)
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
  select qi.id, pq.id, qi.household_id, qi.child_id, pq.title, pq.description,
    pq.progression_class, pq.reward_diamonds, pq.reward_syssel_bux, qi.state,
    qi.created_at, qi.submitted_at, qi.approved_at
  from public.quest_instances qi
  join public.parent_quests pq on pq.id = qi.quest_id
  where qi.child_id = p_child_id
    and (public.is_bound_child(p_child_id) or public.is_household_parent(qi.household_id))
  order by qi.created_at desc;
$$;

create or replace function public.submit_quest(p_instance_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_child_id uuid;
begin
  select child_id into v_child_id from public.quest_instances where id = p_instance_id;
  if v_child_id is null or not public.is_bound_child(v_child_id) then raise exception 'not authorized'; end if;

  update public.quest_instances
  set state = 'pending', submitted_at = now()
  where id = p_instance_id and state = 'available';

  if not found then raise exception 'quest is not available'; end if;
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
  v_quest public.parent_quests%rowtype;
begin
  select * into v_instance from public.quest_instances where id = p_instance_id for update;
  if not found then raise exception 'quest not found'; end if;
  if not public.is_household_parent(v_instance.household_id) then raise exception 'not authorized'; end if;

  if p_approve then
    if v_instance.state = 'approved' then return; end if;
    if v_instance.state <> 'pending' then raise exception 'quest is not pending'; end if;

    select * into v_quest from public.parent_quests where id = v_instance.quest_id;

    update public.quest_instances
    set state = 'approved', approved_at = now(), approved_by = auth.uid()
    where id = p_instance_id;

    insert into public.reward_events(quest_instance_id, child_id, diamonds, syssel_bux, progression_class)
    values (p_instance_id, v_instance.child_id, v_quest.reward_diamonds, v_quest.reward_syssel_bux, v_quest.progression_class)
    on conflict (quest_instance_id) do nothing;

    if found then
      update public.child_game_state
      set diamonds = diamonds + v_quest.reward_diamonds,
          syssel_bux = syssel_bux + v_quest.reward_syssel_bux,
          progression = jsonb_set(
            progression,
            array[v_quest.progression_class],
            to_jsonb(coalesce((progression ->> v_quest.progression_class)::integer, 0) + 1),
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

create or replace function public.create_child_pairing_code(p_child_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_household_id uuid;
  v_code text;
begin
  select household_id into v_household_id from public.children where id = p_child_id;
  if v_household_id is null or not public.is_household_parent(v_household_id) then raise exception 'not authorized'; end if;

  delete from public.child_pairing_codes where child_id = p_child_id and redeemed_at is null;
  v_code := lower(encode(gen_random_bytes(4), 'hex'));

  insert into public.child_pairing_codes(household_id, child_id, code_hash, expires_at, created_by)
  values (v_household_id, p_child_id, digest(v_code, 'sha256'), now() + interval '15 minutes', auth.uid());

  return v_code;
end;
$$;

create or replace function public.redeem_child_pairing_code(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pairing public.child_pairing_codes%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;

  select * into v_pairing
  from public.child_pairing_codes
  where code_hash = digest(lower(trim(p_code)), 'sha256')
    and redeemed_at is null
    and expires_at > now()
  for update;

  if not found then raise exception 'pairing code is invalid or expired'; end if;

  insert into public.child_device_bindings(auth_user_id, child_id, household_id)
  values (auth.uid(), v_pairing.child_id, v_pairing.household_id)
  on conflict (auth_user_id) do update
    set child_id = excluded.child_id, household_id = excluded.household_id, created_at = now();

  update public.child_pairing_codes set redeemed_at = now() where id = v_pairing.id;
  return v_pairing.child_id;
end;
$$;

revoke execute on function public.create_household(text) from public;
revoke execute on function public.create_child(uuid, text) from public;
revoke execute on function public.create_parent_quest(uuid, uuid, text, text, text, integer, integer) from public;
revoke execute on function public.list_child_quests(uuid) from public;
revoke execute on function public.submit_quest(uuid) from public;
revoke execute on function public.review_quest(uuid, boolean) from public;
revoke execute on function public.create_child_pairing_code(uuid) from public;
revoke execute on function public.redeem_child_pairing_code(text) from public;

grant execute on function public.create_household(text) to authenticated;
grant execute on function public.create_child(uuid, text) to authenticated;
grant execute on function public.create_parent_quest(uuid, uuid, text, text, text, integer, integer) to authenticated;
grant execute on function public.list_child_quests(uuid) to authenticated;
grant execute on function public.submit_quest(uuid) to authenticated;
grant execute on function public.review_quest(uuid, boolean) to authenticated;
grant execute on function public.create_child_pairing_code(uuid) to authenticated;
grant execute on function public.redeem_child_pairing_code(text) to authenticated;
