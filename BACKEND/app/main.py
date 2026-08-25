"""
FastAPI Application Entrypoint and Lifecycle Management.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import app_logger
from app.core.exceptions import register_exception_handlers
from app.middlewares.request_id import RequestIDMiddleware
from app.middlewares.process_time import ProcessTimeMiddleware
from app.services.inference_service import inference_service
from app.services.disease_service import disease_service
from app.api.v1.router import api_v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles startup and shutdown events for the FastAPI application."""
    app_logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    # Load knowledge base and deep learning model
    disease_service.load_knowledge_base()
    inference_service.initialize()

    yield

    # Clean up on shutdown
    inference_service.shutdown()
    app_logger.info(f"{settings.PROJECT_NAME} shut down successfully.")


def create_application() -> FastAPI:
    """Application factory to configure and create FastAPI instance."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.DESCRIPTION,
        version=settings.VERSION,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # 1. CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
    )

    # 2. Custom Middlewares
    app.add_middleware(ProcessTimeMiddleware)
    app.add_middleware(RequestIDMiddleware)

    # 3. Global Exception Handlers
    register_exception_handlers(app)

    # 4. Route Mounting
    # Primary API V1 Routes (/api/v1/analyze, /api/v1/health, etc.)
    app.include_router(api_v1_router, prefix=settings.API_V1_STR)

    # Root alias routes for direct backward compatibility with existing frontends
    app.include_router(api_v1_router, prefix="")

    @app.get("/", include_in_schema=False)
    async def root():
        return RedirectResponse(url="/docs")

    return app


app = create_application()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=settings.WORKERS,
    )
