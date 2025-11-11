"""
VIỆT SỬ KÝ - Authentication Helper
JWT-based authentication
"""

import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from backend.models import User

# Secret key for JWT - should be in environment variables
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'viet-su-ky-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 7 * 24 * 60 * 60  # 7 days


def generate_token(user_id):
    """Generate JWT token for user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token


def decode_token(token):
    """Decode JWT token and return user_id"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token


def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get token from header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                # Format: "Bearer <token>"
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        # Decode token
        user_id = decode_token(token)
        if user_id is None:
            return jsonify({'error': 'Token is invalid or expired'}), 401

        # Get user from database
        from backend.models import db
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 401

        # Pass user to route function
        return f(user, *args, **kwargs)

    return decorated


def optional_token(f):
    """Decorator for routes that work with or without authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        user = None
        token = None

        # Try to get token from header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(' ')[1]
                user_id = decode_token(token)
                if user_id:
                    from backend.models import db
                    user = db.session.get(User, user_id)
            except:
                pass  # Ignore errors for optional auth

        # Pass user (or None) to route function
        return f(user, *args, **kwargs)

    return decorated


def validate_email(email):
    """Simple email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password):
    """
    Validate password strength
    Returns: (is_valid, error_message)
    """
    if len(password) < 6:
        return False, 'Mật khẩu phải có ít nhất 6 ký tự'

    if len(password) > 100:
        return False, 'Mật khẩu quá dài'

    # Check for at least one letter and one number
    has_letter = any(c.isalpha() for c in password)
    has_number = any(c.isdigit() for c in password)

    if not (has_letter and has_number):
        return False, 'Mật khẩu phải có cả chữ và số'

    return True, None


def validate_username(username):
    """
    Validate username
    Returns: (is_valid, error_message)
    """
    if len(username) < 3:
        return False, 'Tên đăng nhập phải có ít nhất 3 ký tự'

    if len(username) > 20:
        return False, 'Tên đăng nhập quá dài (tối đa 20 ký tự)'

    # Only allow alphanumeric and underscore
    import re
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'

    return True, None
