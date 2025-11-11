/**
 * Background Music Controller
 * Plays traditional Vietnamese music across all pages
 * Persists state using localStorage
 */

class BackgroundMusicController {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.3; // Default 30% volume
        this.musicFile = '/traditional-music-vietnam.mp3';
        this.shouldAutoPlay = false; // Flag for first-time autoplay

        // Load saved state from localStorage
        this.loadState();

        // Initialize audio element
        this.initAudio();

        // Create UI controls
        this.createMusicControl();

        // DON'T auto-play here - browser will block it
        // Will be triggered by user interaction (loading button click)
    }

    initAudio() {
        // Create audio element
        this.audio = new Audio(this.musicFile);
        this.audio.loop = true; // Loop forever
        this.audio.volume = this.volume;
        this.audio.preload = 'auto';

        // Save playback position periodically
        this.audio.addEventListener('timeupdate', () => {
            if (this.audio.currentTime > 0) {
                localStorage.setItem('musicPosition', this.audio.currentTime);
            }
        });

        // Handle audio errors
        this.audio.addEventListener('error', (e) => {
            console.error('Background music error:', e);
        });

        // Resume from saved position
        const savedPosition = parseFloat(localStorage.getItem('musicPosition') || 0);
        if (savedPosition > 0) {
            this.audio.currentTime = savedPosition;
        }
    }

    loadState() {
        // Load saved settings
        const savedVolume = localStorage.getItem('musicVolume');
        const savedPlaying = localStorage.getItem('musicPlaying');

        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
        }

        if (savedPlaying !== null) {
            this.isPlaying = savedPlaying === 'true';
        }
    }

    saveState() {
        localStorage.setItem('musicVolume', this.volume);
        localStorage.setItem('musicPlaying', this.isPlaying);
    }

    play() {
        if (!this.audio) return;

        const playPromise = this.audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.saveState();
                    this.updateUI();
                })
                .catch(error => {
                    console.log('Autoplay prevented:', error);
                    this.isPlaying = false;
                    this.updateUI();
                });
        }
    }

    pause() {
        if (!this.audio) return;

        this.audio.pause();
        this.isPlaying = false;
        this.saveState();
        this.updateUI();
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    setVolume(value) {
        this.volume = value;
        if (this.audio) {
            this.audio.volume = value;
        }
        this.saveState();
        this.updateUI();
    }

    createMusicControl() {
        // Check if control already exists
        if (document.getElementById('background-music-control')) {
            return;
        }

        // Create floating control container
        const control = document.createElement('div');
        control.id = 'background-music-control';
        control.className = 'music-control';
        control.innerHTML = `
            <div class="music-control-toggle" id="musicToggleBtn" title="Nhạc nền">
                <span class="music-icon">🎵</span>
            </div>
            <div class="music-control-panel" id="musicPanel">
                <div class="music-panel-header">
                    <span>Nhạc nền truyền thống</span>
                    <button class="music-close-btn" id="musicCloseBtn">×</button>
                </div>
                <div class="music-panel-body">
                    <div class="volume-control">
                        <span class="volume-icon">🔊</span>
                        <input type="range"
                               id="musicVolumeSlider"
                               min="0"
                               max="100"
                               value="${this.volume * 100}"
                               class="volume-slider">
                        <span class="volume-value" id="volumeValue">${Math.round(this.volume * 100)}%</span>
                    </div>
                    <button class="music-play-btn" id="musicPlayBtn">
                        <span class="play-icon">${this.isPlaying ? '⏸️' : '▶️'}</span>
                        <span class="play-text">${this.isPlaying ? 'Tạm dừng' : 'Phát nhạc'}</span>
                    </button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .music-control {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }

            .music-control-toggle {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
                font-size: 24px;
            }

            .music-control-toggle:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            }

            .music-control-toggle.playing .music-icon {
                animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .music-control-panel {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 280px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: all 0.3s ease;
            }

            .music-control-panel.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .music-panel-header {
                padding: 12px 16px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                font-weight: 600;
            }

            .music-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.2s;
            }

            .music-close-btn:hover {
                opacity: 1;
            }

            .music-panel-body {
                padding: 16px;
            }

            .volume-control {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
            }

            .volume-icon {
                font-size: 20px;
            }

            .volume-slider {
                flex: 1;
                height: 6px;
                border-radius: 3px;
                background: #e0e0e0;
                outline: none;
                -webkit-appearance: none;
            }

            .volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                cursor: pointer;
            }

            .volume-slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                cursor: pointer;
                border: none;
            }

            .volume-value {
                min-width: 40px;
                text-align: right;
                font-size: 12px;
                color: #666;
                font-weight: 600;
            }

            .music-play-btn {
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: transform 0.2s;
            }

            .music-play-btn:hover {
                transform: translateY(-1px);
            }

            .music-play-btn:active {
                transform: translateY(0);
            }

            @media (max-width: 768px) {
                .music-control {
                    bottom: 80px;
                    right: 16px;
                }

                .music-control-toggle {
                    width: 48px;
                    height: 48px;
                    font-size: 20px;
                }

                .music-control-panel {
                    width: calc(100vw - 32px);
                    right: 0;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(control);

        // Add event listeners
        this.attachEventListeners();

        // Update initial UI state
        this.updateUI();
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('musicToggleBtn');
        const panel = document.getElementById('musicPanel');
        const closeBtn = document.getElementById('musicCloseBtn');
        const playBtn = document.getElementById('musicPlayBtn');
        const volumeSlider = document.getElementById('musicVolumeSlider');

        // Toggle panel
        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('show');
        });

        // Close panel
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.remove('show');
        });

        // Play/Pause
        playBtn.addEventListener('click', () => {
            this.toggle();
        });

        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            this.setVolume(value);
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.music-control')) {
                panel.classList.remove('show');
            }
        });
    }

    updateUI() {
        const toggleBtn = document.getElementById('musicToggleBtn');
        const playBtn = document.getElementById('musicPlayBtn');
        const volumeValue = document.getElementById('volumeValue');

        if (toggleBtn) {
            if (this.isPlaying) {
                toggleBtn.classList.add('playing');
            } else {
                toggleBtn.classList.remove('playing');
            }
        }

        if (playBtn) {
            const icon = playBtn.querySelector('.play-icon');
            const text = playBtn.querySelector('.play-text');
            if (icon) icon.textContent = this.isPlaying ? '⏸️' : '▶️';
            if (text) text.textContent = this.isPlaying ? 'Tạm dừng' : 'Phát nhạc';
        }

        if (volumeValue) {
            volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
        }
    }
}

// Initialize on page load
let musicController = null;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusic);
} else {
    initMusic();
}

function initMusic() {
    // Only initialize once
    if (!musicController) {
        musicController = new BackgroundMusicController();

        // Expose globally for debugging
        window.MusicController = musicController;
    }
}

// Handle page visibility change (keep music playing when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (musicController && musicController.isPlaying && document.hidden) {
        // Keep playing even when tab is hidden
        musicController.audio.play().catch(err => {
            console.log('Could not resume music:', err);
        });
    }
});
