from sqlalchemy.orm import Session
from app.models.trade import Trade
from app.schemas.trade import TradeCreate, TradeUpdate
from typing import List


def get_trades(db: Session, user_id: str) -> List[Trade]:
    """Get all trades for a user."""
    return db.query(Trade).filter(Trade.user_id == user_id).all()


def get_trade(db: Session, trade_id: str, user_id: str):
    """Get a single trade by ID."""
    return db.query(Trade).filter(
        Trade.id == trade_id,
        Trade.user_id == user_id
    ).first()


def create_trade(db: Session, trade: TradeCreate, user_id: str):
    """Create a new trade."""
    db_trade = Trade(
        asset_name=trade.asset_name,
        asset_type=trade.asset_type,
        status=trade.status,
        trade_date_open=trade.trade_date_open,
        trade_date_close=trade.trade_date_close,
        entry_price=trade.entry_price,
        exit_price=trade.exit_price,
        position_size=trade.position_size,
        reason_for_entry=trade.reason_for_entry,
        notes=trade.notes,
        rr=trade.rr,
        pl=trade.pl,
        is_win=trade.is_win,
        image_url=trade.image_url,
        strategy_id=trade.strategy_id,
        user_id=user_id,
    )
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade


def update_trade(db: Session, trade_id: str, trade: TradeUpdate, user_id: str):
    """Update an existing trade."""
    db_trade = get_trade(db, trade_id, user_id)
    if db_trade:
        db_trade.asset_name = trade.asset_name
        db_trade.asset_type = trade.asset_type
        db_trade.status = trade.status
        db_trade.trade_date_open = trade.trade_date_open
        db_trade.trade_date_close = trade.trade_date_close
        db_trade.entry_price = trade.entry_price
        db_trade.exit_price = trade.exit_price
        db_trade.position_size = trade.position_size
        db_trade.reason_for_entry = trade.reason_for_entry
        db_trade.notes = trade.notes
        db_trade.rr = trade.rr
        db_trade.pl = trade.pl
        db_trade.is_win = trade.is_win
        db_trade.image_url = trade.image_url
        db_trade.strategy_id = trade.strategy_id
        db.commit()
        db.refresh(db_trade)
    return db_trade


def delete_trade(db: Session, trade_id: str, user_id: str):
    """Delete a trade."""
    db_trade = get_trade(db, trade_id, user_id)
    if db_trade:
        db.delete(db_trade)
        db.commit()
        return True
    return False
