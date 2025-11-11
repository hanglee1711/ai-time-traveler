# 🚀 HƯỚNG DẪN NHANH - VIỆT KÝ SỬ

## ✅ ĐÃ SỬA XONG!

Vấn đề model Gemini đã được fix. Chatbot bây giờ sẽ hoạt động hoàn hảo!

---

## 🔥 CÁCH CHẠY CHATBOT:

### **Bước 1: Khởi động Backend**

Mở **Terminal 1** và chạy:

```bash
cd backend
python app.py
```

➡️ Bạn sẽ thấy:
```
🚀 VIỆT KÝ SỬ Backend API
Server starting on http://localhost:5000
```

### **Bước 2: Khởi động Frontend**

Mở **Terminal 2** và chạy:

```bash
cd frontend
python -m http.server 8000
```

➡️ Bạn sẽ thấy:
```
Serving HTTP on :: port 8000
```

### **Bước 3: Mở Chatbot**

Trình duyệt tự động mở hoặc vào:
```
http://localhost:8000/chatbot.html
```

---

## ✅ KIỂM TRA HOẠT ĐỘNG:

1. Click vào **"Hai Bà Trưng"** ở sidebar
2. Hỏi: **"Hai Bà đã khởi nghĩa như thế nào?"**
3. AI sẽ trả lời chi tiết với vai Hai Bà Trưng!

---

## 🎯 THỬ CÁC CÂU HỎI:

### Với nhân vật:
```
"Xin chào Trần Hưng Đạo"
"Anh đã đánh thắng Mông Cổ như thế nào?"
"Chiến lược cọc ngầm sông Bạch Đằng ra sao?"
"Anh có lời khuyên cho thế hệ trẻ?"
```

### Câu hỏi chung:
```
"Trận Bạch Đằng 938 diễn ra thế nào?"
"So sánh 3 lần thắng Bạch Đằng"
"Tại sao Điện Biên Phủ quan trọng?"
```

---

## 🐛 NẾU VẪN LỖI:

### 1. Backend không chạy:
```bash
# Kiểm tra:
curl http://localhost:5000/api/health

# Hoặc mở browser:
http://localhost:5000/api/health

# Phải thấy: {"status": "ok"}
```

### 2. Frontend không load:
```bash
# Đảm bảo đang ở đúng thư mục:
cd C:\MINDX\frontend
python -m http.server 8000
```

### 3. API vẫn không trả lời:
- Đợi 5-10 giây sau khi khởi động backend
- Refresh browser (Ctrl + F5)
- Kiểm tra console browser (F12)

---

## 📊 MODEL GEMINI:

Đã sửa sang: **gemini-2.5-flash**
- ✅ Nhanh
- ✅ Miễn phí
- ✅ Chất lượng cao
- ✅ Trả lời chi tiết

---

## 🎮 CHƠI GAME:

Sau khi chatbot hoạt động, thử game:
```
http://localhost:8000/game.html
```

---

## 💡 MẸO:

1. **Hỏi chi tiết** để được trả lời sâu
2. **Thử nhiều nhân vật** khác nhau
3. **Hỏi về cảm xúc** của nhân vật
4. **Yêu cầu lời khuyên** cho thế hệ trẻ

---

## 📧 HỖ TRỢ:

Nếu vẫn gặp vấn đề:
1. Kiểm tra file `.env` có đúng API key
2. Xem logs trong terminal backend
3. Kiểm tra console browser (F12 → Console tab)

---

**Chúc bạn sử dụng vui vẻ! 🇻🇳🎉**
