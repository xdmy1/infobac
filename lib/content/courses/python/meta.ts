import type { CourseMeta } from "../types";

export const meta: CourseMeta = {
  slug: "python",
  title: "Python — Certiport IT Specialist",
  blurb:
    "De la tipuri de date și operatori la funcții, fișiere și gestiunea erorilor — exact ce intră la examen.",
  description:
    "Curs complet pentru certificarea Certiport Python ITS. Acoperim tipurile de date, operatorii și precedența, controlul fluxului, lucrul cu fișiere, funcțiile, modulele standard (math, random, datetime, sys, os) și gestiunea erorilor. Fiecare capitol are exemple, capcane reale de la examen și un test cu peste 120 de întrebări reale.",
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
