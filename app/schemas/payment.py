from enum import Enum
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PaymentMethod(str, Enum):
    pix = "pix"
    boleto = "boleto"


class PaymentStatus(str, Enum):
    approved = "approved"
    pending = "pending"
    rejected = "rejected"


class PaymentRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    method: PaymentMethod


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


class PaymentSettingsUpdate(BaseModel):
    provider: str = Field(default="manual", max_length=80)
    pix_enabled: bool = True
    boleto_enabled: bool = False
    pix_key: Optional[str] = Field(default=None, max_length=255)
    recipient_name: Optional[str] = Field(default=None, max_length=255)
    bank_name: Optional[str] = Field(default=None, max_length=120)
    instructions: Optional[str] = Field(default=None, max_length=1200)

    @field_validator("provider", "pix_key", "recipient_name", "bank_name", "instructions", mode="before")
    @classmethod
    def strip_optional_text(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None


class PaymentSettingsResponse(PaymentSettingsUpdate):
    id: Optional[int] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
