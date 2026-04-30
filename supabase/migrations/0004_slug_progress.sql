-- =============================================================================
-- InfoBac.md — Slug-based progress tracking
--
-- We're moving lesson + quiz content out of the database into static
-- TypeScript modules (lib/content/courses/*) so we can iterate fast on
-- copy without DB migrations. Progress and exam attempts still live in
-- the DB but are now keyed by `course_slug` / `lesson_slug` text columns
-- rather than UUID foreign keys to long-deleted lesson rows.
--
-- The previous columns are kept (nullable) so this is non-destructive.
-- =============================================================================

-- ─── lesson_progress ────────────────────────────────────────────────────────
alter table public.lesson_progress
  add column if not exists course_slug text,
  add column if not exists lesson_slug text;

-- Make the legacy lesson_id nullable so new rows can carry slugs only.
alter table public.lesson_progress
  alter column lesson_id drop not null;

-- Drop the old UUID-based unique to allow either path.
alter table public.lesson_progress
  drop constraint if exists lesson_progress_user_id_lesson_id_key;

-- Unique on slug-based rows — only when both slug columns are populated.
create unique index if not exists lesson_progress_user_slug_uidx
  on public.lesson_progress (user_id, course_slug, lesson_slug)
  where course_slug is not null and lesson_slug is not null;

-- Keep a fast lookup by user.
create index if not exists lesson_progress_user_idx
  on public.lesson_progress (user_id);

-- ─── quiz_attempts ──────────────────────────────────────────────────────────
alter table public.quiz_attempts
  add column if not exists course_slug text,
  add column if not exists mode text;

-- Allow nullable quiz_id for slug-based attempts.
alter table public.quiz_attempts
  alter column quiz_id drop not null;

-- Sanity check: new mode values for the slug-based flow.
alter table public.quiz_attempts
  drop constraint if exists quiz_attempts_mode_check;
alter table public.quiz_attempts
  add constraint quiz_attempts_mode_check
  check (mode is null or mode in ('practice', 'exam'));

create index if not exists quiz_attempts_user_course_idx
  on public.quiz_attempts (user_id, course_slug);

-- ─── RLS policies — keep "own rows only" semantics ──────────────────────────
-- The existing policies already filter on auth.uid() = user_id, which still
-- applies to slug-based rows since the user_id column is unchanged.
