from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Dict, Any, List
import tempfile
import os
from pydantic import BaseModel

from app.services.ai_service import ai_service
from app.services.voice_service import voice_service

router = APIRouter(prefix="/ai", tags=["ai_advice"])

class AskRequest(BaseModel):
    question: str

class AnalyzeRequest(BaseModel):
    transactions: List[Dict[str, Any]]

@router.post("/parse-voice")
async def parse_voice(file: UploadFile = File(...)):
    """Upload voice file, get transcription + parsed transaction"""
    try:
        # Save temp file
        suffix = os.path.splitext(file.filename)[1] if file.filename else ".ogg"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Transcribe
        transcription = await voice_service.process_voice_message(tmp_path)
        
        # Cleanup
        os.unlink(tmp_path)
        
        if not transcription or "не умею" in transcription:
            return {"transcription": transcription, "parsed": None}
            
        # Parse text to transaction
        parsed_transaction = await ai_service.parse_transaction_text(transcription)
        
        return {
            "transcription": transcription,
            "parsed": parsed_transaction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
async def analyze_spending(request: AnalyzeRequest):
    """Spending analysis based on transactions list"""
    analysis = await ai_service.analyze_spending(request.transactions)
    return {"analysis": analysis}

@router.get("/advice")
async def get_advice():
    """Get personalized AI financial advice/tips"""
    # In a real app we'd fetch user_data from DB based on current_user
    user_data = {"base_currency": "RUB", "recent_spend": 5000}
    tips = await ai_service.get_saving_tips(user_data)
    return {"tips": tips}

@router.post("/ask")
async def ask_question(request: AskRequest):
    """Ask specific financial question"""
    # Simple direct QA using analyze_spending wrapper or similar logic
    # For now, just a stub
    answer = f"Бро, ты спросил: '{request.question}'. Это сложный вопрос, но я уверен, что главное — не тратить всё на пиццу! 🍕"
    return {"answer": answer}
