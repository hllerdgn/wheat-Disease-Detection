"""
Pytest configuration and shared fixtures for unit, integration, and model tests.
"""

import io
import sys
from pathlib import Path
import pytest
from PIL import Image
from fastapi.testclient import TestClient

# Ensure BACKEND root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app
from app.core.config import settings
from app.schemas.analysis import (
    AnalyzeResponse,
    ClassificationResult,
    Top3Prediction,
    QualityResult,
    MetaResult,
    ImageSize,
)
from app.schemas.disease import DiseaseDetail


@pytest.fixture
def valid_api_key():
    """Returns a valid API key for authentication headers."""
    return settings.valid_api_keys[0] if settings.valid_api_keys else "wheat-api-key-2026"


@pytest.fixture
def auth_headers(valid_api_key):
    """Returns standard auth headers dictionary."""
    return {"X-API-Key": valid_api_key}


@pytest.fixture
def test_client():
    """FastAPI TestClient fixture."""
    with TestClient(app) as client:
        yield client


@pytest.fixture
def sample_valid_jpeg_bytes() -> bytes:
    """Generates a synthetic valid JPEG image in memory."""
    img_byte_arr = io.BytesIO()
    # 224x224 RGB image with some texture
    img = Image.new("RGB", (256, 256), color=(34, 139, 34))
    img.save(img_byte_arr, format="JPEG")
    return img_byte_arr.getvalue()


@pytest.fixture
def sample_valid_png_bytes() -> bytes:
    """Generates a synthetic valid PNG image in memory."""
    img_byte_arr = io.BytesIO()
    img = Image.new("RGB", (224, 224), color=(50, 205, 50))
    img.save(img_byte_arr, format="PNG")
    return img_byte_arr.getvalue()


@pytest.fixture
def sample_corrupted_bytes() -> bytes:
    """Generates invalid/corrupt non-image binary bytes."""
    return b"CORRUPTED_NOT_AN_IMAGE_DATA_12345"


@pytest.fixture
def mock_analyze_response():
    """Returns a mock AnalyzeResponse object for unit testing."""
    return AnalyzeResponse(
        classification=ClassificationResult(
            predicted_class="Yellow Rust",
            confidence=0.9654,
            is_certain=True,
            top3_predictions=[
                Top3Prediction(class_="Yellow Rust", score=0.9654),
                Top3Prediction(class_="Brown Rust", score=0.0211),
                Top3Prediction(class_="Septoria", score=0.0085),
            ],
        ),
        quality=QualityResult(
            is_valid=True,
            blur_score=142.5,
            warnings=[],
            rejection_reason=None,
        ),
        meta=MetaResult(
            processing_time_ms=45.2,
            image_size=ImageSize(width=256, height=256),
        ),
        disease_info=DiseaseDetail(
            key="yellow_rust",
            name="Yellow Rust",
            name_tr="Sarı Pas",
            scientific_name="Puccinia striiformis",
            severity="high",
            risk_level="high",
            short_desc="Puccinia striiformis kaynaklı buğday sarı pas hastalığı.",
            description="Yapraklarda sarı şeritler halinde püstüller oluşturur.",
            symptoms=["Yaprakta sarı püstüller"],
            cultural_treatment=["Ekim nöbeti"],
            chemical_treatment=["Triazol grubu fungisitler"],
        ),
    )
