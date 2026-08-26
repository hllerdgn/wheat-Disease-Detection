"""
Unit tests for APIKeyAuthMiddleware and authentication policies.
"""

from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings


class TestAuthMiddleware:
    """Test suite for authentication middleware verification."""

    def test_public_routes_bypass_auth(self, test_client: TestClient):
        """Public routes like /health, /docs, / should be accessible without API key."""
        r_health = test_client.get("/health")
        assert r_health.status_code == 200

        r_v1_health = test_client.get("/api/v1/health")
        assert r_v1_health.status_code == 200

        r_docs = test_client.get("/docs")
        assert r_docs.status_code == 200

    def test_protected_route_without_key_returns_401(self, test_client: TestClient):
        """Protected endpoint /diseases without X-API-Key should return 401 Unauthorized."""
        response = test_client.get("/diseases")
        assert response.status_code == 401
        data = response.json()
        assert data["success"] is False
        assert data["error"]["code"] == "UNAUTHORIZED"
        assert "X-API-Key" in data["error"]["message"]

    def test_protected_route_with_invalid_key_returns_401(self, test_client: TestClient):
        """Protected endpoint with wrong key should return 401 Unauthorized."""
        response = test_client.get("/diseases", headers={"X-API-Key": "completely-invalid-random-key"})
        assert response.status_code == 401
        data = response.json()
        assert data["error"]["code"] == "UNAUTHORIZED"

    def test_protected_route_with_valid_key_returns_200(self, test_client: TestClient, valid_api_key: str):
        """Protected endpoint with valid X-API-Key should return 200 OK."""
        response = test_client.get("/diseases", headers={"X-API-Key": valid_api_key})
        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 15
