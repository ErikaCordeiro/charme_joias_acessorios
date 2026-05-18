from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Product
from scripts.product_catalog import PRODUCTS_DATA


async def sync_default_products(session: AsyncSession) -> tuple[int, int]:
    created_count = 0
    updated_count = 0

    for product_data in PRODUCTS_DATA:
        searchable_names = [product_data["name"], *product_data.get("legacy_names", [])]
        result = await session.execute(select(Product).where(Product.name.in_(searchable_names)))
        existing_product = result.scalars().first()

        payload = {
            key: value
            for key, value in product_data.items()
            if key != "legacy_names"
        }

        if existing_product:
            for key, value in payload.items():
                setattr(existing_product, key, value)
            updated_count += 1
        else:
            session.add(Product(**payload))
            created_count += 1

    await session.commit()
    return created_count, updated_count
