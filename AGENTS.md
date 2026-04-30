<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# InfoBac.md — project rules

Stack-specific gotchas you'll hit if you don't read this. Most of these have already burnt the parser or the build at least once.

## Stack at a glance

- **Next.js 16** App Router + Turbopack. Auth gating lives in `proxy.ts` (root) — NOT `middleware.ts`. The `middleware` filename is deprecated in 16.
- **Tailwind v4** with **CSS-first config**. There is no `tailwind.config.ts`. Design tokens live in `app/globals.css` under `@theme inline { … }` and CSS variables under `:root` / `.dark`. Adding tokens means editing CSS, not TS.
- **shadcn/ui preset `base-nova` over @base-ui/react** — not Radix UI. See "Base UI quirks" below.
- **TypeScript strict.** No `any`, no `@ts-ignore`. The `Database` type in `lib/supabase/types.ts` is hand-maintained (regenerate with `supabase gen types` once a real project exists).
- **React 19**, **zod v4**, **react-hook-form v7**.

## Base UI quirks (you WILL forget these)

`@base-ui/react` looks like Radix but isn't:

1. **No `asChild` prop on `Button`** (or other primitives). To render a Link styled as a button, use `buttonVariants()` directly:
   ```tsx
   <Link href="/x" className={cn(buttonVariants({ size: "lg" }))}>…</Link>
   ```
   For wrapping shadcn primitives in a custom element, the equivalent is `render={<MyComponent />}` — see `components/ui/sheet.tsx` for the pattern.

2. **Accordion uses `multiple={true|false}`**, not `openMultiple`. TS will catch it but the message is confusing.

3. **`DropdownMenuTrigger` is a native button by default** — apply `cn(buttonVariants(…))` directly to it, no nested Button.

## Quote characters in TS string literals

Romanian uses typographic quotes `„` (U+201E) and `"` (U+201D). When you write a TS string delimited with ASCII `"` that contains `…„text"…`, the closing curly quote can be interpreted as ASCII `"` and break the string. **Use backticks (`` `…` ``) for any string containing typographic quotes.** Inside JSX text content (`<p>…„x"…</p>`) it's fine — only string literals are at risk.

## Supabase types: `Relationships` is required

`Database["public"]["Tables"][...]` and `Views[...]` MUST include `Relationships: GenericRelationship[]` (or `[]`) — without it, `client.from(name).select(...)` returns `never[]` and the query result becomes unusable. The hand-maintained type in `lib/supabase/types.ts` already has this; if you add a new table, copy the pattern.

## Auth + access model

- `subscriptions` tracks billing (plan, status, period). Writes blocked from `authenticated` — only service_role / billing webhook writes here.
- **`course_access` is the source of truth** for "what can this user open". Per-(user × course) row. Allows assigning a single course (gift, scholarship, manual grant) without touching subscriptions.
- RLS on `lessons`, `quizzes`, `questions` calls `has_course_access(course_id)` — NOT `has_active_subscription()`. The latter still exists from migration 0001 but isn't used in policies anymore.
- First 2 lessons of every course (`order_index <= 2`) are public preview by RLS. Don't gate them at the app layer — let the DB do it.

## Routes & naming (Romanian)

URL paths are in Romanian, not English. When adding routes, mirror this:
- `/preturi` (NOT `/pricing`)
- `/cursuri` (NOT `/courses`)
- `/inregistrare` (NOT `/signup`)
- `/setari` (NOT `/settings`)

The `(marketing)`, `(auth)`, `(app)` route groups are intentional — each has its own layout (Navbar/Footer for marketing, centered card for auth, sidebar+topbar for app).

## Server Components by default; Server Actions for mutations

- Pages are RSC unless they need state/effects.
- Mutations live in `lib/actions/*.ts` files marked `"use server"`. NOT API routes.
- Server Actions return result objects (`{ ok: true, mode } | { ok: false, error, fieldErrors }`). Forms toast on error and reset on success. See `lib/actions/contact.ts`, `auth.ts`, `lesson.ts`, `quiz.ts`, `profile.ts`.
- Server Actions that successfully complete an auth/state transition use `redirect()` from `next/navigation` to navigate — NOT `router.push` (impossible from server).
- Validation: every Server Action calls `zSchema.safeParse(input)` first. Schemas in `lib/validations.ts`.

## Preview mode

`NEXT_PUBLIC_PREVIEW_MODE=1` + Supabase env vars MISSING = mock data served in `(app)` routes. Auto-disabled when Supabase is configured. The mock data lives in `lib/preview-mode.ts`. When adding a new query, ALSO add a preview-mode branch in the page (see how `app/(app)/dashboard/page.tsx` does it: `if (isPreviewMode) { use mock data } else { fetch real }`).

## Path conventions

- `lib/queries/*` — read-only data fetchers. All `import "server-only"`. Take a Supabase client as first argument.
- `lib/actions/*` — Server Actions. `"use server"` at file top.
- `lib/validations.ts` — single file with all zod schemas + types.
- `lib/content.ts` — single source of truth for marketing content (pathway, features, pricing, FAQ, testimonials). Edit here, not in components.
- `components/ui/*` — shadcn primitives (don't edit unless adding a variant).
- `components/marketing/*` — landing-page sections.
- `components/app/*` — authenticated UI (sidebar, dashboard cards, lesson player).
- `components/shared/*` — Logo, ThemeProvider, ThemeToggle, JsonLd, social-icons. Used across both groups.
- `emails/*` — React Email templates. Each exports `default` + `PreviewProps` for `react-email dev`.

## Don'ts

- Don't write `tailwind.config.ts`. It's not read.
- Don't reach for `framer-motion`. Animations live in `globals.css` `@keyframes` and are exposed as `animate-fade-up`, `animate-shimmer`, etc.
- Don't add brand icons via `lucide-react` — they removed brand icons in v1.x. Add SVG paths to `components/shared/social-icons.tsx`.
- Don't write API routes for mutations. Server Actions only.
- Don't disable RLS to "make it work" during dev — fix the policy or use service_role from server.
- Don't commit `.env.local`. `.gitignore` already excludes it.
