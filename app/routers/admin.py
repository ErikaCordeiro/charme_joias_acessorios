from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_admin_user
from app.database import get_async_session
from app.schemas.admin import (
    AdminAbandonedCartResponse,
    AdminCustomerResponse,
    AdminDashboardResponse,
    AdminOrderResponse,
)
from app.services.admin import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_current_admin_user)],
)


@router.get("/dashboard", response_model=AdminDashboardResponse)
async def get_dashboard(db: AsyncSession = Depends(get_async_session)):
    admin_service = AdminService(db)
    return await admin_service.get_dashboard()


@router.get("/customers", response_model=list[AdminCustomerResponse])
async def list_customers(
    limit: int = Query(200, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_session),
):
    admin_service = AdminService(db)
    return await admin_service.list_customers(limit=limit)


@router.get("/orders", response_model=list[AdminOrderResponse])
async def list_orders(
    limit: int = Query(200, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_session),
):
    admin_service = AdminService(db)
    return await admin_service.list_orders(limit=limit)


@router.get("/abandoned-carts", response_model=list[AdminAbandonedCartResponse])
async def list_abandoned_carts(
    limit: int = Query(200, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_session),
):
    admin_service = AdminService(db)
    return await admin_service.list_abandoned_carts(limit=limit)
