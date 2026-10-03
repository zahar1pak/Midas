from fastapi import APIRouter, Depends, HTTPException
import uuid
from app.services.ranking_service import calculate_group_rankings

router = APIRouter(prefix="/groups", tags=["rankings"])

@router.get("/{id}/rankings")
def get_group_rankings(id: uuid.UUID):
    """
    Get ranking for group.
    Response includes: user, total_income, total_expenses, rank_income, rank_expenses.
    Marks king (top earner) and jester (top spender).
    Only includes users who have privacy_show_income=true or privacy_show_expenses=true.
    """
    return calculate_group_rankings(id)
