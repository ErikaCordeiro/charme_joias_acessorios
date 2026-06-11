import os
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from dotenv import dotenv_values
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_values = dotenv_values(BASE_DIR / ".env")


def get_setting(key: str, default=None):
    env_value = os.getenv(key)
    if env_value is not None:
        return env_value
    return env_values.get(key, default)


def normalize_database_url(database_url: str | None) -> str:
    if not database_url:
        return ""
    normalized = database_url.strip()
    if normalized.startswith("postgres://"):
        normalized = normalized.replace("postgres://", "postgresql://", 1)

    if normalized.startswith("postgresql://"):
        normalized = normalized.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif normalized.startswith("postgresql+psycopg2://"):
        normalized = normalized.replace("postgresql+psycopg2://", "postgresql+asyncpg://", 1)

    parsed = urlparse(normalized)
    if parsed.scheme != "postgresql+asyncpg":
        return normalized

    query_items = parse_qsl(parsed.query, keep_blank_values=True)
    sslmode_value = ""
    filtered_items = []

    for key, value in query_items:
        if key.lower() == "sslmode":
            sslmode_value = value
            continue
        filtered_items.append((key, value))

    has_ssl_key = any(key == "ssl" for key, _ in filtered_items)
    if sslmode_value and not has_ssl_key:
        ssl_value = "require" if sslmode_value in {"require", "verify-ca", "verify-full"} else sslmode_value
        filtered_items.append(("ssl", ssl_value))

    rebuilt_query = urlencode(filtered_items)
    return urlunparse(parsed._replace(query=rebuilt_query))


class Settings(BaseModel):
    APP_NAME: str = Field("Charme Joias Acessorios")
    API_V1_PREFIX: str = Field("/api/v1")
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = Field("HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60)
    SENTRY_DSN: str = Field("")
    ENVIRONMENT: str = Field("development")
    ADMIN_EMAILS: str = Field("")
    CORS_ORIGINS: str = Field("")
    SEED_DEFAULT_PRODUCTS: bool = Field(True)
    FRONTEND_URL: str = Field("")
    CLOUDINARY_CLOUD_NAME: str = Field("")
    CLOUDINARY_API_KEY: str = Field("")
    CLOUDINARY_API_SECRET: str = Field("")
    CLOUDINARY_DEFAULT_FOLDER: str = Field("charme/produtos")

    def is_admin_email(self, email: str) -> bool:
        if not email:
            return False
        normalized = email.strip().lower()
        admin_emails = [
            item.strip().lower()
            for item in self.ADMIN_EMAILS.split(",")
            if item.strip()
        ]
        return normalized in admin_emails

    def get_cors_origins(self) -> list[str]:
        default_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
        if not self.CORS_ORIGINS:
            if self.FRONTEND_URL:
                return [*default_origins, self.FRONTEND_URL]
            return default_origins

        origins = [
            item.strip()
            for item in self.CORS_ORIGINS.split(",")
            if item.strip()
        ]
        if self.FRONTEND_URL and self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
        return origins or default_origins

    def cloudinary_configured(self) -> bool:
        return all([
            self.CLOUDINARY_CLOUD_NAME,
            self.CLOUDINARY_API_KEY,
            self.CLOUDINARY_API_SECRET,
        ])


settings = Settings(**{
    "APP_NAME": get_setting("APP_NAME", "Charme Joias Acessorios"),
    "API_V1_PREFIX": get_setting("API_V1_PREFIX", "/api/v1"),
    "DATABASE_URL": normalize_database_url(get_setting("DATABASE_URL")),
    "SECRET_KEY": get_setting("SECRET_KEY"),
    "ALGORITHM": get_setting("ALGORITHM", "HS256"),
    "ACCESS_TOKEN_EXPIRE_MINUTES": int(get_setting("ACCESS_TOKEN_EXPIRE_MINUTES", 60)),
    "SENTRY_DSN": get_setting("SENTRY_DSN", ""),
    "ENVIRONMENT": get_setting("ENVIRONMENT", "development"),
    "ADMIN_EMAILS": get_setting("ADMIN_EMAILS", ""),
    "CORS_ORIGINS": get_setting("CORS_ORIGINS", ""),
    "SEED_DEFAULT_PRODUCTS": get_setting("SEED_DEFAULT_PRODUCTS", "true"),
    "FRONTEND_URL": get_setting("FRONTEND_URL", ""),
    "CLOUDINARY_CLOUD_NAME": get_setting("CLOUDINARY_CLOUD_NAME", ""),
    "CLOUDINARY_API_KEY": get_setting("CLOUDINARY_API_KEY", ""),
    "CLOUDINARY_API_SECRET": get_setting("CLOUDINARY_API_SECRET", ""),
    "CLOUDINARY_DEFAULT_FOLDER": get_setting("CLOUDINARY_DEFAULT_FOLDER", "charme/produtos"),
})
