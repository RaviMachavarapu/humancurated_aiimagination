import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# On Vercel, use /tmp/ for SQLite (ephemeral but functional per invocation)
# Locally, use the project directory
if os.getenv("VERCEL"):
    DATABASE_URL = "sqlite:////tmp/humancurated.db"
else:
    DATABASE_URL = "sqlite:///./humancurated.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    from _models import User  # noqa: F401
    Base.metadata.create_all(bind=engine)
