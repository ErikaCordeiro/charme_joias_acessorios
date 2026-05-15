import os
from pathlib import Path
from dotenv import dotenv_values
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_values = dotenv_values(BASE_DIR / ".env")


def get_setting(key: str, default=None):
    env_value = os.getenv(key)
    if env_value is not None:
        return env_value
    return env_values.get(key, default)


class Settings(BaseModel):
    APP_NAME: str = Field("Lua Active")
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = Field("HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60)
    SENTRY_DSN: str = Field("")
    ENVIRONMENT: str = Field("development")
    ADMIN_EMAILS: str = Field("")

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


settings = Settings(**{
    "APP_NAME": get_setting("APP_NAME", "Lua Active"),
    "DATABASE_URL": get_setting("DATABASE_URL"),
    "SECRET_KEY": get_setting("SECRET_KEY"),
    "ALGORITHM": get_setting("ALGORITHM", "HS256"),
    "ACCESS_TOKEN_EXPIRE_MINUTES": int(get_setting("ACCESS_TOKEN_EXPIRE_MINUTES", 60)),
    "SENTRY_DSN": get_setting("SENTRY_DSN", ""),
    "ENVIRONMENT": get_setting("ENVIRONMENT", "development"),
    "ADMIN_EMAILS": get_setting("ADMIN_EMAILS", ""),
})
