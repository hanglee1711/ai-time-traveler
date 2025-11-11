# HỆ THỐNG CỘNG XP ĐÃ ĐƯỢC SỬA

## ✅ CÁC VẤN ĐỀ ĐÃ KHẮC PHỤC

### 1. **Vấn đề phát hiện**
- Mini Quiz (game.js) **KHÔNG cộng XP lên server**
- Chỉ lưu vào localStorage, không đồng bộ với backend
- Khiến user không thấy XP tăng lên trong database

### 2. **Giải pháp đã áp dụng**

#### ✏️ File đã sửa: `frontend/js/game.js`
- **Dòng 1050**: Thêm `async` vào hàm `saveQuizStats()`
- **Dòng 1071-1093**: Thêm code gọi `API.trackActivity('quiz', ...)` để sync XP với server

```javascript
// Track activity with server to sync XP
const token = Auth.getToken();
if (token) {
    try {
        const response = await API.trackActivity('quiz', {
            correct: gameState.correctAnswers,
            total: gameState.currentQuiz.questions.length
        });

        if (response && response.xp_earned > 0) {
            console.log(`✅ Quiz XP synced with server: +${response.xp_earned} XP`);
            if (response.leveled_up) {
                showNotification(`🎉 Level Up! Level ${response.level}!`, 'success');
            }
            // Update status bar
            if (window.updateStatusBar) {
                await updateStatusBar();
            }
        }
    } catch (error) {
        console.log('Failed to sync quiz XP with server', error);
    }
}
```

## 🎯 FLOW CỘNG XP HIỆN TẠI (ĐÃ ĐỒNG BỘ)

### 1. **Chatbot** (chatbot.js:361)
```javascript
XPTracker.addXP(5, 'chat', { figure: currentFigure.name });
```
- ✅ Gọi `XPTracker.addXP()`
- ✅ Internally gọi `/api/stats/track-activity`
- ✅ Backend cộng 5 XP cho mỗi tin nhắn chat
- ✅ Hiển thị notification +5 XP
- ✅ Update status bar

### 2. **Mini Quiz** (game.js:1050)
```javascript
await API.trackActivity('quiz', {
    correct: gameState.correctAnswers,
    total: gameState.currentQuiz.questions.length
});
```
- ✅ Gọi `/api/stats/track-activity`
- ✅ Backend cộng 10 XP cho mỗi câu đúng
- ✅ Hiển thị notification XP earned
- ✅ Update status bar

### 3. **Quiz Battle** (quiz-battle.js:895)
```javascript
await API.trackActivity('quiz_battle', {
    result: battleResult,
    score: result.playerStats.score,
    correct: result.playerStats.correctAnswers,
    accuracy: result.playerStats.accuracy
});
```
- ✅ Gọi `/api/stats/track-activity`
- ✅ Backend cộng 50 XP nếu thắng, 10 XP nếu thua
- ✅ Hiển thị notification XP earned
- ✅ Update status bar

## 📊 BACKEND XP REWARDS (backend/app.py:796-831)

| Activity | XP Earned | Điều kiện |
|----------|-----------|-----------|
| Chat với nhân vật | 5 XP | Mỗi tin nhắn |
| Mini Quiz | 10 XP | Mỗi câu đúng |
| Quiz Battle - Win | 50 XP | Chiến thắng |
| Quiz Battle - Lose | 10 XP | Tham gia |
| Timeline Event | 5 XP | Xem sự kiện |
| Map Location | 5 XP | Khám phá địa điểm |

## 🧪 CÁCH TEST

### 1. **Đảm bảo Backend đang chạy**
```bash
cd backend
python app.py
# Server chạy tại http://localhost:5000
```

### 2. **Đăng nhập vào app**
- Mở trình duyệt: http://localhost:5000
- Đăng nhập hoặc đăng ký tài khoản
- **QUAN TRỌNG**: Phải đăng nhập để XP sync với server!

### 3. **Test từng tính năng**

#### A. Test Chatbot
1. Vào trang Chatbot
2. Chọn một nhân vật lịch sử
3. Gửi tin nhắn
4. **Kiểm tra**:
   - Notification "+5 XP" xuất hiện góc phải màn hình
   - Status bar phía trên tăng XP
   - Console log: "✅ XP synced with server"

#### B. Test Mini Quiz
1. Vào trang Trò Chơi
2. Click "Bắt đầu ngay" ở Mini Quiz
3. Chọn chủ đề
4. Trả lời 10 câu hỏi
5. **Kiểm tra**:
   - Màn hình kết quả hiện "+XX XP"
   - Notification xuất hiện
   - Status bar tăng XP
   - Console log: "✅ Quiz XP synced with server"

#### C. Test Quiz Battle
1. Vào trang Quiz Battle
2. Chọn độ khó
3. Bắt đầu trận đấu
4. Chơi hết 10 câu hỏi
5. **Kiểm tra**:
   - Màn hình Game Over hiện "+XX XP"
   - Notification xuất hiện
   - Status bar tăng XP

### 4. **Kiểm tra Database**
```bash
# Xem XP trong database
python -c "from backend.models import db, User; from backend.app import app; app.app_context().push(); users = User.query.all(); print([(u.username, u.xp, u.level, u.total_points) for u in users])"
```

## 🎨 HIỂN THỊ XP

### 1. **Notification Popup**
- Hiển thị góc phải màn hình: "+X XP"
- Màu vàng gradient
- Animation slide in/out
- Tự động biến mất sau 2 giây

### 2. **Status Bar (Phía trên header)**
```
⭐ Level X    💫 XXX XP    🏆 X Huy hiệu
```
- Update real-time sau mỗi hoạt động
- Sync với server nếu đăng nhập
- Fallback localStorage nếu offline

### 3. **Level Up Notification**
- Popup lớn giữa màn hình
- Text "LEVEL UP!" + Level mới
- Animation bounce
- Hiển thị 3 giây

## 🔧 DEBUG

### Nếu XP không tăng:

1. **Kiểm tra Console (F12)**
   ```javascript
   // Phải thấy các log này:
   "🎯 XPTracker.addXP called: X XP for [activity]"
   "✅ XP synced with server:"
   "✅ Quiz XP synced with server: +X XP"
   ```

2. **Kiểm tra Network Tab (F12)**
   - Request POST `/api/stats/track-activity`
   - Status: 200 OK
   - Response chứa: `xp_earned`, `current_xp`, `level`

3. **Kiểm tra đã đăng nhập**
   ```javascript
   // Console
   Auth.getToken()
   // Phải trả về token, không phải null
   ```

4. **Kiểm tra Backend logs**
   - Terminal chạy backend phải hiện:
   ```
   POST /api/stats/track-activity - 200
   ```

## 📝 NOTES

- **Quan trọng**: User **PHẢI đăng nhập** để XP sync với server
- Nếu không đăng nhập, XP chỉ lưu localStorage (không persistent)
- Backend đang chạy ở `http://localhost:5000`
- Frontend fetch từ `http://localhost:5000/api`

## ✨ KẾT LUẬN

Hệ thống cộng XP giờ đã hoàn toàn đồng bộ:
- ✅ Chatbot cộng XP ✓
- ✅ Mini Quiz cộng XP ✓
- ✅ Quiz Battle cộng XP ✓
- ✅ Tất cả đều sync với backend
- ✅ Status bar update real-time
- ✅ Notification hiển thị đẹp
- ✅ Database lưu persistent

**Test ngay để thấy XP tăng!** 🎉
