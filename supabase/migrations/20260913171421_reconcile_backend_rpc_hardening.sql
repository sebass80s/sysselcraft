-- Mirror of live migration 20260913171421 reconcile_backend_rpc_hardening.
-- Preserve explicit parent/child authorization and idempotent reward issuance.

create or replace function public.review_quest(p_instance_id uuid, p_approve boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_instance public.quest_instances%rowtype;
  v_quest public.parent_quests%rowtype;
  v_reward_inserted boolean;
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
    on conflict (quest_instance_id) do nothing
    returning true into v_reward_inserted;

    if coalesce(v_reward_inserted, false) then
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
  if coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then raise exception 'parent account required'; end if;
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
  if not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then raise exception 'anonymous child session required'; end if;

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
  set child_id = excluded.child_id,
      household_id = excluded.household_id,
      created_at = now();

  update public.child_pairing_codes set redeemed_at = now() where id = v_pairing.id;
  return v_pairing.child_id;
end;
$$;

revoke execute on function public.review_quest(uuid, boolean) from public, anon;
revoke execute on function public.create_child_pairing_code(uuid) from public, anon;
revoke execute on function public.redeem_child_pairing_code(text) from public, anon;
grant execute on function public.review_quest(uuid, boolean) to authenticated;
grant execute on function public.create_child_pairing_code(uuid) to authenticated;
grant execute on function public.redeem_child_pairing_code(text) to authenticated;
