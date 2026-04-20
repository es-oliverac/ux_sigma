/* ============================================================
   SIGMA AUTOS — Number Ticker
   Rolling digit animation for price changes.
   Each digit is a <span> with overflow:hidden, inner content
   slides vertically on change.
   ============================================================ */

export function initTickers() {
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

/**
 * Update a ticker element to a new value.
 * Only digits that change will animate.
 */
export function updateTicker(container, newValue) {
  const digits = container.querySelectorAll('.ticker__digit-inner');
  const newChars = newValue.replace(/[^0-9]/g, '').split('');

  // Pad if needed
  while (newChars.length < digits.length) {
    newChars.unshift('0');
  }

  digits.forEach((digit, i) => {
    const oldVal = digit.dataset.value;
    const newVal = newChars[i];

    if (oldVal !== newVal) {
      animateDigit(digit, newVal);
    }
  });
}

function animateDigit(digitInner, newValue) {
  const parent = digitInner.parentElement;

  // Create outgoing clone
  const outgoing = digitInner.cloneNode(true);
  outgoing.classList.add('ticker__digit-out');
  parent.appendChild(outgoing);

  // Update value
  digitInner.dataset.value = newValue;
  digitInner.textContent = newValue;
  digitInner.classList.add('ticker__digit-in');

  // Clean up after animation
  const duration = 300;

  outgoing.animate([
    { transform: 'translateY(0)', opacity: 1 },
    { transform: 'translateY(-100%)', opacity: 0 },
  ], { duration, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
    .onfinish = () => outgoing.remove();

  digitInner.animate([
    { transform: 'translateY(100%)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 },
  ], { duration, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });

  setTimeout(() => {
    digitInner.classList.remove('ticker__digit-in');
  }, duration);
}
