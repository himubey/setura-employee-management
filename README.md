# Setura Employee Management

Lightweight HR, attendance and leave management for small teams.

Two applications in one repository, talking over REST:

```
frontend/                          backend/
  Next.js 15                         FastAPI
  TypeScript, Tailwind               Python 3.12, Pydantic v2
  TanStack Query + Table             SQLAlchemy 2 + Alembic
        │                                  │
        └──────── HTTP / JSON ─────────────┘
                                           │
                                    Neon PostgreSQL
```

The frontend never touches the database. Every read and write goes through
`frontend/src/lib/api/`, and the backend owns the schema, authentication,
authorization and all business logic.

## Ownership

| Directory   | Owner   | Scope                                                        |
| ----------- | ------- | ------------------------------------------------------------ |
| `frontend/` | Himanshu | UI, client state, API client, presentation                   |
| `backend/`  | Sakshi  | API, database, auth, authorization, business logic, storage  |

The REST API is the contract between the two.

## Running locally

Two terminals.

**Backend** — http://localhost:8000

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env               # Windows: copy .env.example .env
uvicorn app.main:app --reload
```

**Frontend** — http://localhost:3000

```bash
cd frontend
npm install
cp .env.example .env.local         # Windows: copy .env.example .env.local
npm run dev
```

| URL                              | What                                    |
| -------------------------------- | --------------------------------------- |
| http://localhost:3000            | The application                         |
| http://localhost:8000/health     | Liveness check                          |
| http://localhost:8000/docs       | Interactive API documentation (Swagger) |
| http://localhost:8000/redoc      | The same schema, ReDoc                  |
| http://localhost:8000/openapi.json | The OpenAPI schema                    |

FastAPI generates `/docs`, `/redoc` and `/openapi.json` from the route
signatures, so there is no separate API documentation to keep in sync. No
business endpoints exist yet — `/health` is the only route.

## Working without the other half

Each side runs standalone.

The frontend ships an in-memory fixture behind `NEXT_PUBLIC_USE_MOCK_API=true`
(the default in `frontend/.env.example`), so the UI runs with no backend at
all. Set it to `false` once the API is available.

The backend starts, serves `/health` and renders `/docs` with an empty `.env` —
nothing requires a database until something actually queries one.

## Environment

Two separate files; neither is committed.

| File                    | Contains                                                   |
| ----------------------- | ---------------------------------------------------------- |
| `frontend/.env.example` | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_MOCK_API` — public  |
| `backend/.env.example`  | `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`, R2 keys       |

Everything in the frontend file is inlined into the browser bundle by
construction. **No secret ever belongs there** — credentials live only in
`backend/.env`.

`CORS_ORIGINS` must list the frontend's origin (`http://localhost:3000` in
development), or the browser blocks every request.

## Commands

**Frontend** (from `frontend/`)

| Command             | What it does             |
| ------------------- | ------------------------ |
| `npm run dev`       | Development server       |
| `npm run build`     | Production build         |
| `npm run typecheck` | `tsc --noEmit`           |
| `npm run lint`      | ESLint                   |
| `npm run verify`    | typecheck + lint + build |

**Backend** (from `backend/`, venv activated)

| Command                          | What it does                    |
| -------------------------------- | ------------------------------- |
| `uvicorn app.main:app --reload`  | Development server              |
| `pytest`                         | Tests                           |
| `ruff check .`                   | Lint                            |
| `ruff format .`                  | Format                          |
| `alembic revision --autogenerate -m "…"` | Generate a migration    |
| `alembic upgrade head`           | Apply migrations                |

See `backend/alembic/README.md` for the migration workflow.

## Layout

```
setura-employee-management/
├── frontend/
│   └── src/
│       ├── app/            App Router — (auth) and (dashboard) groups
│       ├── components/     base/ (Setura UI), layout/, features/
│       ├── lib/            api/, query/, permissions/, validations/
│       ├── hooks/          feature-scoped TanStack Query hooks
│       ├── types/          API contract — currently provisional
│       └── utils/
│
├── backend/
│   ├── app/
│   │   ├── main.py         FastAPI app, CORS, /health
│   │   ├── core/           config, security, dependencies
│   │   ├── db/             declarative Base, session factory
│   │   ├── api/            versioned router + routes/
│   │   ├── models/         SQLAlchemy models      (empty)
│   │   ├── schemas/        Pydantic schemas       (empty)
│   │   ├── services/       business logic         (empty)
│   │   ├── repositories/   optional query helpers (empty)
│   │   └── utils/
│   ├── alembic/            migrations
│   └── tests/
│
└── README.md
```

## API contract

The backend is a scaffold; no endpoint beyond `/health` exists yet. The
frontend has had to assume request and response shapes in the meantime, and
every assumption is marked:

```bash
grep -rn "CONTRACT:" frontend/src
```

Those notes name what needs confirming — the pagination envelope's field
names, snake_case versus camelCase, the error body shape, and how the login
response returns a session. Worth reading before finalising the Pydantic
schemas, so the two sides meet in the middle rather than one adapting to the
other after the fact.

## Status

Frontend: application shell, dashboard and employees table are built and run
against the fixture. Backend: scaffold only — structure, configuration, CORS,
health endpoint and tests, with no business logic.

Not built: payroll, performance, recruitment, reporting, notifications,
documents. Attendance, leave, departments and settings have navigation entries
and placeholder screens.
