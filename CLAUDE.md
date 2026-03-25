# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HumanCurated Virtual Staging — a full-stack web app for Mile High Labs AI that lets authenticated users upload property images and descriptions for virtual staging services, with portfolio galleries showcasing before/after results. Deployed as a single Vercel project.

## Development Commands

```bash
# Install frontend deps (from project root)
npm install

# Frontend dev server (from project root)
npm run dev

# Backend dev server (from project root — runs the FastAPI app in api/)
PYTHONUNBUFFERED=1 python -m uvicorn api.index:app --host 127.0.0.1 --port 8000 --reload

# Install Python deps
pip install -r requirements.txt

# Build frontend for production
npm run build

# Deploy to Vercel
vercel --prod
```

- **Frontend**: http://localhost:3000 (open this in browser)
- **Backend API**: http://localhost:8000 (JSON API only)
- **Health check**: http://localhost:8000/api/health
- **Debug endpoint**: http://localhost:8000/api/debug/env
- Vite proxies `/api` and `/portfolio-images` to backend in dev mode

## Tech Stack

- **Backend**: Python 3.11, FastAPI (Vercel Serverless Functions), SQLAlchemy + SQLite, bcrypt, python-jose (JWT), openpyxl, aiosmtplib
- **Frontend**: React 19, Vite 8, Tailwind CSS v4 (via `@tailwindcss/vite` plugin), React Router, Axios
- **Deployment**: Vercel (single deployment — static frontend + Python serverless API)
- **No test framework or linter** is configured
- **Fonts**: Inter (sans), Playfair Display (serif) — loaded from Google Fonts in index.html

## Project Structure (Vercel-optimized)

```
root/
├── api/                      # Python serverless functions (Vercel)
│   ├── index.py              # FastAPI app entry point
│   ├── _db.py                # SQLAlchemy + SQLite setup
│   ├── _models.py            # User model
│   ├── _auth.py              # Auth router (signup/login/forgot/reset)
│   ├── _submissions.py       # Metadata submission (text only, no files)
│   ├── _portfolio.py         # Portfolio router
│   ├── _email_service.py     # SMTP email service
│   └── _excel_service.py     # Google Sheets webhook + local Excel fallback
├── src/                      # React source
│   ├── App.jsx               # Router + auth state
│   ├── api/client.js         # Axios instance with JWT interceptor
│   ├── services/driveUpload.js # Direct browser-to-Google-Drive upload
│   ├── pages/                # Login, Signup, ForgotPassword, LandingPage, gallery wrappers
│   ├── components/           # Navbar, Hero, ImageUpload, Portfolio, GalleryPage, Testimonials, Footer
│   └── styles/globals.css    # Tailwind v4 theme config
├── public/                   # Static assets (QR code, etc.)
├── index.html                # Vite entry
├── package.json              # Frontend deps + build scripts
├── vite.config.js            # Vite config (dev proxy for localhost)
├── requirements.txt          # Python deps (for Vercel + local)
└── vercel.json               # Vercel build + routing config
```

Files prefixed with `_` in `api/` are helper modules — Vercel does NOT expose them as endpoints.

## Architecture

### Vercel Deployment

- `vercel.json` configures two builds: `@vercel/static-build` for the React frontend, `@vercel/python` for the FastAPI API
- All `/api/*` requests route to `api/index.py` (FastAPI handles sub-routing)
- Everything else serves the static SPA build

### Backend (`api/`)

| File | Purpose |
|------|---------|
| `index.py` | FastAPI app, CORS, router mounts, .env loading (local dev), static file serving (local dev only) |
| `_auth.py` | Signup, login, forgot/reset password (6-digit code, 60s expiry, in-memory store) |
| `_submissions.py` | Accepts description (text only), saves to Google Sheets, returns Drive webhook URL for frontend to upload images directly |
| `_portfolio.py` | Serves before/after image pairs from source folders (local dev) or returns empty (Vercel) |
| `_excel_service.py` | Posts metadata to Google Sheets via Apps Script webhook; falls back to local Excel |
| `_email_service.py` | Sends password reset codes via SMTP (gracefully skips if unconfigured) |
| `_db.py` | SQLAlchemy + SQLite (`/tmp/humancurated.db` on Vercel, `./humancurated.db` locally) |
| `_models.py` | User table: id, full_name, email (unique), hashed_password, created_at |

### Frontend (`src/`)

| File | Purpose |
|------|---------|
| `App.jsx` | React Router: `/login`, `/signup`, `/forgot-password`, `/` (protected), `/portfolio/*` |
| `api/client.js` | Axios instance; auto-injects Bearer token from localStorage; 401 interceptor |
| `services/driveUpload.js` | Reads files as base64, POSTs directly to Google Drive Apps Script (one image at a time), shows per-image progress |
| `styles/globals.css` | Tailwind v4 `@theme` config: custom colors (primary/blue, accent/purple, warm/amber), fonts, animations |

### Data Flow

**Submission pipeline (2-step)**:
1. **Metadata** (browser → Vercel API → Google Sheets): Frontend sends `{ description }` to `POST /api/submissions/submit`. Backend verifies JWT, saves name/email/description to Google Sheets via webhook, returns `{ gdrive_webhook_url, username }`.
2. **Images** (browser → Google Drive directly): Frontend reads each image as base64, POSTs directly to the Google Drive Apps Script webhook one at a time. This bypasses Vercel's 4.5MB serverless body limit, so images of any size work. Apps Script creates a user-named subfolder in `Listing_images` and saves files there.

**Portfolio pipeline**: Backend scans `PORTFOLIO_PATH/{category_folder}/` for files containing "before"/"after" in the filename → pairs them by room name → serves via `/portfolio-images` static mount. On Vercel (no local path), returns empty.

### Google Integrations (Two Separate Apps Scripts)

1. **Google Sheets** — Apps Script *attached to the spreadsheet* handles GET requests. Env var: `GSHEET_WEBHOOK_URL`
2. **Google Drive** — Standalone Apps Script "ImageUploader" handles POST with base64 files, creates user subfolders in `Listing_images`. Env var: `GDRIVE_WEBHOOK_URL`

These are independent scripts — do NOT modify one when intending to change the other.

## Environment Variables

Set these in the **Vercel dashboard** (Settings → Environment Variables) for production, or in a `.env` file locally:

**Required**: `SECRET_KEY`, `GSHEET_WEBHOOK_URL`, `GDRIVE_WEBHOOK_URL`
**Optional**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `PORTFOLIO_PATH`, `SUBMISSION_PATH`, `PRODUCTION_URL`

Vercel auto-sets `VERCEL=1` — the backend uses this to detect serverless mode and switch to `/tmp/` for SQLite.

## Critical Gotchas

- **Images upload directly from browser to Google Drive** — they never pass through the Vercel serverless function, so there is no file size limit from Vercel's 4.5MB body restriction
- **`_` prefix on api/ files is required** — without it, Vercel exposes them as separate serverless function endpoints
- **Vercel filesystem is read-only** except `/tmp/` — SQLite DB is ephemeral on Vercel (user auth resets on cold starts; real data persists via Google Sheets/Drive)
- **Tailwind v4 `bg-clip-text`** requires inline `WebkitBackgroundClip: 'text'` and `WebkitTextFillColor: 'transparent'` styles (see Hero.jsx)
- **All print statements use `flush=True`** for immediate log visibility

## Company Info

Mile High Labs AI — milehighlabs.ai — sales@milehighlabs.ai
Booking: https://cal.com/milehighailabs/15min
