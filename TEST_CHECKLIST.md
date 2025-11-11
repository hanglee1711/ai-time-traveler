# 🧪 QUIZ BATTLE ARENA - TEST CHECKLIST

## ✅ PHASE 1A + 1B: HOÀN THÀNH

Backend đang chạy tại: **http://localhost:5000**

Game URL: **http://localhost:5000/quiz-battle.html** hoặc mở trực tiếp `frontend/quiz-battle.html`

---

## 🎮 **TEST SCENARIOS**

### **1. GAME START**
- [ ] Click chọn difficulty (Easy/Medium/Hard)
- [ ] Button "Bắt đầu trận đấu" enable sau khi chọn
- [ ] Click start → Nghe âm thanh "Bắt đầu trận đấu!" (TTS)
- [ ] Game arena hiển thị với HP bars, Energy, Shield
- [ ] Player có 3 cards trong tay
- [ ] Timer bắt đầu đếm từ 30s

### **2. SOUND SYSTEM** 🔊
- [ ] Click nút 🔊 ở góc phải → Mute/unmute
- [ ] Right-click nút 🔊 → Volume slider hiện ra
- [ ] Kéo slider → Volume thay đổi
- [ ] Settings được lưu vào localStorage

### **3. CARD EFFECTS TESTING**

#### **Card #1: Gợi Ý 50-50 💡** (Knowledge, 1 Energy)
- [ ] Dùng card khi có 1+ energy
- [ ] Nghe âm thanh "beep" cao (1500Hz)
- [ ] **2 đáp án sai bị gạch, mờ đi, background đỏ**
- [ ] Còn lại 2 đáp án: 1 đúng + 1 sai
- [ ] Không click được vào đáp án đã loại

#### **Card #2: Gia Hạn Thời Gian ⏰** (Knowledge, 1 Energy)
- [ ] Dùng card khi có 1+ energy
- [ ] Notification "⏰ +15s thời gian!"
- [ ] Timer tăng lên +15 giây (ví dụ: 20s → 35s)
- [ ] Timer bar update đúng

#### **Card #3: Hỏi Khán Giả 👥** (Knowledge, 2 Energy, Cooldown 1 turn)
- [ ] Dùng card khi có 2+ energy
- [ ] **Mỗi đáp án hiện % bầu chọn** (ví dụ: 45%, 25%, 20%, 10%)
- [ ] Đáp án đúng thường có % cao nhất (40-60%)
- [ ] Progress bar màu xanh hiện ở dưới mỗi đáp án
- [ ] Notification "👥 Khán giả đã bầu chọn!"

#### **Card #4: Kiếm Bách Việt ⚔️** (Attack, 1 Energy)
- [ ] Dùng card khi có 1+ energy
- [ ] Âm thanh attack (beep thấp 400Hz)
- [ ] Chờ đối thủ AI trả lời
- [ ] **Nếu AI trả lời SAI**:
  - [ ] **Số damage -10 bay lên màu đỏ** (floating animation)
  - [ ] **Màn hình AI rung (screen shake)**
  - [ ] Âm thanh damage (beep thấp)
  - [ ] HP của AI giảm 10 (trừ khi có shield)
- [ ] Nếu AI trả lời đúng: không damage

#### **Card #5: Đốt Năng Lượng 🔥** (Attack, 2 Energy, Cooldown 2 turns)
- [ ] Dùng card khi có 2+ energy
- [ ] Energy của AI giảm 1 ngay lập tức
- [ ] AI khó dùng card đắt tiền hơn
- [ ] Notification "Đối thủ mất 1 năng lượng"

#### **Card #6: Tâm Lý Chiến 😰** (Attack, 1 Energy, Cooldown 1 turn)
- [ ] Dùng card khi có 1+ energy
- [ ] Câu hỏi tiếp theo (của AI):
  - [ ] AI có ít thời gian hơn (timer giảm 5s)
  - [ ] Notification "Giảm 5s thời gian đối thủ"
- [ ] **Khi AI dùng card này** (test bằng cách chơi nhiều turn):
  - [ ] Câu hỏi của BẠN có timer giảm xuống 25s
  - [ ] Notification "😰 -5s thời gian! Đối thủ dùng Tâm Lý Chiến!"

#### **Card #7: Lá Chắn Đồng 🛡️** (Defense, 1 Energy)
- [ ] Dùng card khi có 1+ energy
- [ ] Shield +1 (hiện số shield ở stat bar)
- [ ] **Âm thanh shield** (beep 1000Hz)
- [ ] Khi bị attack tiếp theo:
  - [ ] Shield giảm 1, HP không giảm
  - [ ] Console log "blocked attack with shield!"

#### **Card #8: Thuốc Nam Thần Kỳ 💊** (Defense, 2 Energy, Cooldown 2 turns)
- [ ] Dùng card khi có 2+ energy
- [ ] HP +15 ngay lập tức
- [ ] **Âm thanh heal** (beep 600-800-1000Hz melody)
- [ ] HP bar tăng smooth
- [ ] Notification "+15 HP"

#### **Card #9: Bình Định Thiên Hạ 🎴** (Special, 2 Energy, Cooldown 3 turns)
- [ ] Dùng card khi có 2+ energy
- [ ] **Rút 2 lá bài mới** vào tay
- [ ] **Âm thanh rút bài** (beep 800Hz)
- [ ] Hand tăng từ X cards → X+2 cards (max 5)
- [ ] Notification "Rút 2 thẻ bài"

#### **Card #10: Đổi Vận Đảo Càn Khôn 🔄** (Special, 3 Energy, Cooldown 3 turns)
- [ ] Dùng card khi có 3 energy
- [ ] Timer dừng lại
- [ ] Notification "🔄 Đang đổi sang câu hỏi mới..."
- [ ] **Câu hỏi hiện tại biến mất**
- [ ] **Câu hỏi MỚI xuất hiện** (khác câu cũ)
- [ ] Timer reset về 30s
- [ ] Notification "✨ Đã đổi sang câu hỏi mới!"

### **4. ANSWER FEEDBACK**
- [ ] Click đáp án đúng:
  - [ ] Âm thanh "Đúng!" (TTS)
  - [ ] Beep cao 800-1200Hz
  - [ ] Đáp án chọn highlight xanh
  - [ ] +10-30 điểm tùy độ khó
- [ ] Click đáp án sai:
  - [ ] Âm thanh "Sai!" (TTS)
  - [ ] Beep thấp 600-300Hz
  - [ ] Đáp án chọn highlight đỏ
  - [ ] Đáp án đúng hiện màu xanh
  - [ ] 0 điểm
- [ ] Explanation box hiển thị

### **5. TIMER WARNINGS**
- [ ] Timer ở 10s → Beep warning + màu vàng
- [ ] Timer ở 5s → Beep warning + màu đỏ
- [ ] Timer hết → Âm thanh timeout (beep 400-200-100Hz)
- [ ] Notification "Hết giờ!"
- [ ] Tính như trả lời sai

### **6. TURN FLOW**
- [ ] Sau khi bạn trả lời:
  - [ ] AI tự động trả lời (2-3s delay)
  - [ ] Notification hiện kết quả AI
  - [ ] Nếu AI dùng card → Notification "AI sử dụng [CardName]!"
- [ ] Click "Lượt tiếp theo":
  - [ ] **Âm thanh turn start** (beep 1000Hz)
  - [ ] Energy +1 cho cả 2 players
  - [ ] **Âm thanh energy gain** (beep 400-600-800Hz)
  - [ ] Rút 1 lá mới mỗi 2 turns
  - [ ] Question mới load

### **7. GAME OVER**
- [ ] Khi player HP = 0:
  - [ ] BGM dừng
  - [ ] Âm thanh "Thất bại!" (TTS)
  - [ ] Beep defeat (800-600-400-200Hz)
  - [ ] Icon 💀
- [ ] Khi AI HP = 0:
  - [ ] BGM dừng
  - [ ] Âm thanh "Chiến thắng!" (TTS)
  - [ ] Beep victory (800-1000-1200-1500Hz)
  - [ ] Icon 🏆
- [ ] Sau 10 turns → Tính theo điểm
- [ ] Stats hiển thị:
  - [ ] Score của cả 2
  - [ ] HP còn lại
  - [ ] Số câu đúng
  - [ ] Accuracy %
  - [ ] XP nhận được
- [ ] Button "Chơi lại" → Reset game
- [ ] Button "Về menu" → về game.html

### **8. UI POLISH**
- [ ] HP bars smooth animation khi giảm/tăng
- [ ] Card hover → scale 1.05
- [ ] Card disabled khi không đủ energy → opacity 0.5
- [ ] Card cooldown hiển thị
- [ ] Effects display hiện messages 3 giây
- [ ] Notification system hoạt động
- [ ] Responsive trên mobile (optional test)

---

## 🐛 **KNOWN BUGS TO FIX**

1. [ ] Card draw sound có thể play nhiều lần (check logic)
2. [ ] Timer warning sound có thể loop (fix với flag)
3. [ ] Damage animation có thể overlap (add debounce)
4. [ ] Audience poll % không sum đúng 100% (fix distribution logic)

---

## 🎯 **PERFORMANCE CHECKS**

- [ ] Game load < 2 giây
- [ ] No console errors
- [ ] No memory leaks (check DevTools Performance)
- [ ] Sounds không lag game
- [ ] Smooth 60fps animations

---

## 📈 **COMPLETION STATUS**

✅ **PHASE 1A: Card Effects** - 10/10 cards working
✅ **PHASE 1B: Sound System** - Full audio feedback
🔄 **Testing** - In progress
⏳ **PHASE 1C: Animations** - Next
⏳ **PHASE 1D: AI Improvements** - Next

---

## 🚀 **HOW TO TEST**

1. **Start backend**:
   ```bash
   python backend/app.py
   ```

2. **Open game**:
   - Browser: `http://localhost:5000/quiz-battle.html`
   - Or: Directly open `frontend/quiz-battle.html`

3. **Test each card systematically**:
   - Play a game
   - Collect energy (starts at 0, +1 per turn, max 3)
   - Use each card and verify effects
   - Check visual + audio feedback

4. **Report bugs**:
   - Screenshot or record video
   - Note steps to reproduce
   - Check console for errors (F12)

---

**Game is ready for testing! 🎮**
