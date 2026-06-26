from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.schemas.shipping import ShippingCalculate, ShippingResponse
from app.services.shipping import ShippingService

router = APIRouter(prefix="/frete", tags=["frete"])


@router.post("/calcular", response_model=ShippingResponse)
async def calculate_shipping(
    shipping_data: ShippingCalculate,
    db: AsyncSession = Depends(get_async_session),
):
    shipping_service = ShippingService(db)
    result = await shipping_service.calculate_shipping(shipping_data)
    return result
