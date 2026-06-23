from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_async_session
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse, OrderCheckoutResponse
from app.services.order import OrderService
from app.core.security import get_current_admin_user, get_current_user
from app.models import User

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=OrderCheckoutResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    order_service = OrderService(db)
    order, payment = await order_service.create_order_from_cart(current_user.id, order_data)
    order_details = await order_service.get_order(order.id, current_user.id)
    return {"order": order_details, "payment": payment}


@router.get("/", response_model=List[OrderResponse])
async def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    order_service = OrderService(db)
    orders = await order_service.get_user_orders(current_user.id)
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    order_service = OrderService(db)
    order = await order_service.get_order(order_id, current_user.id)
    return order


@router.put("/{order_id}", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    order_data: OrderUpdate,
    _current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_async_session)
):
    order_service = OrderService(db)
    order = await order_service.update_order_status(order_id, order_data)
    return order
