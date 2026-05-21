# Green Harvest

A clean **Next.js 15** marketplace starter — built for scale, ready to extend.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI primitives
- **Database**: PostgreSQL via Prisma
- **Auth / BaaS**: Supabase (SSR cookies via `@supabase/ssr`)
- **Icons**: Lucide

## Project structure

```
src/
├── app/
│   ├── (marketing)/        # Public-facing pages (homepage, etc.)
│   │   ├── layout.tsx      # Navbar + Footer
│   │   └── page.tsx        # Homepage skeleton
│   ├── (auth)/             # Login / Register
│   │   ├── layout.tsx      # Split-pane auth shell
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/        # Authenticated app
│   │   ├── layout.tsx      # Sidebar + topbar
│   │   └── dashboard/page.tsx
│   ├── globals.css
│   ├── layout.tsx          # Root layout (fonts, html)
│   └── not-found.tsx
├── components/
│   ├── brand/logo.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── dashboard-sidebar.tsx
│   └── ui/                 # Shadcn primitives
├── config/navigation.ts
└── lib/
    ├── prisma.ts
    ├── supabase/{client,server}.ts
    └── utils.ts
prisma/schema.prisma        # User / Product / Order models
```

## Getting started

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your **Supabase** project URL/keys and a **PostgreSQL** `DATABASE_URL`.

2. Install & generate Prisma client:
   ```bash
   yarn
   yarn prisma:generate
   ```

3. Run dev server:
   ```bash
   yarn dev
   ```

4. (Once you have a database connected)
   ```bash
   yarn prisma:migrate
   ```

## Conventions

- **Route groups** (`(marketing)`, `(auth)`, `(dashboard)`) separate layouts cleanly.
- Every interactive element ships with a `data-testid` for E2E testing.
- Tailwind CSS variables drive theming — switch palettes via `globals.css`.
- All env reads go through `process.env.NEXT_PUBLIC_*` (client) or `process.env.*` (server). No hardcoding.

## What's next

This starter intentionally stops at the **scaffold**. Suggested next milestones:
1. Wire Supabase Auth into `(auth)` pages (server actions).
2. Seed Prisma schema and connect dashboard widgets to real data.
3. Add product browsing, cart, and checkout flows.
4. Introduce role-based middleware (`buyer` / `seller` / `admin`).
