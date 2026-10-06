import pytest
from unittest.mock import AsyncMock
from telegram import Update, User, Message, Chat
from telegram.ext import ContextTypes

from bot.handlers.admin import id_command, admin_command, support_command
from bot.handlers.stats import text_handler
from bot.utils.api_client import api_client

@pytest.fixture
def update_mock():
    update = AsyncMock(spec=Update)
    user = User(id=987654321, first_name="AdminBro", is_bot=False, username="admin_bro")
    chat = Chat(id=987654321, type="private")
    message = AsyncMock(spec=Message)
    message.reply_text = AsyncMock()
    
    update.effective_user = user
    update.message = message
    return update

@pytest.fixture
def context_mock():
    context = AsyncMock(spec=ContextTypes.DEFAULT_TYPE)
    context.user_data = {}
    context.args = []
    return context

@pytest.mark.asyncio
async def test_id_command(update_mock, context_mock):
    await id_command(update_mock, context_mock)
    update_mock.message.reply_text.assert_called_once()
    reply = update_mock.message.reply_text.call_args[0][0]
    assert "987654321" in reply

@pytest.mark.asyncio
async def test_admin_command_requires_pin(update_mock, context_mock):
    # Without args, it must ask for PIN
    await admin_command(update_mock, context_mock)
    assert context_mock.user_data.get("awaiting_admin_pin") is True
    reply = update_mock.message.reply_text.call_args[0][0]
    assert "PIN" in reply

@pytest.mark.asyncio
async def test_admin_pin_wrong_flow(update_mock, context_mock):
    context_mock.user_data["awaiting_admin_pin"] = True
    update_mock.message.text = "0000"
    
    await text_handler(update_mock, context_mock)
    assert context_mock.user_data.get("is_admin") is not True
    reply = update_mock.message.reply_text.call_args[0][0]
    assert "Неверный PIN-код" in reply

@pytest.mark.asyncio
async def test_admin_pin_correct_flow(update_mock, context_mock, monkeypatch):
    mock_stats = AsyncMock(return_value={
        "total_users": 5,
        "users_today": 1,
        "total_transactions": 25,
        "total_volume": 12500.0,
        "voice_transactions_count": 8,
        "support_tickets_count": 2,
        "open_tickets_count": 1,
        "health": {"api": "ok", "db": "ok", "whisper": "ready"}
    })
    monkeypatch.setattr(api_client, "get_admin_stats", mock_stats)

    context_mock.user_data["awaiting_admin_pin"] = True
    update_mock.message.text = "8642"
    
    await text_handler(update_mock, context_mock)
    assert context_mock.user_data.get("is_admin") is True
    mock_stats.assert_called_once_with("8642")
    assert update_mock.message.reply_text.call_count >= 1

@pytest.mark.asyncio
async def test_support_command(update_mock, context_mock, monkeypatch):
    mock_send = AsyncMock(return_value={"status": "ok", "id": "TEST_TICKET_123"})
    monkeypatch.setattr(api_client, "send_support_message", mock_send)

    context_mock.args = ["Хочу", "новую", "фичу"]
    await support_command(update_mock, context_mock)
    
    mock_send.assert_called_once_with(
        telegram_id=987654321,
        username="admin_bro",
        text="Хочу новую фичу"
    )
    reply = update_mock.message.reply_text.call_args[0][0]
    assert "принято" in reply.lower() or "передано" in reply.lower()
