# 🚀 HƯỚNG DẪN DEPLOY VIỆT SỬ KÝ

**Version:** 1.0.0
**Date:** November 11, 2025
**Status:** ✅ Production Ready

---

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Yêu cầu](#yêu-cầu)
3. [Deploy Local (LAN)](#deploy-local-lan)
4. [Deploy lên Internet](#deploy-lên-internet)
   - [Render.com](#option-1-rendercom-free)
   - [Heroku](#option-2-heroku)
   - [Railway](#option-3-railway)
   - [PythonAnywhere](#option-4-pythonanywhere)
5. [Cấu hình Domain](#cấu-hình-domain)
6. [Bảo mật](#bảo-mật)
7. [Monitoring](#monitoring)

---

## 🎯 TỔNG QUAN

Việt Sử Ký là web application với:
- **Backend:** Flask API (Python)
- **Frontend:** Static HTML/CSS/JS
- **Database:** SQLite
- **AI:** Google Gemini / OpenAI

---

## 📦 YÊU CẦU

### Minimum Requirements
- Python 3.8+
- 512 MB RAM
- 100 MB disk space

### API Keys Required
- Google Gemini API key (miễn phí)
- hoặc OpenAI API key

---

## 🏠 DEPLOY LOCAL (LAN)

### Để share trong mạng LAN (văn phòng, trường học):

#### Bước 1: Lấy IP máy chủ
```bash
# Windows
ipconfig

# Tìm dòng "IPv4 Address"
# Ví dụ: 192.168.1.100
```

#### Bước 2: Cấu hình Backend
Mở `backend/app.py`, dòng cuối:
```python
# Change from:
app.run(host='0.0.0.0', port=5000, debug=True)

# To:
app.run(host='0.0.0.0', port=5000, debug=False)
```

#### Bước 3: Cấu hình Frontend
Tạo file `frontend/config.js`:
```javascript
// Replace with your server IP
const API_BASE_URL = 'http://192.168.1.100:5000/api';
```

Cập nhật trong `frontend/js/auth.js`:
```javascript
// Line 7-9
const API_BASE_URL = window.CONFIG
    ? window.CONFIG.API_BASE_URL
    : 'http://192.168.1.100:5000/api';
```

#### Bước 4: Khởi động
```bash
# Start backend
cd backend
python app.py

# Start frontend (terminal khác)
cd frontend
python -m http.server 8000
```

#### Bước 5: Share với người khác
Người khác trong cùng mạng truy cập:
```
http://192.168.1.100:8000/index.html
```

---

## 🌐 DEPLOY LÊN INTERNET

### OPTION 1: Render.com (FREE)

**Ưu điểm:**
- ✅ Miễn phí
- ✅ Tự động SSL
- ✅ Dễ setup

#### Bước 1: Chuẩn bị Code

1. Tạo file `requirements.txt` (nếu chưa có):
```txt
flask==3.0.0
flask-cors==4.0.0
flask-sqlalchemy==3.1.1
python-dotenv==1.0.0
google-generativeai==0.8.3
openai==1.51.0
pyjwt==2.8.0
gunicorn==21.2.0
```

2. Tạo file `Procfile`:
```
web: gunicorn backend.app:app
```

3. Tạo file `render.yaml`:
```yaml
services:
  - type: web
    name: viet-su-ky
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn backend.app:app
    envVars:
      - key: AI_PROVIDER
        value: gemini
      - key: GEMINI_API_KEY
        sync: false
      - key: PYTHON_VERSION
        value: 3.11.0
```

#### Bước 2: Push lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/viet-su-ky.git
git push -u origin main
```

#### Bước 3: Deploy trên Render

1. Đăng nhập https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Chọn repository `viet-su-ky`
5. Settings:
   - **Name:** viet-su-ky
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn backend.app:app`
6. Environment Variables:
   ```
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_key_here
   SECRET_KEY=your_secret_key_here
   ```
7. Click "Create Web Service"

#### Bước 4: Deploy Static Files

1. Trong Render dashboard, click "New +" → "Static Site"
2. Connect same GitHub repository
3. Settings:
   - **Publish directory:** `frontend`
4. Click "Create Static Site"

#### Bước 5: Update Frontend Config

Trong `frontend/js/auth.js`, update API URL:
```javascript
const API_BASE_URL = 'https://your-app.onrender.com/api';
```

Commit và push:
```bash
git add .
git commit -m "Update API URL"
git push
```

**URL của bạn:**
- Backend: `https://viet-su-ky.onrender.com`
- Frontend: `https://viet-su-ky-frontend.onrender.com`

---

### OPTION 2: Heroku

#### Bước 1: Cài Heroku CLI
Download từ: https://devcenter.heroku.com/articles/heroku-cli

#### Bước 2: Login
```bash
heroku login
```

#### Bước 3: Tạo App
```bash
heroku create viet-su-ky-backend
heroku create viet-su-ky-frontend
```

#### Bước 4: Cấu hình Backend
```bash
# Set environment variables
heroku config:set AI_PROVIDER=gemini -a viet-su-ky-backend
heroku config:set GEMINI_API_KEY=your_key -a viet-su-ky-backend
heroku config:set SECRET_KEY=your_secret -a viet-su-ky-backend
```

#### Bước 5: Deploy Backend
```bash
git subtree push --prefix backend heroku main
```

#### Bước 6: Deploy Frontend
```bash
# Create separate branch for frontend
git subtree split --prefix frontend -b frontend-deploy
git push heroku frontend-deploy:main
```

---

### OPTION 3: Railway

1. Đăng nhập https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Chọn repository
4. Railway tự động detect và deploy
5. Add environment variables trong Settings

---

### OPTION 4: PythonAnywhere (Recommended cho học sinh)

**Ưu điểm:**
- ✅ Miễn phí
- ✅ Không cần credit card
- ✅ Dễ sử dụng
- ✅ Always on

#### Bước 1: Đăng ký
https://www.pythonanywhere.com/registration/register/beginner/

#### Bước 2: Upload Code
1. Vào "Files" tab
2. Upload toàn bộ folder `MINDX`

#### Bước 3: Setup Virtual Environment
```bash
mkvirtualenv vietsuky --python=python3.9
pip install -r requirements.txt
```

#### Bước 4: Config Web App
1. Vào "Web" tab → "Add a new web app"
2. Choose "Flask"
3. Python version: 3.9
4. Path to Flask app: `/home/yourusername/MINDX/backend/app.py`
5. WSGI config:
```python
import sys
path = '/home/yourusername/MINDX'
if path not in sys.path:
    sys.path.append(path)

from backend.app import app as application
```

#### Bước 5: Setup Static Files
1. Static URL: `/static/`
2. Directory: `/home/yourusername/MINDX/frontend/`

#### Bước 6: Environment Variables
Trong "Web" tab → "Environment":
```
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

#### Bước 7: Reload
Click "Reload" button

**URL:** `https://yourusername.pythonanywhere.com`

---

## 🔒 CẤU HÌNH DOMAIN (Optional)

### Nếu có domain riêng (vd: vietsuky.com):

#### Bước 1: Mua domain
- Namecheap, GoDaddy, hoặc Tên Miền Việt Nam

#### Bước 2: Config DNS
Trong DNS settings của domain:
```
Type    Name    Value
A       @       Your_Server_IP
CNAME   www     Your_App_URL
```

#### Bước 3: Update CORS
Trong `backend/app.py`:
```python
CORS(app, origins=[
    "https://vietsuky.com",
    "https://www.vietsuky.com"
])
```

---

## 🔐 BẢO MẬT

### Production Checklist

#### 1. Environment Variables
```bash
# NEVER commit these to git!
.env
*.env
```

Thêm vào `.gitignore`:
```
.env
.env.local
.env.production
vietsuky.db
__pycache__/
*.pyc
```

#### 2. SECRET_KEY
Generate strong secret key:
```python
import secrets
print(secrets.token_hex(32))
```

Set trong environment variables.

#### 3. Debug Mode
```python
# In production:
app.run(debug=False)
```

#### 4. Database
Với production, dùng PostgreSQL thay vì SQLite:
```python
# In production
DATABASE_URL = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
```

#### 5. Rate Limiting
Đã có sẵn trong `backend/api_protection.py`:
- 10 requests/minute
- 50 requests/hour

#### 6. HTTPS
- Render, Heroku, Railway tự động có SSL
- PythonAnywhere: upgrade plan để có HTTPS

#### 7. API Keys Protection
- Luôn dùng environment variables
- Không hardcode trong code
- Rotate keys định kỳ

---

## 📊 MONITORING

### Health Check Endpoint
```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Việt Sử Ký API is running"
}
```

### Stats Endpoint
```
GET /api/stats
```

Xem:
- Total requests
- Cache hit rate
- Active users
- API key usage

### Logging

Setup logging trong production:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

---

## 🧪 TESTING BEFORE DEPLOY

Trước khi deploy, chạy tests:

```bash
# Test system
python test_system.py

# Test API
python test_api.py

# Test pages
python test_all_pages.py
```

Đảm bảo **100% tests pass**.

---

## 📝 POST-DEPLOYMENT

### 1. Test Production URL
```bash
curl https://your-app.com/api/health
```

### 2. Test Frontend
Mở browser:
```
https://your-app.com
```

### 3. Test Authentication
- Đăng ký account mới
- Login
- Test features

### 4. Monitor Performance
- Check response times
- Monitor error rates
- Check cache hit rates

### 5. Share với users
Gửi link:
```
🌐 Việt Sử Ký
https://your-app.com

📖 Hướng dẫn sử dụng:
- Chatbot: Chat với nhân vật lịch sử
- Timeline: Khám phá dòng thời gian
- Game: Chơi quiz đấu trí
- Đăng ký để tracking XP và streak!
```

---

## 🆘 TROUBLESHOOTING

### Lỗi: "Application Error"
- Check logs
- Verify environment variables
- Check dependencies installed

### Lỗi: "Connection Refused"
- Check backend running
- Verify URL correct
- Check CORS settings

### Lỗi: "API Key Invalid"
- Verify API key trong environment
- Check AI provider setting
- Test API key directly

### Lỗi: "Database Error"
- Check database initialized
- Run migrations if needed
- Verify database URL

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Check logs
2. Review error messages
3. Test locally first
4. Check documentation
5. Create issue on GitHub

---

## 🎉 KẾT LUẬN

Deployment options:
- **Fastest:** Render.com (< 10 phút)
- **Easiest:** PythonAnywhere (cho học sinh)
- **Most flexible:** Heroku / Railway
- **Local LAN:** Chỉ cần 5 phút

**Chọn option phù hợp với nhu cầu của bạn!**

---

**Good luck với deployment! 🚀**

*Last updated: November 11, 2025*
