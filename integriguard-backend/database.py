"""
SQLAlchemy engine, session factory, and declarative base.
DATABASE_URL env var is set by docker-compose; falls back to SQLite for local dev.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./integriguard_dev.db"  # Local fallback (no Postgres needed for dev)
)

# SQLite needs check_same_thread=False; postgres doesn't have this arg
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session and ensures it is closed after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
