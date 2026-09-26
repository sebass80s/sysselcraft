-- A child may have at most one pending delivery for the same Diamond reward.
-- The UI mirrors this rule, but the RPC is authoritative so rapid/double requests cannot spend twice.

create or replace function public.purchase_diamond_reward(p_reward_definition_id uuid) returns uuid
language plpgsql security definer set search_path=public as $$
declare v_reward public.diamond_reward_definitions%rowtype; v_child_id uuid; v_redemption_id uuid;
begin
  select * into v_reward from public.diamond_reward_definitions where id=p_reward_definition_id for update;
  if not found or not v_reward.active or v_reward.archived_at is not null then raise exception 'reward unavailable'; end if;
  select c.id into v_child_id from public.children c join public.child_device_bindings b on b.child_id=c.id
  where c.household_id=v_reward.household_id and b.auth_user_id=auth.uid() limit 1;
  if v_child_id is null or not public.is_bound_child(v_child_id) then raise exception 'not authorized'; end if;
  if exists (
    select 1 from public.diamond_reward_redemptions
    where child_id=v_child_id and reward_definition_id=v_reward.id and status='pending_delivery'
  ) then raise exception 'reward already pending delivery'; end if;
  update public.child_game_state set diamonds=diamonds-v_reward.diamond_price,updated_at=now()
  where child_id=v_child_id and diamonds>=v_reward.diamond_price;
  if not found then raise exception 'insufficient diamonds'; end if;
  insert into public.diamond_reward_redemptions(household_id,child_id,reward_definition_id,reward_title_snapshot,reward_description_snapshot,diamond_price_snapshot)
  values(v_reward.household_id,v_child_id,v_reward.id,v_reward.title,v_reward.description,v_reward.diamond_price)
  returning id into v_redemption_id;
  return v_redemption_id;
end $$;

revoke all on function public.purchase_diamond_reward(uuid) from public;
revoke execute on function public.purchase_diamond_reward(uuid) from anon;
grant execute on function public.purchase_diamond_reward(uuid) to authenticated;
