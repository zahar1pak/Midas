from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.services.auth_service import create_access_token, verify_telegram_data
from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

class AuthRequest(BaseModel):
    initData: Optional[str] = None
    telegram_id: Optional[int] = None
    username: Optional[str] = None
    display_name: Optional[str] = None

@router.post("/login")
async def login(req: AuthRequest, db: AsyncSession = Depends(get_db)):
    tg_id = None
    username = req.username
    display_name = req.display_name

    if req.initData:
        user_data = verify_telegram_data(req.initData)
        if user_data:
            tg_id = user_data.get("id")
            username = user_data.get("username", username)
            display_name = user_data.get("first_name", display_name)

    if not tg_id and req.telegram_id:
        tg_id = req.telegram_id

    if not tg_id:
        tg_id = 999999999 # fallback for guest/dev login

    # Get or create user
    stmt = select(User).where(User.telegram_id == tg_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            telegram_id=tg_id,
            username=username,
            display_name=display_name or "Бро",
            base_currency="RUB"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "telegram_id": tg_id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "telegram_id": user.telegram_id,
            "username": user.username,
            "display_name": user.display_name,
            "base_currency": user.base_currency
        }
    }
