// AUTO-GENERATED from scripts/questions.normalized.json — do not edit by hand.
// Re-run `node scripts/generate-question-modules.mjs` after extracting fresh content.

import type { Question } from "../types";

export const questions: readonly Question[] = [
  {
    id: `sql-001`,
    type: "single",
    topic: `General`,
    prompt: `You are structuring a table in a relational database with a primary key.

"Each value in a field in a table must be unique."`,
    options: [`True`, `False`],
    correctIndex: 1,
    explanation: `FALSE — Valorile dintr-un câmp NU trebuie să fie unice. Ex: doi studenți pot avea aceeași vârstă. Doar PRIMARY KEY trebuie să fie unică.`,
  },
  {
    id: `sql-002`,
    type: "single",
    topic: `General`,
    prompt: `You are structuring a table in a relational database with a primary key.

"Each row in a table must be unique."`,
    options: [`True`, `False`],
    correctIndex: 0,
    explanation: `TRUE — Fiecare rând trebuie să fie unic. Primary key-ul asigură acest lucru.`,
  },
  {
    id: `sql-003`,
    type: "single",
    topic: `General`,
    prompt: `You are structuring a table in a relational database with a primary key.

"Each column name in a table must be unique."`,
    options: [`True`, `False`],
    correctIndex: 0,
    explanation: `TRUE — Nu poți avea două coloane cu același nume în același tabel.`,
  },
  {
    id: `sql-004`,
    type: "single",
    topic: `General`,
    prompt: `You have a table named Employee with columns EmployeeID and EmployeeName.

Which statement returns the number of rows in the table?`,
    options: [`SELECT COUNT(rows) FROM Employee;`, `SELECT COUNT(*) FROM Employee;`, `SELECT SUM(*) FROM Employee;`, `SELECT * FROM Employee;`],
    correctIndex: 1,
    explanation: `COUNT(*) numără toate rândurile din tabel. COUNT(rows) nu e valid, SUM(*) nu e valid, SELECT * returnează datele, nu numărul.`,
  },
  {
    id: `sql-005`,
    type: "multi",
    topic: `General`,
    prompt: `You need to normalize a database to first normal form (1NF).

Which two requirements must you meet? (Choose 2)`,
    options: [`Exclude duplicate rows`, `Exclude foreign keys`, `Exclude composite keys`, `Exclude repeating groups`],
    correctIndices: [0, 3],
    min: 2,
    explanation: `1NF cere: 1) Fără rânduri duplicate (primary key) și 2) Fără grupuri repetitive (fiecare celulă o singură valoare).`,
  },
  {
    id: `sql-006`,
    type: "single",
    topic: `General`,
    prompt: `You have a table Product (ProductID PK, ProductName, CategoryID FK→Category).
Existing data: ProductID 3296 = Spoon, ProductID 1114 = Chair.

You execute: INSERT INTO Product VALUES (3296, 'Table', 4444);

What is the result?`,
    options: [`A foreign key constraint violation`, `A new row in the Product table`, `A syntax error`, `A new row in the Category table`, `A primary key constraint violation`],
    correctIndex: 4,
    explanation: `ProductID 3296 deja există → Primary Key Constraint Violation. PK nu permite duplicate.`,
  },
  {
    id: `sql-007`,
    type: "single",
    topic: `General`,
    prompt: `You have two tables. Each table has three rows. You create a SQL query that uses a CROSS JOIN. The query does not include a WHERE clause.

How many rows will be included in the Cartesian product?`,
    options: [`0`, `3`, `6`, `9`],
    correctIndex: 3,
    explanation: `CROSS JOIN = produs cartezian. 3 × 3 = 9 rânduri.`,
  },
  {
    id: `sql-008`,
    type: "single",
    topic: `General`,
    prompt: `You have two tables named SalesPerson and Sales. You need to ensure that each record in the Sales table has a valid associated salesperson record.

Which database object should you add to the Sales table?`,
    options: [`nonclustered index`, `primary key`, `foreign key`, `clustered index`],
    correctIndex: 2,
    explanation: `Foreign key asigură integritatea referențială — fiecare SalesPersonID din Sales trebuie să existe în SalesPerson.`,
  },
  {
    id: `sql-009`,
    type: "single",
    topic: `General`,
    prompt: `Table PlayerStat has fields: PlayerID (INT), TeamID (INT), GameDate (DATETIME), Points (INT).

You need to display the total number of points per player on TeamID = 1.

What goes after SELECT PlayerID, ___?`,
    options: [`COUNT`, `TeamID`, `SUM(Points)`, `PlayerID`],
    correctIndex: 2,
    explanation: `Pentru totalul de puncte se folosește SUM(Points). COUNT numără rânduri, nu adună valori.`,
  },
  {
    id: `sql-010`,
    type: "single",
    topic: `General`,
    prompt: `For the PlayerStat query (total points per player, TeamID=1), what keyword filters by TeamID = 1?`,
    options: [`HAVING`, `GROUP BY`, `WHERE`, `ORDER BY`],
    correctIndex: 2,
    explanation: `WHERE filtrează rânduri individuale ÎNAINTE de grupare. TeamID = 1 e o condiție pe rând, nu pe grup.`,
  },
  {
    id: `sql-011`,
    type: "single",
    topic: `General`,
    prompt: `For the PlayerStat query (total points per player, TeamID=1), what keyword groups results by player?`,
    options: [`HAVING`, `WHERE`, `ORDER BY`, `GROUP BY`],
    correctIndex: 3,
    explanation: `GROUP BY PlayerID grupează rândurile pe fiecare jucător pentru a calcula SUM(Points) per jucător.`,
  },
  {
    id: `sql-012`,
    type: "single",
    topic: `General`,
    prompt: `You have a table named Customer. You need to create a new column named District of type INTEGER.

Which statement should you use?`,
    options: [`ALTER TABLE Customer MODIFY (District INTEGER);`, `ALTER TABLE Customer ADD (District INTEGER);`, `ALTER TABLE Customer ADD (INTEGER District);`, `MODIFY TABLE Customer ADD (INTEGER District);`],
    correctIndex: 1,
    explanation: `ALTER TABLE ... ADD adaugă o coloană nouă. MODIFY schimbă o coloană existentă. Sintaxa: NumeColoană TipDate.`,
  },
  {
    id: `sql-013`,
    type: "single",
    topic: `General`,
    prompt: `You have a table with ProductID and ProductCategory:
32→books, 25→books, 67→movies, 89→movies.

Which term describes the relationship between ProductID and ProductCategory?`,
    options: [`compositional`, `relationally dependent`, `deterministic`, `functionally dependent`],
    correctIndex: 3,
    explanation: `Functionally dependent: ProductID determină unic ProductCategory. Fiecare ID are exact o categorie.`,
  },
  {
    id: `sql-014`,
    type: "single",
    topic: `General`,
    prompt: `A stored procedure contains:
SELECT 'Greetings ' + Prefix + ' ' + FirstName FROM Person;

It returns all NULL values. There IS data in the Person table.

What is the likely cause?`,
    options: [`The Prefix or FirstName columns have null values`, `The plus (+) operator cannot be used to append character data`, `You must specify the JOIN keyword in the SELECT statement`, `You must specify the NULLIF keyword in the query`],
    correctIndex: 0,
    explanation: `În SQL Server, NULL + orice = NULL. Dacă Prefix sau FirstName e NULL, întregul rezultat al concatenării devine NULL.`,
  },
  {
    id: `sql-015`,
    type: "single",
    topic: `General`,
    prompt: `Which syntax correctly creates a table named Student with columns ID (INT), Name (VARCHAR), Age (INT)?`,
    options: [`CREATE ( TABLE Student  ID INT, Name VARCHAR(100), Age INT);`, `CREATE Student( ID INT, Name VARCHAR(100), Age INT);`, `CREATE TABLE Student( ID INT, Name VARCHAR(100), Age INT);`, `CREATE TABLE ( ID INT, Name VARCHAR(100), Age INT);`],
    correctIndex: 2,
    explanation: `Sintaxa corectă: CREATE TABLE NumeTabel( coloane ). Trebuie și TABLE și numele tabelului înainte de paranteză.`,
  },
  {
    id: `sql-016`,
    type: "single",
    topic: `General`,
    prompt: `You need to combine the results of two queries into a single result that contains all rows from both queries.

Which SQL statement should you use?`,
    options: [`EXCEPT`, `TRUNCATE`, `UNION`, `JOIN`],
    correctIndex: 2,
    explanation: `UNION combină rezultatele a două SELECT-uri. EXCEPT exclude rânduri. TRUNCATE șterge date. JOIN combină coloane.`,
  },
  {
    id: `sql-017`,
    type: "single",
    topic: `General`,
    prompt: `Which feature does a relational database use to ensure that data entered into a column is valid?`,
    options: [`an attribute`, `a primary key`, `a constraint`, `an index`],
    correctIndex: 2,
    explanation: `Constraints (constrângeri) validează datele: NOT NULL, CHECK, UNIQUE, FK, PK. Un index optimizează performanța, nu validează.`,
  },
  {
    id: `sql-018`,
    type: "single",
    topic: `General`,
    prompt: `Which statement removes all rows from a table without logging the individual row deletions?`,
    options: [`ALTER TABLE`, `DROP TABLE`, `TRUNCATE TABLE`, `CREATE TABLE`],
    correctIndex: 2,
    explanation: `TRUNCATE TABLE șterge toate rândurile rapid fără a loga fiecare ștergere individual. DROP TABLE șterge tot tabelul.`,
  },
  {
    id: `sql-019`,
    type: "single",
    topic: `General`,
    prompt: `You work at a coffee shop. You need a data type in a database table to store charges on purchases and run financial functions.

Which data type should you recommend?`,
    options: [`binary`, `bit`, `decimal`, `varchar`],
    correctIndex: 2,
    explanation: `DECIMAL e pentru valori numerice cu zecimale exacte — ideal pentru bani. BIT=0/1, BINARY=date binare, VARCHAR=text.`,
  },
  {
    id: `sql-020`,
    type: "single",
    topic: `General`,
    prompt: `Table Volunteer has columns Id and GivenName. You need to change Tia's name to Kimberly.

Which statement should you choose?`,
    options: [`UPDATE GivenName = 'Kimberly'
FROM Volunteer
WHERE GivenName = 'Tia';`, `SET Volunteer = 'Kimberly'
WHERE GivenName = 'Tia';`, `UPDATE Volunteer
SET GivenName = 'Kimberly'
WHERE GivenName = 'Tia';`, `SET GivenName = 'Kimberly'
FROM Volunteer
WHERE GivenName = 'Tia';`],
    correctIndex: 2,
    explanation: `Sintaxa UPDATE: UPDATE tabel SET coloană = valoare WHERE condiție.`,
  },
  {
    id: `sql-021`,
    type: "single",
    topic: `General`,
    prompt: `You execute:
SELECT EmployeeID, FirstName, DepartmentName
FROM Employee, Department;

Which type of operation was performed?`,
    options: [`outer join`, `Cartesian product`, `equi-join`, `intersection`],
    correctIndex: 1,
    explanation: `SELECT din două tabele fără JOIN sau WHERE = produs cartezian (Cartesian product). Fiecare rând se combină cu fiecare.`,
  },
  {
    id: `sql-022`,
    type: "single",
    topic: `General`,
    prompt: `How is a function different from a stored procedure?`,
    options: [`A function must be called from a trigger`, `A function cannot contain a transaction`, `A function cannot accept parameters`, `A function must return a value`],
    correctIndex: 3,
    explanation: `Diferența principală: o funcție TREBUIE să returneze o valoare. O procedură stocată poate, dar nu e obligatoriu.`,
  },
  {
    id: `sql-023`,
    type: "single",
    topic: `General`,
    prompt: `Which query returns orders placed after January 2023 in all states EXCEPT California (CA)?`,
    options: [`SELECT * FROM orders WHERE order_date > '2023-01-31' OR ship_state <> 'CA';`, `SELECT * FROM orders WHERE order_date > '2023-01-31' AND ship_state LIKE 'CA';`, `SELECT * FROM orders WHERE order_date > '2023-01-31' OR ship_state LIKE 'CA';`, `SELECT * FROM orders WHERE order_date > '2023-01-31' AND ship_state <> 'CA';`],
    correctIndex: 3,
    explanation: `Ambele condiții trebuie îndeplinite simultan → AND. Diferit de CA → <>. LIKE se folosește cu wildcards (%).`,
  },
  {
    id: `sql-024`,
    type: "single",
    topic: `General`,
    prompt: `Your database has a table named Customer. You need to delete the record with CustomerID of 12345.

Which statement should you use?`,
    options: [`DELETE FROM Customer WHERE CustomerID = 12345;`, `UPDATE CustomerID FROM Customer DELETE * WHERE CustomerID = 12345;`, `DELETE CustomerID FROM Customer WHERE CustomerID = 12345;`, `UPDATE Customer DELETE * WHERE CustomerID = 12345;`],
    correctIndex: 0,
    explanation: `Sintaxa DELETE: DELETE FROM tabel WHERE condiție. Nu se specifică coloane la DELETE.`,
  },
  {
    id: `sql-025`,
    type: "single",
    topic: `General`,
    prompt: `You need to delete a database table.

Which data definition language (DDL) keyword should you use?`,
    options: [`DELETE`, `ALTER`, `TRUNCATE`, `DROP`],
    correctIndex: 3,
    explanation: `DROP este DDL și șterge întregul tabel (structură + date). DELETE este DML (șterge doar rânduri).`,
  },
  {
    id: `sql-026`,
    type: "single",
    topic: `General`,
    prompt: `What is a benefit of creating a stored procedure?`,
    options: [`bypasses case sensitivity requirements`, `gives the user control of the query logic`, `minimizes storage space`, `improves performance`],
    correctIndex: 3,
    explanation: `Stored procedures sunt pre-compilate pe server → execuție mai rapidă → îmbunătățesc performanța.`,
  },
  {
    id: `sql-027`,
    type: "single",
    topic: `General`,
    prompt: `The Products table has ItemNumber, ItemName, ItemDescription, Price.

Which query increases the price of item 1 by 6 percent?`,
    options: [`UPDATE Products SET Price = Price * 1.06 WHERE ItemNumber = 1;`, `ALTER Products SET Price = Price * 1.06 WHERE ItemNumber = 1;`, `SET Price = Price * 1.06 FROM Products WHERE ItemNumber = 1;`, `USE Products SET Price = Price * 1.06 WHERE ItemNumber = 1;`],
    correctIndex: 0,
    explanation: `UPDATE tabel SET coloana = expresie WHERE condiție. Price * 1.06 = creștere cu 6%.`,
  },
  {
    id: `sql-028`,
    type: "single",
    topic: `General`,
    prompt: `Table Volunteer has columns ID, GivenName, DateOfBirth.
You need to delete all records with GivenName 'Tia'.

Which SQL statement should you use?`,
    options: [`DELETE FROM Volunteer WHERE GivenName = 'Tia';`, `DELETE FROM Volunteer WHERE GivenName == 'Tia';`, `DELETE FROM Volunteer WHERE GivenName EQUALS 'Tia';`, `DELETE FROM Volunteer WHERE GivenName IS 'Tia';`],
    correctIndex: 0,
    explanation: `Operatorul de comparație în SQL este = (un singur egal). == nu există, EQUALS nu există, IS se folosește doar cu NULL.`,
  },
  {
    id: `sql-029`,
    type: "single",
    topic: `General`,
    prompt: `You need to change ProductCategory to 43 for all spoons in the Product table.
ProductDescription of 'spoon' indicates a spoon.

Which statement should you use?`,
    options: [`SET Product WHERE ProductDescription = 'spoon' TO ProductCategory = 43;`, `SET Product TO ProductCategory = 43 WHERE ProductDescription = 'spoon';`, `UPDATE Product WHERE ProductDescription = 'spoon' SET ProductCategory = 43;`, `UPDATE Product SET ProductCategory = 43 WHERE ProductDescription = 'spoon';`],
    correctIndex: 3,
    explanation: `Ordinea corectă: UPDATE tabel SET coloana=valoare WHERE condiție. SET vine DUPĂ UPDATE, nu singur.`,
  },
  {
    id: `sql-030`,
    type: "single",
    topic: `General`,
    prompt: `The Customers table has CustomerID, Address, Region, Country.

Which query returns the number of customers in each country that has fewer than 50 customers?`,
    options: [`SELECT Country, CustomerID FROM Customers GROUP BY Country WHERE COUNT(CustomerID) < 50;`, `SELECT Country, CustomerID FROM Customers WHERE COUNT(CustomerID) < 50 GROUP BY Country;`, `SELECT COUNT(CustomerID), Country FROM Customers GROUP BY Country HAVING COUNT(CustomerID) < 50;`, `SELECT COUNT(CustomerID), Country FROM Customers HAVING COUNT(CustomerID) < 50 GROUP BY Country;`],
    correctIndex: 2,
    explanation: `HAVING filtrează grupuri (nu WHERE). Ordinea: GROUP BY vine înainte de HAVING.`,
  },
  {
    id: `sql-031`,
    type: "single",
    topic: `General`,
    prompt: `You need to remove a view named EmployeeView from your database.

Which statement should you use?`,
    options: [`DROP EmployeeView;`, `DELETE VIEW EmployeeView;`, `DELETE EmployeeView;`, `DROP VIEW EmployeeView;`],
    correctIndex: 3,
    explanation: `Sintaxa corectă: DROP VIEW NumeView. Nu DELETE VIEW. Și trebuie specificat cuvântul VIEW.`,
  },
  {
    id: `sql-032`,
    type: "single",
    topic: `General`,
    prompt: `Your company stores SSN in a column in the Customers table. You need to remove the SSN column.
The query ALTER TABLE Customers REMOVE SSN; causes an error.

What is the correct statement?`,
    options: [`ALTER TABLE Customers DELETE SSN;`, `ALTER TABLE Customers DROP SSN;`, `ALTER TABLE Customers DELETE COLUMN SSN;`, `ALTER TABLE Customers DROP COLUMN SSN;`],
    correctIndex: 3,
    explanation: `Pentru a șterge o coloană: ALTER TABLE tabel DROP COLUMN numeColoana. DELETE nu e valid, REMOVE nu e valid.`,
  },
  {
    id: `sql-033`,
    type: "single",
    topic: `General`,
    prompt: `CREATE TABLE Road (RoadID INTEGER NOT NULL, Distance INTEGER NOT NULL);
Existing data: 1234→22, 1384→34.

You execute: INSERT INTO Road VALUES (1234, 36);

What is the result?`,
    options: [`An error stating that duplicate IDs are not allowed`, `An error stating that NULL values are not allowed`, `A syntax error`, `A new row in the table`],
    correctIndex: 3,
    explanation: `Nu există PRIMARY KEY definit! NOT NULL nu înseamnă UNIQUE. Fără PK, duplicatele sunt permise → rând nou inserat.`,
  },
  {
    id: `sql-034`,
    type: "single",
    topic: `General`,
    prompt: `Which statement deletes rows where the employee's phone number is not entered?`,
    options: [`DELETE FROM Employee WHERE Phone = NULL;`, `DELETE FROM Employee WHERE Phone = NULLABLE;`, `DELETE FROM Employee WHERE Phone IS NOT NULL;`, `DELETE FROM Employee WHERE Phone IS NULL;`],
    correctIndex: 3,
    explanation: `Phone not entered = NULL. Se testează cu IS NULL (nu = NULL). IS NOT NULL ar șterge pe cei CU telefon.`,
  },
  {
    id: `sql-035`,
    type: "single",
    topic: `General`,
    prompt: `You have an ERD: Machine → Assignment ← Operator (with referential integrity).

INSERT INTO Assignment(MachineID, OperatorID) values (3, 4);

Error: FK conflict on 'FK_Assignment_Machine', table 'dbo.Machine', column 'ID'.

What is the cause?`,
    options: [`The Assignment table has an existing row with MachineID value of 3`, `The Machine table has no rows that have an ID value of 3`, `The Operator table has no rows that have an ID value of 4`, `The Assignment table has an existing row with OperatorID value of 4`],
    correctIndex: 1,
    explanation: `Eroarea menționează FK_Assignment_Machine și coloana ID din Machine → MachineID=3 nu există în tabela Machine.`,
  },
  {
    id: `sql-036`,
    type: "single",
    topic: `General`,
    prompt: `Which statement creates an index?`,
    options: [`CREATE TABLE Employee (EmployeeID INTEGER INDEX);`, `CREATE TABLE Employee (EmployeeID INTEGER DISTINCT);`, `CREATE TABLE Employee (EmployeeID INTEGER PRIMARY KEY);`, `CREATE TABLE Employee (EmployeeID INTEGER NULL);`],
    correctIndex: 2,
    explanation: `PRIMARY KEY creează automat un clustered index. INDEX, DISTINCT și NULL nu creează indexuri.`,
  },
  {
    id: `sql-037`,
    type: "single",
    topic: `General`,
    prompt: `Table Product has 1 million rows. Query:
SELECT ProductName, Price FROM Product WHERE Category = 'Science Books';

What will make this search more efficient?`,
    options: [`a non-clustered index on the Category column`, `a clustered index on the ProductName column`, `a clustered index on the Price column`, `a non-clustered index on the Price column`],
    correctIndex: 0,
    explanation: `Filtrul este pe Category (WHERE Category = ...). Un index pe Category accelerează căutarea. Non-clustered pentru că probabil PK are deja clustered.`,
  },
  {
    id: `sql-038`,
    type: "single",
    topic: `General`,
    prompt: `Query:
SELECT Title FROM Movie WHERE Title = 'Sample Movie'
ORDER BY Title
GROUP BY Title
HAVING COUNT(*) = 1;

This returns a syntax error. What should you do?`,
    options: [`Remove the GROUP BY clause`, `Change HAVING to HAVING COUNT(Title) = 1`, `Remove the ORDER BY clause`, `Change HAVING to HAVING COUNT(1) = 1`],
    correctIndex: 2,
    explanation: `ORDER BY trebuie să fie ULTIMA clauză (după GROUP BY și HAVING). Aici e înainte de GROUP BY → syntax error. Soluția: elimini ORDER BY sau îl muți la final.`,
  },
  {
    id: `sql-039`,
    type: "single",
    topic: `General`,
    prompt: `A database table stores school attendance.
StudentName must be a string. GradeLevel must be a whole number. DaysAbsent can have one decimal.

Match data types:
StudentName = ?, GradeLevel = ?, DaysAbsent = ?`,
    options: [`VARCHAR, INT, DECIMAL`, `CHAR, DECIMAL, INT`, `INT, VARCHAR, DATETIME`, `VARCHAR, DECIMAL, INT`],
    correctIndex: 0,
    explanation: `String → VARCHAR, whole number → INT, one decimal → DECIMAL.`,
  },
  {
    id: `sql-040`,
    type: "single",
    topic: `General`,
    prompt: `Building table: BuildingID, Address, InspectorID, InspectionDate.
NULL in InspectionDate = not yet inspected.

You need addresses of the earliest 10 buildings that HAVE been inspected.

What goes in: SELECT ___ Address FROM Building WHERE InspectionDate ___ ORDER BY InspectionDate;`,
    options: [`TOP 10, IS NOT NULL`, `TOP 10, IS NULL`, `COUNT, IS NOT NULL`, `GROUP BY 10, IS NULL`],
    correctIndex: 0,
    explanation: `TOP 10 = primele 10 rezultate. IS NOT NULL = doar cele inspectate. ORDER BY InspectionDate = cele mai vechi primele.`,
  },
  {
    id: `sql-041`,
    type: "multi",
    topic: `General`,
    prompt: `You are developing a SQL statement to create a table.

Which two SQL keywords are valid to use in a CREATE TABLE statement? (Choose 2)`,
    options: [`CONSTRAINT`, `ORDER BY`, `INSERT INTO`, `PRIMARY KEY`],
    correctIndices: [0, 3],
    min: 2,
    explanation: `CONSTRAINT și PRIMARY KEY sunt valide în CREATE TABLE. ORDER BY e pentru SELECT, INSERT INTO e pentru inserare.`,
  },
  {
    id: `sql-042`,
    type: "single",
    topic: `General`,
    prompt: `Which statement should you use to remove a foreign key?`,
    options: [`ALTER FOREIGN KEY;`, `DELETE TABLE;`, `DELETE FOREIGN KEY;`, `ALTER TABLE;`],
    correctIndex: 3,
    explanation: `Foreign key se elimină cu ALTER TABLE ... DROP CONSTRAINT. Deci comanda începe cu ALTER TABLE.`,
  },
  {
    id: `sql-043`,
    type: "multi",
    topic: `General`,
    prompt: `Tables: Chapter (ChapterId PK) and Language (LanguageId PK).
You create ChapterLanguage to relate them with a composite primary key.

Which two columns should you select?`,
    options: [`Region`, `ChapterId`, `LanguageId`, `City`, `Country`, `LanguageName`],
    correctIndices: [1, 2],
    min: 2,
    explanation: `Composite PK = primary key-urile celor două tabele: ChapterId + LanguageId.`,
  },
  {
    id: `sql-044`,
    type: "single",
    topic: `General`,
    prompt: `Two queries on Machine/Assignment/Operator tables:

Query 1: SELECT Machine.Name FROM Machine JOIN Assignment ON MachineID = Machine.ID;
Query 2: SELECT Operator.Name FROM Operator LEFT JOIN Assignment ON OperatorID = Operator.ID;

Assignment has 2 rows (MachineID: 1,2 / OperatorID: 1,2). All tables have 3 rows.

How many rows does Query 1 return?`,
    options: [`1`, `2`, `3`, `6`],
    correctIndex: 1,
    explanation: `INNER JOIN returnează doar rândurile cu potrivire. Assignment are 2 rânduri cu MachineID 1 și 2 → 2 mașini găsite.`,
  },
  {
    id: `sql-045`,
    type: "single",
    topic: `General`,
    prompt: `Same scenario as above.

How many rows does Query 2 (LEFT JOIN) return?`,
    options: [`1`, `2`, `3`, `6`],
    correctIndex: 2,
    explanation: `LEFT JOIN returnează TOȚI operatorii (3), chiar și cei fără assignment. Operator 3 (Nina) nu are assignment dar apare cu NULL.`,
  },
  {
    id: `sql-046`,
    type: "single",
    topic: `General`,
    prompt: `The Customers table includes Extension column with some NULL values.

You need customers that HAVE extensions, sorted by LastName.

What goes in WHERE ___ and the last line?`,
    options: [`Extension IS NOT NULL ... ORDER BY LastName`, `Extension = NOT NULL ... ORDER BY LastName`, `Extension IS NULL ... ORDER BY LastName`, `Extension IS NOT NULL ... GROUP BY LastName`],
    correctIndex: 0,
    explanation: `Have extensions = nu sunt NULL → IS NOT NULL. Sortat = ORDER BY (nu GROUP BY).`,
  },
  {
    id: `sql-047`,
    type: "single",
    topic: `General`,
    prompt: `ItemsOnOrder table: ID, ItemNumber, Quantity, UnitPrice, LineItemTotal.

You need: total number of orders, average line item total, highest line item total, grand total.

Which query should you use?`,
    options: [`SELECT COUNT(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM ItemsOnOrder
HAVING ItemNumber, Quantity, UnitPrice;`, `SELECT SUM(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM ItemsOnOrder;`, `SELECT COUNT(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM ItemsOnOrder;`, `SELECT COUNT(ID), AVG(UnitPrice*Quantity), MAX(UnitPrice*Quantity), SUM(UnitPrice*Quantity)
FROM ItemsOnOrder
GROUP BY ItemNumber, LineItemTotal;`],
    correctIndex: 2,
    explanation: `COUNT(ID) = nr comenzi, AVG/MAX/SUM pe LineItemTotal. Fără GROUP BY (vrem totaluri generale). SUM(ID) e greșit.`,
  },
  {
    id: `sql-048`,
    type: "single",
    topic: `General`,
    prompt: `Student enrollment report requirements:
- Students enrolled on or after June 1, 2024
- Students who graduated in 2024
- Ordered by most recent enrollment date first

Which query is correct?`,
    options: [`... WHERE (enrollment_date >= '2024-06-01') OR (academic_status='Graduated' AND graduation_date >= '2024-01-01')
ORDER BY enrollment_date DESC;`, `... WHERE (enrollment_date >= '2024-06-01') AND (academic_status='Graduated' AND graduation_date >= '2024-01-01')
ORDER BY enrollment_date ASC;`, `... WHERE (enrollment_date >= '2024-06-01') AND (academic_status='Graduated' OR graduation_date >= '2024-01-01')
ORDER BY enrollment_date;`, `... WHERE (enrollment_date >= '2024-06-01') OR (academic_status='Graduated' OR graduation_date >= '2024-01-01')
ORDER BY enrollment_date DESC;`],
    correctIndex: 0,
    explanation: `OR între cele două categorii (înscriși SAU absolvenți). AND între academic_status și graduation_date. DESC = cel mai recent primul.`,
  },
  {
    id: `sql-049`,
    type: "single",
    topic: `General`,
    prompt: `You want to create a view that shows only ID, Name, and Type from the Company table for companies in the state of 'UT'.

Which approach is correct?`,
    options: [`CREATE VIEW CompanyView AS SELECT * FROM Company WHERE State = 'UT';`, `CREATE VIEW CompanyView AS SELECT ID, Name, Type FROM Company WHERE State = 'UT';`, `INSERT VIEW CompanyView AS SELECT ID, Name, Type FROM Company WHERE State = 'UT';`, `CREATE TABLE CompanyView AS SELECT ID, Name, Type FROM Company WHERE State = 'UT';`],
    correctIndex: 1,
    explanation: `CREATE VIEW ... AS SELECT doar coloanele dorite. Nu SELECT * (ar include toate coloanele). Nu INSERT VIEW sau CREATE TABLE.`,
  },
  {
    id: `sql-050`,
    type: "single",
    topic: `General`,
    prompt: `You have three tables: student, enrollment, course.
You need student names and course names. Students not enrolled should NOT be returned.

The original query uses OUTER JOIN and WHERE instead of proper JOINs.

How should you correct it?`,
    options: [`Use INNER JOIN enrollment ON enrollment.courseID = course.courseID
INNER JOIN student ON enrollment.studentID = student.studentID`, `Use LEFT JOIN on all tables`, `Use CROSS JOIN between all tables`, `Add a WHERE clause with all conditions`],
    correctIndex: 0,
    explanation: `INNER JOIN returnează doar studenții înscriși (exclude neînscriși). Trebuie JOIN prin tabelul enrollment care leagă student de course.`,
  },
  {
    id: `sql-051`,
    type: "single",
    topic: `General`,
    prompt: `You are designing an ERD for Machine and Operator tables (many-to-many relationship).

The Assignment junction table needs foreign keys.

What keys should the MACHINE table's ID and OPERATOR table's ID have?`,
    options: [`Both should be foreign keys`, `Both should be primary keys in their own tables`, `Machine.ID should be a primary key, Operator.ID should be a foreign key`, `Both should be composite keys`],
    correctIndex: 1,
    explanation: `Machine.ID e PK în Machine, Operator.ID e PK în Operator. Assignment va avea FK-uri care referă aceste PK-uri.`,
  },
  {
    id: `sql-052`,
    type: "single",
    topic: `General`,
    prompt: `A clustered index improves the performance of queries that:`,
    options: [`return a single specific row by ID`, `return a range of values`, `use aggregate functions only`, `use subqueries`],
    correctIndex: 1,
    explanation: `Clustered index sortează datele fizic → excelent pentru range queries (BETWEEN, >, <) unde rândurile consecutive sunt stocate împreună.`,
  },
  {
    id: `sql-053`,
    type: "single",
    topic: `General`,
    prompt: `A clustered index improves the performance of queries on columns that:`,
    options: [`contain only NULL values`, `are rarely used in queries`, `are frequently used for sorting or range searches`, `store binary data`],
    correctIndex: 2,
    explanation: `Clustered index e ideal pe coloane folosite frecvent în ORDER BY sau WHERE cu range-uri, deoarece datele sunt deja sortate fizic.`,
  },
  {
    id: `sql-054`,
    type: "single",
    topic: `General`,
    prompt: `You need to set up a view of North American mammals (NorthAmericanMammals_View).

Which keyword starts the definition?`,
    options: [`INSERT VIEW [dbo].[NorthAmericanMammals_View]`, `CREATE VIEW [dbo].[NorthAmericanMammals_View]`, `ALTER VIEW [dbo].[NorthAmericanMammals_View]`, `SELECT VIEW [dbo].[NorthAmericanMammals_View]`],
    correctIndex: 1,
    explanation: `Un view nou se creează cu CREATE VIEW. INSERT VIEW și SELECT VIEW nu există. ALTER VIEW modifică un view existent.`,
  },
  {
    id: `sql-055`,
    type: "single",
    topic: `General`,
    prompt: `For the NorthAmericanMammals view, what comes after the view name?`,
    options: [`AS JOIN a.Id, a.Name`, `AS SELECT a.Id, a.Name`, `FROM Animal a`, `JOIN Animal a`],
    correctIndex: 1,
    explanation: `După CREATE VIEW NumeView vine AS SELECT ... Aceasta definește query-ul pe care view-ul îl execută.`,
  },
  {
    id: `sql-056`,
    type: "single",
    topic: `General`,
    prompt: `Which SQL command is classified as DML (Data Manipulation Language)?`,
    options: [`CREATE TABLE`, `DROP TABLE`, `ALTER TABLE`, `INSERT INTO`],
    correctIndex: 3,
    explanation: `DML = manipulare date: SELECT, INSERT, UPDATE, DELETE. DDL = definire structură: CREATE, ALTER, DROP, TRUNCATE.`,
  },
  {
    id: `sql-057`,
    type: "single",
    topic: `General`,
    prompt: `You have a table with 1000 rows. You run:
DELETE FROM MyTable;

What happens?`,
    options: [`The table structure and all data are removed`, `All 1000 rows are deleted, each deletion is logged, table structure remains`, `All rows are removed without logging, table structure remains`, `A syntax error occurs`],
    correctIndex: 1,
    explanation: `DELETE FROM fără WHERE șterge toate rândurile cu logare individuală. Structura tabelului rămâne. DROP ar șterge tot, TRUNCATE nu logază.`,
  },
  {
    id: `sql-058`,
    type: "single",
    topic: `General`,
    prompt: `What does the keyword DISTINCT do in a SELECT statement?`,
    options: [`Sorts results in ascending order`, `Removes duplicate rows from the result set`, `Limits the number of rows returned`, `Groups rows by a column`],
    correctIndex: 1,
    explanation: `DISTINCT elimină rândurile duplicate din rezultat. ORDER BY sortează, TOP limitează, GROUP BY grupează.`,
  },
  {
    id: `sql-059`,
    type: "single",
    topic: `General`,
    prompt: `Which of the following is NOT a valid aggregate function in SQL?`,
    options: [`COUNT()`, `AVG()`, `TOTAL()`, `MAX()`],
    correctIndex: 2,
    explanation: `Funcțiile agregate standard: COUNT, SUM, AVG, MIN, MAX. TOTAL() nu există în SQL standard.`,
  },
  {
    id: `sql-060`,
    type: "single",
    topic: `General`,
    prompt: `You have a Customers table. You need to find all customers whose name starts with 'A'.

Which WHERE clause should you use?`,
    options: [`WHERE Name = 'A%'`, `WHERE Name LIKE 'A%'`, `WHERE Name STARTS 'A'`, `WHERE Name BEGINS WITH 'A'`],
    correctIndex: 1,
    explanation: `LIKE cu wildcard % = potrivire parțială. 'A%' = începe cu A. = caută valoarea exactă 'A%'. STARTS și BEGINS WITH nu există.`,
  },
  {
    id: `sql-061`,
    type: "single",
    topic: `General`,
    prompt: `You are structuring a table in a relational database. The table will have a primary key.

For each statement, select True or False:

"Each value in a field in a table must be unique."`,
    options: [`True`, `False`],
    correctIndex: 1,
    explanation: `FALSE — Valorile dintr-un câmp NU trebuie să fie unice (ex: doi studenți cu aceeași vârstă). Doar PK e unică.`,
  },
  {
    id: `sql-062`,
    type: "single",
    topic: `General`,
    prompt: `You have a table named Employee that includes the following columns:
  EmployeeID
  EmployeeName

Which statement should you use to return the number of rows in the table?`,
    options: [`SELECT COUNT(rows)
  FROM Employee;`, `SELECT COUNT(*)
  FROM Employee;`, `SELECT SUM(*)
  FROM Employee;`, `SELECT *
  FROM Employee;`],
    correctIndex: 1,
    explanation: `COUNT(*) numără toate rândurile. COUNT(rows) nu e valid, SUM(*) nu e valid, SELECT * returnează datele.`,
  },
  {
    id: `sql-063`,
    type: "single",
    topic: `General`,
    prompt: `You have the following tables:

┌──────────┐    ┌────────────┐    ┌──────────┐
│ student  │    │ enrollment │    │ course   │
├──────────┤    ├────────────┤    ├──────────┤
│studentID │◄──►│ studentId  │    │ courseId  │
│firstName │    │ courseId   │◄──►│ name     │
│lastName  │    └────────────┘    └──────────┘
└──────────┘

You need to return the student name and each course they are taking. Students who are not enrolled should not be returned.

The original query uses OUTER JOIN and WHERE, which returns an error.

How should you correct the query?`,
    options: [`SELECT student.firstname, student.lastname, course.name FROM course
INNER JOIN enrollment ON enrollment.courseID = course.courseID
INNER JOIN student ON enrollment.studentID = student.studentID;`, `SELECT firstname, lastname, name FROM student
INNER JOIN ON course, enrollment
WHERE enrollment.courseID = course.courseID AND enrollment.studentID = student.studentID;`, `SELECT student.firstname, student.lastname, course.name FROM student
INNER JOIN ON course, enrollment
WHERE enrollment.courseID = course.courseID AND enrollment.studentID = student.studentID;`, `SELECT firstname, lastname, name FROM course
INNER JOIN enrollment WHERE enrollment.courseID = course.courseID
INNER JOIN student WHERE enrollment.studentID = student.studentID;`],
    correctIndex: 0,
    explanation: `INNER JOIN prin enrollment (tabelul de joncțiune). Folosim ON nu WHERE. Excludem studenții neînscriși cu INNER JOIN.`,
  },
  {
    id: `sql-064`,
    type: "multi",
    topic: `General`,
    prompt: `You need to normalize a database to first normal form.

Which two requirements must you meet? (Choose 2.)`,
    options: [`Exclude duplicate rows.`, `Exclude foreign keys.`, `Exclude composite keys.`, `Exclude repeating groups.`],
    correctIndices: [0, 3],
    min: 2,
    explanation: `1NF = (1) Fără rânduri duplicate și (2) Fără grupuri repetitive (fiecare celulă conține o singură valoare).`,
  },
  {
    id: `sql-065`,
    type: "single",
    topic: `General`,
    prompt: `The following is a portion of the Company table:

┌──────┬─────────────────┬───────┬──────┬──────────────────────┬────────────┐
│  ID  │     Name        │ State │ Type │    Description       │    Date    │
├──────┼─────────────────┼───────┼──────┼──────────────────────┼────────────┤
│ 1000 │ Healthy Eats    │  NY   │ ABA  │ Delivers meal kits   │ 02/01/1988 │
│ 1001 │ Rock Music Zone │  UT   │ AZZ  │ Sells musical instr. │ 04/10/2022 │
│ 1002 │ Sunset Web      │  UT   │ CYY  │ Builds custom soft.  │ 08/01/1943 │
│ 1003 │ CompanyPro      │  CA   │ MCC  │ Creates learning sol.│ 12/31/2016 │
└──────┴─────────────────┴───────┴──────┴──────────────────────┴────────────┘

You want to create a view that retrieves only the ID, Name and Type from the table for all companies in the state of UT.

How should you construct the query?`,
    options: [`CREATE VIEW CompanyView AS
SELECT * FROM Company WHERE State = 'UT';`, `CREATE VIEW CompanyView AS
SELECT ID, Name, Type FROM Company WHERE State = 'UT';`, `INSERT VIEW CompanyView AS
SELECT ID, Name, Type FROM Company WHERE State = 'UT';`, `CREATE TABLE CompanyView AS
SELECT ID, Name, Type FROM Company WHERE State = 'UT';`],
    correctIndex: 1,
    explanation: `CREATE VIEW ... AS SELECT doar coloanele dorite (ID, Name, Type), nu SELECT *. INSERT VIEW nu există.`,
  },
  {
    id: `sql-066`,
    type: "single",
    topic: `General`,
    prompt: `You have a table named Product that contains the following data:

┌───────────┬─────────────┬────────────┐
│ ProductID │ ProductName │ CategoryID │
├───────────┼─────────────┼────────────┤
│   3296    │   Spoon     │    2222    │
│   1114    │   Chair     │    4444    │
└───────────┴─────────────┴────────────┘

The ProductID column is the primary key. The CategoryID column is a foreign key to a separate table named Category.

You execute the following statement:

INSERT INTO Product
    VALUES (3296, 'Table', 4444);

What is the result?`,
    options: [`A foreign key constraint violation`, `A new row in the Product table`, `A syntax error`, `A new row in the Category table`, `A primary key constraint violation`],
    correctIndex: 4,
    explanation: `ProductID 3296 deja există în tabel → Primary Key Constraint Violation. PK nu permite duplicate.`,
  },
  {
    id: `sql-067`,
    type: "single",
    topic: `General`,
    prompt: `A table named PlayerStat contains the following fields:

┌──────────┬───────────┬─────────────┐
│  Field   │ Data Type │ Allow Nulls │
├──────────┼───────────┼─────────────┤
│ PlayerID │   INT     │    FALSE    │
│ TeamID   │   INT     │    FALSE    │
│ GameDate │ DATETIME  │    TRUE     │
│ Points   │   INT     │    TRUE     │
└──────────┴───────────┴─────────────┘

You need to display the total number of points per player on the team whose TeamID is 1.

Complete the query:
SELECT PlayerID, [___]
FROM PlayerStat
[___] TeamID = 1
[___] PlayerID`,
    options: [`SUM(Points), WHERE, GROUP BY`, `COUNT, WHERE, GROUP BY`, `SUM(Points), HAVING, ORDER BY`, `COUNT, HAVING, GROUP BY`],
    correctIndex: 0,
    explanation: `SUM(Points) = total puncte. WHERE TeamID=1 filtrează înainte de grupare. GROUP BY PlayerID grupează per jucător.`,
  },
  {
    id: `sql-068`,
    type: "single",
    topic: `General`,
    prompt: `A table has a clustered index.

"A clustered index improves the performance of queries that ___"
"A clustered index improves the performance of queries on columns that ___"`,
    options: [`...return a range of values / ...are used in ORDER BY or range searches`, `...return a single row / ...contain NULL values`, `...use subqueries / ...store binary data`, `...use aggregate functions / ...are rarely queried`],
    correctIndex: 0,
    explanation: `Clustered index sortează datele fizic → ideal pt range queries și coloane folosite frecvent în ORDER BY / WHERE cu range.`,
  },
  {
    id: `sql-069`,
    type: "single",
    topic: `General`,
    prompt: `You have a table named Customer. You need to create a new column named District.

Which statement should you use?`,
    options: [`ALTER TABLE Customer
MODIFY (District INTEGER);`, `ALTER TABLE Customer
ADD (District INTEGER);`, `ALTER TABLE Customer
ADD (INTEGER District);`, `MODIFY TABLE Customer
ADD (INTEGER District);`],
    correctIndex: 1,
    explanation: `ALTER TABLE ... ADD (NumeColoană TipDate). MODIFY schimbă o coloană existentă, nu adaugă.`,
  },
  {
    id: `sql-070`,
    type: "single",
    topic: `General`,
    prompt: `You have a table that contains the following data:

┌───────────┬─────────────────┐
│ ProductID │ ProductCategory │
├───────────┼─────────────────┤
│    32     │     books       │
│    25     │     books       │
│    67     │     movies      │
│    89     │     movies      │
└───────────┴─────────────────┘

Which database term is used to describe the relationship between ProductID and ProductCategory?`,
    options: [`compositional`, `relationally dependent`, `deterministic`, `functionally dependent`],
    correctIndex: 3,
    explanation: `Functionally dependent: ProductID determină unic ProductCategory (fiecare ID → exact o categorie).`,
  },
  {
    id: `sql-071`,
    type: "single",
    topic: `General`,
    prompt: `A stored procedure contains the following query:

SELECT 'Greetings ' + Prefix + ' ' + FirstName FROM Person;

The stored procedure returns all null values. You verify that there is data in the Person table.

What is likely the cause of this problem?`,
    options: [`The Prefix or FirstName columns have null values.`, `The plus (+) operator cannot be used to append character data.`, `You must specify the JOIN keyword in the SELECT statement.`, `You must specify the NULLIF keyword in the query.`],
    correctIndex: 0,
    explanation: `În SQL Server, NULL + orice string = NULL. Dacă Prefix sau FirstName e NULL, tot rezultatul concatenării e NULL.`,
  },
  {
    id: `sql-072`,
    type: "single",
    topic: `General`,
    prompt: `You are creating a database object named Student to store the following data:

┌────┬────────┬─────┐
│ ID │  Name  │ Age │
├────┼────────┼─────┤
│  1 │  Rene  │  18 │
│  2 │  Tia   │  22 │
│  3 │  Oliver│  25 │
└────┴────────┴─────┘

Which syntax should you use to create the object?`,
    options: [`CREATE (
TABLE Student
  ID INT,
  Name VARCHAR (100),
  Age INT);`, `CREATE Student(
  ID INT,
  Name VARCHAR (100),
  Age INT);`, `CREATE TABLE Student(
  ID INT,
  Name VARCHAR (100),
  Age INT);`, `CREATE TABLE (
  ID INT,
  Name VARCHAR (100),
  Age INT);`],
    correctIndex: 2,
    explanation: `CREATE TABLE NumeTabel( coloane ). Trebuie CREATE TABLE + numele tabelului + paranteza cu coloane.`,
  },
  {
    id: `sql-073`,
    type: "single",
    topic: `General`,
    prompt: `You need to set up a database to provide a view of North American mammals (NorthAmericanMammals_View).

Code Segments available:
• CREATE VIEW [dbo].[NorthAmericanMammals_View]
• INSERT VIEW [dbo].[NorthAmericanMammals_View]
• AS JOIN a.Id, a.Name
• AS SELECT a.Id, a.Name
• FROM Animal a
• JOIN Animal a

Complete the statement:
[___]
[___]
[___]
WHERE a.Class = 'Mammals'
AND a.InNorthAmerica = 1;`,
    options: [`CREATE VIEW..., AS SELECT a.Id a.Name, FROM Animal a`, `INSERT VIEW..., AS JOIN a.Id a.Name, FROM Animal a`, `CREATE VIEW..., AS SELECT a.Id a.Name, JOIN Animal a`, `INSERT VIEW..., AS JOIN a.Id a.Name, JOIN Animal a`],
    correctIndex: 0,
    explanation: `CREATE VIEW (nu INSERT VIEW) + AS SELECT (nu AS JOIN) + FROM Animal a.`,
  },
  {
    id: `sql-074`,
    type: "single",
    topic: `General`,
    prompt: `You work at a coffee shop. They ask you to set up a website that stores charges on purchases.
You need to recommend a data type in a database table to run financial functions against the charged amounts.

Which data type should you recommend?`,
    options: [`binary`, `bit`, `decimal`, `varchar`],
    correctIndex: 2,
    explanation: `DECIMAL = precizie exactă pt bani. BIT=0/1, BINARY=date binare, VARCHAR=text.`,
  },
  {
    id: `sql-075`,
    type: "single",
    topic: `General`,
    prompt: `You accept an IT internship at a local charity. The charity asks you to keep a record of its volunteers using a database table named Volunteer. The table has the following columns and rows:

┌────┬───────────┐
│ Id │ GivenName │
├────┼───────────┤
│  1 │    Tia    │
│  2 │   Susana  │
│  3 │    Joey   │
└────┴───────────┘

You need to change Tia's name to Kimberly.

Which statement should you choose?`,
    options: [`UPDATE GivenName = 'Kimberly'
FROM Volunteer
WHERE GivenName = 'Tia';`, `SET Volunteer = 'Kimberly'
WHERE GivenName = 'Tia';`, `UPDATE Volunteer
SET GivenName = 'Kimberly'
WHERE GivenName = 'Tia';`, `SET GivenName = 'Kimberly'
FROM Volunteer
WHERE GivenName = 'Tia';`],
    correctIndex: 2,
    explanation: `UPDATE tabel SET coloană = valoare WHERE condiție. Ordinea: UPDATE → SET → WHERE.`,
  },
  {
    id: `sql-076`,
    type: "single",
    topic: `General`,
    prompt: `You execute the following query:

SELECT EmployeeID, FirstName, DepartmentName
FROM Employee, Department;

Which type of operation was performed?`,
    options: [`outer join.`, `Cartesian product.`, `equi-join.`, `intersection.`],
    correctIndex: 1,
    explanation: `SELECT din două tabele separate prin virgulă, fără JOIN/WHERE = Cartesian product (produs cartezian).`,
  },
  {
    id: `sql-077`,
    type: "single",
    topic: `General`,
    prompt: `How is a function different from a stored procedure?`,
    options: [`A function must be called from a trigger.`, `A function cannot contain a transaction.`, `A function cannot accept parameters.`, `A function must return a value.`],
    correctIndex: 3,
    explanation: `Diferența cheie: o funcție TREBUIE să returneze o valoare. Stored procedures pot sau nu returna valori.`,
  },
  {
    id: `sql-078`,
    type: "single",
    topic: `General`,
    prompt: `Which query returns a result set of orders placed after January 2023 in all states except California (CA)?`,
    options: [`SELECT * FROM orders WHERE order_date > '2023-01-31' OR ship_state <> 'CA';`, `SELECT * FROM orders WHERE order_date > '2023-01-31' AND ship_state LIKE 'CA';`, `SELECT * FROM orders WHERE order_date > '2023-01-31' OR ship_state LIKE 'CA';`, `SELECT * FROM orders WHERE order_date > '2023-01-31' AND ship_state <> 'CA';`],
    correctIndex: 3,
    explanation: `Ambele condiții simultane → AND. Excepție CA → <> (not equal). LIKE e pt pattern matching, OR ar include prea mult.`,
  },
  {
    id: `sql-079`,
    type: "single",
    topic: `General`,
    prompt: `Your database contains a table named Customer. You need to delete the record from the Customer table that has a CustomerID of 12345.

Which statement should you use?`,
    options: [`DELETE FROM Customer
  WHERE CustomerID = 12345;`, `UPDATE CustomerID
  FROM Customer
  DELETE *
  WHERE CustomerID = 12345;`, `DELETE CustomerID
  FROM Customer
  WHERE CustomerID = 12345;`, `UPDATE Customer
  DELETE *
  WHERE CustomerID = 12345;`],
    correctIndex: 0,
    explanation: `DELETE FROM tabel WHERE condiție. Nu se specifică coloane la DELETE și nu se combină cu UPDATE.`,
  },
  {
    id: `sql-080`,
    type: "single",
    topic: `General`,
    prompt: `The Products table contains the following data:

┌────────────┬───────────────┬────────────────────────────────────────────┬───────┐
│ ItemNumber │   ItemName    │            ItemDescription                │ Price │
├────────────┼───────────────┼────────────────────────────────────────────┼───────┤
│     1      │ Bonbon Box    │ Chocolate Truffles, Black Forest...      │ 24.95 │
│     2      │ Brownie Bites │ Caramel Nut, German Chocolate...         │ 14.95 │
│     3      │ Cappuccino Co.│ Tasty treats to accompany your java...   │ 21.50 │
│     4      │ Citrus Cooler │ Refreshing citrus cookies...             │ 19.99 │
│     5      │ Fruit Jewels  │ Fruity Favorites...                      │ 29.99 │
└────────────┴───────────────┴────────────────────────────────────────────┴───────┘

Which query will increase the price of item 1 by 6 percent?`,
    options: [`UPDATE Products
SET Price = Price * 1.06
WHERE ItemNumber = 1;`, `ALTER Products
SET Price = Price * 1.06
WHERE ItemNumber = 1;`, `SET Price = Price * 1.06
FROM Products
WHERE ItemNumber = 1;`, `USE Products
SET Price = Price * 1.06
WHERE ItemNumber = 1;`],
    correctIndex: 0,
    explanation: `UPDATE tabel SET coloana = expresie WHERE condiție. Price * 1.06 = +6%. ALTER/USE/SET singur nu sunt valide.`,
  },
  {
    id: `sql-081`,
    type: "single",
    topic: `General`,
    prompt: `You accept an IT internship at a local charity. Table Volunteer:

┌────┬───────────┬─────────────┐
│ ID │ GivenName │ DateOfBirth │
├────┼───────────┼─────────────┤
│  1 │    Tia    │ 1976-05-30  │
│  2 │   Susana  │ 1952-11-04  │
│  3 │    Joey   │ 1963-02-17  │
└────┴───────────┴─────────────┘

You need to delete all records with the GivenName Tia.

Which SQL statement should you use?`,
    options: [`DELETE FROM Volunteer WHERE GivenName = 'Tia';`, `DELETE FROM Volunteer WHERE GivenName == 'Tia';`, `DELETE FROM Volunteer WHERE GivenName EQUALS 'Tia';`, `DELETE FROM Volunteer WHERE GivenName IS 'Tia';`],
    correctIndex: 0,
    explanation: `Operatorul de comparație în SQL este = (un singur egal). == nu există, EQUALS nu există, IS e doar pt NULL.`,
  },
  {
    id: `sql-082`,
    type: "single",
    topic: `General`,
    prompt: `You have a table named Product. The Product table has columns for ProductDescription and ProductCategory.

You need to change the ProductCategory value for all the spoons in the Product table to 43.

A ProductDescription of spoon indicates that the item is a spoon.

Which statement should you use?`,
    options: [`SET Product
  WHERE ProductDescription = 'spoon'
  TO ProductCategory = 43;`, `SET Product
  TO ProductCategory = 43
  WHERE ProductDescription = 'spoon';`, `UPDATE Product
  WHERE ProductDescription = 'spoon'
  SET ProductCategory = 43;`, `UPDATE Product
  SET ProductCategory = 43
  WHERE ProductDescription = 'spoon';`],
    correctIndex: 3,
    explanation: `UPDATE tabel SET coloana=valoare WHERE condiție. SET nu poate fi singur, și WHERE vine DUPĂ SET.`,
  },
  {
    id: `sql-083`,
    type: "single",
    topic: `General`,
    prompt: `The Customers table is defined as follows:

┌────────────┬─────────────────┬────────┬───────────────┐
│ CustomerID │    Address      │ Region │   Country     │
├────────────┼─────────────────┼────────┼───────────────┤
│    123     │ 123 Main Street │ Nevada │ United States │
│    456     │ 456 Rue de Paris│ Paris  │    France     │
│    789     │ 789 Elm Street  │ Maine  │ United States │
└────────────┴─────────────────┴────────┴───────────────┘

You need to write a SQL query that will return the number of customers in each country that has fewer than 50 customers.

Which query should you use?`,
    options: [`SELECT Country, CustomerID
FROM Customers
GROUP BY Country
WHERE COUNT(CustomerID) < 50;`, `SELECT Country, CustomerID
FROM Customers
WHERE COUNT(CustomerID) < 50
GROUP BY Country;`, `SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country
HAVING COUNT(CustomerID) < 50;`, `SELECT COUNT(CustomerID), Country
FROM Customers
HAVING COUNT(CustomerID) < 50
GROUP BY Country;`],
    correctIndex: 2,
    explanation: `HAVING filtrează grupuri (nu WHERE). Ordinea corectă: GROUP BY apoi HAVING. WHERE nu merge cu funcții agregate.`,
  },
  {
    id: `sql-084`,
    type: "single",
    topic: `General`,
    prompt: `Your company stores customer social security numbers in a column named SSN in a table named Customers. New compliance laws prohibit your company from storing this information.

Running the query below causes an error:
ALTER TABLE Customers
REMOVE SSN;

What changes are needed to the query above so that it removes the SSN column from the Customers table?`,
    options: [`ALTER TABLE Customers
DELETE SSN;`, `ALTER TABLE Customers
DROP SSN;`, `ALTER TABLE Customers
DELETE COLUMN SSN;`, `ALTER TABLE Customers
DROP COLUMN SSN;`],
    correctIndex: 3,
    explanation: `DROP COLUMN este sintaxa corectă pt a șterge o coloană. REMOVE, DELETE nu sunt valide pt coloane.`,
  },
  {
    id: `sql-085`,
    type: "single",
    topic: `General`,
    prompt: `You have the following table definition:

CREATE TABLE Road
  (RoadID INTEGER NOT NULL,
   Distance INTEGER NOT NULL);

The Road table contains the following data:

┌────────┬──────────┐
│ RoadID │ Distance │
├────────┼──────────┤
│  1234  │    22    │
│  1384  │    34    │
└────────┴──────────┘

You execute the following statement:

INSERT INTO Road VALUES (1234, 36);

What is the result?`,
    options: [`An error stating that duplicate IDs are not allowed`, `An error stating that NULL values are not allowed`, `A syntax error`, `A new row in the table`],
    correctIndex: 3,
    explanation: `Nu există PRIMARY KEY! NOT NULL ≠ UNIQUE. Fără PK, duplicatele sunt permise → se inserează rândul nou.`,
  },
  {
    id: `sql-086`,
    type: "single",
    topic: `General`,
    prompt: `Which statement deletes the rows where the employee's phone number is not entered?`,
    options: [`DELETE FROM Employee
  WHERE Phone = NULL;`, `DELETE FROM Employee
  WHERE Phone = NULLABLE;`, `DELETE FROM Employee
  WHERE Phone IS NOT NULL;`, `DELETE FROM Employee
  WHERE Phone IS NULL;`],
    correctIndex: 3,
    explanation: `Phone not entered = NULL. Se testează cu IS NULL (nu = NULL, care nu funcționează). IS NOT NULL ar fi opusul.`,
  },
  {
    id: `sql-087`,
    type: "single",
    topic: `General`,
    prompt: `You have the following entity relationship diagram (ERD) with referential integrity enforced:

┌──────────┐    ┌────────────┐    ┌──────────┐
│ Machine  │    │ Assignment │    │ Operator │
├──────────┤    ├────────────┤    ├──────────┤
│ ID       │◄──│ MachineID  │    │ ID       │
│ Name     │    │ OperatorID │──►│ Name     │
│ Model    │    │ Role       │    │Experience│
└──────────┘    └────────────┘    └──────────┘

You run the following query:
INSERT INTO Assignment(MachineID, OperatorID) values (3, 4);

You receive the following error:
Msg 547 - The INSERT statement conflicted with the FOREIGN KEY constraint "FK_Assignment_Machine". The conflict occurred in table "dbo.Machine", column 'ID'.

What is the cause of this problem?`,
    options: [`The Assignment table has an existing row that has a MachineID value of 3.`, `The Machine table has no rows that have an ID value of 3.`, `The Operator table has no rows that have an ID value of 4.`, `The Assignment table has an existing row that has an OperatorID value of 4.`],
    correctIndex: 1,
    explanation: `Eroarea menționează FK_Assignment_Machine și coloana ID din Machine → MachineID=3 nu există în tabela Machine.`,
  },
  {
    id: `sql-088`,
    type: "single",
    topic: `General`,
    prompt: `Which statement creates an index?`,
    options: [`CREATE TABLE Employee
  (EmployeeID INTEGER INDEX);`, `CREATE TABLE Employee
  (EmployeeID INTEGER DISTINCT);`, `CREATE TABLE Employee
  (EmployeeID INTEGER PRIMARY
  KEY);`, `CREATE TABLE Employee
  (EmployeeID INTEGER NULL);`],
    correctIndex: 2,
    explanation: `PRIMARY KEY creează automat un clustered index. INDEX nu e keyword valid în CREATE TABLE. DISTINCT/NULL nu creează indexuri.`,
  },
  {
    id: `sql-089`,
    type: "single",
    topic: `General`,
    prompt: `You have a table named Product that contains one million rows. You need to search for product information using the following query:

SELECT ProductName, Price FROM Product WHERE Category = 'Science Books';

What will make this type of search more efficient?`,
    options: [`a non-clustered index on the Category column`, `a clustered index on the ProductName column`, `a clustered index on the Price column`, `a non-clustered index on the Price column`],
    correctIndex: 0,
    explanation: `Filtrul e pe Category → index pe Category. Non-clustered deoarece PK are deja clustered index.`,
  },
  {
    id: `sql-090`,
    type: "single",
    topic: `General`,
    prompt: `You create the following query to determine whether Sample Movie appears only once in the Movie table.

SELECT Title
FROM Movie
WHERE Title = 'Sample Movie'
ORDER BY Title
GROUP BY Title
HAVING COUNT(*) = 1;

When you run this query, it returns a syntax error. What should you do?`,
    options: [`Remove the GROUP BY clause.`, `Change the HAVING clause to HAVING COUNT(Title) = 1`, `Remove the ORDER BY clause.`, `Change the HAVING clause to HAVING COUNT(1) = 1`],
    correctIndex: 2,
    explanation: `ORDER BY trebuie să fie ULTIMA clauză (după GROUP BY și HAVING). Aici e înainte → eroare de sintaxă.`,
  },
  {
    id: `sql-091`,
    type: "single",
    topic: `General`,
    prompt: `A database table stores information about school attendance:

┌─────────────┬────────────┬─────────────┐
│ StudentName │ GradeLevel │ DaysAbsent  │
├─────────────┼────────────┼─────────────┤
│    John     │     12     │     2.5     │
│    Holly    │     12     │     0.0     │
│    David    │     12     │     3.0     │
└─────────────┴────────────┴─────────────┘

Requirements:
• StudentName must consist of a string of characters.
• GradeLevel must be a whole number.
• DaysAbsent can have one number after the decimal.

Match data types to columns:`,
    options: [`StudentName=VARCHAR, GradeLevel=INT, DaysAbsent=DECIMAL`, `StudentName=CHAR, GradeLevel=DECIMAL, DaysAbsent=INT`, `StudentName=INT, GradeLevel=VARCHAR, DaysAbsent=DATETIME`, `StudentName=VARCHAR, GradeLevel=DECIMAL, DaysAbsent=BIT`],
    correctIndex: 0,
    explanation: `String → VARCHAR, whole number → INT, one decimal → DECIMAL.`,
  },
  {
    id: `sql-092`,
    type: "single",
    topic: `General`,
    prompt: `The following table named Building stores data about buildings and their most recent inspection dates:

┌────────────┬──────────────┬─────────────┐
│   Field    │  Data Type   │ Allow Nulls │
├────────────┼──────────────┼─────────────┤
│ BuildingID │    INT       │    FALSE    │
│ Address    │ VARCHAR(100) │    FALSE    │
│InspectorID│   CHAR(3)    │    TRUE     │
│InspectionDate│ DATETIME  │    TRUE     │
└────────────┴──────────────┴─────────────┘

NULL in InspectionDate means the building has not yet been inspected.

You need to display the addresses of the earliest 10 buildings that have been inspected.

SELECT [___] Address FROM Building
WHERE InspectionDate [___]
[___] InspectionDate;`,
    options: [`TOP 10 / IS NOT NULL / ORDER BY`, `TOP 10 / IS NULL / ORDER BY`, `COUNT / IS NOT NULL / GROUP BY`, `GROUP BY 10 / IS NOT NULL / HAVING`],
    correctIndex: 0,
    explanation: `TOP 10 = primele 10. IS NOT NULL = doar cele inspectate. ORDER BY InspectionDate = cele mai vechi (earliest) primele.`,
  },
  {
    id: `sql-093`,
    type: "single",
    topic: `General`,
    prompt: `The Customers table includes the following data:

┌────┬───────────┬───────────┬───────────────┬───────────┐
│ ID │ FirstName │ LastName  │ PhoneNumber   │ Extension │
├────┼───────────┼───────────┼───────────────┼───────────┤
│  1 │   Hope    │ Ragabash  │ (123)555-0111 │   NULL    │
│  2 │   Luna    │ Faltor    │ (123)555-0112 │   NULL    │
│  3 │  Mickey   │ Sassafras │ (123)555-0113 │    12     │
│  4 │  Minnie   │ Hemingway │ (123)555-0114 │    77     │
│  5 │ Sherlock  │ Steam     │ (123)555-0115 │   NULL    │
└────┴───────────┴───────────┴───────────────┴───────────┘

You need a result set with LastName, PhoneNumber and Extension for customers that have extensions, sorted by the customer's last name.

Complete: SELECT LastName, PhoneNumber, Extension FROM Customers
WHERE [___] [___]
[___] LastName;`,
    options: [`Extension IS NOT NULL / (nothing) / ORDER BY`, `Extension = NOT NULL / (nothing) / ORDER BY`, `Extension IS NULL / (nothing) / ORDER BY`, `Extension IS NOT NULL / (nothing) / GROUP BY`],
    correctIndex: 0,
    explanation: `Have extensions = NOT NULL → IS NOT NULL. Sorted by → ORDER BY (nu GROUP BY).`,
  },
  {
    id: `sql-094`,
    type: "multi",
    topic: `General`,
    prompt: `You accept an IT internship. The charity has two tables: Chapter and Language.

Chapter table:
┌───────────┬───────────────┬────────────┬─────────┐
│ ChapterId │     City      │   Region   │ Country │
├───────────┼───────────────┼────────────┼─────────┤
│     1     │   Chicago     │  Illinois  │   USA   │
│     2     │ Los Angeles   │ California │   USA   │
│     3     │ New York City │  New York  │   USA   │
│     4     │   Toronto     │  Ontario   │ Canada  │
└───────────┴───────────────┴────────────┴─────────┘

Language table:
┌────────────┬──────────────┬─────────┐
│ LanguageId │ LanguageName │ Locale  │
├────────────┼──────────────┼─────────┤
│     1      │   English    │   USA   │
│     2      │   English    │ Canada  │
│     3      │   Spanish    │  Spain  │
└────────────┴──────────────┴─────────┘

You create ChapterLanguage to relate them with a composite primary key.

Which two columns should you select? (Choose 2.)`,
    options: [`Region`, `ChapterId`, `LanguageId`, `City`, `Country`, `LanguageName`],
    correctIndices: [1, 2],
    min: 2,
    explanation: `Composite PK = primary key-urile din ambele tabele: ChapterId + LanguageId.`,
  },
  {
    id: `sql-095`,
    type: "single",
    topic: `General`,
    prompt: `You run the following two queries:

Query 1:
SELECT [Machine].[Name] AS Machine FROM [Machine]
JOIN [Assignment] ON MachineID = Machine.ID;

Query 2:
SELECT [Operator].[Name] AS Operator FROM [Operator]
LEFT JOIN [Assignment] ON OperatorID = Operator.ID;

Machine (3 rows), Operator (3 rows), Assignment (2 rows: MachineID 1,2 / OperatorID 1,2)

How many rows are returned by the first query?`,
    options: [`1`, `2`, `3`, `6`],
    correctIndex: 1,
    explanation: `INNER JOIN: doar mașinile cu assignment. Assignment are MachineID 1 și 2 → 2 mașini potrivite → 2 rânduri.`,
  },
  {
    id: `sql-096`,
    type: "single",
    topic: `General`,
    prompt: `Same scenario. How many rows are returned by the second query (LEFT JOIN)?`,
    options: [`1`, `2`, `3`, `6`],
    correctIndex: 2,
    explanation: `LEFT JOIN: TOȚI operatorii (3), chiar dacă nu au assignment. Operator 3 (Nina V) apare cu NULL → 3 rânduri.`,
  },
  {
    id: `sql-097`,
    type: "single",
    topic: `General`,
    prompt: `The ItemsOnOrder table contains the following data:

┌─────┬────────────┬──────────┬───────────┬───────────────┐
│ ID  │ ItemNumber │ Quantity │ UnitPrice │ LineItemTotal │
├─────┼────────────┼──────────┼───────────┼───────────────┤
│ 100 │     1      │    10    │   24.95   │    249.50     │
│ 100 │     2      │    25    │   14.95   │    373.75     │
│ 100 │     3      │    25    │   19.99   │    499.75     │
│ 101 │     4      │    10    │   25.00   │    250.00     │
│ 102 │     5      │    10    │   29.99   │    299.00     │
└─────┴────────────┴──────────┴───────────┴───────────────┘

You need a query that displays: total number of orders, average line item total, highest line item total, and grand total of all items.

Which query should you use?`,
    options: [`SELECT COUNT(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM ItemsOnOrder
HAVING ItemNumber, Quantity, UnitPrice;`, `SELECT SUM(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM ItemsOnOrder;`, `SELECT COUNT(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM ItemsOnOrder;`, `SELECT COUNT(ID), AVG(UnitPrice+Quantity), MAX(UnitPrice+Quantity), SUM(UnitPrice+Quantity)
FROM ItemsOnOrder
GROUP BY ItemNumber, LineItemTotal;`],
    correctIndex: 2,
    explanation: `COUNT(ID)=nr, AVG/MAX/SUM pe LineItemTotal. Fără GROUP BY (vrem totaluri generale). SUM(ID) nu are sens.`,
  },
  {
    id: `sql-098`,
    type: "single",
    topic: `General`,
    prompt: `You need to create a report for the 2024-2025 school year:
• Display all students who enrolled on or after June 1, 2024.
• Display all students who graduated in 2024.
• Return the result set in order of enrollment, with the most recent enrollment date first.

enrollment_date specifies enrollment. graduation_date specifies graduation. academic_status of Graduated indicates graduated.

Which query should you use?`,
    options: [`SELECT * FROM students
WHERE (enrollment_date >= '2024-06-01') OR (academic_status='Graduated' AND graduation_date >= '2024-01-01')
ORDER BY enrollment_date DESC;`, `SELECT * FROM students
WHERE (enrollment_date >= '2024-06-01') AND (academic_status='Graduated' AND graduation_date >= '2024-01-01')
ORDER BY enrollment_date ASC;`, `SELECT * FROM students
WHERE (enrollment_date >= '2024-06-01') AND (academic_status='Graduated' OR graduation_date >= '2024-01-01')
ORDER BY enrollment_date;`, `SELECT * FROM students
WHERE (enrollment_date >= '2024-06-01') OR (academic_status='Graduated' OR graduation_date >= '2024-01-01')
ORDER BY enrollment_date DESC;`],
    correctIndex: 0,
    explanation: `OR între categorii (enrolled SAU graduated). AND între status+date pt graduated. DESC = most recent first.`,
  },
  {
    id: `sql-099`,
    type: "single",
    topic: `General`,
    prompt: `You are designing a database with these requirements:
• MACHINE table represents all machines (ID uniquely identifies each)
• OPERATOR table represents all operators (ID uniquely identifies each)
• Each operator can be assigned to zero or more machines
• Each machine can be assigned to zero or more operators

What type of relationship is this?`,
    options: [`One-to-One`, `One-to-Many`, `Many-to-Many`, `Self-referencing`],
    correctIndex: 2,
    explanation: `Fiecare operator → 0+ mașini, fiecare mașină → 0+ operatori = Many-to-Many. Se rezolvă cu junction table (Assignment).`,
  },
  {
    id: `sql-100`,
    type: "single",
    topic: `General`,
    prompt: `Which SQL command is classified as DDL (Data Definition Language)?`,
    options: [`SELECT`, `INSERT INTO`, `UPDATE`, `CREATE TABLE`],
    correctIndex: 3,
    explanation: `DDL = definire structură: CREATE, ALTER, DROP, TRUNCATE. DML = manipulare date: SELECT, INSERT, UPDATE, DELETE.`,
  },
  {
    id: `sql-101`,
    type: "single",
    topic: `General`,
    prompt: `Which of the following correctly describes a PRIMARY KEY?`,
    options: [`Allows NULL values and duplicates`, `Allows NULL values but not duplicates`, `Does not allow NULL values or duplicates`, `Does not allow NULL values but allows duplicates`],
    correctIndex: 2,
    explanation: `PRIMARY KEY = NOT NULL + UNIQUE. Nu permite nici NULL, nici duplicate.`,
  },
  {
    id: `sql-102`,
    type: "single",
    topic: `General`,
    prompt: `You need to find all customers whose name starts with 'A'.

Which WHERE clause should you use?`,
    options: [`WHERE Name = 'A%'`, `WHERE Name LIKE 'A%'`, `WHERE Name STARTS 'A'`, `WHERE Name BEGINS WITH 'A'`],
    correctIndex: 1,
    explanation: `LIKE cu % = pattern matching. 'A%' = începe cu A. = caută valoarea exactă 'A%'. STARTS/BEGINS nu există.`,
  },
  {
    id: `sql-103`,
    type: "single",
    topic: `General`,
    prompt: `What is the difference between WHERE and HAVING?`,
    options: [`WHERE filters groups, HAVING filters rows`, `WHERE filters rows before grouping, HAVING filters groups after grouping`, `They are identical and interchangeable`, `WHERE is used with JOIN, HAVING is used with UNION`],
    correctIndex: 1,
    explanation: `WHERE = filtrare rânduri ÎNAINTE de GROUP BY. HAVING = filtrare grupuri DUPĂ GROUP BY.`,
  },
  {
    id: `sql-104`,
    type: "single",
    topic: `General`,
    prompt: `Which type of JOIN returns ALL rows from the left table, even if there is no match in the right table?`,
    options: [`INNER JOIN`, `CROSS JOIN`, `LEFT JOIN`, `SELF JOIN`],
    correctIndex: 2,
    explanation: `LEFT JOIN returnează toate rândurile din stânga. Dacă nu e match → NULL în coloanele din dreapta.`,
  },
  {
    id: `sql-105`,
    type: "single",
    topic: `General`,
    prompt: `You execute:

SELECT COUNT(*) FROM Orders WHERE Status = 'Shipped'
UNION
SELECT COUNT(*) FROM Orders WHERE Status = 'Pending';

What does this query return?`,
    options: [`A single number: the total count of shipped and pending orders combined`, `Two rows: one with the count of shipped orders, one with pending orders`, `An error because you cannot use UNION with aggregate functions`, `All rows from the Orders table`],
    correctIndex: 1,
    explanation: `UNION combină rezultatele a două SELECT-uri. Fiecare returnează un număr → rezultat: 2 rânduri cu câte un număr.`,
  },
];
