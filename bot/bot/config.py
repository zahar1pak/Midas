from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    TELEGRAM_BOT_TOKEN: str = "TEST_TOKEN"
    TELEGRAM_WEBAPP_URL: str = "http://localhost:5173"
    API_BASE_URL: str = "http://localhost:8000"
    TELEGRAM_PROXY_URL: Optional[str] = "http://127.0.0.1:10809"

    model_config = SettingsConfigDict(env_file=("../../.env", "../.env", ".env"), env_file_encoding="utf-8", extra="ignore")

settings = Settings()
