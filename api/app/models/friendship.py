from sqlalchemy import Column, String, ForeignKey, Enum, DateTime, func
from sqlalchemy.orm import relationship
import uuid
import enum
from app.database import Base

class FriendshipStatus(str, enum.Enum):
    pending = 'pending'
    accepted = 'accepted'
    rejected = 'rejected'

class Friendship(Base):
    __tablename__ = 'friendships'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'))
    friend_id = Column(String, ForeignKey('users.id'))
    status = Column(Enum(FriendshipStatus), default=FriendshipStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
