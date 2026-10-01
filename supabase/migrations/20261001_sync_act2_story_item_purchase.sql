-- Reconcile repository migration history with the live purchase_story_item RPC.
-- Live Supabase gained the Act 2 story items through additive migrations on 2026-10-01.
-- Keep this migration idempotent: it only replaces the function definition and grants.

create or replace function public.purchase_story_item(p_item_key text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_child_id uuid;
  v_price integer;
  v_flag_key text;
  v_required_flag text;
  v_state public.child_game_state%rowtype;
begin
  case p_item_key
    when 'bottle_message' then v_price:=100; v_flag_key:='bottleMessagePurchased';
    when 'room_football_rug' then v_price:=30; v_flag_key:='roomFootballRugOwned';
    when 'room_football_poster' then v_price:=20; v_flag_key:='roomFootballPosterOwned'; v_required_flag:='roomFootballRugOwned';
    when 'room_computer_desk' then v_price:=80; v_flag_key:='roomComputerDeskOwned'; v_required_flag:='roomFootballPosterOwned';
    when 'room_trophy_shelf' then v_price:=35; v_flag_key:='roomTrophyShelfOwned'; v_required_flag:='roomComputerDeskOwned';
    when 'room_string_lights' then v_price:=25; v_flag_key:='roomStringLightsOwned'; v_required_flag:='roomTrophyShelfOwned';
    when 'room_aquarium' then v_price:=60; v_flag_key:='roomAquariumOwned'; v_required_flag:='roomStringLightsOwned';
    when 'dog_home_bed' then v_price:=40; v_flag_key:='dogHomeBedOwned';
    when 'dog_home_bowls' then v_price:=25; v_flag_key:='dogHomeBowlsOwned'; v_required_flag:='dogHomeBedOwned';
    when 'dog_home_toys' then v_price:=30; v_flag_key:='dogHomeToysOwned'; v_required_flag:='dogHomeBowlsOwned';
    when 'dog_home_cozy' then v_price:=35; v_flag_key:='dogHomeCozyOwned'; v_required_flag:='dogHomeToysOwned';
    when 'act2_jetty_lifebuoy' then v_price:=200; v_flag_key:='act2JettyLifebuoyOwned';
    when 'act2_boathouse_steering_wheel' then v_price:=200; v_flag_key:='act2BoathouseSteeringWheelOwned';
    when 'act2_motorboat_parts' then v_price:=200; v_flag_key:='act2MotorboatPartsOwned';
    else raise exception 'unknown story item';
  end case;

  select b.child_id into v_child_id
  from public.child_device_bindings b
  where b.auth_user_id=(select auth.uid())
  order by b.created_at desc limit 1;

  if v_child_id is null or not public.is_bound_child(v_child_id) then
    raise exception 'not authorized';
  end if;

  select * into v_state
  from public.child_game_state
  where child_id=v_child_id
  for update;

  if not found then raise exception 'child game state missing'; end if;

  if coalesce((v_state.world_flags->>v_flag_key)::boolean,false) then
    return jsonb_build_object(
      'child_id',v_child_id,
      'syssel_bux',v_state.syssel_bux,
      'already_owned',true,
      'world_flags',v_state.world_flags
    );
  end if;

  if v_required_flag is not null
     and not coalesce((v_state.world_flags->>v_required_flag)::boolean,false) then
    raise exception 'previous story upgrade required';
  end if;

  if v_state.syssel_bux<v_price then raise exception 'insufficient sysselbux'; end if;

  update public.child_game_state
  set syssel_bux=syssel_bux-v_price,
      world_flags=coalesce(world_flags,'{}'::jsonb)||jsonb_build_object(v_flag_key,true),
      updated_at=now()
  where child_id=v_child_id
  returning * into v_state;

  return jsonb_build_object(
    'child_id',v_child_id,
    'syssel_bux',v_state.syssel_bux,
    'already_owned',false,
    'world_flags',v_state.world_flags
  );
end;
$$;

revoke all on function public.purchase_story_item(text) from public, anon;
grant execute on function public.purchase_story_item(text) to authenticated;
