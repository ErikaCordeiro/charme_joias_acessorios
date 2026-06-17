import asyncio
import sys
from pathlib import Path

from sqlalchemy import select

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.core.security import get_password_hash
from app.database import AsyncSessionLocal
from app.models import User


ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "Admin123"


async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == ADMIN_EMAIL))
        user = result.scalars().first()

        if user:
            user.password_hash = get_password_hash(ADMIN_PASSWORD)
            user.is_admin = True
            user.full_name = user.full_name or "Admin Charme"
        else:
            session.add(
                User(
                    email=ADMIN_EMAIL,
                    password_hash=get_password_hash(ADMIN_PASSWORD),
                    is_admin=True,
                    full_name="Admin Charme",
                )
            )

        await session.commit()
        print(f"{ADMIN_EMAIL} / {ADMIN_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(main())
