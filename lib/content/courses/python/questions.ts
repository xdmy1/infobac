// AUTO-GENERATED from scripts/questions.normalized.json — do not edit by hand.
// Re-run `node scripts/generate-question-modules.mjs` after extracting fresh content.

import type { Question } from "../types";

export const questions: readonly Question[] = [
  {
    id: `python-001`,
    type: "single",
    topic: `Data types`,
    prompt: `Avem mass=58.7, postal='770045', amount=+18E3. Ce tipuri primesc cele trei variabile, în această ordine?`,
    options: [`float, str, str`, `int, str, float`, `double, str, float`, `float, str, float`],
    correctIndex: 3,
    explanation: `+18E3 este scris în notație științifică, deci devine float. '770045' este pus între ghilimele, prin urmare este str. 58.7 are punct zecimal, înseamnă float. Limbajul Python nu definește un tip numit 'double'.`,
  },
  {
    id: `python-002`,
    type: "single",
    topic: `Data types`,
    prompt: `doors = {1: 'Front', 2: 'Back'}; choice = input('Pick door: ')
Dacă utilizatorul tastează cifra 1, ce tip va avea variabila choice?`,
    options: [`int`, `float`, `str`, `bool`],
    correctIndex: 2,
    explanation: `Funcția input() oferă întotdeauna un str ca rezultat. Chiar și pentru tastarea unei cifre, choice='1' rămâne text. Din acest motiv căutarea în dict eșuează, fiindcă acolo cheile sunt numere întregi.`,
  },
  {
    id: `python-003`,
    type: "single",
    topic: `Data types`,
    prompt: `Pornind de la year='2030' și age='18', ce tip primește variabila born = eval(year) - eval(age)?`,
    options: [`str`, `int`, `float`, `bool`],
    correctIndex: 1,
    explanation: `Apelul eval('2030') produce 2030, un int, iar eval('18') dă 18, tot int. Scăderea dintre două valori întregi rămâne tot un int.`,
  },
  {
    id: `python-004`,
    type: "single",
    topic: `Data types`,
    prompt: `output = str(bool(1) + float(20)/float(4))
print(output)

Ce va apărea pe ecran?`,
    options: [`SyntaxError`, `TypeError`, `6`, `6.0`],
    correctIndex: 3,
    explanation: `bool(1) este True, care în context numeric devine 1. float(20)/float(4) dă 5.0. Adunarea 1+5.0 rezultă 6.0, iar str(6.0) returnează șirul '6.0'.`,
  },
  {
    id: `python-005`,
    type: "single",
    topic: `Operations`,
    prompt: `text='Coding is fun'
part1=text[-7:]
part2=text[-3:]
print(part1+part2)

Ce text apare la rulare?`,
    options: [`g is funfun`, `is funfun`, ` is funfun`, ` is fun fun`],
    correctIndex: 2,
    explanation: `Șirul are 13 caractere. text[-7:] preia ultimele 7 caractere, adică ' is fun' (cu spațiu la început). text[-3:] reține ultimele 3 caractere, deci 'fun'. Concatenarea celor două secvențe rezultă ' is funfun'.`,
  },
  {
    id: `python-006`,
    type: "multi",
    topic: `Data types`,
    prompt: `Cu a='5' și b='2', care două dintre expresiile de mai jos produc rezultat de tip str?`,
    options: [`a+b`, `a*b`, `a-b`, `a*2`],
    correctIndices: [0, 3],
    min: 2,
    explanation: `a+b lipește două șiruri și obținem '52', deci str. a*2 multiplică șirul, rezultând '55', tot str. Pentru a*b avem str*str, ceea ce nu e permis și ridică eroare. a-b cere scăderea între șiruri, ceea ce iar generează eroare.`,
  },
  {
    id: `python-007`,
    type: "multi",
    topic: `Operations`,
    prompt: `Lista employees conține 200 de nume, iar ultimii 5 fac parte din echipa de management. Ce două expresii returnează exact lista fără management?`,
    options: [`employees[0:-4]`, `employees[1:-5]`, `employees[:-5]`, `employees[0:-5]`],
    correctIndices: [2, 3],
    min: 2,
    explanation: `Atât [:-5] cât și [0:-5] omit ultimele 5 elemente și sunt echivalente. Varianta [0:-4] păstrează încă unul dintre membrii echipei de management. Cea cu [1:-5] sare pe lângă primul angajat, deci pierde un nume valid.`,
  },
  {
    id: `python-008`,
    type: "multi",
    topic: `Modules`,
    prompt: `Vrei un întreg aleator între 5 și 11 inclusiv. Care două apeluri îți rezolvă cerința?`,
    options: [`random.randint(5, 11)`, `random.randrange(5, 12, 1)`, `random.randint(5, 12)`, `random.randrange(5, 11, 1)`],
    correctIndices: [0, 1],
    min: 2,
    explanation: `Funcția randint include capătul superior, prin urmare randint(5,11) ajunge până la 11. La randrange(5,12,1) limita superioară este exclusivă, deci 12 nu apare niciodată, ceea ce înseamnă că rezultatul cade tot în 5..11. Apelul randint(5,12) ar produce și valoarea 12, iar randrange(5,11,1) nu ajunge la 11.`,
  },
  {
    id: `python-009`,
    type: "multi",
    topic: `Error handling`,
    prompt: `Bifează toate afirmațiile valide despre structura try / except / finally:`,
    options: [`Un try poate avea unul sau mai multe except`, `Un try poate fi urmat de finally fără niciun except`, `Un try poate avea și except, și finally simultan`, `Un try poate conține mai multe blocuri finally`],
    correctIndices: [0, 1, 2],
    min: 3,
    explanation: `Numărul de blocuri except este nelimitat, iar combinația finally + except este permisă. La fel, try urmat doar de finally este o construcție validă. Singura restricție este că finally apare o singură dată per try.`,
  },
  {
    id: `python-010`,
    type: "multi",
    topic: `Operations`,
    prompt: `Avem b='BANANA'. Care dintre concatenările de mai jos afișează exact 'AA'?`,
    options: [`b[1]+b[2]`, `b[1]+b[3]`, `b[1]+b[5]`, `b[3]+b[5]`],
    correctIndices: [1, 2, 3],
    min: 3,
    explanation: `Indexarea dă B la poziția 0, A la 1, N la 2, A la 3, N la 4 și A la 5. Astfel b[1], b[3] și b[5] returnează 'A'. Singura combinație cu un caracter diferit este b[1]+b[2], unde b[2] este 'N', iar rezultatul devine 'AN'.`,
  },
  {
    id: `python-011`,
    type: "yesno",
    topic: `Data types`,
    prompt: `Apreciază fiecare afirmație ca adevărată sau falsă:`,
    statements: [
      { text: `x1='20', y1=3. După instrucțiunea a=x1*y1, variabila a este de tip str.`, correct: true },
      { text: `x2=6, y2=4. După b=x2/y2, variabila b primește tipul float.`, correct: true },
      { text: `x3=2.5, y3=1. După c=x3/y3, variabila c are tipul int.`, correct: false },
    ],
    explanation: `Înmulțirea str * int repetă șirul și păstrează tipul str. Operatorul / produce mereu un float, indiferent de operanzi. Așadar c=2.5 este float, nicidecum int.`,
  },
  {
    id: `python-012`,
    type: "yesno",
    topic: `Flow control`,
    prompt: `Cod:
num1=eval(input(...))
num2=eval(input(...))
Apreciază următoarele afirmații:`,
    statements: [
      { text: `if num1==num2: print(...) — afișează doar atunci când valorile sunt egale`, correct: true },
      { text: `if num1<=num2: print(...) — afișează doar când num1 e strict mai mic decât num2`, correct: false },
      { text: `if num1>num2: print(...) — afișează doar când num1 este strict mai mare decât num2`, correct: true },
      { text: `if num2 = num1: — reprezintă o comparație incorectă`, correct: true },
    ],
    explanation: `Operatorul <= cuprinde și egalitatea, deci ramura se activează și când valorile sunt egale, nu doar când num1 e mai mic. Semnul = este dedicat atribuirii, nu comparării, prin urmare construcția dă SyntaxError.`,
  },
  {
    id: `python-013`,
    type: "yesno",
    topic: `Functions`,
    prompt: `def increment_score(score, bonus, points):
Apreciază afirmațiile despre signatură și apel:`,
    statements: [
      { text: `Pentru ca points să aibă valoarea implicită 1, antetul trebuie modificat în: def increment_score(score, bonus, points=1):`, correct: true },
      { text: `Odată ce un parametru primește o valoare implicită, toți parametrii care îi urmează trebuie să aibă și ei valori implicite.`, correct: true },
      { text: `Dacă funcția este apelată cu doar 2 argumente, al treilea parametru va fi automat None.`, correct: false },
      { text: `Modificarea lui points în interiorul funcției schimbă și valoarea variabilei externe omonime.`, correct: false },
    ],
    explanation: `Când lipsește un argument, parametrul folosește valoarea implicită declarată (1 în exemplu), nicidecum None. Variabilele de tip int sau str rămân locale funcției, iar reasignarea lor nu afectează identificatorul din afara funcției.`,
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
      { text: `Liniile 01-04 sunt sărite de interpretor în timpul verificării sintaxei.`, correct: true },
      { text: `Pentru liniile 02 și 03, prezența semnului # este opțională.`, correct: false },
      { text: `Stringul de pe linia 06 va fi tratat de Python ca un comentariu.`, correct: false },
      { text: `Pe linia 07 există un comentariu plasat la finalul instrucțiunii.`, correct: true },
    ],
    explanation: `Marcarea unei linii drept comentariu necesită neapărat semnul # pe fiecare rând în parte. Caracterul # plasat în interiorul unui șir face parte din șir, deci nu este comentariu. Textul '# raise x to y' de la sfârșitul liniei 07 este un comentariu inline valid.`,
  },
  {
    id: `python-015`,
    type: "yesno",
    topic: `Operations`,
    prompt: `Apreciază afirmațiile următoare ca adevărate sau false:`,
    statements: [
      { text: `result = 456 + 456.0. Variabila result este de tip int.`, correct: false },
      { text: `s = "Durga Sir's Python Classes". Această linie generează o eroare.`, correct: false },
      { text: `print((7/2)+(False or True)+(9%3)) afișează 4.5`, correct: true },
      { text: `b = False+5-True+35//4 are valoarea 12`, correct: true },
    ],
    explanation: `Adunarea int + float dă întotdeauna float (912.0). Ghilimelele duble admit apostrofuri în interior fără probleme. Pentru 3.5+1+0 obținem 4.5, iar 0+5-1+8 dă 12.`,
  },
  {
    id: `python-016`,
    type: "single",
    topic: `Precedence`,
    prompt: `Cât face: 6//4%5+2**3-2//3?`,
    options: [`9`, `3`, `-1`, `25`],
    correctIndex: 0,
    explanation: `Calculăm 6//4=1, apoi 1%5=1, 2**3=8 și 2//3=0. Adunarea 1+8-0 ne aduce la 9.`,
  },
  {
    id: `python-017`,
    type: "single",
    topic: `Precedence`,
    prompt: `Ce valoare primește variabila x?
x=3/3+3**3-3`,
    options: [`25`, `32`, `0.11`, `25.0`],
    correctIndex: 3,
    explanation: `Împărțirea 3/3 produce 1.0, deci float. 3**3 dă 27. Adunarea finală 1.0+27-3 conduce la 25.0, păstrând tipul float fiindcă unul dintre termeni este float.`,
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

Ce valoare are commission?`,
    options: [`350`, `200`, `150`, `100`],
    correctIndex: 0,
    explanation: `Pentru 3000 se sare prima condiție, a doua eșuează (nu e <3000), iar a treia se activează deoarece 3000>2500, deci commission devine 150. Mai jos urmează un al doilea if independent: 3000>=3000 adaugă încă 200. Totalul ajunge la 350.`,
  },
  {
    id: `python-019`,
    type: "single",
    topic: `Flow control`,
    prompt: `Ce afișează codul?
for i in range(5):
  if i==5: break
  else: print(i)
else:
  print('Here')`,
    options: [`0 1 2 3 4`, `0 1 2 3 4 Here`, `0 1 2 3 4 5 Here`, `1 2 3 4 5`],
    correctIndex: 1,
    explanation: `range(5) produce valorile 0..4, deci i nu atinge niciodată 5 și instrucțiunea break nu se execută. La un for fără break, blocul else atașat la for rulează după ciclu, prin urmare la final apare și 'Here'.`,
  },
  {
    id: `python-020`,
    type: "single",
    topic: `Flow control`,
    prompt: `True = False
while True:
  print(True)
  break

Ce se întâmplă?`,
    options: [`True`, `False`, `None`, `SyntaxError`],
    correctIndex: 3,
    explanation: `În Python, True este un cuvânt rezervat și nu se acceptă reasignarea acestuia. Linia True = False generează SyntaxError cu mesajul cannot assign to True.`,
  },
  {
    id: `python-021`,
    type: "single",
    topic: `I/O`,
    prompt: `Ce mod de deschidere oferă citire+scriere, creează fișierul dacă lipsește și șterge conținutul existent?`,
    options: [`open("f","r+")`, `open("f","w+")`, `open("f","r")`, `open("f","w")`],
    correctIndex: 1,
    explanation: `Modul 'w+' permite atât citirea cât și scrierea, creează fișierul când nu există și suprascrie complet conținutul anterior. 'r+' cere existența prealabilă a fișierului. 'w' nu acceptă citire, iar 'r' nu acceptă scriere.`,
  },
  {
    id: `python-022`,
    type: "single",
    topic: `I/O`,
    prompt: `print(type(input('Enter:')))
Dacă tastezi 10, ce apare pe ecran?`,
    options: [`<class 'int'>`, `<class 'float'>`, `<class 'str'>`, `<class 'bool'>`],
    correctIndex: 2,
    explanation: `Indiferent de ce introduce utilizatorul, input() returnează mereu un str. Chiar și un șir alcătuit doar din cifre rămâne text.`,
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
    explanation: `Atribuirea a=45 creează o variabilă locală, fiindcă în funcție nu există declarația global pentru a. În schimb, b=56 modifică varianta globală datorită declarației global b. Astfel, în afara funcției, a păstrează 10 iar b devine 56.`,
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

Ce se afișează?`,
    options: [`1 2`, `3 3`, `3 2`, `Error`],
    correctIndex: 2,
    explanation: `Argumentele cu nume aduc i=2 și j=1. Calculul devine i=2+1=3, apoi j=1+1=2. Pe ecran apare 3 2.`,
  },
  {
    id: `python-025`,
    type: "single",
    topic: `Error handling`,
    prompt: `try: print('try')
except: print('except')
else: print('else')
finally: print('finally')

În absența excepției, ce se afișează?`,
    options: [`try except finally`, `try else finally`, `try except else finally`, `try finally`],
    correctIndex: 1,
    explanation: `Când blocul try se execută fără probleme, controlul trece la else, iar apoi obligatoriu la finally. Blocul except este omis, fiindcă nu apare nicio excepție.`,
  },
  {
    id: `python-026`,
    type: "single",
    topic: `Error handling`,
    prompt: `try: print('try'); print(10/0)
else: print('else')
except: print('except')

Ce se întâmplă?`,
    options: [`try except finally`, `try else finally`, `try except`, `SyntaxError`],
    correctIndex: 3,
    explanation: `Ordinea sintactică impune ca else să apară după blocurile except. Plasarea lui else înainte de except face ca interpretorul să raporteze SyntaxError.`,
  },
  {
    id: `python-027`,
    type: "single",
    topic: `Modules`,
    prompt: `Care este tipul lui sys.argv?`,
    options: [`set`, `list`, `tuple`, `string`],
    correctIndex: 1,
    explanation: `Atributul sys.argv este o listă (list) de șiruri de caractere ce conține argumentele primite de script.`,
  },
  {
    id: `python-028`,
    type: "single",
    topic: `Modules`,
    prompt: `py test.py 10 20
print(argv[1]+argv[2])
Ce rezultă?`,
    options: [`30`, `'1020'`, `Error`, `'10 20'`],
    correctIndex: 1,
    explanation: `Toate elementele din argv vin ca text. Suma '10'+'20' devine concatenare de șiruri, deci rezultatul este '1020', nu 30.`,
  },
  {
    id: `python-029`,
    type: "single",
    topic: `Modules`,
    prompt: `from math import factorial
print(math.factorial(5))
Ce se afișează?`,
    options: [`120`, `Error`, `5`, `None`],
    correctIndex: 1,
    explanation: `Forma 'from math import factorial' aduce doar funcția factorial în spațiul de nume, fără modulul math. Apelul math.factorial(5) eșuează cu NameError fiindcă identificatorul math nu este definit.`,
  },
  {
    id: `python-030`,
    type: "single",
    topic: `Modules`,
    prompt: `Ce returnează math.ceil(10.4)?`,
    options: [`10`, `11`, `10.0`, `11.0`],
    correctIndex: 1,
    explanation: `Funcția ceil rotunjește numărul în sus la cel mai apropiat întreg. Așadar pentru 10.4 rezultatul este 11.`,
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
    explanation: `Blocul finally se execută obligatoriu și, dacă conține propriul return, acesta înlocuiește valoarea returnată din try. Funcția întoarce 2.`,
  },
  {
    id: `python-032`,
    type: "single",
    topic: `Operations`,
    prompt: `t=([10,20],10,False)
Care dintre liniile de mai jos atribuie <class 'list'> variabilei x?`,
    options: [`x=type(t)`, `x=type(t[0])`, `x=type(t[1])`, `x=type(t[0:])`],
    correctIndex: 1,
    explanation: `Elementul t[0] este [10,20], adică o listă. t însuși este un tuple, t[1] este int, iar t[0:] reprezintă tot un tuple obținut prin slicing.`,
  },
  {
    id: `python-033`,
    type: "single",
    topic: `Operations`,
    prompt: `count=input('Enter:')
Dacă utilizatorul tastează 15, care variantă afișează 20?`,
    options: [`output=int(count)+5`, `output=count+5`, `output=str(count)+5`, `output=float(count)+5`],
    correctIndex: 0,
    explanation: `input() oferă str, deci count+5 cere str+int și eșuează. Conversia int(count) ne dă 15, iar 15+5=20. float(count)+5 ar produce 20.0, nu 20 ca int.`,
  },
  {
    id: `python-034`,
    type: "single",
    topic: `Flow control`,
    prompt: `l=[10,(20,),{30},{},{},[40,50]]
La fiecare element se verifică tipul: list adaugă +1, tuple +2, set +3, dict +4, oricare alt tip +5.
Ce valoare are count la final?`,
    options: [`17`, `18`, `19`, `20`],
    correctIndex: 2,
    explanation: `Pe rând: 10 este int, deci +5; (20,) este tuple, +2; {30} este set, +3; {} este dict, +4; al doilea {} tot dict, +4; [40,50] este list, +1. Suma totală ajunge la 5+2+3+4+4+1, adică 19.`,
  },
  {
    id: `python-035`,
    type: "single",
    topic: `Data types`,
    prompt: `Ce tip primește variabila x în x = 2**2**2?`,
    options: [`int`, `float`, `complex`, `str`],
    correctIndex: 0,
    explanation: `Operatorul ** este asociativ la dreapta, deci 2**2**2 înseamnă 2**(2**2)=2**4=16. Operațiile între întregi păstrează tipul int.`,
  },
  {
    id: `python-036`,
    type: "single",
    topic: `Data types`,
    prompt: `Ce returnează bool(range(0))?`,
    options: [`True`, `False`, `Error`, `None`],
    correctIndex: 1,
    explanation: `Apelul range(0) generează un interval gol, fără niciun element. Orice colecție goală este considerată falsy, prin urmare bool returnează False.`,
  },
  {
    id: `python-037`,
    type: "single",
    topic: `Data types`,
    prompt: `Ce returnează bool(' ') (un singur spațiu)?`,
    options: [`True`, `False`, `Error`, `0`],
    correctIndex: 0,
    explanation: `Șirul ' ' nu este vid; conține un caracter (spațiul). Deoarece nu este gol, este considerat truthy și bool întoarce True.`,
  },
  {
    id: `python-038`,
    type: "single",
    topic: `Operations`,
    prompt: `s = 'Python is easy'
s1 = s[6:-4]
s2 = s1.strip()
print(len(s2))

Ce valoare apare?`,
    options: [`2`, `4`, `6`, `8`],
    correctIndex: 0,
    explanation: `Slicing-ul s[6:-4] preia ' is ' (cu spațiile la capete). Metoda strip() taie spațiile, lăsând 'is'. Lungimea acestui șir este 2.`,
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
    explanation: `Conversia list('AB CD') desparte șirul caracter cu caracter, păstrând și spațiul: ['A','B',' ','C','D']. Apelul append('EF') adaugă șirul ca un singur element, nu separă pe litere.`,
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
    explanation: `Mai întâi 2**2=4. Apoi x//3=2, urmat de 2*3=6 și 6/2=3.0. Pentru y%4 obținem 10%4=2. Adunarea finală 3.0+2 produce 5.0, fiindcă împărțirea / a introdus deja un float.`,
  },
  {
    id: `python-041`,
    type: "single",
    topic: `Precedence`,
    prompt: `Care expresie evaluează la 4?`,
    options: [`7//2-3`, `7%2+3`, `7/2*3`, `7-2*3`],
    correctIndex: 1,
    explanation: `Calculăm 7%2=1, iar 1+3 ajunge la 4. Pentru celelalte: 7//2-3 dă 0, 7/2*3 produce 10.5, iar 7-2*3 conduce la 1.`,
  },
  {
    id: `python-042`,
    type: "single",
    topic: `Precedence`,
    prompt: `Cât face (2*(3+4)**2 - (3**3)*3)?`,
    options: [`17`, `16`, `18`, `19`],
    correctIndex: 0,
    explanation: `În paranteză interioară 3+4=7, apoi 7**2=49 și 2*49=98. Pe partea dreaptă, 3**3=27, iar 27*3=81. Diferența 98-81 ne aduce la 17.`,
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

Ce ordine au afișările?`,
    options: [`birthday, party, greeting, cake`, `party, birthday, birthday, cake`, `party, greeting, birthday, cake`, `birthday, greeting, party, cake`],
    correctIndex: 1,
    explanation: `Pentru x=4: 4%4 este 0, deci se tipărește party. La x=3: 3-2=1≥0 și 3/3=1≠0, prin urmare ramura else afișează birthday. La x=2: 2-2=0≥0 și 2/3≠0, deci tot birthday. La x=1: 1-2=-1<0, ceea ce înseamnă cake.`,
  },
  {
    id: `python-044`,
    type: "single",
    topic: `Flow control`,
    prompt: `discount_percentage = 3
d = input(); utilizatorul tastează 'Thursday'
if d=='Monday': +=5
elif d=='Tuesday': +=7
elif d=='Saturday': +=10
elif d=='Sunday': +=20
else: +=2

Cât va valora discount_percentage la final?`,
    options: [`3`, `5`, `8`, `10`],
    correctIndex: 1,
    explanation: `Valoarea 'Thursday' nu corespunde niciuneia dintre etichetele tratate explicit, deci se intră pe ramura else, unde se adaugă 2 la cei 3 inițiali. Rezultatul devine 5.`,
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
    explanation: `Cheile dicționarului sunt 1..6. Din tuple, doar 2, 4 și 6 apar drept chei și contribuie cu suma lor. Pornind de la result=1, după adunările 1+2+4+6 obținem 13.`,
  },
  {
    id: `python-046`,
    type: "single",
    topic: `Flow control`,
    prompt: `Aceeași construcție, dar cu continue:
for t1 in t:
  if t1 in d: continue
  else: result += t1
print(result)`,
    options: [`29`, `30`, `31`, `32`],
    correctIndex: 2,
    explanation: `Elementele 2, 4 și 6 sunt sărite prin continue. Rămân de adunat 8, 10 și 12, totalizând 30. Cumulat cu valoarea inițială 1, rezultatul devine 31.`,
  },
  {
    id: `python-047`,
    type: "single",
    topic: `I/O`,
    prompt: `Ce produce apelul f.readall() pe un fișier deschis?`,
    options: [`Tot conținutul`, `Prima linie`, `AttributeError`, `EOFError`],
    correctIndex: 2,
    explanation: `Metoda readall() nu există pe obiectele de tip file. Pentru a citi tot conținutul se folosește read(). Apelarea readall() declanșează AttributeError.`,
  },
  {
    id: `python-048`,
    type: "single",
    topic: `I/O`,
    prompt: `Ce afișează '{a}{b}{a}'.format(a='hello', b='world')?`,
    options: [`hello world`, `hello world hello`, `helloworldhello`, `hello hello world`],
    correctIndex: 2,
    explanation: `Substituțiile dau {a}=hello, {b}=world și din nou {a}=hello. Între acoladele consecutive nu se adaugă spațiu, deci rezultatul devine 'helloworldhello'.`,
  },
  {
    id: `python-049`,
    type: "single",
    topic: `Functions`,
    prompt: `def calculate(amount=6, factor=3):
  if amount > 6: return amount*factor
  else: return amount*factor*2

Care apel produce 30?`,
    options: [`calculate()`, `calculate(10)`, `calculate(5,2)`, `calculate(1)`],
    correctIndex: 1,
    explanation: `La calculate(10), amount=10 este mai mare decât 6, deci se intră pe prima ramură: 10*3=30. Pentru calculate() rezultatul este 6*3*2=36, iar calculate(5,2) ne dă 5*2*2=20.`,
  },
  {
    id: `python-050`,
    type: "single",
    topic: `Functions`,
    prompt: `Definim Fibonacci: fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2).
for i in range(7): print(fib(i), end=',')

Ce apare la rulare?`,
    options: [`0,1,1,2,3,5,8,`, `0,1,2,4,8,16,32,`, `1,1,2,3,5,8,13,`, `0,1,1,2,3,5,8`],
    correctIndex: 0,
    explanation: `Primii 7 termeni Fibonacci sunt 0, 1, 1, 2, 3, 5 și 8. range(7) parcurge exact 7 valori, iar parametrul end=',' adaugă o virgulă după fiecare afișare, inclusiv la final.`,
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

Ce se afișează?`,
    options: [`ZeroDivisionError`, `division by zero`, `Error`, `10`],
    correctIndex: 0,
    explanation: `Atributul __name__ al clasei excepției conține numele său sub formă de șir. Pentru excepția prinsă, acesta este 'ZeroDivisionError'.`,
  },
  {
    id: `python-052`,
    type: "single",
    topic: `Error handling`,
    prompt: `Care este o definiție validă pentru o excepție personalizată?`,
    options: [`class E: pass`, `class E(): pass`, `class E(Exception): pass`, `def E(Exception): pass`],
    correctIndex: 2,
    explanation: `O excepție definită de utilizator trebuie să moștenească de la Exception sau o subclasă a sa. Fără această moștenire, clasa nu poate fi ridicată ca excepție.`,
  },
  {
    id: `python-053`,
    type: "single",
    topic: `Modules`,
    prompt: `import random
print(int(random.random()*5))

Ce interval de valori posibile este produs?`,
    options: [`0 la 5`, `1 la 5`, `0 la 4`, `1 la 4`],
    correctIndex: 2,
    explanation: `random.random() ia valori în [0.0, 1.0). Înmulțirea cu 5 conduce la [0.0, 5.0). Conversia int() taie partea zecimală, deci ieșirile posibile sunt 0, 1, 2, 3 sau 4.`,
  },
  {
    id: `python-054`,
    type: "single",
    topic: `Modules`,
    prompt: `Ce produce random.sample(range(10), 7)?`,
    options: [`7 numere unice din 0-9`, `10 numere din 0-6`, `7 numere cu repetiție din 0-9`, `Error`],
    correctIndex: 0,
    explanation: `Funcția sample(population, k) extrage k elemente distincte din populația dată. Aici extrage 7 valori unice din mulțimea 0..9.`,
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

Cât valorează avg?`,
    options: [`15.0`, `20.0`, `30.0`, `Error`],
    correctIndex: 1,
    explanation: `Vectorul argv are 5 elemente: ['test.py','Durga','10','20','30']. range(2,5) parcurge indecșii 2, 3, 4, deci sum acumulează 10+20+30=60. Împărțit la 3 (numărul de argumente folosite), avg ajunge 20.0.`,
  },
  {
    id: `python-056`,
    type: "multi",
    topic: `Operations`,
    prompt: `Care variante afișează exact 'CAT', cu x='ACROTE', y='APPLE', z='TOMATO'? Selectează toate corecte.`,
    options: [`print(x[1]+y[0]+z[0])`, `print(x[2]+y[1]+z[1])`, `print(x[-5]+y[0]+z[0])`, `print(x[-5]+y[0]+z[-2])`],
    correctIndices: [0, 2, 3],
    min: 2,
    explanation: `Avem x[1]='C', y[0]='A', z[0]='T', deci prima opțiune dă 'CAT'. La a doua, x[2]='R' și rezultă 'RPP', incorect. Pentru x[-5] obținem tot 'C' (pe lungimea 6). z[-2]='T', astfel a patra variantă produce și ea 'CAT'.`,
  },
  {
    id: `python-057`,
    type: "multi",
    topic: `Operations`,
    prompt: `n1=[10,20,30], n2=[10,20,30], extra=n2.
Care expresii afișează True? Selectează toate corecte.`,
    options: [`print(extra is n2)`, `print(n1 is n2)`, `print(n1 is extra)`, `print(n1 == extra)`],
    correctIndices: [0, 3],
    min: 2,
    explanation: `Atribuirea extra=n2 face ca extra să indice același obiect cu n2, deci 'is' dă True. Pe de altă parte, n1 și n2 sunt liste create separat, deci 'is' returnează False, deși conținutul este identic. Comparația cu == verifică valorile, iar n1==extra este True.`,
  },
  {
    id: `python-058`,
    type: "multi",
    topic: `Modules`,
    prompt: `Ai nevoie de un multiplu aleator de 5 între 5 și 100 inclusiv. Care două apeluri sunt corecte?`,
    options: [`randrange(5, 100, 5)`, `randint(1, 20) * 5`, `randint(0, 20) * 5`, `randrange(0, 100, 5)`],
    correctIndices: [0, 1],
    min: 2,
    explanation: `randrange(5,100,5) parcurge multiplele 5,10,...,95 (100 fiind exclus) — totul în interval. randint(1,20)*5 dă 5,10,...,100, exact ce trebuie. randint(0,20)*5 ar accepta și 0, iar randrange(0,100,5) începe de la 0, deci niciuna nu respectă limita inferioară 5.`,
  },
  {
    id: `python-059`,
    type: "multi",
    topic: `I/O`,
    prompt: `Care afirmații despre fișiere sunt corecte? Selectează toate variantele adevărate.`,
    options: [`Read pe fișier inexistent generează eroare`, `Write pe fișier inexistent îl creează`, `Write pe fișier existent suprascrie conținutul`, `Read pe fișier existent suprascrie conținutul`],
    correctIndices: [0, 1, 2],
    min: 3,
    explanation: `Primele trei afirmații descriu corect comportamentul modurilor 'r' și 'w'. Operația de citire nu modifică niciodată conținutul fișierului, deci ultima afirmație este falsă.`,
  },
  {
    id: `python-060`,
    type: "multi",
    topic: `Error handling`,
    prompt: `Ce excepții apar pentru: str+int, for i in 123, int('10.8'), lst[99] (când lst e mai scurt)? Selectează toate corecte.`,
    options: [`TypeError`, `ValueError`, `IndexError`, `KeyError`],
    correctIndices: [0, 1, 2],
    min: 3,
    explanation: `Combinația str+int aruncă TypeError. Iterarea pe un int este interzisă, ceea ce produce tot TypeError. Conversia int('10.8') eșuează cu ValueError. Accesul la un index inexistent al unei liste declanșează IndexError. KeyError nu apare în niciunul dintre cazuri (ar fi specific dicționarelor).`,
  },
  {
    id: `python-061`,
    type: "yesno",
    topic: `Data types`,
    prompt: `Apreciază afirmațiile:`,
    statements: [
      { text: `5+False evaluează la False`, correct: false },
      { text: `True+1 evaluează la 2`, correct: true },
      { text: `True and False evaluează la False`, correct: true },
      { text: `True or False evaluează la False`, correct: false },
      { text: `type('') este <class 'bool'>`, correct: false },
    ],
    explanation: `False în context numeric înseamnă 0, deci 5+False=5, un int, nu False. True+1 echivalează cu 1+1=2. Operatorul and returnează False fiindcă unul dintre operanzi este fals, iar or dă True când cel puțin unul este adevărat. Tipul lui '' este str, nu bool.`,
  },
  {
    id: `python-062`,
    type: "yesno",
    topic: `Precedence`,
    prompt: `Apreciază afirmațiile despre evaluarea expresiilor:`,
    statements: [
      { text: `Operatorii cu aceeași precedență se evaluează de la stânga la dreapta`, correct: true },
      { text: `Operatorul ** se evaluează de la dreapta la stânga`, correct: true },
      { text: `* are precedență mai mare decât +`, correct: true },
      { text: `not are precedență mai mică decât +`, correct: false },
    ],
    explanation: `Asociativitatea standard este de la stânga la dreapta, iar exponențierea ** face excepție și se asociază la dreapta. Înmulțirea precede adunarea în ordine. Operatorul not, fiind unar, are precedență mai mare decât +, nu mai mică.`,
  },
  {
    id: `python-063`,
    type: "yesno",
    topic: `I/O`,
    prompt: `Apreciază afirmațiile despre formatare cu format():`,
    statements: [
      { text: `'{:.2f}'.format(123.45678) afișează V:123.46`, correct: true },
      { text: `'{:.2f}'.format(123.4) afișează V:123.40`, correct: true },
      { text: `'{:8.2f}'.format(1.45678) afișează V:1.46`, correct: true },
      { text: `'{:08.2f}'.format(1.45678) afișează V:00001.46`, correct: true },
    ],
    explanation: `Specificatorul .2f impune două zecimale și rotunjește atunci când este necesar. Numărul 8 fixează lățimea câmpului, iar prefixul 0 din 08 spune ca golul să fie umplut cu zerouri în loc de spații.`,
  },
  {
    id: `python-064`,
    type: "yesno",
    topic: `Flow control`,
    prompt: `numList = [1,2,3,4,5], alphaList = ['a','b','c','d','e']
numList = alphaList`,
    statements: [
      { text: `Înainte de assignment, print(numList is alphaList) afișează False`, correct: true },
      { text: `Înainte de assignment, print(numList == alphaList) afișează False`, correct: true },
      { text: `După numList=alphaList, print(numList is alphaList) afișează True`, correct: true },
      { text: `După numList=alphaList, print(numList == alphaList) afișează True`, correct: true },
    ],
    explanation: `La început avem două obiecte distincte cu valori diferite, deci atât 'is' cât și == returnează False. După atribuire, numList trimite spre același obiect ca alphaList, prin urmare ambele teste devin True.`,
  },
  {
    id: `python-065`,
    type: "single",
    topic: `Data types`,
    prompt: `Ce tip primește x în x = 10+20j?`,
    options: [`int`, `float`, `complex`, `str`],
    correctIndex: 2,
    explanation: `Sufixul j semnalizează partea imaginară a unui număr complex. Așadar 10+20j este de tip complex.`,
  },
  {
    id: `python-066`,
    type: "single",
    topic: `Operations`,
    prompt: `a = ['a','b','c','d']
for i in a:
  a.append(i.upper())
print(a)

Ce se întâmplă?`,
    options: [`['A','B','C','D']`, `['a','b','c','d']`, `SyntaxError`, `MemoryError`],
    correctIndex: 3,
    explanation: `Iterarea pe lista a în paralel cu adăugarea de elemente în ea face ca lista să crească nelimitat. Bucla nu se termină niciodată, iar la un moment dat se ajunge la MemoryError.`,
  },
  {
    id: `python-067`,
    type: "single",
    topic: `Flow control`,
    prompt: `Numărăm cuvintele care conțin litera dată:
for word in word_list: if letter in word: count+=1
word_list=['apple','pears','orange','mango']
letter='a'

Ce valoare are count?`,
    options: [`1`, `2`, `3`, `4`],
    correctIndex: 3,
    explanation: `Litera 'a' apare în 'apple', 'pears', 'orange' și 'mango'. Toate cele 4 cuvinte îndeplinesc condiția, deci count ajunge la 4.`,
  },
  {
    id: `python-068`,
    type: "single",
    topic: `Modules`,
    prompt: `Aria cercului este pi*r². Care variantă de cod este corectă?`,
    options: [`math.pi*math.fmod(r,2)`, `math.pi*math.fabs(r)`, `math.pi*math.pow(r,2)`, `math.pi*math.sqrt(r)`],
    correctIndex: 2,
    explanation: `math.pow(r, 2) calculează r la pătrat. fmod întoarce restul împărțirii, fabs ia valoarea absolută, iar sqrt extrage rădăcina pătrată — niciuna nu se potrivește cu r².`,
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
    explanation: `Slice-ul [2:] păstrează ['Chinny','Vinny','Pinny']. Pentru fiecare nume, [:3] preia primele trei litere, iar upper() le face majuscule. Rezultatul devine ['CHI','VIN','PIN'].`,
  },
  {
    id: `python-070`,
    type: "single",
    topic: `I/O`,
    prompt: `print(type(eval(input('Enter:'))))
Dacă tastezi 10.0, ce se afișează?`,
    options: [`<class 'str'>`, `<class 'int'>`, `<class 'float'>`, `<class 'bool'>`],
    correctIndex: 2,
    explanation: `input() ne dă șirul '10.0'. Apoi eval('10.0') este interpretat ca literal numeric cu zecimale, deci rezultatul are tipul float, iar type îl raportează ca <class 'float'>.`,
  },
  {
    id: `python-071`,
    type: "single",
    topic: `Flow control`,
    prompt: `for i in range(0):
  print(i)

Ce afișează?`,
    options: [`0`, `nimic`, `Error`, `None`],
    correctIndex: 1,
    explanation: `range(0) este o secvență fără elemente, deci corpul buclei nu se execută niciodată. Pe ecran nu apare nimic.`,
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
    explanation: `Slicing-ul lst[:] generează un obiect distinct, dar cu aceleași valori. 'is' compară referințele și returnează False, în timp ce == compară conținutul și dă True.`,
  },
  {
    id: `python-073`,
    type: "single",
    topic: `Error handling`,
    prompt: `prices = [10, '20', 30, '40']
total = 0
for price in prices: total += price

Ce eroare se ridică?`,
    options: [`ValueError`, `TypeError`, `IndexError`, `No error`],
    correctIndex: 1,
    explanation: `Când iterația ajunge la '20', se încearcă int + str, ceea ce nu este permis și se aruncă TypeError. Rezolvarea trece prin convertirea explicită cu int() sau float().`,
  },
  {
    id: `python-074`,
    type: "single",
    topic: `Functions`,
    prompt: `Ce tip returnează id()?`,
    options: [`int`, `float`, `bool`, `str`],
    correctIndex: 0,
    explanation: `Funcția id() oferă un identificator unic pentru un obiect, sub formă de int (în CPython, adresa de memorie).`,
  },
  {
    id: `python-075`,
    type: "single",
    topic: `I/O`,
    prompt: `Care este sintaxa corectă pentru a importa sqrt sub aliasul squareRoot?`,
    options: [`import math.sqrt as squareRoot`, `from math.sqrt as squareRoot`, `from math import sqrt as squareRoot`, `import sqrt from math as squareRoot`],
    correctIndex: 2,
    explanation: `Forma corectă este 'from <modul> import <nume> as <alias>'. Numai a treia variantă respectă această ordine.`,
  },
  {
    id: `python-076`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce tipuri primesc variabilele age=0, minor=False, name='Durga'?`,
    options: [`int, bool, str`, `bool, bool, str`, `int, bool, char`, `float, bool, str`],
    correctIndex: 0,
    explanation: `Cifra 0 este int (chiar dacă în context boolean este falsy), False este bool, iar 'Durga' este str. Limbajul Python nu pune la dispoziție un tip 'char' separat.`,
  },
  {
    id: `python-077`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce tip are variabila value = +23E4?`,
    options: [`str`, `int`, `float`, `complex`],
    correctIndex: 2,
    explanation: `Notația științifică (+23E4 înseamnă 230000.0) generează mereu un float, indiferent dacă valoarea este de fapt un întreg.`,
  },
  {
    id: `python-078`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce tip returnează input() când utilizatorul tastează 42?`,
    options: [`int`, `float`, `str`, `depinde de input`],
    correctIndex: 2,
    explanation: `Funcția input() oferă mereu un str, indiferent de ce introduce utilizatorul. Pentru a obține un număr este necesară o conversie explicită.`,
  },
  {
    id: `python-079`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Care este tipul lui born din linia born = eval(year) - eval(age), cu year='2024' și age='20'?`,
    options: [`str`, `int`, `float`, `bool`],
    correctIndex: 1,
    explanation: `eval('2024') ne dă 2024 (int), iar eval('20') produce 20 (int). Diferența între doi întregi rămâne tot int.`,
  },
  {
    id: `python-080`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Cu x1='20' și y1=3, ce tip primește a = x1 * y1?`,
    options: [`int`, `float`, `str`, `Error`],
    correctIndex: 2,
    explanation: `Operatorul * între un str și un int repetă șirul. '20' * 3 produce '202020', care rămâne tot un str.`,
  },
  {
    id: `python-081`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Cu x2=6 și y2=4, ce tip are b = x2/y2?`,
    options: [`int`, `float`, `str`, `bool`],
    correctIndex: 1,
    explanation: `Operatorul / produce întotdeauna float. Astfel 6/4 devine 1.5, deci b are tipul float.`,
  },
  {
    id: `python-082`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce returnează bool([False])?`,
    options: [`False`, `True`, `Error`, `None`],
    correctIndex: 1,
    explanation: `Lista [False] nu este goală: are un singur element. Pentru orice colecție nevidă, bool() întoarce True, indiferent de valorile interne.`,
  },
  {
    id: `python-083`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Care din apelurile bool(0), bool(3), bool(''), bool(' ') returnează False?`,
    options: [`bool(0) și bool('')`, `bool(0) și bool(' ')`, `doar bool(0)`, `doar bool('')`],
    correctIndex: 0,
    explanation: `Atât 0 cât și șirul vid '' sunt considerate falsy. În schimb ' ' (un spațiu) are conținut, deci este truthy. La fel, 3 este nenul, deci tot truthy.`,
  },
  {
    id: `python-084`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce afișează print(type(+1E10))?`,
    options: [`<class 'int'>`, `<class 'float'>`, `<class 'str'>`, `<class 'double'>`],
    correctIndex: 1,
    explanation: `Forma 1E10 indică notație științifică, iar literalele de acest fel sunt mereu float în Python. Tipul 'double' nu este definit în limbaj.`,
  },
  {
    id: `python-085`,
    type: "single",
    topic: `Tipuri de date`,
    prompt: `Ce produce int('10.8')?`,
    options: [`10`, `10.8`, `11`, `ValueError`],
    correctIndex: 3,
    explanation: `Conversia int() nu acceptă șiruri care conțin punct zecimal. Apelul int('10.8') aruncă ValueError. Pentru a obține un întreg trebuie întâi float('10.8'), apoi int(...).`,
  },
  {
    id: `python-086`,
    type: "single",
    topic: `Operații`,
    prompt: `Cu a='5' și b='2', care expresii produc rezultate de tip str?`,
    options: [`a+b și a*2`, `a+b și a*b`, `a-b și a*2`, `doar a+b`],
    correctIndex: 0,
    explanation: `Operația a+b concatenează șirurile și ne dă '52'. Operația a*2 repetă șirul și ne dă '55'. În schimb a*b încearcă str*str (eroare), iar a-b nu este definit între șiruri.`,
  },
  {
    id: `python-087`,
    type: "single",
    topic: `Operații`,
    prompt: `Ce afișează print(str(bool(1) + float(10)/float(2)))?`,
    options: [`'6'`, `'6.0'`, `TypeError`, `SyntaxError`],
    correctIndex: 1,
    explanation: `bool(1) ne dă True, care numeric înseamnă 1. float(10)/float(2) este 5.0. Suma 1+5.0=6.0, iar str(6.0) returnează '6.0'.`,
  },
  {
    id: `python-088`,
    type: "single",
    topic: `Operații`,
    prompt: `Lista colors are 200 de elemente. Cum extragi fiecare al doilea element pornind de la al doilea (indexul 1)?`,
    options: [`colors[1:2]`, `colors[::2]`, `colors[2:2]`, `colors[1::2]`],
    correctIndex: 3,
    explanation: `Notarea [start::step] cu start=1 (al doilea element, index 0-based) și step=2 selectează exact ce ne trebuie: colors[1::2].`,
  },
  {
    id: `python-089`,
    type: "single",
    topic: `Operații`,
    prompt: `În lista employees de 200 de nume, ultimii 5 fac parte din management. Cum obții lista completă fără management?`,
    options: [`employees[0:-4]`, `employees[:-5]`, `employees[1:-5]`, `employees[1:-4]`],
    correctIndex: 1,
    explanation: `Slice-ul employees[:-5] (echivalent cu employees[0:-5]) renunță la ultimele 5 elemente, ceea ce coincide cu eliminarea echipei de management.`,
  },
  {
    id: `python-090`,
    type: "single",
    topic: `Operații`,
    prompt: `list_1=[1,2], list_2=[3,4], list_3=list_1+list_2, list_4=list_3*3. Ce conține list_4?`,
    options: [`[3,6,9,12]`, `[1,2,3,4,1,2,3,4,1,2,3,4]`, `[[1,2,3,4],[1,2,3,4],[1,2,3,4]]`, `[1,2,3,4,3]`],
    correctIndex: 1,
    explanation: `Operatorul * pe liste duplică lista de mai multe ori, fără să modifice valorile interne. Astfel list_3*3 produce o listă în care [1,2,3,4] apare de trei ori la rând.`,
  },
  {
    id: `python-091`,
    type: "single",
    topic: `Operații`,
    prompt: `a='Config1', b=a, a+='Config2'. Ce afișează print(b)?`,
    options: [`Config1Config2`, `Config1`, `Config2`, `Error`],
    correctIndex: 1,
    explanation: `Stringurile sunt obiecte imutabile. Operatorul += creează un șir nou și îl atribuie lui a, dar b continuă să indice spre vechiul 'Config1'.`,
  },
  {
    id: `python-092`,
    type: "single",
    topic: `Operații`,
    prompt: `Cu names=['itvedant','Thane','Andheri','Navi Mumbai'], ce produce names[-1][-1]?`,
    options: [`Navi Mumbai`, `Mumbai`, `i`, `a`],
    correctIndex: 2,
    explanation: `names[-1] selectează ultimul element, adică 'Navi Mumbai'. Apoi [-1] aplicat acestui șir extrage ultimul caracter, care este 'i'.`,
  },
  {
    id: `python-093`,
    type: "single",
    topic: `Precedență`,
    prompt: `Ce produce: 15/5?`,
    options: [`3`, `3.0`, `0`, `0.0`],
    correctIndex: 1,
    explanation: `Operatorul / produce întotdeauna float, chiar și atunci când împărțirea este exactă. Astfel 15/5 dă 3.0, nu 3.`,
  },
  {
    id: `python-094`,
    type: "single",
    topic: `Precedență`,
    prompt: `Cât face: 8//6%5+2**3-2?`,
    options: [`6`, `7`, `8`, `9`],
    correctIndex: 1,
    explanation: `Calculul respectă precedența: 2**3=8, 8//6=1, 1%5=1. Adunarea finală 1+8-2 ajunge la 7.`,
  },
  {
    id: `python-095`,
    type: "single",
    topic: `Precedență`,
    prompt: `Ce returnează 0 or 5?`,
    options: [`True`, `False`, `5`, `0`],
    correctIndex: 2,
    explanation: `Operatorul or întoarce primul operand truthy. Cum 0 este falsy, evaluarea continuă spre 5, care devine rezultatul final.`,
  },
  {
    id: `python-096`,
    type: "single",
    topic: `Precedență`,
    prompt: `X = 2+9*((3*12)-8)/10. Ce valoare are X?`,
    options: [`30.0`, `30.8`, `27.2`, `28.4`],
    correctIndex: 2,
    explanation: `În paranteze: 3*12=36, apoi 36-8=28. Mai departe 9*28=252 și 252/10=25.2. La sfârșit, 2+25.2=27.2.`,
  },
  {
    id: `python-097`,
    type: "single",
    topic: `Precedență`,
    prompt: `Operatorii care au aceeași precedență se evaluează:`,
    options: [`Stânga → Dreapta`, `Dreapta → Stânga`, `Depinde de operator`, `Random`],
    correctIndex: 0,
    explanation: `Regula generală este de la stânga la dreapta. Excepția notabilă o constituie operatorul ** (exponențierea), care se asociază de la dreapta la stânga.`,
  },
  {
    id: `python-098`,
    type: "single",
    topic: `Precedență`,
    prompt: `Vrei b = a * (-1) ridicat la puterea 2. Care este expresia corectă?`,
    options: [`(-a)**2`, `-(a)**2`, `(a)**-2`, `(-a**2)`],
    correctIndex: 0,
    explanation: `Forma (-a)**2 aplică mai întâi semnul minus, apoi ridică la pătrat. Variantele -(a)**2 sau (-a**2) calculează a la pătrat și apoi îl neagă, ceea ce dă semn opus.`,
  },
  {
    id: `python-099`,
    type: "single",
    topic: `Precedență`,
    prompt: `n1=[10,20,30], n2=[10,20,30]. Ce afișează print(n1==n2) și print(n1 is n2)?`,
    options: [`True, True`, `False, False`, `True, False`, `False, True`],
    correctIndex: 2,
    explanation: `== verifică egalitatea valorilor, deci n1==n2 este True. În schimb 'is' compară identitatea obiectelor și, fiindcă cele două liste sunt create separat, returnează False.`,
  },
  {
    id: `python-100`,
    type: "single",
    topic: `Flow control`,
    prompt: `Reducerea se acordă minorilor sau seniorilor. Cum scrii condiția corectă pentru cazul în care nu se aplică niciun discount?`,
    options: [`if not (minor and senior):`, `if not (minor or senior):`, `if (not minor) and senior:`, `if (not minor) or senior:`],
    correctIndex: 1,
    explanation: `Negarea unei disjuncții (not (minor or senior)) este True doar atunci când ambele variabile sunt False, deci exact când persoana nu este nici minor, nici senior.`,
  },
  {
    id: `python-101`,
    type: "single",
    topic: `Flow control`,
    prompt: `collected=3000, commission start=0. if <=2000: 50, elif >2500 and <3000: 100, elif >2500: 150, if >=3000: +=200. Cât valorează commission?`,
    options: [`200`, `150`, `350`, `100`],
    correctIndex: 2,
    explanation: `3000 trece de pragul 2500, ceea ce activează ramura cu 150. Mai jos urmează un nou if, separat de lanțul if/elif: 3000>=3000 adaugă încă 200. Suma finală ajunge la 350.`,
  },
  {
    id: `python-102`,
    type: "single",
    topic: `Flow control`,
    prompt: `Ce execută blocul else atașat la un for, atunci când break NU este declanșat?`,
    options: [`Doar corpul for`, `Corpul for + else`, `Doar else`, `Nimic`],
    correctIndex: 1,
    explanation: `Blocul else al unei bucle for rulează când iterația se încheie pe cale normală. Întreruperea cu break ar fi sărit această ramură, dar fără break ea se execută după corpul ciclului.`,
  },
  {
    id: `python-103`,
    type: "single",
    topic: `Flow control`,
    prompt: `x=123. for i in x: print(i). Ce se întâmplă?`,
    options: [`1 2 3`, `123`, `TypeError`, `SyntaxError`],
    correctIndex: 2,
    explanation: `Tipul int nu este iterabil în Python. Încercarea de a parcurge cu for un număr aruncă TypeError. Pentru a obține cifre separat, ar trebui mai întâi convertit la str.`,
  },
  {
    id: `python-104`,
    type: "single",
    topic: `Flow control`,
    prompt: `True = False. while True: print(True). Ce primim?`,
    options: [`False`, `True`, `Infinite loop`, `SyntaxError`],
    correctIndex: 3,
    explanation: `Cuvântul True este rezervat și nu se poate atribui. Linia True = False generează direct SyntaxError, deci nici nu se ajunge la while.`,
  },
  {
    id: `python-105`,
    type: "single",
    topic: `I/O & Fișiere`,
    prompt: `Ce mod oferă citire+scriere, creează fișierul când lipsește și șterge conținutul existent?`,
    options: [`open('f', 'r+')`, `open('f', 'w+')`, `open('f', 'a')`, `open('f', 'r')`],
    correctIndex: 1,
    explanation: `Modul 'w+' acordă acces atât pentru scriere cât și pentru citire, creează fișierul dacă nu există și înlocuiește integral conținutul anterior.`,
  },
  {
    id: `python-106`,
    type: "single",
    topic: `I/O & Fișiere`,
    prompt: `Apelezi open('f.txt','r') pe un fișier inexistent. Ce se întâmplă?`,
    options: [`Se creează fișierul`, `FileNotFoundError`, `Returnează None`, `Se creează gol`],
    correctIndex: 1,
    explanation: `Modul 'r' presupune că fișierul există deja. Dacă acesta lipsește, deschiderea ridică FileNotFoundError, fără să creeze ceva nou.`,
  },
  {
    id: `python-107`,
    type: "single",
    topic: `I/O & Fișiere`,
    prompt: `Ce produce '{:.2f}'.format(123.4)?`,
    options: [`'123.4'`, `'123.40'`, `'123.4f'`, `'12.34'`],
    correctIndex: 1,
    explanation: `Specificatorul .2f cere exact două zecimale, completând cu zerouri când este nevoie. Așadar 123.4 devine '123.40'.`,
  },
  {
    id: `python-108`,
    type: "single",
    topic: `I/O & Fișiere`,
    prompt: `Care apel citește tot conținutul fișierului ca un singur șir?`,
    options: [`f.readline()`, `f.readlines()`, `f.read()`, `f.readall()`],
    correctIndex: 2,
    explanation: `Metoda read() returnează întregul conținut sub formă de șir. readline() ne dă o singură linie, readlines() o listă de linii, iar readall() pur și simplu nu există (AttributeError).`,
  },
  {
    id: `python-109`,
    type: "single",
    topic: `I/O & Fișiere`,
    prompt: `După un f.write() într-un fișier deschis cu 'a+', ce trebuie să faci ca să poți citi tot conținutul?`,
    options: [`f.flush()`, `f.seek(0)`, `f.close()`, `f.begin()`],
    correctIndex: 1,
    explanation: `După scriere, cursorul rămâne la finalul fișierului și un read() ar întoarce ''. Apelul f.seek(0) repoziționează cursorul la început, permițând citirea completă.`,
  },
  {
    id: `python-110`,
    type: "single",
    topic: `Funcții`,
    prompt: `def f(x=0,y=0): return x+y. Ce returnează f('10','20')?`,
    options: [`30`, `'1020'`, `Error`, `None`],
    correctIndex: 1,
    explanation: `Pentru argumentele de tip str, operatorul + face concatenare. Deci '10'+'20' produce '1020', nu suma numerică 30.`,
  },
  {
    id: `python-111`,
    type: "single",
    topic: `Funcții`,
    prompt: `Cum se numește o variabilă declarată în afara oricărei funcții?`,
    options: [`static`, `global`, `local`, `automatic`],
    correctIndex: 1,
    explanation: `Variabila definită la nivelul modulului este globală și poate fi folosită oriunde în programul respectiv.`,
  },
  {
    id: `python-112`,
    type: "single",
    topic: `Funcții`,
    prompt: `a=10, b=20. def change(): global b; a=45; b=56. După apel, ce afișează print(a) și print(b)?`,
    options: [`10, 56`, `45, 56`, `10, 20`, `Error`],
    correctIndex: 0,
    explanation: `Linia a=45 lucrează cu o variabilă locală, deoarece nu există declarația global pentru a. În schimb b=56 modifică variabila globală b. Astfel rezultatul este a=10 și b=56.`,
  },
  {
    id: `python-113`,
    type: "single",
    topic: `Funcții`,
    prompt: `def f(): try: return 1; finally: return 2. Ce returnează f()?`,
    options: [`1`, `2`, `Error`, `None`],
    correctIndex: 1,
    explanation: `Blocul finally se execută în orice scenariu și, având propriul return, înlocuiește valoarea returnată din try. Funcția produce 2.`,
  },
  {
    id: `python-114`,
    type: "single",
    topic: `Error handling`,
    prompt: `try: ok; except: err; else: alt; finally: fin. Dacă nu apare nicio excepție, ce blocuri rulează?`,
    options: [`try, except, finally`, `try, else, finally`, `try, finally`, `try, except, else, finally`],
    correctIndex: 1,
    explanation: `În absența excepției, după try se trece direct la else, apoi obligatoriu la finally. Blocul except este omis fiindcă nu se ridică nimic.`,
  },
  {
    id: `python-115`,
    type: "single",
    topic: `Error handling`,
    prompt: `Se acceptă o construcție try + finally fără except?`,
    options: [`Da`, `Nu`, `Doar cu else`, `Doar în funcții`],
    correctIndex: 0,
    explanation: `Combinația try-finally fără except este perfect validă. Se folosește atunci când nu vrei să prinzi excepții, doar să garantezi rularea unor instrucțiuni de finalizare.`,
  },
  {
    id: `python-116`,
    type: "single",
    topic: `Error handling`,
    prompt: `except (ZeroDivisionError, ValueError) ??? e: print(e). Ce cuvânt cheie completează corect locul cu ????`,
    options: [`as`, `from`, `in`, `with`],
    correctIndex: 0,
    explanation: `Sintaxa standard este except (Err1, Err2) as e: ... — cuvântul cheie 'as' atribuie excepția prinsă unei variabile.`,
  },
  {
    id: `python-117`,
    type: "single",
    topic: `Module`,
    prompt: `Ce returnează random.random()?`,
    options: [`int între 0-1`, `float între 0.0-1.0`, `float între 0.0-100.0`, `int aleator`],
    correctIndex: 1,
    explanation: `Funcția random.random() generează un float uniform în intervalul [0.0, 1.0), unde limita de sus 1.0 nu este atinsă niciodată.`,
  },
  {
    id: `python-118`,
    type: "single",
    topic: `Module`,
    prompt: `Care este diferența între random.randint(5,11) și random.randrange(5,12)?`,
    options: [`randint exclude 11`, `randrange include 12`, `Ambele generează 5-11`, `randint include 12`],
    correctIndex: 2,
    explanation: `Pentru randint, ambele capete sunt incluse, deci 11 este posibil. La randrange, capătul superior (12) este exclus. Astfel, ambele apeluri produc valori din mulțimea 5..11.`,
  },
  {
    id: `python-119`,
    type: "single",
    topic: `Module`,
    prompt: `Ce conține sys.argv[0]?`,
    options: [`Primul argument`, `Numele scriptului`, `Numărul de argumente`, `Calea Python`],
    correctIndex: 1,
    explanation: `argv[0] păstrează numele scriptului care rulează. Argumentele propriu-zise transmise din linia de comandă încep de la indexul 1.`,
  },
  {
    id: `python-120`,
    type: "single",
    topic: `Module`,
    prompt: `Pentru py test.py 10 20, ce produce argv[1]+argv[2]?`,
    options: [`30`, `'1020'`, `Error`, `'10 20'`],
    correctIndex: 1,
    explanation: `Toate elementele din argv sunt șiruri. Operatorul + între str-uri concatenează, deci rezultatul devine '1020', nu suma numerică 30.`,
  },
  {
    id: `python-121`,
    type: "single",
    topic: `Module`,
    prompt: `Ce returnează math.ceil(10.4)?`,
    options: [`10`, `11`, `10.0`, `11.0`],
    correctIndex: 1,
    explanation: `Funcția ceil rotunjește în sus la cel mai apropiat întreg, deci 10.4 devine 11. Tipul rezultatului este int.`,
  },
  {
    id: `python-122`,
    type: "single",
    topic: `Module`,
    prompt: `from math import factorial. Ulterior se apelează math.factorial(5). Ce se întâmplă?`,
    options: [`120`, `Error`, `5`, `None`],
    correctIndex: 1,
    explanation: `'from math import factorial' aduce doar funcția factorial în spațiul curent, nu și modulul math. Apelul math.factorial(5) provoacă NameError fiindcă numele math nu este definit.`,
  },
];
