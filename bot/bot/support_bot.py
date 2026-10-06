import logging
import asyncio
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes
from telegram.request import HTTPXRequest
from bot.config import settings
from bot.utils.api_client import api_client

logger = logging.getLogger(__name__)

SUPPORT_BOT_TOKEN = "8830273908:AAG22NO6nkfLB7s7xGw90Ge9aBHZJygbVpY"

async def support_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return
    text = (
        "👋 **Добро пожаловать в службу поддержки Midas!** 💰\n\n"
        "Напиши сюда свой отзыв, идею или вопрос о работе приложения.\n"
        "Мы читаем каждое сообщение и ответим тебе прямо в этом диалоге! 💬"
    )
    await update.message.reply_text(text, parse_mode="Markdown")

async def reply_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Команда для администратора: /reply <ticket_id> <текст ответа>"""
    if not update.message or not context.args or len(context.args) < 2:
        await update.message.reply_text("Использование: `/reply <ticket_id> <текст ответа>`", parse_mode="Markdown")
        return

    ticket_id = context.args[0]
    reply_text = " ".join(context.args[1:])

    res = await api_client.reply_support_message(ticket_id, reply_text)
    if res and res.get("status") == "ok":
        await update.message.reply_text(f"✅ Ответ на тикет `{ticket_id}` успешно отправлен пользователю!", parse_mode="Markdown")
    else:
        await update.message.reply_text(f"⚠️ Ошибка при отправке ответа: {res.get('detail', 'Не найден тикет')}")

async def support_message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.message.text:
        return

    user = update.effective_user
    msg_text = update.message.text.strip()

    # 1. Сохраняем в API и БД
    res = await api_client.send_support_message(
        telegram_id=user.id,
        username=user.username or user.first_name,
        text=msg_text
    )

    ticket_id = res.get("id", "NEW")

    # 2. Подтверждаем пользователю
    await update.message.reply_text(
        f"✅ Спасибо за обращение! 💛\n"
        f"Номер твоего тикета: `{ticket_id}`.\n"
        f"Мы ответим тебе прямо сюда в ближайшее время!",
        parse_mode="Markdown"
    )

    # 3. Уведомляем администратора через Telegram API (если задан)
    admin_id = getattr(settings, "ADMIN_TELEGRAM_ID", None)
    if admin_id and str(admin_id) != str(user.id):
        try:
            admin_msg = (
                f"📩 **Новое обращение в поддержку!**\n"
                f"👤 От: @{user.username or 'noname'} (ID: `{user.id}`)\n"
                f"🎫 Тикет: `{ticket_id}`\n\n"
                f"«_{msg_text}_»\n\n"
                f"Чтобы ответить: `/reply {ticket_id} текст_ответа`"
            )
            await context.bot.send_message(chat_id=admin_id, text=admin_msg, parse_mode="Markdown")
        except Exception as e:
            logger.warning(f"Could not notify admin in telegram: {e}")

def run_support_bot():
    request = HTTPXRequest(
        connect_timeout=30.0,
        read_timeout=30.0,
        write_timeout=30.0,
        pool_timeout=30.0,
        proxy=settings.TELEGRAM_PROXY_URL,
    )

    app = (
        ApplicationBuilder()
        .token(SUPPORT_BOT_TOKEN)
        .request(request)
        .get_updates_request(request)
        .build()
    )

    app.add_handler(CommandHandler("start", support_start))
    app.add_handler(CommandHandler("reply", reply_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, support_message_handler))

    logger.info("[SUPPORT BOT @GoldMidaasHelp_bot] Starting polling...")
    app.run_polling(
        drop_pending_updates=True,
        allowed_updates=["message", "callback_query"],
        bootstrap_retries=-1,
        poll_interval=1.0,
    )

if __name__ == "__main__":
    run_support_bot()
