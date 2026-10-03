from telegram import Update
from telegram.ext import ContextTypes
from bot.keyboards.main import get_main_keyboard
from bot.utils.api_client import api_client

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    if not user:
        return

    # Register user via API
    await api_client.register_user(
        telegram_id=user.id,
        username=user.username,
        display_name=user.first_name
    )

    welcome_text = (
        f"Йо, {user.first_name}! 👋 Я Midas — твой личный финансовый бро 💰\n\n"
        f"Твой Telegram аккаунт (@{user.username or 'bro'}) синхронизирован с веб-приложением!\n\n"
        f"Ты можешь отправлять мне голосовые кружочки или аудио с тратами, а также откладывать деньги в копилку («вчера отложил 3000 в копилку»). Без запары! 😎\n\n"
        f"Жми кнопку ниже, чтобы зайти в приложение 👇"
    )

    from telegram import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
    from bot.config import settings

    reply_markup = get_main_keyboard()
    url = settings.TELEGRAM_WEBAPP_URL or ""
    if url.startswith("https://"):
        inline_kb = InlineKeyboardMarkup([
            [InlineKeyboardButton("📱 Войти в Midas WebApp", web_app=WebAppInfo(url=url))]
        ])
        await update.message.reply_text(
            text=welcome_text,
            reply_markup=inline_kb
        )
    else:
        await update.message.reply_text(
            text=welcome_text,
            reply_markup=reply_markup
        )
