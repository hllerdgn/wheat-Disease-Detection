from typing import List
from fastapi import APIRouter, File, UploadFile, Query, Path, BackgroundTasks, Request, HTTPException, status
from fastapi.responses import JSONResponse

from app.schemas.analysis import (
    AnalyzeResponse,
    BatchAnalyzeResponse,
    AsyncAnalyzeSubmitResponse,
    AsyncAnalyzeStatusResponse,
)
from app.services.quality_service import quality_service
from app.services.inference_service import inference_service
from app.services.history_service import history_service
from app.services.task_service import task_service
from app.core.limiter import limiter
from app.core.config import settings

router = APIRouter(prefix="", tags=["Analysis"])


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    status_code=status.HTTP_200_OK,
    summary="Single Image Disease Analysis (Synchronous)",
    description=(
        "Upload a wheat leaf/head image to detect disease, evaluate image quality, "
        "and obtain disease treatment recommendations from the agronomic knowledge base. "
        "Rate limit: 10 requests per minute per IP."
    ),
)
@limiter.limit(settings.RATE_LIMIT_ANALYZE)
async def analyze_image(
    request: Request,
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
        req_id = getattr(request.state, "request_id", None)
        background_tasks.add_task(
            history_service.save_analysis,
            result,
            filename=file.filename,
            request_id=req_id,
            image_bytes=image_bytes,
        )

    return result


@router.post(
    "/analyze-async",
    response_model=AsyncAnalyzeSubmitResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Submit Asynchronous Image Disease Analysis",
    description=(
        "Submit an image for asynchronous background inference. Returns a job ID immediately "
        "to poll status via /api/v1/analyze-status/{job_id}. Rate limit: 10 requests per minute."
    ),
)
@limiter.limit(settings.RATE_LIMIT_ANALYZE)
async def analyze_image_async(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Wheat image file (JPEG, PNG, WEBP, BMP)"),
    skip_quality: bool = Query(
        False, description="Bypass image quality check filter"
    ),
):
    """Submits an image analysis task to run in the background."""
    quality_service.validate_upload_file(file)
    image_bytes = await file.read()

    # Create job in task service
    job_id = task_service.create_job(file.filename)
    job_data = task_service.get_job(job_id)

    # Queue execution to FastAPI background tasks
    background_tasks.add_task(
        task_service.process_job,
        job_id,
        image_bytes,
        skip_quality=skip_quality,
    )

    poll_url = f"{settings.API_V1_STR}/analyze-status/{job_id}"
    return AsyncAnalyzeSubmitResponse(
        job_id=job_id,
        status="PENDING",
        created_at=job_data["created_at"],
        poll_url=poll_url,
        message="Analysis job queued successfully. Poll status using poll_url.",
    )


@router.get(
    "/analyze-status/{job_id}",
    response_model=AsyncAnalyzeStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Asynchronous Analysis Job Status",
    description="Check the processing status or retrieve completed result of an asynchronous analysis job.",
)
@limiter.limit(settings.RATE_LIMIT_DEFAULT)
async def get_analyze_job_status(
    request: Request,
    job_id: str = Path(..., description="Job identifier returned from /analyze-async"),
):
    """Polls the status or result of a background analysis task."""
    job_data = task_service.get_job(job_id)
    if not job_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis job '{job_id}' not found.",
        )

    return AsyncAnalyzeStatusResponse(
        job_id=job_data["job_id"],
        status=job_data["status"],
        created_at=job_data["created_at"],
        completed_at=job_data.get("completed_at"),
        processing_time_ms=job_data.get("processing_time_ms"),
        result=job_data.get("result"),
        error=job_data.get("error"),
    )


@router.post(
    "/analyze/batch",
    response_model=BatchAnalyzeResponse,
    status_code=status.HTTP_200_OK,
    summary="Batch Image Disease Analysis",
    description="Upload multiple images to run concurrent disease classification on all of them. Rate limit: 10 requests per minute per IP.",
)
@limiter.limit(settings.RATE_LIMIT_ANALYZE)
async def analyze_batch_images(
    request: Request,
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

