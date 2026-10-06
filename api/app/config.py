from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///:memory:"
    TEST_DATABASE_URL: str = "sqlite+aiosqlite:///:memory:"
    TELEGRAM_BOT_TOKEN: str = "test"
    ADMIN_TELEGRAM_ID: Optional[int] = None
    TELEGRAM_PROXY_URL: Optional[str] = None
    JWT_SECRET: str = "secret"
    PIN_SALT: str = "salt"
    CORS_ORIGINS: List[str] = ["*"]
    
    model_config = SettingsConfigDict(env_file=("../.env", ".env"), env_file_encoding="utf-8", extra="ignore")

settings = Settings()
