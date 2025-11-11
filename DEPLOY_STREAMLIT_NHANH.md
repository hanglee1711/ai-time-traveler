# 🚀 DEPLOY STREAMLIT CLOUD - SIÊU NHANH (10 PHÚT)

## ✅ Link demo sẽ có dạng:
```
https://ten-app-cua-ban.streamlit.app
```

---

## 📋 CHUẨN BỊ

- ✅ Tài khoản GitHub (miễn phí)
- ✅ API Key: Gemini hoặc OpenAI
- ✅ 10 phút

---

## 🎯 BƯỚC 1: PUSH CODE LÊN GITHUB (3 phút)

### 1.1. Tạo GitHub Repository mới

1. Vào https://github.com/new
2. Repository name: `viet-ky-su`
3. Chọn **Public**
4. Click **Create repository**

### 1.2. Push code từ máy

Mở Terminal trong folder MINDX và chạy:

```bash
# Khởi tạo Git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Việt Sử Ký - Ready for demo"

# Connect với GitHub (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/viet-ky-su.git
git branch -M main

# Push lên GitHub
git push -u origin main
```

✅ **Xong bước 1!** Code đã lên GitHub.

---

## 🎯 BƯỚC 2: DEPLOY TRÊN STREAMLIT CLOUD (5 phút)

### 2.1. Truy cập Streamlit Cloud

1. Vào: https://share.streamlit.io/
2. Click **Sign up** (hoặc **Sign in** nếu đã có tài khoản)
3. Chọn **Continue with GitHub**
4. Authorize Streamlit

### 2.2. Tạo App mới

1. Click nút **"New app"** (góc trên bên phải)
2. Điền thông tin:
   - **Repository**: Chọn `YOUR_USERNAME/viet-ky-su`
   - **Branch**: `main`
   - **Main file path**: `app.py`
   - **App URL**: Chọn tên bạn muốn (VD: `viet-ky-su`)

### 2.3. Thêm API Key (Secrets)

1. Click **Advanced settings** (ở dưới form)
2. Tìm phần **Secrets**
3. Paste nội dung sau (format TOML):

```toml
# Nếu dùng Gemini (MIỄN PHÍ, KHUYẾN NGHỊ)
AI_PROVIDER = "gemini"
GEMINI_API_KEY = "dán-api-key-gemini-của-bạn-vào-đây"
GEMINI_MODEL = "gemini-2.5-flash"

# Hoặc nếu dùng OpenAI
# AI_PROVIDER = "openai"
# OPENAI_API_KEY = "sk-your-openai-key-here"
# OPENAI_MODEL = "gpt-4"
```

**🔑 Lấy Gemini API Key:**
- Vào: https://aistudio.google.com/app/apikey
- Đăng nhập Gmail
- Click **Create API Key**
- Copy và dán vào phần secrets ở trên

4. Click **Save**

### 2.4. Deploy!

1. Click nút **Deploy** (màu đỏ)
2. Đợi 2-3 phút (Streamlit sẽ cài packages và khởi động app)
3. ✅ **XONG!** App sẽ live tại:

```
https://ten-app-cua-ban.streamlit.app
```

---

## 🎉 ĐÃ XONG - DEMO ONLINE!

Link demo của bạn:
```
https://YOUR-APP-NAME.streamlit.app
```

**Share link này cho ai cũng được!**

---

## 🔧 SAU KHI DEPLOY

### Cập nhật code

Mỗi khi sửa code:

```bash
git add .
git commit -m "Update: mô tả thay đổi"
git push
```

Streamlit Cloud sẽ **TỰ ĐỘNG** deploy lại trong 1-2 phút!

### Xem logs

1. Vào dashboard: https://share.streamlit.io/
2. Click vào app của bạn
3. Click **Manage app** > **Logs**

### Reboot app

Nếu app bị lỗi:
1. Manage app > **Reboot**

---

## 🐛 TROUBLESHOOTING

### App không start

**Kiểm tra logs:**
1. Dashboard > App > Logs
2. Xem lỗi gì
3. Thường là:
   - API key sai → Fix secrets
   - Package lỗi → Check requirements.txt

### "Module not found"

Kiểm tra `requirements.txt` có đủ packages:
```txt
streamlit>=1.31.0
openai>=1.12.0
google-generativeai>=0.8.0
python-dotenv>=1.0.0
requests>=2.31.0
pyyaml>=6.0.1
```

### API key không work

1. Vào Settings > Secrets
2. Kiểm tra format TOML
3. Đảm bảo không có dấu ngoặc kép thừa
4. Click Save
5. Reboot app

---

## 💰 CHI PHÍ

- **Streamlit Cloud:** ✅ MIỄN PHÍ (unlimited public apps)
- **Gemini API:** ✅ MIỄN PHÍ (trong giới hạn hợp lý)
- **Tổng:** ✅ **$0 / HOÀN TOÀN MIỄN PHÍ**

---

## 🎊 DEMO TIPS

### Sau khi có link demo:

1. **Bookmark link** để dễ truy cập
2. **Share link** với bạn bè, thầy cô
3. Test thử các tính năng:
   - "Xin chào Quang Trung"
   - "Đưa tôi đến năm 1945"
   - Tạo Quiz sau 2 lượt chat

---

## 📞 CẦN HỖ TRỢ?

### Nếu gặp vấn đề:

1. Check logs trên Streamlit Cloud
2. Xem file này lại
3. Google error message
4. Hỏi ChatGPT/Claude với logs

---

🎉 **Chúc bạn deploy thành công!** 🎉
