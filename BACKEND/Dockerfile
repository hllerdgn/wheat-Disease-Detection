FROM python:3.10-slim

# Çalışma dizinini ayarla
WORKDIR /app

# Gerekli sistem kütüphanelerini kur (OpenCV / GLIB gereksinimleri için vb.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Bağımlılıkları kopyala ve kur
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir uvicorn gunicorn

# Proje kaynak kodlarını kopyala
COPY . .

# FastAPI portunu dışa aç (Hugging Face Spaces için 7860)
EXPOSE 7860

# Uvicorn ile API'yi başlat
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]
