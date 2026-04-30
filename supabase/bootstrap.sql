-- =============================================================================
-- InfoBac.md — BOOTSTRAP (consolidat din migrations 0001 + 0002 + 0003)
--
-- Rulează O SINGURĂ DATĂ în Supabase SQL Editor pe un proiect proaspăt.
-- E idempotent (poți reroda în siguranță dacă schema deja există).
--
-- Pași:
--   1. Supabase Dashboard → SQL Editor → New query
--   2. Paste tot acest fișier
--   3. Run
--   4. (Opțional) Apoi rulează supabase/seed.sql pentru date demo
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
  create type public.subscription_plan as enum ('module', 'all', 'semester');
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

do $$ begin
  create type public.access_source as enum ('subscription', 'manual', 'gift', 'scholarship');
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

create table if not exists public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  plan                  public.subscription_plan not null,
  status                public.subscription_status not null default 'trialing',
  current_period_start  timestamptz not null default now(),
  current_period_end    timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (user_id, plan)
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

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

create table if not exists public.course_access (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_id   uuid not null references public.courses(id) on delete cascade,
  granted_at  timestamptz not null default now(),
  expires_at  timestamptz,
  source      public.access_source not null default 'manual',
  source_id   uuid,
  note        text,
  created_at  timestamptz not null default now(),
  unique (user_id, course_id)
);

create index if not exists course_access_user_idx on public.course_access (user_id);
create index if not exists course_access_course_idx on public.course_access (course_id);
-- (No partial index on expires_at — `now()` is STABLE not IMMUTABLE.
--  The UNIQUE (user_id, course_id) above already provides fast lookup.)

-- =============================================================================
-- Functions
-- =============================================================================

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

-- Auto-create profile on signup
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
-- View: my_courses (joins courses + course_access for current user)
-- =============================================================================

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
alter table public.course_access   enable row level security;

-- profiles: own row only
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- subscriptions: read-only for owner, writes only via service_role
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- courses: public read
drop policy if exists "courses_select_public" on public.courses;
create policy "courses_select_public" on public.courses
  for select using (true);

-- lessons: free preview (first 2) + active subscribers
drop policy if exists "lessons_select_preview_or_subscribed" on public.lessons;
drop policy if exists "lessons_select_preview_or_access" on public.lessons;
create policy "lessons_select_preview_or_access" on public.lessons
  for select using (
    order_index <= 2
    or (auth.uid() is not null and public.has_course_access(course_id))
  );

-- lesson_progress: own rows only
drop policy if exists "lesson_progress_select_own" on public.lesson_progress;
create policy "lesson_progress_select_own" on public.lesson_progress
  for select using (auth.uid() = user_id);

drop policy if exists "lesson_progress_insert_own" on public.lesson_progress;
create policy "lesson_progress_insert_own" on public.lesson_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_update_own" on public.lesson_progress;
create policy "lesson_progress_update_own" on public.lesson_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_delete_own" on public.lesson_progress;
create policy "lesson_progress_delete_own" on public.lesson_progress
  for delete using (auth.uid() = user_id);

-- quizzes: practice public, exam_simulation gated
drop policy if exists "quizzes_select_subscribed" on public.quizzes;
drop policy if exists "quizzes_select_access" on public.quizzes;
create policy "quizzes_select_access" on public.quizzes
  for select using (
    type = 'practice'
    or (auth.uid() is not null and public.has_course_access(course_id))
  );

-- questions: visible only when parent quiz visible
drop policy if exists "questions_select_parent_visible" on public.questions;
create policy "questions_select_parent_visible" on public.questions
  for select using (
    exists (
      select 1 from public.quizzes q
       where q.id = quiz_id
         and (
           q.type = 'practice'
           or (auth.uid() is not null and public.has_course_access(q.course_id))
         )
    )
  );

-- quiz_attempts: own rows only
drop policy if exists "quiz_attempts_select_own" on public.quiz_attempts;
create policy "quiz_attempts_select_own" on public.quiz_attempts
  for select using (auth.uid() = user_id);

drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
create policy "quiz_attempts_insert_own" on public.quiz_attempts
  for insert with check (auth.uid() = user_id);

drop policy if exists "quiz_attempts_update_own" on public.quiz_attempts;
create policy "quiz_attempts_update_own" on public.quiz_attempts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- course_access: read own only, no client writes
drop policy if exists "course_access_select_own" on public.course_access;
create policy "course_access_select_own" on public.course_access
  for select using (auth.uid() = user_id);

-- =============================================================================
-- Seed: 3 base courses
-- (Lessons, quizzes etc. vor fi adăugate când avem conținut real.
--  Cursurile trebuie să existe ca să meargă pricing/signup flow.)
-- =============================================================================

insert into public.courses
  (slug, title, description, order_index, estimated_duration, difficulty, icon)
values
  ('python', 'Python',
   'Limbajul de programare. Sintaxă, structuri de control, funcții, OOP minimal.',
   1, '4–6 săptămâni', 'medium', '/courses/python.png'),
  ('sql', 'Databases / SQL',
   'Baze de date relaționale, SQL, normalizare, JOIN-uri.',
   2, '3–4 săptămâni', 'medium', '/courses/sql.png'),
  ('networking', 'Networking & Devices',
   'Structura calculatorului și rețele.',
   3, '1 zi (serios)', 'easy', '/courses/networking-devices.png')
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  order_index = excluded.order_index,
  estimated_duration = excluded.estimated_duration,
  difficulty = excluded.difficulty,
  icon = excluded.icon;
