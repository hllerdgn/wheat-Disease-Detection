"""
Process Time Middleware.
"""

import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.core.logging import app_logger


class ProcessTimeMiddleware(BaseHTTPMiddleware):
    """Measures and logs total HTTP request execution time."""

    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time_ms = (time.perf_counter() - start_time) * 1000

        response.headers["X-Process-Time"] = f"{process_time_ms:.2f}ms"

        req_id = getattr(request.state, "request_id", "-")
        app_logger.info(
            f"[{req_id}] {request.method} {request.url.path} "
            f"-> Status: {response.status_code} ({process_time_ms:.1f}ms)"
        )
        return response
