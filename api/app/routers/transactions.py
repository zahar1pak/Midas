from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional, Dict, Any
from datetime import datetime
import tempfile
import os
import uuid

from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.category import Category
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.services.transaction_service import create_transaction, get_transactions
from app.services.voice_service import voice_service
from app.services.ai_service import ai_service

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("/", response_model=TransactionResponse)
async def add_transaction(tx: TransactionCreate, db: AsyncSession = Depends(get_db)):
    # Find default user or create one
    stmt = select(User).limit(1)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user:
        user = User(telegram_id=12345678, display_name="Бро")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return await create_transaction(db, user.id, tx)

@router.get("/", response_model=List[TransactionResponse])
async def list_transactions(
    category_id: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Transaction).order_by(desc(Transaction.transaction_date))
    res = await db.execute(stmt)
    items = res.scalars().all()
    return items

@router.post("/voice")
async def process_voice(
    file: UploadFile = File(...),
    telegram_id: Optional[int] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """Прием голосового файла от бота, распознавание речи, AI-парсинг и сохранение транзакции"""
    suffix = os.path.splitext(file.filename)[1] if file.filename else ".ogg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Распознавание речи
        transcription = await voice_service.process_voice_message(tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

    if not transcription or not transcription.strip():
        return {
            "error": "Не удалось разобрать голосовое, бро! Скажи чуть чётче или напиши текстом 🎤",
            "transcription": "",
            "transaction": None
        }

    # Умный разбор
    parsed = await ai_service.parse_transaction_text(transcription)

    # Находим или создаем юзера
    user_id = str(uuid.uuid4())
    if telegram_id:
        stmt = select(User).where(User.telegram_id == telegram_id)
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()
        if user:
            user_id = user.id
        else:
            new_u = User(telegram_id=telegram_id, display_name="Бро")
            db.add(new_u)
            await db.commit()
            await db.refresh(new_u)
            user_id = new_u.id

    # Вычисляем дату транзакции с учетом days_offset
    from datetime import timedelta
    tx_date = datetime.utcnow()
    if parsed.get("days_offset"):
        tx_date = tx_date - timedelta(days=parsed["days_offset"])

    # Сохраняем транзакцию
    new_tx = Transaction(
        user_id=user_id,
        type=parsed.get("type", "expense"),
        amount=parsed.get("amount", 0.0),
        currency=parsed.get("currency", "RUB"),
        amount_base=parsed.get("amount", 0.0),
        exchange_rate=1.0,
        description=parsed.get("description", transcription),
        source="voice",
        raw_text=transcription,
        transaction_date=tx_date
    )
    db.add(new_tx)
    await db.commit()
    await db.refresh(new_tx)

    return {
        "transcription": transcription,
        "transaction": {
            "id": new_tx.id,
            "type": new_tx.type,
            "amount": float(new_tx.amount),
            "currency": new_tx.currency,
            "category": parsed.get("category", "Прочее"),
            "description": new_tx.description,
            "transaction_date": new_tx.transaction_date.isoformat()
        }
    }

@router.post("/text")
async def process_text(
    text: str = Form(...),
    telegram_id: Optional[int] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """Разбор текстового сообщения транзакции (например: 'Купил булку за 200р в пятерочке' или 'вчера отложил 3000 в копилку')"""
    parsed = await ai_service.parse_transaction_text(text)

    user_id = str(uuid.uuid4())
    if telegram_id:
        stmt = select(User).where(User.telegram_id == telegram_id)
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()
        if user:
            user_id = user.id
        else:
            new_u = User(telegram_id=telegram_id, display_name="Бро")
            db.add(new_u)
            await db.commit()
            await db.refresh(new_u)
            user_id = new_u.id

    from datetime import timedelta
    tx_date = datetime.utcnow()
    if parsed.get("days_offset"):
        tx_date = tx_date - timedelta(days=parsed["days_offset"])

    new_tx = Transaction(
        user_id=user_id,
        type=parsed.get("type", "expense"),
        amount=parsed.get("amount", 0.0),
        currency=parsed.get("currency", "RUB"),
        amount_base=parsed.get("amount", 0.0),
        exchange_rate=1.0,
        description=parsed.get("description", text),
        source="text",
        raw_text=text,
        transaction_date=tx_date
    )
    db.add(new_tx)
    await db.commit()
    await db.refresh(new_tx)

    return {
        "transaction": {
            "id": new_tx.id,
            "type": new_tx.type,
            "amount": float(new_tx.amount),
            "currency": new_tx.currency,
            "category": parsed.get("category", "Прочее"),
            "description": new_tx.description,
            "transaction_date": new_tx.transaction_date.isoformat()
        }
    }

from pydantic import BaseModel

class SyncTransactionItem(BaseModel):
    id: Optional[str] = None
    type: str = "expense"
    amount: float
    currency: str = "RUB"
    category: str = "Прочее"
    description: str = ""
    date: Optional[str] = ""
    timestamp: Optional[int] = None

class SyncPayload(BaseModel):
    telegram_id: Optional[int] = None
    transaction: SyncTransactionItem

@router.get("/sync")
async def get_sync_transactions(
    telegram_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """Возвращает список транзакций пользователя для веб-приложения и бота"""
    if not telegram_id:
        return []

    stmt = select(User).where(User.telegram_id == telegram_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user:
        return []

    tx_stmt = select(Transaction).where(Transaction.user_id == user.id).order_by(desc(Transaction.transaction_date))
    tx_res = await db.execute(tx_stmt)
    tx_list = tx_res.scalars().all()

    items = []
    for tx in tx_list:
        cat_name = "Прочее"
        if tx.category_id:
            c_stmt = select(Category).where(Category.id == tx.category_id)
            c_res = await db.execute(c_stmt)
            cat = c_res.scalar_one_or_none()
            if cat:
                cat_name = cat.name
        
        type_str = tx.type.value if hasattr(tx.type, "value") else str(tx.type)
        ts = int(tx.transaction_date.timestamp() * 1000) if tx.transaction_date else int(datetime.utcnow().timestamp() * 1000)
        items.append({
            "id": tx.id,
            "type": type_str,
            "amount": float(tx.amount),
            "currency": tx.currency or "RUB",
            "category": cat_name,
            "description": tx.description or tx.raw_text or "Операция",
            "date": tx.transaction_date.strftime("%d.%m.%Y, %H:%M") if tx.transaction_date else "",
            "timestamp": ts
        })
    return items

@router.post("/sync")
async def save_sync_transaction(
    payload: SyncPayload,
    db: AsyncSession = Depends(get_db)
):
    """Сохранение транзакции из веб-приложения с привязкой к telegram_id"""
    telegram_id = payload.telegram_id or 12345678
    stmt = select(User).where(User.telegram_id == telegram_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user:
        user = User(telegram_id=telegram_id, display_name="Бро")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    tx_data = payload.transaction
    # Проверяем категорию
    cat_stmt = select(Category).where(Category.name == tx_data.category)
    cat_res = await db.execute(cat_stmt)
    category = cat_res.scalar_one_or_none()
    cat_id = category.id if category else None

    tx_date = datetime.utcnow()
    if tx_data.timestamp:
        tx_date = datetime.fromtimestamp(tx_data.timestamp / 1000.0)

    tx_id = tx_data.id if tx_data.id and len(str(tx_data.id)) > 10 else str(uuid.uuid4())
    new_tx = Transaction(
        id=tx_id,
        user_id=user.id,
        type=tx_data.type,
        amount=tx_data.amount,
        currency=tx_data.currency,
        amount_base=tx_data.amount,
        exchange_rate=1.0,
        category_id=cat_id,
        description=tx_data.description,
        source="webapp",
        raw_text=tx_data.description,
        transaction_date=tx_date
    )
    db.add(new_tx)
    await db.commit()
    await db.refresh(new_tx)

    return {
        "id": new_tx.id,
        "type": new_tx.type,
        "amount": float(new_tx.amount),
        "currency": new_tx.currency,
        "category": tx_data.category,
        "description": new_tx.description,
        "date": tx_data.date or tx_date.strftime("%d.%m.%Y, %H:%M"),
        "timestamp": int(tx_date.timestamp() * 1000)
    }

@router.put("/sync/{tx_id}")
async def update_sync_transaction(
    tx_id: str,
    payload: SyncTransactionItem,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Transaction).where(Transaction.id == tx_id)
    res = await db.execute(stmt)
    tx = res.scalar_one_or_none()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    tx.amount = payload.amount
    tx.type = payload.type
    tx.currency = payload.currency
    tx.description = payload.description
    if payload.timestamp:
        tx.transaction_date = datetime.fromtimestamp(payload.timestamp / 1000.0)
    await db.commit()
    return {"status": "ok"}

@router.delete("/sync/{tx_id}")
async def delete_sync_transaction(
    tx_id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Transaction).where(Transaction.id == tx_id)
    res = await db.execute(stmt)
    tx = res.scalar_one_or_none()
    if tx:
        await db.delete(tx)
        await db.commit()
    return {"status": "ok"}

@router.post("/sync/clear")
async def clear_sync_transactions(
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    telegram_id = payload.get("telegram_id")
    if not telegram_id:
        return {"status": "no telegram_id"}
    stmt = select(User).where(User.telegram_id == telegram_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if user:
        from sqlalchemy import delete
        await db.execute(delete(Transaction).where(Transaction.user_id == user.id))
        await db.commit()
    return {"status": "cleared"}
