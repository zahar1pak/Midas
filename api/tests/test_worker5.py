import pytest
from httpx import AsyncClient

# Using a mocked FastAPI app or just calling the router logic directly.
# Since we don't have main app set up by worker 1 here guaranteed,
# we'll test the service directly.

@pytest.mark.asyncio
async def test_currency_service_mock():
    from app.services.currency_service import currency_service
    
    # default is mock_mode=True
    rates = await currency_service.get_fiat_rates()
    assert "USD" in rates
    assert "RUB" in rates
    assert rates["USD"] == 1.0

    converted = await currency_service.convert(100, "USD", "RUB")
    assert converted == 9000.0

@pytest.mark.asyncio
async def test_ai_service_mock():
    from app.services.ai_service import ai_service
    
    res = await ai_service.analyze_spending([{"amount": 100}])
    assert "Бро" in res or "совет" in res.lower() or "💡" in res
    
    parsed = await ai_service.parse_transaction_text("Купил булку за 200р в пятерочке")
    assert parsed["type"] in ["income", "expense"]
    assert "amount" in parsed
