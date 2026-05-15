from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_async_session
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse
from app.services.cart import CartService
from app.core.security import get_current_user
from app.models import User

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("/", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    cart_service = CartService(db)
    cart = await cart_service.get_cart(current_user.id)
    return cart


@router.post("/items", response_model=CartResponse)
async def add_item_to_cart(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    cart_service = CartService(db)
    cart = await cart_service.add_item_to_cart(current_user.id, item_data)
    return await cart_service.get_cart(current_user.id)


@router.put("/items/{item_id}", response_model=CartResponse)
async def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    cart_service = CartService(db)
    cart = await cart_service.update_cart_item(current_user.id, item_id, item_data)
    return await cart_service.get_cart(current_user.id)


@router.delete("/items/{item_id}", response_model=CartResponse)
async def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    cart_service = CartService(db)
    cart = await cart_service.remove_cart_item(current_user.id, item_id)
    return await cart_service.get_cart(current_user.id)


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    cart_service = CartService(db)
    await cart_service.clear_cart(current_user.id)