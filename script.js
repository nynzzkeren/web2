// ==========================================
// TYPING EFFECT
// ==========================================
const texts = [
    "Roblox Scripter",
    "Discord Bot Developer", 
    "Cyber Security Enthusiast",
    "Full Stack Developer"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typing');

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Start typing animation
type();

// ==========================================
// PARTICLE EFFECT
// ==========================================
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = Math.random() * 20 + 's';
        container.appendChild(particle);
    }
}

createParticles();

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };

        updateCounter();
    });
}

// ==========================================
// 3D TILT EFFECT
// ==========================================
class TiltEffect {
    constructor(element, settings = {}) {
        this.element = element;
        this.settings = {
            max: settings.max || 15,
            perspective: settings.perspective || 1000,
            scale: settings.scale || 1.02,
            speed: settings.speed || 400,
            glare: settings.glare !== false,
            ...settings
        };
        
        this.init();
    }

    init() {
        // Add glare element if enabled
        if (this.settings.glare) {
            this.glareElement = document.createElement('div');
            this.glareElement.className = 'tilt-glare';
            this.element.appendChild(this.glareElement);
        }

        // Bind events
        this.element.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.element.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.element.addEventListener('mouseenter', () => this.handleMouseEnter());
    }

    handleMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -this.settings.max;
        const rotateY = ((x - centerX) / centerX) * this.settings.max;

        this.element.style.transform = `
            perspective(${this.settings.perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})
        `;

        // Update glare position
        if (this.glareElement) {
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            this.glareElement.style.background = `
                radial-gradient(
                    circle at ${glareX}% ${glareY}%, 
                    rgba(255,255,255,0.15) 0%, 
                    rgba(255,255,255,0) 60%
                )
            `;
            this.glareElement.style.opacity = '1';
        }
    }

    handleMouseLeave() {
        this.element.style.transform = `
            perspective(${this.settings.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;
        
        if (this.glareElement) {
            this.glareElement.style.opacity = '0';
        }
    }

    handleMouseEnter() {
        this.element.style.transition = 'none';
    }
}

// Initialize tilt effect on all cards
document.addEventListener('DOMContentLoaded', () => {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        new TiltEffect(card, {
            max: 10,
            perspective: 1000,
            scale: 1.02,
            glare: true
        });
    });

    // Also add tilt to image container
    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        new TiltEffect(imageContainer, {
            max: 5,
            perspective: 1000,
            scale: 1.01,
            glare: true
        });
    }
});

// ==========================================
// MUSIC PLAYER
// ==========================================
class MusicPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTrack = 0;
        this.volume = 0.5;
        
        // Simulated playlist (in real use, use actual audio files)
        this.tracks = [
            { name: "Lo-Fi Coding", artist: "Chill Beats" },
            { name: "Cyberpunk Synth", artist: "Neon Wave" },
            { name: "Deep Focus", artist: "Brainwave" },
            { name: "Night Drive", artist: "Retro Wave" }
        ];

        this.init();
    }

    init() {
        this.player = document.getElementById('musicPlayer');
        this.toggle = document.getElementById('musicToggle');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.trackName = document.querySelector('.track-name');

        // Toggle player expansion
        this.toggle.addEventListener('click', () => {
            this.player.classList.toggle('expanded');
        });

        // Play/Pause
        this.playBtn.addEventListener('click', () => {
            this.togglePlay();
        });

        // Previous track
        this.prevBtn.addEventListener('click', () => {
            this.prevTrack();
        });

        // Next track
        this.nextBtn.addEventListener('click', () => {
            this.nextTrack();
        });

        // Volume control
        this.volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            this.updateVolume();
        });

        // Auto-play simulation (optional)
        // this.play();
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
        
        if (this.isPlaying) {
            this.simulatePlay();
        }
    }

    updatePlayButton() {
        const icon = this.playBtn.querySelector('i');
        if (this.isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            this.playBtn.classList.add('playing');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            this.playBtn.classList.remove('playing');
        }
    }

    prevTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.updateTrackInfo();
        if (this.isPlaying) {
            this.simulatePlay();
        }
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.updateTrackInfo();
        if (this.isPlaying) {
            this.simulatePlay();
        }
    }

    updateTrackInfo() {
        this.trackName.textContent = this.tracks[this.currentTrack].name;
        
        // Animation effect
        this.trackName.style.animation = 'none';
        setTimeout(() => {
            this.trackName.style.animation = 'bounce 0.5s ease';
        }, 10);
    }

    updateVolume() {
        // In real implementation, adjust audio volume here
        console.log('Volume:', this.volume);
    }

    simulatePlay() {
        // Simulate playing (in real use, control actual Audio object)
        console.log('Playing:', this.tracks[this.currentTrack].name);
    }

    play() {
        this.isPlaying = true;
        this.updatePlayButton();
        this.simulatePlay();
    }
}

// Initialize Music Player
const musicPlayer = new MusicPlayer();

// ==========================================
// SCROLL ANIMATION
// ==========================================
function handleScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// ==========================================
// ACTIVE NAVIGATION
// ==========================================
function setActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener('load', () => {
    animateCounters();
    setActiveNav();
});

window.addEventListener('scroll', handleScroll);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Parallax effect for hero image
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-image');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ==========================================
// MOUSE FOLLOW EFFECT (Optional Enhancement)
// ==========================================
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(newCursor);
    }
    
    const actualCursor = document.querySelector('.cursor');
    actualCursor.style.left = e.clientX - 10 + 'px';
    actualCursor.style.top = e.clientY - 10 + 'px';
});

// Add hover effect to cursor on interactive elements
document.querySelectorAll('a, button, .tilt-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(0, 212, 255, 0.1)';
        }
    });
    
    el.addEventListener('mouseleave', () => {
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'transparent';
        }
    });
});
