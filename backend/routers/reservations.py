import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Reservation, User
from schemas import ReservationCreateSchema
from dependencies import require_auth, require_admin

router = APIRouter(prefix="/api/v1/reservations", tags=["Reservations"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_reservation(
    payload: ReservationCreateSchema, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    ref_code = f"RES-{random.randint(1000, 9999)}"

    db_res = Reservation(
        user_id=current_user.id,  # Tie reservation to authenticated user
        reference_code=ref_code,
        full_name=payload.name,
        email=payload.email,
        phone=payload.phone,
        date=payload.date,
        time=payload.time,
        guests=payload.guests,
        table_type=payload.table_type or "Main Hall",
        special_requests=payload.requests,
        status="Confirmed"
    )

    db.add(db_res)
    db.commit()
    db.refresh(db_res)

    return {
        "success": True,
        "message": "VIP Reservation confirmed successfully!",
        "reference_code": ref_code,
        "reservation_id": db_res.id,
    }

@router.get("/")
def get_user_reservations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Get reservations for authenticated user only"""
    reservations = db.query(Reservation).filter(Reservation.user_id == current_user.id).order_by(Reservation.id.desc()).all()
    return {"success": True, "count": len(reservations), "reservations": [
        {
            "id": r.id,
            "reference_code": r.reference_code,
            "date": r.date,
            "time": r.time,
            "guests": r.guests,
            "table_type": r.table_type,
            "status": r.status,
            "special_requests": r.special_requests
        } for r in reservations
    ]}

@router.get("/admin/all")
def list_all_reservations(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Admin only - list all reservations"""
    reservations = db.query(Reservation).order_by(Reservation.id.desc()).all()
    return {"success": True, "count": len(reservations), "reservations": reservations}

@router.get("/{ref_code}")
def get_reservation(
    ref_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Get specific reservation - only if it belongs to authenticated user"""
    res = db.query(Reservation).filter(Reservation.reference_code == ref_code).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if res.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {"success": True, "reservation": res}
