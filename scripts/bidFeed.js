/* ============================================================
   SIGMA AUTOS — Live Bid Feed Simulator
   Generates fake bids at random intervals (3-8s).
   Auto-scrolls unless user has scrolled manually.
   ============================================================ */

const USERNAMES = [
  'racer_2847', 'automania_mx', 'speed_king99', 'turbo_lima',
  'collector_cdmx', 'drift_master', 'v8_fanatic', 'boost_junkie',
  'garage_pro', 'track_day_bro', 'clutch_hero', 'piston_head',
  'torque_talk', 'rpm_addict', 'carbon_fiber', 'dyno_queen',
];

const AVATARS_COLORS = [
  '#0A4FE8', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

let currentPrice = 89500;
let bidCount = 23;
let feedInterval = null;

export function initBidFeed(feedContainer, priceDisplay, bidCountDisplay) {
  if (!feedContainer) return;

  let userScrolled = false;

  feedContainer.addEventListener('scroll', () => {
    const atTop = feedContainer.scrollTop <= 10;
    userScrolled = !atTop;
  });

  function addBid() {
    const increment = [50, 100, 100, 100, 200, 250, 500][Math.floor(Math.random() * 7)];
    currentPrice += increment;
    bidCount++;

    const username = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
    const color = AVATARS_COLORS[Math.floor(Math.random() * AVATARS_COLORS.length)];
    const initials = username.slice(0, 2).toUpperCase();
    const isMine = Math.random() < 0.1; // 10% chance it's "you"

    const item = document.createElement('div');
    item.classList.add('bid-feed__item', 'bid-feed__item--new');
    if (isMine) item.classList.add('bid-feed__item--mine');

    item.innerHTML = `
      <span class="avatar avatar--sm" style="background: ${color}20; color: ${color};">${isMine ? 'TU' : initials}</span>
      <span class="bid-feed__user">${isMine ? 'Tú' : username}</span>
      <span class="bid-feed__amount mono">$${currentPrice.toLocaleString('en-US')}</span>
      <span class="bid-feed__time">hace 0s</span>
    `;

    // Insert at top
    feedContainer.insertBefore(item, feedContainer.firstChild);

    // Remove --new class after animation
    setTimeout(() => item.classList.remove('bid-feed__item--new'), 1000);

    // Auto-scroll to top if user hasn't manually scrolled
    if (!userScrolled) {
      feedContainer.scrollTop = 0;
    }

    // Update price display
    if (priceDisplay) {
      priceDisplay.textContent = `$${currentPrice.toLocaleString('en-US')}`;
    }

    // Update bid count
    if (bidCountDisplay) {
      bidCountDisplay.textContent = `${bidCount} pujas`;
    }

    // Schedule next bid
    const nextDelay = 3000 + Math.random() * 5000;
    feedInterval = setTimeout(addBid, nextDelay);
  }

  // Start after 2s
  feedInterval = setTimeout(addBid, 2000);
}

export function stopBidFeed() {
  if (feedInterval) {
    clearTimeout(feedInterval);
    feedInterval = null;
  }
}

export function getCurrentPrice() {
  return currentPrice;
}
