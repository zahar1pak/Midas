from sqlalchemy import Column, String, Boolean, DateTime, BigInteger, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    telegram_id = Column(BigInteger, unique=True, index=True)
    username = Column(String(100), nullable=True)
    display_name = Column(String(200), nullable=True)
    avatar_url = Column(String, nullable=True)
    base_currency = Column(String(5), default='RUB')
    pin_hash = Column(String(256), nullable=True)
    privacy_show_income = Column(Boolean, default=False)
    privacy_show_expenses = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    transactions = relationship("Transaction", back_populates="user")
    categories = relationship("Category", back_populates="user")
    tags = relationship("Tag", back_populates="user")
