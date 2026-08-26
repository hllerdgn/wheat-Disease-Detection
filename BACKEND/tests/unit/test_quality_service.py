"""
Unit tests for QualityService image validation and header checks.
"""

import pytest
from unittest.mock import MagicMock
from fastapi import UploadFile

from app.services.quality_service import quality_service
from app.core.exceptions import InvalidImageException, ImageTooLargeException


class TestQualityService:
    """Test suite for quality_service logic."""

    def test_validate_upload_file_valid_mime(self):
        """Should accept valid image mime types (jpeg, png, webp)."""
        mock_file = MagicMock(spec=UploadFile)
        mock_file.content_type = "image/jpeg"
        # Should not raise exception
        quality_service.validate_upload_file(mock_file)

        mock_file.content_type = "image/png"
        quality_service.validate_upload_file(mock_file)

    def test_validate_upload_file_invalid_mime(self):
        """Should reject non-image mime types (pdf, txt, exe)."""
        mock_file = MagicMock(spec=UploadFile)
        mock_file.content_type = "application/pdf"

        with pytest.raises(InvalidImageException) as exc_info:
            quality_service.validate_upload_file(mock_file)
        assert exc_info.value.status_code == 415
        assert exc_info.value.error_code == "INVALID_IMAGE"

    def test_validate_image_bytes_empty(self):
        """Should reject empty image bytes."""
        with pytest.raises(InvalidImageException) as exc_info:
            quality_service.validate_image_bytes(b"")
        assert "empty" in exc_info.value.message.lower()

    def test_validate_image_bytes_valid_jpeg(self, sample_valid_jpeg_bytes):
        """Should pass validation for valid JPEG bytes."""
        quality_service.validate_image_bytes(sample_valid_jpeg_bytes)

    def test_validate_image_bytes_valid_png(self, sample_valid_png_bytes):
        """Should pass validation for valid PNG bytes."""
        quality_service.validate_image_bytes(sample_valid_png_bytes)

    def test_validate_image_bytes_corrupted_magic_bytes(self, sample_corrupted_bytes):
        """Should reject corrupted bytes that do not match image signatures."""
        with pytest.raises(InvalidImageException) as exc_info:
            quality_service.validate_image_bytes(sample_corrupted_bytes)
        assert "magic bytes" in exc_info.value.message.lower()

    def test_validate_image_bytes_exceeds_max_size(self):
        """Should reject images exceeding MAX_FILE_SIZE_MB limit."""
        # Create virtual bytes exceeding max limit
        large_bytes = b"\xff\xd8\xff" + b"0" * (quality_service.MAX_BYTES + 1024)
        with pytest.raises(ImageTooLargeException) as exc_info:
            quality_service.validate_image_bytes(large_bytes)
        assert exc_info.value.status_code == 413
