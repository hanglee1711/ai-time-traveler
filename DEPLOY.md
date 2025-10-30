# 🚀 Hướng dẫn Deploy chi tiết

## 1. Deploy lên Streamlit Cloud (Miễn phí & Dễ nhất)

### Bước 1: Chuẩn bị GitHub Repository

```bash
# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit: AI Time Traveler"

# Tạo repo mới trên GitHub và push
git remote add origin https://github.com/YOUR_USERNAME/ai-time-traveler.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy trên Streamlit Cloud

1. Truy cập https://share.streamlit.io/
2. Đăng nhập bằng GitHub account
3. Click **"New app"**
4. Chọn repository: `YOUR_USERNAME/ai-time-traveler`
5. Branch: `main`
6. Main file path: `app.py`

### Bước 3: Thêm Secrets (API Keys)

1. Trong app dashboard, click **Settings** > **Secrets**
2. Thêm nội dung sau (format TOML):

```toml
# AI Provider
AI_PROVIDER = "openai"

# OpenAI (nếu dùng OpenAI)
OPENAI_API_KEY = "sk-your-actual-api-key-here"
OPENAI_MODEL = "gpt-4"

# Gemini (nếu dùng Gemini)
GEMINI_API_KEY = "your-gemini-key-here"
GEMINI_MODEL = "gemini-1.5-pro"
```

3. Click **Save**

### Bước 4: Deploy!

Click **Deploy** và đợi vài phút. App sẽ có URL dạng:
```
https://your-app-name.streamlit.app
```

---

## 2. Deploy lên Hugging Face Spaces

### Bước 1: Tạo Space

1. Truy cập https://huggingface.co/spaces
2. Click **Create new Space**
3. Điền thông tin:
   - Space name: `ai-time-traveler`
   - License: MIT
   - SDK: **Streamlit**
   - Visibility: Public

### Bước 2: Upload Code

#### Option A: Git Push

```bash
# Clone space repository
git clone https://huggingface.co/spaces/YOUR_USERNAME/ai-time-traveler
cd ai-time-traveler

# Copy tất cả files từ MINDX vào đây
# (Trừ .git folder)

# Add và push
git add .
git commit -m "Initial commit"
git push
```

#### Option B: Upload qua Web UI

1. Trong Space, click **Files and versions**
2. Upload từng file/folder

### Bước 3: Thêm Secrets

1. Trong Space, click **Settings**
2. Scroll xuống **Repository secrets**
3. Add secrets:
   - Name: `OPENAI_API_KEY`, Value: `sk-your-key...`
   - Name: `AI_PROVIDER`, Value: `openai`

### Bước 4: Tạo file đặc biệt cho Hugging Face

Tạo file `.streamlit/config.toml`:

```toml
[theme]
primaryColor = "#667eea"
backgroundColor = "#FFFFFF"
secondaryBackgroundColor = "#F0F2F6"
textColor = "#262730"
font = "sans serif"

[server]
headless = true
port = 7860
enableCORS = false
```

Push lại, Space sẽ tự động rebuild!

---

## 3. Deploy lên Railway

### Bước 1: Tạo Railway Project

1. Truy cập https://railway.app/
2. Sign up/Login với GitHub
3. Click **New Project** > **Deploy from GitHub repo**
4. Chọn repository `ai-time-traveler`

### Bước 2: Cấu hình

Railway sẽ tự động detect Python app.

1. Add environment variables:
   - `AI_PROVIDER` = `openai`
   - `OPENAI_API_KEY` = `sk-your-key...`

2. Tạo file `Procfile` trong root folder:

```
web: streamlit run app.py --server.port=$PORT --server.address=0.0.0.0
```

3. Tạo file `runtime.txt`:

```
python-3.11.0
```

### Bước 3: Deploy

Railway sẽ tự động deploy. Domain sẽ có dạng:
```
https://ai-time-traveler-production.up.railway.app/
```

---

## 4. Deploy lên Render

### Bước 1: Tạo Web Service

1. Truy cập https://render.com/
2. Sign up/Login với GitHub
3. Click **New +** > **Web Service**
4. Connect GitHub repository

### Bước 2: Cấu hình

- **Name**: `ai-time-traveler`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `streamlit run app.py --server.port=$PORT --server.address=0.0.0.0 --server.headless=true`

### Bước 3: Environment Variables

Add:
- `AI_PROVIDER` = `openai`
- `OPENAI_API_KEY` = `sk-your-key...`
- `PYTHON_VERSION` = `3.11.0`

### Bước 4: Deploy

Click **Create Web Service**. Domain sẽ có dạng:
```
https://ai-time-traveler.onrender.com
```

---

## 5. Deploy Local với Docker (Advanced)

### Tạo Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

### Build và Run

```bash
# Build image
docker build -t ai-time-traveler .

# Run container
docker run -p 8501:8501 \
  -e OPENAI_API_KEY=sk-your-key \
  -e AI_PROVIDER=openai \
  ai-time-traveler
```

Truy cập: http://localhost:8501

---

## 🔒 Bảo mật API Keys

### ⚠️ QUAN TRỌNG

- **KHÔNG BAO GIỜ** commit file `.env` lên GitHub
- **KHÔNG BAO GIỜ** để API keys trong code
- Luôn dùng environment variables hoặc secrets
- Kiểm tra `.gitignore` đã có `.env`

### Nếu vô tình leak API key

1. **Xóa ngay API key** trên platform (OpenAI/Gemini)
2. **Tạo API key mới**
3. **Update** trong secrets/environment variables
4. Remove từ Git history:

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 📊 Monitoring & Analytics

### Streamlit Cloud

- Dashboard tự động có:
  - Logs
  - Resource usage
  - Visitor stats

### Hugging Face Spaces

- Settings > Analytics
- View số lượt visit, duration, etc.

### Railway / Render

- Metrics tab
- Logs tab
- Set up alerts

---

## 💰 Chi phí

| Platform | Free Tier | Giới hạn |
|----------|-----------|----------|
| **Streamlit Cloud** | ✅ Miễn phí | 1 private app, unlimited public |
| **Hugging Face** | ✅ Miễn phí | CPU only, 16GB RAM |
| **Railway** | ⚠️ $5 credit/tháng | Sau đó trả tiền theo usage |
| **Render** | ✅ Free tier | 750 hours/month |

**Lưu ý:** Chi phí chính là **API calls** tới OpenAI/Gemini:
- OpenAI GPT-4: ~$0.03 per 1K tokens
- Gemini 1.5 Pro: Miễn phí trong giới hạn

---

## 🚨 Troubleshooting Deploy

### App không start

1. Check logs
2. Verify requirements.txt đầy đủ
3. Check Python version compatibility

### Environment variables không work

1. Verify tên biến đúng
2. Check format (TOML vs ENV)
3. Restart app sau khi thay đổi

### Port binding error

Ensure start command có:
```bash
--server.port=$PORT --server.address=0.0.0.0
```

---

## 📞 Support

Nếu gặp vấn đề, check:
1. Platform documentation
2. GitHub Issues
3. Streamlit Community Forum
4. Stack Overflow

---

🎉 **Chúc bạn deploy thành công!** 🎉
