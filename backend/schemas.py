from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserRegisterSchema(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)

class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str

class ReservationCreateSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=25)
    date: str = Field(..., min_length=1, max_length=20)
    time: str = Field(..., min_length=1, max_length=10)
    guests: int = Field(..., ge=1, le=20)
    table_type: Optional[str] = Field("Main Hall", max_length=50)
    requests: Optional[str] = Field(None, max_length=1000)

class OrderItemSchema(BaseModel):
    item_id: str = Field(..., min_length=1, max_length=64)
    quantity: int = Field(..., ge=1, le=50)

class OrderCreateSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=25)
    order_type: str = Field("Takeout", max_length=20)
    items: List[OrderItemSchema] = Field(..., min_length=1, max_length=50)

class ChatbotQuerySchema(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
