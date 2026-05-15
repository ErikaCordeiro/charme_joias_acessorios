from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from app.models import OrderStatus
from app.schemas.payment import PaymentRequest, PaymentSimulationResponse


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_time: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total: float
    status: OrderStatus
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    payment: PaymentRequest
    freight_total: float = Field(default=0, ge=0)


class OrderUpdate(BaseModel):
    status: OrderStatus


class OrderCheckoutResponse(BaseModel):
    order: OrderResponse
    payment: PaymentSimulationResponse
