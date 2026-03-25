# Implementation Plan: Human-Curated Virtual Staging & Renovation Application

**Branch**: `001-virtual-staging-app` | **Date**: 2026-03-24 | **Spec**: `specs/humancurated-virtual-staging/spec.md`

## Summary

Build a professional web application for human-curated virtual staging services. The app features user authentication (signup/login/password reset), image upload with requirements submission (saved to Excel + filesystem), and a portfolio showcase with before/after transformations. The frontend must be visually polished, inspired by top virtual staging platforms.

## Technical Context

**Language/Version**: Python 3.11 (backend), JavaScript/TypeScript (frontend)
**Primary Dependencies**: FastAPI (backend), React + Tailwind CSS (frontend), openpyxl (Excel), SQLite (auth DB)
**Storage**: SQLite for users, Excel (.xlsx) for submissions, filesystem for images
**Testing**: pytest (backend), manual testing (frontend)
**Target Platform**: Local Windows desktop (localhost)
**Project Type**: Web application (backend API + frontend SPA)
**Constraints**: Portfolio images read from `C:\Users\ravit\Desktop\Staging\Application`

## Constitution Check

| Gate | Status |
|------|--------|
| User-Centric Design | ✅ Tailwind + React for polished UI |
| Data Integrity | ✅ SQLite for auth, openpyxl for Excel, filesystem for images |
| Simplicity | ✅ Monolithic app, no over-engineering |
| Security Baseline | ✅ bcrypt for passwords, JWT sessions, input validation |
| File-Based Persistence | ✅ Excel + folders as specified |

## Project Structure

### Documentation (this feature)

```text
specs/humancurated-virtual-staging/
├── spec.md              # Feature specification
├── constitution.md      # Project constitution
├── clarifications.md    # Open questions & clarifications
├── plan.md              # This file
└── tasks.md             # Task breakdown
```

### Source Code (repository root)

```text
backend/
├── main.py                  # FastAPI app entry point
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables (SMTP, secret key)
├── database.py              # SQLite connection & setup
├── models/
│   └── user.py              # User model (SQLAlchemy/SQLite)
├── routers/
│   ├── auth.py              # Signup, login, password reset endpoints
│   └── submissions.py       # Image upload & description submission
├── services/
│   ├── email_service.py     # SMTP email for password reset codes
│   ├── excel_service.py     # openpyxl Excel read/write
│   └── file_service.py      # Image storage & folder management
├── portfolio/
│   └── portfolio_router.py  # Portfolio image serving endpoints
└── uploads/                 # User-uploaded images (auto-created)

frontend/
├── package.json
├── tailwind.config.js
├── public/
│   └── index.html
├── src/
│   ├── App.jsx              # Main app with routing
│   ├── index.jsx            # Entry point
│   ├── api/
│   │   └── client.js        # Axios/fetch API client
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── Hero.jsx          # Hero section
│   │   ├── ImageUpload.jsx   # 3-image upload component
│   │   ├── Testimonials.jsx  # Testimonials section
│   │   ├── Portfolio.jsx     # Portfolio buttons & preview
│   │   └── Footer.jsx        # Footer
│   ├── pages/
│   │   ├── LoginPage.jsx     # Login form
│   │   ├── SignupPage.jsx    # Signup form
│   │   ├── ForgotPassword.jsx # Password reset flow
│   │   ├── LandingPage.jsx   # Main landing page (authenticated)
│   │   ├── EmptyToStaged.jsx  # Before/after gallery
│   │   ├── StagedToStaged.jsx # Before/after gallery
│   │   └── Renovation.jsx     # Before/after gallery
│   └── styles/
│       └── globals.css       # Global styles + Tailwind imports
└── submissions/
    └── user_submissions.xlsx  # Excel file (auto-created)
```

**Structure Decision**: Web application with separate `backend/` (FastAPI Python API) and `frontend/` (React SPA). The backend handles auth, file storage, and Excel writes. The frontend delivers the polished UI. They communicate via REST API on localhost.

## Key Architecture Decisions

### 1. Authentication Flow
- **Signup**: POST `/api/auth/signup` → creates user in SQLite with bcrypt-hashed password → returns success message.
- **Login**: POST `/api/auth/login` → validates credentials → returns JWT token → frontend stores in localStorage.
- **Password Reset**: POST `/api/auth/forgot-password` → generates 6-digit code, stores with 60s expiry, sends via SMTP → POST `/api/auth/reset-password` → validates code → updates password.

### 2. Image Upload & Submission Flow
- **Upload**: POST `/api/submissions/upload` (multipart form) → validates max 3 images, validates file types → creates folder `uploads/<username>_<timestamp>/` → saves images → appends row to Excel (Name, Email ID, Description).
- **Excel**: Uses openpyxl to append rows. Creates file if it doesn't exist.

### 3. Portfolio Image Serving
- **API**: GET `/api/portfolio/{category}` → reads image files from source folders → returns list of before/after pairs with image URLs.
- **Static Serving**: FastAPI serves portfolio images via static file mount from `C:\Users\ravit\Desktop\Staging\Application`.
- **Matching Logic**: Pairs images by room name (e.g., "bedroom before.png" + "bedroom after.png").

### 4. Frontend Design Approach
- **Tailwind CSS** for utility-first styling with a professional color palette.
- **Design inspiration**: Clean whites, subtle shadows, hero images, smooth transitions — similar to VirtualStagingAI and BoxBrownie.
- **Responsive**: Mobile-first responsive design.
- **Animations**: Subtle fade-ins and hover effects for polish.

## Complexity Tracking

No constitution violations — architecture is intentionally simple.
