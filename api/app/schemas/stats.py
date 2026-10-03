from pydantic import BaseModel
from typing import Dict, List, Any
from datetime import datetime

class CategoryStat(BaseModel):
    category_id: str
    category_name: str
    amount: float
    currency: str

class StatsResponse(BaseModel):
    total_income: float
    total_expense: float
    currency: str
    period_start: datetime
    period_end: datetime
    by_category: List[CategoryStat]
