"""
History Service - Manages persisting and querying analysis history using PostgreSQL + SQLAlchemy (async).
"""

import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any

from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import app_logger
from app.db.session import AsyncSessionLocal
from app.db.models import AnalysisHistory
from app.schemas.history import HistoryItem, HistoryListResponse
from app.schemas.analysis import AnalyzeResponse


class HistoryService:
    """Service to persist and query inference records in PostgreSQL with JSON file fallback."""

    def __init__(self, results_dir: Optional[Path] = None):
        self.results_dir = results_dir or settings.RESULTS_DIR
        self.results_dir.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def calculate_image_hash(image_bytes: Optional[bytes]) -> Optional[str]:
        """Computes SHA-256 hash of the input image bytes."""
        if not image_bytes:
            return None
        return hashlib.sha256(image_bytes).hexdigest()

    async def save_analysis(
        self,
        response: AnalyzeResponse,
        filename: Optional[str] = None,
        request_id: Optional[str] = None,
        image_bytes: Optional[bytes] = None,
    ) -> Optional[int]:
        """
        Persists analysis result asynchronously into PostgreSQL database.
        Also saves a backup JSON record to the results directory.
        """
        image_hash = self.calculate_image_hash(image_bytes)
        top3_data = [
            {"class": item.class_, "score": item.score}
            for item in response.classification.top3_predictions
        ]
        full_payload = response.model_dump(by_alias=True)

        record_id = None

        # 1. Attempt Async Database Persistence
        if AsyncSessionLocal is not None:
            try:
                async with AsyncSessionLocal() as session:
                    history_record = AnalysisHistory(
                        request_id=request_id,
                        image_hash=image_hash,
                        filename=filename or "uploaded_image.jpg",
                        predicted_class=response.classification.predicted_class,
                        confidence=response.classification.confidence,
                        is_certain=response.classification.is_certain,
                        blur_score=response.quality.blur_score,
                        processing_time_ms=response.meta.processing_time_ms,
                        top3_probs=top3_data,
                        full_response=full_payload,
                    )
                    session.add(history_record)
                    await session.commit()
                    await session.refresh(history_record)
                    record_id = history_record.id
                    app_logger.info(f"Persisted analysis #{record_id} ({response.classification.predicted_class}) to PostgreSQL")
            except Exception as e:
                app_logger.warning(f"Failed to persist analysis to PostgreSQL (falling back to disk): {e}")

        # 2. JSON File Backup Persistence
        try:
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            target_name = filename or f"results_{timestamp_str}.json"
            target_path = self.results_dir / target_name
            backup_data = {
                "id": record_id,
                "request_id": request_id,
                "image_hash": image_hash,
                "timestamp": datetime.now().isoformat(),
                "data": full_payload,
            }
            with open(target_path, "w", encoding="utf-8") as f:
                json.dump(backup_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            app_logger.warning(f"Failed to save JSON backup: {e}")

        return record_id

    async def get_recent_history(self, limit: int = 50) -> HistoryListResponse:
        """
        Retrieves the most recent analysis records from PostgreSQL.
        Falls back to local results directory if database is unavailable.
        """
        if AsyncSessionLocal is not None:
            try:
                async with AsyncSessionLocal() as session:
                    stmt = select(AnalysisHistory).order_by(desc(AnalysisHistory.created_at)).limit(limit)
                    result = await session.execute(stmt)
                    db_records = result.scalars().all()

                    if db_records:
                        items = [
                            HistoryItem(
                                filename=rec.filename or f"analysis_{rec.id}.jpg",
                                timestamp=rec.created_at.isoformat() if rec.created_at else datetime.utcnow().isoformat(),
                                predicted_class=rec.predicted_class,
                                confidence=rec.confidence,
                                is_certain=rec.is_certain,
                                blur_score=rec.blur_score or 0.0,
                                processing_time_ms=rec.processing_time_ms or 0.0,
                            )
                            for rec in db_records
                        ]
                        return HistoryListResponse(total_records=len(items), records=items)
            except Exception as e:
                app_logger.warning(f"Could not fetch history from PostgreSQL, using file fallback: {e}")

        # File-based fallback
        return self._get_recent_history_from_files(limit=limit)

    def _get_recent_history_from_files(self, limit: int = 50) -> HistoryListResponse:
        """Fallback to read recent history from filesystem."""
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

    async def get_history_detail(self, identifier: str) -> Optional[Dict[str, Any]]:
        """
        Fetch full analysis record by primary key ID or filename from DB or disk.
        """
        # Check if identifier is integer ID for DB lookup
        if identifier.isdigit() and AsyncSessionLocal is not None:
            try:
                record_id = int(identifier)
                async with AsyncSessionLocal() as session:
                    rec = await session.get(AnalysisHistory, record_id)
                    if rec:
                        return rec.to_dict()
            except Exception as e:
                app_logger.warning(f"Failed to fetch record {identifier} from DB: {e}")

        # File lookup fallback
        target_path = self.results_dir / identifier
        if target_path.exists() and target_path.name.endswith(".json"):
            with open(target_path, "r", encoding="utf-8") as f:
                return json.load(f)

        return None


history_service = HistoryService()
