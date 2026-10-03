from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    telegram_id: int
    username: Optional[str] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    base_currency: Optional[str] = "RUB"
    privacy_show_income: Optional[bool] = False
    privacy_show_expenses: Optional[bool] = False

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
