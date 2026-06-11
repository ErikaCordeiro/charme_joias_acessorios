from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.core.security import get_current_admin_user
from app.schemas.media import MediaUploadResponse
from app.services.media import MediaService

router = APIRouter(
    prefix="/media",
    tags=["media"],
    dependencies=[Depends(get_current_admin_user)],
)


@router.post("/upload", response_model=MediaUploadResponse)
async def upload_media(
    file: UploadFile = File(...),
    folder: str | None = Form(default=None),
):
    media_service = MediaService()
    return await media_service.upload_image(file=file, folder=folder)
