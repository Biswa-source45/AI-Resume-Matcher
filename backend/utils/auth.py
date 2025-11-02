import os
from datetime import datetime, timedelta
from typing import Dict, Any
import jwt
from fastapi import Request, HTTPException, Response

JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-prod")
JWT_ALGO = "HS256"

def create_jwt(payload: dict, expires_in_days: int = 7) -> str:
    payload = payload.copy()
    payload["exp"] = datetime.utcnow() + timedelta(days=expires_in_days)
    payload["iat"] = datetime.utcnow()
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)
    # PyJWT returns str for >=2.x
    return token

def verify_jwt_cookie(request: Request) -> Dict[str, Any]:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def set_auth_cookie(response: Response, token: str, max_age: int = 60 * 60 * 24 * 7):
    """
    Set httpOnly cookie 'access_token' with options controlled by env:
    COOKIE_SECURE (true/false) and COOKIE_SAMESITE (none/lax/strict).
    """
    cookie_secure = os.getenv("COOKIE_SECURE", "true").lower() == "true"
    samesite_val = os.getenv("COOKIE_SAMESITE", "none").lower()  # 'none' for cross-site
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=cookie_secure,
        samesite=samesite_val,
        max_age=max_age,
        path="/"
    )

def clear_auth_cookie(response: Response):
    response.delete_cookie(key="access_token", path="/")