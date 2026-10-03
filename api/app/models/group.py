from sqlalchemy import Column, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class Group(Base):
    __tablename__ = 'groups'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200))
    created_by = Column(String, ForeignKey('users.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GroupMember(Base):
    __tablename__ = 'group_members'
    group_id = Column(String, ForeignKey('groups.id'), primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), primary_key=True)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
