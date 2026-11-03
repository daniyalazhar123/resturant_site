import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="VIP_MEMBER") # VIP_MEMBER or ADMIN
    points = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    reservations = relationship("Reservation", back_populates="user")
    orders = relationship("Order", back_populates="user")

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)  # Tie to authenticated user
    reference_code = Column(String(20), unique=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False)
    phone = Column(String(30), nullable=False)
    date = Column(String(20), nullable=False)
    time = Column(String(10), nullable=False)
    guests = Column(Integer, default=2)
    table_type = Column(String(50), default="Main Hall")
    special_requests = Column(Text, nullable=True)
    status = Column(String(20), default="Confirmed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="reservations")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True)
    name = Column(String(150), nullable=False)
    native_name = Column(String(150), nullable=True)
    category = Column(String(50), nullable=False) # Pakistani, Indian, Chinese, Thai, Seafood, Desserts
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=False)
    is_signature = Column(Boolean, default=False)
    pairing_note = Column(String(255), nullable=True)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)  # Tie to authenticated user
    order_code = Column(String(30), unique=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False)
    phone = Column(String(30), nullable=False)
    order_type = Column(String(20), default="Takeout") # Takeout or Delivery
    total_amount = Column(Float, nullable=False)
    items_summary = Column(Text, nullable=False)
    status = Column(String(20), default="received")  # received -> preparing -> dispatched
    stripe_payment_intent_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
