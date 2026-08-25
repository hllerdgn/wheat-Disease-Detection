"""
Structured Logging Configuration with Graceful Fallback.
"""

import sys
import logging
from pathlib import Path
from app.core.config import settings

# Attempt to use loguru if installed; fallback to standard logging seamlessly
try:
    from loguru import logger as loguru_logger

    loguru_logger.remove()
    loguru_logger.add(
        sys.stdout,
        colorize=True,
        format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level="DEBUG" if settings.DEBUG else "INFO",
    )
    log_dir = settings.BASE_DIR / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file_path = log_dir / "app_{time:YYYY-MM-DD}.log"
    loguru_logger.add(
        str(log_file_path),
        rotation="10 MB",
        retention="14 days",
        level="INFO",
        encoding="utf-8",
    )
    app_logger = loguru_logger
except ImportError:
    # Standard library logging fallback
    std_logger = logging.getLogger("wheat_disease_api")
    std_logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
    if not std_logger.handlers:
        ch = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            "%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d - %(message)s"
        )
        ch.setFormatter(formatter)
        std_logger.addHandler(ch)
    app_logger = std_logger
