"""
Analysis Endpoints: Single and Batch Image Classification.
"""

from typing import List
from fastapi import APIRouter, File, UploadFile, Query, BackgroundTasks, status
from fastapi.responses import JSONResponse

from app.schemas.analysis import AnalyzeResponse, BatchAnalyzeResponse
from app.services.quality_service import quality_service
from app.services.inference_service import inference_service
from app.services.history_service import history_service

router = APIRouter(prefix="", tags=["Analysis"])


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    status_code=status.HTTP_200_OK,
    summary="Single Image Disease Analysis",
    description=(
        "Upload a wheat leaf/head image to detect disease, evaluate image quality, "
        "and obtain disease treatment recommendations from the agronomic knowledge base."
    ),
)
async def analyze_image(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Wheat image file (JPEG, PNG, WEBP, BMP)"),
    skip_quality: bool = Query(
        False, description="Bypass image quality check filter (e.g. blur detection)"
    ),
):
    """Processes a single image file for wheat disease classification."""
    quality_service.validate_upload_file(file)
    image_bytes = await file.read()

    result = await inference_service.analyze_image(image_bytes, skip_quality=skip_quality)

    # Save to history in background if result is valid
    if result.quality.is_valid:
        background_tasks.add_task(history_service.save_analysis, result)

    return result


@router.post(
    "/analyze/batch",
    response_model=BatchAnalyzeResponse,
    status_code=status.HTTP_200_OK,
    summary="Batch Image Disease Analysis",
    description="Upload multiple images to run concurrent disease classification on all of them.",
)
async def analyze_batch_images(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(..., description="Multiple wheat images (max 10 recommended)"),
    skip_quality: bool = Query(False, description="Bypass image quality check"),
):
    """Processes multiple uploaded images concurrently."""
    batch_files = []
    for file in files:
        quality_service.validate_upload_file(file)
        content = await file.read()
        batch_files.append((file.filename or "unknown.jpg", content))

    batch_result = await inference_service.analyze_batch(batch_files, skip_quality=skip_quality)

    # Save all successful results to history
    for item in batch_result.items:
        if item.success and item.result and item.result.quality.is_valid:
            background_tasks.add_task(history_service.save_analysis, item.result)

    return batch_result
