from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TradeBase(BaseModel):
    asset_name: str
    asset_type: str
    status: str
    trade_date_open: datetime
    trade_date_close: Optional[datetime] = None
    entry_price: float
    exit_price: Optional[float] = None
    position_size: float
    reason_for_entry: Optional[str] = None
    notes: Optional[str] = None
    rr: Optional[float] = None
    pl: Optional[float] = None
    is_win: Optional[bool] = None
    image_url: Optional[str] = None
    strategy_id: Optional[str] = None


class TradeCreate(TradeBase):
    pass


class TradeUpdate(TradeBase):
    pass


class Trade(TradeBase):
    id: str

    class Config:
        from_attributes = True
