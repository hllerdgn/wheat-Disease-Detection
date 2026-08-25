"""
System Health & Telemetry Endpoints.
"""

import os
import time
try:
    import psutil
except ImportError:
    psutil = None
import torch
from pathlib import Path
from typing import Dict, Any, List
from fastapi import APIRouter, status

from app.core.config import settings
from app.schemas.health import (
    HealthResponse,
    DetailedHealthResponse,
    GPUInfo,
    SystemMetrics,
)
from app.services.inference_service import inference_service
from app.services.disease_service import disease_service

router = APIRouter(prefix="", tags=["System & Health"])

SERVER_START_TIME = time.time()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Standard System Health Check",
    description="Quick check for API status, model readiness, and active inference device.",
)
async def health_check():
    """Returns basic health and readiness status of the backend."""
    is_ready = inference_service.is_ready
    return HealthResponse(
        status="ok" if is_ready else "degraded",
        pipeline_ready=is_ready,
        model_loaded=is_ready,
        device=inference_service.device,
        num_classes=len(disease_service.disease_db) if disease_service.disease_db else 15,
        version=settings.VERSION,
        error=inference_service.startup_error,
    )


@router.get(
    "/health/detailed",
    response_model=DetailedHealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Detailed Telemetry & Hardware Metrics",
    description="Extended telemetry including VRAM, CPU utilization, disk space, and memory usage.",
)
async def detailed_health_check():
    """Returns comprehensive host and hardware metrics."""
    cuda_avail = torch.cuda.is_available()
    gpu_name = torch.cuda.get_device_name(0) if cuda_avail else None
    gpu_mem = (
        torch.cuda.get_device_properties(0).total_memory / (1024**3)
        if cuda_avail
        else None
    )

    gpu_info = GPUInfo(
        cuda_available=cuda_avail,
        device_count=torch.cuda.device_count() if cuda_avail else 0,
        gpu_name=gpu_name,
        gpu_memory_gb=round(gpu_mem, 2) if gpu_mem else None,
        cuda_version=torch.version.cuda if cuda_avail else None,
        cudnn_version=str(torch.backends.cudnn.version()) if cuda_avail else None,
    )

    # Host System Metrics
    if psutil is not None:
        mem = psutil.virtual_memory()
        disk = psutil.disk_usage(str(settings.BASE_DIR))
        sys_metrics = SystemMetrics(
            cpu_usage_percent=psutil.cpu_percent(interval=None),
            memory_total_gb=round(mem.total / (1024**3), 2),
            memory_used_gb=round(mem.used / (1024**3), 2),
            memory_percent=mem.percent,
            disk_free_gb=round(disk.free / (1024**3), 2),
        )
    else:
        sys_metrics = SystemMetrics(
            cpu_usage_percent=0.0,
            memory_total_gb=0.0,
            memory_used_gb=0.0,
            memory_percent=0.0,
            disk_free_gb=0.0,
        )

    is_ready = inference_service.is_ready

    return DetailedHealthResponse(
        status="ok" if is_ready else "degraded",
        pipeline_ready=is_ready,
        model_loaded=is_ready,
        device=inference_service.device,
        num_classes=len(disease_service.disease_db) if disease_service.disease_db else 15,
        version=settings.VERSION,
        error=inference_service.startup_error,
        gpu=gpu_info,
        system=sys_metrics,
        model_checkpoint=str(settings.MODEL_CHECKPOINT_PATH.name),
        uptime_seconds=round(time.time() - SERVER_START_TIME, 1),
    )


@router.get(
    "/classes",
    summary="Supported Class Mapping",
    description="Returns list of model output classes.",
)
async def get_supported_classes():
    """Returns all model output classes."""
    import json
    if settings.CLASS_MAPPING_PATH.exists():
        with open(settings.CLASS_MAPPING_PATH, "r", encoding="utf-8") as f:
            idx_to_class = json.load(f)
        classes = [
            {"id": int(k), "name": v}
            for k, v in sorted(idx_to_class.items(), key=lambda x: int(x[0]))
        ]
    else:
        classes = [{"id": i, "name": name} for i, name in enumerate(disease_service.disease_db.keys())]

    return {
        "num_classes": len(classes),
        "classes": classes,
    }
