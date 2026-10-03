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
