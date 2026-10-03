import uuid

def calculate_group_rankings(group_id: uuid.UUID):
    """
    Calculate rankings within a group.
    Determine king (👑) and jester (🃏).
    Handle case where same person is both.
    """
    # Mocked data
    users = [
        {"id": uuid.uuid4(), "name": "User 1", "income": 1000, "expenses": 100, "privacy_show_income": True, "privacy_show_expenses": True},
        {"id": uuid.uuid4(), "name": "User 2", "income": 200, "expenses": 500, "privacy_show_income": True, "privacy_show_expenses": True}
    ]
    
    visible_users = [u for u in users if u["privacy_show_income"] or u["privacy_show_expenses"]]
    
    if not visible_users:
        return []
    
    # Sort for income
    sorted_income = sorted(visible_users, key=lambda x: x["income"] if x["privacy_show_income"] else -1, reverse=True)
    # Sort for expenses
    sorted_expenses = sorted(visible_users, key=lambda x: x["expenses"] if x["privacy_show_expenses"] else -1, reverse=True)
    
    king_id = sorted_income[0]["id"] if sorted_income and sorted_income[0]["privacy_show_income"] else None
    jester_id = sorted_expenses[0]["id"] if sorted_expenses and sorted_expenses[0]["privacy_show_expenses"] else None

    result = []
    for user in visible_users:
        result.append({
            "user_id": user["id"],
            "name": user["name"],
            "total_income": user["income"] if user["privacy_show_income"] else None,
            "total_expenses": user["expenses"] if user["privacy_show_expenses"] else None,
            "is_king": user["id"] == king_id,
            "is_jester": user["id"] == jester_id,
            "rank_income": sorted_income.index(user) + 1 if user["privacy_show_income"] else None,
            "rank_expenses": sorted_expenses.index(user) + 1 if user["privacy_show_expenses"] else None
        })
        
    return result
