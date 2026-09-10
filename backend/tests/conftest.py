import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.fixture(scope="session")
def app() -> FastAPI:
    """A fresh application instance for the test session."""
    return create_app()


@pytest.fixture
def client(app: FastAPI) -> TestClient:
    """HTTP client for the app, with no network and no database.

    `TestClient` is httpx driving the ASGI app in-process, so tests exercise
    real routing, validation and middleware without a running server.

    When database-backed tests arrive, override the `get_db` dependency here
    rather than pointing tests at a live database:

        app.dependency_overrides[get_db] = lambda: test_session
    """
    return TestClient(app)
