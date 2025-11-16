from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base


class Trade(Base):
    __tablename__ = "trades"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    asset_name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False)
    status = Column(String, nullable=False)  # 'open' or 'closed'
    trade_date_open = Column(DateTime, nullable=False)
    trade_date_close = Column(DateTime, nullable=True)
    entry_price = Column(Float, nullable=False)
    exit_price = Column(Float, nullable=True)
    position_size = Column(Float, nullable=False)
    reason_for_entry = Column(String)
    notes = Column(String)
    rr = Column(Float, nullable=True)  # Risk/Reward ratio
    pl = Column(Float, nullable=True)  # Profit/Loss
    is_win = Column(Boolean, nullable=True)
    image_url = Column(String, nullable=True)

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    strategy_id = Column(String, ForeignKey("strategies.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    user = relationship("User", back_populates="trades")
    strategy = relationship("Strategy", back_populates="trades")
