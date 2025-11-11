# 🎮 VIỆT KÝ SỬ - GAME DESIGN DOCUMENT

## 🎯 Tổng Quan

3 game đẳng cấp cao về lịch sử Việt Nam với gameplay sâu, đồ họa đẹp, và giá trị giáo dục cao.

---

## 🎲 GAME 1: CHIẾN THUẬT LỊCH SỬ (Strategy Battle)

### Concept
- **Thể loại**: Turn-based Strategy Game
- **Gameplay**: Người chơi điều khiển quân đội trong các trận đánh lịch sử nổi tiếng
- **Mục tiêu**: Tái hiện và giành chiến thắng trong các trận đánh lịch sử

### Chủ Đề & Nội Dung

#### **Chiến Dịch 1: Thời Kỳ Dựng Nước**
- Trận Bạch Đằng 938 (Ngô Quyền vs Nam Hán)
- Trận Như Nguyệt (Lý Thường Kiệt vs Tống)

#### **Chiến Dịch 2: Chống Ngoại Xâm**
- 3 lần kháng chiến chống Mông Cổ (1258, 1285, 1288)
- Trận Chi Lăng (Lê Lợi vs Minh)
- Trận Rạch Gầm - Xoài Mút (Nguyễn Huệ vs Xiêm)

#### **Chiến Dịch 3: Thời Hiện Đại**
- Điện Biên Phủ 1954
- Chiến dịch Hồ Chí Minh 1975

### Core Mechanics

#### 1. **Map System**
```
- Lưới ô vuông hex (hexagonal grid)
- Địa hình ảnh hưởng di chuyển & chiến đấu:
  * Núi: Phòng thủ +30%, di chuyển chậm
  * Rừng: Ẩn náu, phục kích
  * Sông: Cản trở, cần thuyền
  * Đồng bằng: Di chuyển nhanh
```

#### 2. **Unit Types**
```
🗡️ Bộ Binh (Infantry)
  - HP: 100 | ATK: 15 | DEF: 20 | MOVE: 3
  - Đa năng, phòng thủ tốt

🏹 Cung Thủ (Archer)
  - HP: 70 | ATK: 25 | DEF: 10 | MOVE: 2
  - Tầm xa (3 ô), yếu cận chiến

🐴 Kỵ Binh (Cavalry)
  - HP: 120 | ATK: 30 | DEF: 15 | MOVE: 5
  - Di chuyển nhanh, đột kích

🛡️ Võ Sĩ Tinh Nhuệ (Elite Warriors)
  - HP: 150 | ATK: 40 | DEF: 30 | MOVE: 3
  - Mạnh nhưng đắt, giới hạn số lượng

⚔️ Tướng (Commander)
  - HP: 200 | ATK: 50 | DEF: 40 | MOVE: 4
  - Buff toàn quân, có skill đặc biệt
```

#### 3. **Special Abilities** (Chiến Thuật Lịch Sử)
```
⚡ Cọc Ngầm Bạch Đằng
  - Đặt cọc dưới sông, địch mắc phải -50% HP
  - Chỉ dùng 1 lần/trận

🔥 Đánh Úp Ban Đêm
  - Tấn công bất ngờ, ATK +100%, địch không phản công
  - Cooldown: 3 turn

🌾 Kế Thanh Dã
  - Phá hủy lương thực địch, mỗi turn địch mất 10 HP/unit
  - Kéo dài 5 turn

🏔️ Phục Binh
  - Ẩn quân trong rừng/núi, đợi địch đi qua → tấn công
  - Damage x2

🎯 Bắn Tỉa Chiến Thuật
  - Chọn 1 unit địch → giảm 70% HP
  - Cooldown: 5 turn
```

#### 4. **Turn-Based System**
```
Mỗi Turn:
1. Planning Phase: Xem bản đồ, lập kế hoạch
2. Movement Phase: Di chuyển quân
3. Action Phase: Tấn công, dùng skill, phòng thủ
4. Enemy Turn: AI hành động
5. End Turn: Tính toán, kiểm tra điều kiện thắng/thua
```

#### 5. **Victory Conditions**
```
✅ Tiêu diệt toàn bộ tướng địch
✅ Giữ vững cứ điểm chính trong 10 turn
✅ Hoàn thành mục tiêu đặc biệt (VD: bảo vệ dân làng)
```

### UI/UX Design

```
┌─────────────────────────────────────────────┐
│  TRẬN BẠCH ĐẰNG 938    Turn: 5/20   Gold: 500│
├─────────────────────────────────────────────┤
│                                             │
│  [Minimap]     [Battlefield Grid]          │
│   (Góc)         (Hex Map 20x15)            │
│                                             │
│  ┌───────┐      ┌───────────────┐          │
│  │ Units │      │  [Unit Stats] │          │
│  │ Panel │      │   HP: █████   │          │
│  └───────┘      │   ATK: 25     │          │
│                 │   DEF: 15     │          │
│                 └───────────────┘          │
├─────────────────────────────────────────────┤
│ [Actions] [Move] [Attack] [Special] [End Turn]│
└─────────────────────────────────────────────┘
```

### Progression System
```
⭐ Level System: Càng chơi nhiều → unlock trận đánh khó hơn
🎖️ Medals: Hoàn thành objectives đặc biệt
📜 Codex: Unlock thông tin lịch sử chi tiết
🔓 Units: Mở khóa unit mới khi thắng chiến dịch
```

---

## 🗺️ GAME 2: HÀNH TRÌNH ANH HÙNG (Story Adventure)

### Concept
- **Thể loại**: Interactive Story / Visual Novel với minigames
- **Gameplay**: Theo chân nhân vật lịch sử, đưa ra quyết định, trải nghiệm cuộc đời họ
- **Mục tiêu**: Hiểu sâu về nhân vật, trải nghiệm lịch sử qua góc nhìn cá nhân

### Chủ Đề & Nhân Vật

#### **Chapter 1: Hai Bà Trưng - Khởi Nghĩa Vì Dân**
```
📖 Story Arc:
- Phần 1: Cuộc sống yên bình ở Mê Linh
- Phần 2: Bi kịch (chồng bị giết)
- Phần 3: Quyết tâm khởi nghĩa
- Phần 4: Tập hợp nghĩa quân
- Phần 5: Giải phóng 65 thành trì
- Phần 6: Xưng vương và cai trị
- Phần 7: Cuộc chiến cuối cùng với Mã Viện
- Phần 8: Lựa chọn kết thúc (3 endings)

🎮 Minigames:
- Tập luyện võ nghệ (rhythm game)
- Thuyết phục dân chúng (dialogue choices)
- Chiến đấu (combat minigame)
- Quản lý vương quốc (resource management)
```

#### **Chapter 2: Trần Hưng Đạo - Đại Tướng Anh Hùng**
```
📖 Story Arc:
- Thiếu thời tu luyện
- Trận đầu tiên với Mông Cổ
- Chiến thuật Bạch Đằng
- Lãnh đạo 3 lần kháng chiến
- Di sản để lại

🎮 Minigames:
- Đánh cờ (strategy puzzle)
- Luyện binh (troop training)
- Chiến đấu boss
```

#### **Chapter 3: Nguyễn Trãi - Văn Võ Song Toàn**
```
📖 Story Arc:
- Học giả thời trẻ
- Tham gia nghĩa quân Lam Sơn
- Bình Ngô Đại Cáo
- Trở thành quốc sư

🎮 Minigames:
- Viết văn thơ (word puzzle)
- Giải đố (riddles)
- Ngoại giao (persuasion)
```

### Core Mechanics

#### 1. **Choice System** (Lựa Chọn Quan Trọng)
```
Mỗi chapter có 5-10 choice points quan trọng:

Example:
┌─────────────────────────────────────┐
│ Tô Định vừa giết chồng em...       │
│ Em sẽ làm gì?                       │
├─────────────────────────────────────┤
│ ⚔️ Nổi lên khởi nghĩa ngay        │
│    (+용기, -계획성)                  │
│                                     │
│ 📜 Chuẩn bị kỹ càng trước          │
│    (+Wisdom, +Support)              │
│                                     │
│ 💬 Cầu viện từ triều đình          │
│    (+Diplomacy, -Independence)      │
└─────────────────────────────────────┘

→ Choices affect:
  - Story branches
  - Character relationships
  - Endings (Good/Normal/Bad)
  - Unlockables
```

#### 2. **Relationship System**
```
Mối quan hệ với NPC:
❤️❤️❤️❤️🤍 Trưng Nhị (Sister) - 80%
❤️❤️❤️🤍🤍 Thi Sách (Husband) - 60%
❤️❤️🤍🤍🤍 Phùng Thị Chính - 40%
```

#### 3. **Stats & Attributes**
```
📊 Character Stats (ảnh hưởng choices & endings):
- Courage (用気): Dũng cảm
- Wisdom (智慧): Trí tuệ
- Leadership (領導): Lãnh đạo
- Compassion (慈悲): Nhân từ
```

#### 4. **Minigames Integration**
```
Trong suốt story, có minigames xen kẽ:
- Rhythm game (combat)
- Puzzle (strategy planning)
- Quick Time Events (critical moments)
- Resource management (ruling)
```

### UI/UX Design

```
┌─────────────────────────────────────────┐
│  Chapter 1: HAI BÀ TRƯNG               │
│  Part 3/8: Khởi Nghĩa                  │
├─────────────────────────────────────────┤
│                                         │
│        [Character Portrait]             │
│        (Animated, Full Color)           │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Dialogue Box                      │ │
│  │ "Ta thề sẽ báo thù cho chồng..."│ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Choices appear here]                  │
│                                         │
├─────────────────────────────────────────┤
│ ❤️ Relationships | 📊 Stats | 💾 Save  │
└─────────────────────────────────────────┘
```

### Endings System
```
Mỗi chapter có 3 endings:

🌟 TRUE ENDING
- Unlock khi đạt đủ stats & choices đúng
- Reveal full historical truth
- Best rewards

⭐ GOOD ENDING
- Normal path
- Good outcome

💔 BAD ENDING
- Wrong choices
- Tragic outcome
- Can retry from checkpoints
```

---

## 🎴 GAME 3: ĐẤU TRÍ LỊCH SỬ (Quiz Battle Arena)

### Concept
- **Thể loại**: Competitive Quiz Battle với Card Game mechanics
- **Gameplay**: 1v1 quiz battle (PvP hoặc vs AI), sử dụng thẻ bài và power-ups
- **Mục tiêu**: Trả lời đúng nhanh, sử dụng chiến thuật để thắng đối thủ

### Chủ Đề & Categories

#### **8 Categories** (Chia theo chủ đề lịch sử)
```
1. 👑 Triều Đại & Nhà Nước
2. ⚔️ Chiến Tranh & Kháng Chiến
3. 🎭 Nhân Vật Lịch Sử
4. 📜 Văn Hóa & Văn Học
5. 🏛️ Di Sản & Di Tích
6. 🌍 Ngoại Giao & Quan Hệ
7. 🔬 Khoa Học & Kỹ Thuật
8. 🎨 Nghệ Thuật & Kiến Trúc
```

### Core Mechanics

#### 1. **Battle Flow**
```
Round Structure (5 rounds/match):

┌─ ROUND START ─┐
│               │
│ 1. Category Selection (luân phiên)
│ 2. Question Appears (15s)
│ 3. Both players answer
│ 4. Scoring & Damage calculation
│ 5. Card/Power-up phase
│               │
└─ NEXT ROUND ─┘

Win Condition: Giảm HP đối thủ về 0 HOẶC điểm cao hơn sau 5 rounds
```

#### 2. **Scoring System**
```
Base Points:
✅ Correct Answer: 100 pts
❌ Wrong Answer: 0 pts

Time Bonus:
⚡ <5s: +50 pts
⚡ 5-10s: +25 pts
⚡ >10s: +0 pts

Combo System:
🔥 2 correct in a row: x1.5 multiplier
🔥🔥 3 correct: x2 multiplier
🔥🔥🔥 4+ correct: x3 multiplier

Damage to Opponent:
- Correct answer → Deal damage = points/10
- Example: 150 pts → 15 damage
```

#### 3. **Card System** (Thẻ Bài Chiến Thuật)

```
🎴 Card Types:

💡 KNOWLEDGE CARDS (Tri Thức)
├─ 📖 "Mở Sách" - Reveal 1 wrong answer
├─ ⏰ "Gia Hạn" - +10s for next question
├─ 🔮 "Tiên Tri" - See question category in advance
└─ 💭 "Gợi Ý" - Show hint

⚔️ ATTACK CARDS (Tấn Công)
├─ ⚡ "Sét Đánh" - Deal 20 bonus damage
├─ 🔥 "Hỏa Thiêu" - Opponent loses 15 HP
├─ 💥 "Bom Thời Gian" - Reduce opponent time by 5s
└─ 🗡️ "Chí Mạng" - Next correct answer → double damage

🛡️ DEFENSE CARDS (Phòng Thủ)
├─ 🛡️ "Khiên Vàng" - Block 50% damage for 1 round
├─ 💊 "Hồi Sinh" - Restore 30 HP
├─ 🔄 "Hoán Đổi" - Swap scores with opponent
└─ ⏸️ "Đóng Băng" - Freeze opponent's cards for 1 round

🌟 SPECIAL CARDS (Đặc Biệt)
├─ 🎰 "May Rủi" - Random effect (risk/reward)
├─ 🔁 "Thời Gian Ngược" - Retry last question
├─ 🎭 "Đổi Chỗ" - Change question category
└─ 👥 "Bầu Cử" - Audience vote (50/50 help)
```

#### 4. **Deck Building**
```
Players build a deck of 10 cards:
- Max 3 cards of same type
- Must have at least 1 card from each category (Knowledge/Attack/Defense)
- Unlock rare cards by winning matches

Card Rarity:
⚪ Common (60% drop)
🟢 Uncommon (25% drop)
🔵 Rare (10% drop)
🟣 Epic (4% drop)
🟠 Legendary (1% drop)
```

#### 5. **Ranked Mode**
```
Tier System:
🥉 Bronze: 0-999 MMR
🥈 Silver: 1000-1999 MMR
🥇 Gold: 2000-2999 MMR
💎 Diamond: 3000-3999 MMR
👑 Master: 4000-4999 MMR
⭐ Grandmaster: 5000+ MMR

Rewards per Tier:
- Exclusive card backs
- Special avatars
- Title badges
- Bonus XP multiplier
```

### UI/UX Design

```
┌───────────────────────────────────────────────┐
│  [P1: You]  HP:███████░░ 70    [P2: AI]  80  │
│  Cards: 5/10 🎴                 Cards: 7/10   │
├───────────────────────────────────────────────┤
│                                               │
│       Category: ⚔️ CHIẾN TRANH               │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │  Trận Bạch Đằng 1288 do ai chỉ huy?   │ │
│  │                                         │ │
│  │  A) Trần Hưng Đạo    B) Lê Lợi        │ │
│  │  C) Ngô Quyền        D) Lý Thường Kiệt│ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Time: ⏱️ 12s            Combo: 🔥🔥 x2      │
│                                               │
│  ┌─── Your Hand ───┐                         │
│  │ 📖 🗡️ 🛡️ ⚡ 💊 │                         │
│  └─────────────────┘                         │
├───────────────────────────────────────────────┤
│   Score: 450 | Opponent: 380 | Round: 3/5    │
└───────────────────────────────────────────────┘
```

### Game Modes

```
🎮 MODES:

1. 🤖 vs AI (Practice)
   - 3 difficulty levels
   - Earn cards & XP

2. 👥 vs Player (Ranked)
   - Competitive MMR
   - Climb the ladder

3. 🏆 Tournament
   - Weekly tournaments
   - Bracket style
   - Grand prizes

4. 🎯 Challenge Mode
   - Special rule sets
   - Limited deck
   - Boss battles (historical figures as AI)
```

### Progression & Rewards

```
🎁 Daily Rewards:
- 3 free card packs
- 1 free ranked match boost
- Quest rewards

📦 Card Packs:
- Common Pack (100 gold): 5 cards
- Rare Pack (500 gold): 5 cards, 1 guaranteed rare+
- Legendary Pack (2000 gold): 5 cards, 1 guaranteed epic+

💰 Currency:
- Gold: Earned from matches
- Gems: Premium currency (can buy with real money or earn slowly)
```

---

## 🎨 Overall Art Direction

### Visual Style
```
- **Historical Authenticity** + **Modern UI/UX**
- Vietnamese traditional colors: Vàng, Đỏ, Đen, Trắng
- Minimalist với điểm nhấn elaborate (hoa văn cung đình)
- Smooth animations, particle effects
```

### Color Palette
```
Primary: #D4AF37 (Gold)
Secondary: #00E0FF (Electric Blue)
Dark: #0B0F19 (Matte Black)
Accent: #FF4444 (Red)
Text: #F5F5DC (Ivory)
```

### Typography
```
Headings: 'Cinzel' (Serif, elegant)
Body: 'Be Vietnam Pro' (Sans-serif, readable)
Numbers/Stats: 'Roboto Mono' (Monospace)
```

---

## 🚀 Implementation Priority

### Phase 1: MVP (2-3 tháng)
1. Game 3 (Đấu Trí) - Đơn giản nhất, có thể launch nhanh
2. Core mechanics + 100 câu hỏi
3. vs AI mode only
4. Basic card system (10 cards)

### Phase 2: Expansion (3-4 tháng)
1. Game 1 (Chiến Thuật) - 1 chiến dịch (3 trận)
2. Full tutorial
3. Game 3 expansion: PvP, more cards

### Phase 3: Full Release (4-6 tháng)
1. Game 2 (Hành Trình) - 1 chapter hoàn chỉnh
2. All 3 games integrated
3. Cross-game progression
4. Social features

---

## 📊 Success Metrics

```
Engagement:
- Average session: >15 minutes
- Return rate: >60% (D7)
- Completion rate: >40% (finish 1 game)

Learning:
- Quiz improvement: 20% higher score after 10 plays
- Historical knowledge test: Pre/post assessment

Monetization (if applicable):
- Conversion rate: 2-5% to premium
- Average revenue per user: $1-3
```

---

## 🛠️ Tech Stack Recommendation

```
Frontend:
- HTML5 Canvas / WebGL for game graphics
- Phaser.js hoặc PixiJS for game engine
- React for UI components
- TailwindCSS for styling

Backend:
- Python Flask (existing)
- WebSocket for real-time PvP
- PostgreSQL for user data & rankings
- Redis for caching & matchmaking

Assets:
- Vector graphics (SVG)
- Sprite sheets for animations
- Sound effects & background music
```

---

**Tổng kết**: Ba game này tạo thành một hệ sinh thái hoàn chỉnh, mỗi game phục vụ một style chơi khác nhau nhưng đều mang giá trị giáo dục cao và gameplay hấp dẫn! 🎮🇻🇳
