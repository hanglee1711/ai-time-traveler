# Gemini API Integration Analysis

## Executive Summary

The codebase uses Google Gemini API as the primary AI provider for the "Việt Sử Ký" (Vietnamese History Time Machine) application. The integration is implemented across multiple layers: backend Flask API, Python AI handler, and frontend JavaScript calls.

---

## 1. File Locations Where Gemini is Used

### Core Integration Files:
- **C:\MINDX\src\ai_handler.py** - Main AI handler with Gemini initialization and response generation
- **C:\MINDX\backend\app.py** - Flask API server that calls the AI handler
- **C:\MINDX\app.py** - Streamlit application with Gemini integration
- **C:\MINDX\frontend\js\main.js** - Frontend API calls (always uses Gemini)
- **C:\MINDX\frontend\js\chatbot.js** - Chatbot UI with hardcoded Gemini provider

### Configuration Files:
- **C:\MINDX\.env** - Live environment variables with Gemini API keys
- **C:\MINDX\.env.example** - Example configuration template
- **C:\MINDX\config\config.yaml** - App configuration with AI settings

---

## 2. How Gemini API is Being Called

### Method: NON-STREAMING (Synchronous)

The implementation uses synchronous, non-streaming API calls.

Key code from src/ai_handler.py (Lines 141-171):

```python
def _generate_gemini(self, system_prompt, user_message, temperature, max_tokens) -> str:
    """Generate response using Google Gemini - ULTRA SIMPLIFIED"""
    try:
        full_prompt = f"""{system_prompt}

{user_message}"""
        
        # SIMPLE API call - no complex config
        response = self.client.generate_content(full_prompt)
        
        # Get text from response - simple and direct
        return response.text
    except Exception as e:
        # Error handling with fallback messages
        if "blocked" in error_msg or "safety" in error_msg:
            return "Xin lỗi, câu hỏi này có vấn đề với hệ thống..."
```

### Characteristics:
- **API Method**: `generate_content()` - Non-streaming
- **Response Extraction**: Direct `.text` property
- **Prompt Format**: System + user combined into single text
- **Safety Settings**: Uses Gemini defaults (not customized)

---

## 3. Configuration & Environment Variables

### .env Configuration:

```
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSyDOAOsnsbSaRVJN09ceQ9YteTHvH4P_pPE
GEMINI_MODEL=gemini-2.5-flash
GEMINI_API_KEY_2=AIzaSyCfdUSA-WkeCkXYnx0WPf052-HIVSpgXAA
GEMINI_API_KEY_3=AIzaSyAzaIlaEqb4aAV5VUnGIhKvhGX3G6SxC_A
```

### Client Initialization (src/ai_handler.py, Lines 69-82):

```python
def _init_gemini(self):
    import google.generativeai as genai
    api_key = get_env("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    self.model_name = get_env("GEMINI_MODEL", "gemini-2.5-flash")
    self.client = genai.GenerativeModel(model_name=self.model_name)
```

### Key Config Values (config.yaml):

```yaml
ai_settings:
  temperature: 0.8
  max_tokens: 1000
  top_p: 0.9
```

---

## 4. Streaming vs Non-Streaming

### Status: NON-STREAMING ONLY

All API calls use standard `generate_content()` method:
- Returns complete response in single call
- Blocks until response fully generated
- No streaming parameter configured

Example from backend/app.py (Lines 341-346):

```python
response_text = ai_handler.generate_response(
    system_prompt=system_prompt,
    user_message=user_message,
    temperature=0.9,   # Higher temp = faster generation
    max_tokens=200     # Optimized: 200 tokens ≈ 2-4 sentences
)
```

---

## 5. Timeout Settings & Performance Configuration

### Temperature Settings:
- **Default (config.yaml)**: 0.8
- **Roleplay responses**: 0.9 (faster)
- **Quiz generation**: 0.7 (more accurate)
- **Range**: 0.0 - 1.0 (user configurable in Streamlit)

### Token Limits (Critical for speed):
- **Roleplay/Chat**: max_tokens=200 (~2-4 sentences, fastest)
- **Quiz generation**: max_tokens=2500 (structured JSON output)
- **General responses**: max_tokens=1000 (medium complexity)

### Rate Limiting:
```python
# From backend/app.py
protection.check_rate_limit(client_ip)  # Per-IP rate limiting
protection.cache_response()              # Caches identical requests
```

### Implicit Timeouts:
- 5 seconds for HTTP requests (from test_api.py)
- No explicit timeout in GenerativeModel initialization
- Default Gemini API timeout: ~30 seconds

### No Explicit Configuration For:
- Streaming (always False)
- Safety settings (uses defaults)
- Retry policy
- Advanced sampling parameters

---

## 6. API Call Flow

### Complete Request Cycle:

1. **Frontend** sends POST to /api/chat with message and figure
2. **Flask endpoint** (backend/app.py) receives request
3. **API Protection layer** checks rate limit and cache
4. **AIHandler.generate_response()** is called
5. **Gemini API** receives generate_content() call
6. **Response.text** is extracted
7. **Cache layer** stores response for future identical queries
8. **Flask** returns JSON with message and metadata
9. **Frontend** displays in chat UI

---

## 7. Key Implementation Details

### Model Used:
- **Primary**: gemini-2.5-flash (fast, cost-effective)
- **Tested Alternative**: gemini-2.0-flash-exp

### Error Handling:
- **Safety/Content Filter Errors**: Returns friendly Vietnamese message
- **Quota/Rate Limit Errors**: "System overloaded" message
- **Other Errors**: Generic technical issue message

### Frontend Integration (JavaScript):
```javascript
// From frontend/js/main.js, line 197
provider: 'gemini'  // Always hardcoded to Gemini
```

The frontend always sends provider='gemini' parameter.

---

## 8. Performance Characteristics

- **Typical Response Time**: < 3 seconds
- **Token Usage per Query**: ~200 tokens (optimized)
- **Concurrent Requests**: Handled by Flask + rate limiting
- **Cost**: Using free tier
- **Caching**: Reduces repeated identical queries

---

## 9. Files Using Gemini API

### Direct Implementation:
- C:\MINDX\src\ai_handler.py
- C:\MINDX\backend\app.py
- C:\MINDX\app.py (Streamlit)
- C:\MINDX\scripts\generate_avatars.py
- C:\MINDX\frontend\js\main.js
- C:\MINDX\frontend\js\chatbot.js

### Configuration:
- C:\MINDX\.env
- C:\MINDX\.env.example
- C:\MINDX\config\config.yaml

### Tests:
- C:\MINDX\test_gemini.py
- C:\MINDX\test_gemini_simple.py
- C:\MINDX\test_gemini_direct.py
- C:\MINDX\test_api_basic.py
- C:\MINDX\list_gemini_models.py

---

## 10. Strengths & Limitations

### Strengths:
✓ Simple, focused implementation
✓ Optimized for low latency (max_tokens=200)
✓ Graceful error handling
✓ Response caching
✓ Per-IP rate limiting
✓ Supports multiple backup API keys

### Limitations:
✗ No streaming support
✗ No customized safety_settings
✗ No explicit timeout configuration
✗ Combined prompt format
✗ Frontend hardcodes provider (no dynamic selection)
✗ No advanced sampling parameters

---

*Analysis Generated: November 11, 2025*
*Primary Library: google-generativeai*
*Model: gemini-2.5-flash*

