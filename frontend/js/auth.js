/**
 * VIỆT SỬ KÝ - Authentication Handler
 * Handles user login, registration, and authentication state
 */

// Detect if running from file:// or localhost
const API_BASE_URL = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '')
    ? 'http://localhost:5000/api'
    : '/api';

const Auth = {
    /**
     * API Base URL
     */
    API_BASE_URL: API_BASE_URL,

    /**
     * Get authentication token from localStorage
     */
    getToken() {
        return localStorage.getItem('vietsuky_token');
    },

    /**
     * Set authentication token in localStorage
     */
    setToken(token) {
        localStorage.setItem('vietsuky_token', token);
    },

    /**
     * Remove authentication token from localStorage
     */
    removeToken() {
        localStorage.removeItem('vietsuky_token');
        localStorage.removeItem('vietsuky_user');
    },

    /**
     * Get current user data from localStorage
     */
    getUser() {
        const userStr = localStorage.getItem('vietsuky_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Set current user data in localStorage
     */
    setUser(user) {
        localStorage.setItem('vietsuky_user', JSON.stringify(user));
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!this.getToken();
    },

    /**
     * Register new user
     * @param {string} username - Username
     * @param {string} email - Email address
     * @param {string} password - Password
     * @param {string} displayName - Display name (optional)
     * @returns {Promise<{success: boolean, error?: string, user?: object, token?: string}>}
     */
    async register(username, email, password, displayName = '') {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    display_name: displayName
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and user data
                this.setToken(data.token);
                this.setUser(data.user);

                return {
                    success: true,
                    user: data.user,
                    token: data.token
                };
            } else {
                return {
                    success: false,
                    error: data.error || 'Đăng ký thất bại'
                };
            }
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                error: 'Không thể kết nối đến máy chủ'
            };
        }
    },

    /**
     * Login user
     * @param {string} username - Username or email
     * @param {string} password - Password
     * @returns {Promise<{success: boolean, error?: string, user?: object, token?: string}>}
     */
    async login(username, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and user data
                this.setToken(data.token);
                this.setUser(data.user);

                return {
                    success: true,
                    user: data.user,
                    token: data.token
                };
            } else {
                return {
                    success: false,
                    error: data.error || 'Đăng nhập thất bại'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Không thể kết nối đến máy chủ'
            };
        }
    },

    /**
     * Logout user
     */
    logout() {
        this.removeToken();
        window.location.href = 'login.html';
    },

    /**
     * Get current user profile from server
     * @returns {Promise<{success: boolean, error?: string, user?: object, stats?: object, achievements?: array}>}
     */
    async getCurrentUser() {
        const token = this.getToken();
        if (!token) {
            return {
                success: false,
                error: 'Chưa đăng nhập'
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Update local user data
                this.setUser(data.user);

                return {
                    success: true,
                    user: data.user,
                    stats: data.stats,
                    achievements: data.achievements
                };
            } else {
                // Token might be invalid
                if (response.status === 401) {
                    this.removeToken();
                }
                return {
                    success: false,
                    error: data.error || 'Không thể lấy thông tin người dùng'
                };
            }
        } catch (error) {
            console.error('Get current user error:', error);
            return {
                success: false,
                error: 'Không thể kết nối đến máy chủ'
            };
        }
    },

    /**
     * Update user profile
     * @param {object} updates - Profile updates {display_name?, avatar?}
     * @returns {Promise<{success: boolean, error?: string, user?: object}>}
     */
    async updateProfile(updates) {
        const token = this.getToken();
        if (!token) {
            return {
                success: false,
                error: 'Chưa đăng nhập'
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (response.ok) {
                // Update local user data
                this.setUser(data.user);

                return {
                    success: true,
                    user: data.user
                };
            } else {
                return {
                    success: false,
                    error: data.error || 'Không thể cập nhật thông tin'
                };
            }
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                success: false,
                error: 'Không thể kết nối đến máy chủ'
            };
        }
    },

    /**
     * Change password
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async changePassword(currentPassword, newPassword) {
        const token = this.getToken();
        if (!token) {
            return {
                success: false,
                error: 'Chưa đăng nhập'
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true
                };
            } else {
                return {
                    success: false,
                    error: data.error || 'Không thể đổi mật khẩu'
                };
            }
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                error: 'Không thể kết nối đến máy chủ'
            };
        }
    },

    /**
     * Make an authenticated API request
     * @param {string} endpoint - API endpoint (without base URL)
     * @param {object} options - Fetch options
     * @returns {Promise<Response>}
     */
    async authenticatedFetch(endpoint, options = {}) {
        const token = this.getToken();

        const headers = {
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
    },

    /**
     * Require authentication - redirect to login if not logged in
     * @param {string} redirectUrl - URL to redirect to after login (optional)
     */
    requireAuth(redirectUrl = null) {
        if (!this.isLoggedIn()) {
            const redirect = redirectUrl || window.location.pathname;
            window.location.href = `login.html?redirect=${encodeURIComponent(redirect)}`;
            return false;
        }
        return true;
    },

    /**
     * Initialize auth UI - show/hide elements based on auth state
     */
    async initAuthUI() {
        const isLoggedIn = this.isLoggedIn();
        let user = this.getUser();

        // If logged in but no user data, fetch from server
        if (isLoggedIn && !user) {
            const result = await this.getCurrentUser();
            if (result.success) {
                user = result.user;
            }
        }

        // Show/hide auth buttons
        const loginButtons = document.querySelectorAll('.auth-login-btn');
        const registerButtons = document.querySelectorAll('.auth-register-btn');
        const logoutButtons = document.querySelectorAll('.auth-logout-btn');
        const userInfo = document.querySelectorAll('.auth-user-info');
        const userDropdowns = document.querySelectorAll('.auth-user-dropdown');

        if (isLoggedIn) {
            loginButtons.forEach(btn => btn.style.display = 'none');
            registerButtons.forEach(btn => btn.style.display = 'none');
            logoutButtons.forEach(btn => btn.style.display = 'block');
            userInfo.forEach(el => {
                el.style.display = 'block';
                // Update user info
                const nameEl = el.querySelector('.auth-user-name');
                if (nameEl && user) {
                    nameEl.textContent = user.display_name || user.username;
                }
                const avatarEl = el.querySelector('.auth-user-avatar');
                if (avatarEl && user) {
                    avatarEl.textContent = user.avatar || '👤';
                }
            });

            // Show user dropdown
            userDropdowns.forEach(dropdown => {
                dropdown.style.display = 'block';
                // Update user name in dropdown
                const nameEl = dropdown.querySelector('.auth-user-name');
                if (nameEl && user) {
                    nameEl.textContent = user.display_name || user.username;
                }
            });
        } else {
            loginButtons.forEach(btn => btn.style.display = 'block');
            registerButtons.forEach(btn => btn.style.display = 'block');
            logoutButtons.forEach(btn => btn.style.display = 'none');
            userInfo.forEach(el => el.style.display = 'none');
            userDropdowns.forEach(dropdown => dropdown.style.display = 'none');
        }

        // Add logout event listeners
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });

        // Setup dropdown functionality
        this.setupDropdowns();
    },

    /**
     * Setup dropdown menu functionality
     */
    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.auth-user-dropdown');

        dropdowns.forEach(dropdown => {
            const btn = dropdown.querySelector('.user-dropdown-btn');
            const menu = dropdown.querySelector('.user-dropdown-menu');
            const logoutLink = dropdown.querySelector('.auth-logout-link');

            if (!btn || !menu) return;

            // Toggle dropdown on button click
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = menu.classList.contains('show');

                // Close all other dropdowns
                document.querySelectorAll('.user-dropdown-menu').forEach(m => {
                    m.classList.remove('show');
                });
                document.querySelectorAll('.user-dropdown-btn').forEach(b => {
                    b.classList.remove('active');
                });

                // Toggle current dropdown
                if (!isOpen) {
                    menu.classList.add('show');
                    btn.classList.add('active');
                } else {
                    menu.classList.remove('show');
                    btn.classList.remove('active');
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    menu.classList.remove('show');
                    btn.classList.remove('active');
                }
            });

            // Handle logout link
            if (logoutLink) {
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        });
    }
};

// Auto-initialize auth UI on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        Auth.initAuthUI();
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
