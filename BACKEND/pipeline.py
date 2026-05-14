import time
import torch
import numpy as np
import torch.nn.functional as F
from PIL import Image
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

import sys
project_root = Path(__file__).resolve().parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

from preprocessing import ImagePreprocessor, PreprocessResult
from models.model import WheatDiseaseClassifier
from utils.dataset import get_transforms

import config

@dataclass
class PipelineResult:
    predicted_class:    str
    confidence:         float
    is_certain:         bool
    top3_predictions:   list

    quality_valid:      bool
    quality_warnings:   list
    blur_score:         float
    rejection_reason:   Optional[str]

    processing_time_ms: float
    image_size:         tuple

class WheatDiseasePipeline:
    def __init__(
        self,
        cls_checkpoint:   str  = None,
        cls_mapping:      str  = None,
        device:           str  = None,
        cls_conf:         float = 0.50,
    ):
        self.device   = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.cls_conf = cls_conf

        cls_checkpoint = cls_checkpoint or str(
            project_root / "models" / "checkpoints" / "best_swin_model.pth"
        )
        cls_mapping = cls_mapping or str(
            project_root / "models" / "class_mapping.json"
        )

        self.preprocessor = ImagePreprocessor(target_size=(640, 640))
        self.idx_to_class, self.num_classes = self._load_mapping(cls_mapping)
        self.classifier    = self._load_classifier(cls_checkpoint)
        _, self.cls_transform = get_transforms()

        print(f"Pipeline hazır | device={self.device}")

    def run(self, source, skip_quality: bool = False) -> PipelineResult:
        t0 = time.perf_counter()
        bgr = self._to_bgr(source)
        pre: PreprocessResult = self.preprocessor.process(bgr, skip_quality_check=skip_quality)

        if not pre.quality.is_valid:
            elapsed = (time.perf_counter() - t0) * 1000
            return self._rejected_result(pre, elapsed)

        cls_result = self._run_classification(pre.image_pil)
        elapsed = (time.perf_counter() - t0) * 1000

        return PipelineResult(
            predicted_class     = cls_result["predicted_class"],
            confidence          = cls_result["confidence"],
            is_certain          = cls_result["is_certain"],
            top3_predictions    = cls_result["top3"],
            quality_valid       = pre.quality.is_valid,
            quality_warnings    = pre.quality.warnings,
            blur_score          = pre.quality.blur_score,
            rejection_reason    = None,
            processing_time_ms  = round(elapsed, 1),
            image_size          = pre.original_size,
        )

    def _run_classification(self, pil_image: Image.Image) -> dict:
        tensor = self.cls_transform(pil_image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            logits = self.classifier(tensor)
            probs  = F.softmax(logits, dim=1)[0]

        top3_probs, top3_idx = torch.topk(probs, k=min(3, self.num_classes))
        top3 = [
            (self.idx_to_class.get(str(i.item()), f"class_{i.item()}"),
             round(p.item(), 4))
            for i, p in zip(top3_idx, top3_probs)
        ]
        best_class = top3[0][0]
        best_conf  = top3[0][1]

        return {
            "predicted_class" : best_class if best_conf >= self.cls_conf else "Belirsiz",
            "confidence"      : best_conf,
            "is_certain"      : best_conf >= self.cls_conf,
            "top3"            : top3,
        }

    def _rejected_result(self, pre: PreprocessResult, elapsed_ms: float) -> PipelineResult:
        return PipelineResult(
            predicted_class     = "Reddedildi",
            confidence          = 0.0,
            is_certain          = False,
            top3_predictions    = [],
            quality_valid       = False,
            quality_warnings    = pre.quality.warnings,
            blur_score          = pre.quality.blur_score,
            rejection_reason    = pre.quality.rejection_reason,
            processing_time_ms  = round(elapsed_ms, 1),
            image_size          = pre.original_size,
        )

    def _to_bgr(self, source) -> np.ndarray:
        import cv2
        if isinstance(source, bytes):
            arr = np.frombuffer(source, np.uint8)
            bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
            if bgr is None:
                raise ValueError("Geçersiz görüntü bytes verisi")
            return bgr
        if isinstance(source, Image.Image):
            return cv2.cvtColor(np.array(source.convert("RGB")), cv2.COLOR_RGB2BGR)
        if isinstance(source, np.ndarray):
            return source
        bgr = cv2.imread(str(source))
        if bgr is None:
            raise FileNotFoundError(f"Görüntü bulunamadı: {source}")
        return bgr

    def _load_mapping(self, mapping_path: str):
        import json
        path = Path(mapping_path)
        if not path.exists():
            raise FileNotFoundError("class_mapping.json bulunamadı.")
        with open(path, "r", encoding="utf-8") as f:
            idx_to_class = json.load(f)
        return idx_to_class, len(idx_to_class)

    def _load_classifier(self, checkpoint_path: str) -> WheatDiseaseClassifier:
        model = WheatDiseaseClassifier(
            num_classes=self.num_classes, pretrained=False
        )
        path = Path(checkpoint_path)
        if not path.exists():
            print(f"⚠️  UYARI: Checkpoint bulunamadı: {checkpoint_path}")
            print("💡 İPUCU: Modeli henüz eğitmediyseniz 'training/train.py' scriptini çalıştırın")
            print("   veya hazır 'best_swin_model.pth' dosyasının doğru konumda olduğundan emin olun.")
            return model # Boş model döner, tahminler hatalı olur ama API çökmez
            
        try:
            ckpt = torch.load(checkpoint_path, map_location=self.device)
            state = ckpt["model_state_dict"] if "model_state_dict" in ckpt else ckpt
            model.load_state_dict(state)
            model.to(self.device)
            model.eval()
            print(f"✅ Model başarıyla yüklendi: {path.name}")
        except Exception as e:
            print(f"❌ Model yükleme hatası: {e}")
            
        return model

    def result_to_dict(self, r: PipelineResult) -> dict:
        return {
            "classification": {
                "predicted_class" : r.predicted_class,
                "confidence"      : round(r.confidence, 4),
                "is_certain"      : r.is_certain,
                "top3_predictions": [
                    {"class": c, "score": s} for c, s in r.top3_predictions
                ],
            },
            "quality": {
                "is_valid"        : r.quality_valid,
                "blur_score"      : round(r.blur_score, 2),
                "warnings"        : r.quality_warnings,
                "rejection_reason": r.rejection_reason,
            },
            "meta": {
                "processing_time_ms": r.processing_time_ms,
                "image_size"        : {"width": r.image_size[0], "height": r.image_size[1]},
            }
        }