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
    {"name": "Correios PAC", "region": "Sul", "base_freight": 18.9, "price_per_kg": 4.6, "value_rate": 0.008, "estimated_days": 5, "active": True},
    {"name": "Correios SEDEX", "region": "Sul", "base_freight": 26.9, "price_per_kg": 5.8, "value_rate": 0.01, "estimated_days": 2, "active": True},
    {"name": "Jadlog Package", "region": "Sul", "base_freight": 21.9, "price_per_kg": 5.6, "value_rate": 0.012, "estimated_days": 4, "active": True},
    {"name": "Loggi", "region": "Sul", "base_freight": 23.9, "price_per_kg": 5.4, "value_rate": 0.011, "estimated_days": 4, "active": True},
    {"name": "Azul Cargo Express", "region": "Sul", "base_freight": 34.9, "price_per_kg": 7.2, "value_rate": 0.014, "estimated_days": 2, "active": True},
    {"name": "Melhor Envio", "region": "Sul", "base_freight": 20.9, "price_per_kg": 5.2, "value_rate": 0.01, "estimated_days": 4, "active": True},
    {"name": "Correios PAC", "region": "Sudeste", "base_freight": 19.9, "price_per_kg": 4.8, "value_rate": 0.009, "estimated_days": 6, "active": True},
    {"name": "Correios SEDEX", "region": "Sudeste", "base_freight": 29.9, "price_per_kg": 6.2, "value_rate": 0.011, "estimated_days": 3, "active": True},
    {"name": "Jadlog Package", "region": "Sudeste", "base_freight": 22.9, "price_per_kg": 5.4, "value_rate": 0.012, "estimated_days": 5, "active": True},
    {"name": "Loggi", "region": "Sudeste", "base_freight": 17.9, "price_per_kg": 4.8, "value_rate": 0.011, "estimated_days": 4, "active": True},
    {"name": "Azul Cargo Express", "region": "Sudeste", "base_freight": 39.9, "price_per_kg": 7.8, "value_rate": 0.015, "estimated_days": 3, "active": True},
    {"name": "Melhor Envio", "region": "Sudeste", "base_freight": 21.9, "price_per_kg": 5.1, "value_rate": 0.01, "estimated_days": 5, "active": True},
    {"name": "Correios PAC", "region": "Centro-Oeste", "base_freight": 24.9, "price_per_kg": 5.9, "value_rate": 0.012, "estimated_days": 8, "active": True},
    {"name": "Correios SEDEX", "region": "Centro-Oeste", "base_freight": 36.9, "price_per_kg": 7.1, "value_rate": 0.014, "estimated_days": 4, "active": True},
    {"name": "Jadlog Package", "region": "Centro-Oeste", "base_freight": 26.9, "price_per_kg": 6.2, "value_rate": 0.014, "estimated_days": 6, "active": True},
    {"name": "Loggi", "region": "Centro-Oeste", "base_freight": 22.9, "price_per_kg": 5.9, "value_rate": 0.013, "estimated_days": 6, "active": True},
    {"name": "Azul Cargo Express", "region": "Centro-Oeste", "base_freight": 44.9, "price_per_kg": 8.4, "value_rate": 0.017, "estimated_days": 4, "active": True},
    {"name": "Melhor Envio", "region": "Centro-Oeste", "base_freight": 25.9, "price_per_kg": 6.0, "value_rate": 0.013, "estimated_days": 7, "active": True},
    {"name": "Correios PAC", "region": "Nordeste", "base_freight": 26.9, "price_per_kg": 6.4, "value_rate": 0.014, "estimated_days": 10, "active": True},
    {"name": "Correios SEDEX", "region": "Nordeste", "base_freight": 42.9, "price_per_kg": 8.2, "value_rate": 0.017, "estimated_days": 5, "active": True},
    {"name": "Jadlog Package", "region": "Nordeste", "base_freight": 24.9, "price_per_kg": 6.4, "value_rate": 0.015, "estimated_days": 7, "active": True},
    {"name": "Azul Cargo Express", "region": "Nordeste", "base_freight": 49.9, "price_per_kg": 9.2, "value_rate": 0.019, "estimated_days": 5, "active": True},
    {"name": "Melhor Envio", "region": "Nordeste", "base_freight": 28.9, "price_per_kg": 6.8, "value_rate": 0.015, "estimated_days": 8, "active": True},
    {"name": "Correios PAC", "region": "Norte", "base_freight": 31.9, "price_per_kg": 7.8, "value_rate": 0.017, "estimated_days": 12, "active": True},
    {"name": "Correios SEDEX", "region": "Norte", "base_freight": 52.9, "price_per_kg": 10.4, "value_rate": 0.021, "estimated_days": 6, "active": True},
    {"name": "Jadlog Package", "region": "Norte", "base_freight": 29.9, "price_per_kg": 7.8, "value_rate": 0.018, "estimated_days": 9, "active": True},
    {"name": "Azul Cargo Express", "region": "Norte", "base_freight": 59.9, "price_per_kg": 11.2, "value_rate": 0.023, "estimated_days": 6, "active": True},
    {"name": "Melhor Envio", "region": "Norte", "base_freight": 34.9, "price_per_kg": 8.2, "value_rate": 0.018, "estimated_days": 10, "active": True},
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
        return [ShippingCarrierResponse(id=-(index + 1), **carrier) for index, carrier in enumerate(DEFAULT_SHIPPING_CARRIERS)]

    async def get_active_carrier_for_region(self, region: str) -> ShippingCarrierResponse:
        carriers = await self.list_active_carriers_for_region(region)
        return carriers[0]

    async def list_active_carriers_for_region(self, region: str) -> list[ShippingCarrierResponse]:
        result = await self.db.execute(
            select(ShippingCarrier)
            .where(ShippingCarrier.region == region, ShippingCarrier.active.is_(True))
            .order_by(ShippingCarrier.base_freight.asc())
        )
        carriers = result.scalars().all()
        if carriers:
            return [ShippingCarrierResponse.model_validate(carrier) for carrier in carriers]

        fallback_carriers = [
            ShippingCarrierResponse(id=index + 1, **carrier_data)
            for index, carrier_data in enumerate(DEFAULT_SHIPPING_CARRIERS)
            if carrier_data["region"] == region and carrier_data["active"]
        ]
        return fallback_carriers or [ShippingCarrierResponse(id=0, **DEFAULT_SHIPPING_CARRIERS[6])]

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
