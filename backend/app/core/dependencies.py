"""Shared FastAPI dependencies.

The database session lives here as `DbSession`, re-exported from
`app.db.session` so routes have one import for every dependency.

Authentication and authorization dependencies belong here too, once Sakshi
has designed them. The intended shape, for reference:

    CurrentUser = Annotated[User, Depends(get_current_user)]

    def require_permission(permission: str):
        \"\"\"Returns a dependency that 403s unless the caller holds it.\"\"\"
        def dependency(user: CurrentUser) -> User:
            ...
        return dependency

Note that the backend is the *only* authority on access. The frontend has a
`lib/permissions/` module, but it decides which links to render and enforces
nothing — every route must check for itself.
"""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

# Annotated alias so routes read `db: DbSession` instead of repeating
# `Session = Depends(get_db)` at every call site.
DbSession = Annotated[Session, Depends(get_db)]

__all__ = ["DbSession", "get_db"]
