from sqlalchemy import Column, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
import uuid
import enum
from app.database import Base

class CategoryType(str, enum.Enum):
    income = 'income'
    expense = 'expense'
    both = 'both'

class Category(Base):
    __tablename__ = 'categories'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'), nullable=True)
    name = Column(String(100))
    icon = Column(String(10))
    type = Column(Enum(CategoryType))
    is_system = Column(Boolean, default=False)
    color = Column(String(7), nullable=True)

    user = relationship("User", back_populates="categories")
