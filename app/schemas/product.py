from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime


class ProductBase(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    description: Optional[str] = None
    price: float = Field(gt=0)
    stock: int = Field(default=0, ge=0)
    category: Optional[str] = Field(default=None, max_length=100)
    image_url: Optional[str] = Field(default=None, max_length=1000)

    @field_validator("image_url")
    @classmethod
    def validate_image_url(cls, value: Optional[str]) -> Optional[str]:
        if not value:
            return value
        if value.startswith(("http://", "https://", "/")):
            return value
        raise ValueError("image_url must be an absolute HTTP(S) URL or a local development path.")


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    stock: Optional[int] = Field(default=None, ge=0)
    category: Optional[str] = Field(default=None, max_length=100)
    image_url: Optional[str] = Field(default=None, max_length=1000)

    @field_validator("image_url")
    @classmethod
    def validate_image_url(cls, value: Optional[str]) -> Optional[str]:
        if not value:
            return value
        if value.startswith(("http://", "https://", "/")):
            return value
        raise ValueError("image_url must be an absolute HTTP(S) URL or a local development path.")


class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProductList(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    size: int
