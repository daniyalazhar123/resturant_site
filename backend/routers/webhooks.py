import os
from pathlib import Path
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

import json
import hmac
import hashlib
import time
from fastapi import APIRouter, Request, HTTPException, Depends, Header, BackgroundTasks, status
from sqlalchemy.orm import Session
from database import get_db
from models import Order
from utils.order_pipeline import producer, OrderStatus

router = APIRouter(prefix="/api/v1/webhooks", tags=["Webhooks"])

WEBHOOK_TOLERANCE_SECONDS = 300  # Max 5 minutes tolerance to prevent replay attacks

_raw_stripe_webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "").strip()
_FORBIDDEN_WEBHOOK_DEFAULTS = {
    "",
    "your_stripe_webhook_secret_here",
    "changeme",
}
if (
    not _raw_stripe_webhook_secret
    or _raw_stripe_webhook_secret in _FORBIDDEN_WEBHOOK_DEFAULTS
    or _raw_stripe_webhook_secret.startswith("[")
):
    raise RuntimeError(
        "CRITICAL SECURITY ERROR: STRIPE_WEBHOOK_SECRET environment variable must be set "
        "to a valid non-empty Stripe webhook signing secret before starting the server."
    )

STRIPE_WEBHOOK_SECRET: str = _raw_stripe_webhook_secret


def verify_stripe_signature(payload: bytes, sig_header: str) -> bool:
    """Verify Stripe webhook HMAC-SHA256 signature and enforce 5-minute timestamp tolerance."""
    if not STRIPE_WEBHOOK_SECRET or not sig_header:
        return False
    try:
        # Stripe uses t=timestamp,v1=signature
        elements: dict[str, list[str]] = {}
        for item in sig_header.split(","):
            if "=" in item:
                key, value = item.split("=", 1)
                k = key.strip()
                v = value.strip()
                elements.setdefault(k, []).append(v)

        timestamps = elements.get("t", [])
        signatures = elements.get("v1", [])
        if not timestamps or not signatures:
            return False

        timestamp_str = timestamps[0]
        timestamp_int = int(timestamp_str)

        # Enforce max 5-minute (300s) timestamp tolerance against replay attacks
        current_time = int(time.time())
        if abs(current_time - timestamp_int) > WEBHOOK_TOLERANCE_SECONDS:
            return False

        signed_payload = f"{timestamp_str}.{payload.decode('utf-8')}"
        expected = hmac.new(
            STRIPE_WEBHOOK_SECRET.encode("utf-8"),
            signed_payload.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        return any(hmac.compare_digest(expected, sig) for sig in signatures)
    except Exception:
        return False


def _publish_order_transitions(order_code: str, total_amount: float) -> None:
    """Publish order state transitions off the main async event loop."""
    producer.publish_order_event(
        order_id=order_code,
        status=OrderStatus.RECEIVED,
        metadata={"source": "stripe_webhook", "amount": total_amount},
    )
    producer.publish_order_event(
        order_id=order_code,
        status=OrderStatus.PREPARING,
        metadata={"chef_assigned": True},
    )


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    stripe_signature: str = Header(None, alias="Stripe-Signature"),
):
    payload = await request.body()

    # CRITICAL: Verify signature and timestamp freshness BEFORE processing
    if not stripe_signature or not verify_stripe_signature(payload, stripe_signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired webhook signature",
        )

    try:
        event = json.loads(payload)
        event_type = event.get("type")

        if event_type in ("payment_intent.succeeded", "checkout.session.completed"):
            obj = event.get("data", {}).get("object", {})
            metadata = obj.get("metadata", {}) or {}
            order_id = metadata.get("order_id") or metadata.get("order_code") or obj.get("client_reference_id")

            if not order_id:
                raise HTTPException(status_code=400, detail="Missing order_id in metadata")

            db_order = db.query(Order).filter(Order.order_code == order_id).first()
            if not db_order:
                raise HTTPException(status_code=404, detail="Order not found")

            # Verify paid amount in cents against server-side DB total_amount
            expected_cents = int(round(float(db_order.total_amount) * 100))
            if event_type == "payment_intent.succeeded":
                paid_cents = obj.get("amount_received")
                payment_ref = obj.get("id")
            else:
                paid_cents = obj.get("amount_total")
                payment_ref = obj.get("payment_intent") or obj.get("id")

            if paid_cents is None or int(paid_cents) != expected_cents:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Payment amount mismatch against authoritative order total",
                )

            # Only update if not already processed (idempotency)
            if db_order.status == "received":
                db_order.status = "preparing"
                db_order.stripe_payment_intent_id = str(payment_ref) if payment_ref else None
                db.commit()
                db.refresh(db_order)

                background_tasks.add_task(
                    _publish_order_transitions,
                    db_order.order_code,
                    float(db_order.total_amount),
                )

                return {"status": "success", "order_id": order_id, "new_status": "preparing"}
            elif db_order.status in ["preparing", "dispatched"]:
                return {"status": "already_processed", "order_id": order_id}
            else:
                return {"status": "ignored", "order_id": order_id, "current_status": db_order.status}

        return {"status": "ignored", "event_type": event_type}

    except HTTPException:
        raise
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook processing failed",
        )
