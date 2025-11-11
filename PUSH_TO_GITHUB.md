# 🚀 HƯỚNG DẪN PUSH LÊN GITHUB

## Trạng thái hiện tại
- ✅ Code đã commit xong (83 files)
- ✅ Git repo đã có: https://github.com/hanglee1711/ai-time-traveler.git
- ⏳ Cần push lên GitHub

---

## CÁCH 1: Dùng GitHub Desktop (ĐƠN GIẢN NHẤT)

1. **Download GitHub Desktop:** https://desktop.github.com
2. Mở GitHub Desktop → Login
3. File → Add Local Repository → Chọn folder `C:\MINDX`
4. Click "Push origin" ở thanh trên
5. ✅ XONG!

---

## CÁCH 2: Dùng Personal Access Token

### Bước 1: Tạo Token
1. Mở: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Note: `Viet Su Ky Deploy`
4. Chọn scope: ✅ **repo** (full control of private repositories)
5. Click "Generate token"
6. **COPY TOKEN** (chỉ hiện 1 lần!) - Ví dụ: `ghp_xxxxxxxxxxxxxxxxxxxx`

### Bước 2: Push với Token
Mở Git Bash hoặc Command Prompt tại folder `C:\MINDX` và chạy:

```bash
# Replace YOUR_TOKEN với token vừa copy
git push https://YOUR_TOKEN@github.com/hanglee1711/ai-time-traveler.git main
```

**Ví dụ:**
```bash
git push https://ghp_abc123xyz789@github.com/hanglee1711/ai-time-traveler.git main
```

### Bước 3: Save Token (để không phải nhập lại)
```bash
# Save credentials
git config credential.helper store
git push
```

---

## CÁCH 3: Dùng SSH Key

### Nếu chưa có SSH Key:

**1. Tạo SSH Key:**
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Nhấn Enter 3 lần (để mặc định)
```

**2. Copy public key:**
```bash
cat ~/.ssh/id_ed25519.pub
# Copy toàn bộ nội dung (bắt đầu với ssh-ed25519)
```

**3. Add key vào GitHub:**
- Mở: https://github.com/settings/keys
- Click "New SSH key"
- Title: "My Computer"
- Paste key vào
- Click "Add SSH key"

**4. Change remote và push:**
```bash
cd C:\MINDX
git remote set-url origin git@github.com:hanglee1711/ai-time-traveler.git
git push origin main
```

---

## CÁCH 4: Push từ VS Code

1. Mở folder `C:\MINDX` trong VS Code
2. Click icon Source Control (Ctrl+Shift+G)
3. Click "..." → Push
4. Nhập GitHub username và password (hoặc token)
5. ✅ XONG!

---

## SAU KHI PUSH XONG

Kiểm tra GitHub:
- Mở: https://github.com/hanglee1711/ai-time-traveler
- Refresh page
- Bạn sẽ thấy 83 files mới được update!

Sau đó tiếp tục deploy lên Render.com 🚀

---

## NẾU GẶP LỖI

### Error: "Permission denied"
→ Dùng Personal Access Token (CÁCH 2)

### Error: "Authentication failed"
→ Token hết hạn, tạo token mới

### Error: "Repository not found"
→ Kiểm tra URL repo có đúng không

---

**Khuyến nghị:** Dùng **GitHub Desktop** (CÁCH 1) nếu chưa quen dùng Git command line!
