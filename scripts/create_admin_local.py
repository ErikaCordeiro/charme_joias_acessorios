import asyncio
import getpass
import os
import re
import sys
from pathlib import Path

from sqlalchemy import select

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.core.security import get_password_hash
from app.core.config import settings
from app.database import AsyncSessionLocal
from app.models import User


CONFIGURED_ADMIN_EMAIL = next(
    (email.strip() for email in settings.ADMIN_EMAILS.split(",") if email.strip()),
    "admin@example.com",
)
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", CONFIGURED_ADMIN_EMAIL).strip().lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")


async def main():
    admin_password = ADMIN_PASSWORD or getpass.getpass("Senha do administrador: ")
    if not 10 <= len(admin_password) <= 72:
        raise ValueError("A senha do administrador deve ter entre 10 e 72 caracteres.")
    if not re.search(r"[A-Za-z]", admin_password) or not re.search(r"\d", admin_password):
        raise ValueError("A senha do administrador deve conter letras e numeros.")

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == ADMIN_EMAIL))
        user = result.scalars().first()

        if user:
            user.password_hash = get_password_hash(admin_password)
            user.is_admin = True
            user.full_name = user.full_name or "Admin Charme"
        else:
            session.add(
                User(
                    email=ADMIN_EMAIL,
                    password_hash=get_password_hash(admin_password),
                    is_admin=True,
                    full_name="Admin Charme",
                )
            )

        await session.commit()
        print(f"Administrador configurado: {ADMIN_EMAIL}")


if __name__ == "__main__":
    asyncio.run(main())
