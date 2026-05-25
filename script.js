// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.6 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Mouse interaction
        if (mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
                this.x -= dx * 0.015;
                this.y -= dy * 0.015;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Purple color for particles
        ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(100, Math.floor(window.innerWidth / 12));
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.beginPath();
                // Purple connecting lines
                ctx.strokeStyle = `rgba(168, 85, 247, ${0.12 * (1 - dist / 140)})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ===== GLASS CARD SPOTLIGHT EFFECT =====
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ===== TYPEWRITER EFFECT =====
const typewriterEl = document.getElementById('typewriter');
const phrases = [
    'Full-Stack Developer',
    'UI/UX Designer',
    'Problem Solver',
    'CS Engineering Graduate'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
    } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
    }

    setTimeout(typeWriter, typeSpeed);
}

typeWriter();

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('formSubmitBtn');
let isSubmitting = false;

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    isSubmitting = true;
    
    // Animate button
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.style.pointerEvents = 'none';

    const formData = new FormData(contactForm);

    fetch(contactForm.action, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
    .then(() => {
        submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        submitBtn.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';

        contactForm.reset();
        isSubmitting = false;

        setTimeout(() => {
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
            submitBtn.style.background = '';
            submitBtn.style.boxShadow = '';
            submitBtn.style.pointerEvents = '';
        }, 3000);
    })
    .catch((error) => {
        console.error('Error submitting form:', error);
        submitBtn.innerHTML = '<span>Error!</span><i class="fas fa-exclamation-triangle"></i>';
        submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        submitBtn.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
        
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
            submitBtn.style.background = '';
            submitBtn.style.boxShadow = '';
            submitBtn.style.pointerEvents = '';
            isSubmitting = false;
        }, 3000);
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== TILT EFFECTS =====
function initTiltEffect(selector, perspective, maxRotation) {
    document.querySelectorAll(selector).forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -maxRotation;
            const rotateY = ((x - centerX) / centerX) * maxRotation;
            
            // Add a subtle scale effect alongside the tilt
            item.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
}

// Apply tilt effects to skill items and project cards with different intensities
initTiltEffect('.skill-item', 500, 8);
initTiltEffect('.project-card', 1000, 4);

// ===== PRELOADER (fade in) =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease-in-out';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
