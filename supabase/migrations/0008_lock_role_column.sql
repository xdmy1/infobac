-- =============================================================================
-- InfoBac.md — Lock the profiles.role column against self-elevation.
--
-- Background: 0001 ships `profiles_update_own` as
--   USING (auth.uid() = id) WITH CHECK (auth.uid() = id)
-- which has no column restriction. A normal user could PATCH their own row
-- via PostgREST and set `role = 'admin'`, then call admin_grant_subscription
-- on themselves. The app's assertAdmin() guard reads is_admin() from the DB,
-- so once the DB row says admin, the app trusts it.
--
-- Defense in depth: (1) revoke column-level UPDATE on `role` from authenticated,
-- (2) add a BEFORE UPDATE trigger that blocks role changes by non-admins.
-- Either alone would suffice; both together cover misconfig in the future.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- (1) Column-level grant: authenticated cannot UPDATE the role column at all.
-- We re-grant UPDATE on every other mutable column so the existing
-- updateProfileAction (full_name, school, grade, avatar_url) keeps working.
-- -----------------------------------------------------------------------------
revoke update on public.profiles from authenticated;

grant update (full_name, avatar_url, school, grade, updated_at)
  on public.profiles to authenticated;

-- service_role keeps full UPDATE (its bypass is via role membership, not
-- column grants — but explicit is better than implicit).
grant update on public.profiles to service_role;

-- -----------------------------------------------------------------------------
-- (2) Trigger: even if someone re-grants UPDATE on `role` later by mistake,
-- the trigger still blocks self-escalation.
-- -----------------------------------------------------------------------------
create or replace function public.prevent_role_self_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.role is distinct from old.role then
    if not public.is_admin() then
      raise exception 'role_change_forbidden'
        using hint = 'profiles.role can only be changed by admins or service_role';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_self_change on public.profiles;
create trigger profiles_prevent_role_self_change
  before update of role on public.profiles
  for each row execute function public.prevent_role_self_change();

-- Note: SECURITY DEFINER on the trigger function lets it call is_admin()
-- with the caller's identity. is_admin() itself is SECURITY DEFINER too,
-- so it bypasses profiles RLS only to read the caller's role row — same
-- pattern as everywhere else in this schema.
