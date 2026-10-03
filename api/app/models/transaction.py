from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Enum, Text, func
from sqlalchemy.orm import relationship
import uuid
import enum
from app.database import Base

class TransactionType(str, enum.Enum):
    income = 'income'
    expense = 'expense'
    saving = 'saving'

class Transaction(Base):
    __tablename__ = 'transactions'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'))
    type = Column(Enum(TransactionType))
    amount = Column(Numeric(15, 2))
    currency = Column(String(5))
    amount_base = Column(Numeric(15, 2))
    exchange_rate = Column(Numeric(15, 6))
    category_id = Column(String, ForeignKey('categories.id'))
    description = Column(Text, nullable=True)
    source = Column(String(20))
    raw_text = Column(Text, nullable=True)
    transaction_date = Column(DateTime(timezone=True), default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="transactions")
    category = relationship("Category")
    tags = relationship("Tag", secondary="transaction_tags", back_populates="transactions")
