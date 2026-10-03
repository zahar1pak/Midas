from pydantic import BaseModel, ConfigDict
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    icon: str
    type: str
    color: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: str
    user_id: Optional[str] = None
    is_system: bool

    model_config = ConfigDict(from_attributes=True)
