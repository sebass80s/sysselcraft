-- Parent-authoritative catalog mutation RPCs for Mira's Diamond rewards.
create or replace function public.create_diamond_reward(p_household_id uuid,p_title text,p_description text,p_diamond_price integer)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_id uuid;
begin
 if not public.is_household_parent(p_household_id) then raise exception 'not authorized'; end if;
 insert into public.diamond_reward_definitions(household_id,title,description,diamond_price,created_by)
 values(p_household_id,btrim(p_title),coalesce(btrim(p_description),''),p_diamond_price,auth.uid())
 returning id into v_id; return v_id;
end $$;
create or replace function public.update_diamond_reward(p_reward_id uuid,p_title text,p_description text,p_diamond_price integer,p_active boolean)
returns void language plpgsql security definer set search_path=public as $$
declare v public.diamond_reward_definitions%rowtype;
begin
 select * into v from public.diamond_reward_definitions where id=p_reward_id for update;
 if not found then raise exception 'reward not found'; end if;
 if not public.is_household_parent(v.household_id) then raise exception 'not authorized'; end if;
 if v.archived_at is not null then raise exception 'reward is archived'; end if;
 update public.diamond_reward_definitions set title=btrim(p_title),description=coalesce(btrim(p_description),''),diamond_price=p_diamond_price,active=p_active,updated_at=now() where id=p_reward_id;
end $$;
create or replace function public.archive_diamond_reward(p_reward_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare v public.diamond_reward_definitions%rowtype;
begin
 select * into v from public.diamond_reward_definitions where id=p_reward_id for update;
 if not found then raise exception 'reward not found'; end if;
 if not public.is_household_parent(v.household_id) then raise exception 'not authorized'; end if;
 update public.diamond_reward_definitions set active=false,archived_at=coalesce(archived_at,now()),updated_at=now() where id=p_reward_id;
end $$;
revoke all on function public.create_diamond_reward(uuid,text,text,integer) from public;
revoke all on function public.update_diamond_reward(uuid,text,text,integer,boolean) from public;
revoke all on function public.archive_diamond_reward(uuid) from public;
revoke execute on function public.create_diamond_reward(uuid,text,text,integer) from anon;
revoke execute on function public.update_diamond_reward(uuid,text,text,integer,boolean) from anon;
revoke execute on function public.archive_diamond_reward(uuid) from anon;
grant execute on function public.create_diamond_reward(uuid,text,text,integer) to authenticated;
grant execute on function public.update_diamond_reward(uuid,text,text,integer,boolean) to authenticated;
grant execute on function public.archive_diamond_reward(uuid) to authenticated;
