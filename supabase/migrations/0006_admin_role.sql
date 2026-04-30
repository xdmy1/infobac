-- =============================================================================
-- InfoBac.md — Admin role + admin RLS policies
--
-- Adds a `role` column to profiles and additive RLS policies that let an admin
-- read everything (profiles, subscriptions, course_access, quiz_attempts,
-- lesson_progress) and write to course_access (suspend/unsuspend).
--
-- The `is_admin()` helper is SECURITY DEFINER so it bypasses the profiles RLS
-- when checking the caller's role — same pattern as has_active_subscription
-- (0001) and has_course_access (0002).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- user_role enum
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('student', 'admin');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- profiles.role column
-- -----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists role public.user_role not null default 'student';

-- -----------------------------------------------------------------------------
-- is_admin() — used in policies AND from the app via supabase.rpc('is_admin')
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
      from public.profiles
     where id = auth.uid()
       and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- -----------------------------------------------------------------------------
-- has_course_access_by_slug(p_slug text) — slug variant for the suspend gate.
-- The course pages key off slug (static content), not the course UUID, so we
-- need this helper for the in-page access check.
-- -----------------------------------------------------------------------------
create or replace function public.has_course_access_by_slug(p_slug text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
      from public.course_access ca
      join public.courses c on c.id = ca.course_id
     where ca.user_id = auth.uid()
       and c.slug = p_slug
       and (ca.expires_at is null or ca.expires_at > now())
  );
$$;

revoke all on function public.has_course_access_by_slug(text) from public;
grant execute on function public.has_course_access_by_slug(text) to authenticated;

-- -----------------------------------------------------------------------------
-- Additive RLS policies. Existing `_select_own` policies remain — Postgres
-- OR-combines permissive policies, so admins keep their own-row visibility
-- AND get the all-rows visibility their UI needs.
-- -----------------------------------------------------------------------------

-- profiles: admin can read all
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles for select
  using (public.is_admin());

-- subscriptions: admin can read all
drop policy if exists "subscriptions_select_admin" on public.subscriptions;
create policy "subscriptions_select_admin"
  on public.subscriptions for select
  using (public.is_admin());

-- course_access: admin reads all + can insert (unsuspend) + can delete (suspend).
-- 0002 ships without write policies on this table — without these the admin
-- actions silently no-op.
drop policy if exists "course_access_select_admin" on public.course_access;
create policy "course_access_select_admin"
  on public.course_access for select
  using (public.is_admin());

drop policy if exists "course_access_insert_admin" on public.course_access;
create policy "course_access_insert_admin"
  on public.course_access for insert
  with check (public.is_admin());

drop policy if exists "course_access_delete_admin" on public.course_access;
create policy "course_access_delete_admin"
  on public.course_access for delete
  using (public.is_admin());

-- quiz_attempts: admin can read all (for the per-user score view)
drop policy if exists "quiz_attempts_select_admin" on public.quiz_attempts;
create policy "quiz_attempts_select_admin"
  on public.quiz_attempts for select
  using (public.is_admin());

-- lesson_progress: admin can read all
drop policy if exists "lesson_progress_select_admin" on public.lesson_progress;
create policy "lesson_progress_select_admin"
  on public.lesson_progress for select
  using (public.is_admin());

-- handle_new_user() does not need a change — the column default ('student')
-- applies to new signups automatically.
