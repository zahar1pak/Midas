from datetime import datetime, timedelta
from jose import jwt
from app.config import settings

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")
    return encoded_jwt

def verify_telegram_data(init_data: str):
    # Mock implementation
    return {"id": 123456789, "first_name": "Test"}
