from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
from models import User
from schemas import UserRegisterSchema, UserLoginSchema, TokenSchema
from auth import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from dependencies import require_auth

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenSchema)
def register(payload: UserRegisterSchema, response: Response, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(payload.password)
    db_user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hashed_password,
        role="VIP_MEMBER"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(db_user.id), "role": db_user.role})
    refresh_token = create_refresh_token(data={"sub": str(db_user.id)})
    
    # Set httpOnly cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=15 * 60,  # 15 minutes
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,  # 7 days
        samesite="lax",
        secure=False
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": db_user.full_name
    }

@router.post("/login", response_model=TokenSchema)
def login(payload: UserLoginSchema, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=15 * 60,
        samesite="lax",
        secure=False
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        samesite="lax",
        secure=False
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": user.full_name
    }

@router.get("/me")
def get_me(current_user: User = Depends(require_auth)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "points": current_user.points
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}
