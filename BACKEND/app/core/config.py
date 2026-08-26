"""
Core application configuration and settings with fallback.
"""

import os
from pathlib import Path
from typing import List
try:
    from pydantic_settings import BaseSettings

    class BaseConfig(BaseSettings):
        class Config:
            case_sensitive = True
            env_file = ".env"
            extra = "ignore"
except ImportError:
    from pydantic import BaseModel

    class BaseConfig(BaseModel):
        class Config:
            case_sensitive = True
            extra = "ignore"


# Proje kök dizini (BACKEND klasörü)
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseConfig):
    """Application Settings."""

    PROJECT_NAME: str = "Wheat Disease Detection API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DESCRIPTION: str = (
        "Wheat leaf and head disease classification API with Swin Transformer.\n\n"
        "**15 Desteklenen Sınıf:** Aphid, Blast, Black Rust, Brown Rust, "
        "Common Root Rot, Fusarium Head Blight, Healthy, Leaf Blight, "
        "Mildew, Mite, Septoria, Smut, Stem fly, Tan spot, Yellow Rust\n\n"
        "**Model Mimarisi:** Swin Transformer (Tiny) + CLAHE Preprocessing"
    )

    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    WORKERS: int = 1

    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]

    # File Upload Limits
    MAX_FILE_SIZE_MB: int = 25
    ALLOWED_IMAGE_TYPES: List[str] = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/bmp",
        "image/tiff",
        "image/webp",
    ]

    # Directories
    BASE_DIR: Path = BACKEND_DIR
    MODELS_DIR: Path = BACKEND_DIR / "models"
    CHECKPOINTS_DIR: Path = BACKEND_DIR / "models" / "checkpoints"
    KNOWLEDGE_BASE_DIR: Path = BACKEND_DIR / "knowledge_base"
    RESULTS_DIR: Path = BACKEND_DIR / "results"

    # Model Files
    MODEL_CHECKPOINT_PATH: Path = CHECKPOINTS_DIR / "best_swin_model.pth"
    CLASS_MAPPING_PATH: Path = MODELS_DIR / "class_mapping.json"
    DISEASES_JSON_PATH: Path = KNOWLEDGE_BASE_DIR / "diseases.json"

    # ML Inference Settings
    CONFIDENCE_THRESHOLD: float = 0.50
    DEFAULT_DEVICE: str = "cuda"  # Auto fallbacks to cpu if cuda not available

    # Authentication & Security
    AUTH_ENABLED: bool = True
    API_KEYS: str = "wheat-api-key-2026,dev-secret-key"
    API_KEY_HEADER: str = "X-API-Key"

    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_ANALYZE: str = "10/minute"
    RATE_LIMIT_DEFAULT: str = "60/minute"

    # Database Settings (PostgreSQL + SQLAlchemy Async)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/wheat_disease_db"
    DATABASE_ECHO: bool = False

    @property
    def valid_api_keys(self) -> List[str]:
        """Returns list of valid API keys parsed from settings."""
        if isinstance(self.API_KEYS, str):
            return [k.strip() for k in self.API_KEYS.split(",") if k.strip()]
        elif isinstance(self.API_KEYS, (list, tuple, set)):
            return [str(k).strip() for k in self.API_KEYS if str(k).strip()]
        return ["wheat-api-key-2026"]


settings = Settings()

# Gerekli dizinleri güvenceye al
for path in [settings.MODELS_DIR, settings.CHECKPOINTS_DIR, settings.KNOWLEDGE_BASE_DIR, settings.RESULTS_DIR]:
    path.mkdir(parents=True, exist_ok=True)
