# 🚀 HƯỚNG DẪN DEPLOY VIỆT SỬ KÝ - ĐẦY ĐỦ

## 📋 TỔNG QUAN

Ứng dụng **Việt Sử Ký** đã sẵn sàng để deploy! Sau khi deploy, ai cũng có thể truy cập và sử dụng miễn phí.

### Link Repository
```
https://github.com/hanglee1711/ai-time-traveler
```

### Link Demo (sau khi deploy)
```
https://your-app-name.streamlit.app
```

---

## ✅ TRẠNG THÁI DỰ ÁN

### ✅ Đã hoàn thành:
- [x] Code ứng dụng hoàn chỉnh
- [x] File `app.py` chính
- [x] File `requirements.txt` với đầy đủ dependencies
- [x] Cấu hình `.streamlit/config.toml`
- [x] File `.env.example` mẫu
- [x] README.md đầy đủ
- [x] Git init và cấu hình
- [x] Code không có lỗi syntax
- [x] Tất cả files đã commit

### ⏳ Cần làm:
1. Push code lên GitHub
2. Deploy lên Streamlit Cloud
3. Cấu hình API key
4. Test và chia sẻ link

---

## 🔧 BƯỚC 1: SỬA LỖI GITHUB CREDENTIAL (2 phút)

### Vấn đề hiện tại:
Windows đang dùng credential của `Sotatek-HangLe2` thay vì `hanglee1711`.

### Giải pháp nhanh nhất:

#### Cách A: Xóa Credential và Push lại
```bash
# 1. Mở Credential Manager
# Nhấn Windows + R → Gõ: control /name Microsoft.CredentialManager
# Tìm "git:https://github.com" và Remove

# 2. Push lại
git push origin main

# Windows sẽ hỏi đăng nhập → Chọn tài khoản hanglee1711
```

#### Cách B: Dùng Personal Access Token (Đơn giản nhất)
```bash
# 1. Tạo token tại: https://github.com/settings/tokens
# - Đăng nhập hanglee1711
# - Generate new token (classic)
# - Chọn quyền: repo
# - Copy token

# 2. Push với token
git push https://YOUR_TOKEN@github.com/hanglee1711/ai-time-traveler.git main
```

#### Cách C: Dùng GitHub Desktop (Dễ nhất cho người mới)
```
1. Download: https://desktop.github.com/
2. Đăng nhập tài khoản hanglee1711
3. File → Add Local Repository → Chọn C:\MINDX
4. Click "Push origin"
✅ Xong!
```

**→ Chi tiết xem file: `FIX_GITHUB_CREDENTIAL.md`**

---

## 🚀 BƯỚC 2: DEPLOY LÊN STREAMLIT CLOUD (5 phút)

### 2.1. Đăng nhập Streamlit Cloud

1. Truy cập: https://share.streamlit.io/
2. Click **"Sign up"** (hoặc "Sign in")
3. Chọn **"Continue with GitHub"**
4. Đăng nhập bằng tài khoản `hanglee1711`
5. Authorize Streamlit

### 2.2. Tạo App Mới

1. Click nút **"New app"** (góc trên bên phải)
2. Điền thông tin:

```
Repository: hanglee1711/ai-time-traveler
Branch: main
Main file path: app.py
App URL (optional): viet-su-ky (hoặc tên khác bạn thích)
```

### 2.3. Cấu hình Secrets (API Key)

1. Click **"Advanced settings"** (ở cuối form)
2. Tìm phần **"Secrets"**
3. Paste nội dung sau (format TOML):

```toml
# Sử dụng Gemini (MIỄN PHÍ - Khuyến nghị)
AI_PROVIDER = "gemini"
GEMINI_API_KEY = "your-gemini-api-key-here"
GEMINI_MODEL = "gemini-2.5-flash"

# Hoặc dùng OpenAI (nếu có)
# AI_PROVIDER = "openai"
# OPENAI_API_KEY = "sk-your-openai-key"
# OPENAI_MODEL = "gpt-4"
```

#### 🔑 Lấy Gemini API Key (30 giây):
1. Vào: https://aistudio.google.com/app/apikey
2. Đăng nhập bằng Gmail
3. Click **"Create API Key"**
4. Copy và paste vào phần secrets

### 2.4. Deploy!

1. Click nút **"Deploy"** (màu đỏ/xanh)
2. Đợi 2-3 phút (Streamlit đang cài packages và khởi động)
3. Theo dõi logs để xem tiến trình
4. ✅ **XONG!** App sẽ live tại:

```
https://your-app-name.streamlit.app
```

---

## 🎉 BƯỚC 3: KIỂM TRA VÀ DEMO

### 3.1. Test các tính năng chính:

1. **Chat với nhân vật lịch sử:**
   ```
   Xin chào Quang Trung
   Xin chào Hai Bà Trưng
   Xin chào Hồ Chủ Tịch
   ```

2. **Du hành thời gian:**
   ```
   Đưa tôi về năm 938
   Đưa tôi về năm 1945
   Đưa tôi về năm 1288
   ```

3. **Quiz tự động:**
   - Chat 2 lượt với bất kỳ nhân vật nào
   - Quiz sẽ tự động xuất hiện
   - Làm quiz và xem kết quả

### 3.2. Kiểm tra hiệu năng:
- ✅ App load nhanh (< 3 giây)
- ✅ AI response nhanh (< 5 giây)
- ✅ UI hiển thị đẹp, không lỗi
- ✅ Quiz hoạt động tốt

### 3.3. Chia sẻ link:
```
https://your-app-name.streamlit.app
```

Share link này với:
- Bạn bè, gia đình
- Thầy cô, lớp học
- Đăng lên mạng xã hội
- Thêm vào CV/Portfolio

---

## 🔧 SAU KHI DEPLOY

### Cập nhật code (khi cần sửa/thêm tính năng)

```bash
# 1. Sửa code
# 2. Test local
streamlit run app.py

# 3. Commit và push
git add .
git commit -m "Update: mô tả thay đổi"
git push origin main

# 4. Streamlit Cloud TỰ ĐỘNG deploy lại trong 1-2 phút!
```

### Xem logs và debug

1. Vào dashboard: https://share.streamlit.io/
2. Click vào app của bạn
3. Click **"Manage app"** > **"Logs"**
4. Xem logs để debug lỗi

### Reboot app (nếu bị lỗi)

1. Manage app > **"Reboot"**
2. App sẽ restart và load lại

### Cập nhật secrets (API key)

1. Manage app > **"Settings"** > **"Secrets"**
2. Sửa và Save
3. Reboot app

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Module not found"

**Nguyên nhân:** Thiếu package trong `requirements.txt`

**Giải pháp:**
1. Kiểm tra `requirements.txt` có đầy đủ:
   ```txt
   streamlit>=1.31.0
   openai>=1.12.0
   google-generativeai>=0.8.0
   python-dotenv>=1.0.0
   requests>=2.31.0
   pyyaml>=6.0.1
   ```
2. Push lại nếu sửa

### Lỗi: "API key invalid"

**Giải pháp:**
1. Vào Settings > Secrets
2. Kiểm tra format TOML đúng
3. Đảm bảo không có dấu ngoặc kép thừa
4. API key phải valid (test tại https://aistudio.google.com/)
5. Save và Reboot

### Lỗi: App không start

**Giải pháp:**
1. Check logs: Manage app > Logs
2. Xem lỗi cụ thể
3. Google error message để tìm giải pháp
4. Hoặc hỏi ChatGPT/Claude với logs

### App chạy chậm

**Giải pháp:**
1. Dùng Gemini thay vì GPT-4 (nhanh hơn, miễn phí)
2. Optimize cache với `@st.cache_data`
3. Giảm số request không cần thiết

---

## 💰 CHI PHÍ

| Dịch vụ | Chi phí |
|---------|---------|
| **Streamlit Cloud** | ✅ **MIỄN PHÍ** (unlimited public apps) |
| **Gemini API** | ✅ **MIỄN PHÍ** (60 requests/phút) |
| **GitHub** | ✅ **MIỄN PHÍ** (public repos) |
| **Domain** | ✅ Miễn phí subdomain `.streamlit.app` |
| **TỔNG** | ✅ **$0 - HOÀN TOÀN MIỄN PHÍ!** |

---

## 📊 THÔNG TIN DỰ ÁN

### Công nghệ sử dụng:
- **Frontend:** Streamlit
- **AI:** Google Gemini / OpenAI GPT-4
- **Backend:** Python 3.8+
- **Hosting:** Streamlit Cloud
- **Version Control:** Git + GitHub

### Tính năng chính:
1. **Roleplay Chat:** Trò chuyện với 15+ nhân vật lịch sử
2. **Time Travel:** Du hành đến 20+ mốc thời gian
3. **Auto Quiz:** Tự động tạo quiz sau 2 lượt chat
4. **Beautiful UI:** Gradient, animation, emoji
5. **Multi-AI:** Hỗ trợ Gemini, OpenAI, Llama

### File structure:
```
MINDX/
├── app.py                    # Main Streamlit app
├── requirements.txt          # Dependencies
├── .streamlit/
│   └── config.toml          # Streamlit config
├── src/
│   ├── ai_handler.py        # AI integration
│   ├── prompts.py           # Prompt templates
│   ├── quiz_handler.py      # Quiz logic
│   ├── input_detector.py    # Input detection
│   └── avatar_generator.py  # Avatar handling
├── README.md                # Documentation
├── .env.example             # Environment template
└── .gitignore               # Git ignore rules
```

---

## 🎯 CHECKLIST CUỐI CÙNG

### Trước khi deploy:
- [x] Code hoàn chỉnh, không lỗi syntax
- [x] `requirements.txt` đầy đủ
- [x] `.streamlit/config.toml` đã cấu hình
- [x] `.env.example` có mẫu
- [x] README.md đầy đủ
- [x] `.gitignore` đúng (không commit .env, *.db)
- [x] Đã commit tất cả files

### Sau khi deploy:
- [ ] App chạy không lỗi
- [ ] Test chat với nhân vật
- [ ] Test du hành thời gian
- [ ] Test quiz generation
- [ ] UI hiển thị đẹp
- [ ] AI response nhanh
- [ ] Share link với mọi người

---

## 📞 HỖ TRỢ

### Nếu gặp vấn đề:

1. **Check logs trên Streamlit Cloud**
   - Dashboard > App > Logs

2. **Xem tài liệu:**
   - `DEPLOY_STREAMLIT_NHANH.md`
   - `FIX_GITHUB_CREDENTIAL.md`
   - `README.md`

3. **Google error message**
   - Copy error từ logs
   - Google để tìm giải pháp

4. **Hỏi AI:**
   - ChatGPT / Claude
   - Paste logs và hỏi cách fix

5. **Streamlit Community:**
   - https://discuss.streamlit.io/

---

## 🎓 TÀI LIỆU THAM KHẢO

### Docs chính thức:
- Streamlit: https://docs.streamlit.io/
- Gemini API: https://ai.google.dev/docs
- GitHub: https://docs.github.com/

### Tutorials:
- Deploy Streamlit: https://docs.streamlit.io/streamlit-community-cloud/get-started
- GitHub basics: https://guides.github.com/

---

## 🚀 NÂNG CAP SAU NÀY (Optional)

### Custom domain:
- Mua domain (VD: vietsuki.com)
- Cấu hình CNAME trên Streamlit Cloud

### Analytics:
- Google Analytics
- Streamlit Analytics

### Premium features:
- Private app
- More resources
- Custom branding

Upgrade plan: https://streamlit.io/cloud

---

## 🎉 KẾT LUẬN

Dự án **Việt Sử Ký** của bạn đã sẵn sàng để deploy!

### Các bước tiếp theo:
1. ✅ Sửa GitHub credential (2 phút)
2. ✅ Push code lên GitHub
3. ✅ Deploy lên Streamlit Cloud (5 phút)
4. ✅ Test và chia sẻ link

**Tổng thời gian:** ~10 phút

**Chi phí:** $0 - Hoàn toàn miễn phí!

---

🎊 **Chúc bạn deploy thành công!** 🎊

📧 Mọi thắc mắc, xem lại file này hoặc các file hướng dẫn khác.
