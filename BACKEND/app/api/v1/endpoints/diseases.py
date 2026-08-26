"""
Disease Knowledge Base Endpoints.
"""

from fastapi import APIRouter, Path, Request, status
from app.schemas.disease import DiseaseDetail, DiseaseListResponse
from app.services.disease_service import disease_service
from app.core.limiter import limiter
from app.core.config import settings

router = APIRouter(prefix="/diseases", tags=["Disease Knowledge Base"])


@router.get(
    "",
    response_model=DiseaseListResponse,
    status_code=status.HTTP_200_OK,
    summary="List All Supported Diseases",
    description="Returns a list of all 15 supported wheat diseases and healthy conditions with summaries. Rate limit: 60 requests per minute.",
)
@limiter.limit(settings.RATE_LIMIT_DEFAULT)
async def list_all_diseases(request: Request):
    """Retrieves all disease summaries from knowledge base."""
    return disease_service.get_all_diseases()


@router.get(
    "/{disease_name}",
    response_model=DiseaseDetail,
    status_code=status.HTTP_200_OK,
    summary="Get Detailed Disease Information",
    description="Fetch extensive disease profile including Latin name, symptoms, and agronomic treatments. Rate limit: 60 requests per minute.",
)
@limiter.limit(settings.RATE_LIMIT_DEFAULT)
async def get_disease_detail(
    request: Request,
    disease_name: str = Path(..., description="Disease name or key (e.g. 'Yellow Rust' or 'yellow_rust')"),
):
    """Retrieves detailed profile for a specific disease."""
    return disease_service.get_disease_or_fail(disease_name)
