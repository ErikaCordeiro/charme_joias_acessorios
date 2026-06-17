import asyncio
import sys
from pathlib import Path

from sqlalchemy import delete, select

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.database import AsyncSessionLocal
from app.models import CartItem, OrderItem, Product


CLOTHING_TERMS = (
    "camiseta",
    "camisa",
    "regata",
    "short",
    "calca",
    "calça",
    "legging",
    "moletom",
    "top",
    "naruto",
    "dragon ball",
    "jujutsu",
    "attack on titan",
    "anime",
    "ninja",
    "saiyajin",
)


def is_clothing_product(product: Product) -> bool:
    searchable_text = " ".join(
        str(value or "").lower()
        for value in (
            product.name,
            product.description,
            product.category,
            product.image_url,
        )
    )
    return any(term in searchable_text for term in CLOTHING_TERMS)


async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Product))
        products = result.scalars().all()
        clothing_products = [product for product in products if is_clothing_product(product)]
        clothing_product_ids = [product.id for product in clothing_products]

        if clothing_product_ids:
            await session.execute(delete(CartItem).where(CartItem.product_id.in_(clothing_product_ids)))
            await session.execute(delete(OrderItem).where(OrderItem.product_id.in_(clothing_product_ids)))

        for product in clothing_products:
            await session.delete(product)

        await session.commit()

        if clothing_products:
            print("Produtos removidos:")
            for product in clothing_products:
                print(f"- {product.id}: {product.name}")
        else:
            print("Nenhuma camiseta/roupa encontrada para remover.")


if __name__ == "__main__":
    asyncio.run(main())
