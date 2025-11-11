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
        """Initialize Google Gemini client - SIMPLIFIED (no safety settings)"""
        try:
            import google.generativeai as genai
            api_key = get_env("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY not found in environment variables")
            genai.configure(api_key=api_key)

            # Use gemini-2.5-flash
            self.model_name = get_env("GEMINI_MODEL", "gemini-2.5-flash")

            # SIMPLIFIED: No safety settings - let Gemini use defaults
            self.client = genai.GenerativeModel(model_name=self.model_name)
        except ImportError:
            raise ImportError("Google Generative AI package not installed. Run: pip install google-generativeai")

    def _init_llama(self):
        """Initialize Llama client (via API)"""
        self.api_url = get_env("LLAMA_API_URL")
        self.api_key = get_env("LLAMA_API_KEY")
        if not self.api_url:
            raise ValueError("LLAMA_API_URL not found in environment variables")

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
        """Generate response using Google Gemini - ULTRA SIMPLIFIED"""
        try:
            # ULTRA SIMPLE - Just combine prompt and question
            full_prompt = f"""{system_prompt}

{user_message}"""

            # SIMPLE API call - no complex config
            response = self.client.generate_content(full_prompt)

            # Get text from response - simple and direct
            return response.text

        except Exception as e:
            error_msg = str(e).lower()
            print(f"[ERROR] Gemini API: {str(e)}")

            # Provide helpful error messages
            if "blocked" in error_msg or "safety" in error_msg:
                return "Xin lỗi, câu hỏi này có vấn đề với hệ thống. Hãy thử hỏi theo cách khác nhé!"
            elif "quota" in error_msg or "limit" in error_msg:
                return "Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau ít phút."
            else:
                return "Xin lỗi, đang gặp chút vấn đề kỹ thuật. Hãy thử lại nhé!"

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
        """Generate streaming response using Google Gemini"""
        try:
            # Combine prompt and question
            full_prompt = f"""{system_prompt}

{user_message}"""

            # Call Gemini API with streaming enabled
            response = self.client.generate_content(full_prompt, stream=True)

            # Yield each chunk as it arrives
            for chunk in response:
                if chunk.text:
                    yield chunk.text

        except Exception as e:
            error_msg = str(e).lower()
            print(f"[ERROR] Gemini Streaming API: {str(e)}")

            # Provide helpful error messages
            if "blocked" in error_msg or "safety" in error_msg:
                yield "Xin lỗi, câu hỏi này có vấn đề với hệ thống. Hãy thử hỏi theo cách khác nhé!"
            elif "quota" in error_msg or "limit" in error_msg:
                yield "Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau ít phút."
            else:
                yield "Xin lỗi, đang gặp chút vấn đề kỹ thuật. Hãy thử lại nhé!"

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
