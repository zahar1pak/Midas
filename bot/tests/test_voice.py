import pytest
from unittest.mock import AsyncMock, MagicMock
from telegram import Update, User, Message, Voice
from telegram.ext import ContextTypes

from bot.handlers.voice import voice_handler
from bot.utils.api_client import api_client

@pytest.fixture
def update_mock():
    update = AsyncMock(spec=Update)
    user = User(id=123, first_name="Test", is_bot=False, username="test_user")
    
    voice = MagicMock(spec=Voice)
    voice.file_id = "test_file_id"
    
    message = AsyncMock(spec=Message)
    message.voice = voice
    message.reply_text = AsyncMock(return_value=AsyncMock())
    
    update.effective_user = user
    update.message = message
    return update

@pytest.fixture
def context_mock():
    context = AsyncMock(spec=ContextTypes.DEFAULT_TYPE)
    mock_file = AsyncMock()
    mock_file.download_as_bytearray = AsyncMock(return_value=bytearray(b"test audio data"))
    context.bot.get_file = AsyncMock(return_value=mock_file)
    return context

@pytest.mark.asyncio
async def test_voice_handler(update_mock, context_mock, monkeypatch):
    mock_process_voice = AsyncMock(return_value={
        "transaction": {
            "type": "expense",
            "amount": 200,
            "currency": "RUB",
            "category": "Супермаркеты"
        }
    })
    monkeypatch.setattr(api_client, "process_voice", mock_process_voice)
    
    await voice_handler(update_mock, context_mock)
    
    # Assert get_file was called
    context_mock.bot.get_file.assert_called_once_with("test_file_id")
    
    # Assert api client was called
    mock_process_voice.assert_called_once_with(123, b"test audio data")
    
    # Assert reply edit was called
    processing_msg = update_mock.message.reply_text.return_value
    processing_msg.edit_text.assert_called_once()
    
    edit_text_args = processing_msg.edit_text.call_args[0][0]
    assert "200" in edit_text_args
    assert "Супермаркеты" in edit_text_args
    assert "Расход" in edit_text_args
