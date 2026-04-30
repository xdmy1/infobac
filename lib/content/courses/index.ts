/**
 * Course content registry — single source of truth for lessons + questions.
 * Pages look up courses by slug here; the marketing catalog and dashboard
 * also import this to avoid duplicating the course list.
 */

import type { CourseMeta, CourseModule, CourseSlug } from "./types";

import { meta as pythonMeta } from "./python/meta";
import { lessons as pythonLessons } from "./python/lessons";
import { questions as pythonQuestions } from "./python/questions";

import { meta as devicesMeta } from "./devices/meta";
import { lessons as devicesLessons } from "./devices/lessons";
import { questions as devicesQuestions } from "./devices/questions";

import { meta as sqlMeta } from "./sql/meta";
import { lessons as sqlLessons } from "./sql/lessons";
import { questions as sqlQuestions } from "./sql/questions";

export const coursesContent: Record<CourseSlug, CourseModule> = {
  python: {
    meta: pythonMeta,
    lessons: pythonLessons,
    questions: pythonQuestions,
  },
  devices: {
    meta: devicesMeta,
    lessons: devicesLessons,
    questions: devicesQuestions,
  },
  sql: {
    meta: sqlMeta,
    lessons: sqlLessons,
    questions: sqlQuestions,
  },
};

export const allCoursesMeta: readonly CourseMeta[] = [
  pythonMeta,
  sqlMeta,
  devicesMeta,
];

export function getCourseContent(slug: string): CourseModule | null {
  if (slug in coursesContent) {
    return coursesContent[slug as CourseSlug];
  }
  return null;
}

export type {
  CourseMeta,
  CourseModule,
  CourseSlug,
  Lesson,
  Question,
  SingleQuestion,
  MultiQuestion,
  YesNoQuestion,
} from "./types";
