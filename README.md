# 🌾 Buğday Hastalık Tespiti ve Çözüm Motoru (Wheat Disease Detection)

Bu proje, buğday yaprağı ve başak görüntülerinden hastalıkları derin öğrenme (*Transfer Learning ile EfficientNet-B3*) tespit eden ve çıkan sonuca göre ziraat standartlarında **çözüm önerileri** üreten uçtan uca (End-to-End) bir çözümdür.

Proje safi bir yapay zeka modelinin ötesinde; bir web API'si sunacak şekilde tasarlanmış, üretime hazır (production-ready) bir altyapıya sahiptir.

---

## 🎯 Proje Özellikleri

- **7 Farklı Sınıf Tespiti:** Sağlıklı (Healthy), Sarı Pas (Yellow Rust), Kahverengi Pas (Brown Rust), Sap Pası (Stem Rust), Külleme (Powdery Mildew), Septoria ve Fusaryum.
- **Model:** Transfer Learning ile pre-trained [EfficientNet-B3](https://arxiv.org/abs/1905.11946) mimarisi. (Hızlı çıkarım süresi ve yüksek doğruluk için seçilmiştir.)
- **Aşırı Öğrenme Kontrolleri:** Dinamik Learning Rate Scheduler (Cosine Annealing), early-stopping (planlandı) ve zengin Veri Artırma (Data Augmentation).
- **Zengin API Mimarisi:** Python tabanlı [FastAPI](https://fastapi.tiangolo.com/) kullanılarak yüksek performanslı RESTful entegrasyonu.
- **Bilgi Tabanı (Knowledge Base):** Modele bağlı basit bir uzman sistem. Tespiti yapılan hastalığa göre kimyasal/doğal tarım çözümleri ve acil aksiyon planları sunar.

---

## 📂 Dizin Yapısı / Mimari

```text
wheat-project/
├── api/
│   ├── main.py            # FastAPI uç noktaları (Endpoints)
│   └── knowledge_base.py  # Hastalık -> Çözüm mantık sözlükleri
├── data/                  # İşlenmiş ve ham veri (gitignore'da)
├── models/                # Eğitilmiş .pth model ağırlık dosyaları
├── src/
│   ├── dataset.py         # PyTorch DataLoader işlemleri ve Augmentation
│   ├── model.py           # Model tanımlama (EfficientNet Backbone)
│   ├── train.py           # Eğitim (Training & Validation) döngüleri
│   └── inference.py       # API'nin modeli kullanmasını sağlayan tekil tahmin (Prediction) class'ı
├── Dockerfile             # Konteynerizasyon
├── requirements.txt       # Gerekli kütüphaneler
└── README.md
```

---

## 🚀 Kurulum

### 1️⃣ Yerel Kurulum (Local Development)

Proje için sanal bir ortam (virtual environment) oluşturmanız önerilir.

```bash
# Repo clonelandıktan sonra ilgili klasöre gidin
cd wheat-project

# Python paketlerini indirin
pip install -r requirements.txt
```

### 2️⃣ Model Eğitimi (Training)

Elinizdeki veri setini (Örn: PlantVillage alt setini) `data/processed/train` ve `data/processed/val` altına yerleştirin. Ardından eğitimi başlatın:

```bash
python src/train.py --data_dir data/processed --epochs 20 --batch_size 32
```
*Not: En iyi ağırlıklar `models/best_model.pth` içerisine kaydedilecektir.*

---

## 🌐 API Kullanımı (Inference)

Eğitilmiş modelinizi diğer platformlardan çağırmak için FastAPI sunucusunu ayağa kaldırın:

```bash
uvicorn api.main:app --reload
```
API çalışmaya başlayınca `http://127.0.0.1:8000/docs` adresinde **Swagger UI** üzerinden test edebilirsiniz. `POST /predict/` endpoint'ine bir yaprak görseli yüklemeniz yeterlidir.

### Örnek API Çıktısı (JSON Response)
```json
{
  "success": true,
  "latency_seconds": 0.125,
  "prediction": {
    "class": "yellow_rust",
    "confidence": 0.9821
  },
  "disease_details": {
    "name_tr": "Sarı Pas (Yellow Rust)",
    "description": "Yapraklarda sarı-portakal renginde püstüller...",
    "action": "Acil ilaçlama yapılması tavsiye edilir...",
    "solution": "1. Ruhsatlı triazol veya strobilurin grubu fungisitler kullanın..."
  }
}
```

---

## 🐳 Docker ile Çalıştırma

Uygulamayı ortam bağımsız (sunucu, cloud vb.) çalıştırmak için tek tuşla Dockerize edebilirsiniz.

```bash
# Docker imajını oluştur
docker build -t wheat-disease-api .

# Konteyneri başlat ve 8000 portuna bağla
docker run -d -p 8000:8000 --name wheat-api wheat-disease-api
```

---
**Geliştirici:** (Kendi İsminizi Yazın) | *Bu proje bir Makine Öğrenmesi & Yazılım Mühendisliği portfolyo projesidir.*
