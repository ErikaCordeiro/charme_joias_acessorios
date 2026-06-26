from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import SiteContent
from app.schemas.site import HomeContentResponse, HomeContentUpdate


HOME_BRAND_KEY = "home_brand"

DEFAULT_HOME_CONTENT = {
    "key": HOME_BRAND_KEY,
    "eyebrow": "Charme Joias",
    "title": "Elegancia em cada detalhe.",
    "body_primary": (
        "A Charme seleciona semijoias e acessorios femininos para mulheres que "
        "valorizam delicadeza, brilho e personalidade no dia a dia."
    ),
    "body_secondary": (
        "Cada peca e escolhida com olhar cuidadoso para presentear, celebrar e "
        "transformar momentos simples em lembrancas especiais."
    ),
    "cta_label": "Conheca a Charme",
    "cta_url": "/about",
    "image_url": "/mockup/about.png",
    "image_alt": "Mulher usando joias delicadas da Charme",
    "updated_at": None,
}


class SiteContentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_home_content(self) -> HomeContentResponse:
        content = await self._get_home_content_model()
        if not content:
            return HomeContentResponse(**DEFAULT_HOME_CONTENT)
        return HomeContentResponse.model_validate(content)

    async def update_home_content(self, data: HomeContentUpdate) -> HomeContentResponse:
        content = await self._get_home_content_model()
        update_data = data.model_dump()

        if content is None:
            content = SiteContent(key=HOME_BRAND_KEY, **update_data)
            self.db.add(content)
        else:
            for field, value in update_data.items():
                setattr(content, field, value)
            content.updated_at = datetime.utcnow()

        await self.db.commit()
        await self.db.refresh(content)
        return HomeContentResponse.model_validate(content)

    async def _get_home_content_model(self) -> SiteContent | None:
        result = await self.db.execute(
            select(SiteContent).where(SiteContent.key == HOME_BRAND_KEY)
        )
        return result.scalars().first()
