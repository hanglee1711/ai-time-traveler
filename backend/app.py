"""
VIỆT SỬ KÝ - Backend API
Flask server to handle frontend requests and connect with AI handlers
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os
from pathlib import Path
from datetime import datetime

# Add parent directory to path so we can import src module
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.ai_handler import get_ai_handler
from src.input_detector import InputDetector
from src.prompts import (
    get_roleplay_prompt,
    get_time_travel_prompt,
    get_general_prompt,
    get_greeting_prompt,
    get_unknown_figure_prompt
)
from src.avatar_generator import get_avatar_for_figure, get_figure_emoji

# Import auth and models
from backend.models import db, User, GameStats, Achievement
from backend.auth import (
    generate_token,
    token_required,
    optional_token,
    validate_email,
    validate_password,
    validate_username
)
from backend.api_protection import get_protection

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'viet-su-ky-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + str(Path(__file__).parent.parent / 'vietsuky.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
CORS(app)  # Enable CORS for frontend
db.init_app(app)

# Initialize components
base_dir = Path(__file__).parent.parent
figures_path = base_dir / 'data' / 'historical_figures.json'
events_path = base_dir / 'data' / 'historical_events.json'

detector = InputDetector(str(figures_path), str(events_path))
ai_handler = None

# Default provider
DEFAULT_PROVIDER = 'gemini'


# Static file routes
@app.route('/')
def index():
    """Serve main homepage"""
    return send_from_directory(str(base_dir / 'frontend'), 'index.html')

@app.route('/chatbot.html')
def chatbot():
    """Serve chatbot page"""
    return send_from_directory(str(base_dir / 'frontend'), 'chatbot.html')

@app.route('/chatbot_working.html')
def chatbot_working():
    """Serve working chatbot page"""
    return send_from_directory(str(base_dir / 'frontend'), 'chatbot_working.html')

@app.route('/chatbot_simple.html')
def chatbot_simple():
    """Serve simple chatbot page"""
    return send_from_directory(str(base_dir / 'frontend'), 'chatbot_simple.html')

@app.route('/timeline.html')
def timeline():
    """Serve timeline page"""
    return send_from_directory(str(base_dir / 'frontend'), 'timeline.html')

@app.route('/map.html')
def map_page():
    """Serve map page"""
    return send_from_directory(str(base_dir / 'frontend'), 'map.html')

@app.route('/game.html')
def game():
    """Serve game page"""
    return send_from_directory(str(base_dir / 'frontend'), 'game.html')

@app.route('/journey.html')
def journey():
    """Serve journey page"""
    return send_from_directory(str(base_dir / 'frontend'), 'journey.html')

@app.route('/quiz-battle.html')
def quiz_battle():
    """Serve quiz battle game"""
    return send_from_directory(str(base_dir / 'frontend'), 'quiz-battle.html')

@app.route('/test_game_auto.html')
def test_game_auto():
    """Serve auto test page"""
    return send_from_directory(str(base_dir), 'test_game_auto.html')

@app.route('/test_quiz_battle_flow.html')
def test_quiz_battle_flow():
    """Serve quiz battle flow test"""
    return send_from_directory(str(base_dir), 'test_quiz_battle_flow.html')

@app.route('/test_chatbot_simple.html')
def test_chatbot_simple():
    """Serve simple chatbot test"""
    return send_from_directory(str(base_dir), 'test_chatbot_simple.html')

@app.route('/test-avatars')
def test_avatars():
    """Serve avatar test page"""
    return send_from_directory(str(base_dir), 'test_avatars.html')

@app.route('/test-any-figure')
def test_any_figure():
    """Serve any figure test page"""
    return send_from_directory(str(base_dir), 'test_any_figure.html')

@app.route('/frontend/<path:filename>')
def serve_frontend(filename):
    """Serve frontend static files"""
    return send_from_directory(str(base_dir / 'frontend'), filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    """Serve CSS files"""
    return send_from_directory(str(base_dir / 'frontend' / 'css'), filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    """Serve JavaScript files"""
    return send_from_directory(str(base_dir / 'frontend' / 'js'), filename)

@app.route('/styles/<path:filename>')
def serve_styles(filename):
    """Serve style files"""
    return send_from_directory(str(base_dir / 'styles'), filename)

@app.route('/data/<path:filename>')
def serve_data(filename):
    """Serve data files"""
    return send_from_directory(str(base_dir / 'data'), filename)

@app.route('/hero-image.png')
def serve_hero_image():
    """Serve hero image"""
    return send_from_directory(str(base_dir / 'frontend'), 'hero-image.png')

@app.route('/background-music.mp3')
def serve_background_music():
    """Serve background music"""
    return send_from_directory(str(base_dir / 'frontend'), 'background-music.mp3', mimetype='audio/mpeg')


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Việt Sử Ký API is running'
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Handle chat requests with API protection (rate limiting + caching)
    Body: {
        "message": str,
        "figure": str (optional),
        "year": int (optional),
        "provider": str (optional, default: gemini)
    }
    """
    try:
        data = request.json
        user_message = data.get('message', '')
        figure_name = data.get('figure')
        year = data.get('year')
        provider = data.get('provider', DEFAULT_PROVIDER)

        if not user_message:
            return jsonify({'error': 'Message is required'}), 400

        # Get API protection instance
        protection = get_protection()
        protection.record_request()

        # Get client IP for rate limiting
        client_ip = request.remote_addr or 'unknown'

        # Check rate limit
        is_allowed, error_msg = protection.check_rate_limit(client_ip)
        if not is_allowed:
            return jsonify({
                'response': error_msg,
                'avatar_url': None,
                'rate_limited': True
            }), 429

        # Check cache for figure chat (only cache figure conversations)
        if figure_name:
            cached_response = protection.get_cached_response(figure_name, user_message)
            if cached_response:
                # Return cached response
                avatar_url = get_avatar_for_figure(figure_name, None, use_initials=False)
                return jsonify({
                    'response': cached_response,
                    'avatar_url': avatar_url,
                    'cached': True
                })

        # Initialize AI handler
        global ai_handler
        if ai_handler is None or ai_handler.provider != provider:
            ai_handler = get_ai_handler(provider)

        # Detect intent if figure/year not provided
        if not figure_name and not year:
            intent, data_detected = detector.detect(user_message)

            if intent == 'figure':
                figure_name = data_detected.get('name')
            elif intent == 'year':
                year = data_detected.get('year')

        # Generate response based on context
        if figure_name:
            # Roleplay mode
            figure_data = detector.get_figure_by_name(figure_name)

            if figure_data:
                # Known figure
                system_prompt = get_roleplay_prompt(figure_data)
            else:
                # Unknown figure
                system_prompt = get_unknown_figure_prompt(figure_name)

            response_text = ai_handler.generate_response(
                system_prompt=system_prompt,
                user_message=user_message,
                temperature=0.9,   # Higher temp = faster generation
                max_tokens=200     # Optimized: 200 tokens ≈ 2-4 sentences (faster!)
            )

        elif year:
            # Time travel mode
            event_data = detector.get_event_by_year(year)
            system_prompt = get_time_travel_prompt(year, event_data)

            response_text = ai_handler.generate_response(
                system_prompt=system_prompt,
                user_message=user_message,
                temperature=0.9,   # Higher temp = faster generation
                max_tokens=200     # Optimized: faster responses
            )

        else:
            # General mode
            system_prompt = get_general_prompt()

            response_text = ai_handler.generate_response(
                system_prompt=system_prompt,
                user_message=user_message,
                temperature=0.9,  # Higher temp = faster generation
                max_tokens=200    # Optimized: faster responses
            )

        # Cache the response if it's a figure conversation (and not an error)
        if figure_name and not any(err in response_text.lower() for err in ['xin lỗi', 'lỗi', 'error', 'quota']):
            protection.cache_response(figure_name, user_message, response_text)

        # Generate avatar if figure is present
        avatar_url = None
        if figure_name:
            # Use figure_data if available, otherwise None
            avatar_url = get_avatar_for_figure(figure_name, figure_data if figure_data else None, use_initials=False)

        return jsonify({
            'message': response_text,
            'figure': figure_name,
            'year': year,
            'avatar': avatar_url
        })

    except Exception as e:
        import traceback
        print(f"=" * 60)
        print(f"ERROR in chat endpoint:")
        print(f"Error: {str(e)}")
        print(f"Traceback:")
        traceback.print_exc()
        print(f"=" * 60)
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get API usage statistics"""
    try:
        protection = get_protection()
        stats = protection.get_stats()
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/figures', methods=['GET'])
def get_figures():
    """Get list of historical figures"""
    try:
        figures = detector.get_all_figures()

        # Format figures for frontend
        formatted_figures = []
        for figure in figures:
            formatted_figures.append({
                'name': figure['name'],
                'period': figure['period'],
                'icon': figure.get('icon', '👤'),
                'description': figure.get('description', ''),
                'avatar': get_avatar_for_figure(figure['name'], figure, use_initials=False)
            })

        return jsonify({'figures': formatted_figures})

    except Exception as e:
        print(f"Error in get_figures endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/timeline', methods=['GET'])
def get_timeline():
    """Get timeline events"""
    try:
        events = detector.get_all_events()

        # Format events for frontend
        formatted_events = []
        for event in events:
            formatted_events.append({
                'year': event['year'],
                'name': event['name'],
                'type': event.get('type', 'general'),
                'icon': event.get('icon', '📅'),
                'period': event.get('period', 'unknown'),
                'description': event.get('description', ''),
                'details': event.get('details', '')
            })

        return jsonify({'events': formatted_events})

    except Exception as e:
        print(f"Error in get_timeline endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/quiz/generate', methods=['POST'])
def generate_quiz():
    """
    Generate quiz questions
    Body: {
        "topic": str,
        "difficulty": str (optional: "easy", "medium", "hard", "mixed"),
        "count": int (optional: default 10)
    }
    """
    try:
        data = request.json
        topic = data.get('topic', 'Lịch sử Việt Nam')
        difficulty = data.get('difficulty', 'mixed')
        count = data.get('count', 10)

        # Initialize AI handler
        global ai_handler
        if ai_handler is None:
            ai_handler = get_ai_handler(DEFAULT_PROVIDER)

        # Generate quiz using AI
        prompt = f"""
        Tạo một bài quiz về {topic} với {count} câu hỏi trắc nghiệm.
        Độ khó: {difficulty}
        Mỗi câu hỏi có 4 đáp án (A, B, C, D), trong đó chỉ có 1 đáp án đúng.

        Trả về dưới dạng JSON với cấu trúc CHÍNH XÁC sau (không thêm text nào khác):
        {{
            "title": "Quiz Lịch Sử Việt Nam",
            "questions": [
                {{
                    "id": 1,
                    "question": "Câu hỏi chi tiết",
                    "options": {{
                        "A": "Đáp án A",
                        "B": "Đáp án B",
                        "C": "Đáp án C",
                        "D": "Đáp án D"
                    }},
                    "correct": "A",
                    "explanation": "Giải thích chi tiết tại sao đáp án này đúng",
                    "difficulty": "easy"
                }}
            ]
        }}

        Lưu ý:
        - difficulty có thể là: "easy", "medium", hoặc "hard"
        - Câu hỏi phải về lịch sử Việt Nam
        - Giải thích phải rõ ràng và chi tiết
        - CHỈ trả về JSON, không thêm text nào khác
        """

        response_text = ai_handler.generate_response(
            system_prompt="Bạn là một chuyên gia lịch sử Việt Nam. Trả về ONLY JSON, không thêm text hay markdown nào khác.",
            user_message=prompt,
            temperature=0.7,
            max_tokens=2500
        )

        # Try to parse JSON from response
        import json
        import re

        # Remove markdown code blocks if present
        response_text = response_text.strip()
        if response_text.startswith('```'):
            response_text = re.sub(r'^```(?:json)?\n', '', response_text)
            response_text = re.sub(r'\n```$', '', response_text)

        # Try to find JSON object
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            quiz_data = json.loads(json_match.group(0))
            return jsonify({'quiz': quiz_data})

        # If parsing fails, return fallback
        raise ValueError("Could not parse quiz JSON")

    except Exception as e:
        print(f"Error in generate_quiz endpoint: {str(e)}")
        # Return fallback quiz data
        return jsonify({
            'quiz': get_fallback_quiz_data()
        })


# ==================== AUTHENTICATION ENDPOINTS ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """
    Register new user
    Body: {
        "username": str,
        "email": str,
        "password": str,
        "display_name": str (optional)
    }
    """
    try:
        data = request.json

        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        display_name = data.get('display_name', '').strip()

        # Validate inputs
        if not username or not email or not password:
            return jsonify({'error': 'Vui lòng điền đầy đủ thông tin'}), 400

        # Validate username
        is_valid, error = validate_username(username)
        if not is_valid:
            return jsonify({'error': error}), 400

        # Validate email
        if not validate_email(email):
            return jsonify({'error': 'Email không hợp lệ'}), 400

        # Validate password
        is_valid, error = validate_password(password)
        if not is_valid:
            return jsonify({'error': error}), 400

        # Check if username exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Tên đăng nhập đã tồn tại'}), 409

        # Check if email exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email đã được sử dụng'}), 409

        # Create new user
        user = User(
            username=username,
            email=email,
            display_name=display_name or username
        )
        user.set_password(password)

        db.session.add(user)
        db.session.flush()  # Get user ID

        # Create game stats for user
        game_stats = GameStats(user_id=user.id)
        db.session.add(game_stats)

        db.session.commit()

        # Generate token
        token = generate_token(user.id)

        return jsonify({
            'message': 'Đăng ký thành công!',
            'token': token,
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error in register endpoint: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi, vui lòng thử lại'}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Login user
    Body: {
        "username": str,  # can be username or email
        "password": str
    }
    """
    try:
        data = request.json

        username_or_email = data.get('username', '').strip()
        password = data.get('password', '')

        if not username_or_email or not password:
            return jsonify({'error': 'Vui lòng điền đầy đủ thông tin'}), 400

        # Try to find user by username or email
        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email.lower())
        ).first()

        if not user or not user.check_password(password):
            return jsonify({'error': 'Tên đăng nhập hoặc mật khẩu không đúng'}), 401

        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Generate token
        token = generate_token(user.id)

        return jsonify({
            'message': 'Đăng nhập thành công!',
            'token': token,
            'user': user.to_dict()
        })

    except Exception as e:
        print(f"Error in login endpoint: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi, vui lòng thử lại'}), 500


@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(user):
    """Get current user profile (requires authentication)"""
    try:
        # Get user's game stats
        game_stats = GameStats.query.filter_by(user_id=user.id).first()
        stats = game_stats.to_dict() if game_stats else None

        # Get user's achievements
        achievements = Achievement.query.filter_by(user_id=user.id).all()
        achievements_list = [a.to_dict() for a in achievements]

        return jsonify({
            'user': user.to_dict(include_sensitive=True),
            'stats': stats,
            'achievements': achievements_list
        })

    except Exception as e:
        print(f"Error in get_current_user endpoint: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@app.route('/api/auth/update-profile', methods=['PUT'])
@token_required
def update_profile(user):
    """
    Update user profile
    Body: {
        "display_name": str (optional),
        "avatar": str (optional)
    }
    """
    try:
        data = request.json

        if 'display_name' in data:
            display_name = data['display_name'].strip()
            if display_name:
                user.display_name = display_name

        if 'avatar' in data:
            user.avatar = data['avatar']

        db.session.commit()

        return jsonify({
            'message': 'Cập nhật thành công!',
            'user': user.to_dict()
        })

    except Exception as e:
        db.session.rollback()
        print(f"Error in update_profile endpoint: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@app.route('/api/auth/change-password', methods=['POST'])
@token_required
def change_password(user):
    """
    Change user password
    Body: {
        "current_password": str,
        "new_password": str
    }
    """
    try:
        data = request.json

        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')

        if not current_password or not new_password:
            return jsonify({'error': 'Vui lòng điền đầy đủ thông tin'}), 400

        # Check current password
        if not user.check_password(current_password):
            return jsonify({'error': 'Mật khẩu hiện tại không đúng'}), 401

        # Validate new password
        is_valid, error = validate_password(new_password)
        if not is_valid:
            return jsonify({'error': error}), 400

        # Set new password
        user.set_password(new_password)
        db.session.commit()

        return jsonify({'message': 'Đổi mật khẩu thành công!'})

    except Exception as e:
        db.session.rollback()
        print(f"Error in change_password endpoint: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    """
    Request password reset
    Body: {
        "email": str
    }
    """
    try:
        data = request.json
        email = data.get('email', '').strip().lower()

        if not email:
            return jsonify({'error': 'Vui lòng nhập email'}), 400

        # Find user by email
        user = User.query.filter_by(email=email).first()

        # Always return success to prevent email enumeration
        if not user:
            return jsonify({'message': 'Nếu email tồn tại, link reset mật khẩu đã được gửi'})

        # Generate reset token
        reset_token = user.generate_reset_token()
        db.session.commit()

        # In production, send email here
        # For now, just return the token (in production, this should be sent via email)
        print(f"Password reset token for {email}: {reset_token}")

        return jsonify({
            'message': 'Nếu email tồn tại, link reset mật khẩu đã được gửi',
            'reset_token': reset_token  # Remove this in production
        })

    except Exception as e:
        db.session.rollback()
        print(f"Error in forgot_password endpoint: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """
    Reset password with token
    Body: {
        "token": str,
        "new_password": str
    }
    """
    try:
        data = request.json
        token = data.get('token', '').strip()
        new_password = data.get('new_password', '')

        if not token or not new_password:
            return jsonify({'error': 'Vui lòng điền đầy đủ thông tin'}), 400

        # Validate new password
        is_valid, error = validate_password(new_password)
        if not is_valid:
            return jsonify({'error': error}), 400

        # Find user by reset token
        user = User.query.filter_by(reset_token=token).first()

        if not user or not user.verify_reset_token(token):
            return jsonify({'error': 'Link reset không hợp lệ hoặc đã hết hạn'}), 400

        # Set new password
        user.set_password(new_password)
        user.clear_reset_token()
        db.session.commit()

        return jsonify({'message': 'Đặt lại mật khẩu thành công!'})

    except Exception as e:
        db.session.rollback()
        print(f"Error in reset_password endpoint: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@app.route('/api/auth/logout', methods=['POST'])
@token_required
def logout(user):
    """
    Logout user (token revocation would go here)
    For now, just a placeholder endpoint
    """
    # In a more advanced system, you'd invalidate the token here
    # For JWT, you'd need a blacklist or use short-lived tokens with refresh tokens
    return jsonify({'message': 'Đăng xuất thành công!'})


# ==================== END AUTHENTICATION ENDPOINTS ====================


# ==================== STATS & XP ENDPOINTS ====================

@app.route('/api/stats/add-xp', methods=['POST'])
@token_required
def add_xp_endpoint(user):
    """
    Add XP to user and update streak
    Body: {
        "amount": int,
        "activity_type": str (optional: "chat", "quiz", "game", "timeline", "map")
    }
    """
    try:
        data = request.json
        amount = data.get('amount', 0)
        activity_type = data.get('activity_type', 'general')

        if amount <= 0:
            return jsonify({'error': 'Số XP phải lớn hơn 0'}), 400

        # Update streak
        user.update_streak()

        # Add XP and check for level up
        leveled_up = user.add_xp(amount)

        # Update total points
        user.total_points += amount

        db.session.commit()

        response = {
            'message': 'Cập nhật XP thành công!',
            'xp_added': amount,
            'current_xp': user.xp,
            'level': user.level,
            'leveled_up': leveled_up,
            'current_streak': user.current_streak
        }

        return jsonify(response)

    except Exception as e:
        db.session.rollback()
        print(f"Error in add_xp_endpoint: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@app.route('/api/stats/track-activity', methods=['POST'])
@token_required
def track_activity(user):
    """
    Track user activity and update stats
    Body: {
        "activity_type": str ("chat", "quiz", "quiz_battle", "timeline", "map"),
        "data": dict (activity-specific data)
    }

    Examples:
    - Chat: {"activity_type": "chat", "data": {"figure": "Trần Hưng Đạo"}}
    - Quiz: {"activity_type": "quiz", "data": {"correct": 8, "total": 10}}
    - Quiz Battle: {"activity_type": "quiz_battle", "data": {"result": "win"}}
    """
    try:
        request_data = request.json
        activity_type = request_data.get('activity_type')
        activity_data = request_data.get('data', {})

        if not activity_type:
            return jsonify({'error': 'activity_type là bắt buộc'}), 400

        # Get or create game stats
        game_stats = GameStats.query.filter_by(user_id=user.id).first()
        if not game_stats:
            game_stats = GameStats(user_id=user.id)
            db.session.add(game_stats)

        xp_earned = 0

        # Handle different activity types
        if activity_type == 'chat':
            game_stats.conversations += 1
            figure_name = activity_data.get('figure')
            if figure_name:
                game_stats.add_figure(figure_name)
                xp_earned = 5  # 5 XP per chat message

        elif activity_type == 'quiz':
            game_stats.quizzes_completed += 1
            correct = activity_data.get('correct', 0)
            total = activity_data.get('total', 0)
            game_stats.questions_answered += total
            game_stats.questions_correct += correct
            xp_earned = correct * 10  # 10 XP per correct answer

        elif activity_type == 'quiz_battle':
            game_stats.battles_played += 1
            result = activity_data.get('result')
            if result == 'win':
                game_stats.battles_won += 1
                xp_earned = 50  # 50 XP for winning
            elif result == 'lose':
                game_stats.battles_lost += 1
                xp_earned = 10  # 10 XP for participation

        elif activity_type == 'timeline':
            year = activity_data.get('year')
            if year:
                game_stats.add_year(year)
                xp_earned = 5  # 5 XP per timeline event

        elif activity_type == 'map':
            location = activity_data.get('location')
            xp_earned = 5  # 5 XP per map exploration

        # Update user XP and streak
        if xp_earned > 0:
            user.update_streak()
            leveled_up = user.add_xp(xp_earned)
            user.total_points += xp_earned
        else:
            leveled_up = False

        db.session.commit()

        return jsonify({
            'message': 'Hoạt động đã được ghi nhận!',
            'xp_earned': xp_earned,
            'current_xp': user.xp,
            'level': user.level,
            'leveled_up': leveled_up,
            'current_streak': user.current_streak,
            'stats': game_stats.to_dict()
        })

    except Exception as e:
        db.session.rollback()
        print(f"Error in track_activity: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@app.route('/api/stats/me', methods=['GET'])
@token_required
def get_my_stats(user):
    """Get current user's stats"""
    try:
        # Get user's game stats
        game_stats = GameStats.query.filter_by(user_id=user.id).first()
        stats = game_stats.to_dict() if game_stats else None

        # Get user's achievements
        achievements = Achievement.query.filter_by(user_id=user.id).all()
        achievements_list = [a.to_dict() for a in achievements]

        return jsonify({
            'user': {
                'level': user.level,
                'xp': user.xp,
                'total_points': user.total_points,
                'current_streak': user.current_streak,
                'longest_streak': user.longest_streak
            },
            'stats': stats,
            'achievements': achievements_list
        })

    except Exception as e:
        print(f"Error in get_my_stats: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@app.route('/api/streak/checkin', methods=['POST'])
@token_required
def daily_checkin(user):
    """
    Daily check-in to maintain streak
    Rewards user with XP for checking in
    """
    try:
        from datetime import date

        today = date.today()

        # Check if already checked in today
        if user.last_activity_date == today:
            return jsonify({
                'message': 'Bạn đã điểm danh hôm nay rồi!',
                'already_checked_in': True,
                'current_streak': user.current_streak,
                'longest_streak': user.longest_streak,
                'xp_earned': 0
            })

        # Update streak
        user.update_streak()

        # Reward XP for check-in
        base_xp = 10  # Base XP for checking in
        streak_bonus = min(user.current_streak * 2, 50)  # Bonus based on streak (max 50)
        total_xp = base_xp + streak_bonus

        leveled_up = user.add_xp(total_xp)
        user.total_points += total_xp

        db.session.commit()

        return jsonify({
            'message': f'Điểm danh thành công! Streak: {user.current_streak} ngày 🔥',
            'already_checked_in': False,
            'current_streak': user.current_streak,
            'longest_streak': user.longest_streak,
            'xp_earned': total_xp,
            'streak_bonus': streak_bonus,
            'level': user.level,
            'leveled_up': leveled_up,
            'total_xp': user.xp
        })

    except Exception as e:
        db.session.rollback()
        print(f"Error in daily_checkin: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


# ==================== END STATS & XP ENDPOINTS ====================


def get_fallback_quiz_data():
    """Fallback quiz data in case AI fails"""
    return {
        'title': 'Quiz Lịch Sử Việt Nam',
        'questions': [
            {
                'id': 1,
                'question': 'Trận Bạch Đằng năm 938 do ai chỉ huy?',
                'options': {
                    'A': 'Ngô Quyền',
                    'B': 'Trần Hưng Đạo',
                    'C': 'Lý Thường Kiệt',
                    'D': 'Lê Lợi'
                },
                'correct': 'A',
                'explanation': 'Ngô Quyền đã chỉ huy chiến thắng trong trận Bạch Đằng năm 938, đánh bại quân Nam Hán.',
                'difficulty': 'easy'
            },
            {
                'id': 2,
                'question': 'Ai là người sáng lập ra triều đại nhà Lý?',
                'options': {
                    'A': 'Lý Thái Tổ',
                    'B': 'Lý Thái Tông',
                    'C': 'Lý Thánh Tông',
                    'D': 'Lý Nhân Tông'
                },
                'correct': 'A',
                'explanation': 'Lý Công Uẩn (Lý Thái Tổ) sáng lập triều đại nhà Lý năm 1009.',
                'difficulty': 'easy'
            },
            {
                'id': 3,
                'question': 'Cuộc khởi nghĩa Lam Sơn do ai lãnh đạo?',
                'options': {
                    'A': 'Quang Trung',
                    'B': 'Lê Lợi',
                    'C': 'Nguyễn Huệ',
                    'D': 'Trần Quốc Tuấn'
                },
                'correct': 'B',
                'explanation': 'Lê Lợi lãnh đạo cuộc khởi nghĩa Lam Sơn (1418-1427) chống quân Minh.',
                'difficulty': 'easy'
            },
            {
                'id': 4,
                'question': 'Trận Ngọc Hồi - Đống Đa diễn ra vào năm nào?',
                'options': {
                    'A': '1785',
                    'B': '1789',
                    'C': '1802',
                    'D': '1788'
                },
                'correct': 'B',
                'explanation': 'Trận Ngọc Hồi - Đống Đa diễn ra Tết 1789, Quang Trung đánh bại 29 vạn quân Thanh.',
                'difficulty': 'medium'
            },
            {
                'id': 5,
                'question': 'Bác Hồ đọc Tuyên ngôn Độc lập vào ngày nào?',
                'options': {
                    'A': '30/4/1975',
                    'B': '2/9/1945',
                    'C': '19/8/1945',
                    'D': '7/5/1954'
                },
                'correct': 'B',
                'explanation': 'Ngày 2/9/1945, Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình.',
                'difficulty': 'easy'
            }
        ]
    }


if __name__ == '__main__':
    # Set console encoding to UTF-8 for Windows
    import sys
    if sys.platform == 'win32':
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())

    # Create database tables
    with app.app_context():
        db.create_all()
        print("✓ Database tables created successfully")

    print("=" * 60)
    print("VIỆT SỬ KÝ Backend API")
    print("=" * 60)
    print(f"Figures data: {figures_path}")
    print(f"Events data: {events_path}")
    print(f"Default AI Provider: {DEFAULT_PROVIDER}")
    print(f"Database: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print("=" * 60)
    print("Server starting on http://localhost:5000")
    print("=" * 60)

    # Use environment variable for debug mode (default False for production)
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
