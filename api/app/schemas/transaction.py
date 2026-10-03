from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class TransactionBase(BaseModel):
    type: str
    amount: Decimal
    currency: str
    amount_base: Decimal
    exchange_rate: Decimal
    category_id: str
    description: Optional[str] = None
    source: str
    raw_text: Optional[str] = None
    transaction_date: datetime

class TransactionCreate(TransactionBase):
    tag_ids: Optional[List[str]] = []

class TransactionResponse(TransactionBase):
    id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
