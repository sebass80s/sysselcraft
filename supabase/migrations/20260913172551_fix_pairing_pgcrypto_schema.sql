-- Mirror of live migration 20260913172551 fix_pairing_pgcrypto_schema.
-- Supabase installs pgcrypto in the extensions schema while these SECURITY DEFINER
-- functions deliberately pin search_path to public. Qualify crypto functions explicitly.

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
  v_code := lower(encode(extensions.gen_random_bytes(4), 'hex'));

  insert into public.child_pairing_codes(household_id, child_id, code_hash, expires_at, created_by)
  values (v_household_id, p_child_id, extensions.digest(v_code, 'sha256'), now() + interval '15 minutes', auth.uid());

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
  where code_hash = extensions.digest(lower(trim(p_code)), 'sha256')
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

revoke execute on function public.create_child_pairing_code(uuid) from public, anon;
revoke execute on function public.redeem_child_pairing_code(text) from public, anon;
grant execute on function public.create_child_pairing_code(uuid) to authenticated;
grant execute on function public.redeem_child_pairing_code(text) to authenticated;
