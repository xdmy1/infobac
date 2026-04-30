-- =============================================================================
-- InfoBac.md — Fix lesson_progress upsert
--
-- Migration 0004 added a *partial* unique index on
--   (user_id, course_slug, lesson_slug) WHERE course_slug IS NOT NULL ...
-- but PostgreSQL's ON CONFLICT inference can't use partial indexes from the
-- supabase-js client. Result: every "Marchează ca terminată" click failed
-- with "no unique or exclusion constraint matching the ON CONFLICT
-- specification".
--
-- Fix: replace the partial index with a real UNIQUE constraint that the
-- upsert can target. PostgreSQL treats NULLs as distinct in unique
-- constraints, so legacy rows with all-NULL slug columns don't collide.
-- =============================================================================

drop index if exists public.lesson_progress_user_slug_uidx;

alter table public.lesson_progress
  drop constraint if exists lesson_progress_user_course_lesson_uniq;

alter table public.lesson_progress
  add constraint lesson_progress_user_course_lesson_uniq
  unique (user_id, course_slug, lesson_slug);
