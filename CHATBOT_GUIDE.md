# 💬 HƯỚNG DẪN SỬ DỤNG CHATBOT - VIỆT KÝ SỬ

## 🌟 Tổng quan

Chatbot Việt Sử Ký đã được **CẢI TIẾN TOÀN DIỆN** để:
- ✅ Trả lời được **MỌI CÂU HỎI** về lịch sử Việt Nam
- ✅ Nhập vai **CỰC KỲ CHÂN THỰC** với từng nhân vật
- ✅ Sử dụng **Gemini AI** với prompts được tối ưu hóa
- ✅ Câu trả lời **DÀI, CHI TIẾT, SINH ĐỘNG**

---

## 🚀 Cách chạy Chatbot

### Bước 1: Khởi động Backend

```bash
cd backend
python app.py
```

Backend sẽ chạy tại: `http://localhost:5000`

### Bước 2: Khởi động Frontend

```bash
cd frontend
python -m http.server 8000
```

Frontend sẽ chạy tại: `http://localhost:8000`

### Bước 3: Truy cập Chatbot

Mở trình duyệt: `http://localhost:8000/chatbot.html`

---

## 🎭 Tính năng Chatbot

### 1. **Nhập vai nhân vật lịch sử**

#### Cách sử dụng:
1. Click vào nhân vật ở sidebar bên trái
2. Hoặc nhập tên nhân vật bất kỳ trong ô chat

#### Nhân vật được hỗ trợ:
- **Có trong database**: Hai Bà Trưng, Trần Hưng Đạo, Lê Lợi, Quang Trung, Hồ Chí Minh, Võ Nguyên Giáp...
- **Bất kỳ nhân vật lịch sử Việt Nam nào**: AI sẽ tự động nghiên cứu và nhập vai!

#### Ví dụ câu hỏi:
```
"Xin chào Trần Hưng Đạo"
"Anh đã đánh thắng quân Nguyên-Mông như thế nào?"
"Chiến lược cọc ngầm sông Bạch Đằng được bố trí ra sao?"
"Anh nghĩ gì về tinh thần yêu nước của người Việt?"
```

### 2. **Trả lời mọi câu hỏi lịch sử**

#### Loại câu hỏi được hỗ trợ:
✅ **Sự kiện**: "Trận Bạch Đằng diễn ra như thế nào?"
✅ **Nhân vật**: "Ngô Quyền là ai? Ông có công lao gì?"
✅ **Thời kỳ**: "Triều đại nhà Lý có những thành tựu gì?"
✅ **So sánh**: "So sánh 3 lần chiến thắng Bạch Đằng"
✅ **Phân tích**: "Tại sao Điện Biên Phủ lại quan trọng?"
✅ **Triết lý**: "Ý nghĩa của câu 'Không có gì quý hơn độc lập tự do'?"

#### AI sẽ TRẢ LỜI TẤT CẢ, không từ chối!

### 3. **Tính năng đặc biệt**

#### 🎯 Quick Actions:
- "Hỏi về sự kiện nổi bật"
- "Nghe kể chuyện đời"
- "Triết lý sống"
- "Chiến thuật quân sự"

#### 🔍 Tìm kiếm nhân vật:
- Gõ tên vào ô search ở sidebar
- Filter theo tên hoặc thời kỳ

#### 📊 Hệ thống XP:
- +10 XP khi gặp nhân vật mới
- +5 XP mỗi tin nhắn
- Level up mỗi 100 XP

---

## 🎨 Điểm nổi bật của prompts mới

### 1. **Prompts cho nhập vai nhân vật**

#### Đặc điểm:
- 📜 Phân tích sâu về nhân vật: thời đại, vai trò, tính cách
- 🎭 Hướng dẫn chi tiết cách nhập vai theo từng thời kỳ
- 💬 Ngôn ngữ phù hợp: "ta/ngươi" (cổ đại), "tôi/bạn" (hiện đại)
- 📚 Yêu cầu trả lời MỌI câu hỏi lịch sử
- ❤️ Thể hiện đầy đủ cảm xúc con người

#### Công thức thành công:
```
Nghiên cứu → Nhập vai → Kể chuyện → Chia sẻ cảm xúc → Rút bài học
```

### 2. **Prompts cho câu hỏi chung**

#### Đặc điểm:
- 🎓 Định vị là "Chuyên gia lịch sử hàng đầu"
- 📖 Bao quát toàn bộ lịch sử Việt Nam
- ✍️ Hướng dẫn trả lời chi tiết, sinh động
- 🔍 Phân tích đa chiều: nguyên nhân - diễn biến - kết quả - ý nghĩa
- 💡 Không bao giờ từ chối câu hỏi

### 3. **Cải tiến AI Handler**

#### Gemini được tối ưu:
- 🔥 **Temperature**: 0.9 (tăng sáng tạo)
- 📝 **Max Tokens**: 2000 (câu trả lời dài hơn)
- 🛡️ **Safety Settings**: BLOCK_NONE (không bị chặn)
- ⚙️ **Top-p**: 0.95, **Top-k**: 40 (cân bằng sáng tạo & logic)

#### Format prompt đặc biệt:
```
System Prompt
━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Người dùng hỏi: [câu hỏi]
🎭 Hãy trả lời ngay (giữ vai, tự nhiên, chi tiết)
```

---

## 💡 Mẹo sử dụng hiệu quả

### 1. **Hỏi chi tiết để được trả lời sâu**

❌ **Tránh hỏi ngắn:**
```
"Trần Hưng Đạo là ai?"
```

✅ **Nên hỏi cụ thể:**
```
"Trần Hưng Đạo đã dùng chiến thuật gì để đánh thắng 300,000 quân Nguyên-Mông? Ông đã chuẩn bị như thế nào?"
```

### 2. **Khám phá nhiều góc độ**

Ví dụ với Quang Trung:
1. "Anh đã trở thành hoàng đế như thế nào?"
2. "Trận Ngọc Hồi - Đống Đa diễn ra ra sao?"
3. "Anh cảm thấy thế nào khi đánh thắng 29 vạn quân Thanh?"
4. "Anh có lời khuyên gì cho thế hệ trẻ?"

### 3. **Thử nghiệm các loại câu hỏi**

#### Câu hỏi cảm xúc:
```
"Anh có sợ hãi khi ra trận không?"
"Khoảnh khắc nào anh tự hào nhất?"
```

#### Câu hỏi triết lý:
```
"Theo anh, thế nào là một vị tướng tài ba?"
"Yêu nước nghĩa là gì?"
```

#### Câu hỏi giả định:
```
"Nếu anh sống ở thời hiện đại, anh sẽ làm gì?"
"Anh nghĩ gì về việc học sinh ngày nay học về anh?"
```

---

## 🔧 Tùy chỉnh nâng cao

### Thay đổi Temperature (Độ sáng tạo)

File: `backend/app.py`

```python
response_text = ai_handler.generate_response(
    system_prompt=system_prompt,
    user_message=user_message,
    temperature=0.9,  # 0.0 = logic, 1.0 = sáng tạo
    max_tokens=2000   # Độ dài câu trả lời
)
```

### Thay đổi Model Gemini

File: `.env`

```env
# Thử các model khác
GEMINI_MODEL=gemini-2.0-flash-exp     # Nhanh nhất (hiện tại)
GEMINI_MODEL=gemini-1.5-pro           # Thông minh nhất
GEMINI_MODEL=gemini-1.5-flash         # Cân bằng
```

### Thêm nhân vật mới vào database

File: `data/historical_figures.json`

```json
{
  "name": "Lý Thường Kiệt",
  "period": "Nhà Lý (1019-1105)",
  "role": "Đại tướng quân, nhà thơ",
  "personality": "Dũng cảm, văn võ song toàn",
  "context": "Thời kỳ nhà Lý, đánh thắng quân Tống...",
  "famous_quotes": ["Nam quốc sơn hà..."],
  "icon": "⚔️",
  "description": "Tướng tài ba..."
}
```

---

## 🐛 Xử lý sự cố

### Chatbot không trả lời:
1. ✅ Kiểm tra backend đang chạy: `http://localhost:5000/api/health`
2. ✅ Kiểm tra Gemini API key trong `.env`
3. ✅ Xem console browser (F12) để debug
4. ✅ Kiểm tra logs trong terminal backend

### Câu trả lời bị ngắn:
- Tăng `max_tokens` trong `backend/app.py`
- Hiện tại đã set 2000, có thể tăng lên 4000

### Câu trả lời không giữ vai:
- Prompts đã được tối ưu để luôn giữ vai
- Nếu vẫn lỗi: restart backend và thử lại

### API bị limit:
- Gemini free có giới hạn: 15 requests/minute
- Đợi 1 phút và thử lại
- Hoặc nâng cấp API key

---

## 📊 So sánh Before & After

### TRƯỚC KHI CẢI TIẾN:

❌ Chỉ trả lời nhân vật có trong database
❌ Câu trả lời ngắn (max 1000 tokens)
❌ Không nhập vai sâu, thiếu cảm xúc
❌ Từ chối một số câu hỏi
❌ Temperature thấp (0.7-0.8)

### SAU KHI CẢI TIẾN:

✅ Trả lời **BẤT KỲ** nhân vật lịch sử Việt Nam nào
✅ Câu trả lời dài, chi tiết (max 2000 tokens)
✅ Nhập vai **CỰC CHÂN THỰC**, đầy cảm xúc
✅ **KHÔNG BAO GIỜ** từ chối câu hỏi
✅ Temperature cao (0.9), sáng tạo hơn
✅ Prompts được thiết kế chuyên nghiệp
✅ Safety settings tối ưu

---

## 🎯 Ví dụ thực tế

### Ví dụ 1: Nhập vai Trần Hưng Đạo

**Người dùng:** "Anh đã đánh thắng quân Nguyên-Mông 3 lần như thế nào?"

**AI (vai Trần Hưng Đạo):**
```
"Ha ha, đây quả là câu hỏi hay! Ta xin kể cho ngươi nghe.

Lần đầu năm 1258, ta còn trẻ, nhưng đã thấy rõ điểm yếu của quân Mông Cổ.
Chúng mạnh ở kỵ binh đồng bằng, nhưng yếu trên sông nước. Ta bèn dùng
chiến thuật du kích, đánh rồi rút, làm địch mỏi mệt...

[Tiếp tục kể chi tiết 3 lần, với cảm xúc, chiến thuật, kỷ niệm...]

Điều quan trọng nhất ngươi à, không phải cọc ngầm hay chiến thuật,
mà là lòng yêu nước của toàn dân. Đó mới là sức mạnh bất khả chiến bại!"
```

### Ví dụ 2: Câu hỏi chung

**Người dùng:** "Tại sao chiến dịch Điện Biên Phủ lại quan trọng?"

**AI (vai Chuyên gia):**
```
Chiến dịch Điện Biên Phủ (13/3 - 7/5/1954) là một trong những chiến thắng
quan trọng nhất lịch sử Việt Nam, được mệnh danh "lừng lẫy năm châu,
chấn động địa cầu".

Ý NGHĨA QUÂN SỰ:
• Tiêu diệt 16,200 địch...
• Bắt sống tướng De Castries...

Ý NGHĨA CHÍNH TRỊ:
• Buộc Pháp ký Hiệp định Genève...

[Tiếp tục phân tích chi tiết các góc độ...]

Bài học: Một dân tộc đoàn kết, có chiến lược đúng đắn,
dù nhỏ bé vẫn có thể chiến thắng cường quốc!
```

---

## 🚀 Nâng cao hơn nữa

### Thêm Context từ lịch sử chat:
Hiện tại mỗi câu hỏi độc lập. Có thể cải tiến:
- Lưu conversation history
- Gửi kèm context trong API call
- AI sẽ nhớ câu hỏi trước và trả lời liên tục

### Multi-turn conversation:
```python
# Trong backend/app.py
messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": "Câu hỏi 1"},
    {"role": "assistant", "content": "Trả lời 1"},
    {"role": "user", "content": "Câu hỏi 2"},
]
```

---

## 📝 Tổng kết

### ✅ Đã cải thiện:
1. ✅ Prompts được thiết kế chuyên nghiệp cho nhập vai
2. ✅ Tăng temperature & max_tokens
3. ✅ Tối ưu Gemini với safety settings
4. ✅ Format prompt đặc biệt cho Gemini
5. ✅ Trả lời MỌI câu hỏi lịch sử

### 🎯 Kết quả:
- Chatbot nhập vai **CỰC KỲ CHÂN THỰC**
- Trả lời được **TẤT CẢ** câu hỏi lịch sử
- Câu trả lời **DÀI, CHI TIẾT, SINH ĐỘNG**
- **KHÔNG BAO GIỜ** từ chối trả lời

### 🔥 Hãy thử ngay!
```bash
# Terminal 1: Backend
cd backend && python app.py

# Terminal 2: Frontend
cd frontend && python -m http.server 8000

# Browser: http://localhost:8000/chatbot.html
```

---

**Chúc bạn có những trải nghiệm tuyệt vời với Chatbot Việt Sử Ký! 🇻🇳⭐**
