"""
Input Detector Module - Detect user intent and extract information
"""
import re
import json
import unicodedata
from typing import Dict, Optional, Tuple


def remove_vietnamese_accents(text: str) -> str:
    """
    Remove Vietnamese accents from text for fuzzy matching

    Args:
        text: Input text with accents

    Returns:
        Text without accents
    """
    # Normalize unicode
    text = unicodedata.normalize('NFD', text)
    # Remove combining characters (accents)
    text = ''.join(char for char in text if unicodedata.category(char) != 'Mn')
    # Replace Đ/đ
    text = text.replace('Đ', 'D').replace('đ', 'd')
    return text


class InputDetector:
    """Detect user intent from input"""

    def __init__(self, figures_path: str, events_path: str):
        """
        Initialize Input Detector

        Args:
            figures_path: Path to historical figures JSON
            events_path: Path to historical events JSON
        """
        self.figures = self._load_json(figures_path)
        self.events = self._load_json(events_path)

    def _load_json(self, path: str) -> dict:
        """Load JSON data"""
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {path}: {e}")
            return {}

    def detect(self, user_input: str) -> Tuple[str, Optional[Dict]]:
        """
        Detect user intent and extract relevant data

        Args:
            user_input: User's input text

        Returns:
            Tuple of (intent_type, data)
            intent_type: 'figure', 'year', or 'general'
            data: Relevant data based on intent type
        """
        # Check for year pattern
        year_match = self._detect_year(user_input)
        if year_match:
            year = year_match
            event = self._find_event(year)
            return 'year', {'year': year, 'event': event}

        # Check for historical figure in database
        figure = self._detect_figure(user_input)
        if figure:
            return 'figure', figure

        # Check for any Vietnamese name pattern (for figures not in database)
        unknown_figure = self._detect_unknown_figure(user_input)
        if unknown_figure:
            return 'figure', unknown_figure

        # Default to general question
        return 'general', None

    def _detect_year(self, text: str) -> Optional[int]:
        """
        Detect year in text

        Args:
            text: Input text

        Returns:
            Year as integer, or None
        """
        # Pattern for years
        patterns = [
            r'năm\s+(\d{1,4})',
            r'(?:^|\s)(\d{3,4})(?:\s|$)',
            r'thời\s+(\d{1,4})',
            r'đến\s+năm\s+(\d{1,4})',
            r'du\s+hành.*?(\d{1,4})',
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                year = int(match.group(1))
                # Validate year range
                if 1 <= year <= 2100:
                    return year

        return None

    def _detect_figure(self, text: str) -> Optional[Dict]:
        """
        Detect historical figure in text

        Args:
            text: Input text

        Returns:
            Figure data dictionary, or None
        """
        text_lower = text.lower()

        for figure in self.figures.get('figures', []):
            # Check main name
            if figure['name'].lower() in text_lower:
                return figure

            # Check alternative names
            for alt_name in figure.get('alt_names', []):
                if alt_name.lower() in text_lower:
                    return figure

        return None

    def _detect_unknown_figure(self, text: str) -> Optional[Dict]:
        """
        Detect any Vietnamese historical figure name using patterns
        (for figures not in database)

        Args:
            text: Input text

        Returns:
            Dictionary with extracted name, or None
        """
        # Patterns to detect conversation with a person
        name_pattern = r'([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:\s+[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*){0,3})'

        figure_patterns = [
            # Greetings
            rf'(?:xin chào|chào|hello|hi)\s+{name_pattern}',
            # Questions about a person
            rf'(?:ai là|về|giới thiệu|kể về|hỏi về)\s+{name_pattern}',
            rf'{name_pattern}\s+(?:là ai|làm gì|đã làm gì|có công gì)',
            # Want to talk/meet
            rf'(?:tôi muốn|cho tôi|hãy)\s+(?:nói chuyện với|trò chuyện với|gặp|biết về|hỏi)\s+{name_pattern}',
            # Direct name mention with action verbs
            rf'{name_pattern}\s+(?:đã|từng|có|là)',
            # Questions directed to a person
            rf'(?:anh|ông|bà|cô)\s+{name_pattern}',
        ]

        for pattern in figure_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                name = match.group(1).strip()
                # Validate: must be at least 2 words for Vietnamese names
                if len(name.split()) >= 2 or len(name) >= 5:
                    # Return a minimal figure dict for unknown figures
                    return {
                        'name': name,
                        'unknown': True  # Flag to indicate this is not in database
                    }

        return None

    def _find_event(self, year: int) -> Optional[Dict]:
        """
        Find event for given year

        Args:
            year: Year to search

        Returns:
            Event data dictionary, or None
        """
        for event in self.events.get('events', []):
            if event['year'] == year:
                return event

        return None

    def get_all_figures(self) -> list:
        """Get list of all historical figures"""
        return self.figures.get('figures', [])

    def get_all_events(self) -> list:
        """Get list of all historical events"""
        return self.events.get('events', [])

    def get_figure_by_name(self, name: str) -> Optional[Dict]:
        """
        Get figure data by name (supports fuzzy matching with accent-insensitive search)

        Args:
            name: Figure name

        Returns:
            Figure data dictionary, or None
        """
        name_lower = name.lower()
        name_no_accent = remove_vietnamese_accents(name_lower)

        for figure in self.figures.get('figures', []):
            figure_name = figure['name']
            figure_name_lower = figure_name.lower()
            figure_name_no_accent = remove_vietnamese_accents(figure_name_lower)

            # Try exact match first
            if figure_name == name:
                return figure

            # Try case-insensitive match
            if figure_name_lower == name_lower:
                return figure

            # Try accent-insensitive match (MAIN FIX)
            if figure_name_no_accent == name_no_accent:
                return figure

            # Try matching with alternative names
            for alt_name in figure.get('alt_names', []):
                alt_lower = alt_name.lower()
                alt_no_accent = remove_vietnamese_accents(alt_lower)

                if alt_lower == name_lower or alt_no_accent == name_no_accent:
                    return figure

            # Try partial match with accents removed
            if name_no_accent in figure_name_no_accent or figure_name_no_accent in name_no_accent:
                return figure

        return None

    def get_event_by_year(self, year: int) -> Optional[Dict]:
        """
        Get event data by year

        Args:
            year: Year

        Returns:
            Event data dictionary, or None
        """
        return self._find_event(year)


def test_detector():
    """Test the input detector"""
    import os

    # Get paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    figures_path = os.path.join(base_dir, 'data', 'historical_figures.json')
    events_path = os.path.join(base_dir, 'data', 'historical_events.json')

    detector = InputDetector(figures_path, events_path)

    # Test cases
    test_cases = [
        "Xin chào Quang Trung",
        "Hãy đưa tôi đến năm 1945",
        "Nguyễn Huệ",
        "1789",
        "Trận Bạch Đằng",
        "Lịch sử Việt Nam như thế nào?",
    ]

    print("Testing Input Detector:")
    print("-" * 50)
    for test in test_cases:
        intent, data = detector.detect(test)
        print(f"Input: {test}")
        print(f"Intent: {intent}")
        if data:
            if intent == 'figure':
                print(f"Figure: {data['name']}")
            elif intent == 'year':
                print(f"Year: {data['year']}")
                if data['event']:
                    print(f"Event: {data['event']['name']}")
        print("-" * 50)


if __name__ == "__main__":
    test_detector()
