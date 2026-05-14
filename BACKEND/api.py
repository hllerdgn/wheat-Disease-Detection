"""
API.PY - FastAPI Wheat Disease Analysis API

Endpoints:
    POST /analyze          -> Classification and quality analysis
    GET  /health           -> System status
    GET  /classes          -> Supported classes
    GET  /docs             -> Swagger UI (automatic)
"""

import sys
import time
import json
from pathlib import Path
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

project_root = Path(__file__).resolve().parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

import config
from pipeline import WheatDiseasePipeline, PipelineResult


# ============================================================================
# APP INITIALIZATION
# ============================================================================

# Pipeline object (loaded at startup)
pipeline: Optional[WheatDiseasePipeline] = None
startup_error: Optional[str] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load pipeline on startup."""
    global pipeline, startup_error
    print("Pipeline yukleniyor...")
    try:
        pipeline = WheatDiseasePipeline(
            cls_checkpoint   = str(config.MODEL_CHECKPOINT_PATH),
            cls_mapping      = str(config.MODELS_DIR / "class_mapping.json"),
            device           = str(config.DEVICE),
            cls_conf         = config.CONFIDENCE_THRESHOLD,
        )
        print("Pipeline hazir, API isteklere acik.")
    except Exception as e:
        startup_error = str(e)
        print(f"Pipeline yuklenemedi: {e}")
    yield
    print("API kapatiliyor.")


app = FastAPI(
    title       = "Wheat Disease Detection API",
    description = (
        "Wheat leaf and head disease classification API.\n\n"
        "**Supported 15 Classes:** Aphid, Blast, Black Rust, Brown Rust, "
        "Common Root Rot, Fusarium Head Blight, Healthy, Leaf Blight, "
        "Mildew, Mite, Septoria, Smut, Stem fly, Tan spot, Yellow Rust\n\n"
        "**Model:** Swin Transformer (Tiny)"
    ),
    version     = "1.0.0",
    lifespan    = lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)


# ============================================================================
# SCHEMAS (Pydantic)
# ============================================================================

class ClassificationResult(BaseModel):
    predicted_class : str
    confidence      : float
    is_certain      : bool
    top3_predictions: list

class QualityInfo(BaseModel):
    is_valid        : bool
    blur_score      : float
    warnings        : list
    rejection_reason: Optional[str]

class MetaInfo(BaseModel):
    processing_time_ms: float
    image_size        : dict

class AnalyzeResponse(BaseModel):
    classification      : ClassificationResult
    quality             : QualityInfo
    meta                : MetaInfo

class HealthResponse(BaseModel):
    status        : str
    pipeline_ready: bool
    model_loaded  : bool
    device        : str
    num_classes   : int
    error         : Optional[str] = None


# ============================================================================
# HELPERS
# ============================================================================

def _check_pipeline():
    """Raise 503 if pipeline is not ready."""
    if pipeline is None:
        raise HTTPException(
            status_code=503,
            detail={
                "error"  : "Pipeline yuklenemedi",
                "message": startup_error or "Bilinmeyen hata",
                "hint"   : "Model dosyalarinin var oldugundan emin olun.",
            },
        )


def _validate_image(file: UploadFile):
    """Validate uploaded file is an image."""
    allowed = {"image/jpeg", "image/jpg", "image/png",
               "image/bmp", "image/tiff", "image/webp"}
    if file.content_type not in allowed:
        raise HTTPException(
            status_code=415,
            detail=f"Desteklenmeyen format: {file.content_type}. "
                   f"Kabul edilenler: {', '.join(allowed)}",
        )
    # Size limit: 20MB
    MAX_SIZE = 20 * 1024 * 1024
    if file.size and file.size > MAX_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"Dosya cok buyuk ({file.size/1024/1024:.1f} MB). Maksimum: 20 MB",
        )


# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")

@app.get(
    "/health",
    response_model=HealthResponse,
    summary="System Status",
    tags=["System"],
)
async def health():
    """Returns API and model status."""
    ready = pipeline is not None
    return HealthResponse(
        status        = "ok" if ready else "degraded",
        pipeline_ready= ready,
        model_loaded  = ready,
        device        = str(config.DEVICE),
        num_classes   = config.NUM_CLASSES,
        error         = startup_error,
    )


@app.get(
    "/classes",
    summary="Supported Disease Classes",
    tags=["Info"],
)
async def get_classes():
    """Lists 15 disease classes."""
    mapping_path = config.MODELS_DIR / "class_mapping.json"
    if mapping_path.exists():
        with open(mapping_path, "r", encoding="utf-8") as f:
            idx_to_class = json.load(f)
        classes = [{"id": int(k), "name": v} for k, v in sorted(idx_to_class.items(), key=lambda x: int(x[0]))]
    else:
        classes = [{"id": i, "name": n} for i, n in enumerate(config.DATASET_CLASSES)]

    return {
        "num_classes": len(classes),
        "classes"    : classes,
    }


@app.post(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Image Analysis",
    tags=["Analysis"],
)
async def analyze(
    file            : UploadFile = File(..., description="Wheat image (jpg/png)"),
    skip_quality    : bool = Query(False, description="Skip quality filter"),
):
    """Runs analysis on uploaded image."""
    _check_pipeline()
    _validate_image(file)

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        result: PipelineResult = pipeline.run(image_bytes, skip_quality=skip_quality)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

    return JSONResponse(content=pipeline.result_to_dict(result))


# ============================================================================
# RUN
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    print("Wheat Disease API baslatiliyor...")
    uvicorn.run(
        "api:app",
        host    = config.API_HOST,
        port    = config.API_PORT,
        reload  = config.API_DEBUG,
        workers = 1,
    )