import os
import secrets
from decimal import Decimal, ROUND_HALF_UP
import stripe
from fastapi import APIRouter, Depends, status, HTTPException, Request
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from database import get_db
from models import Order, User, MenuItem
from schemas import OrderCreateSchema
from dependencies import require_auth
from routers.menu import seed_menu_items
from rate_limit import limiter

router = APIRouter(prefix="/api/v1/orders", tags=["Pre-Orders & Takeout"])


def _generate_unique_order_code(db: Session) -> str:
    """Generate a cryptographically random unique order code."""
    for _ in range(5):
        candidate = f"ED-{secrets.token_hex(4).upper()}"
        exists = db.query(Order.id).filter(Order.order_code == candidate).first()
        if not exists:
            return candidate
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Could not generate unique order reference code",
    )


@router.post("/", status_code=status.HTTP_201_CREATED)
@limiter.limit("15/minute")
def create_order(
    request: Request,
    payload: OrderCreateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one menu item",
        )

    # Ensure authoritative menu catalog is seeded in DB
    seed_menu_items(db)

    requested_codes = [item.item_id for item in payload.items]
    db_menu_items = (
        db.query(MenuItem).filter(MenuItem.code.in_(requested_codes)).all()
    )
    menu_by_code = {m.code: m for m in db_menu_items}

    total_decimal = Decimal("0.00")
    summary_parts: list[str] = []
    stripe_line_items: list[dict] = []

    for req_item in payload.items:
        if req_item.quantity <= 0 or req_item.quantity > 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid quantity for item '{req_item.item_id}' (must be between 1 and 50)",
            )
        db_item = menu_by_code.get(req_item.item_id)
        if not db_item:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Menu item '{req_item.item_id}' does not exist in authoritative catalog",
            )

        unit_price = Decimal(str(db_item.price)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        line_total = (unit_price * Decimal(req_item.quantity)).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        total_decimal += line_total
        summary_parts.append(f"{req_item.quantity}× {db_item.name}")

        unit_amount_cents = int((unit_price * Decimal(100)).to_integral_value(rounding=ROUND_HALF_UP))
        stripe_line_items.append(
            {
                "price_data": {
                    "currency": "eur",
                    "product_data": {
                        "name": db_item.name,
                        "description": db_item.category,
                        "images": [db_item.image_url] if db_item.image_url else [],
                    },
                    "unit_amount": unit_amount_cents,
                },
                "quantity": req_item.quantity,
            }
        )

    calculated_total = float(total_decimal)
    items_summary = ", ".join(summary_parts)
    order_code = _generate_unique_order_code(db)

    db_order = Order(
        user_id=current_user.id,
        order_code=order_code,
        full_name=payload.name,
        email=payload.email,
        phone=payload.phone,
        order_type=payload.order_type,
        total_amount=calculated_total,
        items_summary=items_summary,
        status="received",
    )

    try:
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Order creation conflict, please retry",
        )

    # Create PCI-DSS SAQ-A Stripe Hosted Checkout Session
    stripe_secret_key = os.getenv("STRIPE_SECRET_KEY", "").strip()
    if (
        not stripe_secret_key
        or stripe_secret_key == "your_stripe_secret_key_here"
        or stripe_secret_key.startswith("[")
    ):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Stripe payment gateway is not configured (STRIPE_SECRET_KEY missing).",
        )

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
    stripe.api_key = stripe_secret_key

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            customer_email=payload.email,
            client_reference_id=order_code,
            line_items=stripe_line_items,
            metadata={"order_id": order_code, "order_code": order_code},
            payment_intent_data={
                "metadata": {"order_id": order_code, "order_code": order_code}
            },
            success_url=f"{frontend_url}/checkout?success=true&order_code={order_code}&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{frontend_url}/checkout?canceled=true&order_code={order_code}",
        )
        db_order.stripe_payment_intent_id = checkout_session.id
        db.commit()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to initialize Stripe Checkout Session",
        ) from exc

    return {
        "success": True,
        "message": "Pre-order created. Redirecting to Stripe Checkout.",
        "order_code": order_code,
        "total_amount": calculated_total,
        "items_summary": items_summary,
        "checkout_url": checkout_session.url,
    }


@router.get("/")
def get_user_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    """Get orders for authenticated user only"""
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return {
        "success": True,
        "orders": [
            {
                "order_code": order.order_code,
                "total_amount": order.total_amount,
                "items_summary": order.items_summary,
                "status": order.status,
                "order_type": order.order_type,
                "created_at": order.created_at,
            }
            for order in orders
        ],
    }


@router.get("/{order_code}")
def get_order(
    order_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    """Get specific order - only if it belongs to authenticated user or ADMIN"""
    order = db.query(Order).filter(Order.order_code == order_code).first()
    if not order or (order.user_id != current_user.id and current_user.role != "ADMIN"):
        raise HTTPException(status_code=404, detail="Order not found")

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
            "created_at": order.created_at,
        },
    }
