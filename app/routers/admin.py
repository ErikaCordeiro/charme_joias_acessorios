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
from app.schemas.site import (
    AboutContentResponse,
    AboutContentUpdate,
    HomeContentResponse,
    HomeContentUpdate,
)
from app.services.admin import AdminService
from app.services.site_content import SiteContentService

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


@router.get("/home-content", response_model=HomeContentResponse)
async def get_home_content(db: AsyncSession = Depends(get_async_session)):
    site_service = SiteContentService(db)
    return await site_service.get_home_content()


@router.put("/home-content", response_model=HomeContentResponse)
async def update_home_content(
    data: HomeContentUpdate,
    db: AsyncSession = Depends(get_async_session),
):
    site_service = SiteContentService(db)
    return await site_service.update_home_content(data)


@router.get("/about-content", response_model=AboutContentResponse)
async def get_about_content(db: AsyncSession = Depends(get_async_session)):
    site_service = SiteContentService(db)
    return await site_service.get_about_content()


@router.put("/about-content", response_model=AboutContentResponse)
async def update_about_content(
    data: AboutContentUpdate,
    db: AsyncSession = Depends(get_async_session),
):
    site_service = SiteContentService(db)
    return await site_service.update_about_content(data)
