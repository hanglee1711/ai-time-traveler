"""
Create a test user for Viet Su Ky
Run this after database is initialized
"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent / 'backend'))

from flask import Flask
from backend.models import db, User, GameStats

print("=" * 70)
print("CREATING TEST USER")
print("=" * 70)

# Create Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vietsuky.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

with app.app_context():
    # Check if user already exists
    existing_user = User.query.filter_by(username='hangtri1711').first()

    if existing_user:
        print(f"[INFO] User 'hangtri1711' already exists!")
        print(f"   - Email: {existing_user.email}")
        print(f"   - Display Name: {existing_user.display_name}")
        print(f"   - Level: {existing_user.level}")
        print(f"   - XP: {existing_user.xp}")
    else:
        # Create test user
        user = User(
            username='hangtri1711',
            email='hangtri1711@gmail.com',
            display_name='Hằng Tri'
        )
        user.set_password('Hangtri1711@')

        db.session.add(user)
        db.session.flush()  # Get user ID

        # Create game stats for user
        game_stats = GameStats(user_id=user.id)
        db.session.add(game_stats)

        db.session.commit()

        print("[OK] Test user created successfully!")
        print(f"   - Username: hangtri1711")
        print(f"   - Email: hangtri1711@gmail.com")
        print(f"   - Password: Hangtri1711@")
        print(f"   - Display Name: Hằng Tri")

print("=" * 70)
print("TEST USER SETUP COMPLETE!")
print("=" * 70)
