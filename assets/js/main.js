// ─── THEME SYSTEM ───
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function getStoredTheme() {
  return localStorage.getItem('theme');
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}
// Apply theme immediately (before paint) — stored preference > system preference
applyTheme(getStoredTheme() || getSystemTheme());

// Listen for system theme changes (only if user hasn't manually chosen)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
});

// Toggle button
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('themeToggle');
  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
});

// ─── LOADER ───
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 600);
});

// ─── NAV SCROLL HIDE ───
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  const current = window.scrollY;
  if (current > lastScroll && current > 80) nav.classList.add('nav-hidden');
  else nav.classList.remove('nav-hidden');
  lastScroll = current;
}, { passive: true });

// ─── MOBILE MENU ───
const toggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
toggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ─── SCROLL REVEAL ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .timeline-item').forEach(el => observer.observe(el));

// ─── PARTICLE CANVAS ───
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000 };
const PARTICLE_COUNT = 80;

function getParticleColor() {
  const s = getComputedStyle(document.documentElement);
  return {
    r: parseInt(s.getPropertyValue('--particle-r')) || 41,
    g: parseInt(s.getPropertyValue('--particle-g')) || 151,
    b: parseInt(s.getPropertyValue('--particle-b')) || 255
  };
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.radius = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.3 + 0.05;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    const dx = mouse.x - this.x, dy = mouse.y - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 150) {
      this.x -= dx * 0.008;
      this.y -= dy * 0.008;
    }
  }
  draw(c) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawLines(c) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.06 * (1 - dist/120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const c = getParticleColor();
  particles.forEach(p => { p.update(); p.draw(c); });
  drawLines(c);
  requestAnimationFrame(animate);
}
animate();

// ─── 3D CUBE DRAG-TO-ROTATE ───
const heroContainer = document.querySelector('.hero-3d-container');
const hero3d = document.querySelector('.hero-3d-object');
let cubeAuto = true;
let cubeDragging = false;
let cubeRotX = 15, cubeRotY = 0;
let dragStartX = 0, dragStartY = 0;
let dragBaseRotX = 15, dragBaseRotY = 0;

function stopAutoRotate() {
  if (!cubeAuto) return;
  cubeAuto = false;
  // Capture current visual rotation from the animation
  const computed = getComputedStyle(hero3d).transform;
  hero3d.style.animation = 'none';
  hero3d.style.transition = 'none';
  hero3d.style.transform = `rotateY(${cubeRotY}deg) rotateX(${cubeRotX}deg)`;
}

function resumeAutoRotate() {
  cubeDragging = false;
  cubeAuto = true;
  hero3d.style.transition = 'transform 0.6s ease-out';
  hero3d.style.transform = `rotateY(${cubeRotY}deg) rotateX(${cubeRotX}deg)`;
  setTimeout(() => {
    if (cubeAuto) {
      hero3d.style.transition = '';
      hero3d.style.animation = 'hero3dRotate 20s linear infinite';
      cubeRotX = 15; cubeRotY = 0;
    }
  }, 2500);
}

function onDragStart(clientX, clientY) {
  stopAutoRotate();
  cubeDragging = true;
  dragStartX = clientX;
  dragStartY = clientY;
  dragBaseRotX = cubeRotX;
  dragBaseRotY = cubeRotY;
  heroContainer.style.cursor = 'grabbing';
}

function onDragMove(clientX, clientY) {
  if (!cubeDragging) return;
  const dx = clientX - dragStartX;
  const dy = clientY - dragStartY;
  cubeRotY = dragBaseRotY + dx * 0.6;
  cubeRotX = dragBaseRotX - dy * 0.6;
  hero3d.style.transform = `rotateY(${cubeRotY}deg) rotateX(${cubeRotX}deg)`;
}

function onDragEnd() {
  if (!cubeDragging) return;
  heroContainer.style.cursor = 'grab';
  resumeAutoRotate();
}

heroContainer.style.cursor = 'grab';

// Mouse events
heroContainer.addEventListener('mousedown', (e) => {
  e.preventDefault();
  onDragStart(e.clientX, e.clientY);
});
window.addEventListener('mousemove', (e) => onDragMove(e.clientX, e.clientY));
window.addEventListener('mouseup', onDragEnd);

// Touch events
heroContainer.addEventListener('touchstart', (e) => {
  onDragStart(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });
window.addEventListener('touchmove', (e) => {
  if (cubeDragging) onDragMove(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });
window.addEventListener('touchend', onDragEnd);

// ─── RESUME MODAL ───
const resumeModal = document.getElementById('resumeModal');
const resumeIframe = document.getElementById('resumeIframe');
const resumeLoading = document.getElementById('resumeLoading');
const RESUME_URL = './assets/Rishi_Mule_Resume.pdf';

function openResume() {
  resumeModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Lazy-load iframe on first open
  if (!resumeIframe.src || resumeIframe.src === 'about:blank') {
    resumeLoading.classList.remove('hidden');
    resumeIframe.src = RESUME_URL;
    resumeIframe.onload = () => resumeLoading.classList.add('hidden');
  }
}
function closeResume() {
  resumeModal.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('resumeBackdrop').addEventListener('click', closeResume);
document.getElementById('resumeClose').addEventListener('click', closeResume);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && resumeModal.classList.contains('open')) closeResume();
});

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
