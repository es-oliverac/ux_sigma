/* ============================================================
   SIGMA AUTOS — Main JS
   Global init: nav scroll, mobile menu, page transitions,
   cursor trail, and module bootstrapping.
   ============================================================ */

import { initReveals } from './reveal.js';
import { initCountdowns } from './countdown.js';
import { initTickers } from './ticker.js';
import { initBidFeed } from './bidFeed.js';

document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide icons
  if (window.lucide) lucide.createIcons();

  // ── Scroll reveals ──
  initReveals();

  // ── Countdowns ──
  initCountdowns();

  // ── Number tickers ──
  initTickers();

  // ── Bid feed (if present) ──
  const feedContainer = document.querySelector('.bid-feed');
  const priceDisplay = document.querySelector('[data-live-price]');
  const bidCountDisplay = document.querySelector('[data-bid-count]');
  if (feedContainer) {
    initBidFeed(feedContainer, priceDisplay, bidCountDisplay);
  }

  // ── Nav scroll effect ──
  initNavScroll();

  // ── Mobile menu ──
  initMobileMenu();

  // ── Cursor trail (hero only, desktop) ──
  initCursorTrail();

  // ── Simulated live price updates on hero card ──
  initHeroLivePrice();

  // ── Bid button burst ──
  initBidButtons();
});

/* ── Nav sticky scroll effect ── */
function initNavScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          header.classList.add('site-header--scrolled');
        } else {
          header.classList.remove('site-header--scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ── Mobile menu toggle ── */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-header__nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('site-header__nav--open');

    // Toggle hamburger → X icon
    const icon = toggle.querySelector('[data-lucide]');
    if (icon) {
      icon.setAttribute('data-lucide', expanded ? 'menu' : 'x');
      lucide.createIcons();
    }
  });
}

/* ── Cursor trail (hero section, desktop only) ── */
function initCursorTrail() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return; // skip mobile

  const hero = document.querySelector('.hero');
  if (!hero) return;

  let throttle = false;

  hero.addEventListener('mousemove', (e) => {
    if (throttle) return;
    throttle = true;
    setTimeout(() => { throttle = false; }, 50);

    const dot = document.createElement('div');
    Object.assign(dot.style, {
      position: 'fixed',
      left: e.clientX + 'px',
      top: e.clientY + 'px',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: 'var(--sigma-blue-glow)',
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%, -50%)',
    });
    document.body.appendChild(dot);

    dot.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.5 },
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    }).onfinish = () => dot.remove();
  });
}

/* ── Hero live price simulation ── */
function initHeroLivePrice() {
  const priceEl = document.querySelector('[data-hero-price]');
  if (!priceEl) return;

  let price = parseInt(priceEl.dataset.heroPrice, 10) || 89500;

  function tick() {
    const increment = [50, 100, 100, 200, 250][Math.floor(Math.random() * 5)];
    price += increment;

    // Animate digits
    const formatted = '$' + price.toLocaleString('en-US');
    animatePriceChange(priceEl, formatted);

    const nextDelay = 4000 + Math.random() * 6000;
    setTimeout(tick, nextDelay);
  }

  setTimeout(tick, 3000);
}

function animatePriceChange(el, newText) {
  // Flash effect
  el.style.color = 'var(--sigma-blue-glow)';
  el.textContent = newText;
  setTimeout(() => {
    el.style.color = '';
  }, 400);
}

/* ── Bid button burst particles ── */
function initBidButtons() {
  document.querySelectorAll('[data-bid-button]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      btn.style.transform = 'scale(0.97)';
      setTimeout(() => { btn.style.transform = ''; }, 150);

      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 / 12) * i;
        const distance = 50 + Math.random() * 40;
        const size = 3 + Math.random() * 4;

        Object.assign(particle.style, {
          position: 'fixed',
          left: cx + 'px',
          top: cy + 'px',
          width: size + 'px',
          height: size + 'px',
          borderRadius: '50%',
          background: i % 2 === 0 ? 'var(--sigma-blue)' : 'var(--sigma-blue-glow)',
          pointerEvents: 'none',
          zIndex: '9999',
        });

        document.body.appendChild(particle);

        particle.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
            opacity: 0,
          },
        ], {
          duration: 450 + Math.random() * 200,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        }).onfinish = () => particle.remove();
      }
    });
  });
}
