from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.schemas.site import HomeContentResponse
from app.services.site_content import SiteContentService

router = APIRouter(prefix="/site", tags=["site"])


@router.get("/home-content", response_model=HomeContentResponse)
async def get_home_content(db: AsyncSession = Depends(get_async_session)):
    site_service = SiteContentService(db)
    return await site_service.get_home_content()
