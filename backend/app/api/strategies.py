from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.strategy import Strategy, StrategyCreate, StrategyUpdate
from app.crud import strategy as strategy_crud
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[Strategy])
def get_strategies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all strategies for the current user."""
    return strategy_crud.get_strategies(db, user_id=current_user.id)


@router.post("/", response_model=Strategy, status_code=status.HTTP_201_CREATED)
def create_strategy(
    strategy: StrategyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new strategy."""
    return strategy_crud.create_strategy(db, strategy=strategy, user_id=current_user.id)


@router.put("/{strategy_id}", response_model=Strategy)
def update_strategy(
    strategy_id: str,
    strategy: StrategyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing strategy."""
    db_strategy = strategy_crud.update_strategy(
        db, strategy_id=strategy_id, strategy=strategy, user_id=current_user.id
    )
    if not db_strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found"
        )
    return db_strategy


@router.delete("/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_strategy(
    strategy_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a strategy."""
    success = strategy_crud.delete_strategy(db, strategy_id=strategy_id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found"
        )
    return None
