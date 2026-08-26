---
title: Wheat Disease Detection
emoji: 🌾
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
---

# 🌾 Wheat Disease Detection API

This is a FastAPI-based image classification API for detecting 15 types of wheat diseases using Swin Transformer.

## Deployment
This project is structured for deployment on Hugging Face Spaces using Docker.

- **Backend:** FastAPI + Swin Transformer
- **Frontend:** React (Vite)

## Local Usage
```bash
cd BACKEND
pip install -r requirements.txt
python api.py
```

## 🔒 Authentication & Rate Limiting

### 1. Authentication (API Key)
The API protects endpoints using header-based API key authentication.

* **Header:** `X-API-Key: <YOUR_API_KEY>`
* **Configuration:** Set in `.env` (or environment variables):
  ```env
  AUTH_ENABLED=true
  API_KEYS=wheat-api-key-2026,your-custom-production-key
  ```
* **Public / Exempt Routes:**
  * Documentation: `/docs`, `/redoc`, `/openapi.json`
  * System Health: `/health`, `/api/v1/health`
  * Root redirect: `/`
  * CORS Preflight requests (`OPTIONS`)

#### Example cURL Request:
```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
     -H "X-API-Key: wheat-api-key-2026" \
     -F "file=@wheat_leaf_sample.jpg"
```

### 2. Rate Limiting (SlowAPI)
Rate limiting protects the model server against abuse and denial of service:

| Endpoint | Rate Limit | Description |
| :--- | :--- | :--- |
| `POST /api/v1/analyze` | **10 requests / minute** per IP | Single image deep learning inference |
| `POST /api/v1/analyze/batch` | **10 requests / minute** per IP | Batch images inference |
| `GET /api/v1/diseases` | **60 requests / minute** per IP | Supported disease list & knowledge base |
| `GET /api/v1/history` | **60 requests / minute** per IP | Analysis history records |

### 3. Rate Limit Exceeded (HTTP 429) Response
When a client exceeds the allocated quota, the API returns **HTTP 429 Too Many Requests** along with a `Retry-After` header:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
Content-Type: application/json
```

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Rate limit exceeded: 10 per 1 minute",
    "details": {
      "limit": "10 per 1 minute",
      "retry_after_seconds": 60,
      "hint": "Please wait before making additional requests."
    },
    "path": "/api/v1/analyze"
  }
}
```

