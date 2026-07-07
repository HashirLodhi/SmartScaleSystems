/* ── HOME PAGE SCROLL REVEAL ─────────────────────────── */
(function () {
  'use strict';
  var items = document.querySelectorAll('.reveal-on-scroll');
  if (!items.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    observer.observe(el);
  });
})();

/* ── SECTION HEADER REVEAL ───────────────────────────── */
(function () {
  'use strict';
  var items = document.querySelectorAll('[data-section-reveal]');
  if (!items.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  items.forEach(function (el) {
    observer.observe(el);
  });
})();

