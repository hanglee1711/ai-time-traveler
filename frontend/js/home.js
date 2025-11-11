/**
 * VIỆT SỬ KÝ - Home Page JavaScript
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loaded!');
    // initLoadingScreen(); // Removed - Loading screen now handled by inline script in index.html
    // initFloatingFigures(); // Removed - Floating figures deleted from homepage
    // initBackgroundMusic(); // Removed - Now handled by global music-player.js via iframe
    initScrollAnimations();
    initStatCounters();
});

/**
 * [DEPRECATED] Initialize loading screen with interactive click-to-enter
 *
 * This function is no longer used. The loading screen is now handled by
 * inline JavaScript in index.html with a staged flow:
 * 1. Loading bar completes to 100% (3 seconds)
 * 2. CTA button "Bắt đầu hành trình" appears
 * 3. User must click the button to enter
 */
/*
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');

    if (!loadingScreen) {
        console.error('❌ Loading screen not found!');
        return;
    }

    console.log('✨ Loading screen initialized - waiting for user interaction');
    console.log('📍 Loading screen element:', loadingScreen);

    // Hàm ẩn loading screen với animation mượt mà
    const hideLoadingScreen = (e) => {
        console.log('🎯 Click detected!', e);
        console.log('🚀 Starting journey into time...');

        // Thêm class hidden để trigger CSS animation
        loadingScreen.classList.add('hidden');
        console.log('✅ Added "hidden" class');

        // Sau khi animation xong (0.8s), xóa hoàn toàn khỏi DOM
        setTimeout(() => {
            loadingScreen.classList.add('removed');
            console.log('✅ Welcome to Việt Sử Ký!');
        }, 800);
    };

    // Click vào bất kỳ đâu để bắt đầu hành trình
    loadingScreen.addEventListener('click', (e) => {
        console.log('🖱️ Loading screen clicked!', e.target);
        hideLoadingScreen(e);
    });

    // Touch event cho mobile
    loadingScreen.addEventListener('touchstart', (e) => {
        console.log('👆 Loading screen touched!');
        hideLoadingScreen(e);
    });

    // Nhấn phím bất kỳ để bắt đầu
    document.addEventListener('keydown', function skipLoading(e) {
        console.log('⌨️ Key pressed:', e.key);
        hideLoadingScreen(e);
    }, { once: true });

    console.log('✅ Event listeners attached successfully');
}
*/

/**
 * [DEPRECATED] Initialize floating figure avatars with tooltips and interactions
 * Floating figures have been removed from the homepage.
 */
/*
function initFloatingFigures() {
    const figures = document.querySelectorAll('.figure-avatar');

    figures.forEach(figure => {
        // Add click event to redirect to chatbot with selected figure
        figure.addEventListener('click', function() {
            const figureName = this.dataset.name;
            // Store selected figure in localStorage
            localStorage.setItem('selectedFigure', figureName);
            // Redirect to chatbot page
            window.location.href = 'chatbot.html';
        });

        // Add hover effect
        figure.addEventListener('mouseenter', function() {
            const figureName = this.dataset.name;
            showTooltip(this, figureName);
        });

        figure.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}
*/

/**
 * [DEPRECATED] Show tooltip for figure - Cyber-Vietnam Heritage Style
 * Not used anymore since floating figures removed.
 */
/*
function showTooltip(element, text) {
    // Remove existing tooltip
    hideTooltip();

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'figure-tooltip';
    tooltip.textContent = `Trò chuyện với ${text}`;
    tooltip.style.cssText = `
        position: absolute;
        background: linear-gradient(135deg, #FFD700 0%, #00E0FF 100%);
        color: #0b0f19;
        padding: 0.75rem 1.25rem;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5),
                    0 0 30px rgba(0, 224, 255, 0.3);
        animation: tooltipFloat 0.3s ease-out;
    `;

    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + 15}px`;
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
}
*/

// [DEPRECATED] Add tooltip animation - not used anymore
/*
const style = document.createElement('style');
style.textContent = `
    @keyframes tooltipFloat {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
*/

/**
 * [DEPRECATED] Hide tooltip
 * Not used anymore since floating figures removed.
 */
/*
function hideTooltip() {
    const tooltip = document.querySelector('.figure-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}
*/

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize stat counters with animation
 */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

/**
 * Animate counter from 0 to target value
 */
function animateCounter(element) {
    const text = element.textContent;
    const target = parseInt(text.replace(/\D/g, ''));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60 FPS
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 16);
}

/**
 * Add parallax effect to hero background
 */
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');

    if (heroSection) {
        const parallaxSpeed = 0.5;
        heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Settings Modal Functionality
 */
(function initSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsClose = document.getElementById('settings-close');
    const displayNameInput = document.getElementById('settings-display-name');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const updateProfileBtn = document.getElementById('update-profile-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const settingsMessage = document.getElementById('settings-message');

    let selectedAvatar = '👤';

    if (!settingsBtn || !settingsModal) {
        console.log('Settings elements not found');
        return;
    }

    // Open settings modal
    settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSettingsModal();
    });

    // Close settings modal
    settingsClose.addEventListener('click', closeSettingsModal);
    settingsModal.querySelector('.modal-overlay').addEventListener('click', closeSettingsModal);

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal.style.display !== 'none') {
            closeSettingsModal();
        }
    });

    function openSettingsModal() {
        // Load current user data
        const user = Auth.getUser();
        if (user) {
            displayNameInput.value = user.display_name || user.username || '';
            selectedAvatar = user.avatar || '👤';

            // Highlight selected avatar
            avatarOptions.forEach(btn => {
                if (btn.dataset.avatar === selectedAvatar) {
                    btn.style.borderColor = '#FFD700';
                    btn.style.background = 'rgba(255,215,0,0.2)';
                } else {
                    btn.style.borderColor = 'rgba(255,215,0,0.3)';
                    btn.style.background = 'rgba(255,255,255,0.05)';
                }
            });
        }

        settingsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeSettingsModal() {
        settingsModal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Clear password fields
        document.getElementById('settings-current-password').value = '';
        document.getElementById('settings-new-password').value = '';
        document.getElementById('settings-confirm-password').value = '';

        // Hide message
        settingsMessage.style.display = 'none';
    }

    // Avatar selection
    avatarOptions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            selectedAvatar = btn.dataset.avatar;

            // Update UI
            avatarOptions.forEach(b => {
                b.style.borderColor = 'rgba(255,215,0,0.3)';
                b.style.background = 'rgba(255,255,255,0.05)';
            });
            btn.style.borderColor = '#FFD700';
            btn.style.background = 'rgba(255,215,0,0.2)';
        });
    });

    // Update profile
    updateProfileBtn.addEventListener('click', async () => {
        const displayName = displayNameInput.value.trim();

        if (!displayName) {
            showSettingsMessage('Vui lòng nhập tên hiển thị', 'error');
            return;
        }

        updateProfileBtn.disabled = true;
        updateProfileBtn.textContent = '⏳ Đang lưu...';

        try {
            const result = await Auth.updateProfile({
                display_name: displayName,
                avatar: selectedAvatar
            });

            if (result.success) {
                showSettingsMessage('✅ Cập nhật thông tin thành công!', 'success');

                // Update auth UI on all pages
                Auth.initAuthUI();

                // Reload page data after a short delay
                setTimeout(() => {
                    location.reload();
                }, 1500);
            } else {
                showSettingsMessage('❌ ' + (result.error || 'Cập nhật thất bại'), 'error');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            showSettingsMessage('❌ Có lỗi xảy ra, vui lòng thử lại', 'error');
        } finally {
            updateProfileBtn.disabled = false;
            updateProfileBtn.textContent = '💾 Lưu thông tin';
        }
    });

    // Change password
    changePasswordBtn.addEventListener('click', async () => {
        const currentPassword = document.getElementById('settings-current-password').value;
        const newPassword = document.getElementById('settings-new-password').value;
        const confirmPassword = document.getElementById('settings-confirm-password').value;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showSettingsMessage('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showSettingsMessage('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showSettingsMessage('Mật khẩu xác nhận không khớp', 'error');
            return;
        }

        changePasswordBtn.disabled = true;
        changePasswordBtn.textContent = '⏳ Đang đổi...';

        try {
            const result = await Auth.changePassword(currentPassword, newPassword);

            if (result.success) {
                showSettingsMessage('✅ Đổi mật khẩu thành công!', 'success');

                // Clear password fields
                document.getElementById('settings-current-password').value = '';
                document.getElementById('settings-new-password').value = '';
                document.getElementById('settings-confirm-password').value = '';
            } else {
                showSettingsMessage('❌ ' + (result.error || 'Đổi mật khẩu thất bại'), 'error');
            }
        } catch (error) {
            console.error('Change password error:', error);
            showSettingsMessage('❌ Có lỗi xảy ra, vui lòng thử lại', 'error');
        } finally {
            changePasswordBtn.disabled = false;
            changePasswordBtn.textContent = '🔑 Đổi mật khẩu';
        }
    });

    function showSettingsMessage(message, type) {
        settingsMessage.textContent = message;
        settingsMessage.style.display = 'block';

        if (type === 'success') {
            settingsMessage.style.background = 'rgba(46, 213, 115, 0.2)';
            settingsMessage.style.border = '1px solid rgba(46, 213, 115, 0.5)';
            settingsMessage.style.color = '#2ed573';
        } else {
            settingsMessage.style.background = 'rgba(255, 107, 107, 0.2)';
            settingsMessage.style.border = '1px solid rgba(255, 107, 107, 0.5)';
            settingsMessage.style.color = '#ff6b6b';
        }

        // Auto hide after 5 seconds
        setTimeout(() => {
            settingsMessage.style.display = 'none';
        }, 5000);
    }
})();

