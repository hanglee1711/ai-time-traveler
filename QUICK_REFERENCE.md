# 🚀 VIET SU KY - QUICK REFERENCE

## Khởi động nhanh

### Cách 1: Script tự động (KHUYẾN NGHỊ)
```batch
START_ALL.bat
```
➜ Mở tự động: http://localhost:8000/chatbot.html

### Cách 2: Thủ công

**Bước 1:** Mở Terminal 1
```batch
cd backend
python app.py
```

**Bước 2:** Mở Terminal 2
```batch
cd frontend
python -m http.server 8000
```

**Bước 3:** Mở browser
- Trang chủ: http://localhost:8000/index.html
- Chatbot: http://localhost:8000/chatbot.html
- Game: http://localhost:8000/quiz-battle.html

---

## URLs quan trọng

| Tính năng | URL |
|-----------|-----|
| **Trang chủ** | http://localhost:8000/index.html |
| **Chatbot** | http://localhost:8000/chatbot.html |
| **Quiz Battle** | http://localhost:8000/quiz-battle.html |
| **Timeline** | http://localhost:8000/timeline.html |
| **Map** | http://localhost:8000/map.html |
| **Journey** | http://localhost:8000/journey.html |
| **API Health** | http://localhost:5000/api/health |
| **API Stats** | http://localhost:5000/api/stats |

---

## Các script test

```batch
# Test toàn bộ hệ thống
python test_system.py

# Khởi tạo database
python init_database.py

# Test API endpoints
python test_api.py
```

---

## Cấu trúc thư mục

```
MINDX/
├── backend/              # Flask API
│   ├── app.py           # Main API server
│   ├── models.py        # Database models
│   └── auth.py          # Authentication
│
├── frontend/            # Web interface
│   ├── *.html          # HTML pages
│   ├── css/            # Stylesheets
│   └── js/             # JavaScript
│
├── data/               # Data files
│   ├── historical_figures.json
│   ├── historical_events.json
│   └── quiz_*.json
│
├── src/                # Core modules
│   ├── ai_handler.py   # AI integration
│   ├── input_detector.py
│   └── prompts.py
│
├── app.py              # Streamlit app (alternative)
└── START_ALL.bat       # Launch script
```

---

## Troubleshooting

### Backend không khởi động?
```batch
# Check Python
python --version

# Check dependencies
pip list | grep flask

# Reinstall if needed
pip install -r backend/requirements.txt
```

### Database lỗi?
```batch
# Khởi tạo lại database
python init_database.py
```

### API key lỗi?
```batch
# Check .env file
cat .env

# Đảm bảo có:
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

### Port bị chiếm?
```batch
# Kiểm tra port 5000
netstat -ano | findstr :5000

# Kiểm tra port 8000
netstat -ano | findstr :8000

# Kill process nếu cần
taskkill /PID <process_id> /F
```

---

## Tính năng chính

### 1. Chatbot
- Trò chuyện với 39+ nhân vật lịch sử
- Du hành thời gian đến 34+ sự kiện
- AI thông minh (Gemini 2.5 Flash)

### 2. Quiz Battle
- Đối đầu với AI
- 100+ câu hỏi lịch sử
- Hệ thống thẻ bài chiến thuật

### 3. Timeline
- Khám phá dòng thời gian
- Lọc theo thời kỳ
- Chi tiết sự kiện

### 4. Hệ thống User
- Đăng ký/Đăng nhập
- XP & Leveling
- Streak tracking
- Achievements

---

## API Endpoints chính

### Public (không cần auth)
- GET /api/health - Health check
- GET /api/figures - Danh sách nhân vật
- GET /api/timeline - Dòng thời gian
- GET /api/stats - Thống kê hệ thống
- POST /api/chat - Chat với AI

### Protected (cần auth token)
- GET /api/auth/me - Thông tin user
- POST /api/stats/add-xp - Thêm XP
- POST /api/stats/track-activity - Track hoạt động

---

## Môi trường

### Python
- Version: 3.11.0
- pip: 25.2

### Dependencies chính
- Flask 3.1.2
- Streamlit 1.51.0
- OpenAI 1.107.2
- Google Generative AI 0.8.5

### Database
- SQLite (vietsuky.db)
- 3 tables: users, game_stats, achievements

---

## Lệnh hữu ích

```batch
# Xem log backend (nếu chạy thủ công)
cd backend && python app.py

# Start frontend server
cd frontend && python -m http.server 8000

# Kill tất cả Python processes (Windows)
taskkill /F /IM python.exe

# View database tables
python
>>> from backend.models import db, User
>>> from flask import Flask
>>> app = Flask(__name__)
>>> app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vietsuky.db'
>>> db.init_app(app)
>>> with app.app_context():
...     users = User.query.all()
...     print(f"Total users: {len(users)}")
```

---

## Báo lỗi

Nếu gặp lỗi:
1. Check console log (F12 trong browser)
2. Check terminal output (backend)
3. Xem file TEST_REPORT_2025-11-11.md
4. Chạy python test_system.py

---

## Tips

- **Tiết kiệm API:** Cache responses tự động
- **Rate limit:** 10 requests/phút, 50/giờ
- **Multiple API keys:** Thêm GEMINI_API_KEY_2, _3, ...
- **Backup keys:** Hệ thống tự động xoay vòng

---

**Cập nhật:** 2025-11-11
**Version:** 1.0.0
**Status:** ✅ Production Ready
