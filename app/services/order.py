from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select
from sqlalchemy.orm import selectinload
from typing import List
from fastapi import HTTPException, status
from app.models import Order, OrderItem, CartItem, Product, OrderStatus
from app.schemas.order import OrderCreate, OrderUpdate
from app.schemas.payment import PaymentSimulationResponse, PaymentStatus
from app.services.cart import CartService
from app.services.payment import PaymentService
from app.services.shipping import ShippingService
from app.schemas.shipping import ShippingCalculate

ESTIMATED_ITEM_WEIGHT_KG = 0.35


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_order_from_cart(
        self,
        user_id: int,
        order_data: OrderCreate,
    ) -> tuple[Order, PaymentSimulationResponse]:
        cart_service = CartService(self.db)
        cart = await cart_service.get_or_create_cart(user_id)
        
        # Get cart items with products
        result = await self.db.execute(
            select(CartItem, Product)
            .join(Product)
            .where(CartItem.cart_id == cart.id)
            .with_for_update()
        )
        cart_items = result.all()
        if not cart_items:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")
        
        subtotal = sum(item.quantity * product.price for item, product in cart_items)
        estimated_weight = sum(
            item.quantity * ESTIMATED_ITEM_WEIGHT_KG for item, _product in cart_items
        )
        shipping_quote = await ShippingService(self.db).calculate_shipping_for_carrier(
            ShippingCalculate(
                cep=order_data.shipping_cep,
                weight=estimated_weight,
                value=subtotal,
            ),
            order_data.shipping_carrier,
        )
        freight_total = shipping_quote.total_freight
        total = subtotal + freight_total
        
        # Check stock
        for item, product in cart_items:
            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for product {product.name}"
                )

        payment_service = PaymentService(self.db)
        payment_result = await payment_service.simulate_payment(
            amount=total,
            payment_data=order_data.payment,
        )

        order_status = (
            OrderStatus.paid
            if payment_result.status == PaymentStatus.approved
            else OrderStatus.pending
        )
        
        # Create order
        order = Order(
            user_id=user_id,
            total=total,
            freight_total=freight_total,
            shipping_carrier=shipping_quote.carrier,
            status=order_status,
        )
        self.db.add(order)
        await self.db.flush()
        
        # Create order items and update stock
        for item, product in cart_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price_at_time=product.price
            )
            self.db.add(order_item)
            product.stock -= item.quantity
        
        await self.db.execute(delete(CartItem).where(CartItem.cart_id == cart.id))

        try:
            await self.db.commit()
        except Exception:
            await self.db.rollback()
            raise
        await self.db.refresh(order)
        return order, payment_result

    async def get_user_orders(self, user_id: int) -> List[Order]:
        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
        )
        return result.scalars().all()

    async def get_order(self, order_id: int, user_id: int) -> Order:
        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order_id, Order.user_id == user_id)
        )
        order = result.scalars().first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return order

    async def update_order_status(self, order_id: int, order_data: OrderUpdate) -> Order:
        result = await self.db.execute(
            select(Order).options(selectinload(Order.items)).where(Order.id == order_id)
        )
        order = result.scalars().first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        order.status = order_data.status
        await self.db.commit()
        await self.db.refresh(order)
        return order
