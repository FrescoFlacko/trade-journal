"""Seed the database with a test user and sample data."""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User
from app.models.strategy import Strategy
from app.models.trade import Trade
from datetime import datetime, timedelta
import random


def seed_database():
    """Seed the database with test data."""
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.username == "demo").first()
        if existing_user:
            print("Test user already exists. Skipping seed.")
            return

        # Create test user
        print("Creating test user...")
        test_user = User(
            email="demo@tradejournal.com",
            username="demo",
            hashed_password=get_password_hash("demo123"),
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        print(f"✓ Created test user: username='demo', password='demo123'")

        # Create sample strategies
        print("\nCreating sample strategies...")
        strategies = [
            Strategy(
                name="Breakout Strategy",
                description="Trade breakouts above key resistance levels",
                asset_types=["stocks", "crypto"],
                user_id=test_user.id,
            ),
            Strategy(
                name="Mean Reversion",
                description="Buy oversold, sell overbought conditions",
                asset_types=["stocks", "swing"],
                user_id=test_user.id,
            ),
            Strategy(
                name="Trend Following",
                description="Follow the trend with proper risk management",
                asset_types=["crypto", "swing"],
                user_id=test_user.id,
            ),
        ]

        for strategy in strategies:
            db.add(strategy)
        db.commit()
        for strategy in strategies:
            db.refresh(strategy)
        print(f"✓ Created {len(strategies)} strategies")

        # Create sample trades
        print("\nCreating sample trades...")
        assets = [
            ("AAPL", "stocks"),
            ("TSLA", "stocks"),
            ("BTC/USD", "crypto"),
            ("ETH/USD", "crypto"),
            ("SPY", "swing"),
            ("QQQ", "swing"),
        ]

        trades = []
        base_date = datetime.now() - timedelta(days=60)

        for i in range(20):
            asset_name, asset_type = random.choice(assets)
            strategy = random.choice(strategies)

            # Random trade parameters
            entry_price = random.uniform(50, 500)
            is_closed = random.choice([True, True, True, False])  # 75% closed

            trade_date_open = base_date + timedelta(days=random.randint(0, 50))

            trade = Trade(
                asset_name=asset_name,
                asset_type=asset_type,
                status="closed" if is_closed else "open",
                trade_date_open=trade_date_open,
                entry_price=entry_price,
                position_size=random.uniform(10, 100),
                reason_for_entry=f"Strong signal on {asset_name}",
                strategy_id=strategy.id,
                user_id=test_user.id,
            )

            if is_closed:
                # Calculate exit and P&L
                win = random.choice([True, True, False])  # 66% win rate
                percent_change = random.uniform(1, 10) if win else random.uniform(-8, -1)
                exit_price = entry_price * (1 + percent_change / 100)
                pl = (exit_price - entry_price) * trade.position_size

                trade.trade_date_close = trade_date_open + timedelta(days=random.randint(1, 10))
                trade.exit_price = exit_price
                trade.pl = pl
                trade.is_win = win
                trade.rr = random.uniform(1.5, 3.5) if win else random.uniform(0.5, 1.5)

            trades.append(trade)

        for trade in trades:
            db.add(trade)
        db.commit()
        print(f"✓ Created {len(trades)} sample trades")

        print("\n" + "="*50)
        print("✓ Database seeded successfully!")
        print("="*50)
        print("\nTest Account Credentials:")
        print("  Username: demo")
        print("  Password: demo123")
        print("  Email:    demo@tradejournal.com")
        print("\nYou can now login with these credentials.")
        print("="*50)

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
