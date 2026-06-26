from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, or_, select
from typing import Optional, List
from fastapi import HTTPException, status
from app.models import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse


class ProductService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_product(self, product_data: ProductCreate) -> Product:
        product = Product(**product_data.model_dump())
        self.db.add(product)
        await self.db.commit()
        await self.db.refresh(product)
        return product

    async def get_product(self, product_id: int) -> Product:
        result = await self.db.execute(select(Product).where(Product.id == product_id))
        product = result.scalars().first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return product

    async def list_products(
        self,
        skip: int = 0,
        limit: int = 10,
        search: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None
    ) -> List[Product]:
        query = select(Product)
        if search:
            query = query.where(or_(Product.name.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%")))
        if category:
            query = query.where(func.lower(Product.category) == category.lower())
        if min_price is not None:
            query = query.where(Product.price >= min_price)
        if max_price is not None:
            query = query.where(Product.price <= max_price)
        query = query.order_by(Product.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def count_products(
        self,
        search: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None
    ) -> int:
        query = select(func.count(Product.id))
        if search:
            query = query.where(or_(Product.name.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%")))
        if category:
            query = query.where(func.lower(Product.category) == category.lower())
        if min_price is not None:
            query = query.where(Product.price >= min_price)
        if max_price is not None:
            query = query.where(Product.price <= max_price)
        result = await self.db.execute(query)
        return int(result.scalar_one())

    async def update_product(self, product_id: int, product_data: ProductUpdate) -> Product:
        product = await self.get_product(product_id)
        update_data = product_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(product, key, value)
        await self.db.commit()
        await self.db.refresh(product)
        return product

    async def delete_product(self, product_id: int) -> None:
        product = await self.get_product(product_id)
        await self.db.delete(product)
        await self.db.commit()
