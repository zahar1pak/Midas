from telegram import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from bot.config import settings

def get_main_keyboard() -> ReplyKeyboardMarkup:
    url = settings.TELEGRAM_WEBAPP_URL or ""
    if url.startswith("https://"):
        app_button = KeyboardButton("📱 Приложение", web_app=WebAppInfo(url=url))
    else:
        app_button = KeyboardButton("📱 Приложение")

    keyboard = [
        [
            KeyboardButton("🎤 Записать"),
            KeyboardButton("📊 Статистика")
        ],
        [
            app_button
        ]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
