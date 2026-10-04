import httpx
from bot.config import settings

class ApiClient:
    def __init__(self, base_url: str = settings.API_BASE_URL):
        self.base_url = base_url

    async def _request(self, method: str, endpoint: str, **kwargs) -> httpx.Response:
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}{endpoint}"
            response = await client.request(method, url, **kwargs)
            return response

    async def register_user(self, telegram_id: int, username: str | None, display_name: str | None) -> dict:
        data = {
            "telegram_id": telegram_id,
            "username": username,
            "display_name": display_name
        }
        try:
            response = await self._request("POST", "/auth/login", json=data)
            if response.status_code in [200, 201]:
                return response.json()
        except Exception:
            pass
        return {}

    async def get_stats(self, telegram_id: int) -> dict:
        try:
            response = await self._request("GET", "/stats/summary", params={"currency": "RUB", "telegram_id": telegram_id})
            if response.status_code == 200:
                return response.json()
        except Exception:
            pass
        return {}

    async def process_voice(self, telegram_id: int, file_bytes: bytes) -> dict:
        files = {"file": ("voice.ogg", file_bytes, "audio/ogg")}
        data = {"telegram_id": str(telegram_id)}
        try:
            response = await self._request("POST", "/transactions/voice", files=files, data=data)
            if response.status_code == 200:
                return response.json()
        except Exception:
            pass
        return {}

    async def process_text(self, telegram_id: int, text: str) -> dict:
        data = {"telegram_id": str(telegram_id), "text": text}
        try:
            response = await self._request("POST", "/transactions/text", data=data)
            if response.status_code == 200:
                return response.json()
        except Exception:
            pass
        return {}

api_client = ApiClient()
