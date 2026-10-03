from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.user import UserResponse

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/", response_model=dict)
async def get_profile(db: AsyncSession = Depends(get_db)):
    return {"status": "ok"}
