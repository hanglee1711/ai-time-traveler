"""
Quiz Handler Module - Generate and manage quizzes
"""
import json
import re
import streamlit as st


def generate_quiz(ai_handler, conversation_history: list, temperature: float = 0.7):
    """
    Generate quiz from conversation history

    Args:
        ai_handler: AI handler instance
        conversation_history: List of conversation messages
        temperature: Temperature for generation

    Returns:
        Quiz data dictionary or None if failed
    """
    from src.prompts import get_quiz_generation_prompt

    # Format conversation history
    formatted_history = ""
    for msg in conversation_history[-6:]:  # Last 6 messages
        role = "Người dùng" if msg["role"] == "user" else "AI"
        formatted_history += f"{role}: {msg['content']}\n\n"

    # Generate quiz
    try:
        quiz_prompt = get_quiz_generation_prompt(formatted_history)

        response = ai_handler.generate_response(
            system_prompt="You are a quiz generator. Return ONLY valid JSON, no additional text.",
            user_message=quiz_prompt,
            temperature=temperature,
            max_tokens=2000
        )

        # Extract JSON from response (in case there's extra text)
        # Try to find JSON in the response
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            json_str = json_match.group(0)
            quiz_data = json.loads(json_str)
            return quiz_data
        else:
            # Try parsing the whole response
            quiz_data = json.loads(response)
            return quiz_data

    except json.JSONDecodeError as e:
        st.error(f"⚠️ Lỗi parse JSON: {str(e)}")
        st.code(response)  # Show raw response for debugging
        return None
    except Exception as e:
        st.error(f"⚠️ Lỗi tạo quiz: {str(e)}")
        return None


def display_quiz(quiz_data):
    """
    Display quiz UI

    Args:
        quiz_data: Quiz data dictionary
    """
    if not quiz_data or 'questions' not in quiz_data:
        st.error("❌ Dữ liệu quiz không hợp lệ!")
        return

    st.markdown("## 🎓 Kiểm tra kiến thức")
    st.markdown("---")

    questions = quiz_data['questions']

    # Display each question
    for i, q in enumerate(questions):
        st.markdown(f"### Câu {i+1}: {q['question']}")

        # Difficulty badge
        difficulty_colors = {
            'easy': '🟢',
            'medium': '🟡',
            'hard': '🔴'
        }
        difficulty = q.get('difficulty', 'medium')
        st.markdown(f"{difficulty_colors.get(difficulty, '⚪')} Độ khó: {difficulty}")

        # Options
        options = q['options']
        user_answer = st.radio(
            "Chọn đáp án:",
            options=list(options.keys()),
            format_func=lambda x: f"{x}. {options[x]}",
            key=f"q_{i}",
            index=None
        )

        # Store answer
        if user_answer:
            st.session_state.quiz_answers[i] = user_answer

        st.markdown("---")

    # Submit button
    col1, col2 = st.columns([1, 3])
    with col1:
        if st.button("📝 Nộp bài", type="primary", use_container_width=True):
            st.session_state.quiz_submitted = True
            st.rerun()

    with col2:
        if st.button("🔄 Làm lại", use_container_width=True):
            st.session_state.quiz_answers = {}
            st.session_state.quiz_submitted = False
            st.rerun()


def display_quiz_results(quiz_data):
    """
    Display quiz results with scoring and feedback

    Args:
        quiz_data: Quiz data dictionary
    """
    if not quiz_data or 'questions' not in quiz_data:
        return

    questions = quiz_data['questions']
    total = len(questions)
    correct = 0

    st.markdown("## 📊 Kết quả kiểm tra")
    st.markdown("---")

    # Calculate score
    for i, q in enumerate(questions):
        user_answer = st.session_state.quiz_answers.get(i)
        correct_answer = q['correct_answer']

        if user_answer == correct_answer:
            correct += 1

    # Display score
    score_percentage = (correct / total) * 100

    # Score badge with color
    if score_percentage >= 80:
        badge_color = "#4CAF50"  # Green
        emoji = "🎉"
        message = "Xuất sắc!"
    elif score_percentage >= 60:
        badge_color = "#FFC107"  # Yellow
        emoji = "👍"
        message = "Khá tốt!"
    else:
        badge_color = "#F44336"  # Red
        emoji = "💪"
        message = "Cần cố gắng thêm!"

    st.markdown(f"""
    <div style='text-align: center; padding: 2rem; background: {badge_color};
                border-radius: 15px; margin: 1rem 0;'>
        <h1 style='color: white; margin: 0;'>{emoji} {message}</h1>
        <h2 style='color: white; margin: 0.5rem 0;'>
            Điểm: {correct}/{total} ({score_percentage:.0f}%)
        </h2>
    </div>
    """, unsafe_allow_html=True)

    # Detailed feedback for each question
    st.markdown("### 📝 Chi tiết từng câu")

    for i, q in enumerate(questions):
        user_answer = st.session_state.quiz_answers.get(i, "Chưa trả lời")
        correct_answer = q['correct_answer']
        is_correct = user_answer == correct_answer

        # Question header
        if is_correct:
            st.success(f"✅ Câu {i+1}: ĐÚNG")
        else:
            st.error(f"❌ Câu {i+1}: SAI")

        # Question content
        st.markdown(f"**{q['question']}**")

        # Show all options with indicators
        for key, value in q['options'].items():
            if key == correct_answer:
                st.markdown(f"✅ **{key}. {value}** _(Đáp án đúng)_")
            elif key == user_answer and key != correct_answer:
                st.markdown(f"❌ ~~{key}. {value}~~ _(Bạn chọn)_")
            else:
                st.markdown(f"⚪ {key}. {value}")

        # Explanation
        st.info(f"💡 **Giải thích:** {q['explanation']}")
        st.markdown("---")

    # Action buttons
    col1, col2, col3 = st.columns(3)

    with col1:
        if st.button("🔄 Làm lại quiz", use_container_width=True):
            st.session_state.quiz_answers = {}
            st.session_state.quiz_submitted = False
            st.rerun()

    with col2:
        if st.button("🆕 Tạo quiz mới", use_container_width=True):
            st.session_state.quiz_mode = False
            st.session_state.quiz_data = None
            st.session_state.quiz_answers = {}
            st.session_state.quiz_submitted = False
            st.rerun()

    with col3:
        if st.button("💬 Quay lại chat", use_container_width=True):
            st.session_state.quiz_mode = False
            st.session_state.quiz_answers = {}
            st.session_state.quiz_submitted = False
            st.rerun()
