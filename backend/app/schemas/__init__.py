"""Pydantic v2 schemas — the API's request and response contracts.

Deliberately separate from `app/models/`: an ORM model describes a table, a
schema describes what crosses the wire. Coupling them means a new column is
an unannounced API change, and every relationship risks over-fetching or
leaking a field (a password hash, an internal note).

Use `model_config = ConfigDict(from_attributes=True)` on a response schema to
build it from an ORM instance.

The frontend mirrors these shapes in `frontend/src/types/`, where each type
carries a `CONTRACT:` note listing what it has had to assume. Those are worth
reading before finalising a schema — `grep -rn "CONTRACT:" frontend/src`.
"""
