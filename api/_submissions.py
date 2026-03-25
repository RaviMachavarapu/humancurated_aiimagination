import os
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session

from _db import get_db
from _auth import get_current_user
from _excel_service import append_submission

router = APIRouter()


class SubmitRequest(BaseModel):
    description: str


@router.post("/submit")
def submit(
    req: SubmitRequest,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    # Verify auth
    token = authorization.replace("Bearer ", "")
    user = get_current_user(db, token)

    # Validate
    if not req.description.strip():
        raise HTTPException(status_code=400, detail="Description is required")
    if len(req.description) > 3500:
        raise HTTPException(status_code=400, detail="Description must be under 3500 characters")

    print(f"[Submission] User: {user.full_name}, Email: {user.email}", flush=True)
    print(f"[Submission] Description: {req.description[:100]}", flush=True)

    # Save metadata to Google Sheets (+ local Excel fallback)
    append_submission(user.full_name, user.email, req.description)
    print(f"[Submission] Google Sheets save done", flush=True)

    # Return Drive webhook URL so frontend can upload images directly
    gdrive_webhook_url = os.getenv("GDRIVE_WEBHOOK_URL", "")

    return {
        "message": "Submission saved successfully!",
        "gdrive_webhook_url": gdrive_webhook_url,
        "username": user.full_name,
    }
