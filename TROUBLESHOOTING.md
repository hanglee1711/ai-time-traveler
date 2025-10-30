# 🔧 Troubleshooting Guide - Giải quyết các lỗi thường gặp

## 🚨 Lỗi khi cài đặt

### Lỗi: "pip: command not found"

**Nguyên nhân:** Python chưa được thêm vào PATH

**Giải pháp:**

**Windows:**
```bash
# Reinstall Python và check "Add Python to PATH"
# Hoặc thêm thủ công vào System Environment Variables
```

**Mac:**
```bash
python3 -m pip install -r requirements.txt
```

**Linux:**
```bash
sudo apt-get install python3-pip
pip3 install -r requirements.txt
```

---

### Lỗi: "No module named 'streamlit'"

**Nguyên nhân:** Chưa cài đặt dependencies

**Giải pháp:**
```bash
pip install -r requirements.txt

# Hoặc cài từng package
pip install streamlit openai google-generativeai python-dotenv
```

---

### Lỗi: "Permission denied" khi cài đặt

**Giải pháp:**

**Windows:** Chạy Command Prompt as Administrator

**Mac/Linux:**
```bash
pip install --user -r requirements.txt
# Hoặc
sudo pip install -r requirements.txt
```

---

## 🔑 Lỗi API Keys

### Lỗi: "OPENAI_API_KEY not found in environment variables"

**Nguyên nhân:** File .env chưa tạo hoặc API key chưa đúng

**Giải pháp:**

1. **Kiểm tra file .env tồn tại:**
```bash
# Windows
dir .env

# Mac/Linux
ls -la .env
```

2. **Tạo file .env nếu chưa có:**
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

3. **Kiểm tra nội dung .env:**
```bash
# Windows
type .env

# Mac/Linux
cat .env
```

Phải có:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-key-here
```

4. **Restart app** sau khi sửa .env

---

### Lỗi: "Incorrect API key provided"

**Nguyên nhân:** API key không đúng hoặc đã hết hạn

**Giải pháp:**

1. Truy cập https://platform.openai.com/api-keys
2. Tạo API key mới
3. Copy và paste vào .env
4. Restart app

---

### Lỗi: "Rate limit exceeded"

**Nguyên nhân:** Gọi API quá nhiều trong thời gian ngắn

**Giải pháp:**

1. **Đợi vài phút** trước khi thử lại
2. **Upgrade plan** trên OpenAI (nếu dùng free tier)
3. **Giảm số lượng request:**
   - Giảm max_tokens trong sidebar
   - Không spam tin nhắn

---

### Lỗi: "Insufficient quota"

**Nguyên nhân:** Hết credit hoặc billing chưa setup

**Giải pháp:**

1. Truy cập https://platform.openai.com/account/billing
2. Check balance
3. Add payment method nếu cần
4. Purchase credits

---

## 🌐 Lỗi khi chạy App

### Lỗi: "Address already in use" / "Port 8501 is already in use"

**Nguyên nhân:** Port 8501 đang được sử dụng

**Giải pháp:**

**Option 1: Kill process**

Windows:
```bash
netstat -ano | findstr :8501
taskkill /PID <PID_number> /F
```

Mac/Linux:
```bash
lsof -ti:8501 | xargs kill -9
```

**Option 2: Dùng port khác**
```bash
streamlit run app.py --server.port 8502
```

---

### Lỗi: "ModuleNotFoundError: No module named 'src'"

**Nguyên nhân:** Python không tìm thấy module src

**Giải pháp:**

1. **Check cấu trúc folder đúng chưa:**
```
MINDX/
├── app.py
└── src/
    ├── __init__.py
    ├── ai_handler.py
    ├── input_detector.py
    └── prompts.py
```

2. **Chạy app từ đúng folder:**
```bash
cd MINDX
streamlit run app.py
```

3. **Thêm PYTHONPATH:**
```bash
# Windows
set PYTHONPATH=%CD%
streamlit run app.py

# Mac/Linux
export PYTHONPATH=$PWD
streamlit run app.py
```

---

### Lỗi: "FileNotFoundError: data/historical_figures.json"

**Nguyên nhân:** Không tìm thấy file database

**Giải pháp:**

1. **Check file tồn tại:**
```bash
ls data/historical_figures.json
```

2. **Check đang ở đúng folder:**
```bash
pwd  # Mac/Linux
cd   # Windows
```

Phải ở trong folder MINDX

3. **Re-download project** nếu file bị thiếu

---

## 🤖 Lỗi AI Response

### AI trả lời không đúng context

**Nguyên nhân:** Session state bị lỗi

**Giải pháp:**

1. Click **"🗑️ Xóa lịch sử chat"** trong sidebar
2. Refresh page (F5)
3. Thử lại câu hỏi

---

### AI trả lời bằng tiếng Anh thay vì tiếng Việt

**Nguyên nhân:** Prompt hoặc model setting

**Giải pháp:**

1. **Check prompts.py** có đúng không
2. **Thêm vào prompt:**
```python
"QUAN TRỌNG: Luôn trả lời bằng tiếng Việt."
```

3. **Giảm temperature** (về 0.7) để ổn định hơn

---

### AI trả lời quá ngắn

**Giải pháp:**

1. Tăng **max_tokens** trong sidebar (lên 1500-2000)
2. Thêm vào prompt: "Trả lời chi tiết, đầy đủ"

---

### AI trả lời quá dài

**Giải pháp:**

1. Giảm **max_tokens** (xuống 500-800)
2. Thêm vào prompt: "Trả lời ngắn gọn, súc tích"

---

## 🎨 Lỗi UI/Display

### Giao diện không hiển thị CSS/Styling

**Nguyên nhân:** Browser cache hoặc CSS lỗi

**Giải pháp:**

1. **Hard refresh:**
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

2. **Clear Streamlit cache:**
```bash
streamlit cache clear
```

3. **Check CSS syntax** trong app.py

---

### Sidebar không hiển thị

**Giải pháp:**

1. Click mũi tên ở góc trái trên để mở sidebar
2. Hoặc thêm vào config:
```python
st.set_page_config(initial_sidebar_state="expanded")
```

---

## 📱 Lỗi Deploy

### Streamlit Cloud: "Error: Python version not supported"

**Giải pháp:**

Tạo file `runtime.txt` trong root:
```
python-3.11.0
```

---

### Streamlit Cloud: "ModuleNotFoundError"

**Giải pháp:**

1. Check `requirements.txt` đầy đủ
2. Thêm missing packages
3. Redeploy

---

### Hugging Face Spaces: App không start

**Giải pháp:**

1. Check logs trong Space
2. Tạo file `.streamlit/config.toml`:
```toml
[server]
headless = true
port = 7860
```

3. Update secrets trong Settings

---

### Railway/Render: Timeout error

**Giải pháp:**

Update start command:
```bash
streamlit run app.py --server.port=$PORT --server.address=0.0.0.0 --server.headless=true
```

---

## 💾 Lỗi Data/JSON

### Lỗi: "JSONDecodeError"

**Nguyên nhân:** JSON file bị lỗi format

**Giải pháp:**

1. **Validate JSON online:**
   - Copy nội dung file
   - Paste vào https://jsonlint.com/
   - Fix errors

2. **Common mistakes:**
```json
// ❌ Wrong - Trailing comma
{
  "name": "Test",
}

// ✅ Correct
{
  "name": "Test"
}

// ❌ Wrong - Missing comma
{
  "name": "Test"
  "age": 20
}

// ✅ Correct
{
  "name": "Test",
  "age": 20
}
```

---

## 🐛 Debugging Tips

### 1. Enable Debug Mode

Trong .env:
```env
DEBUG_MODE=True
```

### 2. Print Debug Info

Thêm vào app.py:
```python
if os.getenv('DEBUG_MODE') == 'True':
    st.write("Debug Info:")
    st.write(f"Provider: {provider}")
    st.write(f"Session State: {st.session_state}")
```

### 3. Check Logs

```bash
# Xem console output khi chạy streamlit
# Sẽ có error messages chi tiết
```

### 4. Test Từng Module

```bash
# Test ai_handler
python src/ai_handler.py

# Test input_detector
python src/input_detector.py
```

---

## 🔄 Reset Everything

Nếu mọi thứ đều lỗi, reset toàn bộ:

```bash
# 1. Stop app
# Ctrl + C

# 2. Delete venv
rm -rf venv/  # Mac/Linux
rmdir /s venv  # Windows

# 3. Clear cache
rm -rf ~/.streamlit/  # Mac/Linux
del /f /s /q %USERPROFILE%\.streamlit\  # Windows

# 4. Reinstall
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 5. Restart
streamlit run app.py
```

---

## 📞 Vẫn không giải quyết được?

1. **Check documentation:**
   - README.md
   - QUICKSTART.md
   - DEPLOY.md

2. **Search existing issues:**
   - GitHub Issues
   - Stack Overflow

3. **Create new issue:**
   - Include error message
   - Include steps to reproduce
   - Include system info (OS, Python version)

4. **Contact:**
   - Create GitHub Issue với tag `bug`

---

## 📊 Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 401 | Invalid API key | Check API key |
| 429 | Rate limit | Wait or upgrade |
| 500 | Server error | Retry later |
| 503 | Service unavailable | Retry later |

---

## ✅ Prevention Tips

1. **Always backup** before making changes
2. **Test locally** before deploying
3. **Use git** to track changes
4. **Monitor API usage** to avoid surprises
5. **Keep dependencies updated**

---

**💡 Pro Tip:** Khi report bug, luôn include:
- Error message đầy đủ
- Python version (`python --version`)
- OS (Windows/Mac/Linux)
- Steps to reproduce

---

Chúc bạn fix bug thành công! 🎯
