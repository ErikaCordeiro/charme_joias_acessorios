import os
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from dotenv import dotenv_values
from pydantic import BaseModel, Field, model_validator

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
        normalized_key = key.lower()
        if normalized_key == "sslmode":
            sslmode_value = value
            continue
        if normalized_key == "channel_binding":
            continue
        filtered_items.append((key, value))

    has_ssl_key = any(key == "ssl" for key, _ in filtered_items)
    if sslmode_value and not has_ssl_key:
        ssl_value = "require" if sslmode_value in {"require", "verify-ca", "verify-full"} else sslmode_value
        filtered_items.append(("ssl", ssl_value))

    if parsed.hostname and "-pooler." in parsed.hostname:
        has_prepared_cache_setting = any(
            key == "prepared_statement_cache_size" for key, _ in filtered_items
        )
        if not has_prepared_cache_setting:
            filtered_items.append(("prepared_statement_cache_size", "0"))

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
    AUTO_CREATE_SCHEMA: bool = Field(True)
    DB_POOL_SIZE: int = Field(5)
    DB_MAX_OVERFLOW: int = Field(5)
    DB_POOL_TIMEOUT: int = Field(30)
    DB_POOL_RECYCLE: int = Field(300)

    @model_validator(mode="after")
    def validate_production_settings(self):
        if self.ENVIRONMENT.lower() != "production":
            return self

        if len(self.SECRET_KEY or "") < 32 or "change-me" in self.SECRET_KEY.lower():
            raise ValueError("SECRET_KEY must be a strong value with at least 32 characters.")
        if self.ALGORITHM != "HS256":
            raise ValueError("ALGORITHM must be HS256.")
        if not self.DATABASE_URL.startswith("postgresql+asyncpg://"):
            raise ValueError("DATABASE_URL must be a PostgreSQL connection string.")
        origins = self.get_cors_origins()
        if not origins or "*" in origins:
            raise ValueError("CORS_ORIGINS must list the production frontend origin.")
        if any("localhost" in origin or "127.0.0.1" in origin for origin in origins):
            raise ValueError("CORS_ORIGINS cannot include local origins in production.")
        if not self.ADMIN_EMAILS.strip():
            raise ValueError("ADMIN_EMAILS must be configured in production.")
        return self

    def get_cors_origins(self) -> list[str]:
        default_origins = (
            []
            if self.ENVIRONMENT.lower() == "production"
            else ["http://localhost:5173", "http://127.0.0.1:5173"]
        )
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
    "AUTO_CREATE_SCHEMA": get_setting("AUTO_CREATE_SCHEMA", "true"),
    "DB_POOL_SIZE": int(get_setting("DB_POOL_SIZE", 5)),
    "DB_MAX_OVERFLOW": int(get_setting("DB_MAX_OVERFLOW", 5)),
    "DB_POOL_TIMEOUT": int(get_setting("DB_POOL_TIMEOUT", 30)),
    "DB_POOL_RECYCLE": int(get_setting("DB_POOL_RECYCLE", 300)),
})
