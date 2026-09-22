-- Recover the child bound to the current anonymous Supabase session.
-- This closes the pairing edge case where redeem commits server-side but the
-- response is lost before the device can persist its local child id.
create or replace function public.get_bound_child_id()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_child_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'anonymous child session required';
  end if;

  select child_id into v_child_id
  from public.child_device_bindings
  where auth_user_id = auth.uid();

  return v_child_id;
end;
$$;

revoke execute on function public.get_bound_child_id() from public, anon;
grant execute on function public.get_bound_child_id() to authenticated;
