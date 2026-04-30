# InfoBac.md

> Platformă online de pregătire pentru certificările Certiport care echivalează nota 10 din oficiu la BAC informatică în Republica Moldova.

Construită pentru elevi care vor rezultatul, dar nu-și permit cele ~1.000 EUR cerute de platformele fizice. Trei cursuri (**Python → SQL → Networking**), programa exactă a examenelor Certiport IT Specialist, simulări identice cu examenul real, și suport 24/7.

---

## Stack

| Layer | Tehnologie | Notă |
|---|---|---|
| Framework | **Next.js 16** App Router + Turbopack | RSC by default, Server Actions pentru mutații |
| Limbaj | TypeScript strict | fără `any`, fără `@ts-ignore` |
| Styling | **Tailwind CSS v4** + `tw-animate-css` | config CSS-first via `@theme` în `globals.css` (nu `tailwind.config.ts`) |
| UI | **shadcn/ui** preset `base-nova` peste **Base UI v1.4** | nu Radix — vezi [decizii](#decizii-de-design) |
| Iconuri | `lucide-react` v1.14 + SVG custom pentru brand | lucide nu mai are brand icons (Instagram/YouTube/etc) |
| Auth + DB | **Supabase** (`@supabase/ssr`) | Postgres + RLS pe toate tabelele |
| Email | **Resend** + `@react-email/components` | 5 template-uri tranzacționale |
| Forms | `react-hook-form` + `zod` v4 | Server Actions cu validare server-side |
| Animații | CSS Keyframes (definite în `globals.css`) | fără framer-motion (overhead) |
| Hosting | **Vercel** | edge runtime pentru OG image |

---

## Structură pagini

**25 routes** total — 9 marketing publice, 5 auth, 7 (app) autenticate, 4 utilități (sitemap, robots, OG, callback).

```
Marketing (public, static):
  /                                Homepage 8 secțiuni
  /preturi                         Pricing + tabel comparativ + FAQ
  /cursuri                         Programa Python / SQL / Networking
  /faq                             10 întrebări accordion
  /despre                          Manifesto + valori + echipă
  /contact                         Form RHF + zod + Resend
  /legal/termeni                   Draft termeni MD-specific
  /legal/confidentialitate         Draft GDPR + Legea 133/2011 RM

Auth (public):
  /login                           Email/password + Google OAuth
  /inregistrare                    + plan preselectat din pricing
  /resetare-parola                 Request link
  /resetare-parola/noua            Set parolă nouă (post-callback)
  /confirmare-email                Landing post-signup
  /auth/callback                   PKCE exchange (OAuth + email confirm + reset)

App (auth-only, gated by proxy.ts):
  /dashboard                       Overview + cursuri + status
  /curs/[slug]                     Listă lecții + quiz-uri
  /curs/[slug]/lectia/[id]         Markdown render + mark complete
  /quiz/[id]                       Quiz player + scoring
  /progres                         4 stat cards + agregat
  /abonament                       Status + istoric + cross-sell
  /setari                          Form profile

Utility:
  /sitemap.xml                     SEO
  /robots.txt                      SEO
  /opengraph-image                 OG generated at edge
```

---

## Quickstart

Necesită **Node.js ≥20** și **npm ≥10**.

```bash
git clone <repo-url> infobac.md
cd infobac.md
npm install
cp .env.example .env.local
# editezi .env.local — vezi „Setup" mai jos
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

### Mod Preview (recomandat la prima rulare)

Lasă `NEXT_PUBLIC_PREVIEW_MODE=1` în `.env.local` (e default în `.env.example`). **Înainte de a configura Supabase**, vei vedea:

- Toate paginile marketing publice
- UI-ul auth cu banner explicativ
- Toate paginile autenticate (`/dashboard`, `/curs/python`, etc.) cu **mock data realistă** (Andrei Preview, Standard trialing, 3 cursuri cu progres mixt)
- Banner sticky sus „Mod Preview — date demo"

Util pentru design review, screenshots, demo pentru parteneri. Auto-disable când Supabase e configurat (real data câștigă).

### Email templates preview

```bash
npx react-email dev --dir=emails
```

Deschide `http://localhost:3001` pentru a vedea cele 5 template-uri (Welcome, ConfirmEmail, ResetPassword, PaymentSuccess, SubscriptionExpiring) cu hot-reload.

---

## Setup complet (production)

### 1. Supabase (Auth + DB + Storage)

**a. Creează un proiect.**

1. Mergi la [supabase.com/dashboard](https://supabase.com/dashboard) → New Project.
2. Region: **Europe (Frankfurt sau Ireland)** — cel mai aproape de utilizatorii din MD.
3. Copy din `Project Settings → API`:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon public)
   - `SUPABASE_SERVICE_ROLE_KEY` (**secret server-side**, nu îl expune browser-ului)

Pune-le în `.env.local`. Setează `NEXT_PUBLIC_PREVIEW_MODE=0` ca să folosești date reale.

**b. Conectează CLI-ul + push migrations.**

```bash
npx supabase login
npx supabase link --project-ref <project-ref>     # din URL: <project-ref>.supabase.co
npx supabase db push                              # rulează migrations 0001 + 0002
```

Apoi seed (pentru cele 3 cursuri + lecții placeholder + quiz-uri practice):

```bash
psql "$(npx supabase db dump --db-url-only 2>/dev/null)" -f supabase/seed.sql
# sau folosește SQL Editor din Studio și paste conținutul seed.sql
```

**c. Activează Google OAuth (opțional).**

Supabase Dashboard → `Authentication → Providers → Google` → activate, paste Client ID + Secret de la [console.cloud.google.com](https://console.cloud.google.com).

Authorized redirect URI (în Google Console):
```
https://<project-ref>.supabase.co/auth/v1/callback
```

**d. Setează URL-ul site-ului.**

`Authentication → URL Configuration`:
- Site URL: `https://infobac.md` (sau preview URL Vercel)
- Redirect URLs: include `https://infobac.md/auth/callback` și preview URL-uri

### 2. Cum atribui un curs unui user

**Modelul nostru: `course_access` e sursa de adevăr** pentru drepturi (decuplată de `subscriptions`). Asta îți permite să atribui:
- Un singur curs (Networking standalone, ex.) sau
- Toate 3 (când userul cumpără Standard/Lifetime)

Fără să atingi schema.

**Atribuire via SQL Editor (Supabase Studio):**

```sql
-- Atribuire un singur curs (Python), lifetime, manual
insert into public.course_access (user_id, course_id, source, note)
select 'XXX-user-uuid-XXX', id, 'manual', 'Bursă parțială'
from public.courses
where slug = 'python'
on conflict (user_id, course_id) do update
  set expires_at = null, source = excluded.source, note = excluded.note;

-- Atribuire toate 3 cursurile (echivalent plan Standard/Lifetime)
insert into public.course_access (user_id, course_id, source)
select 'XXX-user-uuid-XXX', id, 'manual'
from public.courses
on conflict (user_id, course_id) do nothing;

-- Atribuire cu expirare (de ex. abonament lunar care expiră în 30 zile)
insert into public.course_access (user_id, course_id, source, expires_at)
select 'XXX-user-uuid-XXX', id, 'subscription', now() + interval '30 days'
from public.courses
where slug in ('python', 'sql');
```

**User UUID** îl găsești în Studio → `Authentication → Users` (coloana ID).

**RLS automat aplicat:** lecțiile premium (3+) și quiz-urile `exam_simulation` devin vizibile pentru user. Primele 2 lecții ale fiecărui curs rămân **întotdeauna preview public** (gateway pentru conversie), indiferent de acces.

**Revocare:**
```sql
delete from public.course_access
where user_id = 'XXX-user-uuid-XXX' and course_id = (select id from courses where slug = 'python');

-- sau: setează expires_at în trecut
update public.course_access set expires_at = now() - interval '1 minute'
where user_id = 'XXX-user-uuid-XXX' and course_id = (select id from courses where slug = 'python');
```

### 3. Resend (transactional email)

**a. Creează cont + API key.**

[resend.com](https://resend.com) → API Keys → Create. Pune în `.env.local`:

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@infobac.md
RESEND_FROM_NAME=InfoBac
```

**b. Verifică domeniul.**

Resend Dashboard → Domains → Add Domain → `infobac.md`. Adaugi DNS records (SPF + DKIM) la registrarul de domenii. Fără asta, emailurile ajung în spam.

**c. (Opțional, recomandat) Custom SMTP în Supabase pentru a folosi template-urile noastre.**

By default, Supabase trimite confirm email + reset password cu template-urile lui generice. Ca să folosească Welcome / ConfirmEmail / ResetPassword din `/emails` (cu branding InfoBac):

Supabase Dashboard → `Authentication → Email → SMTP Settings`:
- Host: `smtp.resend.com`
- Port: `465`
- User: `resend`
- Pass: `<RESEND_API_KEY>`
- From: `InfoBac <hello@infobac.md>`

Apoi în `Email Templates` poți copia HTML-ul template-urilor noastre (le rulezi `npx react-email export --dir=emails` să exporți HTML-ul build-uit).

### 4. Vercel deployment

```bash
npm install -g vercel
vercel link                                       # leagă local de un proiect Vercel
vercel env pull .env.local                       # sync env vars de pe Vercel local (opțional)
```

Sau prin dashboard: import-ezi repo-ul, Vercel detectează automat Next.js.

**Env vars pe Vercel** (Settings → Environment Variables):

```env
NEXT_PUBLIC_SITE_URL=https://infobac.md
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...           # secret, NU expune browser
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@infobac.md
RESEND_FROM_NAME=InfoBac
NEXT_PUBLIC_PREVIEW_MODE=0                  # OFF în production, mereu
```

**Domeniu custom**: Settings → Domains → adaugă `infobac.md` și `www.infobac.md`. Vercel îți dă DNS records.

**Deploy**: `git push` → preview URL automat per branch, production deploy la merge pe `main`.

---

## Decizii de design

Câteva alegeri de stack pe care e bine să le ai în vedere:

### Tailwind v4 — config CSS-first, nu `tailwind.config.ts`

Toată paleta + design tokens trăiesc în `app/globals.css` via `@theme` și CSS variables `:root` / `.dark`. Nu există `tailwind.config.ts` — încearcă să-l creezi și nu va fi citit. Adaugă tokens noi acolo.

### Base UI v1.4, nu Radix UI

Versiunea `shadcn@latest` în 2026 folosește **preset `base-nova`** peste `@base-ui/react`. Diferențe practice față de Radix:

- **`asChild` nu există** — folosește `buttonVariants()` direct pe `<Link>`, sau `render={<Button />}` prop pe primitive (vezi `components/ui/sheet.tsx` ca exemplu).
- Prop `multiple` pentru Accordion (nu `openMultiple`).
- DropdownMenu trigger e button nativ, nu Slot — apply class direct.

### Quote-urile tipografice românești în string-uri TS

Caracterul `„` (U+201E) și `"` (U+201D) sunt unicode separate. **Dar** când scrii `"Ceva „de exemplu" aici"` într-un literal delimitat cu ASCII `"`, anumite tooluri normalizează quote-urile și parser-ul TS rupe string-ul. Soluție: pentru orice string TS care conține citate românești, **folosește backticks** (`` `…` ``).

### Server Components by default

Toate paginile sunt RSC. Folosim `"use client"` doar când e absolut necesar:
- Form-uri cu state (`react-hook-form`)
- Hooks (`useTheme`, `usePathname`, `useTransition`)
- Event handlers care trigger UI updates

Mutații → **Server Actions** (`lib/actions/*.ts`), nu API routes. Mai sigur (RSC body-ul nu ajunge în bundle), mai puțin cod.

### `course_access` decuplat de `subscriptions`

`subscriptions` = billing tracking (plan, status, perioadă).
`course_access` = sursa de adevăr pentru drepturi.

Asta îți permite să atribui un singur curs (gift, scholarship, manual) fără să creezi un "plan fals". Un user poate avea **0 subscriptions și 1 course_access** — perfect valid.

---

## Convenții de cod

- **Imperative-mood** pentru commits: `feat: add pricing toggle`, `fix: handle empty lessons array`.
- **Server-only files** au `import "server-only"` la top (toate `lib/queries/*`, `lib/resend.ts`).
- **Components colocated**: shadcn în `components/ui/`, marketing în `components/marketing/`, app authenticated în `components/app/`, shared în `components/shared/`.
- **Validări**: zod schemas în `lib/validations.ts`, una singură per form. Server Actions folosesc `safeParse`.
- **Toast**: `sonner` peste tot (configurat în root layout). `toast.success | error | message`.
- **Locale-aware formatting**: `Intl.NumberFormat("ro-MD")`, `toLocaleDateString("ro-MD")`. Nicio dată hardcodată.

---

## Scripts npm

```bash
npm run dev      # Dev server cu Turbopack pe :3000
npm run build    # Production build (verifică TS strict + prerendering)
npm run start    # Production server local
npm run lint     # ESLint flat config (eslint.config.mjs)
```

---

## Probleme cunoscute / TODO

- **Testimoniale homepage** sunt placeholder explicit marcate (`placeholder: true` în `lib/content.ts`). Înlocuiește cu mărturii reale după primii absolvenți (sesiunea iunie 2026).
- **Documente legal** (`/legal/termeni` și `/legal/confidentialitate`) sunt drafts cu banner `Draft`. **Trebuie revizuite de avocat** specializat în drept digital MD înainte de lansarea comercială.
- **Conținut lecții/quiz-uri** real e gol — seed-ul are doar placeholdere. Echipa adaugă conținutul când e gata; structura DB e pregătită.
- **Billing real (Stripe / NetEase / etc)** nu e wired up — `subscriptions` se populează manual sau prin webhook. Plata reală e următorul mare milestone.
- **i18n RU/EN** — selector limbă în footer e disabled (placeholder). Folosește `next-intl` sau `next/navigation` cu `[locale]` segment dynamic când e nevoie.

---

## Licență

Cod proprietar © 2026 InfoBac. Acest repo nu e open source.

Dependințe open source (Next.js, React, Tailwind, Base UI, Supabase, Resend) sunt sub licențele lor proprii — vezi `package-lock.json`.
