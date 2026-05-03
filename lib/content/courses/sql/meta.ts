import type { CourseMeta } from "../types";

export const meta: CourseMeta = {
  slug: "sql",
  title: "Database Fundamentals — Certiport IT Specialist",
  blurb:
    "Tabele, chei, JOIN-uri, normalizare, view-uri și constraints. SQL la nivel de examen, fără cod.",
  description:
    "SQL la nivel de examen, fără cod inutil. Înveți să citești o schemă, să scrii un SELECT și să fii pregătit pentru certificarea IT Specialist Databases.",
  duration: "6–10 ore",
  difficulty: "intermediar",
  icon: "/courses/sql.png",
  accent: "accent",
  passingScore: 70,
  topics: [
    "Baze de date relaționale: tabele, rânduri, coloane",
    "Chei: primary, foreign, composite",
    "Normalizare 1NF",
    "DDL: CREATE, ALTER, DROP, TRUNCATE",
    "DML: INSERT, UPDATE, DELETE, SELECT",
    "GROUP BY, HAVING, ORDER BY, JOIN",
    "View-uri, stored procedures, indexuri",
    "ERD și constraints",
  ],
};
