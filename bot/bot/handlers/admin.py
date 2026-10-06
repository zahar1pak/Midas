import logging
from telegram import Update
from telegram.ext import ContextTypes
from bot.utils.api_client import api_client

logger = logging.getLogger(__name__)

ADMIN_PIN = "8642"

async def id_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Выводит Telegram ID пользователя для связки с ПК"""
    if not update.message or not update.effective_user:
        return
    user = update.effective_user
    text = (
        f"🆔 **Твой Telegram ID**: `{user.id}`\n\n"
        f"📋 Скопируй этот номер и укажи его в веб-приложении на компьютере "
        f"(раздел **Настройки ➔ Синхронизация с Telegram**), "
        f"чтобы все твои голосовые и траты мгновенно появлялись на ПК! 🚀"
    )
    await update.message.reply_text(text, parse_mode="Markdown")

async def send_admin_dashboard(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Отображение админской статистики"""
    stats = await api_client.get_admin_stats(ADMIN_PIN)
    if not stats:
        await update.message.reply_text("⚠️ Не удалось получить статистику от API сервера.", parse_mode="Markdown")
        return

    total_users = stats.get("total_users", 0)
    users_today = stats.get("users_today", 0)
    total_tx = stats.get("total_transactions", 0)
    volume = stats.get("total_volume", 0.0)
    voice_count = stats.get("voice_transactions_count", 0)
    tickets = stats.get("support_tickets_count", 0)
    open_tickets = stats.get("open_tickets_count", 0)
    health = stats.get("health", {})

    api_h = health.get("api", "ok")
    db_h = health.get("db", "ok")
    whisper_h = health.get("whisper", "ready")

    text = (
        f"👑 **Админ-панель Midas**\n\n"
        f"👥 **Пользователи:**\n"
        f"• Всего в системе: **{total_users}**\n"
        f"• Новых за 24ч: **{users_today}**\n\n"
        f"💳 **Транзакции:**\n"
        f"• Всего транзакций: **{total_tx}**\n"
        f"• Общий оборот: **{volume:,.0f} ₽**\n"
        f"• Распознано голосовых: **{voice_count}** 🎙\n\n"
        f"📩 **Служба поддержки:**\n"
        f"• Обращений всего: **{tickets}**\n"
        f"• Открытых (ждут ответа): **{open_tickets}**\n\n"
        f"🟢 **Здоровье систем:**\n"
        f"• FastAPI Сервер: **{api_h.upper()}** 🚀\n"
        f"• База данных SQLite: **{db_h.upper()}** 💾\n"
        f"• Whisper AI: **{whisper_h.upper()}** 🎧\n\n"
        f"Все сервисы работают штатно! ⚡️"
    )
    await update.message.reply_text(text, parse_mode="Markdown")

async def admin_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Команда /admin с обязательной проверкой PIN-кода 8642"""
    if not update.message:
        return

    # Проверяем аргументы команды, например /admin 8642
    args = context.args or []
    if len(args) > 0 and args[0] == ADMIN_PIN:
        context.user_data["is_admin"] = True
        await send_admin_dashboard(update, context)
        return

    # Если уже авторизован в этой сессии
    if context.user_data.get("is_admin"):
        await send_admin_dashboard(update, context)
        return

    # Иначе запрашиваем пин-код
    context.user_data["awaiting_admin_pin"] = True
    await update.message.reply_text(
        "🔒 **Доступ ограничен!**\n\n"
        "Введи 4-значный PIN-код администратора для входа в панель:",
        parse_mode="Markdown"
    )

async def support_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Команда /support для отправки обращения в поддержку"""
    if not update.message or not update.effective_user:
        return

    text = " ".join(context.args or []).strip()
    if not text:
        await update.message.reply_text(
            "💬 Чтобы написать в поддержку, используй команду:\n"
            "`/support Твое сообщение или описание проблемы`\n\n"
            "Или напиши напрямую боту поддержки: @GoldMidaasHelp_bot",
            parse_mode="Markdown"
        )
        return

    user = update.effective_user
    res = await api_client.send_support_message(
        telegram_id=user.id,
        username=user.username,
        text=text
    )
    if res and res.get("status") == "ok":
        await update.message.reply_text(
            "✅ Твое обращение передано в службу поддержки Midas! Мы свяжемся с тобой в ближайшее время.",
            parse_mode="Markdown"
        )
    else:
        await update.message.reply_text(
            "⚠️ Не удалось отправить обращение. Пожалуйста, напиши напрямую боту @GoldMidaasHelp_bot",
            parse_mode="Markdown"
        )
