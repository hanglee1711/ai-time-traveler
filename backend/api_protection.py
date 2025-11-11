"""
API Protection System - Rate limiting, caching, and key rotation
"""
import time
import hashlib
import json
from datetime import datetime, timedelta
from typing import Optional, Dict
from functools import lru_cache
import os

class APIProtection:
    """Protect API from overuse with multiple strategies"""

    def __init__(self):
        # Rate limiting: Track requests per IP
        self.request_tracker = {}  # {ip: [(timestamp, count), ...]}
        self.max_requests_per_minute = 10  # Max 10 requests per minute per IP
        self.max_requests_per_hour = 50    # Max 50 requests per hour per IP

        # Caching: Store common responses
        self.response_cache = {}  # {cache_key: (response, timestamp)}
        self.cache_ttl = 3600  # Cache for 1 hour

        # API Keys rotation
        self.api_keys = self._load_api_keys()
        self.current_key_index = 0
        self.key_usage = {i: 0 for i in range(len(self.api_keys))}

        # Usage tracking
        self.total_requests = 0
        self.cache_hits = 0
        self.cache_misses = 0

    def _load_api_keys(self) -> list:
        """Load API keys from environment or file"""
        keys = []

        # Load from .env
        main_key = os.getenv("GEMINI_API_KEY")
        if main_key:
            keys.append(main_key)

        # Load backup keys from .env (GEMINI_API_KEY_2, GEMINI_API_KEY_3, etc)
        for i in range(2, 10):
            backup_key = os.getenv(f"GEMINI_API_KEY_{i}")
            if backup_key:
                keys.append(backup_key)

        if not keys:
            raise ValueError("No API keys found!")

        print(f"[API Protection] Loaded {len(keys)} API key(s)")
        return keys

    def check_rate_limit(self, ip_address: str) -> tuple[bool, Optional[str]]:
        """
        Check if IP has exceeded rate limits
        Returns: (is_allowed, error_message)
        """
        current_time = time.time()

        # Clean old entries
        if ip_address in self.request_tracker:
            self.request_tracker[ip_address] = [
                (ts, count) for ts, count in self.request_tracker[ip_address]
                if current_time - ts < 3600  # Keep last hour
            ]
        else:
            self.request_tracker[ip_address] = []

        # Check per-minute limit
        recent_minute = [
            count for ts, count in self.request_tracker[ip_address]
            if current_time - ts < 60
        ]
        if sum(recent_minute) >= self.max_requests_per_minute:
            return False, "Bạn đã gửi quá nhiều tin nhắn. Vui lòng đợi 1 phút."

        # Check per-hour limit
        recent_hour = [
            count for ts, count in self.request_tracker[ip_address]
            if current_time - ts < 3600
        ]
        if sum(recent_hour) >= self.max_requests_per_hour:
            return False, "Bạn đã đạt giới hạn tin nhắn trong giờ. Vui lòng thử lại sau."

        # Record this request
        self.request_tracker[ip_address].append((current_time, 1))
        return True, None

    def get_cache_key(self, figure_name: str, user_message: str) -> str:
        """Generate cache key from figure and message"""
        # Normalize message (lowercase, strip)
        normalized = user_message.lower().strip()
        combined = f"{figure_name}:{normalized}"
        return hashlib.md5(combined.encode()).hexdigest()

    def get_cached_response(self, figure_name: str, user_message: str) -> Optional[str]:
        """Get cached response if available and fresh"""
        cache_key = self.get_cache_key(figure_name, user_message)

        if cache_key in self.response_cache:
            response, timestamp = self.response_cache[cache_key]

            # Check if cache is still fresh
            if time.time() - timestamp < self.cache_ttl:
                self.cache_hits += 1
                print(f"[Cache HIT] {cache_key[:8]}... (saved API call)")
                return response
            else:
                # Cache expired, remove it
                del self.response_cache[cache_key]

        self.cache_misses += 1
        return None

    def cache_response(self, figure_name: str, user_message: str, response: str):
        """Cache a response for future use"""
        cache_key = self.get_cache_key(figure_name, user_message)
        self.response_cache[cache_key] = (response, time.time())

        # Limit cache size (keep only 1000 most recent)
        if len(self.response_cache) > 1000:
            # Remove oldest 100 entries
            sorted_keys = sorted(
                self.response_cache.keys(),
                key=lambda k: self.response_cache[k][1]
            )
            for key in sorted_keys[:100]:
                del self.response_cache[key]

    def get_next_api_key(self) -> str:
        """Get next API key in rotation"""
        # Simple round-robin
        key = self.api_keys[self.current_key_index]
        self.key_usage[self.current_key_index] += 1

        # Move to next key
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)

        return key

    def handle_quota_exceeded(self) -> str:
        """Return friendly message when quota exceeded"""
        return """Xin lỗi, hệ thống đang quá tải do nhiều người dùng.

Vui lòng thử lại sau 1-2 phút, hoặc liên hệ admin để được hỗ trợ.

Cảm ơn bạn đã kiên nhẫn! 🙏"""

    def get_stats(self) -> dict:
        """Get usage statistics"""
        cache_hit_rate = (
            self.cache_hits / (self.cache_hits + self.cache_misses) * 100
            if (self.cache_hits + self.cache_misses) > 0
            else 0
        )

        return {
            "total_requests": self.total_requests,
            "cache_hits": self.cache_hits,
            "cache_misses": self.cache_misses,
            "cache_hit_rate": f"{cache_hit_rate:.1f}%",
            "cache_size": len(self.response_cache),
            "active_ips": len(self.request_tracker),
            "api_keys_count": len(self.api_keys),
            "key_usage": self.key_usage
        }

    def record_request(self):
        """Record a new request"""
        self.total_requests += 1


# Global instance
_protection = None

def get_protection() -> APIProtection:
    """Get or create global protection instance"""
    global _protection
    if _protection is None:
        _protection = APIProtection()
    return _protection
