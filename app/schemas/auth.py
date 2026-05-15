import re
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


def _strip_string(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None

    cleaned = value.strip()
    return cleaned or None


def _only_digits(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None

    return re.sub(r"\D", "", value)


class UserProfileCreate(BaseModel):
    full_name: str = Field(min_length=3, max_length=255)
    phone: str
    cpf: str
    zip_code: str
    street: str = Field(min_length=3, max_length=255)
    number: str = Field(min_length=1, max_length=30)
    complement: Optional[str] = Field(default=None, max_length=255)
    neighborhood: str = Field(min_length=2, max_length=255)
    city: str = Field(min_length=2, max_length=255)
    state: str = Field(min_length=2, max_length=2)

    @field_validator(
        "full_name",
        "street",
        "number",
        "complement",
        "neighborhood",
        "city",
        "state",
        mode="before",
    )
    @classmethod
    def strip_text_fields(cls, value: Optional[str]) -> Optional[str]:
        return _strip_string(value)

    @field_validator("phone", mode="before")
    @classmethod
    def normalize_phone(cls, value: Optional[str]) -> Optional[str]:
        digits = _only_digits(value)
        if digits is None or len(digits) not in {10, 11}:
            raise ValueError("Phone must have 10 or 11 digits")
        return digits

    @field_validator("cpf", mode="before")
    @classmethod
    def normalize_cpf(cls, value: Optional[str]) -> Optional[str]:
        digits = _only_digits(value)
        if digits is None or len(digits) != 11:
            raise ValueError("CPF must have 11 digits")
        return digits

    @field_validator("zip_code", mode="before")
    @classmethod
    def normalize_zip_code(cls, value: Optional[str]) -> Optional[str]:
        digits = _only_digits(value)
        if digits is None or len(digits) != 8:
            raise ValueError("ZIP code must have 8 digits")
        return digits

    @field_validator("state")
    @classmethod
    def normalize_state(cls, value: str) -> str:
        return value.upper()


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=3, max_length=255)
    phone: Optional[str] = None
    cpf: Optional[str] = None
    zip_code: Optional[str] = None
    street: Optional[str] = Field(default=None, min_length=3, max_length=255)
    number: Optional[str] = Field(default=None, min_length=1, max_length=30)
    complement: Optional[str] = Field(default=None, max_length=255)
    neighborhood: Optional[str] = Field(default=None, min_length=2, max_length=255)
    city: Optional[str] = Field(default=None, min_length=2, max_length=255)
    state: Optional[str] = Field(default=None, min_length=2, max_length=2)

    @field_validator(
        "full_name",
        "street",
        "number",
        "complement",
        "neighborhood",
        "city",
        "state",
        mode="before",
    )
    @classmethod
    def strip_optional_text_fields(cls, value: Optional[str]) -> Optional[str]:
        return _strip_string(value)

    @field_validator("phone", mode="before")
    @classmethod
    def normalize_optional_phone(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None

        digits = _only_digits(value)
        if len(digits) not in {10, 11}:
            raise ValueError("Phone must have 10 or 11 digits")
        return digits

    @field_validator("cpf", mode="before")
    @classmethod
    def normalize_optional_cpf(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None

        digits = _only_digits(value)
        if len(digits) != 11:
            raise ValueError("CPF must have 11 digits")
        return digits

    @field_validator("zip_code", mode="before")
    @classmethod
    def normalize_optional_zip_code(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None

        digits = _only_digits(value)
        if len(digits) != 8:
            raise ValueError("ZIP code must have 8 digits")
        return digits

    @field_validator("state")
    @classmethod
    def normalize_optional_state(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        return value.upper()


class UserCreate(UserProfileCreate):
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool = False
    full_name: Optional[str] = None
    phone: Optional[str] = None
    cpf: Optional[str] = None
    zip_code: Optional[str] = None
    street: Optional[str] = None
    number: Optional[str] = None
    complement: Optional[str] = None
    neighborhood: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None

    class Config:
        from_attributes = True
