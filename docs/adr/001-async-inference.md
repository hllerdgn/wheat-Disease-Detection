# 001. Asynchronous Model Inference and Non-Blocking Background Tasks

* **Status:** Accepted
* **Date:** 2026-08-26
* **Author:** AI Development Team
* **Deciders:** Backend & ML Engineering Team

---

## 1. Context & Problem Statement

The wheat disease detection system utilizes a **Swin Transformer Tiny (Swin-T)** deep learning model along with **CLAHE (Contrast Limited Adaptive Histogram Equalization)** image preprocessing. 

* **CPU/GPU-Bound Execution:** Preprocessing via OpenCV and tensor forward pass (`model.forward()`) in PyTorch are blocking, synchronous computations.
* **Event Loop Starvation:** Executing synchronous, compute-heavy inference directly within FastAPI's `async def` endpoints blocks the main Python asyncio event loop.
* **Client Latency & Timeouts:** During peak loads or slow network environments, synchronous requests can result in HTTP gateway timeouts (504) and degraded API health metrics.

---

## 2. Decision Drivers

* Maintain sub-millisecond response times for lightweight endpoints (`/health`, `/diseases`, `/history`).
* Eliminate blocking calls on the asyncio event loop without adding unnecessary operational overhead (e.g. heavy external message brokers for small/medium scale).
* Provide both **synchronous** (`/analyze`) and **asynchronous decoupled polling** (`/analyze-async` + `/analyze-status/{job_id}`) interfaces for clients.

---

## 3. Considered Options

1. **Direct Synchronous Calls in Event Loop:** High risk of server freezing under concurrent load. *(Rejected)*
2. **Heavy Distributed Queue (Celery + Redis / RabbitMQ):** Robust for massive multi-node clusters, but introduces external infrastructure dependencies, increased cold starts, and complex container orchestration. *(Deferred for multi-node scale)*
3. **Thread Pool Offloading + FastAPI BackgroundTasks (Selected):**
   * Use `ThreadPoolExecutor` / `run_in_threadpool` to execute CPU/GPU inference off the asyncio event loop.
   * Provide an in-memory thread-safe `TaskService` combined with FastAPI's native `BackgroundTasks` for asynchronous polling.

---

## 4. Decision & Architecture

We decided to implement a hybrid asynchronous processing architecture:

```
[ Client Request ]
       │
       ├──► POST /api/v1/analyze (Sync Immediate)
       │         └──► run_in_executor(ThreadPoolExecutor) ──► Swin-T Inference ──► Return AnalyzeResponse
       │
       └──► POST /api/v1/analyze-async (Background Queue)
                 ├──► Create Job (UUID, PENDING)
                 ├──► Return Job ID + Poll URL (202 Accepted)
                 └──► FastAPI BackgroundTasks
                           └──► run_in_executor ──► Swin-T Inference ──► Update Job (COMPLETED)
```

### Key Implementation Details:
1. **Thread Pool Offloading (`InferenceService.analyze_image`):**
   ```python
   loop = asyncio.get_running_loop()
   return await loop.run_in_executor(self.executor, self.run_inference_sync, image_bytes, skip_quality)
   ```
2. **Asynchronous Polling Endpoints:**
   * `POST /api/v1/analyze-async`: Validates payload, registers `job_id`, enqueues background inference, and returns HTTP 202 Accepted with a `poll_url`.
   * `GET /api/v1/analyze-status/{job_id}`: Polls the current job status (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`) and delivers the full `AnalyzeResponse` upon completion.

---

## 5. Consequences & Trade-offs

### Positive:
* **Non-blocking Event Loop:** Health checks and metadata endpoints maintain fast response times even during heavy concurrent inference.
* **Client Flexibility:** Fast mobile or batch clients can submit jobs asynchronously without holding long-lived HTTP connections open.
* **Zero External Dependencies:** Native Python threadpool and FastAPI background tasks eliminate Redis/RabbitMQ requirements for standalone deployments.

### Trade-offs & Limitations:
* In-memory task storage resets on server restarts. (For multi-worker distributed clusters, a Redis-backed cache layer can be plugged into `TaskService` seamlessly).
