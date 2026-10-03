from pydantic import BaseModel, ConfigDict
from typing import Optional

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: str
    user_id: Optional[str] = None
    is_system: bool

    model_config = ConfigDict(from_attributes=True)
