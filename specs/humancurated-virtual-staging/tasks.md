# Tasks: Human-Curated Virtual Staging & Renovation Application

**Input**: Design documents from `specs/humancurated-virtual-staging/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and basic structure

- [ ] T001 Create `backend/` directory structure with `models/`, `routers/`, `services/`, `portfolio/`
- [ ] T002 Create `frontend/` directory with React + Tailwind CSS (via Vite or Create React App)
- [ ] T003 [P] Create `backend/requirements.txt` with: fastapi, uvicorn, sqlalchemy, bcrypt, python-jose[cryptography], openpyxl, python-multipart, python-dotenv, aiosmtplib
- [ ] T004 [P] Create `backend/.env.example` with template for SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SECRET_KEY, PORTFOLIO_PATH
- [ ] T005 [P] Configure Tailwind CSS in frontend with professional color palette (slate/blue/white theme)
- [ ] T006 [P] Set up React Router in `frontend/src/App.jsx` with routes: `/login`, `/signup`, `/forgot-password`, `/`, `/portfolio/empty-to-staged`, `/portfolio/staged-to-staged`, `/portfolio/renovation`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create `backend/database.py` — SQLite connection setup, create_tables function, session management
- [ ] T008 Create `backend/models/user.py` — User model with id, full_name, email (unique), hashed_password, created_at
- [ ] T009 [P] Create `backend/main.py` — FastAPI app init, CORS middleware (allow localhost frontend), router includes, static file mounts
- [ ] T010 [P] Create `frontend/src/api/client.js` — Axios instance with base URL, JWT interceptor for auth headers
- [ ] T011 [P] Create `frontend/src/components/Navbar.jsx` — Professional navbar with logo text "HumanCurated Staging", navigation links, logout button (when authenticated)
- [ ] T012 [P] Create `frontend/src/components/Footer.jsx` — Simple footer with copyright and tagline

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Account Registration & Authentication (Priority: P1) 🎯 MVP

**Goal**: Users can sign up, log in, and reset their password

**Independent Test**: Create an account → log out → log in → reset password → log in with new password

### Backend — Auth API

- [ ] T013 Create `backend/routers/auth.py` — POST `/api/auth/signup`: validate input, check email uniqueness, hash password with bcrypt, insert into SQLite, return "Successfully account created"
- [ ] T014 Create JWT token utility in `backend/routers/auth.py` — generate/verify JWT tokens with python-jose, 24h expiry
- [ ] T015 Add POST `/api/auth/login` to `backend/routers/auth.py` — validate email+password against DB, return JWT token on success, return "Invalid credentials" on failure
- [ ] T016 Create `backend/services/email_service.py` — send_reset_code(email, code) function using SMTP (aiosmtplib)
- [ ] T017 Add POST `/api/auth/forgot-password` to `backend/routers/auth.py` — generate 6-digit code, store in memory/DB with 60s TTL, trigger email_service.send_reset_code
- [ ] T018 Add POST `/api/auth/reset-password` to `backend/routers/auth.py` — validate code + expiry, update password hash in DB

### Frontend — Auth Pages

- [ ] T019 Create `frontend/src/pages/SignupPage.jsx` — form with Full Name, Email ID, Password fields, "Create an Account" button, success message display, link to login
- [ ] T020 Create `frontend/src/pages/LoginPage.jsx` — form with Email ID, Password fields, "Login" button, "Invalid credentials" error display, "Forgot Password?" link, link to signup
- [ ] T021 Create `frontend/src/pages/ForgotPassword.jsx` — Step 1: email input + "Send Code" button → Step 2: 6-digit code input (60s countdown timer) → Step 3: new password input + confirm → success redirect to login
- [ ] T022 Add auth state management in `frontend/src/App.jsx` — JWT storage in localStorage, protected route wrapper, redirect unauthenticated users to login

**Checkpoint**: Users can register, log in, reset password. Auth flow is complete.

---

## Phase 4: User Story 2 — Image Upload & Requirements Submission (Priority: P1) 🎯 MVP

**Goal**: Authenticated users upload images and submit styling requirements, saved to Excel and filesystem

**Independent Test**: Log in → upload 3 images → write description → submit → verify Excel row + image folder created

### Backend — Submission API

- [ ] T023 Create `backend/services/file_service.py` — create_user_folder(username, timestamp) → creates `uploads/<name>_<timestamp>/`, save_images(folder_path, files) → saves uploaded files
- [ ] T024 Create `backend/services/excel_service.py` — append_submission(name, email, description) → opens/creates `submissions/user_submissions.xlsx`, appends row with 3 columns (Name, Email ID, Description), saves
- [ ] T025 Create `backend/routers/submissions.py` — POST `/api/submissions/upload` (multipart): authenticate via JWT, validate max 3 files, validate image types (jpg/jpeg/png), call file_service + excel_service, return success

### Frontend — Landing Page Upload Section

- [ ] T026 Create `frontend/src/components/ImageUpload.jsx` — drag-and-drop + click upload zone, max 3 images enforcement, image previews with remove option, file type validation
- [ ] T027 Create `frontend/src/pages/LandingPage.jsx` — header text "Add only 3 images and get the free AI powered images", ImageUpload component, description text box with label "Adding the requirements by describing how you want the image by mentioning style, type of room, and any other specification", "Send" button, "Pay when you like the images" message
- [ ] T028 Wire up submission: LandingPage "Send" button calls `/api/submissions/upload` with FormData (images + description), show success/error feedback

**Checkpoint**: Core app flow works end-to-end — signup → login → upload images → submit requirements → data saved

---

## Phase 5: User Story 3 — Portfolio & Testimonials Showcase (Priority: P2)

**Goal**: Landing page displays testimonials and portfolio with before/after galleries

**Independent Test**: Navigate to landing page → see testimonials → click each portfolio button → verify correct before/after images

### Backend — Portfolio API

- [ ] T029 Create `backend/portfolio/portfolio_router.py` — GET `/api/portfolio/{category}` → reads folder from PORTFOLIO_PATH env var, matches before/after pairs by room name, returns JSON list of pairs with image URLs
- [ ] T030 Mount static file serving in `backend/main.py` for portfolio images from the source folder path

### Frontend — Testimonials

- [ ] T031 Create `frontend/src/components/Testimonials.jsx` — 3 testimonial cards with professional layout: user avatar placeholder, name, star rating, review text. Use realistic virtual staging testimonials. Card design with subtle shadows and hover effects.

### Frontend — Portfolio Section

- [ ] T032 Create `frontend/src/components/Portfolio.jsx` — "See the Transformations" heading, 3 buttons side-by-side: "Empty to Staged", "Staged to Staged", "Renovation". Each navigates to its gallery page.
- [ ] T033 Create `frontend/src/pages/EmptyToStaged.jsx` — fetches `/api/portfolio/empty-to-staged`, displays before/after pairs (dining room, backyard, basement, bedroom) with slider or side-by-side comparison
- [ ] T034 Create `frontend/src/pages/StagedToStaged.jsx` — fetches `/api/portfolio/staged-to-staged`, displays before/after pairs (backyard, balcony, living room, office room)
- [ ] T035 Create `frontend/src/pages/Renovation.jsx` — fetches `/api/portfolio/renovation`, displays before/after pairs (backyard, deck, bathroom, laundry area)
- [ ] T036 Add Testimonials + Portfolio sections to `LandingPage.jsx` below the upload section

**Checkpoint**: Full application feature-complete with auth, upload, testimonials, and portfolio

---

## Phase 6: Polish & Visual Excellence

**Purpose**: Make the UI truly professional and market-competitive

- [ ] T037 [P] Create `frontend/src/components/Hero.jsx` — full-width hero section with background image/gradient, compelling headline ("Transform Your Space with Professional Virtual Staging"), subtitle, CTA button
- [ ] T038 [P] Add smooth scroll animations (fade-in on scroll) to all Landing Page sections
- [ ] T039 [P] Style all form pages (Login, Signup, Forgot Password) with centered card layout, gradient background, professional typography
- [ ] T040 [P] Add responsive design breakpoints — mobile, tablet, desktop layouts for all pages
- [ ] T041 [P] Create before/after image comparison slider component for portfolio pages (drag handle to reveal before/after)
- [ ] T042 Add loading states and transitions — skeleton loaders for images, button loading spinners, page transitions
- [ ] T043 Final visual QA — check all pages against top virtual staging sites, adjust colors, spacing, typography

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (Auth - P1)**: Depends on Phase 2
- **Phase 4 (Upload - P1)**: Depends on Phase 2 + Phase 3 (needs auth)
- **Phase 5 (Portfolio - P2)**: Depends on Phase 2 — can run in parallel with Phase 3/4
- **Phase 6 (Polish)**: Can start after Phase 2 for shared components, full polish after Phase 5

### Parallel Opportunities

- T003, T004, T005, T006 can all run in parallel (Phase 1)
- T009, T010, T011, T012 can all run in parallel (Phase 2)
- T019, T020, T021 (frontend auth pages) can run in parallel with T013-T018 (backend auth)
- T023, T024 (backend services) can run in parallel
- Phase 5 (Portfolio) can start in parallel with Phase 4 (Upload)
- All Phase 6 [P] tasks can run in parallel

### Implementation Strategy: MVP First

1. Complete Phase 1 + 2 → Foundation ready
2. Complete Phase 3 → Auth works → testable
3. Complete Phase 4 → Core value proposition works → **MVP DONE**
4. Complete Phase 5 → Social proof + portfolio → feature complete
5. Complete Phase 6 → Professional polish → **LAUNCH READY**

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Commit after each task or logical group
- Portfolio images are READ from existing folders — do not copy them into the project
- Excel file is created on first submission, not during setup
