"""
Health and System Telemetry Schemas.
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class GPUInfo(BaseModel):
    """GPU device information."""

    cuda_available: bool
    device_count: int
    gpu_name: Optional[str] = None
    gpu_memory_gb: Optional[float] = None
    cuda_version: Optional[str] = None
    cudnn_version: Optional[str] = None


class SystemMetrics(BaseModel):
    """Host system metrics."""

    cpu_usage_percent: float
    memory_total_gb: float
    memory_used_gb: float
    memory_percent: float
    disk_free_gb: float


class HealthResponse(BaseModel):
    """Standard health check response."""

    status: str = Field("ok", description="Overall system health status (ok / degraded / error)")
    pipeline_ready: bool
    model_loaded: bool
    device: str
    num_classes: int
    version: str
    error: Optional[str] = None


class DetailedHealthResponse(HealthResponse):
    """Detailed health check response with hardware metrics."""

    gpu: GPUInfo
    system: SystemMetrics
    model_checkpoint: str
    uptime_seconds: float
