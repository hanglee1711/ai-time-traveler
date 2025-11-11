# 🎮 TEST GAME - BẮT ĐẦU TẠI ĐÂY!

## ✅ Backend đang chạy: `http://localhost:5000`

---

## 🚀 **CÁCH TEST NHANH (2 PHÚT)**

### **1. Auto Test** (Kiểm tra kỹ thuật)
Double-click file: **`RUN_TEST_GAME.bat`**

→ Tự động test:
- ✅ Files tồn tại
- ✅ Game data load
- ✅ Sound system OK
- ✅ Performance 60 FPS
- ✅ All systems ready

**Kết quả mong đợi:** 6/6 tests PASS ✅

---

### **2. Chơi Game** (Test trải nghiệm)
Mở: **http://localhost:5000/quiz-battle.html**

**Test ngay:**

#### **A. ÂM THANH 🔊**
1. Click nút 🔊 (góc phải màn hình)
2. Unmute để nghe nhạc
3. Right-click nút 🔊 → Kéo volume slider
4. **Start game** → Nghe nhạc hào tráng!

**Nghe được nhạc không?**
- ✅ CÓ → Perfect! Nhạc epic đang chơi
- ❌ KHÔNG → Check volume, hoặc click vào page 1 lần rồi start lại

#### **B. ANIMATIONS ✨**
1. Click chọn difficulty → Card phải **pulse** (phóng to nhẹ)
2. Start battle → **Sparkles** xuất hiện
3. Chơi đến khi take damage → **Particles explode** + màn hình rung
4. Win game → **Victory sparkles** 3 giây

**Thấy effects không?**
- ✅ CÓ → Animations đẹp, mượt!
- ❌ KHÔNG → Check console (F12) có lỗi gì

#### **C. SMART AI 🤖**
Chơi 3 difficulty khác nhau:

- **Easy**: AI chơi defensive, think chậm (15-25s)
- **Medium**: AI balanced, adaptive
- **Hard**: AI aggressive, attack nhanh

**AI khác nhau không?**
- ✅ CÓ → Smart AI working!
- ❌ KHÔNG → Báo bug

#### **D. CARD EFFECTS 🎴**
Test từng card:

1. **💡 50-50** (1 energy):
   - Dùng card → **2 đáp án sai bị gạch xóa**
   - Còn lại 2 đáp án (1 đúng, 1 sai)

2. **👥 Audience Poll** (2 energy):
   - Dùng card → **Mỗi đáp án hiện %**
   - Đáp án đúng thường % cao nhất

3. **⚔️ Kiếm Bách Việt** (1 energy):
   - Dùng card
   - Chờ AI trả lời SAI
   - → **Số -10 bay lên màu đỏ**
   - → **Particles explode**
   - → **Màn hình rung**
   - HP của AI giảm 10

**Các card khác tương tự, test hết nhé!**

---

## 📊 **KẾT QUẢ MONG ĐỢI**

### **Game Mượt:**
- ✅ Load < 2 giây
- ✅ 60 FPS smooth
- ✅ Không lag
- ✅ Animations đẹp

### **Âm Thanh:**
- ✅ BGM hào tráng (epic Vietnamese music)
- ✅ Sound effects mỗi action
- ✅ TTS nói tiếng Việt ("Đúng!", "Sai!")
- ✅ Volume control working

### **AI:**
- ✅ Easy: Chơi safe
- ✅ Medium: Cân bằng
- ✅ Hard: Attack mạnh

---

## 🎵 **VỀ ÂM NHẠC**

### **Hiện tại:**
Game dùng **YouTube embed** (hidden) để chơi nhạc epic:
- Nhạc hào tráng lịch sử Việt Nam
- Loop tự động
- No copyright
- Hidden (không thấy video)

### **Nếu muốn nhạc riêng:**

1. Download nhạc MP3 (royalty-free)
2. Đổi tên: `battle_theme.mp3`
3. Copy vào: `frontend/audio/`
4. Game tự động detect và play!

**Nguồn nhạc free:**
- YouTube Audio Library
- FreeMusicArchive
- Incompetech
- Bensound

---

## 🐛 **NẾU CÓ LỖI**

### **Không nghe thấy nhạc:**
1. Check volume button (unmute)
2. Click vào page 1 lần (browser cần user interaction)
3. Refresh page
4. Check browser không block autoplay

### **Animations lag:**
1. Close other tabs
2. Check CPU usage
3. Update browser

### **Cards không work:**
1. Check console (F12)
2. Screenshot error
3. Report bug

---

## ✅ **CHECKLIST TEST**

Chơi 1 game đầy đủ và check:

**Must Have:**
- [ ] Nghe được nhạc nền
- [ ] All 10 cards work
- [ ] Animations smooth
- [ ] AI smart decisions
- [ ] Game mượt 60 FPS
- [ ] Win/lose correctly

**Nice to Have:**
- [ ] Particles đẹp
- [ ] Sound phong phú
- [ ] Victory sparkles ấn tượng
- [ ] Volume control ok
- [ ] No bugs

---

## 🎯 **RATING**

Sau khi test, đánh giá:

**Gameplay:** ⭐⭐⭐⭐⭐
**Graphics:** ⭐⭐⭐⭐⭐
**Sound:** ⭐⭐⭐⭐⭐
**AI:** ⭐⭐⭐⭐⭐
**Overall:** ⭐⭐⭐⭐⭐

**Đạt đẳng cấp chưa?** 🏆

---

## 📞 **BÁO CÁO**

**Nếu tất cả OK:**
✅ Game đã đạt **ĐẲNG CẤP**!
✅ Ready for users!
✅ Production quality!

**Nếu có bug:**
1. Screenshot
2. Check console log (F12)
3. Note steps to reproduce

---

## 🚀 **BẮT ĐẦU TEST!**

1. **Double-click:** `RUN_TEST_GAME.bat`
2. **Hoặc mở:** http://localhost:5000/quiz-battle.html
3. **Chơi và test tất cả!**

**Good luck! Enjoy the game!** 🎮🎉
