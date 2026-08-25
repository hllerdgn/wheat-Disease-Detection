"""
Disease Pydantic schemas.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class DiseaseDetail(BaseModel):
    """Detailed disease profile from knowledge base."""

    key: str = Field(..., description="Internal slug or key of the disease")
    name: str = Field(..., description="English class name")
    name_tr: str = Field(..., description="Turkish translation / local name")
    scientific_name: str = Field(..., description="Latin binomial name")
    severity: str = Field(..., description="Severity category: healthy | warning | disease")
    risk_level: str = Field(..., description="Risk evaluation: none | low | medium | high | critical")
    short_desc: str = Field(..., description="Brief description")
    description: str = Field(..., description="Full descriptive summary")
    symptoms: List[str] = Field(default_factory=list, description="Diagnostic visual symptoms")
    cultural_treatment: List[str] = Field(default_factory=list, description="Agronomic & cultural management practices")
    chemical_treatment: List[str] = Field(default_factory=list, description="Fungicide / pesticide chemical recommendations")


class DiseaseListItem(BaseModel):
    """Brief disease info for listing."""

    key: str
    name: str
    name_tr: str
    scientific_name: str
    severity: str
    risk_level: str
    short_desc: str


class DiseaseListResponse(BaseModel):
    """Response containing list of all supported diseases."""

    total: int = Field(..., description="Total supported classes")
    diseases: List[DiseaseListItem]
