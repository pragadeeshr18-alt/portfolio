/**
 * ==========================================================================
 * PRAGADEESH — CINEMATIC ANIMATIONS & MOTION ENGINE
 * THEME: RED, ORANGE & OBSIDIAN BLACK
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initBackgroundCanvas();
  initScrollReveal();
  initCustomCursor();
  initPersistentBackdropParallax();
  initRoleTypewriter();
  initMetricCounters();
});

/* --- 1. PRELOADER ENGINE --- */
function initPreloader() {
  const preloader = document.querySelector('.site-preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.classList.add('page-ready');
      triggerInitialHeroReveals();
    }, 450);
  });

  // Fallback timeout in case load event takes too long
  setTimeout(() => {
    if (!preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      document.body.classList.add('page-ready');
      triggerInitialHeroReveals();
    }
  }, 1800);
}

function triggerInitialHeroReveals() {
  const heroReveals = document.querySelectorAll('.hero-section [data-reveal]');
  heroReveals.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('is-revealed');
    }, index * 120);
  });
}

/* --- 2. AMBIENT FIERY EMBER CANVAS (RED & ORANGE SPARKS) --- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 160 };

  const particleCount = window.innerWidth < 768 ? 26 : 52;
  const colors = [
    'rgba(255, 42, 75, 0.55)',
    'rgba(255, 106, 0, 0.45)',
    'rgba(255, 145, 0, 0.4)',
    'rgba(225, 29, 72, 0.35)'
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 12;
      this.size = Math.random() * 2.8 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = -Math.random() * 0.6 - 0.25;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.65 + 0.25;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulseVal = Math.random() * Math.PI;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulseVal += this.pulseSpeed;

      // Mouse gentle repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.8;
          this.y -= (dy / dist) * force * 1.8;
        }
      }

      if (this.y < -15 || this.x < -15 || this.x > width + 15) {
        this.reset();
      }
    }

    draw() {
      const currentAlpha = this.alpha * (0.6 + 0.4 * Math.sin(this.pulseVal));
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 14;
      ctx.shadowColor = 'rgba(255, 60, 40, 0.7)';
      ctx.globalAlpha = currentAlpha;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --- 3. SCROLL REVEAL OBSERVER --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]:not(.hero-section [data-reveal])');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -70px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* --- 4. CUSTOM MAGNETIC CURSOR --- */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) {
    return;
  }

  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    if (!isVisible) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      isVisible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    isVisible = false;
  });

  // Smooth lerp loop for outer ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover triggers for interactive elements
  const interactives = document.querySelectorAll('a, button, .btn, .skill-tag, .metric-card, .arch-node, .contact-method-card, .highlight-chip, .hero-hud-card, input, textarea');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/* --- 5. PERSISTENT 16:9 IMAGE SCROLL TRAVEL & PARALLAX ENGINE --- */
function initPersistentBackdropParallax() {
  const globalImg = document.querySelector('.global-backdrop-img');
  const heroDashboardImg = document.querySelector('.hero-dashboard-img');
  const heroContent = document.querySelector('.hero-content');

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = docHeight > 0 ? scrollY / docHeight : 0;

    // Persistent backdrop motion: travels and subtly shifts scale/position as user scrolls down
    if (globalImg) {
      const translateY = scrollFraction * 60; // Subtle downward glide
      const scale = 1.05 + scrollFraction * 0.08; // Subtle expansion depth
      const opacity = 0.38 + Math.sin(scrollFraction * Math.PI) * 0.12; // Slight brightness swell in mid-page
      globalImg.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      globalImg.style.opacity = opacity;
    }

    // Hero visual dashboard interaction
    if (heroDashboardImg && scrollY < window.innerHeight * 1.2) {
      const heroY = scrollY * 0.12;
      heroDashboardImg.style.transform = `translateY(${heroY}px)`;
    }

    if (heroContent && scrollY < window.innerHeight * 1.2) {
      const contentY = scrollY * 0.08;
      const contentOpacity = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.85)));
      heroContent.style.transform = `translateY(${contentY}px)`;
      heroContent.style.opacity = contentOpacity;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
}

/* --- 6. HERO ROLE ROTATING TYPEWRITER --- */
function initRoleTypewriter() {
  const roleElement = document.querySelector('.typed-role');
  if (!roleElement) return;

  const roles = [
    'AI & Machine Learning Engineer',
    'Software Developer',
    'Full Stack Web Developer',
    'Cloud & VM Systems Engineer',
    'UI/UX & Solution Designer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      roleElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      roleElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

/* --- 7. METRIC NUMBER ANIMATION --- */
function initMetricCounters() {
  const metricCards = document.querySelectorAll('.metric-number[data-target]');
  if (!metricCards.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = el.getAttribute('data-decimal') === 'true';

        let start = 0;
        const duration = 1400;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out expo curve
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = start + (target - start) * easeOut;

          el.textContent = `${prefix}${isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${isDecimal ? target.toFixed(2) : target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  metricCards.forEach(card => observer.observe(card));
}
