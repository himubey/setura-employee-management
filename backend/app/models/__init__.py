"""SQLAlchemy ORM models — one module per domain concept.

Planned: user, employee, department, attendance, leave, holiday, document,
audit_log. None implemented yet.

Two rules worth keeping:

* **Import every model in `app/db/base.py`.** Alembic autogenerate reads
  `Base.metadata`, and a model that is never imported is invisible to it —
  its table will silently not be created.
* **Models are not API responses.** Define a Pydantic schema in
  `app/schemas/` and return that instead, so the wire format is decided
  deliberately rather than leaking every column.
"""
