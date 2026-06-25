import random
import string

from fastapi import HTTPException, status

from app.schemas.payment import (
    PaymentMethod,
    PaymentRequest,
    PaymentSimulationResponse,
    PaymentStatus,
)

BANK_PROVIDER_NAME = "Banco Charme Joias Sandbox"
PIX_COPY_AND_PASTE_PREFIX = "00020101021126580014BR.GOV.BCB.PIX0136charmejoias@sandbox.com5204000053039865406"


class PaymentService:
    def simulate_payment(
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

        if payment_data.method == PaymentMethod.pix:
            return self._simulate_pix()

        return self._simulate_boleto()

    def _simulate_pix(self) -> PaymentSimulationResponse:
        pix_payload_suffix = self._random_alphanumeric(size=14)
        pix_copy_paste = f"{PIX_COPY_AND_PASTE_PREFIX}{pix_payload_suffix}6304ABCD"

        return PaymentSimulationResponse(
            provider=BANK_PROVIDER_NAME,
            method=PaymentMethod.pix,
            status=PaymentStatus.approved,
            transaction_id=self._random_code(prefix="PIX", size=12),
            message="Pagamento PIX aprovado instantaneamente no ambiente de testes.",
            pix_copy_paste=pix_copy_paste,
            estimated_settlement_days=0,
        )

    def _simulate_boleto(self) -> PaymentSimulationResponse:
        boleto_number = "".join(random.choices(string.digits, k=48))
        return PaymentSimulationResponse(
            provider=BANK_PROVIDER_NAME,
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
