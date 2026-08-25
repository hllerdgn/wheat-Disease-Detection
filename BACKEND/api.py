"""
Wheat Disease Detection - API Entrypoint Wrapper.

This file bridges legacy execution commands (e.g. `python api.py` or `uvicorn api:app`)
directly to the modular clean-architecture application under `app.main:app`.
"""

import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

from app.main import app
from app.core.config import settings

if __name__ == "__main__":
    import uvicorn

    print(f"🚀 Starting {settings.PROJECT_NAME} v{settings.VERSION} on {settings.HOST}:{settings.PORT}...")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=settings.WORKERS,
    )