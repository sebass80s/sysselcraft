-- Quest System v2 RPC grant hardening.
-- These parent-only SECURITY DEFINER functions perform their own household-parent
-- authorization checks, but anonymous sessions must not be able to invoke them.

revoke execute on function public.update_parent_quest(uuid, text, text, text, integer, integer) from anon;
revoke execute on function public.archive_parent_quest(uuid) from anon;

grant execute on function public.update_parent_quest(uuid, text, text, text, integer, integer) to authenticated;
grant execute on function public.archive_parent_quest(uuid) to authenticated;
