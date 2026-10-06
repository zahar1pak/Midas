from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
import logging
import httpx

from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.support import SupportMessage
from app.config import settings
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])

class SupportSendPayload(BaseModel):
    telegram_id: Optional[int] = None
    username: Optional[str] = None
    text: str

class SupportReplyPayload(BaseModel):
    message_id: str
    reply_text: str

@router.get("/stats")
async def get_admin_stats(
    pin: Optional[str] = Query(None),
    x_admin_pin: Optional[str] = Header(None, alias="X-Admin-Pin"),
    db: AsyncSession = Depends(get_db)
):
    """Возвращает общую статистику платформы Midas для панели администратора"""
    provided_pin = pin or x_admin_pin
    if provided_pin is not None and str(provided_pin).strip() != "8642":
        raise HTTPException(status_code=403, detail="Invalid admin PIN")

    # Пользователи
    users_count_res = await db.execute(select(func.count(User.id)))
    total_users = users_count_res.scalar() or 0

    yesterday = datetime.utcnow() - timedelta(days=1)
    users_today_res = await db.execute(select(func.count(User.id)).where(User.created_at >= yesterday))
    users_today = users_today_res.scalar() or 0

    users_res = await db.execute(select(User).order_by(desc(User.created_at)))
    users_list = users_res.scalars().all()
    users_data = [
        {
            "id": u.id,
            "telegram_id": u.telegram_id,
            "username": u.username,
            "display_name": u.display_name,
            "created_at": u.created_at.isoformat() if u.created_at else None
        }
        for u in users_list
    ]

    # Транзакции
    tx_count_res = await db.execute(select(func.count(Transaction.id)))
    total_transactions = tx_count_res.scalar() or 0

    vol_res = await db.execute(select(func.sum(Transaction.amount)))
    sum_vol = vol_res.scalar()
    total_volume = float(sum_vol) if sum_vol is not None else 0.0

    voice_tx_res = await db.execute(select(func.count(Transaction.id)).where(Transaction.source == "voice"))
    voice_transactions_count = voice_tx_res.scalar() or 0

    # Обращения в поддержку
    tickets_count_res = await db.execute(select(func.count(SupportMessage.id)))
    support_tickets_count = tickets_count_res.scalar() or 0

    open_tickets_res = await db.execute(select(func.count(SupportMessage.id)).where(SupportMessage.status == "open"))
    open_tickets_count = open_tickets_res.scalar() or 0

    return {
        "total_users": total_users,
        "users_today": users_today,
        "users": users_data,
        "total_transactions": total_transactions,
        "total_volume": total_volume,
        "voice_transactions_count": voice_transactions_count,
        "support_tickets_count": support_tickets_count,
        "open_tickets_count": open_tickets_count,
        "health": {
            "api": "ok",
            "db": "ok",
            "whisper": "ready"
        }
    }

@router.post("/support/send")
async def send_support_message(
    payload: SupportSendPayload,
    db: AsyncSession = Depends(get_db)
):
    """Пользователь отправляет вопрос в техподдержку"""
    msg = SupportMessage(
        id=str(uuid.uuid4()),
        telegram_id=payload.telegram_id,
        username=payload.username,
        text=payload.text,
        status="open",
        created_at=datetime.utcnow()
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)

    # Отправка уведомления администратору в Telegram (если настроен ADMIN_TELEGRAM_ID)
    admin_tg_id = settings.ADMIN_TELEGRAM_ID
    bot_token = settings.TELEGRAM_BOT_TOKEN
    proxy_url = settings.TELEGRAM_PROXY_URL

    if admin_tg_id and bot_token and bot_token != "test":
        try:
            notify_text = (
                f"🆘 <b>Новое обращение в техподдержку Midas!</b>\n\n"
                f"<b>От:</b> @{payload.username or 'Аноним'} (ID: <code>{payload.telegram_id}</code>)\n"
                f"<b>Вопрос:</b> {payload.text}\n"
                f"<b>ID тикета:</b> <code>{msg.id}</code>"
            )
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            body = {
                "chat_id": admin_tg_id,
                "text": notify_text,
                "parse_mode": "HTML"
            }
            client_kwargs = {"timeout": 5.0}
            if proxy_url:
                client_kwargs["proxy"] = proxy_url
            async with httpx.AsyncClient(**client_kwargs) as client:
                await client.post(url, json=body)
        except Exception as e:
            logger.warning(f"Failed to notify admin via Telegram: {e}")

    return {"status": "ok", "id": msg.id}

@router.get("/support/messages")
async def get_support_messages(db: AsyncSession = Depends(get_db)):
    """Возвращает список сообщений в поддержку для админки"""
    stmt = select(SupportMessage).order_by(desc(SupportMessage.created_at))
    res = await db.execute(stmt)
    messages = res.scalars().all()

    return [
        {
            "id": m.id,
            "telegram_id": m.telegram_id,
            "username": m.username,
            "text": m.text,
            "status": m.status,
            "admin_reply": m.admin_reply,
            "created_at": m.created_at.isoformat() if m.created_at else None,
            "replied_at": m.replied_at.isoformat() if m.replied_at else None
        }
        for m in messages
    ]

@router.post("/support/reply")
async def reply_to_support_message(
    payload: SupportReplyPayload,
    db: AsyncSession = Depends(get_db)
):
    """Администратор отвечает пользователю на тикет"""
    stmt = select(SupportMessage).where(SupportMessage.id == payload.message_id)
    res = await db.execute(stmt)
    msg = res.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Support message not found")

    msg.status = "replied"
    msg.admin_reply = payload.reply_text
    msg.replied_at = datetime.utcnow()
    await db.commit()
    await db.refresh(msg)

    # Отправка ответа пользователю через Telegram Bot API
    bot_token = settings.TELEGRAM_BOT_TOKEN
    proxy_url = settings.TELEGRAM_PROXY_URL

    if msg.telegram_id and bot_token and bot_token != "test":
        try:
            reply_text = (
                f"💬 <b>Ответ службы поддержки Midas:</b>\n\n"
                f"{payload.reply_text}"
            )
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            body = {
                "chat_id": msg.telegram_id,
                "text": reply_text,
                "parse_mode": "HTML"
            }
            client_kwargs = {"timeout": 5.0}
            if proxy_url:
                client_kwargs["proxy"] = proxy_url
            async with httpx.AsyncClient(**client_kwargs) as client:
                await client.post(url, json=body)
        except Exception as e:
            logger.warning(f"Failed to send reply to user via Telegram: {e}")

    return {"status": "ok", "id": msg.id}
