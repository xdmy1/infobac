═══════════════════════════════════════════════════════════════
PROIECT: InfoBac.md — Platformă pregătire BAC informatică Moldova
═══════════════════════════════════════════════════════════════

Construiește un SaaS complet, production-ready, cu Next.js 14+ App Router, 
Tailwind CSS, Supabase (auth + DB), Resend (email transactional), shadcn/ui.

Asset-uri deja prezente în root:
- logo.svg (sau .png) — folosește pentru navbar, footer, emails
- favicon.ico — folosește pentru metadata

Domeniul va fi cumpărat ulterior — folosește placeholder "infobac.md" peste tot, 
în config-uri să fie ușor de schimbat (variabilă env NEXT_PUBLIC_SITE_URL).

═══════════════════════════════════════════════════════════════
1. CONTEXTUL BUSINESSULUI (citește înainte de orice cod)
═══════════════════════════════════════════════════════════════

PRODUS: Platformă online de pregătire pentru certificările Certiport 
(IT Specialist) care echivalează nota 10 din oficiu la BAC informatică în MD.

PROBLEMA REZOLVATĂ:
Platformele fizice din MD percep ~1000 EUR pentru pregătire — 10 luni de 
cursuri, o dată pe săptămână. Mulți elevi capabili nu-și permit. 
InfoBac costă 25–50 EUR/lună sau 100 EUR lifetime access.

PUBLIC ȚINTĂ:
- Liceeni 16-19 ani (clasele 11-12) din Moldova
- Părinții lor (decision-makers pe partea financiară)

CE ÎNVĂȚĂM (PATHWAY OFICIAL):
1. Python (limbaj de programare) — 4-6 săptămâni pregătire
2. Databases / SQL (baze de date) — 3-4 săptămâni
3. Networking / Devices (structura calculatorului) — 1 săptămână, 
   cel mai ușor, "îl înveți într-o zi dacă te concentrezi"

Această ordine (Python → SQL → Networking) e PATHWAY-UL OFICIAL al platformei.
Trebuie comunicată clar pe homepage.

DIFERENȚIATORI CHEIE (FOARTE IMPORTANT pentru copy):
- Construit de elevi pentru elevi — fondatorul a luat el însuși cele 3 
  certificări (unii chiar într-o săptămână au reușit toate 3)
- Programa de învățare strict necesară — "nimic mai mult, nimic mai puțin"
- Teste șablon exact ca la examenele Certiport reale
- Monitorizare puncte forte / puncte slabe per utilizator
- Suport 24/7
- 100% online, în ritmul tău
- Toate funcționalitățile de care ai nevoie, fără filler

PLANURI DE PREȚURI (cu MDL ca primary, EUR ca echivalent informativ):
- Basic: 499 MDL/lună (~25 EUR) — acces materiale + quiz-uri
- Standard: 899 MDL/lună (~45 EUR) — tot Basic + simulări complete + 
  monitorizare progres + suport 24/7 [RECOMANDAT — highlighted]
- Lifetime: 1.999 MDL one-time (~100 EUR) — tot Standard, plată unică, 
  acces pe viață [BEST VALUE — highlighted secondar]

LOCAȚIE: Chișinău, Moldova (afișează în footer, contact, schema.org).

═══════════════════════════════════════════════════════════════
2. INSPIRAȚIE DESIGN (referințe vizuale)
═══════════════════════════════════════════════════════════════

Înainte să generezi orice cod de UI, gândește-te la design-urile acestor 
platforme/site-uri ca referință mentală (NU le copia 1:1, inspiră-te din 
calitatea lor):

- linear.app — pentru clean, dark mode, micro-interactions
- vercel.com — pentru tipografie crisp, layout aerisit
- resend.com — pentru aesthetic modern minimalist
- brilliant.org — singura referință pură edu, pentru gamification subtle
- duolingo.com (homepage, NU app-ul) — pentru tone of voice prietenos
- arc.net — pentru landing page bold, viral
- railway.app — pentru cards și pricing tables

CE NU VREM (anti-patterns de evitat):
- NU stock photos cu studenți zâmbind cu laptop
- NU iconuri 3D fluffy gen Hostinger / Bluehost
- NU gradient backgrounds violet/roz (cliché startup 2021)
- NU "AI-generated look" — neon glows, geometric mesh excesiv, lens flares
- NU layout-uri tipice Bootstrap din 2018
- NU emojis peste tot (1-2 strategic e ok, nu 20)

CE VREM:
Design care arată că a fost făcut de un developer cu gust în 2026. 
Tipografie aerisit, alb mult, accent-uri precise, micro-interactions 
subtile, dark mode nativ, performant.

═══════════════════════════════════════════════════════════════
3. STACK TEHNIC
═══════════════════════════════════════════════════════════════

FRAMEWORK & RUNTIME:
- Next.js 14+ App Router (toate paginile Server Components by default, 
  Client Components doar unde absolut necesar)
- TypeScript strict mode
- React 19 (dacă disponibil) sau 18

STYLING:
- Tailwind CSS v3 (cu CSS variables pentru theming)
- shadcn/ui pentru toate componentele de bază — instalează: 
  button, card, badge, dialog, sheet, accordion, tabs, separator, 
  input, label, textarea, toast (sonner), dropdown-menu, navigation-menu, 
  avatar, progress, skeleton, alert, form
- lucide-react pentru iconuri (NU folosi Heroicons sau alte librării)
- framer-motion DOAR pentru animații strategice (hero entrance, 
  card hover) — nu peste tot
- next/font pentru Inter (variable font)

BACKEND & DATE:
- Supabase pentru Auth (email/password + Google OAuth) + Postgres DB + 
  Storage pentru materiale lecții
- Folosește @supabase/ssr pentru server-side auth în Next.js App Router 
  (NU @supabase/auth-helpers-nextjs care e deprecated)
- Row Level Security (RLS) activat pe TOATE tabelele
- Server Actions pentru mutații (form submissions)

EMAIL:
- Resend pentru toate emailurile transactional
- React Email pentru template-uri (în /emails folder)
- Emailuri de configurat:
  * Welcome (după înregistrare)
  * Confirmare email (cu link de verificare)
  * Resetare parolă
  * Notificare plată reușită
  * Notificare expirare abonament (3 zile înainte)
  * Notificare reactivare cont

VALIDARE:
- Zod pentru toate schema-urile
- React Hook Form + zodResolver pentru formulare

DEPLOYMENT:
- Configurat pentru Vercel (vercel.json dacă e necesar)
- Variables de mediu documentate în .env.example

═══════════════════════════════════════════════════════════════
4. DESIGN SYSTEM (definește în tailwind.config.ts și globals.css)
═══════════════════════════════════════════════════════════════

PALETĂ DE CULORI (CSS variables în globals.css, both light + dark):

Light mode:
--background: #FAFAF9 (stone-50)
--surface: #FFFFFF
--foreground: #0F172A (slate-900)
--muted-foreground: #64748B (slate-500)
--border: #E2E8F0 (slate-200)
--primary: #4F46E5 (indigo-600)
--primary-foreground: #FFFFFF
--primary-hover: #4338CA (indigo-700)
--accent: #84CC16 (lime-500)
--accent-foreground: #0F172A
--accent-hover: #65A30D (lime-600)
--success: #10B981
--warning: #F59E0B
--destructive: #EF4444
--ring: #4F46E5 (focus ring)

Dark mode (clasa .dark pe html):
--background: #0F172A (slate-900)
--surface: #1E293B (slate-800)
--foreground: #F8FAFC (slate-50)
--muted-foreground: #94A3B8 (slate-400)
--border: #334155 (slate-700)
--primary: #6366F1 (indigo-500, ușor mai luminos pe dark)
--accent: #A3E635 (lime-400, ușor mai luminos pe dark)
... (ajustează corespunzător)

TIPOGRAFIE:
- Font primary: Inter Variable (de la Google Fonts via next/font)
- Importat în app/layout.tsx, aplicat pe <body>
- Font feature settings: 'cv11', 'ss01' pentru estetică modernă
- Scale: respectă scale-ul Tailwind default

H1 hero: text-5xl md:text-6xl lg:text-7xl, font-bold, tracking-tight, 
         leading-[1.05]
H1 normal: text-4xl md:text-5xl, font-bold, tracking-tight
H2: text-3xl md:text-4xl, font-bold, tracking-tight
H3: text-xl md:text-2xl, font-semibold
Body: text-base md:text-lg, leading-relaxed
Small: text-sm, text-muted-foreground

LAYOUT:
- Container: max-w-6xl mx-auto px-4 md:px-6 lg:px-8
- Section padding: py-20 md:py-28 lg:py-32
- Grid gaps: gap-6 md:gap-8

RADII:
- Default: rounded-lg (8px) pentru butoane
- Cards: rounded-xl (12px) sau rounded-2xl (16px) pentru hero cards
- Pills/badges: rounded-full

SHADOWS:
- shadow-sm pentru elevation 1 (carduri default)
- shadow-md pentru hover/dropdowns
- evită shadow-lg+ (devine cheap)
- Preferă borders pentru depth: border border-border

ANIMAȚII:
- Tranziții default: duration-200 ease-out
- Hover butoane: scale-[1.02] + brightness-110
- Hero entrance: opacity 0→1 + translateY 8px→0, duration 0.4s, 
  staggered children (delay 0.05s între elemente)
- Scroll reveals: doar pe primele 2 secțiuni, restul instant pentru perf

═══════════════════════════════════════════════════════════════
5. STRUCTURĂ FIȘIERE
═══════════════════════════════════════════════════════════════

infobac/
├── app/
│   ├── (marketing)/           # Pagini publice
│   │   ├── layout.tsx         # Navbar + Footer marketing
│   │   ├── page.tsx           # HOMEPAGE — start aici
│   │   ├── preturi/page.tsx
│   │   ├── cursuri/page.tsx
│   │   ├── despre/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   └── legal/
│   │       ├── termeni/page.tsx
│   │       └── confidentialitate/page.tsx
│   ├── (auth)/                # Pagini auth
│   │   ├── layout.tsx         # Layout minimal centrat
│   │   ├── login/page.tsx
│   │   ├── inregistrare/page.tsx
│   │   ├── confirmare-email/page.tsx
│   │   ├── resetare-parola/page.tsx
│   │   └── auth/callback/route.ts  # OAuth callback
│   ├── (app)/                 # Pagini app autentificate
│   │   ├── layout.tsx         # Sidebar + main
│   │   ├── dashboard/page.tsx
│   │   ├── curs/[slug]/page.tsx
│   │   ├── curs/[slug]/lectia/[id]/page.tsx
│   │   ├── quiz/[id]/page.tsx
│   │   ├── progres/page.tsx
│   │   ├── abonament/page.tsx
│   │   └── setari/page.tsx
│   ├── api/                   # API routes (minim, preferă Server Actions)
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Tailwind + CSS vars
│   └── not-found.tsx          # 404 custom
├── components/
│   ├── ui/                    # shadcn components
│   ├── marketing/             # Componente landing
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── pathway.tsx        # Secțiunea Python→SQL→Networking
│   │   ├── why-us.tsx
│   │   ├── features.tsx
│   │   ├── pricing.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq-section.tsx
│   │   └── cta-final.tsx
│   ├── app/                   # Componente dashboard
│   │   ├── sidebar.tsx
│   │   ├── lesson-player.tsx
│   │   ├── quiz-player.tsx
│   │   ├── progress-card.tsx
│   │   └── ...
│   └── shared/
│       ├── theme-toggle.tsx
│       └── logo.tsx
├── emails/                    # React Email templates
│   ├── welcome.tsx
│   ├── confirm-email.tsx
│   ├── reset-password.tsx
│   ├── payment-success.tsx
│   └── subscription-expiring.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── middleware.ts      # Refresh session
│   ├── resend.ts
│   ├── utils.ts               # cn() etc
│   ├── validations.ts         # Zod schemas
│   └── constants.ts           # Plans, content data
├── public/
│   ├── logo.svg               # ALREADY IN ROOT, mută aici
│   └── favicon.ico            # ALREADY IN ROOT, mută aici
├── middleware.ts              # Next middleware (auth refresh)
├── tailwind.config.ts
├── next.config.mjs
├── .env.example
└── README.md

═══════════════════════════════════════════════════════════════
6. HOMEPAGE — STRUCTURĂ COMPLETĂ (cea mai importantă pagină)
═══════════════════════════════════════════════════════════════

NAVBAR (sticky, blur backdrop pe scroll):
- Logo stânga (folosește /logo.svg, înălțime 32px)
- Mijloc: Cursuri | Pathway | Prețuri | FAQ
- Dreapta: Theme toggle | Login (ghost) | "Începe acum" (primary)
- Mobile: hamburger → Sheet din dreapta

═══ HERO ═══
Background: subtle dot grid pattern peste --background, fade radial spre 
margini. Sau radial gradient foarte subtle indigo în top-center.

Badge sus: 
"🇲🇩 Făcut în Chișinău de elevi care au luat 10"
(badge cu border subțire, text mic)

H1 (mare, bold, tracking tight):
"10 din oficiu la BAC informatică.
Fără să dai 1000 EUR."
("10" wrapped în span text-accent — lime)

Subtitle (text-xl, max-w-2xl, text-muted):
"Platforma online cu programa exactă pentru certificările Certiport. 
Construită de elevi care au trecut prin asta — unii au luat toate 3 
certificările într-o săptămână."

CTA group:
- Primary: "Începe gratuit 7 zile →" (size lg)
- Ghost: "Vezi cum funcționează" (cu icon ArrowDown subtil)

Sub CTA-uri, trust indicators (flex, gap-6, text-sm muted):
✓ Acceptat oficial de MEC
✓ 3 certificări internaționale
✓ Acces 24/7

Visual right side (hidden mobile, vizibil lg+):
Mockup browser cu screenshot din dashboard (creează cu CSS — fereastră cu 
3 puncte mac stil, conținut cu sidebar + main area schematic, NU imagine 
reală încă). Pe carduri afișate să fie "Python: 87%", "SQL: 64%", 
"Networking: 12%".

═══ SECȚIUNE: "DE CE INFOBAC?" (problem/solution) ═══
Heading: "1.000 EUR pentru 10 luni de cursuri o dată pe săptămână?
Asta e nebunesc."

Sub-heading: "Iată ce primești cu InfoBac în schimb."

Tabel comparativ side-by-side (2 coloane mari pe desktop, stacked mobile):

Coloana stângă (gri, subtil "crossed out feel"):
"Platforme fizice din MD"
✗ ~1.000 EUR per program
✗ 10 luni, o singură ședință pe săptămână
✗ Trebuie să vii fizic în Chișinău
✗ Profesori care n-au dat examenul recent
✗ Materiale generice
✗ Timpul tău e legat de programul lor

Coloana dreaptă (highlighted, border indigo, bg subtle):
"InfoBac"
✓ De la 25 EUR/lună sau 100 EUR lifetime
✓ Înveți în ritmul tău, oricând
✓ 100% online, de oriunde din MD
✓ Făcut de elevi care au luat 10 acum câteva luni
✓ Programa exactă — nimic mai mult, nimic mai puțin
✓ Tu controlezi când și cât înveți

═══ SECȚIUNE: "PATHWAY-UL TĂU" ═══
Heading: "3 certificări. 1 ordine inteligentă. Nota 10."

Sub: "Le poți face în orice ordine, dar noi recomandăm asta — pentru că 
am testat-o pe noi:"

Timeline horizontal (desktop) / vertical (mobile), 3 carduri conectate cu 
linie subțire:

CARD 1: 🐍 Python
Subtitle: "4–6 săptămâni"
Descriere scurtă: "Începem cu programarea — limbajul de bază. Sintaxă, 
structuri de control, funcții, OOP minimal. Tot ce-ți trebuie pentru 
examenul A."
Tag: "Cel mai important"

CARD 2: 🗄️ Databases / SQL
Subtitle: "3–4 săptămâni"
Descriere: "Baze de date relaționale, SQL, normalizare, JOIN-uri. 
Nu te speria — e mai logic decât pare după ce vezi exemple."
Tag: "Logic și frumos"

CARD 3: 🖥️ Networking & Devices
Subtitle: "1 zi (serios)"
Descriere: "Structura calculatorului și rețele. E cel mai ușor — îl 
înveți într-o zi dacă te concentrezi. Memorare + înțelegere de bază."
Tag: "Quick win"

Sub timeline, micro-text:
"Timpul total estimat: 6–10 săptămâni. Mai puțin dacă ai deja bază."

═══ SECȚIUNE: "CE PRIMEȘTI" (features grid) ═══
Heading: "Tot ce-ți trebuie. Nimic în plus."

Grid 3x2 (sau 2x3 mobile), fiecare card cu icon lucide + titlu + 1-2 
propoziții:

1. 📚 Programa exactă
"Doar materialele care apar la Certiport. Fără filler academic."

2. 🎯 Teste șablon ca la examen
"Simulări identice cu examenele reale Certiport. Fără surprize în ziua X."

3. 📊 Monitorizare progres
"Vezi exact ce subiecte îți sunt slabe. Concentrează-te acolo."

4. 🆘 Suport 24/7
"Întrebare la 2 noaptea? Răspuns în câteva ore. Suntem real, nu chatbot."

5. 👥 Făcut de elevi pentru elevi
"Am dat aceleași examene anul trecut. Știm ce funcționează."

6. ⚡ În ritmul tău
"Acces instant. Învață într-o lună sau în 6. Tu decizi."

═══ SECȚIUNE: "PRICING" ═══
Heading: "Alege ce ți se potrivește."
Sub: "Toate planurile includ acces complet. Diferența e doar cum plătești."

Toggle (opțional): "Lunar | Lifetime" — la lifetime, ascunde primele 2 și 
arată doar lifetime cu evidență.

3 carduri pricing (pe desktop side-by-side, mobile stacked):

CARD 1: BASIC — 499 MDL/lună (≈25 EUR)
- Acces toate cele 3 module
- Materiale text + video
- Quiz-uri auto-evaluare
- Comunitate Telegram
CTA: "Alege Basic"

CARD 2 (HIGHLIGHTED, scale-105, border accent, badge "POPULAR"): 
STANDARD — 899 MDL/lună (≈45 EUR)
- Tot din Basic
- Simulări complete examene Certiport
- Monitorizare puncte forte/slabe
- Suport 24/7 prioritar
- Sesiuni Q&A live săptămânale
CTA: "Alege Standard" (primary)

CARD 3 (border accent secundar, badge "BEST VALUE"): 
LIFETIME — 1.999 MDL one-time (≈100 EUR)
- TOT din Standard
- Acces pe viață
- Update-uri gratuite la programa nouă
- Acces și pentru frați/surori (1 cont extra)
CTA: "Cumpără lifetime"

Sub carduri:
"Toate prețurile includ TVA (când va fi aplicabil). 
Plata e finală, nerambursabilă. Încearcă primele 2 lecții gratis înainte."

═══ SECȚIUNE: "TESTIMONIALE" ═══
Heading: "Elevi care au reușit."

Grid 3 carduri (sau carusel pe mobile). Pentru lansare, pune 3 placeholder-e 
realiste (poți marca clar "[Va fi înlocuit cu testimoniale reale]"):

Card format: avatar circular + nume + liceu/locație + rating stele + quote 
+ rezultat ("10 din oficiu - sesiunea iunie 2025")

═══ SECȚIUNE: "FAQ" ═══
Heading: "Întrebări frecvente."

Accordion cu 8-10 întrebări:
1. Cum echivalează Certiport BAC-ul exact?
2. Câte examene trebuie să dau pentru 10 din oficiu?
3. Unde dau examenele Certiport?
4. Cât costă voucher-ele Certiport (separat de InfoBac)?
5. Cât durează pregătirea?
6. Ce se întâmplă dacă nu trec un examen?
7. Pot să-mi anulez abonamentul oricând?
8. Aveți materiale și pentru clasa 11?
9. Cum plătesc dacă sunt minor?
10. Ce e Lifetime — chiar pe viață?

═══ SECȚIUNE FINAL CTA ═══
Background: subtle indigo gradient sau dot pattern.
H2: "Fă primul pas acum. 7 zile gratis."
Sub: "Nu cerem card. Te poți dezabona oricând."
Buton mare CTA: "Creează cont gratuit"

═══ FOOTER ═══
4 coloane (1 pe mobile):

Col 1: 
Logo + tagline scurt: "Pregătire BAC informatică pentru elevii din MD."
Socials: Instagram, TikTok, YouTube, Telegram (icons lucide)

Col 2: PRODUS
- Cursuri
- Prețuri
- Pathway
- FAQ

Col 3: COMPANIE
- Despre noi
- Blog
- Contact
- Carieră (placeholder)

Col 4: LEGAL
- Termeni și condiții
- Politica de confidențialitate

Bottom bar (separator):
"© 2026 InfoBac. Făcut cu ☕ în Chișinău, Moldova."
Selector limbă (placeholder pentru viitor): RO | RU | EN

═══════════════════════════════════════════════════════════════
7. SUPABASE — SCHEMA DB
═══════════════════════════════════════════════════════════════

Folosește Supabase migrations (în /supabase/migrations/). Generează SQL 
pentru:

TABEL: profiles
- id (uuid, PK, references auth.users)
- email (text, unique)
- full_name (text)
- avatar_url (text, nullable)
- school (text, nullable) — liceul
- grade (int, nullable) — clasa 11/12
- created_at (timestamptz, default now())
- updated_at (timestamptz)

TABEL: subscriptions
- id (uuid, PK)
- user_id (uuid, FK profiles)
- plan (enum: 'basic', 'standard', 'lifetime')
- status (enum: 'active', 'canceled', 'expired', 'trialing')
- current_period_start (timestamptz)
- current_period_end (timestamptz, nullable pentru lifetime)
- created_at, updated_at

TABEL: courses
- id (uuid, PK)
- slug (text, unique) — 'python', 'sql', 'networking'
- title (text)
- description (text)
- order_index (int) — 1, 2, 3 pentru pathway
- estimated_duration (text) — "4-6 săptămâni"
- difficulty (enum: 'easy', 'medium', 'hard')
- icon (text) — emoji sau lucide name

TABEL: lessons
- id (uuid, PK)
- course_id (uuid, FK courses)
- slug (text)
- title (text)
- content (text) — Markdown
- video_url (text, nullable)
- duration_minutes (int)
- order_index (int)
- created_at

TABEL: lesson_progress
- id (uuid, PK)
- user_id (uuid, FK)
- lesson_id (uuid, FK)
- completed_at (timestamptz, nullable)
- time_spent_seconds (int)
UNIQUE (user_id, lesson_id)

TABEL: quizzes
- id (uuid, PK)
- course_id (uuid, FK)
- title (text)
- type (enum: 'practice', 'exam_simulation')
- time_limit_minutes (int, nullable)
- passing_score (int, default 70)

TABEL: questions
- id (uuid, PK)
- quiz_id (uuid, FK)
- question_text (text)
- options (jsonb) — array de { id, text }
- correct_option_id (text)
- explanation (text)
- topic_tag (text) — pentru monitorizare puncte slabe

TABEL: quiz_attempts
- id (uuid, PK)
- user_id (uuid, FK)
- quiz_id (uuid, FK)
- started_at, completed_at
- score (int) — procent
- answers (jsonb) — { question_id: option_id }

RLS POLICIES:
- profiles: user poate citi/edita doar propriul profil
- subscriptions: user citește doar propriul abonament; INSERT/UPDATE doar 
  prin Server Actions cu service_role
- courses, lessons: SELECT public (cu condiție: user are abonament activ 
  pentru content premium; preview = primele 2 lecții per curs gratis)
- lesson_progress, quiz_attempts: user poate doar pe ale lui

INDEXES: pe toate FK-urile + pe slug-uri.

═══════════════════════════════════════════════════════════════
8. AUTH FLOW
═══════════════════════════════════════════════════════════════

ÎNREGISTRARE:
1. User completează: full_name, email, password (min 8 char), 
   confirmă termenii
2. Server Action: supabase.auth.signUp() cu emailRedirectTo către 
   /auth/callback
3. Trigger Postgres pe auth.users INSERT → creează rând în profiles
4. Resend trimite email "Confirmă-ți emailul" (template în /emails)
5. User click link → /auth/callback?code=... → exchange code → redirect 
   la /dashboard cu toast "Bun venit!"
6. Resend trimite email "Welcome" cu next steps

LOGIN:
- Email + password OR Google OAuth
- După login: redirect /dashboard

RESETARE PAROLĂ:
1. /resetare-parola — input email
2. supabase.auth.resetPasswordForEmail()
3. Resend custom template (NU folosi default Supabase)
4. User click link → /resetare-parola/noua → input parolă nouă

MIDDLEWARE:
- middleware.ts protejează /(app)/* — redirect /login dacă nu autentificat
- Refresh sesiune Supabase cu @supabase/ssr

═══════════════════════════════════════════════════════════════
9. RESEND — CONFIGURARE
═══════════════════════════════════════════════════════════════

Variabile env:
- RESEND_API_KEY
- RESEND_FROM_EMAIL=hello@infobac.md (după ce verifică domeniul)
- RESEND_FROM_NAME=InfoBac

În /lib/resend.ts: instanță Resend + helper functions sendEmail() care 
acceptă template name + props.

Template-uri React Email în /emails/:
- WelcomeEmail({ name })
- ConfirmEmail({ name, confirmUrl })
- ResetPasswordEmail({ name, resetUrl })
- PaymentSuccessEmail({ name, plan, amount })
- SubscriptionExpiringEmail({ name, daysLeft })

Branding email-uri:
- Logo în header (URL public din Supabase Storage)
- Paletă light mode (background alb, accent indigo)
- Font: -apple-system fallback (email clients nu suportă custom fonts bine)
- CTA buton primary indigo
- Footer cu adresă fizică (necesar legal): 
  "InfoBac • Chișinău, Moldova • hello@infobac.md"
- Link unsubscribe pentru emailurile de marketing (NU pentru transactional)

═══════════════════════════════════════════════════════════════
10. CONȚINUT INIȚIAL (seed data)
═══════════════════════════════════════════════════════════════

Creează seed.sql sau script TypeScript care populează DB cu:

3 cursuri:
- Python (slug: 'python', order: 1)
- SQL (slug: 'sql', order: 2)  
- Networking (slug: 'networking', order: 3)

Pentru fiecare, 5-8 lecții placeholder cu titlu real + content Lorem 
parțial (notă în content "[Conținut real va fi adăugat de echipă]").

Pentru fiecare curs, 1 quiz de practice + 1 simulare examen cu 5-10 
întrebări placeholder.

═══════════════════════════════════════════════════════════════
11. SEO & METADATA
═══════════════════════════════════════════════════════════════

În app/layout.tsx setează:
- Title template: "%s | InfoBac"
- Default title: "InfoBac — 10 din oficiu la BAC informatică"
- Description: "Platformă online de pregătire pentru certificările 
  Certiport. Acceptat oficial de MEC pentru echivalarea probei de 
  informatică la BAC. Făcut de elevi pentru elevi în Chișinău."
- Keywords: bac informatică moldova, certiport moldova, 10 din oficiu 
  bac, pregătire bac informatică, IT specialist certificare
- OG image (creează placeholder /public/og.png 1200x630)
- Twitter card
- canonical URLs
- robots.txt + sitemap.xml automat (next-sitemap)

Schema.org JSON-LD:
- Organization (Chișinău, MD)
- EducationalOrganization
- Course (per curs)

═══════════════════════════════════════════════════════════════
12. CHECKLIST FINAL DE LIVRARE
═══════════════════════════════════════════════════════════════

[ ] Proiect Next.js 14 inițializat cu TS, Tailwind, App Router
[ ] shadcn/ui instalat cu toate componentele necesare
[ ] Tailwind config cu paleta completă (light + dark)
[ ] globals.css cu CSS variables
[ ] Layout root + middleware auth
[ ] Supabase clients (browser + server)
[ ] Schema DB completă cu RLS policies
[ ] Seed data pentru cele 3 cursuri
[ ] Auth flow complet (signup, login, reset, callback, OAuth Google)
[ ] Toate paginile marketing din structură
[ ] HOMEPAGE 100% conform descrierii (toate 9 secțiuni)
[ ] Dashboard funcțional + 1 pagină curs + 1 lecție + 1 quiz
[ ] Pagini legal (Termeni + Confidențialitate cu conținut MD-specific)
[ ] Pagini auth toate
[ ] Resend integrat + 5 template-uri React Email
[ ] Logo.svg și favicon.ico mutate în /public/, folosite peste tot
[ ] Dark mode toggle funcțional
[ ] Responsive perfect 375px → 1920px
[ ] Loading states + skeleton-uri pe paginile cu DB fetch
[ ] Error boundaries pe paginile principale
[ ] .env.example cu toate variabilele documentate
[ ] README.md cu: ce e proiectul, cum pornești local, cum deploy pe 
    Vercel, cum configurez Supabase, cum configurez Resend
[ ] Lighthouse score 90+ pe homepage (test mental, nu rula efectiv)

═══════════════════════════════════════════════════════════════
13. ORDINEA DE EXECUȚIE (foarte important)
═══════════════════════════════════════════════════════════════

NU genera tot odată. Lucrează în această ordine:

PAS 1: Init Next.js + Tailwind + shadcn + structură foldere + 
       design system (tailwind.config + globals.css). 
       Confirmă cu mine înainte de pas 2.

PAS 2: Componente shared (Logo, ThemeToggle, Navbar, Footer) + 
       layout marketing.

PAS 3: HOMEPAGE completă, secțiune cu secțiune. Asta e prioritatea #1.
       După fiecare 3 secțiuni, oprește-te și raportează ce ai făcut.

PAS 4: Restul paginilor marketing (pricing, cursuri, despre, FAQ).

PAS 5: Supabase setup + schema + RLS + seed.

PAS 6: Auth flow complet + Resend + email templates.

PAS 7: Dashboard + pagini app (curs, lecție, quiz).

PAS 8: Pagini legal + 404 + final polish.

PAS 9: README + .env.example + deployment notes.

═══════════════════════════════════════════════════════════════
14. PRINCIPII DE LUCRU
═══════════════════════════════════════════════════════════════

- TypeScript strict — fără any, fără @ts-ignore
- Comenzi git: după fiecare pas major, commit cu mesaj convențional 
  (feat:, fix:, chore:)
- Comentarii: doar acolo unde codul nu e self-explanatory. NU comentarii 
  de "ce face funcția" — TypeScript-ul ăla e
- Componente: Server Components by default. Adaugă "use client" doar 
  când e necesar (state, event handlers, browser APIs)
- Performanță: <Image> de la next/image peste tot, lazy load, no CLS
- Accesibilitate: aria-labels, focus rings vizibile, keyboard navigation
- Securitate: NU expune service_role key către client. Foloseste 
  Server Actions pentru mutații sensibile.
- Erori: nu lăsa console.error fără handling. Folosește toast pentru 
  user feedback.

ÎNAINTE SĂ ÎNCEPI: confirmă-mi că ai înțeles structura, apoi întreabă-mă 
ce variabile de mediu am gata setate (Supabase URL, anon key, service 
role, Resend API key). Dacă nu le am încă, generează cod care funcționează 
și fără ele (cu fallback graceful) și documentează în README cum le 
setez.

START.