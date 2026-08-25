"""
History Service - Manages storing and retrieving analysis results.
"""

import json
import time
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any

from app.core.config import settings
from app.core.logging import app_logger
from app.schemas.history import HistoryItem, HistoryListResponse
from app.schemas.analysis import AnalyzeResponse


class HistoryService:
    """Service to archive analysis runs into JSON files in results directory."""

    def __init__(self, results_dir: Optional[Path] = None):
        self.results_dir = results_dir or settings.RESULTS_DIR
        self.results_dir.mkdir(parents=True, exist_ok=True)

    def save_analysis(self, response: AnalyzeResponse, filename: Optional[str] = None) -> Path:
        """Saves analysis result as a JSON record."""
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        target_name = filename or f"results_{timestamp_str}.json"
        target_path = self.results_dir / target_name

        data = {
            "timestamp": datetime.now().isoformat(),
            "data": response.model_dump(by_alias=True),
        }

        try:
            with open(target_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            app_logger.debug(f"Saved analysis record to {target_path}")
        except Exception as e:
            app_logger.warning(f"Failed to persist analysis record to disk: {e}")

        return target_path

    def get_recent_history(self, limit: int = 50) -> HistoryListResponse:
        """Returns the most recent analysis records."""
        json_files = sorted(
            self.results_dir.glob("results_*.json"),
            key=lambda p: p.stat().st_mtime,
            reverse=True,
        )

        records: List[HistoryItem] = []
        for file_path in json_files[:limit]:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = json.load(f)

                data = content.get("data", {})
                cls_data = data.get("classification", {})
                q_data = data.get("quality", {})
                m_data = data.get("meta", {})

                records.append(
                    HistoryItem(
                        filename=file_path.name,
                        timestamp=content.get("timestamp", datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()),
                        predicted_class=cls_data.get("predicted_class", "Unknown"),
                        confidence=cls_data.get("confidence", 0.0),
                        is_certain=cls_data.get("is_certain", False),
                        blur_score=q_data.get("blur_score", 0.0),
                        processing_time_ms=m_data.get("processing_time_ms", 0.0),
                    )
                )
            except Exception as e:
                app_logger.warning(f"Could not parse history file {file_path.name}: {e}")

        return HistoryListResponse(total_records=len(records), records=records)

    def get_history_detail(self, filename: str) -> Optional[Dict[str, Any]]:
        """Fetch complete JSON content of a specific history file."""
        target_path = self.results_dir / filename
        if not target_path.exists() or not target_path.name.endswith(".json"):
            return None

        with open(target_path, "r", encoding="utf-8") as f:
            return json.load(f)


history_service = HistoryService()
