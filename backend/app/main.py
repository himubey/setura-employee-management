from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.api.router import api_router
from app.core.config import settings


class HealthResponse(BaseModel):
    """Response model for `GET /health`.

    A model rather than a bare dict so the shape appears in the OpenAPI
    schema — which is also the rule for every endpoint added later: a route
    returns a Pydantic schema, never a SQLAlchemy model.
    """

    status: str


def create_app() -> FastAPI:
    """Build the application.

    A factory, not a module-level singleton, so tests can construct an
    isolated instance with different settings.
    """
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "Backend for Setura Employee Management — employees, attendance, "
            "leave and departments. Consumed by the Next.js frontend over REST."
        ),
        # FastAPI generates these from the route signatures; no separate
        # API documentation to keep in sync.
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # The browser blocks a cross-origin request from the Next.js dev server
    # unless this allows it. Origins come from CORS_ORIGINS — never "*",
    # which is incompatible with `allow_credentials=True` anyway, since a
    # wildcard origin cannot receive cookies.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.api_v1_prefix)

    @app.get("/health", tags=["health"], summary="Liveness check")
    def health() -> HealthResponse:
        """Report that the process is up.

        Deliberately does not touch the database: this answers "is the
        service running", which a load balancer needs to know separately from
        "can it reach PostgreSQL". Add a `/health/ready` that checks
        dependencies if a readiness probe is needed.
        """
        return HealthResponse(status="ok")

    return app


app = create_app()
