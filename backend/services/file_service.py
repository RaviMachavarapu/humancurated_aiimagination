import os
import re
import base64
import requests
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")


def sanitize_folder_name(name: str) -> str:
    sanitized = re.sub(r'[<>:"/\\|?*]', '_', name)
    return sanitized.strip()


def create_user_folder(username: str, upload_base: str = None) -> str:
    if not upload_base:
        upload_base = os.getenv("UPLOAD_PATH", "./uploads")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    folder_name = f"{sanitize_folder_name(username)}_{timestamp}"
    folder_path = os.path.join(upload_base, folder_name)
    os.makedirs(folder_path, exist_ok=True)
    return folder_path


async def save_images(folder_path: str, files: list, username: str = "") -> list:
    saved_paths = []
    drive_files = []

    for file in files:
        content = await file.read()

        # Save locally
        file_path = os.path.join(folder_path, file.filename)
        with open(file_path, "wb") as f:
            f.write(content)
        saved_paths.append(file_path)
        print(f"[Local] Saved {file.filename} ({len(content)} bytes)", flush=True)

        # Prepare for Google Drive upload
        drive_files.append({
            "fileName": file.filename,
            "mimeType": file.content_type or "image/jpeg",
            "content": base64.b64encode(content).decode("utf-8"),
        })

    # Upload to Google Drive
    webhook_url = os.getenv("GDRIVE_WEBHOOK_URL", "")
    print(f"[Google Drive] Webhook URL set: {bool(webhook_url)}, username: {username}, files: {len(drive_files)}", flush=True)
    print(f"[Google Drive] Webhook URL value: {webhook_url[:30]}..." if webhook_url else "[Google Drive] Webhook URL is EMPTY", flush=True)

    if webhook_url and username:
        try:
            payload = {
                "userName": sanitize_folder_name(username),
                "files": drive_files,
            }
            print(f"[Google Drive] Uploading {len(drive_files)} files for {username}...", flush=True)
            resp = requests.post(webhook_url, json=payload, timeout=120)
            print(f"[Google Drive] Response: {resp.status_code} - {resp.text[:200]}", flush=True)
            if resp.status_code == 200 and "success" in resp.text:
                print(f"[Google Drive] Uploaded {len(drive_files)} images for {username}", flush=True)
            else:
                print(f"[Google Drive Error] HTTP {resp.status_code}: {resp.text[:200]}", flush=True)
        except Exception as e:
            print(f"[Google Drive Error] {e}", flush=True)

    return saved_paths
