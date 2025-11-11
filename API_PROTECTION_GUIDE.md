# 🛡️ API Protection Guide - Hướng dẫn bảo vệ API

## Vấn đề

Khi deploy chatbot công khai, API key Gemini của bạn có thể bị hết quota nhanh chóng do:
- Quá nhiều người dùng cùng lúc
- Spam requests
- Gemini free tier có giới hạn: ~60 requests/minute

## Giải pháp đã implement

Hệ thống bảo vệ API với **4 lớp**:

### 1. ⏱️ Rate Limiting (Giới hạn tốc độ)
- **10 requests/phút** mỗi IP
- **50 requests/giờ** mỗi IP
- Tự động chặn khi vượt quá

```
User spam → Backend chặn → Trả về thông báo thân thiện
```

### 2. 💾 Response Caching (Lưu cache)
- Cache câu hỏi phổ biến
- Không gọi API nếu đã có câu trả lời
- Cache tồn tại 1 giờ
- Giới hạn 1000 responses

**Ví dụ:**
```
User 1: "Xin chào Lý Công Uẩn" → Gọi API → Cache
User 2: "xin chào lý công uẩn" → Trả cache → Không tốn API call
User 3: "Xin chào Lý Công Uẩn" → Trả cache → Không tốn API call
```

**Tiết kiệm:**
- Câu hỏi phổ biến: ~70-80% requests
- Giảm chi phí API đáng kể

### 3. 🔄 API Key Rotation (Xoay vòng keys)
- Hỗ trợ nhiều API keys
- Tự động xoay vòng khi gọi
- Nếu key 1 hết quota → Dùng key 2

**Cấu hình (.env):**
```bash
# Main key
GEMINI_API_KEY=your_first_key

# Backup keys (optional)
GEMINI_API_KEY_2=your_second_key
GEMINI_API_KEY_3=your_third_key
# ... up to GEMINI_API_KEY_9
```

### 4. 📊 Usage Monitoring (Theo dõi sử dụng)
- Theo dõi tổng requests
- Cache hit rate
- Active users
- API key usage

## Cách sử dụng

### Bước 1: Tạo thêm API keys (nếu cần)

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập với tài khoản Google khác
3. Tạo API key mới
4. Copy key

**Lưu ý:** Mỗi tài khoản Google = 1 API key riêng với quota riêng

### Bước 2: Thêm vào .env

```bash
# File: .env
AI_PROVIDER=gemini

# Main key (current)
GEMINI_API_KEY=AIzaSyDOAOsnsbSaRVJN09ceQ9YteTHvH4P_pPE
GEMINI_MODEL=gemini-2.5-flash

# Backup keys (NEW)
GEMINI_API_KEY_2=AIzaSy... (from account 2)
GEMINI_API_KEY_3=AIzaSy... (from account 3)
```

### Bước 3: Restart backend

```bash
# Stop server (Ctrl+C)
# Start again
cd backend
python app.py
```

Backend sẽ tự động load tất cả keys và xoay vòng!

## Xem thống kê

Truy cập: http://localhost:5000/api/stats

**Response:**
```json
{
  "total_requests": 150,
  "cache_hits": 95,
  "cache_misses": 55,
  "cache_hit_rate": "63.3%",
  "cache_size": 42,
  "active_ips": 8,
  "api_keys_count": 3,
  "key_usage": {
    "0": 25,
    "1": 18,
    "2": 12
  }
}
```

**Giải thích:**
- `cache_hit_rate: 63.3%` → 63% requests không tốn API call!
- `api_keys_count: 3` → Đang dùng 3 keys
- `key_usage` → Số lần mỗi key được dùng

## Capacity Estimation (Ước tính khả năng)

### Với 1 API key:
- Gemini free tier: ~60 requests/minute
- **Có cache (70% hit rate):** ~200 requests/minute thực tế
- **Có rate limiting:** Max 10 req/min per user = Phục vụ ~20 users cùng lúc

### Với 3 API keys:
- 3 × 60 = 180 requests/minute
- **Có cache:** ~600 requests/minute thực tế
- **Phục vụ:** ~60 users cùng lúc

### Với 5 API keys:
- 5 × 60 = 300 requests/minute
- **Có cache:** ~1000 requests/minute
- **Phục vụ:** ~100 users cùng lúc

## Khi nào cần thêm keys?

**Dấu hiệu:**
1. Users hay gặp lỗi "hệ thống quá tải"
2. Cache hit rate < 50%
3. Có >50 users online cùng lúc

**Giải pháp:**
- Thêm 2-3 backup keys
- Tăng rate limit (nếu có nhiều keys)
- Deploy lên server mạnh hơn

## Tips tối ưu

### 1. Encourage common questions
Gợi ý users hỏi những câu phổ biến (sẽ được cache):
- "Xin chào [nhân vật]"
- "Kể về chiến công"
- "Bạn sinh năm nào?"

### 2. Monitor stats regularly
Check `/api/stats` mỗi ngày để:
- Thấy cache hit rate
- Phát hiện abuse (1 IP gửi quá nhiều)
- Cân bằng key usage

### 3. Adjust rate limits
Trong `backend/api_protection.py`:
```python
self.max_requests_per_minute = 10  # Tăng lên 15-20 nếu có nhiều keys
self.max_requests_per_hour = 50    # Tăng lên 100 nếu cần
```

### 4. Scale vertically
- Nếu có >100 users: Cần server riêng
- Nếu có >500 users: Cần paid Gemini API
- Nếu có >1000 users: Cần load balancer + multiple servers

## Troubleshooting

### "Bạn đã gửi quá nhiều tin nhắn"
✅ Bình thường - Rate limiting đang hoạt động
❌ Nếu quá khắt khe → Tăng `max_requests_per_minute`

### "Hệ thống đang quá tải"
- Check `/api/stats` → Xem cache hit rate
- Nếu < 50% → Có vấn đề với cache
- Nếu key_usage không đều → Có key bị lỗi

### Backend startup error
```
ValueError: No API keys found!
```
→ Kiểm tra file `.env` có `GEMINI_API_KEY`

## Summary

✅ **Đã implement:**
- Rate limiting per IP
- Response caching (1 hour TTL)
- Multiple API keys rotation
- Usage statistics endpoint

✅ **Khả năng hiện tại (1 key):**
- ~20 users cùng lúc
- ~200 requests/minute (với cache)

✅ **Để scale lên:**
1. Thêm 2-4 backup API keys → 60-100 users
2. Tăng rate limits
3. Monitor `/api/stats`

🎯 **Kết quả:** Chatbot ổn định, không lo hết quota!
