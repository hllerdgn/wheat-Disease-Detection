"""
Inference Service - Manages Deep Learning Pipeline lifecycle and inference executions.
"""

import sys
import time
import asyncio
from pathlib import Path
from typing import Optional, List, Tuple
from concurrent.futures import ThreadPoolExecutor

# Make sure project root is in sys.path
project_root = Path(__file__).resolve().parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

import torch
from app.core.config import settings
from app.core.logging import app_logger
from app.core.exceptions import ModelNotReadyException, InvalidImageException
from app.schemas.analysis import (
    AnalyzeResponse,
    ClassificationResult,
    Top3Prediction,
    QualityResult,
    MetaResult,
    ImageSize,
    BatchAnalyzeResponse,
    BatchItemResponse,
)
from app.services.disease_service import disease_service
from app.services.quality_service import quality_service
from pipeline import WheatDiseasePipeline, PipelineResult


class InferenceService:
    """Singleton service to manage model pipeline and perform inference."""

    _instance: Optional["InferenceService"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(InferenceService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return
        self.pipeline: Optional[WheatDiseasePipeline] = None
        self.is_ready: bool = False
        self.startup_error: Optional[str] = None
        self.device: str = "cpu"
        self.executor = ThreadPoolExecutor(max_workers=2)
        self._initialized = True

    def initialize(self) -> None:
        """Loads WheatDiseasePipeline into memory."""
        app_logger.info("Initializing ML Pipeline...")
        try:
            device = "cuda" if torch.cuda.is_available() else "cpu"
            self.device = device
            self.pipeline = WheatDiseasePipeline(
                cls_checkpoint=str(settings.MODEL_CHECKPOINT_PATH),
                cls_mapping=str(settings.CLASS_MAPPING_PATH),
                device=device,
                cls_conf=settings.CONFIDENCE_THRESHOLD,
            )
            self.is_ready = True
            self.startup_error = None
            app_logger.info(f"Pipeline successfully initialized on device: {device}")
        except Exception as e:
            self.is_ready = False
            self.startup_error = str(e)
            app_logger.error(f"Failed to initialize ML Pipeline: {e}", exc_info=True)

    def shutdown(self) -> None:
        """Cleanup resources on server shutdown."""
        app_logger.info("Shutting down ML Pipeline resources...")
        self.pipeline = None
        self.is_ready = False
        self.executor.shutdown(wait=False)

    def _check_ready(self) -> None:
        """Throws ModelNotReadyException if pipeline is not loaded."""
        if not self.is_ready or self.pipeline is None:
            raise ModelNotReadyException(
                message="Wheat disease inference model is not initialized.",
                details={"startup_error": self.startup_error},
            )

    def run_inference_sync(self, image_bytes: bytes, skip_quality: bool = False) -> AnalyzeResponse:
        """Synchronously execute preprocessing and classification."""
        self._check_ready()
        quality_service.validate_image_bytes(image_bytes)

        t_start = time.perf_counter()
        try:
            raw_result: PipelineResult = self.pipeline.run(image_bytes, skip_quality=skip_quality)
        except Exception as e:
            raise InvalidImageException(f"Image processing failed: {str(e)}")

        total_ms = (time.perf_counter() - t_start) * 1000

        top3 = [
            Top3Prediction(class_=cls_name, score=score)
            for cls_name, score in raw_result.top3_predictions
        ]

        classification = ClassificationResult(
            predicted_class=raw_result.predicted_class,
            confidence=round(raw_result.confidence, 4),
            is_certain=raw_result.is_certain,
            top3_predictions=top3,
        )

        quality = QualityResult(
            is_valid=raw_result.quality_valid,
            blur_score=round(raw_result.blur_score, 2),
            warnings=raw_result.quality_warnings,
            rejection_reason=raw_result.rejection_reason,
        )

        meta = MetaResult(
            processing_time_ms=round(total_ms, 1),
            image_size=ImageSize(
                width=raw_result.image_size[0],
                height=raw_result.image_size[1],
            ),
        )

        # Enrich with agronomic knowledge base
        disease_info = None
        target_class = raw_result.predicted_class
        if target_class == "Uncertain" and raw_result.top3_predictions:
            target_class = raw_result.top3_predictions[0][0]

        if target_class and target_class not in ["Rejected"]:
            disease_info = disease_service.get_disease(target_class)

        return AnalyzeResponse(
            classification=classification,
            quality=quality,
            meta=meta,
            disease_info=disease_info,
        )

    async def analyze_image(self, image_bytes: bytes, skip_quality: bool = False) -> AnalyzeResponse:
        """Run single image inference asynchronously in thread pool."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            self.executor, self.run_inference_sync, image_bytes, skip_quality
        )

    async def analyze_batch(
        self, files: List[Tuple[str, bytes]], skip_quality: bool = False
    ) -> BatchAnalyzeResponse:
        """Run batch image inferences asynchronously."""
        self._check_ready()
        t_batch_start = time.perf_counter()

        tasks = []
        for filename, image_bytes in files:
            tasks.append(self._process_batch_item(filename, image_bytes, skip_quality))

        items: List[BatchItemResponse] = await asyncio.gather(*tasks)

        successful = sum(1 for item in items if item.success)
        failed = len(items) - successful
        total_time = (time.perf_counter() - t_batch_start) * 1000

        return BatchAnalyzeResponse(
            total_images=len(items),
            successful_count=successful,
            failed_count=failed,
            total_processing_time_ms=round(total_time, 1),
            items=items,
        )

    async def _process_batch_item(
        self, filename: str, image_bytes: bytes, skip_quality: bool
    ) -> BatchItemResponse:
        """Helper to process one item in a batch and catch exceptions."""
        try:
            res = await self.analyze_image(image_bytes, skip_quality=skip_quality)
            return BatchItemResponse(filename=filename, success=True, result=res, error=None)
        except Exception as e:
            return BatchItemResponse(filename=filename, success=False, result=None, error=str(e))


inference_service = InferenceService()
