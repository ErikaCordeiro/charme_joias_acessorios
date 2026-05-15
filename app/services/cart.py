from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from fastapi import HTTPException, status
from app.models import Cart, CartItem, Product
from app.schemas.cart import (
    CartItemCreate,
    CartItemResponse,
    CartItemUpdate,
    CartProductPreview,
    CartResponse,
)


class CartService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_cart(self, user_id: int) -> Cart:
        result = await self.db.execute(select(Cart).where(Cart.user_id == user_id))
        cart = result.scalars().first()
        if not cart:
            cart = Cart(user_id=user_id)
            self.db.add(cart)
            await self.db.commit()
            await self.db.refresh(cart)
        return cart

    async def add_item_to_cart(self, user_id: int, item_data: CartItemCreate) -> Cart:
        cart = await self.get_or_create_cart(user_id)
        # Check if product exists
        result = await self.db.execute(select(Product).where(Product.id == item_data.product_id))
        product = result.scalars().first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        if product.stock < item_data.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock")

        # Check if item already in cart
        result = await self.db.execute(
            select(CartItem).where(CartItem.cart_id == cart.id, CartItem.product_id == item_data.product_id)
        )
        existing_item = result.scalars().first()
        if existing_item:
            existing_item.quantity += item_data.quantity
        else:
            cart_item = CartItem(cart_id=cart.id, product_id=item_data.product_id, quantity=item_data.quantity)
            self.db.add(cart_item)
        await self.db.commit()
        await self.db.refresh(cart)
        return cart

    async def update_cart_item(self, user_id: int, item_id: int, item_data: CartItemUpdate) -> Cart:
        cart = await self.get_or_create_cart(user_id)
        result = await self.db.execute(
            select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id)
        )
        item = result.scalars().first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
        # Check stock
        result = await self.db.execute(select(Product).where(Product.id == item.product_id))
        product = result.scalars().first()
        if product.stock < item_data.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock")
        item.quantity = item_data.quantity
        await self.db.commit()
        await self.db.refresh(cart)
        return cart

    async def remove_cart_item(self, user_id: int, item_id: int) -> Cart:
        cart = await self.get_or_create_cart(user_id)
        result = await self.db.execute(
            select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id)
        )
        item = result.scalars().first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
        await self.db.delete(item)
        await self.db.commit()
        await self.db.refresh(cart)
        return cart

    async def get_cart(self, user_id: int) -> CartResponse:
        cart = await self.get_or_create_cart(user_id)
        # Load cart items with product data for display and subtotal
        result = await self.db.execute(
            select(CartItem, Product)
            .join(Product, Product.id == CartItem.product_id)
            .where(CartItem.cart_id == cart.id)
        )
        items_with_product = result.all()

        cart_items = []
        subtotal = 0.0

        for item, product in items_with_product:
            line_total = item.quantity * product.price
            subtotal += line_total

            cart_items.append(
                CartItemResponse(
                    id=item.id,
                    cart_id=item.cart_id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    unit_price=product.price,
                    line_total=line_total,
                    product=CartProductPreview(
                        id=product.id,
                        name=product.name,
                        price=product.price,
                        stock=product.stock,
                        category=product.category,
                        image_url=product.image_url,
                    ),
                )
            )

        return CartResponse(
            id=cart.id,
            user_id=cart.user_id,
            created_at=cart.created_at,
            items=cart_items,
            subtotal=subtotal,
        )

    async def clear_cart(self, user_id: int) -> None:
        cart = await self.get_or_create_cart(user_id)
        await self.db.execute(delete(CartItem).where(CartItem.cart_id == cart.id))
        await self.db.commit()
