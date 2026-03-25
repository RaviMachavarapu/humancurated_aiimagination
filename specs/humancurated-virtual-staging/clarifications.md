# Clarifications: Human-Curated Virtual Staging & Renovation Application

**Date**: 2026-03-24
**Status**: Needs User Input

## Open Questions

### Q1: Email Service for Password Reset
**Question**: Which email service should be used to send the 6-digit password reset codes? Do you have an existing SMTP server, Gmail account, or would you prefer a service like SendGrid or Mailgun?
**Impact**: Affects FR-005 (password reset code delivery). Need credentials and service choice before implementing.
**Default if unanswered**: Will use Gmail SMTP with app password (requires user to provide Gmail credentials in .env).

---

### Q2: Excel File Location
**Question**: Where should the Excel file with user submissions (Name, Email ID, Description) be saved? Should it be in the project directory, or a specific path on your system?
**Impact**: Affects FR-009 (Excel data storage).
**Default if unanswered**: Will save as `submissions/user_submissions.xlsx` in the project root directory.

---

### Q3: Image Upload Storage Location
**Question**: Where should user-uploaded images (folders named after users) be stored? In the project directory or a specific path?
**Impact**: Affects FR-010 (image folder creation and storage).
**Default if unanswered**: Will save in `uploads/<user_name>/` within the project directory.

---

### Q4: Maximum Image File Size
**Question**: What is the maximum allowed file size per uploaded image? Large images (10MB+) could slow the application.
**Impact**: Affects FR-007 (image upload validation).
**Default if unanswered**: Will set a 10MB per-image limit.

---

### Q5: Deployment Target
**Question**: Will this application run locally on your machine only, or do you plan to deploy it to a server/cloud? This affects how portfolio image paths are configured.
**Impact**: Affects architecture decisions, particularly the hardcoded portfolio image path.
**Default if unanswered**: Will build for local deployment with configurable paths via environment variables.

---

### Q6: Testimonial Content
**Question**: Do you have specific testimonial text and names you'd like to use, or should I create realistic placeholder testimonials for a virtual staging business?
**Impact**: Affects FR-011 (testimonial display).
**Default if unanswered**: Will create 3 professional placeholder testimonials with realistic names and virtual staging reviews.

---

### Q7: User Name Folder Naming Conflicts
**Question**: If two users have the same name (e.g., "John Smith"), how should the image folders be handled? Options: append a number, use email as folder name, or use a unique ID.
**Impact**: Affects FR-010 (folder creation logic).
**Default if unanswered**: Will use `<user_name>_<timestamp>` format to ensure uniqueness.

---

### Q8: Session Management
**Question**: How long should a user session last before requiring re-login? Should there be a "Remember Me" option?
**Impact**: Affects authentication UX.
**Default if unanswered**: Sessions will last 24 hours. No "Remember Me" for initial version.

---

## Resolved Clarifications

*(None yet — awaiting user responses)*
