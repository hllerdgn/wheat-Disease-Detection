"""
Unit tests for HistoryService (Async PostgreSQL & JSON fallback) and AnalysisHistory ORM Model.
"""

import pytest
from app.db.models import AnalysisHistory
from app.services.history_service import history_service, HistoryService
from app.schemas.analysis import AnalyzeResponse


class TestHistoryService:
    """Test suite for async history persistence and query functionality."""

    def test_analysis_history_model_to_dict(self):
        """Should convert AnalysisHistory ORM instance to a valid dictionary."""
        model = AnalysisHistory(
            id=1,
            request_id="req-test-123",
            image_hash="a1b2c3d4e5",
            filename="sample.jpg",
            predicted_class="Septoria",
            confidence=0.9234,
            is_certain=True,
            blur_score=110.5,
            processing_time_ms=54.2,
            top3_probs=[{"class": "Septoria", "score": 0.9234}],
        )

        data = model.to_dict()
        assert data["id"] == 1
        assert data["request_id"] == "req-test-123"
        assert data["predicted_class"] == "Septoria"
        assert data["confidence"] == 0.9234
        assert data["top3_probs"][0]["class"] == "Septoria"

    def test_calculate_image_hash(self):
        """Should return consistent SHA256 hex digest for non-empty bytes."""
        sample_bytes = b"test-image-content-for-hashing"
        hash1 = HistoryService.calculate_image_hash(sample_bytes)
        hash2 = HistoryService.calculate_image_hash(sample_bytes)
        assert hash1 is not None
        assert hash1 == hash2
        assert len(hash1) == 64
        assert HistoryService.calculate_image_hash(None) is None

    @pytest.mark.asyncio
    async def test_save_and_retrieve_analysis(self, mock_analyze_response: AnalyzeResponse):
        """Should save analysis record and retrieve recent history."""
        sample_bytes = b"\xff\xd8\xff\xe0" + b"dummy"
        await history_service.save_analysis(
            response=mock_analyze_response,
            filename="test_run.json",
            request_id="req-uuid-test",
            image_bytes=sample_bytes,
        )

        history_list = await history_service.get_recent_history(limit=5)
        assert history_list.total_records >= 1
        assert len(history_list.records) >= 1
