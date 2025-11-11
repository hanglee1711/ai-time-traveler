"""
VIỆT SỬ KÝ - Database Models
User authentication and game progress tracking
"""

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()


class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(100))
    avatar = db.Column(db.String(255), default='👤')

    # Password reset
    reset_token = db.Column(db.String(100))
    reset_token_expiry = db.Column(db.DateTime)

    # Profile
    level = db.Column(db.Integer, default=1)
    xp = db.Column(db.Integer, default=0)
    total_points = db.Column(db.Integer, default=0)

    # Learning streak
    current_streak = db.Column(db.Integer, default=0)
    longest_streak = db.Column(db.Integer, default=0)
    last_activity_date = db.Column(db.Date)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # Relationships
    game_stats = db.relationship('GameStats', backref='user', lazy=True, cascade='all, delete-orphan')
    achievements = db.relationship('Achievement', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)

    def generate_reset_token(self):
        """Generate a password reset token"""
        import secrets
        from datetime import timedelta

        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        return self.reset_token

    def verify_reset_token(self, token):
        """Check if reset token is valid"""
        if not self.reset_token or not self.reset_token_expiry:
            return False
        if self.reset_token != token:
            return False
        if datetime.utcnow() > self.reset_token_expiry:
            return False
        return True

    def clear_reset_token(self):
        """Clear reset token after use"""
        self.reset_token = None
        self.reset_token_expiry = None

    def add_xp(self, amount):
        """Add XP and handle leveling up"""
        self.xp += amount
        # Level up every 100 XP
        new_level = (self.xp // 100) + 1
        if new_level > self.level:
            self.level = new_level
            return True  # Leveled up
        return False

    def update_streak(self):
        """Update learning streak based on current date"""
        from datetime import date, timedelta

        today = date.today()

        if self.last_activity_date is None:
            # First activity
            self.current_streak = 1
            self.longest_streak = 1
            self.last_activity_date = today
        elif self.last_activity_date == today:
            # Already did activity today
            pass
        elif self.last_activity_date == today - timedelta(days=1):
            # Consecutive day
            self.current_streak += 1
            if self.current_streak > self.longest_streak:
                self.longest_streak = self.current_streak
            self.last_activity_date = today
        else:
            # Streak broken
            self.current_streak = 1
            self.last_activity_date = today

    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email if include_sensitive else None,
            'display_name': self.display_name or self.username,
            'avatar': self.avatar,
            'level': self.level,
            'xp': self.xp,
            'total_points': self.total_points,
            'current_streak': self.current_streak,
            'longest_streak': self.longest_streak,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
        return data


class GameStats(db.Model):
    """Track user's game statistics"""
    __tablename__ = 'game_stats'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Quiz statistics
    quizzes_completed = db.Column(db.Integer, default=0)
    questions_answered = db.Column(db.Integer, default=0)
    questions_correct = db.Column(db.Integer, default=0)

    # Quiz Battle statistics
    battles_played = db.Column(db.Integer, default=0)
    battles_won = db.Column(db.Integer, default=0)
    battles_lost = db.Column(db.Integer, default=0)

    # Chatbot statistics
    conversations = db.Column(db.Integer, default=0)
    figures_met = db.Column(db.Text)  # JSON list of figure names
    years_visited = db.Column(db.Text)  # JSON list of years

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def add_figure(self, figure_name):
        """Add a figure to the met list"""
        figures = json.loads(self.figures_met) if self.figures_met else []
        if figure_name not in figures:
            figures.append(figure_name)
            self.figures_met = json.dumps(figures, ensure_ascii=False)

    def add_year(self, year):
        """Add a year to the visited list"""
        years = json.loads(self.years_visited) if self.years_visited else []
        if year not in years:
            years.append(year)
            self.years_visited = json.dumps(years, ensure_ascii=False)

    def to_dict(self):
        """Convert stats to dictionary"""
        return {
            'quizzes_completed': self.quizzes_completed,
            'questions_answered': self.questions_answered,
            'questions_correct': self.questions_correct,
            'accuracy': round((self.questions_correct / self.questions_answered * 100) if self.questions_answered > 0 else 0, 1),
            'battles_played': self.battles_played,
            'battles_won': self.battles_won,
            'battles_lost': self.battles_lost,
            'win_rate': round((self.battles_won / self.battles_played * 100) if self.battles_played > 0 else 0, 1),
            'conversations': self.conversations,
            'figures_met': json.loads(self.figures_met) if self.figures_met else [],
            'years_visited': json.loads(self.years_visited) if self.years_visited else []
        }


class Achievement(db.Model):
    """Track user achievements"""
    __tablename__ = 'achievements'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    achievement_id = db.Column(db.String(50), nullable=False)  # e.g., "first_quiz", "streak_7"
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    icon = db.Column(db.String(10))
    xp_reward = db.Column(db.Integer, default=0)

    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert achievement to dictionary"""
        return {
            'id': self.achievement_id,
            'title': self.title,
            'description': self.description,
            'icon': self.icon,
            'xp_reward': self.xp_reward,
            'unlocked_at': self.unlocked_at.isoformat() if self.unlocked_at else None
        }
