import os
import sys
from typing import List
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, Header
from sqlalchemy.orm import Session

from database import get_db
from routers.auth import verify_token, get_current_user
from services.file_service import create_user_folder, save_images
from services.excel_service import append_submission

router = APIRouter()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/upload")
async def upload_submission(
    description: str = Form(...),
    files: List[UploadFile] = File(...),
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    # Verify auth
    token = authorization.replace("Bearer ", "")
    user = get_current_user(db, token)

    # Validate file count
    if len(files) > 3:
        raise HTTPException(status_code=400, detail="Maximum 3 images allowed")
    if len(files) == 0:
        raise HTTPException(status_code=400, detail="At least 1 image is required")

    # Validate file types
    for file in files:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file.filename}. Allowed: JPG, JPEG, PNG",
            )

    # Create user folder and save images (locally + Google Drive)
    print(f"[Submission] User: {user.full_name}, Email: {user.email}, Files: {len(files)}", flush=True)
    print(f"[Submission] Description: {description[:100]}", flush=True)
    sys.stdout.flush()

    folder_path = create_user_folder(user.full_name)
    print(f"[Submission] Folder created: {folder_path}", flush=True)

    saved_paths = await save_images(folder_path, files, username=user.full_name)
    print(f"[Submission] Images saved: {len(saved_paths)}", flush=True)

    # Save to Google Sheet (+ local Excel fallback)
    append_submission(user.full_name, user.email, description)
    print(f"[Submission] Excel/Sheet submission done", flush=True)

    return {
        "message": "Submission received successfully!",
        "images_saved": len(saved_paths),
        "folder": os.path.basename(folder_path),
    }
