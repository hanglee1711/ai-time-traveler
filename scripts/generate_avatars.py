"""
Script to generate accurate historical avatars using AI
"""
import os
import sys
import json
import requests
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def get_historical_description(figure_name: str, figure_data: dict) -> str:
    """
    Use Gemini to get accurate historical description of the figure's appearance
    """
    period = figure_data.get('period', '')
    role = figure_data.get('role', '')

    prompt = f"""You are a Vietnamese history expert. Describe the typical appearance and clothing of {figure_name}, who was {role} during {period}.

Include:
1. Gender and approximate age during their most famous period
2. Traditional Vietnamese clothing style of that era (detailed)
3. Hairstyle typical of that period
4. Any distinctive features or symbols associated with them
5. Facial expression that matches their character (dignified, brave, wise, etc.)

Keep it factual and historically accurate. Format as a detailed art description for an illustrator."""

    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content(prompt)

    return response.text

def create_avatar_prompt(figure_name: str, historical_description: str) -> str:
    """
    Create a detailed prompt for avatar generation
    """
    prompt = f"""Portrait illustration of {figure_name}, Vietnamese historical figure.

{historical_description}

Style: Cartoon illustration, anime style, friendly face, historical accuracy, Vietnamese heritage, cultural respect, detailed traditional clothing, warm colors, professional digital art, high quality"""

    return prompt

def generate_avatar_url(figure_name: str, figure_data: dict) -> str:
    """
    Generate avatar URL using detailed historical description
    """
    print(f"\nGenerating avatar for: {figure_name}")

    # Get historical description from Gemini
    historical_desc = get_historical_description(figure_name, figure_data)
    print(f"Historical description: {historical_desc[:200]}...")

    # Create detailed prompt
    prompt = create_avatar_prompt(figure_name, historical_desc)

    # Use Pollinations.ai with the detailed prompt
    from urllib.parse import quote
    encoded_prompt = quote(prompt)
    seed = abs(hash(figure_name)) % 10000

    avatar_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=512&height=512&seed={seed}&nologo=true&enhance=true"

    print(f"Avatar URL: {avatar_url}")

    return avatar_url

def main():
    """Generate avatars for all historical figures"""
    # Load figures data
    figures_path = Path(__file__).parent.parent / 'data' / 'historical_figures.json'

    with open(figures_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    figures = data.get('figures', [])

    print(f"Found {len(figures)} historical figures")
    print("=" * 60)

    # Load existing avatars to avoid regenerating
    output_file = Path(__file__).parent.parent / 'src' / 'avatar_urls.json'
    avatar_mapping = {}
    if output_file.exists():
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                avatar_mapping = json.load(f)
            print(f"Loaded {len(avatar_mapping)} existing avatars")
        except:
            pass

    # Generate avatar URLs for all figures
    for figure in figures:
        name = figure['name']

        # Skip if already generated
        if name in avatar_mapping:
            print(f"\n✓ Skipping {name} (already generated)")
            continue

        avatar_url = generate_avatar_url(name, figure)
        avatar_mapping[name] = avatar_url
        print("-" * 60)

    # Save mapping to file
    output_file = Path(__file__).parent.parent / 'src' / 'avatar_urls.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(avatar_mapping, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 60)
    print(f"✅ Generated {len(avatar_mapping)} avatars!")
    print(f"💾 Saved to: {output_file}")
    print("\nAvatar URLs:")
    for name, url in avatar_mapping.items():
        print(f"  • {name}")

if __name__ == "__main__":
    main()
