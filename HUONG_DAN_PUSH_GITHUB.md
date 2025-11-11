# 🚀 Hướng Dẫn Push Code Lên GitHub

## ❗ Vấn Đề Hiện Tại

Bạn đang gặp lỗi permission khi push code:
```
remote: Permission to hanglee1711/ai-time-traveler.git denied to Sotatek-HangLe2.
```

Điều này xảy ra vì:
- Git đang dùng tài khoản `Sotatek-HangLe2`
- Nhưng repository thuộc về `hanglee1711`

## ✅ GIẢI PHÁP

### Cách 1: Dùng Personal Access Token (Khuyến nghị - Nhanh nhất)

#### Bước 1: Tạo Personal Access Token

1. Đăng nhập GitHub tài khoản `hanglee1711`
2. Vào: https://github.com/settings/tokens
3. Click **"Generate new token"** → **"Generate new token (classic)"**
4. Đặt tên: `MINDX-Deploy`
5. Chọn quyền:
   - ✅ `repo` (tất cả các quyền về repo)
6. Click **"Generate token"**
7. **Copy token ngay** (chỉ hiện 1 lần!)

#### Bước 2: Push với Token

Mở Terminal trong folder MINDX và chạy:

```bash
# Thay YOUR_TOKEN bằng token vừa copy
git push https://YOUR_TOKEN@github.com/hanglee1711/ai-time-traveler.git main
```

Hoặc cập nhật remote:
```bash
# Thay YOUR_TOKEN bằng token vừa copy
git remote set-url origin https://YOUR_TOKEN@github.com/hanglee1711/ai-time-traveler.git

# Sau đó push bình thường
git push origin main
```

---

### Cách 2: Dùng GitHub Desktop (Dễ nhất cho người mới)

1. Download GitHub Desktop: https://desktop.github.com/
2. Đăng nhập tài khoản `hanglee1711`
3. File → Add Local Repository → Chọn folder MINDX
4. Click **"Publish repository"** hoặc **"Push origin"**

---

### Cách 3: Dùng SSH Key (Bảo mật nhất - Dài hơn)

#### Bước 1: Tạo SSH Key

```bash
# Tạo SSH key mới
ssh-keygen -t ed25519 -C "your_email@example.com"

# Nhấn Enter 3 lần (để mặc định)
```

#### Bước 2: Copy SSH Key

```bash
# Copy SSH key vào clipboard (Windows)
cat ~/.ssh/id_ed25519.pub | clip

# Hoặc xem để copy thủ công
cat ~/.ssh/id_ed25519.pub
```

#### Bước 3: Thêm SSH Key vào GitHub

1. Đăng nhập GitHub tài khoản `hanglee1711`
2. Vào: https://github.com/settings/keys
3. Click **"New SSH key"**
4. Title: `MINDX-Laptop`
5. Paste key vào ô "Key"
6. Click **"Add SSH key"**

#### Bước 4: Đổi Remote sang SSH

```bash
# Đổi remote URL sang SSH
git remote set-url origin git@github.com:hanglee1711/ai-time-traveler.git

# Push
git push origin main
```

---

## 🔍 Kiểm Tra Tài Khoản GitHub Đang Dùng

### Kiểm tra Git config
```bash
git config user.name
git config user.email
```

### Đổi tài khoản nếu cần
```bash
git config user.name "hanglee1711"
git config user.email "your_email@example.com"
```

---

## 🎯 SAU KHI PUSH THÀNH CÔNG

Kiểm tra code đã lên GitHub:
```
https://github.com/hanglee1711/ai-time-traveler
```

Bạn sẽ thấy:
- ✅ Tất cả files đã được push
- ✅ Commit mới nhất hiển thị
- ✅ Sẵn sàng để deploy lên Streamlit Cloud!

---

## 🚀 BƯỚC TIẾP THEO: DEPLOY LÊN STREAMLIT CLOUD

Xem file: `DEPLOY_STREAMLIT_NHANH.md`

Hoặc làm theo hướng dẫn sau đây:

### 1. Truy cập Streamlit Cloud
1. Vào: https://share.streamlit.io/
2. Đăng nhập bằng GitHub (tài khoản `hanglee1711`)

### 2. Tạo App Mới
1. Click **"New app"**
2. Điền:
   - Repository: `hanglee1711/ai-time-traveler`
   - Branch: `main`
   - Main file: `app.py`
   - App URL: Tên bạn muốn (VD: `viet-su-ky`)

### 3. Thêm API Key (Secrets)
Click **"Advanced settings"** → **"Secrets"** và paste:

```toml
# Dùng Gemini (MIỄN PHÍ)
AI_PROVIDER = "gemini"
GEMINI_API_KEY = "your-gemini-api-key-here"
GEMINI_MODEL = "gemini-2.5-flash"
```

**Lấy Gemini API Key:**
- Vào: https://aistudio.google.com/app/apikey
- Click "Create API Key"
- Copy và dán vào

### 4. Deploy!
1. Click **"Deploy"**
2. Đợi 2-3 phút
3. ✅ Xong! App live tại: `https://your-app-name.streamlit.app`

---

## 💡 LƯU Ý QUAN TRỌNG

### Bảo mật Token/Key
- ⚠️ KHÔNG commit token vào code
- ⚠️ KHÔNG share token công khai
- ✅ Chỉ dùng token trong command line hoặc GitHub Desktop

### Nếu vẫn lỗi Permission
1. Đảm bảo đăng nhập đúng tài khoản `hanglee1711`
2. Kiểm tra repository có tồn tại: https://github.com/hanglee1711/ai-time-traveler
3. Nếu không tồn tại, tạo repo mới trên GitHub
4. Xóa remote cũ và thêm remote mới:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/hanglee1711/ai-time-traveler.git
   ```

---

## 📞 CẦN HỖ TRỢ?

Nếu vẫn gặp vấn đề:
1. Check GitHub account: https://github.com/hanglee1711
2. Thử lại với GitHub Desktop (dễ nhất)
3. Hoặc tạo repo mới trên tài khoản đang dùng (Sotatek-HangLe2)

---

🎉 **Chúc bạn thành công!** 🎉
