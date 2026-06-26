import random
import string

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.payment import (
    PaymentMethod,
    PaymentRequest,
    PaymentSimulationResponse,
    PaymentStatus,
)
from app.services.store_settings import StoreSettingsService

BANK_PROVIDER_NAME = "Banco Charme Joias Sandbox"
PIX_COPY_AND_PASTE_PREFIX = "00020101021126580014BR.GOV.BCB.PIX0136charmejoias@sandbox.com5204000053039865406"


class PaymentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def simulate_payment(
        self,
        *,
        amount: float,
        payment_data: PaymentRequest,
    ) -> PaymentSimulationResponse:
        if amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Valor do pedido invalido para pagamento.",
            )

        settings = await StoreSettingsService(self.db).get_payment_settings()

        if payment_data.method == PaymentMethod.pix:
            if not settings.pix_enabled:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Pix indisponivel no momento.",
                )
            return self._simulate_pix(settings.provider, settings.pix_key)

        if not settings.boleto_enabled:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Boleto indisponivel no momento.",
            )
        return self._simulate_boleto(settings.provider)

    def _simulate_pix(self, provider: str, pix_key: str | None) -> PaymentSimulationResponse:
        pix_payload_suffix = self._random_alphanumeric(size=14)
        pix_reference = pix_key or "charmejoias@sandbox.com"
        pix_copy_paste = f"{PIX_COPY_AND_PASTE_PREFIX}{pix_payload_suffix}6304ABCD"

        return PaymentSimulationResponse(
            provider=provider or BANK_PROVIDER_NAME,
            method=PaymentMethod.pix,
            status=PaymentStatus.approved,
            transaction_id=self._random_code(prefix="PIX", size=12),
            message=f"Pagamento Pix registrado em modo de testes para a chave {pix_reference}.",
            pix_copy_paste=pix_copy_paste,
            estimated_settlement_days=0,
        )

    def _simulate_boleto(self, provider: str) -> PaymentSimulationResponse:
        boleto_number = "".join(random.choices(string.digits, k=48))
        return PaymentSimulationResponse(
            provider=provider or BANK_PROVIDER_NAME,
            method=PaymentMethod.boleto,
            status=PaymentStatus.pending,
            transaction_id=self._random_code(prefix="BOL", size=12),
            message="Boleto gerado em ambiente de testes. A compensacao ocorre em ate 2 dias uteis.",
            boleto_code=boleto_number,
            estimated_settlement_days=2,
        )

    def _random_code(self, *, prefix: str, size: int) -> str:
        return f"{prefix}-{self._random_alphanumeric(size=size)}"

    def _random_alphanumeric(self, *, size: int) -> str:
        return "".join(random.choices(string.ascii_uppercase + string.digits, k=size))
