import asyncio
import sys
from pathlib import Path

from sqlalchemy import select

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.database import AsyncSessionLocal
from app.models import Product
from product_catalog import PRODUCTS_DATA


async def seed_products():
    async with AsyncSessionLocal() as session:
        for product_data in PRODUCTS_DATA:
            searchable_names = [product_data["name"], *product_data.get("legacy_names", [])]
            result = await session.execute(select(Product).where(Product.name.in_(searchable_names)))
            product = result.scalars().first()
            product_fields = {
                key: value
                for key, value in product_data.items()
                if key != "legacy_names"
            }

            if product:
                for key, value in product_fields.items():
                    setattr(product, key, value)
            else:
                session.add(Product(**product_fields))

        await session.commit()
        print("Produtos reais sincronizados com sucesso!")


if __name__ == "__main__":
    asyncio.run(seed_products())
