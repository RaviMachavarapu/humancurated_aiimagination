import os
import random
import string
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import bcrypt
from jose import jwt, JWTError

from _db import get_db
from _models import User

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# In-memory store for reset codes {email: {code, expires_at}}
reset_codes = {}


class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    code: str
    new_password: str


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_user(db: Session, token: str):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == payload.get("email")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = bcrypt.hashpw(req.password.encode("utf-8"), bcrypt.gensalt())
    user = User(
        full_name=req.full_name,
        email=req.email,
        hashed_password=hashed.decode("utf-8"),
    )
    db.add(user)
    db.commit()
    return {"message": "Successfully account created"}


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not bcrypt.checkpw(req.password.encode("utf-8"), user.hashed_password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"email": user.email, "name": user.full_name})
    return {
        "token": token,
        "user": {
            "full_name": user.full_name,
            "email": user.email,
        },
    }


@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    code = "".join(random.choices(string.digits, k=6))
    reset_codes[req.email] = {
        "code": code,
        "expires_at": datetime.utcnow() + timedelta(seconds=60),
    }

    # Try to send email, but don't fail if SMTP isn't configured
    try:
        from _email_service import send_reset_code
        await send_reset_code(req.email, code)
    except Exception:
        print(f"[DEV] Password reset code for {req.email}: {code}", flush=True)

    return {"message": "Reset code sent to your email", "dev_code": code}


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    stored = reset_codes.get(req.email)
    if not stored:
        raise HTTPException(status_code=400, detail="No reset code found. Request a new one.")

    if datetime.utcnow() > stored["expires_at"]:
        del reset_codes[req.email]
        raise HTTPException(status_code=400, detail="Reset code has expired")

    if stored["code"] != req.code:
        raise HTTPException(status_code=400, detail="Invalid reset code")

    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed = bcrypt.hashpw(req.new_password.encode("utf-8"), bcrypt.gensalt())
    user.hashed_password = hashed.decode("utf-8")
    db.commit()
    del reset_codes[req.email]

    return {"message": "Password updated successfully"}
