import type { CourseMeta } from "../types";

export const meta: CourseMeta = {
  slug: "python",
  title: "Python — Certiport IT Specialist",
  blurb:
    "De la tipuri de date și operatori la funcții, fișiere și gestiunea erorilor — exact ce intră la examen.",
  description:
    "Limbajul de bază pentru certificarea IT Specialist Python — tipuri, operatori, control flow, fișiere, gestiunea erorilor.",
  duration: "8–12 ore",
  difficulty: "începător",
  icon: "/courses/python.png",
  accent: "primary",
  passingScore: 70,
  topics: [
    "Tipuri de date și conversii",
    "Operatori și precedență",
    "Flow control: if, while, for",
    "Fișiere și formatare I/O",
    "Funcții, scope, default args",
    "Module standard (math, random, sys, os)",
    "Gestiunea erorilor (try/except/finally)",
  ],
};
