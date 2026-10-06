import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock

from app.services.voice_service import voice_service

@pytest.mark.asyncio
async def test_transaction_text_category_assignment(async_client: AsyncClient):
    response = await async_client.post(
        "/transactions/text",
        data={"text": "Купил продукты за 1500 рублей", "telegram_id": "999111222"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "transaction" in data
    tx = data["transaction"]
    assert tx["amount"] == 1500.0
    assert tx["type"] == "expense"
    assert tx["category"] != ""
    assert tx["category_id"] is not None

    # Check sync endpoint
    sync_res = await async_client.get("/transactions/sync?telegram_id=999111222")
    assert sync_res.status_code == 200
    tx_list = sync_res.json()
    assert len(tx_list) == 1
    assert tx_list[0]["category"] == tx["category"]
    assert tx_list[0]["amount"] == 1500.0

@pytest.mark.asyncio
async def test_transaction_voice_category_assignment(async_client: AsyncClient, monkeypatch):
    mock_transcribe = AsyncMock(return_value="Получил зарплату 75000 рублей")
    monkeypatch.setattr(voice_service, "process_voice_message", mock_transcribe)

    fake_file = ("voice.ogg", b"FAKE_AUDIO_DATA", "audio/ogg")
    response = await async_client.post(
        "/transactions/voice",
        files={"file": fake_file},
        data={"telegram_id": "999111333"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "transaction" in data
    tx = data["transaction"]
    assert tx["amount"] == 75000.0
    assert tx["type"] == "income"
    assert tx["category_id"] is not None
    assert tx["category"] != ""

    # Check sync endpoint
    sync_res = await async_client.get("/transactions/sync?telegram_id=999111333")
    assert sync_res.status_code == 200
    tx_list = sync_res.json()
    assert len(tx_list) == 1
    assert tx_list[0]["category"] == tx["category"]
    assert tx_list[0]["type"] == "income"

@pytest.mark.asyncio
async def test_admin_stats(async_client: AsyncClient):
    # Create sample transaction first
    await async_client.post(
        "/transactions/text",
        data={"text": "Потратил 300 рублей на такси", "telegram_id": "777666555"}
    )

    response = await async_client.get("/admin/stats")
    assert response.status_code == 200
    stats = response.json()

    assert "total_users" in stats
    assert stats["total_users"] >= 1
    assert "users_today" in stats
    assert "users" in stats
    assert isinstance(stats["users"], list)
    assert "total_transactions" in stats
    assert stats["total_transactions"] >= 1
    assert "total_volume" in stats
    assert stats["total_volume"] >= 300.0
    assert "voice_transactions_count" in stats
    assert "support_tickets_count" in stats
    assert "open_tickets_count" in stats
    assert stats["health"] == {
        "api": "ok",
        "db": "ok",
        "whisper": "ready"
    }

    # Test PIN verification:
    # 1. Valid pin via query param
    valid_pin_res = await async_client.get("/admin/stats?pin=8642")
    assert valid_pin_res.status_code == 200

    # 2. Valid pin via X-Admin-Pin header
    valid_header_res = await async_client.get("/admin/stats", headers={"X-Admin-Pin": "8642"})
    assert valid_header_res.status_code == 200

    # 3. Invalid pin via query param
    invalid_pin_res = await async_client.get("/admin/stats?pin=0000")
    assert invalid_pin_res.status_code == 403
    assert "Invalid admin PIN" in invalid_pin_res.json()["detail"]

    # 4. Invalid pin via header
    invalid_header_res = await async_client.get("/admin/stats", headers={"X-Admin-Pin": "wrong"})
    assert invalid_header_res.status_code == 403

@pytest.mark.asyncio
async def test_admin_support_flow(async_client: AsyncClient):
    # 1. Send support message
    send_payload = {
        "telegram_id": 1234567,
        "username": "support_tester",
        "text": "Как настроить бота?"
    }
    send_res = await async_client.post("/admin/support/send", json=send_payload)
    assert send_res.status_code == 200
    send_data = send_res.json()
    assert send_data["status"] == "ok"
    msg_id = send_data["id"]
    assert msg_id is not None

    # 2. Get support messages
    list_res = await async_client.get("/admin/support/messages")
    assert list_res.status_code == 200
    messages = list_res.json()
    target_msg = next((m for m in messages if m["id"] == msg_id), None)
    assert target_msg is not None
    assert target_msg["text"] == "Как настроить бота?"
    assert target_msg["status"] == "open"
    assert target_msg["username"] == "support_tester"
    assert target_msg["telegram_id"] == 1234567

    # 3. Reply to support message
    reply_payload = {
        "message_id": msg_id,
        "reply_text": "Отправьте /start в боте для начала работы!"
    }
    reply_res = await async_client.post("/admin/support/reply", json=reply_payload)
    assert reply_res.status_code == 200
    assert reply_res.json()["status"] == "ok"

    # 4. Check updated message status
    list_res2 = await async_client.get("/admin/support/messages")
    assert list_res2.status_code == 200
    updated_msg = next((m for m in list_res2.json() if m["id"] == msg_id), None)
    assert updated_msg is not None
    assert updated_msg["status"] == "replied"
    assert updated_msg["admin_reply"] == "Отправьте /start в боте для начала работы!"
    assert updated_msg["replied_at"] is not None
