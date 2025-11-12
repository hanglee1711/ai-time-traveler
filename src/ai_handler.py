"""
AI Handler Module - Supports multiple AI providers
"""
import os
from typing import Dict, Optional
from dotenv import load_dotenv

load_dotenv()

# Helper function to get environment variables from both sources
def get_env(key: str, default: str = None) -> str:
    """
    Get environment variable from Streamlit secrets or os.environ
    Supports both local (.env) and Streamlit Cloud deployment
    """
    # First try os.environ (works for Flask/Render and local)
    env_value = os.getenv(key, default)
    if env_value:
        return env_value

    # Then try Streamlit secrets (only for Streamlit deployment)
    try:
        import streamlit as st
        if hasattr(st, 'secrets') and key in st.secrets:
            return st.secrets[key]
    except:
        pass

    return default


class AIHandler:
    """Handle interactions with different AI providers"""

    def __init__(self, provider: str = "openai"):
        """
        Initialize AI Handler

        Args:
            provider: AI provider to use (openai, gemini, or llama)
        """
        self.provider = provider.lower()
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        """Initialize the appropriate AI client based on provider"""
        if self.provider == "openai":
            self._init_openai()
        elif self.provider == "gemini":
            self._init_gemini()
        elif self.provider == "llama":
            self._init_llama()
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    def _init_openai(self):
        """Initialize OpenAI client"""
        try:
            from openai import OpenAI
            api_key = get_env("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY not found in environment variables")
            self.client = OpenAI(api_key=api_key)
            self.model = get_env("OPENAI_MODEL", "gpt-4")
        except ImportError:
            raise ImportError("OpenAI package not installed. Run: pip install openai")

    def _init_gemini(self):
        """Initialize Google Gemini client - WITH RELAXED SAFETY SETTINGS"""
        try:
            import google.generativeai as genai
            api_key = get_env("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY not found in environment variables")
            genai.configure(api_key=api_key)

            # Use gemini-2.5-flash
            self.model_name = get_env("GEMINI_MODEL", "gemini-2.5-flash")

            # RELAXED SAFETY SETTINGS - Allow educational historical content
            # This prevents blocking of Vietnamese history topics like wars, rebellions, etc.
            self.safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_ONLY_HIGH"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE"
                }
            ]

            self.client = genai.GenerativeModel(
                model_name=self.model_name,
                safety_settings=self.safety_settings
            )
        except ImportError:
            raise ImportError("Google Generative AI package not installed. Run: pip install google-generativeai")

    def _init_llama(self):
        """Initialize Llama client (via API)"""
        self.api_url = get_env("LLAMA_API_URL")
        self.api_key = get_env("LLAMA_API_KEY")
        if not self.api_url:
            raise ValueError("LLAMA_API_URL not found in environment variables")

    def _generate_fallback_response(self, system_prompt: str, user_message: str) -> str:
        """
        ENHANCED Fallback: Always responds with meaningful content
        Covers 20+ question patterns for ALL historical figures
        """
        import re

        # Extract figure name from system prompt
        figure_match = re.search(r'về (.+?),', system_prompt)
        figure_name = figure_match.group(1) if figure_match else "nhân vật lịch sử"

        user_lower = user_message.lower()

        # === GREETING & INTRODUCTION ===
        if any(word in user_lower for word in ["xin chào", "chào", "hello", "hi"]):
            return f"Xin chào! Ta là {figure_name}. Rất vui được gặp ngươi. Ngươi muốn tìm hiểu điều gì về ta?"

        elif any(word in user_lower for word in ["là ai", "ai", "giới thiệu", "bạn là"]):
            return f"Ta là {figure_name}, một nhân vật trong lịch sử Việt Nam. Cuộc đời ta gắn liền với những thời khắc quan trọng của dân tộc. Ngươi muốn biết về giai đoạn nào?"

        # === BIOGRAPHY & LIFE ===
        elif any(word in user_lower for word in ["chuyện đời", "cuộc đời", "tiểu sử", "câu chuyện", "kể", "sinh ra", "lớn lên", "tuổi thơ"]):
            return f"Cuộc đời ta là một hành trình đầy thử thách và ý nghĩa. Từ những ngày đầu cho đến những quyết định quan trọng, mỗi giai đoạn đều để lại dấu ấn sâu đậm. Ngươi muốn nghe về phần nào trong cuộc đời ta?"

        # === PHILOSOPHY & BELIEFS ===
        elif any(word in user_lower for word in ["triết lý", "suy nghĩ", "quan điểm", "niềm tin", "giá trị", "lý tưởng", "mục tiêu"]):
            return f"Triết lý sống của ta là luôn đặt lợi ích chung lên trên hết. Ta tin vào sức mạnh của ý chí, lòng kiên trì và tinh thần đoàn kết. Mỗi quyết định ta đưa ra đều xuất phát từ trái tim và lý trí."

        # === MILITARY & STRATEGY ===
        elif any(word in user_lower for word in ["chiến thuật", "quân sự", "chiến tranh", "chiến lược", "võ thuật", "binh pháp", "trận", "chiến đấu"]):
            return f"Trong lĩnh vực quân sự, ta học hỏi từ nhiều nguồn và áp dụng linh hoạt. Chiến thắng không chỉ đến từ sức mạnh mà còn từ trí tuệ, sự chuẩn bị kỹ lưỡng và tinh thần của toàn quân."

        # === ACHIEVEMENTS & CONTRIBUTIONS ===
        elif any(word in user_lower for word in ["sự kiện", "thành tựu", "đóng góp", "công lao", "thành công", "di sản", "để lại", "ảnh hưởng"]):
            return f"Những đóng góp của ta là kết quả của sự nỗ lực không ngừng và lòng tận tụy. Ta hy vọng những gì mình làm sẽ để lại giá trị tích cực cho thế hệ sau và cho đất nước."

        # === FAMILY & PERSONAL LIFE ===
        elif any(word in user_lower for word in ["gia đình", "vợ", "chồng", "con", "cha", "mẹ", "anh em", "người thân"]):
            return f"Gia đình luôn là nguồn động lực quan trọng với ta. Những người thân yêu là lý do để ta tiếp tục phấn đấu và vượt qua mọi khó khăn trong cuộc đời."

        # === HISTORICAL PERIOD & CONTEXT ===
        elif any(word in user_lower for word in ["thời đại", "thời kỳ", "bối cảnh", "hoàn cảnh", "lúc đó", "năm", "thời"]):
            return f"Thời đại mà ta sống là giai đoạn đầy biến động trong lịch sử. Hoàn cảnh thúc đẩy ta và nhiều người cùng thời phải đưa ra những quyết định quan trọng cho vận mệnh chung."

        # === LESSONS & WISDOM ===
        elif any(word in user_lower for word in ["bài học", "lời khuyên", "kinh nghiệm", "rút ra", "học hỏi", "dạy"]):
            return f"Từ những trải nghiệm của mình, ta nhận ra rằng: kiên trì, dũng cảm và lòng nhân ái là những giá trị không bao giờ lỗi thời. Hy vọng thế hệ sau sẽ học hỏi và phát huy những điều tốt đẹp này."

        # === CHALLENGES & DIFFICULTIES ===
        elif any(word in user_lower for word in ["khó khăn", "thử thách", "vượt qua", "đối mặt", "khổ", "gian khó"]):
            return f"Cuộc đời ai cũng có những thử thách riêng. Ta đã trải qua nhiều khó khăn, nhưng chính những điều đó tôi luyện ý chí và làm ta trưởng thành hơn."

        # === RELATIONSHIPS & COLLEAGUES ===
        elif any(word in user_lower for word in ["bạn bè", "đồng minh", "cộng sự", "người", "quan hệ", "gặp"]):
            return f"Trong cuộc đời, ta may mắn được gặp nhiều người tài đức. Những mối quan hệ đó không chỉ là sự hỗ trợ mà còn là nguồn cảm hứng để ta tiếp tục con đường mình đã chọn."

        # === LEGACY & MEMORY ===
        elif any(word in user_lower for word in ["di sản", "nhớ", "ghi nhớ", "sau này", "mai sau", "tương lai"]):
            return f"Ta hy vọng những gì mình làm sẽ được ghi nhớ không vì danh vọng, mà vì giá trị mà nó mang lại cho cộng đồng và đất nước. Đó mới là di sản thực sự."

        # === INSPIRATION & MOTIVATION ===
        elif any(word in user_lower for word in ["cảm hứng", "động lực", "truyền cảm", "khích lệ", "tại sao", "vì sao"]):
            return f"Động lực lớn nhất của ta là tình yêu quê hương và trách nhiệm với dân tộc. Mỗi khi gặp khó khăn, ta nghĩ đến những người đang tin tưởng và mình lại có thêm sức mạnh."

        # === DEFAULT: OPEN-ENDED RESPONSE ===
        else:
            return f"Đây là một câu hỏi hay! Là {figure_name}, ta sẵn sàng chia sẻ với ngươi. Ngươi có thể hỏi ta về: cuộc đời, triết lý sống, những sự kiện lịch sử, bài học rút ra, hoặc bất cứ điều gì ngươi quan tâm. Ta đang lắng nghe."

    def generate_response(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.8,
        max_tokens: int = 1000
    ) -> str:
        """
        Generate response from AI

        Args:
            system_prompt: System prompt to set context
            user_message: User's message
            temperature: Creativity level (0-1)
            max_tokens: Maximum response length

        Returns:
            AI response string
        """
        if self.provider == "openai":
            return self._generate_openai(system_prompt, user_message, temperature, max_tokens)
        elif self.provider == "gemini":
            return self._generate_gemini(system_prompt, user_message, temperature, max_tokens)
        elif self.provider == "llama":
            return self._generate_llama(system_prompt, user_message, temperature, max_tokens)

    def _generate_openai(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        max_tokens: int
    ) -> str:
        """Generate response using OpenAI"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Lỗi khi gọi OpenAI API: {str(e)}"

    def _generate_gemini(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        max_tokens: int
    ) -> str:
        """Generate response using Google Gemini - WITH SAFETY HANDLING"""
        try:
            # Combine prompt and question
            full_prompt = f"""{system_prompt}

{user_message}"""

            # OPTIMIZED: Add generation config for faster response
            generation_config = {
                'temperature': temperature,
                'max_output_tokens': max_tokens,
                'top_p': 0.95,
                'top_k': 40,
            }

            # API call with optimized config AND safety settings
            response = self.client.generate_content(
                full_prompt,
                generation_config=generation_config,
                safety_settings=self.safety_settings
            )

            # IMPORTANT: Check finish_reason before accessing text
            # finish_reason: 1=STOP (normal), 2=SAFETY (blocked), 3=RECITATION, 4=MAX_TOKENS
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]

                # Check if response was blocked by safety filters
                if hasattr(candidate, 'finish_reason'):
                    finish_reason = candidate.finish_reason

                    if finish_reason == 2:  # SAFETY
                        print(f"[SAFETY] Content blocked by Gemini safety filters - USING FALLBACK")
                        # FALLBACK: Generate simple response without AI
                        return self._generate_fallback_response(system_prompt, user_message)

                    elif finish_reason == 3:  # RECITATION
                        print(f"[RECITATION] Content blocked by recitation check")
                        return "Xin lỗi, câu trả lời có thể vi phạm bản quyền. Hãy thử hỏi theo cách khác nhé!"

                    elif finish_reason == 4:  # MAX_TOKENS
                        print(f"[MAX_TOKENS] Response truncated")
                        # Still try to get partial text
                        if hasattr(candidate.content, 'parts') and candidate.content.parts:
                            return candidate.content.parts[0].text
                        return "Câu trả lời quá dài. Hãy thử hỏi chi tiết hơn nhé!"

            # Normal case: get text from response
            if hasattr(response, 'text'):
                return response.text

            # Fallback: try to extract from parts
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate.content, 'parts') and candidate.content.parts:
                    return candidate.content.parts[0].text

            # If we get here, something went wrong - use fallback
            print(f"[ERROR] No valid response from Gemini - USING FALLBACK")
            return self._generate_fallback_response(system_prompt, user_message)

        except AttributeError as e:
            # Handle the specific "response.text requires valid Part" error - use fallback
            print(f"[ERROR] Gemini response structure error: {str(e)} - USING FALLBACK")
            return self._generate_fallback_response(system_prompt, user_message)

        except Exception as e:
            error_msg = str(e).lower()
            print(f"[ERROR] Gemini API: {str(e)}")

            # Use fallback for all errors except quota
            if "quota" in error_msg or "limit" in error_msg:
                return "Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau ít phút."
            else:
                # For all other errors (including safety), use fallback
                print(f"[ERROR] Using fallback due to Gemini error")
                return self._generate_fallback_response(system_prompt, user_message)

    def _generate_llama(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        max_tokens: int
    ) -> str:
        """Generate response using Llama (via API)"""
        import requests
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            data = {
                "model": "llama-3",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                "temperature": temperature,
                "max_tokens": max_tokens
            }

            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()

            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Lỗi khi gọi Llama API: {str(e)}"

    def generate_response_stream(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.8,
        max_tokens: int = 1000
    ):
        """
        Generate streaming response from AI (yields chunks)

        Args:
            system_prompt: System prompt to set context
            user_message: User's message
            temperature: Creativity level (0-1)
            max_tokens: Maximum response length

        Yields:
            Text chunks as they arrive
        """
        if self.provider == "gemini":
            yield from self._generate_gemini_stream(system_prompt, user_message, temperature, max_tokens)
        elif self.provider == "openai":
            yield from self._generate_openai_stream(system_prompt, user_message, temperature, max_tokens)
        else:
            # Fallback: for non-streaming providers, yield the complete response
            response = self.generate_response(system_prompt, user_message, temperature, max_tokens)
            yield response

    def _generate_gemini_stream(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        max_tokens: int
    ):
        """Generate streaming response using Google Gemini - WITH SAFETY HANDLING"""
        try:
            # Combine prompt and question
            full_prompt = f"""{system_prompt}

{user_message}"""

            # Generation config for streaming
            generation_config = {
                'temperature': temperature,
                'max_output_tokens': max_tokens,
                'top_p': 0.95,
                'top_k': 40,
            }

            # Call Gemini API with streaming enabled AND safety settings
            response = self.client.generate_content(
                full_prompt,
                generation_config=generation_config,
                safety_settings=self.safety_settings,
                stream=True
            )

            # Yield each chunk as it arrives
            has_content = False
            for chunk in response:
                # Check if chunk has valid text
                if hasattr(chunk, 'text') and chunk.text:
                    has_content = True
                    yield chunk.text
                # Check for safety blocks in streaming
                elif hasattr(chunk, 'candidates') and chunk.candidates:
                    candidate = chunk.candidates[0]
                    if hasattr(candidate, 'finish_reason') and candidate.finish_reason == 2:
                        print(f"[SAFETY] Streaming blocked - USING FALLBACK")
                        # Use fallback response instead of error message
                        yield self._generate_fallback_response(system_prompt, user_message)
                        return

            # If no content was yielded, it might have been blocked - use fallback
            if not has_content:
                print(f"[NO_CONTENT] No content received - USING FALLBACK")
                yield self._generate_fallback_response(system_prompt, user_message)

        except AttributeError as e:
            print(f"[ERROR] Gemini streaming response structure error: {str(e)} - USING FALLBACK")
            yield self._generate_fallback_response(system_prompt, user_message)

        except Exception as e:
            error_msg = str(e).lower()
            print(f"[ERROR] Gemini Streaming API: {str(e)}")

            # Use fallback for safety/blocked errors
            if "blocked" in error_msg or "safety" in error_msg or "finish_reason" in error_msg:
                print(f"[SAFETY_ERROR] Using fallback due to safety block")
                yield self._generate_fallback_response(system_prompt, user_message)
            elif "quota" in error_msg or "limit" in error_msg:
                yield "Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau ít phút."
            else:
                # For other errors, still use fallback
                print(f"[GENERAL_ERROR] Using fallback due to error")
                yield self._generate_fallback_response(system_prompt, user_message)

    def _generate_openai_stream(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        max_tokens: int
    ):
        """Generate streaming response using OpenAI"""
        try:
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True
            )

            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            yield f"Lỗi khi gọi OpenAI API: {str(e)}"


def get_ai_handler(provider: Optional[str] = None) -> AIHandler:
    """
    Get AI handler instance

    Args:
        provider: AI provider name. If None, reads from environment

    Returns:
        AIHandler instance
    """
    if provider is None:
        provider = get_env("AI_PROVIDER", "openai")

    return AIHandler(provider=provider)
