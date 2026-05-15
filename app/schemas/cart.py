from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class CartItemCreate(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class CartProductPreview(BaseModel):
    id: int
    name: str
    price: float
    stock: int
    category: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class CartItemResponse(CartItemBase):
    id: int
    cart_id: int
    unit_price: float
    line_total: float
    product: CartProductPreview

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    items: List[CartItemResponse]
    subtotal: float

    class Config:
        from_attributes = True
