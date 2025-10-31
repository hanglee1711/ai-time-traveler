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
    try:
        import streamlit as st
        # Try Streamlit secrets first (for Streamlit Cloud)
        if hasattr(st, 'secrets') and key in st.secrets:
            return st.secrets[key]
    except:
        pass
    # Fall back to os.environ (for local development)
    return os.getenv(key, default)


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
        """Initialize Google Gemini client"""
        try:
            import google.generativeai as genai
            api_key = get_env("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY not found in environment variables")
            genai.configure(api_key=api_key)
            # Use the stable model name that works with current API
            self.model = get_env("GEMINI_MODEL", "gemini-pro")
            self.client = genai.GenerativeModel(self.model)
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
        """Generate response using Google Gemini"""
        try:
            # Combine system prompt and user message for Gemini
            full_prompt = f"{system_prompt}\n\nNgười dùng: {user_message}\n\nTrả lời:"

            generation_config = {
                "temperature": temperature,
                "max_output_tokens": max_tokens,
            }

            response = self.client.generate_content(
                full_prompt,
                generation_config=generation_config
            )
            return response.text
        except Exception as e:
            return f"Lỗi khi gọi Gemini API: {str(e)}"

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
