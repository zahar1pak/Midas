from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class Tag(Base):
    __tablename__ = 'tags'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'), nullable=True)
    name = Column(String(100))
    is_system = Column(Boolean, default=False)

    user = relationship("User", back_populates="tags")
    transactions = relationship("Transaction", secondary="transaction_tags", back_populates="tags")
