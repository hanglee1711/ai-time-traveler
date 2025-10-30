"""
Input Detector Module - Detect user intent and extract information
"""
import re
import json
from typing import Dict, Optional, Tuple


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

        # Check for historical figure
        figure = self._detect_figure(user_input)
        if figure:
            return 'figure', figure

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
        Get figure data by exact name

        Args:
            name: Figure name

        Returns:
            Figure data dictionary, or None
        """
        for figure in self.figures.get('figures', []):
            if figure['name'] == name:
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
