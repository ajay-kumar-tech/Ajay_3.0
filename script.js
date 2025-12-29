// ============================================
// Background Music Control
// ============================================
const music = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
let isPlaying = false;

// Music toggle functionality
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        music.pause();
        musicIcon.textContent = '🎵';
        musicToggle.classList.remove('playing');
        isPlaying = false;
    } else {
        music.play().catch(err => {
            console.log('Autoplay prevented. User interaction required.');
        });
        musicIcon.textContent = '🎶';
        musicToggle.classList.add('playing');
        isPlaying = true;
    }
});

// ============================================
// Smooth Scroll for Navigation
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ============================================
// Scroll Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations (enhanced)
document.querySelectorAll('.gallery-item, .letter-card, .timeline-item, .surprise, .section-title').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
    observer.observe(el);
});

// ============================================
// Confetti Animation
// ============================================
class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        const colors = ['#f093fb', '#f5576c', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#764ba2'];
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -10,
            size: Math.random() * 5 + 3,
            speedX: (Math.random() - 0.5) * 4,
            speedY: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            shape: Math.random() > 0.5 ? 'circle' : 'square'
        };
    }

    start(x, y, particleCount = 100) {
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle(x, y));
        }

        // Start animation if not already running
        if (!this.animationId) {
            this.animate();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.rotation += particle.rotationSpeed;

            // Apply gravity
            particle.speedY += 0.1;

            // Draw particle
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate((particle.rotation * Math.PI) / 180);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = 0.8;

            if (particle.shape === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(-particle.size, -particle.size, particle.size * 2, particle.size * 2);
            }

            this.ctx.restore();

            // Remove particles that are off screen
            if (particle.y > this.canvas.height + 20 || particle.x < -20 || particle.x > this.canvas.width + 20) {
                this.particles.splice(i, 1);
            }
        }

        // Continue animation if there are particles
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
        }
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Initialize confetti
const confettiCanvas = document.getElementById('confettiCanvas');
const confetti = new Confetti(confettiCanvas);

// ============================================
// Surprise Button Functionality
// ============================================
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseMessage = document.getElementById('surpriseMessage');

surpriseBtn.addEventListener('click', () => {
    // Show the hidden message
    surpriseMessage.classList.remove('hidden');
    
    // Trigger confetti animation
    const rect = surpriseBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Create multiple bursts of confetti with more particles
    confetti.start(x, y, 200);
    
    // Add more confetti bursts for extra effect
    setTimeout(() => {
        confetti.start(x, y, 150);
    }, 200);
    
    setTimeout(() => {
        confetti.start(x, y, 150);
    }, 400);
    
    setTimeout(() => {
        confetti.start(x, y, 100);
    }, 600);
    
    setTimeout(() => {
        confetti.start(x, y, 100);
    }, 800);

    // Create floating hearts around the button (fewer on mobile)
    const heartCount = isMobile ? 6 : 10;
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            createHeart(
                x + (Math.random() - 0.5) * 200,
                y + (Math.random() - 0.5) * 200
            );
        }, i * 100);
    }

    // Disable button after first click (optional)
    surpriseBtn.style.opacity = '0.7';
    surpriseBtn.style.cursor = 'not-allowed';
    surpriseBtn.disabled = true;
    
    // Optional: Change button text with animation
    setTimeout(() => {
        surpriseBtn.textContent = 'You found the surprise! 🎉';
        surpriseBtn.style.animation = 'buttonGlow 1s ease-in-out infinite';
    }, 1000);
    
    // Add sparkle effect to message
    const message = document.querySelector('.love-message');
    if (message) {
        message.style.animation = 'lovePulse 1s ease-in-out infinite';
    }
});

// ============================================
// Enhanced Parallax Effect for Hero Section
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.floating-heart, .floating-star');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = Math.max(0, 1 - scrolled / 500);
    }
    
    // Parallax for floating elements
    floatingElements.forEach((el, index) => {
        const speed = (index % 2 === 0 ? 0.3 : 0.5);
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ============================================
// Mouse Move Interactive Effects (Desktop only)
// ============================================
if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        // Create subtle sparkles on mouse move (desktop only)
        if (Math.random() > 0.95) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = e.clientX + 'px';
            sparkle.style.top = e.clientY + 'px';
            sparkle.style.animationDuration = '1s';
            document.getElementById('sparkles').appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        }
    });
}

// ============================================
// Image Lazy Loading Enhancement
// ============================================
const images = document.querySelectorAll('.gallery-item img');
images.forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    // Add loading state
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
});

// ============================================
// Detect Mobile Device
// ============================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                 (window.innerWidth <= 768);

// ============================================
// Floating Hearts Background Animation
// ============================================
function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    const heartEmojis = ['💖', '💕', '💗', '❤️', '💝', '💞'];
    // Reduce number of hearts on mobile for better performance
    const heartCount = isMobile ? 8 : 15;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.position = 'absolute';
        heart.style.fontSize = (isMobile ? Math.random() * 15 + 12 : Math.random() * 20 + 15) + 'px';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        heart.style.animation = `floatHeart ${Math.random() * 10 + 10}s infinite ease-in-out`;
        heart.style.animationDelay = Math.random() * 5 + 's';
        heartsContainer.appendChild(heart);
    }
}

// Add floating heart animation
const heartStyle = document.createElement('style');
heartStyle.textContent += `
    @keyframes floatHeart {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.3;
        }
        25% {
            transform: translate(50px, -50px) rotate(90deg);
            opacity: 0.6;
        }
        50% {
            transform: translate(-30px, -100px) rotate(180deg);
            opacity: 0.4;
        }
        75% {
            transform: translate(-50px, -50px) rotate(270deg);
            opacity: 0.7;
        }
    }
`;
document.head.appendChild(heartStyle);

// Initialize floating hearts
createFloatingHearts();

// ============================================
// Sparkles Animation
// ============================================
function createSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    // Reduce sparkle frequency on mobile
    const interval = isMobile ? 1000 : 500;
    const maxSparkles = isMobile ? 10 : 20;
    
    setInterval(() => {
        if (sparklesContainer.children.length < maxSparkles) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            sparkle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            sparklesContainer.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 3000);
        }
    }, interval);
}

// Initialize sparkles
createSparkles();

// ============================================
// Add Heart Animation on Click/Touch (Enhanced)
// ============================================
function handleHeartCreation(e) {
    const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    
    // Only create hearts on certain sections
    if (e.target.closest('.hero, .memories, .love-letter, .timeline, .surprise')) {
        createHeart(x, y);
        // Create multiple hearts for more effect (fewer on mobile)
        const heartCount = isMobile ? 2 : 3;
        for (let i = 1; i <= heartCount; i++) {
            setTimeout(() => {
                createHeart(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40);
            }, i * 100);
        }
    }
}

document.addEventListener('click', handleHeartCreation);
document.addEventListener('touchstart', handleHeartCreation, { passive: true });

function createHeart(x, y) {
    const hearts = ['❤️', '💖', '💕', '💗', '💝', '💞'];
    const heart = document.createElement('div');
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9998';
    heart.style.animation = `heartFloat ${Math.random() * 1 + 2}s ease-out forwards`;
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// Add heart float animation (enhanced)
const style = document.createElement('style');
style.textContent += `
    @keyframes heartFloat {
        0% {
            opacity: 1;
            transform: translateY(0) translateX(0) scale(1) rotate(0deg);
        }
        50% {
            opacity: 0.8;
            transform: translateY(-50px) translateX(${Math.random() * 50 - 25}px) scale(1.2) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: translateY(-150px) translateX(${Math.random() * 100 - 50}px) scale(1.5) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Auto-create sparkles on page load
// ============================================
window.addEventListener('load', () => {
    // Create initial sparkles (fewer on mobile)
    const initialSparkles = isMobile ? 5 : 10;
    for (let i = 0; i < initialSparkles; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            document.getElementById('sparkles').appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 3000);
        }, i * 200);
    }
});

// ============================================
// Enhanced Gallery Hover/Touch Effects
// ============================================
document.querySelectorAll('.gallery-item').forEach(item => {
    // Desktop hover effect
    if (!isMobile) {
        item.addEventListener('mouseenter', function() {
            // Create sparkles around the image
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const rect = this.getBoundingClientRect();
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                    sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
                    sparkle.style.animationDuration = '1.5s';
                    document.getElementById('sparkles').appendChild(sparkle);
                    
                    setTimeout(() => {
                        sparkle.remove();
                    }, 1500);
                }, i * 100);
            }
        });
    }
    
    // Touch effect for mobile
    item.addEventListener('touchstart', function() {
        if (isMobile) {
            // Create fewer sparkles on touch
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const rect = this.getBoundingClientRect();
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                    sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
                    sparkle.style.animationDuration = '1.5s';
                    document.getElementById('sparkles').appendChild(sparkle);
                    
                    setTimeout(() => {
                        sparkle.remove();
                    }, 1500);
                }, i * 100);
            }
        }
    }, { passive: true });
});

// ============================================
// Console Message (Hidden Easter Egg)
// ============================================
console.log('%c❤️ Happy Birthday Preety! ❤️', 'color: #f5576c; font-size: 20px; font-weight: bold;');
console.log('%cYou are loved more than words can express, Preety!', 'color: #764ba2; font-size: 14px;');
console.log('%cThis website was made with lots of love and care for you, Preety 💕', 'color: #f093fb; font-size: 12px;');

