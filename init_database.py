"""
Initialize database tables for Viet Su Ky
"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent / 'backend'))

from flask import Flask
from backend.models import db

print("=" * 70)
print("INITIALIZING DATABASE TABLES")
print("=" * 70)

# Create Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vietsuky.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

with app.app_context():
    # Create all tables
    db.create_all()
    print("[OK] Database tables created successfully!")

    # Verify tables
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()

    print(f"[OK] Tables created: {len(tables)}")
    for table in tables:
        print(f"   - {table}")

print("=" * 70)
print("DATABASE INITIALIZATION COMPLETE!")
print("=" * 70)
