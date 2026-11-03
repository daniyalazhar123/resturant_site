import os
import json
import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException, Depends, Header, status
from sqlalchemy.orm import Session
from database import get_db
from models import Order
from utils.order_pipeline import producer, OrderStatus

router = APIRouter(prefix="/api/v1/webhooks", tags=["Webhooks"])

def verify_stripe_signature(payload: bytes, sig_header: str) -> bool:
    """Verify Stripe webhook signature securely"""
    stripe_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "[STRIPE_WEBHOOK_SECRET]")
    if stripe_secret == "[STRIPE_WEBHOOK_SECRET]":
        # In dev without secret configured, still verify structure
        # In production this must fail
        return False
    try:
        if not sig_header:
            return False
        # Stripe uses t=timestamp,v1=signature
        elements = {}
        for item in sig_header.split(','):
            if '=' in item:
                key, value = item.split('=', 1)
                elements[key.strip()] = value.strip()
        timestamp = elements.get('t')
        signature = elements.get('v1')
        if not timestamp or not signature:
            return False
        signed_payload = f"{timestamp}.{payload.decode('utf-8')}"
        expected = hmac.new(
            stripe_secret.encode('utf-8'),
            signed_payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
    except Exception:
        return False

@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
    stripe_signature: str = Header(None, alias="Stripe-Signature")
):
    payload = await request.body()
    
    # CRITICAL: Verify signature BEFORE processing
    if not stripe_signature or not verify_stripe_signature(payload, stripe_signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid webhook signature"
        )
    
    try:
        event = json.loads(payload)
        event_type = event.get("type")
        
        if event_type == "payment_intent.succeeded":
            payment_intent = event.get("data", {}).get("object", {})
            metadata = payment_intent.get("metadata", {})
            order_id = metadata.get("order_id") or metadata.get("order_code")
            
            if not order_id:
                raise HTTPException(status_code=400, detail="Missing order_id in metadata")
            
            # UPDATE ORDER STATUS IN DB BEFORE PUSHING TO KAFKA (transactional)
            db_order = db.query(Order).filter(Order.order_code == order_id).first()
            if not db_order:
                raise HTTPException(status_code=404, detail="Order not found")
            
            # Only update if not already processed (idempotency)
            if db_order.status == "received":
                db_order.status = "preparing"
                db_order.stripe_payment_intent_id = payment_intent.get("id")
                db.commit()
                db.refresh(db_order)
                
                # Push to Kafka AFTER successful DB update
                producer.publish_order_event(
                    order_id=db_order.order_code,
                    status=OrderStatus.RECEIVED,
                    metadata={"source": "stripe_webhook", "amount": db_order.total_amount}
                )
                producer.publish_order_event(
                    order_id=db_order.order_code,
                    status=OrderStatus.PREPARING,
                    metadata={"chef_assigned": True}
                )
                
                return {"status": "success", "order_id": order_id, "new_status": "preparing"}
            elif db_order.status in ["preparing", "dispatched"]:
                return {"status": "already_processed", "order_id": order_id}
            else:
                return {"status": "ignored", "order_id": order_id, "current_status": db_order.status}
        
        return {"status": "ignored", "event_type": event_type}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook processing failed"
        )
