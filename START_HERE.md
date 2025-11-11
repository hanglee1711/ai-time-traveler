# 🎯 BẮT ĐẦU TỪ ĐÂY!

Chào mừng bạn đến với **Việt Sử Ký**! 🚀

## 📚 Bạn nên đọc gì trước?

Tùy vào mục đích của bạn:

### 1️⃣ Tôi muốn chạy app NGAY (5 phút)

👉 Đọc: **[QUICKSTART.md](QUICKSTART.md)**

Hướng dẫn nhanh 3 bước:
1. Cài đặt dependencies
2. Cấu hình API key
3. Chạy app!

---

### 2️⃣ Tôi muốn hiểu toàn bộ dự án

👉 Đọc theo thứ tự:

1. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Tổng quan dự án
2. **[README.md](README.md)** - Tài liệu chi tiết
3. **[CUSTOMIZATION.md](CUSTOMIZATION.md)** - Tùy chỉnh

---

### 3️⃣ Tôi muốn deploy lên Internet

👉 Đọc: **[DEPLOY.md](DEPLOY.md)**

Hướng dẫn deploy lên:
- Streamlit Cloud (Miễn phí, dễ nhất)
- Hugging Face Spaces
- Railway / Render
- Docker

---

### 4️⃣ Tôi gặp lỗi

👉 Đọc: **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

Giải quyết các lỗi:
- Lỗi cài đặt
- Lỗi API keys
- Lỗi khi chạy app
- Lỗi deploy

---

## 🗂️ Cấu trúc Files

```
📁 MINDX/
│
├── 📄 START_HERE.md              ⬅️ BẠN ĐANG Ở ĐÂY
│
├── 🚀 QUICKSTART - Bắt đầu nhanh
│   └── QUICKSTART.md
│
├── 📖 DOCUMENTATION - Tài liệu
│   ├── README.md                 (Tài liệu chính)
│   ├── PROJECT_SUMMARY.md        (Tổng quan)
│   ├── DEPLOY.md                 (Hướng dẫn deploy)
│   ├── CUSTOMIZATION.md          (Tùy chỉnh)
│   └── TROUBLESHOOTING.md        (Giải quyết lỗi)
│
├── 💻 CODE - Source code
│   ├── app.py                    (Main application)
│   ├── requirements.txt          (Dependencies)
│   ├── .env.example              (Config template)
│   ├── src/                      (Modules)
│   │   ├── ai_handler.py
│   │   ├── input_detector.py
│   │   └── prompts.py
│   └── data/                     (Databases)
│       ├── historical_figures.json
│       └── historical_events.json
│
├── 🔧 SCRIPTS - Run scripts
│   ├── run.bat                   (Windows)
│   └── run.sh                    (Mac/Linux)
│
└── ⚙️ CONFIG
    └── config/config.yaml
```

---

## ⚡ Quick Commands

### Chạy app:

**Windows:**
```bash
run.bat
```

**Mac/Linux:**
```bash
chmod +x run.sh
./run.sh
```

**Manual:**
```bash
pip install -r requirements.txt
streamlit run app.py
```

---

## 🎯 Workflow đề xuất

### Lần đầu sử dụng:

```mermaid
START
  ↓
1. Đọc QUICKSTART.md
  ↓
2. Cài đặt & Chạy app
  ↓
3. Test app local
  ↓
4. Đọc README.md để hiểu rõ hơn
  ↓
5. (Optional) Customize theo CUSTOMIZATION.md
  ↓
6. (Optional) Deploy theo DEPLOY.md
  ↓
DONE! 🎉
```

---

## 📋 Checklist

Trước khi bắt đầu, hãy check:

- [ ] Python 3.8+ đã cài đặt
- [ ] pip đã cài đặt
- [ ] Git đã cài đặt (nếu muốn deploy)
- [ ] API key từ OpenAI hoặc Gemini

**Check Python version:**
```bash
python --version
```

**Lấy API keys:**
- OpenAI: https://platform.openai.com/api-keys
- Gemini: https://makersuite.google.com/app/apikey

---

## 💡 Tips cho người mới

1. **Đừng skip QUICKSTART** - Nó chỉ mất 5 phút!
2. **Test local trước** - Đừng vội deploy
3. **Đọc error messages** - Thường đã có hint
4. **Check TROUBLESHOOTING** - Có thể đã có solution
5. **Backup trước khi sửa** - Git commit is your friend

---

## 🎓 Học từ code

Muốn học cách code?

**Modules để học:**

1. **app.py** → Học Streamlit, UI/UX
2. **ai_handler.py** → Học tích hợp AI APIs
3. **input_detector.py** → Học xử lý text, regex
4. **prompts.py** → Học prompt engineering

**Concepts:**

- ✅ AI/LLM Integration
- ✅ Chatbot Development
- ✅ Web Development (Streamlit)
- ✅ JSON Data Management
- ✅ Environment Variables
- ✅ Error Handling
- ✅ Deployment

---

## 📞 Cần giúp đỡ?

**Tài nguyên:**

1. **Documentation** - Đọc các file .md
2. **Code comments** - Có giải thích trong code
3. **Streamlit Docs** - https://docs.streamlit.io/
4. **OpenAI Docs** - https://platform.openai.com/docs/

**Community:**

- GitHub Issues
- Streamlit Forum
- Stack Overflow

---

## 🌟 Next Steps

Sau khi app chạy thành công:

1. ✅ **Test các tính năng:**
   - Chat với nhân vật
   - Du hành thời gian
   - Thử các nút quick actions

2. ✅ **Customize:**
   - Thêm nhân vật mới
   - Thêm sự kiện mới
   - Đổi theme/colors

3. ✅ **Deploy:**
   - Share với bạn bè
   - Deploy lên internet
   - Collect feedback

4. ✅ **Contribute:**
   - Report bugs
   - Suggest features
   - Improve code

---

## 🎊 Kết

**Bạn đã sẵn sàng!**

Hãy bắt đầu với [QUICKSTART.md](QUICKSTART.md) và tận hưởng hành trình du hành thời gian! 🚀

---

Made with ❤️ for history lovers

*Last updated: 2024*
