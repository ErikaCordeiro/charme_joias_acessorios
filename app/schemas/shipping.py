from pydantic import BaseModel, Field


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
