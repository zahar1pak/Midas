from fastapi import APIRouter, Depends, Query
from typing import Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction, TransactionType

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/summary")
async def stats_summary(
    period: str = "month",
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    currency: Optional[str] = "RUB",
    telegram_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """Real aggregate income, expenses and savings from DB."""
    user = None
    if telegram_id:
        u_res = await db.execute(select(User).where(User.telegram_id == telegram_id))
        user = u_res.scalar_one_or_none()

    stmt = select(Transaction)
    if user:
        stmt = stmt.where(Transaction.user_id == user.id)

    res = await db.execute(stmt)
    tx_list = res.scalars().all()

    income = sum(float(t.amount) for t in tx_list if t.type == TransactionType.income or str(t.type) == "income")
    expenses = sum(float(t.amount) for t in tx_list if t.type == TransactionType.expense or str(t.type) == "expense")
    savings = sum(float(t.amount) for t in tx_list if t.type == TransactionType.saving or str(t.type) == "saving")
    net = income - expenses - savings

    return {
        "income": income,
        "total_income": income,
        "expenses": expenses,
        "total_expenses": expenses,
        "savings": savings,
        "total_savings": savings,
        "net": net,
        "currency": currency,
        "trend_income": 0.0,
        "trend_expenses": 0.0
    }

@router.get("/by-category")
def stats_by_category(
    period: str = "month",
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    currency: Optional[str] = "RUB"
):
    """Breakdown by category."""
    return get_by_category(period, start_date, end_date, currency)

@router.get("/by-date")
def stats_by_date(
    period: str = "month",
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    currency: Optional[str] = "RUB"
):
    """Daily/weekly/monthly aggregation."""
    return get_by_date(period, start_date, end_date, currency)

@router.get("/trends")
def stats_trends(
    period: str = "month",
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    currency: Optional[str] = "RUB"
):
    """Income/expense trends over time."""
    return get_trends(period, start_date, end_date, currency)
