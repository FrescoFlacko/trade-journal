from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class StrategyBase(BaseModel):
    name: str
    description: Optional[str] = None
    asset_types: List[str] = []


class StrategyCreate(StrategyBase):
    pass


class StrategyUpdate(StrategyBase):
    pass


class Strategy(StrategyBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
