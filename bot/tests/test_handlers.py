import pytest
from unittest.mock import AsyncMock, MagicMock
from telegram import Update, User, Message, Chat
from telegram.ext import ContextTypes

from bot.handlers.start import start_command
from bot.handlers.stats import stats_handler
from bot.handlers.webapp import webapp_command
from bot.utils.api_client import api_client

@pytest.fixture
def update_mock():
    update = AsyncMock(spec=Update)
    user = User(id=123, first_name="Test", is_bot=False, username="test_user")
    chat = Chat(id=123, type="private")
    message = AsyncMock(spec=Message)
    message.reply_text = AsyncMock()
    
    update.effective_user = user
    update.message = message
    return update

@pytest.fixture
def context_mock():
    return AsyncMock(spec=ContextTypes.DEFAULT_TYPE)

@pytest.mark.asyncio
async def test_start_command(update_mock, context_mock, monkeypatch):
    mock_register = AsyncMock(return_value={"status": "ok"})
    monkeypatch.setattr(api_client, "register_user", mock_register)
    
    await start_command(update_mock, context_mock)
    
    mock_register.assert_called_once_with(
        telegram_id=123, 
        username="test_user", 
        display_name="Test"
    )
    update_mock.message.reply_text.assert_called_once()
    assert "Йо, бро!" in update_mock.message.reply_text.call_args[1]["text"]

@pytest.mark.asyncio
async def test_stats_handler(update_mock, context_mock, monkeypatch):
    mock_get_stats = AsyncMock(return_value={"income": 50000, "expense": 15000})
    monkeypatch.setattr(api_client, "get_stats", mock_get_stats)
    
    await stats_handler(update_mock, context_mock)
    
    mock_get_stats.assert_called_once_with(123)
    update_mock.message.reply_text.assert_called_once()
    assert "50000" in update_mock.message.reply_text.call_args[0][0]

@pytest.mark.asyncio
async def test_webapp_command(update_mock, context_mock):
    await webapp_command(update_mock, context_mock)
    update_mock.message.reply_text.assert_called_once()
