import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read from env var; fall back to local default for development
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:admin123@localhost:5432/shoppingcart"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Keep `session` alias so existing code still works
session = SessionLocal
