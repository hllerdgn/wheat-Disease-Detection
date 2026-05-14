"""
TRAIN.PY — Swin Transformer Wheat Disease Classifier
Özellikler:
    • Mixed Precision (AMP) desteği
    • Early Stopping
    • Differential Learning Rate (backbone vs head)
    • Aşamalı Fine-tuning (freeze → unfreeze)
    • Detaylı metrik takibi (Accuracy, F1, Precision, Recall)
    • Checkpoint kaydetme (best + periyodik)
    • Kaldığı yerden devam etme (resume training)
"""

import os
import sys
import time
import json
import logging
from pathlib import Path
from datetime import datetime
from PIL import ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

import torch
import torch.nn as nn
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from torch.cuda.amp import GradScaler, autocast
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

current_dir = Path(__file__).resolve().parent
project_root = (
    current_dir.parent if (current_dir.parent / "config.py").exists() else current_dir
)
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

import config
from utils.dataset import get_dataloaders
from models.model import WheatDiseaseClassifier


def setup_logger() -> logging.Logger:
    logger = logging.getLogger("WheatTrainer")
    logger.setLevel(config.LOG_LEVEL)
    formatter = logging.Formatter(config.LOG_FORMAT)

    if config.CONSOLE_LOG and not logger.handlers:
        ch = logging.StreamHandler()
        ch.setFormatter(formatter)
        logger.addHandler(ch)

    if config.FILE_LOG:
        config.LOGS_DIR.mkdir(parents=True, exist_ok=True)
        log_file = (
            config.LOGS_DIR / f"train_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        )
        fh = logging.FileHandler(log_file, encoding="utf-8")
        fh.setFormatter(formatter)
        logger.addHandler(fh)
        logger.info(f"Log dosyası: {log_file}")

    return logger


def set_seed(seed: int = config.SEED):
    torch.manual_seed(seed)
    np.random.seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
    if config.DETERMINISTIC:
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False


def calculate_metrics(preds: np.ndarray, labels: np.ndarray) -> dict:
    """Accuracy, Precision, Recall, F1 ve confusion matrix hesaplar."""
    return {
        "accuracy": float(accuracy_score(labels, preds)),
        "precision": float(
            precision_score(labels, preds, average="weighted", zero_division=0)
        ),
        "recall": float(
            recall_score(labels, preds, average="weighted", zero_division=0)
        ),
        "f1_score": float(f1_score(labels, preds, average="weighted", zero_division=0)),
        "per_class_f1": f1_score(labels, preds, average=None, zero_division=0).tolist(),
        "per_class_precision": precision_score(
            labels, preds, average=None, zero_division=0
        ).tolist(),
        "per_class_recall": recall_score(
            labels, preds, average=None, zero_division=0
        ).tolist(),
        "confusion_matrix": confusion_matrix(labels, preds).tolist(),
    }


def log_metrics(metrics: dict, class_names: list, stage: str, logger: logging.Logger):
    """Metrikleri okunabilir şekilde loglar."""
    logger.info(f"\n{'='*70}")
    logger.info(f" {stage.upper()} METRİKLERİ")
    logger.info(f"{'='*70}")
    logger.info(f"  Accuracy  : {metrics['accuracy']*100:6.2f}%")
    logger.info(f"  Precision : {metrics['precision']*100:6.2f}%")
    logger.info(f"  Recall    : {metrics['recall']*100:6.2f}%")
    logger.info(f"  F1-Score  : {metrics['f1_score']*100:6.2f}%")

    if class_names:
        logger.info(f"\n  {'Sınıf':<26} {'Precision':>10} {'Recall':>10} {'F1':>10}")
        logger.info(f"  {'─'*58}")
        for i, name in enumerate(class_names):
            p = metrics["per_class_precision"][i] * 100
            r = metrics["per_class_recall"][i] * 100
            f1 = metrics["per_class_f1"][i] * 100
            logger.info(f"  {name:<26} {p:>9.2f}% {r:>9.2f}% {f1:>9.2f}%")

    logger.info(f"{'='*70}\n")


class EarlyStopping:
    """
    Validation accuracy belirli epoch boyunca iyileşmezse eğitimi durdurur.

    Args:
        patience (int)  : Beklenecek epoch sayısı
        delta (float)   : Minimum iyileşme eşiği
        logger          : Loglama nesnesi
    """

    def __init__(self, patience: int = 8, delta: float = 0.001, logger=None):
        self.patience = patience
        self.delta = delta
        self.logger = logger
        self.counter = 0
        self.best_score = None
        self.stop = False

    def __call__(self, val_acc: float) -> bool:
        score = val_acc
        if self.best_score is None:
            self.best_score = score
        elif score < self.best_score + self.delta:
            self.counter += 1
            msg = f"⏹️  EarlyStopping: {self.counter}/{self.patience}"
            if self.logger:
                self.logger.info(msg)
            else:
                print(msg)
            if self.counter >= self.patience:
                self.stop = True
        else:
            self.best_score = score
            self.counter = 0
        return self.stop


def train_model():
    logger = setup_logger()
    set_seed()

    # Config validasyon
    warnings = config.validate_config()
    for w in warnings:
        logger.warning(w)

    config.print_config()

    device = config.DEVICE
    logger.info(f" Cihaz: {device}")
    for k, v in config.get_device_info().items():
        logger.info(f"  • {k}: {v}")

    use_amp = config.USE_MIXED_PRECISION and torch.cuda.is_available()
    scaler = GradScaler(init_scale=config.SCALER_INIT_SCALE) if use_amp else None
    logger.info(f"⚡ Mixed Precision (AMP): {'Aktif' if use_amp else 'Devre Dışı'}")

    logger.info("📦 Veri setleri yükleniyor...")
    train_loader, val_loader, test_loader, class_to_idx, class_weights = (
        get_dataloaders(
            data_dir=str(config.DATA_DIR),
            batch_size=config.BATCH_SIZE,
            num_workers=config.NUM_WORKERS,
            pin_memory=config.PIN_MEMORY,
        )
    )

    config.CLASS_TO_IDX = class_to_idx
    config.IDX_TO_CLASS = {v: k for k, v in class_to_idx.items()}
    class_names = [config.IDX_TO_CLASS[i] for i in range(len(config.IDX_TO_CLASS))]

    # Class mapping kaydet
    config.MODELS_DIR.mkdir(parents=True, exist_ok=True)
    mapping_path = config.MODELS_DIR / "class_mapping.json"
    with open(mapping_path, "w", encoding="utf-8") as f:
        json.dump(config.IDX_TO_CLASS, f, indent=4, ensure_ascii=False)
    logger.info(f"✅ Class mapping kaydedildi: {mapping_path}")

    logger.info("🤖 Model oluşturuluyor...")
    model = WheatDiseaseClassifier(
        num_classes=config.NUM_CLASSES,
        model_name=config.MODEL_NAME,
        pretrained=config.PRETRAINED,
    ).to(device)

    model.model_summary()

    if config.FREEZE_BACKBONE_INITIALLY:
        model.freeze_backbone()

    class_weights = class_weights.to(device)
    criterion = nn.CrossEntropyLoss(
        weight=class_weights,
        label_smoothing=config.LABEL_SMOOTHING,
    )
    logger.info(
        f"📉 Loss: CrossEntropyLoss | Label Smoothing: {config.LABEL_SMOOTHING}"
    )

    early_stopping = (
        EarlyStopping(
            patience=config.EARLY_STOPPING_PATIENCE,
            delta=config.EARLY_STOPPING_DELTA,
            logger=logger,
        )
        if config.USE_EARLY_STOPPING
        else None
    )

    history = {m: [] for m in config.TRACK_METRICS}
    history["val_f1"] = []

    best_val_acc = 0.0
    best_val_f1 = 0.0
    val_metrics_log = []

    resume_path = config.CHECKPOINTS_DIR / "checkpoint_epoch_030.pth"
    start_epoch = 1  # Eğitimi 1'den başlat (sadece ağırlıklar alınır)

    if resume_path.exists():
        logger.info(f"♻️  Önceki model ağırlıkları yükleniyor: {resume_path}")
        checkpoint = torch.load(resume_path, map_location=device)
        # SADECE MODEL AĞIRLIKLARINI YÜKLE (optimizer/scheduler resetlenecek)
        model.load_state_dict(checkpoint["model_state_dict"])
        # 384px'e geçtiğimiz için backbone'un açık olduğundan emin olalım
        model.unfreeze_backbone()
        logger.info(
            "✅ Model ağırlıkları aktarıldı. Optimizer ve scheduler sıfırdan başlatılıyor."
        )
    else:
        logger.warning("⚠️ Checkpoint bulunamadı, eğitim sıfırdan başlıyor!")

    # Differential LR için parametre grupları
    backbone_lr = config.LEARNING_RATE / config.LR_DIVISOR
    head_lr = config.LEARNING_RATE

    optimizer = AdamW(
        model.get_param_groups(head_lr=head_lr, backbone_lr=backbone_lr),
        weight_decay=config.WEIGHT_DECAY,
    )

    scheduler = CosineAnnealingLR(
        optimizer,
        T_max=config.EPOCHS,
        eta_min=config.COSINE_ETA_MIN,
    )

    logger.info("─" * 70)
    logger.info("🔥 EĞİTİM BAŞLIYOR")
    logger.info("─" * 70)

    total_start = time.time()

    # EPOCH DÖNGÜSÜ
    for epoch in range(start_epoch, config.EPOCHS + 1):
        epoch_start = time.time()

        if epoch == config.UNFREEZE_EPOCH and config.FREEZE_BACKBONE_INITIALLY:
            logger.info(f"\n{'='*70}")
            logger.info(
                f"[Epoch {epoch}] 🔓 Backbone açılıyor — Differential LR uygulanıyor"
            )
            logger.info(f"{'='*70}")

            model.unfreeze_backbone()

            if config.DIFFERENTIAL_LR:
                backbone_lr = config.LEARNING_RATE / config.LR_DIVISOR
                head_lr = config.LEARNING_RATE
                optimizer = AdamW(
                    model.get_param_groups(head_lr=head_lr, backbone_lr=backbone_lr),
                    weight_decay=config.WEIGHT_DECAY,
                )
                scheduler = CosineAnnealingLR(
                    optimizer,
                    T_max=config.EPOCHS - epoch + 1,
                    eta_min=config.COSINE_ETA_MIN,
                )
                logger.info(f"  Backbone LR : {backbone_lr}")
                logger.info(f"  Head LR     : {head_lr}")

        model.train()
        running_loss = 0.0
        batch_count = 0

        for batch_idx, (images, labels) in enumerate(train_loader):
            if images.size(0) == 0:
                continue

            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            optimizer.zero_grad()

            if use_amp:
                with autocast():
                    outputs = model(images)
                    loss = criterion(outputs, labels)
                scaler.scale(loss).backward()
                scaler.unscale_(optimizer)
                torch.nn.utils.clip_grad_norm_(
                    model.parameters(), config.GRADIENT_CLIP_MAX_NORM
                )
                scaler.step(optimizer)
                scaler.update()
            else:
                outputs = model(images)
                loss = criterion(outputs, labels)
                if torch.isnan(loss):
                    logger.error(f"❌ NaN loss — epoch {epoch}, batch {batch_idx}")
                    continue
                loss.backward()
                torch.nn.utils.clip_grad_norm_(
                    model.parameters(), config.GRADIENT_CLIP_MAX_NORM
                )
                optimizer.step()

            running_loss += loss.item() * images.size(0)
            batch_count += 1

            if (batch_idx + 1) % config.PRINT_INTERVAL == 0:
                avg_loss = running_loss / (batch_count * config.BATCH_SIZE)
                current_lr = optimizer.param_groups[0]["lr"]
                logger.info(
                    f"Epoch [{epoch:02d}/{config.EPOCHS}] "
                    f"Batch [{batch_idx+1:4d}/{len(train_loader)}] "
                    f"Loss: {loss.item():.4f} (Avg: {avg_loss:.4f}) | "
                    f"LR: {current_lr:.2e}"
                )

        epoch_train_loss = running_loss / len(train_loader.dataset)

        if epoch % config.VALIDATION_INTERVAL == 0 or epoch == config.EPOCHS:
            model.eval()
            val_loss = 0.0
            val_preds = []
            val_labels = []

            with torch.no_grad():
                for images, labels in val_loader:
                    images = images.to(device, non_blocking=True)
                    labels = labels.to(device, non_blocking=True)

                    if use_amp:
                        with autocast():
                            outputs = model(images)
                            loss = criterion(outputs, labels)
                    else:
                        outputs = model(images)
                        loss = criterion(outputs, labels)

                    val_loss += loss.item() * images.size(0)
                    _, predicted = torch.max(outputs, 1)
                    val_preds.extend(predicted.cpu().numpy())
                    val_labels.extend(labels.cpu().numpy())

            epoch_val_loss = val_loss / len(val_loader.dataset)
            val_metrics = calculate_metrics(np.array(val_preds), np.array(val_labels))
            epoch_val_acc = val_metrics["accuracy"]
            epoch_val_f1 = val_metrics["f1_score"]
            val_metrics_log.append(val_metrics)
        else:
            epoch_val_loss = 0.0
            epoch_val_acc = 0.0
            epoch_val_f1 = 0.0
            val_metrics = None

        scheduler.step()
        current_lr = optimizer.param_groups[0]["lr"]
        epoch_time = time.time() - epoch_start

        history["train_loss"].append(epoch_train_loss)
        history["val_loss"].append(epoch_val_loss)
        history["val_accuracy"].append(epoch_val_acc)
        history["val_f1"].append(epoch_val_f1)
        history["learning_rate"].append(current_lr)
        history["epoch_time"].append(epoch_time)

        logger.info(
            f"\n Epoch {epoch:02d}/{config.EPOCHS} — "
            f"Train Loss: {epoch_train_loss:.4f} | "
            f"Val Loss: {epoch_val_loss:.4f} | "
            f"Val Acc: {epoch_val_acc*100:.2f}% | "
            f"Val F1: {epoch_val_f1*100:.2f}% | "
            f"LR: {current_lr:.2e} | "
            f"Süre: {epoch_time:.1f}s"
        )

        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            best_val_f1 = epoch_val_f1

            config.CHECKPOINTS_DIR.mkdir(parents=True, exist_ok=True)
            checkpoint = {
                "epoch": epoch,
                "model_state_dict": model.state_dict(),
                "optimizer_state_dict": optimizer.state_dict(),
                "scheduler_state_dict": scheduler.state_dict(),
                "val_acc": best_val_acc,
                "val_f1": best_val_f1,
                "val_loss": epoch_val_loss,
                "val_metrics": val_metrics,
                "class_to_idx": class_to_idx,
                "history": history,
                "config": {
                    "model_name": config.MODEL_NAME,
                    "num_classes": config.NUM_CLASSES,
                    "img_size": config.IMG_SIZE,
                    "batch_size": config.BATCH_SIZE,
                    "lr": config.LEARNING_RATE,
                    "epochs": config.EPOCHS,
                },
            }
            torch.save(checkpoint, config.MODEL_CHECKPOINT_PATH)
            logger.info(
                f"  ✨ En iyi model kaydedildi! "
                f"(Acc: {best_val_acc*100:.2f}% | F1: {best_val_f1*100:.2f}%)"
            )

        if epoch % config.SAVE_CHECKPOINT_INTERVAL == 0:
            periodic_path = config.CHECKPOINTS_DIR / f"checkpoint_epoch_{epoch:03d}.pth"
            torch.save(
                {
                    "epoch": epoch,
                    "model_state_dict": model.state_dict(),
                    "optimizer_state_dict": optimizer.state_dict(),
                    "scheduler_state_dict": scheduler.state_dict(),
                    "val_acc": epoch_val_acc,
                    "history": history,
                },
                periodic_path,
            )
            logger.info(f"  📌 Periyodik checkpoint: {periodic_path.name}")

        logger.info("─" * 70)

        if early_stopping and early_stopping(epoch_val_acc):
            logger.info(f"⏹️  Early stopping tetiklendi — Epoch {epoch}")
            break

    # ══════════════════════════════════════════════════════════════════════════
    # TEST DEĞERLENDİRMESİ
    # ══════════════════════════════════════════════════════════════════════════
    logger.info(f"\n{'='*70}")
    logger.info("🧪 TEST SETİ DEĞERLENDİRMESİ")
    logger.info(f"{'='*70}")

    # En iyi model ağırlıklarını yükle
    best_ckpt = torch.load(config.MODEL_CHECKPOINT_PATH, map_location=device)
    model.load_state_dict(best_ckpt["model_state_dict"])
    logger.info(f"✅ En iyi checkpoint yüklendi (Epoch {best_ckpt['epoch']})")

    model.eval()
    test_preds = []
    test_labels = []

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device, non_blocking=True)
            if use_amp:
                with autocast():
                    outputs = model(images)
            else:
                outputs = model(images)
            _, predicted = torch.max(outputs, 1)
            test_preds.extend(predicted.cpu().numpy())
            test_labels.extend(labels.cpu().numpy())

    test_metrics = calculate_metrics(np.array(test_preds), np.array(test_labels))
    log_metrics(test_metrics, class_names, "TEST", logger)

    # sklearn classification report
    logger.info(
        "📋 Sklearn Classification Report:\n"
        + classification_report(
            test_labels, test_preds, target_names=class_names, zero_division=0
        )
    )

    # ══════════════════════════════════════════════════════════════════════════
    # SONUÇ & KAYIT
    # ══════════════════════════════════════════════════════════════════════════
    total_time = time.time() - total_start

    logger.info(f"\n{'='*70}")
    logger.info("🏆 EĞİTİM TAMAMLANDI")
    logger.info(f"{'='*70}")
    logger.info(f"  Best Val Accuracy  : {best_val_acc*100:.2f}%")
    logger.info(f"  Best Val F1        : {best_val_f1*100:.2f}%")
    logger.info(f"  Test Accuracy      : {test_metrics['accuracy']*100:.2f}%")
    logger.info(f"  Test F1            : {test_metrics['f1_score']*100:.2f}%")
    logger.info(f"  Toplam Süre        : {total_time/3600:.2f} saat")
    logger.info(f"  Ortalama Epoch Süresi: {total_time/config.EPOCHS:.1f}s")

    # Tarihçe kaydet
    config.HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(config.HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=4)
    logger.info(f"  📊 Tarihçe: {config.HISTORY_FILE}")

    # Sonuç raporu kaydet
    results = {
        "best_val_accuracy": best_val_acc,
        "best_val_f1": best_val_f1,
        "test_accuracy": test_metrics["accuracy"],
        "test_precision": test_metrics["precision"],
        "test_recall": test_metrics["recall"],
        "test_f1_score": test_metrics["f1_score"],
        "test_metrics": test_metrics,
        "val_metrics_last": val_metrics_log[-1] if val_metrics_log else {},
        "total_epochs_run": len(history["train_loss"]),
        "total_time_hours": total_time / 3600,
        "model_checkpoint": str(config.MODEL_CHECKPOINT_PATH),
        "config": config.get_training_config(),
    }

    config.RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    result_path = (
        config.RESULTS_DIR / f"results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    )
    with open(result_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)
    logger.info(f"  📄 Sonuç raporu: {result_path}")
    logger.info("=" * 70 + "\n")

    return model, history, results


if __name__ == "__main__":
    logger = setup_logger()
    logger.info("🚀 train.py başlatıldı")
    try:
        model, history, results = train_model()
        logger.info("✅ Eğitim başarıyla tamamlandı!")
    except KeyboardInterrupt:
        logger.warning("⚠️  Eğitim kullanıcı tarafından durduruldu (Ctrl+C)")
    except Exception as e:
        logger.error(f"❌ Eğitim hatası: {e}", exc_info=True)
        raise
