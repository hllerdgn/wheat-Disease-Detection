"""
Custom Application Exceptions and Global Exception Handlers.
"""

from typing import Any, Dict, Optional
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.logging import app_logger


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code: str = "INTERNAL_SERVER_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class ModelNotReadyException(AppException):
    """Raised when pipeline or model is not loaded."""

    def __init__(self, message: str = "Deep learning model is not loaded or ready.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            error_code="MODEL_NOT_READY",
            details=details or {"hint": "Check model checkpoints and class mapping files."},
        )


class InvalidImageException(AppException):
    """Raised when the uploaded file is not a valid image."""

    def __init__(self, message: str = "Invalid image file provided.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            error_code="INVALID_IMAGE",
            details=details,
        )


class ImageTooLargeException(AppException):
    """Raised when the uploaded image exceeds size limits."""

    def __init__(self, message: str = "Uploaded image exceeds maximum size limit.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            error_code="IMAGE_TOO_LARGE",
            details=details,
        )


class ImageQualityRejectionException(AppException):
    """Raised when an image is rejected due to poor quality (blur, darkness, etc.)."""

    def __init__(self, message: str = "Image rejected due to low quality.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="QUALITY_REJECTED",
            details=details,
        )


class DiseaseNotFoundException(AppException):
    """Raised when a requested disease is not found in the knowledge base."""

    def __init__(self, disease_name: str):
        super().__init__(
            message=f"Disease '{disease_name}' not found in knowledge base.",
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="DISEASE_NOT_FOUND",
            details={"requested_disease": disease_name},
        )


def register_exception_handlers(app: FastAPI) -> None:
    """Register custom exception handlers with FastAPI application."""

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        app_logger.warning(
            f"AppException: {exc.error_code} - {exc.message} | URL: {request.url.path} | Details: {exc.details}"
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": exc.error_code,
                    "message": exc.message,
                    "details": exc.details,
                    "path": request.url.path,
                },
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        app_logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Input validation failed",
                    "details": exc.errors(),
                    "path": request.url.path,
                },
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        app_logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected internal server error occurred.",
                    "details": str(exc) if app.debug else None,
                    "path": request.url.path,
                },
            },
        )
