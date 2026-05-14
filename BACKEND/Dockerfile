# Python 3.10 tabanlı hafif bir imaj kullanıyoruz
FROM python:3.10-slim

# Çalışma dizinini ayarla
WORKDIR /app

# Sistem bağımlılıklarını yükle (OpenCV için gerekli)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Bağımlılıkları kopyala ve yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir uvicorn gunicorn

# Proje dosyalarını kopyala
COPY . .

# Veri ve model klasörlerini oluştur (boş olabilirler)
RUN mkdir -p data models/checkpoints results

# API portunu aç
EXPOSE 7860

# API'yi başlat (Hugging Face Spaces varsayılan olarak 7860 portunu bekler)
# Gradio kullanacaksanız: python app.py
# FastAPI kullanacaksanız: uvicorn api:app --host 0.0.0.0 --port 7860
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]
