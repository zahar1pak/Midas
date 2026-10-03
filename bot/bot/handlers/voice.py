import logging
from telegram import Update
from telegram.ext import ContextTypes
from bot.utils.api_client import api_client

logger = logging.getLogger(__name__)

async def voice_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.message.voice:
        return

    user = update.effective_user
    # Reply immediately so user knows bot is listening
    processing_msg = await update.message.reply_text("Слушаю голосовое, бро... 🎧")

    try:
        voice_file = await context.bot.get_file(update.message.voice.file_id)
        file_bytes = await voice_file.download_as_bytearray()

        # Send to API for speech-to-text with faster-whisper and AI parsing
        result = await api_client.process_voice(user.id, bytes(file_bytes))
        
        if result and result.get("transaction"):
            tx = result["transaction"]
            transcription = result.get("transcription", "")
            tx_type_str = tx.get("type")
            if tx_type_str == "saving":
                tx_type = "🏦 В копилку"
            elif tx_type_str == "income":
                tx_type = "💰 Доход"
            else:
                tx_type = "💸 Расход"

            amount = tx.get("amount", 0)
            currency = tx.get("currency", "RUB")
            category = tx.get("category", "Прочее")
            description = tx.get("description", transcription)
            
            reply_text = (
                f"Кайф! Распознал речь:\n"
                f"«_{transcription}_» 🎙\n\n"
                f"{tx_type}: **{amount:,.0f} {currency}**\n"
                f"🏷 Категория: **{category}**\n"
                f"📝 {description}\n\n"
                f"Сохранил в базу и синхронизировал с веб-приложением! 🚀"
            )
        elif result and result.get("error"):
            reply_text = result["error"]
        else:
            reply_text = "Бро, не расслышал что ты сказал. Скажи чуть громче или напиши текстом! 😿"
    except Exception as e:
        logger.error(f"Error handling voice message: {e}")
        reply_text = "Сорри, запара при скачивании гс. Напиши текстом, бро! 😿"

    await processing_msg.edit_text(reply_text, parse_mode="Markdown")
