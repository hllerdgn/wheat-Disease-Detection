"""
Integration tests for FastAPI endpoints: /analyze, /analyze-async, /diseases, /history, /health.
"""

from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
from app.schemas.analysis import AnalyzeResponse
from app.services.inference_service import inference_service


class TestApiIntegration:
    """Integration test suite for core API endpoints."""

    def test_health_check_endpoint(self, test_client: TestClient):
        """GET /health should return 200 OK with system status."""
        response = test_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "version" in data
        assert "pipeline_ready" in data

    def test_list_all_diseases_endpoint(self, test_client: TestClient, auth_headers: dict):
        """GET /api/v1/diseases should return full disease list."""
        response = test_client.get("/api/v1/diseases", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 15
        assert isinstance(data["diseases"], list)

    def test_get_disease_detail_endpoint_success(self, test_client: TestClient, auth_headers: dict):
        """GET /api/v1/diseases/yellow_rust should return detailed profile."""
        response = test_client.get("/api/v1/diseases/yellow_rust", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["key"] == "yellow_rust"
        assert "Yellow Rust" in data["name"]
        assert len(data["symptoms"]) > 0

    def test_get_disease_detail_endpoint_not_found(self, test_client: TestClient, auth_headers: dict):
        """GET /api/v1/diseases/unknown should return 404 Not Found."""
        response = test_client.get("/api/v1/diseases/unknown_disease_xyz", headers=auth_headers)
        assert response.status_code == 404
        data = response.json()
        assert data["success"] is False
        assert data["error"]["code"] == "DISEASE_NOT_FOUND"

    def test_get_history_endpoint(self, test_client: TestClient, auth_headers: dict):
        """GET /api/v1/history should return recent history list."""
        response = test_client.get("/api/v1/history?limit=10", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_records" in data
        assert "records" in data

    def test_analyze_image_happy_path(
        self,
        test_client: TestClient,
        auth_headers: dict,
        sample_valid_jpeg_bytes: bytes,
        mock_analyze_response: AnalyzeResponse,
    ):
        """POST /api/v1/analyze with valid image should return classification result."""
        with patch.object(inference_service, "analyze_image", new_callable=AsyncMock) as mock_infer:
            mock_infer.return_value = mock_analyze_response

            files = {"file": ("wheat_sample.jpg", sample_valid_jpeg_bytes, "image/jpeg")}
            response = test_client.post("/api/v1/analyze", files=files, headers=auth_headers)

            assert response.status_code == 200
            data = response.json()
            assert data["classification"]["predicted_class"] == "Yellow Rust"
            assert data["quality"]["is_valid"] is True
            assert data["disease_info"]["name"] == "Yellow Rust"

    def test_analyze_image_invalid_format(
        self,
        test_client: TestClient,
        auth_headers: dict,
    ):
        """POST /api/v1/analyze with PDF should fail with 415 Unsupported Media Type."""
        files = {"file": ("document.pdf", b"%PDF-1.4...", "application/pdf")}
        response = test_client.post("/api/v1/analyze", files=files, headers=auth_headers)
        assert response.status_code == 415
        data = response.json()
        assert data["error"]["code"] == "INVALID_IMAGE"

    def test_analyze_async_flow(
        self,
        test_client: TestClient,
        auth_headers: dict,
        sample_valid_jpeg_bytes: bytes,
        mock_analyze_response: AnalyzeResponse,
    ):
        """POST /api/v1/analyze-async followed by GET /api/v1/analyze-status/{job_id}."""
        with patch.object(inference_service, "analyze_image", new_callable=AsyncMock) as mock_infer:
            mock_infer.return_value = mock_analyze_response

            # 1. Submit async task
            files = {"file": ("sample.jpg", sample_valid_jpeg_bytes, "image/jpeg")}
            submit_res = test_client.post("/api/v1/analyze-async", files=files, headers=auth_headers)
            assert submit_res.status_code == 202
            submit_data = submit_res.json()
            assert "job_id" in submit_data
            job_id = submit_data["job_id"]

            # 2. Query status
            status_res = test_client.get(f"/api/v1/analyze-status/{job_id}", headers=auth_headers)
            assert status_res.status_code == 200
            status_data = status_res.json()
            assert status_data["job_id"] == job_id
            assert status_data["status"] in ["PENDING", "PROCESSING", "COMPLETED"]


    def test_analyze_status_not_found(self, test_client: TestClient, auth_headers: dict):
        """GET /api/v1/analyze-status/{job_id} with fake ID should return 404."""
        response = test_client.get("/api/v1/analyze-status/non-existent-job-id-999", headers=auth_headers)
        assert response.status_code == 404
