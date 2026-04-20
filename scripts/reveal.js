/* ============================================================
   SIGMA AUTOS — Scroll-triggered Reveals
   IntersectionObserver adds .is-visible to .reveal elements.
   Stagger children via CSS --i custom property.
   ============================================================ */

export function initReveals() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Make everything visible immediately
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Assign stagger index to children
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
