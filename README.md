# 🚀 Việt Sử Ký - Cỗ máy du hành thời gian lịch sử

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Streamlit](https://img.shields.io/badge/Streamlit-1.31.0-red.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Một chatbot công khai cho phép bất kỳ ai trò chuyện với các nhân vật lịch sử Việt Nam hoặc du hành đến các mốc thời gian quan trọng.

## ✨ Tính năng

- 🎭 **Trò chuyện với nhân vật lịch sử**: Nhập vai trực tiếp với Hai Bà Trưng, Trần Hưng Đạo, Quang Trung, Hồ Chí Minh, và nhiều anh hùng khác
- ⏰ **Du hành thời gian**: Trải nghiệm các sự kiện lịch sử như đang ở hiện trường (938, 1010, 1288, 1789, 1945...)
- 🤖 **Hỗ trợ nhiều AI**: OpenAI GPT-4, Google Gemini, Llama
- 🎨 **Giao diện đẹp**: UI hiện đại, thân thiện với gradient và animation
- 🌐 **Dễ deploy**: Chạy local hoặc deploy lên Streamlit Cloud, Hugging Face Spaces

## 📸 Demo

```
👤 Người dùng: Xin chào Quang Trung, vì sao ngài chọn đánh trận vào dịp Tết?

🤖 Quang Trung: Ta chào ngươi! Việc chọn thời điểm Tết Nguyên đán để xuất quân không phải
là ngẫu nhiên. Đây là lúc quân Thanh lơ là cảnh giác nhất, họ đang say sưa ăn mừng, không
ngờ ta dám tấn công. Một đòn bất ngờ vào điểm yếu - đó chính là chìa khóa để giữ lấy độc
lập cho dân tộc ta!
```

## 🚀 Cài đặt

### Yêu cầu

- Python 3.8 trở lên
- API key từ OpenAI, Google Gemini, hoặc Llama

### Bước 1: Clone hoặc Download dự án

```bash
# Nếu có git
git clone <repo-url>
cd MINDX

# Hoặc giải nén file zip vào folder MINDX
```

### Bước 2: Cài đặt dependencies

```bash
pip install -r requirements.txt
```

### Bước 3: Cấu hình API keys

1. Copy file `.env.example` thành `.env`:

```bash
copy .env.example .env
```

2. Mở file `.env` và điền API key của bạn:

```env
# Chọn provider: openai, gemini, hoặc llama
AI_PROVIDER=openai

# Nếu dùng OpenAI
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4

# Nếu dùng Gemini
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-pro
```

#### Lấy API Key:

- **OpenAI**: https://platform.openai.com/api-keys
- **Google Gemini**: https://makersuite.google.com/app/apikey

### Bước 4: Chạy ứng dụng

```bash
streamlit run app.py
```

Ứng dụng sẽ mở tại `http://localhost:8501`

## 📁 Cấu trúc dự án

```
MINDX/
│
├── app.py                          # Ứng dụng Streamlit chính
├── requirements.txt                # Python dependencies
├── .env.example                    # Template cho environment variables
├── README.md                       # Tài liệu này
│
├── config/
│   └── config.yaml                 # Cấu hình ứng dụng
│
├── data/
│   ├── historical_figures.json     # Database nhân vật lịch sử
│   └── historical_events.json      # Database sự kiện lịch sử
│
├── src/
│   ├── ai_handler.py              # Module xử lý AI (OpenAI, Gemini, Llama)
│   ├── input_detector.py          # Module phát hiện ý định người dùng
│   └── prompts.py                 # System prompts cho AI
│
└── assets/                        # (Optional) Hình ảnh, CSS, sounds
```

## 🎮 Hướng dẫn sử dụng

### 1. Trò chuyện với nhân vật lịch sử

Chỉ cần nhập tên nhân vật:

```
"Xin chào Trần Hưng Đạo"
"Quang Trung"
"Hồ Chí Minh"
```

AI sẽ nhập vai và trả lời như chính nhân vật đó!

### 2. Du hành thời gian

Nhập năm hoặc sự kiện:

```
"Hãy đưa tôi đến năm 1945"
"Năm 1789"
"Trận Bạch Đằng"
```

AI sẽ mô tả bối cảnh lịch sử như bạn đang ở hiện trường!

### 3. Hỏi câu hỏi lịch sử

```
"Tại sao Quang Trung đánh vào dịp Tết?"
"Chiến thắng Điện Biên Phủ diễn ra như thế nào?"
```

### 4. Sử dụng nút nhanh

Sidebar có các nút nhanh để:
- Du hành đến các năm quan trọng (938, 1789, 1945, 1954...)
- Trò chuyện với nhân vật nổi tiếng

## 🌐 Deploy lên Internet

### Option 1: Streamlit Cloud (Miễn phí, dễ nhất)

1. Push code lên GitHub repository
2. Truy cập https://share.streamlit.io/
3. Đăng nhập bằng GitHub
4. Click "New app" và chọn repository của bạn
5. Thêm secrets (API keys) trong Settings > Secrets:

```toml
AI_PROVIDER = "openai"
OPENAI_API_KEY = "sk-your-key-here"
OPENAI_MODEL = "gpt-4"
```

6. Click "Deploy"!

### Option 2: Hugging Face Spaces

1. Tạo account tại https://huggingface.co/
2. Tạo Space mới, chọn "Streamlit"
3. Upload code
4. Thêm secrets trong Settings
5. Space sẽ tự động deploy!

### Option 3: Railway / Render

Tương tự như Streamlit Cloud, push code lên và connect với platform.

## 🎨 Tùy chỉnh

### Thêm nhân vật lịch sử mới

Chỉnh sửa `data/historical_figures.json`:

```json
{
  "name": "Tên nhân vật",
  "alt_names": ["Tên khác"],
  "period": "1000-1100",
  "role": "Vai trò",
  "personality": "Tính cách",
  "famous_quotes": ["Câu nói nổi tiếng"],
  "context": "Bối cảnh lịch sử"
}
```

### Thêm sự kiện lịch sử

Chỉnh sửa `data/historical_events.json`:

```json
{
  "year": 1945,
  "name": "Tên sự kiện",
  "description": "Mô tả chi tiết",
  "key_figures": ["Nhân vật liên quan"],
  "importance": "Ý nghĩa lịch sử"
}
```

### Thay đổi theme/colors

Chỉnh sửa CSS trong `app.py` tại phần `st.markdown("""<style>...</style>""")`.

## 🛠️ Troubleshooting

### Lỗi: "OPENAI_API_KEY not found"

- Kiểm tra file `.env` đã tạo chưa
- Kiểm tra API key đã nhập đúng chưa
- Restart lại Streamlit app

### Lỗi: "Module not found"

```bash
pip install -r requirements.txt
```

### App chạy chậm

- Giảm `max_tokens` trong sidebar
- Chuyển sang model nhẹ hơn (gpt-3.5-turbo thay vì gpt-4)

## 📝 TODO / Tính năng tương lai

- [ ] Thêm voice chat (speech-to-text)
- [ ] Hỗ trợ nhiều ngôn ngữ (English, Chinese...)
- [ ] Thêm hình ảnh minh họa cho nhân vật/sự kiện
- [ ] Chế độ quiz/game lịch sử
- [ ] Export cuộc trò chuyện ra PDF

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh!

1. Fork project
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 👏 Credits

- Developed with ❤️ using Streamlit
- AI powered by OpenAI, Google, Meta
- Historical data curated from Vietnamese history sources

## 📧 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo Issue trên GitHub!

---

⭐ Nếu bạn thấy project này hữu ích, hãy cho một star nhé! ⭐
