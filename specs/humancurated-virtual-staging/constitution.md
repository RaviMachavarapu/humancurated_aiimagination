# Humancurated_AIdesign Constitution

## Core Principles

### I. User-Centric Design
The application must deliver a polished, professional user experience that matches or exceeds market-leading virtual staging applications. Every UI decision should prioritize clarity, visual appeal, and ease of use. Inspiration should be drawn from BoxBrownie, VirtualStagingAI, Stuccco, and similar platforms.

### II. Data Integrity First
User data (credentials, submissions, images) must never be lost. Excel writes must be atomic or safely handled. Image storage must be reliable with proper folder naming. Password hashing is mandatory — no plaintext passwords.

### III. Simplicity Over Complexity
Start with the simplest viable architecture. Use a single-page application framework with a lightweight backend. Avoid over-engineering — no microservices, no complex caching, no unnecessary abstractions. A monolithic web app is the right choice for this scope.

### IV. Security Baseline
- Passwords MUST be hashed (bcrypt or equivalent).
- Password reset codes MUST expire after 60 seconds.
- File uploads MUST be validated (type, size).
- User input MUST be sanitized to prevent XSS and injection.
- Authentication tokens/sessions MUST be securely managed.

### V. File-Based Persistence
This application uses file-based storage (Excel for submissions, folders for images) rather than a traditional database. This is intentional — keep it simple. User accounts may use a lightweight database (SQLite) for authentication, but submissions go to Excel as specified.

## Technology Constraints

- **Frontend**: Modern, responsive web framework (React, Next.js, or similar) with professional styling.
- **Backend**: Python (Flask or FastAPI) for API and file handling.
- **Storage**: SQLite for user accounts, openpyxl for Excel writes, filesystem for images.
- **Email**: SMTP integration for password reset codes.
- **Portfolio Images**: Read from `C:\Users\ravit\Desktop\Staging\Application` — the 3 subfolders are the source of truth.

## Development Workflow

- Spec-driven: All implementation follows this specification and plan.
- Incremental delivery: Build P1 stories first (auth + upload), then P2 (portfolio/testimonials).
- Each user story must be independently testable before moving to the next.
- Commit after each completed task or logical group.

## Governance

This constitution governs all development decisions for the Humancurated_AIdesign project. Any deviation must be documented with justification. The spec.md and plan.md are the authoritative sources for feature requirements.

**Version**: 1.0.0 | **Ratified**: 2026-03-24 | **Last Amended**: 2026-03-24
