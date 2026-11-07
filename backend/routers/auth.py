from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session

from database import get_db
from models import User, Reservation, Order
from schemas import UserRegisterSchema, UserLoginSchema, TokenSchema
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from dependencies import require_auth
from rate_limit import limiter

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    """Set hardened HttpOnly, Secure, SameSite=Strict authentication cookies."""
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=15 * 60,  # 15 minutes
        samesite="strict",
        secure=True,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,  # 7 days
        samesite="strict",
        secure=True,
        path="/",
    )


@router.post("/register", response_model=TokenSchema)
@limiter.limit("5/minute")
def register(request: Request, payload: UserRegisterSchema, response: Response, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = get_password_hash(payload.password)
    db_user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hashed_password,
        role="VIP_MEMBER",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_access_token(data={"sub": str(db_user.id), "role": db_user.role})
    refresh_token = create_refresh_token(data={"sub": str(db_user.id)})

    _set_auth_cookies(response, access_token, refresh_token)

    return {
        "access_token": "httponly_cookie_set",
        "token_type": "cookie",
        "user_name": db_user.full_name,
    }


@router.post("/login", response_model=TokenSchema)
@limiter.limit("5/minute")
def login(request: Request, payload: UserLoginSchema, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    _set_auth_cookies(response, access_token, refresh_token)

    return {
        "access_token": "httponly_cookie_set",
        "token_type": "cookie",
        "user_name": user.full_name,
    }


@router.post("/refresh", response_model=TokenSchema)
def refresh_session(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )

    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type for refresh",
        )

    sub = payload.get("sub")
    try:
        user_id = int(sub)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    new_access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    _set_auth_cookies(response, new_access_token, new_refresh_token)

    return {
        "access_token": "httponly_cookie_set",
        "token_type": "cookie",
        "user_name": user.full_name,
    }


@router.get("/me")
def get_me(current_user: User = Depends(require_auth)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "points": current_user.points,
    }


@router.get("/me/export")
def export_my_data(
    current_user: User = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """GDPR Article 15 & 20: Right of Access and Data Portability."""
    reservations = db.query(Reservation).filter(Reservation.user_id == current_user.id).all()
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    return {
        "profile": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role,
            "points": current_user.points,
            "created_at": current_user.created_at,
        },
        "reservations": [
            {
                "reference_code": r.reference_code,
                "date": r.date,
                "time": r.time,
                "guests": r.guests,
                "table_type": r.table_type,
                "status": r.status,
            }
            for r in reservations
        ],
        "orders": [
            {
                "order_code": o.order_code,
                "total_amount": o.total_amount,
                "items_summary": o.items_summary,
                "status": o.status,
                "created_at": o.created_at,
            }
            for o in orders
        ],
    }


@router.delete("/me")
def delete_my_account(
    response: Response,
    current_user: User = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """GDPR Article 17: Right to Erasure."""
    db.query(Reservation).filter(Reservation.user_id == current_user.id).delete()
    db.query(Order).filter(Order.user_id == current_user.id).delete()
    db.delete(current_user)
    db.commit()

    response.delete_cookie("access_token", path="/", samesite="strict", secure=True, httponly=True)
    response.delete_cookie("refresh_token", path="/", samesite="strict", secure=True, httponly=True)
    return {"message": "Account and associated personal data permanently deleted"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token", path="/", samesite="strict", secure=True, httponly=True)
    response.delete_cookie("refresh_token", path="/", samesite="strict", secure=True, httponly=True)
    return {"message": "Logged out successfully"}
