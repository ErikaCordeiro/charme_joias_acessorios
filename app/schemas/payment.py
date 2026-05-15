import re
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class PaymentMethod(str, Enum):
    pix = "pix"
    credit_card = "credit_card"
    boleto = "boleto"


class PaymentStatus(str, Enum):
    approved = "approved"
    pending = "pending"
    rejected = "rejected"


class PaymentRequest(BaseModel):
    method: PaymentMethod
    card_holder: Optional[str] = Field(default=None, max_length=120)
    card_number: Optional[str] = None
    card_expiry: Optional[str] = None
    card_cvv: Optional[str] = None
    installments: int = Field(default=1, ge=1, le=6)

    @field_validator("card_holder", mode="before")
    @classmethod
    def normalize_holder(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None

    @field_validator("card_number", mode="before")
    @classmethod
    def normalize_card_number(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        digits = re.sub(r"\D", "", value)
        return digits or None

    @field_validator("card_expiry", mode="before")
    @classmethod
    def normalize_card_expiry(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        digits = re.sub(r"\D", "", value)
        if len(digits) == 4:
            return f"{digits[:2]}/{digits[2:]}"
        cleaned = value.strip()
        return cleaned or None

    @field_validator("card_cvv", mode="before")
    @classmethod
    def normalize_card_cvv(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        digits = re.sub(r"\D", "", value)
        return digits or None


class PaymentSimulationResponse(BaseModel):
    provider: str
    method: PaymentMethod
    status: PaymentStatus
    transaction_id: str
    message: str
    installments: int = 1
    masked_card: Optional[str] = None
    pix_copy_paste: Optional[str] = None
    boleto_code: Optional[str] = None
    estimated_settlement_days: int = 0
