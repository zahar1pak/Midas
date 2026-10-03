import httpx
import asyncio
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

# Constants
FIAT_CURRENCIES = ["RUB", "USD", "EUR", "UAH", "CNY"]
CRYPTO_CURRENCIES = ["btc", "eth", "usdt", "ton", "sol"]  # coingecko ids

class CurrencyService:
    def __init__(self, mock_mode: bool = False):
        self.mock_mode = mock_mode
        self._rates_cache = {}
        self._crypto_cache = {}
        self._last_fiat_update = None
        self._last_crypto_update = None
        self.cache_duration = timedelta(minutes=30)
        
    async def get_fiat_rates(self):
        if self.mock_mode:
            return {"USD": 1.0, "RUB": 90.0, "EUR": 0.9, "UAH": 38.0, "CNY": 7.2}

        now = datetime.now()
        if self._last_fiat_update and (now - self._last_fiat_update) < self.cache_duration:
            return self._rates_cache
            
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get("https://api.exchangerate-api.com/v4/latest/USD")
                response.raise_for_status()
                data = response.json()
                rates = data.get("rates", {})
                
                # Filter to only supported
                self._rates_cache = {k: v for k, v in rates.items() if k in FIAT_CURRENCIES}
                self._last_fiat_update = now
                return self._rates_cache
        except Exception as e:
            logger.error(f"Failed to fetch fiat rates: {e}")
            return self._rates_cache or {"USD": 1.0, "RUB": 90.0, "EUR": 0.9, "UAH": 38.0, "CNY": 7.2}

    async def get_crypto_rates(self):
        if self.mock_mode:
            return {"btc": 65000.0, "eth": 3500.0, "usdt": 1.0, "ton": 5.0, "sol": 150.0}

        now = datetime.now()
        if self._last_crypto_update and (now - self._last_crypto_update) < self.cache_duration:
            return self._crypto_cache
            
        try:
            ids = ",".join(CRYPTO_CURRENCIES)
            async with httpx.AsyncClient() as client:
                # coingecko uses ids and vs_currencies
                response = await client.get(
                    f"https://api.coingecko.com/api/v3/simple/price?ids={ids}&vs_currencies=usd"
                )
                response.raise_for_status()
                data = response.json()
                
                self._crypto_cache = {k: v.get("usd", 0.0) for k, v in data.items()}
                self._last_crypto_update = now
                return self._crypto_cache
        except Exception as e:
            logger.error(f"Failed to fetch crypto rates: {e}")
            return self._crypto_cache or {"btc": 65000.0, "eth": 3500.0, "usdt": 1.0, "ton": 5.0, "sol": 150.0}

    async def convert(self, amount: float, from_currency: str, to_currency: str) -> float:
        from_currency = from_currency.upper()
        to_currency = to_currency.upper()
        
        if from_currency == to_currency:
            return amount

        rates = await self.get_fiat_rates()
        # Convert to USD first (base for our rates)
        usd_amount = amount
        if from_currency != "USD":
            if from_currency in rates:
                usd_amount = amount / rates[from_currency]
            else:
                crypto_rates = await self.get_crypto_rates()
                from_lower = from_currency.lower()
                if from_lower in crypto_rates:
                    usd_amount = amount * crypto_rates[from_lower]
                else:
                    raise ValueError(f"Unsupported currency: {from_currency}")

        if to_currency == "USD":
            return round(usd_amount, 2)
            
        if to_currency in rates:
            return round(usd_amount * rates[to_currency], 2)
            
        crypto_rates = await self.get_crypto_rates()
        to_lower = to_currency.lower()
        if to_lower in crypto_rates:
            return round(usd_amount / crypto_rates[to_lower], 8)
            
        raise ValueError(f"Unsupported currency: {to_currency}")

currency_service = CurrencyService(mock_mode=True)  # default mock mode for tests/dev
