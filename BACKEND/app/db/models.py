"""
SQLAlchemy ORM Models for Wheat Disease Detection Platform.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, Text
from sqlalchemy.sql import func
from app.db.base import Base


class AnalysisHistory(Base):
    """
    Analysis History ORM Table for persisting inference requests and diagnostics.
    """

    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    request_id = Column(String(64), index=True, nullable=True, doc="Unique tracking request ID")
    image_hash = Column(String(64), index=True, nullable=True, doc="SHA256 hash of the uploaded image")
    filename = Column(String(255), nullable=True, doc="Original or generated image filename")
    predicted_class = Column(String(100), nullable=False, index=True, doc="Predicted disease class name")
    confidence = Column(Float, nullable=False, doc="Top prediction confidence (0-1)")
    is_certain = Column(Boolean, default=True, doc="Whether prediction exceeds confidence threshold")
    blur_score = Column(Float, nullable=True, doc="Laplacian variance blur score")
    processing_time_ms = Column(Float, nullable=True, doc="Processing duration in milliseconds")
    top3_probs = Column(JSON, nullable=False, doc="Top 3 predicted classes with confidence scores")
    full_response = Column(JSON, nullable=True, doc="Full serialized AnalyzeResponse payload")
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
        doc="Timestamp of analysis creation",
    )

    def to_dict(self):
        """Converts model to dictionary."""
        return {
            "id": self.id,
            "request_id": self.request_id,
            "image_hash": self.image_hash,
            "filename": self.filename,
            "predicted_class": self.predicted_class,
            "confidence": self.confidence,
            "is_certain": self.is_certain,
            "blur_score": self.blur_score,
            "processing_time_ms": self.processing_time_ms,
            "top3_probs": self.top3_probs,
            "full_response": self.full_response,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
