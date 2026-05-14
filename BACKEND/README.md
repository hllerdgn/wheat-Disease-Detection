---
title: Wheat Disease Detection
emoji: 🌾
colorFrom: green
colorTo: emerald
sdk: docker
app_port: 7860
pinned: false
---

# Wheat Disease Classification API

Buğday hastalıklarını Swin Transformer (Swin-T) mimarisi kullanarak tespit eden FastAPI tabanlı yapay zeka API'si.

## Özellikler
- **Model:** Swin-T (Transformer)
- **Doğruluk:** %98+
- **Framework:** FastAPI & PyTorch
- **Platform:** Hugging Face Spaces (Docker)

## Kurulum ve Çalıştırma (Yerel)
Eğer yerelde çalıştırmak isterseniz:
```bash
cd BACKEND
pip install -r requirements.txt
uvicorn api:app --host 0.0.0.0 --port 7860
```
