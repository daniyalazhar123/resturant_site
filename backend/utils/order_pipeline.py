import os
import json
from datetime import datetime
from typing import Dict, Any

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
            except Exception:
                self.producer = None
    
    def publish_order_event(self, order_id: str, status: str, metadata: Dict[str, Any] = None):
        event = {
            "event_id": f"evt_{order_id}_{datetime.utcnow().timestamp()}",
            "order_id": order_id,
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
            "metadata": metadata or {}
        }
        if self.producer:
            try:
                self.producer.send(self.topic, key=order_id, value=event)
                self.producer.flush(timeout=5)
                return True
            except Exception:
                pass
        # Fallback: log if Kafka unavailable
        print(f"[ORDER_EVENT] {json.dumps(event)}")
        return True

producer = OrderEventProducer()
