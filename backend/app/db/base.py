from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Declarative base for every ORM model.

    Alembic autogenerate reads `Base.metadata`, so a model class is only
    visible to migrations once its module has been imported — see the import
    block at the bottom of this file.
    """


class TimestampMixin:
    """`created_at` / `updated_at`, maintained by the database.

    `server_default=func.now()` and `onupdate=func.now()` mean the values come
    from PostgreSQL, so a row written by a migration, a seed script or psql
    gets the same treatment as one written through the ORM.

    `timezone=True` maps to `TIMESTAMPTZ`. Storing an aware instant is the
    only way to be unambiguous about when something happened.
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


# ---------------------------------------------------------------------------
# Model registry for Alembic.
#
# Import every model module here. `alembic/env.py` imports this file and reads
# `Base.metadata`, so a model that is never imported is invisible to
# autogenerate and its table will silently not be created.
#
# There are no models yet:
#
#     from app.models.user import User          # noqa: F401
#     from app.models.employee import Employee   # noqa: F401
# ---------------------------------------------------------------------------
