"""
PREPROCESSING.PY — Görüntü Ön İşleme Modülü
İçerik:
    • CLAHE (Contrast Limited Adaptive Histogram Equalization)
    • Bulanıklık / kalite filtresi (Laplacian variance)
    • Boyutlandırma & normalizasyon
    • Tarımsal görüntü için renk analizi
"""

import cv2
import numpy as np
from PIL import Image
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional, Tuple



@dataclass
class QualityReport:
    """Görüntü kalite analizi sonucu."""
    is_valid:        bool
    blur_score:      float          # Laplacian varyansı — yüksek = net
    brightness:      float          # Ortalama parlaklık (0-255)
    contrast:        float          # Standart sapma
    has_green:       bool           # Bitki rengi var mı?
    rejection_reason: Optional[str] = None
    warnings:        list = field(default_factory=list)


@dataclass
class PreprocessResult:
    """Ön işleme sonucu."""
    image_pil:       Image.Image    # PyTorch modeline girecek PIL görüntüsü
    image_cv2:       np.ndarray     # OpenCV formatı (detection için)
    image_clahe:     np.ndarray     # CLAHE uygulanmış BGR
    quality:         QualityReport
    original_size:   Tuple[int, int]  # (genişlik, yükseklik)
    processed_size:  Tuple[int, int]



class QualityThresholds:
    BLUR_MIN        = 80.0    # Bu altı → bulanık
    BLUR_WARN       = 150.0   # Bu altı → uyarı
    BRIGHTNESS_MIN  = 30.0    # Çok karanlık
    BRIGHTNESS_MAX  = 230.0   # Çok parlak (overexposed)
    CONTRAST_MIN    = 15.0    # Düşük kontrast
    GREEN_HUE_LOW   = 25      # HSV yeşil alt sınır
    GREEN_HUE_HIGH  = 95      # HSV yeşil üst sınır
    GREEN_MIN_RATIO = 0.05    # Görüntünün en az %5'i yeşil olmalı



class ImagePreprocessor:
    """
    Tarımsal görüntüler için ön işleme pipeline'ı.

    Pipeline:
        1. Görüntü yükleme & format dönüşümü
        2. Kalite filtresi (blur, parlaklık, kontrast, yeşil oran)
        3. CLAHE (kontrast iyileştirme)
        4. Boyutlandırma

    Kullanım:
        preprocessor = ImagePreprocessor()
        result = preprocessor.process("goruntu.jpg")
        if result.quality.is_valid:
            # pipeline'a geç
    """

    def __init__(
        self,
        target_size: Tuple[int, int] = (640, 640),   # YOLO için
        clahe_clip:  float = 3.0,
        clahe_grid:  Tuple[int, int] = (8, 8),
        thresholds:  QualityThresholds = None,
    ):
        self.target_size = target_size
        self.thresholds  = thresholds or QualityThresholds()

        # CLAHE nesnesi (LAB renk uzayının L kanalına uygulanır)
        self.clahe = cv2.createCLAHE(
            clipLimit   = clahe_clip,
            tileGridSize= clahe_grid,
        )


    def process(
        self,
        source,                        # str yol | np.ndarray BGR | PIL.Image
        skip_quality_check: bool = False,
    ) -> PreprocessResult:
        """
        Görüntüyü yükler, kalitesini kontrol eder ve ön işler.

        Args:
            source             : Dosya yolu, OpenCV array veya PIL Image
            skip_quality_check : True → kalite filtresi atlanır

        Returns:
            PreprocessResult
        """
        # 1. Yükle → BGR numpy
        bgr = self._load_to_bgr(source)
        original_size = (bgr.shape[1], bgr.shape[0])  # (W, H)

        # 2. Kalite kontrolü
        quality = self._check_quality(bgr) if not skip_quality_check \
                  else QualityReport(is_valid=True, blur_score=999,
                                     brightness=128, contrast=50, has_green=True)

        # 3. CLAHE uygula (geçersiz görüntülerde de uygula — API yanıtı için)
        bgr_clahe = self._apply_clahe(bgr)

        # 4. Boyutlandır (YOLO girdisi için)
        bgr_resized = cv2.resize(bgr_clahe, self.target_size,
                                 interpolation=cv2.INTER_LINEAR)

        # 5. PIL'e çevir (Swin-T sınıflandırıcısı için)
        pil_image = Image.fromarray(
            cv2.cvtColor(bgr_resized, cv2.COLOR_BGR2RGB)
        )

        return PreprocessResult(
            image_pil      = pil_image,
            image_cv2      = bgr_resized,
            image_clahe    = bgr_clahe,
            quality        = quality,
            original_size  = original_size,
            processed_size = self.target_size,
        )


    def _load_to_bgr(self, source) -> np.ndarray:
        """Her formatı BGR numpy array'e çevirir."""
        if isinstance(source, np.ndarray):
            # Zaten numpy — RGB mi BGR mi kontrol et
            if source.ndim == 3 and source.shape[2] == 3:
                return source  # BGR kabul edilir
            raise ValueError(f"Beklenmeyen numpy shape: {source.shape}")

        if isinstance(source, Image.Image):
            return cv2.cvtColor(np.array(source.convert("RGB")), cv2.COLOR_RGB2BGR)

        # Dosya yolu
        path = Path(source)
        if not path.exists():
            raise FileNotFoundError(f"Görüntü bulunamadı: {path}")

        bgr = cv2.imread(str(path))
        if bgr is None:
            raise ValueError(f"Görüntü okunamadı: {path}")
        return bgr


    def _apply_clahe(self, bgr: np.ndarray) -> np.ndarray:
        """
        LAB renk uzayında yalnızca L (parlaklık) kanalına CLAHE uygular.
        Renk bilgisini (hastalık rengi!) bozmaz.
        """
        lab  = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        l_clahe = self.clahe.apply(l)
        lab_clahe = cv2.merge([l_clahe, a, b])
        return cv2.cvtColor(lab_clahe, cv2.COLOR_LAB2BGR)


    def _check_quality(self, bgr: np.ndarray) -> QualityReport:
        t = self.thresholds
        warnings = []
        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

        # 1. Bulanıklık (Laplacian varyansı)
        blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        if blur_score < t.BLUR_MIN:
            return QualityReport(
                is_valid=False, blur_score=blur_score,
                brightness=0, contrast=0, has_green=False,
                rejection_reason=f"Görüntü çok bulanık (skor: {blur_score:.1f} < {t.BLUR_MIN})",
            )
        if blur_score < t.BLUR_WARN:
            warnings.append(f"⚠️  Düşük netlik (skor: {blur_score:.1f})")

        # 2. Parlaklık
        brightness = float(gray.mean())
        if brightness < t.BRIGHTNESS_MIN:
            return QualityReport(
                is_valid=False, blur_score=blur_score,
                brightness=brightness, contrast=0, has_green=False,
                rejection_reason=f"Görüntü çok karanlık (parlaklık: {brightness:.1f})",
            )
        if brightness > t.BRIGHTNESS_MAX:
            return QualityReport(
                is_valid=False, blur_score=blur_score,
                brightness=brightness, contrast=0, has_green=False,
                rejection_reason=f"Görüntü aşırı parlak/overexposed ({brightness:.1f})",
            )

        # 3. Kontrast
        contrast = float(gray.std())
        if contrast < t.CONTRAST_MIN:
            warnings.append(f"⚠️  Düşük kontrast (std: {contrast:.1f})")

        # 4. Yeşil oran kontrolü (bitki görüntüsü mü?)
        hsv       = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
        green_mask = cv2.inRange(
            hsv,
            np.array([t.GREEN_HUE_LOW,  30, 30]),
            np.array([t.GREEN_HUE_HIGH, 255, 255]),
        )
        green_ratio = float(green_mask.sum() / 255) / (bgr.shape[0] * bgr.shape[1])
        has_green   = green_ratio >= t.GREEN_MIN_RATIO

        if not has_green:
            warnings.append(
                f"⚠️  Düşük yeşil oran ({green_ratio*100:.1f}%) — "
                "bitki görüntüsü olmayabilir"
            )

        return QualityReport(
            is_valid    = True,
            blur_score  = blur_score,
            brightness  = brightness,
            contrast    = contrast,
            has_green   = has_green,
            warnings    = warnings,
        )


    def quality_to_dict(self, q: QualityReport) -> dict:
        return {
            "is_valid"        : q.is_valid,
            "blur_score"      : round(q.blur_score, 2),
            "brightness"      : round(q.brightness, 2),
            "contrast"        : round(q.contrast, 2),
            "has_green"       : q.has_green,
            "rejection_reason": q.rejection_reason,
            "warnings"        : q.warnings,
        }



if __name__ == "__main__":
    import sys

    preprocessor = ImagePreprocessor(target_size=(640, 640))

    # Sentetik test görüntüsü
    dummy_bgr = np.random.randint(40, 200, (480, 640, 3), dtype=np.uint8)
    # Biraz yeşil ekle
    dummy_bgr[:, :, 1] = np.clip(dummy_bgr[:, :, 1] + 60, 0, 255)

    result = preprocessor.process(dummy_bgr, skip_quality_check=False)

    print(f"Geçerli mi     : {result.quality.is_valid}")
    print(f"Bulanıklık     : {result.quality.blur_score:.2f}")
    print(f"Parlaklık      : {result.quality.brightness:.2f}")
    print(f"Yeşil var mı   : {result.quality.has_green}")
    print(f"Orijinal boyut : {result.original_size}")
    print(f"İşlenmiş boyut : {result.processed_size}")
    print(f"PIL mode       : {result.image_pil.mode} {result.image_pil.size}")
    print(f"OpenCV shape   : {result.image_cv2.shape}")
    print(f"Uyarılar       : {result.quality.warnings}")
    print("✅ Preprocessing modülü çalışıyor.")