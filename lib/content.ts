// =============================================================================
// Marketing content — single source of truth pentru toate secțiunile homepage,
// pagina prețuri, FAQ, cursuri. Editabil fără să atingi componente.
// =============================================================================

// -----------------------------------------------------------------------------
// PATHWAY — 3 certificări Certiport în ordinea recomandată
// -----------------------------------------------------------------------------

export type CourseSlug = "python" | "sql" | "devices" | "networking";

export type CourseColor = "primary" | "accent" | "warning" | "success";

export interface PathwayStep {
  slug: CourseSlug;
  /** PNG path under /public/courses/ — used as the course's brand icon. */
  image: string;
  title: string;
  duration: string;
  description: string;
  tag: string;
  color: CourseColor;
  certName: string;
  examLetter: "A" | "B" | "C";
}

export const pathway: readonly PathwayStep[] = [
  {
    slug: "python",
    image: "/courses/python.png",
    title: "Python",
    duration: "4–6 săptămâni",
    description:
      "Începem cu programarea — limbajul de bază. Sintaxă, structuri de control, funcții, OOP minimal. Tot ce-ți trebuie pentru examenul A.",
    tag: "Cel mai important",
    color: "primary",
    certName: "IT Specialist: Python",
    examLetter: "A",
  },
  {
    slug: "sql",
    image: "/courses/sql.png",
    title: "Databases / SQL",
    duration: "3–4 săptămâni",
    description:
      "Baze de date relaționale, SQL, normalizare, JOIN-uri. Nu te speria — e mai logic decât pare după ce vezi exemple.",
    tag: "Logic și frumos",
    color: "accent",
    certName: "IT Specialist: Databases",
    examLetter: "B",
  },
  {
    slug: "devices",
    image: "/courses/networking-devices.png",
    title: "Devices",
    duration: "2–3 zile",
    description:
      "Componente, sisteme de operare, software, mentenanță. Cea mai accesibilă dintre cele 3 — materie compactă, fără concepte abstracte.",
    tag: "Cea mai accesibilă",
    color: "warning",
    certName: "IT Specialist: Devices",
    examLetter: "C",
  },
] as const;

// Alternative — shown in /cursuri but NOT in main 3-step pathway.
// Pentru BAC e suficient să iei UNA dintre Devices sau Networking.
export const alternativeCourses: readonly PathwayStep[] = [
  {
    slug: "networking",
    image: "/courses/networking.png",
    title: "Networking",
    duration: "1–2 săptămâni",
    description:
      "Conectivitate, IP, DNS, routere, modelul OSI. Mai dificil decât Devices, dar relevant dacă te interesează rețele.",
    tag: "Alternativă",
    color: "success",
    certName: "IT Specialist: Networking",
    examLetter: "C",
  },
] as const;

export const allCourses: readonly PathwayStep[] = [
  ...pathway,
  ...alternativeCourses,
];

// -----------------------------------------------------------------------------
// COMPARISON — Why Us (problem/solution side-by-side)
// -----------------------------------------------------------------------------

export const comparison = {
  them: {
    title: "Platforme fizice din MD",
    items: [
      "~1.000 EUR per program",
      "10 luni, o singură ședință pe săptămână",
      "Trebuie să vii fizic în Chișinău",
      "Profesori care n-au dat examenul recent",
      "Materiale generice",
      "Timpul tău e legat de programul lor",
    ],
  },
  us: {
    title: "InfoBac",
    items: [
      "De la 250 MDL/lună sau 950 MDL pe 6 luni",
      "Înveți în ritmul tău, oricând",
      "100% online, de oriunde din MD",
      "Făcut de elevi care au luat 10 acum câteva luni",
      "Programa exactă — nimic mai mult, nimic mai puțin",
      "Tu controlezi când și cât înveți",
    ],
  },
} as const;

// -----------------------------------------------------------------------------
// FEATURES — „Ce primești" grid
// -----------------------------------------------------------------------------

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Target,
  LineChart,
  LifeBuoy,
  Users,
  Zap,
} from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: readonly Feature[] = [
  {
    icon: BookOpen,
    title: "Programa exactă",
    description:
      "Doar materialele care apar la Certiport. Fără filler academic.",
  },
  {
    icon: Target,
    title: "Teste șablon ca la examen",
    description:
      "Simulări identice cu examenele reale Certiport. Fără surprize în ziua X.",
  },
  {
    icon: LineChart,
    title: "Monitorizare progres",
    description:
      "Vezi exact ce subiecte îți sunt slabe. Concentrează-te acolo.",
  },
  {
    icon: LifeBuoy,
    title: "Suport 24/7",
    description:
      "Întrebare la 2 noaptea? Răspuns în câteva ore. Suntem real, nu chatbot.",
  },
  {
    icon: Users,
    title: "Făcut de elevi pentru elevi",
    description:
      "Am dat aceleași examene anul trecut. Știm ce funcționează.",
  },
  {
    icon: Zap,
    title: "În ritmul tău",
    description:
      "Acces instant. Învață într-o lună sau în 6. Tu decizi.",
  },
] as const;

// -----------------------------------------------------------------------------
// PRICING — 3 planuri (MDL primary, EUR informativ)
// -----------------------------------------------------------------------------

export type PlanId = "module" | "all" | "semester";

export type PriceUnit = "lună" | "6 luni";

export interface PricingPlan {
  id: PlanId;
  name: string;
  priceMDL: number;
  priceEUR: number;
  priceUnit: PriceUnit;
  /** Effective monthly price for marketing copy (semester / per month). */
  effectiveMonthlyMDL?: number;
  description: string;
  badge?: "POPULAR" | "BEST VALUE";
  highlighted?: boolean;
  cta: string;
  /** When set, the user picks a single course (Plan Module). */
  requiresCourseSelection?: boolean;
  features: readonly string[];
}

export const pricingPlans: readonly PricingPlan[] = [
  {
    id: "module",
    name: "Un modul",
    priceMDL: 250,
    priceEUR: 13,
    priceUnit: "lună",
    description:
      "Acces la un singur curs ales — Python, SQL sau Networking.",
    cta: "Alege un modul",
    requiresCourseSelection: true,
    features: [
      "1 modul ales (Python / SQL / Networking)",
      "Toate lecțiile cursului",
      "Quiz-uri de auto-evaluare",
      "Suport email (48h)",
      "Anulezi oricând",
    ],
  },
  {
    id: "all",
    name: "Toate modulele",
    priceMDL: 550,
    priceEUR: 28,
    priceUnit: "lună",
    description: "Toate cele 3 cursuri. Tot ce-ți trebuie să iei 10.",
    badge: "POPULAR",
    highlighted: true,
    cta: "Vreau toate 3",
    features: [
      "Toate cele 3 module",
      "Simulări complete examene Certiport",
      "Monitorizare puncte forte / slabe",
      "Suport 24/7 prioritar",
      "Sesiuni Q&A live săptămânale",
    ],
  },
  {
    id: "semester",
    name: "Pe 6 luni",
    priceMDL: 950,
    priceEUR: 49,
    priceUnit: "6 luni",
    effectiveMonthlyMDL: 158,
    description: "Toate modulele, 6 luni. ~158 MDL/lună efectiv.",
    badge: "BEST VALUE",
    cta: "Pachet semestru",
    features: [
      "Tot din Toate modulele",
      "6 luni acces neîntrerupt",
      "Plan personalizat de pregătire",
      "1 sesiune 1-1 cu mentor",
      "Plata o singură dată",
    ],
  },
] as const;

// -----------------------------------------------------------------------------
// TESTIMONIALS — placeholder-uri realiste, marcate că vor fi înlocuite
// -----------------------------------------------------------------------------

export interface Testimonial {
  name: string;
  school: string;
  rating: 5;
  quote: string;
  result: string;
  initials: string;
  /** Marker intern: testimoniale reale înlocuiesc aceste placeholder-e. */
  placeholder: true;
}

export const testimonials: readonly Testimonial[] = [
  {
    name: "Andreea P.",
    school: "Liceul Mircea Eliade, Chișinău",
    rating: 5,
    quote:
      "Am terminat Python în 5 săptămâni și SQL în 3. Networking-ul l-am dat după două zile de citit. Materia e exact cât trebuie — nu am pierdut timp cu lucruri care nu erau la examen.",
    result: "10 din oficiu — sesiunea iunie 2025",
    initials: "AP",
    placeholder: true,
  },
  {
    name: "Vlad M.",
    school: "Liceul Gheorghe Asachi, Chișinău",
    rating: 5,
    quote:
      "Eram convins că trebuie să dau 1000 EUR la o platformă fizică. Părinții mei au fost sceptici la început, dar simulările seamănă atât de mult cu examenul real încât am știut că e safe.",
    result: "10 din oficiu — sesiunea iunie 2025",
    initials: "VM",
    placeholder: true,
  },
  {
    name: "Cristina S.",
    school: "Liceul Spiru Haret, Chișinău",
    rating: 5,
    quote:
      "Suportul 24/7 m-a salvat de două ori la 11 noaptea, când nu înțelegeam JOIN-uri. Mi-au răspuns în 20 de minute. Asta nu primești la o platformă fizică.",
    result: "10 din oficiu — sesiunea iunie 2025",
    initials: "CS",
    placeholder: true,
  },
] as const;

// -----------------------------------------------------------------------------
// FAQ — 10 întrebări frecvente
// -----------------------------------------------------------------------------

export interface FaqItem {
  q: string;
  a: string;
}

export const faqItems: readonly FaqItem[] = [
  {
    q: "Cum te ajută Certiport pentru BAC informatică?",
    a: "Certificările Certiport IT Specialist (Python, Databases, Networking & Devices) sunt o cale recunoscută în Republica Moldova pentru a-ți susține pregătirea în vederea probei de informatică la BAC. Conținutul lor acoperă programa de bază a probei, iar examenele sunt internațional recunoscute. Pentru detalii despre procedura de echivalare și reglementările în vigoare, întreabă diriginta sau inspectoratul școlar.",
  },
  {
    q: "Câte examene trebuie să dau pentru 10 din oficiu?",
    a: "3 examene Certiport IT Specialist: Python, Databases, Networking & Devices. Fiecare durează 50 de minute, e online sub supraveghere și se dă la un centru autorizat din Chișinău.",
  },
  {
    q: "Unde dau examenele Certiport?",
    a: "La centrele autorizate din Chișinău. Te ajutăm să programezi examenele în platformă — ai un ghid pas-cu-pas când ești gata.",
  },
  {
    q: "Cât costă voucher-ele Certiport (separat de InfoBac)?",
    a: "Aproximativ 30–40 EUR per certificare, plătite direct la centrul de testare. InfoBac te pregătește; voucher-ul e pasul final și se cumpără separat.",
  },
  {
    q: "Cât durează pregătirea?",
    a: "Estimat 6–10 săptămâni dacă lucrezi 1–2 ore pe zi. Mai puțin dacă ai deja experiență cu programarea. Mai mult dacă pleci de la zero — dar nu te grăbi, important e să treci, nu să termini repede.",
  },
  {
    q: "Ce se întâmplă dacă nu trec un examen?",
    a: "Poți redă examenul Certiport (cost suplimentar pentru voucher nou). În InfoBac analizăm împreună unde ai greșit și revedem secțiunea respectivă. Avem rate de promovare 90%+ pentru elevii care termină simulările noastre.",
  },
  {
    q: "Pot să-mi anulez abonamentul oricând?",
    a: "Da, planurile lunare se anulează din cont — nu ești taxat la următoarea perioadă, iar accesul rămâne activ până la sfârșitul lunii plătite. Pachetul de 6 luni e plată unică, fără rambursare.",
  },
  {
    q: "Aveți materiale și pentru clasa 11?",
    a: "Materialele sunt aceleași — pathway-ul Certiport e identic indiferent de clasă. Mulți elevi încep în clasa a 11-a și termină prima certificare înainte de vacanța mare.",
  },
  {
    q: "Cum plătesc dacă sunt minor?",
    a: "Cardul părintelui sau transfer bancar pe numele lor. Avem secțiune dedicată pentru părinți care explică investiția vs alternative. Putem emite factură pe numele părintelui dacă e nevoie.",
  },
  {
    q: "Ce e pachetul de 6 luni?",
    a: "Plătești o dată 950 MDL (≈49 EUR) și ai acces la toate cele 3 module timp de 6 luni — efectiv 158 MDL/lună, cea mai bună valoare. Recomandat pentru elevii care vor să-și seteze ritmul fără presiune lunară.",
  },
] as const;

// -----------------------------------------------------------------------------
// HERO — trust indicators sub CTA-uri
// -----------------------------------------------------------------------------

export const heroTrustIndicators = [
  "Certificări internațional recunoscute",
  "Pregătire BAC informatică",
  "Acces 24/7",
] as const;

// -----------------------------------------------------------------------------
// COURSE SYLLABI — structurat pe topics Certiport (procente reale per examen)
// -----------------------------------------------------------------------------

export interface SyllabusTopic {
  title: string;
  weight: string;
  bullets: readonly string[];
}

export interface CourseSyllabus {
  intro: string;
  examFormat: string;
  topics: readonly SyllabusTopic[];
}

export const courseSyllabi: Record<CourseSlug, CourseSyllabus> = {
  python: {
    intro:
      "Python e fundația. Învețe să citești și să scrii cod care rezolvă probleme reale. Fără teorie inutilă — direct aplicat pe exerciții care imită exact ce o să vezi în examenul A.",
    examFormat: "40 întrebări · 50 minute · scor minim 700/1000",
    topics: [
      {
        title: "Operații cu tipuri de date și operatori",
        weight: "20%",
        bullets: [
          "Tipuri primitive: int, float, str, bool, None",
          "Operatori aritmetici, de comparație, logici, de atribuire",
          "Conversie între tipuri (cast) și verificare cu type()",
          "Liste, tuple, set, dict — operații de bază",
        ],
      },
      {
        title: "Flow control — decizii și bucle",
        weight: "25%",
        bullets: [
          "if / elif / else cu condiții compuse",
          "while loops și for loops (range, enumerate, zip)",
          "break, continue, pass",
          "Comprehensions pentru liste și dict-uri",
        ],
      },
      {
        title: "Input și output",
        weight: "20%",
        bullets: [
          "input() și print() cu formatare (f-strings)",
          "Citire/scriere fișiere text (.txt, .csv)",
          "Lucrul cu căi de fișiere (relative vs absolute)",
        ],
      },
      {
        title: "Documentare și structură cod",
        weight: "15%",
        bullets: [
          "Funcții cu parametri default, *args, **kwargs",
          "Docstrings și comentarii utile",
          "Module și import-uri (import, from ... import)",
          "OOP minimal: clase, atribute, metode",
        ],
      },
      {
        title: "Troubleshooting și error handling",
        weight: "10%",
        bullets: [
          "try / except / finally",
          "Tipuri de erori comune (TypeError, ValueError, IndexError)",
          "Debugging cu print și citirea traceback-urilor",
        ],
      },
      {
        title: "Module și unelte",
        weight: "10%",
        bullets: [
          "math, random, datetime — funcții esențiale",
          "Instalare pachete cu pip",
          "Lucrul cu IDE (VS Code, PyCharm) la nivel utilizator",
        ],
      },
    ],
  },
  sql: {
    intro:
      "SQL e logic și frumos. Odată ce înțelegi cum gândesc bazele de date relaționale, totul devine puzzle. Materialele acoperă exact ce verifică Certiport — interogări, normalizare, joins.",
    examFormat: "40 întrebări · 50 minute · scor minim 700/1000",
    topics: [
      {
        title: "Concepte baze de date relaționale",
        weight: "25%",
        bullets: [
          "Tabele, rânduri, coloane, scheme",
          "Chei primare, chei străine, constrângeri",
          "Normalizare 1NF / 2NF / 3NF (cu exemple)",
          "Diagrame ER de bază",
        ],
      },
      {
        title: "Interogări — SELECT, WHERE, ORDER BY",
        weight: "30%",
        bullets: [
          "SELECT cu coloane specifice și aliasuri (AS)",
          "WHERE cu operatori (=, !=, <, BETWEEN, LIKE, IN)",
          "ORDER BY ASC/DESC, LIMIT, DISTINCT",
          "Funcții agregate: COUNT, SUM, AVG, MIN, MAX",
          "GROUP BY și HAVING",
        ],
      },
      {
        title: "JOIN-uri",
        weight: "20%",
        bullets: [
          "INNER JOIN — intersecția a două tabele",
          "LEFT / RIGHT JOIN — păstrare rânduri din una sau alta",
          "FULL OUTER JOIN și CROSS JOIN",
          "Self-joins și subquery-uri simple",
        ],
      },
      {
        title: "Manipulare date (DML)",
        weight: "15%",
        bullets: [
          "INSERT INTO ... VALUES",
          "UPDATE ... SET ... WHERE",
          "DELETE FROM ... WHERE",
          "Tranzacții de bază (BEGIN, COMMIT, ROLLBACK)",
        ],
      },
      {
        title: "Obiecte de bază de date",
        weight: "10%",
        bullets: [
          "CREATE TABLE cu tipuri de date și constrângeri",
          "ALTER TABLE — adăugare/modificare coloane",
          "DROP TABLE și TRUNCATE",
          "Views și indexuri (concept)",
        ],
      },
    ],
  },
  devices: {
    intro:
      "Cea mai accesibilă certificare din pathway. Materie aplicată — componente hardware, sisteme de operare, software și mentenanță. Conținutul e compact și se acoperă în 2–3 zile de studiu serios.",
    examFormat: "40 întrebări · 50 minute · scor minim 700/1000",
    topics: [
      {
        title: "Componente hardware",
        weight: "30%",
        bullets: [
          "CPU, RAM, HDD vs SSD, GPU — rol și diferențe",
          "Periferice: monitor, tastatură, mouse, imprimantă",
          "Porturi: USB, HDMI, Ethernet, Audio jack",
          "Tipuri de calculatoare: desktop, laptop, server, embedded",
        ],
      },
      {
        title: "Sisteme de operare",
        weight: "25%",
        bullets: [
          "Windows, macOS, Linux — diferențe principale",
          "File system, foldere, permisiuni",
          "Procese și manager de task-uri",
          "Drivere și update-uri",
        ],
      },
      {
        title: "Software și aplicații",
        weight: "20%",
        bullets: [
          "Software de sistem vs aplicații",
          "Licențiere: open source, freeware, comercial",
          "Mobile apps și cloud apps",
          "Securitate: antivirus, firewall",
        ],
      },
      {
        title: "Mentenanță și troubleshooting",
        weight: "25%",
        bullets: [
          "Backup și restore",
          "Probleme comune și soluții",
          "Cleanup disc, optimizare",
          "Parole sigure, autentificare în 2 pași",
        ],
      },
    ],
  },
  networking: {
    intro:
      "Conectivitate, rețele, internet. Mai dificil decât Devices — dacă ai bază tehnică sau te interesează rețelele, alegi acesta. Altfel, mergi pe Devices.",
    examFormat: "40 întrebări · 50 minute · scor minim 700/1000",
    topics: [
      {
        title: "Modelul OSI și TCP/IP",
        weight: "25%",
        bullets: [
          "Cele 7 straturi OSI",
          "TCP vs UDP",
          "Cum interacționează aplicațiile cu rețeaua",
        ],
      },
      {
        title: "Adresare și protocoale",
        weight: "30%",
        bullets: [
          "IPv4, IPv6, subnetting de bază",
          "DNS, DHCP, NAT",
          "HTTP, HTTPS, FTP, SSH",
        ],
      },
      {
        title: "Hardware de rețea",
        weight: "20%",
        bullets: [
          "Routere, switch-uri, modem-uri, access point-uri",
          "Cabluri și topologii",
          "LAN vs WAN vs MAN",
        ],
      },
      {
        title: "Wireless și securitate",
        weight: "25%",
        bullets: [
          "Wi-Fi standards (a/b/g/n/ac/ax)",
          "WPA2, WPA3, criptare",
          "Atacuri comune: MITM, phishing",
          "Best practices",
        ],
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// PRICING — comparison matrix pentru tabelul detaliat din /preturi
// -----------------------------------------------------------------------------

// (Old ComparisonFeatureRow kept commented for reference — replaced by ComparisonFeatureRowNew above.)

export interface ComparisonFeatureRowNew {
  label: string;
  category: "content" | "exam" | "support" | "perks";
  module: boolean | string;
  all: boolean | string;
  semester: boolean | string;
}

// New plans (module / all / semester) — replaces the old basic/standard/lifetime matrix.
export const comparisonMatrix: readonly ComparisonFeatureRowNew[] = [
  { label: "Module incluse", category: "content", module: "1 ales", all: "toate 3", semester: "toate 3" },
  { label: "Lecții complete", category: "content", module: true, all: true, semester: true },
  { label: "Quiz-uri de auto-evaluare", category: "content", module: true, all: true, semester: true },
  { label: "Comunitate Telegram", category: "content", module: true, all: true, semester: true },

  { label: "Simulări examene Certiport", category: "exam", module: false, all: true, semester: true },
  { label: "Număr simulări per modul", category: "exam", module: "0", all: "nelimitat", semester: "nelimitat" },
  { label: "Monitorizare puncte forte / slabe", category: "exam", module: false, all: true, semester: true },
  { label: "Plan personalizat de pregătire", category: "exam", module: false, all: false, semester: true },

  { label: "Suport email", category: "support", module: "48h", all: "12h", semester: "12h" },
  { label: "Suport 24/7 prioritar", category: "support", module: false, all: true, semester: true },
  { label: "Sesiuni Q&A live săptămânale", category: "support", module: false, all: true, semester: true },
  { label: "1 sesiune 1-1 cu mentor", category: "support", module: false, all: false, semester: true },

  { label: "Durată acces", category: "perks", module: "lunar", all: "lunar", semester: "6 luni" },
  { label: "Plată o singură dată", category: "perks", module: false, all: false, semester: true },
  { label: "Anulezi oricând", category: "perks", module: true, all: true, semester: false },
] as const;

// Legacy alias for code that still references the old type — keep until pruned.
export type ComparisonFeatureRow = ComparisonFeatureRowNew;

// -----------------------------------------------------------------------------
// PRICING FAQ — întrebări specifice paginii /preturi
// -----------------------------------------------------------------------------

export const pricingFaq: readonly FaqItem[] = [
  {
    q: "Pot să-mi anulez abonamentul oricând?",
    a: "Da, planurile lunare se anulează oricând din contul tău (Setări → Abonament). Nu ești taxat la următoarea perioadă. Accesul rămâne activ până la sfârșitul lunii plătite. Pachetul de 6 luni e plată unică — vezi mai jos.",
  },
  {
    q: "Pot să schimb planul (ex: Un modul → Toate)?",
    a: "Da, oricând. Plătești doar diferența proporțional pe perioada rămasă. Trecerea de la Toate modulele la pachetul de 6 luni se face cu credit pentru zilele neutilizate.",
  },
  {
    q: "Pachetul de 6 luni se poate anula?",
    a: "Pachetul de 6 luni e plată unică, nerambursabilă. Te avantajează doar dacă te angajezi pe termen mediu — altfel începe cu un plan lunar și încearcă mai întâi primele 2 lecții gratis.",
  },
  {
    q: `Cum aleg modulul pentru planul „Un modul"?`,
    a: "La înscriere alegi: Python, SQL sau Networking. Poți schimba modulul o dată pe lună din Setări → Abonament, fără cost adițional.",
  },
  {
    q: "Acceptați transfer bancar?",
    a: "Da, pentru pachetul de 6 luni și plăți anuale prefacturate. Pentru abonamentele lunare, acceptăm doar card. Detaliile transferului apar în pagina de plată.",
  },
  {
    q: "Voucher-ele Certiport sunt incluse în preț?",
    a: "Nu. InfoBac te pregătește, dar voucher-ele Certiport (≈30–40 EUR/buc) se cumpără separat de la centrul de testare. Avem ghid pas-cu-pas când ești gata să programezi examenul.",
  },
  {
    q: "Există reducere pentru elevi cu venituri mici?",
    a: "Da, avem un program de burse parțiale pentru elevi cu situație financiară dificilă. Trimite-ne pe email un mesaj scurt cu situația ta și primești răspuns în 48h. Nu cerem documente oficiale — ne bazăm pe încredere.",
  },
] as const;

