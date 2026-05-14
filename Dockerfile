FROM python:3.10-slim

WORKDIR /app

# Sistem kütüphaneleri
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# BACKEND klasöründeki gereksinimleri kopyala ve kur
COPY BACKEND/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir uvicorn gunicorn

# BACKEND içeriğini kopyala
COPY BACKEND/ .

# Port ayarı
EXPOSE 7860

# Çalıştırma (api.py BACKEND içindeydi, artık root'ta gibi kopyalandı)
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]
