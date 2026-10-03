from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.schemas.tag import TagResponse

router = APIRouter(prefix="/tags", tags=["tags"])

@router.get("/", response_model=List[TagResponse])
async def get_tags(db: AsyncSession = Depends(get_db)):
    return []
