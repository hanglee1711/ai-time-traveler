"""
Avatar Generator Module - Generate avatars for historical figures
"""
import hashlib
from urllib.parse import quote
import re
import requests
import json
from pathlib import Path


# Load AI-generated avatar URLs
def load_ai_avatars():
    """Load AI-generated avatar URLs from JSON file"""
    try:
        avatar_file = Path(__file__).parent / 'avatar_urls.json'
        if avatar_file.exists():
            with open(avatar_file, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading avatar URLs: {e}")
    return {}


AI_GENERATED_AVATARS = load_ai_avatars()


def create_avatar_prompt(name: str, figure_data: dict = None) -> str:
    """
    Create a descriptive prompt for AI avatar generation

    Args:
        name: Name of the historical figure
        figure_data: Additional figure information (period, role, etc.)

    Returns:
        Prompt string for avatar generation
    """
    # Determine characteristics based on name and period
    gender = "male"
    if any(keyword in name.lower() for keyword in ["bà", "cô", "nữ"]):
        gender = "female"

    # Default style
    style = "Vietnamese historical figure portrait"
    attire = "traditional Vietnamese clothing"

    # Customize based on period if available
    if figure_data:
        period = figure_data.get('period', '').lower()
        role = figure_data.get('role', '').lower()

        if any(word in period for word in ["trần", "lý", "lê", "đinh", "ngô"]):
            attire = "ancient Vietnamese royal or military attire"
        elif any(word in period for word in ["1900", "1945", "hiện đại", "cách mạng"]):
            attire = "modern Vietnamese revolutionary clothing"

        if "tướng" in role or "quân" in role:
            style = "Vietnamese historical military leader"
        elif "vua" in role or "hoàng" in role:
            style = "Vietnamese royal figure"

    prompt = f"Portrait of {name}, {style}, {gender}, wearing {attire}, dignified expression, historical art style, Vietnamese heritage, detailed face, traditional, cultural, heroic"

    return prompt


def generate_avatar_url(name: str, figure_data: dict = None) -> str:
    """
    Generate AI-illustrated avatar URL for a historical figure

    Args:
        name: Name of the historical figure
        figure_data: Optional figure data for better prompt

    Returns:
        Avatar URL string
    """
    # Create descriptive prompt
    prompt = create_avatar_prompt(name, figure_data)

    # Use Pollinations.ai (free AI image generation, no API key needed)
    # This generates cartoon/illustrated avatars based on text prompts
    encoded_prompt = quote(prompt)

    # Pollinations.ai URL format with seed for consistency
    seed = abs(hash(name)) % 10000
    avatar_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=400&height=400&seed={seed}&nologo=true"

    return avatar_url


def generate_initials_avatar(name: str) -> str:
    """
    Generate avatar with initials

    Args:
        name: Name of the historical figure

    Returns:
        Avatar URL with initials
    """
    # Extract initials from name
    words = name.split()
    initials = ''.join([word[0].upper() for word in words[:2]])

    # UI Avatars API (free)
    avatar_url = f"https://ui-avatars.com/api/?name={quote(name)}&size=200&background=0D8ABC&color=fff&bold=true&format=svg"

    return avatar_url


def get_avatar_for_figure(figure_name: str, figure_data: dict = None, use_initials: bool = False) -> str:
    """
    Get avatar URL for a historical figure

    Args:
        figure_name: Name of the figure
        figure_data: Optional figure data for better AI generation
        use_initials: If True, use initials-based avatar. If False, use historical portrait

    Returns:
        Avatar URL string
    """
    # Priority 1: Use AI-generated historically accurate avatars
    if figure_name in AI_GENERATED_AVATARS:
        return AI_GENERATED_AVATARS[figure_name]

    # Priority 2: Use DiceBear avatars as fallback
    if figure_name in HISTORICAL_PORTRAITS:
        return HISTORICAL_PORTRAITS[figure_name]

    # Priority 3: Use initials if requested
    if use_initials:
        return generate_initials_avatar(figure_name)

    # Priority 4: Generate AI avatar for unknown figures
    return generate_avatar_url(figure_name, figure_data)


# Avatar URLs using DiceBear API - stable and reliable
def get_dicebear_avatar(name: str, style: str = "adventurer") -> str:
    """Generate avatar using DiceBear API"""
    # Create consistent seed from name
    seed = abs(hash(name)) % 100000
    # Use DiceBear API with various styles
    # Styles: adventurer, avataaars, bottts, identicon, lorelei, micah, miniavs, personas, pixel-art
    return f"https://api.dicebear.com/7.x/{style}/svg?seed={seed}&backgroundColor=b6e3f4&size=200"

HISTORICAL_PORTRAITS = {
    "Hai Bà Trưng": get_dicebear_avatar("Hai Bà Trưng", "lorelei"),
    "Ngô Quyền": get_dicebear_avatar("Ngô Quyền", "avataaars"),
    "Lý Công Uẩn": get_dicebear_avatar("Lý Công Uẩn", "avataaars"),
    "Lý Thường Kiệt": get_dicebear_avatar("Lý Thường Kiệt", "avataaars"),
    "Trần Hưng Đạo": get_dicebear_avatar("Trần Hưng Đạo", "avataaars"),
    "Nguyễn Trãi": get_dicebear_avatar("Nguyễn Trãi", "avataaars"),
    "Lê Lợi": get_dicebear_avatar("Lê Lợi", "avataaars"),
    "Quang Trung": get_dicebear_avatar("Quang Trung", "avataaars"),
    "Nguyễn Huệ": get_dicebear_avatar("Nguyễn Huệ", "avataaars"),
    "Hồ Chí Minh": get_dicebear_avatar("Hồ Chí Minh", "micah"),
    "Võ Nguyên Giáp": get_dicebear_avatar("Võ Nguyên Giáp", "micah"),
    "Bà Triệu": get_dicebear_avatar("Bà Triệu", "lorelei"),
    "Đinh Bộ Lĩnh": get_dicebear_avatar("Đinh Bộ Lĩnh", "avataaars"),
    "Lê Thánh Tông": get_dicebear_avatar("Lê Thánh Tông", "avataaars"),
}

# Emoji icons for figures (fallback)
FIGURE_AVATARS = {
    "Trần Hưng Đạo": "👑",
    "Hai Bà Trưng": "⚔️",
    "Quang Trung": "🐉",
    "Hồ Chí Minh": "⭐",
    "Võ Nguyên Giáp": "🎖️",
    "Lý Thường Kiệt": "🛡️",
    "Bà Triệu": "🗡️",
    "Nguyễn Trãi": "📜",
}


def get_figure_emoji(figure_name: str) -> str:
    """
    Get emoji icon for a historical figure

    Args:
        figure_name: Name of the figure

    Returns:
        Emoji string or default emoji
    """
    return FIGURE_AVATARS.get(figure_name, "🎭")


if __name__ == "__main__":
    # Test avatar generation
    test_figures = [
        "Trần Hưng Đạo",
        "Hai Bà Trưng",
        "Hồ Chí Minh",
        "Lý Thường Kiệt",
    ]

    print("Generated Avatar URLs:")
    print("=" * 60)
    for figure in test_figures:
        print(f"\n{figure}:")
        print(f"  Illustrated: {generate_avatar_url(figure)}")
        print(f"  Initials: {generate_initials_avatar(figure)}")
        print(f"  Emoji: {get_figure_emoji(figure)}")
