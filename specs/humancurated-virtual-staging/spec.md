# Feature Specification: Human-Curated Virtual Staging & Renovation Application

**Feature Branch**: `001-virtual-staging-app`
**Created**: 2026-03-24
**Status**: Draft
**Input**: User description: "Complete Human-Curated Virtual Staging and Renovation Application with auth, image upload, portfolio, and testimonials"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Account Registration & Authentication (Priority: P1)

A new user visits the application and creates an account by providing their full name, email, and password. Returning users log in with their credentials. Users who forget their password can reset it via a 6-digit email verification code.

**Why this priority**: Authentication is the gateway to the entire application. No other feature works without it.

**Independent Test**: Can be fully tested by creating an account, logging out, logging back in, and resetting a password — delivers secure access to the platform.

**Acceptance Scenarios**:

1. **Given** a new user on the signup page, **When** they enter full name, email, and password and click "Create an Account", **Then** the account is created and the message "Successfully account created" is displayed.
2. **Given** a user with an existing account on the login page, **When** they enter valid email and password, **Then** they are redirected to the Landing Page.
3. **Given** a user on the login page, **When** they enter invalid credentials, **Then** the message "Invalid credentials" is displayed.
4. **Given** a user clicks "Forget Password", **When** they enter their registered email and click "Send Code", **Then** a 6-digit code is sent to their email, valid for 60 seconds.
5. **Given** a user enters a valid 6-digit code, **When** they submit a new password, **Then** their password is updated and they can log in with the new password.
6. **Given** a user enters an invalid or expired code, **When** they submit, **Then** an error message is displayed.

---

### User Story 2 - Image Upload & Requirements Submission (Priority: P1)

An authenticated user lands on the Landing Page, uploads up to 3 images of their property, writes a description of how they want the images styled (room type, style, specifications), and submits the request. Their details (name, email, description) are saved to an Excel sheet, and uploaded images are saved in a user-named folder.

**Why this priority**: This is the core value proposition — collecting user requirements and images for the virtual staging service.

**Independent Test**: Can be tested by logging in, uploading 3 images, writing a description, and verifying the Excel sheet has a new row and images are saved in the correct folder.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the Landing Page, **When** the page loads, **Then** they see the header text "Add only 3 images and get the free AI powered images" above the upload section.
2. **Given** a user on the Landing Page, **When** they upload more than 3 images, **Then** the system prevents the upload and shows a validation message.
3. **Given** a user uploads 1-3 images and writes a description, **When** they click "Send", **Then** the user's name, email, and description are appended as a new row in the Excel sheet (3 columns: Name, Email ID, Description).
4. **Given** a user submits images, **When** the submission is processed, **Then** a folder is created with the user's name and the uploaded images are saved inside it.
5. **Given** a user on the Landing Page, **When** the page loads, **Then** they see the text "Adding the requirements by describing how you want the image by mentioning style, type of room, and any other specification" above the description text box.
6. **Given** a user on the Landing Page, **When** they scroll down, **Then** they see the message "Pay when you like the images".

---

### User Story 3 - Portfolio & Testimonials Showcase (Priority: P2)

A visitor or authenticated user views the testimonials section with 3 client reviews, and the portfolio section showing before/after transformation images across three categories: Empty to Staged, Staged to Staged, and Renovation.

**Why this priority**: Social proof and portfolio display build trust and convert visitors, but the app can function without them.

**Independent Test**: Can be tested by navigating to the Landing Page and verifying testimonials render, and clicking each portfolio category button opens the correct before/after gallery.

**Acceptance Scenarios**:

1. **Given** a user on the Landing Page, **When** they scroll to the testimonials section, **Then** they see 3 testimonials with user names and review text.
2. **Given** a user on the Landing Page, **When** they scroll to the portfolio section, **Then** they see the heading "See the Transformations" and three buttons: "Empty to Staged", "Staged to Staged", and "Renovation".
3. **Given** a user clicks "Empty to Staged", **When** the page opens, **Then** they see before/after image pairs from the "empty room to Staged" folder (dining room, backyard, basement, bedroom).
4. **Given** a user clicks "Staged to Staged", **When** the page opens, **Then** they see before/after image pairs from the "traditionaly staged to virtually staged" folder (backyard, balcony, living room, office room).
5. **Given** a user clicks "Renovation", **When** the page opens, **Then** they see before/after image pairs from the "renovated room_area" folder (backyard, deck, bathroom, laundry area).

---

### Edge Cases

- What happens when a user tries to upload non-image files?
- How does the system handle duplicate email registrations?
- What happens if the Excel file is locked/in-use when a submission occurs?
- What happens when a user's name contains special characters (used as folder name)?
- What happens if the 6-digit code email fails to deliver?
- How does the system handle very large image files?
- What if the portfolio image source folder is missing or empty?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow new users to create accounts with full name, email, and password.
- **FR-002**: System MUST validate email uniqueness during signup.
- **FR-003**: System MUST authenticate users with email and password on login.
- **FR-004**: System MUST display "Invalid credentials" for failed login attempts.
- **FR-005**: System MUST send a 6-digit verification code to the user's email for password reset, valid for 60 seconds.
- **FR-006**: System MUST allow users to set a new password after entering a valid reset code.
- **FR-007**: System MUST allow authenticated users to upload a maximum of 3 images (common formats: JPG, PNG, JPEG).
- **FR-008**: System MUST provide a text box for users to describe their styling requirements.
- **FR-009**: System MUST save user submissions (name, email, description) to an Excel file with 3 columns.
- **FR-010**: System MUST create a folder named after the user and save uploaded images inside it.
- **FR-011**: System MUST display 3 testimonials with user names on the Landing Page.
- **FR-012**: System MUST display a portfolio section with 3 category buttons: "Empty to Staged", "Staged to Staged", "Renovation".
- **FR-013**: Each portfolio category MUST open a page showing before/after image pairs from the corresponding source folder at `C:\Users\ravit\Desktop\Staging\Application`.
- **FR-014**: System MUST display the message "Pay when you like the images" on the Landing Page.
- **FR-015**: The application MUST have a polished, professional frontend inspired by market-leading virtual staging applications.

### Key Entities

- **User**: Full name, email (unique), hashed password, created date.
- **PasswordResetCode**: User email, 6-digit code, expiry timestamp (60s).
- **Submission**: User reference, description text, submission date, image folder path.
- **PortfolioCategory**: Name (Empty to Staged / Staged to Staged / Renovation), source folder path, list of before/after image pairs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete account creation and login in under 1 minute.
- **SC-002**: Password reset code is delivered within 60 seconds and the flow completes in under 2 minutes.
- **SC-003**: Image upload and description submission completes in under 30 seconds for 3 images.
- **SC-004**: All user data (name, email, description) is correctly written to the Excel sheet with zero data loss.
- **SC-005**: Portfolio pages correctly display all before/after pairs from the source folders.
- **SC-006**: The UI is visually comparable to professional virtual staging applications (e.g., VirtualStagingAI, BoxBrownie, Stuccco).
