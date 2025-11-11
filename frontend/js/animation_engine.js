/**
 * VIỆT KÝ SỬ - Animation Engine
 * Advanced animations for premium game feel
 */

class AnimationEngine {
    constructor() {
        this.animations = [];
        this.particles = [];
        this.running = false;
        this.lastFrame = 0;
    }

    /**
     * Start animation loop
     */
    start() {
        if (this.running) return;
        this.running = true;
        this.lastFrame = performance.now();
        this.loop();
    }

    /**
     * Animation loop
     */
    loop() {
        if (!this.running) return;

        const now = performance.now();
        const delta = now - this.lastFrame;
        this.lastFrame = now;

        // Update all animations
        this.animations = this.animations.filter(anim => {
            return anim.update(delta);
        });

        // Update all particles
        this.particles = this.particles.filter(particle => {
            return particle.update(delta);
        });

        requestAnimationFrame(() => this.loop());
    }

    /**
     * Stop animation loop
     */
    stop() {
        this.running = false;
        this.animations = [];
        this.particles = [];
    }

    /**
     * Add animation
     */
    addAnimation(animation) {
        this.animations.push(animation);
    }

    /**
     * Add particle
     */
    addParticle(particle) {
        this.particles.push(particle);
    }

    /**
     * Card play animation - arc trajectory
     */
    animateCardPlay(cardElement, targetX, targetY, onComplete) {
        const startRect = cardElement.getBoundingClientRect();
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;

        const animation = new CardPlayAnimation(
            cardElement,
            startX,
            startY,
            targetX,
            targetY,
            800, // duration ms
            onComplete
        );

        this.addAnimation(animation);
        return animation;
    }

    /**
     * HP bar smooth decrease with number
     */
    animateHPChange(element, fromHP, toHP, maxHP, duration = 500) {
        const animation = new HPBarAnimation(
            element,
            fromHP,
            toHP,
            maxHP,
            duration
        );

        this.addAnimation(animation);
        return animation;
    }

    /**
     * Particle explosion
     */
    createExplosion(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            const particle = new Particle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                color,
                500 + Math.random() * 500
            );
            this.addParticle(particle);
        }
    }

    /**
     * Victory sparkles
     */
    createSparkles(containerElement, duration = 3000) {
        const rect = containerElement.getBoundingClientRect();
        const startTime = performance.now();

        const sparkleInterval = setInterval(() => {
            if (performance.now() - startTime > duration) {
                clearInterval(sparkleInterval);
                return;
            }

            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;

            const particle = new Particle(
                x,
                y,
                (Math.random() - 0.5) * 2,
                -2 - Math.random() * 2,
                '#FFD700',
                1000,
                '✨'
            );

            this.addParticle(particle);
        }, 100);
    }

    /**
     * Screen shake
     */
    shakeElement(element, intensity = 10, duration = 300) {
        const animation = new ShakeAnimation(element, intensity, duration);
        this.addAnimation(animation);
        return animation;
    }

    /**
     * Scale pulse animation
     */
    pulseElement(element, scale = 1.1, duration = 200) {
        const animation = new PulseAnimation(element, scale, duration);
        this.addAnimation(animation);
        return animation;
    }

    /**
     * Floating text
     */
    createFloatingText(text, x, y, color, fontSize = '2rem', duration = 1000) {
        const textEl = document.createElement('div');
        textEl.textContent = text;
        textEl.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${fontSize};
            font-weight: 900;
            color: ${color};
            pointer-events: none;
            z-index: 9999;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(textEl);

        const animation = new FloatingTextAnimation(textEl, y, duration, () => {
            textEl.remove();
        });

        this.addAnimation(animation);
        return animation;
    }
}

/**
 * Card Play Animation - Arc trajectory
 */
class CardPlayAnimation {
    constructor(element, startX, startY, endX, endY, duration, onComplete) {
        this.element = element;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.duration = duration;
        this.elapsed = 0;
        this.onComplete = onComplete;

        // Save original styles
        this.originalTransform = element.style.transform;
        this.originalPosition = element.style.position;
        this.originalZIndex = element.style.zIndex;

        // Set up for animation
        element.style.position = 'fixed';
        element.style.zIndex = '9999';
    }

    update(delta) {
        this.elapsed += delta;
        const progress = Math.min(this.elapsed / this.duration, 1);

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);

        // Calculate position with arc
        const x = this.startX + (this.endX - this.startX) * eased;
        const arc = Math.sin(progress * Math.PI) * 100; // Arc height
        const y = this.startY + (this.endY - this.startY) * eased - arc;

        // Calculate rotation
        const rotation = progress * 360;

        // Apply transform
        this.element.style.transform = `translate(${x - this.startX}px, ${y - this.startY}px) rotate(${rotation}deg) scale(${1 - progress * 0.5})`;

        // Check if done
        if (progress >= 1) {
            // Restore original styles
            this.element.style.transform = this.originalTransform;
            this.element.style.position = this.originalPosition;
            this.element.style.zIndex = this.originalZIndex;

            if (this.onComplete) {
                this.onComplete();
            }
            return false; // Remove from animations array
        }

        return true; // Continue animating
    }
}

/**
 * HP Bar Smooth Animation
 */
class HPBarAnimation {
    constructor(element, fromHP, toHP, maxHP, duration) {
        this.element = element;
        this.fromHP = fromHP;
        this.toHP = toHP;
        this.maxHP = maxHP;
        this.duration = duration;
        this.elapsed = 0;
    }

    update(delta) {
        this.elapsed += delta;
        const progress = Math.min(this.elapsed / this.duration, 1);

        // Easing
        const eased = 1 - Math.pow(1 - progress, 2);

        // Calculate current HP
        const currentHP = this.fromHP + (this.toHP - this.fromHP) * eased;
        const percentage = (currentHP / this.maxHP) * 100;

        // Update bar width
        this.element.style.width = percentage + '%';

        return progress < 1;
    }
}

/**
 * Particle System
 */
class Particle {
    constructor(x, y, vx, vy, color, lifetime, emoji = null) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.lifetime = lifetime;
        this.age = 0;
        this.emoji = emoji;

        // Create DOM element
        this.element = document.createElement('div');
        this.element.textContent = emoji || '•';
        this.element.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-size: ${emoji ? '1.5rem' : '0.5rem'};
            pointer-events: none;
            z-index: 9999;
            user-select: none;
        `;
        document.body.appendChild(this.element);
    }

    update(delta) {
        this.age += delta;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Gravity
        this.vy += 0.1;

        // Update element
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';

        // Fade out
        const alpha = 1 - (this.age / this.lifetime);
        this.element.style.opacity = alpha;

        // Check if dead
        if (this.age >= this.lifetime) {
            this.element.remove();
            return false;
        }

        return true;
    }
}

/**
 * Shake Animation
 */
class ShakeAnimation {
    constructor(element, intensity, duration) {
        this.element = element;
        this.intensity = intensity;
        this.duration = duration;
        this.elapsed = 0;
        this.originalTransform = element.style.transform;
    }

    update(delta) {
        this.elapsed += delta;
        const progress = this.elapsed / this.duration;

        if (progress >= 1) {
            this.element.style.transform = this.originalTransform;
            return false;
        }

        // Decrease intensity over time
        const currentIntensity = this.intensity * (1 - progress);
        const x = (Math.random() - 0.5) * currentIntensity;
        const y = (Math.random() - 0.5) * currentIntensity;

        this.element.style.transform = `translate(${x}px, ${y}px)`;

        return true;
    }
}

/**
 * Pulse Animation
 */
class PulseAnimation {
    constructor(element, scale, duration) {
        this.element = element;
        this.scale = scale;
        this.duration = duration;
        this.elapsed = 0;
        this.originalTransform = element.style.transform;
    }

    update(delta) {
        this.elapsed += delta;
        const progress = this.elapsed / this.duration;

        if (progress >= 1) {
            this.element.style.transform = this.originalTransform;
            return false;
        }

        // Ease in-out
        const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Scale up then down
        const currentScale = 1 + (this.scale - 1) * (1 - Math.abs(eased * 2 - 1));

        this.element.style.transform = `scale(${currentScale})`;

        return true;
    }
}

/**
 * Floating Text Animation
 */
class FloatingTextAnimation {
    constructor(element, startY, duration, onComplete) {
        this.element = element;
        this.startY = startY;
        this.duration = duration;
        this.elapsed = 0;
        this.onComplete = onComplete;
    }

    update(delta) {
        this.elapsed += delta;
        const progress = Math.min(this.elapsed / this.duration, 1);

        // Float up
        const y = this.startY - progress * 150;
        this.element.style.top = y + 'px';

        // Fade out
        const alpha = 1 - progress;
        this.element.style.opacity = alpha;

        // Scale
        const scale = 0.5 + progress * 0.5;
        this.element.style.transform = `translate(-50%, -50%) scale(${scale})`;

        if (progress >= 1) {
            if (this.onComplete) {
                this.onComplete();
            }
            return false;
        }

        return true;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationEngine };
}
