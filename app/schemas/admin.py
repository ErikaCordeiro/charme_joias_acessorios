from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from app.models import OrderStatus


class AdminDashboardMetrics(BaseModel):
    total_orders: int
    paid_orders: int
    pending_orders: int
    total_customers: int
    total_products: int
    total_sales_amount: float
    paid_sales_amount: float
    abandoned_carts: int
    abandoned_items: int
    abandoned_value: float


class AdminCustomerResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    is_admin: bool
    created_at: datetime


class AdminOrderResponse(BaseModel):
    id: int
    user_id: int
    user_email: str
    total: float
    shipping_carrier: Optional[str] = None
    status: OrderStatus
    items_count: int
    created_at: datetime


class AdminAbandonedCartResponse(BaseModel):
    cart_id: int
    user_id: int
    user_email: str
    user_name: Optional[str] = None
    items_count: int
    estimated_total: float
    created_at: datetime


class AdminDashboardResponse(BaseModel):
    metrics: AdminDashboardMetrics
    recent_orders: List[AdminOrderResponse]
    abandoned_carts: List[AdminAbandonedCartResponse]
