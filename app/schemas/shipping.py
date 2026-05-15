from pydantic import BaseModel


class ShippingCalculate(BaseModel):
    cep: str  # e.g., "01000-000"
    weight: float  # in kg
    value: float  # total value


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
