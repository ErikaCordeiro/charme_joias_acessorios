from .auth import router as auth_router
from .product import router as product_router
from .cart import router as cart_router
from .shipping import router as shipping_router
from .order import router as order_router
from .admin import router as admin_router

__all__ = ["auth_router", "product_router", "cart_router", "shipping_router", "order_router", "admin_router"]
