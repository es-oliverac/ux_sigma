/* ============================================================
   SIGMA AUTOS — Bundled App (no ES modules)
   Works with file:// protocol — no server needed.
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll-triggered Reveals ── */
  function initReveals() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    document.querySelectorAll('[data-stagger]').forEach(parent => {
      const children = parent.querySelectorAll('.reveal');
      children.forEach((child, i) => {
        child.style.setProperty('--i', i);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ── Countdown Timer ── */
  function initCountdowns() {
    document.querySelectorAll('[data-countdown]').forEach(el => {
      const endTime = parseInt(el.dataset.countdown, 10);
      if (!endTime) return;
      startCountdown(el, endTime);
    });
  }

  function startCountdown(el, endTimestamp) {
    const digits = el.querySelectorAll('.countdown__digit');

    function update() {
      const now = Date.now();
      let remaining = Math.max(0, endTimestamp - now);

      const hours = Math.floor(remaining / 3600000);
      remaining %= 3600000;
      const minutes = Math.floor(remaining / 60000);
      remaining %= 60000;
      const seconds = Math.floor(remaining / 1000);

      const timeStr = [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0'),
      ].join(':');

      const totalSecs = hours * 3600 + minutes * 60 + seconds;
      let colorClass = '';
      if (totalSecs <= 10) {
        colorClass = 'countdown--critical';
      } else if (totalSecs <= 60) {
        colorClass = 'countdown--danger';
      } else if (totalSecs <= 300) {
        colorClass = 'countdown--warning';
      }

      el.className = el.className.replace(/countdown--(warning|danger|critical)/g, '').trim();
      if (colorClass) el.classList.add(colorClass);

      if (digits.length > 0) {
        updateDigits(digits, timeStr);
      } else {
        el.textContent = timeStr;
      }

      if (totalSecs > 0) {
        requestAnimationFrame(() => setTimeout(update, 250));
      }
    }

    update();
  }

  function updateDigits(digitEls, timeStr) {
    const chars = timeStr.replace(/:/g, '').split('');
    digitEls.forEach((digit, i) => {
      if (i < chars.length && digit.textContent !== chars[i]) {
        digit.classList.add('flip');
        digit.textContent = chars[i];
        setTimeout(() => digit.classList.remove('flip'), 300);
      }
    });
  }

  /* ── Number Ticker ── */
  function initTickers() {
    document.querySelectorAll('[data-ticker]').forEach(el => {
      setupTicker(el);
    });
  }

  function setupTicker(container) {
    const value = container.dataset.ticker || container.textContent.trim();
    container.innerHTML = '';
    container.classList.add('ticker');

    for (const char of value) {
      if (char >= '0' && char <= '9') {
        const digitWrap = document.createElement('span');
        digitWrap.classList.add('ticker__digit');
        const inner = document.createElement('span');
        inner.classList.add('ticker__digit-inner');
        inner.textContent = char;
        inner.dataset.value = char;
        digitWrap.appendChild(inner);
        container.appendChild(digitWrap);
      } else {
        const staticChar = document.createElement('span');
        staticChar.classList.add('ticker__static');
        staticChar.textContent = char;
        container.appendChild(staticChar);
      }
    }
  }

  /* ── Live Bid Feed Simulator ── */
  var USERNAMES = [
    'racer_2847', 'automania_mx', 'speed_king99', 'turbo_lima',
    'collector_cdmx', 'drift_master', 'v8_fanatic', 'boost_junkie',
    'garage_pro', 'track_day_bro', 'clutch_hero', 'piston_head',
    'torque_talk', 'rpm_addict', 'carbon_fiber', 'dyno_queen',
  ];

  var AVATARS_COLORS = [
    '#0A4FE8', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
  ];

  var currentPrice = 89500;
  var bidCount = 23;
  var feedInterval = null;

  function initBidFeed(feedContainer, priceDisplay, bidCountDisplay) {
    if (!feedContainer) return;

    var userScrolled = false;

    feedContainer.addEventListener('scroll', function () {
      var atTop = feedContainer.scrollTop <= 10;
      userScrolled = !atTop;
    });

    function addBid() {
      var increment = [50, 100, 100, 100, 200, 250, 500][Math.floor(Math.random() * 7)];
      currentPrice += increment;
      bidCount++;

      var username = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
      var color = AVATARS_COLORS[Math.floor(Math.random() * AVATARS_COLORS.length)];
      var initials = username.slice(0, 2).toUpperCase();
      var isMine = Math.random() < 0.1;

      var item = document.createElement('div');
      item.classList.add('bid-feed__item', 'bid-feed__item--new');
      if (isMine) item.classList.add('bid-feed__item--mine');

      item.innerHTML =
        '<span class="avatar avatar--sm" style="background: ' + color + '20; color: ' + color + ';">' + (isMine ? 'TU' : initials) + '</span>' +
        '<span class="bid-feed__user">' + (isMine ? 'Tú' : username) + '</span>' +
        '<span class="bid-feed__amount mono">$' + currentPrice.toLocaleString('en-US') + '</span>' +
        '<span class="bid-feed__time">hace 0s</span>';

      feedContainer.insertBefore(item, feedContainer.firstChild);
      setTimeout(function () { item.classList.remove('bid-feed__item--new'); }, 1000);

      if (!userScrolled) {
        feedContainer.scrollTop = 0;
      }

      if (priceDisplay) {
        priceDisplay.textContent = '$' + currentPrice.toLocaleString('en-US');
      }

      if (bidCountDisplay) {
        bidCountDisplay.textContent = bidCount + ' pujas';
      }

      var nextDelay = 3000 + Math.random() * 5000;
      feedInterval = setTimeout(addBid, nextDelay);
    }

    feedInterval = setTimeout(addBid, 2000);
  }

  /* ── Nav sticky scroll effect ── */
  function initNavScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
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
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.site-header__nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('site-header__nav--open');

      var icon = toggle.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', expanded ? 'menu' : 'x');
        lucide.createIcons();
      }
    });
  }

  /* ── Cursor trail (hero section, desktop only) ── */
  function initCursorTrail() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    var hero = document.querySelector('.hero');
    if (!hero) return;

    var throttle = false;

    hero.addEventListener('mousemove', function (e) {
      if (throttle) return;
      throttle = true;
      setTimeout(function () { throttle = false; }, 50);

      var dot = document.createElement('div');
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
      }).onfinish = function () { dot.remove(); };
    });
  }

  /* ── Hero live price simulation ── */
  function initHeroLivePrice() {
    var priceEl = document.querySelector('[data-hero-price]');
    if (!priceEl) return;

    var price = parseInt(priceEl.dataset.heroPrice, 10) || 89500;

    function tick() {
      var increment = [50, 100, 100, 200, 250][Math.floor(Math.random() * 5)];
      price += increment;

      var formatted = '$' + price.toLocaleString('en-US');
      priceEl.style.color = 'var(--sigma-blue-glow)';
      priceEl.textContent = formatted;
      setTimeout(function () { priceEl.style.color = ''; }, 400);

      var nextDelay = 4000 + Math.random() * 6000;
      setTimeout(tick, nextDelay);
    }

    setTimeout(tick, 3000);
  }

  /* ── Bid button burst particles ── */
  function initBidButtons() {
    document.querySelectorAll('[data-bid-button]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.style.transform = 'scale(0.97)';
        setTimeout(function () { btn.style.transform = ''; }, 150);

        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;

        for (var i = 0; i < 12; i++) {
          var particle = document.createElement('div');
          var angle = (Math.PI * 2 / 12) * i;
          var distance = 50 + Math.random() * 40;
          var size = 3 + Math.random() * 4;

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
              transform: 'translate(' + Math.cos(angle) * distance + 'px, ' + Math.sin(angle) * distance + 'px) scale(0)',
              opacity: 0,
            },
          ], {
            duration: 450 + Math.random() * 200,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          }).onfinish = function () { particle.remove(); };
        }
      });
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    if (window.lucide) lucide.createIcons();

    initReveals();
    initCountdowns();
    initTickers();

    var feedContainer = document.querySelector('.bid-feed');
    var priceDisplay = document.querySelector('[data-live-price]');
    var bidCountDisplay = document.querySelector('[data-bid-count]');
    if (feedContainer) {
      initBidFeed(feedContainer, priceDisplay, bidCountDisplay);
    }

    initNavScroll();
    initMobileMenu();
    initCursorTrail();
    initHeroLivePrice();
    initBidButtons();
  });

})();
