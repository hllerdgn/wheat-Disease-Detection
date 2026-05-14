import os
import sys
from pathlib import Path
import torch
import numpy as np
from sklearn.metrics import classification_report, accuracy_score, f1_score

# --- KRİTİK DÜZELTME: config.py'yi bulmak için proje ana dizinini sisteme tanıtıyoruz ---
current_dir = Path(__file__).resolve().parent
# Eğer evaluate.py 'models' klasöründeyse, bir üst klasöre (ana dizine) çık
project_root = current_dir.parent if current_dir.name == "models" else current_dir
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

# Artık config ve diğer modüller sorunsuz yüklenecek
import config
from utils.dataset import get_dataloaders
from models.model import WheatDiseaseClassifier

def evaluate_model(model_path):
    print("=" * 60)
    print("🔍 SWIN TRANSFORMER TEST DEĞERLENDİRMESİ BAŞLIYOR")
    print("=" * 60)

    # 1. Cihaz Ayarı
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🖥️ Cihaz: {device}")
    # 2. Test Verisini Yükle (Sadece test_loader'a ihtiyacımız var)
    print("📦 Test verisi yükleniyor...")
    _, _, test_loader, class_to_idx, _ = get_dataloaders(
        data_dir=str(config.DATA_DIR),
        batch_size=config.BATCH_SIZE,
        num_workers=config.NUM_WORKERS,
        pin_memory=config.PIN_MEMORY
    )
    
    # Sınıf isimlerini index sırasına göre alalım (Raporlama için)
    idx_to_class = {v: k for k, v in class_to_idx.items()}
    class_names = [idx_to_class[i] for i in range(len(idx_to_class))]

    # 3. Model Mimarisini Oluştur
    print("🤖 Model mimarisi (Swin-T) kuruluyor...")
    model = WheatDiseaseClassifier(
        num_classes=config.NUM_CLASSES,
        model_name=config.MODEL_NAME,
        pretrained=False  # Zaten kendi eğittiğimiz ağırlıkları yükleyeceğiz
    ).to(device)

    # 4. Kayıtlı .pth Dosyasını Yükle
    print(f"📥 Ağırlıklar yükleniyor: {model_path.name}")
    if not model_path.exists():
        print(f"❌ HATA: Model dosyası bulunamadı! Yol: {model_path}")
        return

    checkpoint = torch.load(model_path, map_location=device)
    
    # Eğitim sırasında "checkpoint" sözlüğü (dict) kaydettiysek:
    if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
        model.load_state_dict(checkpoint['model_state_dict'])
        epoch_info = checkpoint.get('epoch', 'Bilinmiyor')
        print(f"✅ Checkpoint başarıyla yüklendi. (Kaydedildiği Epoch: {epoch_info})")
    else:
        # Eğer sadece ağırlıkları (state_dict) doğrudan kaydettiysek:
        model.load_state_dict(checkpoint)
        print("✅ Model ağırlıkları başarıyla yüklendi.")

    # 5. Test Modunu Aktif Et (Kritik!)
    model.eval()

    # 6. Tahminleri Yap
    test_preds = []
    test_labels = []

    print("⏳ Test seti üzerinde tahminler yapılıyor, lütfen bekleyin...")
    
    # torch.no_grad() ile RAM kullanımını düşürüp hızı artırıyoruz
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            labels = labels.to(device)
            
            outputs = model(images)
            _, predicted = torch.max(outputs, 1)
            
            test_preds.extend(predicted.cpu().numpy())
            test_labels.extend(labels.cpu().numpy())

    # 7. Sonuçları ve Raporu Hesapla
    accuracy = accuracy_score(test_labels, test_preds)
    f1 = f1_score(test_labels, test_preds, average="weighted")
    
    print("\n" + "=" * 60)
    print("🏆 FİNAL TEST SONUÇLARI")
    print("=" * 60)
    print(f"🎯 Test Accuracy : {accuracy * 100:.2f}%")
    print(f"📈 Test F1-Score : {f1 * 100:.2f}%")
    print("-" * 60)
    print("📋 Detaylı Sınıflandırma Raporu (Sklearn):")
    print(classification_report(test_labels, test_preds, target_names=class_names, zero_division=0))
    print("=" * 60)
    
if __name__ == "__main__":
    # Yolu CHECKPOINTS_DIR olarak değiştirip doğru dosya adını yazıyoruz
    MODEL_PATH = config.CHECKPOINTS_DIR / "best_swin_model.pth"
    
    evaluate_model(MODEL_PATH)