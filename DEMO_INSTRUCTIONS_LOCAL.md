# 🚀 HƯỚNG DẪN DEMO LOCAL - ĐƠN GIẢN

## 🎯 CÁCH CHẠY NHANH NHẤT

### Bước 1: Double-click file này
```
DEMO_LOCAL_NHANH.bat
```
(hoặc `CHAY_NGAY.bat` - cùng chức năng)

### Bước 2: Đợi app mở
- App sẽ tự động mở browser
- Link: http://localhost:8501

### Bước 3: Demo!
Thử ngay:
- "Xin chào Quang Trung"
- "Đưa tôi đến năm 1945"
- "Trận Bạch Đằng diễn ra như thế nào?"

---

## 🎬 KỊCH BẢN DEMO (3 PHÚT)

### Demo 1: Chat với Nhân vật Lịch sử

1. **Chọn nhân vật** ở sidebar:
   - Click "💬 Quang Trung"

2. **Hỏi câu này:**
   ```
   Anh đã đánh tan 29 vạn quân Thanh như thế nào?
   ```

3. **Xem AI trả lời:**
   - Nhập vai hoàn toàn
   - Kể chi tiết sinh động
   - Giọng điệu thời xưa

---

### Demo 2: Du hành Thời gian

1. **Click nút ở sidebar:**
   - "1789 - Ngọc Hồi Đống Đa"

2. **Hoặc gõ:**
   ```
   Hãy đưa tôi đến năm 1789
   ```

3. **Xem AI kể:**
   - Mô tả chi tiết sự kiện
   - Không khí thời điểm đó
   - Ý nghĩa lịch sử

---

### Demo 3: Hỏi đáp Lịch sử

**Gõ thử các câu này:**

```
Trận Bạch Đằng diễn ra như thế nào?
```

```
Ai là Trần Hưng Đạo?
```

```
So sánh Hai Bà Trưng và Bà Triệu
```

AI sẽ trả lời chi tiết, chuyên nghiệp như giáo viên lịch sử!

---

### Demo 4: Tạo Quiz

1. **Chat ít nhất 2 lượt** (ví dụ trên)

2. **Click nút ở sidebar:**
   - "📝 Tạo Quiz từ cuộc trò chuyện"

3. **Làm quiz:**
   - 5 câu trắc nghiệm
   - Tự động từ nội dung chat
   - Có giải thích đáp án

---

## 🎨 CÁC TÍNH NĂNG NỔI BẬT

### 1. Nhập vai Chân thực
- AI hóa thân 100% vào nhân vật
- Xưng hô đúng thời đại
- Tính cách, giọng điệu sống động

### 2. Kiến thức Rộng
- 80+ nhân vật lịch sử
- 40+ sự kiện quan trọng
- Trả lời MỌI câu hỏi lịch sử Việt Nam

### 3. UI/UX Đẹp
- Giao diện gradient đẹp mắt
- Sidebar tiện dụng
- Quick actions thông minh

### 4. Quiz Tự động
- Tạo quiz từ conversation
- Scoring và feedback
- Giải thích chi tiết

---

## 🔧 SETTINGS TRONG APP

### Ở Sidebar:

**1. Chọn AI Provider:**
- OpenAI (GPT-4)
- Gemini (Flash) ⭐ Default
- Llama

**2. Điều chỉnh:**
- Độ sáng tạo: 0.0 - 1.0
- Độ dài phản hồi: 100 - 2000

**3. Quick Actions:**
- Nhân vật nổi tiếng
- Năm lịch sử quan trọng
- Tạo Quiz
- Xóa chat

---

## 🎤 GỢI Ý DEMO SCRIPT

### Khi demo cho người khác:

**Mở đầu (30s):**
> "Đây là Việt Sử Ký - chatbot lịch sử Việt Nam thông minh.
> Bạn có thể trò chuyện với nhân vật lịch sử, du hành thời gian,
> và học lịch sử theo cách hoàn toàn mới."

**Demo 1 - Chat (1 phút):**
> "Để demo, tôi sẽ chat với Quang Trung.
> [Click Quang Trung, gõ câu hỏi]
> Các bạn thấy, AI hoàn toàn nhập vai, nói như chính Quang Trung,
> kể về chiến thắng Ngọc Hồi - Đống Đa rất chi tiết và sinh động."

**Demo 2 - Du hành (1 phút):**
> "Bây giờ tôi muốn du hành về năm 1945.
> [Click button hoặc gõ]
> AI sẽ mô tả bối cảnh, sự kiện quan trọng của năm đó,
> như thể bạn đang ở đó vào thời điểm lịch sử."

**Demo 3 - Quiz (30s):**
> "Sau khi chat, có thể tạo quiz để kiểm tra kiến thức.
> [Click Tạo Quiz]
> Hệ thống tự động tạo 5 câu hỏi từ nội dung đã nói,
> có đáp án và giải thích chi tiết."

**Kết (10s):**
> "App hoàn toàn miễn phí, chạy được trên máy,
> giúp học sinh học lịch sử một cách thú vị và hiệu quả hơn!"

---

## ⚠️ LƯU Ý KHI DEMO

### ✅ NÊN:
- Test trước khi demo chính thức
- Chuẩn bị câu hỏi hay
- Demo từng tính năng rõ ràng
- Giải thích kỹ thuật đằng sau (AI, prompt engineering)

### ❌ KHÔNG NÊN:
- Hỏi câu quá dài, phức tạp
- Refresh page giữa chừng
- Demo khi mạng chậm
- Quên check API key trước

---

## 🐛 XỬ LÝ LỖI KHI DEMO

### Nếu app không chạy:

1. **Check Python:**
   ```bash
   python --version
   ```
   Phải có: Python 3.11+

2. **Check packages:**
   ```bash
   pip install streamlit google-generativeai python-dotenv
   ```

3. **Check .env:**
   - File .env phải có trong folder
   - API key phải hợp lệ

### Nếu AI không trả lời:

1. **Check API key** trong .env
2. **Check internet** connection
3. **Thử lại** sau vài giây

### Nếu UI bị lỗi:

1. **Refresh** browser (F5)
2. **Xóa cache:** Ctrl + Shift + R
3. **Restart app:** Ctrl+C rồi chạy lại

---

## 📊 THÔNG SỐ KỸ THUẬT

**Công nghệ:**
- Framework: Streamlit 1.31+
- AI: Google Gemini 2.5 Flash / OpenAI GPT-4
- Backend: Python 3.11
- Frontend: HTML/CSS/JS (optional)

**Performance:**
- Response time: 2-5 giây
- Concurrency: 1 user (local)
- Token limit: 800 tokens/response

**Data:**
- 80+ nhân vật lịch sử
- 40+ sự kiện lớn
- 2879 TCN → 2007

---

## 📞 HỖ TRỢ

### Nếu có vấn đề:

1. Check file này lại
2. Xem logs trong terminal
3. Google error message
4. Check .env file

---

## 🎉 CHÚC BẠN DEMO THÀNH CÔNG!

**Ready? Start ngay:**
```
Double-click: DEMO_LOCAL_NHANH.bat
```

---

🇻🇳 **Việt Sử Ký - Học lịch sử Việt Nam theo cách mới!** 🎓
