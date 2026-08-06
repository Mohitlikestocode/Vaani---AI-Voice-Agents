"""Simple login — checks email/password against values in .env.
No JWT, no tokens, no hashing. Just a direct string comparison.
Credentials stored in backend/.env (ADMIN_EMAIL, ADMIN_PASSWORD).
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core import settings

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/auth/login")
async def login(data: LoginRequest):
    if data.email == settings.admin_email and data.password == settings.admin_password:
        return {"ok": True, "email": data.email}
    raise HTTPException(status_code=401, detail="Wrong email or password")
