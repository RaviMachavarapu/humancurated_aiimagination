import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

# Load .env from backend directory (absolute path)
BACKEND_DIR = Path(__file__).parent.resolve()
load_dotenv(BACKEND_DIR / ".env")

# Add backend dir to path for imports
sys.path.insert(0, str(BACKEND_DIR))

from database import create_tables
from routers.auth import router as auth_router
from routers.submissions import router as submissions_router
from portfolio.portfolio_router import router as portfolio_router

app = FastAPI(title="HumanCurated Staging API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(submissions_router, prefix="/api/submissions", tags=["submissions"])
app.include_router(portfolio_router, prefix="/api/portfolio", tags=["portfolio"])

# Static file serving for uploads
upload_path = os.getenv("UPLOAD_PATH", "./uploads")
os.makedirs(upload_path, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_path), name="uploads")

# Static file serving for portfolio images
portfolio_path = os.getenv("PORTFOLIO_PATH", "")
if portfolio_path and os.path.exists(portfolio_path):
    app.mount("/portfolio-images", StaticFiles(directory=portfolio_path), name="portfolio-images")


@app.on_event("startup")
def startup():
    create_tables()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/debug/env")
def debug_env():
    return {
        "GSHEET_WEBHOOK_URL": bool(os.getenv("GSHEET_WEBHOOK_URL")),
        "GDRIVE_WEBHOOK_URL": bool(os.getenv("GDRIVE_WEBHOOK_URL")),
        "UPLOAD_PATH": os.getenv("UPLOAD_PATH", "not set"),
        "PORTFOLIO_PATH": bool(os.getenv("PORTFOLIO_PATH")),
        "BACKEND_DIR": str(BACKEND_DIR),
        "env_file_exists": (BACKEND_DIR / ".env").exists(),
    }
