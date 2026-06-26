from collections import defaultdict
from typing import List

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Cart, CartItem, Order, OrderItem, OrderStatus, Product, User
from app.schemas.admin import (
    AdminAbandonedCartResponse,
    AdminCustomerResponse,
    AdminDashboardMetrics,
    AdminDashboardResponse,
    AdminOrderResponse,
)


class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard(self) -> AdminDashboardResponse:
        metrics = await self.get_dashboard_metrics()
        recent_orders = await self.list_orders(limit=10)
        abandoned_carts = await self.list_abandoned_carts(limit=10)

        return AdminDashboardResponse(
            metrics=metrics,
            recent_orders=recent_orders,
            abandoned_carts=abandoned_carts,
        )

    async def get_dashboard_metrics(self) -> AdminDashboardMetrics:
        total_orders = await self._scalar_int(select(func.count(Order.id)))
        paid_orders = await self._scalar_int(
            select(func.count(Order.id)).where(Order.status == OrderStatus.paid)
        )
        pending_orders = await self._scalar_int(
            select(func.count(Order.id)).where(Order.status == OrderStatus.pending)
        )
        total_customers = await self._scalar_int(
            select(func.count(User.id)).where(User.is_admin.is_(False))
        )
        total_products = await self._scalar_int(select(func.count(Product.id)))

        total_sales_amount = await self._scalar_float(select(func.sum(Order.total)))
        paid_sales_amount = await self._scalar_float(
            select(func.sum(Order.total)).where(Order.status == OrderStatus.paid)
        )

        abandoned_stmt = (
            select(
                func.count(func.distinct(Cart.id)),
                func.sum(CartItem.quantity),
                func.sum(CartItem.quantity * Product.price),
            )
            .select_from(Cart)
            .join(CartItem, CartItem.cart_id == Cart.id)
            .join(Product, Product.id == CartItem.product_id)
        )
        abandoned_row = (await self.db.execute(abandoned_stmt)).one()

        return AdminDashboardMetrics(
            total_orders=total_orders,
            paid_orders=paid_orders,
            pending_orders=pending_orders,
            total_customers=total_customers,
            total_products=total_products,
            total_sales_amount=round(total_sales_amount, 2),
            paid_sales_amount=round(paid_sales_amount, 2),
            abandoned_carts=int(abandoned_row[0] or 0),
            abandoned_items=int(abandoned_row[1] or 0),
            abandoned_value=round(float(abandoned_row[2] or 0), 2),
        )

    async def list_customers(self, limit: int = 200) -> List[AdminCustomerResponse]:
        stmt = (
            select(User)
            .order_by(User.created_at.desc())
            .limit(limit)
        )
        users = (await self.db.execute(stmt)).scalars().all()

        return [
            AdminCustomerResponse(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                phone=user.phone,
                city=user.city,
                state=user.state,
                is_admin=user.is_admin,
                created_at=user.created_at,
            )
            for user in users
        ]

    async def list_orders(self, limit: int = 200) -> List[AdminOrderResponse]:
        stmt = (
            select(
                Order.id,
                Order.user_id,
                User.email,
                Order.total,
                Order.shipping_carrier,
                Order.status,
                Order.created_at,
                func.count(OrderItem.id).label("items_count"),
            )
            .join(User, User.id == Order.user_id)
            .outerjoin(OrderItem, OrderItem.order_id == Order.id)
            .group_by(Order.id, User.email)
            .order_by(Order.created_at.desc())
            .limit(limit)
        )
        rows = (await self.db.execute(stmt)).all()

        return [
            AdminOrderResponse(
                id=row.id,
                user_id=row.user_id,
                user_email=row.email,
                total=float(row.total),
                shipping_carrier=row.shipping_carrier,
                status=row.status,
                items_count=int(row.items_count or 0),
                created_at=row.created_at,
            )
            for row in rows
        ]

    async def list_abandoned_carts(self, limit: int = 200) -> List[AdminAbandonedCartResponse]:
        stmt = (
            select(
                Cart.id,
                Cart.user_id,
                Cart.created_at,
                User.email,
                User.full_name,
                CartItem.quantity,
                Product.price,
            )
            .join(User, User.id == Cart.user_id)
            .join(CartItem, CartItem.cart_id == Cart.id)
            .join(Product, Product.id == CartItem.product_id)
            .order_by(Cart.created_at.desc())
        )
        rows = (await self.db.execute(stmt)).all()

        grouped: dict[int, dict] = defaultdict(
            lambda: {
                "items_count": 0,
                "estimated_total": 0.0,
            }
        )

        for row in rows:
            cart_bucket = grouped[row.id]
            cart_bucket["cart_id"] = row.id
            cart_bucket["user_id"] = row.user_id
            cart_bucket["user_email"] = row.email
            cart_bucket["user_name"] = row.full_name
            cart_bucket["created_at"] = row.created_at
            cart_bucket["items_count"] += int(row.quantity or 0)
            cart_bucket["estimated_total"] += float((row.quantity or 0) * (row.price or 0))

        carts = [
            AdminAbandonedCartResponse(
                cart_id=data["cart_id"],
                user_id=data["user_id"],
                user_email=data["user_email"],
                user_name=data["user_name"],
                items_count=data["items_count"],
                estimated_total=round(data["estimated_total"], 2),
                created_at=data["created_at"],
            )
            for data in grouped.values()
        ]

        carts.sort(key=lambda item: item.created_at, reverse=True)
        return carts[:limit]

    async def _scalar_int(self, stmt) -> int:
        value = (await self.db.execute(stmt)).scalar()
        return int(value or 0)

    async def _scalar_float(self, stmt) -> float:
        value = (await self.db.execute(stmt)).scalar()
        return float(value or 0.0)
