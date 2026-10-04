from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Импортируем все модели чтобы Base.metadata знал о них
    import app.models.user
    import app.models.transaction
    import app.models.category
    import app.models.tag
    import app.models.transaction_tags
    import app.models.friendship
    import app.models.group
    # Создаём таблицы автоматически (для SQLite dev mode)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[MIDAS] API started! DB tables created.")
    yield
    print("[MIDAS] API stopped.")

app = FastAPI(title="Midas API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Midas API"}

from app.routers import (
    auth, transactions, categories, tags, profile,
    friends, groups, rankings, stats, currency, ai_advice,
)

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(categories.router)
app.include_router(tags.router)
app.include_router(profile.router)
app.include_router(friends.router)
app.include_router(groups.router)
app.include_router(rankings.router)
app.include_router(stats.router)
app.include_router(currency.router)
app.include_router(ai_advice.router)
