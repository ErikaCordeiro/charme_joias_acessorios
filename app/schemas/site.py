from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


def _strip_optional(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    cleaned = value.strip()
    return cleaned or None


class SiteContentUpdate(BaseModel):
    eyebrow: Optional[str] = Field(default=None, max_length=120)
    title: str = Field(min_length=3, max_length=255)
    body_primary: Optional[str] = Field(default=None, max_length=800)
    body_secondary: Optional[str] = Field(default=None, max_length=800)
    cta_label: Optional[str] = Field(default=None, max_length=120)
    cta_url: Optional[str] = Field(default=None, max_length=255)
    image_url: Optional[str] = Field(default=None, max_length=1000)
    image_alt: Optional[str] = Field(default=None, max_length=255)

    @field_validator(
        "eyebrow",
        "body_primary",
        "body_secondary",
        "cta_label",
        "cta_url",
        "image_url",
        "image_alt",
        mode="before",
    )
    @classmethod
    def strip_optional_text(cls, value: Optional[str]) -> Optional[str]:
        return _strip_optional(value)

    @field_validator("title", mode="before")
    @classmethod
    def strip_title(cls, value: str) -> str:
        return value.strip()


class SiteContentResponse(SiteContentUpdate):
    key: str
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


HomeContentUpdate = SiteContentUpdate
HomeContentResponse = SiteContentResponse
AboutContentUpdate = SiteContentUpdate
AboutContentResponse = SiteContentResponse
