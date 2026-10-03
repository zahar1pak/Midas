from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate
import uuid

async def create_transaction(db: AsyncSession, user_id: str, tx: TransactionCreate):
    db_tx = Transaction(
        id=str(uuid.uuid4()),
        user_id=user_id,
        type=tx.type,
        amount=tx.amount,
        currency=tx.currency,
        amount_base=tx.amount_base,
        exchange_rate=tx.exchange_rate,
        category_id=tx.category_id,
        description=tx.description,
        source=tx.source,
        raw_text=tx.raw_text,
        transaction_date=tx.transaction_date
    )
    db.add(db_tx)
    await db.commit()
    await db.refresh(db_tx)
    return db_tx

async def get_transactions(db: AsyncSession, user_id: str, category_id=None, start_date=None, end_date=None):
    query = select(Transaction).where(Transaction.user_id == user_id)
    if category_id:
        query = query.where(Transaction.category_id == category_id)
    result = await db.execute(query)
    return result.scalars().all()
