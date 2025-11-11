/**
 * Chatbot Performance Enhancements
 * Adds caching, retry logic, and smooth UX improvements
 */

// Response cache để tránh gọi API trùng lặp
const ChatCache = {
    cache: new Map(),
    maxSize: 100,
    ttl: 3600000, // 1 hour

    // Generate cache key
    generateKey(message, figure) {
        return `${figure || 'general'}:${message.toLowerCase().trim()}`;
    },

    // Get cached response
    get(message, figure) {
        const key = this.generateKey(message, figure);
        const cached = this.cache.get(key);

        if (!cached) return null;

        // Check if expired
        if (Date.now() - cached.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        console.log('💾 Using cached response for:', message.substring(0, 30));
        return cached.response;
    },

    // Set cache
    set(message, figure, response) {
        const key = this.generateKey(message, figure);

        // Limit cache size
        if (this.cache.size >= this.maxSize) {
            // Remove oldest entry
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            response: response,
            timestamp: Date.now()
        });
    },

    // Clear cache
    clear() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }
};

// Retry mechanism
const RetryManager = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second

    async retry(fn, retries = this.maxRetries) {
        try {
            return await fn();
        } catch (error) {
            if (retries > 0) {
                console.log(`🔄 Retrying... (${this.maxRetries - retries + 1}/${this.maxRetries})`);
                await this.sleep(this.retryDelay);
                return this.retry(fn, retries - 1);
            }
            throw error;
        }
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Activity tracker để track user journey
const ActivityTracker = {
    async trackActivity(type, data = {}) {
        // Only track if user is logged in
        if (!Auth || !Auth.isLoggedIn()) {
            return;
        }

        try {
            const response = await Auth.authenticatedFetch('/stats/track-activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    activity_type: type,
                    data: data
                })
            });

            if (!response.ok) {
                console.warn('Failed to track activity:', type);
            } else {
                const result = await response.json();
                // Update user stats in UI if needed
                if (result.xp_earned > 0) {
                    this.showXPNotification(result.xp_earned, result.leveled_up);
                }
            }
        } catch (error) {
            console.error('Activity tracking error:', error);
        }
    },

    showXPNotification(xp, leveledUp) {
        if (typeof showNotification !== 'function') return;

        let message = `+${xp} XP`;
        if (leveledUp) {
            message += ' 🎉 Level Up!';
        }

        showNotification(message, 'success');
    }
};

// Enhanced API call with caching and retry
const EnhancedAPI = {
    async chat(message, figure) {
        // Check cache first
        const cached = ChatCache.get(message, figure);
        if (cached) {
            // Track cache hit
            ActivityTracker.trackActivity('chat', {
                figure: figure,
                cached: true
            });
            return cached;
        }

        // Call API with retry
        const response = await RetryManager.retry(async () => {
            const res = await API.chat(message, figure);
            if (!res || !res.message) {
                throw new Error('Empty response from API');
            }
            return res;
        });

        // Cache successful response
        if (response && response.message) {
            ChatCache.set(message, figure, response);
        }

        // Track activity
        ActivityTracker.trackActivity('chat', {
            figure: figure,
            message_length: message.length
        });

        return response;
    }
};

// Typing animation for smoother response display
const TypingAnimation = {
    async typeMessage(text, element, speed = 20) {
        element.textContent = '';
        element.style.opacity = '0';

        // Fade in
        setTimeout(() => {
            element.style.transition = 'opacity 0.3s';
            element.style.opacity = '1';
        }, 100);

        // Type character by character (for short messages)
        if (text.length < 100) {
            for (let i = 0; i < text.length; i++) {
                element.textContent += text[i];
                await this.sleep(speed);
            }
        } else {
            // For long messages, just show with fade-in
            element.textContent = text;
        }
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Loading state manager
const LoadingManager = {
    activeLoaders: new Set(),

    show(id = 'default') {
        this.activeLoaders.add(id);
        document.body.classList.add('loading');

        // Disable interactions
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');

        if (chatInput) chatInput.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
    },

    hide(id = 'default') {
        this.activeLoaders.delete(id);

        // Only remove loading if no active loaders
        if (this.activeLoaders.size === 0) {
            document.body.classList.remove('loading');

            // Re-enable interactions
            const chatInput = document.getElementById('chat-input');
            const sendBtn = document.getElementById('send-btn');

            if (chatInput) chatInput.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
        }
    }
};

// Error handler with user-friendly messages
const ErrorHandler = {
    handle(error, context = '') {
        console.error(`Error in ${context}:`, error);

        let userMessage = 'Đã xảy ra lỗi. ';

        if (error.message.includes('fetch') || error.message.includes('network')) {
            userMessage += 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.';
        } else if (error.message.includes('timeout')) {
            userMessage += 'Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
            userMessage += 'Đã đạt giới hạn API. Vui lòng thử lại sau.';
        } else {
            userMessage += 'Vui lòng thử lại sau giây lát.';
        }

        if (typeof showNotification === 'function') {
            showNotification(userMessage, 'error');
        }

        return userMessage;
    }
};

// Debounce utility for search/input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitor
const PerformanceMonitor = {
    metrics: {
        apiCalls: 0,
        cacheHits: 0,
        averageResponseTime: 0,
        errors: 0
    },

    recordAPICall(duration) {
        this.metrics.apiCalls++;
        this.metrics.averageResponseTime =
            (this.metrics.averageResponseTime * (this.metrics.apiCalls - 1) + duration) / this.metrics.apiCalls;
    },

    recordCacheHit() {
        this.metrics.cacheHits++;
    },

    recordError() {
        this.metrics.errors++;
    },

    getStats() {
        const cacheHitRate = this.metrics.apiCalls > 0
            ? (this.metrics.cacheHits / (this.metrics.apiCalls + this.metrics.cacheHits) * 100).toFixed(1)
            : 0;

        return {
            ...this.metrics,
            cacheHitRate: `${cacheHitRate}%`
        };
    },

    logStats() {
        console.table(this.getStats());
    }
};

// Export enhancements
window.ChatEnhancements = {
    ChatCache,
    RetryManager,
    ActivityTracker,
    EnhancedAPI,
    TypingAnimation,
    LoadingManager,
    ErrorHandler,
    PerformanceMonitor,
    debounce
};

console.log('✨ Chatbot enhancements loaded');
