from fastapi import APIRouter, Depends, HTTPException
from typing import List
import uuid

router = APIRouter(prefix="/groups", tags=["groups"])

@router.post("/")
def create_group(name: str):
    """Create group."""
    return {"id": uuid.uuid4(), "name": name}

@router.get("/")
def list_groups():
    """List user's groups."""
    return []

@router.post("/{id}/members")
def add_member(id: uuid.UUID, user_id: uuid.UUID):
    """Add member."""
    return {"status": "added"}

@router.delete("/{id}/members/{user_id}")
def remove_member(id: uuid.UUID, user_id: uuid.UUID):
    """Remove member."""
    return {"status": "removed"}

@router.get("/{id}")
def group_details(id: uuid.UUID):
    """Group details."""
    return {"id": id, "name": "Group Name", "members": []}
