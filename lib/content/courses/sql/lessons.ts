// AUTO-GENERATED from scripts/generate-lessons.mjs — do not edit by hand.
// Re-run `node scripts/generate-lessons.mjs` after editing source content.

import type { Lesson } from "../types";

export const lessons: readonly Lesson[] = [
  {
    slug: `ce-este-o-baza-de-date-relationala`,
    title: `Ce este o bază de date relațională`,
    orderIndex: 1,
    durationMinutes: 10,
    isPreview: true,
    markdown: `## Modelul relațional, în termeni practici

O bază de date relațională organizează informația în structuri tabulare numite **relații** (în limbaj uzual: **tabele** / tables). Fiecare astfel de structură are două dimensiuni:

- **Rândurile (rows / tuples)** reprezintă o entitate concretă — un pupil, un articol din magazin, o tranzacție.
- **Coloanele (columns / atribute)** descriu o proprietate a acelei entități — numele, vârsta, prețul, data înregistrării.

Iată cum arată tabelul \`pupils\` într-o vizualizare textuală:

\`\`\`
| pupil_id | full_name      | age |
|----------|----------------|-----|
| 101      | Ana Roșca      | 17  |
| 102      | Mihai Țurcanu  | 19  |
| 103      | Elena Caraman  | 17  |
\`\`\`

### Ce trebuie să fie unic și ce nu

Aici apar capcanele clasice. Reține distincțiile:

- **Valorile dintr-o coloană NU trebuie obligatoriu să fie unice.** În exemplul de mai sus, doi pupili au aceeași vârstă (17), iar asta e perfect valid.
- **Rândurile, în schimb, trebuie să fie unice.** Această garanție o oferă **cheia primară** — fără ea, două înregistrări identice ar fi indistinctibile.
- **Numele coloanelor sunt unice în cadrul unui tabel.** Nu poți avea două coloane cu denumirea \`full_name\` în același tabel.

### De unde vine puterea modelului relațional?

Modelul a fost descris matematic de Edgar F. Codd în 1970, pornind de la teoria mulțimilor și logica de ordinul întâi. Ideea cheie: separi **structura datelor** de **modul în care sunt stocate fizic**, ceea ce permite optimizatorului bazei să-și aleagă singur strategia de execuție.

În prezent există mai multe motoare relaționale populare, fiecare cu particularitățile sale:

- **PostgreSQL** — bogat în funcții, suport excelent pentru tipuri complexe (JSON, array-uri, geografie).
- **MySQL / MariaDB** — răspândit pe web, configurare simplă.
- **SQLite** — fișier unic, fără server, ideal pentru aplicații mobile sau prototipuri.
- **Microsoft SQL Server** și **Oracle** — alegeri tipice în mediul corporate.

### Bună practică

Înainte să creezi un tabel, desenează structura pe hârtie sau într-o diagramă. Întreabă-te: *"Ce identifică unic un rând?"* și *"Ce coloane se vor repeta des în filtre?"*. Răspunsurile la aceste două întrebări dictează cheia primară și viitoarele indexuri.

---`,
  },
  {
    slug: `chei-primary-foreign-composite`,
    title: `Chei: Primary, Foreign, Composite`,
    orderIndex: 2,
    durationMinutes: 10,
    isPreview: true,
    markdown: `## Cheile — coloana vertebrală a oricărei scheme

### Cheia primară (Primary Key)

Cheia primară este coloana — sau combinația de coloane — care **identifică în mod unic** fiecare rând dintr-un tabel.

Trei reguli pe care nu le poți încălca:

- valoarea nu poate lipsi (nu acceptă NULL),
- nu se poate repeta între rânduri,
- un tabel poate avea **o singură** cheie primară (dar aceasta poate fi compusă din mai multe coloane).

Să presupunem că în tabelul \`items\` există deja un articol cu \`item_id = 8421\`. Dacă rulezi:

\`\`\`sql
INSERT INTO items VALUES (8421, 'Scaun rotativ', 1290.00);
\`\`\`

motorul îți va respinge operațiunea cu un mesaj de tipul **Primary Key Constraint Violation**, fiindcă valoarea ar duplica un rând existent.

### Cheia externă (Foreign Key)

O cheie externă este o coloană dintr-un tabel care **face trimitere** la cheia primară a altui tabel. Rolul ei: să mențină coerența datelor între tabele înrudite.

Să zicem că \`purchases\` are coloana \`staff_id\`, care trebuie să corespundă unui rând existent din \`staff\`. Dacă încerci să inserezi o vânzare cu \`staff_id = 999\`, dar acel ID nu există în \`staff\`, primești **Foreign Key Constraint Violation**.

Pentru a elimina o cheie externă, foloseşti instrucţiunea:

\`\`\`sql
ALTER TABLE purchases
DROP CONSTRAINT FK_purchases_staff;
\`\`\`

Comenzi precum \`DELETE TABLE\` sau \`ALTER FOREIGN KEY\` nu există în standardul SQL — ar fi greşeli de sintaxă.

### Cheia primară compusă (Composite Primary Key)

Când o singură coloană nu poate garanta unicitatea, se combină două sau mai multe.

Exemplul clasic este un tabel de legătură care leagă \`Lectures\` și \`Languages\` într-o relație many-to-many:

\`\`\`sql
CREATE TABLE LectureLanguage (
    lecture_id  INT NOT NULL,
    language_id INT NOT NULL,
    PRIMARY KEY (lecture_id, language_id),
    FOREIGN KEY (lecture_id)  REFERENCES Lectures(id),
    FOREIGN KEY (language_id) REFERENCES Languages(id)
);
\`\`\`

Aici nici \`lecture_id\` singur, nici \`language_id\` singur nu sunt unice — dar combinația lor este.

### Dependența funcțională

Spunem că o coloană B este **funcțional dependentă** de o coloană A dacă fiecare valoare din A determină exact o valoare din B.

De pildă: \`item_id\` determină univoc \`item_category\`. Cunoscând ID-ul produsului, știi automat categoria. Notația matematică este \`item_id deci item_category\`.

### În producție

Pentru cheile primare, alege fie un **întreg auto-incrementat** (rapid, mic), fie un **UUID** (universal, sigur la merge între baze de date). Nu folosi date "vorbitoare" precum CNP-ul sau adresa de email — ele se schimbă în timp și transformă orice modificare într-un coșmar de cascade.

---`,
  },
  {
    slug: `normalizare-prima-forma-normala-1nf`,
    title: `Normalizare — Prima Formă Normală (1NF)`,
    orderIndex: 3,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## Normalizarea — de ce și cum

**Normalizarea** este procesul prin care reorganizezi tabelele astfel încât să elimini redundanța și anomaliile la inserare, modificare sau ștergere. Există mai multe niveluri (1NF, 2NF, 3NF, BCNF), iar fiecare adaugă reguli suplimentare.

### Prima Formă Normală (1NF)

Un tabel respectă **1NF** dacă îndeplinește simultan două cerințe:

1. **Nu există rânduri identice** — fiecare înregistrare poate fi distinsă de toate celelalte (de obicei prin cheie primară).
2. **Nu există grupuri repetitive** — fiecare celulă conține o **singură valoare atomică**, nu o listă, nu un array, nu mai multe perechi împachetate într-un string.

Atenție la confuzii: *"exclude foreign keys"* sau *"exclude composite keys"* **NU** sunt cerințe ale 1NF. Cheile externe și cele compuse rămân perfect valide.

### Exemplu: violare clasică a 1NF

\`\`\`
| pupil_id | full_name     | hobbies                     |
|----------|---------------|-----------------------------|
| 1        | Ana Roșca     | sah, lectura, dans          |
| 2        | Mihai Țurcanu | fotbal, programare          |
\`\`\`

Coloana \`hobbies\` conține mai multe valori într-o singură celulă — un grup repetitiv. Soluția: o spargi într-un tabel separat \`pupil_hobbies\`, cu o pereche \`(pupil_id, hobby)\` pe rând.

### Privire de ansamblu peste celelalte forme normale

- **2NF** — în plus față de 1NF, niciun atribut non-cheie nu depinde doar de o parte a unei chei compuse.
- **3NF** — niciun atribut non-cheie nu depinde de alt atribut non-cheie (eliminarea dependențelor tranzitive).
- **BCNF** — variantă mai strictă a 3NF, care tratează cazuri rare în care o coloană non-prima determină altă coloană din chei.

În proiectele reale, 3NF este de obicei suficientă. Dacă mergi mai departe, riști să faci schema atât de fragmentată încât interogările devin lente și greu de citit.

### Bună practică: denormalizarea controlată

În aplicații cu mult trafic de citire (rapoarte, analitică), uneori e util să **denormalizezi** intenționat — adică să dublezi unele date pentru a evita JOIN-uri scumpe. Exemplu: păstrezi \`country_name\` direct în \`purchases\`, chiar dacă există deja în \`countries\`. E un compromis conștient între spațiu și viteză.

---`,
  },
  {
    slug: `tipuri-de-date`,
    title: `Tipuri de date`,
    orderIndex: 4,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## Alegerea corectă a tipului de date

Tipul de date pe care îl atribui unei coloane influențează atât **integritatea** datelor, cât și **performanța** interogărilor. Iată tipurile cele mai uzuale și când să le folosești:

| Tip            | Ce stochează                                  | Exemplu de folosire                 |
|----------------|-----------------------------------------------|-------------------------------------|
| **INT**        | Numere întregi, fără zecimale                 | vârstă (24), an de studiu (3)       |
| **BIGINT**     | Întregi mari (până la ~9 cvintilioane)        | ID-uri auto-increment în tabele uriaşe |
| **VARCHAR(n)** | Text de lungime variabilă, până la n caractere| nume ('Ștefan'), adrese             |
| **CHAR(n)**    | Text de lungime fixă                          | cod IATA ('KIV'), cod ISO ('MD')    |
| **TEXT**       | Text lung, fără limită strictă                | descrieri, articole, log-uri        |
| **DECIMAL(p,s)** | Numere cu precizie exactă                   | preţuri (199.99), procente          |
| **FLOAT / REAL** | Numere cu virgulă mobilă (precizie aproximativă) | măsurători ştiinţifice           |
| **DATE**       | Doar data (an-lună-zi)                        | data naşterii                       |
| **DATETIME / TIMESTAMP** | Dată + oră                          | momentul unei tranzacţii            |
| **BIT / BOOLEAN** | Adevărat/fals (0 sau 1)                    | \`is_active\`, \`is_verified\`      |
| **UUID**       | Identificator universal (16 octeţi)           | chei primare distribuite            |
| **JSON / JSONB** | Documente structurate                       | preferinţe utilizator, configuraţii |

### Cazuri concrete

- Numele unui pupil rezultă text variabil — alegi **VARCHAR**.
- Numărul de ore de prezență poate avea zecimale (de exemplu 4.5 ore) — alegi **DECIMAL(4,1)**.
- Câmpurile financiare (preţuri, salarii) cer întotdeauna **DECIMAL** — niciodată FLOAT, fiindcă acesta introduce erori de rotunjire.
- Indicatorul "este activ?" se rezolvă cu **BIT** sau **BOOLEAN**, nu cu varchar.

### De ce DECIMAL pentru bani?

\`FLOAT\` reprezintă numerele binar, deci 0.10 + 0.20 poate da 0.30000000004. La un singur preţ pare neglijabil, dar înmulţit cu un milion de tranzacţii apar diferenţe vizibile în raportările financiare. \`DECIMAL\` stochează cifrele exact aşa cum le scrii, prin urmare e safe pentru calcule contabile.

### Particularităţi între motoare

Tipurile diferă uşor de la un motor la altul:

- **PostgreSQL** are tipuri native pentru \`array\`, \`jsonb\`, \`interval\`, \`inet\` (adrese IP).
- **MySQL** distinge între \`DATETIME\` (fără fus orar) şi \`TIMESTAMP\` (cu fus orar şi limita anului 2038).
- **SQLite** foloseşte un sistem permisiv numit *type affinity* — declari \`INTEGER\`, dar poţi insera şi text fără eroare.

### În producţie

Alege întotdeauna **cel mai mic tip suficient**. Dacă vârsta nu depăşeşte 150, nu folosi BIGINT — risipeşti memorie pe disc şi în RAM. Diferenţa pare mică, dar pe un tabel de 100 milioane de rânduri ajunge la gigaocteţi.

---`,
  },
  {
    slug: `create-table-crearea-tabelelor`,
    title: `CREATE TABLE — crearea tabelelor`,
    orderIndex: 5,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## Crearea tabelelor — sintaxa CREATE TABLE

Pentru a defini o nouă structură în baza de date, foloseşti instrucţiunea \`CREATE TABLE\`, urmată de numele tabelului şi de lista coloanelor între paranteze:

\`\`\`sql
CREATE TABLE pupils (
    pupil_id    INT PRIMARY KEY,
    full_name   VARCHAR(120) NOT NULL,
    age         INT,
    signup_date DATE DEFAULT CURRENT_DATE
);
\`\`\`

### Ordinea elementelor — capcane comune

Există un singur şablon corect: \`CREATE TABLE <nume> ( <lista coloane> );\`. Iată variantele greşite pe care le poţi întâlni:

- \`CREATE ( TABLE pupils ...\` — paranteza nu poate sta înaintea cuvântului-cheie TABLE.
- \`CREATE pupils( ...\` — lipseşte cuvântul TABLE.
- \`CREATE TABLE ( ...\` — lipseşte numele tabelului.

### Cuvinte cheie permise în interiorul CREATE TABLE

În definiţia coloanelor poţi include:

- **PRIMARY KEY** — declari cheia primară,
- **CONSTRAINT** — denumeşti şi configurezi o constrângere (FK, CHECK, UNIQUE),
- **NOT NULL**, **DEFAULT**, **UNIQUE** — modificatori de coloană,
- **FOREIGN KEY ... REFERENCES** — leagă coloana de alt tabel.

În schimb, \`ORDER BY\` aparţine interogărilor SELECT, iar \`INSERT INTO\` se foloseşte pentru a popula tabelul după ce a fost creat.

### Exemplu mai complet

\`\`\`sql
CREATE TABLE staff (
    staff_id      INT PRIMARY KEY,
    first_name    VARCHAR(50) NOT NULL,
    last_name     VARCHAR(50) NOT NULL,
    contact_email VARCHAR(120) UNIQUE,
    salary        DECIMAL(10,2) CHECK (salary > 0),
    department_id INT,
    CONSTRAINT fk_staff_department
        FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
\`\`\`

### Indexul implicit creat de PRIMARY KEY

Când declari o cheie primară, motorul creează **automat** un index — în mod tipic un **clustered index** pe acea coloană, care sortează fizic rândurile pe disc. Aceasta accelerează căutările şi join-urile pe cheia primară fără efort suplimentar din partea ta.

\`\`\`sql
CREATE TABLE staff (
    staff_id INT PRIMARY KEY
);
-- Creează implicit un index clustered pe staff_id
\`\`\`

### Migraţii — gestionarea modificărilor de schemă

În proiectele reale, schema bazei evoluează permanent. În loc să modifici tabelele manual, foloseşti **migraţii** — fişiere numerotate (\`001_create_pupils.sql\`, \`002_add_email_to_pupils.sql\`) care descriu fiecare schimbare. Tool-uri populare: **Flyway**, **Liquibase**, **Alembic** (Python), **Prisma Migrate** (Node), **Knex** (Node). Migraţiile fac onboarding-ul nou-veniţilor mult mai uşor şi previn divergenţe între medii (dev / staging / producţie).

---`,
  },
  {
    slug: `alter-table-modificarea-structurii`,
    title: `ALTER TABLE — modificarea structurii`,
    orderIndex: 6,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## Modificarea structurii unui tabel — ALTER TABLE

După ce un tabel există, îi poţi schimba structura cu \`ALTER TABLE\`. Operaţiile uzuale: adăugarea, eliminarea sau modificarea unei coloane, gestionarea constrângerilor.

### Adăugarea unei coloane noi

\`\`\`sql
ALTER TABLE clients
ADD region_code VARCHAR(10);
\`\`\`

Sau, în dialectele care cer paranteze (Oracle, unele versiuni MySQL):

\`\`\`sql
ALTER TABLE clients
ADD (region_code VARCHAR(10));
\`\`\`

Cuvântul \`MODIFY\` (sau \`ALTER COLUMN\` în SQL Server) se foloseşte pentru a **schimba** o coloană deja existentă, nu pentru a adăuga una nouă.

### Modificarea tipului unei coloane existente

\`\`\`sql
-- MySQL / Oracle:
ALTER TABLE clients MODIFY contact_email VARCHAR(150);

-- PostgreSQL / SQL Server:
ALTER TABLE clients ALTER COLUMN contact_email TYPE VARCHAR(150);
\`\`\`

### Ştergerea unei coloane

\`\`\`sql
ALTER TABLE clients
DROP COLUMN national_id;
\`\`\`

Sintaxe greşite des întâlnite: \`DELETE national_id\`, \`REMOVE national_id\`, \`ALTER ... DELETE national_id\`. Niciuna nu este recunoscută de SQL — sintaxa corectă este **DROP COLUMN**.

### Lucrul cu constrângerile

\`\`\`sql
-- Adăugarea unei chei externe
ALTER TABLE purchases
ADD CONSTRAINT fk_purchases_client
    FOREIGN KEY (client_id) REFERENCES clients(client_id);

-- Eliminarea unei chei externe
ALTER TABLE purchases
DROP CONSTRAINT fk_purchases_client;
\`\`\`

### Atenţie la operaţiile pe tabele mari

Pe tabele cu zeci de milioane de rânduri, \`ALTER TABLE\` poate **bloca tabelul** pentru minute sau chiar ore. PostgreSQL şi MySQL modern oferă opţiuni precum \`ADD COLUMN ... NOT NULL DEFAULT ...\` care evită rescrierea integrală.

### În producţie

Înainte de a rula o migraţie pe producţie:

1. Testează pe o copie a bazei (staging) cu volum similar.
2. Programează modificarea în afara orelor de vârf.
3. Pregăteşte un script de **rollback** — în cazul în care lucrurile merg rău, trebuie să poţi reveni rapid.
4. Pentru tabele uriaşe, foloseşte instrumente specializate (\`pt-online-schema-change\` pentru MySQL, \`pg_repack\` pentru PostgreSQL) care fac modificarea fără a bloca traficul.

---`,
  },
  {
    slug: `drop-truncate-delete-diferentele-care-conteaza`,
    title: `DROP, TRUNCATE, DELETE — diferențele care contează`,
    orderIndex: 7,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## Trei comenzi pentru ştergere — şi de ce nu sunt interschimbabile

DROP, TRUNCATE şi DELETE arată similar la prima vedere, dar fiecare are un comportament fundamental diferit. Confuzia între ele poate duce la pierdere ireversibilă de date.

| Comandă             | Ce face                                                  | Categoria | Recuperabilă? |
|---------------------|----------------------------------------------------------|-----------|---------------|
| **DROP TABLE**      | Elimină complet tabelul (structura + datele + indexurile)| DDL       | Doar din backup |
| **TRUNCATE TABLE**  | Goleşte toate rândurile, **fără logare individuală**     | DDL       | Greu de recuperat |
| **DELETE FROM**     | Şterge rânduri (cu sau fără WHERE), **cu logare**        | DML       | Da, în cadrul unei tranzacţii |

### DROP TABLE — eliminare totală

\`\`\`sql
DROP TABLE temp_imports;
\`\`\`

După această instrucţiune, tabelul **nu mai există**. Orice index, trigger sau view care depindea de el este invalidat sau şters.

### TRUNCATE TABLE — golire rapidă

\`\`\`sql
TRUNCATE TABLE staging_logs;
\`\`\`

TRUNCATE eliberează spaţiul aproape instant, fiindcă nu logează fiecare rând în jurnalul de tranzacţii — doar dealocă paginile. Structura tabelului rămâne, dar **nu poţi adăuga o clauză WHERE**.

### DELETE FROM — ştergere selectivă

\`\`\`sql
-- Şterge un rând specific
DELETE FROM clients WHERE client_id = 7842;

-- Şterge toate rândurile, cu logare
DELETE FROM clients;
\`\`\`

Fiindcă DELETE logează fiecare rând şters, poate fi inclusă într-o **tranzacţie** şi anulată cu \`ROLLBACK\` — dar este şi mai lentă pe seturi mari.

### Întrebări tipice

- *"Care comandă elimină toate rândurile fără a le loga individual?"* devine **TRUNCATE TABLE**.
- *"Trebuie să elimin un tabel din baza de date — ce cuvânt cheie DDL?"* devine **DROP** (DELETE este DML, prin urmare nu se potriveşte).

### Bună practică

Pe producţie, încadrează orice DELETE neobişnuit într-o tranzacţie:

\`\`\`sql
BEGIN;
DELETE FROM clients WHERE last_login < '2020-01-01';
-- verifici câte rânduri au fost afectate
ROLLBACK;  -- sau COMMIT, dacă totul e ok
\`\`\`

Astfel, dacă WHERE-ul a fost incorect, anulezi totul cu \`ROLLBACK\` înainte de \`COMMIT\` şi nimeni nu observă.

---`,
  },
  {
    slug: `insert-update-delete-manipularea-datelor`,
    title: `INSERT, UPDATE, DELETE — manipularea datelor`,
    orderIndex: 8,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## INSERT INTO — adăugarea de date

Cea mai simplă formă inserează valorile în ordinea coloanelor declarate la crearea tabelului:

\`\`\`sql
INSERT INTO items
VALUES (5210, 'Birou ergonomic', 2499.00);
\`\`\`

Forma recomandată în producţie specifică explicit coloanele — în acest fel, dacă cineva adaugă o coloană nouă, query-ul tău nu se sparge:

\`\`\`sql
INSERT INTO items (item_id, item_name, unit_price)
VALUES (5210, 'Birou ergonomic', 2499.00);
\`\`\`

### Inserarea mai multor rânduri într-un singur statement

\`\`\`sql
INSERT INTO items (item_id, item_name, unit_price) VALUES
    (5211, 'Lampă LED',  189.00),
    (5212, 'Mouse pad',   75.00),
    (5213, 'Cablu USB',   45.50);
\`\`\`

### Posibile rezultate ale unui INSERT

- Dacă \`item_id\` deja există şi coloana este cheie primară — primeşti **Primary Key Violation**.
- Dacă \`category_id\` face referire la un tabel părinte şi valoarea nu există — primeşti **Foreign Key Violation**.
- Dacă inserezi NULL într-o coloană cu \`NOT NULL\` — primeşti eroare de NULL.
- Dacă tabelul **nu are** PRIMARY KEY şi nicio constrângere relevantă, inserarea reuşeşte — chiar şi cu valori duplicat.

Exemplu concret: tabelul \`roads\` este declarat cu \`road_id INT NOT NULL, distance_km INT NOT NULL\`, dar fără PRIMARY KEY explicit. Atunci \`INSERT INTO roads VALUES (1234, 36);\` se va executa cu succes, chiar dacă mai există un rând cu \`road_id = 1234\` — pentru că nu există constrângere de unicitate.

### Şirurile de caractere şi datele

Stringurile sunt delimitate cu **ghilimele simple**: \`'text'\`. Datele se scriu de obicei în formatul ISO \`'YYYY-MM-DD'\`.

\`\`\`sql
INSERT INTO purchases (purchase_id, client_id, purchase_date, total_amount)
VALUES (90021, 412, '2024-09-15', 1750.00);
\`\`\`

---

## UPDATE — actualizarea datelor existente

Sintaxa generală:

\`\`\`sql
UPDATE <nume_tabel>
SET <coloana> = <valoare_nouă>
WHERE <condiţie>;
\`\`\`

### Exemple practice

Schimbi prenumele unui voluntar:

\`\`\`sql
UPDATE volunteers
SET given_name = 'Mariana'
WHERE given_name = 'Maria' AND volunteer_id = 33;
\`\`\`

Aplici o creştere de 8% asupra unui produs:

\`\`\`sql
UPDATE items
SET unit_price = unit_price * 1.08
WHERE item_id = 5210;
\`\`\`

Reasignezi categoria pentru toate articolele de tip "lingură":

\`\`\`sql
UPDATE items
SET category_id = 47
WHERE item_description = 'lingură';
\`\`\`

### Greşeli frecvente

- \`SET items SET ...\` — lipseşte cuvântul cheie UPDATE la început.
- \`ALTER items SET ...\` — ALTER se foloseşte pentru structură, nu pentru date.
- \`FROM items SET ...\` — formă invalidă; FROM se asociază cu SELECT, nu cu UPDATE.

### Pericolul UPDATE-ului fără WHERE

\`\`\`sql
UPDATE items SET unit_price = 0;
\`\`\`

Această instrucţiune va seta preţul **TUTUROR** articolelor la zero. Înainte de orice UPDATE pe producţie, încadrează-l într-o tranzacţie:

\`\`\`sql
BEGIN;
UPDATE items SET unit_price = unit_price * 1.08 WHERE category_id = 47;
SELECT COUNT(*) FROM items WHERE category_id = 47;  -- verifici
COMMIT;  -- sau ROLLBACK dacă numărul nu e cel aşteptat
\`\`\`

---

## DELETE — eliminarea rândurilor

\`\`\`sql
DELETE FROM <nume_tabel>
WHERE <condiţie>;
\`\`\`

### Exemple

Elimini un client după ID:

\`\`\`sql
DELETE FROM clients
WHERE client_id = 78521;
\`\`\`

Elimini toţi voluntarii cu un anumit prenume:

\`\`\`sql
DELETE FROM volunteers
WHERE given_name = 'Maria';
\`\`\`

### Operatori de comparaţie — atenţie!

În SQL nu există \`==\` (acela e din C/Java/Python). Pentru egalitate foloseşti un singur \`=\`. De asemenea, \`EQUALS\` şi \`IS\` nu se folosesc pentru comparaţie de valori — \`IS\` apare doar împreună cu NULL: \`WHERE column IS NULL\`.

### În producţie

Multe echipe **nu şterg fizic** rândurile; în schimb, folosesc o coloană \`deleted_at TIMESTAMP\` (soft delete). Astfel, datele rămân disponibile pentru audit, iar interogările normale filtrează cu \`WHERE deleted_at IS NULL\`. Pentru curăţenie periodică, un job nocturn execută DELETE real pe rândurile mai vechi de N luni.

---`,
  },
  {
    slug: `select-interogari-de-baza`,
    title: `SELECT — interogări de bază`,
    orderIndex: 9,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## SELECT — punctul de pornire al oricărei interogări

\`SELECT\` este instrucţiunea prin care extragi date dintr-un tabel. Forma minimă cere două elemente: ce coloane vrei (sau \`*\` pentru toate) şi din ce tabel le iei.

### Sintaxa de bază

\`\`\`sql
SELECT <coloane>
FROM <tabel>
WHERE <condiţie>;
\`\`\`

### Condiţii multiple — AND, OR, <>

- **AND** — ambele condiţii trebuie să fie adevărate simultan.
- **OR** — cel puţin una dintre condiţii este adevărată.
- **<>** sau \`!=\` — diferit de o valoare.

Exemplu: comenzile plasate după ianuarie 2024 din toate regiunile **EXCEPTÂND** Bălţi:

\`\`\`sql
SELECT *
FROM purchases
WHERE purchase_date > '2024-01-31'
  AND ship_region <> 'BL';
\`\`\`

De ce AND, nu OR? Pentru că vrem **ambele** condiţii adevărate: data ulterioară lui ianuarie ŞI o regiune diferită de Bălţi. De ce \`<>\`, nu \`LIKE\`? Pentru că semantic vrem "diferit de", nu "similar cu".

### Numărarea rândurilor — COUNT

\`\`\`sql
SELECT COUNT(*) FROM staff;
\`\`\`

\`COUNT(*)\` numără toate rândurile, inclusiv cele cu valori NULL. \`COUNT(coloana)\` numără doar rândurile unde acea coloană NU este NULL — un detaliu uşor de uitat. Variante precum \`COUNT(rows)\` sau \`SUM(*)\` nu sunt valide.

### Funcţii agregate

| Funcţie    | Ce calculează              |
|------------|----------------------------|
| COUNT()    | Numărul de rânduri         |
| SUM()      | Suma valorilor             |
| AVG()      | Media aritmetică           |
| MAX()      | Valoarea maximă            |
| MIN()      | Valoarea minimă            |

Exemplu — raport sumar pe linia de comandă:

\`\`\`sql
SELECT COUNT(line_id),
       AVG(line_total),
       MAX(line_total),
       SUM(line_total)
FROM order_lines;
\`\`\`

Funcţiile agregate operează pe **coloane**, dar pot calcula şi pe **expresii**:

\`\`\`sql
SELECT SUM(unit_price * quantity) AS revenue_total
FROM order_lines;
\`\`\`

### Aliasuri pentru lizibilitate

\`\`\`sql
SELECT first_name AS prenume,
       last_name  AS nume,
       contact_email AS email
FROM staff;
\`\`\`

Aliasul \`AS\` redenumeşte coloana în setul de rezultate — util când coloana provine dintr-o expresie sau funcţie agregată.

### LIMIT — primele N rânduri

\`\`\`sql
-- PostgreSQL, MySQL, SQLite:
SELECT * FROM staff LIMIT 10;

-- SQL Server:
SELECT TOP 10 * FROM staff;

-- Oracle (versiuni vechi):
SELECT * FROM staff WHERE ROWNUM <= 10;
\`\`\`

### Sub-interogări — un SELECT în alt SELECT

\`\`\`sql
SELECT first_name, salary
FROM staff
WHERE salary > (SELECT AVG(salary) FROM staff);
\`\`\`

Interogarea internă (între paranteze) este executată prima, iar valoarea returnată este folosită de cea externă. Sub-interogările sunt utile, dar pe seturi mari pot fi încete — adesea pot fi rescrise ca JOIN-uri sau CTE-uri (vezi lecţia despre CTE).

### În producţie

Niciodată \`SELECT *\` în cod de aplicaţie — specifică explicit coloanele de care ai nevoie. Motivele: economiseşti lăţime de bandă, eviţi să te bazezi pe ordinea coloanelor (care se poate schimba) şi nu transferi date inutile (texte mari, BLOB-uri). \`SELECT *\` e ok doar în consola de debug.

---`,
  },
  {
    slug: `group-by-having-order-by`,
    title: `GROUP BY, HAVING, ORDER BY`,
    orderIndex: 10,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## GROUP BY — rezumarea datelor pe grupuri

\`GROUP BY\` colapsează rândurile în grupuri pe baza valorilor uneia sau mai multor coloane, iar funcţiile agregate (COUNT, SUM, AVG etc.) sunt aplicate pe fiecare grup în parte.

### Exemplu de bază

Numărul de clienţi pe ţară:

\`\`\`sql
SELECT country,
       COUNT(client_id) AS total_clients
FROM clients
GROUP BY country;
\`\`\`

Rezultatul are un rând pentru fiecare ţară unică, iar coloana \`total_clients\` arată cât de mulţi clienţi există în acea ţară.

### Mai multe coloane în GROUP BY

\`\`\`sql
SELECT country, city, COUNT(*) AS total
FROM clients
GROUP BY country, city;
\`\`\`

Aici fiecare combinaţie unică (ţară, oraş) formează un grup distinct.

### HAVING — filtrarea grupurilor

Diferenţa esenţială între WHERE şi HAVING:

- **WHERE** filtrează **rândurile individuale** **înainte** de a fi grupate.
- **HAVING** filtrează **grupurile rezultate** **după** ce GROUP BY a fost aplicat.

Exemplu: ţările cu mai puţin de 30 de clienţi:

\`\`\`sql
SELECT country,
       COUNT(client_id) AS total_clients
FROM clients
GROUP BY country
HAVING COUNT(client_id) < 30;
\`\`\`

**Nu poţi pune funcţii agregate într-un WHERE.** O scriere de tipul \`WHERE COUNT(client_id) < 30\` produce eroare de sintaxă, fiindcă WHERE este evaluat înaintea grupării — în acel moment COUNT încă nu a fost calculat.

### Ordinea logică a clauzelor

Reţine succesiunea, e des testată:

\`\`\`
SELECT --> FROM --> WHERE --> GROUP BY --> HAVING --> ORDER BY --> LIMIT
\`\`\`

Dacă scrii ORDER BY înaintea lui GROUP BY, primeşti syntax error. Soluţia: muţi ORDER BY la final.

### Combinarea WHERE + GROUP BY + HAVING

Vrei numărul de comenzi din 2024, grupate pe lună, doar pentru lunile cu peste 100 de comenzi:

\`\`\`sql
SELECT EXTRACT(MONTH FROM purchase_date) AS month_no,
       COUNT(*) AS total_orders
FROM purchases
WHERE purchase_date >= '2024-01-01'
  AND purchase_date <  '2025-01-01'
GROUP BY EXTRACT(MONTH FROM purchase_date)
HAVING COUNT(*) > 100;
\`\`\`

---

## ORDER BY — sortarea rezultatelor

\`\`\`sql
SELECT * FROM pupils
ORDER BY signup_date DESC;
\`\`\`

- **ASC** = ascendent (implicit) — de la mic la mare, alfabetic A→Z.
- **DESC** = descendent — de la mare la mic, sau de la cel mai recent la cel mai vechi.

### Sortare după mai multe coloane

\`\`\`sql
SELECT first_name, last_name, signup_date
FROM pupils
ORDER BY signup_date DESC, last_name ASC;
\`\`\`

Întâi sortează după \`signup_date\` descendent; pentru rândurile cu aceeaşi dată, le sortează alfabetic după \`last_name\`.

### Exemplu cu condiţii compuse

Raport cu pupilii înscrişi de la 1 mai 2024 SAU absolvenţi din anul curent, sortaţi descrescător după data de înscriere:

\`\`\`sql
SELECT *
FROM pupils
WHERE signup_date >= '2024-05-01'
   OR (academic_status = 'Graduated' AND graduation_date >= '2024-01-01')
ORDER BY signup_date DESC;
\`\`\`

OR e necesar pentru că vrem **ambele categorii**: cei înscrişi recent ŞI cei absolvenţi (chiar dacă s-au înscris demult).

### Window functions — pas dincolo de GROUP BY

Funcţiile fereastră îţi permit să faci agregări **fără a pierde rândurile individuale**. Sunt extrem de utile pentru clasamente, comparaţii cu media etc.

\`\`\`sql
-- Numerotează pupilii în ordinea înscrierii, pe oraşe:
SELECT first_name, city, signup_date,
       ROW_NUMBER() OVER (PARTITION BY city ORDER BY signup_date) AS pos
FROM pupils;

-- Compară salariul fiecărui angajat cu media departamentului său:
SELECT staff_id, salary, department_id,
       AVG(salary) OVER (PARTITION BY department_id) AS dept_avg
FROM staff;

-- Vezi salariul angajatului anterior pe ordinea de angajare:
SELECT staff_id, salary, hire_date,
       LAG(salary) OVER (ORDER BY hire_date) AS prev_salary
FROM staff;
\`\`\`

\`ROW_NUMBER()\`, \`RANK()\`, \`LAG()\`, \`LEAD()\` sunt printre cele mai folosite. Spre deosebire de GROUP BY, **nu colapsează rândurile** — adaugă o coloană calculată.

### În producţie

Pe rapoarte mari, GROUP BY pe coloane neindexate poate fi foarte lent. Verifici planul de execuţie cu \`EXPLAIN\`:

\`\`\`sql
EXPLAIN SELECT country, COUNT(*) FROM clients GROUP BY country;
\`\`\`

Dacă vezi *Seq Scan* (PostgreSQL) sau *full table scan* (MySQL), poţi accelera adăugând un index pe \`country\` sau materializând rezultatul într-un tabel sumar actualizat periodic.

---`,
  },
  {
    slug: `join-uri-combinarea-tabelelor`,
    title: `JOIN-uri — combinarea tabelelor`,
    orderIndex: 11,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## JOIN-uri — cum legi tabelele între ele

Într-o bază normalizată, datele sunt împrăştiate în mai multe tabele. JOIN-urile sunt mecanismul prin care le combini într-un singur set de rezultate.

### CROSS JOIN — produsul cartezian

\`CROSS JOIN\` combină **fiecare rând** din tabelul A cu **fiecare rând** din tabelul B. Numărul de rânduri rezultate = rânduri_A × rânduri_B.

\`\`\`sql
SELECT staff.first_name, departments.dept_name
FROM staff
CROSS JOIN departments;
\`\`\`

Dacă \`staff\` are 4 rânduri şi \`departments\` are 5, rezultatul are 4 × 5 = 20 de rânduri. \`SELECT ... FROM staff, departments;\` (cu virgulă, fără ON) este, de asemenea, un produs cartezian.

CROSS JOIN este util în cazuri rare (de exemplu, generarea de combinaţii de testare). În practica zilnică e aproape întotdeauna o greşeală de sintaxă — uitarea unui ON.

### INNER JOIN — doar rândurile cu potrivire

INNER JOIN returnează rândurile care **au corespondent în ambele tabele** pe condiţia de join.

\`\`\`sql
SELECT pupils.first_name,
       pupils.last_name,
       courses.course_title
FROM courses
INNER JOIN enrollments ON enrollments.course_id = courses.course_id
INNER JOIN pupils      ON enrollments.pupil_id  = pupils.pupil_id;
\`\`\`

Dacă un pupil **nu** are nicio înscriere, nu apare în rezultat. Dacă un curs nu are pupili înscrişi, nici el nu apare.

Imaginează-ţi acest scenariu: tabelul \`machines\` are 3 rânduri, \`operators\` are 3 rânduri, iar tabelul de legătură \`assignments\` are doar 2 rânduri (acoperă mașinile 1 şi 2 cu operatorii 1 şi 2). Atunci:

- INNER JOIN \`machines\` cu \`assignments\` returnează 2 rânduri (doar maşinile alocate).
- LEFT JOIN \`operators\` cu \`assignments\` returnează 3 rânduri (toţi operatorii, inclusiv cel fără alocare).

### LEFT JOIN — toate rândurile din stânga

\`\`\`sql
SELECT clients.client_id, clients.full_name, purchases.purchase_id
FROM clients
LEFT JOIN purchases ON purchases.client_id = clients.client_id;
\`\`\`

Returnează **toţi clienţii**, chiar dacă nu au făcut nicio achiziţie. Pentru clienţii fără achiziţii, coloanele din \`purchases\` apar ca NULL.

### RIGHT JOIN şi FULL OUTER JOIN

- **RIGHT JOIN** — oglindă a LEFT JOIN: toate rândurile din tabelul drept, plus potrivirile din stânga.
- **FULL OUTER JOIN** — toate rândurile din ambele tabele, cu NULL acolo unde nu există potrivire (nu este suportat de MySQL clasic; foloseşti UNION de două LEFT JOIN-uri).

### SELF JOIN — un tabel cu el însuşi

Util când rândurile fac referire la alte rânduri din acelaşi tabel — clasic în structuri ierarhice (manager, angajat).

\`\`\`sql
SELECT e.first_name AS angajat,
       m.first_name AS manager
FROM staff e
LEFT JOIN staff m ON m.staff_id = e.manager_id;
\`\`\`

Aici \`staff\` apare de două ori, cu aliasuri diferite: \`e\` pentru angajat, \`m\` pentru manager.

### USING vs ON

Dacă coloanele de join au acelaşi nume în ambele tabele, poţi folosi \`USING\`:

\`\`\`sql
SELECT * FROM courses
INNER JOIN enrollments USING (course_id);
\`\`\`

\`USING\` aduce coloana o singură dată în setul de rezultate, în timp ce \`ON\` o aduce de două ori (câte una din fiecare tabel).

### În producţie

Atenţie la **JOIN-urile fără index**. Dacă \`enrollments.course_id\` nu are index, motorul trebuie să citească tot tabelul pentru fiecare rând din \`courses\` — performanţă catastrofală pe seturi mari. Ca regulă generală, cheile externe ar trebui să fie indexate. Verifici cu \`EXPLAIN\` dacă planul foloseşte index lookup sau sequential scan.

---`,
  },
  {
    slug: `null-valorile-lipsa`,
    title: `NULL — valorile lipsă`,
    orderIndex: 12,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## NULL — absenţa valorii

NULL nu înseamnă "zero", nu înseamnă "string gol", nu înseamnă "false". Înseamnă **necunoscut** sau **inaplicabil**. Această distincţie schimbă fundamental comportamentul SQL.

### Reguli care trebuie ştiute pe de rost

#### 1. NULL nu se compară cu =

\`\`\`sql
-- ❌ Nu funcționează niciodată — întoarce mereu UNKNOWN, nu TRUE
SELECT * FROM staff WHERE phone = NULL;

-- ✅ Forma corectă
SELECT * FROM staff WHERE phone IS NULL;
SELECT * FROM staff WHERE phone IS NOT NULL;
\`\`\`

De ce? Pentru că NULL înseamnă "necunoscut", iar o comparaţie cu o valoare necunoscută nu poate fi nici TRUE, nici FALSE — este **UNKNOWN**. Filtrul WHERE păstrează doar rândurile cu TRUE.

#### 2. Concatenarea cu NULL produce NULL

\`\`\`sql
SELECT 'Salutări ' || prefix || ' ' || first_name AS greeting
FROM person;
\`\`\`

Dacă \`prefix\` sau \`first_name\` este NULL, întregul rezultat devine NULL — nu primeşti "Salutări John", ci NULL.

Soluţia este \`COALESCE\`, care returnează prima valoare non-NULL dintr-o listă:

\`\`\`sql
SELECT 'Salutări ' || COALESCE(prefix, '') || ' ' || COALESCE(first_name, 'oaspete') AS greeting
FROM person;
\`\`\`

#### 3. Aritmetica cu NULL produce NULL

\`5 + NULL\` rezultă NULL. La fel \`NULL * 2\`, \`NULL - 1\` etc. Foloseşti COALESCE pentru a substitui o valoare implicită:

\`\`\`sql
SELECT salary + COALESCE(bonus, 0) AS total_compensation
FROM staff;
\`\`\`

#### 4. Funcţiile agregate ignoră NULL

\`COUNT(column)\`, \`SUM(column)\`, \`AVG(column)\` sar peste rândurile cu NULL. Excepţie notabilă: \`COUNT(*)\` numără TOATE rândurile, indiferent de NULL-uri.

\`\`\`sql
-- Rezultat diferit dacă există NULL-uri:
SELECT COUNT(*)         FROM staff;  -- toate rândurile
SELECT COUNT(phone)     FROM staff;  -- doar cele cu telefon completat
SELECT AVG(bonus)       FROM staff;  -- media doar peste cei cu bonus
\`\`\`

### Exemple din practică

Ştergerea angajaţilor fără telefon:

\`\`\`sql
DELETE FROM staff WHERE phone IS NULL;
\`\`\`

Lista clădirilor inspectate (au o dată de inspecţie completată):

\`\`\`sql
SELECT building_id, address
FROM buildings
WHERE inspection_date IS NOT NULL;
\`\`\`

### NULLIF şi CASE — partenerii lui COALESCE

\`\`\`sql
-- NULLIF(a, b) returnează NULL dacă a = b, altfel returnează a
SELECT NULLIF(division_factor, 0);  -- evită împărţirea la 0

-- CASE permite logică condiţională
SELECT first_name,
       CASE
         WHEN bonus IS NULL THEN 'fără bonus'
         WHEN bonus > 5000  THEN 'bonus mare'
         ELSE 'bonus standard'
       END AS bonus_category
FROM staff;
\`\`\`

### În producţie

Decide din timp dacă o coloană poate sau nu să fie NULL — şi declară explicit \`NOT NULL\` cu \`DEFAULT\` acolo unde nu are sens să lipsească. Coloanele NULLABLE necontrolate sunt sursă de bug-uri subtile: rapoarte care omit rânduri, sume incorecte, interogări care merg pe staging dar pică pe producţie.

Pentru filtre cu egalitate care trebuie să trateze şi NULL-urile, foloseşti \`IS DISTINCT FROM\` (PostgreSQL) sau \`<=>\` (MySQL):

\`\`\`sql
-- PostgreSQL — egalitate care tratează NULL-urile corect
SELECT * FROM staff WHERE department_id IS DISTINCT FROM 7;
\`\`\`

---`,
  },
  {
    slug: `view-uri-si-union`,
    title: `VIEW-uri și UNION`,
    orderIndex: 13,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## VIEW-uri — interogări salvate ca tabele virtuale

Un **VIEW** este o interogare \`SELECT\` salvată sub un nume, care poate fi folosită apoi ca şi cum ar fi un tabel. Datele rămân în tabelele originale; view-ul doar le prezintă într-o formă convenabilă.

### De ce ai folosi un VIEW?

- **Lizibilitate** — încapsulezi un JOIN complex sub un nume scurt.
- **Securitate** — expui doar coloanele permise unui anumit grup de utilizatori.
- **Refactoring** — schimbi structura tabelelor de bază fără să modifici query-urile aplicaţiei (atâta timp cât VIEW-ul rămâne neschimbat).

### Crearea unui VIEW

\`\`\`sql
CREATE VIEW north_american_mammals AS
SELECT a.animal_id,
       a.common_name,
       a.scientific_name
FROM animals AS a
WHERE a.class_name        = 'Mammals'
  AND a.in_north_america  = 1;
\`\`\`

Apoi îl foloseşti exact ca pe un tabel:

\`\`\`sql
SELECT * FROM north_american_mammals
WHERE common_name LIKE 'B%';
\`\`\`

### Ştergerea unui VIEW

\`\`\`sql
DROP VIEW staff_summary;
\`\`\`

Sintaxe greşite des întâlnite: \`DELETE VIEW\`, \`DELETE staff_summary\`, \`DROP staff_summary\` (fără cuvântul VIEW). Forma corectă este **DROP VIEW <nume>**.

### Exemplu complet

Vrem un VIEW care expune doar informaţiile publice despre companiile dintr-o anumită regiune:

\`\`\`sql
CREATE VIEW public_company_directory AS
SELECT company_id,
       company_name,
       company_type
FROM companies
WHERE region_code = 'NV';
\`\`\`

### Materialized views — VIEW-uri stocate fizic

În PostgreSQL şi Oracle există **MATERIALIZED VIEW**. Spre deosebire de un VIEW obişnuit (care se recalculează de fiecare dată), un materialized view stochează rezultatul pe disc şi se reîmprospătează la cerere:

\`\`\`sql
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT EXTRACT(YEAR  FROM purchase_date) AS y,
       EXTRACT(MONTH FROM purchase_date) AS m,
       SUM(total_amount) AS revenue
FROM purchases
GROUP BY 1, 2;

REFRESH MATERIALIZED VIEW monthly_revenue;
\`\`\`

Util când raportul e scump, dar tolerabil să fie "vechi" cu câteva minute / ore.

---

## UNION — combinarea seturilor de rezultate

\`UNION\` combină rezultatele a două (sau mai multe) interogări într-un singur set, cu condiţia ca ambele să aibă **aceleaşi coloane** (acelaşi număr şi tipuri compatibile).

\`\`\`sql
SELECT first_name, contact_email FROM clients
UNION
SELECT first_name, contact_email FROM staff;
\`\`\`

### Variante

| Operator         | Comportament                                                        |
|------------------|---------------------------------------------------------------------|
| **UNION**        | Combină + **elimină duplicatele** (mai lent, face un DISTINCT)      |
| **UNION ALL**    | Combină **păstrând duplicatele** (mai rapid)                        |
| **EXCEPT** / MINUS | Rândurile din primul query care NU apar în al doilea              |
| **INTERSECT**    | Doar rândurile prezente în AMBELE seturi                            |

\`\`\`sql
-- Toate adresele de email, fără duplicate
SELECT contact_email FROM clients
UNION
SELECT contact_email FROM staff;

-- Toate adresele, cu duplicate (mai rapid pentru analiză rapidă)
SELECT contact_email FROM clients
UNION ALL
SELECT contact_email FROM staff;
\`\`\`

### Capcane comune

- Numărul de coloane trebuie să fie **identic**.
- Tipurile coloanelor trebuie să fie **compatibile** (text cu text, numeric cu numeric).
- ORDER BY se scrie **doar la final**, după ultimul SELECT, şi se aplică întregului rezultat unit.

### În producţie

Dacă ştii că nu există duplicate (sau că nu te deranjează), foloseşte mereu **UNION ALL** — diferenţa de performanţă faţă de UNION poate fi de zeci de ori, fiindcă UNION declanşează o sortare şi o deduplicare costisitoare.

---`,
  },
  {
    slug: `stored-procedures-si-functions`,
    title: `Stored Procedures și Functions`,
    orderIndex: 14,
    durationMinutes: 11,
    isPreview: false,
    markdown: `## Stored Procedures şi Functions — cod reutilizabil pe server

Pe lângă tabele şi view-uri, motoarele relaţionale îţi permit să stochezi şi **logică executabilă** — proceduri stocate şi funcţii definite de utilizator.

### Procedura stocată (Stored Procedure)

O procedură stocată este un set de instrucţiuni SQL salvate pe server sub un nume, care poate fi apelată din aplicaţii sau din alte proceduri.

\`\`\`sql
-- Sintaxă PostgreSQL / SQL Server (simplificată)
CREATE PROCEDURE update_staff_salary(
    in_staff_id INT,
    in_pct      DECIMAL(5,2)
)
AS $$
BEGIN
    UPDATE staff
    SET salary = salary * (1 + in_pct / 100)
    WHERE staff_id = in_staff_id;
END;
$$ LANGUAGE plpgsql;

-- Apelare
CALL update_staff_salary(42, 5.0);
\`\`\`

#### Beneficiul principal

**Îmbunătăţeşte performanţa.** Procedura este **pre-compilată** la creare, prin urmare execuţiile ulterioare sărim peste etapa de parsare şi planificare. În plus, reduci traficul reţea: un singur apel \`CALL\` în loc de zeci de query-uri trimise pe rând.

Atenţie la afirmaţiile false des întâlnite:

- "ocoleşte case-sensitivity" — fals,
- "minimizează spaţiul de stocare" — fals,
- "criptează automat datele" — fals.

### Funcţia (Function)

O funcţie definită de utilizator este similară unei proceduri, **dar trebuie să returneze o valoare** (sau un set de rânduri). Acea valoare poate fi folosită direct într-un SELECT.

\`\`\`sql
CREATE FUNCTION discounted_price(
    base_price DECIMAL(10,2),
    pct        DECIMAL(5,2)
)
RETURNS DECIMAL(10,2)
AS $$
BEGIN
    RETURN base_price * (1 - pct / 100);
END;
$$ LANGUAGE plpgsql;

-- Folosire
SELECT item_name,
       unit_price,
       discounted_price(unit_price, 15) AS price_after_discount
FROM items;
\`\`\`

### Funcţie vs procedură — diferenţa cheie

| Aspect                | Funcţie                                  | Procedură stocată                      |
|-----------------------|------------------------------------------|----------------------------------------|
| Returnează valoare?   | **Obligatoriu**                          | Opţional                               |
| Folosibilă în SELECT? | Da                                       | Nu (de obicei)                         |
| Modifică date?        | De obicei nu (funcţii pure)              | Da, frecvent                           |
| Apelare              | \`SELECT funcţia(...)\`                  | \`CALL procedura(...)\`                |

### Trigger-e — verişorul automat al procedurilor

Un **TRIGGER** este o procedură care se execută **automat** la un eveniment (INSERT, UPDATE, DELETE) pe un tabel. Util pentru audit, validare avansată, derivarea unor coloane.

\`\`\`sql
CREATE TRIGGER audit_staff_changes
AFTER UPDATE ON staff
FOR EACH ROW
EXECUTE FUNCTION log_staff_change();
\`\`\`

Triggerele sunt puternice, dar uşor de abuzat — devin "logică ascunsă" pe care e greu s-o depanezi. Foloseşte-le moderat şi documentează-le bine.

### În producţie

În aplicaţiile moderne, multă logică care înainte stătea în proceduri stocate s-a mutat în **stratul de aplicaţie** (cod Python, Node, Go etc.) — e mai uşor de testat, de versionat în Git şi de portat între motoare. Procedurile stocate rămân utile pentru:

- operaţii bulk care ating sute de mii de rânduri,
- logică de integritate care **trebuie** să ruleze la nivel de bază (independent de aplicaţie),
- raportări complexe pe seturi mari.

---`,
  },
  {
    slug: `indexuri-si-constraints`,
    title: `Indexuri și Constraints`,
    orderIndex: 15,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## Indexuri — accelerarea căutărilor

Un **index** este o structură auxiliară care permite motorului să găsească rapid rândurile fără a scana tot tabelul. Analogia cea mai bună: indexul de la finalul unei cărţi te trimite direct la pagina cu termenul căutat, în loc să răsfoieşti toată cartea.

### Clustered Index

- **Sortează fizic** rândurile pe disc după valoarea coloanei indexate.
- Există **un singur** clustered index per tabel (datele nu pot fi sortate în două feluri simultan).
- Se creează automat pe \`PRIMARY KEY\`.
- Eficient pentru:
  - căutări de range (\`WHERE x BETWEEN a AND b\`, \`WHERE x > 100\`),
  - sortări (\`ORDER BY\` pe acea coloană),
  - JOIN-uri pe cheia primară.

### Non-Clustered Index

- Creează o **structură separată** (de tip B-tree) cu pointeri spre rândurile reale.
- Poţi avea **mai multe** non-clustered indexes pe acelaşi tabel.
- Eficient pentru coloane des folosite în WHERE, dar care nu sunt cheia primară.

### Exemplu practic

Tabelul \`books\` are 2.000.000 de rânduri. Vrei toate cărţile dintr-o anumită categorie:

\`\`\`sql
SELECT title, author
FROM books
WHERE category = 'Science Fiction';
\`\`\`

Cel mai bun index aici este un **non-clustered index pe category**:

\`\`\`sql
CREATE INDEX idx_books_category ON books(category);
\`\`\`

Filtrul WHERE va fi servit aproape instant, în loc să citească toate cele 2 milioane de rânduri.

### Indexuri compuse (multi-column)

\`\`\`sql
CREATE INDEX idx_purchases_client_date
ON purchases(client_id, purchase_date);
\`\`\`

Acest index este folosit eficient pentru:

- \`WHERE client_id = 42\` (prima coloană),
- \`WHERE client_id = 42 AND purchase_date > '2024-01-01'\` (ambele coloane).

**Nu** este folosit eficient pentru \`WHERE purchase_date > '2024-01-01'\` singur — fără prima coloană din index, motorul nu îl poate folosi.

### Citirea planului de execuţie cu EXPLAIN

\`EXPLAIN\` (sau \`EXPLAIN ANALYZE\`) îţi arată cum motorul intenţionează să execute interogarea:

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM books WHERE category = 'Science Fiction';
\`\`\`

Termeni de urmărit:

- **Seq Scan / Full Table Scan** — motorul citeşte tot tabelul (rău pe tabele mari, ok pe cele mici).
- **Index Scan / Index Seek** — motorul foloseşte indexul (de obicei mult mai rapid).
- **Nested Loop / Hash Join / Merge Join** — strategia de JOIN.
- **Cost / Rows / Time** — estimări şi măsurători efective.

### Costul ascuns al indexurilor

Indexurile **nu sunt gratuite**:

- ocupă spaţiu pe disc,
- încetinesc INSERT, UPDATE şi DELETE (fiecare modificare trebuie reflectată în indexuri),
- trebuie reconstruite sau întreţinute periodic.

Reguli empirice:

- Indexează coloanele folosite des în WHERE, JOIN, ORDER BY.
- **Nu** indexa fiecare coloană — la 10+ indexuri pe un tabel cu trafic mare de scriere, performanţa se prăbuşeşte.
- Verifică periodic (cu \`pg_stat_user_indexes\` în PostgreSQL) ce indexuri NU sunt folosite şi şterge-le.

---

## Constraints — garanţii la nivel de schemă

O **constrângere** (constraint) este o regulă pe care motorul o impune asupra datelor, refuzând operaţiile care ar viola-o. Răspunsul corect la "ce asigură validitatea datelor?" este **constraint** — nu attribute, nu index, nu primary key în sine (PK e doar un tip de constraint).

### Tipurile de constrângeri

| Constraint        | Ce garantează                                                  |
|-------------------|----------------------------------------------------------------|
| **NOT NULL**      | Coloana trebuie să aibă valoare la fiecare rând                |
| **UNIQUE**        | Toate valorile sunt distincte (dar permite NULL în multe motoare) |
| **PRIMARY KEY**   | NOT NULL + UNIQUE simultan; identifică unic rândul             |
| **FOREIGN KEY**   | Valoarea trebuie să existe în alt tabel (referenţial integritate) |
| **CHECK**         | O expresie booleană trebuie să fie TRUE pentru fiecare rând    |
| **DEFAULT**       | Dacă nu se specifică valoare la INSERT, se foloseşte cea declarată |

### Exemplu cu mai multe constrângeri

\`\`\`sql
CREATE TABLE staff (
    staff_id      INT PRIMARY KEY,
    contact_email VARCHAR(120) UNIQUE NOT NULL,
    salary        DECIMAL(10,2) CHECK (salary >= 0),
    status        VARCHAR(20)   DEFAULT 'active'
                    CHECK (status IN ('active', 'on_leave', 'former')),
    department_id INT,
    CONSTRAINT fk_staff_dept
        FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
\`\`\`

### În producţie

Constrângerile la nivel de bază de date sunt **ultima linie de apărare**. Validarea în aplicaţie e bună pentru UX (mesaje rapide pentru utilizator), dar e fragilă — un script ad-hoc, un import bulk sau un dezvoltator obosit pot ocoli aplicaţia. Constrângerile DB nu pot fi ocolite. Tratează-le ca pe o investiţie în igienă pe termen lung, nu ca pe o piedică de moment.

---`,
  },
  {
    slug: `entity-relationship-diagrams-erd`,
    title: `Entity Relationship Diagrams (ERD)`,
    orderIndex: 16,
    durationMinutes: 11,
    isPreview: false,
    markdown: `## ERD — harta vizuală a unei baze de date

Un **Entity Relationship Diagram (ERD)** este o reprezentare grafică a tabelelor şi a relaţiilor dintre ele. E primul artefact pe care îl produci când proiectezi o bază nouă — mai întâi desenezi, apoi scrii \`CREATE TABLE\`.

### Tipuri de relaţii

- **One-to-One (1:1)** — fiecare rând din A corespunde cu un singur rând din B (ex: \`staff\` ↔ \`staff_credentials\`).
- **One-to-Many (1:N)** — un rând din A poate corespunde cu mai multe rânduri din B (ex: un \`client\` are mai multe \`purchases\`).
- **Many-to-Many (M:N)** — orice rând din A poate corespunde cu mai multe rânduri din B şi invers (ex: \`pupils\` ↔ \`courses\`).

### Many-to-Many şi tabelul de joncţiune

Relaţia M:N nu poate fi exprimată direct prin chei externe. Soluţia: un **tabel intermediar** care conţine câte o cheie externă spre fiecare parte.

Exemplu — relaţia \`machines\` ↔ \`operators\`: un operator poate fi alocat la mai multe maşini, iar o maşină poate fi operată de mai mulţi operatori.

\`\`\`
MACHINES (machine_id PK, model_name, manufacturer)
    ↕  (1:N spre assignments)
ASSIGNMENTS (assignment_id PK, machine_id FK, operator_id FK, shift_date)
    ↕  (N:1 spre operators)
OPERATORS (operator_id PK, full_name, experience_years)
\`\`\`

În \`assignments\`:

- \`machine_id\` este FK spre \`machines.machine_id\`,
- \`operator_id\` este FK spre \`operators.operator_id\`,
- \`(machine_id, operator_id, shift_date)\` poate forma o cheie unică (un operator nu poate fi alocat de două ori la aceeaşi maşină în aceeaşi zi).

### Exemplu de eroare la INSERT şi cum o citeşti

Încerci:

\`\`\`sql
INSERT INTO assignments (machine_id, operator_id, shift_date)
VALUES (3, 4, '2024-09-12');
\`\`\`

Dar primeşti eroarea:

\`\`\`
ERROR: insert or update on table "assignments" violates foreign key
constraint "fk_assignments_machine"
DETAIL: Key (machine_id)=(3) is not present in table "machines".
\`\`\`

Citirea corectă a mesajului:

- Numele constraint-ului — \`fk_assignments_machine\` — îţi spune că violarea este între \`assignments\` şi \`machines\`.
- Detaliul — \`Key (machine_id)=(3) is not present in table "machines"\` — explică exact: în tabelul \`machines\` nu există un rând cu \`machine_id = 3\`.

Concluzia: cauza problemei este **lipsa unui rând în \`machines\` cu ID-ul 3** — nu un duplicat (acela ar fi PK violation), ci o referinţă către un părinte inexistent.

### Notaţii ERD comune

- **Crow's foot notation** — cea mai folosită. Linia se "despică în trei" la capătul "many".
- **Chen notation** — dreptunghiuri pentru entităţi, romburi pentru relaţii. Mai academică.

Tool-uri populare pentru desenare: **dbdiagram.io** (text-to-diagram), **draw.io**, **Lucidchart**, **MySQL Workbench**.

### În producţie

Păstrează ERD-ul în repository, alături de cod (de exemplu, un fişier \`schema.dbml\` sau \`schema.png\`). La fiecare migraţie majoră, îl actualizezi. Echipele care neglijează ERD-ul ajung să "redescopere" structura citind tabel cu tabel — pierdere de timp pentru oricine intră nou în proiect.

---`,
  },
  {
    slug: `query-practice-drag-drop-pattern`,
    title: `Query practice — pattern-uri uzuale`,
    orderIndex: 17,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## Pattern-uri de interogare des întâlnite

În practică, multe query-uri reale urmează aceleaşi şabloane. Iată câteva pe care e bine să le ai în memorie.

### "Top N după criteriu, filtrând valorile lipsă"

Vrei primele 10 clădiri inspectate, ordonate după data inspecţiei (cele mai vechi primele):

\`\`\`sql
SELECT TOP 10 address
FROM buildings
WHERE inspection_date IS NOT NULL
ORDER BY inspection_date ASC;
\`\`\`

Sau, în PostgreSQL / MySQL / SQLite:

\`\`\`sql
SELECT address
FROM buildings
WHERE inspection_date IS NOT NULL
ORDER BY inspection_date ASC
LIMIT 10;
\`\`\`

Ce face fiecare bucată:

- \`IS NOT NULL\` — exclude clădirile care **nu** au fost inspectate niciodată (fiindcă \`inspection_date\` lipseşte).
- \`ORDER BY ... ASC\` — pune cele mai vechi inspecţii primele.
- \`TOP 10\` / \`LIMIT 10\` — păstrează doar primele 10 din rezultat.

### "Lista entităţilor care au o anumită proprietate completată"

Lista clienţilor care au extensie de telefon completată, sortaţi alfabetic:

\`\`\`sql
SELECT last_name, phone_number, extension
FROM clients
WHERE extension IS NOT NULL
ORDER BY last_name;
\`\`\`

### "Numără elementele copil pentru fiecare părinte"

Pentru fiecare client, câte achiziţii are:

\`\`\`sql
SELECT c.client_id,
       c.full_name,
       COUNT(p.purchase_id) AS total_purchases
FROM clients c
LEFT JOIN purchases p ON p.client_id = c.client_id
GROUP BY c.client_id, c.full_name
ORDER BY total_purchases DESC;
\`\`\`

LEFT JOIN e important: vrem şi clienţii cu **zero achiziţii** (cei pentru care nu există rânduri în \`purchases\`).

### "Găseşte duplicatele"

\`\`\`sql
SELECT contact_email, COUNT(*) AS occurrences
FROM clients
GROUP BY contact_email
HAVING COUNT(*) > 1;
\`\`\`

Returnează doar adresele care apar de mai multe ori — util pentru curăţenie de date.

### CTE — Common Table Expressions

Atunci când o interogare devine prea complexă pentru un singur SELECT, foloseşti **CTE** (\`WITH ... AS\`). E ca o variabilă temporară care îţi face cererea mult mai lizibilă:

\`\`\`sql
WITH high_value_clients AS (
    SELECT client_id, SUM(total_amount) AS lifetime_value
    FROM purchases
    GROUP BY client_id
    HAVING SUM(total_amount) > 50000
)
SELECT c.full_name, hvc.lifetime_value
FROM clients c
INNER JOIN high_value_clients hvc ON hvc.client_id = c.client_id
ORDER BY hvc.lifetime_value DESC;
\`\`\`

CTE-urile pot fi şi **recursive**, ceea ce le face perfect pentru ierarhii (organigrame, arbori, grafuri):

\`\`\`sql
WITH RECURSIVE org_tree AS (
    SELECT staff_id, manager_id, full_name, 1 AS level
    FROM staff
    WHERE manager_id IS NULL                  -- CEO

    UNION ALL

    SELECT s.staff_id, s.manager_id, s.full_name, ot.level + 1
    FROM staff s
    INNER JOIN org_tree ot ON s.manager_id = ot.staff_id
)
SELECT * FROM org_tree;
\`\`\`

### Conectarea din Python — pe scurt

Două biblioteci dominante în lumea Python:

\`\`\`python
# 1. psycopg2 — driver direct pentru PostgreSQL
import psycopg2
conn = psycopg2.connect("dbname=shop user=admin password=...")
cur = conn.cursor()
cur.execute("SELECT full_name FROM clients WHERE client_id = %s", (42,))
print(cur.fetchone())

# 2. SQLAlchemy — un ORM la nivel mai înalt
from sqlalchemy import create_engine, text
engine = create_engine("postgresql://admin:...@localhost/shop")
with engine.connect() as conn:
    rows = conn.execute(text("SELECT full_name FROM clients LIMIT 10"))
    for r in rows:
        print(r.full_name)
\`\`\`

**Foarte important:** întotdeauna foloseşte **placeholder-uri parametrizate** (\`%s\`, \`?\`, \`:name\`) — niciodată concatenare de stringuri. Concatenarea deschide poarta atacurilor **SQL injection**, una dintre cele mai răspândite vulnerabilităţi de securitate.

### În producţie

Ţine la îndemână o bibliotecă de query-uri "şablon" reutilizabile. Când scrii al o sutea raport săptămânal, productivitatea diferenţa între cineva care porneşte de la zero şi cineva care adaptează un şablon existent.

---`,
  },
  {
    slug: `recap-final-ddl-vs-dml`,
    title: `Recap final: DDL vs DML`,
    orderIndex: 18,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## Recapitulare — DDL vs DML şi privirea generală

SQL este împărţit în câteva sub-limbaje, fiecare cu rolul său. Pentru lecţiile precedente sunt importante două:

| Categorie                                | Comenzi                                  | Pentru ce                                |
|------------------------------------------|------------------------------------------|------------------------------------------|
| **DDL** (Data Definition Language)       | CREATE, ALTER, DROP, TRUNCATE            | Definesc / modifică **structura**        |
| **DML** (Data Manipulation Language)     | SELECT, INSERT, UPDATE, DELETE           | Operează asupra **datelor**              |
| **DCL** (Data Control Language)          | GRANT, REVOKE                            | Permisiuni pe obiecte                    |
| **TCL** (Transaction Control Language)   | BEGIN, COMMIT, ROLLBACK, SAVEPOINT       | Tranzacţii                               |

### Tranzacţiile — proprietatea ACID

Una dintre puterile centrale ale bazelor relaţionale este suportul pentru tranzacţii cu proprietăţile **ACID**:

- **A**tomicitate — toate operaţiile reuşesc, sau niciuna.
- **C**onsistenţă — baza trece dintr-o stare validă în altă stare validă.
- **I**zolare — tranzacţiile concurente nu se "văd" parţial unele pe altele.
- **D**urabilitate — odată confirmate (COMMIT), datele rezistă chiar şi la o pană de curent.

\`\`\`sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 500 WHERE account_id = 2;
COMMIT;  -- ambele linii sunt salvate; sau ROLLBACK pentru anulare
\`\`\`

### SQL vs NoSQL — când nu e suficient SQL

Bazele relaţionale strălucesc când:

- ai **scheme bine definite** care nu se schimbă des,
- ai nevoie de **tranzacţii ACID** stricte,
- vrei să faci **JOIN-uri complexe** între entităţi.

Dar există scenarii în care alte tipuri de baze sunt mai potrivite:

- **MongoDB** (document store) — stochezi documente JSON cu schemă flexibilă; util pentru profiluri de utilizator cu câmpuri variabile.
- **Redis** (key-value în memorie) — viteză extremă pentru cache, sesiuni, rate-limiting.
- **Neo4j** (graf) — relaţii adânci între entităţi (reţele sociale, recomandări).
- **InfluxDB / TimescaleDB** (time-series) — telemetrie, IoT, metrici de monitorizare.

Multe arhitecturi moderne combină mai multe tipuri: PostgreSQL pentru date tranzacţionale + Redis pentru cache + MongoDB pentru loguri.

---

## Cheat sheet final — cele mai dese capcane

1. \`WHERE phone = NULL\` — **GREŞIT.** Forma corectă: \`WHERE phone IS NULL\`.
2. \`DELETE TABLE\` — **NU EXISTĂ.** Foloseşti \`DROP TABLE\` (DDL) sau \`DELETE FROM tabel\` (DML).
3. \`==\` — **nu e operator în SQL.** Foloseşti un singur \`=\`.
4. \`ALTER TABLE ... DELETE col\` — **GREŞIT.** Forma corectă: \`ALTER TABLE ... DROP COLUMN col\`.
5. Un VIEW se elimină cu \`DROP VIEW\`, nu cu \`DELETE VIEW\`.
6. Concatenarea cu NULL produce NULL — foloseşte \`COALESCE\` pentru a o evita.
7. \`HAVING\` vine **după** GROUP BY, niciodată înainte.
8. \`ORDER BY\` vine **ultimul** în interogare (înainte de LIMIT).
9. CROSS JOIN produce \`N × M\` rânduri — rar dorit, adesea o greşeală.
10. \`PRIMARY KEY\` creează automat un index clustered pe acea coloană.
11. \`TRUNCATE\` şterge toate rândurile **fără logare individuală** — rapid dar nereversibil.
12. O **funcţie** trebuie să returneze o valoare; o **procedură** stocată poate, dar nu trebuie.
13. \`FOREIGN KEY\` asigură integritatea referenţială între tabele.
14. **1NF** cere: rânduri unice + valori atomice (fără grupuri repetitive).
15. \`UNION\` deduplică (lent); \`UNION ALL\` păstrează duplicatele (rapid).
16. Fără indexuri, query-urile pe tabele mari devin liniar lente — verifici cu \`EXPLAIN\`.
17. Niciodată nu concatenezi input de utilizator în SQL — foloseşti placeholder-e parametrizate.

---`,
  },
  {
    slug: `cheat-sheet-curs-de-corectie`,
    title: `Cheat sheet — capcane frecvente și sumar practic`,
    orderIndex: 19,
    durationMinutes: 12,
    isPreview: false,
    markdown: `# CURS DE CONSOLIDARE — Lucrurile pe care le uităm cel mai des

### Recitește pentru a fixa cunoștințele înainte de exerciții

---

## 1. ORDINEA CLAUZELOR — coloana vertebrală

Imaginează-ți o linie de producție: nu poți împacheta produsul înainte să-l asamblezi. La fel în SQL, fiecare clauză își are locul:

\`\`\`
SELECT   --> ce coloane vrei
FROM     --> sursa datelor
WHERE    --> filtrezi rândurile
GROUP BY --> formezi grupuri
HAVING   --> filtrezi grupurile
ORDER BY --> sortezi rezultatul
LIMIT    --> reții doar primele N rânduri
\`\`\`

**Ordine logică ⇄ ordine de execuţie.** Motorul rulează în această ordine: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. De aceea poţi referenţia un alias din SELECT în ORDER BY, dar nu în WHERE.

### UPDATE — întâi SET, apoi WHERE

\`\`\`sql
-- Corect:
UPDATE items
SET category_id = 47
WHERE item_description = 'lingură';

-- Greșit (WHERE înaintea lui SET):
UPDATE items
WHERE item_description = 'lingură'
SET category_id = 47;
\`\`\`

Logica este: mai întâi spui CE schimbi, apoi UNDE.

### HAVING vs WHERE — partajarea muncii

\`\`\`sql
-- WHERE filtrează RÂNDURI individuale (înainte de grupare)
-- HAVING filtrează GRUPURI rezultate (după grupare)

SELECT country, COUNT(client_id) AS total
FROM clients
GROUP BY country
HAVING COUNT(client_id) < 30;     -- corect
-- WHERE COUNT(client_id) < 30 ar produce eroare!
\`\`\`

**Regula simplă:** dacă filtrul foloseşte COUNT, SUM, AVG, MAX sau MIN, **clauza este HAVING, nu WHERE**.

---

## 2. JOIN-uri — cum se aşază matematica

### INNER JOIN păstrează doar potrivirile

\`\`\`
Machines:    3 rânduri (ID 1, 2, 3)
Operators:   3 rânduri (ID 1, 2, 3)
Assignments: 2 rânduri  (machine 1+operator 1, machine 2+operator 2)

INNER JOIN Machines cu Assignments    --> 2 rânduri (mașinile 1, 2)
LEFT JOIN  Operators cu Assignments   --> 3 rânduri (toți operatorii)
\`\`\`

### Sintaxa corectă cu ON

\`\`\`sql
-- Corect:
SELECT pupils.first_name, pupils.last_name, courses.course_title
FROM courses
INNER JOIN enrollments ON enrollments.course_id = courses.course_id
INNER JOIN pupils      ON enrollments.pupil_id  = pupils.pupil_id;

-- Greșit: virgulă între tabele cu condiție în WHERE,
-- sau "INNER JOIN ON courses, enrollments"
\`\`\`

**Regula:** \`INNER JOIN <tabel> ON <condiţie>\`. Niciodată virgulă, niciodată WHERE pentru condiţia de join.

---

## 3. LIKE vs = (potrivirea de tipare)

\`\`\`sql
-- Vrei numele care încep cu litera 'A':
WHERE first_name LIKE 'A%'      -- corect

-- Greșit:
WHERE first_name = 'A%'         -- caută literal şirul "A%"
\`\`\`

**%** = orice secvenţă de caractere (chiar şi vidă), valid doar cu LIKE.
**_** = exact un caracter, valid doar cu LIKE.

Exemple concrete:

- \`LIKE 'A%'\` — Ana, Adrian, Alexandru.
- \`LIKE '%ana%'\` — Ana, Banana, Diana, Iliana.
- \`LIKE 'A_a'\` — exact 3 caractere, începe cu A şi se termină cu a (Ana, Ara).

Pentru căutări de text mai complexe, multe motoare oferă **expresii regulate**: PostgreSQL are operatorul \`~\`, MySQL are \`REGEXP\`.

---

## 4. DDL vs DML — cum le distingi

**DDL** (Data **Definition** Language) — defineşte STRUCTURA:

\`\`\`
CREATE   --> creezi tabel/view/index
ALTER    --> modifici structura
DROP     --> elimini un obiect
TRUNCATE --> goleşti un tabel (fără logare)
\`\`\`

**DML** (Data **Manipulation** Language) — operează cu DATELE:

\`\`\`
SELECT --> citeşti
INSERT --> adaugi
UPDATE --> modifici
DELETE --> ştergi (cu logare)
\`\`\`

Memotehnică: DDL = construieşti / demolezi clădirea. DML = muţi mobila înăuntru.

---

## 5. DELETE vs TRUNCATE vs DROP

\`\`\`
DELETE FROM tabel;       --> şterge rândurile, cu logare individuală
                         --> structura rămâne, poţi folosi WHERE
                         --> reversibil într-o tranzacţie

TRUNCATE TABLE tabel;    --> şterge rândurile fără logare individuală (rapid)
                         --> structura rămâne, NU acceptă WHERE
                         --> de obicei nereversibil

DROP TABLE tabel;        --> elimină tot (date + structură)
\`\`\`

Întrebări tipice:

- *"Care comandă elimină rândurile fără logare individuală?"* devine **TRUNCATE**.
- *"Cum elimini un tabel din baza de date?"* devine **DROP TABLE**.

---

## 6. ALTER TABLE — pentru structură, nu pentru date

\`\`\`sql
-- Elimini o coloană:
ALTER TABLE clients DROP COLUMN national_id;

-- Elimini o cheie externă:
ALTER TABLE purchases DROP CONSTRAINT fk_purchases_client;
\`\`\`

**Atenție:** *"Cum elimin o cheie externă?"* devine **ALTER TABLE ... DROP CONSTRAINT** — niciodată \`ALTER FOREIGN KEY\`, \`DELETE TABLE\`, sau \`DELETE FOREIGN KEY\` (toate sunt sintaxă invalidă).

---

## 7. Tipurile de date — DECIMAL pentru bani

| Caz                       | Tip recomandat | Motivul                              |
|---------------------------|----------------|--------------------------------------|
| Bani, preţuri             | **DECIMAL**    | Precizie exactă cu zecimale          |
| Vârstă, cantitate, contor | **INT**        | Numere întregi mici / medii          |
| Nume, adresă, descriere   | **VARCHAR**    | Text de lungime variabilă            |
| Da/Nu, activ/inactiv      | **BIT / BOOLEAN** | Două stări — minim de spaţiu     |
| Timestamp eveniment       | **DATETIME / TIMESTAMP** | Data + ora              |
| ID unic global            | **UUID**       | Distribuit, nu se ciocneşte între servere |

Niciodată FLOAT pentru bani — erori de rotunjire. Niciodată VARCHAR pentru numere pe care vrei să le sortezi numeric — ar sorta lexicografic ('100' apare înainte de '20').

---

## 8. Indexurile — ce accelerează şi ce nu

Un **clustered index** sortează fizic datele pe disc (ca filele unei agende telefonice).

Accelerează:

- căutări de range (\`BETWEEN\`, \`>\`, \`<\`),
- coloane folosite des în \`ORDER BY\`,
- JOIN-uri pe cheia primară.

Nu accelerează:

- coloane folosite rar,
- coloane cu cardinalitate mică (de exemplu o coloană \`gender\` cu doar 2-3 valori).

Verifică planul cu \`EXPLAIN\` — dacă vezi *Seq Scan* pe un tabel mare, e un semn că lipseşte un index util.

---

## 9. Proprietăţile tabelelor — corect / fals

\`\`\`
"Each value in a field must be unique"        --> FALSE
   (doi pupili pot avea aceeaşi vârstă)

"Each row in a table must be unique"          --> TRUE
   (PRIMARY KEY garantează asta)

"Each column name in a table must be unique"  --> TRUE
   (nu poţi avea două coloane cu acelaşi nume în acelaşi tabel)
\`\`\`

Memotehnică: valorile se pot repeta; rândurile şi numele coloanelor, niciodată.

---

## 10. Citirea erorilor de Foreign Key

\`\`\`
violates foreign key constraint "fk_assignments_machine"
table "machines", column "machine_id"
\`\`\`

Citire pas cu pas:

- numele constraint-ului — \`fk_assignments_machine\` — îţi spune că relaţia e între \`assignments\` şi \`machines\`,
- tabelul + coloana — \`machines.machine_id\` — îţi spune unde lipseşte valoarea referită.

Concluzie: problema este "nu există un rând cu acel ID în tabelul părinte", **nu** "există deja". Diferenţa între FK violation şi PK violation e crucială — sunt erori complet diferite.

---

## 11. Securitate — SQL Injection

Niciodată nu construi un query prin **concatenare cu input de utilizator**:

\`\`\`python
# CATASTROFAL — atacatorul poate trimite "1; DROP TABLE pupils;--"
cur.execute("SELECT * FROM pupils WHERE id = " + user_input)

# Corect — placeholder parametrizat
cur.execute("SELECT * FROM pupils WHERE id = %s", (user_input,))
\`\`\`

Toate driverele moderne (psycopg2, mysql-connector, SQLAlchemy, Prisma, etc.) suportă parametri. **Foloseşte-i mereu.**

---

## CHEAT SHEET DE BUZUNAR

\`\`\`
1.  UPDATE --> SET --> WHERE  (niciodată WHERE înaintea lui SET)
2.  GROUP BY --> HAVING       (funcţii agregate = HAVING, nu WHERE)
3.  INNER JOIN tabel ON cond  (nu virgulă, nu WHERE)
4.  LIKE '%text%'             (nu = '%text%')
5.  DDL = CREATE/ALTER/DROP/TRUNCATE  |  DML = SELECT/INSERT/UPDATE/DELETE
6.  DELETE = cu logare        |  TRUNCATE = fără logare  |  DROP = totul
7.  ALTER TABLE pt FK / coloane / constrângeri
8.  DECIMAL pt bani           (niciodată FLOAT)
9.  Clustered index = range queries + ORDER BY
10. Valori = pot fi duplicate; rânduri = unice; nume coloane = unice
11. NULL nu se compară cu = ; foloseşte IS NULL / IS NOT NULL
12. Folosește placeholder-e parametrizate, niciodată concatenare
13. EXPLAIN îţi arată planul; Seq Scan pe tabel mare = adaugă index
14. Tranzacţii (BEGIN ... COMMIT/ROLLBACK) pentru operaţii critice
15. UNION = deduplică (lent); UNION ALL = păstrează (rapid)
\`\`\`

---

**Recitirea acestor 15 reguli, înainte de orice exerciţiu, scurtează semnificativ drumul de la "pare ok" la "merge corect prima dată".**`,
  },
];
