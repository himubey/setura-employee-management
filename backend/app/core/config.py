from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration, read from the environment and `.env`.

    Nothing here is required. Every field has a default so that `GET /health`,
    `/docs` and the test suite work on a fresh clone with no `.env` at all —
    the app should be explorable before it is configured. Code that genuinely
    needs a value asks for it explicitly (see `require_database_url`).
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        # Tolerate unrelated variables in the shell environment rather than
        # refusing to start.
        extra="ignore",
        case_sensitive=False,
    )

    # --- Application --------------------------------------------------------
    app_name: str = "Setura API"
    app_version: str = "0.1.0"
    debug: bool = False

    # Mounted under this prefix; see app/api/router.py.
    api_v1_prefix: str = "/api/v1"

    # --- Database -----------------------------------------------------------
    # SQLAlchemy URL. Use the psycopg 3 driver:
    #   postgresql+psycopg://user:pass@host/db?sslmode=require
    database_url: str = ""

    # --- Security -----------------------------------------------------------
    # Signing key for sessions or tokens. Authentication is not implemented
    # yet — this is the slot for it.
    secret_key: str = ""

    # --- CORS ---------------------------------------------------------------
    # A comma-separated string rather than a list: pydantic-settings tries to
    # JSON-decode env values for complex types, so `CORS_ORIGINS=http://a,http://b`
    # would fail to parse as a list. Splitting is done in `cors_origins_list`.
    cors_origins: str = "http://localhost:3000"

    # --- Storage (Cloudflare R2) --------------------------------------------
    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = ""
    r2_public_url: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        """`CORS_ORIGINS` split into the list Starlette's middleware wants."""
        return [
            origin.strip() for origin in self.cors_origins.split(",") if origin.strip()
        ]

    def require_database_url(self) -> str:
        """The database URL, or a readable error naming what to set.

        Called at the point of use rather than at import time, so a missing
        `.env` breaks the one request that needed a database instead of
        preventing the application from starting at all.
        """
        if not self.database_url:
            raise RuntimeError(
                "DATABASE_URL is not set. Copy backend/.env.example to "
                "backend/.env and fill in the Neon connection string."
            )
        return self.database_url


@lru_cache
def get_settings() -> Settings:
    """Cached accessor, so the `.env` file is read once per process.

    Also the seam for tests: `get_settings.cache_clear()` after patching the
    environment gives a fresh Settings instance.
    """
    return Settings()


settings = get_settings()
