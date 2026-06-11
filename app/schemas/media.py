from pydantic import BaseModel


class MediaUploadResponse(BaseModel):
    public_id: str
    secure_url: str
    width: int | None = None
    height: int | None = None
    format: str | None = None
    resource_type: str | None = None
    bytes: int | None = None
    folder: str
