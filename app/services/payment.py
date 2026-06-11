import random
import re
import string
from uuid import uuid4

from fastapi import HTTPException, status

from app.schemas.payment import (
    PaymentMethod,
    PaymentRequest,
    PaymentSimulationResponse,
    PaymentStatus,
)

BANK_PROVIDER_NAME = "Banco Charme Joias Sandbox"
DECLINE_TEST_SUFFIX = "0002"
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

        if payment_data.method == PaymentMethod.credit_card:
            return self._simulate_credit_card(amount=amount, payment_data=payment_data)

        if payment_data.method == PaymentMethod.pix:
            return self._simulate_pix()

        return self._simulate_boleto()

    def _simulate_credit_card(
        self,
        *,
        amount: float,
        payment_data: PaymentRequest,
    ) -> PaymentSimulationResponse:
        self._validate_credit_card_data(payment_data)
        card_number = payment_data.card_number or ""

        if card_number.endswith(DECLINE_TEST_SUFFIX):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pagamento recusado pelo banco emissor (sandbox). Use outro cartao para aprovar.",
            )

        installments = payment_data.installments if amount >= 50 else 1
        authorization_code = self._random_code(prefix="AUTH", size=8)

        return PaymentSimulationResponse(
            provider=BANK_PROVIDER_NAME,
            method=PaymentMethod.credit_card,
            status=PaymentStatus.approved,
            transaction_id=self._random_code(prefix="CC", size=12),
            message=f"Pagamento aprovado com autorizacao {authorization_code}.",
            installments=installments,
            masked_card=self._mask_card_number(card_number),
            estimated_settlement_days=0,
        )

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

    def _validate_credit_card_data(self, payment_data: PaymentRequest) -> None:
        if not payment_data.card_holder:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Informe o nome impresso no cartao.",
            )

        card_number = payment_data.card_number or ""
        if len(card_number) < 13 or len(card_number) > 19:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Numero do cartao invalido.",
            )
        if not self._is_luhn_valid(card_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Numero do cartao invalido.",
            )

        expiry = payment_data.card_expiry or ""
        if not re.fullmatch(r"(0[1-9]|1[0-2])/\d{2}", expiry):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Validade do cartao invalida. Use MM/AA.",
            )

        cvv = payment_data.card_cvv or ""
        if len(cvv) not in {3, 4}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CVV invalido.",
            )

    def _is_luhn_valid(self, card_number: str) -> bool:
        digits = [int(char) for char in card_number]
        checksum = 0
        parity = len(digits) % 2

        for index, digit in enumerate(digits):
            current = digit
            if index % 2 == parity:
                current = digit * 2
                if current > 9:
                    current -= 9
            checksum += current

        return checksum % 10 == 0

    def _mask_card_number(self, card_number: str) -> str:
        last_digits = card_number[-4:]
        return f"**** **** **** {last_digits}"

    def _random_code(self, *, prefix: str, size: int) -> str:
        return f"{prefix}-{self._random_alphanumeric(size=size)}"

    def _random_alphanumeric(self, *, size: int) -> str:
        return "".join(random.choices(string.ascii_uppercase + string.digits, k=size))
