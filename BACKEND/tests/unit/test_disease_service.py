"""
Unit tests for DiseaseService knowledge base queries and normalization.
"""

import pytest
from app.services.disease_service import DiseaseService, disease_service
from app.core.exceptions import DiseaseNotFoundException


class TestDiseaseService:
    """Test suite for disease_service lookups and data integrity."""

    def test_load_knowledge_base_successfully(self):
        """Should contain all 15 wheat disease profiles."""
        assert len(disease_service.disease_db) >= 15

    def test_get_disease_by_exact_key(self):
        """Should retrieve disease detail by key."""
        disease = disease_service.get_disease("yellow_rust")
        assert disease is not None
        assert "Yellow Rust" in disease.name
        assert len(disease.cultural_treatment) > 0

    def test_get_disease_by_name_variants(self):
        """Should resolve disease by case-insensitive name, key, or formatting."""
        d1 = disease_service.get_disease("Yellow Rust")
        d2 = disease_service.get_disease("yellow rust")
        d3 = disease_service.get_disease("yellow_rust")
        assert d1 is not None
        assert d2 is not None
        assert d3 is not None
        assert d1.key == d2.key == d3.key == "yellow_rust"

        d_healthy = disease_service.get_disease("healthy")
        assert d_healthy is not None
        assert d_healthy.key == "healthy"

    def test_get_disease_or_fail_valid(self):
        """Should return detail without raising exception for valid key."""
        detail = disease_service.get_disease_or_fail("septoria")
        assert detail.key == "septoria"

    def test_get_disease_or_fail_invalid_raises_404(self):
        """Should raise DiseaseNotFoundException (404) for non-existent disease."""
        with pytest.raises(DiseaseNotFoundException) as exc_info:
            disease_service.get_disease_or_fail("non_existent_alien_disease")
        assert exc_info.value.status_code == 404
        assert exc_info.value.error_code == "DISEASE_NOT_FOUND"

    def test_get_all_diseases_summary(self):
        """Should return a list containing all disease summaries."""
        list_resp = disease_service.get_all_diseases()
        assert list_resp.total >= 15
        assert len(list_resp.diseases) == list_resp.total
        keys = [item.key for item in list_resp.diseases]
        assert "healthy" in keys
        assert "yellow_rust" in keys
