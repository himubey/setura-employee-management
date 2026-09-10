from fastapi.testclient import TestClient


def test_health_returns_ok(client: TestClient) -> None:
    """`GET /health` is the liveness probe — status and body are a contract."""
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_health_needs_no_database(client: TestClient) -> None:
    """Liveness must not depend on PostgreSQL.

    This test passes with no DATABASE_URL configured at all, which is the
    point: a load balancer asking "is the process up" should get an answer
    even while the database is unreachable.
    """
    assert client.get("/health").status_code == 200


def test_openapi_schema_is_served(client: TestClient) -> None:
    """The generated schema is the API documentation, so it must build."""
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schema = response.json()
    assert schema["info"]["title"] == "Setura API"
    assert "/health" in schema["paths"]


def test_docs_are_served(client: TestClient) -> None:
    assert client.get("/docs").status_code == 200


def test_cors_allows_the_frontend_origin(client: TestClient) -> None:
    """A preflight from the Next.js dev server must be permitted.

    Getting this wrong is invisible server-side and shows up only as a
    browser console error, so it is worth asserting.
    """
    response = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    # Credentials must be allowed for the session cookie to be sent.
    assert response.headers["access-control-allow-credentials"] == "true"


def test_cors_rejects_an_unknown_origin(client: TestClient) -> None:
    """An origin outside CORS_ORIGINS gets no allow header back."""
    response = client.options(
        "/health",
        headers={
            "Origin": "https://not-setura.example.com",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert "access-control-allow-origin" not in response.headers
