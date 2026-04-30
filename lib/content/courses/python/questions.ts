// AUTO-GENERATED from scripts/questions.normalized.json — do not edit by hand.
// Re-run `node scripts/generate-question-modules.mjs` after extracting fresh content.

import type { Question } from "../types";

export const questions: readonly Question[] = [
  {
    id: `python-001`,
    type: "single",
    topic: `Data types`,
    prompt: `Ce tipuri au: weight=62.4, zip='880098', value=+23E4?`,
    options: [`float, str, str`, `int, str, float`, `double, str, float`, `float, str, float`],
    correctIndex: 3,
    explanation: `+23E4 e notație științifică → float. '880098' e în ghilimele → str. 62.4 → float. Python nu are 'double'.`,
  },
  {
    id: `python-002`,
    type: "single",
    topic: `Data types`,
    prompt: `rooms = {1: 'Left', 2: 'Right'}; room = input('Enter room: ')
Dacă userul tastează 1, ce tip are room?`,
    options: [`int`, `float`, `str`, `bool`],
    correctIndex: 2,
    explanation: `input() returnează MEREU str. Chiar dacă tastezi '1', room='1' (str). De aceea room nu se găsește în dict (cheile sunt int).`,
  },
  {
    id: `python-003`,
    type: "single",
    topic: `Data types`,
    prompt: `Ce tip are born în: born = eval(year) - eval(age), unde year='2024', age='20'?`,
    options: [`str`, `int`, `float`, `bool`],
    correctIndex: 1,
    explanation: `eval('2024')=2024(int), eval('20')=20(int). int-int=int.`,
  },
  {
    id: `python-004`,
    type: "single",
    topic: `Data types`,
    prompt: `result = str(bool(1) + float(10)/float(2))
print(result)

Ce se printează?`,
    options: [`SyntaxError`, `TypeError`, `6`, `6.0`],
    correctIndex: 3,
    explanation: `bool(1)=True=1. float(10)/float(2)=5.0. 1+5.0=6.0. str(6.0)='6.0'.`,
  },
  {
    id: `python-005`,
    type: "single",
    topic: `Operations`,
    prompt: `s='Python is easy'
s1=s[-7:]
s2=s[-4:]
print(s1+s2)

Ce se printează?`,
    options: [`is easyeasy`, `easyeasy`, `iseasyeasy`, `s easyeasy`],
    correctIndex: 0,
    explanation: `s[-7:]='is easy' (cu spațiu la început). s[-4:]='easy'. Concatenat: 'is easyeasy'.`,
  },
  {
    id: `python-006`,
    type: "multi",
    topic: `Data types`,
    prompt: `a='5', b='2'. Care expresii sunt de tip str? (alege 2)`,
    options: [`a+b`, `a*b`, `a-b`, `a*2`],
    correctIndices: [0, 3],
    min: 2,
    explanation: `a+b='52' (concat str). a*2='55' (str repeat). a*b=Error(str*str). a-b=Error(str-str).`,
  },
  {
    id: `python-007`,
    type: "multi",
    topic: `Operations`,
    prompt: `employees are 200 de nume, ultimii 5 sunt management.
Care 2 cod-uri exclud management? (alege 2)`,
    options: [`employees[0:-4]`, `employees[1:-5]`, `employees[:-5]`, `employees[0:-5]`],
    correctIndices: [2, 3],
    min: 2,
    explanation: `[:-5] și [0:-5] sunt echivalente — exclud ultimele 5. [0:-4] exclude doar 4. [1:-5] pierde și primul.`,
  },
  {
    id: `python-008`,
    type: "multi",
    topic: `Modules`,
    prompt: `Random integer minim 5, maxim 11. Care 2 funcții? (alege 2)`,
    options: [`random.randint(5, 11)`, `random.randrange(5, 12, 1)`, `random.randint(5, 12)`, `random.randrange(5, 11, 1)`],
    correctIndices: [0, 1],
    min: 2,
    explanation: `randint(5,11) include 11. randrange(5,12,1) exclude 12 → ambele generează 5-11. randint(5,12) include 12=greșit. randrange(5,11,1) exclude 11=greșit.`,
  },
  {
    id: `python-009`,
    type: "multi",
    topic: `Error handling`,
    prompt: `Care sunt True? (alege toate corecte)`,
    options: [`try poate avea 1+ except`, `try poate avea finally fără except`, `try poate avea finally ȘI except`, `try poate avea 2+ finally`],
    correctIndices: [0, 1, 2],
    min: 3,
    explanation: `Poți avea oricâte except, finally+except merge, try+finally fără except merge. Dar DOAR UN finally.`,
  },
  {
    id: `python-010`,
    type: "multi",
    topic: `Operations`,
    prompt: `b='BANANA'. Care printează 'AA'? (alege toate corecte)`,
    options: [`b[1]+b[2]`, `b[1]+b[3]`, `b[1]+b[5]`, `b[3]+b[5]`],
    correctIndices: [1, 2, 3],
    min: 3,
    explanation: `B=0,A=1,N=2,A=3,N=4,A=5. b[1]='A',b[3]='A',b[5]='A'. b[2]='N'. Deci b[1]+b[2]='AN'≠'AA'.`,
  },
  {
    id: `python-011`,
    type: "yesno",
    topic: `Data types`,
    prompt: `Evaluează fiecare afirmație:`,
    statements: [
      { text: `x1='20', y1=3. După a=x1*y1, tipul lui a este str.`, correct: true },
      { text: `x2=6, y2=4. După b=x2/y2, tipul lui b este float.`, correct: true },
      { text: `x3=2.5, y3=1. După c=x3/y3, tipul lui c este int.`, correct: false },
    ],
    explanation: `str*int=str(repetiție). / returnează MEREU float. float/int=float, nu int.`,
  },
  {
    id: `python-012`,
    type: "yesno",
    topic: `Flow control`,
    prompt: `Cod:
num1=eval(input(...))
num2=eval(input(...))
Analizează:`,
    statements: [
      { text: `if num1==num2: print(...) — printează DOAR dacă sunt egale`, correct: true },
      { text: `if num1<=num2: print(...) — printează DOAR dacă num1 < num2`, correct: false },
      { text: `if num1>num2: print(...) — printează DOAR dacă num1 > num2`, correct: true },
      { text: `if num2 = num1: — este o comparație invalidă`, correct: true },
    ],
    explanation: `<= include și egalitatea! Deci printează dacă num1<num2 SAU num1==num2, nu DOAR <. '=' este assignment, nu comparație → SyntaxError.`,
  },
  {
    id: `python-013`,
    type: "yesno",
    topic: `Functions`,
    prompt: `def increment_score(score, bonus, points):
Analizează cerințele:`,
    statements: [
      { text: `Pentru default points=1, linia trebuie schimbată la: def increment_score(score, bonus, points=1):`, correct: true },
      { text: `Odată ce un parametru are default, toți parametrii din dreapta trebuie să aibă default.`, correct: true },
      { text: `Dacă funcția e apelată cu doar 2 parametri, al treilea va fi None.`, correct: false },
      { text: `Modificarea lui points în funcție modifică și variabila points din afara funcției.`, correct: false },
    ],
    explanation: `Al treilea parametru va fi default value (1), NU None. Variabilele int/str din funcție sunt locale — modificarea lor NU afectează variabila externă.`,
  },
  {
    id: `python-014`,
    type: "yesno",
    topic: `Documentation`,
    prompt: `Cod:
01 # The calc_power function calculates exponents
02 # x is the base
03 # y is the exponent
04 # The value returned
05 def calc_power(x, y):
06   comment = '#Return'
07   return x**y  # raise x to y`,
    statements: [
      { text: `Liniile 01-04 vor fi ignorate la verificarea sintaxei.`, correct: true },
      { text: `Semnul # este opțional pentru liniile 02 și 03.`, correct: false },
      { text: `String-ul de la linia 06 va fi interpretat ca comentariu.`, correct: false },
      { text: `Linia 07 conține un comentariu inline.`, correct: true },
    ],
    explanation: `# este obligatoriu pentru FIECARE linie de comentariu. String-ul cu # înăuntru este un str normal, NU comentariu. '# raise x to y' la finalul liniei 07 e comentariu inline.`,
  },
  {
    id: `python-015`,
    type: "yesno",
    topic: `Operations`,
    prompt: `Evaluează fiecare afirmație:`,
    statements: [
      { text: `result = 456 + 456.0. Tipul result este int.`, correct: false },
      { text: `s = "Durga Sir's Python Classes". Această linie cauzează eroare.`, correct: false },
      { text: `print((7/2)+(False or True)+(9%3)) va printa 4.5`, correct: true },
      { text: `b = False+5-True+35//4 evaluează la 12`, correct: true },
    ],
    explanation: `int+float=float(912.0). Double quotes pot conține single quotes. 3.5+1+0=4.5. 0+5-1+8=12.`,
  },
  {
    id: `python-016`,
    type: "single",
    topic: `Precedence`,
    prompt: `Ce rezultă din: 6//4%5+2**3-2//3?`,
    options: [`9`, `3`, `-1`, `25`],
    correctIndex: 0,
    explanation: `6//4=1, 1%5=1, 2**3=8, 2//3=0. 1+8-0=9.`,
  },
  {
    id: `python-017`,
    type: "single",
    topic: `Precedence`,
    prompt: `Ce valoare are x?
x=3/3+3**3-3`,
    options: [`25`, `32`, `0.11`, `25.0`],
    correctIndex: 3,
    explanation: `3/3=1.0(float!), 3**3=27. 1.0+27-3=25.0(float deoarece 3/3 e float).`,
  },
  {
    id: `python-018`,
    type: "single",
    topic: `Flow control`,
    prompt: `collected_amount=3000, commission=0
if <=2000: 50
elif >2500 and <3000: 100
elif >2500: 150
if >=3000: +=200

Cât e commission?`,
    options: [`350`, `200`, `150`, `100`],
    correctIndex: 0,
    explanation: `3000>2500→commission=150. Apoi if SEPARAT: 3000>=3000→commission+=200. Total=350.`,
  },
  {
    id: `python-019`,
    type: "single",
    topic: `Flow control`,
    prompt: `Ce printează?
for i in range(5):
  if i==5: break
  else: print(i)
else:
  print('Here')`,
    options: [`0 1 2 3 4`, `0 1 2 3 4 Here`, `0 1 2 3 4 5 Here`, `1 2 3 4 5`],
    correctIndex: 1,
    explanation: `range(5)=0..4, i nu ajunge la 5, break nu se execută. for-else: else se execută dacă NU a fost break.`,
  },
  {
    id: `python-020`,
    type: "single",
    topic: `Flow control`,
    prompt: `True = False
while True:
  print(True)
  break

Rezultat?`,
    options: [`True`, `False`, `None`, `SyntaxError`],
    correctIndex: 3,
    explanation: `True e keyword. True=False → SyntaxError: cannot assign to True.`,
  },
  {
    id: `python-021`,
    type: "single",
    topic: `I/O`,
    prompt: `Read+Write, creează dacă nu există, suprascrie dacă există:`,
    options: [`open("f","r+")`, `open("f","w+")`, `open("f","r")`, `open("f","w")`],
    correctIndex: 1,
    explanation: `'w+' = read+write, creează, suprascrie. 'r+' necesită fișier existent. 'w' doar write. 'r' doar read.`,
  },
  {
    id: `python-022`,
    type: "single",
    topic: `I/O`,
    prompt: `print(type(input('Enter:')))
Dacă tastezi 10. Ce se printează?`,
    options: [`<class 'int'>`, `<class 'float'>`, `<class 'str'>`, `<class 'bool'>`],
    correctIndex: 2,
    explanation: `input() returnează MEREU str. Chiar dacă tastezi un număr.`,
  },
  {
    id: `python-023`,
    type: "single",
    topic: `Functions`,
    prompt: `a=10, b=20
def change():
  global b
  a=45
  b=56
change()
print(a)
print(b)`,
    options: [`10, 56`, `45, 56`, `10, 20`, `Error`],
    correctIndex: 0,
    explanation: `a=45 e LOCAL (fără global keyword). b=56 modifică GLOBAL b (are global). Deci print: 10, 56.`,
  },
  {
    id: `python-024`,
    type: "single",
    topic: `Functions`,
    prompt: `def change(i=1,j=2):
  i=i+j
  j=j+1
  print(i,j)
change(j=1,i=2)

Ce printează?`,
    options: [`1 2`, `3 3`, `3 2`, `Error`],
    correctIndex: 2,
    explanation: `Apelat cu i=2,j=1. i=2+1=3. j=1+1=2. Print: 3 2.`,
  },
  {
    id: `python-025`,
    type: "single",
    topic: `Error handling`,
    prompt: `try: print('try')
except: print('except')
else: print('else')
finally: print('finally')

Fără eroare, ce se printează?`,
    options: [`try except finally`, `try else finally`, `try except else finally`, `try finally`],
    correctIndex: 1,
    explanation: `Fără excepție: try→else→finally. except se sare.`,
  },
  {
    id: `python-026`,
    type: "single",
    topic: `Error handling`,
    prompt: `try: print('try'); print(10/0)
else: print('else')
except: print('except')

Rezultat?`,
    options: [`try except finally`, `try else finally`, `try except`, `SyntaxError`],
    correctIndex: 3,
    explanation: `else TREBUIE să fie DUPĂ except. Dacă else e ÎNAINTE de except → SyntaxError.`,
  },
  {
    id: `python-027`,
    type: "single",
    topic: `Modules`,
    prompt: `sys.argv e de tip:`,
    options: [`set`, `list`, `tuple`, `string`],
    correctIndex: 1,
    explanation: `sys.argv este o listă (list) de string-uri.`,
  },
  {
    id: `python-028`,
    type: "single",
    topic: `Modules`,
    prompt: `py test.py 10 20
print(argv[1]+argv[2])
Rezultat?`,
    options: [`30`, `'1020'`, `Error`, `'10 20'`],
    correctIndex: 1,
    explanation: `Toate elementele argv sunt str. '10'+'20'='1020' (concatenare, nu adunare).`,
  },
  {
    id: `python-029`,
    type: "single",
    topic: `Modules`,
    prompt: `from math import factorial
print(math.factorial(5))
Rezultat?`,
    options: [`120`, `Error`, `5`, `None`],
    correctIndex: 1,
    explanation: `Dacă faci 'from math import factorial', folosești factorial(5). math.factorial() → NameError (math nu e importat ca modul).`,
  },
  {
    id: `python-030`,
    type: "single",
    topic: `Modules`,
    prompt: `Ce returnează math.ceil(10.4)?`,
    options: [`10`, `11`, `10.0`, `11.0`],
    correctIndex: 1,
    explanation: `ceil = rotunjire în SUS. ceil(10.4)=11.`,
  },
  {
    id: `python-031`,
    type: "single",
    topic: `Error handling`,
    prompt: `def f():
  try: return 1
  finally: return 2
print(f())`,
    options: [`1`, `2`, `Error`, `None`],
    correctIndex: 1,
    explanation: `finally se execută MEREU și suprascrie return-ul din try. Returnează 2.`,
  },
  {
    id: `python-032`,
    type: "single",
    topic: `Operations`,
    prompt: `t=([10,20],10,False)
Care linie atribuie <class 'list'> lui x?`,
    options: [`x=type(t)`, `x=type(t[0])`, `x=type(t[1])`, `x=type(t[0:])`],
    correctIndex: 1,
    explanation: `t[0]=[10,20] care e list. t e tuple. t[1]=10 e int. t[0:] e tuple (slice de tuple).`,
  },
  {
    id: `python-033`,
    type: "single",
    topic: `Operations`,
    prompt: `count=input('Enter:')
Dacă userul tastează 15, care cod printează 20?`,
    options: [`output=int(count)+5`, `output=count+5`, `output=str(count)+5`, `output=float(count)+5`],
    correctIndex: 0,
    explanation: `input()→str. count+5=Error(str+int). int(count)+5=15+5=20. float(count)+5=20.0(nu 20).`,
  },
  {
    id: `python-034`,
    type: "single",
    topic: `Flow control`,
    prompt: `l=[10,(20,),{30},{},{},[40,50]]
count type checking: list→+1, tuple→+2, set→+3, dict→+4, else→+5
Cât e count?`,
    options: [`17`, `18`, `19`, `20`],
    correctIndex: 2,
    explanation: `10=int→+5. (20,)=tuple→+2. {30}=set→+3. {}=dict→+4. {}=dict→+4. [40,50]=list→+1. Total=5+2+3+4+4+1=19.`,
  },
  {
    id: `python-035`,
    type: "single",
    topic: `Data types`,
    prompt: `Ce tip are variabila x = 2**2**2?`,
    options: [`int`, `float`, `complex`, `str`],
    correctIndex: 0,
    explanation: `2**2**2 = 2**(2**2) = 2**4 = 16. Rezultatul e int. Exponențierea int**int = int.`,
  },
  {
    id: `python-036`,
    type: "single",
    topic: `Data types`,
    prompt: `Ce returnează bool(range(0))?`,
    options: [`True`, `False`, `Error`, `None`],
    correctIndex: 1,
    explanation: `range(0) generează 0 elemente — e gol. Orice colecție goală e falsy → False.`,
  },
  {
    id: `python-037`,
    type: "single",
    topic: `Data types`,
    prompt: `Ce returnează bool(' ') (spațiu)?`,
    options: [`True`, `False`, `Error`, `0`],
    correctIndex: 0,
    explanation: `String-ul ' ' conține un caracter (spațiu). Nu e gol → e truthy → True.`,
  },
  {
    id: `python-038`,
    type: "single",
    topic: `Operations`,
    prompt: `s = 'Python is easy'
s1 = s[6:-4]
s2 = s1.strip()
print(len(s2))

Ce se printează?`,
    options: [`2`, `4`, `6`, `8`],
    correctIndex: 0,
    explanation: `s[6:-4] = ' is ' (cu spații). strip() elimină spațiile → 'is'. len('is') = 2.`,
  },
  {
    id: `python-039`,
    type: "single",
    topic: `Operations`,
    prompt: `s = 'AB CD'
lst = list(s)
lst.append('EF')
print(lst)`,
    options: [`['A','B','C','D','E','F']`, `['A','B',' ','C','D','EF']`, `['AB','CD','EF']`, `Error`],
    correctIndex: 1,
    explanation: `list('AB CD') = ['A','B',' ','C','D']. append('EF') adaugă ca UN element, nu caracter cu caracter.`,
  },
  {
    id: `python-040`,
    type: "single",
    topic: `Precedence`,
    prompt: `x = 8
y = 10
result = x//3*3/2 + y%2**2
print(result)`,
    options: [`5`, `5.0`, `6.0`, `7.0`],
    correctIndex: 1,
    explanation: `2**2=4. x//3=2, 2*3=6, 6/2=3.0. y%4=10%4=2. 3.0+2=5.0 (float deoarece / produce float).`,
  },
  {
    id: `python-041`,
    type: "single",
    topic: `Precedence`,
    prompt: `Ce expresie evaluează la 4?`,
    options: [`7//2-3`, `7%2+3`, `7/2*3`, `7-2*3`],
    correctIndex: 1,
    explanation: `7%2=1, 1+3=4. Celelalte: 7//2-3=0, 7/2*3=10.5, 7-2*3=1.`,
  },
  {
    id: `python-042`,
    type: "single",
    topic: `Precedence`,
    prompt: `(2*(3+4)**2 - (3**3)*3) = ?`,
    options: [`17`, `16`, `18`, `19`],
    correctIndex: 0,
    explanation: `3+4=7, 7**2=49, 2*49=98. 3**3=27, 27*3=81. 98-81=17.`,
  },
  {
    id: `python-043`,
    type: "single",
    topic: `Flow control`,
    prompt: `x = 4
while x >= 1:
  if x%4==0: print('party')
  elif x-2<0: print('cake')
  elif x/3==0: print('greeting')
  else: print('birthday')
  x = x-1

Ordine output?`,
    options: [`birthday, party, greeting, cake`, `party, birthday, birthday, cake`, `party, greeting, birthday, cake`, `birthday, greeting, party, cake`],
    correctIndex: 1,
    explanation: `x=4: 4%4==0→party. x=3: 3-2=1≥0, 3/3=1≠0→else→birthday. x=2: 2-2=0≥0, 2/3≠0→else→birthday. x=1: 1-2=-1<0→cake.`,
  },
  {
    id: `python-044`,
    type: "single",
    topic: `Flow control`,
    prompt: `discount_percentage = 3
d = input() → user tastează 'Thursday'
if d=='Monday': +=5
elif d=='Tuesday': +=7
elif d=='Saturday': +=10
elif d=='Sunday': +=20
else: +=2

Cât e discount_percentage?`,
    options: [`3`, `5`, `8`, `10`],
    correctIndex: 1,
    explanation: `'Thursday' nu e nici Monday, Tuesday, Saturday, Sunday → intră pe else → 3+2=5.`,
  },
  {
    id: `python-045`,
    type: "single",
    topic: `Flow control`,
    prompt: `t = (2,4,6,8,10,12)
d = {1:'A',2:'B',3:'C',4:'D',5:'E',6:'F'}
result = 1
for t1 in t:
  if t1 in d:
    result += t1
print(result)`,
    options: [`12`, `13`, `19`, `6`],
    correctIndex: 1,
    explanation: `Chei dict: 1-6. Din tuple: 2∈d(+2), 4∈d(+4), 6∈d(+6). 8,10,12 nu sunt chei. result=1+2+4+6=13.`,
  },
  {
    id: `python-046`,
    type: "single",
    topic: `Flow control`,
    prompt: `Același cod dar cu continue:
for t1 in t:
  if t1 in d: continue
  else: result += t1
print(result)`,
    options: [`29`, `30`, `31`, `32`],
    correctIndex: 2,
    explanation: `Skip 2,4,6 (sunt în d). Adună 8+10+12=30. result=1+30=31.`,
  },
  {
    id: `python-047`,
    type: "single",
    topic: `I/O`,
    prompt: `f.readall() pe un fișier deschis produce:`,
    options: [`Tot conținutul`, `Prima linie`, `AttributeError`, `EOFError`],
    correctIndex: 2,
    explanation: `Metoda readall() NU EXISTĂ. Corect: read(). readall() → AttributeError.`,
  },
  {
    id: `python-048`,
    type: "single",
    topic: `I/O`,
    prompt: `'{a}{b}{a}'.format(a='hello', b='world') produce:`,
    options: [`hello world`, `hello world hello`, `helloworldhello`, `hello hello world`],
    correctIndex: 2,
    explanation: `{a}=hello, {b}=world, {a}=hello. Fără spații între {} → 'helloworldhello'.`,
  },
  {
    id: `python-049`,
    type: "single",
    topic: `Functions`,
    prompt: `def calculate(amount=6, factor=3):
  if amount > 6: return amount*factor
  else: return amount*factor*2

Care apel returnează 30?`,
    options: [`calculate()`, `calculate(10)`, `calculate(5,2)`, `calculate(1)`],
    correctIndex: 1,
    explanation: `calculate(10): amount=10>6 → 10*3=30. calculate()=6*3*2=36. calculate(5,2)=5*2*2=20.`,
  },
  {
    id: `python-050`,
    type: "single",
    topic: `Functions`,
    prompt: `Fibonacci: fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2)
for i in range(7): print(fib(i), end=',')

Output?`,
    options: [`0,1,1,2,3,5,8,`, `0,1,2,4,8,16,32,`, `1,1,2,3,5,8,13,`, `0,1,1,2,3,5,8`],
    correctIndex: 0,
    explanation: `fib: 0,1,1,2,3,5,8. range(7) = 7 valori. Cu virgulă la sfârșit din end=','.`,
  },
  {
    id: `python-051`,
    type: "single",
    topic: `Error handling`,
    prompt: `Cod:
a=10, b=0
try: print(a/b)
except ZeroDivisionError as e:
  print(type(e).__name__)

Ce se printează?`,
    options: [`ZeroDivisionError`, `division by zero`, `Error`, `10`],
    correctIndex: 0,
    explanation: `type(e).__name__ returnează numele clasei excepției ca string: 'ZeroDivisionError'.`,
  },
  {
    id: `python-052`,
    type: "single",
    topic: `Error handling`,
    prompt: `Custom exception validă:`,
    options: [`class E: pass`, `class E(): pass`, `class E(Exception): pass`, `def E(Exception): pass`],
    correctIndex: 2,
    explanation: `Excepțiile custom TREBUIE să extindă Exception. Fără moștenire → nu e excepție validă.`,
  },
  {
    id: `python-053`,
    type: "single",
    topic: `Modules`,
    prompt: `import random
print(int(random.random()*5))

Ce interval de valori?`,
    options: [`0 la 5`, `1 la 5`, `0 la 4`, `1 la 4`],
    correctIndex: 2,
    explanation: `random.random() = [0.0, 1.0). *5 = [0.0, 5.0). int() trunchiază → 0,1,2,3,4.`,
  },
  {
    id: `python-054`,
    type: "single",
    topic: `Modules`,
    prompt: `random.sample(range(10), 7) returnează:`,
    options: [`7 numere unice din 0-9`, `10 numere din 0-6`, `7 numere cu repetiție din 0-9`, `Error`],
    correctIndex: 0,
    explanation: `sample(population, k) returnează k elemente UNICE din population.`,
  },
  {
    id: `python-055`,
    type: "single",
    topic: `Modules`,
    prompt: `from sys import argv
# py test.py Durga 10 20 30
sum=0
for i in range(2,len(argv)):
  sum += float(argv[i])
avg = sum/(len(argv)-2)

Cât e avg?`,
    options: [`15.0`, `20.0`, `30.0`, `Error`],
    correctIndex: 1,
    explanation: `argv = ['test.py','Durga','10','20','30']. range(2,5) → index 2,3,4. sum=10+20+30=60. avg=60/3=20.0.`,
  },
  {
    id: `python-056`,
    type: "multi",
    topic: `Operations`,
    prompt: `Care printează 'CAT'? x='ACROTE', y='APPLE', z='TOMATO' (alege toate corecte)`,
    options: [`print(x[1]+y[0]+z[0])`, `print(x[2]+y[1]+z[1])`, `print(x[-5]+y[0]+z[0])`, `print(x[-5]+y[0]+z[-2])`],
    correctIndices: [0, 2],
    min: 2,
    explanation: `x[1]='C',y[0]='A',z[0]='T'→'CAT'✓. x[2]='R'→'RPO'✗. x[-5]='C',y[0]='A',z[0]='T'→'CAT'✓. z[-2]='T'→dar x[-5]+y[0]+z[-2]='CAT'✓...wait, let me recheck: z='TOMATO', z[-2]='T'. Dar opțiunea D: x[-5]='C'+y[0]='A'+z[-2]='T'='CAT'✓ Actually a=[0,2,3]`,
  },
  {
    id: `python-057`,
    type: "multi",
    topic: `Operations`,
    prompt: `n1=[10,20,30], n2=[10,20,30], extra=n2.
Care printează True? (alege toate corecte)`,
    options: [`print(extra is n2)`, `print(n1 is n2)`, `print(n1 is extra)`, `print(n1 == extra)`],
    correctIndices: [0, 3],
    min: 2,
    explanation: `extra=n2 → same object → extra is n2=True. n1 și n2 sunt obiecte diferite → is=False. Dar n1==extra=True (aceleași valori).`,
  },
  {
    id: `python-058`,
    type: "multi",
    topic: `Modules`,
    prompt: `Random multiplu de 5, minim 5, maxim 100. Care 2 funcționează? (alege 2)`,
    options: [`randrange(5, 100, 5)`, `randint(1, 20) * 5`, `randint(0, 20) * 5`, `randrange(0, 100, 5)`],
    correctIndices: [0, 1],
    min: 2,
    explanation: `randrange(5,100,5) → 5,10,...,95 (exclude 100)✓. randint(1,20)*5 → 5,10,...,100✓. randint(0,20)*5 → include 0✗. randrange(0,100,5) → include 0✗.`,
  },
  {
    id: `python-059`,
    type: "multi",
    topic: `I/O`,
    prompt: `Care sunt TRUE despre fișiere? (alege toate corecte)`,
    options: [`Read pe fișier inexistent → error`, `Write pe fișier inexistent → se creează`, `Write pe fișier existent → se suprascrie`, `Read pe fișier existent → se suprascrie`],
    correctIndices: [0, 1, 2],
    min: 3,
    explanation: `Toate primele 3 sunt corecte. Read nu suprascrie niciodată.`,
  },
  {
    id: `python-060`,
    type: "multi",
    topic: `Error handling`,
    prompt: `Ce tipuri de excepții apar?
str+int, for i in 123, int('10.8'), lst[99] (alege toate corecte)`,
    options: [`TypeError`, `ValueError`, `IndexError`, `KeyError`],
    correctIndices: [0, 1, 2],
    min: 3,
    explanation: `str+int=TypeError. for in int=TypeError. int('10.8')=ValueError. lst[99]=IndexError.`,
  },
  {
    id: `python-061`,
    type: "yesno",
    topic: `Data types`,
    prompt: `Evaluează:`,
    statements: [
      { text: `5+False evaluează la False`, correct: false },
      { text: `True+1 evaluează la 2`, correct: true },
      { text: `True and False evaluează la False`, correct: true },
      { text: `True or False evaluează la False`, correct: false },
      { text: `type('') este <class 'bool'>`, correct: false },
    ],
    explanation: `5+False=5+0=5(int, nu False). True+1=1+1=2✓. True and False=False✓. True or False=True. type('')=<class 'str'>.`,
  },
  {
    id: `python-062`,
    type: "yesno",
    topic: `Precedence`,
    prompt: `Evaluează fiecare afirmație:`,
    statements: [
      { text: `Operatorii cu aceeași precedență se evaluează stânga→dreapta`, correct: true },
      { text: `** (exponențiere) se evaluează dreapta→stânga`, correct: true },
      { text: `* are precedență mai mare decât +`, correct: true },
      { text: `not are precedență mai mică decât +`, correct: false },
    ],
    explanation: `Stânga→dreapta în general✓. ** e excepția (dreapta→stânga)✓. * > + da✓. not e UNAR, are precedență MAI MARE decât +.`,
  },
  {
    id: `python-063`,
    type: "yesno",
    topic: `I/O`,
    prompt: `Evaluează afirmațiile despre formatare:`,
    statements: [
      { text: `'{:.2f}'.format(123.45678) printează V:123.46`, correct: true },
      { text: `'{:.2f}'.format(123.4) printează V:123.40`, correct: true },
      { text: `'{:8.2f}'.format(1.45678) printează V:1.46`, correct: true },
      { text: `'{:08.2f}'.format(1.45678) printează V:00001.46`, correct: true },
    ],
    explanation: `Toate sunt corecte. .2f = 2 zecimale. 8 = lățime totală. 08 = padding cu zerouri.`,
  },
  {
    id: `python-064`,
    type: "yesno",
    topic: `Flow control`,
    prompt: `numList = [1,2,3,4,5], alphaList = ['a','b','c','d','e']
numList = alphaList`,
    statements: [
      { text: `Prima print (numList is alphaList) afișează False`, correct: true },
      { text: `A doua print (numList == alphaList) afișează False`, correct: true },
      { text: `A treia print (numList is alphaList) după numList=alphaList afișează True`, correct: true },
      { text: `A patra print (numList == alphaList) după numList=alphaList afișează True`, correct: true },
    ],
    explanation: `Înainte: obiecte diferite → is=False, valori diferite → ==False. După assignment: same object → is=True, ==True.`,
  },
  {
    id: `python-065`,
    type: "single",
    topic: `Data types`,
    prompt: `Ce tip are x dacă x = 10+20j?`,
    options: [`int`, `float`, `complex`, `str`],
    correctIndex: 2,
    explanation: `Notația cu j indică un număr complex.`,
  },
  {
    id: `python-066`,
    type: "single",
    topic: `Operations`,
    prompt: `a = ['a','b','c','d']
for i in a:
  a.append(i.upper())
print(a)

Rezultat?`,
    options: [`['A','B','C','D']`, `['a','b','c','d']`, `SyntaxError`, `MemoryError`],
    correctIndex: 3,
    explanation: `Iterezi pe lista 'a' și adaugi în ea în același timp → lista crește infinit → MemoryError.`,
  },
  {
    id: `python-067`,
    type: "single",
    topic: `Flow control`,
    prompt: `letter count: for word in word_list: if letter in word: count+=1
word_list=['apple','pears','orange','mango']
letter='a'

Cât e count?`,
    options: [`1`, `2`, `3`, `4`],
    correctIndex: 3,
    explanation: `'a' in 'apple'✓, 'a' in 'pears'✓, 'a' in 'orange'✓, 'a' in 'mango'✓. Toate 4 conțin 'a'.`,
  },
  {
    id: `python-068`,
    type: "single",
    topic: `Modules`,
    prompt: `Area cerc: pi*r². Care cod e corect?`,
    options: [`math.pi*math.fmod(r,2)`, `math.pi*math.fabs(r)`, `math.pi*math.pow(r,2)`, `math.pi*math.sqrt(r)`],
    correctIndex: 2,
    explanation: `math.pow(r,2) = r². fmod=modulo, fabs=valoare absolută, sqrt=rădăcină pătrată.`,
  },
  {
    id: `python-069`,
    type: "single",
    topic: `Functions`,
    prompt: `def get_names():
  return ['Sunny','Bunny','Chinny','Vinny','Pinny'][2:]

def update_names(elements):
  return [name[:3].upper() for name in elements]

print(update_names(get_names()))`,
    options: [`['CHI','VIN','PIN']`, `['VIN','PIN']`, `['SU','BU']`, `Error`],
    correctIndex: 0,
    explanation: `[2:] = ['Chinny','Vinny','Pinny']. [:3].upper() = primele 3 litere uppercase. ['CHI','VIN','PIN'].`,
  },
  {
    id: `python-070`,
    type: "single",
    topic: `I/O`,
    prompt: `print(type(eval(input('Enter:'))))
Dacă tastezi 10.0, ce se printează?`,
    options: [`<class 'str'>`, `<class 'int'>`, `<class 'float'>`, `<class 'bool'>`],
    correctIndex: 2,
    explanation: `input()→'10.0'(str). eval('10.0')→10.0(float). type(10.0)→<class 'float'>.`,
  },
  {
    id: `python-071`,
    type: "single",
    topic: `Flow control`,
    prompt: `for i in range(0):
  print(i)

Ce se printează?`,
    options: [`0`, `nimic`, `Error`, `None`],
    correctIndex: 1,
    explanation: `range(0) generează 0 elemente. Loop-ul nu se execută deloc. Nicio ieșire.`,
  },
  {
    id: `python-072`,
    type: "single",
    topic: `Operations`,
    prompt: `lst = [7, 8, 9]
b = lst[:]
print(b is lst)
print(b == lst)`,
    options: [`False, True`, `True, True`, `False, False`, `True, False`],
    correctIndex: 0,
    explanation: `lst[:] creează o COPIE nouă. Obiect diferit → is=False. Aceleași valori → ==True.`,
  },
  {
    id: `python-073`,
    type: "single",
    topic: `Error handling`,
    prompt: `prices = [10, '20', 30, '40']
total = 0
for price in prices: total += price

Ce eroare apare?`,
    options: [`ValueError`, `TypeError`, `IndexError`, `No error`],
    correctIndex: 1,
    explanation: `Când ajunge la '20'(str): int + str → TypeError. Fix: total += int(price) sau float(price).`,
  },
  {
    id: `python-074`,
    type: "single",
    topic: `Functions`,
    prompt: `Ce returnează id() ?`,
    options: [`int`, `float`, `bool`, `str`],
    correctIndex: 0,
    explanation: `id() returnează un int — adresa obiectului în memorie.`,
  },
  {
    id: `python-075`,
    type: "single",
    topic: `I/O`,
    prompt: `Cum importi sqrt ca squareRoot?`,
    options: [`import math.sqrt as squareRoot`, `from math.sqrt as squareRoot`, `from math import sqrt as squareRoot`, `import sqrt from math as squareRoot`],
    correctIndex: 2,
    explanation: `Sintaxa corectă: from module import function as alias.`,
  },
  {
    id: `python-076`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce tipuri au variabilele age=0, minor=False, name='Durga'?`,
    options: [`int, bool, str`, `bool, bool, str`, `int, bool, char`, `float, bool, str`],
    correctIndex: 0,
    explanation: `0 e int (nu bool!), False e bool, 'Durga' e str. Python nu are tip 'char'.`,
  },
  {
    id: `python-077`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce tip are variabila value = +23E4?`,
    options: [`str`, `int`, `float`, `complex`],
    correctIndex: 2,
    explanation: `Notația științifică (+23E4 = 230000.0) produce mereu float.`,
  },
  {
    id: `python-078`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce tip returnează input() dacă utilizatorul tastează 42?`,
    options: [`int`, `float`, `str`, `depinde de input`],
    correctIndex: 2,
    explanation: `input() returnează MEREU str, indiferent ce introduce utilizatorul.`,
  },
  {
    id: `python-079`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Care e tipul variabilei born în codul: born = eval(year) - eval(age), unde year='2024' și age='20'?`,
    options: [`str`, `int`, `float`, `bool`],
    correctIndex: 1,
    explanation: `eval('2024')=2024 (int), eval('20')=20 (int). int - int = int.`,
  },
  {
    id: `python-080`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `x1='20', y1=3. Ce tip are a = x1 * y1?`,
    options: [`int`, `float`, `str`, `Error`],
    correctIndex: 2,
    explanation: `str * int = str repetat. '20' * 3 = '202020' (str).`,
  },
  {
    id: `python-081`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `x2=6, y2=4, b = x2/y2. Ce tip are b?`,
    options: [`int`, `float`, `str`, `bool`],
    correctIndex: 1,
    explanation: `Operatorul / returnează MEREU float. 6/4 = 1.5 (float).`,
  },
  {
    id: `python-082`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce returnează bool([False])?`,
    options: [`False`, `True`, `Error`, `None`],
    correctIndex: 1,
    explanation: `Lista [False] NU e goală — conține un element. Deci bool() = True.`,
  },
  {
    id: `python-083`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Care din acestea returnează False? bool(0), bool(3), bool(''), bool(' ')`,
    options: [`bool(0) și bool('')`, `bool(0) și bool(' ')`, `doar bool(0)`, `doar bool('')`],
    correctIndex: 0,
    explanation: `0 și '' sunt falsy. ' ' (spațiu) e truthy! bool(3) e truthy.`,
  },
  {
    id: `python-084`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce printează: print(type(+1E10))?`,
    options: [`<class 'int'>`, `<class 'float'>`, `<class 'str'>`, `<class 'double'>`],
    correctIndex: 1,
    explanation: `Notația științifică (1E10) produce mereu float. Python nu are tip 'double'.`,
  },
  {
    id: `python-085`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `int('10.8') produce:`,
    options: [`10`, `10.8`, `11`, `ValueError`],
    correctIndex: 3,
    explanation: `int() nu poate converti un string cu punct zecimal. Folosește float('10.8') sau int(float('10.8')).`,
  },
  {
    id: `python-086`,
    type: "single",
    topic: `Operații`,
    prompt: `a='5', b='2'. Care expresii sunt de tip str?`,
    options: [`a+b și a*2`, `a+b și a*b`, `a-b și a*2`, `doar a+b`],
    correctIndex: 0,
    explanation: `a+b='52' (str concat), a*2='55' (str repeat). a*b=Error (str*str), a-b=Error.`,
  },
  {
    id: `python-087`,
    type: "single",
    topic: `Operații`,
    prompt: `Ce printează: str(bool(1) + float(10)/float(2))?`,
    options: [`'6'`, `'6.0'`, `TypeError`, `SyntaxError`],
    correctIndex: 1,
    explanation: `bool(1)=True=1, float(10)/float(2)=5.0. 1+5.0=6.0. str(6.0)='6.0'.`,
  },
  {
    id: `python-088`,
    type: "single",
    topic: `Operații`,
    prompt: `colors are 200 elemente. Fiecare al doilea element începând cu al doilea:`,
    options: [`colors[1:2]`, `colors[::2]`, `colors[2:2]`, `colors[1::2]`],
    correctIndex: 3,
    explanation: `Start=1 (al doilea, index 0-based), step=2. colors[1::2].`,
  },
  {
    id: `python-089`,
    type: "single",
    topic: `Operații`,
    prompt: `employees are 200 de nume, ultimii 5 sunt management. Toți FĂRĂ management:`,
    options: [`employees[0:-4]`, `employees[:-5]`, `employees[1:-5]`, `employees[1:-4]`],
    correctIndex: 1,
    explanation: `employees[:-5] sau employees[0:-5] — exclude ultimele 5 elemente.`,
  },
  {
    id: `python-090`,
    type: "single",
    topic: `Operații`,
    prompt: `list_1=[1,2], list_2=[3,4], list_3=list_1+list_2, list_4=list_3*3. Ce e list_4?`,
    options: [`[3,6,9,12]`, `[1,2,3,4,1,2,3,4,1,2,3,4]`, `[[1,2,3,4],[1,2,3,4],[1,2,3,4]]`, `[1,2,3,4,3]`],
    correctIndex: 1,
    explanation: `list*3 repetă lista de 3 ori, NU multiplică valorile.`,
  },
  {
    id: `python-091`,
    type: "single",
    topic: `Operații`,
    prompt: `a='Config1', b=a, a+='Config2'. Ce printează print(b)?`,
    options: [`Config1Config2`, `Config1`, `Config2`, `Error`],
    correctIndex: 1,
    explanation: `Stringurile sunt imutabile. a+='Config2' creează obiect NOU. b rămâne la vechiul 'Config1'.`,
  },
  {
    id: `python-092`,
    type: "single",
    topic: `Operații`,
    prompt: `names=['itvedant','Thane','Andheri','Navi Mumbai']. Ce e names[-1][-1]?`,
    options: [`Navi Mumbai`, `Mumbai`, `i`, `a`],
    correctIndex: 2,
    explanation: `names[-1]='Navi Mumbai'. 'Navi Mumbai'[-1]='i' (ultimul caracter).`,
  },
  {
    id: `python-093`,
    type: "single",
    topic: `Precedență`,
    prompt: `Ce rezultat dă: 15/5?`,
    options: [`3`, `3.0`, `0`, `0.0`],
    correctIndex: 1,
    explanation: `Operatorul / returnează MEREU float: 15/5 = 3.0.`,
  },
  {
    id: `python-094`,
    type: "single",
    topic: `Precedență`,
    prompt: `Ce rezultat dă: 8//6%5+2**3-2?`,
    options: [`6`, `7`, `8`, `9`],
    correctIndex: 1,
    explanation: `2**3=8, 8//6=1, 1%5=1. Apoi 1+8-2=7.`,
  },
  {
    id: `python-095`,
    type: "single",
    topic: `Precedență`,
    prompt: `Ce returnează: 0 or 5?`,
    options: [`True`, `False`, `5`, `0`],
    correctIndex: 2,
    explanation: `'or' returnează prima valoare truthy. 0 e falsy → returnează 5.`,
  },
  {
    id: `python-096`,
    type: "single",
    topic: `Precedență`,
    prompt: `X = 2+9*((3*12)-8)/10. Cât e X?`,
    options: [`30.0`, `30.8`, `27.2`, `28.4`],
    correctIndex: 2,
    explanation: `3*12=36, 36-8=28, 9*28=252, 252/10=25.2, 2+25.2=27.2.`,
  },
  {
    id: `python-097`,
    type: "single",
    topic: `Precedență`,
    prompt: `Operatorii cu aceeași precedență se evaluează:`,
    options: [`Stânga → Dreapta`, `Dreapta → Stânga`, `Depinde de operator`, `Random`],
    correctIndex: 0,
    explanation: `Stânga→Dreapta, cu excepția ** (exponențierea) care e Dreapta→Stânga.`,
  },
  {
    id: `python-098`,
    type: "single",
    topic: `Precedență`,
    prompt: `b = a * (-1) apoi ridicat la puterea 2. Expresia corectă:`,
    options: [`(-a)**2`, `-(a)**2`, `(a)**-2`, `(-a**2)`],
    correctIndex: 0,
    explanation: `(-a)**2 — întâi negare, apoi exponențiere. -(a)**2 ar da -(a²) = negativ.`,
  },
  {
    id: `python-099`,
    type: "single",
    topic: `Precedență`,
    prompt: `n1=[10,20,30], n2=[10,20,30]. print(n1==n2), print(n1 is n2):`,
    options: [`True, True`, `False, False`, `True, False`, `False, True`],
    correctIndex: 2,
    explanation: `== compară valori (egale), 'is' compară identitate (obiecte diferite).`,
  },
  {
    id: `python-100`,
    type: "single",
    topic: `Flow control`,
    prompt: `Discount pentru minori SAU seniori. Fără discount dacă nici minor nici senior:`,
    options: [`if not (minor and senior):`, `if not (minor or senior):`, `if (not minor) and senior:`, `if (not minor) or senior:`],
    correctIndex: 1,
    explanation: `not(minor or senior) = True doar când AMBII sunt False (nici minor, nici senior).`,
  },
  {
    id: `python-101`,
    type: "single",
    topic: `Flow control`,
    prompt: `collected=3000, commission start=0. if <=2000: 50, elif >2500 and <3000: 100, elif >2500: 150, if >=3000: +=200. Commission=?`,
    options: [`200`, `150`, `350`, `100`],
    correctIndex: 2,
    explanation: `3000 > 2500 → commission=150. Apoi if separat: 3000>=3000 → +=200. Total: 350.`,
  },
  {
    id: `python-102`,
    type: "single",
    topic: `Flow control`,
    prompt: `Ce printează for-else dacă break NU se execută?`,
    options: [`Doar corpul for`, `Corpul for + else`, `Doar else`, `Nimic`],
    correctIndex: 1,
    explanation: `Blocul else al for-ului se execută doar când loop-ul termină NORMAL (fără break).`,
  },
  {
    id: `python-103`,
    type: "single",
    topic: `Flow control`,
    prompt: `x=123. for i in x: print(i). Rezultat:`,
    options: [`1 2 3`, `123`, `TypeError`, `SyntaxError`],
    correctIndex: 2,
    explanation: `int nu e iterabil. for nu poate itera pe un număr. TypeError.`,
  },
  {
    id: `python-104`,
    type: "single",
    topic: `Flow control`,
    prompt: `True = False. while True: print(True). Rezultat:`,
    options: [`False`, `True`, `Infinite loop`, `SyntaxError`],
    correctIndex: 3,
    explanation: `Nu poți asigna la keyword-ul True. SyntaxError la linia True = False.`,
  },
  {
    id: `python-105`,
    type: "single",
    topic: `I/O & Fișiere`,
    prompt: `Read+Write, creează dacă nu există, suprascrie conținut:`,
    options: [`open('f', 'r+')`, `open('f', 'w+')`, `open('f', 'a')`, `open('f', 'r')`],
    correctIndex: 1,
    explanation: `'w+' — read+write, creează fișierul, suprascrie conținutul existent.`,
  },
  {
    id: `python-106`,
    type: "single",
    topic: `I/O & Fișiere`,
    prompt: `Deschizi un fișier inexistent cu open('f.txt','r'). Ce se întâmplă?`,
    options: [`Se creează fișierul`, `FileNotFoundError`, `Returnează None`, `Se creează gol`],
    correctIndex: 1,
    explanation: `Modul 'r' necesită fișier existent. Dacă nu există → FileNotFoundError.`,
  },
  {
    id: `python-107`,
    type: "single",
    topic: `I/O & Fișiere`,
    prompt: `'{:.2f}'.format(123.4) produce:`,
    options: [`'123.4'`, `'123.40'`, `'123.4f'`, `'12.34'`],
    correctIndex: 1,
    explanation: `.2f = 2 zecimale. 123.4 devine 123.40 (completat cu 0).`,
  },
  {
    id: `python-108`,
    type: "single",
    topic: `I/O & Fișiere`,
    prompt: `Care cod citește TOT conținutul fișierului ca un singur string?`,
    options: [`f.readline()`, `f.readlines()`, `f.read()`, `f.readall()`],
    correctIndex: 2,
    explanation: `read() = tot ca string. readline() = o linie. readlines() = lista de linii. readall() nu există (AttributeError).`,
  },
  {
    id: `python-109`,
    type: "single",
    topic: `I/O & Fișiere`,
    prompt: `După f.write() într-un fișier 'a+', ce trebuie să faci ca să citești tot conținutul?`,
    options: [`f.flush()`, `f.seek(0)`, `f.close()`, `f.begin()`],
    correctIndex: 1,
    explanation: `f.seek(0) mută cursorul la începutul fișierului, altfel read() returnează '' (cursor e la sfârșit).`,
  },
  {
    id: `python-110`,
    type: "single",
    topic: `Funcții`,
    prompt: `def f(x=0,y=0): return x+y. Ce returnează f('10','20')?`,
    options: [`30`, `'1020'`, `Error`, `None`],
    correctIndex: 1,
    explanation: `str + str = concatenare. '10'+'20' = '1020'.`,
  },
  {
    id: `python-111`,
    type: "single",
    topic: `Funcții`,
    prompt: `Variabila definită în afara funcțiilor se numește:`,
    options: [`static`, `global`, `local`, `automatic`],
    correctIndex: 1,
    explanation: `Variabilă globală — accesibilă în tot programul.`,
  },
  {
    id: `python-112`,
    type: "single",
    topic: `Funcții`,
    prompt: `a=10, b=20. def change(): global b; a=45; b=56. print(a), print(b):`,
    options: [`10, 56`, `45, 56`, `10, 20`, `Error`],
    correctIndex: 0,
    explanation: `a=45 e LOCAL (fără global). b=56 modifică GLOBAL b. Deci a=10, b=56.`,
  },
  {
    id: `python-113`,
    type: "single",
    topic: `Funcții`,
    prompt: `def f(): try: return 1; finally: return 2. f() returnează:`,
    options: [`1`, `2`, `Error`, `None`],
    correctIndex: 1,
    explanation: `finally se execută MEREU și suprascrie return-ul din try.`,
  },
  {
    id: `python-114`,
    type: "single",
    topic: `Error handling`,
    prompt: `try: ok; except: err; else: alt; finally: fin. Fără excepție, ce se execută?`,
    options: [`try, except, finally`, `try, else, finally`, `try, finally`, `try, except, else, finally`],
    correctIndex: 1,
    explanation: `Fără excepție: try→else→finally. except se sare.`,
  },
  {
    id: `python-115`,
    type: "single",
    topic: `Error handling`,
    prompt: `Poți avea try + finally FĂRĂ except?`,
    options: [`Da`, `Nu`, `Doar cu else`, `Doar în funcții`],
    correctIndex: 0,
    explanation: `try-finally fără except e perfect valid.`,
  },
  {
    id: `python-116`,
    type: "single",
    topic: `Error handling`,
    prompt: `except (ZeroDivisionError, ValueError) ??? e: print(e). Ce înlocuiește ????`,
    options: [`as`, `from`, `in`, `with`],
    correctIndex: 0,
    explanation: `Sintaxa corectă: except (Err1, Err2) as e:`,
  },
  {
    id: `python-117`,
    type: "single",
    topic: `Module`,
    prompt: `random.random() returnează:`,
    options: [`int între 0-1`, `float între 0.0-1.0`, `float între 0.0-100.0`, `int aleator`],
    correctIndex: 1,
    explanation: `random.random() = float aleator în intervalul [0.0, 1.0).`,
  },
  {
    id: `python-118`,
    type: "single",
    topic: `Module`,
    prompt: `random.randint(5,11) vs random.randrange(5,12). Diferența:`,
    options: [`randint exclude 11`, `randrange include 12`, `Ambele generează 5-11`, `randint include 12`],
    correctIndex: 2,
    explanation: `randint(5,11) include 11. randrange(5,12) exclude 12. Ambele: 5-11.`,
  },
  {
    id: `python-119`,
    type: "single",
    topic: `Module`,
    prompt: `sys.argv[0] conține:`,
    options: [`Primul argument`, `Numele scriptului`, `Numărul de argumente`, `Calea Python`],
    correctIndex: 1,
    explanation: `argv[0] = numele scriptului. Argumentele încep de la argv[1].`,
  },
  {
    id: `python-120`,
    type: "single",
    topic: `Module`,
    prompt: `py test.py 10 20. Ce e argv[1]+argv[2]?`,
    options: [`30`, `'1020'`, `Error`, `'10 20'`],
    correctIndex: 1,
    explanation: `Toate elementele argv sunt str! '10'+'20' = '1020' (concatenare).`,
  },
  {
    id: `python-121`,
    type: "single",
    topic: `Module`,
    prompt: `math.ceil(10.4) returnează:`,
    options: [`10`, `11`, `10.0`, `11.0`],
    correctIndex: 1,
    explanation: `ceil = rotunjire în SUS. ceil(10.4) = 11 (int).`,
  },
  {
    id: `python-122`,
    type: "single",
    topic: `Module`,
    prompt: `from math import factorial. Apoi math.factorial(5). Rezultat:`,
    options: [`120`, `Error`, `5`, `None`],
    correctIndex: 1,
    explanation: `Dacă faci 'from math import factorial', folosești factorial(5) direct. math.factorial(5) → NameError (math nu e importat).`,
  },
];
