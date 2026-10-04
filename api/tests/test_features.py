import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_stats_summary(async_client: AsyncClient):
    response = await async_client.get("/stats/summary?period=month")
    assert response.status_code == 200
    assert "income" in response.json()

@pytest.mark.asyncio
async def test_friends_list(async_client: AsyncClient):
    response = await async_client.get("/friends/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "friends" in data

@pytest.mark.asyncio
async def test_group_rankings(async_client: AsyncClient):
    import uuid
    dummy_id = uuid.uuid4()
    response = await async_client.get(f"/groups/{dummy_id}/rankings")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_sync_transactions(async_client: AsyncClient):
    payload = {
        "telegram_id": 999888777,
        "transaction": {
            "type": "saving",
            "amount": 1000.0,
            "currency": "RUB",
            "category": "Копилка",
            "description": "Отложил на будущее",
            "date": "04.10.2026, 12:00",
            "timestamp": 1728045000000
        }
    }
    # 1. Post sync transaction
    post_res = await async_client.post("/transactions/sync", json=payload)
    assert post_res.status_code == 200
    data = post_res.json()
    assert data["amount"] == 1000.0
    assert data["type"] == "saving"

    # 2. Get sync transactions for this user
    get_res = await async_client.get("/transactions/sync?telegram_id=999888777")
    assert get_res.status_code == 200
    tx_list = get_res.json()
    assert len(tx_list) == 1
    assert tx_list[0]["amount"] == 1000.0
    assert tx_list[0]["type"] == "saving"

@pytest.mark.asyncio
async def test_ai_slang_parsing():
    from app.services.ai_service import ai_service
    
    # 1. "отложил косарь в копилку"
    res1 = await ai_service.parse_transaction_text("отложил косарь в копилку")
    assert res1["type"] == "saving"
    assert res1["amount"] == 1000.0
    assert res1["category"] == "Копилка"

    # 2. "потратил пятихатку на такси"
    res2 = await ai_service.parse_transaction_text("потратил пятихатку на такси")
    assert res2["type"] == "expense"
    assert res2["amount"] == 500.0
    assert res2["category"] == "Транспорт"

    # 3. "получил пять косарей за фриланс"
    res3 = await ai_service.parse_transaction_text("получил пять косарей за фриланс")
    assert res3["type"] == "income"
    assert res3["amount"] == 5000.0
    assert res3["category"] == "Фриланс"
