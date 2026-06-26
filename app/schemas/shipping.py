from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class ShippingCalculate(BaseModel):
    cep: str = Field(min_length=8, max_length=9, pattern=r"^\d{5}-?\d{3}$")
    weight: float = Field(gt=0, le=100)
    value: float = Field(ge=0, le=1_000_000)


class ShippingResponse(BaseModel):
    cep: str
    uf: str
    region: str
    carrier: str
    estimated_days: int
    base_freight: float
    weight_cost: float
    value_cost: float
    total_freight: float


class ShippingCarrierBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    region: str = Field(min_length=2, max_length=40)
    base_freight: float = Field(ge=0, le=10000)
    price_per_kg: float = Field(ge=0, le=10000)
    value_rate: float = Field(ge=0, le=1)
    estimated_days: int = Field(ge=1, le=60)
    active: bool = True

    @field_validator("name", "region", mode="before")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()


class ShippingCarrierCreate(ShippingCarrierBase):
    pass


class ShippingCarrierUpdate(ShippingCarrierBase):
    pass


class ShippingCarrierResponse(ShippingCarrierBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
