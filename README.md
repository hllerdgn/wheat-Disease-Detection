---
title: Wheat Disease Detection
emoji: 🌾
colorFrom: green
colorTo: yellow
sdk: docker
pinned: false
---

# 🌾 Buğday Hastalık Tespiti API (Wheat Disease Detection)

Bu proje, buğday yaprağı ve başak görüntülerinden hastalıkları derin öğrenme (**Swin Transformer (Swin-T)**) modeli kullanarak tespit eden ve bir web API'si sunan uçtan uca (End-to-End) bir çözümdür.

Proje, üretime hazır (production-ready) bir altyapıya sahip olup nesne tespiti veya karmaşık segmentasyon işlemlerinden arındırılmış, tamamen yüksek isabet oranlı görüntü sınıflandırmasına (Image Classification) odaklanmıştır.

---

## 🎯 Proje Özellikleri

- **15 Farklı Sınıf Tespiti:** Sağlıklı durumlar ve buğdayda sık görülen çeşitli mantar/zararlı hastalıkları (Pas, Külleme, Septoria vb.) dâhil olmak üzere 15 farklı sınıfı ayırt eder.
- **Model:** Görüntü işleme alanında son teknoloji olan **Swin Transformer Tiny (Swin-T)** mimarisi.
- **Aşırı Öğrenme Kontrolleri:** Dinamik Learning Rate Scheduler (Cosine Annealing) ve Mixed Precision (AMP) ile optimize edilmiş PyTorch eğitim döngüsü.
- **Yüksek Performanslı API:** Python tabanlı [FastAPI](https://fastapi.tiangolo.com/) kullanılarak geliştirilmiş, hızlı, asenkron RESTful entegrasyonu.
- **Kalite Kontrol (Image Quality Control):** Yüklenen fotoğrafın bulanık (blur) olup olmadığını Laplasyan varyans yöntemiyle tespit ederek hatalı tahminlerin önüne geçer.

---

## 📂 Dizin Yapısı / Mimari

```text
wheat_disease_project/
├── api.py                 # FastAPI uç noktaları (Endpoints) ve Pydantic Şemaları
├── pipeline.py            # Görüntü ön işleme ve Swin-T model tahmini (Pipeline)
├── config.py              # Tüm hiperparametreler ve klasör yolları ayarları
├── preprocessing.py       # Görüntü bulanıklık kontrolü ve boyutlandırma
├── data/                  # İşlenmiş ve ham veri setleri (gitignore'da)
├── models/                # class_mapping.json dosyası ve ağırlıklar
│   ├── checkpoints/       # Eğitilmiş Swin-T .pth model ağırlık dosyaları
│   ├── evaluate.py        # Modeli test verisi üzerinde değerlendirme betiği
│   └── model.py           # Model tanımlama (Swin Transformer Backbone)
├── training/              
│   └── train.py           # Eğitim (Training & Validation) döngüleri
├── inference/             
│   └── predict.py         # Klasör ve resim bazlı yerel tahmin betiği
├── utils/
│   └── dataset.py         # PyTorch DataLoader işlemleri ve Augmentation
└── README.md
```

---

## 🚀 Kurulum

### 1️⃣ Yerel Kurulum (Local Development)

Proje için sanal bir ortam (virtual environment) oluşturmanız önerilir.

```bash
# Repo klonlandıktan sonra ilgili klasöre gidin
cd wheat_disease_project

# Gerekli Python kütüphanelerini indirin
pip install torch torchvision numpy opencv-python Pillow fastapi uvicorn pydantic python-multipart scikit-learn
```

### 2️⃣ Model Eğitimi (Training)

Elinizdeki veri setini `data/train`, `data/valid` ve `data/test` altına (her sınıf için bir klasör olacak şekilde) yerleştirin. Ardından eğitimi başlatın:

```bash
python training/train.py
```
*Not: En iyi ağırlıklar `models/checkpoints/best_swin_model.pth` içerisine otomatik olarak kaydedilecektir.*

---

## 🌐 API Kullanımı (Inference)

Eğitilmiş modelinizi diğer platformlardan veya frontend üzerinden çağırmak için FastAPI sunucusunu ayağa kaldırın:

```bash
python api.py
```
*(Varsayılan olarak `http://localhost:8000` adresinde çalışmaya başlar.)*

API çalışmaya başlayınca `http://127.0.0.1:8000/docs` adresinde **Swagger UI** üzerinden test edebilirsiniz. 

### Önemli Uç Noktalar (Endpoints)

- `GET /health` : API'nin ve modelin durumunu kontrol eder.
- `GET /classes` : Modelin eğiltildiği tüm sınıfların listesini döndürür.
- `POST /analyze` (veya `/classify`) : Fotoğraf yükleyerek analiz yaptırdığınız ana uç nokta.

### Örnek API Çıktısı (JSON Response)

```json
{
  "classification": {
    "predicted_class": "Yellow Rust",
    "confidence": 0.9821,
    "is_certain": true,
    "top3_predictions": [
      {
        "class": "Yellow Rust",
        "score": 0.9821
      },
      {
        "class": "Brown Rust",
        "score": 0.0125
      },
      {
        "class": "Healthy",
        "score": 0.0054
      }
    ]
  },
  "quality": {
    "is_valid": true,
    "blur_score": 145.6,
    "warnings": [],
    "rejection_reason": null
  },
  "meta": {
    "processing_time_ms": 125.4,
    "image_size": {
      "width": 640,
      "height": 640
    }
  }
}
```

---
**Not:** Bu proje, üretim ortamına (Production) alınmaya uygun, temizlenmiş ve optimize edilmiş bir kod tabanına sahiptir. Büyük model ağırlıkları (335MB+) `.gitignore` kapsamında olduğundan GitHub'a yüklenmez. Canlı sunucuya (VPS, AWS vb.) aktarırken model dosyalarını (`best_swin_model.pth`) manuel olarak veya S3 gibi servisler aracılığıyla sunucuya çekmeniz gerekmektedir.
