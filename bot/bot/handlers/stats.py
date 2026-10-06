from telegram import Update
from telegram.ext import ContextTypes
from bot.utils.api_client import api_client
from bot.handlers.webapp import webapp_command

async def stats_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return
        
    user = update.effective_user
    result = await api_client.get_stats(user.id)
    
    if result:
        income = result.get("total_income", result.get("income", 0))
        expense = result.get("total_expenses", result.get("expense", 0))
        net = result.get("net", income - expense)
        
        reply_text = (
            f"📊 **Твоя статистика за месяц, бро:**\n\n"
            f"💰 Пришло (доходы): **{int(income)} ₽**\n"
            f"📉 Ушло (расходы): **{int(expense)} ₽**\n"
            f"💵 Чистый остаток: **{int(net)} ₽**\n\n"
            f"Загляни в приложение для красивых графиков и аналитики! 📱"
        )
    else:
        reply_text = "📊 Статистика пока собирается! Запиши свои первые траты голосом или текстом 🚀"

    await update.message.reply_text(reply_text, parse_mode="Markdown")

async def text_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.message.text:
        return
        
    text = update.message.text.strip()
    user = update.effective_user

    # Проверка ввода PIN-кода администратора
    if context.user_data.get("awaiting_admin_pin"):
        context.user_data["awaiting_admin_pin"] = False
        from bot.handlers.admin import ADMIN_PIN, send_admin_dashboard
        if text == ADMIN_PIN:
            context.user_data["is_admin"] = True
            await update.message.reply_text("🔓 **Доступ разрешен!** Загружаю данные панели...", parse_mode="Markdown")
            await send_admin_dashboard(update, context)
            return
        else:
            await update.message.reply_text("❌ **Неверный PIN-код!** Доступ к админ-панели запрещен.", parse_mode="Markdown")
            return

    if text == "📊 Статистика":
        await stats_handler(update, context)
        return
    elif text == "🎤 Записать":
        await update.message.reply_text("Отправь голосовое (гс) или просто напиши текстом, например:\n\n*Купил булку за 200р в пятерочке*\n*Получил зп 50к*", parse_mode="Markdown")
        return
    elif text == "📱 Приложение":
        await webapp_command(update, context)
        return
    elif text == "🆔 Мой ID":
        from bot.handlers.admin import id_command
        await id_command(update, context)
        return


    # Если пользователь ввёл текст с тратой/доходом
    res = await api_client.process_text(user.id, text)
    if res and "transaction" in res:
        tx = res["transaction"]
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
        
        reply = (
            f"Кайф! Записал, бро 😎\n\n"
            f"{tx_type}: **{amount:,.0f} {currency}**\n"
            f"🏷 Категория: **{category}**\n"
            f"📝 {tx.get('description', '')}\n\n"
            f"Всё сохранено в базе и синхронизировано с приложением! 🚀"
        )
        await update.message.reply_text(reply, parse_mode="Markdown")
    else:
        await update.message.reply_text("Понял тебя, бро! Отправь голосовое с тратой или нажми кнопки внизу 👇")
