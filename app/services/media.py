from typing import Any

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_BYTES = 8 * 1024 * 1024


class MediaService:
    def __init__(self) -> None:
        if settings.cloudinary_configured():
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
                secure=True,
            )

    async def upload_image(self, file: UploadFile, folder: str | None = None) -> dict[str, Any]:
        if not settings.cloudinary_configured():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Cloudinary is not configured.",
            )

        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image type. Use JPEG, PNG, WebP or GIF.",
            )

        content = await file.read()
        if len(content) > MAX_IMAGE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image is too large. Maximum size is 8MB.",
            )

        target_folder = folder or settings.CLOUDINARY_DEFAULT_FOLDER
        if not target_folder.startswith("charme/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cloudinary folder must start with charme/.",
            )

        result = cloudinary.uploader.upload(
            content,
            folder=target_folder,
            resource_type="image",
            overwrite=False,
            use_filename=True,
            unique_filename=True,
            transformation=[
                {"quality": "auto", "fetch_format": "auto"},
            ],
        )

        return {
            "public_id": result.get("public_id"),
            "secure_url": result.get("secure_url"),
            "width": result.get("width"),
            "height": result.get("height"),
            "format": result.get("format"),
            "resource_type": result.get("resource_type"),
            "bytes": result.get("bytes"),
            "folder": target_folder,
        }
