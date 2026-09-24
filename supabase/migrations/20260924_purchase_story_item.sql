create or replace function public.purchase_story_item(p_item_key text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_child_id uuid;
  v_price integer;
  v_state public.child_game_state%rowtype;
begin
  if p_item_key <> 'bottle_message' then raise exception 'unknown story item'; end if;
  v_price := 25;
  select b.child_id into v_child_id from public.child_device_bindings b
  where b.auth_user_id=(select auth.uid()) order by b.created_at desc limit 1;
  if v_child_id is null or not public.is_bound_child(v_child_id) then raise exception 'not authorized'; end if;
  select * into v_state from public.child_game_state where child_id=v_child_id for update;
  if not found then raise exception 'child game state missing'; end if;
  if coalesce((v_state.world_flags->>'bottleMessagePurchased')::boolean,false) then
    return jsonb_build_object('child_id',v_child_id,'syssel_bux',v_state.syssel_bux,'already_owned',true,'world_flags',v_state.world_flags);
  end if;
  if v_state.syssel_bux < v_price then raise exception 'insufficient sysselbux'; end if;
  update public.child_game_state set syssel_bux=syssel_bux-v_price,
    world_flags=coalesce(world_flags,'{}'::jsonb)||'{"bottleMessagePurchased":true}'::jsonb,updated_at=now()
  where child_id=v_child_id returning * into v_state;
  return jsonb_build_object('child_id',v_child_id,'syssel_bux',v_state.syssel_bux,'already_owned',false,'world_flags',v_state.world_flags);
end;
$$;
revoke all on function public.purchase_story_item(text) from public, anon;
grant execute on function public.purchase_story_item(text) to authenticated;


create or replace function public.commit_story_beat(p_beat_key text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_child_id uuid; v_flags jsonb; v_progress integer;
begin
  if p_beat_key not in ('bottle_message_sent','sol_arrival_seen','sol_tour_bakery_seen','sol_tour_shop_seen','sol_tour_linus_seen','sol_chose_to_stay') then raise exception 'unknown story beat'; end if;
  select b.child_id into v_child_id from public.child_device_bindings b
  where b.auth_user_id=(select auth.uid()) order by b.created_at desc limit 1;
  if v_child_id is null or not public.is_bound_child(v_child_id) then raise exception 'not authorized'; end if;
  select coalesce((progression->>'worldProgression')::integer,0) into v_progress
  from public.child_game_state where child_id=v_child_id for update;
  if not found then raise exception 'child game state missing'; end if;
  update public.child_game_state
  set world_flags=coalesce(world_flags,'{}'::jsonb) ||
    case p_beat_key
      when 'bottle_message_sent' then '{"bottleMessageSent":true}'::jsonb
      when 'sol_arrival_seen' then '{"solArrivalSeen":true}'::jsonb
      when 'sol_tour_bakery_seen' then '{"solTourBakerySeen":true}'::jsonb
      when 'sol_tour_shop_seen' then '{"solTourShopSeen":true}'::jsonb
      when 'sol_tour_linus_seen' then '{"solTourLinusSeen":true}'::jsonb
      when 'sol_chose_to_stay' then jsonb_build_object('solChoseToStay',true,'clinicProgressionBaseline',v_progress)
    end,
    updated_at=now()
  where child_id=v_child_id returning world_flags into v_flags;
  return v_flags;
end;
$$;
revoke all on function public.commit_story_beat(text) from public, anon;
grant execute on function public.commit_story_beat(text) to authenticated;
