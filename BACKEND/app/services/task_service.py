"""
Task Service - In-memory asynchronous job manager for long-running inference tasks.
"""

import uuid
import time
import threading
from datetime import datetime
from typing import Dict, Any, Optional

from app.core.logging import app_logger
from app.services.inference_service import inference_service
from app.services.history_service import history_service


class TaskService:
    """Thread-safe in-memory job manager for async inference tasks."""

    _instance: Optional["TaskService"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TaskService, cls).__new__(cls)
            cls._instance._jobs = {}
            cls._instance._lock = threading.Lock()
            cls._instance._max_stored_jobs = 500
        return cls._instance

    def create_job(self, filename: Optional[str] = None) -> str:
        """Generates and registers a new job ID with PENDING state."""
        job_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat() + "Z"

        with self._lock:
            # Memory cleanup: remove oldest jobs if limit reached
            if len(self._jobs) >= self._max_stored_jobs:
                oldest_keys = list(self._jobs.keys())[:100]
                for k in oldest_keys:
                    self._jobs.pop(k, None)

            self._jobs[job_id] = {
                "job_id": job_id,
                "status": "PENDING",
                "filename": filename or "unknown.jpg",
                "created_at": now,
                "completed_at": None,
                "processing_time_ms": None,
                "result": None,
                "error": None,
            }

        app_logger.info(f"Registered async inference job: {job_id}")
        return job_id

    async def process_job(self, job_id: str, image_bytes: bytes, skip_quality: bool = False) -> None:
        """Executes inference asynchronously in threadpool and updates job status."""
        with self._lock:
            if job_id not in self._jobs:
                return
            self._jobs[job_id]["status"] = "PROCESSING"

        t_start = time.perf_counter()
        try:
            app_logger.info(f"Started processing async job {job_id}")
            result = await inference_service.analyze_image(image_bytes, skip_quality=skip_quality)
            total_ms = (time.perf_counter() - t_start) * 1000
            now = datetime.utcnow().isoformat() + "Z"

            with self._lock:
                self._jobs[job_id]["status"] = "COMPLETED"
                self._jobs[job_id]["completed_at"] = now
                self._jobs[job_id]["processing_time_ms"] = round(total_ms, 1)
                self._jobs[job_id]["result"] = result
                self._jobs[job_id]["error"] = None

            # Save to history if quality was valid
            if result.quality.is_valid:
                await history_service.save_analysis(
                    result,
                    filename=self._jobs[job_id].get("filename"),
                    image_bytes=image_bytes,
                )

            app_logger.info(f"Async job {job_id} COMPLETED in {total_ms:.1f}ms")

        except Exception as e:
            total_ms = (time.perf_counter() - t_start) * 1000
            now = datetime.utcnow().isoformat() + "Z"
            app_logger.error(f"Async job {job_id} FAILED: {str(e)}", exc_info=True)

            with self._lock:
                self._jobs[job_id]["status"] = "FAILED"
                self._jobs[job_id]["completed_at"] = now
                self._jobs[job_id]["processing_time_ms"] = round(total_ms, 1)
                self._jobs[job_id]["result"] = None
                self._jobs[job_id]["error"] = str(e)

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves current state of a registered job."""
        with self._lock:
            return self._jobs.get(job_id)


task_service = TaskService()
