import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Add api directory to path so _-prefixed modules can be imported
API_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(API_DIR))

# Load .env for local development (Vercel sets env vars via dashboard)
if not os.getenv("VERCEL"):
    from dotenv import load_dotenv
    # Look for .env in api/ directory first, then project root
    env_file = API_DIR / ".env"
    if not env_file.exists():
        env_file = API_DIR.parent / ".env"
    load_dotenv(env_file)

from _db import create_tables
from _auth import router as auth_router
from _submissions import router as submissions_router
from _portfolio import router as portfolio_router

app = FastAPI(title="HumanCurated Staging API")

# CORS — allow Vercel preview URLs and localhost for dev
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]
vercel_url = os.getenv("VERCEL_URL")
if vercel_url:
    allowed_origins.append(f"https://{vercel_url}")
production_url = os.getenv("PRODUCTION_URL")
if production_url:
    allowed_origins.append(production_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(submissions_router, prefix="/api/submissions", tags=["submissions"])
app.include_router(portfolio_router, prefix="/api/portfolio", tags=["portfolio"])

# Static file serving — only when running locally (not on Vercel)
if not os.getenv("VERCEL"):
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
        "VERCEL": bool(os.getenv("VERCEL")),
        "GSHEET_WEBHOOK_URL": bool(os.getenv("GSHEET_WEBHOOK_URL")),
        "GDRIVE_WEBHOOK_URL": bool(os.getenv("GDRIVE_WEBHOOK_URL")),
        "PORTFOLIO_PATH": bool(os.getenv("PORTFOLIO_PATH")),
    }
