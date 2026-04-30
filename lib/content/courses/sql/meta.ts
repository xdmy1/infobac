import type { CourseMeta } from "../types";

export const meta: CourseMeta = {
  slug: "sql",
  title: "Database Fundamentals — Certiport IT Specialist",
  blurb:
    "Tabele, chei, JOIN-uri, normalizare, view-uri și constraints. SQL la nivel de examen, fără cod.",
  description:
    "Cursul Certiport Database Fundamentals acoperă bazele de date relaționale — tabele, primary key, foreign key, normalizare 1NF, tipurile de date, CREATE/ALTER/DROP/TRUNCATE, INSERT/UPDATE/DELETE, SELECT cu GROUP BY/HAVING/ORDER BY, JOIN-uri (INNER, LEFT, CROSS), NULL, view-uri, stored procedures, indexuri (clustered/non-clustered), constraints, ERD-uri și UNION. Plus un cheat sheet cu cele 14 capcane care pică elevii la examen.",
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
