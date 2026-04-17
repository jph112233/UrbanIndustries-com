/* Urban Industries - Parallax Storytelling JS */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Scroll Progress Bar ─────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}

/* ─── Parallax Hero ───────────────────────────────────────────── */
function initParallax() {
  if (prefersReducedMotion) return;
  const bg = document.querySelector('.parallax-bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bg.style.transform = `translate3d(0, ${y * 0.45}px, 0)`;
  }, { passive: true });
}

/* ─── Parallax Decorative Layers ─────────────────────────────── */
function initParallaxLayers() {
  if (prefersReducedMotion) return;
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    layers.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.parentElement.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      el.style.transform = `translate3d(0, ${centerY * speed * -0.1}px, 0)`;
    });
  }, { passive: true });
}

/* ─── Scroll Reveal ───────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ─── Nav Mobile Toggle ───────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.querySelector('.nav-mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', links.classList.contains('open'));
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) links.classList.remove('open');
  });
}

/* ─── Active Nav Link ─────────────────────────────────────────── */
function initActiveNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = new URL(a.href).pathname.replace(/\/$/, '') || '/';
    if (href === path) a.classList.add('active');
  });
}

/* ─── Counter Animation ───────────────────────────────────────── */
function animateCounters() {
  if (prefersReducedMotion) return;
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      let start = 0;
      const duration = 1800;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * target;
        el.textContent = prefix + (Number.isInteger(target) ? Math.floor(value) : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

/* ─── Contact Form ────────────────────────────────────────────── */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#16A34A';
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Send Message';
        btn.style.background = '';
      }, 3000);
    }, 1200);
  });
}

/* ─── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initParallax();
  initParallaxLayers();
  initReveal();
  initMobileNav();
  initActiveNav();
  animateCounters();
  initContactForm();
});
