// AUTO-GENERATED from scripts/questions.normalized.json — do not edit by hand.
// Re-run `node scripts/generate-question-modules.mjs` after extracting fresh content.

import type { Question } from "../types";

export const questions: readonly Question[] = [
  {
    id: `sql-001`,
    type: "single",
    topic: `General`,
    prompt: `Construiești un tabel relațional ce va avea o cheie primară.

Afirmația „Toate valorile dintr-o coloană obișnuită trebuie să fie distincte." este corectă?`,
    options: [`Adevărat`, `Fals`],
    correctIndex: 1,
    explanation: `Răspunsul este Fals. Coloanele simple admit valori care se repetă (de exemplu doi clienți pot avea același oraș). Doar coloana declarată PRIMARY KEY este obligată să aibă valori unice.`,
  },
  {
    id: `sql-002`,
    type: "single",
    topic: `General`,
    prompt: `Construiești un tabel relațional ce va avea o cheie primară.

Afirmația „Fiecare rând al tabelei trebuie să fie distinct de celelalte." este corectă?`,
    options: [`Adevărat`, `Fals`],
    correctIndex: 0,
    explanation: `Afirmația este corectă. Cheia primară impune ca nicio combinație de valori a întregului rând să nu se repete, asigurând astfel unicitatea fiecărei înregistrări.`,
  },
  {
    id: `sql-003`,
    type: "single",
    topic: `General`,
    prompt: `Construiești un tabel relațional ce va avea o cheie primară.

Afirmația „Două coloane nu pot purta același nume în interiorul unui tabel." este corectă?`,
    options: [`Adevărat`, `Fals`],
    correctIndex: 0,
    explanation: `Afirmația este corectă. În definiția unei tabele, identificatorul fiecărei coloane trebuie să fie unic, altfel motorul nu poate distinge la care dintre ele se referă o interogare.`,
  },
  {
    id: `sql-004`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel numit Staff care conține coloanele StaffID și StaffName.

Care instrucțiune îți afișează câte rânduri conține tabelul?`,
    options: [`SELECT COUNT(rows) FROM Staff;`, `SELECT COUNT(*) FROM Staff;`, `SELECT SUM(*) FROM Staff;`, `SELECT * FROM Staff;`],
    correctIndex: 1,
    explanation: `Forma corectă este COUNT(*), care însumează toate rândurile prezente în tabel. Varianta COUNT(rows) nu este recunoscută, SUM(*) nu este o sintaxă validă, iar SELECT * descarcă datele propriu-zise, nu un total.`,
  },
  {
    id: `sql-005`,
    type: "multi",
    topic: `General`,
    prompt: `Trebuie să aduci o bază de date la prima formă normală (1NF).

Care două condiții sunt obligatorii? (Alege 2)`,
    options: [`Eliminarea rândurilor duplicate`, `Eliminarea cheilor străine`, `Eliminarea cheilor compuse`, `Eliminarea grupurilor repetitive`],
    correctIndices: [0, 3],
    min: 2,
    explanation: `Pentru 1NF se cer două lucruri: nicio înregistrare nu se repetă (asigurat de cheia primară) și nicio celulă nu conține valori multiple, adică nu există grupuri care se repetă în interiorul unui rând.`,
  },
  {
    id: `sql-006`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel Item cu structura (ItemID PK, ItemName, GroupID FK→Group).
Datele existente: ItemID 3296 = Lingură, ItemID 1114 = Scaun.

Execuți: INSERT INTO Item VALUES (3296, 'Masă', 4444);

Ce se întâmplă?`,
    options: [`Încălcare a unei chei străine`, `O linie nouă apare în tabelul Item`, `Eroare de sintaxă`, `O linie nouă apare în tabelul Group`, `Încălcare a constrângerii de cheie primară`],
    correctIndex: 4,
    explanation: `Valoarea 3296 deja există ca ItemID, deci motorul refuză inserarea cu o eroare de tip Primary Key Constraint Violation. O cheie primară nu permite duplicate.`,
  },
  {
    id: `sql-007`,
    type: "single",
    topic: `General`,
    prompt: `Ai două tabele, fiecare cu câte trei rânduri. Construiești o interogare care folosește CROSS JOIN, fără clauza WHERE.

Câte rânduri are produsul cartezian rezultat?`,
    options: [`0`, `3`, `6`, `9`],
    correctIndex: 3,
    explanation: `CROSS JOIN combină fiecare rând al unei tabele cu fiecare rând al celeilalte. Pentru două seturi de câte trei intrări obținem 3 înmulțit cu 3, prin urmare 9 rânduri.`,
  },
  {
    id: `sql-008`,
    type: "single",
    topic: `General`,
    prompt: `Ai două tabele numite Agent și Deal. Vrei ca fiecare înregistrare din Deal să facă referire la un agent existent.

Ce element ar trebui adăugat tabelului Deal?`,
    options: [`un index nonclustered`, `o cheie primară`, `o cheie străină`, `un index clustered`],
    correctIndex: 2,
    explanation: `Soluția este o cheie străină, care impune integritatea referențială: orice AgentID din Deal trebuie să corespundă unui rând existent în tabelul Agent.`,
  },
  {
    id: `sql-009`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul AthleteScore are câmpurile: AthleteID (INT), SquadID (INT), MatchDate (DATETIME), Score (INT).

Trebuie să afișezi totalul de scor pentru fiecare atlet din SquadID = 1.

Ce trebuie scris după SELECT AthleteID, ___?`,
    options: [`COUNT`, `SquadID`, `SUM(Score)`, `AthleteID`],
    correctIndex: 2,
    explanation: `Pentru un total numeric folosim funcția SUM aplicată coloanei Score. COUNT doar numără rândurile, deci nu produce suma valorilor.`,
  },
  {
    id: `sql-010`,
    type: "single",
    topic: `General`,
    prompt: `Pentru aceeași interogare pe AthleteScore (totalul scorului pe atlet, doar SquadID = 1), ce clauză aplici filtrul SquadID = 1?`,
    options: [`HAVING`, `GROUP BY`, `WHERE`, `ORDER BY`],
    correctIndex: 2,
    explanation: `Condiția SquadID = 1 vizează rânduri individuale și se aplică înainte de orice grupare, deci aparține clauzei WHERE.`,
  },
  {
    id: `sql-011`,
    type: "single",
    topic: `General`,
    prompt: `Pentru aceeași interogare pe AthleteScore (totalul scorului pe atlet, doar SquadID = 1), ce clauză gruppează rezultatele după atlet?`,
    options: [`HAVING`, `WHERE`, `ORDER BY`, `GROUP BY`],
    correctIndex: 3,
    explanation: `Pentru a calcula SUM(Score) separat pentru fiecare atlet, rândurile trebuie strânse pe AthleteID, lucru realizat prin GROUP BY AthleteID.`,
  },
  {
    id: `sql-012`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel numit Client. Trebuie să adaugi o coloană nouă numită Region, de tip INTEGER.

Ce instrucțiune folosești?`,
    options: [`ALTER TABLE Client MODIFY (Region INTEGER);`, `ALTER TABLE Client ADD (Region INTEGER);`, `ALTER TABLE Client ADD (INTEGER Region);`, `MODIFY TABLE Client ADD (INTEGER Region);`],
    correctIndex: 1,
    explanation: `Pentru a introduce o coloană nouă se foloseste ALTER TABLE împreună cu ADD. MODIFY se utilizează doar pentru a schimba o coloană deja existentă, iar ordinea este nume coloană urmat de tipul de date.`,
  },
  {
    id: `sql-013`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel cu coloanele ItemID și ItemGroup:
32→cărți, 25→cărți, 67→filme, 89→filme.

Ce termen descrie cel mai bine relația dintre ItemID și ItemGroup?`,
    options: [`compozițional`, `dependent relațional`, `determinist`, `dependent funcțional`],
    correctIndex: 3,
    explanation: `Vorbim despre dependență funcțională: cunoașterea valorii ItemID stabilește în mod unic valoarea lui ItemGroup, fiecare identificator având o singură categorie asociată.`,
  },
  {
    id: `sql-014`,
    type: "single",
    topic: `General`,
    prompt: `O procedură stocată conține:
SELECT 'Bună ziua, ' + Title + ' ' + GivenName FROM Contact;

Toate rezultatele apar ca NULL, deși tabelul Contact conține date.

Care este cauza probabilă?`,
    options: [`Coloanele Title sau GivenName conțin valori NULL`, `Operatorul plus (+) nu poate concatena șiruri de caractere`, `Lipsește cuvântul cheie JOIN din SELECT`, `Trebuie folosit cuvântul NULLIF în interogare`],
    correctIndex: 0,
    explanation: `În SQL Server orice concatenare cu un NULL produce tot NULL. Dacă fie Title, fie GivenName este NULL, întreg șirul rezultat devine NULL.`,
  },
  {
    id: `sql-015`,
    type: "single",
    topic: `General`,
    prompt: `Care sintaxă creează corect un tabel numit Pupil cu coloanele ID (INT), Name (VARCHAR) și Age (INT)?`,
    options: [`CREATE ( TABLE Pupil  ID INT, Name VARCHAR(100), Age INT);`, `CREATE Pupil( ID INT, Name VARCHAR(100), Age INT);`, `CREATE TABLE Pupil( ID INT, Name VARCHAR(100), Age INT);`, `CREATE TABLE ( ID INT, Name VARCHAR(100), Age INT);`],
    correctIndex: 2,
    explanation: `Forma corectă cere CREATE TABLE, urmat de numele tabelei și apoi paranteza cu definițiile coloanelor. Lipsa cuvântului TABLE sau a numelui tabelei face instrucțiunea invalidă.`,
  },
  {
    id: `sql-016`,
    type: "single",
    topic: `General`,
    prompt: `Trebuie să unești rezultatele a două interogări într-un singur set ce conține toate rândurile lor.

Care instrucțiune SQL realizează acest lucru?`,
    options: [`EXCEPT`, `TRUNCATE`, `UNION`, `JOIN`],
    correctIndex: 2,
    explanation: `Operatorul UNION reunește două seturi de rezultate. EXCEPT scoate rândurile comune, TRUNCATE golește un tabel, iar JOIN combină coloane, nu seturi.`,
  },
  {
    id: `sql-017`,
    type: "single",
    topic: `General`,
    prompt: `Ce mecanism folosește o bază de date relațională pentru a verifica dacă datele introduse într-o coloană sunt valide?`,
    options: [`un atribut`, `o cheie primară`, `o constrângere`, `un index`],
    correctIndex: 2,
    explanation: `Constrângerile (CHECK, NOT NULL, UNIQUE, FK, PK) se ocupă de validarea valorilor introduse. Un index influențează viteza, nu corectitudinea datelor.`,
  },
  {
    id: `sql-018`,
    type: "single",
    topic: `General`,
    prompt: `Care instrucțiune golește un tabel de toate rândurile fără a înregistra fiecare ștergere în jurnalul de tranzacții?`,
    options: [`ALTER TABLE`, `DROP TABLE`, `TRUNCATE TABLE`, `CREATE TABLE`],
    correctIndex: 2,
    explanation: `TRUNCATE TABLE elimină toate rândurile printr-o singură operațiune, fără logarea individuală a fiecăruia. DROP TABLE ar elimina și definiția tabelei.`,
  },
  {
    id: `sql-019`,
    type: "single",
    topic: `General`,
    prompt: `Lucrezi pentru o cofetărie. Ai nevoie de un tip de date care să stocheze sumele plătite și pe care să rulezi calcule financiare.

Ce tip de date recomanzi?`,
    options: [`binary`, `bit`, `decimal`, `varchar`],
    correctIndex: 2,
    explanation: `Pentru valori monetare cu precizie exactă tipul potrivit este DECIMAL. BIT este pentru 0/1, BINARY pentru date binare, iar VARCHAR pentru text.`,
  },
  {
    id: `sql-020`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Helper are coloanele Id și GivenName. Vrei să schimbi prenumele Mihai în Andrei.

Ce instrucțiune alegi?`,
    options: [`UPDATE GivenName = 'Andrei'
FROM Helper
WHERE GivenName = 'Mihai';`, `SET Helper = 'Andrei'
WHERE GivenName = 'Mihai';`, `UPDATE Helper
SET GivenName = 'Andrei'
WHERE GivenName = 'Mihai';`, `SET GivenName = 'Andrei'
FROM Helper
WHERE GivenName = 'Mihai';`],
    correctIndex: 2,
    explanation: `Sintaxa unei modificări este UPDATE numele_tabelei SET coloana = noua_valoare WHERE condiție. Variantele care încep cu SET singur sau plasează WHERE înainte de SET sunt invalide.`,
  },
  {
    id: `sql-021`,
    type: "single",
    topic: `General`,
    prompt: `Execuți următoarea interogare:
SELECT WorkerID, FirstName, UnitName
FROM Worker, Unit;

Ce tip de operație s-a efectuat?`,
    options: [`outer join`, `produs cartezian`, `equi-join`, `intersecție`],
    correctIndex: 1,
    explanation: `Plasarea a două tabele după FROM, separate prin virgulă, fără JOIN sau WHERE, generează un produs cartezian: fiecare rând dintr-o parte se asociază cu fiecare rând din cealaltă.`,
  },
  {
    id: `sql-022`,
    type: "single",
    topic: `General`,
    prompt: `Prin ce diferă o funcție de o procedură stocată?`,
    options: [`O funcție trebuie apelată dintr-un trigger`, `O funcție nu poate conține o tranzacție`, `O funcție nu acceptă parametri`, `O funcție trebuie să returneze o valoare`],
    correctIndex: 3,
    explanation: `Diferența esențială este obligația de a returna o valoare: funcțiile au mereu un rezultat returnat, în timp ce procedurile pot doar să execute acțiuni, fără a întoarce ceva.`,
  },
  {
    id: `sql-023`,
    type: "single",
    topic: `General`,
    prompt: `Care interogare returnează comenzile plasate după ianuarie 2023, în toate statele cu excepția statului Texas (TX)?`,
    options: [`SELECT * FROM purchases WHERE purchase_date > '2023-01-31' OR delivery_state <> 'TX';`, `SELECT * FROM purchases WHERE purchase_date > '2023-01-31' AND delivery_state LIKE 'TX';`, `SELECT * FROM purchases WHERE purchase_date > '2023-01-31' OR delivery_state LIKE 'TX';`, `SELECT * FROM purchases WHERE purchase_date > '2023-01-31' AND delivery_state <> 'TX';`],
    correctIndex: 3,
    explanation: `Cele două condiții trebuie să fie satisfăcute simultan, deci se folosește AND. Pentru excludere se utilizează operatorul <>, nu LIKE, care e destinat căutărilor după șablon.`,
  },
  {
    id: `sql-024`,
    type: "single",
    topic: `General`,
    prompt: `Baza ta de date conține tabelul Buyer. Vrei să elimini înregistrarea cu BuyerID = 12345.

Ce instrucțiune folosești?`,
    options: [`DELETE FROM Buyer WHERE BuyerID = 12345;`, `UPDATE BuyerID FROM Buyer DELETE * WHERE BuyerID = 12345;`, `DELETE BuyerID FROM Buyer WHERE BuyerID = 12345;`, `UPDATE Buyer DELETE * WHERE BuyerID = 12345;`],
    correctIndex: 0,
    explanation: `Forma standard este DELETE FROM nume_tabel WHERE condiție. La DELETE nu se enumeră coloane, iar combinațiile cu UPDATE nu sunt sintaxe valide.`,
  },
  {
    id: `sql-025`,
    type: "single",
    topic: `General`,
    prompt: `Vrei să elimini complet un tabel din baza de date.

Ce cuvânt cheie DDL folosești?`,
    options: [`DELETE`, `ALTER`, `TRUNCATE`, `DROP`],
    correctIndex: 3,
    explanation: `DROP face parte din DDL și înlătură atât structura, cât și datele tabelului. DELETE face parte din DML și șterge doar rânduri, păstrând tabelul.`,
  },
  {
    id: `sql-026`,
    type: "single",
    topic: `General`,
    prompt: `Care este un avantaj al folosirii procedurilor stocate?`,
    options: [`elimină nevoia de a respecta majusculele`, `oferă utilizatorului control asupra logicii interogării`, `reduce spațiul de stocare`, `îmbunătățește performanța`],
    correctIndex: 3,
    explanation: `Deoarece sunt precompilate pe server și planul lor de execuție este reutilizat, procedurile stocate rulează mai rapid, prin urmare contribuie la o performanță mai bună.`,
  },
  {
    id: `sql-027`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Goods conține ItemNumber, ItemName, ItemDescription și Price.

Care interogare crește prețul articolului 1 cu 6 procente?`,
    options: [`UPDATE Goods SET Price = Price * 1.06 WHERE ItemNumber = 1;`, `ALTER Goods SET Price = Price * 1.06 WHERE ItemNumber = 1;`, `SET Price = Price * 1.06 FROM Goods WHERE ItemNumber = 1;`, `USE Goods SET Price = Price * 1.06 WHERE ItemNumber = 1;`],
    correctIndex: 0,
    explanation: `Modificarea valorilor existente se face prin UPDATE tabel SET coloana = expresie WHERE condiție. Înmulțirea cu 1.06 reprezintă o creștere de 6 la sută.`,
  },
  {
    id: `sql-028`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Helper are coloanele ID, GivenName și DateOfBirth.
Vrei să elimini toate înregistrările unde GivenName este 'Mihai'.

Ce instrucțiune SQL folosești?`,
    options: [`DELETE FROM Helper WHERE GivenName = 'Mihai';`, `DELETE FROM Helper WHERE GivenName == 'Mihai';`, `DELETE FROM Helper WHERE GivenName EQUALS 'Mihai';`, `DELETE FROM Helper WHERE GivenName IS 'Mihai';`],
    correctIndex: 0,
    explanation: `Pentru egalitate în SQL se folosește un singur semn =. Operatorii == sau EQUALS nu există, iar IS este permis exclusiv pentru testul cu NULL.`,
  },
  {
    id: `sql-029`,
    type: "single",
    topic: `General`,
    prompt: `Trebuie să setezi ItemGroup = 43 pentru toate lingurile din tabelul Item.
Un ItemDescription egal cu 'lingură' identifică o lingură.

Ce instrucțiune folosești?`,
    options: [`SET Item WHERE ItemDescription = 'lingură' TO ItemGroup = 43;`, `SET Item TO ItemGroup = 43 WHERE ItemDescription = 'lingură';`, `UPDATE Item WHERE ItemDescription = 'lingură' SET ItemGroup = 43;`, `UPDATE Item SET ItemGroup = 43 WHERE ItemDescription = 'lingură';`],
    correctIndex: 3,
    explanation: `Ordinea corectă este UPDATE tabel, apoi SET coloană = valoare și abia la final WHERE condiție. SET nu poate apărea singur, iar WHERE nu poate precede SET.`,
  },
  {
    id: `sql-030`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Buyer conține BuyerID, Address, Region și Country.

Ce interogare returnează numărul de cumpărători din fiecare țară care are mai puțin de 50 de cumpărători?`,
    options: [`SELECT Country, BuyerID FROM Buyer GROUP BY Country WHERE COUNT(BuyerID) < 50;`, `SELECT Country, BuyerID FROM Buyer WHERE COUNT(BuyerID) < 50 GROUP BY Country;`, `SELECT COUNT(BuyerID), Country FROM Buyer GROUP BY Country HAVING COUNT(BuyerID) < 50;`, `SELECT COUNT(BuyerID), Country FROM Buyer HAVING COUNT(BuyerID) < 50 GROUP BY Country;`],
    correctIndex: 2,
    explanation: `Filtrarea pe rezultatele unei agregări se face cu HAVING, niciodată cu WHERE. Ordinea cerută este GROUP BY înaintea lui HAVING.`,
  },
  {
    id: `sql-031`,
    type: "single",
    topic: `General`,
    prompt: `Vrei să elimini un view numit StaffView din baza de date.

Ce instrucțiune folosești?`,
    options: [`DROP StaffView;`, `DELETE VIEW StaffView;`, `DELETE StaffView;`, `DROP VIEW StaffView;`],
    correctIndex: 3,
    explanation: `Eliminarea unui view se realizează prin DROP VIEW nume_view. Forma DELETE VIEW nu există, iar omiterea cuvântului VIEW lasă comanda incompletă.`,
  },
  {
    id: `sql-032`,
    type: "single",
    topic: `General`,
    prompt: `Compania ta stochează IDNP-ul într-o coloană din tabelul Buyer. Trebuie să elimini coloana IDNP.
Comanda ALTER TABLE Buyer REMOVE IDNP; produce o eroare.

Care este forma corectă?`,
    options: [`ALTER TABLE Buyer DELETE IDNP;`, `ALTER TABLE Buyer DROP IDNP;`, `ALTER TABLE Buyer DELETE COLUMN IDNP;`, `ALTER TABLE Buyer DROP COLUMN IDNP;`],
    correctIndex: 3,
    explanation: `Pentru a scoate o coloană se folosește ALTER TABLE tabel DROP COLUMN nume_coloană. Variantele cu DELETE sau cu REMOVE nu sunt acceptate de SQL.`,
  },
  {
    id: `sql-033`,
    type: "single",
    topic: `General`,
    prompt: `CREATE TABLE Path (PathID INTEGER NOT NULL, Length INTEGER NOT NULL);
Date existente: 1234→22, 1384→34.

Execuți: INSERT INTO Path VALUES (1234, 36);

Care este rezultatul?`,
    options: [`O eroare ce semnalează faptul că ID-urile duplicate nu sunt permise`, `O eroare ce semnalează că valorile NULL nu sunt permise`, `O eroare de sintaxă`, `Un nou rând în tabel`],
    correctIndex: 3,
    explanation: `Tabelul Path nu are nicio cheie primară definită, iar NOT NULL nu impune unicitatea. Fără PRIMARY KEY, valorile duplicate sunt acceptate, deci rândul nou se inserează fără probleme.`,
  },
  {
    id: `sql-034`,
    type: "single",
    topic: `General`,
    prompt: `Care instrucțiune șterge rândurile în care numărul de telefon al angajatului nu a fost completat?`,
    options: [`DELETE FROM Worker WHERE Phone = NULL;`, `DELETE FROM Worker WHERE Phone = NULLABLE;`, `DELETE FROM Worker WHERE Phone IS NOT NULL;`, `DELETE FROM Worker WHERE Phone IS NULL;`],
    correctIndex: 3,
    explanation: `Lipsa unei valori se detectează prin operatorul IS NULL. Comparația = NULL nu produce niciodată adevărat, iar IS NOT NULL ar viza tocmai rândurile completate.`,
  },
  {
    id: `sql-035`,
    type: "single",
    topic: `General`,
    prompt: `Ai o diagramă ERD: Device → Allocation ← Handler (cu integritate referențială impusă).

INSERT INTO Allocation(DeviceID, HandlerID) values (3, 4);

Eroare: conflict FK pe 'FK_Allocation_Device', tabelul 'dbo.Device', coloana 'ID'.

Care este cauza?`,
    options: [`Tabelul Allocation conține deja un rând cu DeviceID = 3`, `Tabelul Device nu are niciun rând cu valoarea ID = 3`, `Tabelul Handler nu are niciun rând cu valoarea ID = 4`, `Tabelul Allocation conține deja un rând cu HandlerID = 4`],
    correctIndex: 1,
    explanation: `Mesajul de eroare indică explicit constrângerea FK_Allocation_Device și coloana ID din Device. Concluzia: valoarea 3 trimisă pentru DeviceID nu se regăsește în tabelul părinte Device.`,
  },
  {
    id: `sql-036`,
    type: "single",
    topic: `General`,
    prompt: `Care instrucțiune duce la crearea unui index?`,
    options: [`CREATE TABLE Worker (WorkerID INTEGER INDEX);`, `CREATE TABLE Worker (WorkerID INTEGER DISTINCT);`, `CREATE TABLE Worker (WorkerID INTEGER PRIMARY KEY);`, `CREATE TABLE Worker (WorkerID INTEGER NULL);`],
    correctIndex: 2,
    explanation: `Atunci când declari o coloană drept PRIMARY KEY, motorul construiește automat un index clustered pe ea. Cuvintele INDEX, DISTINCT sau NULL nu generează indexuri în interiorul CREATE TABLE.`,
  },
  {
    id: `sql-037`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Item are 1 milion de rânduri. Interogarea:
SELECT ItemName, Price FROM Item WHERE Section = 'Manuale Științifice';

Ce optimizare grăbește această căutare?`,
    options: [`un index nonclustered pe coloana Section`, `un index clustered pe coloana ItemName`, `un index clustered pe coloana Price`, `un index nonclustered pe coloana Price`],
    correctIndex: 0,
    explanation: `Filtrul lucrează pe coloana Section, deci un index ridicat pe Section reduce cantitatea de pagini citite. Varianta nonclustered este cea potrivită, fiindcă indexul clustered este de obicei rezervat cheii primare.`,
  },
  {
    id: `sql-038`,
    type: "single",
    topic: `General`,
    prompt: `Interogarea:
SELECT Title FROM Film WHERE Title = 'Demo Film'
ORDER BY Title
GROUP BY Title
HAVING COUNT(*) = 1;

Returnează o eroare de sintaxă. Ce trebuie să faci?`,
    options: [`Să elimini clauza GROUP BY`, `Să schimbi HAVING în HAVING COUNT(Title) = 1`, `Să elimini clauza ORDER BY`, `Să schimbi HAVING în HAVING COUNT(1) = 1`],
    correctIndex: 2,
    explanation: `Clauza ORDER BY trebuie să fie ultima, plasată după GROUP BY și HAVING. Aici apare prematur, înainte de GROUP BY, deci trebuie scoasă sau mutată la sfârșit pentru ca interogarea să fie validă.`,
  },
  {
    id: `sql-039`,
    type: "single",
    topic: `General`,
    prompt: `Un tabel reține prezența la cursuri.
PupilName este șir de caractere. ClassLevel este număr întreg. AbsenceDays poate avea o singură zecimală.

Asociază tipurile de date:
PupilName = ?, ClassLevel = ?, AbsenceDays = ?`,
    options: [`VARCHAR, INT, DECIMAL`, `CHAR, DECIMAL, INT`, `INT, VARCHAR, DATETIME`, `VARCHAR, DECIMAL, INT`],
    correctIndex: 0,
    explanation: `Pentru un șir de caractere folosim VARCHAR, pentru un număr întreg INT, iar pentru o valoare cu o singură zecimală tipul potrivit este DECIMAL.`,
  },
  {
    id: `sql-040`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Edifice: EdificeID, Address, ReviewerID, ReviewDate.
NULL în ReviewDate înseamnă că nu a fost încă inspectat.

Vrei adresele celor mai vechi 10 edificii care AU fost inspectate.

Ce completezi în: SELECT ___ Address FROM Edifice WHERE ReviewDate ___ ORDER BY ReviewDate;`,
    options: [`TOP 10, IS NOT NULL`, `TOP 10, IS NULL`, `COUNT, IS NOT NULL`, `GROUP BY 10, IS NULL`],
    correctIndex: 0,
    explanation: `TOP 10 limitează rezultatul la primele 10 rânduri. IS NOT NULL exclude clădirile neinspectate. ORDER BY ReviewDate aduce mai întâi inspecțiile cele mai vechi.`,
  },
  {
    id: `sql-041`,
    type: "multi",
    topic: `General`,
    prompt: `Construiești o instrucțiune CREATE TABLE.

Care două cuvinte cheie SQL pot apărea în interiorul unui CREATE TABLE? (Alege 2)`,
    options: [`CONSTRAINT`, `ORDER BY`, `INSERT INTO`, `PRIMARY KEY`],
    correctIndices: [0, 3],
    min: 2,
    explanation: `Atât CONSTRAINT, cât și PRIMARY KEY sunt elemente specifice definirii tabelelor. ORDER BY apare în SELECT, iar INSERT INTO este o instrucțiune separată, nu o componentă a CREATE TABLE.`,
  },
  {
    id: `sql-042`,
    type: "single",
    topic: `General`,
    prompt: `Cu ce instrucțiune se elimină o cheie străină dintr-un tabel?`,
    options: [`ALTER FOREIGN KEY;`, `DELETE TABLE;`, `DELETE FOREIGN KEY;`, `ALTER TABLE;`],
    correctIndex: 3,
    explanation: `Cheile străine se șterg printr-un ALTER TABLE urmat de DROP CONSTRAINT, deci comanda pornește obligatoriu cu ALTER TABLE.`,
  },
  {
    id: `sql-043`,
    type: "multi",
    topic: `General`,
    prompt: `Tabelele: Branch (BranchId PK) și Tongue (TongueId PK).
Construiești BranchTongue ca să le legi printr-o cheie primară compusă.

Care două coloane trebuie alese?`,
    options: [`Region`, `BranchId`, `TongueId`, `City`, `Country`, `TongueName`],
    correctIndices: [1, 2],
    min: 2,
    explanation: `O cheie primară compusă într-un tabel de legătură moștenește cheile primare ale tabelelor părinte, în acest caz BranchId și TongueId.`,
  },
  {
    id: `sql-044`,
    type: "single",
    topic: `General`,
    prompt: `Două interogări pe tabelele Device/Allocation/Handler:

Interogarea 1: SELECT Device.Name FROM Device JOIN Allocation ON DeviceID = Device.ID;
Interogarea 2: SELECT Handler.Name FROM Handler LEFT JOIN Allocation ON HandlerID = Handler.ID;

Allocation are 2 rânduri (DeviceID: 1,2 / HandlerID: 1,2). Toate tabelele au 3 rânduri.

Câte rânduri returnează prima interogare?`,
    options: [`1`, `2`, `3`, `6`],
    correctIndex: 1,
    explanation: `Un INNER JOIN păstrează doar perechile cu corespondență. Allocation are doar două rânduri, cu DeviceID 1 și 2, deci doar două dispozitive sunt regăsite și se obțin 2 rânduri.`,
  },
  {
    id: `sql-045`,
    type: "single",
    topic: `General`,
    prompt: `Aceeași configurație ca mai sus.

Câte rânduri returnează interogarea a doua (LEFT JOIN)?`,
    options: [`1`, `2`, `3`, `6`],
    correctIndex: 2,
    explanation: `LEFT JOIN păstrează absolut toți operatorii (3 la număr). Cel fără asociere apare cu valori NULL în coloanele din dreapta, deci totalul rămâne 3 rânduri.`,
  },
  {
    id: `sql-046`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Buyer conține o coloană Extension cu unele valori NULL.

Vrei cumpărătorii care AU extension, sortați după LastName.

Ce completezi pe linia WHERE ___ și pe ultima linie?`,
    options: [`Extension IS NOT NULL ... ORDER BY LastName`, `Extension = NOT NULL ... ORDER BY LastName`, `Extension IS NULL ... ORDER BY LastName`, `Extension IS NOT NULL ... GROUP BY LastName`],
    correctIndex: 0,
    explanation: `Au extension înseamnă că valoarea nu este NULL, deci IS NOT NULL. Sortarea finală se face cu ORDER BY, nu cu GROUP BY, care servește pentru grupări.`,
  },
  {
    id: `sql-047`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul GoodsOnOrder: ID, ItemNumber, Quantity, UnitPrice, LineItemTotal.

Vrei: numărul total de comenzi, media pe linie, valoarea maximă pe linie și totalul general.

Ce interogare folosești?`,
    options: [`SELECT COUNT(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM GoodsOnOrder
HAVING ItemNumber, Quantity, UnitPrice;`, `SELECT SUM(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM GoodsOnOrder;`, `SELECT COUNT(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM GoodsOnOrder;`, `SELECT COUNT(ID), AVG(UnitPrice*Quantity), MAX(UnitPrice*Quantity), SUM(UnitPrice*Quantity)
FROM GoodsOnOrder
GROUP BY ItemNumber, LineItemTotal;`],
    correctIndex: 2,
    explanation: `Numărul de comenzi se obține cu COUNT(ID), iar AVG, MAX și SUM se aplică pe LineItemTotal. Fiindcă vrem indicatori globali, nu se folosește GROUP BY, iar SUM(ID) ar fi lipsit de sens.`,
  },
  {
    id: `sql-048`,
    type: "single",
    topic: `General`,
    prompt: `Cerințele raportului de înmatriculare:
- Studenții înmatriculați la 1 iunie 2024 sau ulterior
- Studenții care au absolvit în 2024
- Sortați după dată de înmatriculare, cea mai recentă prima

Care interogare este corectă?`,
    options: [`... WHERE (enrollment_date >= '2024-06-01') OR (academic_status='Graduated' AND graduation_date >= '2024-01-01')
ORDER BY enrollment_date DESC;`, `... WHERE (enrollment_date >= '2024-06-01') AND (academic_status='Graduated' AND graduation_date >= '2024-01-01')
ORDER BY enrollment_date ASC;`, `... WHERE (enrollment_date >= '2024-06-01') AND (academic_status='Graduated' OR graduation_date >= '2024-01-01')
ORDER BY enrollment_date;`, `... WHERE (enrollment_date >= '2024-06-01') OR (academic_status='Graduated' OR graduation_date >= '2024-01-01')
ORDER BY enrollment_date DESC;`],
    correctIndex: 0,
    explanation: `Cele două categorii (înmatriculați sau absolvenți) se reunesc cu OR, în timp ce între statut și dată se aplică AND. Pentru cele mai recente date primele se folosește DESC.`,
  },
  {
    id: `sql-049`,
    type: "single",
    topic: `General`,
    prompt: `Vrei să creezi un view care arată doar ID, Name și Type din tabelul Firm pentru firmele din statul 'AZ'.

Care abordare este corectă?`,
    options: [`CREATE VIEW FirmView AS SELECT * FROM Firm WHERE State = 'AZ';`, `CREATE VIEW FirmView AS SELECT ID, Name, Type FROM Firm WHERE State = 'AZ';`, `INSERT VIEW FirmView AS SELECT ID, Name, Type FROM Firm WHERE State = 'AZ';`, `CREATE TABLE FirmView AS SELECT ID, Name, Type FROM Firm WHERE State = 'AZ';`],
    correctIndex: 1,
    explanation: `Definiția corectă este CREATE VIEW urmat de AS SELECT cu doar coloanele dorite (ID, Name, Type). SELECT * ar aduce toate coloanele, INSERT VIEW nu există, iar CREATE TABLE produce un tabel, nu un view.`,
  },
  {
    id: `sql-050`,
    type: "single",
    topic: `General`,
    prompt: `Ai trei tabele: pupil, registration, lesson.
Vrei numele elevilor și denumirile lecțiilor. Elevii fără înscriere NU trebuie returnați.

Interogarea inițială folosește OUTER JOIN și WHERE în loc de JOIN-uri propriu-zise.

Cum o corectezi?`,
    options: [`Folosești INNER JOIN registration ON registration.lessonID = lesson.lessonID
INNER JOIN pupil ON registration.pupilID = pupil.pupilID`, `Folosești LEFT JOIN pe toate tabelele`, `Folosești CROSS JOIN între toate tabelele`, `Adaugi un WHERE cu toate condițiile`],
    correctIndex: 0,
    explanation: `Pentru a păstra doar elevii cu înscrieri se aplică INNER JOIN, iar legarea celor trei tabele se face prin tabelul intermediar registration, care unește pupil cu lesson.`,
  },
  {
    id: `sql-051`,
    type: "single",
    topic: `General`,
    prompt: `Proiectezi un ERD între tabelele Device și Handler (relație many-to-many).

Tabelul de joncțiune Allocation are nevoie de chei străine.

Ce tip de chei sunt ID-urile din Device și Handler?`,
    options: [`Ambele sunt chei străine`, `Ambele sunt chei primare în propriile tabele`, `Device.ID este cheie primară, Handler.ID este cheie străină`, `Ambele sunt chei compuse`],
    correctIndex: 1,
    explanation: `Device.ID rămâne cheie primară în Device, iar Handler.ID este cheie primară în Handler. Tabelul Allocation va avea două chei străine care fac referire la aceste chei primare.`,
  },
  {
    id: `sql-052`,
    type: "single",
    topic: `General`,
    prompt: `Un index clustered îmbunătățește performanța interogărilor care:`,
    options: [`returnează un singur rând specific după ID`, `returnează un interval de valori`, `folosesc doar funcții de agregare`, `folosesc subinterogări`],
    correctIndex: 1,
    explanation: `Indexul clustered ordonează datele fizic pe disc, prin urmare este foarte eficient pentru interogări care cer un interval (BETWEEN, >, <), deoarece rândurile vecine sunt stocate împreună.`,
  },
  {
    id: `sql-053`,
    type: "single",
    topic: `General`,
    prompt: `Un index clustered îmbunătățește performanța interogărilor pe coloane care:`,
    options: [`conțin doar valori NULL`, `sunt rar utilizate în interogări`, `sunt folosite frecvent pentru sortare sau căutări de interval`, `stochează date binare`],
    correctIndex: 2,
    explanation: `Coloanele potrivite pentru un index clustered sunt cele apelate des în ORDER BY sau în condiții cu interval, deoarece datele fiind deja sortate fizic, accesul devine direct.`,
  },
  {
    id: `sql-054`,
    type: "single",
    topic: `General`,
    prompt: `Trebuie să configurezi un view pentru mamiferele din America de Nord (NorthAmericanMammals_View).

Ce cuvânt cheie începe definiția?`,
    options: [`INSERT VIEW [dbo].[NorthAmericanMammals_View]`, `CREATE VIEW [dbo].[NorthAmericanMammals_View]`, `ALTER VIEW [dbo].[NorthAmericanMammals_View]`, `SELECT VIEW [dbo].[NorthAmericanMammals_View]`],
    correctIndex: 1,
    explanation: `Un view nou se creează cu CREATE VIEW. INSERT VIEW și SELECT VIEW nu sunt sintaxe valide, iar ALTER VIEW se aplică doar pe un view care există deja.`,
  },
  {
    id: `sql-055`,
    type: "single",
    topic: `General`,
    prompt: `Pentru view-ul NorthAmericanMammals, ce urmează imediat după numele view-ului?`,
    options: [`AS JOIN a.Id, a.Name`, `AS SELECT a.Id, a.Name`, `FROM Beast a`, `JOIN Beast a`],
    correctIndex: 1,
    explanation: `După CREATE VIEW nume_view se scrie AS SELECT urmat de coloanele dorite. Această parte definește interogarea pe care view-ul o execută la fiecare apel.`,
  },
  {
    id: `sql-056`,
    type: "single",
    topic: `General`,
    prompt: `Care comandă SQL este DML (Data Manipulation Language)?`,
    options: [`CREATE TABLE`, `DROP TABLE`, `ALTER TABLE`, `INSERT INTO`],
    correctIndex: 3,
    explanation: `DML cuprinde comenzile care lucrează cu datele propriu-zise: SELECT, INSERT, UPDATE, DELETE. Restul (CREATE, ALTER, DROP, TRUNCATE) modifică structura, deci aparțin DDL.`,
  },
  {
    id: `sql-057`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel cu 1000 de rânduri. Rulezi:
DELETE FROM MyTable;

Ce se întâmplă?`,
    options: [`Structura tabelului și toate datele sunt eliminate`, `Toate cele 1000 de rânduri sunt șterse, fiecare ștergere e logată, structura rămâne`, `Toate rândurile sunt șterse fără logare, structura rămâne`, `Apare o eroare de sintaxă`],
    correctIndex: 1,
    explanation: `Fără clauza WHERE, DELETE elimină fiecare rând și înregistrează individual operațiunile în jurnal. Structura tabelului nu este afectată; pentru ștergere fără logare s-ar folosi TRUNCATE.`,
  },
  {
    id: `sql-058`,
    type: "single",
    topic: `General`,
    prompt: `Ce face cuvântul cheie DISTINCT într-un SELECT?`,
    options: [`Sortează rezultatele crescător`, `Elimină rândurile duplicate din rezultat`, `Limitează numărul de rânduri returnate`, `Grupează rândurile după o coloană`],
    correctIndex: 1,
    explanation: `DISTINCT scoate rândurile identice din setul de rezultate. Sortarea o face ORDER BY, limitarea o face TOP, iar gruparea aparține lui GROUP BY.`,
  },
  {
    id: `sql-059`,
    type: "single",
    topic: `General`,
    prompt: `Care dintre următoarele NU este o funcție de agregare validă în SQL?`,
    options: [`COUNT()`, `AVG()`, `TOTAL()`, `MAX()`],
    correctIndex: 2,
    explanation: `Funcțiile de agregare standard sunt COUNT, SUM, AVG, MIN și MAX. TOTAL nu face parte din SQL standard, deci este varianta invalidă din listă.`,
  },
  {
    id: `sql-060`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel Buyer. Vrei toți cumpărătorii al căror nume începe cu 'B'.

Ce clauză WHERE folosești?`,
    options: [`WHERE Name = 'B%'`, `WHERE Name LIKE 'B%'`, `WHERE Name STARTS 'B'`, `WHERE Name BEGINS WITH 'B'`],
    correctIndex: 1,
    explanation: `Pentru o potrivire parțială folosim LIKE împreună cu wildcard-ul %. Forma 'B%' acceptă orice text care începe cu B. Operatorul = cere egalitate strictă, iar STARTS sau BEGINS WITH nu există.`,
  },
  {
    id: `sql-061`,
    type: "single",
    topic: `General`,
    prompt: `Construiești un tabel într-o bază relațională. Tabelul va avea o cheie primară.

Pentru fiecare afirmație, alege Adevărat sau Fals:

„Toate valorile dintr-o coloană obișnuită trebuie să fie distincte."`,
    options: [`Adevărat`, `Fals`],
    correctIndex: 1,
    explanation: `Răspunsul este Fals. Valori repetate într-o coloană sunt perfect permise (de exemplu doi clienți cu aceeași țară). Doar coloana definită ca PRIMARY KEY trebuie să fie unică.`,
  },
  {
    id: `sql-062`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel numit Staff cu coloanele:
  StaffID
  StaffName

Care instrucțiune returnează numărul de rânduri din tabel?`,
    options: [`SELECT COUNT(rows)
  FROM Staff;`, `SELECT COUNT(*)
  FROM Staff;`, `SELECT SUM(*)
  FROM Staff;`, `SELECT *
  FROM Staff;`],
    correctIndex: 1,
    explanation: `COUNT(*) parcurge toate rândurile și le numără. COUNT(rows) și SUM(*) nu sunt forme valide, iar SELECT * doar afișează datele propriu-zise.`,
  },
  {
    id: `sql-063`,
    type: "single",
    topic: `General`,
    prompt: `Ai următoarele tabele:

┌──────────┐    ┌────────────┐    ┌──────────┐
│  pupil   │    │registration│    │  lesson  │
├──────────┤    ├────────────┤    ├──────────┤
│ pupilID  │◄──►│  pupilId   │    │ lessonId │
│firstName │    │  lessonId  │◄──►│   name   │
│lastName  │    └────────────┘    └──────────┘
└──────────┘

Trebuie să returnezi numele elevilor și denumirile lecțiilor pe care le urmează. Elevii fără înscriere nu trebuie incluși.

Interogarea inițială folosește OUTER JOIN și WHERE și produce eroare.

Cum o corectezi?`,
    options: [`SELECT pupil.firstname, pupil.lastname, lesson.name FROM lesson
INNER JOIN registration ON registration.lessonID = lesson.lessonID
INNER JOIN pupil ON registration.pupilID = pupil.pupilID;`, `SELECT firstname, lastname, name FROM pupil
INNER JOIN ON lesson, registration
WHERE registration.lessonID = lesson.lessonID AND registration.pupilID = pupil.pupilID;`, `SELECT pupil.firstname, pupil.lastname, lesson.name FROM pupil
INNER JOIN ON lesson, registration
WHERE registration.lessonID = lesson.lessonID AND registration.pupilID = pupil.pupilID;`, `SELECT firstname, lastname, name FROM lesson
INNER JOIN registration WHERE registration.lessonID = lesson.lessonID
INNER JOIN pupil WHERE registration.pupilID = pupil.pupilID;`],
    correctIndex: 0,
    explanation: `Soluția corectă folosește INNER JOIN prin tabelul intermediar registration, cu condițiile exprimate prin ON, nu prin WHERE. Astfel sunt eliminați elevii fără înscriere.`,
  },
  {
    id: `sql-064`,
    type: "multi",
    topic: `General`,
    prompt: `Trebuie să normalizezi o bază de date la prima formă normală.

Care două cerințe trebuie îndeplinite? (Alege 2.)`,
    options: [`Eliminarea rândurilor duplicate.`, `Eliminarea cheilor străine.`, `Eliminarea cheilor compuse.`, `Eliminarea grupurilor repetitive.`],
    correctIndices: [0, 3],
    min: 2,
    explanation: `Prima formă normală cere două lucruri: niciun rând să nu se repete și nicio celulă să nu conțină valori multiple, deci fără grupuri repetitive în interiorul unei singure coloane.`,
  },
  {
    id: `sql-065`,
    type: "single",
    topic: `General`,
    prompt: `Mai jos este o porțiune din tabelul Firm:

┌──────┬─────────────────┬───────┬──────┬──────────────────────┬────────────┐
│  ID  │     Name        │ State │ Type │    Description       │    Date    │
├──────┼─────────────────┼───────┼──────┼──────────────────────┼────────────┤
│ 1000 │ Healthy Eats    │  NY   │ ABA  │ Livrează kit-uri     │ 02/01/1988 │
│ 1001 │ Rock Music Zone │  AZ   │ AZZ  │ Vinde instrumente    │ 04/10/2022 │
│ 1002 │ Sunset Web      │  AZ   │ CYY  │ Software personalizat│ 08/01/1943 │
│ 1003 │ FirmPro         │  CA   │ MCC  │ Soluții educaționale │ 12/31/2016 │
└──────┴─────────────────┴───────┴──────┴──────────────────────┴────────────┘

Vrei un view care preia doar ID, Name și Type pentru toate firmele din statul AZ.

Cum construiești interogarea?`,
    options: [`CREATE VIEW FirmView AS
SELECT * FROM Firm WHERE State = 'AZ';`, `CREATE VIEW FirmView AS
SELECT ID, Name, Type FROM Firm WHERE State = 'AZ';`, `INSERT VIEW FirmView AS
SELECT ID, Name, Type FROM Firm WHERE State = 'AZ';`, `CREATE TABLE FirmView AS
SELECT ID, Name, Type FROM Firm WHERE State = 'AZ';`],
    correctIndex: 1,
    explanation: `Definiția corectă a unui view conține CREATE VIEW urmat de AS SELECT cu doar coloanele cerute (ID, Name, Type). SELECT * ar aduce toate coloanele, iar INSERT VIEW nu este o sintaxă recunoscută.`,
  },
  {
    id: `sql-066`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel numit Item cu următoarele date:

┌───────────┬─────────────┬────────────┐
│  ItemID   │  ItemName   │  GroupID   │
├───────────┼─────────────┼────────────┤
│   3296    │   Lingură   │    2222    │
│   1114    │   Scaun     │    4444    │
└───────────┴─────────────┴────────────┘

Coloana ItemID este cheia primară. Coloana GroupID este cheie străină către un tabel separat numit Group.

Execuți următoarea instrucțiune:

INSERT INTO Item
    VALUES (3296, 'Masă', 4444);

Care este rezultatul?`,
    options: [`O încălcare a constrângerii de cheie străină`, `Un nou rând în tabelul Item`, `O eroare de sintaxă`, `Un nou rând în tabelul Group`, `O încălcare a constrângerii de cheie primară`],
    correctIndex: 4,
    explanation: `Valoarea 3296 există deja ca ItemID în tabel, deci motorul respinge inserarea cu o eroare Primary Key Constraint Violation. Cheile primare nu permit valori repetate.`,
  },
  {
    id: `sql-067`,
    type: "single",
    topic: `General`,
    prompt: `Un tabel numit AthleteScore are următoarele câmpuri:

┌──────────┬───────────┬─────────────┐
│  Câmp    │ Tip date  │ Permite NULL│
├──────────┼───────────┼─────────────┤
│ AthleteID│   INT     │    FALSE    │
│ SquadID  │   INT     │    FALSE    │
│ MatchDate│ DATETIME  │    TRUE     │
│ Score    │   INT     │    TRUE     │
└──────────┴───────────┴─────────────┘

Vrei să afișezi totalul scorului pe atlet pentru echipa cu SquadID = 1.

Completează interogarea:
SELECT AthleteID, [___]
FROM AthleteScore
[___] SquadID = 1
[___] AthleteID`,
    options: [`SUM(Score), WHERE, GROUP BY`, `COUNT, WHERE, GROUP BY`, `SUM(Score), HAVING, ORDER BY`, `COUNT, HAVING, GROUP BY`],
    correctIndex: 0,
    explanation: `SUM(Score) generează totalul punctelor, WHERE SquadID = 1 filtrează rândurile dorite înainte de grupare, iar GROUP BY AthleteID adună rezultatele separat pentru fiecare atlet.`,
  },
  {
    id: `sql-068`,
    type: "single",
    topic: `General`,
    prompt: `Un tabel are un index clustered.

„Un index clustered îmbunătățește performanța interogărilor care ___"
„Un index clustered îmbunătățește performanța interogărilor pe coloane care ___"`,
    options: [`...returnează un interval de valori / ...sunt folosite în ORDER BY sau căutări de interval`, `...returnează un singur rând / ...conțin valori NULL`, `...folosesc subinterogări / ...stochează date binare`, `...folosesc funcții de agregare / ...sunt rar interogate`],
    correctIndex: 0,
    explanation: `Pentru că datele sunt sortate fizic pe disc, indexul clustered este optim atunci când interogarea cere intervale sau coloana este folosită frecvent pentru sortare ori pentru filtre cu interval.`,
  },
  {
    id: `sql-069`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel Client. Vrei să adaugi o coloană nouă numită Region.

Ce instrucțiune folosești?`,
    options: [`ALTER TABLE Client
MODIFY (Region INTEGER);`, `ALTER TABLE Client
ADD (Region INTEGER);`, `ALTER TABLE Client
ADD (INTEGER Region);`, `MODIFY TABLE Client
ADD (INTEGER Region);`],
    correctIndex: 1,
    explanation: `Adăugarea unei coloane se face prin ALTER TABLE ... ADD (NumeColoană TipDate). MODIFY ar fi pentru o coloană deja prezentă, iar inversarea ordinii nume/tip e respinsă de parser.`,
  },
  {
    id: `sql-070`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel cu următoarele date:

┌───────────┬─────────────────┐
│  ItemID   │   ItemGroup     │
├───────────┼─────────────────┤
│    32     │     cărți       │
│    25     │     cărți       │
│    67     │     filme       │
│    89     │     filme       │
└───────────┴─────────────────┘

Ce termen din baze de date descrie relația dintre ItemID și ItemGroup?`,
    options: [`compozițional`, `dependent relațional`, `determinist`, `dependent funcțional`],
    correctIndex: 3,
    explanation: `Este vorba de dependență funcțională: pentru fiecare ItemID există o singură valoare ItemGroup posibilă, deci ItemID determină în mod unic categoria.`,
  },
  {
    id: `sql-071`,
    type: "single",
    topic: `General`,
    prompt: `O procedură stocată conține următoarea interogare:

SELECT 'Bună ziua, ' + Title + ' ' + GivenName FROM Contact;

Procedura returnează doar valori NULL. Ai verificat și există date în tabelul Contact.

Care este cauza probabilă?`,
    options: [`Coloanele Title sau GivenName conțin valori NULL.`, `Operatorul plus (+) nu poate concatena șiruri de caractere.`, `Trebuie specificat cuvântul JOIN în SELECT.`, `Trebuie specificat cuvântul NULLIF în interogare.`],
    correctIndex: 0,
    explanation: `În SQL Server orice șir concatenat cu NULL produce NULL. Dacă Title sau GivenName este NULL pentru un rând, întreaga concatenare devine NULL pentru acel rând.`,
  },
  {
    id: `sql-072`,
    type: "single",
    topic: `General`,
    prompt: `Creezi un obiect numit Pupil pentru a stoca datele:

┌────┬────────┬─────┐
│ ID │  Name  │ Age │
├────┼────────┼─────┤
│  1 │  Diana │  18 │
│  2 │  Andrei│  22 │
│  3 │  Vlad  │  25 │
└────┴────────┴─────┘

Ce sintaxă folosești pentru a crea obiectul?`,
    options: [`CREATE (
TABLE Pupil
  ID INT,
  Name VARCHAR (100),
  Age INT);`, `CREATE Pupil(
  ID INT,
  Name VARCHAR (100),
  Age INT);`, `CREATE TABLE Pupil(
  ID INT,
  Name VARCHAR (100),
  Age INT);`, `CREATE TABLE (
  ID INT,
  Name VARCHAR (100),
  Age INT);`],
    correctIndex: 2,
    explanation: `Sintaxa validă este CREATE TABLE nume_tabel(coloane). Trebuie obligatoriu cuvântul TABLE și numele obiectului plasate înaintea parantezei cu definițiile coloanelor.`,
  },
  {
    id: `sql-073`,
    type: "single",
    topic: `General`,
    prompt: `Trebuie să configurezi o bază de date pentru a oferi un view al mamiferelor din America de Nord (NorthAmericanMammals_View).

Fragmente de cod disponibile:
• CREATE VIEW [dbo].[NorthAmericanMammals_View]
• INSERT VIEW [dbo].[NorthAmericanMammals_View]
• AS JOIN a.Id, a.Name
• AS SELECT a.Id, a.Name
• FROM Beast a
• JOIN Beast a

Completează instrucțiunea:
[___]
[___]
[___]
WHERE a.Class = 'Mammals'
AND a.InNorthAmerica = 1;`,
    options: [`CREATE VIEW..., AS SELECT a.Id a.Name, FROM Beast a`, `INSERT VIEW..., AS JOIN a.Id a.Name, FROM Beast a`, `CREATE VIEW..., AS SELECT a.Id a.Name, JOIN Beast a`, `INSERT VIEW..., AS JOIN a.Id a.Name, JOIN Beast a`],
    correctIndex: 0,
    explanation: `Definiția corectă a unui view începe cu CREATE VIEW (nu INSERT VIEW), continuă cu AS SELECT (nu AS JOIN) și folosește FROM pentru sursa datelor, niciodată JOIN ca prima clauză.`,
  },
  {
    id: `sql-074`,
    type: "single",
    topic: `General`,
    prompt: `Lucrezi pentru o cofetărie. Ți se cere un site care stochează sumele plătite la vânzări.
Vrei să recomanzi un tip de date pe care să rulezi calcule financiare.

Ce tip de date recomanzi?`,
    options: [`binary`, `bit`, `decimal`, `varchar`],
    correctIndex: 2,
    explanation: `Pentru sume monetare cu precizie exactă alegerea naturală este DECIMAL. BIT reține doar 0/1, BINARY este pentru date brute, iar VARCHAR pentru text liber.`,
  },
  {
    id: `sql-075`,
    type: "single",
    topic: `General`,
    prompt: `Faci stagiu IT la o organizație caritabilă. Aceasta vrea să țină evidența voluntarilor într-un tabel numit Helper. Tabelul are următoarele coloane și rânduri:

┌────┬───────────┐
│ Id │ GivenName │
├────┼───────────┤
│  1 │   Mihai   │
│  2 │  Carolina │
│  3 │   Ion     │
└────┴───────────┘

Vrei să schimbi prenumele lui Mihai în Andrei.

Ce instrucțiune alegi?`,
    options: [`UPDATE GivenName = 'Andrei'
FROM Helper
WHERE GivenName = 'Mihai';`, `SET Helper = 'Andrei'
WHERE GivenName = 'Mihai';`, `UPDATE Helper
SET GivenName = 'Andrei'
WHERE GivenName = 'Mihai';`, `SET GivenName = 'Andrei'
FROM Helper
WHERE GivenName = 'Mihai';`],
    correctIndex: 2,
    explanation: `Sintaxa corectă este UPDATE tabel SET coloana = valoare WHERE condiție. Ordinea cuvintelor cheie este UPDATE, apoi SET și abia la sfârșit WHERE.`,
  },
  {
    id: `sql-076`,
    type: "single",
    topic: `General`,
    prompt: `Execuți următoarea interogare:

SELECT WorkerID, FirstName, UnitName
FROM Worker, Unit;

Ce tip de operație s-a efectuat?`,
    options: [`outer join.`, `produs cartezian.`, `equi-join.`, `intersecție.`],
    correctIndex: 1,
    explanation: `Două tabele scrise după FROM, separate doar prin virgulă și fără JOIN sau WHERE, generează un produs cartezian: fiecare combinație posibilă între rânduri apare în rezultat.`,
  },
  {
    id: `sql-077`,
    type: "single",
    topic: `General`,
    prompt: `Prin ce diferă o funcție de o procedură stocată?`,
    options: [`O funcție trebuie apelată dintr-un trigger.`, `O funcție nu poate conține o tranzacție.`, `O funcție nu acceptă parametri.`, `O funcție trebuie să returneze o valoare.`],
    correctIndex: 3,
    explanation: `Diferența principală: o funcție întoarce întotdeauna o valoare, în timp ce o procedură stocată poate executa acțiuni fără a returna nimic.`,
  },
  {
    id: `sql-078`,
    type: "single",
    topic: `General`,
    prompt: `Care interogare returnează comenzile plasate după ianuarie 2023, în toate statele cu excepția statului Texas (TX)?`,
    options: [`SELECT * FROM purchases WHERE purchase_date > '2023-01-31' OR delivery_state <> 'TX';`, `SELECT * FROM purchases WHERE purchase_date > '2023-01-31' AND delivery_state LIKE 'TX';`, `SELECT * FROM purchases WHERE purchase_date > '2023-01-31' OR delivery_state LIKE 'TX';`, `SELECT * FROM purchases WHERE purchase_date > '2023-01-31' AND delivery_state <> 'TX';`],
    correctIndex: 3,
    explanation: `Ambele condiții (data și statul) trebuie respectate simultan, deci AND. Excluderea statului TX se exprimă cu operatorul <>; LIKE este pentru pattern, nu pentru egalitate.`,
  },
  {
    id: `sql-079`,
    type: "single",
    topic: `General`,
    prompt: `Baza ta de date conține un tabel numit Buyer. Trebuie să elimini înregistrarea cu BuyerID = 12345.

Ce instrucțiune folosești?`,
    options: [`DELETE FROM Buyer
  WHERE BuyerID = 12345;`, `UPDATE BuyerID
  FROM Buyer
  DELETE *
  WHERE BuyerID = 12345;`, `DELETE BuyerID
  FROM Buyer
  WHERE BuyerID = 12345;`, `UPDATE Buyer
  DELETE *
  WHERE BuyerID = 12345;`],
    correctIndex: 0,
    explanation: `Forma validă este DELETE FROM tabel WHERE condiție. La DELETE nu se enumeră coloane, iar amestecarea cu UPDATE produce erori de sintaxă.`,
  },
  {
    id: `sql-080`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Goods conține următoarele date:

┌────────────┬───────────────┬────────────────────────────────────────────┬───────┐
│ ItemNumber │   ItemName    │            ItemDescription                │ Price │
├────────────┼───────────────┼────────────────────────────────────────────┼───────┤
│     1      │ Cutie Pralină │ Trufe ciocolată, Pădurea Neagră...       │ 24.95 │
│     2      │ Mini Brownies │ Caramel cu nucă, ciocolată germană...    │ 14.95 │
│     3      │ Set Cappuccino│ Dulciuri pentru cafea...                 │ 21.50 │
│     4      │ Citrice Bites │ Biscuiți răcoritori cu citrice...        │ 19.99 │
│     5      │ Bijuterii Fr. │ Selecții fructate...                     │ 29.99 │
└────────────┴───────────────┴────────────────────────────────────────────┴───────┘

Ce interogare crește prețul articolului 1 cu 6 procente?`,
    options: [`UPDATE Goods
SET Price = Price * 1.06
WHERE ItemNumber = 1;`, `ALTER Goods
SET Price = Price * 1.06
WHERE ItemNumber = 1;`, `SET Price = Price * 1.06
FROM Goods
WHERE ItemNumber = 1;`, `USE Goods
SET Price = Price * 1.06
WHERE ItemNumber = 1;`],
    correctIndex: 0,
    explanation: `Forma corectă este UPDATE tabel SET coloana = expresie WHERE condiție. Înmulțirea cu 1.06 echivalează cu o creștere de 6%, iar variantele cu ALTER, USE sau SET singur sunt invalide.`,
  },
  {
    id: `sql-081`,
    type: "single",
    topic: `General`,
    prompt: `Faci un stagiu IT la o organizație caritabilă. Tabelul Helper:

┌────┬───────────┬─────────────┐
│ ID │ GivenName │ DateOfBirth │
├────┼───────────┼─────────────┤
│  1 │   Mihai   │ 1976-05-30  │
│  2 │  Carolina │ 1952-11-04  │
│  3 │    Ion    │ 1963-02-17  │
└────┴───────────┴─────────────┘

Vrei să elimini toate înregistrările cu GivenName = Mihai.

Ce instrucțiune SQL folosești?`,
    options: [`DELETE FROM Helper WHERE GivenName = 'Mihai';`, `DELETE FROM Helper WHERE GivenName == 'Mihai';`, `DELETE FROM Helper WHERE GivenName EQUALS 'Mihai';`, `DELETE FROM Helper WHERE GivenName IS 'Mihai';`],
    correctIndex: 0,
    explanation: `Operatorul de egalitate în SQL este un singur =. Forma == nu există, EQUALS nu este cuvânt cheie, iar IS este permis exclusiv pentru testul cu NULL.`,
  },
  {
    id: `sql-082`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel numit Item, cu coloanele ItemDescription și ItemGroup.

Vrei să schimbi valoarea ItemGroup la 43 pentru toate lingurile din Item.

ItemDescription = 'lingură' identifică o lingură.

Ce instrucțiune folosești?`,
    options: [`SET Item
  WHERE ItemDescription = 'lingură'
  TO ItemGroup = 43;`, `SET Item
  TO ItemGroup = 43
  WHERE ItemDescription = 'lingură';`, `UPDATE Item
  WHERE ItemDescription = 'lingură'
  SET ItemGroup = 43;`, `UPDATE Item
  SET ItemGroup = 43
  WHERE ItemDescription = 'lingură';`],
    correctIndex: 3,
    explanation: `Ordinea cerută este UPDATE tabel SET coloana = valoare WHERE condiție. SET nu poate apărea singur, iar WHERE trebuie să vină după SET, nu înaintea lui.`,
  },
  {
    id: `sql-083`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Buyer este definit astfel:

┌────────────┬─────────────────┬────────┬───────────────┐
│  BuyerID   │    Address      │ Region │   Country     │
├────────────┼─────────────────┼────────┼───────────────┤
│    123     │ str. Teilor 12  │ Chișin │   Moldova     │
│    456     │ Rue de Lyon 5   │ Lyon   │    Franța     │
│    789     │ str. Mihai E. 8 │ Bălți  │   Moldova     │
└────────────┴─────────────────┴────────┴───────────────┘

Trebuie să scrii o interogare care returnează numărul de cumpărători din fiecare țară care are mai puțin de 50 de cumpărători.

Ce interogare folosești?`,
    options: [`SELECT Country, BuyerID
FROM Buyer
GROUP BY Country
WHERE COUNT(BuyerID) < 50;`, `SELECT Country, BuyerID
FROM Buyer
WHERE COUNT(BuyerID) < 50
GROUP BY Country;`, `SELECT COUNT(BuyerID), Country
FROM Buyer
GROUP BY Country
HAVING COUNT(BuyerID) < 50;`, `SELECT COUNT(BuyerID), Country
FROM Buyer
HAVING COUNT(BuyerID) < 50
GROUP BY Country;`],
    correctIndex: 2,
    explanation: `Filtrarea pe rezultatele unei agregări se face cu HAVING, niciodată cu WHERE. Ordinea corectă în query este GROUP BY, apoi HAVING. WHERE nu acceptă funcții de agregare.`,
  },
  {
    id: `sql-084`,
    type: "single",
    topic: `General`,
    prompt: `Compania ta stochează codurile fiscale ale clienților într-o coloană numită IDNP din tabelul Buyer. Noile reglementări de conformitate interzic păstrarea acestor date.

Rularea interogării de mai jos produce eroare:
ALTER TABLE Buyer
REMOVE IDNP;

Ce modificări sunt necesare ca instrucțiunea să elimine coloana IDNP din Buyer?`,
    options: [`ALTER TABLE Buyer
DELETE IDNP;`, `ALTER TABLE Buyer
DROP IDNP;`, `ALTER TABLE Buyer
DELETE COLUMN IDNP;`, `ALTER TABLE Buyer
DROP COLUMN IDNP;`],
    correctIndex: 3,
    explanation: `Sintaxa corectă pentru a scoate o coloană este DROP COLUMN. Cuvintele REMOVE și DELETE nu sunt acceptate de SQL pentru această operațiune.`,
  },
  {
    id: `sql-085`,
    type: "single",
    topic: `General`,
    prompt: `Ai următoarea definiție de tabel:

CREATE TABLE Path
  (PathID INTEGER NOT NULL,
   Length INTEGER NOT NULL);

Tabelul Path conține următoarele date:

┌────────┬──────────┐
│ PathID │  Length  │
├────────┼──────────┤
│  1234  │    22    │
│  1384  │    34    │
└────────┴──────────┘

Execuți următoarea instrucțiune:

INSERT INTO Path VALUES (1234, 36);

Care este rezultatul?`,
    options: [`O eroare ce semnalează că ID-urile duplicate nu sunt permise`, `O eroare ce semnalează că valorile NULL nu sunt permise`, `O eroare de sintaxă`, `Un nou rând în tabel`],
    correctIndex: 3,
    explanation: `Tabelul Path nu are PRIMARY KEY definit, iar NOT NULL nu este același lucru cu UNIQUE. În lipsa unei chei primare, valorile duplicate sunt permise, prin urmare rândul nou se inserează fără restricții.`,
  },
  {
    id: `sql-086`,
    type: "single",
    topic: `General`,
    prompt: `Care instrucțiune șterge rândurile în care numărul de telefon al angajatului nu a fost introdus?`,
    options: [`DELETE FROM Worker
  WHERE Phone = NULL;`, `DELETE FROM Worker
  WHERE Phone = NULLABLE;`, `DELETE FROM Worker
  WHERE Phone IS NOT NULL;`, `DELETE FROM Worker
  WHERE Phone IS NULL;`],
    correctIndex: 3,
    explanation: `Lipsa unui telefon înseamnă valoare NULL, iar testul corespunzător este IS NULL. Comparația = NULL nu funcționează, iar IS NOT NULL ar viza tocmai angajații cu telefon completat.`,
  },
  {
    id: `sql-087`,
    type: "single",
    topic: `General`,
    prompt: `Ai următoarea diagramă entitate-relație (ERD), cu integritate referențială impusă:

┌──────────┐    ┌────────────┐    ┌──────────┐
│  Device  │    │ Allocation │    │ Handler  │
├──────────┤    ├────────────┤    ├──────────┤
│ ID       │◄──│ DeviceID   │    │ ID       │
│ Name     │    │ HandlerID  │──►│ Name     │
│ Model    │    │ Role       │    │ Seniority│
└──────────┘    └────────────┘    └──────────┘

Rulezi următoarea interogare:
INSERT INTO Allocation(DeviceID, HandlerID) values (3, 4);

Primești următoarea eroare:
Msg 547 - The INSERT statement conflicted with the FOREIGN KEY constraint "FK_Allocation_Device". The conflict occurred in table "dbo.Device", column 'ID'.

Care este cauza problemei?`,
    options: [`Tabelul Allocation are deja un rând cu DeviceID = 3.`, `Tabelul Device nu are niciun rând cu valoarea ID = 3.`, `Tabelul Handler nu are niciun rând cu valoarea ID = 4.`, `Tabelul Allocation are deja un rând cu HandlerID = 4.`],
    correctIndex: 1,
    explanation: `Mesajul indică explicit constrângerea FK_Allocation_Device și coloana ID din tabelul Device, deci valoarea 3 trimisă pentru DeviceID nu există în tabelul părinte Device.`,
  },
  {
    id: `sql-088`,
    type: "single",
    topic: `General`,
    prompt: `Care instrucțiune duce la crearea unui index?`,
    options: [`CREATE TABLE Worker
  (WorkerID INTEGER INDEX);`, `CREATE TABLE Worker
  (WorkerID INTEGER DISTINCT);`, `CREATE TABLE Worker
  (WorkerID INTEGER PRIMARY
  KEY);`, `CREATE TABLE Worker
  (WorkerID INTEGER NULL);`],
    correctIndex: 2,
    explanation: `Atunci când o coloană este declarată PRIMARY KEY, motorul construiește automat un index clustered pe ea. INDEX nu este un cuvânt cheie valid în CREATE TABLE, iar DISTINCT și NULL nu produc indexuri.`,
  },
  {
    id: `sql-089`,
    type: "single",
    topic: `General`,
    prompt: `Ai un tabel numit Item cu un milion de rânduri. Vrei să cauți informații despre produse cu interogarea:

SELECT ItemName, Price FROM Item WHERE Section = 'Manuale Științifice';

Ce face acest tip de căutare mai rapid?`,
    options: [`un index nonclustered pe coloana Section`, `un index clustered pe coloana ItemName`, `un index clustered pe coloana Price`, `un index nonclustered pe coloana Price`],
    correctIndex: 0,
    explanation: `Filtrul lucrează pe Section, deci cea mai eficientă opțiune este un index pe coloana respectivă. Varianta nonclustered este potrivită aici, fiindcă indexul clustered se asociază de obicei cu cheia primară.`,
  },
  {
    id: `sql-090`,
    type: "single",
    topic: `General`,
    prompt: `Construiești următoarea interogare pentru a determina dacă Demo Film apare o singură dată în tabelul Film.

SELECT Title
FROM Film
WHERE Title = 'Demo Film'
ORDER BY Title
GROUP BY Title
HAVING COUNT(*) = 1;

Când o rulezi, primești o eroare de sintaxă. Ce trebuie să faci?`,
    options: [`Să elimini clauza GROUP BY.`, `Să schimbi HAVING în HAVING COUNT(Title) = 1`, `Să elimini clauza ORDER BY.`, `Să schimbi HAVING în HAVING COUNT(1) = 1`],
    correctIndex: 2,
    explanation: `ORDER BY trebuie să fie ultima clauză, scrisă după GROUP BY și HAVING. În interogarea de față apare prematur, înaintea lui GROUP BY, fapt care provoacă eroarea de sintaxă.`,
  },
  {
    id: `sql-091`,
    type: "single",
    topic: `General`,
    prompt: `Un tabel stochează informații despre prezența la cursuri:

┌─────────────┬────────────┬─────────────┐
│  PupilName  │ ClassLevel │ AbsenceDays │
├─────────────┼────────────┼─────────────┤
│    Petru    │     12     │     2.5     │
│    Ana      │     12     │     0.0     │
│    Vlad     │     12     │     3.0     │
└─────────────┴────────────┴─────────────┘

Cerințe:
• PupilName trebuie să fie un șir de caractere.
• ClassLevel trebuie să fie un număr întreg.
• AbsenceDays poate avea o singură zecimală.

Asociază tipurile de date coloanelor:`,
    options: [`PupilName=VARCHAR, ClassLevel=INT, AbsenceDays=DECIMAL`, `PupilName=CHAR, ClassLevel=DECIMAL, AbsenceDays=INT`, `PupilName=INT, ClassLevel=VARCHAR, AbsenceDays=DATETIME`, `PupilName=VARCHAR, ClassLevel=DECIMAL, AbsenceDays=BIT`],
    correctIndex: 0,
    explanation: `VARCHAR este alegerea standard pentru un șir de caractere, INT corespunde unui număr întreg, iar DECIMAL este potrivit pentru o valoare cu o singură zecimală.`,
  },
  {
    id: `sql-092`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Edifice de mai jos stochează date despre clădiri și ultimele lor inspecții:

┌────────────┬──────────────┬─────────────┐
│   Câmp     │  Tip date    │ Permite NULL│
├────────────┼──────────────┼─────────────┤
│ EdificeID  │    INT       │    FALSE    │
│ Address    │ VARCHAR(100) │    FALSE    │
│ ReviewerID │   CHAR(3)    │    TRUE     │
│ ReviewDate │   DATETIME   │    TRUE     │
└────────────┴──────────────┴─────────────┘

NULL în ReviewDate înseamnă că edificiul nu a fost încă inspectat.

Vrei să afișezi adresele celor mai vechi 10 edificii care au fost inspectate.

SELECT [___] Address FROM Edifice
WHERE ReviewDate [___]
[___] ReviewDate;`,
    options: [`TOP 10 / IS NOT NULL / ORDER BY`, `TOP 10 / IS NULL / ORDER BY`, `COUNT / IS NOT NULL / GROUP BY`, `GROUP BY 10 / IS NOT NULL / HAVING`],
    correctIndex: 0,
    explanation: `TOP 10 limitează la primele 10 rânduri. IS NOT NULL exclude clădirile neinspectate. ORDER BY ReviewDate aduce mai întâi inspecțiile cele mai vechi, conform cerinței.`,
  },
  {
    id: `sql-093`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul Buyer conține următoarele date:

┌────┬───────────┬───────────┬───────────────┬───────────┐
│ ID │ FirstName │ LastName  │ PhoneNumber   │ Extension │
├────┼───────────┼───────────┼───────────────┼───────────┤
│  1 │   Hope    │ Ragabash  │ (123)555-0111 │   NULL    │
│  2 │   Luna    │ Faltor    │ (123)555-0112 │   NULL    │
│  3 │  Mickey   │ Sassafras │ (123)555-0113 │    12     │
│  4 │  Minnie   │ Hemingway │ (123)555-0114 │    77     │
│  5 │ Sherlock  │ Steam     │ (123)555-0115 │   NULL    │
└────┴───────────┴───────────┴───────────────┴───────────┘

Vrei un set de rezultate cu LastName, PhoneNumber și Extension pentru cumpărătorii care au extension, sortat după LastName.

Completează: SELECT LastName, PhoneNumber, Extension FROM Buyer
WHERE [___] [___]
[___] LastName;`,
    options: [`Extension IS NOT NULL / (nimic) / ORDER BY`, `Extension = NOT NULL / (nimic) / ORDER BY`, `Extension IS NULL / (nimic) / ORDER BY`, `Extension IS NOT NULL / (nimic) / GROUP BY`],
    correctIndex: 0,
    explanation: `Au extension înseamnă că valoarea nu este NULL, deci se folosește IS NOT NULL. Pentru sortare se aplică ORDER BY, în timp ce GROUP BY ar fi destinat grupărilor, nu sortării.`,
  },
  {
    id: `sql-094`,
    type: "multi",
    topic: `General`,
    prompt: `Faci un stagiu IT. Organizația are două tabele: Branch și Tongue.

Tabelul Branch:
┌───────────┬───────────────┬────────────┬─────────┐
│ BranchId  │     City      │   Region   │ Country │
├───────────┼───────────────┼────────────┼─────────┤
│     1     │   Phoenix     │  Arizona   │   USA   │
│     2     │   Houston     │   Texas    │   USA   │
│     3     │   Boston      │ Massachus. │   USA   │
│     4     │   Calgary     │  Alberta   │ Canada  │
└───────────┴───────────────┴────────────┴─────────┘

Tabelul Tongue:
┌────────────┬──────────────┬─────────┐
│ TongueId   │  TongueName  │ Locale  │
├────────────┼──────────────┼─────────┤
│     1      │   English    │   USA   │
│     2      │   English    │ Canada  │
│     3      │   Spanish    │ Mexico  │
└────────────┴──────────────┴─────────┘

Construiești BranchTongue pentru a le lega printr-o cheie primară compusă.

Care două coloane trebuie alese? (Alege 2.)`,
    options: [`Region`, `BranchId`, `TongueId`, `City`, `Country`, `TongueName`],
    correctIndices: [1, 2],
    min: 2,
    explanation: `O cheie primară compusă combină cheile primare ale tabelelor părinte, deci în acest caz BranchId și TongueId sunt coloanele necesare.`,
  },
  {
    id: `sql-095`,
    type: "single",
    topic: `General`,
    prompt: `Rulezi următoarele două interogări:

Interogarea 1:
SELECT [Device].[Name] AS Device FROM [Device]
JOIN [Allocation] ON DeviceID = Device.ID;

Interogarea 2:
SELECT [Handler].[Name] AS Handler FROM [Handler]
LEFT JOIN [Allocation] ON HandlerID = Handler.ID;

Device (3 rânduri), Handler (3 rânduri), Allocation (2 rânduri: DeviceID 1,2 / HandlerID 1,2)

Câte rânduri returnează prima interogare?`,
    options: [`1`, `2`, `3`, `6`],
    correctIndex: 1,
    explanation: `INNER JOIN păstrează doar rândurile care au corespondent în Allocation. Sunt doar două asocieri (DeviceID 1 și 2), prin urmare rezultatul are 2 rânduri.`,
  },
  {
    id: `sql-096`,
    type: "single",
    topic: `General`,
    prompt: `Aceeași configurație. Câte rânduri returnează interogarea a doua (LEFT JOIN)?`,
    options: [`1`, `2`, `3`, `6`],
    correctIndex: 2,
    explanation: `LEFT JOIN aduce toți operatorii (3 la număr), chiar dacă unul nu are nicio asociere. Rândul fără pereche apare cu valori NULL în coloanele din Allocation, deci totalul rămâne 3 rânduri.`,
  },
  {
    id: `sql-097`,
    type: "single",
    topic: `General`,
    prompt: `Tabelul GoodsOnOrder conține datele:

┌─────┬────────────┬──────────┬───────────┬───────────────┐
│ ID  │ ItemNumber │ Quantity │ UnitPrice │ LineItemTotal │
├─────┼────────────┼──────────┼───────────┼───────────────┤
│ 100 │     1      │    10    │   24.95   │    249.50     │
│ 100 │     2      │    25    │   14.95   │    373.75     │
│ 100 │     3      │    25    │   19.99   │    499.75     │
│ 101 │     4      │    10    │   25.00   │    250.00     │
│ 102 │     5      │    10    │   29.99   │    299.00     │
└─────┴────────────┴──────────┴───────────┴───────────────┘

Vrei o interogare care afișează: numărul total de comenzi, valoarea medie pe linie, valoarea maximă pe linie și totalul general.

Ce interogare folosești?`,
    options: [`SELECT COUNT(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM GoodsOnOrder
HAVING ItemNumber, Quantity, UnitPrice;`, `SELECT SUM(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM GoodsOnOrder;`, `SELECT COUNT(ID), AVG(LineItemTotal), MAX(LineItemTotal), SUM(LineItemTotal)
FROM GoodsOnOrder;`, `SELECT COUNT(ID), AVG(UnitPrice+Quantity), MAX(UnitPrice+Quantity), SUM(UnitPrice+Quantity)
FROM GoodsOnOrder
GROUP BY ItemNumber, LineItemTotal;`],
    correctIndex: 2,
    explanation: `COUNT(ID) dă numărul de comenzi, iar AVG, MAX și SUM aplicate pe LineItemTotal generează cei trei indicatori cantitativi. Pentru valori globale nu folosim GROUP BY, iar SUM(ID) ar fi un calcul fără semnificație.`,
  },
  {
    id: `sql-098`,
    type: "single",
    topic: `General`,
    prompt: `Trebuie să creezi un raport pentru anul școlar 2024-2025:
• Afișezi toți studenții înmatriculați la 1 iunie 2024 sau ulterior.
• Afișezi toți studenții care au absolvit în 2024.
• Returnezi rezultatele ordonate după dată de înmatriculare, cea mai recentă prima.

enrollment_date specifică înmatricularea, graduation_date specifică absolvirea, iar academic_status = 'Graduated' indică un absolvent.

Care interogare folosești?`,
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
    explanation: `Cele două categorii (înmatriculați sau absolvenți) se reunesc cu OR, iar între academic_status și graduation_date se aplică AND. ORDER BY ... DESC asigură afișarea celei mai recente date primele.`,
  },
  {
    id: `sql-099`,
    type: "single",
    topic: `General`,
    prompt: `Proiectezi o bază de date cu următoarele cerințe:
• Tabelul DEVICE reprezintă toate dispozitivele (ID identifică unic fiecare element)
• Tabelul HANDLER reprezintă toți operatorii (ID identifică unic fiecare operator)
• Fiecare operator poate fi alocat la zero sau mai multe dispozitive
• Fiecare dispozitiv poate fi alocat la zero sau mai mulți operatori

Ce tip de relație este?`,
    options: [`Unu-la-unu`, `Unu-la-mai-mulți`, `Mai-mulți-la-mai-mulți`, `Auto-referențială`],
    correctIndex: 2,
    explanation: `Fiindcă fiecare operator poate avea zero sau mai multe dispozitive și invers, relația este de tip mai-mulți-la-mai-mulți, iar implementarea cere un tabel de joncțiune (Allocation).`,
  },
  {
    id: `sql-100`,
    type: "single",
    topic: `General`,
    prompt: `Care comandă SQL este DDL (Data Definition Language)?`,
    options: [`SELECT`, `INSERT INTO`, `UPDATE`, `CREATE TABLE`],
    correctIndex: 3,
    explanation: `DDL grupează comenzile care lucrează cu structura: CREATE, ALTER, DROP, TRUNCATE. Restul (SELECT, INSERT, UPDATE, DELETE) operează asupra datelor și aparțin DML.`,
  },
  {
    id: `sql-101`,
    type: "single",
    topic: `General`,
    prompt: `Care dintre următoarele afirmații descrie corect un PRIMARY KEY?`,
    options: [`Permite valori NULL și duplicate`, `Permite valori NULL, dar nu duplicate`, `Nu permite nici NULL, nici duplicate`, `Nu permite NULL, dar permite duplicate`],
    correctIndex: 2,
    explanation: `O cheie primară combină proprietățile NOT NULL și UNIQUE, deci nu acceptă nici valori absente, nici valori care se repetă.`,
  },
  {
    id: `sql-102`,
    type: "single",
    topic: `General`,
    prompt: `Trebuie să găsești toți cumpărătorii al căror nume începe cu 'B'.

Ce clauză WHERE folosești?`,
    options: [`WHERE Name = 'B%'`, `WHERE Name LIKE 'B%'`, `WHERE Name STARTS 'B'`, `WHERE Name BEGINS WITH 'B'`],
    correctIndex: 1,
    explanation: `Pentru o căutare după șablon se folosește LIKE împreună cu wildcard-ul %. Forma 'B%' acceptă orice text care începe cu B. Operatorul = caută egalitate exactă, iar STARTS și BEGINS WITH nu sunt sintaxe SQL valide.`,
  },
  {
    id: `sql-103`,
    type: "single",
    topic: `General`,
    prompt: `Care este diferența între WHERE și HAVING?`,
    options: [`WHERE filtrează grupuri, HAVING filtrează rânduri`, `WHERE filtrează rânduri înainte de grupare, HAVING filtrează grupuri după grupare`, `Sunt identice și interschimbabile`, `WHERE se folosește cu JOIN, HAVING se folosește cu UNION`],
    correctIndex: 1,
    explanation: `WHERE acționează asupra rândurilor înainte de a se forma grupurile, iar HAVING se aplică pe grupurile deja construite, după ce GROUP BY și-a făcut treaba.`,
  },
  {
    id: `sql-104`,
    type: "single",
    topic: `General`,
    prompt: `Ce tip de JOIN returnează TOATE rândurile din tabelul din stânga, chiar și atunci când nu există potrivire în tabelul din dreapta?`,
    options: [`INNER JOIN`, `CROSS JOIN`, `LEFT JOIN`, `SELF JOIN`],
    correctIndex: 2,
    explanation: `LEFT JOIN păstrează toate rândurile tabelului plasat la stânga. Atunci când nu există corespondent la dreapta, coloanele acelui tabel sunt completate cu NULL.`,
  },
  {
    id: `sql-105`,
    type: "single",
    topic: `General`,
    prompt: `Execuți:

SELECT COUNT(*) FROM Purchase WHERE Status = 'Shipped'
UNION
SELECT COUNT(*) FROM Purchase WHERE Status = 'Pending';

Ce returnează această interogare?`,
    options: [`Un singur număr: totalul comenzilor expediate și în așteptare`, `Două rânduri: unul cu numărul comenzilor expediate, celălalt cu cele în așteptare`, `O eroare, deoarece UNION nu se poate folosi cu funcții de agregare`, `Toate rândurile din tabelul Purchase`],
    correctIndex: 1,
    explanation: `UNION așază unul peste celălalt rezultatele celor două SELECT-uri. Fiecare returnează câte un singur număr, deci setul final conține două rânduri, fiecare cu valoarea sa.`,
  },
];
