-- =============================================================================
-- InfoBac.md — Seed data
-- Idempotent: safe to re-run; uses ON CONFLICT DO NOTHING on stable slugs.
-- Run with: supabase db reset (rebuilds schema then runs seed)
--           or: psql $DATABASE_URL -f supabase/seed.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Courses (Pathway: Python → SQL → Networking)
-- -----------------------------------------------------------------------------
insert into public.courses
  (slug, title, description, order_index, estimated_duration, difficulty, icon)
values
  ('python', 'Python',
   'Limbajul de programare pe care se construiește totul. Sintaxă, structuri de control, funcții, OOP minimal — exact ce verifică examenul A Certiport IT Specialist.',
   1, '4–6 săptămâni', 'medium', '🐍'),
  ('sql', 'Databases / SQL',
   'Baze de date relaționale, SQL, normalizare, JOIN-uri. Logic și frumos după ce vezi exemple. Pregătire pentru examenul B.',
   2, '3–4 săptămâni', 'medium', '🗄️'),
  ('networking', 'Networking & Devices',
   'Structura calculatorului și rețele. Cel mai ușor — îl înveți într-o zi dacă te concentrezi. Pregătire pentru examenul C.',
   3, '1 zi', 'easy', '🖥️')
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  order_index = excluded.order_index,
  estimated_duration = excluded.estimated_duration,
  difficulty = excluded.difficulty,
  icon = excluded.icon;

-- -----------------------------------------------------------------------------
-- Lessons — Python (7 lecții)
-- -----------------------------------------------------------------------------
with py as (select id from public.courses where slug = 'python')
insert into public.lessons (course_id, slug, title, content, duration_minutes, order_index)
select py.id, l.slug, l.title, l.content, l.duration_minutes, l.order_index
from py, (values
  ('introducere',
   'Introducere în Python — ce, de ce, cum',
   E'# Introducere în Python\n\nPython e limbajul cu care începi pentru că:\n\n- E ușor de citit (aproape engleză)\n- E folosit peste tot (web, AI, automatizări)\n- E pe ce te testează Certiport la examenul A\n\n> [Conținut real va fi adăugat de echipă — această lecție e o introducere generală.]\n\n## În această lecție\n\n- Ce face Python diferit\n- Cum instalezi Python\n- Primul tău program: `print("Salut!")`',
   20, 1),
  ('sintaxa-si-variabile',
   'Sintaxa de bază și variabile',
   E'# Sintaxa și variabilele\n\nÎn Python nu există `;` la sfârșit de linie, nu există `{}` pentru blocuri — folosim **indentare**.\n\n```python\nnume = "Andrei"\nvarsta = 17\nprint(f"Salut, {nume}! Ai {varsta} ani.")\n```\n\n[Conținut detaliat în curs de adăugare.]',
   30, 2),
  ('tipuri-de-date',
   'Tipuri de date și operatori',
   E'# Tipuri de date\n\n- `int` — numere întregi: `42`, `-7`\n- `float` — numere zecimale: `3.14`\n- `str` — text: `"info"`\n- `bool` — `True` sau `False`\n- `list`, `tuple`, `set`, `dict` — colecții\n\n[Conținut real va urma.]',
   35, 3),
  ('flow-control',
   'Flow control — if, while, for',
   E'# Flow control\n\n```python\nif scor >= 70:\n    print("Promovat")\nelse:\n    print("Mai studiezi")\n\nfor i in range(3):\n    print(i)\n```\n\n[Conținut real va urma.]',
   45, 4),
  ('functii',
   'Funcții și module',
   E'# Funcții\n\n```python\ndef saluta(nume):\n    return f"Salut, {nume}!"\n\nprint(saluta("Maria"))\n```\n\n[Conținut real va urma.]',
   40, 5),
  ('input-output',
   'Input și output cu fișiere',
   E'# Input/Output\n\n```python\nwith open("date.txt", "r") as f:\n    continut = f.read()\n```\n\n[Conținut real va urma.]',
   35, 6),
  ('error-handling',
   'Erori și debugging',
   E'# Try/except\n\n```python\ntry:\n    n = int(input("Număr: "))\nexcept ValueError:\n    print("Nu e număr valid")\n```\n\n[Conținut real va urma.]',
   30, 7)
) as l(slug, title, content, duration_minutes, order_index)
on conflict (course_id, slug) do nothing;

-- -----------------------------------------------------------------------------
-- Lessons — SQL (6 lecții)
-- -----------------------------------------------------------------------------
with sq as (select id from public.courses where slug = 'sql')
insert into public.lessons (course_id, slug, title, content, duration_minutes, order_index)
select sq.id, l.slug, l.title, l.content, l.duration_minutes, l.order_index
from sq, (values
  ('introducere',
   'Ce e o bază de date relațională',
   E'# Ce e SQL?\n\nSQL = Structured Query Language. Limbajul cu care „vorbești" cu o bază de date.\n\n> [Conținut real va fi adăugat de echipă.]',
   20, 1),
  ('select-where',
   'SELECT, WHERE, ORDER BY',
   E'# Interogări de bază\n\n```sql\nSELECT nume, varsta\nFROM elevi\nWHERE varsta >= 17\nORDER BY nume;\n```\n\n[Conținut real va urma.]',
   45, 2),
  ('agregari',
   'Funcții de agregare și GROUP BY',
   E'# Agregări\n\n```sql\nSELECT clasa, COUNT(*) as nr_elevi\nFROM elevi\nGROUP BY clasa;\n```\n\n[Conținut real va urma.]',
   40, 3),
  ('join-uri',
   'JOIN-uri: INNER, LEFT, RIGHT',
   E'# JOIN-uri\n\n```sql\nSELECT e.nume, c.titlu\nFROM elevi e\nINNER JOIN cursuri c ON e.curs_id = c.id;\n```\n\n[Conținut real va urma.]',
   55, 4),
  ('manipulare-date',
   'INSERT, UPDATE, DELETE',
   E'# Manipulare date\n\n```sql\nINSERT INTO elevi (nume, varsta) VALUES ("Andrei", 17);\nUPDATE elevi SET varsta = 18 WHERE nume = "Andrei";\n```\n\n[Conținut real va urma.]',
   40, 5),
  ('normalizare',
   'Normalizare — 1NF, 2NF, 3NF',
   E'# De ce normalizăm?\n\nPentru a evita duplicate și inconsistențe.\n\n[Conținut real va urma.]',
   45, 6)
) as l(slug, title, content, duration_minutes, order_index)
on conflict (course_id, slug) do nothing;

-- -----------------------------------------------------------------------------
-- Lessons — Networking (5 lecții)
-- -----------------------------------------------------------------------------
with nw as (select id from public.courses where slug = 'networking')
insert into public.lessons (course_id, slug, title, content, duration_minutes, order_index)
select nw.id, l.slug, l.title, l.content, l.duration_minutes, l.order_index
from nw, (values
  ('hardware',
   'Componente hardware ale calculatorului',
   E'# Hardware\n\n- **CPU** — creierul\n- **RAM** — memoria de lucru\n- **HDD/SSD** — stocare\n- **GPU** — procesare grafică\n\n[Conținut real va urma.]',
   25, 1),
  ('software',
   'Software — sisteme și aplicații',
   E'# Software\n\n- Sistem de operare (Windows, macOS, Linux)\n- Aplicații (browser, editor text)\n- Drivere\n\n[Conținut real va urma.]',
   20, 2),
  ('retea',
   'Conectivitate de rețea',
   E'# Rețele\n\n- LAN vs WAN\n- IP, DNS, routing\n- Wi-Fi vs Ethernet\n\n[Conținut real va urma.]',
   30, 3),
  ('internet',
   'Internet și browsere web',
   E'# Internet\n\n- HTTP vs HTTPS\n- Cookies, cache\n- URL-uri\n\n[Conținut real va urma.]',
   25, 4),
  ('mentenanta',
   'Mentenanță și troubleshooting',
   E'# Mentenanță\n\n- Backup-uri\n- Antivirus, firewall\n- Update-uri\n\n[Conținut real va urma.]',
   25, 5)
) as l(slug, title, content, duration_minutes, order_index)
on conflict (course_id, slug) do nothing;

-- =============================================================================
-- QUIZZES + QUESTIONS
-- =============================================================================

-- Helper: insert a quiz (uniqueness on title within a course is enough for seed).
-- We use DO blocks to insert questions that reference newly-created quizzes.

-- -----------------------------------------------------------------------------
-- Python — practice quiz
-- -----------------------------------------------------------------------------
do $$
declare
  v_course_id uuid;
  v_quiz_id   uuid;
begin
  select id into v_course_id from public.courses where slug = 'python';

  -- Practice quiz
  select id into v_quiz_id
    from public.quizzes
   where course_id = v_course_id and title = 'Python — Auto-evaluare rapidă';

  if v_quiz_id is null then
    insert into public.quizzes (course_id, title, type, time_limit_minutes, passing_score)
    values (v_course_id, 'Python — Auto-evaluare rapidă', 'practice', 15, 70)
    returning id into v_quiz_id;

    insert into public.questions
      (quiz_id, question_text, options, correct_option_id, explanation, topic_tag, order_index)
    values
      (v_quiz_id,
       'Care e tipul rezultatului expresiei: 5 / 2 în Python 3?',
       '[{"id":"a","text":"int (2)"},{"id":"b","text":"float (2.5)"},{"id":"c","text":"str (\"2.5\")"},{"id":"d","text":"eroare"}]'::jsonb,
       'b',
       'În Python 3, operatorul / produce întotdeauna float, chiar dacă ambii operanzi sunt int. Pentru împărțire întreagă folosești //.',
       'tipuri-de-date', 1),
      (v_quiz_id,
       'Ce afișează: print(len("Salut"))?',
       '[{"id":"a","text":"4"},{"id":"b","text":"5"},{"id":"c","text":"6"},{"id":"d","text":"eroare"}]'::jsonb,
       'b',
       'len() returnează numărul de caractere. „Salut" are 5 caractere.',
       'tipuri-de-date', 2),
      (v_quiz_id,
       'Care indentare e corectă într-o funcție Python?',
       '[{"id":"a","text":"obligatoriu 4 spații"},{"id":"b","text":"obligatoriu tab"},{"id":"c","text":"orice indentare consistentă"},{"id":"d","text":"fără indentare"}]'::jsonb,
       'c',
       'Python acceptă orice indentare consistentă (de obicei 4 spații), dar trebuie să fie aceeași în tot blocul.',
       'sintaxa', 3),
      (v_quiz_id,
       'Ce e o listă în Python?',
       '[{"id":"a","text":"colecție ordonată, mutabilă"},{"id":"b","text":"colecție ordonată, imutabilă"},{"id":"c","text":"colecție neordonată"},{"id":"d","text":"un dicționar"}]'::jsonb,
       'a',
       'Listele Python sunt ordonate și mutabile — poți adăuga, modifica și șterge elemente.',
       'tipuri-de-date', 4),
      (v_quiz_id,
       'Cum prinzi o eroare de tip ValueError?',
       '[{"id":"a","text":"if error == ValueError"},{"id":"b","text":"try / except ValueError"},{"id":"c","text":"catch ValueError"},{"id":"d","text":"on error ValueError"}]'::jsonb,
       'b',
       'În Python, exceptiile se prind cu try/except. catch e Java/C#, on error e VBScript.',
       'error-handling', 5);
  end if;

  -- Exam simulation
  select id into v_quiz_id
    from public.quizzes
   where course_id = v_course_id and title = 'Python — Simulare examen Certiport';

  if v_quiz_id is null then
    insert into public.quizzes (course_id, title, type, time_limit_minutes, passing_score)
    values (v_course_id, 'Python — Simulare examen Certiport', 'exam_simulation', 50, 70)
    returning id into v_quiz_id;

    insert into public.questions
      (quiz_id, question_text, options, correct_option_id, explanation, topic_tag, order_index)
    values
      (v_quiz_id,
       'Ce afișează: print(type(3.0))?',
       '[{"id":"a","text":"<class \"int\">"},{"id":"b","text":"<class \"float\">"},{"id":"c","text":"<class \"number\">"},{"id":"d","text":"<class \"double\">"}]'::jsonb,
       'b',
       '3.0 e literal float; type() returnează clasa.',
       'tipuri-de-date', 1),
      (v_quiz_id,
       'Care e output-ul corect: [x*2 for x in range(3)]',
       '[{"id":"a","text":"[0, 1, 2]"},{"id":"b","text":"[0, 2, 4]"},{"id":"c","text":"[2, 4, 6]"},{"id":"d","text":"eroare"}]'::jsonb,
       'b',
       'List comprehension: range(3) e [0,1,2]; *2 = [0,2,4].',
       'tipuri-de-date', 2),
      (v_quiz_id,
       'Cum citești un fișier text linie cu linie?',
       '[{"id":"a","text":"file.read()"},{"id":"b","text":"file.readlines()"},{"id":"c","text":"for line in file:"},{"id":"d","text":"toate de mai sus, dar (c) e cel mai memory-efficient"}]'::jsonb,
       'd',
       'Iterarea directă pe handle-ul de fișier nu încarcă tot conținutul în memorie.',
       'input-output', 3);
    -- [Restul de 5-7 întrebări vor fi adăugate când conținutul real e finalizat.]
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- SQL — practice quiz
-- -----------------------------------------------------------------------------
do $$
declare
  v_course_id uuid;
  v_quiz_id   uuid;
begin
  select id into v_course_id from public.courses where slug = 'sql';

  select id into v_quiz_id
    from public.quizzes
   where course_id = v_course_id and title = 'SQL — Auto-evaluare rapidă';

  if v_quiz_id is null then
    insert into public.quizzes (course_id, title, type, time_limit_minutes, passing_score)
    values (v_course_id, 'SQL — Auto-evaluare rapidă', 'practice', 15, 70)
    returning id into v_quiz_id;

    insert into public.questions
      (quiz_id, question_text, options, correct_option_id, explanation, topic_tag, order_index)
    values
      (v_quiz_id,
       'Ce face SELECT * FROM elevi;?',
       '[{"id":"a","text":"șterge tabelul elevi"},{"id":"b","text":"selectează toate coloanele din tabelul elevi"},{"id":"c","text":"creează un tabel"},{"id":"d","text":"actualizează datele"}]'::jsonb,
       'b',
       'SELECT * extrage toate coloanele tuturor rândurilor din tabelul indicat.',
       'select', 1),
      (v_quiz_id,
       'Care clauză filtrează rândurile?',
       '[{"id":"a","text":"WHERE"},{"id":"b","text":"FILTER"},{"id":"c","text":"HAVING"},{"id":"d","text":"GROUP BY"}]'::jsonb,
       'a',
       'WHERE filtrează rândurile înainte de agregare. HAVING filtrează după GROUP BY.',
       'select', 2),
      (v_quiz_id,
       'Care JOIN păstrează toate rândurile din tabelul stâng?',
       '[{"id":"a","text":"INNER JOIN"},{"id":"b","text":"LEFT JOIN"},{"id":"c","text":"RIGHT JOIN"},{"id":"d","text":"FULL JOIN"}]'::jsonb,
       'b',
       'LEFT JOIN păstrează toate rândurile din stânga; cele fără match în dreapta primesc NULL.',
       'joins', 3),
      (v_quiz_id,
       'Ce face COUNT(*)?',
       '[{"id":"a","text":"numără toate rândurile, inclusiv NULL-urile"},{"id":"b","text":"numără doar rândurile non-NULL"},{"id":"c","text":"numără coloanele"},{"id":"d","text":"adună valori"}]'::jsonb,
       'a',
       'COUNT(*) numără toate rândurile. COUNT(coloana) numără doar non-NULL pentru acea coloană.',
       'agregari', 4),
      (v_quiz_id,
       'Cum schimbi o valoare existentă?',
       '[{"id":"a","text":"INSERT"},{"id":"b","text":"UPDATE ... SET ... WHERE"},{"id":"c","text":"CHANGE"},{"id":"d","text":"DELETE"}]'::jsonb,
       'b',
       'UPDATE modifică rânduri existente. Fără WHERE modifică tot tabelul — atenție.',
       'manipulare-date', 5);
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Networking — practice quiz
-- -----------------------------------------------------------------------------
do $$
declare
  v_course_id uuid;
  v_quiz_id   uuid;
begin
  select id into v_course_id from public.courses where slug = 'networking';

  select id into v_quiz_id
    from public.quizzes
   where course_id = v_course_id and title = 'Networking — Auto-evaluare rapidă';

  if v_quiz_id is null then
    insert into public.quizzes (course_id, title, type, time_limit_minutes, passing_score)
    values (v_course_id, 'Networking — Auto-evaluare rapidă', 'practice', 15, 70)
    returning id into v_quiz_id;

    insert into public.questions
      (quiz_id, question_text, options, correct_option_id, explanation, topic_tag, order_index)
    values
      (v_quiz_id,
       'Care componentă procesează instrucțiunile programelor?',
       '[{"id":"a","text":"RAM"},{"id":"b","text":"HDD"},{"id":"c","text":"CPU"},{"id":"d","text":"GPU"}]'::jsonb,
       'c',
       'CPU (Central Processing Unit) execută instrucțiunile. RAM stochează temporar date, HDD/SSD stochează permanent, GPU procesează grafic.',
       'hardware', 1),
      (v_quiz_id,
       'Ce e DNS?',
       '[{"id":"a","text":"sistem care convertește nume domenii în IP-uri"},{"id":"b","text":"firewall"},{"id":"c","text":"protocol email"},{"id":"d","text":"tip de cablu rețea"}]'::jsonb,
       'a',
       'DNS = Domain Name System. Traduce „infobac.md" într-o adresă IP pe care browserul o poate folosi.',
       'retea', 2),
      (v_quiz_id,
       'Diferența principală între LAN și WAN?',
       '[{"id":"a","text":"viteza"},{"id":"b","text":"acoperirea geografică"},{"id":"c","text":"prețul cablului"},{"id":"d","text":"tipul de IP"}]'::jsonb,
       'b',
       'LAN (Local) acoperă o clădire/casă. WAN (Wide) acoperă orașe sau țări. Internetul e cel mai mare WAN.',
       'retea', 3),
      (v_quiz_id,
       'Ce face HTTPS în plus față de HTTP?',
       '[{"id":"a","text":"e mai rapid"},{"id":"b","text":"criptează traficul"},{"id":"c","text":"folosește port 80"},{"id":"d","text":"funcționează doar pe Wi-Fi"}]'::jsonb,
       'b',
       'HTTPS adaugă TLS/SSL care criptează datele între browser și server.',
       'internet', 4),
      (v_quiz_id,
       'Care e o practică bună de securitate pentru parole?',
       '[{"id":"a","text":"aceeași parolă peste tot"},{"id":"b","text":"parole lungi, unice, cu password manager"},{"id":"c","text":"parole scurte ușor de memorat"},{"id":"d","text":"scrise pe hârtie lângă calculator"}]'::jsonb,
       'b',
       'Parolele unice + password manager + 2FA sunt standardul actual.',
       'mentenanta', 5);
  end if;
end $$;
