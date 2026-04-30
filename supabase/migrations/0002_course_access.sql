-- =============================================================================
-- InfoBac.md — Course access (per-course grants, decoupled from subscriptions)
--
-- Subscriptions still track billing state, but `course_access` is the source
-- of truth for "what courses can this user open" — letting us assign one
-- single course to a user when needed (gift / partial scholarship / staff).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Source of the grant — used for auditing and revocation logic.
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.access_source as enum (
    'subscription',  -- granted automatically by an active subscription
    'manual',        -- granted by an admin via service_role
    'gift',          -- granted by another user / promo
    'scholarship'    -- granted free for financial-need cases
  );
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- course_access table
-- -----------------------------------------------------------------------------
create table if not exists public.course_access (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_id   uuid not null references public.courses(id) on delete cascade,
  granted_at  timestamptz not null default now(),
  expires_at  timestamptz,                       -- null = lifetime
  source      public.access_source not null default 'manual',
  source_id   uuid,                              -- e.g. subscriptions.id when source='subscription'
  note        text,
  created_at  timestamptz not null default now(),
  unique (user_id, course_id)
);

create index if not exists course_access_user_idx on public.course_access (user_id);
create index if not exists course_access_course_idx on public.course_access (course_id);
create index if not exists course_access_active_idx
  on public.course_access (user_id, course_id)
  where expires_at is null or expires_at > now();

-- -----------------------------------------------------------------------------
-- has_course_access(course_id) — replaces has_active_subscription() in policies
-- -----------------------------------------------------------------------------
create or replace function public.has_course_access(p_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.course_access
     where user_id = auth.uid()
       and course_id = p_course_id
       and (expires_at is null or expires_at > now())
  );
$$;

revoke all on function public.has_course_access(uuid) from public;
grant execute on function public.has_course_access(uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- Replace existing lessons / quizzes / questions policies
-- -----------------------------------------------------------------------------

drop policy if exists "lessons_select_preview_or_subscribed" on public.lessons;
drop policy if exists "lessons_select_preview_or_access" on public.lessons;
create policy "lessons_select_preview_or_access"
  on public.lessons for select
  using (
    order_index <= 2
    or (auth.uid() is not null and public.has_course_access(course_id))
  );

drop policy if exists "quizzes_select_subscribed" on public.quizzes;
drop policy if exists "quizzes_select_access" on public.quizzes;
create policy "quizzes_select_access"
  on public.quizzes for select
  using (
    type = 'practice'
    or (auth.uid() is not null and public.has_course_access(course_id))
  );

drop policy if exists "questions_select_parent_visible" on public.questions;
create policy "questions_select_parent_visible"
  on public.questions for select
  using (
    exists (
      select 1 from public.quizzes q
       where q.id = quiz_id
         and (
           q.type = 'practice'
           or (auth.uid() is not null and public.has_course_access(q.course_id))
         )
    )
  );

-- -----------------------------------------------------------------------------
-- RLS on course_access itself: read own only, no client writes
-- -----------------------------------------------------------------------------
alter table public.course_access enable row level security;

drop policy if exists "course_access_select_own" on public.course_access;
create policy "course_access_select_own"
  on public.course_access for select
  using (auth.uid() = user_id);

-- INSERT/UPDATE/DELETE intentionally bypass RLS via service_role only.
-- Subscription webhook / admin tools manage grants server-side.

-- -----------------------------------------------------------------------------
-- Helper view: my_courses (course rows joined with my access state)
-- Used by dashboard / sidebar queries.
-- -----------------------------------------------------------------------------
create or replace view public.my_courses
with (security_invoker = true)
as
select
  c.id,
  c.slug,
  c.title,
  c.description,
  c.order_index,
  c.estimated_duration,
  c.difficulty,
  c.icon,
  ca.granted_at,
  ca.expires_at,
  ca.source,
  (ca.expires_at is null or ca.expires_at > now()) as is_active
from public.courses c
join public.course_access ca on ca.course_id = c.id
where ca.user_id = auth.uid();

grant select on public.my_courses to authenticated;
