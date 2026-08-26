"""
API Key Authentication Middleware.
"""

from typing import Set
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from starlette import status

from app.core.config import settings
from app.core.logging import app_logger


class APIKeyAuthMiddleware(BaseHTTPMiddleware):
    """
    Validates incoming requests against configured API keys via 'X-API-Key' header.
    Public endpoints and CORS preflights are exempted.
    """

    # Endpoints that do not require an API key
    EXEMPT_PATHS: Set[str] = {
        "/",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/health",
        "/api/v1/health",
        "/system/health",
    }

    # Path prefixes that do not require an API key
    EXEMPT_PREFIXES: tuple = (
        "/docs",
        "/redoc",
        "/openapi.json",
    )

    async def dispatch(self, request: Request, call_next) -> Response:
        # 1. Bypass if authentication is disabled in config
        if not settings.AUTH_ENABLED:
            return await call_next(request)

        # 2. Bypass CORS Preflight requests
        if request.method == "OPTIONS":
            return await call_next(request)

        # 3. Bypass Public / Health / Docs paths
        path = request.url.path
        if path in self.EXEMPT_PATHS or path.startswith(self.EXEMPT_PREFIXES):
            return await call_next(request)

        # 4. Check X-API-Key header
        api_key = request.headers.get(settings.API_KEY_HEADER)
        valid_keys = settings.valid_api_keys

        if not api_key:
            app_logger.warning(f"Unauthorized access attempt (Missing API key) on {path}")
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={
                    "success": False,
                    "error": {
                        "code": "UNAUTHORIZED",
                        "message": f"Missing API key. Please provide '{settings.API_KEY_HEADER}' header.",
                        "details": {
                          "header": settings.API_KEY_HEADER,
                          "hint": "Check your .env API_KEYS configuration",
                        },
                        "path": path,
                    },
                },
            )

        if api_key not in valid_keys:
            app_logger.warning(f"Unauthorized access attempt (Invalid API key) on {path}")
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={
                    "success": False,
                    "error": {
                        "code": "UNAUTHORIZED",
                        "message": "Invalid API key provided.",
                        "details": {
                          "header": settings.API_KEY_HEADER,
                          "hint": "API key provided is not registered in the system",
                        },
                        "path": path,
                    },
                },
            )

        # 5. Key is valid, proceed
        return await call_next(request)
