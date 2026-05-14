import os
import torch
from pathlib import Path
import logging

# ============================================================================
# 📋 CONFIG.PY - SWIN TRANSFORMER WHEAT DISEASE CLASSIFIER
# Veri Seti: 15 Sınıf | Train: 13104 | Valid: 300 | Test: 750
# ============================================================================

# --- Dizin Ayarlaması ---
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
LOGS_DIR = MODELS_DIR / "logs"
CHECKPOINTS_DIR = MODELS_DIR / "checkpoints"
KNOWLEDGE_BASE_DIR = BASE_DIR / "knowledge_base"
RESULTS_DIR = BASE_DIR / "results"

# ============================================================================
#  VERİ SETİ SINIF BİLGİLERİ
# ============================================================================

# Veri setindeki tüm sınıflar (train klasöründeki sırayla - alfabetik)
DATASET_CLASSES = [
    "Aphid",             # 0  - Train: 903
    "Blast",             # 1  - Train: 647
    "Black Rust",        # 2  - Train: 576
    "Brown Rust",        # 3  - Train: 1271
    "Common Root Rot",   # 4  - Train: 614
    "Fusarium Head Blight", # 5 - Train: 611
    "Healthy",           # 6  - Train: 1000
    "Leaf Blight",       # 7  - Train: 842
    "Mildew",            # 8  - Train: 1081
    "Mite",              # 9  - Train: 800
    "Septoria",          # 10 - Train: 1144
    "Smut",              # 11 - Train: 1310
    "Stem fly",          # 12 - Train: 234  ← En az örnekli sınıf!
    "Tan spot",          # 13 - Train: 770
    "Yellow Rust",       # 14 - Train: 1301
]

# Valid klasöründeki hatalı isim → doğru isim eşlemesi
# "blast_test_valid" klasörü aslında "Blast" sınıfıdır
VALID_CLASS_REMAP = {
    "blast_test_valid": "Blast",
}

NUM_CLASSES = 15  # Toplam sınıf sayısı
TOTAL_TRAIN = 13104
TOTAL_VALID = 300
TOTAL_TEST = 750

# ============================================================================
# ⚙️ EĞİTİM KONFİGÜRASYONU
# ============================================================================

# --- Temel Eğitim Parametreleri ---
# Colab T4/A100 için 32 güvenli; OOM yaşarsanız 16'ya düşürün
BATCH_SIZE = 8
# Colab'da 2 en kararlı değerdir
NUM_WORKERS = 0
# GPU transfer hızını artırır
PIN_MEMORY = False
# 15 sınıf + dengesiz veri için 50 epoch yeterli; erken durursa early stopping devreye girer
EPOCHS = 50
# Swin Transformer için standart başlangıç LR
LEARNING_RATE = 2e-5

# Backbone/Head differential LR için bölücü (backbone = LR / LR_DIVISOR)
LR_DIVISOR = 5
# Scheduler minimum LR
MIN_LEARNING_RATE = 1e-07

# --- Model Konfigürasyonu ---
MODEL_NAME = "swin_t"       # Swin Transformer Tiny
IMG_SIZE = 224               
PRETRAINED = True           # ImageNet pre-trained weights

# --- Gelişmiş Eğitim Ayarları ---
LABEL_SMOOTHING = 0.1       # Overconfidence engellemek için
WEIGHT_DECAY = 0.05        # L2 regularization
GRADIENT_CLIP_MAX_NORM = 0.5  # Transformer'larda gradient explosion önleme

# --- Mixed Precision (AMP) ---
# Colab GPU'da ~2x hız artışı, bellek tasarrufu sağlar
USE_MIXED_PRECISION = False
SCALER_INIT_SCALE = 65536.0

# ============================================================================
# 🔧 FINE-TUNING STRATEJİSİ
# ============================================================================

# Aşama 1 (Epoch 1-4):  Backbone dondurulur, sadece head eğitilir
# Aşama 2 (Epoch 5+):   Backbone açılır, differential LR uygulanır
FREEZE_BACKBONE_INITIALLY = True
UNFREEZE_EPOCH = 5
DIFFERENTIAL_LR = True

# ============================================================================
# 📊 KAYDETME & CHECKPOINT
# ============================================================================

SAVE_BEST_MODEL = True
SAVE_CHECKPOINT_INTERVAL = 5   # Her 5 epoch'ta checkpoint
MODEL_CHECKPOINT_PATH = CHECKPOINTS_DIR / "best_swin_model.pth"
FINAL_MODEL_PATH = MODELS_DIR / "final_swin_model.pth"

# ============================================================================
# ⏹️ EARLY STOPPING
# ============================================================================

USE_EARLY_STOPPING = True
EARLY_STOPPING_PATIENCE = 15    # 12 epoch iyileşme olmazsa dur
EARLY_STOPPING_DELTA = 0.001   # Minimum iyileşme eşiği

# ============================================================================
# 🎲 REPRODUCIBILITY
# ============================================================================

SEED = 42
DETERMINISTIC = True

# ============================================================================
# 💻 CİHAZ AYARLARI
# ============================================================================

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CUDA_AVAILABLE = torch.cuda.is_available()

if CUDA_AVAILABLE:
    CUDA_VERSION = torch.version.cuda
    CUDNN_VERSION = torch.backends.cudnn.version()
    GPU_NAME = torch.cuda.get_device_name(0)
    GPU_MEMORY = torch.cuda.get_device_properties(0).total_memory / 1e9
else:
    CUDA_VERSION = "N/A"
    CUDNN_VERSION = "N/A"
    GPU_NAME = "CPU"
    GPU_MEMORY = 0

# ============================================================================
# 📡 API & INFERENCE
# ============================================================================

API_HOST = "0.0.0.0"
API_PORT = 8000
API_DEBUG = False
INFERENCE_TIMEOUT = 30
CONFIDENCE_THRESHOLD = 0.5     # Bu altında "Belirsiz" döndür

# ============================================================================
# 📝 LOGGING
# ============================================================================

LOG_LEVEL = logging.INFO
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
CONSOLE_LOG = True
FILE_LOG = True

# ============================================================================
# 🔍 VALİDASYON
# ============================================================================

CALCULATE_CLASS_WEIGHTS = True
VALIDATION_INTERVAL = 1        # Her epoch validate et
PRINT_INTERVAL = 20            # Her 20 batch'te log

# ============================================================================
# 📈 SCHEDULER
# ============================================================================

SCHEDULER_TYPE = "cosine"
COSINE_T_MAX = EPOCHS
COSINE_ETA_MIN = MIN_LEARNING_RATE

# ============================================================================
# 📊 METRİK TAKİBİ
# ============================================================================

TRACK_METRICS = [
    "train_loss",
    "val_loss",
    "val_accuracy",
    "val_f1",
    "learning_rate",
    "epoch_time",
]

# Düzeltildi: MODELS_DIR altında training_history.json
HISTORY_FILE = MODELS_DIR / "training_history.json"
RESULTS_JSON = RESULTS_DIR / "final_results.json"

# Runtime'da güncellenir
CLASS_TO_IDX = {}
IDX_TO_CLASS = {}

# ============================================================================
# 📁 KLASÖR OLUŞTURMA
# ============================================================================

def create_directories():
    dirs = [DATA_DIR, MODELS_DIR, LOGS_DIR,
            CHECKPOINTS_DIR, KNOWLEDGE_BASE_DIR, RESULTS_DIR]
    for d in dirs:
        d.mkdir(parents=True, exist_ok=True)
    return True


create_directories()

# ============================================================================
# ✅ KONFİGÜRASYON DOĞRULAMA
# ============================================================================

def validate_config():
    warnings = []
    if BATCH_SIZE < 8:
        warnings.append("⚠️  BATCH_SIZE çok düşük (<8)")
    if BATCH_SIZE > 128:
        warnings.append("⚠️  BATCH_SIZE çok yüksek (>128), OOM riski var")
    if LEARNING_RATE > 1e-3:
        warnings.append("⚠️  LEARNING_RATE çok yüksek (>1e-3)")
    if LEARNING_RATE < 1e-6:
        warnings.append("⚠️  LEARNING_RATE çok düşük (<1e-6)")
    if EPOCHS < 20:
        warnings.append("⚠️  EPOCHS çok az (<20), 15 sınıf için yetersiz")
    if NUM_CLASSES < 2:
        warnings.append("❌ NUM_CLASSES >= 2 olmalı")
    if LABEL_SMOOTHING < 0 or LABEL_SMOOTHING > 0.5:
        warnings.append("⚠️  LABEL_SMOOTHING 0-0.5 aralığında olmalı")
    if WEIGHT_DECAY > 0.1:
        warnings.append("⚠️  WEIGHT_DECAY çok yüksek (>0.1)")
    return warnings


config_warnings = validate_config()

# ============================================================================
# 🖨️ KONFİGÜRASYON YAZDIR
# ============================================================================

def print_config():
    print("\n" + "=" * 80)
    print("🚀 SWIN TRANSFORMER WHEAT DISEASE CLASSIFIER — CONFIGURATION")
    print("=" * 80)

    print(f"\n📱 CİHAZ:")
    print(f"  • Device : {DEVICE}")
    print(f"  • CUDA   : {CUDA_AVAILABLE}")
    if CUDA_AVAILABLE:
        print(f"  • GPU    : {GPU_NAME}")
        print(f"  • VRAM   : {GPU_MEMORY:.1f} GB")
        print(f"  • CUDA   : {CUDA_VERSION}")
        print(f"  • cuDNN  : {CUDNN_VERSION}")

    print(f"\n🤖 MODEL:")
    print(f"  • Model      : {MODEL_NAME}")
    print(f"  • Num Classes: {NUM_CLASSES}")
    print(f"  • Input Size : {IMG_SIZE}x{IMG_SIZE}")
    print(f"  • Pretrained : {PRETRAINED}")
    print(f"  • AMP        : {USE_MIXED_PRECISION}")

    print(f"\n⚙️  EĞİTİM:")
    print(f"  • Epochs         : {EPOCHS}")
    print(f"  • Batch Size     : {BATCH_SIZE}")
    print(f"  • Learning Rate  : {LEARNING_RATE}")
    print(f"  • Min LR         : {MIN_LEARNING_RATE}")
    print(f"  • Label Smoothing: {LABEL_SMOOTHING}")
    print(f"  • Weight Decay   : {WEIGHT_DECAY}")
    print(f"  • Gradient Clip  : {GRADIENT_CLIP_MAX_NORM}")

    print(f"\n📈 FINE-TUNING STRATEJİSİ:")
    print(f"  • Backbone Freeze  : Epoch 1-{UNFREEZE_EPOCH - 1}")
    print(f"  • Backbone Unfreeze: Epoch {UNFREEZE_EPOCH}+")
    print(f"  • Differential LR  : {DIFFERENTIAL_LR} (backbone={LEARNING_RATE/LR_DIVISOR})")
    print(f"  • Early Stopping   : {USE_EARLY_STOPPING} (patience={EARLY_STOPPING_PATIENCE})")

    print(f"\n🗂️  VERİ SETİ:")
    print(f"  • Train : {TOTAL_TRAIN} görsel | 15 sınıf")
    print(f"  • Valid : {TOTAL_VALID} görsel | 20/sınıf")
    print(f"  • Test  : {TOTAL_TEST} görsel  | 50/sınıf")
    print(f"  • ⚠️  Dikkat: 'Stem fly' yalnızca 234 görsel (class weight kritik)")
    print(f"  • ⚠️  Valid 'blast_test_valid' → 'Blast' olarak yeniden eşlendi")

    print(f"\n📁 KLASÖRLER:")
    print(f"  • Data       : {DATA_DIR}")
    print(f"  • Models     : {MODELS_DIR}")
    print(f"  • Logs       : {LOGS_DIR}")
    print(f"  • Checkpoints: {CHECKPOINTS_DIR}")
    print(f"  • Results    : {RESULTS_DIR}")

    if config_warnings:
        print(f"\n⚠️  UYARILAR:")
        for w in config_warnings:
            print(f"  {w}")

    print("\n" + "=" * 80 + "\n")


# ============================================================================
# 🔧 YARDIMCI FONKSİYONLAR
# ============================================================================

def get_device_info():
    return {
        "device": str(DEVICE),
        "cuda_available": CUDA_AVAILABLE,
        "gpu_name": GPU_NAME,
        "gpu_memory_gb": GPU_MEMORY,
        "cuda_version": CUDA_VERSION,
        "cudnn_version": CUDNN_VERSION,
        "amp_enabled": USE_MIXED_PRECISION,
    }


def get_model_config():
    return {
        "model_name": MODEL_NAME,
        "num_classes": NUM_CLASSES,
        "img_size": IMG_SIZE,
        "pretrained": PRETRAINED,
        "label_smoothing": LABEL_SMOOTHING,
        "weight_decay": WEIGHT_DECAY,
    }


def get_training_config():
    return {
        "batch_size": BATCH_SIZE,
        "epochs": EPOCHS,
        "learning_rate": LEARNING_RATE,
        "min_learning_rate": MIN_LEARNING_RATE,
        "scheduler_type": SCHEDULER_TYPE,
        "unfreeze_epoch": UNFREEZE_EPOCH,
        "early_stopping": USE_EARLY_STOPPING,
        "amp": USE_MIXED_PRECISION,
    }


if __name__ == "__main__":
    print_config()
    print(f"Base Directory: {BASE_DIR}")
    print(f"Device: {DEVICE}")
    print("\nDevice Info:")
    for k, v in get_device_info().items():
        print(f"  {k}: {v}")