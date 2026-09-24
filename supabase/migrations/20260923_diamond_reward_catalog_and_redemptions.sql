-- Diamond IRL reward catalog and redemption ledger.
-- Product law: parents define shared household rewards; child purchase spends immediately;
-- purchase does not require approval; parent later delivers or refunds atomically.

create table if not exists public.diamond_reward_definitions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 80),
  description text not null default '' check (char_length(description) <= 240),
  diamond_price integer not null check (diamond_price > 0 and diamond_price <= 100000),
  active boolean not null default true,
  archived_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (archived_at is null or active = false)
);

create table if not exists public.diamond_reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete restrict,
  child_id uuid not null references public.children(id) on delete restrict,
  reward_definition_id uuid references public.diamond_reward_definitions(id) on delete set null,
  reward_title_snapshot text not null,
  reward_description_snapshot text not null default '',
  diamond_price_snapshot integer not null check (diamond_price_snapshot > 0),
  status text not null default 'pending_delivery' check (status in ('pending_delivery','delivered','refunded')),
  purchased_at timestamptz not null default now(),
  delivered_at timestamptz,
  delivered_by uuid references auth.users(id),
  refunded_at timestamptz,
  refunded_by uuid references auth.users(id),
  check (
    (status='pending_delivery' and delivered_at is null and refunded_at is null) or
    (status='delivered' and delivered_at is not null and delivered_by is not null and refunded_at is null) or
    (status='refunded' and refunded_at is not null and refunded_by is not null and delivered_at is null)
  )
);

create index if not exists diamond_reward_definitions_household_idx on public.diamond_reward_definitions(household_id, active, created_at);
create index if not exists diamond_reward_redemptions_household_idx on public.diamond_reward_redemptions(household_id, status, purchased_at desc);
create index if not exists diamond_reward_redemptions_child_idx on public.diamond_reward_redemptions(child_id, purchased_at desc);

alter table public.diamond_reward_definitions enable row level security;
alter table public.diamond_reward_redemptions enable row level security;

-- Explicit Data API grants. Keep authoritative writes behind RPCs.
-- Do not grant anon: child devices use authenticated anonymous Auth sessions.
revoke all on table public.diamond_reward_definitions from anon, authenticated;
revoke all on table public.diamond_reward_redemptions from anon, authenticated;
grant select on table public.diamond_reward_definitions to authenticated;
grant select on table public.diamond_reward_redemptions to authenticated;

create policy "parents manage diamond rewards" on public.diamond_reward_definitions for all to authenticated
using (public.is_household_parent(household_id)) with check (public.is_household_parent(household_id));
create policy "bound child reads active diamond rewards" on public.diamond_reward_definitions for select to authenticated
using (active and archived_at is null and exists (
  select 1 from public.children c where c.household_id=diamond_reward_definitions.household_id and public.is_bound_child(c.id)
));
create policy "parents read diamond redemptions" on public.diamond_reward_redemptions for select to authenticated
using (public.is_household_parent(household_id));
create policy "bound child reads own diamond redemptions" on public.diamond_reward_redemptions for select to authenticated
using (public.is_bound_child(child_id));

create or replace function public.purchase_diamond_reward(p_reward_definition_id uuid) returns uuid
language plpgsql security definer set search_path=public as $$
declare v_reward public.diamond_reward_definitions%rowtype; v_child_id uuid; v_redemption_id uuid;
begin
  select * into v_reward from public.diamond_reward_definitions where id=p_reward_definition_id for update;
  if not found or not v_reward.active or v_reward.archived_at is not null then raise exception 'reward unavailable'; end if;
  select c.id into v_child_id from public.children c join public.child_device_bindings b on b.child_id=c.id
  where c.household_id=v_reward.household_id and b.auth_user_id=auth.uid() limit 1;
  if v_child_id is null or not public.is_bound_child(v_child_id) then raise exception 'not authorized'; end if;
  update public.child_game_state set diamonds=diamonds-v_reward.diamond_price,updated_at=now()
  where child_id=v_child_id and diamonds>=v_reward.diamond_price;
  if not found then raise exception 'insufficient diamonds'; end if;
  insert into public.diamond_reward_redemptions(household_id,child_id,reward_definition_id,reward_title_snapshot,reward_description_snapshot,diamond_price_snapshot)
  values(v_reward.household_id,v_child_id,v_reward.id,v_reward.title,v_reward.description,v_reward.diamond_price)
  returning id into v_redemption_id;
  return v_redemption_id;
end $$;

create or replace function public.mark_diamond_reward_delivered(p_redemption_id uuid) returns void
language plpgsql security definer set search_path=public as $$
declare v public.diamond_reward_redemptions%rowtype;
begin
  select * into v from public.diamond_reward_redemptions where id=p_redemption_id for update;
  if not found then raise exception 'redemption not found'; end if;
  if not public.is_household_parent(v.household_id) then raise exception 'not authorized'; end if;
  if v.status='delivered' then return; end if;
  if v.status<>'pending_delivery' then raise exception 'redemption is not pending delivery'; end if;
  update public.diamond_reward_redemptions set status='delivered',delivered_at=now(),delivered_by=auth.uid() where id=p_redemption_id;
end $$;

create or replace function public.refund_diamond_reward(p_redemption_id uuid) returns void
language plpgsql security definer set search_path=public as $$
declare v public.diamond_reward_redemptions%rowtype;
begin
  select * into v from public.diamond_reward_redemptions where id=p_redemption_id for update;
  if not found then raise exception 'redemption not found'; end if;
  if not public.is_household_parent(v.household_id) then raise exception 'not authorized'; end if;
  if v.status='refunded' then return; end if;
  if v.status<>'pending_delivery' then raise exception 'only pending rewards can be refunded'; end if;
  update public.child_game_state set diamonds=diamonds+v.diamond_price_snapshot,updated_at=now() where child_id=v.child_id;
  if not found then raise exception 'child wallet not found'; end if;
  update public.diamond_reward_redemptions set status='refunded',refunded_at=now(),refunded_by=auth.uid() where id=p_redemption_id;
end $$;

revoke all on function public.purchase_diamond_reward(uuid) from public;
revoke all on function public.mark_diamond_reward_delivered(uuid) from public;
revoke all on function public.refund_diamond_reward(uuid) from public;
revoke execute on function public.purchase_diamond_reward(uuid) from anon;
revoke execute on function public.mark_diamond_reward_delivered(uuid) from anon;
revoke execute on function public.refund_diamond_reward(uuid) from anon;
grant execute on function public.purchase_diamond_reward(uuid) to authenticated;
grant execute on function public.mark_diamond_reward_delivered(uuid) to authenticated;
grant execute on function public.refund_diamond_reward(uuid) to authenticated;
