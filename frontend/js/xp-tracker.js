/**
 * VIỆT SỬ KÝ - Simple XP Tracker
 * Đơn giản hóa việc track và cộng XP
 */

const XPTracker = {
    /**
     * Add XP - simple and direct
     */
    async addXP(amount, activityType = 'general', data = {}) {
        console.log(`🎯 XPTracker.addXP called: ${amount} XP for ${activityType}`);

        // Show notification immediately
        this.showXPNotification(amount);

        // Try to sync with server if logged in
        const token = Auth.getToken();
        if (token) {
            try {
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

                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ XP synced with server:', result);

                    // Update status bar with server data
                    if (window.updateStatusBar) {
                        await updateStatusBar();
                    }

                    if (result.leveled_up) {
                        this.showLevelUpNotification(result.level);
                    }
                    return result;
                } else {
                    console.warn('❌ Failed to sync XP with server');
                }
            } catch (error) {
                console.error('❌ XP sync error:', error);
            }
        }

        // Fallback to local storage
        const userData = UserData.get();
        userData.xp += amount;
        const newLevel = Math.floor(userData.xp / 100) + 1;
        if (newLevel > userData.level) {
            userData.level = newLevel;
            this.showLevelUpNotification(newLevel);
        }
        UserData.save(userData);

        // Update status bar
        if (window.updateStatusBar) {
            await updateStatusBar();
        }
    },

    /**
     * Show XP notification
     */
    showXPNotification(amount) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.innerHTML = `
            <div class="xp-icon">✨</div>
            <div class="xp-amount">+${amount} XP</div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #000;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1.1rem;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
            animation: xpSlideIn 0.5s ease-out;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'xpSlideOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    },

    /**
     * Show level up notification
     */
    showLevelUpNotification(level) {
        const notification = document.createElement('div');
        notification.className = 'levelup-notification';
        notification.innerHTML = `
            <div class="levelup-icon">🎉</div>
            <div class="levelup-text">
                <div style="font-size: 1.2rem; font-weight: 800;">LEVEL UP!</div>
                <div style="font-size: 1rem;">Level ${level}</div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);
            color: #FFF;
            padding: 2rem 3rem;
            border-radius: 20px;
            font-weight: 700;
            z-index: 10002;
            box-shadow: 0 8px 40px rgba(255, 20, 147, 0.6);
            animation: levelUpBounce 0.6s ease-out;
            display: flex;
            align-items: center;
            gap: 1rem;
            text-align: center;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Add CSS animations
const xpAnimationStyles = document.createElement('style');
xpAnimationStyles.textContent = `
    @keyframes xpSlideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes xpSlideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes levelUpBounce {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(xpAnimationStyles);

// Make it globally available
window.XPTracker = XPTracker;
