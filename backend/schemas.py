from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserRegisterSchema(BaseModel):
    full_name: str
    email: str
    password: str

class UserLoginSchema(BaseModel):
    email: str
    password: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str

class ReservationCreateSchema(BaseModel):
    name: str
    email: str
    phone: str
    date: str
    time: str
    guests: int = 2
    table_type: Optional[str] = "Main Hall"
    requests: Optional[str] = None

class OrderCreateSchema(BaseModel):
    name: str
    email: str
    phone: str
    order_type: str = "Takeout"
    items_summary: str
    total_amount: float

class ChatbotQuerySchema(BaseModel):
    query: str
