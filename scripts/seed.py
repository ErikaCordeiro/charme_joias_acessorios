import asyncio
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.database import AsyncSessionLocal
from app.services.catalog_seed import sync_default_products


async def seed_products():
    async with AsyncSessionLocal() as session:
        created_count, updated_count = await sync_default_products(session)
        print(
            "Produtos reais sincronizados com sucesso! "
            f"Criados: {created_count} | Atualizados: {updated_count}"
        )


if __name__ == "__main__":
    asyncio.run(seed_products())
