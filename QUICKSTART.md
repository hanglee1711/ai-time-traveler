# ⚡ Quick Start Guide - 5 phút để chạy AI Time Traveler

## 🎯 Mục tiêu

Trong 5 phút, bạn sẽ có app AI Time Traveler chạy trên máy!

## 📋 Checklist trước khi bắt đầu

- [ ] Python 3.8+ đã cài đặt
- [ ] API Key từ OpenAI hoặc Gemini

## 🚀 3 bước đơn giản

### Bước 1: Cài đặt Dependencies (1 phút)

```bash
pip install -r requirements.txt
```

### Bước 2: Cấu hình API Key (2 phút)

**Windows:**
```bash
copy .env.example .env
notepad .env
```

**Mac/Linux:**
```bash
cp .env.example .env
nano .env
```

Sửa file `.env`:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4
```

**Lấy API Key:**
- OpenAI: https://platform.openai.com/api-keys (Click "Create new secret key")
- Gemini: https://makersuite.google.com/app/apikey

### Bước 3: Chạy App (1 phút)

**Cách 1: Dùng script tự động (Dễ nhất)**

Windows:
```bash
run.bat
```

Mac/Linux:
```bash
chmod +x run.sh
./run.sh
```

**Cách 2: Chạy trực tiếp**

```bash
streamlit run app.py
```

## ✅ Xong!

App mở tại: **http://localhost:8501**

## 🎮 Thử ngay

Nhập vào ô chat:

```
Xin chào Quang Trung
```

hoặc

```
Đưa tôi đến năm 1945
```

## ❓ Gặp lỗi?

### Lỗi: "OPENAI_API_KEY not found"

➡️ Kiểm tra file `.env` đã tạo và có API key chưa

### Lỗi: "Module 'streamlit' not found"

➡️ Chạy lại:
```bash
pip install -r requirements.txt
```

### Lỗi: "Invalid API key"

➡️ Kiểm tra lại API key trên OpenAI/Gemini dashboard

### App không mở

➡️ Thử mở thủ công: http://localhost:8501

## 🎉 Done!

Giờ bạn có thể:
- ✨ Trò chuyện với nhân vật lịch sử
- 🕰️ Du hành thời gian
- 📚 Học lịch sử một cách thú vị!

---

## 📖 Tài liệu đầy đủ

- [README.md](README.md) - Hướng dẫn chi tiết
- [DEPLOY.md](DEPLOY.md) - Hướng dẫn deploy lên internet

## 💡 Tips

1. **Giảm chi phí API:** Chọn model `gpt-3.5-turbo` thay vì `gpt-4` trong `.env`
2. **Tăng tốc độ:** Giảm `max_tokens` trong sidebar
3. **Thêm nhân vật:** Sửa file `data/historical_figures.json`

---

Chúc bạn khám phá lịch sử vui vẻ! 🎊
