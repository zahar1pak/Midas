from datetime import date
from typing import Optional

def get_summary(period: str, start_date: Optional[date], end_date: Optional[date], currency: str):
    """Aggregate transaction data, calculate trends, convert to requested currency."""
    return {
        "income": 50000,
        "expenses": 30000,
        "net": 20000,
        "currency": currency,
        "trend_income": 5.2,
        "trend_expenses": -1.1
    }

def get_by_category(period: str, start_date: Optional[date], end_date: Optional[date], currency: str):
    return [
        {"category": "Еда", "amount": 10000, "percentage": 33.3},
        {"category": "Транспорт", "amount": 5000, "percentage": 16.7},
        {"category": "Развлечения", "amount": 15000, "percentage": 50.0}
    ]

def get_by_date(period: str, start_date: Optional[date], end_date: Optional[date], currency: str):
    return [
        {"date": "2023-10-01", "income": 1000, "expenses": 500},
        {"date": "2023-10-02", "income": 0, "expenses": 200}
    ]

def get_trends(period: str, start_date: Optional[date], end_date: Optional[date], currency: str):
    return {
        "income_trend": "up",
        "expense_trend": "down"
    }
