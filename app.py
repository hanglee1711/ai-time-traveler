"""
Việt Sử Ký - Main Application
A chatbot that lets you chat with historical figures or travel to historical moments
"""
import streamlit as st
import os
import sys
import json
import re
from pathlib import Path

# Add src to path
sys.path.append(str(Path(__file__).parent / "src"))

from src.ai_handler import get_ai_handler
from src.input_detector import InputDetector
from src.prompts import (
    get_roleplay_prompt,
    get_time_travel_prompt,
    get_general_prompt,
    get_greeting_prompt,
    get_unknown_figure_prompt,
    get_quiz_generation_prompt
)
from src.quiz_handler import generate_quiz, display_quiz, display_quiz_results


# Page configuration
st.set_page_config(
    page_title="🚀 Việt Sử Ký",
    page_icon="⏳",
    layout="wide",
    initial_sidebar_state="expanded"
)


# Custom CSS for beautiful UI - optimized for better readability
st.markdown("""
    <style>
    /* Main background */
    .stApp {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Chat container - reduced padding for better space usage */
    .main .block-container {
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        padding: 1.5rem;
        max-width: 1400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    /* Title styling - reduced size */
    h1 {
        color: #2c3e50;
        text-align: center;
        font-family: 'Georgia', serif;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    /* Subtitle - reduced size */
    h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
    }

    /* Chat messages - compact design */
    .stChatMessage {
        background-color: rgba(255, 248, 220, 0.5);
        border-radius: 15px;
        padding: 0.75rem;
        margin: 0.4rem 0;
        font-size: 0.95rem;
    }

    /* Sidebar */
    .css-1d391kg {
        background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
    }

    /* Buttons - compact */
    .stButton button {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 10px;
        border: none;
        padding: 0.4rem 1rem;
        font-weight: bold;
        transition: all 0.3s;
        font-size: 0.9rem;
    }

    .stButton button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    /* Info boxes */
    .stAlert {
        border-radius: 10px;
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
    }

    /* Reduce chat input size */
    .stChatInputContainer {
        padding: 0.5rem 0;
    }

    /* Compact sliders and selectboxes */
    .stSlider, .stSelectbox {
        font-size: 0.9rem;
    }
    </style>
""", unsafe_allow_html=True)


# Initialize session state
def initialize_session_state():
    """Initialize all session state variables"""
    if 'messages' not in st.session_state:
        st.session_state.messages = []
    if 'current_mode' not in st.session_state:
        st.session_state.current_mode = None
    if 'current_figure' not in st.session_state:
        st.session_state.current_figure = None
    if 'current_year' not in st.session_state:
        st.session_state.current_year = None
    if 'ai_handler' not in st.session_state:
        st.session_state.ai_handler = None
    if 'detector' not in st.session_state:
        # Initialize detector
        base_dir = Path(__file__).parent
        figures_path = base_dir / 'data' / 'historical_figures.json'
        events_path = base_dir / 'data' / 'historical_events.json'
        st.session_state.detector = InputDetector(str(figures_path), str(events_path))
    # Quiz mode states
    if 'quiz_mode' not in st.session_state:
        st.session_state.quiz_mode = False
    if 'quiz_data' not in st.session_state:
        st.session_state.quiz_data = None
    if 'quiz_answers' not in st.session_state:
        st.session_state.quiz_answers = {}
    if 'quiz_submitted' not in st.session_state:
        st.session_state.quiz_submitted = False


def display_header():
    """Display application header"""
    st.markdown("# 🚀 Việt Sử Ký")
    st.markdown("### ⏳ Cỗ máy du hành thời gian lịch sử")
    st.markdown("---")

    st.markdown("""
    <div style='text-align: center; padding: 0.75rem; background: linear-gradient(90deg, #ffeaa7 0%, #fdcb6e 100%);
                border-radius: 10px; margin-bottom: 0.75rem;'>
        <p style='color: #2d3436; margin: 0; font-size: 1rem; font-weight: 600;'>
            ✨ Trò chuyện với các nhân vật lịch sử hoặc du hành đến các mốc thời gian quan trọng! ✨
        </p>
    </div>
    """, unsafe_allow_html=True)


def setup_sidebar():
    """Setup sidebar with controls"""
    with st.sidebar:
        st.markdown("## ⚙️ Cài đặt")

        # AI Provider selection
        st.markdown("### 🤖 Chọn AI Provider")
        # Read default provider from .env file
        default_provider = os.getenv("AI_PROVIDER", "gemini").lower()
        # Set the index based on the default provider
        provider_options = ["gemini", "openai", "llama"]
        default_index = provider_options.index(default_provider) if default_provider in provider_options else 0

        provider = st.selectbox(
            "Provider",
            provider_options,
            index=default_index,
            help="Chọn nhà cung cấp AI (mặc định: Gemini - miễn phí)"
        )

        # Temperature setting
        temperature = st.slider(
            "Độ sáng tạo",
            min_value=0.0,
            max_value=1.0,
            value=0.8,
            step=0.1,
            help="Cao hơn = sáng tạo hơn"
        )

        # Max tokens
        max_tokens = st.slider(
            "Độ dài phản hồi",
            min_value=100,
            max_value=2000,
            value=1000,
            step=100
        )

        st.markdown("---")

        # Quick actions
        st.markdown("### 🎯 Du hành nhanh")

        # Historical periods
        famous_years = {
            "938 - Trận Bạch Đằng": 938,
            "1010 - Dời đô Thăng Long": 1010,
            "1288 - Trận Bạch Đằng lần 3": 1288,
            "1789 - Ngọc Hồi Đống Đa": 1789,
            "1945 - Độc lập": 1945,
            "1954 - Điện Biên Phủ": 1954,
            "1975 - Thống nhất": 1975,
        }

        for event_name, year in famous_years.items():
            if st.button(event_name, key=f"year_{year}"):
                st.session_state.messages.append({
                    "role": "user",
                    "content": f"Hãy đưa tôi đến năm {year}"
                })
                st.rerun()

        st.markdown("---")

        # Famous figures
        st.markdown("### 👥 Nhân vật nổi tiếng")

        famous_figures = [
            "Hai Bà Trưng",
            "Trần Hưng Đạo",
            "Quang Trung",
            "Hồ Chí Minh",
            "Võ Nguyên Giáp"
        ]

        for figure_name in famous_figures:
            if st.button(f"💬 {figure_name}", key=f"fig_{figure_name}"):
                st.session_state.messages.append({
                    "role": "user",
                    "content": f"Xin chào {figure_name}"
                })
                st.rerun()

        st.markdown("---")

        # Quiz mode toggle
        st.markdown("### 🎓 Chế độ học tập")

        if len(st.session_state.messages) >= 4:  # Need at least 2 exchanges
            if st.button("📝 Tạo Quiz từ cuộc trò chuyện", type="primary", use_container_width=True):
                with st.spinner("🤔 Đang tạo câu hỏi..."):
                    quiz_data = generate_quiz(
                        st.session_state.ai_handler,
                        st.session_state.messages,
                        temperature=0.7
                    )
                    if quiz_data:
                        st.session_state.quiz_data = quiz_data
                        st.session_state.quiz_mode = True
                        st.session_state.quiz_answers = {}
                        st.session_state.quiz_submitted = False
                        st.success("✅ Quiz đã được tạo!")
                        st.rerun()
        else:
            st.info("💡 Trò chuyện ít nhất 2 lượt để tạo quiz!")

        st.markdown("---")

        # Clear chat
        if st.button("🗑️ Xóa lịch sử chat", type="secondary", use_container_width=True):
            st.session_state.messages = []
            st.session_state.current_mode = None
            st.session_state.current_figure = None
            st.session_state.current_year = None
            st.session_state.quiz_mode = False
            st.session_state.quiz_data = None
            st.session_state.quiz_answers = {}
            st.session_state.quiz_submitted = False
            st.rerun()

        # App info
        st.markdown("---")
        st.markdown("""
        ### 📖 Hướng dẫn
        - Nhập tên nhân vật lịch sử để trò chuyện
        - Nhập năm lịch sử để du hành
        - Hoặc hỏi bất kỳ câu hỏi lịch sử nào!

        ### 💡 Ví dụ
        - "Xin chào Quang Trung"
        - "Đưa tôi đến năm 1945"
        - "Trận Bạch Đằng diễn ra như thế nào?"
        """)

        return provider, temperature, max_tokens


def display_chat_history():
    """Display chat history"""
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])


def generate_response(user_input: str, provider: str, temperature: float, max_tokens: int):
    """
    Generate AI response based on user input

    Args:
        user_input: User's message
        provider: AI provider
        temperature: Temperature setting
        max_tokens: Max tokens setting
    """
    # Initialize AI handler if needed
    if st.session_state.ai_handler is None or st.session_state.ai_handler.provider != provider:
        try:
            st.session_state.ai_handler = get_ai_handler(provider)
        except Exception as e:
            st.error(f"⚠️ Lỗi khởi tạo AI: {str(e)}")
            st.info("💡 Vui lòng kiểm tra API key trong file .env")
            return None

    # Detect intent
    intent, data = st.session_state.detector.detect(user_input)

    # Generate appropriate response
    try:
        if intent == 'figure':
            # Roleplay mode
            st.session_state.current_mode = 'figure'
            st.session_state.current_figure = data['name']

            # Check if this is an unknown figure (not in database)
            if data.get('unknown', False):
                # Use generic prompt for unknown figures
                # AI will research and roleplay based on historical knowledge
                system_prompt = get_unknown_figure_prompt(data['name'])

                response = st.session_state.ai_handler.generate_response(
                    system_prompt=system_prompt,
                    user_message=user_input,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    conversation_history=st.session_state.messages  # Pass conversation history
                )

                # Add context indicator for unknown figure
                st.info(f"💭 Đang trò chuyện với: **{data['name']}** (AI tự động nhập vai)")
            else:
                # Known figure in database - use detailed prompt
                # Check if this is first greeting
                is_greeting = any(word in user_input.lower() for word in ['xin chào', 'chào', 'hello', 'hi'])

                if is_greeting:
                    system_prompt = get_roleplay_prompt(data) + "\n\n" + get_greeting_prompt(data['name'])
                else:
                    system_prompt = get_roleplay_prompt(data)

                response = st.session_state.ai_handler.generate_response(
                    system_prompt=system_prompt,
                    user_message=user_input,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    conversation_history=st.session_state.messages  # Pass conversation history
                )

                # Add context indicator
                st.info(f"💭 Đang trò chuyện với: **{data['name']}** ({data['period']})")

        elif intent == 'year':
            # Time travel mode
            st.session_state.current_mode = 'year'
            st.session_state.current_year = data['year']

            system_prompt = get_time_travel_prompt(data['year'], data.get('event'))

            response = st.session_state.ai_handler.generate_response(
                system_prompt=system_prompt,
                user_message=user_input,
                temperature=temperature,
                max_tokens=max_tokens,
                conversation_history=st.session_state.messages  # Pass conversation history
            )

            # Add context indicator
            if data.get('event'):
                st.info(f"⏰ Du hành đến năm: **{data['year']}** - {data['event']['name']}")
            else:
                st.info(f"⏰ Du hành đến năm: **{data['year']}**")

        else:
            # General question mode
            # Check if we're continuing a conversation
            if st.session_state.current_mode == 'figure' and st.session_state.current_figure:
                # Continue roleplay
                figure_data = st.session_state.detector.get_figure_by_name(st.session_state.current_figure)
                if figure_data:
                    system_prompt = get_roleplay_prompt(figure_data)
                else:
                    system_prompt = get_general_prompt()
            elif st.session_state.current_mode == 'year' and st.session_state.current_year:
                # Continue time travel
                event_data = st.session_state.detector.get_event_by_year(st.session_state.current_year)
                system_prompt = get_time_travel_prompt(st.session_state.current_year, event_data)
            else:
                # General mode
                system_prompt = get_general_prompt()

            response = st.session_state.ai_handler.generate_response(
                system_prompt=system_prompt,
                user_message=user_input,
                temperature=temperature,
                max_tokens=max_tokens,
                conversation_history=st.session_state.messages  # Pass conversation history
            )

        return response

    except Exception as e:
        st.error(f"⚠️ Lỗi khi tạo phản hồi: {str(e)}")
        return None


def main():
    """Main application function"""
    # Initialize
    initialize_session_state()

    # Display header
    display_header()

    # Setup sidebar and get settings
    provider, temperature, max_tokens = setup_sidebar()

    # Check if in quiz mode
    if st.session_state.quiz_mode and st.session_state.quiz_data:
        # Display quiz
        if st.session_state.quiz_submitted:
            display_quiz_results(st.session_state.quiz_data)
        else:
            display_quiz(st.session_state.quiz_data)
        return  # Exit early, don't show chat

    # Display chat history
    display_chat_history()

    # Chat input
    if user_input := st.chat_input("💬 Nhập tin nhắn của bạn..."):
        # Add user message
        st.session_state.messages.append({
            "role": "user",
            "content": user_input
        })

        # Display user message
        with st.chat_message("user"):
            st.markdown(user_input)

        # Generate and display assistant response
        with st.chat_message("assistant"):
            with st.spinner("🤔 Đang suy nghĩ..."):
                response = generate_response(user_input, provider, temperature, max_tokens)

                if response:
                    st.markdown(response)

                    # Add assistant message to history
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": response
                    })

    # Welcome message if no messages
    if len(st.session_state.messages) == 0:
        st.markdown("""
        <div style='text-align: center; padding: 2rem; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                    border-radius: 20px; margin: 1rem 0;'>
            <h2 style='color: #1565c0; font-size: 1.5rem;'>🌟 Chào mừng đến với Việt Sử Ký! 🌟</h2>
            <p style='font-size: 1rem; color: #424242; margin: 0.75rem 0;'>
                Hãy bắt đầu cuộc hành trình khám phá lịch sử của bạn!
            </p>
            <div style='margin-top: 1rem;'>
                <p style='font-size: 0.95rem; color: #616161;'>
                    ✨ Thử nói: "Xin chào Quang Trung" hoặc "Đưa tôi đến năm 1945"
                </p>
            </div>
        </div>
        """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
