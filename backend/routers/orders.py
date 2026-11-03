import random
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Order, User
from schemas import OrderCreateSchema
from dependencies import require_auth

router = APIRouter(prefix="/api/v1/orders", tags=["Pre-Orders & Takeout"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreateSchema, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    order_code = f"ED-{random.randint(100000, 999999)}"

    db_order = Order(
        user_id=current_user.id,  # Tie order to authenticated user
        order_code=order_code,
        full_name=payload.name,
        email=payload.email,
        phone=payload.phone,
        order_type=payload.order_type,
        total_amount=payload.total_amount,
        items_summary=payload.items_summary,
        status="received"  # Start as received, not Paid
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return {
        "success": True,
        "message": "Pre-order placed successfully!",
        "order_code": order_code,
        "total_amount": payload.total_amount,
    }

@router.get("/")
def get_user_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Get orders for authenticated user only"""
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    return {
        "success": True,
        "orders": [
            {
                "order_code": order.order_code,
                "total_amount": order.total_amount,
                "items_summary": order.items_summary,
                "status": order.status,
                "order_type": order.order_type,
                "created_at": order.created_at
            }
            for order in orders
        ]
    }

@router.get("/{order_code}")
def get_order(
    order_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Get specific order - only if it belongs to authenticated user"""
    order = db.query(Order).filter(Order.order_code == order_code).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # IDOR protection - check ownership
    if order.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "success": True,
        "order": {
            "order_code": order.order_code,
            "full_name": order.full_name,
            "email": order.email,
            "phone": order.phone,
            "order_type": order.order_type,
            "total_amount": order.total_amount,
            "items_summary": order.items_summary,
            "status": order.status,
            "created_at": order.created_at
        }
    }
