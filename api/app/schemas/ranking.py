from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RankingUserResponse(BaseModel):
    user_id: str
    display_name: str
    avatar_url: Optional[str]
    total_income: float
    total_expense: float
    is_king: bool = False
    is_joker: bool = False

class RankingResponse(BaseModel):
    group_id: str
    currency: str
    period_start: datetime
    period_end: datetime
    rankings: list[RankingUserResponse]
