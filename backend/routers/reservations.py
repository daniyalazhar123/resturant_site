import os
import secrets
from typing import Optional
import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from database import get_db
from models import Reservation, User
from schemas import ReservationCreateSchema
from dependencies import require_auth, require_admin, get_current_user_optional
from rate_limit import limiter

router = APIRouter(prefix="/api/v1/reservations", tags=["Reservations"])


async def send_reservation_email_task(email: str, ref_code: str) -> None:
    """Send transactional reservation confirmation email via Resend API."""
    api_key = os.getenv("RESEND_API_KEY", "").strip()
    if not api_key:
        return

    from_email = os.getenv("RESEND_FROM_EMAIL", "L'Étoile Dorée <onboarding@resend.dev>").strip()

    payload = {
        "from": from_email,
        "to": [email],
        "subject": f"Your VIP Dining Reservation at L'Étoile Dorée [{ref_code}]",
        "html": (
            "<div style='font-family: serif; color: #18181b; padding: 24px; max-width: 600px; margin: auto;'>"
            "<h1 style='color: #b45309; letter-spacing: 2px;'>L'Étoile Dorée & Royal Pavilion</h1>"
            "<p style='font-size: 14px; text-transform: uppercase; color: #71717a;'>12 Place Vendôme, Paris</p>"
            "<hr style='border: 1px solid #fef3c7;'/>"
            "<p>Dear Honored Guest,</p>"
            "<p>We have the honor to confirm your table reservation. Your reservation booking reference is:</p>"
            f"<div style='background: #18181b; color: #f59e0b; padding: 16px; text-align: center; font-size: 20px; font-weight: bold; border-radius: 8px; font-family: monospace;'>{ref_code}</div>"
            "<p style='margin-top: 16px;'>Please present this reference upon arrival to our Maître d' for priority escort to your table or private salon.</p>"
            "<p style='font-size: 12px; color: #a1a1aa;'>Complimentary valet parking is reserved in your honor at Place Vendôme.</p>"
            "</div>"
        ),
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
    except Exception:
        pass


def _generate_unique_reference_code(db: Session) -> str:
    """Generate a cryptographically random, unique reservation reference code."""
    for _ in range(5):
        candidate = f"RES-{secrets.token_hex(4).upper()}"
        exists = db.query(Reservation.id).filter(Reservation.reference_code == candidate).first()
        if not exists:
            return candidate
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Could not generate unique reservation reference code",
    )


@router.post("/", status_code=status.HTTP_201_CREATED)
@router.post("/reserve", status_code=status.HTTP_201_CREATED)
@limiter.limit("15/minute")
def create_reservation(
    request: Request,
    payload: ReservationCreateSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Guests may book without an account; authenticated users get the booking linked to them."""
    ref_code = _generate_unique_reference_code(db)

    db_res = Reservation(
        user_id=current_user.id if current_user else None,
        reference_code=ref_code,
        full_name=payload.name,
        email=payload.email,
        phone=payload.phone,
        date=payload.date,
        time=payload.time,
        guests=payload.guests,
        table_type=payload.table_type or "Main Hall",
        special_requests=payload.requests,
        status="Confirmed",
    )

    try:
        db.add(db_res)
        db.commit()
        db.refresh(db_res)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Reservation conflict, please retry",
        )

    background_tasks.add_task(send_reservation_email_task, payload.email, ref_code)

    return {
        "success": True,
        "message": "VIP Reservation confirmed successfully!",
        "reference_code": ref_code,
    }


@router.get("/")
def get_user_reservations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    """Get reservations for authenticated user only"""
    reservations = (
        db.query(Reservation)
        .filter(Reservation.user_id == current_user.id)
        .order_by(Reservation.id.desc())
        .all()
    )
    return {
        "success": True,
        "count": len(reservations),
        "reservations": [
            {
                "reference_code": r.reference_code,
                "date": r.date,
                "time": r.time,
                "guests": r.guests,
                "table_type": r.table_type,
                "status": r.status,
                "special_requests": r.special_requests,
            }
            for r in reservations
        ],
    }


@router.get("/admin/all")
def list_all_reservations(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Admin only - list all reservations"""
    reservations = db.query(Reservation).order_by(Reservation.id.desc()).all()
    return {"success": True, "count": len(reservations), "reservations": reservations}


@router.get("/{ref_code}")
def get_reservation(
    ref_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    """Get specific reservation - uniform 404 prevents reference-code enumeration."""
    res = db.query(Reservation).filter(Reservation.reference_code == ref_code).first()
    if not res or (res.user_id != current_user.id and current_user.role != "ADMIN"):
        raise HTTPException(status_code=404, detail="Reservation not found")

    return {
        "success": True,
        "reservation": {
            "reference_code": res.reference_code,
            "full_name": res.full_name,
            "email": res.email,
            "phone": res.phone,
            "date": res.date,
            "time": res.time,
            "guests": res.guests,
            "table_type": res.table_type,
            "status": res.status,
            "special_requests": res.special_requests,
        },
    }
