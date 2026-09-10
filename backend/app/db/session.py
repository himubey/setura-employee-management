from collections.abc import Generator
from functools import lru_cache

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

# ---------------------------------------------------------------------------
# Synchronous SQLAlchemy 2.x.
#
# Sync, not async, on purpose: FastAPI runs a `def` endpoint in a threadpool,
# so a sync Session does not block the event loop, and Alembic, psycopg and
# every debugging tool work without an async wrapper. It is the smaller thing
# to understand, and it is the easier direction to change from.
#
# To move to async later: swap `create_engine` for `create_async_engine`,
# `Session` for `AsyncSession`, use the `postgresql+asyncpg://` URL scheme,
# and make endpoints `async def`. Nothing above this module needs to know,
# provided everything keeps going through `get_db`.
# ---------------------------------------------------------------------------


@lru_cache
def get_engine() -> Engine:
    """The process-wide connection pool, created on first use.

    Lazily, not at import time, so importing `app.main` (or collecting tests)
    does not require a configured database.
    """
    return create_engine(
        settings.require_database_url(),
        # Verifies a pooled connection before handing it out. Neon closes idle
        # connections, and without this the first query after a quiet period
        # fails with a stale-connection error.
        pool_pre_ping=True,
        echo=settings.debug,
    )


@lru_cache
def get_session_factory() -> sessionmaker[Session]:
    return sessionmaker(
        bind=get_engine(),
        autoflush=False,
        expire_on_commit=False,
    )


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency yielding a request-scoped Session.

    The session is closed on the way out whatever happens. Committing is left
    to the caller: a service knows when a unit of work is complete, and an
    automatic commit here would persist half-finished work after an error.

        @router.get("/things")
        def list_things(db: Session = Depends(get_db)) -> list[Thing]:
            ...
    """
    session = get_session_factory()()
    try:
        yield session
    finally:
        session.close()
