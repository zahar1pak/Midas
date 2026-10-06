from sqlalchemy import Column, String, BigInteger, DateTime, func
import uuid
from app.database import Base

class SupportMessage(Base):
    __tablename__ = 'support_messages'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    telegram_id = Column(BigInteger, nullable=True)
    username = Column(String(100), nullable=True)
    text = Column(String, nullable=False)
    status = Column(String(50), default='open')
    admin_reply = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    replied_at = Column(DateTime(timezone=True), nullable=True)
