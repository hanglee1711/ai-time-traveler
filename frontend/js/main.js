/**
 * VIỆT KÝ SỬ - Main JavaScript File
 * Common functions and utilities for all pages
 */

// API Configuration - Auto-detect based on environment
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'  // Local development
    : window.location.origin + '/api';  // Production (same domain)

// User data management
const UserData = {
    // Get user data from localStorage
    get: function() {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : this.getDefault();
    },

    // Get default user data structure
    getDefault: function() {
        return {
            username: 'Guest',
            level: 1,
            xp: 0,
            badges: [],
            visitedFigures: [],
            exploredEvents: [],
            completedQuests: [],
            quizScores: []
        };
    },

    // Save user data to localStorage
    save: function(data) {
        localStorage.setItem('userData', JSON.stringify(data));
    },

    // Add XP and check for level up
    addXP: async function(amount, activityType = 'general') {
        // Try to update via API if user is logged in
        const token = Auth.getToken();
        if (token) {
            try {
                const response = await API.addXP(amount, activityType);
                if (response) {
                    // Update local data with server data
                    const data = this.get();
                    data.xp = response.current_xp;
                    data.level = response.level;
                    this.save(data);

                    if (response.leveled_up) {
                        this.showLevelUpNotification(response.level);
                    }
                    return data;
                }
            } catch (error) {
                console.log('Failed to sync XP with server, using local storage', error);
            }
        }

        // Fallback to local storage
        const data = this.get();
        data.xp += amount;

        // Check for level up (100 XP per level)
        const newLevel = Math.floor(data.xp / 100) + 1;
        if (newLevel > data.level) {
            data.level = newLevel;
            this.showLevelUpNotification(newLevel);
        }

        this.save(data);
        return data;
    },

    // Add badge
    addBadge: function(badgeName) {
        const data = this.get();
        if (!data.badges.includes(badgeName)) {
            data.badges.push(badgeName);
            this.save(data);
            this.showBadgeNotification(badgeName);
        }
    },

    // Mark figure as visited
    visitFigure: async function(figureName) {
        const data = this.get();
        if (!data.visitedFigures.includes(figureName)) {
            data.visitedFigures.push(figureName);

            // Track activity via API if logged in
            const token = Auth.getToken();
            if (token) {
                try {
                    await API.trackActivity('chat', { figure: figureName });
                } catch (error) {
                    console.log('Failed to track activity with server', error);
                    await this.addXP(10, 'chat');
                }
            } else {
                await this.addXP(10, 'chat');
            }

            this.save(data);
        }
    },

    // Mark event as explored
    exploreEvent: async function(eventName, year = null) {
        const data = this.get();
        if (!data.exploredEvents.includes(eventName)) {
            data.exploredEvents.push(eventName);

            // Track activity via API if logged in
            const token = Auth.getToken();
            if (token) {
                try {
                    await API.trackActivity('timeline', { year: year });
                } catch (error) {
                    console.log('Failed to track activity with server', error);
                    await this.addXP(5, 'timeline');
                }
            } else {
                await this.addXP(5, 'timeline');
            }

            this.save(data);
        }
    },

    // Show level up notification
    showLevelUpNotification: function(level) {
        showNotification(`🎉 Chúc mừng! Bạn đã lên cấp ${level}!`, 'success');
    },

    // Show badge notification
    showBadgeNotification: function(badgeName) {
        showNotification(`🏆 Nhận huy hiệu mới: ${badgeName}!`, 'success');
    }
};

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * API Helper functions
 */
const API = {
    // Send chat message
    chat: async function(message, figureName = null, year = null) {
        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    figure: figureName,
                    year: year,
                    provider: 'gemini'  // Always use Gemini AI for roleplay
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Chat API error:', error);
            throw error;
        }
    },

    // Get historical figures
    getFigures: async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/figures`);
            if (!response.ok) {
                throw new Error('API request failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Get figures API error:', error);
            throw error;
        }
    },

    // Get timeline events
    getTimelineEvents: async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/timeline`);
            if (!response.ok) {
                throw new Error('API request failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Get timeline API error:', error);
            throw error;
        }
    },

    // Generate quiz
    generateQuiz: async function(topic) {
        try {
            const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic: topic })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Generate quiz API error:', error);
            throw error;
        }
    },

    // Add XP
    addXP: async function(amount, activityType = 'general') {
        try {
            const token = Auth.getToken();
            if (!token) return null;

            const response = await fetch(`${API_BASE_URL}/stats/add-xp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: amount,
                    activity_type: activityType
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Add XP API error:', error);
            throw error;
        }
    },

    // Track activity
    trackActivity: async function(activityType, data) {
        try {
            const token = Auth.getToken();
            if (!token) return null;

            const response = await fetch(`${API_BASE_URL}/stats/track-activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    activity_type: activityType,
                    data: data
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const result = await response.json();

            // Show XP notification if earned
            if (result.xp_earned > 0) {
                showNotification(`+${result.xp_earned} XP`, 'success');
                if (result.leveled_up) {
                    UserData.showLevelUpNotification(result.level);
                }
            }

            return result;
        } catch (error) {
            console.error('Track activity API error:', error);
            throw error;
        }
    },

    // Get user stats
    getMyStats: async function() {
        try {
            const token = Auth.getToken();
            if (!token) return null;

            const response = await fetch(`${API_BASE_URL}/stats/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Get stats API error:', error);
            throw error;
        }
    }
};

/**
 * Update navigation active state
 */
function updateNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Format date
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Show loading spinner
 */
function showLoading(container) {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.cssText = `
        margin: 2rem auto;
        display: block;
    `;
    container.appendChild(spinner);
    return spinner;
}

/**
 * Hide loading spinner
 */
function hideLoading(spinner) {
    if (spinner && spinner.parentElement) {
        spinner.remove();
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Debounce function
 */
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

/**
 * Initialize common features on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Update navigation
    updateNavigation();

    // Add animations to elements
    addScrollAnimations();

    // Initialize user data display if status bar exists
    updateStatusBar();

    // Initialize navbar scroll effect
    initNavbarScroll();
});

/**
 * Navbar scroll effect - thay đổi khi scroll
 */
function initNavbarScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10));
}

/**
 * Add scroll animations
 */
function addScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateX(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        if (el.classList.contains('slide-in-left')) {
            el.style.transform = 'translateX(-50px)';
        } else if (el.classList.contains('slide-in-right')) {
            el.style.transform = 'translateX(50px)';
        } else {
            el.style.transform = 'translateY(20px)';
        }
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

/**
 * Update status bar with user data
 */
async function updateStatusBar() {
    const statusBar = document.querySelector('.status-bar');
    if (!statusBar) return;

    const token = Auth.getToken();
    let userData = UserData.get();
    let badgeCount = userData.badges.length;

    // Try to get data from server if logged in
    if (token) {
        try {
            const stats = await API.getMyStats();
            if (stats && stats.user) {
                userData.level = stats.user.level;
                userData.xp = stats.user.xp;
                badgeCount = stats.achievements ? stats.achievements.length : 0;

                // Update local storage with server data
                UserData.save(userData);
            }
        } catch (error) {
            console.log('Failed to fetch user stats from server', error);
        }
    }

    statusBar.innerHTML = `
        <div class="status-item">
            <span class="status-icon">⭐</span>
            <span>Level ${userData.level}</span>
        </div>
        <div class="status-item">
            <span class="status-icon">💫</span>
            <span>${userData.xp} XP</span>
        </div>
        <div class="status-item">
            <span class="status-icon">🏆</span>
            <span>${badgeCount} Huy hiệu</span>
        </div>
    `;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
