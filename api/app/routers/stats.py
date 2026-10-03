from fastapi import APIRouter, Depends, Query
from typing import Optional
from datetime import date
from app.services.stats_service import get_summary, get_by_category, get_by_date, get_trends

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/summary")
def stats_summary(
    period: str = "month",
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    currency: Optional[str] = "RUB"
):
    """Total income/expenses for period."""
    return get_summary(period, start_date, end_date, currency)

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
