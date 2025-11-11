# 🚀 DEPLOY NGAY - HƯỚNG DẪN SIÊU NHANH

## ⚡ 3 BƯỚC - 10 PHÚT

### ✅ BƯỚC 1: PUSH LÊN GITHUB (3 phút)

#### Cách dễ nhất: Dùng GitHub Desktop
1. Download: https://desktop.github.com/
2. Đăng nhập tài khoản `hanglee1711`
3. File → Add Local Repository → Chọn `C:\MINDX`
4. Click **"Push origin"**
5. ✅ Xong!

#### Hoặc dùng Token:
```bash
# 1. Tạo token: https://github.com/settings/tokens
#    - Chọn quyền "repo"
#    - Copy token

# 2. Push với token (thay YOUR_TOKEN)
git push https://YOUR_TOKEN@github.com/hanglee1711/ai-time-traveler.git main
```

---

### ✅ BƯỚC 2: DEPLOY LÊN STREAMLIT (5 phút)

#### 2.1. Vào Streamlit Cloud
```
https://share.streamlit.io/
```
- Đăng nhập bằng GitHub (`hanglee1711`)

#### 2.2. Tạo App
Click **"New app"** và điền:
```
Repository: hanglee1711/ai-time-traveler
Branch: main
Main file: app.py
App URL: viet-su-ky (hoặc tên khác)
```

#### 2.3. Thêm API Key
Click **"Advanced settings"** → **"Secrets"** → Paste:

```toml
AI_PROVIDER = "gemini"
GEMINI_API_KEY = "your-api-key-here"
GEMINI_MODEL = "gemini-2.5-flash"
```

**Lấy Gemini API Key:**
- Vào: https://aistudio.google.com/app/apikey
- Click "Create API Key" → Copy

#### 2.4. Deploy
- Click **"Deploy"**
- Đợi 2-3 phút
- ✅ Xong!

---

### ✅ BƯỚC 3: TEST VÀ CHIA SẺ (2 phút)

App của bạn live tại:
```
https://your-app-name.streamlit.app
```

**Test:**
- "Xin chào Quang Trung"
- "Đưa tôi về năm 1945"
- Chat 2 lượt để thấy quiz

**Chia sẻ link** với mọi người!

---

## 📂 TÀI LIỆU CHI TIẾT

- `DEPLOY_INSTRUCTIONS.md` - Hướng dẫn đầy đủ
- `FIX_GITHUB_CREDENTIAL.md` - Sửa lỗi credential
- `DEPLOY_STREAMLIT_NHANH.md` - Chi tiết Streamlit

---

## 🆘 GẶP VẤN ĐỀ?

### Lỗi push GitHub?
→ Xem: `FIX_GITHUB_CREDENTIAL.md`

### Lỗi deploy Streamlit?
→ Check logs: Dashboard > App > Logs

### App không chạy?
→ Kiểm tra API key trong Secrets

---

## 💡 LƯU Ý

- ✅ Miễn phí 100%
- ✅ Không cần credit card
- ✅ Ai cũng có thể truy cập
- ✅ Tự động update khi push code mới

---

🎉 **Bắt đầu ngay!** 🎉
