# 🎮 HƯỚNG DẪN TRÒ CHƠI - VIỆT KÝ SỬ

## Tổng quan

Phần trò chơi của Việt Sử Ký bao gồm 3 tính năng chính:
1. **Mini Quiz** - Kiểm tra kiến thức lịch sử với 10 câu hỏi
2. **Nhiệm vụ hàng ngày** - Hoàn thành để nhận XP
3. **Bảng xếp hạng** - Cạnh tranh với người chơi khác

---

## 🚀 Cách chạy ứng dụng

### Bước 1: Khởi động Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Chạy server Flask
python app.py
```

Backend sẽ chạy tại: `http://localhost:5000`

### Bước 2: Khởi động Frontend

**Cách 1: Dùng Python HTTP Server**
```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Chạy server
python -m http.server 8000
```

**Cách 2: Dùng Live Server (VS Code)**
1. Cài extension "Live Server"
2. Click phải vào `frontend/index.html`
3. Chọn "Open with Live Server"

Frontend sẽ chạy tại: `http://localhost:8000` hoặc port của Live Server

### Bước 3: Truy cập trang Game

Mở trình duyệt và truy cập:
```
http://localhost:8000/game.html
```

---

## 🎯 Hướng dẫn sử dụng

### 1. Mini Quiz

#### Cách chơi:
1. Click vào card "Mini Quiz" hoặc nút "Bắt đầu ngay"
2. Đọc kỹ câu hỏi và 4 đáp án A, B, C, D
3. Click chọn đáp án bạn cho là đúng
4. Hệ thống sẽ hiển thị:
   - Đáp án đúng (màu xanh)
   - Đáp án sai (màu đỏ nếu bạn chọn sai)
   - Giải thích chi tiết
5. Click "Câu tiếp theo" để chuyển sang câu hỏi kế tiếp
6. Sau câu hỏi cuối cùng, click "Nộp bài"

#### Hệ thống điểm:
- **Câu dễ (Easy)**: +10 điểm
- **Câu trung bình (Medium)**: +15 điểm
- **Câu khó (Hard)**: +20 điểm

#### Phần thưởng XP:
- Điểm cơ bản từ câu trả lời đúng
- **Bonus theo tỷ lệ đúng**:
  - ≥ 90% đúng: +50 XP
  - ≥ 70% đúng: +30 XP
  - ≥ 50% đúng: +10 XP

#### Màn hình kết quả:
- Tỷ lệ phần trăm đúng
- Số câu đúng/sai
- Tổng điểm
- Thời gian hoàn thành
- XP nhận được

#### Các nút:
- **🔄 Làm lại**: Chơi lại quiz mới
- **📋 Về menu**: Quay về trang chủ game

### 2. Nhiệm vụ hàng ngày

#### Các loại nhiệm vụ:
1. **💬 Trò chuyện 3 lượt** (+20 XP)
   - Trò chuyện với nhân vật lịch sử 3 lần
   - Tự động cập nhật khi bạn chat với nhân vật

2. **❓ Hoàn thành 1 quiz** (+30 XP)
   - Hoàn thành một bài quiz bất kỳ
   - Cập nhật khi bạn nộp bài quiz

3. **⏰ Khám phá 5 sự kiện** (+25 XP)
   - Xem chi tiết 5 sự kiện lịch sử
   - Cập nhật khi bạn xem timeline

#### Đặc điểm:
- Nhiệm vụ reset mỗi ngày
- Progress bar hiển thị tiến độ
- Nhận thông báo khi hoàn thành
- XP được cộng tự động

### 3. Bảng xếp hạng

#### Thông tin hiển thị:
- **Hạng**: Vị trí của người chơi
- **Avatar**: Biểu tượng đại diện
- **Tên**: Tên người chơi
- **Level**: Cấp độ hiện tại
- **XP**: Tổng điểm kinh nghiệm

#### Đặc điểm:
- Top 3 có màu sắc đặc biệt:
  - 🥇 #1: Vàng
  - 🥈 #2: Bạc
  - 🥉 #3: Đồng
- Người chơi hiện tại được highlight
- Tự động cập nhật khi có XP mới

---

## 💾 Lưu trữ dữ liệu

Dữ liệu được lưu trong **LocalStorage** của trình duyệt:

### Dữ liệu người dùng:
```javascript
{
  totalXP: 0,           // Tổng XP
  level: 1,             // Level hiện tại
  quizzesTaken: 0,      // Số quiz đã làm
  totalScore: 0,        // Tổng điểm
  correctAnswers: 0,    // Tổng câu đúng
  wrongAnswers: 0       // Tổng câu sai
}
```

### Nhiệm vụ hàng ngày:
```javascript
{
  date: "Mon Jan 01 2024",  // Ngày hiện tại
  list: [...]               // Danh sách nhiệm vụ
}
```

### Bảng xếp hạng:
```javascript
[
  {
    id: "user",
    name: "Bạn",
    avatar: "👤",
    xp: 150,
    level: 2
  },
  // ... các người chơi khác
]
```

---

## 🎨 Tính năng nổi bật

### 1. Giao diện đẹp mắt:
- Theme Dark Navy, Gold và Electric Blue
- Hiệu ứng hover mượt mà
- Animation khi chuyển đổi màn hình
- Progress bar trực quan
- Glow effects cho buttons

### 2. Trải nghiệm người dùng:
- Responsive design (hoạt động tốt trên mobile)
- Feedback ngay lập tức khi chọn đáp án
- Giải thích chi tiết cho mỗi câu hỏi
- Notification đẹp khi level up hoặc hoàn thành nhiệm vụ
- Smooth scroll animations

### 3. Gamification:
- Hệ thống XP và Level
- Nhiệm vụ hàng ngày
- Bảng xếp hạng
- Badges (có thể mở rộng)
- Difficulty levels cho câu hỏi

---

## 📊 Dữ liệu Quiz

### Nguồn câu hỏi:

1. **API Backend** (Ưu tiên):
   - Gọi `POST /api/quiz/generate`
   - AI tạo câu hỏi động
   - Có thể customize topic, difficulty, count

2. **Fallback Data** (Dự phòng):
   - File `data/quiz_questions.json`
   - 20 câu hỏi cố định về lịch sử Việt Nam
   - Được sử dụng khi API lỗi

### Cấu trúc câu hỏi:
```json
{
  "id": 1,
  "question": "Câu hỏi?",
  "options": {
    "A": "Đáp án A",
    "B": "Đáp án B",
    "C": "Đáp án C",
    "D": "Đáp án D"
  },
  "correct": "A",
  "explanation": "Giải thích chi tiết",
  "difficulty": "easy",
  "category": "ancient"
}
```

---

## 🔧 Tùy chỉnh

### Thêm câu hỏi mới:

Chỉnh sửa `data/quiz_questions.json`:
```json
{
  "id": 21,
  "question": "Câu hỏi mới?",
  "options": {
    "A": "Đáp án A",
    "B": "Đáp án B",
    "C": "Đáp án C",
    "D": "Đáp án D"
  },
  "correct": "B",
  "explanation": "Giải thích...",
  "difficulty": "medium",
  "category": "modern"
}
```

### Thay đổi điểm thưởng:

Sửa trong `frontend/js/game.js`:
```javascript
function getQuestionScore(difficulty) {
    const scores = {
        easy: 10,      // Thay đổi giá trị này
        medium: 15,    // Thay đổi giá trị này
        hard: 20       // Thay đổi giá trị này
    };
    return scores[difficulty] || 10;
}
```

### Thêm nhiệm vụ mới:

Sửa trong `frontend/js/game.js` hàm `getDailyMissions()`:
```javascript
{
    id: 'new_mission',
    icon: '🎯',
    title: 'Tên nhiệm vụ',
    description: 'Mô tả nhiệm vụ',
    current: 0,
    target: 5,
    reward: 20,
    completed: false
}
```

### Thay đổi XP/Level:

Hiện tại: 100 XP = 1 Level

Để thay đổi, sửa trong `frontend/js/game.js`:
```javascript
// Dòng này tính level
const newLevel = Math.floor(stats.totalXP / 100) + 1;
// Thay 100 thành giá trị khác
```

---

## 🐛 Troubleshooting

### Quiz không load:
1. Kiểm tra backend đang chạy (`http://localhost:5000/api/health`)
2. Kiểm tra console browser (F12) để xem lỗi
3. Nếu API lỗi, quiz sẽ tự động dùng dữ liệu fallback

### Nhiệm vụ không cập nhật:
1. Kiểm tra LocalStorage có bị xóa không
2. Xóa LocalStorage và refresh: `localStorage.clear()`
3. Nhiệm vụ tự reset mỗi ngày

### Bảng xếp hạng không hiển thị:
1. Chơi ít nhất 1 quiz để có XP
2. Kiểm tra console browser
3. Reset LocalStorage nếu cần

### CSS không load:
1. Kiểm tra file `css/game.css` đã được tạo
2. Kiểm tra đường dẫn trong HTML
3. Clear browser cache (Ctrl + F5)

---

## 🎮 Mẹo chơi

1. **Tối ưu điểm số**:
   - Trả lời càng nhanh càng tốt
   - Đọc kỹ giải thích để học hỏi
   - Làm lại quiz để cải thiện điểm

2. **Level up nhanh**:
   - Hoàn thành nhiệm vụ hàng ngày
   - Làm quiz với điểm cao
   - Khám phá nhiều nhân vật và sự kiện

3. **Lên top bảng xếp hạng**:
   - Chơi đều đặn mỗi ngày
   - Tích lũy XP từ nhiều nguồn
   - Hoàn thành tất cả nhiệm vụ

---

## 📝 Ghi chú

- Dữ liệu chỉ lưu trên máy local (LocalStorage)
- Không có hệ thống đăng nhập/đăng ký
- Xóa LocalStorage sẽ mất hết tiến độ
- Quiz questions có thể được AI tạo động (nếu backend hoạt động)
- Có thể chơi offline nếu đã load trang

---

## 🚀 Tính năng sắp tới

- [ ] Chế độ multiplayer (cạnh tranh real-time)
- [ ] Thêm nhiều loại quiz (theo chủ đề)
- [ ] Achievements/Badges system
- [ ] Leaderboard toàn server
- [ ] Quiz timer (giới hạn thời gian)
- [ ] Hint system (gợi ý)
- [ ] Share kết quả lên social media
- [ ] Weekly/Monthly challenges

---

## 📧 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser (F12)
2. Kiểm tra backend logs
3. Xem lại hướng dẫn này
4. Báo lỗi qua GitHub Issues

---

**Chúc bạn chơi vui vẻ và học được nhiều kiến thức lịch sử! 🎉**
