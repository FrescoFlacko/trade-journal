from sqlalchemy.orm import Session
from app.models.strategy import Strategy
from app.schemas.strategy import StrategyCreate, StrategyUpdate
from typing import List


def get_strategies(db: Session, user_id: str) -> List[Strategy]:
    """Get all strategies for a user."""
    return db.query(Strategy).filter(Strategy.user_id == user_id).all()


def get_strategy(db: Session, strategy_id: str, user_id: str):
    """Get a single strategy by ID."""
    return db.query(Strategy).filter(
        Strategy.id == strategy_id,
        Strategy.user_id == user_id
    ).first()


def create_strategy(db: Session, strategy: StrategyCreate, user_id: str):
    """Create a new strategy."""
    db_strategy = Strategy(
        name=strategy.name,
        description=strategy.description,
        asset_types=strategy.asset_types,
        user_id=user_id,
    )
    db.add(db_strategy)
    db.commit()
    db.refresh(db_strategy)
    return db_strategy


def update_strategy(db: Session, strategy_id: str, strategy: StrategyUpdate, user_id: str):
    """Update an existing strategy."""
    db_strategy = get_strategy(db, strategy_id, user_id)
    if db_strategy:
        db_strategy.name = strategy.name
        db_strategy.description = strategy.description
        db_strategy.asset_types = strategy.asset_types
        db.commit()
        db.refresh(db_strategy)
    return db_strategy


def delete_strategy(db: Session, strategy_id: str, user_id: str):
    """Delete a strategy."""
    db_strategy = get_strategy(db, strategy_id, user_id)
    if db_strategy:
        db.delete(db_strategy)
        db.commit()
        return True
    return False
