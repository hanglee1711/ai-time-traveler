# 🔧 Sửa Lỗi GitHub Credential trên Windows

## ❗ Vấn Đề

Windows đang lưu credential của tài khoản `Sotatek-HangLe2` thay vì `hanglee1711`.

## ✅ GIẢI PHÁP NHANH (2 phút)

### Bước 1: Xóa Credential Cũ

1. Nhấn **Windows + R**
2. Gõ: `control /name Microsoft.CredentialManager`
3. Nhấn Enter
4. Click **"Windows Credentials"**
5. Tìm mục `git:https://github.com`
6. Click → **Remove**

### Bước 2: Push Lại

Trong Terminal, chạy:

```bash
# Windows sẽ hỏi đăng nhập lại
git push origin main
```

Một cửa sổ sẽ bật lên:
- Chọn **"Browser"** hoặc **"Token"**
- Đăng nhập bằng tài khoản `hanglee1711`
- ✅ Xong!

---

## 🚀 GIẢI PHÁP KHÁC (Nếu trên không work)

### Cách A: Dùng Personal Access Token (Nhanh nhất)

#### 1. Tạo Token
- Vào: https://github.com/settings/tokens
- Đăng nhập `hanglee1711`
- Click "Generate new token (classic)"
- Chọn quyền `repo`
- Copy token

#### 2. Push với Token
```bash
# Thay YOUR_TOKEN bằng token vừa copy
git push https://YOUR_TOKEN@github.com/hanglee1711/ai-time-traveler.git main
```

**Hoặc** cập nhật remote vĩnh viễn:
```bash
# Set remote với token
git remote set-url origin https://YOUR_TOKEN@github.com/hanglee1711/ai-time-traveler.git

# Push bình thường
git push origin main
```

### Cách B: Dùng GitHub CLI (Hiện đại nhất)

#### 1. Cài GitHub CLI
Download: https://cli.github.com/

#### 2. Đăng nhập
```bash
gh auth login
```

Chọn:
- GitHub.com
- HTTPS
- Login with a web browser
- Đăng nhập bằng `hanglee1711`

#### 3. Push
```bash
git push origin main
```

### Cách C: GitHub Desktop (Dễ nhất)

1. Download: https://desktop.github.com/
2. Đăng nhập `hanglee1711`
3. File → Add Local Repository → Chọn `C:\MINDX`
4. Click "Push origin"

---

## 🔍 Debug: Kiểm Tra Tài Khoản

### Check Git credential helper
```bash
git config --global credential.helper
```

### Xem credential đang lưu
```bash
git credential-manager-core get
```

### Reset credential helper
```bash
git config --global --unset credential.helper
git config --global credential.helper manager-core
```

---

## 🎯 SAU KHI PUSH THÀNH CÔNG

### Kiểm tra trên GitHub:
```
https://github.com/hanglee1711/ai-time-traveler
```

### Xem commits:
```bash
git log --oneline -5
```

### Kiểm tra remote:
```bash
git remote -v
```

---

## 🚀 TIẾP TỤC: DEPLOY LÊN STREAMLIT CLOUD

Sau khi push thành công:

1. Vào: https://share.streamlit.io/
2. Đăng nhập GitHub (`hanglee1711`)
3. Click "New app"
4. Chọn repository: `ai-time-traveler`
5. Main file: `app.py`
6. Thêm secrets (API key)
7. Deploy!

Chi tiết xem file: `DEPLOY_STREAMLIT_NHANH.md`

---

## ⚡ TÓM TẮT LỆNH

```bash
# Xóa credential (nếu muốn làm bằng command)
cmdkey /list | findstr github.com
cmdkey /delete:LegacyGeneric:target=git:https://github.com

# Hoặc dùng Token ngay
git push https://YOUR_TOKEN@github.com/hanglee1711/ai-time-traveler.git main
```

---

🎉 **Chúc bạn thành công!** 🎉
