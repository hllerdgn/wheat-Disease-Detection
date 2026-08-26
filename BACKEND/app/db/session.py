"""
Async Database Session & Engine Configuration.
"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
from app.core.logging import app_logger

# Normalize async postgresql driver prefix
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

try:
    engine = create_async_engine(
        db_url,
        echo=settings.DATABASE_ECHO,
        future=True,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
    )

    AsyncSessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )
except Exception as e:
    app_logger.warning(f"Async database engine initialization deferred: {e}")
    engine = None
    AsyncSessionLocal = None


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency to yield an async database session."""
    if AsyncSessionLocal is None:
        raise RuntimeError("Database session maker is not configured.")
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
