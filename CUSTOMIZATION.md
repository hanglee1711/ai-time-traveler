# 🎨 Hướng dẫn tùy chỉnh AI Time Traveler

## 📝 Thêm nhân vật lịch sử mới

### Bước 1: Mở file database

Mở file `data/historical_figures.json`

### Bước 2: Thêm nhân vật mới

Thêm object mới vào array `figures`:

```json
{
  "name": "Tên đầy đủ của nhân vật",
  "alt_names": [
    "Tên khác 1",
    "Tên khác 2",
    "Biệt danh"
  ],
  "period": "năm sinh - năm mất",
  "role": "Chức vụ, vai trò trong lịch sử",
  "personality": "Tính cách, đặc điểm nổi bật",
  "famous_quotes": [
    "Câu nói nổi tiếng thứ nhất",
    "Câu nói nổi tiếng thứ hai"
  ],
  "context": "Bối cảnh lịch sử, thành tích, đóng góp của nhân vật"
}
```

### Ví dụ cụ thể:

```json
{
  "name": "Bà Triệu",
  "alt_names": ["Triệu Thị Trinh", "Triệu Ẩu"],
  "period": "225-248",
  "role": "Nữ tướng, lãnh đạo khởi nghĩa chống Đông Ngô",
  "personality": "Dũng cảm, kiên cường, quyết liệt, bất khuất",
  "famous_quotes": [
    "Tôi chỉ muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông"
  ],
  "context": "Lãnh đạo cuộc khởi nghĩa chống quân Đông Ngô năm 248, là biểu tượng của tinh thần bất khuất của phụ nữ Việt Nam."
}
```

### Bước 3: Lưu file và restart app

```bash
# Stop app (Ctrl+C)
# Restart
streamlit run app.py
```

### Bước 4: Test

Nhập vào chat:
```
Xin chào Bà Triệu
```

---

## ⏰ Thêm sự kiện lịch sử mới

### Bước 1: Mở file database

Mở file `data/historical_events.json`

### Bước 2: Thêm sự kiện mới

Thêm object mới vào array `events`:

```json
{
  "year": năm_xảy_ra_sự_kiện,
  "name": "Tên sự kiện",
  "description": "Mô tả chi tiết về sự kiện, diễn biến, kết quả",
  "key_figures": [
    "Nhân vật chính 1",
    "Nhân vật chính 2"
  ],
  "importance": "Ý nghĩa lịch sử, tác động của sự kiện"
}
```

### Ví dụ cụ thể:

```json
{
  "year": 1858,
  "name": "Pháp tấn công Đà Nẵng",
  "description": "Hải quân Pháp tấn công cảng Đà Nẵng, mở đầu cuộc xâm lược Việt Nam của thực dân Pháp. Đây là bước ngoặt lịch sử đưa Việt Nam vào thời kỳ thuộc địa gần 100 năm.",
  "key_figures": ["Tự Đức"],
  "importance": "Đánh dấu sự khởi đầu của thời kỳ Pháp thuộc, thay đổi hoàn toàn lịch sử Việt Nam hiện đại."
}
```

### Bước 3: Lưu và restart

### Bước 4: Test

```
Đưa tôi đến năm 1858
```

---

## 🎨 Thay đổi giao diện (UI/Theme)

### Thay đổi màu sắc

Mở file `app.py`, tìm phần CSS trong hàm `st.markdown()`:

```python
st.markdown("""
    <style>
    /* Main background - Thay đổi gradient */
    .stApp {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Đổi màu khác */
    .stApp {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    </style>
""")
```

### Màu sắc đề xuất:

```css
/* Purple */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Sunset */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Ocean */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Forest */
background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);

/* Fire */
background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
```

### Thay đổi font chữ

```python
h1 {
    font-family: 'Georgia', serif;  /* Đổi thành font khác */
}
```

Font options:
- `'Arial', sans-serif` - Modern, clean
- `'Georgia', serif` - Classic, elegant
- `'Courier New', monospace` - Retro, typewriter
- `'Verdana', sans-serif` - Readable

---

## ⚙️ Thay đổi cấu hình

### File: `config/config.yaml`

```yaml
app:
  title: "🚀 AI Time Traveler"  # Đổi title
  subtitle: "Subtitle của bạn"   # Đổi subtitle
  language: "vi"                  # Ngôn ngữ (vi/en)

ai_settings:
  temperature: 0.8      # Độ sáng tạo (0.0-1.0)
  max_tokens: 1000      # Độ dài phản hồi
  top_p: 0.9           # Sampling parameter
```

---

## 🌍 Thêm hỗ trợ ngôn ngữ khác

### Tạo file translations

Tạo file `src/translations.py`:

```python
TRANSLATIONS = {
    'vi': {
        'welcome': 'Chào mừng đến với AI Time Traveler!',
        'chat_placeholder': 'Nhập tin nhắn của bạn...',
        'sidebar_title': '⚙️ Cài đặt',
    },
    'en': {
        'welcome': 'Welcome to AI Time Traveler!',
        'chat_placeholder': 'Type your message...',
        'sidebar_title': '⚙️ Settings',
    }
}
```

### Sử dụng trong app.py

```python
from src.translations import TRANSLATIONS

lang = st.sidebar.selectbox('Language', ['vi', 'en'])
t = TRANSLATIONS[lang]

st.markdown(f"# {t['welcome']}")
```

---

## 🔊 Thêm âm thanh

### Bước 1: Thêm file âm thanh

Tạo folder `assets/sounds/` và thêm file `.mp3` hoặc `.wav`

### Bước 2: Thêm code phát âm thanh

```python
import streamlit as st

# Phát âm thanh khi user gửi tin nhắn
def play_sound():
    audio_file = open('assets/sounds/message.mp3', 'rb')
    audio_bytes = audio_file.read()
    st.audio(audio_bytes, format='audio/mp3')
```

---

## 🖼️ Thêm hình ảnh nhân vật

### Bước 1: Thêm ảnh vào database

Trong `historical_figures.json`:

```json
{
  "name": "Trần Hưng Đạo",
  "image_url": "assets/images/tran_hung_dao.jpg",
  ...
}
```

### Bước 2: Hiển thị ảnh trong app

```python
if figure_data.get('image_url'):
    st.image(figure_data['image_url'], width=200)
```

---

## 📊 Thêm Analytics

### Google Analytics

Thêm vào `app.py`:

```python
# Thêm Google Analytics tracking
st.components.v1.html("""
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
""", height=0)
```

---

## 🎮 Thêm tính năng Quiz

### Tạo file `src/quiz.py`:

```python
def generate_quiz(figure_name):
    questions = [
        {
            "question": f"{figure_name} sống vào thời kỳ nào?",
            "options": ["A. 1000-1100", "B. 1200-1300", "C. 1700-1800"],
            "answer": "B"
        }
    ]
    return questions
```

### Thêm vào sidebar:

```python
if st.sidebar.button("🎯 Quiz Mode"):
    quiz = generate_quiz(current_figure)
    # Display quiz UI
```

---

## 🔧 Advanced: Thêm AI Provider mới

### Ví dụ: Thêm Anthropic Claude

Trong `src/ai_handler.py`:

```python
def _init_claude(self):
    """Initialize Anthropic Claude"""
    try:
        import anthropic
        api_key = os.getenv("CLAUDE_API_KEY")
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = "claude-3-opus-20240229"
    except ImportError:
        raise ImportError("Anthropic package not installed")

def _generate_claude(self, system_prompt, user_message, temperature, max_tokens):
    """Generate response using Claude"""
    response = self.client.messages.create(
        model=self.model,
        max_tokens=max_tokens,
        temperature=temperature,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}]
    )
    return response.content[0].text
```

---

## 💾 Lưu lịch sử chat

### Tạo file `src/storage.py`:

```python
import json
from datetime import datetime

def save_conversation(messages, filename=None):
    """Save conversation to JSON file"""
    if filename is None:
        filename = f"conversation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

    with open(f"data/conversations/{filename}", 'w', encoding='utf-8') as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)
```

### Thêm nút export:

```python
if st.sidebar.button("💾 Export Chat"):
    save_conversation(st.session_state.messages)
    st.success("Đã lưu cuộc trò chuyện!")
```

---

## 📱 Responsive Design

### Thêm CSS cho mobile:

```css
@media (max-width: 768px) {
    .main .block-container {
        padding: 1rem;
    }

    h1 {
        font-size: 1.5rem !important;
    }
}
```

---

## 🎯 Tips

1. **Test trước khi deploy**: Luôn test local trước
2. **Backup**: Git commit trước khi thay đổi lớn
3. **Documentation**: Ghi chú lại những gì bạn thay đổi
4. **Performance**: Giữ database nhẹ, tránh load quá nhiều data

---

## 📚 Resources

- [Streamlit Docs](https://docs.streamlit.io/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [CSS Gradients](https://cssgradient.io/)

---

Chúc bạn customize vui vẻ! 🎨
