from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict


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
