from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import PaymentSettings, ShippingCarrier
from app.schemas.payment import PaymentSettingsResponse, PaymentSettingsUpdate
from app.schemas.shipping import (
    ShippingCarrierCreate,
    ShippingCarrierResponse,
    ShippingCarrierUpdate,
)

DEFAULT_SHIPPING_CARRIERS = [
    {
        "name": "Jadlog",
        "region": "Norte",
        "base_freight": 29.9,
        "price_per_kg": 7.8,
        "value_rate": 0.018,
        "estimated_days": 9,
        "active": True,
    },
    {
        "name": "Jadlog",
        "region": "Nordeste",
        "base_freight": 24.9,
        "price_per_kg": 6.4,
        "value_rate": 0.015,
        "estimated_days": 7,
        "active": True,
    },
    {
        "name": "Loggi",
        "region": "Centro-Oeste",
        "base_freight": 22.9,
        "price_per_kg": 5.9,
        "value_rate": 0.013,
        "estimated_days": 6,
        "active": True,
    },
    {
        "name": "Loggi",
        "region": "Sudeste",
        "base_freight": 17.9,
        "price_per_kg": 4.8,
        "value_rate": 0.011,
        "estimated_days": 4,
        "active": True,
    },
    {
        "name": "Correios",
        "region": "Sul",
        "base_freight": 21.9,
        "price_per_kg": 5.6,
        "value_rate": 0.012,
        "estimated_days": 5,
        "active": True,
    },
]

DEFAULT_PAYMENT_SETTINGS = {
    "id": None,
    "provider": "manual",
    "pix_enabled": True,
    "boleto_enabled": False,
    "pix_key": "",
    "recipient_name": "Charme Joias e Acessorios",
    "bank_name": "",
    "instructions": (
        "Pagamento em modo manual. Configure um gateway como Mercado Pago ou Asaas "
        "antes de vender em producao."
    ),
    "updated_at": None,
}


class StoreSettingsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_shipping_carriers(self) -> list[ShippingCarrierResponse]:
        result = await self.db.execute(
            select(ShippingCarrier).order_by(ShippingCarrier.region, ShippingCarrier.name)
        )
        carriers = result.scalars().all()
        if carriers:
            return [ShippingCarrierResponse.model_validate(carrier) for carrier in carriers]
        return [ShippingCarrierResponse(id=index + 1, **carrier) for index, carrier in enumerate(DEFAULT_SHIPPING_CARRIERS)]

    async def get_active_carrier_for_region(self, region: str) -> ShippingCarrierResponse:
        result = await self.db.execute(
            select(ShippingCarrier)
            .where(ShippingCarrier.region == region, ShippingCarrier.active.is_(True))
            .order_by(ShippingCarrier.base_freight.asc())
        )
        carrier = result.scalars().first()
        if carrier:
            return ShippingCarrierResponse.model_validate(carrier)

        fallback = next(
            (carrier_data for carrier_data in DEFAULT_SHIPPING_CARRIERS if carrier_data["region"] == region),
            DEFAULT_SHIPPING_CARRIERS[3],
        )
        return ShippingCarrierResponse(id=0, **fallback)

    async def create_shipping_carrier(self, data: ShippingCarrierCreate) -> ShippingCarrierResponse:
        carrier = ShippingCarrier(**data.model_dump())
        self.db.add(carrier)
        await self.db.commit()
        await self.db.refresh(carrier)
        return ShippingCarrierResponse.model_validate(carrier)

    async def update_shipping_carrier(self, carrier_id: int, data: ShippingCarrierUpdate) -> ShippingCarrierResponse:
        carrier = await self._get_shipping_carrier_model(carrier_id)
        for field, value in data.model_dump().items():
            setattr(carrier, field, value)
        await self.db.commit()
        await self.db.refresh(carrier)
        return ShippingCarrierResponse.model_validate(carrier)

    async def delete_shipping_carrier(self, carrier_id: int) -> None:
        carrier = await self._get_shipping_carrier_model(carrier_id)
        await self.db.delete(carrier)
        await self.db.commit()

    async def get_payment_settings(self) -> PaymentSettingsResponse:
        settings = await self._get_payment_settings_model()
        if not settings:
            return PaymentSettingsResponse(**DEFAULT_PAYMENT_SETTINGS)
        return PaymentSettingsResponse.model_validate(settings)

    async def update_payment_settings(self, data: PaymentSettingsUpdate) -> PaymentSettingsResponse:
        settings = await self._get_payment_settings_model()
        if settings is None:
            settings = PaymentSettings(**data.model_dump())
            self.db.add(settings)
        else:
            for field, value in data.model_dump().items():
                setattr(settings, field, value)
        await self.db.commit()
        await self.db.refresh(settings)
        return PaymentSettingsResponse.model_validate(settings)

    async def _get_shipping_carrier_model(self, carrier_id: int) -> ShippingCarrier:
        result = await self.db.execute(
            select(ShippingCarrier).where(ShippingCarrier.id == carrier_id)
        )
        carrier = result.scalars().first()
        if not carrier:
            from fastapi import HTTPException, status

            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transportadora nao encontrada.")
        return carrier

    async def _get_payment_settings_model(self) -> PaymentSettings | None:
        result = await self.db.execute(
            select(PaymentSettings).order_by(PaymentSettings.id.asc()).limit(1)
        )
        return result.scalars().first()
