from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
from app.services.currency_service import currency_service, FIAT_CURRENCIES, CRYPTO_CURRENCIES

router = APIRouter(prefix="/currency", tags=["currency"])

@router.get("/rates")
async def get_rates() -> Dict[str, float]:
    """Get all fiat exchange rates relative to USD"""
    return await currency_service.get_fiat_rates()

@router.get("/crypto")
async def get_crypto_rates() -> Dict[str, float]:
    """Get all crypto exchange rates in USD"""
    return await currency_service.get_crypto_rates()

@router.get("/convert")
async def convert_currency(
    amount: float = Query(..., gt=0),
    from_currency: str = Query(..., alias="from"),
    to_currency: str = Query(..., alias="to")
) -> Dict[str, Any]:
    """Convert amount between any supported currencies"""
    try:
        result = await currency_service.convert(amount, from_currency, to_currency)
        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "result": result
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/supported")
async def get_supported_currencies() -> Dict[str, List[str]]:
    """List supported fiat and crypto currencies"""
    return {
        "fiat": FIAT_CURRENCIES,
        "crypto": CRYPTO_CURRENCIES
    }
