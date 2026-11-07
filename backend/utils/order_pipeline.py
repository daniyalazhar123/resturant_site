import os
import json
import logging
from datetime import datetime, timezone
from typing import Dict, Any

logger = logging.getLogger("order_pipeline")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

try:
    from kafka import KafkaProducer
    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False

class OrderStatus:
    RECEIVED = "received"
    PREPARING = "preparing"
    DISPATCHED = "dispatched"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderEventProducer:
    """
    Kafka producer for order pipeline
    States: received -> preparing -> dispatched
    """
    def __init__(self):
        self.bootstrap_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
        self.topic = os.getenv("ORDER_EVENTS_TOPIC", "restaurant.orders")
        self.producer = None
        if KAFKA_AVAILABLE:
            try:
                self.producer = KafkaProducer(
                    bootstrap_servers=self.bootstrap_servers,
                    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                    key_serializer=lambda k: k.encode('utf-8') if k else None,
                )
            except Exception as e:
                logger.warning(f"Kafka unavailable, falling back to structured logging: {e}")
                self.producer = None
    
    def publish_order_event(self, order_id: str, status: str, metadata: Dict[str, Any] = None):
        now = datetime.now(timezone.utc)
        event = {
            "event_id": f"evt_{order_id}_{now.timestamp()}",
            "order_id": order_id,
            "status": status,
            "timestamp": now.isoformat(),
            "metadata": metadata or {}
        }
        if self.producer:
            try:
                self.producer.send(self.topic, key=order_id, value=event)
                self.producer.flush(timeout=5)
                return True
            except Exception as e:
                logger.error(f"Kafka send error: {e}")
        # Structured log fallback with audit metadata
        logger.info(f"Order state transition: code={order_id} status={status}")
        return True

producer = OrderEventProducer()
