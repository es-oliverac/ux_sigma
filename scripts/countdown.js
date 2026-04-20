/* ============================================================
   SIGMA AUTOS — Countdown Timer
   Flip-digit effect, color transitions based on time remaining.
   ============================================================ */

export function initCountdowns() {
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

    // Determine color based on total remaining seconds
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

    // Update digits with flip effect
    if (digits.length > 0) {
      updateDigits(digits, timeStr);
    } else {
      // Simple text update
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

/**
 * Create a countdown element from a duration in seconds.
 * Returns an element with digit spans for the flip effect.
 */
export function createCountdownElement(durationSeconds) {
  const endTime = Date.now() + durationSeconds * 1000;
  const container = document.createElement('div');
  container.classList.add('countdown', 'mono');
  container.dataset.countdown = endTime;

  // Create individual digit spans + separators
  const format = '00:00:00';
  for (let i = 0; i < format.length; i++) {
    if (format[i] === ':') {
      const sep = document.createElement('span');
      sep.classList.add('countdown__sep');
      sep.textContent = ':';
      container.appendChild(sep);
    } else {
      const digit = document.createElement('span');
      digit.classList.add('countdown__digit');
      digit.textContent = '0';
      container.appendChild(digit);
    }
  }

  return container;
}
