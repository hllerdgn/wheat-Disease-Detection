"""
Analysis Request and Response Schemas.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.disease import DiseaseDetail


class Top3Prediction(BaseModel):
    """Prediction for a single class candidate."""

    # We support both 'class' and 'className' or 'score' / 'confidence'
    # Note: alias or dictionary representation supports 'class' and 'score' for backward compatibility
    class_: str = Field(..., alias="class", description="Predicted class name")
    score: float = Field(..., description="Softmax confidence score (0-1)")

    class Config:
        populate_by_name = True


class ClassificationResult(BaseModel):
    """Classifier inference output."""

    predicted_class: str = Field(..., description="Most probable disease class")
    confidence: float = Field(..., description="Top prediction confidence (0-1)")
    is_certain: bool = Field(..., description="True if confidence >= threshold")
    top3_predictions: List[Top3Prediction] = Field(..., description="Top 3 likely classes")


class QualityResult(BaseModel):
    """Input image quality assessment."""

    is_valid: bool = Field(..., description="Whether image passes quality filter")
    blur_score: float = Field(..., description="Laplacian variance blur score")
    warnings: List[str] = Field(default_factory=list, description="Quality warnings if any")
    rejection_reason: Optional[str] = Field(None, description="Reason if image rejected")


class ImageSize(BaseModel):
    """Original image dimensions."""

    width: int
    height: int


class MetaResult(BaseModel):
    """Processing telemetry."""

    processing_time_ms: float = Field(..., description="Total elapsed processing time in ms")
    image_size: ImageSize = Field(..., description="Original image dimensions")


class AnalyzeResponse(BaseModel):
    """Complete single image analysis response."""

    classification: ClassificationResult
    quality: QualityResult
    meta: MetaResult
    disease_info: Optional[DiseaseDetail] = Field(
        None, description="Full agronomic disease profile and treatment if classified"
    )


class BatchItemResponse(BaseModel):
    """Result for one item in batch processing."""

    filename: str
    success: bool
    result: Optional[AnalyzeResponse] = None
    error: Optional[str] = None


class BatchAnalyzeResponse(BaseModel):
    """Batch analysis aggregation response."""

    total_images: int
    successful_count: int
    failed_count: int
    total_processing_time_ms: float
    items: List[BatchItemResponse]
