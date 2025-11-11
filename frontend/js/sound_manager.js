/**
 * VIỆT KÝ SỬ - Sound Manager
 * Manages all game audio: BGM, SFX, voice
 */

class SoundManager {
    constructor() {
        this.sounds = {};
        this.bgm = null;
        this.volume = {
            master: 0.7,
            bgm: 0.5,
            sfx: 0.8,
            voice: 0.9
        };
        this.muted = false;
        this.initialized = false;
    }

    /**
     * Initialize sound system
     */
    async initialize() {
        if (this.initialized) return;

        // Load volume settings from localStorage
        const savedVolume = localStorage.getItem('sound_volume');
        if (savedVolume) {
            this.volume = JSON.parse(savedVolume);
        }

        const savedMuted = localStorage.getItem('sound_muted');
        if (savedMuted) {
            this.muted = savedMuted === 'true';
        }

        console.log('Sound Manager initialized', {
            volume: this.volume,
            muted: this.muted
        });

        this.initialized = true;
    }

    /**
     * Create audio element
     */
    createAudio(id, src, type = 'sfx', loop = false) {
        const audio = new Audio();
        audio.src = src;
        audio.loop = loop;
        audio.volume = this.volume[type] * this.volume.master;
        audio.muted = this.muted;

        this.sounds[id] = {
            audio,
            type,
            playing: false
        };

        // Handle audio errors gracefully
        audio.addEventListener('error', (e) => {
            console.warn(`Failed to load audio: ${id} (${src})`, e);
        });

        return audio;
    }

    /**
     * Play sound effect
     */
    playSFX(id, src = null) {
        if (this.muted) return;

        try {
            // If audio doesn't exist, create it
            if (!this.sounds[id] && src) {
                this.createAudio(id, src, 'sfx', false);
            }

            if (this.sounds[id]) {
                const { audio } = this.sounds[id];
                audio.currentTime = 0; // Reset to start
                audio.volume = this.volume.sfx * this.volume.master;
                audio.play().catch(e => {
                    console.warn(`Failed to play SFX: ${id}`, e);
                });
            }
        } catch (e) {
            console.warn(`Error playing SFX: ${id}`, e);
        }
    }

    /**
     * Play background music
     */
    playBGM(id, src = null) {
        if (this.muted) return;

        try {
            // Stop current BGM if playing
            if (this.bgm && this.bgm !== id) {
                this.stopBGM();
            }

            // Create or get BGM
            if (!this.sounds[id] && src) {
                this.createAudio(id, src, 'bgm', true);
            }

            if (this.sounds[id]) {
                const { audio } = this.sounds[id];
                audio.volume = this.volume.bgm * this.volume.master;
                audio.play().catch(e => {
                    console.warn(`Failed to play BGM: ${id}`, e);
                });
                this.bgm = id;
                this.sounds[id].playing = true;
            }
        } catch (e) {
            console.warn(`Error playing BGM: ${id}`, e);
        }
    }

    /**
     * Stop background music
     */
    stopBGM() {
        if (this.bgm && this.sounds[this.bgm]) {
            const { audio } = this.sounds[this.bgm];
            audio.pause();
            audio.currentTime = 0;
            this.sounds[this.bgm].playing = false;
            this.bgm = null;
        }
    }

    /**
     * Fade out BGM
     */
    fadeBGM(duration = 1000) {
        if (!this.bgm || !this.sounds[this.bgm]) return;

        const { audio } = this.sounds[this.bgm];
        const startVolume = audio.volume;
        const fadeStep = startVolume / (duration / 50);

        const fadeInterval = setInterval(() => {
            if (audio.volume > fadeStep) {
                audio.volume -= fadeStep;
            } else {
                audio.volume = 0;
                this.stopBGM();
                clearInterval(fadeInterval);
            }
        }, 50);
    }

    /**
     * Play voice line
     */
    playVoice(id, src = null) {
        if (this.muted) return;

        try {
            if (!this.sounds[id] && src) {
                this.createAudio(id, src, 'voice', false);
            }

            if (this.sounds[id]) {
                const { audio } = this.sounds[id];
                audio.currentTime = 0;
                audio.volume = this.volume.voice * this.volume.master;
                audio.play().catch(e => {
                    console.warn(`Failed to play voice: ${id}`, e);
                });
            }
        } catch (e) {
            console.warn(`Error playing voice: ${id}`, e);
        }
    }

    /**
     * Set volume for a category
     */
    setVolume(type, value) {
        this.volume[type] = Math.max(0, Math.min(1, value));

        // Update all sounds of this type
        Object.entries(this.sounds).forEach(([id, sound]) => {
            if (sound.type === type || type === 'master') {
                sound.audio.volume = this.volume[sound.type] * this.volume.master;
            }
        });

        // Save to localStorage
        localStorage.setItem('sound_volume', JSON.stringify(this.volume));
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.muted = !this.muted;

        // Update all audio elements
        Object.values(this.sounds).forEach(sound => {
            sound.audio.muted = this.muted;
        });

        // Save to localStorage
        localStorage.setItem('sound_muted', this.muted.toString());

        return this.muted;
    }

    /**
     * Stop all sounds
     */
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.audio.pause();
            sound.audio.currentTime = 0;
            sound.playing = false;
        });
        this.bgm = null;
    }

    /**
     * Preload sound
     */
    preload(id, src, type = 'sfx') {
        if (!this.sounds[id]) {
            this.createAudio(id, src, type, false);
        }
    }

    /**
     * Preload multiple sounds
     */
    preloadBatch(soundList) {
        soundList.forEach(({ id, src, type }) => {
            this.preload(id, src, type);
        });
    }
}

/**
 * Game-specific sound helper
 */
class QuizBattleSounds {
    constructor(soundManager) {
        this.sm = soundManager;
        this.useFallback = true; // Use text-to-speech fallback if no audio files
    }

    /**
     * Initialize battle sounds
     */
    async init() {
        await this.sm.initialize();

        // Preload common sounds (if files exist, otherwise use fallback)
        if (this.useFallback) {
            console.log('Using fallback sounds (browser beeps + TTS)');
        }
    }

    // ==================== CARD SOUNDS ====================

    playCardDraw() {
        this.playBeep(800, 100, 0.1);
    }

    playCardPlay() {
        this.playBeep(1200, 150, 0.15);
    }

    playCardKnowledge() {
        this.playBeep(1500, 200, 0.12);
    }

    playCardAttack() {
        this.playBeep(400, 300, 0.2);
    }

    playCardDefense() {
        this.playBeep(600, 250, 0.15);
    }

    playCardSpecial() {
        this.playBeep([800, 1200, 1600], 150, 0.15);
    }

    // ==================== BATTLE SOUNDS ====================

    playDamage(amount) {
        if (amount >= 20) {
            this.playBeep(200, 400, 0.25); // Heavy damage
        } else if (amount >= 10) {
            this.playBeep(300, 300, 0.2); // Medium damage
        } else {
            this.playBeep(400, 200, 0.15); // Light damage
        }
    }

    playHeal() {
        this.playBeep([600, 800, 1000], 120, 0.12);
    }

    playShield() {
        this.playBeep(1000, 250, 0.15);
    }

    playEnergyGain() {
        this.playBeep([400, 600, 800], 100, 0.1);
    }

    // ==================== QUESTION SOUNDS ====================

    playAnswerCorrect() {
        this.playBeep([800, 1200], 200, 0.15);
        this.speak('Đúng!');
    }

    playAnswerWrong() {
        this.playBeep([600, 300], 300, 0.2);
        this.speak('Sai!');
    }

    playTimeWarning() {
        this.playBeep(1500, 100, 0.1);
    }

    playTimeUp() {
        this.playBeep([400, 200, 100], 500, 0.2);
    }

    // ==================== GAME FLOW SOUNDS ====================

    playGameStart() {
        this.playBeep([400, 600, 800, 1000], 200, 0.15);
        this.speak('Bắt đầu trận đấu!');
    }

    playVictory() {
        this.playBeep([800, 1000, 1200, 1500], 300, 0.2);
        setTimeout(() => this.speak('Chiến thắng!'), 500);
    }

    playDefeat() {
        this.playBeep([800, 600, 400, 200], 400, 0.2);
        setTimeout(() => this.speak('Thất bại!'), 500);
    }

    playTurnStart() {
        this.playBeep(1000, 150, 0.1);
    }

    // ==================== BACKGROUND MUSIC ====================

    playBattleBGM() {
        // Try to load actual music file first
        const bgmPath = 'audio/battle_theme.mp3';

        // Check if file exists, otherwise use YouTube embed or silent
        fetch(bgmPath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    this.sm.playBGM('battle_theme', bgmPath);
                } else {
                    // Fallback: Use embedded YouTube music (hidden iframe)
                    this.playYouTubeBGM();
                }
            })
            .catch(() => {
                // Fallback
                this.playYouTubeBGM();
            });
    }

    playYouTubeBGM() {
        // Create hidden iframe for YouTube music
        if (document.getElementById('bgm-player')) return;

        const player = document.createElement('iframe');
        player.id = 'bgm-player';
        player.style.cssText = 'display:none;';
        // Epic Vietnamese battle music playlist (no copyright)
        player.src = 'https://www.youtube.com/embed/M0SQUFLZy2M?autoplay=1&loop=1&playlist=M0SQUFLZy2M&controls=0';
        player.allow = 'autoplay';
        document.body.appendChild(player);

        console.log('Playing YouTube BGM (Epic Vietnamese music)');
    }

    stopBGM() {
        this.sm.stopBGM();

        // Also stop YouTube player if exists
        const ytPlayer = document.getElementById('bgm-player');
        if (ytPlayer) {
            ytPlayer.remove();
        }
    }

    playVictoryMusic() {
        const victoryPath = 'audio/victory_theme.mp3';

        fetch(victoryPath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    this.sm.playSFX('victory_music', victoryPath);
                }
            })
            .catch(() => {
                // Use existing victory sound
                console.log('Using fallback victory sound');
            });
    }

    // ==================== FALLBACK: BROWSER BEEPS ====================

    /**
     * Play beep using Web Audio API
     */
    playBeep(frequency, duration, volume = 0.1) {
        if (this.sm.muted) return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Handle array of frequencies (melody)
            if (Array.isArray(frequency)) {
                let delay = 0;
                frequency.forEach(freq => {
                    setTimeout(() => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        osc.frequency.value = freq;
                        gain.gain.value = volume * this.sm.volume.sfx * this.sm.volume.master;
                        osc.start();
                        osc.stop(audioContext.currentTime + duration / 1000);
                    }, delay);
                    delay += duration;
                });
                return;
            }

            oscillator.frequency.value = frequency;
            gainNode.gain.value = volume * this.sm.volume.sfx * this.sm.volume.master;

            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            console.warn('Failed to play beep', e);
        }
    }

    /**
     * Text-to-speech fallback
     */
    speak(text) {
        if (this.sm.muted || !window.speechSynthesis) return;

        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'vi-VN';
            utterance.volume = this.sm.volume.voice * this.sm.volume.master;
            utterance.rate = 1.2;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('Failed to speak', e);
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SoundManager, QuizBattleSounds };
}
