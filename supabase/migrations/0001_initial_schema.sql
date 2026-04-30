-- =============================================================================
-- InfoBac.md — Initial schema
-- Run with: supabase db reset (local) or push to a Supabase project.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.subscription_plan as enum ('basic', 'standard', 'lifetime');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.subscription_status as enum ('active', 'canceled', 'expired', 'trialing');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.course_difficulty as enum ('easy', 'medium', 'hard');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.quiz_type as enum ('practice', 'exam_simulation');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- Helper: trigger to keep updated_at in sync
-- -----------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles — extends auth.users
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null unique,
  full_name    text not null,
  avatar_url   text,
  school       text,
  grade        smallint check (grade is null or grade between 9 and 13),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- subscriptions
-- -----------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  plan                  public.subscription_plan not null,
  status                public.subscription_status not null default 'trialing',
  current_period_start  timestamptz not null default now(),
  current_period_end    timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  -- A user has at most one row per (user_id, plan); reactivations update existing.
  unique (user_id, plan)
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- has_active_subscription() — used by RLS to gate premium content
-- SECURITY DEFINER so it bypasses caller's RLS on the subscriptions read.
-- -----------------------------------------------------------------------------
create or replace function public.has_active_subscription()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.subscriptions
     where user_id = auth.uid()
       and status in ('active', 'trialing')
       and (current_period_end is null or current_period_end > now())
  );
$$;

revoke all on function public.has_active_subscription() from public;
grant execute on function public.has_active_subscription() to authenticated;

-- -----------------------------------------------------------------------------
-- courses
-- -----------------------------------------------------------------------------
create table if not exists public.courses (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  title              text not null,
  description        text not null default '',
  order_index        smallint not null,
  estimated_duration text not null default '',
  difficulty         public.course_difficulty not null default 'medium',
  icon               text not null default '',
  created_at         timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- lessons
-- -----------------------------------------------------------------------------
create table if not exists public.lessons (
  id               uuid primary key default gen_random_uuid(),
  course_id        uuid not null references public.courses(id) on delete cascade,
  slug             text not null,
  title            text not null,
  content          text not null default '',
  video_url        text,
  duration_minutes smallint not null default 0,
  order_index      smallint not null,
  created_at       timestamptz not null default now(),
  unique (course_id, slug),
  unique (course_id, order_index)
);

create index if not exists lessons_course_id_idx on public.lessons (course_id);
create index if not exists lessons_course_order_idx
  on public.lessons (course_id, order_index);

-- -----------------------------------------------------------------------------
-- lesson_progress
-- -----------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  lesson_id           uuid not null references public.lessons(id) on delete cascade,
  completed_at        timestamptz,
  time_spent_seconds  integer not null default 0 check (time_spent_seconds >= 0),
  updated_at          timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists lesson_progress_user_idx on public.lesson_progress (user_id);
create index if not exists lesson_progress_lesson_idx on public.lesson_progress (lesson_id);

drop trigger if exists lesson_progress_set_updated_at on public.lesson_progress;
create trigger lesson_progress_set_updated_at
  before update on public.lesson_progress
  for each row execute function public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- quizzes
-- -----------------------------------------------------------------------------
create table if not exists public.quizzes (
  id                 uuid primary key default gen_random_uuid(),
  course_id          uuid not null references public.courses(id) on delete cascade,
  title              text not null,
  type               public.quiz_type not null default 'practice',
  time_limit_minutes smallint,
  passing_score      smallint not null default 70 check (passing_score between 0 and 100),
  created_at         timestamptz not null default now()
);

create index if not exists quizzes_course_id_idx on public.quizzes (course_id);

-- -----------------------------------------------------------------------------
-- questions
-- -----------------------------------------------------------------------------
create table if not exists public.questions (
  id                uuid primary key default gen_random_uuid(),
  quiz_id           uuid not null references public.quizzes(id) on delete cascade,
  question_text     text not null,
  options           jsonb not null,
  correct_option_id text not null,
  explanation       text not null default '',
  topic_tag         text not null default '',
  order_index       smallint not null default 0,
  created_at        timestamptz not null default now()
);

create index if not exists questions_quiz_id_idx on public.questions (quiz_id);
create index if not exists questions_topic_tag_idx on public.questions (topic_tag);

-- -----------------------------------------------------------------------------
-- quiz_attempts
-- -----------------------------------------------------------------------------
create table if not exists public.quiz_attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  quiz_id       uuid not null references public.quizzes(id) on delete cascade,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  score         smallint check (score is null or score between 0 and 100),
  answers       jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists quiz_attempts_user_idx on public.quiz_attempts (user_id);
create index if not exists quiz_attempts_quiz_idx on public.quiz_attempts (quiz_id);
create index if not exists quiz_attempts_user_quiz_idx
  on public.quiz_attempts (user_id, quiz_id, started_at desc);

-- =============================================================================
-- Auto-create profile on user signup
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, school, grade)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'school',
    nullif(new.raw_user_meta_data->>'grade', '')::smallint
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.profiles        enable row level security;
alter table public.subscriptions   enable row level security;
alter table public.courses         enable row level security;
alter table public.lessons         enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quizzes         enable row level security;
alter table public.questions       enable row level security;
alter table public.quiz_attempts   enable row level security;

-- -----------------------------------------------------------------------------
-- profiles: own row only
-- -----------------------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- subscriptions: read-only for owner, writes only via service role
-- -----------------------------------------------------------------------------
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- (No INSERT/UPDATE/DELETE policies for `authenticated` — only service_role
-- bypasses RLS, so server-side billing webhook is the only writer.)

-- -----------------------------------------------------------------------------
-- courses: public read
-- -----------------------------------------------------------------------------
drop policy if exists "courses_select_public" on public.courses;
create policy "courses_select_public"
  on public.courses for select
  using (true);

-- -----------------------------------------------------------------------------
-- lessons: free preview (first 2 lessons) + active subscribers
-- -----------------------------------------------------------------------------
drop policy if exists "lessons_select_preview_or_subscribed" on public.lessons;
create policy "lessons_select_preview_or_subscribed"
  on public.lessons for select
  using (
    order_index <= 2
    or (auth.uid() is not null and public.has_active_subscription())
  );

-- -----------------------------------------------------------------------------
-- lesson_progress: own rows only, full CRUD
-- -----------------------------------------------------------------------------
drop policy if exists "lesson_progress_select_own" on public.lesson_progress;
create policy "lesson_progress_select_own"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

drop policy if exists "lesson_progress_insert_own" on public.lesson_progress;
create policy "lesson_progress_insert_own"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_update_own" on public.lesson_progress;
create policy "lesson_progress_update_own"
  on public.lesson_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_delete_own" on public.lesson_progress;
create policy "lesson_progress_delete_own"
  on public.lesson_progress for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- quizzes: same gating as lessons (subscriber-only)
-- -----------------------------------------------------------------------------
drop policy if exists "quizzes_select_subscribed" on public.quizzes;
create policy "quizzes_select_subscribed"
  on public.quizzes for select
  using (
    type = 'practice'
    or (auth.uid() is not null and public.has_active_subscription())
  );

-- -----------------------------------------------------------------------------
-- questions: visible only when parent quiz is visible
-- -----------------------------------------------------------------------------
drop policy if exists "questions_select_parent_visible" on public.questions;
create policy "questions_select_parent_visible"
  on public.questions for select
  using (
    exists (
      select 1 from public.quizzes q
       where q.id = quiz_id
         and (
           q.type = 'practice'
           or (auth.uid() is not null and public.has_active_subscription())
         )
    )
  );

-- -----------------------------------------------------------------------------
-- quiz_attempts: own rows only
-- -----------------------------------------------------------------------------
drop policy if exists "quiz_attempts_select_own" on public.quiz_attempts;
create policy "quiz_attempts_select_own"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
create policy "quiz_attempts_insert_own"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

drop policy if exists "quiz_attempts_update_own" on public.quiz_attempts;
create policy "quiz_attempts_update_own"
  on public.quiz_attempts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
