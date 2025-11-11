# 🔗 LINKS DEMO - VIỆT KÝ SỬ

## 🚀 SAU KHI CHẠY SERVERS:

### **Backend API:**
```
http://localhost:5000
```
- Health check: http://localhost:5000/api/health
- Figures API: http://localhost:5000/api/figures
- Timeline API: http://localhost:5000/api/timeline

---

### **Frontend Pages:**

#### 🏠 **Trang Chủ (Home):**
```
http://localhost:8000/index.html
```
hoặc
```
http://localhost:8000/
```

#### 💬 **Chatbot (CHÍNH):**
```
http://localhost:8000/chatbot.html
```
**← ĐÂY LÀ TRANG CHATBOT CẢI TIẾN!**

#### 🎮 **Game Zone:**
```
http://localhost:8000/game.html
```
- Mini Quiz
- Nhiệm vụ hàng ngày
- Bảng xếp hạng

#### ⏰ **Dòng Thời Gian:**
```
http://localhost:8000/timeline.html
```

#### 🗺️ **Bản Đồ:**
```
http://localhost:8000/map.html
```

#### 📔 **Hành Trình của Tôi:**
```
http://localhost:8000/journey.html
```

---

## 🎯 LINK QUAN TRỌNG NHẤT:

### **CHATBOT CẢI TIẾN:**
```
👉 http://localhost:8000/chatbot.html
```

Tính năng:
- ✅ Trả lời MỌI câu hỏi lịch sử Việt Nam
- ✅ Nhập vai CHÂN THỰC với mọi nhân vật
- ✅ Sử dụng Gemini 2.5 Flash
- ✅ Câu trả lời dài & chi tiết

---

## 📝 GHI CHÚ:

### Trước khi mở link:

1. **Đảm bảo Backend đang chạy:**
   ```bash
   cd backend
   python app.py
   ```
   Phải thấy: `Server starting on http://localhost:5000`

2. **Đảm bảo Frontend đang chạy:**
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   Phải thấy: `Serving HTTP on :: port 8000`

3. **Hoặc dùng script tự động:**
   ```
   Double-click: START_ALL.bat
   ```

---

## 🔥 QUICK ACCESS:

Copy & paste vào browser:

### Chatbot:
```
http://localhost:8000/chatbot.html
```

### Game:
```
http://localhost:8000/game.html
```

### Trang chủ:
```
http://localhost:8000/
```

---

## 🐛 Nếu link không mở được:

### 1. Kiểm tra Backend:
```bash
curl http://localhost:5000/api/health
```
Hoặc mở browser: `http://localhost:5000/api/health`

Phải trả về:
```json
{"status": "ok", "message": "Việt Sử Ký API is running"}
```

### 2. Kiểm tra Frontend:
Mở: `http://localhost:8000`

Phải thấy trang home hoặc danh sách files.

### 3. Kiểm tra port đã được sử dụng chưa:
```bash
netstat -ano | findstr :5000
netstat -ano | findstr :8000
```

Nếu đã có process khác dùng port này, kill hoặc đổi port.

---

## 🎨 DEMO FLOW:

### Khuyến nghị thứ tự trải nghiệm:

1. **Mở trang chủ:** `http://localhost:8000/`
   - Xem giao diện tổng quan
   - Click "Bắt đầu" hoặc "Chatbot"

2. **Vào Chatbot:** `http://localhost:8000/chatbot.html`
   - Chọn nhân vật ở sidebar (VD: Trần Hưng Đạo)
   - Hỏi: "Anh đã đánh thắng Mông Cổ như thế nào?"
   - Xem AI trả lời chi tiết!

3. **Chơi Game:** `http://localhost:8000/game.html`
   - Làm Mini Quiz (10 câu hỏi)
   - Xem nhiệm vụ hàng ngày
   - Kiểm tra bảng xếp hạng

4. **Khám phá Timeline:** `http://localhost:8000/timeline.html`
   - Xem các sự kiện lịch sử
   - Click vào sự kiện để xem chi tiết

5. **Hành trình:** `http://localhost:8000/journey.html`
   - Xem tiến độ học tập
   - Level, XP, huy hiệu

---

## 📱 BOOKMARK NHANH:

Thêm vào bookmark browser:

| Tên | URL |
|-----|-----|
| 🏠 Home | http://localhost:8000/ |
| 💬 Chatbot | http://localhost:8000/chatbot.html |
| 🎮 Game | http://localhost:8000/game.html |
| ⏰ Timeline | http://localhost:8000/timeline.html |
| 📔 Journey | http://localhost:8000/journey.html |

---

## 🎉 READY TO GO!

**Link chính để demo:**
```
http://localhost:8000/chatbot.html
```

**Nhớ chạy servers trước!**
```
Double-click: START_ALL.bat
```

---

**Chúc bạn demo thành công! 🇻🇳🎉**
