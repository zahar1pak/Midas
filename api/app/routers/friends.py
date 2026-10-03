from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid

from app.database import get_db
from app.models.user import User
from app.models.friendship import Friendship, FriendshipStatus

router = APIRouter(prefix="/friends", tags=["friends"])

class FriendRequestPayload(BaseModel):
    friend_id: str

async def get_current_user(db: AsyncSession) -> User:
    """Helper to get or seed a default user for active session"""
    stmt = select(User).limit(1)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            telegram_id=8726556932,
            username="midas_bro",
            display_name="Бро Мастер",
            base_currency="RUB"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # Seed demo users for search only, without automatically creating friendships
    count_stmt = select(User)
    all_users = (await db.execute(count_stmt)).scalars().all()
    if len(all_users) < 4:
        seed_users = [
            User(id=str(uuid.uuid4()), telegram_id=1111111, username="sanya_crypto", display_name="Саня Трейдер", base_currency="RUB"),
            User(id=str(uuid.uuid4()), telegram_id=2222222, username="alina_design", display_name="Алина", base_currency="RUB"),
            User(id=str(uuid.uuid4()), telegram_id=3333333, username="max_chill", display_name="Максончик", base_currency="RUB"),
            User(id=str(uuid.uuid4()), telegram_id=4444444, username="artem_dev", display_name="Тёма Кодер", base_currency="USD"),
        ]
        for u in seed_users:
            db.add(u)
        await db.commit()

    return user

@router.get("/")
async def list_friends(db: AsyncSession = Depends(get_db)):
    """List real friends and pending requests for current user"""
    current_user = await get_current_user(db)
    
    # 1. Accepted friends
    stmt_friends = select(Friendship).where(
        or_(
            and_(Friendship.user_id == current_user.id, Friendship.status == FriendshipStatus.accepted),
            and_(Friendship.friend_id == current_user.id, Friendship.status == FriendshipStatus.accepted)
        )
    )
    res_friends = await db.execute(stmt_friends)
    friendships = res_friends.scalars().all()

    friends_list = []
    for f in friendships:
        other_id = f.friend_id if f.user_id == current_user.id else f.user_id
        u_res = await db.execute(select(User).where(User.id == other_id))
        other_user = u_res.scalar_one_or_none()
        if other_user:
            friends_list.append({
                "friendship_id": f.id,
                "user_id": other_user.id,
                "username": other_user.username or "без ника",
                "display_name": other_user.display_name or "Бро",
                "status": "friend"
            })

    # 2. Pending requests (incoming where friend_id is current_user)
    stmt_pending = select(Friendship).where(
        and_(Friendship.friend_id == current_user.id, Friendship.status == FriendshipStatus.pending)
    )
    res_pending = await db.execute(stmt_pending)
    pending_friendships = res_pending.scalars().all()

    pending_list = []
    for f in pending_friendships:
        u_res = await db.execute(select(User).where(User.id == f.user_id))
        sender = u_res.scalar_one_or_none()
        if sender:
            pending_list.append({
                "friendship_id": f.id,
                "user_id": sender.id,
                "username": sender.username or "без ника",
                "display_name": sender.display_name or "Новый бро",
                "status": "pending"
            })

    return {
        "friends": friends_list,
        "pending": pending_list
    }

@router.get("/search")
async def search_users(query: str = Query(...), db: AsyncSession = Depends(get_db)):
    """Search registered users by username or display_name"""
    current_user = await get_current_user(db)
    q = f"%{query.strip().lower()}%"
    stmt = select(User).where(
        and_(
            User.id != current_user.id,
            or_(
                User.username.ilike(q),
                User.display_name.ilike(q)
            )
        )
    ).limit(10)
    res = await db.execute(stmt)
    users = res.scalars().all()
    
    return [
        {
            "id": u.id,
            "username": u.username or "без ника",
            "display_name": u.display_name or "Бро",
        }
        for u in users
    ]

@router.post("/request")
async def send_friend_request(payload: FriendRequestPayload, db: AsyncSession = Depends(get_db)):
    """Send friend request to another user"""
    current_user = await get_current_user(db)
    target_id = payload.friend_id

    if target_id == current_user.id:
        raise HTTPException(status_code=400, detail="Нельзя добавить самого себя, бро!")

    # Check if existing relationship
    stmt = select(Friendship).where(
        or_(
            and_(Friendship.user_id == current_user.id, Friendship.friend_id == target_id),
            and_(Friendship.user_id == target_id, Friendship.friend_id == current_user.id)
        )
    )
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        if existing.status == FriendshipStatus.accepted:
            return {"status": "already_friends", "message": "Вы уже друзья, бро! 👊"}
        existing.status = FriendshipStatus.pending
        await db.commit()
        return {"status": "pending", "message": "Заявка отправлена! 🚀"}

    new_f = Friendship(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        friend_id=target_id,
        status=FriendshipStatus.pending
    )
    db.add(new_f)
    await db.commit()
    return {"status": "pending", "message": "Заявка отправлена! 🚀"}

@router.post("/accept/{id}")
async def accept_friend_request(id: str, db: AsyncSession = Depends(get_db)):
    """Accept an incoming friend request"""
    stmt = select(Friendship).where(Friendship.id == id)
    res = await db.execute(stmt)
    friendship = res.scalar_one_or_none()
    if not friendship:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    friendship.status = FriendshipStatus.accepted
    await db.commit()
    return {"status": "accepted", "message": "Заявка принята, теперь вы бро! 👊"}

@router.post("/reject/{id}")
async def reject_friend_request(id: str, db: AsyncSession = Depends(get_db)):
    """Reject an incoming friend request"""
    stmt = select(Friendship).where(Friendship.id == id)
    res = await db.execute(stmt)
    friendship = res.scalar_one_or_none()
    if not friendship:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    friendship.status = FriendshipStatus.rejected
    await db.commit()
    return {"status": "rejected", "message": "Заявка отклонена"}

@router.delete("/{id}")
async def remove_friend(id: str, db: AsyncSession = Depends(get_db)):
    """Remove friend or cancel friendship"""
    stmt = select(Friendship).where(Friendship.id == id)
    res = await db.execute(stmt)
    friendship = res.scalar_one_or_none()
    if friendship:
        await db.delete(friendship)
        await db.commit()
    return {"status": "deleted", "message": "Удален из друзей"}
