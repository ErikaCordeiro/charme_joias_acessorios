from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import SiteContent
from app.schemas.site import SiteContentResponse, SiteContentUpdate


HOME_BRAND_KEY = "home_brand"
ABOUT_PAGE_KEY = "about_page"

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

DEFAULT_ABOUT_CONTENT = {
    "key": ABOUT_PAGE_KEY,
    "eyebrow": "Sobre a marca",
    "title": "Charme Joias e Acessorios",
    "body_primary": (
        "A Charme nasceu para valorizar a beleza de cada mulher atraves de pecas "
        "delicadas, modernas e cheias de personalidade."
    ),
    "body_secondary": (
        "Nosso atendimento combina curadoria feminina, cuidado em cada detalhe e "
        "semijoias selecionadas para momentos especiais e para o dia a dia."
    ),
    "cta_label": "Ver produtos",
    "cta_url": "/products",
    "image_url": "/products/charme/conjunto-coracao-dourado.jpeg",
    "image_alt": "Selecao de joias douradas Charme",
    "updated_at": None,
}

DEFAULT_CONTENT_BY_KEY = {
    HOME_BRAND_KEY: DEFAULT_HOME_CONTENT,
    ABOUT_PAGE_KEY: DEFAULT_ABOUT_CONTENT,
}


class SiteContentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_home_content(self) -> SiteContentResponse:
        return await self.get_content(HOME_BRAND_KEY)

    async def update_home_content(self, data: SiteContentUpdate) -> SiteContentResponse:
        return await self.update_content(HOME_BRAND_KEY, data)

    async def get_about_content(self) -> SiteContentResponse:
        return await self.get_content(ABOUT_PAGE_KEY)

    async def update_about_content(self, data: SiteContentUpdate) -> SiteContentResponse:
        return await self.update_content(ABOUT_PAGE_KEY, data)

    async def get_content(self, key: str) -> SiteContentResponse:
        content = await self._get_content_model(key)
        if not content:
            return SiteContentResponse(**DEFAULT_CONTENT_BY_KEY[key])
        return SiteContentResponse.model_validate(content)

    async def update_content(self, key: str, data: SiteContentUpdate) -> SiteContentResponse:
        content = await self._get_content_model(key)
        update_data = data.model_dump()

        if content is None:
            content = SiteContent(key=key, **update_data)
            self.db.add(content)
        else:
            for field, value in update_data.items():
                setattr(content, field, value)
            content.updated_at = datetime.utcnow()

        await self.db.commit()
        await self.db.refresh(content)
        return SiteContentResponse.model_validate(content)

    async def _get_content_model(self, key: str) -> SiteContent | None:
        result = await self.db.execute(
            select(SiteContent).where(SiteContent.key == key)
        )
        return result.scalars().first()
