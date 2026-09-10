# Setura Employee Management

Lightweight HR, attendance and leave management for small teams (~20 employees).

## Stack

| Concern        | Choice                                          |
| -------------- | ----------------------------------------------- |
| Framework      | Next.js 15 (App Router), React 19, TypeScript    |
| Styling        | Tailwind CSS v4 (CSS-first config, no JS config) |
| UI             | Setura Base UI — our own components, no library  |
| Database       | Neon PostgreSQL via Drizzle ORM                  |
| Auth           | Better Auth (cookie sessions, email + password)  |
| Tables         | TanStack Table (logic only — markup is ours)     |
| Client state   | TanStack Query (interactive screens only)        |
| Validation     | Zod                                             |
| Dates          | date-fns                                        |
| File storage   | Cloudflare R2 (abstraction only, so far)         |

## Getting started

```bash
npm install
cp .env.example .env       # then fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run db:push            # create the tables
npm run db:seed            # optional: 5 departments, 4 leave types, 20 employees
npm run dev
```

The app runs at http://localhost:3000. Without a `.env` it still starts and
shows a setup screen rather than crashing.

`npm run db:seed` does not create logins — passwords must be hashed by Better
Auth. Create the first account through the sign-up API, then promote it:

```sql
UPDATE "user" SET role = 'SUPER_ADMIN' WHERE email = 'you@seturasolutions.com';
```

## Scripts

| Script                | What it does                                  |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Development server                            |
| `npm run build`       | Production build                              |
| `npm run start`       | Serve the production build                    |
| `npm run typecheck`   | `tsc --noEmit`                                |
| `npm run lint`        | ESLint                                        |
| `npm run verify`      | typecheck + lint + build                      |
| `npm run db:generate` | Generate SQL migrations from the schema       |
| `npm run db:migrate`  | Apply migrations                              |
| `npm run db:push`     | Push the schema directly (development only)   |
| `npm run db:studio`   | Drizzle Studio                                |
| `npm run db:seed`     | Load development sample data                  |

## Architecture

```
Next.js page (Server Component)
        ↓
Service layer  ──  business logic + Zod validation
        ↓
Drizzle ORM
        ↓
Neon PostgreSQL
```

Interactive screens add one hop:

```
Client Component → TanStack Query → Route Handler → Service → Drizzle
```

Rules that keep this from drifting:

- **Business logic lives in `src/services/`.** Pages compose; they do not query.
- **Server Components by default.** `"use client"` only where there is real
  interactivity (the employees table, the mobile nav, the login form).
- **Every service re-validates its input** with the Zod schema, so a Route
  Handler, a Server Action and a seed script all get the same guarantees.
- **Secrets never leave the server.** No `NEXT_PUBLIC_` variable exists; `src/db`,
  `src/lib/auth/auth.ts` and `src/lib/storage` are server-only.

## Layout

```
src/
├── app/
│   ├── (auth)/            login, forgot-password
│   ├── (dashboard)/       dashboard, employees  (+ layout, error, loading)
│   └── api/               auth/[...all], employees
├── components/
│   ├── base/              Setura Base UI (button, input, select, card,
│   │                      badge, table, pagination, spinner)
│   ├── layout/            sidebar, header, mobile-nav
│   └── features/          employees, dashboard
├── db/
│   ├── schema/            one file per domain + relations.ts
│   ├── migrations/        generated SQL
│   ├── index.ts           Drizzle client
│   └── seed.ts
├── services/              employee, department, attendance, leave
├── lib/
│   ├── auth/              auth.ts, auth-client.ts, session.ts
│   ├── permissions/       roles.ts, permissions.ts, authorize.ts
│   ├── storage/           r2.ts, index.ts
│   └── validations/       auth, employee, attendance, leave
├── hooks/
├── types/
└── utils/
```

## Base UI

Our own components, built on React + TypeScript + Tailwind and native browser
behaviour. Every component takes a small, predictable set of props:

```tsx
<Button variant="primary">Add employee</Button>
<Button variant="danger" size="sm">Delete</Button>
<Button loading>Saving…</Button>
```

Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`.
Sizes: `sm`, `md`, `lg`.

Only the components the first two screens need are implemented. Add more by
following the same shape: a folder under `src/components/base/`, a lookup map
for variants, forwarded refs, and no external dependency.

## Roles

`SUPER_ADMIN` → `HR_ADMIN` → `MANAGER` → `EMPLOYEE`

Permissions are a flat `resource:action` list in `src/lib/permissions/permissions.ts`.
Hiding a nav link is presentation; every route and service enforces its own
check via `authorize()`.

## Not built yet

Payroll, performance, recruitment, reporting, notifications, email, multi-tenancy,
analytics, mobile, real-time. Attendance, leave, departments and settings have
navigation entries but no screens yet.
