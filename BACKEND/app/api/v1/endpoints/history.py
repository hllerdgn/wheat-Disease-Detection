"""
Analysis History Endpoints.
"""

from fastapi import APIRouter, Query, Path, HTTPException, status
from app.schemas.history import HistoryListResponse
from app.services.history_service import history_service

router = APIRouter(prefix="/history", tags=["Analysis History"])


@router.get(
    "",
    response_model=HistoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Recent Analysis History",
    description="Fetch list of recently saved inference results.",
)
async def get_analysis_history(
    limit: int = Query(50, ge=1, le=200, description="Max number of historical records to return"),
):
    """Returns recent analysis results sorted by newest first."""
    return history_service.get_recent_history(limit=limit)


@router.get(
    "/{filename}",
    status_code=status.HTTP_200_OK,
    summary="Get Specific Analysis Detail",
    description="Fetch the full raw JSON content of a specific archived analysis record.",
)
async def get_history_detail(
    filename: str = Path(..., description="JSON record filename, e.g. results_20260502_174207.json"),
):
    """Returns full JSON data for a specific analysis file."""
    data = history_service.get_history_detail(filename)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History record '{filename}' not found.",
        )
    return data
