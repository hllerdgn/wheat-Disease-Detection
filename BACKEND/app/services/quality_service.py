"""
Quality & Image Validation Service.
"""

from typing import Tuple
from fastapi import UploadFile
from app.core.config import settings
from app.core.exceptions import InvalidImageException, ImageTooLargeException


class QualityService:
    """Service to validate image headers, size, and integrity."""

    MAX_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024

    @classmethod
    def validate_upload_file(cls, file: UploadFile) -> None:
        """Validates mime type and basic content headers."""
        if not file.content_type or file.content_type.lower() not in settings.ALLOWED_IMAGE_TYPES:
            raise InvalidImageException(
                message=f"Unsupported file type: '{file.content_type}'.",
                details={
                    "allowed_types": settings.ALLOWED_IMAGE_TYPES,
                    "received_type": file.content_type,
                },
            )

    @classmethod
    def validate_image_bytes(cls, image_bytes: bytes) -> None:
        """Checks size and magic bytes of the image buffer."""
        if not image_bytes:
            raise InvalidImageException("The uploaded image file is empty.")

        if len(image_bytes) > cls.MAX_BYTES:
            size_mb = len(image_bytes) / (1024 * 1024)
            raise ImageTooLargeException(
                f"File size ({size_mb:.2f} MB) exceeds maximum allowed size ({settings.MAX_FILE_SIZE_MB} MB)."
            )

        # Magic Bytes Check
        is_valid_magic = (
            image_bytes.startswith(b"\xff\xd8\xff")  # JPEG
            or image_bytes.startswith(b"\x89PNG\r\n\x1a\n")  # PNG
            or image_bytes.startswith(b"BM")  # BMP
            or image_bytes.startswith(b"RIFF")  # WEBP
            or image_bytes.startswith(b"II*\x00")  # TIFF little-endian
            or image_bytes.startswith(b"MM\x00*")  # TIFF big-endian
        )

        if not is_valid_magic:
            raise InvalidImageException("Image header signature (magic bytes) is corrupted or not a valid image format.")


quality_service = QualityService()
