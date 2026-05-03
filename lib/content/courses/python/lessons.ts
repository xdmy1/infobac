// AUTO-GENERATED from scripts/generate-lessons.mjs — do not edit by hand.
// Re-run `node scripts/generate-lessons.mjs` after editing source content.

import type { Lesson } from "../types";

export const lessons: readonly Lesson[] = [
  {
    slug: `tipuri-de-date`,
    title: `Tipuri de date`,
    orderIndex: 1,
    durationMinutes: 12,
    isPreview: true,
    markdown: `## 1. Tipuri de date

### 1.1 Familia tipurilor fundamentale

**Concept de bază.** În Python, fiecare valoare aparține unei categorii numite tip de date. Cele cinci tipuri pe care le folosești cel mai des în orice program sunt: \`int\` (numere întregi), \`float\` (numere zecimale), \`str\` (text), \`bool\` (adevărat/fals) și \`complex\` (numere cu parte imaginară, mai rar întâlnite).

\`\`\`python
varsta_pers = 17        # int — număr întreg
greutate_kg = 67.5      # float — număr cu zecimale
prenume = 'Cristian'    # str — text între ghilimele
e_minor = True          # bool — valoare logică
nr_complex = 3 + 2j     # complex — folosit în calcule științifice
\`\`\`

**Important.** Spre deosebire de C sau Java, Python nu cunoaște tipurile \`char\` ori \`double\`. Un text format dintr-un singur caracter rămâne tot un \`str\`, iar toate numerele zecimale, indiferent de precizia lor, intră sub umbrela \`float\`.

> ⚠️ **Atenție la capcane.** Notațiile științifice precum \`+12E5\` sau \`2.7e-4\` rămân \`float\`, chiar dacă conțin litera \`E\`. Dacă vezi un număr scris între ghilimele (de exemplu \`'880098'\`), atunci e \`str\`, nu \`float\`, oricât de mult ar arăta a cifră.

\`\`\`python
type(+1E10)    # float (notație științifică)
type(5.0)      # float
type("True")   # str (are ghilimele!)
type(False)    # bool
type(2**2**2)  # int — devine 16
\`\`\`

**În lumea reală.** Când încarci date dintr-un fișier CSV sau dintr-un API, primele bug-uri apar tocmai din confuzia \`str\` vs \`float\`. De asta biblioteci ca \`pandas\` (\`pip install pandas\`) au funcția \`pd.read_csv(..., dtype=...)\` cu care indici exact tipul fiecărei coloane.

### 1.2 Citirea datelor de la utilizator: input() și eval()

**Regulă esențială.** Funcția \`input()\` returnează MEREU \`str\`, indiferent ce ai tastat la tastatură.

\`\`\`python
raspuns = input("Scrie ceva: ")
# Dacă tastezi 25 — rezultă raspuns = '25' (str), nu 25 (int)
# Dacă tastezi 3.14 — rezultă raspuns = '3.14' (str)
\`\`\`

**Despre eval().** Funcția \`eval()\` interpretează un text ca expresie Python și o execută. Folosește-o cu prudență — niciodată pe input direct de la utilizator nesigur, deoarece poate executa cod periculos.

\`\`\`python
eval('25')       # devine int 25
eval('3.14')     # devine float 3.14
eval('15+25')    # devine int 40
\`\`\`

**Conversie explicită.** Pentru a transforma intenționat un tip în altul, folosește \`int()\`, \`float()\`, \`str()\`, \`bool()\`.

\`\`\`python
int('42')        # devine 42
float('42')      # devine 42.0
int('42.7')      # ValueError! int() refuză text cu zecimale
float('42.7')    # devine 42.7 — funcționează corect
\`\`\`

> ⚠️ **Greșeală frecventă.** Mulți încearcă \`int('3.14')\` și sunt surprinși de \`ValueError\`. Drumul corect este \`int(float('3.14'))\`, prin urmare obții 3.

**Bună practică.** Validează intrările cu \`try / except ValueError\` înainte de a converti, mai ales într-o aplicație care primește text de la utilizator.

### 1.3 Tipul bool: ce e adevărat și ce e fals

**Regulă.** Valorile considerate Falsy sunt: \`0\`, \`0.0\`, \`''\`, \`[]\`, \`()\`, \`{}\`, \`set()\`, \`range(0)\`, \`None\`, \`False\`. Orice altceva e Truthy, inclusiv \`[False]\`, \`(0,)\` sau un singur spațiu \`' '\`.

\`\`\`python
bool([False])  # True — lista NU e goală, conține un element
bool('')       # False — text gol
bool(' ')      # True — un spațiu e tot un caracter
bool(0)        # False
bool(0.0)      # False
bool(3)        # True
bool(0.5)      # True
bool([])       # False
bool(())       # False
bool({})       # False
bool(set())    # False
bool(range(0)) # False
\`\`\`

> ⚠️ **Capcană clasică.** \`bool([False])\` rezultă True, \`bool('')\` rezultă False, iar \`bool(' ')\` rezultă True. Lista cu un singur element falsy e tot adevărată ca obiect, deoarece nu e goală.

### 1.4 Booleenii intră în calcule

**Regulă.** În operații aritmetice, \`True\` se comportă ca 1, iar \`False\` se comportă ca 0.

\`\`\`python
True + 7        # devine 8
False + 7       # devine 7
True + True     # devine 2
9 + False       # devine 9 (nu False!)

# Exemplu compus:
bool(1) + float(20)/float(4)
# devine True + 5.0, prin urmare 1 + 5.0, astfel 6.0
str(6.0)  # devine '6.0'

# Alt calcul:
False + 9 - True + 27 // 4
# devine 0 + 9 - 1 + 6, prin urmare 14
\`\`\`

**Operatori logici aplicați pe valori reale.**

\`\`\`python
12 == 12 and 18 != 18  # True and False, deci False
12 == 12 or  18 != 18  # True or False, deci True
not 12 == 12           # not True, deci False
not 0                  # devine True
not 12                 # devine False
not ''                 # devine True
not 'mihai'            # devine False
not None               # devine True
\`\`\`

### 1.5 Operații cu text

**Regulă.** \`str + str\` înseamnă concatenare, iar \`str * int\` înseamnă repetiție. Operațiile \`str - str\` sau \`str * str\` nu există și aruncă \`TypeError\`.

\`\`\`python
'7' + '3'    # devine '73' (concatenare)
'7' * 3      # devine '777' (repetiție)
# '7' - '3'  # TypeError — scăderea pe text e interzisă
# '7' * '3'  # TypeError — text * text invalid
\`\`\`

> ⚠️ **Capcană.** Dacă \`a = '7'\` și \`b = '3'\`, rezultă \`a + b = '73'\` (str), \`a * 2 = '77'\` (str), \`a - b\` și \`a * b\` produc erori.

**Regulă.** Atunci când amesteci \`int\` cu \`float\`, rezultatul devine \`float\`. Astfel, \`456 + 456.0\` rezultă \`912.0\`, niciodată \`912\`.

**În lumea reală.** Pentru construirea unor mesaje sau URL-uri, folosește f-string-uri (\`f"User {nume} are {puncte} puncte"\`) — sunt mai citibile decât concatenarea cu \`+\` și mai rapide decât \`.format()\`.

### 1.6 Indexarea în text

\`\`\`python
s = 'BANANA'
# Index pozitiv:  0  1  2  3  4  5
# Index negativ: -6 -5 -4 -3 -2 -1

s[0]   # devine 'B'
s[1]   # devine 'A'
s[-1]  # devine 'A'
s[3]   # devine 'A'

# Pentru a forma 'AA':
s[1] + s[3]  # 'A' + 'A', deci 'AA'
s[1] + s[5]  # 'A' + 'A', deci 'AA'
s[3] + s[5]  # 'A' + 'A', deci 'AA'

# Pentru un cuvânt 'TEXT':
cuv = 'TEXT'
cuv[0] + cuv[-1]  # 'T' + 'T', deci 'TT'
cuv[0] + cuv[2]   # 'T' + 'X', NU 'TT'
\`\`\`

**Regulă.** Indexarea în liste de liste se citește de la stânga la dreapta: \`orase[-1][-1]\` înseamnă ultimul caracter al ultimului oraș.

\`\`\`python
orase = ['Chisinau', 'Balti', 'Cahul', 'Edinet']
orase[-1]      # devine 'Edinet'
orase[-1][-1]  # devine 't'
\`\`\`

### 1.7 Slicing — felierea secvențelor

**Sintaxă.** \`secventa[start:stop:pas]\`. Indexul \`start\` este inclus, \`stop\` este exclus.

\`\`\`python
alfabet = "abcdefghijklmnopqrstuvwxyz"

alfabet[3:15]      # 'defghijklmno' (de la 3 până la 14)
alfabet[3:15:3]    # 'dgjm' (sare câte 3 poziții)
alfabet[3:15:-3]   # '' (pas negativ dar start<stop, rezultă text gol)
alfabet[15:3:-3]   # 'pmjg' (de la 15 înapoi cu pas 3)
alfabet[::-3]      # 'zwtqnkheb' (tot textul invers cu pas 3)
alfabet[15:3]      # '' (fără pas negativ și start>stop, devine gol)
\`\`\`

> ⚠️ **Capcană.** Dacă pasul e negativ și start < stop, rezultatul e mereu un text gol. Pentru parcurgere inversă, start trebuie să fie mai mare decât stop.

**Slicing pe liste — exemple practice.**

\`\`\`python
# Dintr-o galerie de 200 de culori, fiecare a doua începând cu a doua:
culori[1::2]     # start=1, pas=2

# Dintr-un departament de 200 de angajați, ultimii 5 sunt manageri:
angajati[:-5]    # exclude ultimii 5
angajati[-5:]    # doar ultimii 5

# Dintr-o listă de 500 de muncitori, ultimii 3 sunt din conducere:
muncitori[-3:]   # echivalent cu [497:] sau [497:500]
\`\`\`

### 1.8 Listele și operațiile lor

\`\`\`python
prima = [1, 2]
a_doua = [3, 4]
unite = prima + a_doua    # devine [1, 2, 3, 4]
triplate = unite * 3      # devine [1,2,3,4,1,2,3,4,1,2,3,4]
# NU multiplică valorile! Repetă elementele listei.
\`\`\`

**Regulă.** \`list(text)\` despică textul în caractere individuale. \`append()\` adaugă valoarea ca un SINGUR element, chiar dacă e un text de mai multe caractere.

\`\`\`python
text = 'AB CD'
lst = list(text)     # devine ['A','B',' ','C','D']
lst.append('EF')     # devine ['A','B',' ','C','D','EF']
# 'EF' a intrat ca un singur element, nu caracter cu caracter
\`\`\`

> ⚠️ **Greșeală gravă.** Dacă modifici lista pe care o iterezi într-un \`for\`, riști un loop infinit sau \`MemoryError\`.

\`\`\`python
litere = ['a','b','c','d']
for c in litere:
    litere.append(c.upper())  # MemoryError — lista crește la infinit
\`\`\`

**Soluție bună practică.** Lucrează pe o copie: \`for c in litere[:]:\`, sau construiește o listă nouă.

\`\`\`python
fructe = ['Mar', 'Banana', 'Morcov', 'Mango']
fructe[3]   # 'Mango' — corect
fructe[-1]  # 'Mango' — corect
fructe[4]   # IndexError — indexurile valide sunt doar 0-3
\`\`\`

### 1.9 Identitate (is) versus egalitate (==)

**Regulă.** \`==\` compară VALORILE conținute. \`is\` compară IDENTITATEA, adică dacă cele două nume pointează spre același obiect din memorie.

\`\`\`python
n1 = [10, 20, 30]
n2 = [10, 20, 30]
print(n1 == n2)   # True — aceleași valori
print(n1 is n2)   # False — obiecte diferite în memorie

n1 = n2           # acum ambele nume indică același obiect
print(n1 == n2)   # True
print(n1 is n2)   # True

# Slice produce o copie nouă:
sursa = [7, 8, 9]
copie = sursa[:]
print(copie == sursa)   # True
print(copie is sursa)   # False — copie nouă, alt obiect
\`\`\`

**Regulă.** Operatorii \`is not\` și \`!=\` sunt opușii lor.

\`\`\`python
l1 = ['a','b']
l2 = ['a','b']
print(l1 is not l2)  # True — obiecte distincte
print(l1 != l2)      # False — valori identice
l1 = l2
print(l1 is not l2)  # False
print(l1 != l2)      # False
\`\`\`

**În lumea reală.** Folosește \`is\` doar pentru comparații cu \`None\`, \`True\`, \`False\` (de exemplu \`if x is None:\`). Pentru comparații de valori, folosește \`==\`.

### 1.10 type() și isinstance()

\`\`\`python
type(True)    # <class 'bool'>
type(1.0)     # <class 'float'>
type(1)       # <class 'int'>
type('True')  # <class 'str'>

t = ([10, 20], 10, False)
type(t)       # <class 'tuple'>
type(t[0])    # <class 'list'>
type(t[1])    # <class 'int'>
type(t[0:])   # <class 'tuple'> — slicing pe tuple rămâne tuple
\`\`\`

**Regulă.** Funcția \`id()\` returnează un \`int\` ce reprezintă adresa obiectului în memorie.

**Regulă.** Cu \`lambda\` poți crea funcții scurte: \`f = lambda x: bool(x % 2)\` — astfel \`f(20)\` devine False, iar \`f(21)\` devine True.

**Type hints (bonus).** În proiecte serioase, declari tipurile așteptate pentru lizibilitate și pentru a folosi unelte precum \`mypy\`:

\`\`\`python
def saluta(nume: str, ani: int) -> str:
    return f"Salut {nume}, ai {ani} ani"
\`\`\`

**În lumea reală.** Verificarea tipurilor cu \`isinstance(x, (int, float))\` e mai flexibilă decât \`type(x) == int\`, deoarece acceptă și subclase. Standardul recomandat în Python 3.10+ este \`isinstance(x, int | float)\`.`,
  },
  {
    slug: `operatori-precedenta`,
    title: `Operatori & Precedență`,
    orderIndex: 2,
    durationMinutes: 12,
    isPreview: true,
    markdown: `## 2. Operatori & Precedență

### 2.1 Operatori aritmetici

\`\`\`python
a = 13
b = 5

a / b    # devine 2.6 — împărțirea returnează MEREU float
a // b   # devine 2 — floor division (rotunjește în jos)
a % b    # devine 3 — modulo (restul împărțirii)
a ** b   # devine 371293 — exponențiere

# Alte exemple:
20 / 4    # devine 5.0 (mereu float, chiar dacă rezultatul e întreg)
23 / 7    # devine 3.2857142857...
23 // 7   # devine 3
23 % 7    # devine 2
\`\`\`

> ⚠️ **Capcană.** Operatorul \`/\` produce întotdeauna \`float\`, prin urmare \`20 / 4\` devine \`5.0\`, niciodată \`5\`. Dacă vrei un întreg, folosește \`//\`.

**Regulă.** Floor division păstrează tipul: \`9 // 7\` devine \`1\` (int), iar \`9.0 // 7\` devine \`1.0\` (float).

**În lumea reală.** Când scrii cod care manipulează bani sau procente exacte, evită \`float\` din cauza erorilor de aproximare binară. Folosește modulul \`decimal\` (\`from decimal import Decimal\`) pentru calcule financiare precise.

### 2.2 Ordinea de precedență

**Regulă.** De la cel mai prioritar la cel mai puțin prioritar:

\`\`\`text
1. ()              Paranteze
2. **              Exponențiere (asociativitate dreapta-stânga!)
3. +x, -x, not     Operatori unari
4. *, /, //, %     Înmulțire și împărțiri
5. +, -            Adunare, scădere
6. and             Logic AND
7. or              Logic OR
\`\`\`

**Regulă.** Operatorii cu aceeași precedență se evaluează stânga-dreapta, cu o singură excepție: \`**\` se evaluează dreapta-stânga.

\`\`\`python
# Astfel: 2 ** 3 ** 2 devine 2 ** (3 ** 2), prin urmare 2 ** 9, deci 512

# Exercițiu pas cu pas:
8 // 6 % 5 + 2 ** 3 - 2
# Pas 1: 8 // 6 devine 1
# Pas 2: 1 % 5 devine 1 (// și % au aceeași precedență, stânga-dreapta)
# Pas 3: 2 ** 3 devine 8
# Pas 4: 1 + 8 - 2, prin urmare rezultatul e 7

# Alt exemplu:
6 // 4 % 5 + 2 ** 3 - 2 // 3
# (6 // 4) % 5 + (2 ** 3) - (2 // 3)
# 1 % 5 + 8 - 0, deci 1 + 8 - 0, astfel 9
\`\`\`

**Regulă.** Pentru combinații simple precum \`a + b * c - d\`, înmulțirea se face prima, apoi adunarea și scăderea, stânga-dreapta.

### 2.3 Assignment operators (operatori de atribuire)

\`\`\`python
x = 4
x += 1    # devine 5
x *= 3    # devine 15
x **= 2   # devine 225
x -= 25   # devine 200
x //= 7   # devine 28
x %= 9    # devine 1
\`\`\`

**Exercițiu pas cu pas.**

\`\`\`python
a = 4
b = 6
a += 2 ** 3      # 2**3 devine 8, prin urmare a devine 4+8, astfel 12
a -= b // 2 // 3 # 6//2 devine 3, 3//3 devine 1, deci a devine 12-1, rezultă 11
\`\`\`

\`\`\`python
x = 3
y = 8
x += 2 ** 3      # x devine 3+8, astfel 11
x //= y // 2 // 3  # 8//2 devine 4, 4//3 devine 1, deci x devine 11//1, prin urmare 11
\`\`\`

### 2.4 Operatorii in și not in

\`\`\`python
'r' in 'mihai'                  # False (nu există 'r' în 'mihai')
'is' in 'This IS a Fake News'   # False — 'is' nu se găsește (există 'IS' cu majuscule)
7 in [0, 1, 2, 3, 4]            # False (7 nu e în listă)

numere = [10, 20, 30, 40]
30 in numere       # True
50 in numere       # False
50 not in numere   # True
\`\`\`

> ⚠️ **Atenție.** Operatorul \`in\` este case-sensitive pentru string-uri. \`'is' in 'IS A KING'\` rezultă False.

### 2.5 Operatorii or și and pe valori (nu doar bool)

**Regulă.** \`or\` returnează prima valoare truthy întâlnită; dacă toate sunt falsy, returnează ultima.

**Regulă.** \`and\` returnează prima valoare falsy întâlnită; dacă toate sunt truthy, returnează ultima.

\`\`\`python
0 or 5        # devine 5 (0 e falsy, prin urmare returnează 5)
5 or 0        # devine 5
0 or 0        # devine 0 (ambele falsy, returnează ultima)
1 and 5       # devine 5 (ambele truthy, returnează ultima)
0 and 5       # devine 0 (0 e falsy, returnează 0)

# Comparații înlănțuite:
-5 < 0 < 5    # devine True — Python permite chained comparisons
\`\`\`

**Bună practică.** Folosește acest comportament pentru valori implicite: \`nume = nume_dat or 'Anonim'\` îți pune \`'Anonim'\` dacă \`nume_dat\` e gol sau \`None\`.

### 2.6 Expresie compusă X = 2 + 9 * ((3 * 12) - 8) / 10

\`\`\`python
X = 2 + 9 * ((3 * 12) - 8) / 10
# Pas 1: 3 * 12 devine 36
# Pas 2: 36 - 8 devine 28
# Pas 3: 9 * 28 devine 252
# Pas 4: 252 / 10 devine 25.2
# Pas 5: 2 + 25.2, astfel rezultatul e 27.2
\`\`\`

\`\`\`python
# (3 * (1 + 2)**2 - (2**2) * 3)
# 1+2 devine 3, 3**2 devine 9, 3*9 devine 27
# 2**2 devine 4, 4*3 devine 12
# 27 - 12, astfel 15

# (2 * (3 + 4)**2 - (3**3) * 3)
# 3+4 devine 7, 7**2 devine 49, 2*49 devine 98
# 3**3 devine 27, 27*3 devine 81
# 98 - 81, prin urmare 17
\`\`\`

### 2.7 Expresia b = (-a)**2

**Regulă.** Formularea „a multiplicat cu -1, apoi ridicat la pătrat" se traduce ca \`(-a)**2\`.

> ⚠️ **Capcană.** Forma \`-(a)**2\` înseamnă „ridică la pătrat, apoi negativ" — diferit!

> ⚠️ **Capcană.** Forma \`(a)**-2\` înseamnă \`1 / a²\` — total alt rezultat!

\`\`\`python
a = 6
b = (-a)**2   # (-6)**2 devine 36 — corect
b = -(a)**2   # -(36) devine -36 — diferit
b = (a)**-2   # 1/36 devine 0.0277... — total altceva
\`\`\`

### 2.8 Operatori bitwise (bonus)

În proiectele cu lucru pe biți (cripto, embedded, manipulare imagini), Python oferă operatori la nivel de bit:

\`\`\`python
12 & 10     # AND pe biți, devine 8
12 | 10     # OR pe biți, devine 14
12 ^ 10     # XOR pe biți, devine 6
~12         # negare bit, devine -13
12 << 2     # shift stânga cu 2, devine 48
12 >> 1     # shift dreapta cu 1, devine 6
\`\`\`

**În lumea reală.** Operatorul \`&\` se folosește des în \`pandas\` pentru combinarea condițiilor pe coloane, de exemplu \`df[(df.varsta > 18) & (df.activ == True)]\`. Atenție — la nivel de DataFrame se folosește \`&\` și \`|\`, nu \`and\` și \`or\`.`,
  },
  {
    slug: `flow-control`,
    title: `Flow control`,
    orderIndex: 3,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## 3. Flow control

### 3.1 if / elif / else

**Regulă.** \`if\` testează o condiție. \`elif\` se evaluează doar dacă cele anterioare au fost False. \`else\` prinde toate cazurile rămase.

> ⚠️ **Greșeală frecventă.** O serie de \`if\`-uri separate (fiecare independent) e total diferită de un lanț \`if-elif\` (din care se execută doar primul match).

\`\`\`python
puncte = 85

# GREȘIT — toate if-urile se evaluează separat:
if puncte >= 90: nota = 'A'
if puncte >= 80: nota = 'B'    # suprascrie nota anterioară!
if puncte >= 70: nota = 'C'    # ar suprascrie iar!

# CORECT — se oprește la primul match:
if puncte   >= 90: nota = 'A'
elif puncte >= 80: nota = 'B'
elif puncte >= 70: nota = 'C'
else:              nota = 'F'
\`\`\`

**Comparație înlănțuită.** Python permite \`if 80 <= puncte <= 100: nota = 'A'\` — mai natural decât \`if puncte >= 80 and puncte <= 100\`.

> ⚠️ **Capcană.** \`=\` e atribuire, \`==\` e comparație. Linia \`if a = b:\` produce \`SyntaxError\`.

### 3.2 Condiții compuse

\`\`\`python
# not (minor or senior) devine True doar dacă AMBII sunt False
# not (minor and senior) devine True dacă cel puțin unul e False

# Reducere doar pentru cei care NU sunt nici minori, nici seniori:
if not (minor or senior):    # adică e adult standard
    reducere = 0             # fără reducere
\`\`\`

**Condiții cu mai multe ramuri și atenție la \`if\` versus \`elif\`.**

\`\`\`python
# Comision pe baza sumei colectate de un agent:
colectat = 3000
comision = 0
if colectat <= 2000:
    comision = 50
elif colectat > 2500 and colectat < 3000:
    comision = 100
elif colectat > 2500:        # 3000 intră aici
    comision = 150
if colectat >= 3000:         # if SEPARAT — se evaluează independent!
    comision += 200
# Rezultat: comision devine 150 + 200, prin urmare 350
\`\`\`

> ⚠️ **Capcană.** Un \`if\` separat (NU un \`elif\`) se evaluează independent de blocul de mai sus, chiar dacă unul din \`elif\`-urile anterioare s-a executat.

### 3.3 Nested if și aplicații

\`\`\`python
# Sistem de rating de film:
def rating(varsta):
    if varsta is None:    eticheta = "C"   # necunoscut
    elif varsta >= 18:    eticheta = "A"   # adult
    elif varsta >= 13:    eticheta = "T"   # adolescent
    else:                 eticheta = "C"   # copil
    return eticheta
# rating(None) devine "C", rating(18) devine "A", rating(13) devine "T", rating(12) devine "C"
\`\`\`

\`\`\`python
# Funcție pentru calcul de radical sigur:
def radical_sigur(a, b):
    if a >= 0:                  # număr ne-negativ
        rezultat = a ** (1 / b)
    else:                       # număr negativ
        if a % 2 == 0:          # par
            rezultat = "Numar imaginar"
        else:                   # impar
            rezultat = -(-a) ** (1 / b)
    return rezultat
\`\`\`

\`\`\`python
# Sistem de închiriere de cărți:
if returnata == "n":               # returnată cu întârziere
    zile_inchiriate += 1
if ziua_inchirierii == "Duminica":  # 30% reducere
    total = (zile_inchiriate * pret_pe_zi) * 0.7
elif ziua_inchirierii == "Joi":     # 50% reducere
    total = (zile_inchiriate * pret_pe_zi) * 0.5
else:
    total = zile_inchiriate * pret_pe_zi
\`\`\`

### 3.4 Ternary (expresie condițională)

**Sintaxă.** \`valoare_daca_true if conditie else valoare_daca_false\`.

\`\`\`python
# Forma scurtă a unui if-else simplu:
rezultat = 3 if None else a / b
# None e falsy, prin urmare rezultat devine a/b

# Caz cu text:
text = 'He shall not be happy if he does not work'
poz = text.find('not') if text else None
# text e non-vid, deci se execută text.find('not')

text.find('not')   # devine 9 (prima apariție)
text.rfind('not')  # devine 30 (ultima apariție)
\`\`\`

**Bună practică.** Nu abuza de ternary pentru cazuri complicate — ajunge greu de citit. Pentru trei sau mai multe variante folosește \`if/elif/else\` clasic.

### 3.5 Bucla while

\`\`\`python
# Sintaxă corectă (atenție la două puncte la final!):
indx = 0
while indx < 10:                 # NU while indx < 10 fără :
    print(numere[indx])
    if numere[indx] == 6:        # NU numere(indx)
        break
    else:
        indx += 1
\`\`\`

> ⚠️ **Capcană.** Linia \`while x < 10\` necesită \`:\` la sfârșit. Accesarea elementelor folosește paranteze pătrate \`[]\`, nu rotunde \`()\`. Compararea folosește \`==\`, nu \`=\`.

**Bună practică.** Pune mereu un mecanism de oprire (un contor sau \`break\`) ca să eviți buclele infinite. Tasta \`Ctrl+C\` te scoate din terminal dintr-un program blocat.

### 3.6 Bucla for

\`\`\`python
# range(n) generează 0, 1, ..., n-1:
for i in range(5):           # 0, 1, 2, 3, 4
    pass
for i in range(2, 10):       # 2, 3, ..., 9
    pass
for i in range(0, 10, 2):    # 0, 2, 4, 6, 8
    pass

# Iterare pe liste:
for cuvant in lista_cuvinte:
    if litera in cuvant:
        contor += 1

# Nu poți itera direct pe un int!
nr = 123
for c in nr:    # TypeError — int nu e iterabil
    print(c)
# Soluție: for c in str(nr): print(c)

# range(0) e gol, prin urmare loop-ul nu execută nimic:
for i in range(0):
    print(i)    # nicio ieșire
\`\`\`

### 3.7 for-else, break, continue, pass

**Regulă.** În \`for-else\`, blocul \`else\` se execută DOAR dacă bucla NU a fost întreruptă cu \`break\`. Util pentru a verifica dacă o căutare a eșuat.

\`\`\`python
for i in range(5):
    if i == 5:           # niciodată True (range merge 0-4)
        break
    else:
        print(i)
else:
    print("Aici")
# Output: 0 1 2 3 4 Aici
# break NU s-a executat, prin urmare blocul else rulează
\`\`\`

**Diferențele dintre cele trei:**

\`\`\`python
# break    — ieși complet din bucla curentă
# continue — sari peste rest și treci la următoarea iterație
# pass     — nu face nimic, e doar placeholder

for i in range(10):
    if i == 5:
        break        # se oprește când i ajunge la 5
    print(i)         # tipărește 0, 1, 2, 3, 4
\`\`\`

> ⚠️ **Erori de sintaxă comune.** \`for i not in lista:\` nu e valid (\`not in\` se folosește în condiții, nu în declarația \`for\`). \`True = False\` produce \`SyntaxError\` deoarece nu poți atribui valoare la un keyword.

### 3.8 Bucle imbricate și verificare de tip

\`\`\`python
colectie = [10, (20,), {30}, {}, {}, [40, 50]]
contor = 0
for i in range(len(colectie)):
    if   type(colectie[i]) == list:   contor += 1
    elif type(colectie[i]) == tuple:  contor += 2
    elif type(colectie[i]) == set:    contor += 3
    elif type(colectie[i]) == dict:   contor += 4
    else:                             contor += 5
# 10 (else) + (20,) (tuple) + {30} (set) + {} (dict) + {} (dict) + [40,50] (list)
# Astfel: 5 + 2 + 3 + 4 + 4 + 1, prin urmare 19
\`\`\`

\`\`\`python
# Găsire minim într-o listă de liste:
matrice = [[3, 4, 5, 1], [33, 6, 1, 2]]
minim = matrice[0][0]   # devine 3
for sublista in matrice:
    for element in sublista:
        if minim > element:
            minim = element
print(minim)  # devine 1
\`\`\`

### 3.9 List comprehensions (bonus)

Forma compactă de a construi liste — foarte folosită în Python real:

\`\`\`python
patrate = [n * n for n in range(10)]               # [0, 1, 4, 9, ..., 81]
pare = [n for n in range(20) if n % 2 == 0]        # doar pare
matrice = [[i * j for j in range(3)] for i in range(3)]  # tabla înmulțirii 3x3
\`\`\`

**În lumea reală.** Procesarea fișierelor mari, scraping web, analiza de date — toate se rezolvă elegant cu list comprehensions sau cu generatoare (\`(x for x in ...)\`). Pentru date foarte mari, generatoarele economisesc memorie.`,
  },
  {
    slug: `i-o-fisiere`,
    title: `I/O & Fișiere`,
    orderIndex: 4,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## 4. I/O & Fișiere

### 4.1 print() și formatare

\`\`\`python
# Metoda .format():
'{:.2f}'.format(2.71828)         # devine '2.72'
'{:.2f}'.format(125.6)           # devine '125.60'
'{:8.2f}'.format(2.34567)        # devine '    2.35' (8 caractere total, aliniat dreapta)
'{:08.2f}'.format(2.34567)       # devine '00002.35' (umplut cu zerouri)
'{:,.4f}'.format(9876543.21)     # devine '9,876,543.2100'

# Aliniere stil C (cu %):
'%-20s' % nume        # aliniere stânga, lățime 20
'%4.1f' % scor        # aliniere dreapta, 4 caractere total, 1 zecimală

# f-string (modern, recomandat):
f"Salut {nume}, scorul tău: {scor:.2f}"

# .format() cu indecși și nume:
'{0},{1}'.format(produs, vanzari)
'{a}{b}{a}'.format(a='salut', b='lume')
# devine 'salutlumesalut'
\`\`\`

\`\`\`python
# Formatare pentru date și ore:
import datetime
data = datetime.datetime(2024, 9, 15)
'{:%B-%d-%y}'.format(data)   # devine 'September-15-24'
# %B reprezintă numele lunii, %d ziua, %y anul scurt, %Y anul complet
\`\`\`

> ⚠️ **Capcană.** Folosește \`{:.2f}\` pentru \`float\` și \`{:.0f}\` sau \`{:d}\` pentru \`int\`. Confuzia \`{:.2d}\` pe un float aruncă eroare.

### 4.2 Detalii despre formatarea textului

\`\`\`python
# Text pe mai multe linii — folosește triple quotes:
mesaj = '''Mihai
programator
Moldova'''    # corect cu ''' sau """

# Cu un singur tip de ghilimele NU merge pe mai multe linii direct.

# Ghilimele în text — alegi tipul invers la exterior:
text1 = "Atelierul lui Andrei"           # corect
text2 = 'Atelierul lui Andrei'           # SyntaxError, ghilimelele se închid
text3 = 'Atelierul lui Andrei \\'cu drag\\''  # cu escape \\
\`\`\`

\`\`\`python
# Exemplu practic — validarea unui număr de angajat de forma dd-ddd-dddd:
nr_angajat = '23-456-7890'
parti = nr_angajat.split('-')
valid = False
if len(parti) == 3:
    if len(parti[0]) == 2 and len(parti[1]) == 3 and len(parti[2]) == 4:
        if parti[0].isdigit() and parti[1].isdigit() and parti[2].isdigit():
            valid = True
\`\`\`

**În lumea reală.** Pentru validări complexe (email, telefon, IBAN), folosește modulul \`re\` (regex). De exemplu: \`re.fullmatch(r'\\d{2}-\\d{3}-\\d{4}', nr_angajat)\` rezolvă cazul de mai sus într-o singură linie.

### 4.3 Moduri de deschidere a fișierelor

\`\`\`python
'r'   # citire. Aruncă FileNotFoundError dacă fișierul nu există.
'w'   # scriere. Creează fișierul nou; dacă există, îl SUPRASCRIE.
'a'   # append. Adaugă la final. Creează fișierul dacă lipsește.
'r+'  # citire + scriere. Fișierul TREBUIE să existe în prealabil.
'w+'  # citire + scriere. Creează / suprascrie.
'a+'  # citire + append. Creează dacă lipsește.

# Pentru date binare adaugi 'b': 'rb', 'wb', 'r+b', etc.
\`\`\`

**Reguli mnemonice.**
- Pentru a citi și scrie, ștergând conținutul vechi: \`'w+'\`.
- Pentru a doar adăuga la sfârșit fără să pierzi datele existente: \`'a'\`.
- Pentru fișiere binare (imagini, PDF, audio): adaugă \`b\` la modul.

### 4.4 Citirea fișierelor

\`\`\`python
# read() — întreg conținutul ca un singur text
f = open('jurnal.txt', 'r')
continut = f.read()
f.close()

# readline() — o singură linie pe rând
linie = f.readline()

# readlines() — listă cu toate liniile
toate_liniile = f.readlines()

# Cea mai sigură metodă — with statement (închide fișierul automat):
with open('jurnal.txt', 'r') as f:
    continut = f.read()
# La ieșirea din with, f e închis automat, chiar dacă apare o eroare
\`\`\`

\`\`\`python
# Citire linie cu linie cu detectare end-of-file:
sfarsit = False
inventar = open('inventar.txt', 'r')
while not sfarsit:
    linie = inventar.readline()
    if linie != '':                # linia nu e gol-eof
        if linie != "\\n":          # linia nu e doar newline
            print(linie)
    else:
        sfarsit = True
inventar.close()
\`\`\`

**Bună practică.** Forma idiomatică modernă pentru parcurgere linie cu linie este pur și simplu:

\`\`\`python
with open('inventar.txt', 'r', encoding='utf-8') as f:
    for linie in f:
        print(linie.rstrip())
\`\`\`

### 4.5 Scrierea în fișiere și operații compuse

\`\`\`python
# Scriere simplă:
f = open('rezultat.txt', 'w')
f.write('Curs Python complet')
f.close()

# Append urmat de citire — atenție la cursor:
with open('lista_alegatori.txt', 'a+') as f:
    f.write('Alegator nou\\n')
    f.seek(0)               # mută cursorul la început
    continut = f.read()     # acum citește tot
    print(continut)
\`\`\`

\`\`\`python
# Verificare existență fișier înainte de citire:
import os
if os.path.isfile('notebook.txt'):
    f = open('notebook.txt')
    print(f.read())
    f.close()
f = open('notebook.txt', 'a')
f.write("Sfarsit de lista")
\`\`\`

> ⚠️ **Capcană.** \`os.path.isfile()\` nu funcționează fără \`import os\` în prealabil — altfel obții \`NameError\`.

\`\`\`python
# Citire și calcul pe un fișier de date:
# Fișierul medii.txt conține:
# Mihai:10
# Radu:20
# Iulia:30
# Pavel:40

suma = 0
f = open('medii.txt', 'r')
linii = f.readlines()
for linie in linii:
    suma += float(linie.split(':')[1])   # '10' devine 10.0
f.close()
print(suma)  # devine 100.0
\`\`\`

### 4.6 Indentarea contează

> ⚠️ **Greșeală gravă.** Python folosește indentarea pentru a delimita blocurile, prin urmare un spațiu greșit schimbă logica programului.

\`\`\`python
# CORECT — bucla rulează doar dacă fișierul există:
def citeste_fisier(cale):
    linie = None
    if os.path.isfile(cale):
        date = open(cale, 'r')
        while linie != '':
            linie = date.readline()
            print(linie)

# GREȘIT — bucla while e în afara if, prin urmare se execută chiar dacă fișierul lipsește:
def citeste_fisier(cale):
    linie = None
    if os.path.isfile(cale):
        date = open(cale, 'r')
    while linie != '':            # rulează mereu, generează NameError pe date
        linie = date.readline()
        print(linie)
\`\`\`

### 4.7 În lumea reală: lucrul cu CSV și JSON

Pentru date structurate, biblioteca standard oferă module dedicate:

\`\`\`python
import csv, json

# Citire CSV:
with open('clienti.csv', 'r', encoding='utf-8') as f:
    cititor = csv.DictReader(f)
    for rand in cititor:
        print(rand['nume'], rand['email'])

# Scriere JSON:
date = {'oras': 'Chisinau', 'populatie': 635000}
with open('oras.json', 'w', encoding='utf-8') as f:
    json.dump(date, f, ensure_ascii=False, indent=2)
\`\`\`

**Bibliotecă populară.** Pentru fișiere Excel reale (\`.xlsx\`), instalează \`openpyxl\` sau \`pandas\` (\`pip install pandas openpyxl\`). \`pandas\` poate citi un Excel în câteva secunde și produce statistici dintr-o singură linie de cod.

### 4.8 Idiomul \`if __name__ == "__main__"\` (bonus)

Când vrei ca un script să poată fi rulat direct, dar și importat ca modul fără să-și execute codul automat, folosește:

\`\`\`python
def proceseaza(cale):
    with open(cale) as f:
        return f.read().upper()

if __name__ == "__main__":
    rezultat = proceseaza('input.txt')
    print(rezultat)
\`\`\`

Aceasta e convenția standard în orice proiect Python serios.`,
  },
  {
    slug: `functii`,
    title: `Funcții`,
    orderIndex: 5,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## 5. Funcții

### 5.1 Definire și apelare

\`\`\`python
def actualizeaza_scor(curent, val):
    curent += val
    return curent     # returnează valoarea actualizată

# Lipsa lui def produce SyntaxError
# Lipsa parantezelor () produce SyntaxError
# Dacă pui pass în loc de return, funcția returnează None
\`\`\`

**Regulă.** Parametrii cu valori implicite trebuie să fie poziționați DUPĂ cei fără valoare implicită.

\`\`\`python
def aduna(x=0, y=0):
    return x + y

aduna()              # devine 0 (ambele default)
aduna(15)            # devine 15 (x=15, y=0)
aduna('cas', 'a')    # devine 'casa' (concatenare str)
aduna(15, 25)        # devine 40
\`\`\`

\`\`\`python
def inmulteste(x=0, y=0):
    return x * y

inmulteste()              # devine 0
inmulteste('15', '25')    # TypeError — str * str invalid
inmulteste(15)            # devine 0 (15*0)
inmulteste('15')          # devine '' ('15'*0 e text gol)
\`\`\`

**Bună practică.** Nu folosi NICIODATĂ liste sau dicționare ca valori default (\`def f(x=[])\`) — sunt partajate între apeluri și creează bug-uri ascunse. Folosește \`def f(x=None): x = x or []\`.

### 5.2 Scope: local versus global

\`\`\`python
a = 10
b = 20
def schimba():
    global b       # declar explicit b ca global
    a = 45         # a LOCAL, nu modifică globalul
    b = 56         # modifică globalul b
schimba()
print(a)  # devine 10 (globalul a a rămas neschimbat)
print(b)  # devine 56 (globalul b a fost modificat)
\`\`\`

**Regulă.** Fără \`global\`, o variabilă atribuită într-o funcție e locală — modificarea ei nu afectează variabila externă cu același nume.

> ⚠️ **Capcană.** Listele și dicționarele sunt mutable! O metodă precum \`lst.append()\` modifică obiectul original chiar fără declarația \`global\`, deoarece tu nu reasignezi variabila, ci muți conținutul.

**Bună practică.** Evită cât poți \`global\`. Pasează datele ca argumente și returnează rezultatele cu \`return\` — astfel funcțiile devin testabile și predictibile.

### 5.3 Keyword arguments

\`\`\`python
def schimba(i=1, j=2):
    i = i + j
    j = j + 1
    print(i, j)

schimba(j=1, i=2)  # i devine 2+1, prin urmare 3; j devine 1+1, deci 2 — output: "3 2"
# Argumentele numite pot fi date în orice ordine
\`\`\`

**Bună practică.** Folosește argumente numite (\`func(nume='Mihai', varsta=20)\`) când funcția are mulți parametri — codul devine auto-documentat.

### 5.4 Funcții utile (exemple practice)

\`\`\`python
# Inversarea unui text caracter cu caracter:
def inverseaza_nume(invers):
    drept = ''
    for i in range(len(invers) - 1, -1, -1):
        drept += invers[i]
    return drept
# inverseaza_nume("aharob") devine "boraha"

# Forma idiomatică, mult mai scurtă:
def inverseaza(s: str) -> str:
    return s[::-1]
\`\`\`

\`\`\`python
# Împărțire sigură:
def imparte_sigur(numarator, numitor):
    if numarator is None or numitor is None:
        print("Lipseste o valoare obligatorie.")
    elif numitor == 0:
        print("Numitorul este zero.")
    else:
        return numarator / numitor
\`\`\`

\`\`\`python
# Funcție care returnează un tuple:
def gaseste_extreme():
    numere.sort()
    return numere[0], numere[-1]   # (minim, maxim)

minim, maxim = gaseste_extreme()   # unpacking direct

# Sau capturat ca tuple:
rezultat = gaseste_extreme()        # rezultat e tuple
rezultat[0]    # minim
rezultat[-1]   # maxim
\`\`\`

\`\`\`python
# Fibonacci recursiv:
def fib(n):
    if n == 0:   return 0
    elif n == 1: return 1
    else:        return fib(n - 1) + fib(n - 2)

for i in range(7):
    print(fib(i), end=',')
# Output: 0,1,1,2,3,5,8,
\`\`\`

**În lumea reală.** Versiunea recursivă a lui Fibonacci e exponențială — pentru \`n > 30\` devine extrem de lentă. Folosește \`@functools.lru_cache\` pentru memoizare automată sau forma iterativă pentru performanță reală.

\`\`\`python
# Două funcții care se compun:
def ia_nume():
    nume = ['Sorin', 'Bogdan', 'Christian', 'Vladut', 'Petre']
    return nume[2:]   # devine ['Christian', 'Vladut', 'Petre']

def scurteaza_nume(elemente):
    rezultat = []
    for n in elemente:
        rezultat.append(n[:3].upper())
    return rezultat

print(scurteaza_nume(ia_nume()))
# Output: ['CHR', 'VLA', 'PET']
\`\`\`

### 5.5 Argumente *args și **kwargs (bonus)

Pentru funcții care primesc un număr variabil de argumente:

\`\`\`python
def aduna_tot(*numere):
    s = 0
    for n in numere:
        s += n
    return s
aduna_tot(1, 2, 3)        # devine 6
aduna_tot(1, 2, 3, 4, 5)  # devine 15

def afiseaza_setari(**setari):
    for cheie, val in setari.items():
        print(f"{cheie}: {val}")
afiseaza_setari(tema='dark', limba='ro', font_size=14)
\`\`\`

\`*args\` colectează argumentele poziționale într-un tuple, iar \`**kwargs\` colectează argumentele numite într-un dict. Sunt fundamentale pentru scrierea de decoratori și framework-uri.

### 5.6 Documentare și import

**Reguli scurte.**
- \`#\` introduce un comentariu — ignorat de interpretor.
- \`'#Return the value'\` între ghilimele e \`str\`, nu comentariu.
- Comentariile inline funcționează: \`return x ** y  # ridica x la puterea y\`.

\`\`\`python
# Import cu alias — pentru a redenumi un nume importat:
from math import sqrt as radical
radical(25)   # devine 5.0

# Forma INVALIDĂ:
# import math.sqrt as radical   # SyntaxError — dot path nu acceptă alias direct
\`\`\`

**Docstring (bună practică).** Plasează un text descriptiv ca primă linie a funcției:

\`\`\`python
def aria_cerc(raza: float) -> float:
    """Calculeaza aria unui cerc folosind formula pi * r^2."""
    import math
    return math.pi * raza ** 2

help(aria_cerc)   # afișează docstring-ul
\`\`\`

### 5.7 Type hints (în lumea reală)

Pentru proiecte mari, adnotările de tip ajută la lizibilitate și permit verificare automată cu \`mypy\`:

\`\`\`python
from typing import Optional

def cauta_user(id: int, baza: dict) -> Optional[str]:
    return baza.get(id)

def medie(numere: list[float]) -> float:
    return sum(numere) / len(numere) if numere else 0.0
\`\`\`

**Notă.** Type hints sunt opționale — Python le ignoră la rulare. Beneficiul real apare când folosești IDE precum VS Code sau PyCharm, care îți semnalează tipurile greșite înainte de a rula codul.`,
  },
  {
    slug: `error-handling`,
    title: `Error handling`,
    orderIndex: 6,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## 6. Error handling

### 6.1 try / except / else / finally

**Regulă.** \`try\` execută codul riscant. \`except\` prinde erorile apărute. \`else\` rulează doar dacă nu apare eroare. \`finally\` se execută indiferent de ce s-a întâmplat.

\`\`\`python
# Cazul fără eroare:
try:     print('try')        # se execută
except:  print('except')     # NU se execută
else:    print('else')       # se execută
finally: print('finally')    # se execută
# Ordinea afișată: try, else, finally

# Cazul cu eroare:
try:
    print('try')             # se execută
    print(10 / 0)            # generează ZeroDivisionError
except:  print('except')     # se execută
else:    print('else')       # NU se execută (a fost eroare)
finally: print('finally')    # se execută
# Ordinea afișată: try, except, finally
\`\`\`

> ⚠️ **Capcană sintactică.** Blocul \`else\` trebuie să fie DUPĂ \`except\`. Dacă inversezi ordinea, primești \`SyntaxError\`.

**Reguli structurale.**
- Un \`try\` poate avea zero sau mai multe blocuri \`except\`.
- Maxim un singur \`else\` și un singur \`finally\`.
- Combinația \`try\` + \`finally\` (fără \`except\`) e validă — utilă pentru cleanup garantat.

### 6.2 finally domină return

\`\`\`python
def f1():
    try:
        return 1
    finally:
        return 2

print(f1())   # devine 2 — finally suprascrie return-ul din try
\`\`\`

**Bună practică.** Nu pune \`return\` în \`finally\` — codul devine greu de înțeles. Folosește \`finally\` pentru cleanup (închidere fișiere, eliberare resurse), nu pentru a returna valori.

### 6.3 Tipuri de erori frecvente

\`\`\`python
# TypeError — operație pe tipuri incompatibile
'salut' + 5                    # str + int
total += pret                  # dacă pret e str, eșuează la +=
for i in 123:                  # int nu e iterabil

# ValueError — valoare nepotrivită pentru tipul sau funcția respectivă
int('10.8')                    # text cu zecimale, refuzat de int()

# ZeroDivisionError
10 / 0

# NameError — folosești o variabilă nedefinită (Python e case-sensitive!)
print(B * w)                   # dacă B nu e definit

# KeyError — cheie inexistentă în dict
cursuri = {1: 'Java', 2: 'Scala'}
cursuri[4]                     # KeyError: 4

# FileNotFoundError
open('inexistent.txt', 'r')

# AttributeError — metoda sau atributul nu există
f.readall()                    # nu există readall(), e read()

# IndexError — index în afara intervalului unei liste
lst = [1, 2, 3]
lst[5]                         # IndexError

# SyntaxError — Python nu poate parsa codul
True = False                   # nu poți atribui la un keyword
\`\`\`

**Regulă.** \`BaseException\` este clasa rădăcină pentru toate excepțiile. \`Exception\` e părintele tuturor erorilor pe care ar trebui să le prinzi în mod normal — niciodată să nu prinzi direct \`BaseException\`, fiindcă blochezi și \`KeyboardInterrupt\` (Ctrl+C).

### 6.4 Except cu mai multe tipuri

\`\`\`python
# Sintaxa CORECTĂ:
try:
    risc()
except (ZeroDivisionError, ValueError) as e:
    print(e)

# Variante INVALIDE — nu compilează:
# except (ZeroDivisionError, ValueError) from e:    # invalid
# except (ZeroDivisionError | ValueError) as e:     # invalid
# except (ZeroDivisionError, ValueError as e):      # invalid
\`\`\`

\`\`\`python
# Excepție personalizată — TREBUIE să extindă Exception:
class EroarePersonalizata(Exception):
    pass

# Forme INVALIDE:
# class EroarePersonalizata:        # nu moștenește de la Exception
# class EroarePersonalizata():      # același lucru — nu moștenește
\`\`\`

**Bună practică.** Crearea de excepții proprii clarifică codul: în loc de \`raise ValueError("user inactiv")\`, definești \`class UserInactivError(Exception): pass\` și tipul vorbește singur la depanare.

### 6.5 Reparare de erori comune

\`\`\`python
# TypeError la += pe text într-o sumă:
preturi = [30.5, '40.5', 10.5]
total = 0
for p in preturi:
    total += float(p)   # convertim explicit la float
\`\`\`

\`\`\`python
# KeyError la dicționar — verifică înainte de accesare:
cursuri = {1: 'Java', 2: 'Scala', 3: 'Python'}
for i in range(1, 5):
    if i in cursuri:           # protecție explicită
        print(cursuri[i])
# Sau folosește .get() care returnează None pentru chei lipsă:
print(cursuri.get(4, 'inexistent'))   # devine 'inexistent'
\`\`\`

\`\`\`python
# input() returnează str — nu poți aduna direct cu int:
# GREȘIT:
contor = input('Introdu numar: ')
print(contor + 1)        # TypeError

# CORECT:
print(int(contor) + 1)   # convertește înainte de calcul
\`\`\`

### 6.6 assert pentru verificări de invariant

\`\`\`python
x = 30
y = 10
assert x > y, 'x este mai mic decat y'
# x > y e True, prin urmare execuția continuă fără eroare
# Dacă ar fi False, s-ar arunca AssertionError cu mesajul dat
\`\`\`

> ⚠️ **Atenție.** Instrucțiunea \`assert\` poate fi dezactivată cu opțiunea \`python -O\`. Nu o folosi pentru validări critice de securitate; folosește-o doar pentru a verifica invarianți de logică internă.

### 6.7 În lumea reală: logging și raise from

Într-o aplicație reală, în locul lui \`print\` pentru erori folosește modulul standard \`logging\`:

\`\`\`python
import logging
logging.basicConfig(level=logging.INFO)

def proceseaza(cale):
    try:
        with open(cale) as f:
            return f.read()
    except FileNotFoundError as e:
        logging.error("Fisierul %s lipseste: %s", cale, e)
        raise   # propagă mai departe, păstrând stack trace
\`\`\`

**Re-raise cu context.** Pentru a îmbrăca o eroare în alta fără să pierzi originalul:

\`\`\`python
try:
    proceseaza('date.txt')
except FileNotFoundError as orig:
    raise RuntimeError("Configurare invalida") from orig
\`\`\`

Astfel, în mesajul de eroare apare \`The above exception was the direct cause of the following exception\`, ceea ce ajută enorm la depanare.

### 6.8 Bună practică: prinde excepții specifice

\`\`\`python
# RĂU — prinde absolut tot, inclusiv KeyboardInterrupt și SystemExit:
try:
    risc()
except:
    pass

# MAI BINE — prinzi cele așteptate:
try:
    risc()
except (ValueError, TypeError) as e:
    logging.warning("Eroare procesare: %s", e)
\`\`\`

Regula de aur: **prinde doar excepțiile pe care le poți gestiona efectiv**. Restul lasă-le să propage, ca să nu maschezi bug-uri reale.`,
  },
  {
    slug: `module`,
    title: `Module`,
    orderIndex: 7,
    durationMinutes: 12,
    isPreview: false,
    markdown: `## 7. Module

### 7.1 math

\`\`\`python
import math

math.pi              # devine 3.14159...
math.e               # devine 2.71828... (constanta lui Euler)
math.ceil(10.4)      # devine 11 (rotunjire în sus)
math.floor(10.9)     # devine 10 (rotunjire în jos)
math.fabs(-7)        # devine 7.0 (valoare absolută, mereu float)
math.sqrt(36)        # devine 6.0
math.pow(3, 4)       # devine 81.0
math.factorial(6)    # devine 720
math.log(100, 10)    # devine 2.0 (logaritm în baza 10)
math.gcd(24, 36)     # devine 12 (cel mai mare divizor comun)
\`\`\`

> ⚠️ **Capcană la import.** Diferența între cele două forme:

\`\`\`python
import math
math.factorial(5)         # CORECT — accesezi prin namespace

from math import factorial
factorial(5)              # CORECT — direct, fără prefix
math.factorial(5)         # GREȘIT — math nu e importat ca obiect
\`\`\`

\`\`\`python
# Aria unui cerc:
def aria_cerc(raza):
    return math.pi * math.pow(raza, 2)   # pi * raza la patrat
\`\`\`

\`\`\`python
# List comprehension cu math:
lista = [str(round(math.pi)) for i in range(1, 6)]
# math.pi devine 3.14159..., round(...) devine 3, str(3) devine '3'
# range(1, 6) produce 5 iterații, prin urmare obținem ['3', '3', '3', '3', '3']
\`\`\`

**În lumea reală.** Pentru calcule științifice serioase (matrice, statistici, trigonometrie pe vectori), \`math\` nu mai e suficient. Instalezi \`numpy\` (\`pip install numpy\`) și beneficiezi de operații vectorizate de zeci de ori mai rapide.

### 7.2 random

\`\`\`python
import random

random.random()              # float în intervalul [0.0, 1.0)
random.randint(5, 11)        # int în [5, 11] INCLUSIV ambele capete
random.randrange(5, 12)      # int în [5, 12) — EXCLUSIV 12
random.randrange(5, 101, 5)  # multiplu de 5 între 5 și 100

# Selecție din liste:
fructe = ['mar', 'para', 'banana', 'mango', 'kiwi']
random.choice(fructe)        # un element ales aleator
random.sample(fructe, 3)     # 3 elemente UNICE din listă
random.shuffle(fructe)       # amestecă lista pe loc (in-place)

# Calcule auxiliare:
# random.random() * 5 produce float în [0.0, 5.0)
# int(random.random() * 5) produce int din mulțimea {0, 1, 2, 3, 4}

# 7 numere aleatoare între 1 și 7:
sapte = [random.randint(1, 7) for _ in range(7)]

# Multiplu de 5 între 5 și 100 — două variante echivalente:
random.randrange(5, 101, 5)
random.randint(1, 20) * 5
\`\`\`

> ⚠️ **Diferențe esențiale.** \`randint(5, 11)\` include 11; \`randrange(5, 12)\` exclude 12. Ambele variante generează valori în intervalul 5-11.

\`\`\`python
# sample returnează o LISTĂ de elemente unice:
random.sample(range(10), 7)
# 7 numere distincte din {0, 1, ..., 9}
\`\`\`

**Bună practică.** Pentru aplicații care țin de securitate (parole, token-uri), folosește modulul \`secrets\` în loc de \`random\` — e mai rezistent la atacuri criptografice.

\`\`\`python
import secrets
parola = secrets.token_urlsafe(16)   # token sigur de 16 octeți
\`\`\`

### 7.3 datetime

\`\`\`python
import datetime

azi = datetime.date.today()
azi.month    # devine luna curentă, ex. 9 (NU azi.month() — nu e funcție!)
azi.year     # devine anul curent
azi.day      # devine ziua

acum = datetime.datetime.now()
acum.hour, acum.minute, acum.second

# Diferențe de timp:
o_zi = datetime.timedelta(days=1)
maine = azi + o_zi
ieri = azi - o_zi

# Formatare cu strftime:
# %B reprezintă numele lunii (September)
# %d ziua cu două cifre (07)
# %y anul scurt (24)
# %Y anul complet (2024)
# %H oră 24h, %M minute, %S secunde
azi.strftime('%d-%B-%Y')   # de ex. '15-September-2024'
\`\`\`

**În lumea reală.** Pentru lucrul cu fusuri orare, biblioteca standard oferă \`zoneinfo\` (Python 3.9+). Pentru parse-uri complicate de date, \`pip install python-dateutil\` îți rezolvă cazurile gen „14 Mar 2024 at 10pm".

### 7.4 sys

\`\`\`python
from sys import argv

# Lansare: py program.py CHISINAU
argv[0]   # devine 'program.py' (numele scriptului)
argv[1]   # devine 'CHISINAU' (primul argument)

# Atenție — toate elementele sunt str!
# Lansare: py calcul.py 10 20
argv[1] + argv[2]              # devine '1020' (concatenare str, NU 30)
int(argv[1]) + int(argv[2])    # devine 30 (conversie explicită)
\`\`\`

\`\`\`python
# Calcul medie din argumente: py program.py Mihai 10 20 30
suma = 0
for i in range(2, len(argv)):
    suma += float(argv[i])
medie = suma / (len(argv) - 2)
'{:.2f}'.format(medie)   # devine '20.00'
\`\`\`

**În lumea reală.** Pentru CLI-uri serioase nu folosești \`argv\` direct — modulul standard \`argparse\` îți generează automat documentație, validări și mesaje de eroare:

\`\`\`python
import argparse
parser = argparse.ArgumentParser(description='Calculator de medie')
parser.add_argument('numere', nargs='+', type=float)
parser.add_argument('--rotunjit', type=int, default=2)
args = parser.parse_args()
print(round(sum(args.numere) / len(args.numere), args.rotunjit))
\`\`\`

### 7.5 os

\`\`\`python
import os

os.path.isfile('test.txt')   # True dacă fișierul există
os.path.isdir('foldere')     # True dacă e director
os.path.exists('cale')       # True pentru fișier sau director
os.getcwd()                  # directorul curent de lucru
os.listdir('.')              # lista de fișiere și directoare din '.'
os.remove('temp.txt')        # șterge un fișier
os.rename('vechi.txt', 'nou.txt')

# Variabile de mediu:
os.environ.get('HOME')       # citește o variabilă (cu fallback la None)
os.environ['DEBUG'] = '1'    # setează o variabilă în procesul curent
\`\`\`

> ⚠️ **Capcană.** Trebuie să faci \`import os\` ÎNAINTE să folosești \`os.path.isfile()\`, altfel obții \`NameError\`.

**Bună practică modernă.** Pentru manipularea căilor folosește \`pathlib\` (introdus în Python 3.4):

\`\`\`python
from pathlib import Path

cale = Path('proiect') / 'date' / 'fisier.txt'
if cale.exists():
    continut = cale.read_text(encoding='utf-8')

for fisier in Path('.').glob('*.py'):
    print(fisier.name)
\`\`\`

\`pathlib\` e mai citibil, mai sigur cross-platform (Windows / Linux) și înlocuiește în mare parte \`os.path\`.

### 7.6 Ecosistemul Python: pip și virtualenv (în lumea reală)

Modulele de mai sus fac parte din biblioteca standard, prin urmare sunt instalate automat. Pentru pachete externe folosești \`pip\`:

\`\`\`bash
pip install requests          # client HTTP modern
pip install pandas            # analiză de date tabelare
pip install matplotlib        # grafice și diagrame
pip install beautifulsoup4    # scraping HTML
\`\`\`

**Mediu virtual (virtualenv).** Ca să eviți coliziuni între versiuni de pachete în proiecte diferite, creezi un mediu izolat:

\`\`\`bash
python -m venv .venv
source .venv/bin/activate     # Linux / macOS
.venv\\Scripts\\activate         # Windows
pip install -r requirements.txt
\`\`\`

**Exemplu complet — descărcare unei pagini web:**

\`\`\`python
import requests

raspuns = requests.get('https://api.github.com/users/torvalds')
if raspuns.status_code == 200:
    date = raspuns.json()
    print(date['name'], '-', date['public_repos'], 'repos')
\`\`\`

**Biblioteci esențiale de știut.**
- \`requests\` pentru HTTP (web API-uri)
- \`pandas\` pentru analiză de date
- \`matplotlib\` și \`seaborn\` pentru vizualizare
- \`numpy\` pentru calcule numerice rapide
- \`flask\` și \`fastapi\` pentru servere web
- \`pytest\` pentru testare automată
- \`sqlalchemy\` pentru interacțiunea cu baze de date

Aceste pachete formează nucleul ecosistemului Python modern și deschid drumul către orice domeniu — web, știința datelor, automatizare, AI.`,
  },
];
