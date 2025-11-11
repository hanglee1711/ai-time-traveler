# SỬA LỖI CHATBOT KHÔNG HIỂN THỊ NHÂN VẬT

## ✅ ĐÃ SỬA

Tôi đã thêm:
1. Console logs để debug
2. API_BASE_URL fallback
3. Error handling tốt hơn

## 🎯 CÁCH KHẮC PHỤC

### **Bước 1: Đảm bảo Backend đang chạy**
```bash
cd backend
python app.py
```

Phải thấy:
```
Server starting on http://localhost:5000
```

### **Bước 2: Mở Chatbot qua Server (QUAN TRỌNG!)**

✅ **ĐÚNG**:
```
http://localhost:5000/chatbot.html
```

❌ **SAI** (không hoạt động):
```
file:///C:/MINDX/frontend/chatbot.html
```

### **Bước 3: Mở Console để xem logs**
1. Nhấn `F12` trong trình duyệt
2. Chuyển sang tab `Console`
3. Bạn sẽ thấy:
   ```
   🔄 Loading figures...
   📡 Fetching from API: http://localhost:5000/api/figures
   ✅ API Response: {...}
   ✅ Loaded 20 figures from API
   🎨 Displaying figures...
   ✅ Figures displayed successfully
   ```

### **Bước 4: Nếu vẫn lỗi**

#### Lỗi 1: "CORS policy"
**Giải pháp**: Phải mở qua http://localhost:5000, KHÔNG mở file trực tiếp

#### Lỗi 2: "Failed to fetch"
**Giải pháp**:
1. Kiểm tra backend có đang chạy không
2. Thử: `curl http://localhost:5000/api/figures`
3. Nếu không có kết quả → restart backend

#### Lỗi 3: "API not available, using sample data"
**Giải pháp**:
- Chatbot sẽ tự động dùng dữ liệu mẫu (fallback)
- Vẫn có thể dùng được, chỉ không load từ server

## 🧪 TEST

### Test 1: API Health
```bash
curl http://localhost:5000/api/health
```
Kết quả:
```json
{
  "status": "ok",
  "message": "Việt Sử Ký API is running"
}
```

### Test 2: API Figures
```bash
curl http://localhost:5000/api/figures
```
Kết quả: Danh sách 20 nhân vật lịch sử

### Test 3: Chatbot Page
1. Mở: http://localhost:5000/chatbot.html
2. F12 → Console
3. Phải thấy: "✅ Figures displayed successfully"
4. Sidebar bên trái hiển thị danh sách nhân vật

## 📊 DEBUG

Nếu vẫn không thấy nhân vật:

1. **Mở Console (F12)**
2. **Xem logs màu đỏ (errors)**
3. **Screenshot và báo lỗi**

Console logs sẽ cho biết chính xác vấn đề gì:
- ❌ CORS error → Mở sai URL
- ❌ 404 error → Backend không chạy
- ❌ Network error → Firewall chặn

## ✨ SAU KHI SỬA XONG

Chatbot sẽ:
1. ✅ Hiển thị danh sách 20 nhân vật lịch sử bên trái
2. ✅ Click chọn nhân vật
3. ✅ Nhập tin nhắn và chat
4. ✅ Gemini AI trả lời nhập vai nhân vật đó
5. ✅ Cộng +5 XP mỗi tin nhắn

## 🚀 DEMO NHANH

Nếu muốn test nhanh mà không cần fix:
```
Mở file: TEST_CHATBOT.html
```
Trang này:
- ✅ Đơn giản hơn
- ✅ Hiển thị rõ status
- ✅ Dễ debug hơn

## 📝 GHI CHÚ

- Backend PHẢI chạy trước
- PHẢI mở qua http://localhost:5000
- F12 Console là công cụ debug tốt nhất
