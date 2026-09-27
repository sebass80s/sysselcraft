create or replace function public.purchase_story_item(p_item_key text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_child_id uuid;
  v_price integer;
  v_flag_key text;
  v_state public.child_game_state%rowtype;
begin
  case p_item_key
    when 'bottle_message' then
      v_price := 100;
      v_flag_key := 'bottleMessagePurchased';
    when 'room_football_rug' then
      v_price := 30;
      v_flag_key := 'roomFootballRugOwned';
    else
      raise exception 'unknown story item';
  end case;
  select b.child_id into v_child_id from public.child_device_bindings b
  where b.auth_user_id=(select auth.uid()) order by b.created_at desc limit 1;
  if v_child_id is null or not public.is_bound_child(v_child_id) then raise exception 'not authorized'; end if;
  select * into v_state from public.child_game_state where child_id=v_child_id for update;
  if not found then raise exception 'child game state missing'; end if;
  if coalesce((v_state.world_flags->>v_flag_key)::boolean,false) then
    return jsonb_build_object('child_id',v_child_id,'syssel_bux',v_state.syssel_bux,'already_owned',true,'world_flags',v_state.world_flags);
  end if;
  if v_state.syssel_bux < v_price then raise exception 'insufficient sysselbux'; end if;
  update public.child_game_state set syssel_bux=syssel_bux-v_price,
    world_flags=coalesce(world_flags,'{}'::jsonb)||jsonb_build_object(v_flag_key,true),updated_at=now()
  where child_id=v_child_id returning * into v_state;
  return jsonb_build_object('child_id',v_child_id,'syssel_bux',v_state.syssel_bux,'already_owned',false,'world_flags',v_state.world_flags);
end;
$function$;