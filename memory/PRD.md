# Green Harvest — PRD

## Original problem statement
Create a clean Next.js 15 marketplace starter project named **GREEN HARVEST** using Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Supabase, Prisma, PostgreSQL. Setup: project structure, routing, layout system, navbar, footer, mobile responsive design, homepage skeleton, authentication pages, dashboard layout. **Do NOT generate advanced features yet.** Focus on scalable architecture and reusable components.

## Architecture decisions (locked)
- **Framework**: Next.js 15.0.3 App Router + TypeScript (strict)
- **Styling**: Tailwind 3.4 + CSS variables for theming, Shadcn UI primitives (new-york style, stone base)
- **Auth/BaaS**: Supabase via `@supabase/ssr` (browser + server clients ready)
- **ORM**: Prisma 5.22 with PostgreSQL provider
- **Fonts**: Fraunces (serif, distinctive) + Outfit (sans) via `next/font/google`
- **Icons**: Lucide React (no emoji)
- **Route groups**: `(marketing)`, `(auth)`, `(dashboard)` for layout isolation
- **Supervisor**: `yarn start` aliased to `next dev -H 0.0.0.0 -p 3000`

## Personas
- **Buyer** — Conscious eater wanting local, seasonal produce; uses marketing site + future cart.
- **Seller / Grower** — Small farm operator; uses dashboard to manage products, orders, payouts.
- **Admin** — Cooperative staff overseeing platform integrity (future).

## Core requirements (static)
1. Clean, scalable folder structure.
2. Reusable layout components (Navbar, Footer, Sidebar).
3. Mobile-responsive (sheet drawer for nav).
4. Homepage skeleton with hero, features, CTA.
5. Auth pages (login, register) with UI scaffolding only.
6. Dashboard layout with sidebar + topbar + overview page.
7. Prisma schema scaffold (Profile, Category, Product, Order, OrderItem).
8. Supabase client lib (browser + server, cookie-based SSR).

## What's been implemented (2026-01)
- ✅ Project bootstrap: package.json, tsconfig, next.config, tailwind, postcss, components.json, .env.example, .gitignore
- ✅ Root layout w/ Fraunces + Outfit font variables
- ✅ Earthy theme: cream background, moss primary, ember accent, soil dark CTA
- ✅ Shadcn primitives: button, input, label, card, separator, sheet
- ✅ Brand Logo (default + inverted variants)
- ✅ Navbar (sticky, blur, primary nav, basket icon, sign-in CTAs, mobile hamburger → Sheet)
- ✅ Footer (3-column links + social + legal row)
- ✅ Dashboard Sidebar (active state, role-agnostic nav)
- ✅ `(marketing)` route group: layout + homepage (hero / harvest list / 4 features / dark CTA)
- ✅ `(auth)` route group: split-pane layout + login + register
- ✅ `(dashboard)` route group: layout (sidebar + topbar w/ search & notif) + overview (4 stat cards + recent orders placeholder + coming-soon list)
- ✅ Custom 404 page
- ✅ Prisma schema: Profile (with `UserRole` enum), Category, Product, Order, OrderItem
- ✅ `lib/supabase/{client,server}.ts`, `lib/prisma.ts`, `lib/utils.ts`
- ✅ `data-testid` attributes on every interactive element + key UI nodes
- ✅ Mobile responsive verified (390px viewport + open mobile drawer)
- ✅ ESLint: clean

## Prioritized backlog
### P0 — Wire the scaffold (next session)
1. Hook real Supabase project credentials into `.env`; replace placeholder URL/keys.
2. Implement Supabase auth via server actions (sign-in, sign-up, sign-out) — **call integration_playbook_expert_v2 first**.
3. Add middleware to protect `(dashboard)/*` routes via Supabase session.
4. Seed Prisma database (`prisma migrate dev` + seed script).

### P1 — Marketplace features
5. Product list page `/market` (paginated, category filters).
6. Product detail page `/market/[slug]`.
7. Cart drawer + checkout flow (Stripe later).
8. Buyer order history page in dashboard.

### P2 — Polish & ops
9. Role-based dashboard (separate seller vs buyer routes).
10. Image upload to Supabase Storage for products.
11. Search (Postgres FTS or Algolia).
12. Email notifications (Resend) for order confirmations.

## Next tasks
- Confirm Supabase project credentials with user.
- Call `integration_playbook_expert_v2` for Supabase auth playbook before writing any auth logic.
- Build `/market` product listing once data is seeded.
