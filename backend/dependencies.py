import os
from typing import Optional

from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from database import get_db
from models import User
from auth import SECRET_KEY, ALGORITHM, decode_token

security = HTTPBearer(auto_error=False)

async def get_token_from_request(request: Request, credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    # Try to get token from Authorization header first
    if credentials and credentials.scheme == "Bearer":
        return credentials.credentials
    # Try to get from cookie (httpOnly cookie)
    token = request.cookies.get("access_token")
    if token:
        return token
    return None

async def require_auth(
    request: Request,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(get_token_from_request)
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        if token_type != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
        )

    user = db.query(User).filter(User.id == user_id_int).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return user

async def require_admin(current_user: User = Depends(require_auth)) -> User:
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user

async def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(get_token_from_request)
) -> Optional[User]:
    if not token:
        return None
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id is None or token_type != "access":
            return None
        try:
            user_id_int = int(user_id)
        except (ValueError, TypeError):
            return None

        user = db.query(User).filter(User.id == user_id_int).first()
        return user
    except Exception:
        return None
