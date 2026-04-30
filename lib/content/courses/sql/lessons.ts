// AUTO-GENERATED from scripts/generate-lessons.mjs — do not edit by hand.
// Re-run `node scripts/generate-lessons.mjs` after editing source content.

import type { Lesson } from "../types";

export const lessons: readonly Lesson[] = [
  {
    slug: `ce-este-o-baza-de-date-relationala`,
    title: `Ce este o bază de date relațională`,
    orderIndex: 1,
    durationMinutes: 8,
    isPreview: true,
    markdown: `## Ce este o bază de date relațională?

O bază de date relațională stochează date în **tabele** (tables). Fiecare tabel are:

- **Rânduri (rows)** = înregistrări individuale (ex: un student, un produs)
- **Coloane (columns)** = câmpuri/atribute (ex: Nume, Vârstă, Preț)

Exemplu vizual — tabelul \`Student\`:

\`\`\`
| ID | Name   | Age |
|----|--------|-----|
| 1  | Rene   | 18  |
| 2  | Tia    | 22  |
| 3  | Oliver | 25  |
\`\`\`

Fiecare rând este unic. Fiecare coloană are un nume unic. Dar valorile din câmpuri **nu trebuie** neapărat să fie unice (ex: doi studenți pot avea aceeași vârstă).

**Reguli importante de reținut pentru examen:**

- „Each value in a field must be unique" → **FALSE** (două rânduri pot avea aceeași valoare într-o coloană)
- „Each row in a table must be unique" → **TRUE** (fiecare rând trebuie să fie unic, de aceea avem primary key)
- „Each column name in a table must be unique" → **TRUE**

---`,
  },
  {
    slug: `chei-primary-foreign-composite`,
    title: `Chei: Primary, Foreign, Composite`,
    orderIndex: 2,
    durationMinutes: 8,
    isPreview: true,
    markdown: `## Chei (Keys) — Cel mai important concept

### 2.1 Primary Key (Cheie primară)

Este coloana (sau combinația de coloane) care **identifică unic** fiecare rând.

Reguli:
- Nu poate fi NULL (nu poate lipsi)
- Trebuie să fie unică — nu se pot repeta valorile
- Un tabel are **o singură** primary key

Exemplu: \`StudentID\` este primary key → nu poți avea doi studenți cu același ID.

**Ce se întâmplă dacă încerci să inserezi un duplicat?**
Dacă ai deja \`ProductID = 3296\` și faci:
\`\`\`sql
INSERT INTO Product VALUES (3296, 'Table', 4444);
\`\`\`
→ Primești **Primary Key Constraint Violation** (eroare!)

### 2.2 Foreign Key (Cheie externă)

Este o coloană dintr-un tabel care **face referire** la primary key-ul altui tabel. Scopul: să asigure că datele sunt coerente între tabele.

Exemplu: Tabelul \`Sales\` are coloana \`SalesPersonID\` care face referire la \`SalesPerson.ID\`. Dacă încerci să inserezi o vânzare cu un \`SalesPersonID\` care nu există în tabelul \`SalesPerson\`, primești **Foreign Key Constraint Violation**.

**Cum elimini un foreign key?** Cu \`ALTER TABLE;\` (nu DELETE TABLE, nu ALTER FOREIGN KEY).

### 2.3 Composite Primary Key (Cheie primară compusă)

Când o singură coloană nu e suficientă pentru unicitate, combini două coloane.

Exemplu: Tabelul \`ChapterLanguage\` leagă \`Chapter\` și \`Language\`. Primary key compusă = \`ChapterId\` + \`LanguageId\` (alegi primary key-urile din fiecare tabel părinte).

### 2.4 Functional Dependency (Dependență funcțională)

Dacă valoarea unei coloane **determină** valoarea alteia, spunem că a doua coloană este **funcțional dependentă** de prima.

Exemplu: \`ProductID → ProductCategory\`. Fiecare ProductID determină exact o categorie. Relația se numește **functionally dependent**.

---`,
  },
  {
    slug: `normalizare-prima-forma-normala-1nf`,
    title: `Normalizare — Prima Formă Normală (1NF)`,
    orderIndex: 3,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Normalizare — Prima Formă Normală (1NF)

La examen apare întrebarea: „Ce cerințe trebuie îndeplinite pentru 1NF?"

Cele două cerințe pentru **First Normal Form (1NF)**:
1. **Exclude duplicate rows** (nu au voie rânduri identice → ai nevoie de primary key)
2. **Exclude repeating groups** (fiecare celulă trebuie să conțină o singură valoare, nu liste)

NU sunt cerințe 1NF: „exclude foreign keys" sau „exclude composite keys".

---`,
  },
  {
    slug: `tipuri-de-date`,
    title: `Tipuri de date`,
    orderIndex: 4,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Tipuri de date (Data Types)

La examen trebuie să știi ce tip de date se potrivește fiecărui câmp:

| Tip de date | Ce stochează | Exemplu |
|-------------|-------------|---------|
| **INT** | Numere întregi (fără zecimale) | Vârstă: 25, GradeLevel: 12 |
| **VARCHAR(n)** | Șir de caractere de lungime variabilă | Nume: 'Oliver', Adresă |
| **CHAR(n)** | Șir de caractere de lungime fixă | Cod de stat: 'NY' |
| **DECIMAL** | Numere cu zecimale (precizie exactă) | Preț: 24.95, DaysAbsent: 2.5 |
| **DATETIME** | Dată și oră | 2024-06-15 14:30:00 |
| **BIT** | Valoare booleană (0 sau 1) | IsActive: 1 |

**Întrebare tipică la examen:**
- StudentName = string → **VARCHAR**
- GradeLevel = număr întreg → **INT**
- DaysAbsent = poate avea o zecimală → **DECIMAL**
- Prețuri pentru funcții financiare → **DECIMAL** (nu varchar, nu binary!)

---`,
  },
  {
    slug: `create-table-crearea-tabelelor`,
    title: `CREATE TABLE — crearea tabelelor`,
    orderIndex: 5,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Crearea tabelelor — CREATE TABLE

Sintaxa corectă:
\`\`\`sql
CREATE TABLE Student(
    ID INT,
    Name VARCHAR(100),
    Age INT
);
\`\`\`

**Greșeli frecvente la examen (opțiuni greșite):**
- \`CREATE ( TABLE Student ...\` → greșit, paranteza e după numele tabelului
- \`CREATE Student( ...\` → greșit, lipsește cuvântul TABLE
- \`CREATE TABLE ( ...\` → greșit, lipsește numele tabelului

**Ce keyword-uri sunt valide într-un CREATE TABLE?**
- **CONSTRAINT** → DA (poți defini constrângeri)
- **PRIMARY KEY** → DA (definești cheia primară)
- ORDER BY → NU (e pentru interogări SELECT)
- INSERT INTO → NU (e pentru inserarea datelor)

**Cum creezi un index?** Definind PRIMARY KEY pe o coloană se creează automat un index:
\`\`\`sql
CREATE TABLE Employee
    (EmployeeID INTEGER PRIMARY KEY);
\`\`\`
Aceasta creează un **clustered index** pe EmployeeID.

---`,
  },
  {
    slug: `alter-table-modificarea-structurii`,
    title: `ALTER TABLE — modificarea structurii`,
    orderIndex: 6,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Modificarea tabelelor — ALTER TABLE

### 6.1 Adaugă o coloană nouă
\`\`\`sql
ALTER TABLE Customer
ADD (District INTEGER);
\`\`\`
Notă: \`MODIFY\` schimbă o coloană existentă, nu adaugă una nouă.

### 6.2 Șterge o coloană
\`\`\`sql
ALTER TABLE Customers
DROP COLUMN SSN;
\`\`\`
Notă: \`DELETE SSN\` sau \`REMOVE SSN\` nu există în SQL. Cuvântul corect este **DROP COLUMN**.

---`,
  },
  {
    slug: `drop-truncate-delete-diferentele-care-conteaza`,
    title: `DROP, TRUNCATE, DELETE — diferențele care contează`,
    orderIndex: 7,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Ștergerea tabelelor și datelor — DROP, TRUNCATE, DELETE

Acestea sunt **foarte** diferite. Le testează mereu:

| Comandă | Ce face | Tip |
|---------|---------|-----|
| **DROP TABLE** | Șterge tot tabelul (structură + date) | DDL |
| **TRUNCATE TABLE** | Șterge toate rândurile **fără a le loga individual** (rapid) | DDL |
| **DELETE FROM** | Șterge rânduri specifice (cu WHERE) sau toate, **le logează** | DML |

**Întrebare tipică:** „Which statement removes all rows without logging individual deletions?"
→ **TRUNCATE TABLE**

**Întrebare tipică:** „You need to delete a database table. Which DDL keyword?"
→ **DROP** (nu DELETE — DELETE e DML, nu DDL)

---`,
  },
  {
    slug: `insert-update-delete-manipularea-datelor`,
    title: `INSERT, UPDATE, DELETE — manipularea datelor`,
    orderIndex: 8,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Inserarea datelor — INSERT INTO

\`\`\`sql
INSERT INTO Product
VALUES (3296, 'Table', 4444);
\`\`\`

Valorile trebuie să fie în ordinea coloanelor din tabel. Stringurile sunt între ghilimele simple: \`'text'\`.

**Ce se poate întâmpla:**
- Dacă ProductID deja există → **Primary key violation**
- Dacă CategoryID nu există în tabelul referit → **Foreign key violation**
- Dacă inserezi NULL într-o coloană NOT NULL → **Eroare NULL**
- Dacă nu există constrângeri și totul e ok → **A new row in the table**

**Exemplu important de la examen:** Tabelul Road are \`RoadID INTEGER NOT NULL, Distance INTEGER NOT NULL\` (fără PRIMARY KEY explicit). Dacă faci \`INSERT INTO Road VALUES (1234, 36);\` și 1234 deja există... **nu ai PK**, deci inserarea reușește → **D. A new row in the table**.

---

---

## Actualizarea datelor — UPDATE

Sintaxa corectă:
\`\`\`sql
UPDATE NumeTabel
SET coloana = valoare_noua
WHERE conditie;
\`\`\`

**Exemple de la examen:**

Schimbă numele Tiei în Kimberly:
\`\`\`sql
UPDATE Volunteer
SET GivenName = 'Kimberly'
WHERE GivenName = 'Tia';
\`\`\`

Crește prețul item-ului 1 cu 6%:
\`\`\`sql
UPDATE Products
SET Price = Price * 1.06
WHERE ItemNumber = 1;
\`\`\`

Schimbă ProductCategory la 43 pentru toate lingurile:
\`\`\`sql
UPDATE Product
SET ProductCategory = 43
WHERE ProductDescription = 'spoon';
\`\`\`

**Greșeli frecvente:** \`SET Product\` (fără UPDATE), \`ALTER Products\` (nu e pentru date), \`FROM Products\` (nu se folosește așa).

---

---

## Ștergerea rândurilor — DELETE

\`\`\`sql
DELETE FROM NumeTabel
WHERE conditie;
\`\`\`

**Exemplu:** Șterge clientul cu ID 12345:
\`\`\`sql
DELETE FROM Customer
WHERE CustomerID = 12345;
\`\`\`

**Exemplu:** Șterge voluntarii cu numele Tia:
\`\`\`sql
DELETE FROM Volunteer
WHERE GivenName = 'Tia';
\`\`\`

Notă: \`==\` nu există în SQL. Se folosește \`=\`. De asemenea, \`EQUALS\` și \`IS\` nu se folosesc pentru comparații de valori (IS se folosește doar cu NULL).

---`,
  },
  {
    slug: `select-interogari-de-baza`,
    title: `SELECT — interogări de bază`,
    orderIndex: 9,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Interogări SELECT — Bazele

### 11.1 Structura de bază
\`\`\`sql
SELECT coloana1, coloana2
FROM NumeTabel
WHERE conditie;
\`\`\`

### 11.2 SELECT cu condiții multiple
Două condiții care ambele trebuie îndeplinite → **AND**
Cel puțin una din condiții → **OR**
Diferit de o valoare → **<>** (not equal)

**Exemplu de la examen:** Comenzile de după ianuarie 2023 din toate statele EXCEPT California:
\`\`\`sql
SELECT * FROM orders
WHERE order_date > '2023-01-31' AND ship_state <> 'CA';
\`\`\`
De ce AND și nu OR? Ambele condiții trebuie îndeplinite simultan. De ce \`<>\` și nu \`LIKE\`? Vrem „diferit de CA", nu „similar cu CA".

### 11.3 Numărarea rândurilor — COUNT
\`\`\`sql
SELECT COUNT(*)
FROM Employee;
\`\`\`
\`COUNT(*)\` numără TOATE rândurile. \`COUNT(rows)\` nu e valid. \`SUM(*)\` nu e valid.

### 11.4 Funcții Agregate

| Funcție | Ce face |
|---------|---------|
| COUNT() | Numără rândurile |
| SUM() | Adună valorile |
| AVG() | Media valorilor |
| MAX() | Valoarea maximă |
| MIN() | Valoarea minimă |

**Exemplu de la examen:** Afișează numărul total de comenzi, media, maximul și suma LineItemTotal:
\`\`\`sql
SELECT COUNT(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM ItemsOnOrder;
\`\`\`
Atenție: funcțiile agregate se aplică pe **coloane**, nu pe expresii like \`UnitPrice*Quantity\`.

---`,
  },
  {
    slug: `group-by-having-order-by`,
    title: `GROUP BY, HAVING, ORDER BY`,
    orderIndex: 10,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## GROUP BY și HAVING

### 12.1 GROUP BY
Grupează rândurile după o coloană, apoi aplică funcții agregate pe fiecare grup.

\`\`\`sql
SELECT Country, COUNT(CustomerID)
FROM Customers
GROUP BY Country;
\`\`\`

### 12.2 HAVING — Filtrează GRUPURILE
\`WHERE\` filtrează rânduri individuale **înainte** de grupare.
\`HAVING\` filtrează **grupurile** rezultate **după** grupare.

**Exemplu de la examen:** Țările cu mai puțin de 50 de clienți:
\`\`\`sql
SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country
HAVING COUNT(CustomerID) < 50;
\`\`\`

NU poți folosi WHERE cu funcții agregate! \`WHERE COUNT(...) < 50\` este **greșit**.

### 12.3 Ordinea clauzelor (IMPORTANT!)
\`\`\`
SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY
\`\`\`
Dacă pui ORDER BY **înainte** de GROUP BY, primești syntax error!

**Întrebare de la examen:** Query cu ORDER BY apoi GROUP BY apoi HAVING dă eroare. Soluția: **Remove the ORDER BY clause** (sau mută-l la final).

---

---

## ORDER BY — Sortarea rezultatelor

\`\`\`sql
SELECT * FROM students
ORDER BY enrollment_date DESC;
\`\`\`

- **ASC** = ascending (crescător, implicit)
- **DESC** = descending (descrescător, cel mai recent primul)

**Întrebare complexă de la examen:** Raport cu studenți înscriși de la 1 iunie 2024 SAU absolvenți din 2024, ordonat descrescător:
\`\`\`sql
SELECT * FROM students
WHERE (enrollment_date >= '2024-06-01')
   OR (academic_status='Graduated' AND graduation_date >= '2024-01-01')
ORDER BY enrollment_date DESC;
\`\`\`
De ce OR între cele două condiții mari? Vrem AMBELE categorii de studenți (înscriși recent + absolvenți).

---`,
  },
  {
    slug: `join-uri-combinarea-tabelelor`,
    title: `JOIN-uri — combinarea tabelelor`,
    orderIndex: 11,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## JOIN-uri — Combinarea tabelelor

### 14.1 CROSS JOIN (Produs Cartezian)
Combină FIECARE rând din tabelul A cu FIECARE rând din tabelul B.

Formula: rânduri_rezultat = rânduri_A × rânduri_B

**Dacă ambele tabele au 3 rânduri → 3 × 3 = 9 rânduri**

\`\`\`sql
SELECT EmployeeID, FirstName, DepartmentName
FROM Employee, Department;
\`\`\`
Aceasta este tot un **Cartesian product** (produs cartezian) — SELECT din două tabele fără JOIN/WHERE.

### 14.2 INNER JOIN
Returnează doar rândurile care au potrivire în ambele tabele.

\`\`\`sql
SELECT student.firstname, student.lastname, course.name
FROM course
INNER JOIN enrollment ON enrollment.courseID = course.courseID
INNER JOIN student ON enrollment.studentID = student.studentID;
\`\`\`

Exemplu de la examen cu Machine/Assignment/Operator:
- Query 1: \`JOIN [Assignment] ON MachineID = Machine.ID\` → returnează doar mașinile care au assignment-uri → **2 rânduri**
- Query 2: \`LEFT JOIN [Assignment] ON OperatorID = Operator.ID\` → returnează TOȚI operatorii, inclusiv cei fără assignment → **3 rânduri**

### 14.3 LEFT JOIN
Returnează TOATE rândurile din tabelul din stânga, chiar dacă nu au potrivire în dreapta.

---`,
  },
  {
    slug: `null-valorile-lipsa`,
    title: `NULL — valorile lipsă`,
    orderIndex: 12,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## NULL — Valorile lipsă

NULL înseamnă „fără valoare" / „necunoscut". Reguli esențiale:

1. **Nu poți compara NULL cu =** → \`WHERE Phone = NULL\` e **greșit**
2. **Folosești IS NULL sau IS NOT NULL:**
\`\`\`sql
-- Șterge angajații fără telefon:
DELETE FROM Employee WHERE Phone IS NULL;

-- Clădiri care AU fost inspectate:
WHERE InspectionDate IS NOT NULL
\`\`\`

3. **Concatenarea cu NULL dă NULL:**
\`\`\`sql
SELECT 'Greetings ' + Prefix + ' ' + FirstName FROM Person;
\`\`\`
Dacă \`Prefix\` sau \`FirstName\` este NULL, **întregul rezultat este NULL**.
Cauza: „The Prefix or FirstName columns have null values."

---`,
  },
  {
    slug: `view-uri-si-union`,
    title: `VIEW-uri și UNION`,
    orderIndex: 13,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## VIEW-uri (Vederi)

Un view este o **interogare salvată** care se comportă ca un tabel virtual.

### Creare:
\`\`\`sql
CREATE VIEW [dbo].[NorthAmericanMammals_View]
AS SELECT a.Id, a.Name
FROM Animal a
WHERE a.Class = 'Mammals'
AND a.InNorthAmerica = 1;
\`\`\`

### Ștergere:
\`\`\`sql
DROP VIEW EmployeeView;
\`\`\`
NU: \`DELETE VIEW\`, \`DELETE EmployeeView\`, sau \`DROP EmployeeView\` (fără cuvântul VIEW).

### Creare view din tabel Company (doar ID, Name, Type pentru statul UT):
\`\`\`sql
CREATE VIEW CompanyView AS
SELECT ID, Name, Type
FROM Company
WHERE State = 'UT';
\`\`\`

---

---

## UNION — Combinarea rezultatelor

\`\`\`sql
SELECT col1 FROM tabel1
UNION
SELECT col1 FROM tabel2;
\`\`\`

UNION combină rezultatele a două query-uri într-un singur set de rezultate.
- **UNION** — elimină duplicatele
- **UNION ALL** — păstrează duplicatele
- **EXCEPT** — rânduri din primul query care NU sunt în al doilea
- **INTERSECT** — rânduri comune ambelor query-uri

**Întrebare examen:** „Combine results of two queries containing all rows" → **UNION**

---`,
  },
  {
    slug: `stored-procedures-si-functions`,
    title: `Stored Procedures și Functions`,
    orderIndex: 14,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Stored Procedures și Functions

### 17.1 Stored Procedure
= Un set de instrucțiuni SQL salvate pe server, reutilizabile.

**Beneficiul principal:** **improves performance** (este pre-compilată, se execută mai rapid).

Nu: „bypasses case sensitivity", nu „minimizes storage space".

### 17.2 Function vs Stored Procedure
Diferența principală: **A function must return a value** (o funcție TREBUIE să returneze o valoare).

O procedură stocată POATE returna valori, dar nu e obligatoriu.

---`,
  },
  {
    slug: `indexuri-si-constraints`,
    title: `Indexuri și Constraints`,
    orderIndex: 15,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Indexuri (Indexes)

Un index accelerează căutarea datelor (ca un index la o carte).

### 18.1 Clustered Index
- Sortează **fizic** rândurile pe disc
- Un singur clustered index per tabel
- Se creează automat pe PRIMARY KEY
- Îmbunătățește: queries care returnează **un range de valori** (range queries)
- Pe coloane care: sunt **folosite frecvent în ORDER BY sau WHERE cu range-uri**

### 18.2 Non-Clustered Index
- Creează o structură separată cu pointeri
- Poți avea mai multe per tabel
- Ideal pentru coloanele folosite frecvent în WHERE

**Exemplu de la examen:** Query cu \`WHERE Category = 'Science Books'\` pe un tabel cu 1 milion de rânduri → cel mai bun index este **a non-clustered index on the Category column** (pentru că filtrul e pe Category).

---

---

## Constraints (Constrângeri)

Ce asigură validitatea datelor? → **A constraint** (nu attribute, nu index, nu primary key în sine).

Tipuri de constrângeri:
- **NOT NULL** — coloana nu acceptă valori NULL
- **UNIQUE** — valorile trebuie să fie unice
- **PRIMARY KEY** — NOT NULL + UNIQUE (identificare unică)
- **FOREIGN KEY** — referință la altă tabelă
- **CHECK** — condiție personalizată (ex: Age > 0)
- **DEFAULT** — valoare implicită

---`,
  },
  {
    slug: `entity-relationship-diagrams-erd`,
    title: `Entity Relationship Diagrams (ERD)`,
    orderIndex: 16,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Entity Relationship Diagrams (ERD)

ERD-ul arată relațiile dintre tabele. La examen apare des:

**Many-to-Many:** Machine ↔ Operator (un operator poate lucra la mai multe mașini, o mașină poate fi operată de mai mulți operatori). Se rezolvă cu un **tabel de joncțiune** (Assignment):

\`\`\`
MACHINE (ID-PK, Name, Model)
    ↕
ASSIGNMENT (ID-PK, MachineID-FK, OperatorID-FK)
    ↕
OPERATOR (ID-PK, Name, Experience)
\`\`\`

Assignment.MachineID → Foreign Key spre Machine.ID
Assignment.OperatorID → Foreign Key spre Operator.ID

**Întrebare ERD de la examen:** INSERT cu MachineID=3, OperatorID=4 dă eroare pe FK_Assignment_Machine, coloana 'ID'. Cauza: **The Machine table has no rows that have an ID value of 3.**

---`,
  },
  {
    slug: `query-practice-drag-drop-pattern`,
    title: `Query practice — drag & drop pattern`,
    orderIndex: 17,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Query-ul de la examen cu Building (Drag & Drop)

\`\`\`sql
SELECT TOP 10 Address
FROM Building
WHERE InspectionDate IS NOT NULL
ORDER BY InspectionDate;
\`\`\`

Explicație:
- \`TOP 10\` — primele 10 rezultate
- \`IS NOT NULL\` — doar clădirile inspectate (au dată de inspecție)
- \`ORDER BY InspectionDate\` — ordonate după data inspecției (cele mai vechi primele = „earliest")

---

---

## Query-ul cu Customers care au Extension (Drag & Drop)

\`\`\`sql
SELECT LastName, PhoneNumber, Extension
FROM Customers
WHERE Extension IS NOT NULL
ORDER BY LastName;
\`\`\`

Explicație: vrem doar clienții care AU extensie (nu NULL), sortați după LastName.

---`,
  },
  {
    slug: `recap-final-ddl-vs-dml`,
    title: `Recap final: DDL vs DML`,
    orderIndex: 18,
    durationMinutes: 8,
    isPreview: false,
    markdown: `## Rezumat DDL vs DML

| Categorie | Comenzi | Ce fac |
|-----------|---------|--------|
| **DDL** (Data Definition Language) | CREATE, ALTER, DROP, TRUNCATE | Definesc/modifică structura |
| **DML** (Data Manipulation Language) | SELECT, INSERT, UPDATE, DELETE | Manipulează datele |

---

## CHEAT SHEET FINAL — Cele mai frecvente capcane

1. \`WHERE Phone = NULL\` → **GREȘIT!** Corect: \`WHERE Phone IS NULL\`
2. \`DELETE TABLE\` → **NU EXISTĂ!** Corect: \`DROP TABLE\` sau \`DELETE FROM tabel\`
3. \`==\` → **NU EXISTĂ ÎN SQL!** Corect: \`=\`
4. \`ALTER TABLE ... DELETE col\` → **GREȘIT!** Corect: \`DROP COLUMN col\`
5. \`CREATE VIEW\` se șterge cu \`DROP VIEW\`, nu \`DELETE VIEW\`
6. NULL + orice = NULL (concatenare cu +)
7. HAVING vine DUPĂ GROUP BY, nu înainte
8. ORDER BY vine ULTIMUL
9. CROSS JOIN: N × M rânduri
10. PRIMARY KEY = creează automat clustered index
11. TRUNCATE = șterge tot fără logare individuală
12. Function TREBUIE să returneze o valoare (spre deosebire de stored procedure)
13. Foreign Key = asigură integritatea referențială între tabele
14. 1NF = no duplicate rows + no repeating groups`,
  },
  {
    slug: `cheat-sheet-curs-de-corectie`,
    title: `Cheat sheet — capcane frecvente la examen`,
    orderIndex: 19,
    durationMinutes: 10,
    isPreview: false,
    markdown: `# CURS DE CORECȚIE — Doar ce ai greșit
### Citește asta înainte de culcare + mâine dimineață

---

## 1. ORDINEA CLAUZELOR SQL — Cea mai importantă lecție

Imaginează-ți o rețetă de gătit. Nu poți pune condimentele înainte să tai legumele. La fel în SQL, ordinea contează:

\`\`\`
SELECT   → ce coloane vrei
FROM     → din ce tabel
WHERE    → filtrezi rânduri individuale
GROUP BY → grupezi rezultatele
HAVING   → filtrezi grupurile
ORDER BY → sortezi rezultatul final
\`\`\`

**Trucul:** **S**ă **F**ii **W**esel **G**ândind **H**aios **O**re = SELECT FROM WHERE GROUP HAVING ORDER

### UPDATE — ordinea e SET apoi WHERE, nu invers

\`\`\`sql
-- ✅ CORECT:
UPDATE Product
SET ProductCategory = 43
WHERE ProductDescription = 'spoon';

-- ❌ GREȘIT (ai pus WHERE înainte de SET):
UPDATE Product
WHERE ProductDescription = 'spoon'
SET ProductCategory = 43;
\`\`\`

Gândește-te logic: mai întâi spui CE schimbi (SET), apoi UNDE (WHERE).

### HAVING vs WHERE

\`\`\`sql
-- WHERE = filtrează RÂNDURI (înainte de grupare)
-- HAVING = filtrează GRUPURI (după grupare)

-- Vrei țările cu mai puțin de 50 de clienți:
SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country          -- mai întâi grupezi
HAVING COUNT(CustomerID) < 50;  -- apoi filtrezi grupurile

-- ❌ GREȘIT: WHERE COUNT(...) < 50  → WHERE nu acceptă funcții agregate!
\`\`\`

**Regula de aur:** Dacă condiția conține COUNT, SUM, AVG, MAX, MIN → folosești **HAVING**, nu WHERE.

---

## 2. JOIN-uri — Cum funcționează

### INNER JOIN = doar rândurile care au potrivire

\`\`\`
Machine: 3 rânduri (ID: 1, 2, 3)
Operator: 3 rânduri (ID: 1, 2, 3)
Assignment: 2 rânduri (MachineID: 1,2 / OperatorID: 1,2)

INNER JOIN Machine cu Assignment → doar mașinile 1 și 2 au assignment → 2 rânduri
LEFT JOIN Operator cu Assignment → TOȚI operatorii (3), inclusiv cel fără assignment → 3 rânduri
\`\`\`

### Sintaxa corectă cu INNER JOIN

\`\`\`sql
-- ✅ CORECT: folosești ON pentru condiția de join
SELECT student.firstname, student.lastname, course.name
FROM course
INNER JOIN enrollment ON enrollment.courseID = course.courseID
INNER JOIN student ON enrollment.studentID = student.studentID;

-- ❌ GREȘIT: nu "INNER JOIN ON course, enrollment" și nu WHERE pt condiția de join
\`\`\`

**Regula:** INNER JOIN tabel **ON** condiție (nu WHERE, nu virgulă între tabele).

---

## 3. LIKE vs = (Pattern Matching)

\`\`\`sql
-- Vrei numele care ÎNCEPE cu 'A':
WHERE Name LIKE 'A%'     -- ✅ LIKE + % = orice caractere după A

-- ❌ GREȘIT:
WHERE Name = 'A%'        -- caută literal textul "A%" (cu semnul %)
\`\`\`

**%** = orice număr de caractere (doar cu LIKE!)
**_** = exact un caracter (doar cu LIKE!)

Exemple:
- \`LIKE 'A%'\` → Ana, Alex, Adrian
- \`LIKE '%ana%'\` → Ana, Banana, Diana
- \`LIKE 'A_a'\` → Ana, Ara (exact 3 caractere)

---

## 4. DDL vs DML — Care e care

**DDL** = Data **Definition** Language = **structura** bazei de date
\`\`\`
CREATE  → creezi tabel/view
ALTER   → modifici structura
DROP    → ștergi tabel/view
TRUNCATE → golești tabelul (fără logare)
\`\`\`

**DML** = Data **Manipulation** Language = **datele** din tabele
\`\`\`
SELECT  → citești date
INSERT  → inserezi date
UPDATE  → modifici date
DELETE  → ștergi date (cu logare)
\`\`\`

**Trucul:** DDL = construiești/demolezi casa. DML = muți mobila înăuntru.

---

## 5. DELETE vs TRUNCATE

\`\`\`
DELETE FROM MyTable;      → Șterge toate rândurile
                          → CU logare individuală (lent dar recuperabil)
                          → Structura tabelului RĂMÂNE
                          → Poți folosi WHERE

TRUNCATE TABLE MyTable;   → Șterge toate rândurile
                          → FĂRĂ logare individuală (rapid)
                          → Structura tabelului RĂMÂNE

DROP TABLE MyTable;       → Șterge TOT (date + structură)
\`\`\`

**La examen:** „without logging individual deletions" = **TRUNCATE**
„deletes all rows" (fără alt context) = **DELETE** (cu logare!)

---

## 6. ALTER TABLE — Pentru structură, nu pentru date

\`\`\`sql
-- Elimini o coloană:
ALTER TABLE Customers DROP COLUMN SSN;

-- Elimini un foreign key:
ALTER TABLE Sales DROP CONSTRAINT FK_Sales_Person;
\`\`\`

**Atenție:** Întrebarea „Which statement to remove a foreign key?" → **ALTER TABLE;**
Nu: ALTER FOREIGN KEY (nu există), DELETE TABLE, DELETE FOREIGN KEY.

---

## 7. Tipuri de date — DECIMAL pentru bani

| Situație | Tip corect | De ce |
|----------|-----------|-------|
| Bani, prețuri | **DECIMAL** | Precizie exactă cu zecimale |
| Vârstă, cantitate | **INT** | Numere întregi |
| Nume, adresă | **VARCHAR** | Text variabil |
| Da/Nu, activ/inactiv | **BIT** | Doar 0 sau 1 |

**BIT** = doar 0 sau 1. Nu stochezi bani în BIT!

---

## 8. Clustered Index — Ce accelerează

Un clustered index **sortează fizic** datele pe disc (ca paginile unei cărți de telefon sortate alfabetic).

Ce accelerează:
- ✅ Queries care returnează un **range de valori** (BETWEEN, >, <)
- ✅ Coloane folosite frecvent în **ORDER BY** sau **WHERE cu range-uri**

Ce NU accelerează:
- ❌ Aggregate functions (asta e treaba query optimizer-ului)
- ❌ Coloane rar folosite

---

## 9. Proprietățile tabelelor — True/False

Memorează aceste 3 afirmații:

\`\`\`
"Each value in a field must be unique"        → FALSE ❌
   (doi studenți pot avea aceeași vârstă)

"Each row in a table must be unique"          → TRUE ✅
   (primary key asigură asta)

"Each column name in a table must be unique"  → TRUE ✅
   (nu poți avea două coloane cu același nume)
\`\`\`

**Trucul:** Valorile se pot repeta. Rândurile și numele coloanelor NU.

---

## 10. Foreign Key Errors — Citește eroarea!

Când primești:
\`\`\`
FK_Assignment_Machine ... table "dbo.Machine", column 'ID'
\`\`\`

Citește numele constraint-ului: **FK_Assignment_Machine** → problema e între Assignment și **Machine**.
Citește tabelul și coloana: **Machine, column ID** → valoarea MachineID nu există în Machine.

Nu e „already exists" (asta ar fi PK violation), ci „does not exist" (FK violation).

---

## CHEAT SHEET DE BUZUNAR

\`\`\`
1. UPDATE → SET → WHERE (niciodată WHERE înainte de SET)
2. GROUP BY → HAVING (funcții agregate = HAVING, nu WHERE)  
3. INNER JOIN tabel ON condiție (nu WHERE, nu virgulă)
4. LIKE '%text%' (nu = '%text%')
5. DDL = CREATE/ALTER/DROP/TRUNCATE | DML = SELECT/INSERT/UPDATE/DELETE
6. DELETE = cu logare | TRUNCATE = fără logare
7. ALTER TABLE pt a elimina FK/coloane
8. DECIMAL pt bani (nu BIT)
9. Clustered index = range queries + ORDER BY
10. Valori în câmpuri: pot fi duplicate. Rânduri: unice. Coloane: nume unic.
\`\`\`

---

**Noapte bună și succes mâine! Citește cheat sheet-ul de la final de 2-3 ori înainte de somn, și mâine dimineață fă quizul de 2 ori. O să treci! 💪**`,
  },
];
