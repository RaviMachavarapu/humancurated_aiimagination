# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HumanCurated Virtual Staging — a full-stack web app for Mile High Labs AI that lets authenticated users upload property images and descriptions for virtual staging services, with portfolio galleries showcasing before/after results.

## Development Commands

```bash
# Backend (terminal 1) — use PYTHONUNBUFFERED=1 for real-time logs
cd backend
PYTHONUNBUFFERED=1 python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

# Frontend (terminal 2)
cd frontend
npm run dev

# Install backend deps
cd backend && pip install -r requirements.txt

# Install frontend deps
cd frontend && npm install

# Build frontend for production
cd frontend && npm run build

# Preview production build locally
cd frontend && npm run preview

# Kill stale Python processes hogging port 8000 (Windows)
taskkill //F //IM python3.11.exe
```

- **Frontend**: http://localhost:3000 (open this in browser)
- **Backend API**: http://localhost:8000 (JSON API only, not a website)
- **Debug endpoint**: http://localhost:8000/api/debug/env (verify env vars loaded)
- Vite proxies `/api` and `/portfolio-images` to the backend

## Tech Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy + SQLite, bcrypt, python-jose (JWT), openpyxl, aiosmtplib, gspread + google-auth
- **Frontend**: React 19, Vite 8, Tailwind CSS v4 (via `@tailwindcss/vite` plugin), React Router, Axios
- **No test framework or linter** is configured for either backend or frontend
- **Fonts**: Inter (sans), Playfair Display (serif) — loaded from Google Fonts in index.html

## Architecture

### Backend (`backend/`)

| Layer | File | Purpose |
|-------|------|---------|
| Entry | `main.py` | FastAPI app, CORS, router mounts, static file serving for `/uploads` and `/portfolio-images` |
| Auth | `routers/auth.py` | Signup, login, forgot/reset password (6-digit code, 60s expiry, in-memory store) |
| Submissions | `routers/submissions.py` | Authenticated image upload (max 3, JPG/PNG, 10MB each) + description (3500 char) |
| Portfolio | `portfolio/portfolio_router.py` | Serves before/after image pairs from external source folders |
| File Service | `services/file_service.py` | Saves images locally + uploads base64 to Google Drive via Apps Script webhook |
| Excel Service | `services/excel_service.py` | Posts metadata to Google Sheets via Apps Script webhook; falls back to local Excel |
| Email Service | `services/email_service.py` | Sends password reset codes via SMTP (gracefully skips if unconfigured) |
| Database | `database.py` | SQLAlchemy + SQLite (`humancurated.db`), auto-creates tables on startup |
| Model | `models/user.py` | User table: id, full_name, email (unique), hashed_password, created_at |

### Frontend (`frontend/src/`)

| Layer | File | Purpose |
|-------|------|---------|
| Entry | `App.jsx` | React Router: `/login`, `/signup`, `/forgot-password`, `/` (protected), `/portfolio/:category` |
| API | `api/client.js` | Axios instance; auto-injects Bearer token from localStorage; 401 interceptor clears token and redirects |
| Styles | `styles/globals.css` | Tailwind v4 `@theme` config: custom colors (primary/blue, accent/purple, warm/amber), fonts, animations |
| Main page | `pages/LandingPage.jsx` | Composes Navbar + Hero + ImageUpload + Portfolio + Testimonials + Footer; handles form submission |
| Auth pages | `pages/LoginPage.jsx`, `SignupPage.jsx`, `ForgotPassword.jsx` | Login/signup forms; forgot-password is a 3-step wizard |
| Gallery | `components/GalleryPage.jsx` | Fetches `/api/portfolio/{category}`, renders ComparisonSlider (draggable before/after) |
| Portfolio nav | `pages/EmptyToStaged.jsx`, `StagedToStaged.jsx`, `Renovation.jsx` | Thin wrappers passing category to GalleryPage |

### Data Flow

**Submission pipeline**: User uploads images + description → backend validates JWT → saves files to `./uploads/{username}_{timestamp}/` → base64 encodes and POSTs to Google Drive Apps Script → GETs Google Sheets Apps Script with name/email/description params → falls back to local Excel on webhook failure.

**Portfolio pipeline**: Backend scans `PORTFOLIO_PATH/{category_folder}/` for files containing "before"/"after" in the filename → pairs them by room name → serves via `/portfolio-images` static mount.

### Google Integrations (Two Separate Apps Scripts)

1. **Google Sheets** — Apps Script *attached to the spreadsheet* handles GET requests. Env var: `GSHEET_WEBHOOK_URL`
2. **Google Drive** — Standalone Apps Script "ImageUploader" handles POST with base64 files, creates user subfolders in `Listing_images`. Env var: `GDRIVE_WEBHOOK_URL`

These are independent scripts — do NOT modify one when intending to change the other.

## Environment Variables (`backend/.env`)

Required: `SECRET_KEY`, `PORTFOLIO_PATH`, `UPLOAD_PATH`, `SUBMISSION_PATH`, `GSHEET_WEBHOOK_URL`, `GDRIVE_WEBHOOK_URL`
Optional (dev graceful): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

## Critical Gotchas

- **Env vars must be loaded inside functions**, not at module level — uvicorn `--reload` causes empty reads on module-level `os.getenv()`
- **Env loading uses absolute path**: `load_dotenv(Path(__file__).parent.parent / ".env")` in service files
- **All print statements must use `flush=True`** for immediate log visibility with uvicorn
- **Tailwind v4 `bg-clip-text`** requires inline `WebkitBackgroundClip: 'text'` and `WebkitTextFillColor: 'transparent'` styles (see Hero.jsx)
- **Portfolio source images** live outside the repo at `C:\Users\ravit\Desktop\Staging\Application` with subfolders: `empty room to Staged/`, `traditionaly staged to virtually staged/`, `renovated room_area/`

## Spec-Kit Workflow

This project uses GitHub Spec Kit for spec-driven development. Artifacts live in `specs/humancurated-virtual-staging/` (spec.md, plan.md, tasks.md, constitution.md, clarifications.md). Slash commands available: `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`, `/speckit.analyze`, `/speckit.clarify`, `/speckit.checklist`, `/speckit.constitution`, `/speckit.taskstoissues`.

## Company Info

Mile High Labs AI — milehighlabs.ai — sales@milehighlabs.ai
Booking: https://cal.com/milehighailabs/15min
