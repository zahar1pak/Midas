from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from telegram.ext import ContextTypes
from bot.config import settings

async def webapp_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return

    url = settings.TELEGRAM_WEBAPP_URL or ""
    if url.startswith("https://"):
        keyboard = [
            [
                InlineKeyboardButton(
                    "📱 Открыть Midas",
                    web_app=WebAppInfo(url=url)
                )
            ]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(
            "Жми кнопку ниже, чтобы открыть приложение 🚀",
            reply_markup=reply_markup
        )
    else:
        await update.message.reply_text(
            f"📱 Веб-приложение доступно по ссылке:\n{url}\n\n"
            f"(Для открывания прямо внутри Telegram в окне Mini App требуется HTTPS ссылка, например после деплоя на Netlify) 🔥"
        )
