import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Midas API"}

@pytest.mark.asyncio
async def test_friends_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/friends/")
    assert response.status_code == 200
    data = response.json()
    assert "friends" in data
    assert "pending" in data

@pytest.mark.asyncio
async def test_currency_rates():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/currency/crypto")
    assert response.status_code == 200
    data = response.json()
    assert "btc" in data
