"""
PREDICT.PY — Buğday Hastalığı Tespiti: Tek Görüntü / Klasör Inference
Kullanım:
    python predict.py --image yol/goruntu.jpg
    python predict.py --folder yol/klasor/ --top_k 3
    python predict.py --image yol/goruntu.jpg --model modeller/best.pth --mapping modeller/class_mapping.json
"""

import os
import sys
import json
import argparse
import torch
import torch.nn.functional as F
from PIL import Image
from pathlib import Path
from typing import Optional

# ── Proje path ayarı ──────────────────────────────────────────────────────────
project_root = Path(__file__).resolve().parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

from models.model import WheatDiseaseClassifier
from utils.dataset import get_transforms


# ============================================================================
# 🔧 MODEL YÜKLEME
# ============================================================================

def load_model(
    model_path: str,
    num_classes: int,
    device: torch.device,
) -> WheatDiseaseClassifier:
    """
    Eğitilmiş modeli checkpoint dosyasından yükler.

    Checkpoint formatı (train.py'nin kaydettiği):
        {
            "epoch"            : int,
            "model_state_dict" : OrderedDict,
            "val_acc"          : float,
            ...
        }

    Args:
        model_path  : .pth dosyasının yolu
        num_classes : Sınıf sayısı (class_mapping'den alınır)
        device      : CPU veya CUDA

    Returns:
        Eval modunda WheatDiseaseClassifier
    """
    model = WheatDiseaseClassifier(num_classes=num_classes, pretrained=False)

    try:
        checkpoint = torch.load(model_path, map_location=device)

        # train.py, checkpoint dict olarak kaydeder
        if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
            model.load_state_dict(checkpoint["model_state_dict"])
            epoch   = checkpoint.get("epoch", "?")
            val_acc = checkpoint.get("val_acc", 0.0)
            print(f"✅ Checkpoint yüklendi — Epoch: {epoch} | Val Acc: {val_acc*100:.2f}%")
        else:
            # Eski format: doğrudan state_dict
            model.load_state_dict(checkpoint)
            print("✅ Model ağırlıkları yüklendi (doğrudan state_dict formatı)")

    except FileNotFoundError:
        print(f"❌ Model dosyası bulunamadı: {model_path}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Model yükleme hatası: {e}")
        sys.exit(1)

    model.to(device)
    model.eval()
    return model


# ============================================================================
# 🔍 TEK GÖRÜNTÜ TAHMİN
# ============================================================================

def predict_single(
    image_path: str,
    model: WheatDiseaseClassifier,
    transform,
    idx_to_class: dict,
    device: torch.device,
    top_k: int = 3,
    confidence_threshold: float = 0.5,
) -> Optional[dict]:
    """
    Tek bir görüntü için hastalık tahmini yapar.

    Args:
        image_path           : Görüntü dosyasının yolu
        model                : Yüklenmiş model
        transform            : val_test_transform
        idx_to_class         : {indeks: sınıf_adı} sözlüğü
        device               : CPU / CUDA
        top_k                : Döndürülecek en iyi K tahmin sayısı
        confidence_threshold : Bu eşiğin altında 'Belirsiz' döndürür

    Returns:
        dict: {
            "image"        : dosya adı,
            "prediction"   : en iyi sınıf adı,
            "confidence"   : güven skoru (0-1),
            "is_certain"   : bool,
            "top_k"        : [(sınıf, skor), ...],
        }
    """
    try:
        img = Image.open(image_path).convert("RGB")
    except Exception as e:
        print(f"❌ Görüntü açılamadı '{image_path}': {e}")
        return None

    tensor = transform(img).unsqueeze(0).to(device)  # [1, C, H, W]

    with torch.no_grad():
        outputs      = model(tensor)                          # [1, num_classes]
        probs        = F.softmax(outputs, dim=1)[0]           # [num_classes]
        top_probs, top_indices = torch.topk(probs, k=min(top_k, len(idx_to_class)))

    top_k_results = [
        (idx_to_class.get(str(idx.item()), f"Sınıf-{idx.item()}"), round(prob.item(), 4))
        for idx, prob in zip(top_indices, top_probs)
    ]

    best_class = top_k_results[0][0]
    best_conf  = top_k_results[0][1]

    return {
        "image"      : Path(image_path).name,
        "prediction" : best_class if best_conf >= confidence_threshold else "Belirsiz",
        "confidence" : best_conf,
        "is_certain" : best_conf >= confidence_threshold,
        "top_k"      : top_k_results,
    }


# ============================================================================
# 📁 KLASÖR TAHMİN
# ============================================================================

def predict_folder(
    folder_path: str,
    model: WheatDiseaseClassifier,
    transform,
    idx_to_class: dict,
    device: torch.device,
    top_k: int = 3,
    confidence_threshold: float = 0.5,
) -> list:
    """
    Bir klasördeki tüm görüntüler için tahmin yapar.

    Desteklenen formatlar: .jpg, .jpeg, .png, .bmp, .tiff, .webp
    """
    exts   = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}
    images = [p for p in Path(folder_path).iterdir() if p.suffix.lower() in exts]

    if not images:
        print(f"⚠️  '{folder_path}' içinde desteklenen görüntü bulunamadı.")
        return []

    print(f"📂 {len(images)} görüntü bulundu, tahmin yapılıyor...\n")
    results = []

    for img_path in sorted(images):
        result = predict_single(
            image_path           = str(img_path),
            model                = model,
            transform            = transform,
            idx_to_class         = idx_to_class,
            device               = device,
            top_k                = top_k,
            confidence_threshold = confidence_threshold,
        )
        if result:
            results.append(result)
            status = "✅" if result["is_certain"] else "⚠️ "
            print(
                f"  {status} {result['image']:<30} → "
                f"{result['prediction']:<25} ({result['confidence']*100:.1f}%)"
            )

    return results


# ============================================================================
# 🖨️ SONUÇ YAZDIR
# ============================================================================

def print_result(result: dict):
    if result is None:
        return
    print(f"\n{'─'*55}")
    print(f"  Görüntü    : {result['image']}")
    print(f"  Tahmin     : {result['prediction']}")
    print(f"  Güven      : {result['confidence']*100:.2f}%")
    print(f"  Kesinlik   : {'✅ Evet' if result['is_certain'] else '⚠️  Düşük güven'}")
    print(f"\n  Top-{len(result['top_k'])} Tahminler:")
    for i, (cls, score) in enumerate(result["top_k"], 1):
        bar = "█" * int(score * 30)
        print(f"    {i}. {cls:<25} {score*100:5.1f}%  {bar}")
    print(f"{'─'*55}\n")


# ============================================================================
# 🎬 MAIN
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Buğday Hastalığı Tespiti — Inference",
        formatter_class=argparse.RawTextHelpFormatter,
    )

    # Girdi (birbirini dışlayan)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--image",  type=str, help="Tek görüntü dosyasının yolu")
    group.add_argument("--folder", type=str, help="Tahmin yapılacak klasör yolu")

    # Model & mapping
    default_model   = str(project_root / "models" / "checkpoints" / "best_swin_model.pth")
    default_mapping = str(project_root / "models" / "class_mapping.json")
    parser.add_argument("--model",   type=str, default=default_model,   help=f"Model dosyası (varsayılan: {default_model})")
    parser.add_argument("--mapping", type=str, default=default_mapping, help=f"Class mapping JSON (varsayılan: {default_mapping})")

    # Seçenekler
    parser.add_argument("--top_k",     type=int,   default=3,   help="Kaç adet tahmin gösterilsin (varsayılan: 3)")
    parser.add_argument("--threshold", type=float, default=0.5, help="Güven eşiği (varsayılan: 0.5)")
    parser.add_argument("--save",      type=str,   default=None, help="Sonuçları JSON olarak kaydet")
    parser.add_argument("--cpu",       action="store_true",      help="GPU yerine CPU kullan")

    args = parser.parse_args()

    # ── Cihaz ─────────────────────────────────────────────────────────────────
    if args.cpu:
        device = torch.device("cpu")
    else:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"💻 Cihaz: {device}")

    # ── Class Mapping ──────────────────────────────────────────────────────────
    if not Path(args.mapping).exists():
        print(f"❌ Class mapping dosyası bulunamadı: {args.mapping}")
        print("   Önce train.py çalıştırın.")
        sys.exit(1)

    with open(args.mapping, "r", encoding="utf-8") as f:
        idx_to_class = json.load(f)   # {"0": "Aphid", "1": "Blast", ...}

    num_classes = len(idx_to_class)
    print(f"🗂️  Sınıf sayısı: {num_classes}")

    # ── Model ─────────────────────────────────────────────────────────────────
    model = load_model(args.model, num_classes, device)

    # ── Transform ─────────────────────────────────────────────────────────────
    _, val_test_transform = get_transforms()

    # ── Tahmin ────────────────────────────────────────────────────────────────
    all_results = []

    if args.image:
        result = predict_single(
            image_path           = args.image,
            model                = model,
            transform            = val_test_transform,
            idx_to_class         = idx_to_class,
            device               = device,
            top_k                = args.top_k,
            confidence_threshold = args.threshold,
        )
        print_result(result)
        if result:
            all_results = [result]

    elif args.folder:
        all_results = predict_folder(
            folder_path          = args.folder,
            model                = model,
            transform            = val_test_transform,
            idx_to_class         = idx_to_class,
            device               = device,
            top_k                = args.top_k,
            confidence_threshold = args.threshold,
        )
        # Klasör özeti
        if all_results:
            certain = sum(1 for r in all_results if r["is_certain"])
            print(f"\n📊 Özet: {len(all_results)} görüntü | "
                  f"Kesin: {certain} | Belirsiz: {len(all_results)-certain}")

    # ── JSON Kaydet ───────────────────────────────────────────────────────────
    if args.save and all_results:
        save_path = Path(args.save)
        save_path.parent.mkdir(parents=True, exist_ok=True)
        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(all_results, f, indent=4, ensure_ascii=False)
        print(f"💾 Sonuçlar kaydedildi: {save_path}")


if __name__ == "__main__":
    main()