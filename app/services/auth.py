from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models import User
from app.schemas.auth import UserCreate, UserLogin, UserProfileUpdate


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _get_user_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def _ensure_unique_profile_data(
        self,
        *,
        email: str | None = None,
        cpf: str | None = None,
        exclude_user_id: int | None = None,
    ) -> None:
        if email:
            result = await self.db.execute(select(User).where(User.email == email))
            existing_user = result.scalars().first()
            if existing_user and existing_user.id != exclude_user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered",
                )

        if cpf:
            result = await self.db.execute(select(User).where(User.cpf == cpf))
            existing_user = result.scalars().first()
            if existing_user and existing_user.id != exclude_user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="CPF already registered",
                )

    async def register_user(self, user_data: UserCreate) -> User:
        await self._ensure_unique_profile_data(email=user_data.email, cpf=user_data.cpf)

        user = User(
            email=user_data.email,
            password_hash=get_password_hash(user_data.password),
            is_admin=settings.is_admin_email(user_data.email),
            full_name=user_data.full_name,
            phone=user_data.phone,
            cpf=user_data.cpf,
            zip_code=user_data.zip_code,
            street=user_data.street,
            number=user_data.number,
            complement=user_data.complement,
            neighborhood=user_data.neighborhood,
            city=user_data.city,
            state=user_data.state,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def authenticate_user(self, user_data: UserLogin) -> User:
        user = await self._get_user_by_email(user_data.email)
        if not user or not verify_password(user_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )
        return user

    async def update_user_profile(self, user_id: int, user_data: UserProfileUpdate) -> User:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        update_data = user_data.model_dump(exclude_unset=True)
        cpf = update_data.get("cpf")
        if cpf:
            await self._ensure_unique_profile_data(cpf=cpf, exclude_user_id=user.id)

        for key, value in update_data.items():
            setattr(user, key, value)

        await self.db.commit()
        await self.db.refresh(user)
        return user

    def create_token(self, user: User) -> str:
        return create_access_token(data={"sub": user.email})
