from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.database import get_async_session
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductList
from app.services.product import ProductService
from app.core.security import get_current_admin_user
from app.models import User

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=ProductResponse, dependencies=[Depends(get_current_admin_user)])
async def create_product(
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_async_session)
):
    product_service = ProductService(db)
    product = await product_service.create_product(product_data)
    return product


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_async_session)
):
    product_service = ProductService(db)
    product = await product_service.get_product(product_id)
    return product


@router.get("/", response_model=ProductList)
async def list_products(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    db: AsyncSession = Depends(get_async_session)
):
    product_service = ProductService(db)
    skip = (page - 1) * size
    products = await product_service.list_products(
        skip=skip, limit=size, search=search, category=category,
        min_price=min_price, max_price=max_price
    )
    total = await product_service.count_products(
        search=search, category=category, min_price=min_price, max_price=max_price
    )
    return ProductList(products=products, total=total, page=page, size=size)


@router.put("/{product_id}", response_model=ProductResponse, dependencies=[Depends(get_current_admin_user)])
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: AsyncSession = Depends(get_async_session)
):
    product_service = ProductService(db)
    product = await product_service.update_product(product_id, product_data)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin_user)])
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_async_session)
):
    product_service = ProductService(db)
    await product_service.delete_product(product_id)
