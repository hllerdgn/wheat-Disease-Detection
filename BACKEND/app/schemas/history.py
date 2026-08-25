"""
Analysis History Schemas.
"""

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class HistoryItem(BaseModel):
    """Single archived analysis result metadata."""

    filename: str
    timestamp: str
    predicted_class: str
    confidence: float
    is_certain: bool
    blur_score: float
    processing_time_ms: float


class HistoryListResponse(BaseModel):
    """Response containing list of recent analysis results."""

    total_records: int
    records: List[HistoryItem]
