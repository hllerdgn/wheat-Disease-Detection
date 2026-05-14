import sys
import time
import json
from pathlib import Path
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

project_root = Path(__file__).resolve().parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

import config
from pipeline import WheatDiseasePipeline, PipelineResult


# ============================================================================
# UYGULAMA BAŞLATMA
# ============================================================================

pipeline: Optional[WheatDiseasePipeline] = None
startup_error: Optional[str] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pipeline, startup_error
    print("Pipeline yükleniyor...")
    try:
        pipeline = WheatDiseasePipeline(
            cls_checkpoint   = str(config.MODEL_CHECKPOINT_PATH),
            cls_mapping      = str(config.MODELS_DIR / "class_mapping.json"),
            device           = str(config.DEVICE),
            cls_conf         = config.CONFIDENCE_THRESHOLD,
        )
        print("Pipeline hazır, API isteklere açık.")
    except Exception as e:
        startup_error = str(e)
        print(f"Pipeline yüklenemedi: {e}")
    yield
    print("API kapatılıyor.")

app = FastAPI(
    title       = "Wheat Disease Classification API",
    description = "Buğday hastalıklarını sınıflandıran yapay zeka (Swin-T) API'si.",
    version     = "1.0.0",
    lifespan    = lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)


# ============================================================================
# YANIT ŞEMALARI
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
# YARDIMCI
# ============================================================================

def _check_pipeline():
    if pipeline is None:
        raise HTTPException(
            status_code=503,
            detail={
                "error"  : "Pipeline yüklenemedi",
                "message": startup_error or "Bilinmeyen hata",
            },
        )

def _validate_image(file: UploadFile):
    allowed = {"image/jpeg", "image/jpg", "image/png", "image/bmp", "image/tiff", "image/webp"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=415, detail="Desteklenmeyen format")
    MAX_SIZE = 20 * 1024 * 1024
    if file.size and file.size > MAX_SIZE:
        raise HTTPException(status_code=413, detail="Dosya çok büyük (Maksimum: 20 MB)")


# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    return {
        "message": "Wheat Disease Classification API is running!",
        "status": "online",
        "docs": "/docs",
        "endpoints": ["/analyze", "/health", "/classes"]
    }

@app.get("/health", response_model=HealthResponse)
async def health():
    ready = pipeline is not None
    return HealthResponse(
        status        = "ok" if ready else "degraded",
        pipeline_ready= ready,
        model_loaded  = ready,
        device        = str(config.DEVICE),
        num_classes   = config.NUM_CLASSES,
        error         = startup_error,
    )

@app.get("/classes")
async def get_classes():
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

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    file        : UploadFile = File(...),
    skip_quality: bool = Query(False),
):
    _check_pipeline()
    _validate_image(file)

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Boş dosya yüklendi")

    try:
        result: PipelineResult = pipeline.run(image_bytes, skip_quality=skip_quality)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analiz hatası: {str(e)}")

    return JSONResponse(content=pipeline.result_to_dict(result))

@app.post("/classify", response_model=AnalyzeResponse)
async def classify(
    file        : UploadFile = File(...),
    skip_quality: bool = Query(False),
):
    # Yalnızca sınıflandırma (Swin-T) kullanıldığı için analyze ile aynı
    return await analyze(file, skip_quality)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api:app",
        host    = config.API_HOST,
        port    = config.API_PORT,
        reload  = config.API_DEBUG,
        workers = 1,
    )