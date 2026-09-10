# Migrations

Alembic reads `DATABASE_URL` through `app.core.config`, so there is no
connection string in `alembic.ini`. Set it in `backend/.env` first.

```bash
cd backend
source .venv/bin/activate

# Generate a migration from changes to the models
alembic revision --autogenerate -m "add employees table"

# Apply everything
alembic upgrade head

# Roll back one revision
alembic downgrade -1

# Print the SQL without connecting
alembic upgrade head --sql

# Where the database currently is
alembic current
alembic history
```

Generated migrations are not auto-formatted (there is no post-write hook —
see the comment in `alembic.ini` for why). Run `ruff format . && ruff check
--fix .` after generating one, the same as for any other file.

**Always read a generated migration before applying it.** Autogenerate is a
draft: it does not detect table or column renames (it emits a drop plus an
add, which loses the data), and it cannot infer a data migration.

A new model is only visible to autogenerate once its module is imported in
`app/db/base.py`. A model that is never imported produces an empty migration
and its table is silently never created.

`versions/` is empty — there is no schema yet.
