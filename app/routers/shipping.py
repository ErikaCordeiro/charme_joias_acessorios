from fastapi import APIRouter, Depends
from app.schemas.shipping import ShippingCalculate, ShippingResponse
from app.services.shipping import ShippingService

router = APIRouter(prefix="/frete", tags=["frete"])


@router.post("/calcular", response_model=ShippingResponse)
async def calculate_shipping(shipping_data: ShippingCalculate):
    shipping_service = ShippingService()
    result = await shipping_service.calculate_shipping(shipping_data)
    return result