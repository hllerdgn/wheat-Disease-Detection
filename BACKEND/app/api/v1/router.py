"""
V1 API Router Assembly.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import analysis, diseases, system, history

api_v1_router = APIRouter()

# Include endpoint sub-routers
api_v1_router.include_router(analysis.router)
api_v1_router.include_router(diseases.router)
api_v1_router.include_router(system.router)
api_v1_router.include_router(history.router)
