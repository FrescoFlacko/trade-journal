from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.trade import Trade, TradeCreate, TradeUpdate
from app.crud import trade as trade_crud
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[Trade])
def get_trades(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all trades for the current user."""
    return trade_crud.get_trades(db, user_id=current_user.id)


@router.get("/{trade_id}", response_model=Trade)
def get_trade(
    trade_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single trade by ID."""
    trade = trade_crud.get_trade(db, trade_id=trade_id, user_id=current_user.id)
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found"
        )
    return trade


@router.post("/", response_model=Trade, status_code=status.HTTP_201_CREATED)
def create_trade(
    trade: TradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new trade."""
    return trade_crud.create_trade(db, trade=trade, user_id=current_user.id)


@router.put("/{trade_id}", response_model=Trade)
def update_trade(
    trade_id: str,
    trade: TradeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing trade."""
    db_trade = trade_crud.update_trade(
        db, trade_id=trade_id, trade=trade, user_id=current_user.id
    )
    if not db_trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found"
        )
    return db_trade


@router.delete("/{trade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trade(
    trade_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a trade."""
    success = trade_crud.delete_trade(db, trade_id=trade_id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found"
        )
    return None
