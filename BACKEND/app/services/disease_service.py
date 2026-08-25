"""
Disease Service - Manages disease knowledge base and agronomic information enrichment.
"""

import json
from typing import Dict, List, Optional
from app.core.config import settings
from app.core.logging import app_logger
from app.core.exceptions import DiseaseNotFoundException
from app.schemas.disease import DiseaseDetail, DiseaseListItem, DiseaseListResponse


class DiseaseService:
    """Service to query and enrich predictions with comprehensive disease knowledge."""

    def __init__(self, json_path: Optional[str] = None):
        self.json_path = json_path or str(settings.DISEASES_JSON_PATH)
        self.disease_db: Dict[str, DiseaseDetail] = {}
        self._name_to_key_map: Dict[str, str] = {}
        self.load_knowledge_base()

    def _normalize_key(self, name: str) -> str:
        """Normalize string to key format (lowercase, underscores)."""
        return name.strip().lower().replace(" ", "_").replace("-", "_")

    def load_knowledge_base(self) -> None:
        """Loads diseases from JSON file into in-memory dictionary."""
        try:
            with open(self.json_path, "r", encoding="utf-8") as f:
                raw_data = json.load(f)

            self.disease_db.clear()
            self._name_to_key_map.clear()

            for key, data in raw_data.items():
                detail = DiseaseDetail(
                    key=key,
                    name=data.get("name", key),
                    name_tr=data.get("name_tr", data.get("name", key)),
                    scientific_name=data.get("scientific_name", "Triticum aestivum"),
                    severity=data.get("severity", "disease"),
                    risk_level=data.get("risk_level", "medium"),
                    short_desc=data.get("short_desc", ""),
                    description=data.get("description", ""),
                    symptoms=data.get("symptoms", []),
                    cultural_treatment=data.get("cultural_treatment", []),
                    chemical_treatment=data.get("chemical_treatment", []),
                )
                self.disease_db[key] = detail
                # Map various name variants to normalized key
                self._name_to_key_map[self._normalize_key(key)] = key
                self._name_to_key_map[self._normalize_key(detail.name)] = key
                self._name_to_key_map[self._normalize_key(detail.name_tr)] = key

            app_logger.info(f"Loaded {len(self.disease_db)} disease profiles from {self.json_path}")
        except Exception as e:
            app_logger.error(f"Failed to load disease knowledge base: {e}")

    def get_disease(self, name_or_key: str) -> Optional[DiseaseDetail]:
        """Lookup disease by key, English name, or Turkish name."""
        norm = self._normalize_key(name_or_key)
        key = self._name_to_key_map.get(norm)
        if key and key in self.disease_db:
            return self.disease_db[key]
        return None

    def get_disease_or_fail(self, name_or_key: str) -> DiseaseDetail:
        """Lookup disease or raise DiseaseNotFoundException."""
        disease = self.get_disease(name_or_key)
        if not disease:
            raise DiseaseNotFoundException(name_or_key)
        return disease

    def get_all_diseases(self) -> DiseaseListResponse:
        """Returns a list of all supported disease summaries."""
        items = [
            DiseaseListItem(
                key=d.key,
                name=d.name,
                name_tr=d.name_tr,
                scientific_name=d.scientific_name,
                severity=d.severity,
                risk_level=d.risk_level,
                short_desc=d.short_desc,
            )
            for d in self.disease_db.values()
        ]
        return DiseaseListResponse(total=len(items), diseases=items)


disease_service = DiseaseService()
