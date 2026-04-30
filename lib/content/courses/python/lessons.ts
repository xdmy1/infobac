// AUTO-GENERATED from scripts/generate-lessons.mjs — do not edit by hand.
// Re-run `node scripts/generate-lessons.mjs` after editing source content.

import type { Lesson } from "../types";

export const lessons: readonly Lesson[] = [
  {
    slug: `tipuri-de-date`,
    title: `Tipuri de date`,
    orderIndex: 1,
    durationMinutes: 10,
    isPreview: true,
    markdown: `## 1. Tipuri de date

### 1.1 Tipurile de bază

**Regulă.** Python are 5 tipuri principale: int, float, str, bool, complex

\`\`\`python
age = 0          # int
weight = 62.4    # float
name = 'Durga'   # str
minor = False    # bool
z = 10+20j       # complex
\`\`\`

**Regulă.** Python NU are tip 'char' sau 'double' — string de un caracter e tot str, iar numerele zecimale sunt float

> ⚠️ **Capcană.** Capcană: +23E4 este float (notație științifică), NU str

> ⚠️ **Capcană.** Capcană: '880098' (cu ghilimele) este str, chiar dacă arată ca număr

\`\`\`python
type(+1E10)    # float (notație științifică)
type(5.0)      # float
type("True")   # str (are ghilimele!)
type(False)    # bool
type(2**2**2)  # int (16)
\`\`\`

### 1.2 input() și eval()

**Regulă.** input() returnează MEREU str, indiferent ce tastezi

\`\`\`python
x = input("Enter: ")  # mereu str
# Dacă tastezi 10 → x = '10' (str)
# Dacă tastezi 10.0 → x = '10.0' (str)
\`\`\`

**Regulă.** eval() evaluează string-ul ca expresie Python

\`\`\`python
eval('10')     # int 10
eval('10.0')   # float 10.0
eval('10+20')  # int 30
\`\`\`

**Regulă.** Pentru conversie explicită: int(), float(), str(), bool()

\`\`\`python
int('10')      # 10
float('10')    # 10.0
int('10.8')    # ERROR! int() nu acceptă str cu punct
float('10.8')  # 10.8 — funcționează
\`\`\`

> ⚠️ **Capcană.** Capcană la examen: int('10.8') aruncă ValueError!

### 1.3 bool() — ce e True și ce e False

**Regulă.** Valorile Falsy: 0, 0.0, '', [], (), {}, set(), range(0), None, False

**Regulă.** ORICE altceva e Truthy, inclusiv [False], (0,), ' ' (spațiu)

\`\`\`python
bool([False])  # True! (lista NU e goală)
bool('')       # False (str gol)
bool(' ')      # True! (conține spațiu)
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

> ⚠️ **Capcană.** Capcană: bool([False]) = True, bool('') = False, bool(' ') = True

### 1.4 Bool în calcule

**Regulă.** True = 1 și False = 0 în operații aritmetice

\`\`\`python
True + 5        # 6
False + 5       # 5
True + True     # 2
5 + False       # 5 (nu False!)

# Exemplu complex:
bool(1) + float(10)/float(2)
# = True + 5.0 = 1 + 5.0 = 6.0
str(6.0)  # '6.0'

# Alt exemplu:
False+5-True+35//4
# = 0+5-1+8 = 12
\`\`\`

**Regulă.** Operatori logici pe valori:

\`\`\`python
10==10 and 20!=20  # True and False → False
10==10 or 20!=20   # True or False → True
not 10==10         # not True → False
not 0              # True
not 10             # False
not ''             # True
not 'durga'        # False
not None           # True
\`\`\`

### 1.5 Operații cu string-uri

**Regulă.** str + str = concatenare, str * int = repetiție

\`\`\`python
'5' + '2'    # '52' (concatenare)
'5' * 2      # '55' (repetiție)
# '5' - '2'  # ERROR! nu se poate scădere pe str
# '5' * '2'  # ERROR! str * str invalid
\`\`\`

**Regulă.** str + int sau str - str → TypeError

> ⚠️ **Capcană.** Capcană: a='5', b='2' → a+b='52' (str), a*2='55' (str), a-b=Error, a*b=Error

**Regulă.** 456 + 456.0 = 912.0 (float, NU int!). Când amesteci int cu float, rezultatul e float

### 1.6 String indexing

\`\`\`python
s = 'BANANA'
# Index:  0  1  2  3  4  5
# Neg:   -6 -5 -4 -3 -2 -1

s[0]   # 'B'
s[1]   # 'A'
s[-1]  # 'A'
s[3]   # 'A'

# Pentru 'AA':
s[1]+s[3]  # 'A'+'A' = 'AA' ✓
s[1]+s[5]  # 'A'+'A' = 'AA' ✓
s[3]+s[5]  # 'A'+'A' = 'AA' ✓

# 'TEXT'
x = 'TEXT'
x[0]+x[-1]  # 'T'+'T' = 'TT'
x[0]+x[2]   # 'T'+'X' ≠ 'TT'
\`\`\`

**Regulă.** Nested list indexing: names[-1][-1] = ultimul caracter din ultimul element

\`\`\`python
names = ['itvedant','Thane','Andheri','Navi Mumbai']
names[-1]      # 'Navi Mumbai'
names[-1][-1]  # 'i'
\`\`\`

### 1.7 Slicing

**Regulă.** Sintaxă: seq[start:stop:step] — start inclus, stop exclus

\`\`\`python
alph = "abcdefghijklnnopqrstuvwxyz"

alph[3:15]      # 'defghijklnno' (index 3 la 14)
alph[3:15:3]    # 'dgjn' (cu pas 3)
alph[3:15:-3]   # '' (pas negativ dar start<stop = gol!)
alph[15:3:-3]   # 'pmjg' (de la 15 înapoi cu pas 3)
alph[::-3]      # 'zwtqnkheb' (tot string-ul invers cu pas 3)
alph[15:3]      # '' (fără pas negativ, start>stop = gol)
\`\`\`

> ⚠️ **Capcană.** Capcană: dacă pas e negativ și start < stop → string GOL ''

**Regulă.** Slicing pe liste:

\`\`\`python
# 200 culori, fiecare a doua începând cu a doua:
colors[1::2]     # start=1, step=2

# 200 angajați, ultimii 5 sunt management:
employees[:-5]   # sau employees[0:-5] — exclude ultimii 5
employees[-5:]   # doar ultimii 5

# 500 angajați, ultimii 3 sunt management:
employees[-3:]   # [497:] sau [-3:] sau [497:500]
\`\`\`

### 1.8 Liste — operații

\`\`\`python
list_1 = [1, 2]
list_2 = [3, 4]
list_3 = list_1 + list_2  # [1, 2, 3, 4]
list_4 = list_3 * 3       # [1,2,3,4,1,2,3,4,1,2,3,4]
# NU multiplică valorile! Repetă lista.
\`\`\`

**Regulă.** list(string) transformă fiecare caracter în element

\`\`\`python
s = 'AB CD'
lst = list(s)        # ['A','B',' ','C','D']
lst.append('EF')     # ['A','B',' ','C','D','EF']
# append adaugă ca un singur element, nu caracter cu caracter
\`\`\`

> ⚠️ **Capcană.** Capcană: for loop care modifică lista pe care iterează → MemoryError sau infinite loop

\`\`\`python
a = ['a','b','c','d']
for i in a:
    a.append(i.upper())  # MemoryError! lista crește infinit
\`\`\`

**Regulă.** Accesare element din listă:

\`\`\`python
lst = ['Apple', 'Banana', 'Carrot', 'Mango']
lst[3]   # 'Mango' ✓
lst[-1]  # 'Mango' ✓
lst[4]   # IndexError! (doar 0-3)
\`\`\`

### 1.9 is vs == (identitate vs egalitate)

**Regulă.** == compară VALORILE, is compară IDENTITATEA (același obiect în memorie)

\`\`\`python
n1 = [10,20,30]
n2 = [10,20,30]
print(n1 == n2)   # True (aceleași valori)
print(n1 is n2)   # False (obiecte diferite)

n1 = n2           # acum pointează la același obiect
print(n1 == n2)   # True
print(n1 is n2)   # True

# Slice creează copie nouă:
lst = [7, 8, 9]
b = lst[:]
print(b == lst)   # True
print(b is lst)   # False (copie nouă)
\`\`\`

**Regulă.** is not și != sunt opusele lor

\`\`\`python
l1 = ['a','b']
l2 = ['a','b']
print(l1 is not l2)  # True (obiecte diferite)
print(l1 != l2)      # False (valori egale)
l1 = l2
print(l1 is not l2)  # False
print(l1 != l2)      # False
\`\`\`

### 1.10 type() și isinstance()

\`\`\`python
type(True)    # <class 'bool'>
type(1.0)     # <class 'float'>
type(1)       # <class 'int'>
type('True')  # <class 'str'>

t = ([10,20], 10, False)
type(t)       # <class 'tuple'>
type(t[0])    # <class 'list'>
type(t[1])    # <class 'int'>
type(t[0:])   # <class 'tuple'> (slicing pe tuple dă tuple)
\`\`\`

**Regulă.** id() returnează int (adresa în memorie)

**Regulă.** lambda: f=lambda x: bool(x%2) → f(20)=False, f(21)=True`,
  },
  {
    slug: `operatori-precedenta`,
    title: `Operatori & Precedență`,
    orderIndex: 2,
    durationMinutes: 10,
    isPreview: true,
    markdown: `## 2. Operatori & Precedență

### 2.1 Operatori aritmetici

\`\`\`python
a = 11, b = 4

a / b    # 2.75 — MEREU float!
a // b   # 2 — floor division (rotunjire în jos)
a % b    # 3 — modulo (restul)
a ** b   # 14641 — exponențiere

# Alte exemple:
15 / 5   # 3.0 (mereu float!)
21 / 6   # 3.5
21 // 6  # 3
21 % 6   # 3
\`\`\`

> ⚠️ **Capcană.** / returnează MEREU float, chiar și 15/5 = 3.0

**Regulă.** Floor division cu float: 8//6 = 1 (int), 8.0//6 = 1.0 (float)

### 2.2 Ordinea de precedență

**Regulă.** De la cel mai prioritar la cel mai puțin:

\`\`\`python
1. ()        Paranteze
2. **       Exponențiere (dreapta→stânga!)
3. +x, -x, not   Unar
4. *, /, //, %    Multiplicare & co.
5. +, -      Adunare, scădere
6. and       Logic AND
7. or        Logic OR
\`\`\`

**Regulă.** Operatorii cu aceeași precedență: stânga→dreapta (EXCEPȚIE: ** e dreapta→stânga)

\`\`\`python
# Exemplu: 2**3**2 = 2**(3**2) = 2**9 = 512

# Exercițiu clasic:
8//6%5+2**3-2
= 1 % 5 + 8 - 2    # // și % au aceeași prec, stânga→dreapta
= 1 + 8 - 2
= 7  # WAIT, let me recheck
# 8//6 = 1, 1%5 = 1, 2**3 = 8
# 1 + 8 - 2 = 7? No...

# Actually: 8//6%5 + 2**3 - 2
# = (8//6)%5 + (2**3) - 2
# = 1%5 + 8 - 2 = 1+8-2 = 7

# Dar 6//4%5+2**3-2//3:
# (6//4)%5 + (2**3) - (2//3)
# = 1%5 + 8 - 0 = 1+8-0 = 9
\`\`\`

**Regulă.** Formula: a+b*c-d = a+(b*c)-d. Stânga→dreapta pt + și -

\`\`\`python
# result = a-b*c+d
# = a - (b*c) + d  (echivalent cu a-(b*c)+d)
# Întâi b*c, apoi scădere, apoi adunare (stânga→dreapta)
\`\`\`

### 2.3 Assignment operators

\`\`\`python
x = 3
x += 1    # x = 4
x *= 2    # x = 8
x **= 2   # x = 64
x -= 2    # x = 62
x //= 3   # x = 20
x %= 7    # x = 6
\`\`\`

**Regulă.** Exercițiu tipic:

\`\`\`python
a = 3
b = 5
a += 2**3      # a = 3+8 = 11
a -= b//2//3   # b//2=2, 2//3=0 → a = 11-0 = 11
\`\`\`

\`\`\`python
x = 2
y = 6
x += 2**3      # x = 2+8 = 10
x //= y//2//3  # y//2=3, 3//3=1 → x = 10//1 = 10
\`\`\`

### 2.4 in și not in

\`\`\`python
'r' in 'durga'           # True
'is' in 'This IS a Fake News'  # False! ('is' ≠ 'IS')
5 in [0,1,2,3,4]         # False (5 nu e în listă)

numbers = [10,20,30,40]
30 in numbers    # True
50 in numbers    # False
50 not in numbers # True
\`\`\`

### 2.5 or și and pe valori

**Regulă.** or returnează prima valoare truthy (sau ultima dacă toate falsy)

**Regulă.** and returnează prima valoare falsy (sau ultima dacă toate truthy)

\`\`\`python
0 or 5       # 5 (0 e falsy, returnează 5)
5 or 0       # 5
0 or 0       # 0 (ambele falsy, returnează ultima)
1 and 5      # 5 (ambele truthy, returnează ultima)
0 and 5      # 0 (0 e falsy, returnează 0)

# bool(0) = False
# None is None = True
# -5 < 0 < 5 = True (chained comparison)
\`\`\`

### 2.6 Expresie complexă X = 2+9*((3*12)-8)/10

\`\`\`python
X = 2 + 9*((3*12)-8) / 10
# Pas 1: 3*12 = 36
# Pas 2: 36-8 = 28
# Pas 3: 9*28 = 252
# Pas 4: 252/10 = 25.2
# Pas 5: 2+25.2 = 27.2
\`\`\`

\`\`\`python
# (3*(1+2)**2 - (2**2)*3)
# = 3 * 3**2 - 4*3
# = 3*9 - 12 = 27-12 = 15

# (2*(3+4)**2-(3**3)*3)
# = 2*49 - 27*3 = 98-81 = 17
\`\`\`

### 2.7 Expresia b = (-a)**2

**Regulă.** 'a multiplicat cu -1, apoi ridicat la puterea a doua' = (-a)**2

> ⚠️ **Capcană.** NU -(a)**2 (asta e negarea DUPĂ exponențiere)

> ⚠️ **Capcană.** NU (a)**-2 (asta e 1/a²)

\`\`\`python
a = 5
b = (-a)**2   # (-5)**2 = 25 ✓
b = -(a)**2   # -(25) = -25 ✗
b = (a)**-2   # 1/25 = 0.04 ✗
\`\`\``,
  },
  {
    slug: `flow-control`,
    title: `Flow control`,
    orderIndex: 3,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## 3. Flow control

### 3.1 if / elif / else

**Regulă.** if verifică o condiție. elif verifică dacă precedentele au fost False. else prinde restul.

> ⚠️ **Capcană.** GREȘEALĂ CLASICĂ: serie de if-uri (fiecare se evaluează independent) vs if-elif (doar primul match)

\`\`\`python
# GREȘIT (toate if-urile se evaluează):
if marks >= 90: grade = 'A'
if marks >= 80: grade = 'B'    # suprascrie A!
if marks >= 70: grade = 'C'    # suprascrie B!

# CORECT (se oprește la primul match):
if marks >= 90:   grade = 'A'
elif marks >= 80: grade = 'B'
elif marks >= 70: grade = 'C'
else:             grade = 'F'
\`\`\`

**Regulă.** Chained comparison: if 80 <= marks <= 100: grade='A'

> ⚠️ **Capcană.** = e assignment, == e comparație. if num2 = num1: → SyntaxError!

### 3.2 Condiții compuse

\`\`\`python
# not (minor or senior) — True doar dacă AMBII sunt False
# not (minor and senior) — True dacă CEL PUȚIN UNUL e False

# Discount pentru minori SAU seniori:
if not (minor or senior):  # nici minor nici senior
    discount = 0           # nu primește discount
\`\`\`

**Regulă.** Condiții nested:

\`\`\`python
# Comision bazat pe sumă colectată:
collected = 3000
commission = 0
if collected <= 2000:
    commission = 50
elif collected > 2500 and collected < 3000:
    commission = 100
elif collected > 2500:       # 3000 intră aici
    commission = 150
if collected >= 3000:        # if separat! se evaluează și el
    commission += 200
# commission = 150 + 200 = 350
\`\`\`

> ⚠️ **Capcană.** Un if separat (nu elif) se evaluează independent!

### 3.3 Nested if & aplicații practice

\`\`\`python
# Rating system:
def get_rating(age):
    if age >= 18:       rating = "A"
    elif age >= 13:     rating = "T"
    else:               rating = "C"
    return rating
# age=None → else → "C" (unknown = "C") ✓
# age=18 → "A", age=13 → "T", age=12 → "C"
\`\`\`

\`\`\`python
# safe_root function:
def safe_root(a, b):
    if a >= 0:              # non-negative
        answer = a**(1/b)
    else:                   # negative
        if a % 2 == 0:      # even
            answer = "Result is an imaginary number"
        else:               # odd
            answer = -(-a)**(1/b)
    return answer
\`\`\`

\`\`\`python
# DVD rental:
if ontime == "n":            # returned late
    days_rented += 1
if day_rented == "Sunday":   # 30% off
    total = (days_rented * cost_per_day) * .7
elif day_rented == "Thursday":  # 50% off
    total = (days_rented * cost_per_day) * .5
else:
    total = days_rented * cost_per_day
\`\`\`

### 3.4 Ternary (conditional expression)

\`\`\`python
# valoare_dacă_true if condiție else valoare_dacă_false
result = 3 if None else a/b
# None e falsy → result = a/b

result = s.find('not') if s else None
# s e non-empty → execută s.find('not')

# s = 'He shall not be happy if he does not work'
# s.find('not') = 9 (prima apariție)
# s.rfind('not') = 30 (ultima apariție)
\`\`\`

### 3.5 while loop

\`\`\`python
# Sintaxă corectă (: la final!):
while (index < 10):     # NU while (index < 10)
    print(numbers[index])
    if numbers[index] == 6:  # NU numbers(index) = 6
        break
    else:
        index += 1
\`\`\`

> ⚠️ **Capcană.** while (x < 10) trebuie cu : la final. numbers[index] cu [], nu (). == nu =

### 3.6 for loop

\`\`\`python
# range(n): 0 la n-1
for i in range(5):     # 0,1,2,3,4
for i in range(2, 10): # 2,3,...,9
for i in range(0, 10, 2): # 0,2,4,6,8

# Iterare pe liste:
for word in word_list:
    if letter in word:
        count += 1

# NU poți itera pe int!
x = 123
for i in x:     # TypeError!
    print(i)

# range(0) = gol, nu printează nimic
for i in range(0):
    print(i)    # nicio ieșire
\`\`\`

### 3.7 for-else, break, continue, pass

**Regulă.** for-else: blocul else se execută DOAR dacă loop-ul NU a fost întrerupt cu break

\`\`\`python
for i in range(5):
    if i == 5:      # niciodată True (range e 0-4)
        break
    else:
        print(i)
else:
    print("Here")
# Output: 0 1 2 3 4 Here
# (break nu s-a executat → else se execută)
\`\`\`

\`\`\`python
# break = ieși din loop complet
# continue = sari la următoarea iterație
# pass = nu face nimic (placeholder)

for i in range(10):
    if i == 5:
        break       # se oprește la 5
    print(i)        # 0,1,2,3,4
\`\`\`

> ⚠️ **Capcană.** 'for i not in a:' → SyntaxError! 'not in' nu e valid în for

> ⚠️ **Capcană.** True = False → SyntaxError! Nu poți asigna la keyword

### 3.8 Nested loops & type checking

\`\`\`python
l = [10, (20,), {30}, {}, {}, [40,50]]
count = 0
for i in range(len(l)):
    if type(l[i]) == list:     count += 1   # [40,50]
    elif type(l[i]) == tuple:  count += 2   # (20,)
    elif type(l[i]) == set:    count += 3   # {30}
    elif type(l[i]) == dict:   count += 4   # {}, {} (×2)
    else:                      count += 5   # 10
# count = 5+2+3+4+4+1 = 19
\`\`\`

\`\`\`python
# Nested list minimum:
values = [[3,4,5,1],[33,6,1,2]]
v = values[0][0]  # 3
for lst in values:
    for element in lst:
        if v > element:
            v = element
print(v)  # 1
\`\`\``,
  },
  {
    slug: `i-o-fisiere`,
    title: `I/O & Fișiere`,
    orderIndex: 4,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## 4. I/O & Fișiere

### 4.1 print() și formatare

\`\`\`python
# .format() method:
'{:.2f}'.format(3.14159)        # '3.14'
'{:.2f}'.format(123.4)          # '123.40'
'{:8.2f}'.format(1.45678)       # '    1.46' (8 caractere total)
'{:08.2f}'.format(1.45678)      # '00001.46' (padded cu 0)
'{:,.4f}'.format(1234567.89)    # '1,234,567.8900'

# Aliniere:
'%-20s' % name      # left-align, 20 caractere
'%4.1f' % score     # right-align, 4 total, 1 decimal

# f-string:
f"Hello {name}, score: {score:.2f}"

# .format cu index:
'{0},{1}'.format(item, sales)
'{a}{b}{a}'.format(a='hello', b='world')
# → 'helloworldhello'
\`\`\`

\`\`\`python
# Datetime formatting:
import datetime
d = datetime.datetime(2017, 4, 7)
'{:%B-%d-%y}'.format(d)  # 'April-07-17'
# %B = luna full, %d = ziua, %y = anul scurt
\`\`\`

> ⚠️ **Capcană.** format(average, '.2f') nu '.2d' — d e pentru int, f pentru float

### 4.2 String formatting detalii

\`\`\`python
# String pe mai multe linii:
s1 = '''durga
software
solutions'''    # ✓ triple quotes

# NU merge cu simple/double quotes pe mai multe linii

# Ghilimele în string:
s = "Durga Sir's Python Classes"  # ✓ double outside
s = 'Durga Sir\'s Python Classes'  # ✓ cu escape
\`\`\`

\`\`\`python
# Validare employee number (dd-ddd-dddd):
parts = employee_number.split('-')
if len(parts) == 3:
    if len(parts[0])==2 and len(parts[1])==3 and len(parts[2])==4:
        if parts[0].isdigit() and parts[1].isdigit() and parts[2].isdigit():
            valid = True
\`\`\`

### 4.3 Moduri de deschidere fișiere

\`\`\`python
'r'   # read only. Error dacă nu există.
'w'   # write only. Creează/suprascrie.
'a'   # append. Creează dacă nu există.
'r+'  # read+write. Fișierul TREBUIE să existe.
'w+'  # read+write. Creează/suprascrie.
'a+'  # read+append. Creează dacă nu există.
\`\`\`

**Regulă.** Când vrei read+write + creare + suprascriere → 'w+'

**Regulă.** Când vrei append → 'a'

### 4.4 Citire fișiere

\`\`\`python
# read() — tot conținutul ca string
f = open('file.txt', 'r')
data = f.read()
f.close()

# readline() — o singură linie
line = f.readline()

# readlines() — lista de linii
lines = f.readlines()

# with statement (auto-close):
with open('file.txt', 'r') as f:
    data = f.read()
# f se închide automat
\`\`\`

\`\`\`python
# Citire linie cu linie:
eof = False
while eof == False:
    line = inventory.readline()
    if line != '':          # linia nu e goală
        if line != "\n":    # linia nu e doar newline
            print(line)
    else:
        eof = True
inventory.close()
\`\`\`

### 4.5 Scriere și operații cu fișiere

\`\`\`python
# Scriere:
f = open('abc.txt', 'w')
f.write('Python Certification')
f.close()

# Append + read:
with open('voters_list.txt', 'a+') as f:
    f.write('New voters info')
    f.seek(0)        # mută cursorul la început!
    data = f.read()  # acum citește tot
    print(data)
\`\`\`

\`\`\`python
# Verificare existență + citire/creare:
import os
if os.path.isfile('myFile.txt'):
    file = open('myFile.txt')
    print(file.read())
    file.close()
file = open('myFile.txt', 'a')
file.write("End of listing")
\`\`\`

> ⚠️ **Capcană.** os.path.isfile() necesită import os! Fără import → NameError

\`\`\`python
# Citire și procesare date din fișier:
# abc.txt conține: Durga:10\nRavi:20\nShiva:30\nPavan:40
values = 0
f = open('abc.txt', 'r')
content = f.readlines()
for line in content:
    values += float(line.split(':')[1])  # '10' → 10.0
f.close()
print(values)  # 100.0
\`\`\`

### 4.6 Indentare în funcții cu fișiere

> ⚠️ **Capcană.** Indentarea e critică! Codul din blocul if trebuie indentat corect:

\`\`\`python
# CORECT:
def read_file(file):
    line = None
    if os.path.isfile(file):
        data = open(file, 'r')
        while line != '':
            line = data.readline()
            print(line)

# GREȘIT (while e în afara if):
def read_file(file):
    line = None
    if os.path.isfile(file):
        data = open(file, 'r')
    while line != '':          # rulează chiar dacă fișierul nu există!
        line = data.readline()
        print(line)
\`\`\``,
  },
  {
    slug: `functii`,
    title: `Funcții`,
    orderIndex: 5,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## 5. Funcții

### 5.1 Definire și apelare

\`\`\`python
def update_score(current, value):
    current += value
    return current     # returnează valoarea

# Fără def → SyntaxError
# Fără () → SyntaxError
# pass în loc de return → funcția returnează None
\`\`\`

**Regulă.** Parametri cu valori default trebuie să fie DUPĂ cei fără default

\`\`\`python
def f1(x=0, y=0):
    return x + y

f1()           # 0 (ambele default)
f1(10)         # 10 (x=10, y=0)
f1('10','20')  # '1020' (concatenare str)
f1(10, 20)     # 30
\`\`\`

\`\`\`python
def f1(x=0, y=0):
    return x * y

f1()          # 0
f1('10','20') # ERROR! str*str invalid
f1(10)        # 0 (10*0)
f1('10')      # '' ('10'*0 = str gol)
\`\`\`

### 5.2 Scope: local vs global

\`\`\`python
a = 10
b = 20
def change():
    global b       # declară b ca global
    a = 45         # LOCAL a, nu modifică global a
    b = 56         # modifică GLOBAL b
change()
print(a)  # 10 (global a neschimbat)
print(b)  # 56 (global b modificat)
\`\`\`

**Regulă.** Fără 'global', variabila din funcție e locală. Modificarea ei NU afectează variabila externă.

> ⚠️ **Capcană.** Dar listele sunt mutabile! lst.append() modifică lista originală chiar fără 'global'

### 5.3 Keyword arguments

\`\`\`python
def change(i=1, j=2):
    i = i + j
    j = j + 1
    print(i, j)

change(j=1, i=2)  # i=2+1=3, j=1+1=2 → "3 2"
# Poți apela cu argumente în orice ordine dacă le numești
\`\`\`

### 5.4 Funcții practice de la examen

\`\`\`python
# Reverse name:
def reverse_name(backwards_name):
    forward_name = ''
    for index in range(len(backwards_name)-1, -1, -1):
        forward_name += backwards_name[index]
    return forward_name
# reverse_name("leinad") → "daniel"
\`\`\`

\`\`\`python
# Safe divide:
def safe_divide(numerator, denominator):
    if numerator is None or denominator is None:
        print("A required value is missing.")
    elif denominator == 0:
        print("The denominator is zero.")
    else:
        return numerator / denominator
\`\`\`

\`\`\`python
# Funcție care returnează tuple:
def find_numbers():
    numbers.sort()
    return numbers[0], numbers[-1]  # (min, max)

low, high = find_numbers()  # unpacking

# SAU:
result = find_numbers()  # result e tuple
result[0]   # min
result[-1]  # max
\`\`\`

\`\`\`python
# Fibonacci recursiv:
def fib_seq(n):
    if n == 0: return 0
    elif n == 1: return 1
    else: return fib_seq(n-1) + fib_seq(n-2)

for i in range(7):
    print(fib_seq(i), end=',')
# 0,1,1,2,3,5,8,
\`\`\`

\`\`\`python
# get_names + update_names:
def get_names():
    names = ['Sunny','Bunny','Chinny','Vinny','Pinny']
    return names[2:]  # ['Chinny','Vinny','Pinny']

def update_names(elements):
    new_names = []
    for name in elements:
        new_names.append(name[:3].upper())
    return new_names

print(update_names(get_names()))
# ['CHI', 'VIN', 'PIN']
\`\`\`

### 5.5 Documentare

**Regulă.** # → comentariu (ignorat la syntax check)

**Regulă.** String assignment: comment = '#Return the value' — NU e comentariu, e str

**Regulă.** Inline comment: return x**y  # raise x to the y power

\`\`\`python
# Import cu alias:
from math import sqrt as squareRoot
squareRoot(16)  # 4.0

# NU: import math.sqrt as squareRoot (invalid)
\`\`\``,
  },
  {
    slug: `error-handling`,
    title: `Error handling`,
    orderIndex: 6,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## 6. Error handling

### 6.1 try/except/else/finally

**Regulă.** try: cod riscant. except: prinde erori. else: dacă NU e eroare. finally: MEREU.

\`\`\`python
# Fără eroare:
try:    print('try')       # ✓ se execută
except: print('except')    # ✗ skip
else:   print('else')      # ✓ se execută
finally: print('finally')  # ✓ se execută
# Output: try, else, finally

# Cu eroare:
try:
    print('try')           # ✓ se execută
    print(10/0)            # ✗ ZeroDivisionError
except: print('except')    # ✓ se execută
else:   print('else')      # ✗ skip (a fost eroare)
finally: print('finally')  # ✓ se execută
# Output: try, except, finally
\`\`\`

> ⚠️ **Capcană.** else TREBUIE să fie DUPĂ except. Dacă pui else ÎNAINTE de except → SyntaxError!

**Regulă.** try poate avea: 0+ except, 0-1 else, 0-1 finally. Nu poți avea 2+ finally.

**Regulă.** try + finally fără except: VALID

### 6.2 finally suprascrie return

\`\`\`python
def f1():
    try:
        return 1
    finally:
        return 2

print(f1())  # 2! finally suprascrie return-ul din try
\`\`\`

### 6.3 Tipuri de erori

\`\`\`python
# TypeError — operație pe tip incorect
'hello' + 5              # str + int
total += price            # dacă price e str
for i in 123:             # int nu e iterabil

# ValueError — valoare incorectă
int('10.8')               # nu poate converti str cu punct

# ZeroDivisionError
10 / 0

# NameError — variabilă nedefinită
print(B*w)   # dacă B nu e definit (Python e case-sensitive!)

# KeyError — cheie inexistentă în dict
courses = {1:'Java', 2:'Scala'}
courses[4]   # KeyError: 4

# FileNotFoundError
open('nonexistent.txt', 'r')

# AttributeError — metoda nu există
f.readall()  # nu există readall(), e read()

# IndexError
lst = [1,2,3]
lst[5]       # IndexError

# SyntaxError
True = False  # nu poți asigna la keyword
\`\`\`

**Regulă.** BaseException e clasa de bază pentru TOATE excepțiile

### 6.4 Except cu multiple tipuri

\`\`\`python
# Corect:
except (ZeroDivisionError, ValueError) as e:
    print(e)

# GREȘIT:
except (ZeroDivisionError, ValueError) from e:    # invalid
except (ZeroDivisionError | ValueError) as e:      # invalid
except (ZeroDivisionError, ValueError as e):       # invalid
\`\`\`

\`\`\`python
# Custom exception:
class MyException(Exception):  # TREBUIE să extindă Exception
    pass

# NU: class MyException:       (lipsește Exception)
# NU: class MyException():     (lipsește Exception)
\`\`\`

### 6.5 Fix common errors

\`\`\`python
# TypeError cu += pe string în sumă:
prices = [30.5, '40.5', 10.5]
total = 0
for price in prices:
    total += float(price)  # convertește la float!

# KeyError cu dict:
courses = {1:'Java', 2:'Scala', 3:'Python'}
for i in range(1, 5):   # range(1,4) sau check if i in courses
    if i in courses:
        print(courses[i])
\`\`\`

\`\`\`python
# input() returnează str, nu poți aduna cu int:
# GREȘIT:
count = input('Enter:')
print(count + 1)  # TypeError!

# CORECT:
print(int(count) + 1)
\`\`\`

### 6.6 assert

\`\`\`python
x = 30
y = 10
assert x > y, 'x is smaller than y'
# x > y e True → trece fără eroare
# Dacă ar fi False → AssertionError: x is smaller than y
\`\`\``,
  },
  {
    slug: `module`,
    title: `Module`,
    orderIndex: 7,
    durationMinutes: 10,
    isPreview: false,
    markdown: `## 7. Module

### 7.1 math

\`\`\`python
import math

math.pi          # 3.14159...
math.ceil(10.4)  # 11 (rotunjire în sus)
math.floor(10.9) # 10 (rotunjire în jos)
math.fabs(-5)    # 5.0 (valoare absolută, returnează float)
math.sqrt(16)    # 4.0
math.pow(2, 3)   # 8.0
math.factorial(5) # 120

# Absolute value + remove decimals:
# fabs() → valoare absolută
# floor() → elimină zecimalele (pentru pozitive)

# GREȘEALĂ: from math import factorial
# apoi: math.factorial(5) → Error!
# Corect: factorial(5)
\`\`\`

\`\`\`python
# Area of circle:
def find_area(r):
    return math.pi * math.pow(r, 2)  # pi * r²
\`\`\`

\`\`\`python
# List comprehension cu math:
l = [str(round(math.pi)) for i in range(1, 6)]
# round(3.14159) = 3, str(3) = '3'
# range(1,6) = 5 elemente
# ['3', '3', '3', '3', '3']
\`\`\`

### 7.2 random

\`\`\`python
import random

random.random()         # float în [0.0, 1.0)
random.randint(5, 11)   # int în [5, 11] INCLUSIV ambele
random.randrange(5, 12) # int în [5, 12) EXCLUSIV 12
random.randrange(5, 101, 5)  # multiplu de 5 din [5, 100]

random.choice(fruits)    # un element random din listă
random.sample(fruits, 3) # 3 elemente unice random
random.shuffle(fruits)   # amestecă lista (in-place)

# random.random()*5 → float în [0.0, 5.0)
# int(random.random()*5) → int din {0,1,2,3,4}

# Lista de 7 random ints între 1 și 7:
randints = [random.randint(1,7) for i in range(1,8)]

# Multiplu de 5, min 5, max 100:
random.randrange(5, 101, 5)  # SAU
random.randint(1, 20) * 5
\`\`\`

> ⚠️ **Capcană.** randint(5,11) include 11. randrange(5,12) exclude 12. Ambele generează 5-11.

\`\`\`python
# sample returnează LISTA de elemente unice:
random.sample(range(10), 7)
# 7 numere unice din 0-9
\`\`\`

### 7.3 datetime

\`\`\`python
import datetime
t = datetime.date.today()
t.month    # 9 (NU t.month() — fără paranteze!)

# strftime formatare:
# %B = luna full (September)
# %d = ziua (23)
# %y = anul scurt (20)
# %Y = anul full (2020)
\`\`\`

### 7.4 sys

\`\`\`python
from sys import argv

# py test.py DURGASOFT
argv[0]   # 'test.py' (numele scriptului)
argv[1]   # 'DURGASOFT' (primul argument)
# Tipul argv: list
# Toate elementele sunt str!

# py test.py 10 20
argv[1] + argv[2]  # '1020' (concatenare str, NU 30!)
int(argv[1]) + int(argv[2])  # 30

# Average din command line:
# py test.py Durga 10 20 30
sum = 0
for i in range(2, len(argv)):
    sum += float(argv[i])
avg = sum / (len(argv) - 2)
# format: '{:.2f}'.format(avg) → '20.00'
\`\`\`

### 7.5 os

\`\`\`python
import os

os.path.isfile('test.txt')  # True/False
# TREBUIE import os înainte!
# Fără import → NameError pe linia cu os.path
\`\`\``,
  },
];
